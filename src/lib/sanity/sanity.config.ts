import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "visati",
  title: "Visati CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "h1lz1drc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singletons
            S.listItem()
              .title("Homepage Copy")
              .child(S.document().schemaType("homepageCopy").documentId("homepageCopy")),
            S.listItem()
              .title("Contact Details")
              .child(S.document().schemaType("contactDetails").documentId("contactDetails")),
            S.divider(),
            // Collections
            S.listItem().title("FAQ Items").child(S.documentTypeList("faqItem").title("FAQ Items")),
            S.listItem().title("Visa Types").child(S.documentTypeList("visaTypeContent").title("Visa Types")),
            S.listItem().title("Page SEO").child(S.documentTypeList("pageSeo").title("Page SEO")),
            S.divider(),
            // Blog
            S.listItem().title("Blog Posts").child(S.documentTypeList("post").title("Blog Posts")),
            S.listItem().title("Authors").child(S.documentTypeList("author").title("Authors")),
            S.listItem().title("Categories").child(S.documentTypeList("category").title("Categories")),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
