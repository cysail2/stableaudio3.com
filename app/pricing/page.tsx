import type { Metadata } from "next";
import Link from "next/link";
import { PricingCards } from "@/modules/pricing/components/PricingCards";
import { JsonLd } from "@/project/components/JsonLd";
import { StableAudioFAQ } from "@/project/components/StableAudioFAQ";
import { generatorCreditRules, pricingPlans } from "@/project/config/pricing";
import { siteConfig } from "@/project/config/site";
import { pricingContent } from "@/project/content/pricing";

export const metadata: Metadata = {
  title: {
    absolute: "Stable Audio 3 Pricing — Credits from $9.90, 100 Free",
  },
  description:
    "From $9.90 with 100 free credits at signup. Credits never expire — cover text-to-audio, audio editing, and inpaint workflows across 4 plans.",
  keywords: [
    "Stable Audio 3 pricing",
    "AI audio credits",
    "audio generation pricing",
    "Stable Audio 3 credits",
    "AI music generator plans",
  ],
  alternates: {
    canonical: `${siteConfig.url}/pricing`,
  },
  openGraph: {
    title: "Stable Audio 3 Pricing — Credits from $9.90, 100 Free",
    description:
      "From $9.90 with 100 free credits at signup. Credits never expire — cover text-to-audio, audio editing, and inpaint workflows across 4 plans.",
    url: `${siteConfig.url}/pricing`,
    images: ["/og/pricing.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stable Audio 3 Pricing — Credits from $9.90, 100 Free",
    description:
      "From $9.90 with 100 free credits at signup. Credits never expire — cover text-to-audio, audio editing, and inpaint workflows across 4 plans.",
    images: ["/og/pricing.webp"],
  },
};

const pricingAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.productName,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  url: `${siteConfig.url}/pricing`,
  description: metadata.description,
  offers: pricingPlans.map((plan) => ({
    "@type": "Offer",
    name: plan.title,
    price: plan.priceAmount,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${siteConfig.url}/pricing`,
  })),
};

const offerCatalogSchema = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Stable Audio 3 Credit Plans",
  url: `${siteConfig.url}/pricing`,
  itemListElement: pricingPlans.map((plan, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Offer",
      name: plan.title,
      price: plan.priceAmount,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/pricing`,
    },
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pricingContent.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const pricingPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteConfig.url}/pricing#webpage`,
  url: `${siteConfig.url}/pricing`,
  name: "Stable Audio 3 Pricing — Credits from $9.90, 100 Free",
  description: metadata.description,
  isPartOf: {
    "@id": `${siteConfig.url}#website`,
  },
  about: {
    "@type": "SoftwareApplication",
    name: siteConfig.productName,
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteConfig.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Pricing",
      item: `${siteConfig.url}/pricing`,
    },
  ],
};

export default function PricingPage() {
  return (
    <main className="pb-20 md:pb-32">
      <JsonLd data={pricingPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={pricingAppSchema} />
      <JsonLd data={offerCatalogSchema} />
      <JsonLd data={faqSchema} />

      <section className="section pricing-hero !pb-4">
        <div className="section-heading">
          <p className="eyebrow">PRICING</p>
          <h1>Stable Audio 3 Pricing</h1>
          <p>
            Start with {generatorCreditRules.signupCredits} free credits, then choose a credit pack that fits your AI audio workflow.
          </p>
          <p className="trust-note">
            One short generation is enough to test Text-to-Audio, Audio-to-Audio, or Audio Inpaint before buying.
          </p>
        </div>
      </section>

      {/* Plans first — above the fold for users who already know what they want */}
      <section className="section pricing-cards-section !pt-4">
        <PricingCards />
      </section>

      {/* Credit system explainer comes after the plans so users can read context once they've seen prices */}
      <section className="section split-panel pricing-credit-panel">
        <div>
          <p className="eyebrow">Credit System</p>
          <h2>Simple Credits for AI Audio Generation</h2>
        </div>
        <div className="space-y-5">
          <p>
            <Link
              className="text-violet-700 underline decoration-violet-500/40 underline-offset-4 hover:decoration-violet-400"
              href="/"
              title="Stable Audio 3 home"
            >
              Stable Audio 3
            </Link>{" "}
            {pricingContent.explainer[0]}
          </p>
          <p>
            {pricingContent.explainer[1]} For better first attempts, use the{" "}
            <Link
              className="text-violet-700 underline decoration-violet-500/40 underline-offset-4 hover:decoration-violet-400"
              href="/how-to-use-stable-audio-3"
              title="Read the Stable Audio 3 prompt guide"
            >
              Stable Audio 3 prompt guide
            </Link>{" "}
            before spending larger credit packs on long outputs.
          </p>
        </div>
      </section>

      <section className="section split-panel pricing-plan-panel mt-8">
        <div>
          <p className="eyebrow">Plan Selection</p>
          <h2>Which Stable Audio 3 Plan Should You Choose?</h2>
        </div>
        <div className="space-y-5">
          {pricingContent.selection.map((item) => (
            <div key={item.title}>
              <p className="text-slate-900 font-semibold">{item.title}</p>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <StableAudioFAQ items={pricingContent.faq} title="Questions About Stable Audio 3 Pricing" />
      </section>

      <section className="section final-cta pricing-final-cta">
        <p className="eyebrow">Start Free</p>
        <h2>Start with Free Credits</h2>
        <p>Create your first Stable Audio 3 audio clip, then choose the credit plan that matches your workflow.</p>
        <Link className="button-primary" href="/stable-audio-3" title="Open the Stable Audio 3 AI audio generator">
          Try Stable Audio 3 Free
        </Link>
      </section>
    </main>
  );
}
