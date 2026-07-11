/**
 * Staff use @visati.ae; the client's account uses their own business email —
 * allowed via NEXT_PUBLIC_ADMIN_EMAIL since it's not on the visati.ae domain.
 * Client-safe (no secrets) — used by signup and forgot-password forms.
 */
export function isAuthorizedStaffEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();
  return /^[^\s@]+@visati\.ae$/i.test(trimmed) || trimmed === adminEmail;
}
