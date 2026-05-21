import type { Metadata } from "next";
import { PolicyPage } from "@/modules/policy/components/PolicyPage";
import { siteConfig } from "@/project/config/site";

export const metadata: Metadata = {
  title: "Terms of Service for AI Audio Generation",
  description:
    "Read the Stable Audio 3 Terms of Service for rules about accounts, credits, prompts, uploaded audio, generated outputs, payments, acceptable use, and service limits.",
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
};

export default function TermsPage() {
  return <PolicyPage slug="terms" />;
}
