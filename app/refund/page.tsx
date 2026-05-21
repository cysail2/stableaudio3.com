import type { Metadata } from "next";
import { PolicyPage } from "@/modules/policy/components/PolicyPage";
import { siteConfig } from "@/project/config/site";

export const metadata: Metadata = {
  title: "Refund Policy for AI Audio Credits",
  description:
    "Read the Stable Audio 3 Refund Policy for credit purchases, unused credits, duplicate charges, failed delivery, technical issues, and refund requests.",
  alternates: {
    canonical: `${siteConfig.url}/refund`,
  },
};

export default function RefundPage() {
  return <PolicyPage slug="refund" />;
}
