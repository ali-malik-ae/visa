"use client";

import { useAdminFetch } from "./useAdminFetch";
import { ADMIN_EVENTS } from "@/lib/admin-events";

interface DashboardStatsResponse {
  totalApplications: number;
  totalInquiries: number;
  totalUsers: number;
  pendingUsers: number;
}

interface NavCounts {
  applications: number | null;
  inquiries: number | null;
  users: number | null;
  pendingUsers: number;
}

/** Real sidebar badge counts — polled in the background so they stay fresh. */
export function useNavCounts(): NavCounts {
  const { data } = useAdminFetch<DashboardStatsResponse>("/api/admin/dashboard-stats", {
    changeEvent: ADMIN_EVENTS.applicationsChanged,
  });

  return {
    applications: data?.totalApplications ?? null,
    inquiries: data?.totalInquiries ?? null,
    users: data?.totalUsers ?? null,
    pendingUsers: data?.pendingUsers ?? 0,
  };
}
