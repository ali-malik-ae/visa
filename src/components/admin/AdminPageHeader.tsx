"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar } from "./ui";
import { signOutAndRedirect } from "@/lib/admin-auth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAvatar } from "@/hooks/useAvatar";
import { Bell, Search, User, Settings, LogOut, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  subtitle,
  searchPlaceholder = "Search applications, clients…",
  action,
}: AdminPageHeaderProps) {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const { src: localAvatarSrc } = useAvatar();
  // Fall back to the account's synced photo (session) when this browser has
  // no local copy yet — makes the avatar follow the user across devices.
  const avatarSrc = localAvatarSrc ?? currentUser.image;
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    if (/^VIS-/i.test(term)) {
      router.push(`/admin/applications?q=${encodeURIComponent(term)}`);
    } else if (/@/.test(term)) {
      router.push(`/admin/inquiries?q=${encodeURIComponent(term)}`);
    } else {
      router.push(`/admin/applications?q=${encodeURIComponent(term)}`);
    }
    setQ("");
  }

  async function handleLogout() {
    setLoggingOut(true);
    await signOutAndRedirect();
  }

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden bg-navy px-4 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display font-bold text-xl text-white truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-white/60 font-sans mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="h-9 w-9 grid place-items-center rounded-lg bg-white/10 text-white">
              <Bell className="h-4 w-4" />
            </button>
            <div ref={ref} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center cursor-pointer"
              >
                <Avatar initials={currentUser.initials} src={avatarSrc} className="h-9 w-9 text-xs" />
              </button>
              {open && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-line overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-line">
                    <p className="text-sm font-semibold text-navy font-sans truncate">{currentUser.name}</p>
                    <p className="text-xs text-muted font-sans truncate mt-0.5">{currentUser.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/admin/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-ink hover:bg-mist transition-colors">
                      <User className="h-4 w-4 text-muted" />
                      Profile & Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                      {loggingOut ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex items-center justify-between gap-6 px-8 pt-7 pb-5">
        <div className="min-w-0">
          <h1 className="font-display font-bold text-2xl text-navy truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted font-sans mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-72 pl-9 pr-3 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
            />
          </form>

          {/* Profile dropdown */}
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className={cn(
                "flex items-center gap-2 h-9 px-2 rounded-lg transition-colors cursor-pointer",
                open ? "bg-mist" : "hover:bg-mist"
              )}
            >
              <Avatar initials={currentUser.initials} src={avatarSrc} className="h-7 w-7 text-[11px]" />
              <ChevronDown className={cn("h-3.5 w-3.5 text-muted transition-transform", open && "rotate-180")} />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-line overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-line">
                  <p className="text-sm font-semibold text-navy font-sans truncate">{currentUser.name}</p>
                  <p className="text-xs text-muted font-sans truncate mt-0.5">{currentUser.email}</p>
                </div>
                <div className="py-1">
                  <Link href="/admin/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-ink hover:bg-mist transition-colors">
                    <User className="h-4 w-4 text-muted" />
                    Profile & Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                    {loggingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {action}
        </div>
      </div>
    </>
  );
}
