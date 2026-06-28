/**
 * Sanity Seed Script
 * Run: npx sanity-exec --require dotenv/config -- projectDataset seed seed.ts
 * Or: npx tsx seed.ts (with SANITY_API_TOKEN in .env)
 */
import { createClient } from "@sanity/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "h1lz1drc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-06-27",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function seed() {
  console.log("Seeding Sanity...\n");

  // 1. Contact Details (singleton — upsert)
  console.log("→ Contact Details");
  await client.createOrReplace({
    _id: "contactDetails",
    _type: "contactDetails",
    whatsapp_number: "+971585542344",
    email: "visa@visati.ae",
    phone: "+971 58 554 2344",
    address: "Dubai, United Arab Emirates",
    hours: "Sun–Thu 9:00 AM – 6:00 PM",
  });

  // 2. Homepage Copy (singleton — upsert)
  console.log("→ Homepage Copy");
  await client.createOrReplace({
    _id: "homepageCopy",
    _type: "homepageCopy",
    hero_headline: "Your UAE Visa, Simplified.",
    hero_subtext: "Fast, reliable visa processing for the UAE. Apply online in minutes — 99% approval rate, trusted by 1,000+ travellers worldwide.",
    trust_stats: [
      { _type: "trustStat", _key: "s1", label: "Visas Processed", value: "1,000+" },
      { _type: "trustStat", _key: "s2", label: "Approval Rate", value: "99%" },
      { _type: "trustStat", _key: "s3", label: "Processing Time", value: "2–3 Days" },
      { _type: "trustStat", _key: "s4", label: "Support", value: "24/7" },
    ],
    process_steps: [
      { _type: "processStep", _key: "p1", title: "Choose Visa", description: "Select your visa type and duration from our options." },
      { _type: "processStep", _key: "p2", title: "Upload Documents", description: "Upload your passport and photo — we handle the rest." },
      { _type: "processStep", _key: "p3", title: "We Process", description: "Our team reviews and submits your application to GDRFA." },
      { _type: "processStep", _key: "p4", title: "Receive Visa", description: "Get your e-visa via email within 2–3 business days." },
    ],
    testimonials: [
      { _type: "testimonial", _key: "t1", name: "Sophie Laurent", country: "France", rating: 5, text: "Incredibly smooth process. Got my visa in 2 days! The team was very responsive on WhatsApp." },
      { _type: "testimonial", _key: "t2", name: "James Whitfield", country: "United Kingdom", rating: 5, text: "Applied from London, received my visa before my flight. Highly recommend Visati for anyone visiting the UAE." },
      { _type: "testimonial", _key: "t3", name: "Priya Sharma", country: "India", rating: 5, text: "Best visa service I've used. Clear pricing, fast processing, and excellent customer support." },
      { _type: "testimonial", _key: "t4", name: "Chen Wei", country: "China", rating: 4, text: "Very professional service. The online application was straightforward and the team kept me updated." },
      { _type: "testimonial", _key: "t5", name: "Maria Santos", country: "Brazil", rating: 5, text: "Visati made my Dubai trip possible. The 30-day visa was processed in just 48 hours!" },
    ],
    seo: {
      title: "Visati — UAE Visa Online | Fast Processing, 99% Approval",
      description: "Apply for your UAE tourist, transit, or business visa online. Fast processing, 99% approval rate. Trusted by 1,000+ travellers. Apply in minutes.",
    },
  });

  // 3. Visa Type Content
  console.log("→ Visa Types");
  const visaTypes = [
    { slug: "14d-single", name: "14-Day Single Entry", icon: "Clock", tagline: "Quick visit visa for short trips, stopovers, or brief business travel.", description: "Perfect for short visits, layovers, and quick business trips to the UAE.", features: ["14-day stay", "Single entry", "Tourist & transit", "Processing: 1–2 days"], badge_text: null, price_aed: 459, duration_days: 14, entry_type: "single", processing_time: "24–72h", has_express: true, sort_order: 1 },
    { slug: "30d-single", name: "30-Day Single Entry", icon: "Stamp", tagline: "Single entry, perfect for short visits, leisure and family stays.", description: "Our most popular visa for tourists visiting Dubai and the UAE.", features: ["30-day stay", "Single entry", "Tourist visa", "Processing: 2–3 days"], badge_text: "Most Popular", price_aed: 549, duration_days: 30, entry_type: "single", processing_time: "24–72h", has_express: true, sort_order: 2 },
    { slug: "60d-single", name: "60-Day Single Entry", icon: "Plane", tagline: "Extended stay for longer holidays, family visits, or medical travel.", description: "Extended stay for longer holidays or family visits in the UAE.", features: ["60-day stay", "Single entry", "Multiple purposes", "Processing: 2–3 days"], badge_text: null, price_aed: 918, duration_days: 60, entry_type: "single", processing_time: "24–72h", has_express: true, sort_order: 3 },
    { slug: "30d-multi", name: "30-Day Multiple Entry", icon: "Repeat", tagline: "Multiple entries within 60 days. Ideal for business travellers.", description: "Flexible entry for business travellers visiting the UAE multiple times.", features: ["30-day stay", "Multiple entries", "Business friendly", "Processing: 2–3 days"], badge_text: null, price_aed: 918, duration_days: 30, entry_type: "multiple", processing_time: "48–72h", has_express: true, sort_order: 4 },
    { slug: "60d-multi", name: "60-Day Multiple Entry", icon: "Globe", tagline: "Extended multiple entry for complex itineraries across the region.", description: "Maximum flexibility for extended business or personal trips.", features: ["60-day stay", "Multiple entries", "Long-term travel", "Processing: 2–3 days"], badge_text: null, price_aed: 1285, duration_days: 60, entry_type: "multiple", processing_time: "48–72h", has_express: true, sort_order: 5 },
    { slug: "visa-extension", name: "Visa Extension", icon: "CreditCard", tagline: "Extend your current UAE visa without leaving the country.", description: "Extend your existing UAE visa without leaving the country.", features: ["Extend current visa", "No exit required", "Quick processing", "Same-day to 2 days"], badge_text: null, price_aed: 1285, duration_days: 30, entry_type: "single", processing_time: "3–5 days", has_express: false, sort_order: 6 },
  ];
  for (const v of visaTypes) {
    await client.createOrReplace({
      _id: `visaType-${v.slug}`,
      _type: "visaTypeContent",
      slug: { _type: "slug", current: v.slug },
      name: v.name,
      icon: v.icon,
      tagline: v.tagline,
      description: v.description,
      features: v.features,
      badge_text: v.badge_text,
      price_aed: v.price_aed,
      duration_days: v.duration_days,
      entry_type: v.entry_type,
      processing_time: v.processing_time,
      has_express: v.has_express,
      sort_order: v.sort_order,
    });
  }

  // 4. FAQ Items
  console.log("→ FAQ Items");
  const faqs = [
    { q: "How long does visa processing take?", a: "Standard processing takes 2–3 business days. Express processing is available for same-day or next-day delivery.", cat: "process", order: 1 },
    { q: "What documents do I need to apply?", a: "You need a clear passport scan (6+ months validity), a passport-sized photo, and your travel dates. Additional documents may be required for specific visa types.", cat: "documents", order: 2 },
    { q: "What is the approval rate?", a: "We maintain a 99% approval rate. Our team reviews every application before submission to ensure completeness and accuracy.", cat: "general", order: 3 },
    { q: "Can I track my application?", a: "Yes! Use our Track Application page with your Application ID to check real-time status updates.", cat: "application", order: 4 },
    { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards (Visa, Mastercard, Amex) via Stripe secure payments.", cat: "pricing", order: 5 },
    { q: "Do you offer refunds?", a: "If your visa is rejected, we offer a full refund of our service fee. Government fees are non-refundable.", cat: "pricing", order: 6 },
    { q: "What visa types do you offer?", a: "We offer 14-day, 30-day, and 60-day visas in both single and multiple entry options, plus visa extensions.", cat: "visa-types", order: 7 },
    { q: "Can I apply for someone else?", a: "Yes, you can apply on behalf of family members or colleagues. You'll need their passport details and photo.", cat: "application", order: 8 },
  ];
  for (const f of faqs) {
    await client.create({
      _type: "faqItem",
      question: f.q,
      answer: f.a,
      category: f.cat,
      sort_order: f.order,
    });
  }

  // 5. Page SEO
  console.log("→ Page SEO");
  const seoPages = [
    { page: "home", title: "Visati — UAE Visa Online | Fast Processing, 99% Approval", desc: "Apply for your UAE tourist, transit, or business visa online. Fast processing, 99% approval rate. Trusted by 1,000+ travellers. Apply in minutes." },
    { page: "about", title: "About Visati — Your Trusted UAE Visa Partner", desc: "Learn about Visati, a Dubai-based visa consultancy with a 99% approval rate and 1,000+ satisfied travellers worldwide." },
    { page: "services", title: "Our Services — Visa Processing, Consultation & More | Visati", desc: "Explore Visati services: tourist visas, business visas, visa extensions, document review, and express processing for UAE travel." },
    { page: "visa-types", title: "UAE Visa Types — Tourist, Business & Transit Visas | Visati", desc: "Compare UAE visa types: 14-day, 30-day, 60-day single and multiple entry visas. Find the right visa for your trip." },
    { page: "contact", title: "Contact Us — Get in Touch with Visati | Dubai, UAE", desc: "Contact Visati for UAE visa inquiries. WhatsApp, email, or call us. Based in Dubai, serving travellers worldwide." },
    { page: "faq", title: "FAQ — Frequently Asked Questions | Visati UAE Visas", desc: "Find answers to common questions about UAE visa processing, documents, pricing, timelines, and more." },
    { page: "blog", title: "Blog — UAE Visa Guides, Tips & News | Visati", desc: "Read the latest UAE visa guides, travel tips, and news from Visati. Stay updated on visa policies and travel advice." },
    { page: "careers", title: "Careers — Join the Visati Team | Dubai", desc: "Join Visati and help simplify UAE visa processing. View open positions and apply today." },
    { page: "track", title: "Track Your UAE Visa Application | Visati", desc: "Track your UAE visa application status in real-time. Enter your Application ID to see updates." },
    { page: "apply", title: "Apply for UAE Visa Online | Visati", desc: "Apply for your UAE tourist, transit, or business visa online. Secure, fast processing with 99% approval rate." },
  ];
  for (const s of seoPages) {
    await client.createOrReplace({
      _id: `seo-${s.page}`,
      _type: "pageSeo",
      page: s.page,
      title: s.title,
      description: s.desc,
    });
  }

  // 6. Blog Author
  console.log("→ Author");
  await client.createOrReplace({
    _id: "author-mariam",
    _type: "author",
    name: "Mariam Khalid",
    slug: { _type: "slug", current: "mariam-khalid" },
    bio: "Visa consultant and content lead at Visati. Helping travellers navigate UAE visa requirements since 2024.",
  });

  // 7. Blog Categories
  console.log("→ Categories");
  const cats = [
    { name: "Visa Guides", slug: "visa-guides", desc: "Step-by-step guides for UAE visa applications" },
    { name: "Travel Tips", slug: "travel-tips", desc: "Tips for visiting Dubai and the UAE" },
    { name: "Visa News", slug: "visa-news", desc: "Updates on visa policies and regulations" },
  ];
  for (const c of cats) {
    await client.createOrReplace({
      _id: `category-${c.slug}`,
      _type: "category",
      name: c.name,
      slug: { _type: "slug", current: c.slug },
      description: c.desc,
    });
  }

  // 8. Sample Blog Post
  console.log("→ Sample Blog Post");
  await client.createOrReplace({
    _id: "post-uae-visa-guide",
    _type: "post",
    title: "Complete Guide to UAE Tourist Visas in 2026",
    slug: { _type: "slug", current: "uae-tourist-visa-guide-2026" },
    summary: "Everything you need to know about applying for a UAE tourist visa in 2026 — types, documents, processing times, and tips for approval.",
    content: [
      {
        _type: "block",
        _key: "b1",
        style: "h2",
        children: [{ _type: "span", _key: "s1", text: "Why Visit the UAE?" }],
      },
      {
        _type: "block",
        _key: "b2",
        children: [{ _type: "span", _key: "s2", text: "The UAE, particularly Dubai and Abu Dhabi, remains one of the world's top travel destinations. With its stunning architecture, luxury shopping, desert adventures, and cultural experiences, it attracts millions of visitors every year." }],
      },
      {
        _type: "block",
        _key: "b3",
        style: "h2",
        children: [{ _type: "span", _key: "s3", text: "Types of Tourist Visas" }],
      },
      {
        _type: "block",
        _key: "b4",
        children: [{ _type: "span", _key: "s4", text: "The UAE offers several visa options: 14-day, 30-day, and 60-day visas, each available in single or multiple entry formats. The 30-day single entry visa is the most popular choice for tourists." }],
      },
      {
        _type: "block",
        _key: "b5",
        style: "h2",
        children: [{ _type: "span", _key: "s5", text: "Documents Required" }],
      },
      {
        _type: "block",
        _key: "b6",
        children: [{ _type: "span", _key: "s6", text: "You'll need a valid passport (6+ months validity), a recent passport-sized photo, confirmed travel dates, and proof of accommodation. Additional documents may be required based on your nationality." }],
      },
    ],
    author: { _type: "reference", _ref: "author-mariam" },
    categories: [
      { _type: "categoryReference", _key: "cat-visa-guides", category: { _type: "reference", _ref: "category-visa-guides" } },
    ],
    publishedAt: "2026-06-27T00:00:00Z",
    status: "published",
    featured: true,
    seoTitle: "UAE Tourist Visa Guide 2026 — Types, Documents & Tips | Visati",
    seoDescription: "Complete guide to UAE tourist visas in 2026. Learn about visa types, required documents, processing times, and tips for a smooth application.",
  });

  console.log("\n✅ Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
