import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/project/components/JsonLd";
import { StableAudioFAQ } from "@/project/components/StableAudioFAQ";
import { siteConfig } from "@/project/config/site";
import { guideContent } from "@/project/content/guide";
import { toSchemaDateTime } from "@/project/utils/schema-date";

const GUIDE_PUBLISHED_DATE = "2026-05-21";
const GUIDE_MODIFIED_DATE = "2026-05-21";

export const metadata: Metadata = {
  title: {
    absolute: "How to Use Stable Audio 3 - AI Audio Prompt Guide",
  },
  description:
    "Learn how to use Stable Audio 3 for text-to-audio, audio editing, and audio inpainting. Prompt formulas, BPM tips, genre vocabulary, and ready-to-copy examples.",
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
    title: "How to Use Stable Audio 3 - AI Audio Prompt Guide",
    description:
      "Learn how to use Stable Audio 3 for text-to-audio, audio editing, and audio inpainting. Prompt formulas, BPM tips, genre vocabulary, and ready-to-copy examples.",
    url: `${siteConfig.url}/how-to-use-stable-audio-3`,
    images: ["/og/how-to-use-stable-audio-3.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Use Stable Audio 3 - AI Audio Prompt Guide",
    description:
      "Learn how to use Stable Audio 3 for text-to-audio, audio editing, and audio inpainting. Prompt formulas, BPM tips, genre vocabulary, and ready-to-copy examples.",
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
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 lg:py-24">
      <JsonLd data={guideArticleSchema} />
      <JsonLd data={guidePageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <article className="prose prose-invert prose-slate max-w-none">
        <div className="text-center mb-16">
          <h1 className="!text-4xl md:!text-6xl font-extrabold tracking-tight mb-6 !leading-[1.1]">
            How to Use Stable Audio 3 AI Audio Generator
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-12 leading-relaxed italic max-w-3xl mx-auto">
            {guideContent.hero.lead}
          </p>
        </div>

        {/* Workflow illustration — text prompt → Stable Audio 3 → waveform output */}
        <div className="surface-card !p-0 overflow-hidden mb-12 border border-white/10 bg-slate-950">
          <svg className="w-full h-auto" viewBox="0 0 860 340" xmlns="http://www.w3.org/2000/svg">
            <rect width="860" height="340" fill="#020617" />
            {/* Left: text prompt */}
            <rect x="40" y="60" width="240" height="220" rx="14" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            <text x="160" y="100" textAnchor="middle" fill="#22d3ee" fontFamily="monospace" fontSize="11" fontWeight="700" letterSpacing="2">TEXT PROMPT</text>
            <rect x="60" y="116" width="200" height="12" rx="4" fill="#1e293b" />
            <rect x="60" y="136" width="160" height="12" rx="4" fill="#1e293b" />
            <rect x="60" y="156" width="180" height="12" rx="4" fill="#1e293b" />
            <rect x="60" y="176" width="140" height="12" rx="4" fill="#1e293b" />
            <text x="160" y="232" textAnchor="middle" fill="#2dd4bf" fontFamily="monospace" fontSize="10">A cinematic ambient track</text>
            <text x="160" y="249" textAnchor="middle" fill="#2dd4bf" fontFamily="monospace" fontSize="10">with slow synth pads, 70 BPM…</text>
            {/* Arrow */}
            <line x1="295" y1="170" x2="375" y2="170" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#arr)" />
            {/* Center: Stable Audio 3 engine */}
            <rect x="375" y="100" width="110" height="140" rx="12" fill="#1e1b4b" stroke="#22d3ee" strokeWidth="1.5" />
            <text x="430" y="162" textAnchor="middle" fill="#22d3ee" fontFamily="monospace" fontSize="10" fontWeight="700">STABLE</text>
            <text x="430" y="178" textAnchor="middle" fill="#22d3ee" fontFamily="monospace" fontSize="10" fontWeight="700">AUDIO 3</text>
            <text x="430" y="196" textAnchor="middle" fill="#475569" fontFamily="monospace" fontSize="9">AI ENGINE</text>
            <circle cx="430" cy="130" r="14" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="6 3" />
            {/* Arrow */}
            <line x1="485" y1="170" x2="565" y2="170" stroke="#f97316" strokeWidth="2" markerEnd="url(#arr2)" />
            {/* Right: audio output (waveform) */}
            <rect x="565" y="60" width="255" height="220" rx="14" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            <text x="692" y="100" textAnchor="middle" fill="#f97316" fontFamily="monospace" fontSize="11" fontWeight="700" letterSpacing="2">AUDIO OUTPUT</text>
            {/* Waveform bars */}
            <g fill="#22d3ee">
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
            <text x="692" y="264" textAnchor="middle" fill="#2dd4bf" fontFamily="monospace" fontSize="9">30s · Cinematic Ambient</text>
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" />
              </marker>
              <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#f97316" />
              </marker>
            </defs>
          </svg>
          <div className="bg-slate-900/50 p-4 text-center text-sm text-slate-500 italic">
            Stable Audio 3 turns a text prompt into a downloadable audio clip — entirely in your browser.
          </div>
        </div>

        {/* First H2 section — mandatory homepage link per CONTENT_GUIDE.md */}
        <section className="mb-16">
          <h2 className="!text-3xl font-bold mb-6 text-white border-l-4 border-cyan-500 pl-4 !mt-0">
            {guideContent.intro.title}
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            {guideContent.intro.body[0]}
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            <Link className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:decoration-cyan-400" href="/">
              Stableaudio3.com
            </Link>{" "}
            is an online product experience for that workflow. This guide walks through all
            three modes, the prompt formula that works across them, genre and instrument
            vocabulary, BPM and key guidance, and the common mistakes that make AI audio sound
            generic. The same guidance works whether you are sketching music, building ambient
            beds, prototyping game audio, or producing podcast intros.
          </p>
        </section>

        <hr className="border-white/5 my-16" />

        <section className="mb-16">
          <h2 className="!text-3xl font-bold mb-8 text-white border-l-4 border-cyan-500 pl-4">
            Step 1 — Sign Up and Access the Generator
          </h2>
          <div className="space-y-4">
            {guideContent.onboarding.map((step, i) => (
              <div key={i} className="surface-card flex gap-6 items-start hover:border-cyan-500/30 transition-colors">
                <span className="text-2xl font-black text-cyan-500 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex gap-4 items-start">
            <span className="text-xl">💡</span>
            <p className="text-cyan-100/80 text-sm md:text-base leading-relaxed">
              <strong>First generation tip:</strong> Keep your first test short — a 15–30 second clip is the fastest way to check whether your prompt direction is working before spending more credits on longer or higher-quality outputs. The{" "}
              <Link className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:decoration-cyan-400" href="/pricing">
                Stable Audio 3 pricing
              </Link>{" "}
              page explains how credit packs map to short-clip equivalents.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-3xl font-bold mb-8 text-white border-l-4 border-cyan-500 pl-4">
            Step 2 — Text-to-Audio: How It Works
          </h2>
          <p className="text-slate-300 mb-8">
            Text-to-Audio is the primary mode for generating audio from scratch. You describe the clip you want — genre, instruments, mood, tempo — and Stable Audio 3 produces an audio file.
          </p>

          <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden group">
            <div className="absolute top-4 right-6 text-[10px] font-bold tracking-widest text-cyan-500/60 uppercase">
              Prompt Formula
            </div>
            <div className="flex flex-wrap items-center gap-3 text-lg md:text-xl font-bold text-white leading-loose">
              {guideContent.formula.elements.map((el, i) => (
                <span key={el} className="flex items-center gap-3">
                  <span className="bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-lg text-cyan-400">
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
              <div key={ex.category} className="border-l-4 border-orange-500 bg-slate-900/40 rounded-r-2xl p-6">
                <div className="text-orange-500 text-[10px] font-black tracking-widest uppercase mb-2">
                  {ex.category}
                </div>
                <p className="text-slate-300 text-sm md:text-base italic">&quot;{ex.prompt}&quot;</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-3xl font-bold mb-8 text-white border-l-4 border-cyan-500 pl-4">
            Step 3 — Audio-to-Audio: Transform an Existing Clip
          </h2>
          <p className="text-slate-300 mb-8">
            Audio-to-Audio takes a clip you upload and reshapes it based on a transformation prompt. The model preserves the timing and structure of the source while changing genre, instrumentation, or feel.
          </p>
          <div className="space-y-4 mb-8">
            {guideContent.audioToAudioWorkflow.map((step, i) => (
              <div key={i} className="surface-card flex gap-6 items-start">
                <span className="text-2xl font-black text-cyan-500 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex gap-4 items-start">
            <span className="text-xl">⚠️</span>
            <p className="text-orange-100/80 text-sm md:text-base leading-relaxed">
              Only upload audio you have rights to use. Uploading copyrighted recordings, signed songs, or someone else&apos;s production without permission is not allowed under the Terms of Service.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-3xl font-bold mb-8 text-white border-l-4 border-cyan-500 pl-4">
            Step 4 — Audio Inpaint: Regenerate a Region
          </h2>
          <p className="text-slate-300 mb-8">
            Audio Inpaint lets you select a region of an uploaded clip on the waveform and regenerate just that section. The rest of the clip stays untouched. Use it to fix a problem section, remove an unwanted sound, swap an instrument, or extend a loop.
          </p>
          <div className="space-y-4 mb-8">
            {guideContent.inpaintWorkflow.map((step, i) => (
              <div key={i} className="surface-card flex gap-6 items-start">
                <span className="text-2xl font-black text-cyan-500 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-3xl font-bold mb-8 text-white border-l-4 border-cyan-500 pl-4">
            Step 5 — Choose the Right Settings
          </h2>
          <div className="overflow-x-auto surface-card !p-0 border border-white/10">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-900/50">
                  <th className="p-4 text-cyan-400 font-bold uppercase text-xs tracking-wider">Setting</th>
                  <th className="p-4 text-cyan-400 font-bold uppercase text-xs tracking-wider">Options</th>
                  <th className="p-4 text-cyan-400 font-bold uppercase text-xs tracking-wider">When to use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {guideContent.settings.map((s) => (
                  <tr key={s.setting} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-bold">{s.setting}</td>
                    <td className="p-4 text-slate-400 font-mono text-sm">{s.options}</td>
                    <td className="p-4 text-slate-400 text-sm">{s.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-3xl font-bold mb-8 text-white border-l-4 border-cyan-500 pl-4">
            Step 6 — Genre, Mood, and Production Vocabulary
          </h2>
          <h3 className="text-xl font-bold mb-6">Genre Vocabulary</h3>
          <div className="grid gap-4 sm:grid-cols-2 mb-12">
            {guideContent.genreTerms.map((item) => (
              <div key={item.term} className="surface-card !p-5 border border-white/5 hover:border-cyan-500/30 transition-colors">
                <strong className="block text-cyan-400 mb-1">{item.term}</strong>
                <span className="text-sm text-slate-400">{item.definition}</span>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold mb-6">Mood Words That Shape the Feel</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {guideContent.moodTerms.map((item) => (
              <div key={item.term} className="surface-card !p-5 border border-white/5">
                <strong className="block text-cyan-400 mb-1">{item.term}</strong>
                <span className="text-sm text-slate-400">{item.definition}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-3xl font-bold mb-8 text-white border-l-4 border-cyan-500 pl-4">
            Step 7 — How to Iterate for Better Results
          </h2>
          <div className="space-y-4 mb-8">
            {guideContent.iteration.map((step, i) => (
              <div key={i} className="surface-card flex gap-6 items-start">
                <span className="text-2xl font-black text-cyan-500 leading-none">
                  {i + 1}
                </span>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="!text-3xl font-bold mb-8 text-white border-l-4 border-cyan-500 pl-4">
            Common Mistakes and How to Fix Them
          </h2>
          <div className="overflow-x-auto surface-card !p-0 border border-white/10">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-900/50">
                  <th className="p-4 text-cyan-400 font-bold uppercase text-xs tracking-wider">Problem</th>
                  <th className="p-4 text-cyan-400 font-bold uppercase text-xs tracking-wider">Likely Cause</th>
                  <th className="p-4 text-cyan-400 font-bold uppercase text-xs tracking-wider">Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {guideContent.mistakes.map((m) => (
                  <tr key={m.problem} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-bold">{m.problem}</td>
                    <td className="p-4 text-slate-400 text-sm">{m.cause}</td>
                    <td className="p-4 text-teal-400 font-semibold text-sm">{m.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-24">
          <StableAudioFAQ items={guideContent.faq} />
        </section>

        <section className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-10 md:p-16 text-center shadow-2xl shadow-cyan-500/5">
          <h2 className="!text-3xl md:!text-4xl font-black mb-4 !mt-0">Ready to Generate Your First Audio Clip?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
            Open the Stable Audio 3 AI Audio Generator and start creating music, ambient, or SFX from a text prompt — or edit and inpaint existing audio.
          </p>
          <Link
            className="button-primary !py-4 !px-12 !h-auto !text-lg !rounded-xl"
            href="/stable-audio-3"
          >
            Start Generating Free →
          </Link>
        </section>
      </article>
    </main>
  );
}
