import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { PairedAudioCompare } from "@/modules/media/components/PairedAudioCompare";
import { JsonLd } from "@/project/components/JsonLd";
import {
  ComparisonTable,
  RelatedLinks,
  renderInline,
  SeoArticleLayout,
  SeoFaqSection,
  SeoHero,
  slugifyHeading,
  SourceList,
} from "@/project/components/SeoPageBlocks";
import { siteConfig } from "@/project/config/site";
import { sunoComparisonContent } from "@/project/content/seo-pages";
import { toSchemaDateTime } from "@/project/utils/schema-date";

// NOTE: Prototype — this page uses a clean "article flow" layout (white
// background, single readable column, full-width uncropped images, prose
// sections instead of stacked cards) instead of the shared SeoArticleShell /
// EditorialSections / VisualEvidenceBreak card template. If approved, the
// clean primitives below get promoted into the shared component library and
// rolled out to the other content pages on both sites.

const route = "/stable-audio-3-vs-suno";
const pageUrl = `${siteConfig.url}${route}`;
const publishedDate = "2026-05-28";
const c = sunoComparisonContent;

export const metadata: Metadata = {
  title: { absolute: c.meta.title },
  description: c.meta.description,
  keywords: c.meta.keywords,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: c.meta.title,
    description: c.meta.description,
    url: pageUrl,
    images: ["/vs-suno/vs-suno-hero.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: c.meta.title,
    description: c.meta.description,
    images: ["/vs-suno/vs-suno-hero.webp"],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${pageUrl}#article`,
  headline: c.hero.title,
  description: c.meta.description,
  image: [`${siteConfig.url}/vs-suno/vs-suno-hero.webp`],
  mainEntityOfPage: pageUrl,
  datePublished: toSchemaDateTime(publishedDate),
  dateModified: toSchemaDateTime(publishedDate),
  author: {
    "@type": "Person",
    name: c.hero.byline.name.replace(/^By\s+/i, "").split(",")[0]?.trim() || siteConfig.name,
  },
  publisher: { "@type": "Organization", name: siteConfig.name },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: c.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

// AudioObject schema for all 10 paired test clips (5 examples × 2 models).
const audioSchemas = c.testPairs
  .flatMap((pair) => [
    { audio: pair.competitor.audio, name: `Suno AI — ${pair.title}`, desc: pair.competitor.alt, duration: pair.competitor.duration },
    { audio: pair.stableAudio.audio, name: `Stable Audio 3 — ${pair.title}`, desc: pair.stableAudio.alt, duration: pair.stableAudio.duration },
  ])
  .map((item) => ({
    "@context": "https://schema.org",
    "@type": "AudioObject",
    name: item.name,
    description: item.desc,
    contentUrl: `${siteConfig.url}${item.audio}`,
    encodingFormat: "audio/mpeg",
    uploadDate: toSchemaDateTime(publishedDate),
    duration: item.duration,
  }));

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    { "@type": "ListItem", position: 2, name: "Stable Audio 3 vs Suno AI", item: pageUrl },
  ],
};

const toc = [
  { id: "quick-verdict", label: "Quick Verdict" },
  ...c.sections.slice(0, 1).map((s) => ({ id: slugifyHeading(s.title), label: s.title })),
  { id: "compare-table", label: "Comparison Table" },
  ...c.sections.slice(1, 3).map((s) => ({ id: slugifyHeading(s.title), label: s.title })),
  { id: "real-prompt-tests", label: "Real Prompt Tests" },
  { id: "pros-cons", label: "Pros & Cons" },
  ...c.sections.slice(3).map((s) => ({ id: slugifyHeading(s.title), label: s.title })),
  { id: "final-verdict", label: "Final Verdict" },
  { id: "sources", label: "Sources" },
  { id: "faq", label: "FAQ" },
  { id: "next-steps", label: "Next Steps" },
];

const vsRelatedLinks = [
  {
    label: "Try the generator",
    href: "/stable-audio-3",
    description: "Open Stable Audio 3 with 100 free credits and test the ambient + cinematic side yourself.",
  },
  {
    label: "Read the full review",
    href: "/stable-audio-3-review",
    description: "Our standalone Stable Audio 3 review with real-world prompt tests, strengths, and limits.",
  },
  {
    label: "vs ACE-Step",
    href: "/stable-audio-3-vs-ace-step",
    description: "The other comparison — Stable Audio 3 against the open-source ACE-Step music model.",
  },
  {
    label: "Browse the showcase",
    href: "/stable-audio-3-showcase",
    description: "16 example clips by use case — ambient, cinematic, SFX, and more, each with its prompt.",
  },
] as const;

export default function StableAudioVsSunoPage() {
  return (
    <main>
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      {audioSchemas.map((schema) => (
        <JsonLd data={schema} key={schema.contentUrl} />
      ))}
      <SeoHero
        byline={c.hero.byline}
        disclosure={c.hero.disclosure}
        eyebrow={c.hero.eyebrow}
        lead={c.hero.lead}
        primaryHref="/stable-audio-3"
        primaryLabel="Try Stable Audio 3"
        secondaryHref="/stable-audio-3-review"
        secondaryLabel="Read the Review"
        title={c.hero.title}
      />
      {/* Original SeoArticleLayout shell — keeps the floating TOC + max-w-5xl
          content width. Only the content blocks inside are the new clean
          (card-free prose + uncropped images) primitives. */}
      <SeoArticleLayout toc={toc}>
        <figure>
          <Image
            alt={c.hero.heroImageAlt}
            className="h-auto w-full rounded-2xl border border-slate-200"
            height={853}
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            src={c.hero.heroImage}
            width={1280}
          />
        </figure>
        <QuickVerdict id="quick-verdict" items={c.quickVerdict} />
        <Prose id={slugifyHeading(c.sections[0].title)} section={c.sections[0]} />
        <CoreDirections items={c.coreDirections} />
        <ComparisonTable competitor="Suno AI" id="compare-table" rows={c.comparisonRows} />
        <Prose id={slugifyHeading(c.sections[1].title)} section={c.sections[1]} />
        <Prose id={slugifyHeading(c.sections[2].title)} section={c.sections[2]} />
        <PairedAudioCompare competitorLabel="Suno AI" id="real-prompt-tests" pairs={c.testPairs} title="Real Prompt Test Examples" />
        <section className="scroll-mt-28" id="pros-cons">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Pros &amp; Cons</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <ToolProsCons cons={c.sunoCons} pros={c.sunoPros} tool="Suno AI" />
            <ToolProsCons cons={c.stableAudioCons} pros={c.stableAudioPros} tool="Stable Audio 3" />
          </div>
        </section>
        <Prose id={slugifyHeading(c.sections[3].title)} section={c.sections[3]} />
        <FinalVerdict verdict={c.finalVerdict} />
        <SourceList id="sources" sources={c.sources} />
        <SeoFaqSection id="faq" items={c.faq} title="Stable Audio 3 vs Suno AI FAQ" />
        <RelatedLinks currentPath={route} id="next-steps" links={vsRelatedLinks} />
      </SeoArticleLayout>
    </main>
  );
}

function QuickVerdict({
  id,
  items,
}: {
  id?: string;
  items: readonly { label: string; value: string }[];
}) {
  return (
    <section className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8" id={id}>
      <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">{item.label}</dt>
            <dd className="mt-2 text-base leading-7 text-slate-700">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Clean prose section — heading + paragraphs in natural flow, no card wrapper. */
function Prose({
  id,
  section,
}: {
  id?: string;
  section: { title: string; subheadings?: readonly string[]; paragraphs: readonly string[] };
}) {
  return (
    <section className="scroll-mt-28" id={id}>
      <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{section.title}</h2>
      <div className="mt-5 space-y-5">
        {section.paragraphs.map((paragraph, index) => (
          <div key={paragraph}>
            {section.subheadings?.[index] ? (
              <h3 className="mb-2 mt-2 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
                {section.subheadings[index]}
              </h3>
            ) : null}
            <p className="text-[1.05rem] leading-8 text-slate-700">{renderInline(paragraph)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Two tool philosophies, side by side, with full uncropped illustrations. */
function CoreDirections({
  items,
}: {
  items: readonly { title: string; body: string; image: string; alt: string; badge?: string }[];
}) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {items.map((item) => (
        <figure key={item.title}>
          <Image
            alt={item.alt}
            className="h-auto w-full rounded-2xl border border-slate-200"
            height={1024}
            sizes="(min-width: 768px) 360px, 100vw"
            src={item.image}
            width={1280}
          />
          <figcaption className="mt-4">
            {item.badge ? (
              <span className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">{item.badge}</span>
            ) : null}
            <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950">{item.title}</h3>
            <p className="mt-2 text-base leading-7 text-slate-600">{item.body}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function ToolProsCons({
  cons,
  pros,
  tool,
}: {
  cons: readonly string[];
  pros: readonly string[];
  tool: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold tracking-tight text-slate-950">{tool}</h3>
      <div className="mt-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">Pros</p>
        <ul className="mt-3 space-y-2.5">
          {pros.map((item) => (
            <li className="flex gap-3 text-sm leading-6 text-slate-700" key={item}>
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">Cons</p>
        <ul className="mt-3 space-y-2.5">
          {cons.map((item) => (
            <li className="flex gap-3 text-sm leading-6 text-slate-700" key={item}>
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FinalVerdict({ verdict }: { verdict: typeof sunoComparisonContent.finalVerdict }) {
  return (
    <section className="scroll-mt-28" id="final-verdict">
      <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{verdict.title}</h2>
      <figure className="mt-5">
        <Image
          alt={verdict.alt}
          className="h-auto w-full rounded-2xl border border-slate-200"
          height={853}
          sizes="(min-width: 1024px) 768px, 100vw"
          src={verdict.image}
          width={1280}
        />
      </figure>
      <div className="mt-5 space-y-5">
        {verdict.paragraphs.map((paragraph) => (
          <p className="text-[1.05rem] leading-8 text-slate-700" key={paragraph}>
            {renderInline(paragraph)}
          </p>
        ))}
      </div>
    </section>
  );
}

