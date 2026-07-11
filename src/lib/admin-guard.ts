import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server-side session guard for admin routes. Validates the session token
 * against the database — redirects to login if missing or invalid.
 */
export async function requireAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    redirect("/admin/login");
  }

  try {
    const session = await auth.api.getSession({
      headers: new Headers({
        cookie: `better-auth.session_token=${sessionToken}`,
      }),
    });

    if (!session) {
      redirect("/admin/login");
    }

    return session;
  } catch {
    // Session validation failed — treat as unauthenticated
    redirect("/admin/login");
  }
}

/**
 * Server-side guard that requires the user to have the "admin" role.
 */
export async function requireAdminRole() {
  const session = await requireAdminSession();

  const role = (session?.user as Record<string, unknown> | undefined)?.role;
  if (role !== "admin") {
    redirect("/admin");
  }

  return session;
}
