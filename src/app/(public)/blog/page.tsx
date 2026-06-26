import { BRAND } from "@/lib/constants";
import { Calendar, Clock, Tag } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Blog — UAE Visa Tips & Travel Guides",
  description: `Travel tips, UAE visa guides, and immigration insights from Visati's team of Dubai-based visa consultants.`,
};

const POSTS = [
  {
    slug: "uae-visa-on-arrival-countries",
    title: "UAE Visa on Arrival: Which Countries Qualify in 2025?",
    excerpt:
      "Citizens of over 70 countries can enter the UAE without a pre-approved visa. Here is the full list and what you need to know about duration, extensions, and entry rules.",
    category: "Visa Guide",
    date: "2025-06-10",
    readTime: "5 min read",
  },
  {
    slug: "common-visa-mistakes",
    title: "7 Common Visa Application Mistakes That Get You Rejected",
    excerpt:
      "Wrong passport photo dimensions, mismatched travel dates, and expired documents are the top reasons applications get delayed. Here is how to avoid them.",
    category: "Tips",
    date: "2025-06-03",
    readTime: "4 min read",
  },
  {
    slug: "dubai-travel-checklist",
    title: "Dubai Travel Checklist: What to Pack and Prepare Before You Fly",
    excerpt:
      "From travel insurance to SIM cards, here is a practical checklist for first-time visitors to Dubai. Everything you need to land prepared.",
    category: "Travel",
    date: "2025-05-28",
    readTime: "6 min read",
  },
  {
    slug: "visa-extension-rules",
    title: "UAE Visa Extension Rules Explained (2025 Update)",
    excerpt:
      "Can you extend a 30-day tourist visa? What about a 60-day? We break down the current extension rules, fees, and how to apply before your visa expires.",
    category: "Visa Guide",
    date: "2025-05-20",
    readTime: "5 min read",
  },
  {
    slug: "business-setup-dubai",
    title: "Business Visa vs. Tourist Visa: Which One Do You Need?",
    excerpt:
      "Planning to attend a conference or explore business opportunities in Dubai? A tourist visa might work, but a business visa has advantages. Here is the difference.",
    category: "Business",
    date: "2025-05-14",
    readTime: "4 min read",
  },
  {
    slug: "ramadan-travel-tips",
    title: "Traveling to Dubai During Ramadan: What Tourists Should Know",
    excerpt:
      "Ramadan changes dining hours, mall schedules, and public behavior rules. Here is what to expect and how to plan your trip around it.",
    category: "Travel",
    date: "2025-05-06",
    readTime: "5 min read",
  },
];

const CATEGORIES = ["All", "Visa Guide", "Tips", "Travel", "Business"];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full border border-white/5" />
          <div className="absolute top-8 -right-16 w-72 h-72 rounded-full border border-white/5" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24 text-center">
          <FadeIn>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Blog
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/60 max-w-2xl mx-auto">
              Travel tips, visa guides, and immigration insights from our Dubai-based team.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border border-ink/10 text-ink/60 hover:bg-navy hover:text-white transition-colors cursor-pointer"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {POSTS.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 100}>
              <article className="group bg-white border border-ink/10 rounded-2xl overflow-hidden hover:border-gold/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                {/* Placeholder image */}
                <div className="h-48 bg-gradient-to-br from-navy/5 to-gold/5 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Tag className="h-10 w-10 text-ink/10" />
                  </div>
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gold">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-ink/40 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-heading text-lg font-semibold text-ink mb-2 group-hover:text-gold transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-ink/55 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-gold/80 transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
