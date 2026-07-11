import { AuthShell } from "@/components/admin/AuthShell";
import { SignupForm } from "@/components/admin/SignupForm";
import { requireAdminRole } from "@/lib/admin-guard";
import Link from "next/link";

export const metadata = { title: "Create account" };

export default async function AdminSignupPage() {
  // Staff accounts are created by an already-logged-in Administrator, not via
  // open self-registration — the middleware requires a session to reach this
  // page at all; this adds the role check on top.
  await requireAdminRole();

  return (
    <AuthShell
      eyebrow="Join the team"
      heading={"Built for visa\nexperts, by visa\nexperts."}
      blurb="Your account is verified by your manager. Use your @visati.ae work email to register and get instant access to the dashboard."
      bullets={[
        "Access all applications from one place",
        "Real-time status & document tracking",
        "Team collaboration & assignment tools",
      ]}
      mobileTitle="Visati Admin"
      mobileSubtitle="Create your staff account"
      formTitle="Create your account"
      formSubtitle="Use your @visati.ae work email to register."
    >
      <SignupForm />
      <p className="mt-6 text-center text-sm font-sans text-muted">
        Already have an account?{" "}
        <Link href="/admin/login" className="font-semibold text-blue hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
