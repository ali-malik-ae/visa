import { defineArrayMember, defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(10).max(120).error("Title must be 10–120 characters"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Short excerpt for listings and SEO (max 300 characters)",
      validation: (rule) => rule.required().min(20).max(300).error("Summary must be 20–300 characters"),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Alt text", validation: (r) => r.required() }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1).error("Content cannot be empty"),
    }),
    defineField({
      name: "mainImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text", validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "categoryReference",
          fields: [
            defineField({
              name: "category",
              title: "Category",
              type: "reference",
              to: [{ type: "category" }],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "category.name" },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(3).error("Select 1–3 categories"),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
          { title: "Archived", value: "archived" },
        ],
      },
      initialValue: "draft",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show this post on the homepage",
    }),
    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      description: "Override default SEO values for this post",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "title",
          title: "Meta Title",
          type: "string",
          description: "Override title for search engines (max 60 chars)",
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
          description: "Override cover for social sharing (1200x630px)",
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Published Date",
      name: "publishedAt_desc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
      status: "status",
    },
    prepare(selection) {
      const { author, status } = selection;
      return {
        ...selection,
        subtitle: author ? `by ${author} • ${status}` : status,
      };
    },
  },
});
