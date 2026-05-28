import type { Metadata } from "next";
import { DeferredAudio } from "@/modules/media/components/DeferredAudio";
import { PairedAudioCompare } from "@/modules/media/components/PairedAudioCompare";
import { JsonLd } from "@/project/components/JsonLd";
import {
  ComparisonTable,
  EditorialSections,
  QuickTakeGrid,
  RelatedLinks,
  renderInline,
  SeoArticleLayout,
  SeoFaqSection,
  SeoHero,
  slugifyHeading,
  SourceList,
  VisualEvidenceBreak,
} from "@/project/components/SeoPageBlocks";
import { siteConfig } from "@/project/config/site";
import { aceStepComparisonContent } from "@/project/content/seo-pages";
import { toSchemaDateTime } from "@/project/utils/schema-date";

const route = "/stable-audio-3-vs-ace-step";
const pageUrl = `${siteConfig.url}${route}`;
const publishedDate = "2026-05-28";
const c = aceStepComparisonContent;

export const metadata: Metadata = {
  title: { absolute: c.meta.title },
  description: c.meta.description,
  keywords: c.meta.keywords,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: c.meta.title,
    description: c.meta.description,
    url: pageUrl,
    images: ["/og/home.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: c.meta.title,
    description: c.meta.description,
    images: ["/og/home.webp"],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${pageUrl}#article`,
  headline: c.hero.title,
  description: c.meta.description,
  image: [`${siteConfig.url}/og/home.webp`],
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

// AudioObject schema for every clip on the page: 2 standalone demos + 10
// paired test clips (5 examples × 2 models).
const audioSchemas = [
  { audio: c.demoAceStep.audio, name: "ACE-Step vocal demo — Summer Nights", desc: c.demoAceStep.alt, duration: c.demoAceStep.duration },
  { audio: c.demoStableAudio.audio, name: "Stable Audio 3 ambient demo", desc: c.demoStableAudio.alt, duration: c.demoStableAudio.duration },
  ...c.testPairs.flatMap((pair) => [
    { audio: pair.aceStep.audio, name: `ACE-Step — ${pair.title}`, desc: pair.aceStep.alt, duration: pair.aceStep.duration },
    { audio: pair.stableAudio.audio, name: `Stable Audio 3 — ${pair.title}`, desc: pair.stableAudio.alt, duration: pair.stableAudio.duration },
  ]),
].map((item) => ({
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
    { "@type": "ListItem", position: 2, name: "Stable Audio 3 vs ACE-Step", item: pageUrl },
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
    label: "Browse the showcase",
    href: "/stable-audio-3-showcase",
    description: "16 example clips by use case — ambient, cinematic, SFX, and more, each with its prompt.",
  },
  {
    label: "Compare pricing",
    href: "/pricing",
    description: "Credit plans, 100 free signup credits, and what each generation costs.",
  },
] as const;

export default function StableAudioVsAceStepPage() {
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
      <div className="bg-slate-50 text-slate-950">
        <SeoArticleLayout toc={toc}>
          <QuickTakeGrid id="quick-verdict" items={c.quickVerdict} />
          <EditorialSections
            internalLinks={[{ href: "/", label: "Stable Audio 3 homepage" }]}
            sections={c.sections.slice(0, 1)}
          />
          <VisualEvidenceBreak item={c.coreDirections[0]} />
          <VisualEvidenceBreak item={c.coreDirections[1]} reverse />
          <ComparisonTable competitor="ACE-Step" id="compare-table" rows={c.comparisonRows} />
          <EditorialSections sections={c.sections.slice(1, 2)} />
          <DemoClip clip={c.demoAceStep} label="ACE-Step" mode="inpaint" />
          <EditorialSections sections={c.sections.slice(2, 3)} />
          <DemoClip clip={c.demoStableAudio} label="Stable Audio 3" mode="t2a" />
          <PairedAudioCompare id="real-prompt-tests" pairs={c.testPairs} title="Real Prompt Test Examples" />
          <section className="scroll-mt-28" id="pros-cons">
            <div className="grid gap-6 lg:grid-cols-2">
              <ToolProsCons cons={c.aceStepCons} pros={c.aceStepPros} tool="ACE-Step" />
              <ToolProsCons cons={c.stableAudioCons} pros={c.stableAudioPros} tool="Stable Audio 3" />
            </div>
          </section>
          <EditorialSections sections={c.sections.slice(3)} />
          <FinalVerdict verdict={c.finalVerdict} />
          <SourceList id="sources" sources={c.sources} />
          <SeoFaqSection id="faq" items={c.faq} title="Stable Audio 3 vs ACE-Step FAQ" />
          <RelatedLinks currentPath={route} id="next-steps" links={vsRelatedLinks} />
        </SeoArticleLayout>
      </div>
    </main>
  );
}

function DemoClip({
  clip,
  label,
  mode,
}: {
  clip: typeof aceStepComparisonContent.demoAceStep;
  label: string;
  mode: "t2a" | "inpaint";
}) {
  const human = clip.duration.match(/^PT(\d+)S$/)?.[1];
  return (
    <figure className="mx-auto w-full max-w-2xl">
      <DeferredAudio
        description={clip.alt}
        duration={human ? `${human} s` : clip.duration}
        genre={label}
        mode={mode}
        src={clip.audio}
        title={`${label} — demo`}
      />
      <figcaption className="mt-3 text-sm leading-6 text-slate-600">{clip.caption}</figcaption>
    </figure>
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
    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{tool}</h2>
      <div className="mt-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">Pros</p>
        <ul className="mt-3 space-y-3">
          {pros.map((item) => (
            <li className="flex gap-3 text-sm leading-6 text-slate-700 md:text-base" key={item}>
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">Cons</p>
        <ul className="mt-3 space-y-3">
          {cons.map((item) => (
            <li className="flex gap-3 text-sm leading-6 text-slate-700 md:text-base" key={item}>
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FinalVerdict({ verdict }: { verdict: typeof aceStepComparisonContent.finalVerdict }) {
  return (
    <section className="scroll-mt-28 grid gap-6" id="final-verdict">
      <VisualEvidenceBreak
        item={{ title: verdict.title, body: verdict.paragraphs[0] ?? "", image: verdict.image, alt: verdict.alt, badge: "Verdict" }}
      />
      {verdict.paragraphs.length > 1 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-9">
          <div className="space-y-4">
            {verdict.paragraphs.slice(1).map((paragraph) => (
              <p className="text-base leading-8 text-slate-700 md:text-lg" key={paragraph}>
                {renderInline(paragraph)}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
