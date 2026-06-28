import { defineField, defineType } from "sanity";

export const contactDetails = defineType({
  name: "contactDetails",
  title: "Contact Details",
  type: "document",
  __experimental_search: [
    { path: "email", weight: 1 },
  ],
  fields: [
    defineField({
      name: "whatsapp_number",
      title: "WhatsApp Number",
      type: "string",
      description: "Include country code, e.g. +971585542344",
      validation: (rule) => rule.required().regex(/^\+?[0-9]{10,15}$/, "Must be a valid phone number"),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (rule) => rule.required().regex(/^\+?[0-9\s\-()]{7,20}$/, "Must be a valid phone number"),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "hours",
      title: "Business Hours",
      type: "string",
      description: "e.g. Sun–Thu 9AM–6PM",
      validation: (rule) => rule.required().max(100),
    }),
  ],
  preview: {
    select: { title: "email", subtitle: "phone" },
  },
});
