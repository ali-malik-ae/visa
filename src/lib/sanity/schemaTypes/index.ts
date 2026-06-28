import { type SchemaTypeDefinition } from "sanity";

import { faqItem } from "./faqItem";
import { visaTypeContent } from "./visaTypeContent";
import { homepageCopy } from "./homepageCopy";
import { contactDetails } from "./contactDetails";
import { pageSeo } from "./pageSeo";
import { author } from "./author";
import { category } from "./category";
import { post } from "./post";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  homepageCopy,
  contactDetails,
  // Content
  faqItem,
  visaTypeContent,
  pageSeo,
  // Blog
  author,
  category,
  post,
];
