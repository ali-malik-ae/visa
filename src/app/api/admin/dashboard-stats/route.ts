import { db } from "@/lib/db";
import { applications, inquiries, statusHistory, user, visaTypes } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth-guard";
import { and, count, desc, eq, gte, inArray, ne } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    [{ value: totalApplications }],
    [{ value: pendingReview }],
    [{ value: approvedLast30 }],
    [{ value: rejectedLast30 }],
    [{ value: todayQueue }],
    [{ value: totalInquiries }],
    [{ value: pendingUsers }],
    [{ value: totalUsers }],
    recentApplications,
    recentActivity,
  ] = await Promise.all([
    db.select({ value: count() }).from(applications).where(ne(applications.status, "draft")),
    db.select({ value: count() }).from(applications).where(inArray(applications.status, ["submitted", "reviewing"])),
    db.select({ value: count() }).from(applications).where(and(eq(applications.status, "approved"), gte(applications.updated_at, thirtyDaysAgo))),
    db.select({ value: count() }).from(applications).where(and(eq(applications.status, "rejected"), gte(applications.updated_at, thirtyDaysAgo))),
    db.select({ value: count() }).from(applications).where(inArray(applications.status, ["submitted", "reviewing", "processing"])),
    db.select({ value: count() }).from(inquiries),
    db.select({ value: count() }).from(user).where(eq(user.status, "pending")),
    db.select({ value: count() }).from(user),
    db
      .select()
      .from(applications)
      .innerJoin(visaTypes, eq(applications.visa_type_id, visaTypes.id))
      .where(ne(applications.status, "draft"))
      .orderBy(desc(applications.created_at))
      .limit(5),
    db
      .select({
        id: statusHistory.id,
        status: statusHistory.status,
        note: statusHistory.note,
        created_at: statusHistory.created_at,
        application_id: statusHistory.application_id,
        given_name: applications.given_name,
        surname: applications.surname,
      })
      .from(statusHistory)
      .innerJoin(applications, eq(statusHistory.application_id, applications.id))
      .orderBy(desc(statusHistory.created_at))
      .limit(8),
  ]);

  return NextResponse.json({
    totalApplications,
    pendingReview,
    approvedLast30,
    rejectedLast30,
    todayQueue,
    totalInquiries,
    pendingUsers,
    totalUsers,
    recentApplications: recentApplications.map((r) => ({
      ...r.applications,
      visa_type_name: r.visa_types.name,
    })),
    recentActivity: recentActivity.map((r) => ({
      id: r.id,
      status: r.status,
      note: r.note,
      created_at: r.created_at.toISOString(),
      application_id: r.application_id,
      applicant_name: `${r.given_name} ${r.surname}`,
    })),
  });
}
