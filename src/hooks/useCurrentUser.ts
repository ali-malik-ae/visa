"use client";

import { authClient } from "@/lib/auth-client";

function initialsFrom(label: string): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join("") || "?";
}

/** Returns the real logged-in user's profile from the BetterAuth session. */
export function useCurrentUser() {
  const { data } = authClient.useSession();
  const user = data?.user as { name?: string; email?: string; role?: string } | undefined;

  const isAdmin = user?.role === "admin";
  const name = user?.name ?? "";
  const email = user?.email ?? "";

  return {
    name,
    email,
    isAdmin,
    role: isAdmin ? "Administrator" : "Consultant",
    initials: initialsFrom(name || email),
  };
}
