import { BRAND } from "@/lib/constants";
import { getPageSeo } from "@/lib/sanity/client";
import type { Metadata } from "next";
import { TrackClient } from "./TrackClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("track").catch(() => null);
  return {
    title: seo?.title || "Track Your UAE Visa Application",
    description: seo?.description || "Check the real-time status of your UAE visa application. Enter your Application ID to see processing updates, team notes, and expected decision date.",
  };
}

interface TrackPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function TrackPage({ searchParams }: TrackPageProps) {
  const { id } = await searchParams;
  return <TrackClient initialId={id} />;
}
