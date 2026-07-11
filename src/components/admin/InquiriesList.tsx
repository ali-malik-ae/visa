"use client";

import { cn } from "@/lib/utils";
import { Avatar, InquiryBadge } from "./ui";
import type { InquiryStatus } from "@/lib/admin-sample-data";
import { Loader2, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAdminFetch } from "@/hooks/useAdminFetch";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  resolved: boolean;
  created_at: string;
}

type Filter = "all" | "new" | "closed";

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function InquiriesList() {
  const { data, loading, refreshing, refetch } = useAdminFetch<{ inquiries: Inquiry[] }>("/api/admin/inquiries");
  const inquiries = data?.inquiries ?? [];
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const rows = inquiries.filter((i) => {
    const status: InquiryStatus = i.resolved ? "closed" : "new";
    if (filter !== "all" && status !== filter) return false;
    if (q.trim()) {
      const s = q.toLowerCase();
      return (
        i.name.toLowerCase().includes(s) ||
        i.email.toLowerCase().includes(s) ||
        i.subject.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const filters: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All", count: inquiries.length },
    { value: "new", label: "New", count: inquiries.filter((i) => !i.resolved).length },
    { value: "closed", label: "Closed", count: inquiries.filter((i) => i.resolved).length },
  ];

  if (loading) {
    return (
      <div className="px-4 lg:px-8 pb-10 flex items-center justify-center py-16 text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 pb-10">
      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-sans font-medium whitespace-nowrap transition-colors flex-shrink-0",
                filter === f.value ? "bg-navy text-white" : "bg-white border border-line text-muted hover:text-ink"
              )}
            >
              {f.label}
              <span className={filter === f.value ? "text-white/70 text-xs" : "text-muted/70 text-xs"}>· {f.count}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search inquiries…"
              className="h-9 w-full sm:w-64 pl-9 pr-3 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
            />
          </div>
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

      {/* List */}
      <div className="bg-white rounded-xl border border-line overflow-hidden divide-y divide-line">
        {rows.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-muted font-sans">No inquiries match.</p>
        )}
        {rows.map((inq) => (
          <Link
            key={inq.id}
            href={`/admin/inquiries/${inq.id}`}
            className="flex items-center gap-3 lg:gap-4 px-4 lg:px-5 py-4 hover:bg-mist transition-colors"
          >
            <Avatar initials={initialsFrom(inq.name)} color="bg-mist-2" className="h-10 w-10 text-xs flex-shrink-0 !text-muted" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <p className="font-sans font-semibold text-ink truncate">{inq.name}</p>
                <span className="text-xs font-sans text-muted truncate hidden sm:inline">{inq.email}</span>
              </div>
              <p className="text-sm font-sans text-muted truncate">{inq.subject}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs font-sans text-muted hidden md:inline whitespace-nowrap">{timeAgo(inq.created_at)}</span>
              <InquiryBadge status={inq.resolved ? "closed" : "new"} />
              <span className="h-8 px-3.5 rounded-lg border border-line text-sm font-sans font-medium text-ink hover:bg-mist transition-colors hidden sm:flex items-center">
                Open
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
