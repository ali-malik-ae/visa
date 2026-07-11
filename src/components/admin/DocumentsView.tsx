"use client";

import { cn } from "@/lib/utils";
import { Download, FileText, LayoutGrid, List, Loader2, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdminFetch } from "@/hooks/useAdminFetch";

interface AdminDocument {
  id: number;
  document_type: string;
  filename: string;
  size_bytes: number;
  uploaded_at: string;
  application_id: string;
  applicant: string;
  signed_url: string;
}

const FILTERS = [
  { value: "all", label: "All" },
  { value: "passport", label: "Passport" },
  { value: "supporting", label: "Supporting" },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentsView() {
  const { data, loading, refreshing, refetch } = useAdminFetch<{ documents: AdminDocument[] }>("/api/admin/documents");
  const allDocs = useMemo(() => data?.documents ?? [], [data]);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"grid" | "list">("list");
  const [applicant, setApplicant] = useState("all");
  const [q, setQ] = useState("");

  const applicants = useMemo(
    () => Array.from(new Set(allDocs.map((d) => d.applicant))).sort(),
    [allDocs]
  );

  const docs = allDocs.filter((d) => {
    if (filter !== "all" && d.document_type !== filter) return false;
    if (applicant !== "all" && d.applicant !== applicant) return false;
    if (q.trim()) {
      const s = q.toLowerCase();
      return d.filename.toLowerCase().includes(s) || d.applicant.toLowerCase().includes(s);
    }
    return true;
  });

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
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-sans font-medium whitespace-nowrap transition-colors flex-shrink-0",
                  filter === f.value ? "bg-navy text-white" : "bg-white border border-line text-muted hover:text-ink"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1 bg-white border border-line rounded-lg p-1">
              <button onClick={() => setView("grid")} className={cn("h-7 px-2.5 rounded inline-flex items-center gap-1.5 text-xs font-sans font-medium", view === "grid" ? "bg-mist text-navy" : "text-muted")}>
                <LayoutGrid className="h-3.5 w-3.5" /> Grid
              </button>
              <button onClick={() => setView("list")} className={cn("h-7 px-2.5 rounded inline-flex items-center gap-1.5 text-xs font-sans font-medium", view === "list" ? "bg-mist text-navy" : "text-muted")}>
                <List className="h-3.5 w-3.5" /> List
              </button>
            </div>
            <button
              onClick={refetch}
              disabled={refreshing}
              title="Refresh"
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-line text-ink hover:bg-mist transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Search + applicant (user) filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search documents…"
              className="h-9 w-full pl-9 pr-3 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
            />
          </div>
          <select
            value={applicant}
            onChange={(e) => setApplicant(e.target.value)}
            className="h-9 px-3 rounded-lg border border-line bg-white text-sm font-sans text-navy focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
          >
            <option value="all">All clients</option>
            {applicants.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {docs.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted font-sans">
          {allDocs.length === 0
            ? "No documents uploaded yet. Documents are uploaded from within an application's detail page."
            : "No documents match."}
        </p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {docs.map((d) => (
            <Link key={d.id} href={`/admin/applications/${d.application_id}`} className="bg-white rounded-xl border border-line overflow-hidden hover:border-gold transition-colors">
              <div className="aspect-[4/3] bg-mist grid place-items-center">
                <FileText className="h-8 w-8 text-line" />
              </div>
              <div className="p-3.5">
                <p className="text-sm font-sans font-medium text-ink truncate">{d.filename}</p>
                <p className="text-xs text-muted font-sans truncate">{d.applicant}</p>
                <div className="flex items-center justify-between gap-2 mt-2.5">
                  <span className="text-xs font-sans text-muted capitalize">{d.document_type}</span>
                  <span className="text-xs text-muted font-sans">{formatSize(d.size_bytes)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-line overflow-hidden divide-y divide-line">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center gap-3 px-4 py-3">
              <Link href={`/admin/applications/${d.application_id}`} className="flex items-center gap-3 min-w-0 flex-1">
                <span className="h-9 w-9 rounded-lg bg-mist grid place-items-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-muted" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-sans font-medium text-ink truncate">{d.filename}</p>
                  <p className="text-xs text-muted font-sans truncate">{d.applicant} · {formatSize(d.size_bytes)}</p>
                </div>
              </Link>
              <a
                href={d.signed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-sans font-medium text-gold hover:underline flex-shrink-0 hidden sm:flex"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
