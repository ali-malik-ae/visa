"use client";

import { useState, useMemo, useCallback } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FadeIn";
import { CONTACT, WHATSAPP_URL } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";
import { SectionCTA } from "@/components/ui/SectionCTA";

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  // General
  {
    _id: "1",
    question: "What does Visati do?",
    answer:
      "We handle UAE visa applications end-to-end — from documentation review to embassy submission and follow-up — for travellers and businesses in 184 countries.",
    category: "General",
  },
  {
    _id: "2",
    question: "How is Visati different from other agencies?",
    answer:
      "We combine concierge-grade service with real-time tracking, transparent pricing, and a 99% approval rate. Every application is assigned a dedicated consultant.",
    category: "General",
  },
  {
    _id: "3",
    question: "Are you authorised by UAE authorities?",
    answer:
      "Yes, we are a licensed UAE visa consultancy operating under DED trade licence. We process applications through official government channels.",
    category: "General",
  },
  // Visa Types
  {
    _id: "4",
    question: "Which visa do I need for a 2-week holiday?",
    answer:
      "For a 2-week holiday, the 30-Day Single Entry tourist visa is the most popular choice. It gives you 30 days from the date of entry to stay in the UAE.",
    category: "Visa Types",
  },
  {
    _id: "5",
    question: "Can I extend my visa once inside the UAE?",
    answer:
      "Tourist visas can be extended by applying for a new visa before the current one expires. Contact us on WhatsApp and we'll assist with the renewal process.",
    category: "Visa Types",
  },
  {
    _id: "6",
    question: "Do you offer multi-entry options?",
    answer:
      "Yes, we offer 30-Day and 90-Day Multiple Entry visas, ideal for business travellers or those planning to visit neighbouring countries and return.",
    category: "Visa Types",
  },
  // Application Process
  {
    _id: "7",
    question: "How long does the application take?",
    answer:
      "Standard processing takes 3–5 working days. Express processing is available for 1–2 working days at an additional fee of AED 99.",
    category: "Application Process",
  },
  {
    _id: "8",
    question: "Can I save my application and come back later?",
    answer:
      "Yes, your progress is saved automatically. You can return to complete your application using the same device and browser within 7 days.",
    category: "Application Process",
  },
  {
    _id: "9",
    question: "How do I track my application status?",
    answer:
      "Once submitted, you'll receive a unique Application ID (VIS-YYYY-XXXXXX). Enter it on our Track page to see real-time status updates.",
    category: "Application Process",
  },
  // Documents
  {
    _id: "10",
    question: "What documents do I need to upload?",
    answer:
      "You'll need: a clear scan of your passport bio-data page (valid for at least 6 months), a recent passport-sized photograph, and any supporting documents depending on the visa type.",
    category: "Documents",
  },
  {
    _id: "11",
    question: "Are photo specifications strict?",
    answer:
      "Yes, UAE authorities require a recent passport-sized photo with a white background, clear face, and no accessories. We'll notify you if your photo doesn't meet requirements.",
    category: "Documents",
  },
  {
    _id: "12",
    question: "My passport expires in 5 months — am I eligible?",
    answer:
      "UAE visas require at least 6 months validity on your passport from the date of entry. If your passport expires in 5 months, you'll need to renew it before applying.",
    category: "Documents",
  },
  // Fees & Payments
  {
    _id: "13",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, Amex), Apple Pay, and Google Pay through our secure Stripe payment gateway.",
    category: "Fees & Payments",
  },
  {
    _id: "14",
    question: "Are there hidden charges?",
    answer:
      "No. The price you see at checkout is the total price. Government fees, service charges, and taxes are all included. Express processing (+AED 99) is clearly marked.",
    category: "Fees & Payments",
  },
  {
    _id: "15",
    question: "What is your refund policy?",
    answer:
      "Government processing fees are non-refundable once submitted. If your application hasn't been submitted yet, contact us within 24 hours for a full refund of service fees.",
    category: "Fees & Payments",
  },
];

const CATEGORIES = ["General", "Visa Types", "Application Process", "Documents", "Fees & Payments"];

const POPULAR_TAGS = ["Processing Time", "Refund", "Rejection", "60-Day Visa", "Photo Specs"];

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
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

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("General");
  const [openId, setOpenId] = useState<string | null>("1");

  const scrollToCategory = useCallback((cat: string) => {
    const el = document.getElementById(`faq-category-${cat}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const filteredFaqs = useMemo(() => {
    if (!search.trim()) return FAQ_DATA;
    const q = search.toLowerCase();
    return FAQ_DATA.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [search]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      counts[cat] = filteredFaqs.filter((f) => f.category === cat).length;
    });
    return counts;
  }, [filteredFaqs]);

  const groupedFaqs = useMemo(() => {
    const groups: Record<string, FAQItem[]> = {};
    CATEGORIES.forEach((cat) => {
      groups[cat] = filteredFaqs.filter((f) => f.category === cat);
    });
    return groups;
  }, [filteredFaqs]);

  const visibleCategories = search.trim()
    ? CATEGORIES.filter((cat) => groupedFaqs[cat].length > 0)
    : CATEGORIES;

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
              <button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-full bg-gold text-navy font-sans font-semibold text-sm hover:bg-gold/90 transition-colors">
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
              {CATEGORIES.map((cat) => (
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
                      ? "bg-blue/5 text-gold font-medium"
                      : "text-ink hover:bg-mist"
                  )}
                >
                  <span>{cat}</span>
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
                    {cat}
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
