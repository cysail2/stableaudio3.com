import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { StableAudioGenerator } from "@/modules/generator/components/StableAudioGenerator";
import { PricingCards } from "@/modules/pricing/components/PricingCards";
import { JsonLd } from "@/project/components/JsonLd";
import { StableAudioFAQ } from "@/project/components/StableAudioFAQ";
import { TryPromptLink } from "@/project/components/TryPromptLink";
import { siteConfig } from "@/project/config/site";
import { toolContent } from "@/project/content/tool";

export const metadata: Metadata = {
  title: {
    absolute: "Stable Audio 3 AI Audio Generator - Text, A2A, Inpaint",
  },
  description:
    "Use Stable Audio 3 AI Audio Generator online to create music, ambient beds, and SFX from text — or edit and inpaint existing audio. Browser-based, free to try.",
  keywords: [
    "Stable Audio 3 AI Audio Generator",
    "text to audio",
    "audio to audio",
    "audio inpaint",
    "AI music generator",
  ],
  alternates: {
    canonical: `${siteConfig.url}/stable-audio-3`,
  },
  openGraph: {
    title: "Stable Audio 3 AI Audio Generator - Text, A2A, Inpaint",
    description:
      "Use Stable Audio 3 AI Audio Generator online to create music, ambient beds, and SFX from text — or edit and inpaint existing audio. Browser-based, free to try.",
    url: `${siteConfig.url}/stable-audio-3`,
    images: ["/og/stable-audio-3.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stable Audio 3 AI Audio Generator - Text, A2A, Inpaint",
    description:
      "Use Stable Audio 3 AI Audio Generator online to create music, ambient beds, and SFX from text — or edit and inpaint existing audio. Browser-based, free to try.",
    images: ["/og/stable-audio-3.webp"],
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.productName,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  url: `${siteConfig.url}/stable-audio-3`,
  description: metadata.description,
  offers: {
    "@type": "Offer",
    url: `${siteConfig.url}/stable-audio-3`,
    name: "Stable Audio 3 online generator access",
    price: "0",
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: toolContent.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const toolPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteConfig.url}/stable-audio-3#webpage`,
  url: `${siteConfig.url}/stable-audio-3`,
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
      name: "Stable Audio 3 AI Audio Generator",
      item: `${siteConfig.url}/stable-audio-3`,
    },
  ],
};

export default function ToolPage() {
  return (
    <main className="pb-20 md:pb-32">
      <JsonLd data={toolPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />

      <section className="tool-hero-shell scroll-mt-20" id="generator">
        <div className="tool-hero-inner">
          <div className="tool-hero-copy">
            <p className="hero-badge">Stable Audio 3 Generator</p>
            <h1>{toolContent.hero.title}</h1>
            <p className="hero-lede">{toolContent.hero.lead}</p>
          </div>

          <div className="tool-hero-generator">
            <Suspense fallback={null}>
              <StableAudioGenerator />
            </Suspense>
          </div>
        </div>
      </section>

      {/* First H2 section after hero — mandatory homepage internal link per CONTENT_GUIDE.md */}
      <section className="section section-compact relative">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-violet-50 blur-[120px] -z-10" />

        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div>
            <p className="eyebrow inline-flex items-center gap-2 mb-6">
              <span className="w-8 h-px bg-violet-500" />
              Stable Audio 3 Overview
            </p>
            <h2 className="text-4xl md:text-6xl font-black mb-10 leading-[1.1] tracking-tight">
              What Is <span className="text-violet-600">Stable Audio 3</span> <br />AI Audio Generator?
            </h2>
            <div className="space-y-6">
              <div className="group relative p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-violet-200 transition-all duration-300">
                <p className="text-xl text-slate-700 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                  <Link className="text-violet-700 underline decoration-violet-500/40 underline-offset-4 hover:decoration-violet-400" href="/">
                    Stable Audio 3
                  </Link>{" "}
                  AI Audio Generator is an online tool for creating short audio clips from text
                  prompts or editing existing audio files. It is built around the open-weight
                  Stable Audio 3 model family from Stability AI, with three modes available in
                  the same browser workflow: Text-to-Audio, Audio-to-Audio editing, and Audio
                  Inpaint.
                </p>
              </div>
              <div className="group relative p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-violet-200 transition-all duration-300">
                <p className="text-xl text-slate-700 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                  Instead of downloading model weights or setting up a local inference stack,
                  you can use Stable Audio 3 directly in your browser. Write a prompt, optionally
                  upload an audio file, choose a mode and length, generate, preview the waveform,
                  and download.
                </p>
              </div>
            </div>
          </div>

          <div className="tool-stat-stack lg:sticky lg:top-28">
            {toolContent.stats.map((stat) => (
              <div key={stat.label} className="surface-card tool-stat-card">
                <span className="block text-5xl font-black text-slate-900 mb-2 tracking-tighter">{stat.num}</span>
                <span className="text-[10px] font-bold text-violet-600 uppercase tracking-[0.3em]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mode 1: Text-to-Audio */}
      <section className="section section-compact">
        <div className="tool-section-shell tool-section-shell-cyan">
          <div className="tool-section-heading-row">
            <div className="max-w-2xl">
              <p className="eyebrow inline-flex items-center gap-2 mb-6">
                <span className="w-8 h-px bg-violet-500" />
                Mode 1 · Text-to-Audio
              </p>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{toolContent.sections.t2a.title}</h2>
              <p className="text-xl text-slate-600 leading-relaxed">{toolContent.sections.t2a.body}</p>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                Stronger prompts read like compact production briefs: genre, instruments, mood,
                tempo, and a production style cue. The{" "}
                <Link
                  className="text-violet-700 underline decoration-violet-500/40 underline-offset-4 hover:decoration-violet-400"
                  href="/how-to-use-stable-audio-3"
                >
                  Stable Audio 3 prompt guide
                </Link>{" "}
                has the full formula and ready-to-copy examples.
              </p>
            </div>
            <div className="tool-highlight-panel shrink-0 max-w-sm">
              <div className="absolute top-0 right-0 w-16 h-16 bg-violet-50 blur-2xl -mr-8 -mt-8" />
              <p className="relative z-10 text-sm text-slate-700 leading-relaxed">
                <strong className="text-violet-600 block mb-2 uppercase tracking-[0.2em] text-[10px] font-black">Pro Tip</strong>
                Put genre + instruments first. Add tempo (BPM) and key when the use case has a
                sync target. Production style cues like &quot;warm tape&quot; or &quot;lo-fi vinyl crackle&quot; make
                the result feel intentional instead of generic.
              </p>
            </div>
          </div>

          <div className="tool-prompt-shell border-violet-200">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.08),transparent_70%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-[10px] font-black tracking-[0.3em] text-violet-700 uppercase mb-8">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                Prompt Example
              </div>
              <div className="text-violet-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">
                {toolContent.sections.t2a.example.category}
              </div>
              <p className="text-base md:text-lg text-slate-800 leading-8 md:leading-9 font-medium tracking-normal italic max-w-4xl mb-5">
                &quot;{toolContent.sections.t2a.example.prompt}&quot;
              </p>
              <TryPromptLink mode="text-to-audio" prompt={toolContent.sections.t2a.example.prompt} />
            </div>
          </div>
        </div>
      </section>

      {/* Mode 2: Audio-to-Audio — pink accent */}
      <section className="section section-compact">
        <div className="tool-section-shell tool-section-shell-pink">
          <p className="eyebrow inline-flex items-center gap-2 mb-6 text-pink-600">
            <span className="w-8 h-px bg-pink-400/50" />
            Mode 2 · Audio-to-Audio
          </p>
          <div className="max-w-2xl mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{toolContent.sections.a2a.title}</h2>
            <p className="text-xl text-slate-600 leading-relaxed">{toolContent.sections.a2a.body}</p>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Upload an MP3, WAV, or FLAC clip. Describe the transformation. The clearer the
              change description, the cleaner the result.
            </p>
          </div>

          <div className="tool-prompt-shell border-pink-200">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.08),transparent_70%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-[10px] font-black tracking-[0.3em] text-pink-700 uppercase mb-8">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                Transformation Prompt
              </div>
              <div className="text-pink-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">
                {toolContent.sections.a2a.example.category}
              </div>
              <p className="text-base md:text-lg text-slate-800 leading-8 md:leading-9 font-medium tracking-normal italic max-w-4xl mb-5">
                &quot;{toolContent.sections.a2a.example.prompt}&quot;
              </p>
              <TryPromptLink mode="audio-to-audio" prompt={toolContent.sections.a2a.example.prompt} />
            </div>
          </div>
        </div>
      </section>

      {/* Mode 3: Audio Inpaint — amber accent */}
      <section className="section section-compact">
        <div className="tool-section-shell tool-section-shell-amber">
          <p className="eyebrow inline-flex items-center gap-2 mb-6 text-amber-600">
            <span className="w-8 h-px bg-amber-400/50" />
            Mode 3 · Audio Inpaint
          </p>
          <div className="max-w-2xl mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{toolContent.sections.inpaint.title}</h2>
            <p className="text-xl text-slate-600 leading-relaxed">{toolContent.sections.inpaint.body}</p>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Inpaint works best on focused regions — a few bars, a specific transition, a single
              SFX swap. Asking the model to regenerate most of the clip loses context with the
              rest. The{" "}
              <Link
                className="text-amber-700 underline decoration-amber-400/40 underline-offset-4 hover:decoration-amber-400"
                href="/how-to-use-stable-audio-3"
              >
                Inpaint section of the prompt guide
              </Link>{" "}
              covers how to match the surrounding genre, tempo, and key so the regenerated region blends in.
            </p>
          </div>

          <div className="tool-prompt-shell border-amber-200">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.08),transparent_70%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-black tracking-[0.3em] text-amber-700 uppercase mb-8">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Inpaint Prompt
              </div>
              <div className="text-amber-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">
                {toolContent.sections.inpaint.example.category}
              </div>
              <p className="text-base md:text-lg text-slate-800 leading-8 md:leading-9 font-medium tracking-normal italic max-w-4xl mb-5">
                &quot;{toolContent.sections.inpaint.example.prompt}&quot;
              </p>
              <TryPromptLink mode="audio-inpaint" prompt={toolContent.sections.inpaint.example.prompt} />
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section section-compact relative">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[150px] -z-10" />
        <div className="text-center mb-16">
          <p className="eyebrow inline-flex items-center gap-2 mb-4 justify-center">
            <span className="w-8 h-px bg-violet-500" />
            Use Cases
          </p>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">What You Can Create with Stable Audio 3</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stable Audio 3 helps you create short audio clips for music, podcasts, video soundtracks,
            game audio, social media, and ambient streaming — all from prompts or by editing existing
            audio.
          </p>
        </div>
        <div className="tool-feature-grid">
          {toolContent.useCases.map((item) => (
            <div key={item.title} className="tool-feature-card group">
              <span className="text-4xl mb-6 block">{item.icon}</span>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
              <p className="text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Settings */}
      <section className="section section-compact">
        <div className="text-center mb-16">
          <p className="eyebrow inline-flex items-center gap-2 mb-4 justify-center">
            <span className="w-8 h-px bg-violet-500" />
            Generator Settings
          </p>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Settings Explained</h2>
        </div>
        <div className="tool-settings-grid">
          {toolContent.settings.map((s) => (
            <div key={s.num} className="tool-settings-card">
              <span className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center text-xl font-bold text-violet-700 mb-8">
                {s.num}
              </span>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{s.title}</h4>
              <p className="text-base text-slate-600 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Online vs local comparison */}
      <section className="section section-compact">
        <div className="text-center mb-16">
          <p className="eyebrow inline-flex items-center gap-2 mb-4 justify-center">
            <span className="w-8 h-px bg-violet-500" />
            Online vs Local
          </p>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Online Stable Audio 3 vs Running Local Weights</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Use Stable Audio 3 online when you want to create audio quickly without installing tools
            or managing model files. Choose local inference only if you are comfortable downloading
            the open-weight Stable Audio 3 variants from Hugging Face and running them on your own
            hardware.
          </p>
        </div>
        <div className="tool-table-shell">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-white/5">
                  <th className="p-8 text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">Feature</th>
                  <th className="p-8 text-violet-600 font-black uppercase text-[10px] tracking-[0.3em]">Stable Audio 3 Online</th>
                  <th className="p-8 text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">Local Open Weights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {toolContent.comparison.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-8 text-slate-900 font-semibold text-sm">{row.feature}</td>
                    <td className="p-8 text-slate-700 text-sm">{typeof row.online === "string" ? row.online : row.onlineText}</td>
                    <td className="p-8 text-slate-600 text-sm">{typeof row.local === "string" ? row.local : row.localText}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section section-compact scroll-mt-28" id="stable-audio-pricing-plans">
        <div className="section-heading !mb-8">
          <p className="eyebrow">Credit Plans</p>
          <h2>Choose a Stable Audio 3 Credit Pack</h2>
          <p>
            Buy credits only when you need more generations. Credits work for all three modes — Text-to-Audio, Audio-to-Audio, and Audio Inpaint.
          </p>
        </div>
        <PricingCards />
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="tool-faq-shell">
          <StableAudioFAQ items={toolContent.faq} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="section section-compact pt-0">
        <div className="tool-cta-shell">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_70%)]" />
          <div className="relative z-10">
            <p className="eyebrow inline-flex items-center gap-2 mb-6 justify-center">
              <span className="w-8 h-px bg-violet-500" />
              Get Started
            </p>
            <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">Create Your First Audio Clip with Stable Audio 3</h2>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Use Stable Audio 3 AI Audio Generator to turn a prompt into music, ambient bed, or
              SFX — or upload an audio file to edit and inpaint. Start free in your browser.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                className="button-primary !py-5 !px-12 !h-auto !text-lg !rounded-2xl shadow-2xl shadow-white/5"
                href="/pricing"
              >
                Compare Credit Packs
              </Link>
              <Link
                className="button-secondary !py-5 !px-12 !h-auto !text-lg !rounded-2xl"
                href="/how-to-use-stable-audio-3"
              >
                Read Prompt Guide
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
