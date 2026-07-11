"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AppStatusBadge } from "@/components/admin/ui";
import { NewApplicationButton } from "@/components/admin/NewApplicationButton";
import { QuickActions } from "@/components/admin/QuickActions";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAdminFetch } from "@/hooks/useAdminFetch";
import { ADMIN_EVENTS } from "@/lib/admin-events";
import type { AdminAppStatus } from "@/lib/admin-sample-data";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";

interface DashboardApplication {
  id: string;
  given_name: string;
  surname: string;
  nationality: string;
  visa_type_name: string;
  status: AdminAppStatus;
  created_at: string;
}

interface DashboardActivity {
  id: number;
  status: string;
  note: string | null;
  created_at: string;
  application_id: string;
  applicant_name: string;
}

interface DashboardStats {
  totalApplications: number;
  pendingReview: number;
  approvedLast30: number;
  rejectedLast30: number;
  todayQueue: number;
  recentApplications: DashboardApplication[];
  recentActivity: DashboardActivity[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AE", { day: "numeric", month: "short" });
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

export default function AdminDashboard() {
  const currentUser = useCurrentUser();
  const { data: stats, loading, refreshing, refetch } = useAdminFetch<DashboardStats>(
    "/api/admin/dashboard-stats",
    { changeEvent: ADMIN_EVENTS.applicationsChanged }
  );
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const statCards = stats
    ? [
        { label: "Total Applications", value: stats.totalApplications },
        { label: "Pending Review", value: stats.pendingReview },
        { label: "Approved (30d)", value: stats.approvedLast30 },
        { label: "Rejected (30d)", value: stats.rejectedLast30 },
      ]
    : [];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        subtitle={`${today} · Good afternoon, ${currentUser.name.split(" ")[0]}`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={refetch}
              disabled={refreshing}
              title="Refresh"
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-line text-ink hover:bg-mist transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </button>
            <NewApplicationButton />
          </div>
        }
      />

      <div className="px-4 lg:px-8 pb-10 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <>
            {/* Mobile: Today's queue first */}
            <div className="lg:hidden rounded-xl bg-navy p-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                Today&apos;s Queue
              </p>
              <div className="flex items-end justify-between gap-4 mt-1">
                <div>
                  <p className="font-display font-bold text-4xl">{stats?.todayQueue ?? 0}</p>
                  <p className="text-xs text-white/60 mt-1">Applications awaiting your action</p>
                </div>
                <Link
                  href="/admin/applications"
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold whitespace-nowrap hover:opacity-90 transition-opacity"
                >
                  Open Queue <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-line p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted font-sans">
                    {s.label}
                  </p>
                  <p className="font-display font-bold text-3xl lg:text-4xl text-navy mt-2">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent applications */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-line overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-line">
                  <div>
                    <h2 className="font-display font-bold text-navy">Recent Applications</h2>
                    <p className="text-xs text-muted font-sans">Latest submitted</p>
                  </div>
                  <Link
                    href="/admin/applications"
                    className="inline-flex items-center gap-1 text-sm text-gold font-sans font-medium hover:underline"
                  >
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wider text-muted font-sans">
                        <th className="px-5 py-3 font-semibold">App ID</th>
                        <th className="px-5 py-3 font-semibold">Applicant</th>
                        <th className="px-5 py-3 font-semibold hidden sm:table-cell">Visa Type</th>
                        <th className="px-5 py-3 font-semibold hidden sm:table-cell">Date</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {(stats?.recentApplications ?? []).map((a) => (
                        <tr key={a.id} className="hover:bg-mist transition-colors">
                          <td className="px-5 py-3.5">
                            <Link href={`/admin/applications/${a.id}`} className="font-mono text-xs text-muted hover:text-gold">
                              {a.id}
                            </Link>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="min-w-0">
                              <span className="font-sans font-medium text-ink truncate">{a.given_name} {a.surname}</span>
                              <p className="text-xs text-muted font-sans truncate">{a.nationality}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-sans text-muted hidden sm:table-cell whitespace-nowrap">{a.visa_type_name}</td>
                          <td className="px-5 py-3.5 font-sans text-muted hidden sm:table-cell whitespace-nowrap">{formatDate(a.created_at)}</td>
                          <td className="px-5 py-3.5"><AppStatusBadge status={a.status} /></td>
                        </tr>
                      ))}
                      {(stats?.recentApplications ?? []).length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted font-sans">
                            No applications yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right rail */}
              <div className="space-y-6">
                {/* Today's queue (desktop) */}
                <div className="hidden lg:block rounded-xl bg-navy p-6 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                    Today&apos;s Queue
                  </p>
                  <p className="font-display font-bold text-5xl mt-2">{stats?.todayQueue ?? 0}</p>
                  <p className="text-sm text-white/60 mt-1">Applications awaiting your action</p>
                  <Link
                    href="/admin/applications"
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Open Queue <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Quick actions */}
                <QuickActions />

                {/* Recent activity */}
                <div className="bg-white rounded-xl border border-line p-5">
                  <h3 className="font-display font-bold text-navy mb-3">Recent activity</h3>
                  {(stats?.recentActivity ?? []).length === 0 ? (
                    <p className="text-sm text-muted font-sans">No activity yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {(stats?.recentActivity ?? []).map((a) => (
                        <li key={a.id} className="flex items-center gap-3 text-sm">
                          <span className="h-2 w-2 rounded-full flex-shrink-0 bg-gold" />
                          <span className="font-sans text-ink flex-1 min-w-0 truncate">
                            {a.applicant_name} · {a.note ?? a.status}
                          </span>
                          <span className="font-sans text-xs text-muted flex-shrink-0">{timeAgo(a.created_at)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
