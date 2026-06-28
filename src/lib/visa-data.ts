import { getVisaTypes, type SanityVisaType } from "@/lib/sanity/client";
import { sanityToVisaType, type VisaTypeData } from "@/types/visa";

/**
 * Returns visa types for public display from Sanity CMS.
 * Falls back to empty array on error (no more static sample data).
 */
export async function getDisplayVisaTypes(): Promise<VisaTypeData[]> {
  try {
    const sanityVisas: SanityVisaType[] = await getVisaTypes();
    return sanityVisas.map(sanityToVisaType);
  } catch {
    return [];
  }
}
