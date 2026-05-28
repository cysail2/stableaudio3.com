import type { Metadata } from "next";
import Image from "next/image";
import { DeferredAudio } from "@/modules/media/components/DeferredAudio";
import { JsonLd } from "@/project/components/JsonLd";
import {
  EditorialSections,
  KeyFeatureTable,
  MultiCompareTable,
  ProsCons,
  QuickTakeGrid,
  RelatedLinks,
  SeoArticleLayout,
  SeoFaqSection,
  SeoHero,
  slugifyHeading,
  SourceList,
  VisualEvidenceBreak,
} from "@/project/components/SeoPageBlocks";
import { siteConfig } from "@/project/config/site";
import { type AudioTestCard, reviewPageContent } from "@/project/content/seo-pages";
import { toSchemaDateTime } from "@/project/utils/schema-date";

const route = "/stable-audio-3-review";
const pageUrl = `${siteConfig.url}${route}`;
const publishedDate = "2026-05-27";

export const metadata: Metadata = {
  title: {
    absolute: reviewPageContent.meta.title,
  },
  description: reviewPageContent.meta.description,
  keywords: reviewPageContent.meta.keywords,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: reviewPageContent.meta.title,
    description: reviewPageContent.meta.description,
    url: pageUrl,
    images: ["/og/home.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: reviewPageContent.meta.title,
    description: reviewPageContent.meta.description,
    images: ["/og/home.webp"],
  },
};

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "Review",
  "@id": `${pageUrl}#review`,
  itemReviewed: {
    "@type": "SoftwareApplication",
    name: "Stable Audio 3",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: `${siteConfig.url}/stable-audio-3`,
  },
  name: reviewPageContent.meta.title,
  reviewBody: reviewPageContent.hero.lead,
  datePublished: toSchemaDateTime(publishedDate),
  dateModified: toSchemaDateTime(publishedDate),
  author: {
    "@type": "Person",
    name:
      reviewPageContent.hero.byline.name.replace(/^By\s+/i, "").split(",")[0]?.trim() ||
      siteConfig.name,
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${pageUrl}#article`,
  headline: reviewPageContent.hero.title,
  description: reviewPageContent.meta.description,
  image: [`${siteConfig.url}/og/home.webp`],
  mainEntityOfPage: pageUrl,
  datePublished: toSchemaDateTime(publishedDate),
  dateModified: toSchemaDateTime(publishedDate),
  author: {
    "@type": "Person",
    name:
      reviewPageContent.hero.byline.name.replace(/^By\s+/i, "").split(",")[0]?.trim() ||
      siteConfig.name,
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: reviewPageContent.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const audioSchemas = reviewPageContent.tests.map((test) => ({
  "@context": "https://schema.org",
  "@type": "AudioObject",
  name: `Test ${test.number}: ${test.title}`,
  description: test.prompt,
  contentUrl: `${siteConfig.url}${test.audio}`,
  encodingFormat: "audio/mpeg",
  uploadDate: toSchemaDateTime(test.uploadDate),
  duration: test.duration,
}));

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
      name: "Stable Audio 3 Review",
      item: pageUrl,
    },
  ],
};

const toc = [
  { id: "quick-verdict", label: "Quick Verdict" },
  ...reviewPageContent.sections.slice(0, 1).map((s) => ({ id: slugifyHeading(s.title), label: s.title })),
  { id: "key-features", label: "Key Features" },
  ...reviewPageContent.sections.slice(1, 5).map((s) => ({ id: slugifyHeading(s.title), label: s.title })),
  { id: "real-world-tests", label: "Real-World Tests" },
  ...reviewPageContent.sections.slice(5, 6).map((s) => ({ id: slugifyHeading(s.title), label: s.title })),
  { id: "strengths-and-limits", label: "Pros & Cons" },
  { id: "compare-table", label: "vs Suno · Udio · Open 1.0" },
  ...reviewPageContent.sections.slice(6).map((s) => ({ id: slugifyHeading(s.title), label: s.title })),
  { id: "sources", label: "Sources" },
  { id: "faq", label: "FAQ" },
  { id: "next-steps", label: "Next Steps" },
];

const reviewRelatedLinks = [
  {
    label: "Try the generator",
    href: "/stable-audio-3",
    description: "Open the Stable Audio 3 generator and run your own real-world test in the browser.",
  },
  {
    label: "Browse the showcase",
    href: "/stable-audio-3-showcase",
    description: "16 example clips grouped by use case — music sketches, podcast beds, video soundtracks, game SFX, ambient, and social hooks.",
  },
  {
    label: "Stable Audio 3 vs ACE-Step",
    href: "/stable-audio-3-vs-ace-step",
    description: "Head-to-head with ACE-Step: vocals and songs vs ambient and cinematic sound, with five paired audio tests.",
  },
  {
    label: "Stable Audio 3 vs Suno AI",
    href: "/stable-audio-3-vs-suno",
    description: "Head-to-head with Suno: commercial songwriting vs immersive sound design, with five paired audio tests.",
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

export default function StableAudioReviewPage() {
  return (
    <main>
      <JsonLd data={reviewSchema} />
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      {audioSchemas.map((schema) => (
        <JsonLd data={schema} key={schema.contentUrl} />
      ))}
      <SeoHero
        byline={reviewPageContent.hero.byline}
        disclosure={reviewPageContent.hero.disclosure}
        eyebrow={reviewPageContent.hero.eyebrow}
        lead={reviewPageContent.hero.lead}
        primaryHref="/stable-audio-3"
        primaryLabel="Try Stable Audio 3"
        secondaryHref="/pricing"
        secondaryLabel="Compare Pricing"
        title={reviewPageContent.hero.title}
      />
      <div className="bg-slate-50 text-slate-950">
        <SeoArticleLayout toc={toc}>
          <QuickTakeGrid id="quick-verdict" items={reviewPageContent.quickVerdict} />
          <EditorialSections
            internalLinks={[{ href: "/", label: "Stable Audio 3 homepage" }]}
            sections={reviewPageContent.sections.slice(0, 1)}
          />
          <VisualEvidenceBreak item={reviewPageContent.visualImages[0]} />
          <KeyFeatureTable id="key-features" rows={reviewPageContent.keyFeatures} />
          <EditorialSections sections={reviewPageContent.sections.slice(1, 2)} />
          <VisualEvidenceBreak item={reviewPageContent.visualImages[1]} reverse />
          <EditorialSections sections={reviewPageContent.sections.slice(2, 5)} />
          <TestsSection id="real-world-tests" tests={reviewPageContent.tests} />
          <EditorialSections sections={reviewPageContent.sections.slice(5, 6)} />
          <VisualEvidenceBreak item={reviewPageContent.visualImages[2]} />
          <ProsCons id="strengths-and-limits" pros={reviewPageContent.pros} cons={reviewPageContent.cons} />
          <MultiCompareTable id="compare-table" table={reviewPageContent.compareTable} title="Stable Audio 3 vs Other AI Music Tools" />
          <EditorialSections sections={reviewPageContent.sections.slice(6, 11)} />
          <EditorialSections sections={reviewPageContent.sections.slice(11, 12)} />
          <VisualEvidenceBreak item={reviewPageContent.visualImages[3]} reverse />
          <EditorialSections sections={reviewPageContent.sections.slice(12)} />
          <SourceList id="sources" sources={reviewPageContent.sources} />
          <SeoFaqSection id="faq" items={reviewPageContent.faq} title="Stable Audio 3 Review FAQ" />
          <RelatedLinks currentPath={route} id="next-steps" links={reviewRelatedLinks} />
        </SeoArticleLayout>
      </div>
    </main>
  );
}

function TestsSection({
  id,
  tests,
}: {
  id?: string;
  tests: readonly AudioTestCard[];
}) {
  return (
    <section className="scroll-mt-28" id={id}>
      <div className="mb-7 max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">
          Real-World Tests
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          Four Production-Style Prompts Run Through Stable Audio 3
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600 md:text-lg">
          Each test pairs the actual prompt with the generated 20-second clip, plus a structured breakdown of what worked and what fell short. Press play on each card to listen.
        </p>
      </div>
      <div className="grid gap-8">
        {tests.map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>
    </section>
  );
}

function TestCard({ test }: { test: AudioTestCard }) {
  return (
    <article
      className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
      id={test.id}
    >
      <div className="relative aspect-[16/9] w-full bg-slate-900">
        <Image
          alt={test.imageAlt}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 720px, (min-width: 768px) 80vw, 100vw"
          src={test.image}
        />
      </div>
      <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="flex flex-col gap-5">
          <header>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">
              Test {test.number}
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              {test.title}
            </h3>
          </header>
          <blockquote className="rounded-2xl border-l-4 border-violet-500 bg-violet-50/70 p-4 text-sm leading-7 text-slate-800 md:text-base">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">Prompt</p>
            <p className="mt-2 italic">&ldquo;{test.prompt}&rdquo;</p>
          </blockquote>
          <DeferredAudio
            description={test.audioAlt}
            duration={isoDurationToHuman(test.duration)}
            genre={`Test ${test.number}`}
            mode="t2a"
            src={test.audio}
            title={`Test ${test.number}: ${test.title}`}
          />
        </div>
        <div className="flex flex-col gap-4 text-slate-700">
          {test.introParagraph ? (
            <p className="text-base leading-7 md:text-lg">{test.introParagraph}</p>
          ) : null}
          {test.strengths && test.strengths.length > 0 ? (
            <ResultList items={test.strengths} label={test.strengthsLabel ?? "Strengths"} tone="positive" />
          ) : null}
          {test.weaknesses && test.weaknesses.length > 0 ? (
            <ResultList items={test.weaknesses} label={test.weaknessesLabel ?? "Weaknesses"} tone="negative" />
          ) : null}
          {test.closingParagraph ? (
            <p className="text-base leading-7 md:text-lg">{test.closingParagraph}</p>
          ) : null}
          {test.bestFor && test.bestFor.length > 0 ? (
            <ResultList items={test.bestFor} label={test.bestForLabel ?? "Best for"} tone="neutral" />
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ResultList({
  items,
  label,
  tone,
}: {
  items: readonly string[];
  label: string;
  tone: "positive" | "negative" | "neutral";
}) {
  const labelToneClass: Record<typeof tone, string> = {
    positive: "text-emerald-700",
    negative: "text-orange-700",
    neutral: "text-slate-600",
  };
  const dotToneClass: Record<typeof tone, string> = {
    positive: "bg-emerald-500",
    negative: "bg-orange-500",
    neutral: "bg-slate-400",
  };
  return (
    <div>
      <p className={`text-xs font-black uppercase tracking-[0.18em] ${labelToneClass[tone]}`}>{label}</p>
      <ul className="mt-2 grid gap-2">
        {items.map((item) => (
          <li className="flex gap-3 text-sm leading-6 text-slate-700 md:text-base" key={item}>
            <span aria-hidden="true" className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotToneClass[tone]}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "PT20S" → "20 s" for the DeferredAudio duration chip. */
function isoDurationToHuman(iso: string): string {
  const match = iso.match(/^PT(\d+)S$/);
  if (!match) return iso;
  return `${match[1]} s`;
}
