"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "./ui";
import { Ban, Loader2, RefreshCw, RotateCcw, Trash2, Check } from "lucide-react";
import { useState } from "react";
import { useAdminFetch } from "@/hooks/useAdminFetch";

type UserStatus = "pending" | "active" | "banned";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  createdAt: string;
}

const STATUS_LABEL: Record<UserStatus, string> = {
  active: "Active",
  pending: "Pending",
  banned: "Banned",
};

const statusStyle: Record<UserStatus, string> = {
  active: "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  banned: "bg-red-50 text-red-500",
};

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-sans", statusStyle[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function UsersManager() {
  const { data, loading, refreshing, refetch } = useAdminFetch<{ users: StaffUser[] }>("/api/admin/users");
  const users = data?.users ?? [];
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(id: string, status: UserStatus) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const resData = await res.json().catch(() => ({}));
        setError(resData.error ?? "Could not update user.");
        return;
      }
      await refetch();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const resData = await res.json().catch(() => ({}));
        setError(resData.error ?? "Could not remove user.");
        return;
      }
      await refetch();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  const counts = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    pending: users.filter((u) => u.status === "pending").length,
    banned: users.filter((u) => u.status === "banned").length,
  };

  const stats = [
    { label: "Team Members", value: counts.total },
    { label: "Active", value: counts.active },
    { label: "Pending Approval", value: counts.pending },
    { label: "Banned", value: counts.banned },
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
      {error && (
        <p className="mb-4 text-sm text-danger font-sans">{error}</p>
      )}

      <div className="flex justify-end mb-3">
        <button
          onClick={refetch}
          disabled={refreshing}
          title="Refresh"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-line text-sm font-sans text-ink hover:bg-mist transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-line p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted font-sans">{s.label}</p>
            <p className="font-display font-bold text-3xl text-navy mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="bg-white rounded-xl border border-line p-12 text-center text-sm text-muted font-sans">
          No staff accounts yet.
        </div>
      )}

      {users.length > 0 && (
        <>
          {/* Users table (desktop) */}
          <div className="hidden lg:block bg-white rounded-xl border border-line overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted font-sans border-b border-line">
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-3 py-3 font-semibold">Role</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Joined</th>
                  <th className="px-3 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-mist transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar initials={initialsFrom(u.name)} color="bg-mist-2" className="h-9 w-9 text-xs flex-shrink-0 !text-muted" />
                        <div className="min-w-0">
                          <p className="font-sans font-medium text-ink truncate">{u.name}</p>
                          <p className="text-xs text-muted font-sans truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 font-sans text-muted whitespace-nowrap capitalize">{u.role}</td>
                    <td className="px-3 py-3.5"><StatusBadge status={u.status} /></td>
                    <td className="px-3 py-3.5 font-sans text-muted whitespace-nowrap">{formatDate(u.createdAt)}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {busyId === u.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted" />
                        ) : (
                          <>
                            {u.status === "pending" && (
                              <>
                                <button onClick={() => setStatus(u.id, "active")} className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold font-sans hover:bg-emerald-100">
                                  <Check className="h-3.5 w-3.5" /> Approve
                                </button>
                                <button onClick={() => remove(u.id)} className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-line text-muted text-xs font-semibold font-sans hover:bg-mist">
                                  <Trash2 className="h-3.5 w-3.5" /> Reject
                                </button>
                              </>
                            )}
                            {u.status === "active" && (
                              <button onClick={() => setStatus(u.id, "banned")} className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-red-50 text-red-500 text-xs font-semibold font-sans hover:bg-red-100">
                                <Ban className="h-3.5 w-3.5" /> Ban
                              </button>
                            )}
                            {u.status === "banned" && (
                              <button onClick={() => setStatus(u.id, "active")} className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-line text-ink text-xs font-semibold font-sans hover:bg-mist">
                                <RotateCcw className="h-3.5 w-3.5" /> Unban
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Users cards (mobile) */}
          <div className="lg:hidden space-y-3">
            {users.map((u) => (
              <div key={u.id} className="bg-white rounded-xl border border-line p-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={initialsFrom(u.name)} color="bg-mist-2" className="h-10 w-10 text-xs flex-shrink-0 !text-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans font-semibold text-ink truncate">{u.name}</p>
                    <p className="text-xs text-muted font-sans truncate capitalize">{u.role} · {formatDate(u.createdAt)}</p>
                  </div>
                  <StatusBadge status={u.status} />
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {busyId === u.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted" />
                  ) : (
                    <>
                      {u.status === "pending" && (
                        <>
                          <button onClick={() => setStatus(u.id, "active")} className="h-8 px-3 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold font-sans">Approve</button>
                          <button onClick={() => remove(u.id)} className="h-8 px-3 rounded-lg border border-line text-muted text-xs font-semibold font-sans">Reject</button>
                        </>
                      )}
                      {u.status === "active" && (
                        <button onClick={() => setStatus(u.id, "banned")} className="h-8 px-3 rounded-lg bg-red-50 text-red-500 text-xs font-semibold font-sans">Ban</button>
                      )}
                      {u.status === "banned" && (
                        <button onClick={() => setStatus(u.id, "active")} className="h-8 px-3 rounded-lg border border-line text-ink text-xs font-semibold font-sans">Unban</button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
