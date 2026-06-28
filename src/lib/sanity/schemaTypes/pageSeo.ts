import { defineField, defineType } from "sanity";

export const pageSeo = defineType({
  name: "pageSeo",
  title: "Page SEO",
  type: "document",
  fields: [
    defineField({
      name: "page",
      title: "Page",
      type: "string",
      options: {
        list: [
          { title: "Home", value: "home" },
          { title: "About", value: "about" },
          { title: "Services", value: "services" },
          { title: "Visa Types", value: "visa-types" },
          { title: "Contact", value: "contact" },
          { title: "FAQ", value: "faq" },
          { title: "Blog", value: "blog" },
          { title: "Careers", value: "careers" },
          { title: "Apply", value: "apply" },
          { title: "Track Application", value: "track" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Meta Title",
      type: "string",
      description: "Recommended: 50–60 characters for optimal SEO",
      validation: (rule) => rule.required().min(30).max(60).error("Meta title must be 30–60 characters"),
    }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "text",
      rows: 2,
      description: "Recommended: 150–160 characters for optimal SEO",
      validation: (rule) => rule.required().min(70).max(160).error("Meta description must be 70–160 characters"),
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
      description: "Recommended: 1200x630px for social sharing",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "page", subtitle: "title" },
  },
});
