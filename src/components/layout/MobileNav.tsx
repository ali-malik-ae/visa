"use client";

import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/constants";
import { ArrowRight, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { useEffect } from "react";
import { Logo } from "../ui/Logo";

interface MobileNavProps {
  links: { label: string; href: string }[];
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ links, open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 bg-navy shadow-2xl transition-transform duration-300 lg:hidden flex flex-col",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 flex-shrink-0">
          <Logo variant="light" />
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-4 gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="py-3 text-base font-sans font-medium text-white/80 hover:text-white border-b border-white/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 pb-6 space-y-3 flex-shrink-0 mt-auto">
          <Link href="/apply" onClick={onClose}>
            <button className="w-full h-12 rounded-xl bg-gradient-to-r from-gold to-[#F0C864] text-navy font-semibold font-sans text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              Apply Now
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </button>
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-whatsapp text-white font-semibold font-sans text-sm flex items-center justify-center gap-2 hover:bg-whatsapp-hover transition-colors"
          >
            <FaWhatsapp className="h-4 w-4 flex-shrink-0" />
            WhatsApp Us
          </a>
          <div className="pt-4 border-t border-white/10">
            <p className="text-[11px] text-white/30 font-sans leading-relaxed">
              &copy; {new Date().getFullYear()} Visati Visa Services LLC &middot; Dubai, UAE
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
