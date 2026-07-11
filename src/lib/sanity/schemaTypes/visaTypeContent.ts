import { defineField, defineType } from "sanity";

export const visaTypeContent = defineType({
  name: "visaTypeContent",
  title: "Visa Type",
  type: "document",
  description:
    "Marketing content only — pricing is not edited here. Prices live in the admin dashboard (Settings → Visa Pricing) and are matched to this document by slug.",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 100 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "e.g. 30-Day Single Entry",
      validation: (rule) => rule.required().min(5).max(100),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Lucide icon name (e.g. Stamp, Plane, Clock, Repeat, CreditCard)",
      options: {
        list: [
          { title: "Stamp", value: "Stamp" },
          { title: "Plane", value: "Plane" },
          { title: "Clock", value: "Clock" },
          { title: "Repeat", value: "Repeat" },
          { title: "CreditCard", value: "CreditCard" },
          { title: "Globe", value: "Globe" },
          { title: "Shield", value: "Shield" },
          { title: "Zap", value: "Zap" },
          { title: "Users", value: "Users" },
          { title: "Star", value: "Star" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short marketing tagline (e.g. Perfect for short visits)",
      validation: (rule) => rule.required().min(5).max(120),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(20).max(500),
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.min(1).max(10),
    }),
    defineField({
      name: "badge_text",
      title: "Badge Text",
      type: "string",
      description: 'e.g. "Most Popular" — leave empty for no badge',
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: "duration_days",
      title: "Duration (Days)",
      type: "number",
      description: "Stay duration in days",
      validation: (rule) => rule.required().min(1).max(3650),
    }),
    defineField({
      name: "entry_type",
      title: "Entry Type",
      type: "string",
      options: {
        list: [
          { title: "Single", value: "single" },
          { title: "Multiple", value: "multiple" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "processing_time",
      title: "Processing Time",
      type: "string",
      description: "e.g. 24–72h",
      validation: (rule) => rule.required().max(30),
    }),
    defineField({
      name: "has_express",
      title: "Express Available",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "sort_order",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      description: "SEO settings for this visa type page",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "title",
          title: "Meta Title",
          type: "string",
          description: "Page title for search engines (max 60 chars)",
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: "description",
          title: "Meta Description",
          type: "text",
          rows: 2,
          description: "Meta description (max 160 chars)",
          validation: (rule) => rule.max(160),
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrder",
      by: [{ field: "sort_order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "tagline", media: "icon" },
  },
});
