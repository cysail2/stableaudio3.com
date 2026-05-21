import type { Metadata } from "next";
import { PolicyPage } from "@/modules/policy/components/PolicyPage";
import { siteConfig } from "@/project/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy for AI Audio Generation",
  description:
    "Read the Stable Audio 3 Privacy Policy to understand how account data, prompts, uploaded audio, generated outputs, payments, and service data are handled.",
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
};

export default function PrivacyPage() {
  return <PolicyPage slug="privacy" />;
}
