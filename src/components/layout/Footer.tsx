import { BRAND, CONTACT, SOCIAL, WHATSAPP_URL } from "@/lib/constants";
import { Logo } from "../ui/Logo";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const FOOTER_LINKS = {
  Visas: [
    { label: "Tourist 30-day", href: "/visa-types" },
    { label: "Tourist 60-day", href: "/visa-types" },
    { label: "Multi-Entry", href: "/visa-types" },
    { label: "Business", href: "/visa-types" },
    { label: "Transit", href: "/visa-types" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/contact" },
    { label: "Press", href: "/contact" },
    { label: "Partners", href: "/contact" },
    { label: "Blog", href: "/" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "WhatsApp", href: WHATSAPP_URL },
    { label: "Refund Policy", href: "/faq" },
    { label: "Terms", href: "/terms" },
  ],
};

const SOCIAL_ICONS = [
  { key: "facebook", Icon: Facebook, url: SOCIAL.facebook },
  { key: "instagram", Icon: Instagram, url: SOCIAL.instagram },
  { key: "twitter", Icon: Twitter, url: SOCIAL.twitter },
  { key: "linkedin", Icon: Linkedin, url: SOCIAL.linkedin },
];

function scrollToTop(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* Main footer grid: brand(2) + Visas + Company + Support + Contact(2) = 7 cols */}
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Logo variant="light" />
            <p className="mt-4 text-sm text-white/55 font-sans leading-relaxed max-w-xs">
              {BRAND.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_ICONS.map(({ key, Icon, url }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="h-9 w-9 grid place-items-center rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* 3 menu link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="min-w-0">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 font-sans mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={scrollToTop}
                      className="text-sm text-white/60 hover:text-white font-sans transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact info column — wider */}
          <div className="min-w-0 col-span-2 lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 font-sans mb-4">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-blue flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/60 font-sans leading-snug whitespace-pre-line">
                  {CONTACT.office}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 text-blue flex-shrink-0" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm text-white/60 hover:text-white font-sans transition-colors break-all"
                >
                  {CONTACT.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 text-blue flex-shrink-0" />
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="text-sm text-white/60 hover:text-white font-sans transition-colors"
                >
                  {CONTACT.phone}
                </a>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-whatsapp font-sans transition-colors"
              >
                <FaWhatsapp className="h-3.5 w-3.5 flex-shrink-0" />
                WhatsApp (24/7)
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/40 font-sans">
            &copy; {new Date().getFullYear()} {BRAND.legalName} &middot;{" "}
            {BRAND.location} &middot; Trade Licence {CONTACT.tradeLicence}
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/privacy"
              onClick={scrollToTop}
              className="text-xs text-white/40 hover:text-white font-sans transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              onClick={scrollToTop}
              className="text-xs text-white/40 hover:text-white font-sans transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              onClick={scrollToTop}
              className="text-xs text-white/40 hover:text-white font-sans transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
