"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "./ui";
import { signOutAndRedirect } from "@/lib/admin-auth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAvatar } from "@/hooks/useAvatar";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  FolderOpen,
  Users,
  ShieldCheck,
  Settings,
  PenLine,
  LogOut,
  User,
  ChevronUp,
  Loader2,
} from "lucide-react";

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, count: null, adminOnly: false },
  { href: "/admin/applications", label: "Applications", icon: FileText, exact: false, count: 142, adminOnly: false },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare, exact: false, count: 38, adminOnly: false },
  { href: "/admin/documents", label: "Documents", icon: FolderOpen, exact: false, count: null, adminOnly: false },
  { href: "/admin/clients", label: "Clients", icon: Users, exact: false, count: null, adminOnly: false },
  { href: "/admin/users", label: "Users", icon: ShieldCheck, exact: false, count: 2, adminOnly: true },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false, count: null, adminOnly: false },
  { href: "/dashboard/cms", label: "CMS Studio", icon: PenLine, exact: false, count: null, adminOnly: true, external: true },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  const { src: avatarSrc } = useAvatar();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isAdmin = currentUser.isAdmin;

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

  async function handleLogout() {
    setLoggingOut(true);
    await signOutAndRedirect();
  }

  return (
    <aside className="hidden lg:flex w-60 flex-shrink-0 flex-col bg-navy min-h-screen sticky top-0">
      {/* Brand */}
      <div className="px-6 py-6">
        <Logo variant="light" showTagline />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40 font-sans">
          Workspace
        </p>
        <div className="space-y-1">
          {ADMIN_NAV.filter((item) => !item.adminOnly || isAdmin).map(({ href, label, icon: Icon, exact, count, external }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
            return (
              <Link
                key={href}
                href={href}
                {...linkProps}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans font-medium transition-colors",
                  active
                    ? "bg-gold/15 text-gold shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="truncate flex-1">{label}</span>
                {count != null && (
                  <span
                    className={cn(
                      "text-[11px] font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center",
                      active ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
                    )}
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile Dropdown */}
      <div ref={ref} className="relative p-3 m-3 mb-4">
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl p-2 transition-colors cursor-pointer",
            open ? "bg-white/10" : "bg-white/5 hover:bg-white/8"
          )}
        >
          <Avatar initials={currentUser.initials} src={avatarSrc} className="h-9 w-9 text-xs flex-shrink-0" />
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-sans font-semibold text-white truncate">
              {currentUser.name}
            </p>
            <p className="text-xs font-sans text-white/50 truncate">{currentUser.role}</p>
          </div>
          <ChevronUp
            className={cn(
              "h-4 w-4 text-white/40 transition-transform",
              open ? "rotate-0" : "rotate-180"
            )}
          />
        </button>

        {open && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-line overflow-hidden z-50">
            {/* User info header */}
            <div className="px-4 py-3 border-b border-line">
              <p className="text-sm font-semibold text-navy font-sans truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-muted font-sans truncate mt-0.5">
                {currentUser.email}
              </p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link
                href="/admin/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-ink hover:bg-mist transition-colors"
              >
                <User className="h-4 w-4 text-muted" />
                Profile & Settings
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                {loggingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
