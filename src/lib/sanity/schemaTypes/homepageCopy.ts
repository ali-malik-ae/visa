import { defineField, defineType } from "sanity";

export const homepageCopy = defineType({
  name: "homepageCopy",
  title: "Homepage Copy",
  type: "document",
  __experimental_search: [
    { path: "hero_headline", weight: 1 },
  ],
  fields: [
    defineField({
      name: "hero_headline",
      title: "Hero Headline",
      type: "string",
      validation: (rule) => rule.required().min(10).max(120).error("Headline must be 10–120 characters"),
    }),
    defineField({
      name: "hero_subtext",
      title: "Hero Subtext",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().min(20).max(300).error("Subtext must be 20–300 characters"),
    }),
    defineField({
      name: "trust_stats",
      title: "Trust Stats",
      type: "array",
      of: [
        {
          type: "object",
          name: "trustStat",
          fields: [
            { name: "label", title: "Label", type: "string", validation: (r) => r.required().max(50) },
            { name: "value", title: "Value", type: "string", validation: (r) => r.required().max(30) },
          ],
        },
      ],
      validation: (rule) => rule.min(2).max(6).error("Add 2–6 trust stats"),
    }),
    defineField({
      name: "process_steps",
      title: "Process Steps",
      type: "array",
      of: [
        {
          type: "object",
          name: "processStep",
          fields: [
            { name: "title", title: "Title", type: "string", validation: (r) => r.required().max(50) },
            { name: "description", title: "Description", type: "text", validation: (r) => r.required().max(200) },
          ],
        },
      ],
      validation: (rule) => rule.min(2).max(6).error("Add 2–6 process steps"),
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        {
          type: "object",
          name: "testimonial",
          fields: [
            { name: "name", title: "Name", type: "string", validation: (r) => r.required().max(50) },
            { name: "country", title: "Country", type: "string", validation: (r) => r.required().max(50) },
            { name: "rating", title: "Rating", type: "number", validation: (r) => r.min(1).max(5) },
            { name: "text", title: "Text", type: "text", validation: (r) => r.required().max(500) },
          ],
        },
      ],
      validation: (rule) => rule.min(1).max(20).error("Add 1–20 testimonials"),
    }),
    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      description: "SEO settings for the homepage",
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
        defineField({
          name: "ogImage",
          title: "OG Image",
          type: "image",
          description: "Social sharing image (1200x630px)",
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "hero_headline" },
  },
});
