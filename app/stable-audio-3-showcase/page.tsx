import type { Metadata } from "next";
import { AudioShowcaseGrid } from "@/modules/media/components/AudioShowcaseGrid";
import { JsonLd } from "@/project/components/JsonLd";
import {
  EditorialSections,
  RelatedLinks,
  renderInline,
  SeoFaqSection,
  SeoHero,
} from "@/project/components/SeoPageBlocks";
import { siteConfig } from "@/project/config/site";
import { showcasePageContent } from "@/project/content/seo-pages";
import { toSchemaDateTime } from "@/project/utils/schema-date";

const route = "/stable-audio-3-showcase";
const pageUrl = `${siteConfig.url}${route}`;

export const metadata: Metadata = {
  title: {
    absolute: showcasePageContent.meta.title,
  },
  description: showcasePageContent.meta.description,
  keywords: showcasePageContent.meta.keywords,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: showcasePageContent.meta.title,
    description: showcasePageContent.meta.description,
    url: pageUrl,
    images: ["/og/home.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: showcasePageContent.meta.title,
    description: showcasePageContent.meta.description,
    images: ["/og/home.webp"],
  },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${pageUrl}#webpage`,
  url: pageUrl,
  name: showcasePageContent.hero.title,
  description: showcasePageContent.meta.description,
  hasPart: showcasePageContent.examples.map((example, index) => ({
    "@type": "AudioObject",
    position: index + 1,
    name: example.title,
    description: example.prompt || example.alt,
    contentUrl: `${siteConfig.url}${example.audio}`,
    encodingFormat: "audio/mpeg",
    uploadDate: toSchemaDateTime(example.uploadDate),
    duration: example.duration,
    isPartOf: {
      "@id": `${pageUrl}#webpage`,
    },
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: showcasePageContent.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
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
      name: "Stable Audio 3 Showcase",
      item: pageUrl,
    },
  ],
};

const showcaseRelatedLinks = [
  {
    label: "Try the generator",
    href: "/stable-audio-3",
    description: "Open the Stable Audio 3 generator and create your own audio clip in the browser.",
  },
  {
    label: "Read the prompt guide",
    href: "/how-to-use-stable-audio-3",
    description: "Prompt formulas, BPM tips, and ready-to-copy examples for all three modes.",
  },
  {
    label: "Compare pricing",
    href: "/pricing",
    description: "See credit plans, signup credits, and the cost per audio clip.",
  },
] as const;

export default function StableAudioShowcasePage() {
  return (
    <main>
      <JsonLd data={collectionSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SeoHero
        byline={showcasePageContent.hero.byline}
        disclosure={showcasePageContent.hero.disclosure}
        eyebrow={showcasePageContent.hero.eyebrow}
        lead={showcasePageContent.hero.lead}
        primaryHref="/stable-audio-3"
        primaryLabel="Open the Generator"
        secondaryHref="/how-to-use-stable-audio-3"
        secondaryLabel="Read the Prompt Guide"
        title={showcasePageContent.hero.title}
      />
      <div className="bg-slate-50 text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <EditorialSections sections={[showcasePageContent.intro]} />
          <AudioShowcaseGrid
            categories={showcasePageContent.categories}
            examples={showcasePageContent.examples}
            id="examples"
            showHomeLink
            title="Stable Audio 3 Showcase Clips"
          />
          <HowToUseSection
            id="how-to-use"
            paragraphs={showcasePageContent.howToUse.paragraphs}
            title={showcasePageContent.howToUse.title}
          />
          <div className="mx-auto w-full max-w-4xl">
            <SeoFaqSection id="faq" items={showcasePageContent.faq} title="Stable Audio 3 Showcase FAQ" />
          </div>
          <RelatedLinks currentPath={route} id="next-steps" links={showcaseRelatedLinks} />
        </div>
      </div>
    </main>
  );
}

function HowToUseSection({
  id,
  paragraphs,
  title,
}: {
  id?: string;
  paragraphs: readonly string[];
  title: string;
}) {
  return (
    <section className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-9" id={id}>
      <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{title}</h2>
      <div className="mt-5 space-y-4">
        {paragraphs.map((paragraph) => (
          <p className="text-base leading-8 text-slate-700 md:text-lg" key={paragraph}>
            {renderInline(paragraph)}
          </p>
        ))}
      </div>
    </section>
  );
}
