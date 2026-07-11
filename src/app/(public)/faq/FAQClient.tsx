"use client";

import { useState, useMemo, useCallback } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FadeIn";
import { WHATSAPP_URL } from "@/lib/constants";
import { SectionCTA } from "@/components/ui/SectionCTA";
import type { SanityFaq } from "@/lib/sanity/client";

// Mirrors the faqItem schema's category options.list (src/lib/sanity/schemaTypes/faqItem.ts) —
// just the display label for each stored category slug.
const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  "visa-types": "Visa Types",
  documents: "Documents",
  pricing: "Pricing",
  process: "Process",
  application: "Application",
};

const POPULAR_TAGS = ["Processing Time", "Refund", "Rejection", "60-Day Visa", "Photo Specs"];

function AccordionItem({ item, isOpen, onToggle }: { item: SanityFaq; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-line last:border-0">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-sans font-medium text-ink text-sm leading-snug">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted flex-shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="pb-5">
          <p className="text-muted font-sans text-sm leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export function FAQClient({ faqs }: { faqs: SanityFaq[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(faqs[0]?.category ?? "");
  const [openId, setOpenId] = useState<string | null>(faqs[0]?._id ?? null);

  // Preserves the order categories first appear in (already sort_order-sorted from Sanity).
  const categories = useMemo(() => Array.from(new Set(faqs.map((f) => f.category))), [faqs]);

  const scrollToCategory = useCallback((cat: string) => {
    const el = document.getElementById(`faq-category-${cat}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const filteredFaqs = useMemo(() => {
    if (!search.trim()) return faqs;
    const q = search.toLowerCase();
    return faqs.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [faqs, search]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat] = filteredFaqs.filter((f) => f.category === cat).length;
    });
    return counts;
  }, [categories, filteredFaqs]);

  const groupedFaqs = useMemo(() => {
    const groups: Record<string, SanityFaq[]> = {};
    categories.forEach((cat) => {
      groups[cat] = filteredFaqs.filter((f) => f.category === cat);
    });
    return groups;
  }, [categories, filteredFaqs]);

  const visibleCategories = search.trim()
    ? categories.filter((cat) => groupedFaqs[cat].length > 0)
    : categories;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ─────────────────────────────────────── */}
      <section className="bg-navy relative overflow-hidden pt-28 pb-14 px-4">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full border border-white/10" />
          <div className="absolute top-8 -right-16 w-72 h-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-white/10" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <FadeIn direction="up" delay={0}>
            <p className="text-gold text-xs font-sans font-semibold uppercase tracking-widest mb-2">
              Help Centre
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={100}>
            <h1 className="font-display font-bold text-4xl text-white mb-6">
              How can we help?
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={200}>
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions — try 'processing time'"
                className="w-full h-14 pl-12 pr-28 rounded-full bg-white text-ink font-sans text-sm placeholder:text-muted/60 border border-white focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-full bg-gradient-to-r from-gold to-[#F0C864] text-navy font-sans font-semibold text-sm hover:opacity-90 transition-opacity">
                Search
              </button>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={300}>
            {/* Popular Tags */}
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <span className="text-white/50 text-xs font-sans">Popular:</span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="h-7 px-3 rounded-full border border-white/20 text-white/80 text-xs font-sans hover:bg-white/10 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Content ────────────────────────────────────── */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-6xl flex gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-muted mb-4">
              Categories
            </p>
            <nav className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearch("");
                    const firstItem = groupedFaqs[cat]?.[0];
                    if (firstItem) setOpenId(firstItem._id);
                    scrollToCategory(cat);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-sans text-left transition-colors",
                    activeCategory === cat && !search
                      ? "bg-gold/5 text-gold font-medium"
                      : "text-ink hover:bg-mist"
                  )}
                >
                  <span>{CATEGORY_LABELS[cat] ?? cat}</span>
                  <span className="text-muted text-xs">{categoryCounts[cat]}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* FAQ List */}
          <div className="flex-1 min-w-0">
            {visibleCategories.map((cat) => {
              const items = groupedFaqs[cat];
              if (items.length === 0) return null;
              return (
                <div key={cat} id={`faq-category-${cat}`} className="mb-10 last:mb-0 scroll-mt-34">
                  <h2 className="font-display font-bold text-2xl text-ink mb-4">
                    {CATEGORY_LABELS[cat] ?? cat}
                  </h2>
                  <div>
                    {items.map((item) => (
                      <AccordionItem
                        key={item._id}
                        item={item}
                        isOpen={openId === item._id}
                        onToggle={() =>
                          setOpenId((prev) => (prev === item._id ? null : item._id))
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {visibleCategories.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted font-sans text-sm">
                  No results found for &ldquo;{search}&rdquo;. Try a different search term.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <SectionCTA
        tag="Need help?"
        title="Talk to a consultant directly."
        subtitle="Real humans, average response under 2 minutes."
        buttons={[
          {
            label: "WhatsApp",
            href: WHATSAPP_URL,
            external: true,
            variant: "whatsapp",
          },
          {
            label: "Apply Now",
            href: "/apply",
            variant: "primary",
          },
        ]}
      />
    </div>
  );
}
