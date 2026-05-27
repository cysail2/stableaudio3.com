import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/project/components/JsonLd";
import { SeoArticleShell, type TocItem } from "@/project/components/SeoArticleShell";
import { StableAudioFAQ } from "@/project/components/StableAudioFAQ";
import { TryPromptLink } from "@/project/components/TryPromptLink";
import { siteConfig } from "@/project/config/site";
import { guideContent } from "@/project/content/guide";
import { toSchemaDateTime } from "@/project/utils/schema-date";

// Table of contents — drives the sticky outline rendered by SeoArticleShell.
// Each id must match the `id` on the corresponding <h2> below.
const guideToc: readonly TocItem[] = [
  { id: "guide-intro", label: "What Stable Audio 3 Is" },
  { id: "guide-onboarding", label: "Sign Up & Access the Generator" },
  { id: "guide-text-to-audio", label: "Text-to-Audio: How It Works" },
  { id: "guide-audio-to-audio", label: "Audio-to-Audio: Transform a Clip" },
  { id: "guide-inpaint", label: "Audio Inpaint: Regenerate a Region" },
  { id: "guide-settings", label: "Choose the Right Settings" },
  { id: "guide-vocabulary", label: "Genre & Mood Vocabulary" },
  { id: "guide-iteration", label: "How to Iterate" },
  { id: "guide-mistakes", label: "Common Mistakes & Fixes" },
  { id: "guide-faq", label: "FAQ" },
];

const GUIDE_PUBLISHED_DATE = "2026-05-21";
const GUIDE_MODIFIED_DATE = "2026-05-21";

export const metadata: Metadata = {
  title: {
    absolute: "How to Use Stable Audio 3 — Prompt Guide & Examples (2026)",
  },
  description:
    "Prompt formulas, BPM tips, and ready-to-copy examples for three modes — text-to-audio, audio editing, and inpaint. Plus genre vocabulary and mistakes to avoid.",
  keywords: [
    "how to use Stable Audio 3",
    "Stable Audio 3 prompt guide",
    "text to audio prompts",
    "audio inpaint guide",
    "AI music prompts",
  ],
  alternates: {
    canonical: `${siteConfig.url}/how-to-use-stable-audio-3`,
  },
  openGraph: {
    title: "How to Use Stable Audio 3 — Prompt Guide & Examples (2026)",
    description:
      "Prompt formulas, BPM tips, and ready-to-copy examples for three modes — text-to-audio, audio editing, and inpaint. Plus genre vocabulary and mistakes to avoid.",
    url: `${siteConfig.url}/how-to-use-stable-audio-3`,
    images: ["/og/how-to-use-stable-audio-3.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Use Stable Audio 3 — Prompt Guide & Examples (2026)",
    description:
      "Prompt formulas, BPM tips, and ready-to-copy examples for three modes — text-to-audio, audio editing, and inpaint. Plus genre vocabulary and mistakes to avoid.",
    images: ["/og/how-to-use-stable-audio-3.webp"],
  },
};

const guideArticleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${siteConfig.url}/how-to-use-stable-audio-3#article`,
  headline: "How to Use Stable Audio 3 AI Audio Generator",
  description: metadata.description,
  image: [`${siteConfig.url}/og/how-to-use-stable-audio-3.webp`],
  mainEntityOfPage: `${siteConfig.url}/how-to-use-stable-audio-3`,
  url: `${siteConfig.url}/how-to-use-stable-audio-3`,
  datePublished: toSchemaDateTime(GUIDE_PUBLISHED_DATE),
  dateModified: toSchemaDateTime(GUIDE_MODIFIED_DATE),
  author: {
    "@type": "Organization",
    name: siteConfig.name,
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
  },
  about: {
    "@type": "SoftwareApplication",
    name: siteConfig.productName,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: guideContent.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const guidePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteConfig.url}/how-to-use-stable-audio-3#webpage`,
  url: `${siteConfig.url}/how-to-use-stable-audio-3`,
  name: metadata.title,
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
      name: "How to Use Stable Audio 3",
      item: `${siteConfig.url}/how-to-use-stable-audio-3`,
    },
  ],
};

export default function GuidePage() {
  return (
    <main>
      <JsonLd data={guideArticleSchema} />
      <JsonLd data={guidePageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      {/* SeoArticleShell renders the floating TOC sidebar + handles layout.
          It already wraps content in a max-w-5xl container with proper padding. */}
      <SeoArticleShell toc={guideToc}>
      <article className="prose prose-slate max-w-none">
        <div className="text-center mb-16">
          <h1 className="!text-3xl sm:!text-4xl md:!text-6xl font-extrabold tracking-tight mb-6 !leading-[1.1]">
            How to Use Stable Audio 3 AI Audio Generator
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-12 leading-relaxed italic max-w-3xl mx-auto">
            {guideContent.hero.lead}
          </p>
        </div>

        {/* Workflow illustration — text prompt → Stable Audio 3 → waveform output.
            Light-theme version: white card surface, violet primary, pink secondary, amber tertiary. */}
        <div className="surface-card !p-0 overflow-hidden mb-12 border border-slate-200 bg-white">
          <svg className="w-full h-auto" viewBox="0 0 860 340" xmlns="http://www.w3.org/2000/svg">
            <rect width="860" height="340" fill="#ffffff" />
            {/* Soft radial wash behind the engine box */}
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </radialGradient>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#7c3aed" />
              </marker>
              <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#ec4899" />
              </marker>
            </defs>
            <circle cx="430" cy="170" r="180" fill="url(#centerGlow)" />

            {/* Left: text prompt card */}
            <rect x="40" y="60" width="240" height="220" rx="14" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            <text x="160" y="100" textAnchor="middle" fill="#7c3aed" fontFamily="monospace" fontSize="11" fontWeight="700" letterSpacing="2">TEXT PROMPT</text>
            <rect x="60" y="116" width="200" height="12" rx="4" fill="#e2e8f0" />
            <rect x="60" y="136" width="160" height="12" rx="4" fill="#e2e8f0" />
            <rect x="60" y="156" width="180" height="12" rx="4" fill="#e2e8f0" />
            <rect x="60" y="176" width="140" height="12" rx="4" fill="#e2e8f0" />
            <text x="160" y="232" textAnchor="middle" fill="#475569" fontFamily="monospace" fontSize="10">A cinematic ambient track</text>
            <text x="160" y="249" textAnchor="middle" fill="#475569" fontFamily="monospace" fontSize="10">with slow synth pads, 70 BPM…</text>

            {/* Arrow → engine */}
            <line x1="295" y1="170" x2="375" y2="170" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#arr)" />

            {/* Center: Stable Audio 3 engine — violet primary, the visual anchor */}
            <rect x="375" y="100" width="110" height="140" rx="12" fill="#7c3aed" stroke="#6d28d9" strokeWidth="1.5" />
            <circle cx="430" cy="130" r="14" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="6 3" />
            <text x="430" y="166" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="11" fontWeight="700">STABLE</text>
            <text x="430" y="182" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="11" fontWeight="700">AUDIO 3</text>
            <text x="430" y="202" textAnchor="middle" fill="#ddd6fe" fontFamily="monospace" fontSize="9" letterSpacing="1">AI ENGINE</text>

            {/* Arrow → output, pink */}
            <line x1="485" y1="170" x2="565" y2="170" stroke="#ec4899" strokeWidth="2" markerEnd="url(#arr2)" />

            {/* Right: audio output card */}
            <rect x="565" y="60" width="255" height="220" rx="14" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            <text x="692" y="100" textAnchor="middle" fill="#ec4899" fontFamily="monospace" fontSize="11" fontWeight="700" letterSpacing="2">AUDIO OUTPUT</text>
            {/* Waveform bars — violet primary, tonal */}
            <g fill="#7c3aed">
              <rect x="590" y="160" width="3" height="20" rx="1.5" />
              <rect x="600" y="148" width="3" height="44" rx="1.5" />
              <rect x="610" y="154" width="3" height="32" rx="1.5" />
              <rect x="620" y="138" width="3" height="64" rx="1.5" />
              <rect x="630" y="146" width="3" height="48" rx="1.5" />
              <rect x="640" y="130" width="3" height="80" rx="1.5" />
              <rect x="650" y="144" width="3" height="52" rx="1.5" />
              <rect x="660" y="152" width="3" height="36" rx="1.5" />
              <rect x="670" y="140" width="3" height="60" rx="1.5" />
              <rect x="680" y="148" width="3" height="44" rx="1.5" />
              <rect x="690" y="134" width="3" height="72" rx="1.5" />
              <rect x="700" y="146" width="3" height="48" rx="1.5" />
              <rect x="710" y="152" width="3" height="36" rx="1.5" />
              <rect x="720" y="142" width="3" height="56" rx="1.5" />
              <rect x="730" y="150" width="3" height="40" rx="1.5" />
              <rect x="740" y="138" width="3" height="64" rx="1.5" />
              <rect x="750" y="156" width="3" height="28" rx="1.5" />
              <rect x="760" y="148" width="3" height="44" rx="1.5" />
              <rect x="770" y="144" width="3" height="52" rx="1.5" />
              <rect x="780" y="152" width="3" height="36" rx="1.5" />
              <rect x="790" y="158" width="3" height="24" rx="1.5" />
            </g>
            <text x="692" y="264" textAnchor="middle" fill="#475569" fontFamily="monospace" fontSize="9">30s · Cinematic Ambient</text>
          </svg>
          <div className="bg-slate-50 p-4 text-center text-sm text-slate-500 italic">
            Stable Audio 3 turns a text prompt into a downloadable audio clip — entirely in your browser.
          </div>
        </div>

        {/* First H2 section — mandatory homepage link per CONTENT_GUIDE.md */}
        <section className="mb-16">
          <h2 className="!text-2xl sm:!text-3xl font-bold mb-6 text-slate-900 border-l-4 border-violet-600 pl-4 !mt-0 scroll-mt-24" id="guide-intro">
            {guideContent.intro.title}
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            {guideContent.intro.body[0]}
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            <Link
              className="text-violet-700 underline decoration-violet-500/40 underline-offset-4 hover:decoration-violet-400"
              href="/"
              title="Stable Audio 3 home"
            >
              Stableaudio3.com
            </Link>{" "}
            is an online product experience for that workflow. This guide walks through all
            three modes, the prompt formula that works across them, genre and instrument
            vocabulary, BPM and key guidance, and the common mistakes that make AI audio sound
            generic. The same guidance works whether you are sketching music, building ambient
            beds, prototyping game audio, or producing podcast intros.
          </p>
        </section>

        <hr className="border-slate-200 my-16" />

        <section className="mb-16">
          <h2 className="!text-2xl sm:!text-3xl font-bold mb-6 sm:mb-8 text-slate-900 border-l-4 border-violet-600 pl-4 scroll-mt-24" id="guide-onboarding">
            Step 1 — Sign Up and Access the Generator
          </h2>
          <div className="space-y-4">
            {guideContent.onboarding.map((step, i) => (
              <div key={i} className="surface-card flex gap-6 items-start hover:border-violet-300 transition-colors">
                <span className="text-2xl font-black text-cyan-500 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 rounded-2xl bg-violet-50 border border-violet-200 flex gap-4 items-start">
            <span className="text-xl">💡</span>
            <p className="text-violet-800 text-sm md:text-base leading-relaxed">
              <strong>First generation tip:</strong> Keep your first test short — a 15–30 second clip is the fastest way to check whether your prompt direction is working before spending more credits on longer or higher-quality outputs. The{" "}
              <Link
                className="text-violet-700 underline decoration-violet-500/40 underline-offset-4 hover:decoration-violet-400"
                href="/pricing"
                title="Compare Stable Audio 3 pricing"
              >
                Stable Audio 3 pricing
              </Link>{" "}
              page explains how credit packs map to short-clip equivalents.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-2xl sm:!text-3xl font-bold mb-6 sm:mb-8 text-slate-900 border-l-4 border-violet-600 pl-4 scroll-mt-24" id="guide-text-to-audio">
            Step 2 — Text-to-Audio: How It Works
          </h2>
          <p className="text-slate-700 mb-8">
            Text-to-Audio is the primary mode for generating audio from scratch. You describe the clip you want — genre, instruments, mood, tempo — and Stable Audio 3 produces an audio file.
          </p>

          <div className="bg-white border border-violet-300 rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden group">
            <div className="absolute top-4 right-6 text-[10px] font-bold tracking-widest text-cyan-500/60 uppercase">
              Prompt Formula
            </div>
            <div className="flex flex-wrap items-center gap-3 text-lg md:text-xl font-bold text-slate-900 leading-loose">
              {guideContent.formula.elements.map((el, i) => (
                <span key={el} className="flex items-center gap-3">
                  <span className="bg-violet-50 border border-violet-300 px-3 py-1 rounded-lg text-violet-600">
                    {el}
                  </span>
                  {i < guideContent.formula.elements.length - 1 && <span className="text-slate-600">+</span>}
                </span>
              ))}
            </div>
          </div>

          <h3 className="text-xl font-bold mb-6">Prompt Examples You Can Copy</h3>
          <div className="space-y-6">
            {guideContent.examples.map((ex) => (
              <div key={ex.category} className="border-l-4 border-orange-500 bg-slate-50 rounded-r-2xl p-6">
                <div className="text-orange-500 text-[10px] font-black tracking-widest uppercase mb-2">
                  {ex.category}
                </div>
                <p className="text-slate-700 text-sm md:text-base italic mb-4">&quot;{ex.prompt}&quot;</p>
                <TryPromptLink mode="text-to-audio" prompt={ex.prompt} />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-2xl sm:!text-3xl font-bold mb-6 sm:mb-8 text-slate-900 border-l-4 border-violet-600 pl-4 scroll-mt-24" id="guide-audio-to-audio">
            Step 3 — Audio-to-Audio: Transform an Existing Clip
          </h2>
          <p className="text-slate-700 mb-8">
            Audio-to-Audio takes a clip you upload and reshapes it based on a transformation prompt. The model preserves the timing and structure of the source while changing genre, instrumentation, or feel.
          </p>
          <div className="space-y-4 mb-8">
            {guideContent.audioToAudioWorkflow.map((step, i) => (
              <div key={i} className="surface-card flex gap-6 items-start">
                <span className="text-2xl font-black text-cyan-500 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-2xl bg-orange-50 border border-orange-200 flex gap-4 items-start">
            <span className="text-xl">⚠️</span>
            <p className="text-orange-800 text-sm md:text-base leading-relaxed">
              Only upload audio you have rights to use. Uploading copyrighted recordings, signed songs, or someone else&apos;s production without permission is not allowed under the Terms of Service.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-2xl sm:!text-3xl font-bold mb-6 sm:mb-8 text-slate-900 border-l-4 border-violet-600 pl-4 scroll-mt-24" id="guide-inpaint">
            Step 4 — Audio Inpaint: Regenerate a Region
          </h2>
          <p className="text-slate-700 mb-8">
            Audio Inpaint lets you select a region of an uploaded clip on the waveform and regenerate just that section. The rest of the clip stays untouched. Use it to fix a problem section, remove an unwanted sound, swap an instrument, or extend a loop.
          </p>
          <div className="space-y-4 mb-8">
            {guideContent.inpaintWorkflow.map((step, i) => (
              <div key={i} className="surface-card flex gap-6 items-start">
                <span className="text-2xl font-black text-cyan-500 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-2xl sm:!text-3xl font-bold mb-6 sm:mb-8 text-slate-900 border-l-4 border-violet-600 pl-4 scroll-mt-24" id="guide-settings">
            Step 5 — Choose the Right Settings
          </h2>
          <div className="overflow-x-auto surface-card !p-0 border border-slate-200">
            <table className="w-full text-left border-collapse min-w-[480px] sm:min-w-[600px]">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 text-violet-600 font-bold uppercase text-xs tracking-wider">Setting</th>
                  <th className="p-4 text-violet-600 font-bold uppercase text-xs tracking-wider">Options</th>
                  <th className="p-4 text-violet-600 font-bold uppercase text-xs tracking-wider">When to use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {guideContent.settings.map((s) => (
                  <tr key={s.setting} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-slate-900 font-bold">{s.setting}</td>
                    <td className="p-4 text-slate-600 font-mono text-sm">{s.options}</td>
                    <td className="p-4 text-slate-600 text-sm">{s.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-2xl sm:!text-3xl font-bold mb-6 sm:mb-8 text-slate-900 border-l-4 border-violet-600 pl-4 scroll-mt-24" id="guide-vocabulary">
            Step 6 — Genre, Mood, and Production Vocabulary
          </h2>
          <h3 className="text-xl font-bold mb-6">Genre Vocabulary</h3>
          <div className="grid gap-4 sm:grid-cols-2 mb-12">
            {guideContent.genreTerms.map((item) => (
              <div key={item.term} className="surface-card !p-5 border border-slate-200 hover:border-violet-300 transition-colors">
                <strong className="block text-violet-600 mb-1">{item.term}</strong>
                <span className="text-sm text-slate-600">{item.definition}</span>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold mb-6">Mood Words That Shape the Feel</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {guideContent.moodTerms.map((item) => (
              <div key={item.term} className="surface-card !p-5 border border-slate-200">
                <strong className="block text-violet-600 mb-1">{item.term}</strong>
                <span className="text-sm text-slate-600">{item.definition}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-2xl sm:!text-3xl font-bold mb-6 sm:mb-8 text-slate-900 border-l-4 border-violet-600 pl-4 scroll-mt-24" id="guide-iteration">
            Step 7 — How to Iterate for Better Results
          </h2>
          <div className="space-y-4 mb-8">
            {guideContent.iteration.map((step, i) => (
              <div key={i} className="surface-card flex gap-6 items-start">
                <span className="text-2xl font-black text-cyan-500 leading-none">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-2xl sm:!text-3xl font-bold mb-6 sm:mb-8 text-slate-900 border-l-4 border-violet-600 pl-4 scroll-mt-24" id="guide-mistakes">
            Common Mistakes and How to Fix Them
          </h2>
          <div className="overflow-x-auto surface-card !p-0 border border-slate-200">
            <table className="w-full text-left border-collapse min-w-[480px] sm:min-w-[600px]">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 text-violet-600 font-bold uppercase text-xs tracking-wider">Problem</th>
                  <th className="p-4 text-violet-600 font-bold uppercase text-xs tracking-wider">Likely Cause</th>
                  <th className="p-4 text-violet-600 font-bold uppercase text-xs tracking-wider">Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {guideContent.mistakes.map((m) => (
                  <tr key={m.problem} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-slate-900 font-bold">{m.problem}</td>
                    <td className="p-4 text-slate-600 text-sm">{m.cause}</td>
                    <td className="p-4 text-teal-400 font-semibold text-sm">{m.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-24 scroll-mt-24" id="guide-faq">
          <StableAudioFAQ items={guideContent.faq} />
        </section>

        <section
          className="bg-white border border-violet-300 rounded-3xl p-10 md:p-16 text-center shadow-2xl shadow-violet-500/5"
          id="next-steps"
        >
          <h2 className="!text-3xl md:!text-4xl font-black mb-4 !mt-0">Ready to Generate Your First Audio Clip?</h2>
          <p className="text-slate-600 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
            Open the Stable Audio 3 AI Audio Generator and start creating music, ambient, or SFX from a text prompt — or edit and inpaint existing audio.
          </p>
          <Link
            className="button-primary !py-4 !px-12 !h-auto !text-lg !rounded-xl"
            href="/stable-audio-3"
            title="Open the Stable Audio 3 AI audio generator"
          >
            Start Generating Free →
          </Link>
        </section>
      </article>
      </SeoArticleShell>
    </main>
  );
}
