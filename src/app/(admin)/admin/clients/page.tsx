import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Avatar, AppStatusBadge } from "@/components/admin/ui";
import type { AdminAppStatus } from "@/lib/admin-sample-data";
import { db } from "@/lib/db";
import { applications, visaTypes } from "@/lib/db/schema";
import { desc, eq, ne } from "drizzle-orm";
import Link from "next/link";

export const metadata = { title: "Clients" };

export default async function AdminClientsPage() {
  const rows = await db
    .select()
    .from(applications)
    .innerJoin(visaTypes, eq(applications.visa_type_id, visaTypes.id))
    .where(ne(applications.status, "draft"))
    .orderBy(desc(applications.created_at));

  // Group by applicant email (falls back to name+nationality when no email
  // was captured) — there's no separate "clients" table, a client is
  // whoever the applications belong to.
  const byKey = new Map<
    string,
    { name: string; email: string | null; nationality: string; visaTypeName: string; status: string; appCount: number; latestAppId: string }
  >();

  for (const r of rows) {
    const app = r.applications;
    const key = app.applicant_email ?? `${app.given_name} ${app.surname} ${app.nationality}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.appCount += 1;
    } else {
      byKey.set(key, {
        name: `${app.given_name} ${app.surname}`,
        email: app.applicant_email,
        nationality: app.nationality,
        visaTypeName: r.visa_types.name,
        status: app.status,
        appCount: 1,
        latestAppId: app.id,
      });
    }
  }

  const clients = Array.from(byKey.values());

  return (
    <>
      <AdminPageHeader
        title="Clients"
        subtitle={`${clients.length} client${clients.length === 1 ? "" : "s"}`}
        searchPlaceholder="Search clients…"
      />
      <div className="px-4 lg:px-8 pb-10">
        <div className="bg-white rounded-xl border border-line overflow-hidden">
          {clients.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted font-sans">No clients yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted font-sans border-b border-line">
                    <th className="px-5 py-3 font-semibold">Client</th>
                    <th className="px-5 py-3 font-semibold hidden sm:table-cell">Email</th>
                    <th className="px-5 py-3 font-semibold hidden sm:table-cell">Nationality</th>
                    <th className="px-5 py-3 font-semibold">Latest Visa</th>
                    <th className="px-5 py-3 font-semibold">Applications</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {clients.map((c) => (
                    <tr key={c.latestAppId} className="hover:bg-mist transition-colors">
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/applications/${c.latestAppId}`} className="flex items-center gap-3 min-w-0">
                          <Avatar
                            initials={c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                            className="h-9 w-9 text-xs flex-shrink-0"
                          />
                          <span className="font-sans font-medium text-ink truncate">{c.name}</span>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 font-sans text-muted hidden sm:table-cell truncate">{c.email ?? "—"}</td>
                      <td className="px-5 py-3.5 hidden sm:table-cell font-sans text-ink">{c.nationality}</td>
                      <td className="px-5 py-3.5 font-sans text-muted whitespace-nowrap">{c.visaTypeName}</td>
                      <td className="px-5 py-3.5 font-sans text-ink">{c.appCount}</td>
                      <td className="px-5 py-3.5"><AppStatusBadge status={c.status as AdminAppStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
