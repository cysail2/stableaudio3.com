import type { Metadata } from "next";
import Link from "next/link";
import { PricingCards } from "@/modules/pricing/components/PricingCards";
import { JsonLd } from "@/project/components/JsonLd";
import { StableAudioFAQ } from "@/project/components/StableAudioFAQ";
import { generatorCreditRules, pricingPlans } from "@/project/config/pricing";
import { siteConfig } from "@/project/config/site";
import { pricingContent } from "@/project/content/pricing";

export const metadata: Metadata = {
  title: "Stable Audio 3 Pricing and Credit Plans",
  description:
    "Start with 50 free credits, then compare Stable Audio 3 pricing and credit plans for prompt testing, variations, and ongoing AI video workflows.",
  keywords: [
    "Stable Audio 3 pricing",
    "AI video credits",
    "video generation pricing",
    "Stable Audio 3 credits",
    "AI video generator plans",
  ],
  alternates: {
    canonical: `${siteConfig.url}/pricing`,
  },
  openGraph: {
    title: "Stable Audio 3 Pricing and Credit Plans",
    description:
      "Start with 50 free credits, then compare Stable Audio 3 pricing and credit plans for prompt testing, variations, and ongoing AI video workflows.",
    url: `${siteConfig.url}/pricing`,
    images: ["/og/pricing.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stable Audio 3 Pricing and Credit Plans",
    description:
      "Start with 50 free credits, then compare Stable Audio 3 pricing and credit plans for prompt testing, variations, and ongoing AI video workflows.",
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
  name: "Stable Audio 3 Pricing and Credit Plans",
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
    <main>
      <JsonLd data={pricingPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={pricingAppSchema} />
      <JsonLd data={offerCatalogSchema} />
      <JsonLd data={faqSchema} />

      <section className="section pricing-hero">
        <div className="section-heading">
          <p className="eyebrow">PRICING</p>
          <h1>Stable Audio 3 Pricing and Credit Plans</h1>
          <p>
            Start with {generatorCreditRules.signupCredits} free credits and create your first 5-second 720p test video. Stable Audio 3 uses simple video credits, so you can test prompts, generate variations, and buy more credits only when you need them.
          </p>
          <p className="trust-note">
            No subscription required. Choose a plan based on how often you create.
          </p>
        </div>
      </section>

      <section className="section pricing-cards-section">
        <div className="section-heading !mb-8">
          <p className="eyebrow">Plans</p>
          <p>
            Compare Stable Audio 3 credit packs for quick tests, prompt exploration, heavier iteration, and team workflows.
          </p>
        </div>
        <PricingCards />
      </section>

      <section className="section split-panel">
        <div>
          <p className="eyebrow">Plan Selection</p>
          <h2>Which Stable Audio 3 Plan Should You Choose?</h2>
        </div>
        <div className="space-y-5">
          {pricingContent.selection.map((item) => (
            <div key={item.title}>
              <p className="text-white font-semibold">{item.title}</p>
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
        <h2>Try Stable Audio 3 Before You Buy</h2>
        <p>Create your first Stable Audio 3 test video with free credits, then choose a credit plan when you are ready for more generations.</p>
        <Link className="button-primary" href="/stable-audio-3">
          Try Stable Audio 3 Free
        </Link>
      </section>
    </main>
  );
}
