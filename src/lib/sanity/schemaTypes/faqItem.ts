import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required().min(10).max(200).error("Question must be 10–200 characters"),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(20).max(2000).error("Answer must be 20–2000 characters"),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "General", value: "general" },
          { title: "Visa Types", value: "visa-types" },
          { title: "Documents", value: "documents" },
          { title: "Pricing", value: "pricing" },
          { title: "Process", value: "process" },
          { title: "Application", value: "application" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sort_order",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.min(0).max(100),
    }),
    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      description: "SEO settings for the FAQ page (applies to the FAQ page, not individual items)",
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
      name: "sort_order_asc",
      by: [{ field: "sort_order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "question", subtitle: "category" },
  },
});
