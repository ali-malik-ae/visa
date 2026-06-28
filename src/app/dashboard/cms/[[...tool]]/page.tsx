"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/lib/sanity/sanity.config";

export default function CmsPage() {
  return <NextStudio config={config} />;
}
