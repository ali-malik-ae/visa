"use client";

import { useCallback, useEffect, useState } from "react";

const DEFAULT_POLL_MS = 30000;

/**
 * Fetches an admin API endpoint once on mount, then keeps it fresh via
 * background polling plus an on-demand refetch() (wired to a visible
 * refresh button) and optional custom "changed" events dispatched by
 * mutation flows elsewhere on the page (e.g. after creating a record).
 */
export function useAdminFetch<T>(url: string, options?: { pollMs?: number; changeEvent?: string }) {
  const pollMs = options?.pollMs ?? DEFAULT_POLL_MS;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (fetchUrl: string, isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch(fetchUrl);
      const json = await res.json();
      setData(json);
    } catch {
      // Keep showing the last known-good data on a failed background refresh.
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Fetching on mount/interval is the intended behavior here (there's no
    // server-rendered alternative for client-side polling) — the
    // set-state-in-effect rule is about accidental prop-sync, not this.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData(url, false);
    const interval = setInterval(() => fetchData(url, false), pollMs);
    return () => clearInterval(interval);
  }, [url, pollMs, fetchData]);

  useEffect(() => {
    if (!options?.changeEvent) return;
    const eventName = options.changeEvent;
    const handler = () => fetchData(url, true);
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [options?.changeEvent, url, fetchData]);

  return { data, loading, refreshing, refetch: () => fetchData(url, true) };
}
