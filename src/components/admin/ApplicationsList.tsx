"use client";

import { cn } from "@/lib/utils";
import type { AdminAppStatus } from "@/lib/admin-sample-data";
import { AppStatusBadge } from "./ui";
import { ChevronDown, Download, Loader2, RefreshCw, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAdminFetch } from "@/hooks/useAdminFetch";
import { ADMIN_EVENTS } from "@/lib/admin-events";

interface AdminApplicationRow {
  id: string;
  given_name: string;
  surname: string;
  nationality: string;
  passport_number: string;
  visa_type_name: string;
  status: AdminAppStatus | "draft";
  created_at: string;
}

const STATUS_FILTERS: { value: AdminAppStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "reviewing", label: "Reviewing" },
  { value: "processing", label: "Processing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const DATE_RANGES = [
  { label: "All time", days: 0 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" });
}

function exportCSV(rows: AdminApplicationRow[]) {
  const header = ["App ID", "Applicant", "Nationality", "Visa Type", "Submitted", "Status", "Passport No."];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [r.id, `"${r.given_name} ${r.surname}"`, r.nationality, `"${r.visa_type_name}"`, formatDate(r.created_at), r.status, r.passport_number].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `visati-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function Dropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const active = options.find((o) => o.value === value);
  const isFiltered = value !== "";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-sans transition-colors whitespace-nowrap",
          isFiltered
            ? "border-gold bg-gold/5 text-gold font-semibold"
            : "border-line text-ink hover:bg-mist"
        )}
      >
        {isFiltered ? active?.label ?? label : label}
        {isFiltered ? (
          <X className="h-3.5 w-3.5" onClick={(e) => { e.stopPropagation(); onChange(""); setOpen(false); }} />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted" />
        )}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 min-w-[160px] bg-white rounded-xl border border-line shadow-lg py-1">
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value === value ? "" : o.value); setOpen(false); }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm font-sans hover:bg-mist transition-colors",
                o.value === value ? "text-gold font-semibold" : "text-ink"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const VALID_STATUS_FILTERS: (AdminAppStatus | "all")[] = ["all", "submitted", "reviewing", "processing", "approved", "rejected"];

export function ApplicationsList() {
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") ?? "";
  const urlStatusParam = searchParams.get("status");
  const urlStatus = VALID_STATUS_FILTERS.includes(urlStatusParam as AdminAppStatus | "all")
    ? (urlStatusParam as AdminAppStatus | "all")
    : "all";

  const { data, loading, refreshing, refetch } = useAdminFetch<{ applications: AdminApplicationRow[] }>(
    "/api/admin/applications",
    { changeEvent: ADMIN_EVENTS.applicationsChanged }
  );
  const applications = useMemo(
    () => (data?.applications ?? []).filter((a) => a.status !== "draft"),
    [data]
  );
  const [filter, setFilter] = useState<AdminAppStatus | "all">(urlStatus);
  const [q, setQ] = useState(urlQ);
  const [dateRange, setDateRange] = useState("");
  const [visaType, setVisaType] = useState("");
  const [syncedUrlQ, setSyncedUrlQ] = useState(urlQ);
  const [syncedUrlStatus, setSyncedUrlStatus] = useState(urlStatus);

  // Adjust local search state during render when the URL query param changes
  // (global search bar navigation) — avoids the extra render an effect-based
  // sync would cause.
  if (urlQ !== syncedUrlQ) {
    setSyncedUrlQ(urlQ);
    setQ(urlQ);
  }
  if (urlStatus !== syncedUrlStatus) {
    setSyncedUrlStatus(urlStatus);
    setFilter(urlStatus);
  }

  const visaOptions = useMemo(
    () => Array.from(new Set(applications.map((a) => a.visa_type_name))).map((v) => ({ label: v, value: v })),
    [applications]
  );
  const dateOptions = DATE_RANGES.map((d) => ({ label: d.label, value: String(d.days) }));

  const now = new Date();

  const rows = applications.filter((a) => {
    if (filter !== "all" && a.status !== filter) return false;

    if (q.trim()) {
      const s = q.toLowerCase();
      const name = `${a.given_name} ${a.surname}`.toLowerCase();
      if (
        !name.includes(s) &&
        !a.id.toLowerCase().includes(s) &&
        !a.passport_number.toLowerCase().includes(s) &&
        !a.nationality.toLowerCase().includes(s)
      )
        return false;
    }

    if (dateRange) {
      const days = Number(dateRange);
      const d = new Date(a.created_at);
      if (days > 0) {
        const cutoff = new Date(now);
        cutoff.setDate(now.getDate() - days);
        if (d < cutoff) return false;
      }
    }

    if (visaType && a.visa_type_name !== visaType) return false;

    return true;
  });

  const hasFilters = !!dateRange || !!visaType || filter !== "all" || !!q;

  function clearAll() {
    setFilter("all");
    setQ("");
    setDateRange("");
    setVisaType("");
  }

  if (loading) {
    return (
      <div className="px-4 lg:px-8 pb-10 flex items-center justify-center py-16 text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 pb-10">
      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-line p-3 mb-5 space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1">
          {STATUS_FILTERS.map((f) => {
            const count = f.value === "all" ? applications.length : applications.filter((a) => a.status === f.value).length;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-sans font-medium whitespace-nowrap transition-colors flex-shrink-0",
                  filter === f.value ? "bg-navy text-white" : "bg-mist text-muted hover:text-ink"
                )}
              >
                {f.label}
                <span className={cn("text-xs", filter === f.value ? "text-white/70" : "text-muted/70")}>· {count}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, ID, passport…"
              className="h-9 w-full lg:w-56 pl-9 pr-3 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
            />
          </div>
          <div className="hidden xl:flex items-center gap-2">
            <Dropdown label="Date Range" options={dateOptions} value={dateRange} onChange={setDateRange} />
            <Dropdown label="Visa Type" options={visaOptions} value={visaType} onChange={setVisaType} />
          </div>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs font-sans font-medium text-muted hover:text-ink whitespace-nowrap">
              Clear all
            </button>
          )}
          <button
            onClick={() => exportCSV(rows)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-line text-sm font-sans text-ink hover:bg-mist transition-colors flex-shrink-0"
          >
            Export <Download className="h-3.5 w-3.5 text-muted" />
          </button>
          <button
            onClick={refetch}
            disabled={refreshing}
            title="Refresh"
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-line text-ink hover:bg-mist transition-colors flex-shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white rounded-xl border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted font-sans border-b border-line">
              <th className="px-5 py-3 font-semibold">App ID</th>
              <th className="px-3 py-3 font-semibold">Applicant</th>
              <th className="px-3 py-3 font-semibold">Visa Type</th>
              <th className="px-3 py-3 font-semibold">Submitted</th>
              <th className="px-3 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((a) => (
              <tr key={a.id} className="hover:bg-mist transition-colors group">
                <td className="px-5 py-3.5">
                  <Link href={`/admin/applications/${a.id}`} className="font-mono text-xs text-muted group-hover:text-gold">{a.id}</Link>
                </td>
                <td className="px-3 py-3.5">
                  <Link href={`/admin/applications/${a.id}`} className="min-w-0 block">
                    <span className="font-sans font-medium text-ink truncate">{a.given_name} {a.surname}</span>
                    <p className="text-xs text-muted font-sans truncate">{a.nationality}</p>
                  </Link>
                </td>
                <td className="px-3 py-3.5 font-sans text-muted whitespace-nowrap">{a.visa_type_name}</td>
                <td className="px-3 py-3.5 font-sans text-muted whitespace-nowrap">{formatDate(a.created_at)}</td>
                <td className="px-3 py-3.5"><AppStatusBadge status={a.status as AdminAppStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-muted font-sans">No applications match your filters.</p>
            {hasFilters && (
              <button onClick={clearAll} className="mt-2 text-sm text-gold font-sans font-medium hover:underline">Clear filters</button>
            )}
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {rows.map((a) => (
          <Link key={a.id} href={`/admin/applications/${a.id}`} className="block bg-white rounded-xl border border-line p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-sans font-semibold text-ink truncate">{a.given_name} {a.surname}</p>
                <p className="font-mono text-xs text-muted mt-0.5">{a.id}</p>
              </div>
              <AppStatusBadge status={a.status as AdminAppStatus} />
            </div>
            <div className="flex items-center justify-between gap-2 mt-2">
              <span className="text-xs font-sans text-muted">{a.visa_type_name}</span>
              <span className="text-xs font-sans text-muted">Submitted {formatDate(a.created_at)}</span>
            </div>
          </Link>
        ))}
        {rows.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted font-sans">No applications match your filters.</p>
            {hasFilters && (
              <button onClick={clearAll} className="mt-2 text-sm text-gold font-sans font-medium hover:underline">Clear filters</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
