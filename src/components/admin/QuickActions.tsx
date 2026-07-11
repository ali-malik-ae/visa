import { ArrowRight } from "lucide-react";
import Link from "next/link";

const ACTIONS = [
  { label: "Review pending queue", href: "/admin/applications?status=submitted" },
  { label: "Export applications", href: "/admin/applications" },
  { label: "Reply to inquiries", href: "/admin/inquiries" },
  { label: "Approve new staff", href: "/admin/users" },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-line p-5">
      <h3 className="font-display font-bold text-navy mb-3">Quick actions</h3>
      <div className="space-y-1">
        {ACTIONS.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-sans text-ink hover:bg-mist transition-colors text-left"
          >
            {a.label}
            <ArrowRight className="h-4 w-4 text-muted flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
