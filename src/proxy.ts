import { NextRequest, NextResponse } from "next/server";

// Staff signup is intentionally NOT public — new accounts are created by an
// already-logged-in admin, not via open self-registration.
const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p)))
    return NextResponse.next();

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
