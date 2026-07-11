import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-06-21",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

/* ── Types ──────────────────────────────────────────── */

export interface SanityVisaType {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  features: string[];
  badge_text: string | null;
  price_aed: number;
  price_usd: number;
  duration_days: number;
  entry_type: "single" | "multiple";
  processing_time: string;
  has_express: boolean;
  sort_order: number;
  seo?: { title?: string; description?: string };
}

export interface SanityFaq {
  _id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

export interface SanityHomepageCopy {
  hero_headline: string;
  hero_subtext: string;
  trust_stats: { label: string; value: string }[];
  process_steps: { title: string; description: string }[];
  testimonials: { name: string; country: string; rating: number; text: string }[];
  seo?: { title?: string; description?: string };
}

export interface SanityContactDetails {
  whatsapp_number: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
}

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  content: unknown[];
  mainImage?: { asset?: { url: string }; alt?: string };
  author: { name: string; slug?: string; image?: { asset?: { url: string } } };
  categories: { category: { name: string; slug: string } }[];
  publishedAt: string;
  status: string;
  featured: boolean;
  seo?: { title?: string; description?: string };
}

export interface SanityCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

/* ── GROQ Queries ───────────────────────────────────── */

export async function getFaqs(): Promise<SanityFaq[]> {
  return sanityClient.fetch(
    `*[_type == "faqItem" && !(_id in path("drafts.**"))] | order(sort_order asc) {
      _id, question, answer, category, sort_order
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getVisaTypes(): Promise<SanityVisaType[]> {
  return sanityClient.fetch(
    `*[_type == "visaTypeContent" && !(_id in path("drafts.**"))] | order(sort_order asc) {
      "slug": slug.current, name, icon, tagline, description, features, badge_text,
      price_aed, price_usd, duration_days, entry_type, processing_time, has_express, sort_order,
      seo { title, description }
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getHomepageCopy(): Promise<SanityHomepageCopy> {
  return sanityClient.fetch(
    `*[_type == "homepageCopy"][0] {
      hero_headline, hero_subtext, trust_stats, process_steps, testimonials,
      seo { title, description }
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getContactDetails(): Promise<SanityContactDetails | null> {
  return sanityClient.fetch(
    `*[_type == "contactDetails"][0] {
      whatsapp_number, email, phone, address, hours
    }`,
    {},
    { next: { revalidate: 3600 } }
  );
}

export async function getBlogPosts(): Promise<SanityBlogPost[]> {
  return sanityClient.fetch(
    `*[_type == "post" && status == "published" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id, title, slug, summary, mainImage { asset->{url}, alt },
      author-> { name, slug, image { asset->{url} } },
      categories[] { category-> { name, slug } },
      publishedAt, status, featured,
      seo { title, description }
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getBlogPost(slug: string): Promise<SanityBlogPost | null> {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id, title, slug, summary, content, mainImage { asset->{url}, alt },
      author-> { name, slug, image { asset->{url} } },
      categories[] { category-> { name, slug } },
      publishedAt, status, featured,
      seo { title, description }
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );
}

export async function getCategories(): Promise<SanityCategory[]> {
  return sanityClient.fetch(
    `*[_type == "category" && !(_id in path("drafts.**"))] | order(name asc) {
      _id, name, slug, description
    }`,
    {},
    { next: { revalidate: 3600 } }
  );
}

export interface SanityPageSeo {
  title: string;
  description: string;
  ogImage?: { asset?: { url: string } };
}

export async function getPageSeo(page: string): Promise<SanityPageSeo | null> {
  return sanityClient.fetch(
    `*[_type == "pageSeo" && page == $page][0] {
      title, description, ogImage { asset->{url} }
    }`,
    { page },
    { next: { revalidate: 3600 } }
  );
}
