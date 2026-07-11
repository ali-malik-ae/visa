import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProfileSettings } from "@/components/admin/ProfileSettings";
import { VisaPricingSection } from "@/components/admin/VisaPricingSection";
import { CurrencySettings } from "@/components/admin/CurrencySettings";

export const metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return (
    <>
      <AdminPageHeader title="Settings" subtitle="Profile, notifications and visa pricing" />
      <div className="px-4 lg:px-8 pb-10 max-w-4xl space-y-6">
        <ProfileSettings />
        <CurrencySettings />
        <VisaPricingSection />
      </div>
    </>
  );
}
