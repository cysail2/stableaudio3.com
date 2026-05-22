import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { DeferredAudio, HeroAudioPreview } from "@/modules/media/components/DeferredAudio";
import { JsonLd } from "@/project/components/JsonLd";
import { StableAudioFAQ } from "@/project/components/StableAudioFAQ";
import { homeContent } from "@/project/content/home";
import { siteConfig } from "@/project/config/site";

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.description,
    url: siteConfig.url,
    images: ["/og/home.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.description,
    images: ["/og/home.webp"],
  },
};

const FEATURE_ICONS: Record<string, ReactNode> = {
  "text-to-audio": (
    // Text lines on the left + waveform on the right
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M3 7h7" />
      <path d="M3 12h5" />
      <path d="M3 17h6" />
      <path d="M13 12v0" />
      <path d="M15 10v4" />
      <path d="M17 8v8" />
      <path d="M19 10v4" />
      <path d="M21 12v0" />
    </svg>
  ),
  "audio-to-audio": (
    // Two waveforms with arrow between
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M3 12h0" />
      <path d="M5 10v4" />
      <path d="M7 8v8" />
      <path d="M9 11v2" />
      <path d="m11 12 4 0" />
      <path d="m13 10 2 2-2 2" />
      <path d="M16 11v2" />
      <path d="M18 8v8" />
      <path d="M20 10v4" />
    </svg>
  ),
  inpaint: (
    // Waveform with selected region marked by brackets
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M3 12h0" />
      <path d="M5 10v4" />
      <path d="M9 6v12 M9 6h1 M9 18h1" />
      <path d="M11 8v8" />
      <path d="M13 9v6" />
      <path d="M15 8v8" />
      <path d="M17 6v12 M17 6h-1 M17 18h-1" />
      <path d="M19 10v4" />
      <path d="M21 12h0" />
    </svg>
  ),
  length: (
    // Timeline / duration scrubber
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M3 12h18" />
      <path d="M5 9v6" />
      <path d="M9 9v6" />
      <path d="M13 9v6" />
      <path d="M17 9v6" />
      <path d="M21 9v6" />
      <circle cx="13" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  prompt: (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M5 5h14v11H8l-3 3Z" />
      <path d="M9 9h8" />
      <path d="M9 12h5" />
    </svg>
  ),
  browser: (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18" />
      <circle cx="6.5" cy="7" r="0.6" />
      <circle cx="9" cy="7" r="0.6" />
      <circle cx="11.5" cy="7" r="0.6" />
    </svg>
  ),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeContent.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.productName,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  url: siteConfig.url,
  description: siteConfig.seo.description,
  offers: {
    "@type": "Offer",
    url: siteConfig.url,
    name: "Free signup credits",
    price: "0",
    priceCurrency: "USD",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.seo.description,
};

const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteConfig.url}#webpage`,
  url: siteConfig.url,
  name: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.description,
  isPartOf: {
    "@id": `${siteConfig.url}#website`,
  },
  about: {
    "@type": "SoftwareApplication",
    name: siteConfig.productName,
  },
};

const heroSample = {
  title: "Cinematic ambient, 70 BPM in A minor",
  subtitle: "Text-to-Audio · 30 s · Sample",
  sample: "/samples/hero-cinematic.mp3",
  duration: "30 s",
  description:
    "A cinematic ambient Stable Audio 3 sample with slow synth pads, deep sub bass, distant piano notes, and warm reverb.",
};

const durationToIso = (duration: string) => {
  const seconds = Number(duration.match(/\d+(\.\d+)?/)?.[0] || 0);
  return `PT${Math.max(1, Math.round(seconds))}S`;
};

const audioSamplesSchema = {
  "@context": "https://schema.org",
  "@graph": [heroSample, ...homeContent.useCases].map((sample) => ({
    "@type": "AudioObject",
    name: `${sample.title} - Stable Audio 3 sample`,
    description: sample.description,
    contentUrl: `${siteConfig.url}${sample.sample}`,
    encodingFormat: "audio/mpeg",
    uploadDate: "2026-05-22",
    duration: durationToIso(sample.duration),
    isPartOf: {
      "@id": `${siteConfig.url}#webpage`,
    },
  })),
};

export default function HomePage() {
  return (
    <main>
      <JsonLd data={websiteSchema} />
      <JsonLd data={homePageSchema} />
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={audioSamplesSchema} />

      <section className="hero-audio-stage">
        {/* Animated equalizer-bar curtain — 21 bars, pure CSS animation */}
        <div aria-hidden="true" className="hero-eq">
          {Array.from({ length: 21 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>

        {/* Floating mode chips — desktop-only, fill lateral empty space */}
        <div aria-hidden="true" className="hero-float-chip is-t2a">
          <span className="swatch" style={{ background: "#7c3aed" }} />
          Text-to-Audio
        </div>
        <div aria-hidden="true" className="hero-float-chip is-a2a">
          <span className="swatch" style={{ background: "#ec4899" }} />
          Audio-to-Audio
        </div>
        <div aria-hidden="true" className="hero-float-chip is-inpaint">
          <span className="swatch" style={{ background: "#f59e0b" }} />
          Audio Inpaint
        </div>
        <div aria-hidden="true" className="hero-float-chip is-bpm">
          70 BPM · A minor
        </div>

        {/* Large decorative spectrogram band behind the hero copy */}
        <svg
          aria-hidden="true"
          className="hero-spectrogram"
          preserveAspectRatio="none"
          viewBox="0 0 1200 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 120 }).map((_, i) => {
            const seed = Math.sin(i * 0.7) * Math.sin(i * 0.13);
            const h = 18 + Math.abs(seed) * 40;
            return (
              <rect
                fill="#0f172a"
                height={h}
                key={i}
                rx={1.5}
                width={3}
                x={i * 10 + 2}
                y={(60 - h) / 2}
              />
            );
          })}
        </svg>

        <div className="hero-content">
          <p className="hero-badge">{homeContent.hero.badge}</p>
          <h1>{homeContent.hero.title}</h1>
          <p className="hero-lede">{homeContent.hero.description}</p>
          <div className="hero-actions">
            <Link className="button-primary" href="/stable-audio-3">
              Try Stable Audio 3 Free
            </Link>
            <Link className="button-secondary" href="/how-to-use-stable-audio-3">
              Learn How It Works
            </Link>
          </div>
          <p className="hero-trust">{homeContent.hero.trustLine}</p>

          <HeroAudioPreview src={heroSample.sample} subtitle={heroSample.subtitle} title={heroSample.title} />
        </div>
      </section>

      <section className="section section-compact relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-violet-50 blur-[100px] -z-10" />
        
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] items-start">
          <div className="sticky top-24">
            <p className="eyebrow inline-flex items-center gap-2">
              <span className="w-8 h-px bg-violet-500" />
              {homeContent.intro.eyebrow}
            </p>
            <h2 className="mt-4 !text-4xl md:!text-5xl lg:!text-6xl !leading-[1.1] font-bold tracking-tight">
              {homeContent.intro.title}
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {homeContent.intro.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            {/* First H2 section paragraphs — mandatory homepage internal link
                lives in paragraph 0; secondary internal links in paragraphs 1 + 2 */}
            <div className="group relative p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-200 transition-all duration-300">
              <p className="text-base md:text-lg leading-relaxed text-slate-700 opacity-90 group-hover:opacity-100 transition-opacity">
                <Link
                  className="text-violet-700 underline decoration-violet-500/40 underline-offset-4 hover:decoration-violet-400"
                  href="/"
                >
                  Stableaudio3.com
                </Link>{" "}
                {homeContent.intro.paragraphs[0]}
              </p>
            </div>
            <div className="group relative p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-200 transition-all duration-300">
              <p className="text-base md:text-lg leading-relaxed text-slate-700 opacity-90 group-hover:opacity-100 transition-opacity">
                {homeContent.intro.paragraphs[1]}
              </p>
            </div>
            <div className="group relative p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-200 transition-all duration-300">
              <p className="text-base md:text-lg leading-relaxed text-slate-700 opacity-90 group-hover:opacity-100 transition-opacity">
                {homeContent.intro.paragraphs[2]} Read the{" "}
                <Link
                  className="text-violet-700 underline decoration-violet-500/40 underline-offset-4 hover:decoration-violet-400"
                  href="/how-to-use-stable-audio-3"
                >
                  Stable Audio 3 prompt guide
                </Link>{" "}
                for the full formula and examples.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-compact pt-32">
        <div className="section-heading">
          <p className="eyebrow">Features</p>
          <h2 className="!text-3xl md:!text-4xl">What You Can Create with Stable Audio 3</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {homeContent.features.map((feature) => (
            <article className="surface-card feature-card !min-h-[180px]" key={feature.title}>
              <div className="card-icon">{FEATURE_ICONS[feature.icon]}</div>
              <h3 className="text-lg font-bold min-h-[3rem] flex items-center">{feature.title}</h3>
              <p className="text-base opacity-70 leading-relaxed">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-compact relative">
        <div className="section-heading text-center !mb-8">
          <p className="eyebrow">Workflow</p>
          <h2 className="!text-4xl md:!text-5xl font-bold">From Prompt to Audio in Four Steps</h2>
          <p className="!mx-auto !max-w-3xl text-base md:text-lg opacity-80 leading-relaxed mt-4">
            {homeContent.workflowIntro}{" "}
            <Link
              className="text-violet-700 underline decoration-violet-500/40 underline-offset-4 hover:decoration-violet-400"
              href="/stable-audio-3"
            >
              Open the Stable Audio 3 generator
            </Link>{" "}
            to try each step in the browser.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-4">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent -z-10" />
          
          {homeContent.workflow.map((step, index) => (
            <article 
              className="group relative flex flex-col items-start p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-violet-300 transition-all duration-300"
              key={step.title}
            >
              <div className="relative mb-6">
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-50 text-violet-600 font-bold text-xl border border-violet-200 group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-slate-950 transition-all duration-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {/* Visual marker for the line connection */}
                <div className="hidden md:block absolute top-1/2 left-full w-8 h-px bg-violet-100 group-last:hidden" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-violet-600 transition-colors min-h-[3.5rem] flex items-center">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600 group-hover:text-slate-700 transition-colors">
                {step.description}
              </p>
              
              {/* Bottom decorative accent */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-500/0 group-hover:via-violet-500/40 to-transparent transition-all duration-500" />
            </article>
          ))}
        </div>
      </section>

      <section className="section section-compact">
        <div className="metric-grid !grid-cols-2 lg:!grid-cols-4">
          {homeContent.metrics.map((metric) => (
            <div className="metric-card !border-none !bg-slate-50 !rounded-xl !p-6 text-center" key={metric.label}>
              <strong className="!text-3xl md:!text-4xl">{metric.value}</strong>
              <span className="text-xs uppercase tracking-wider opacity-60">{metric.label}</span>
              <p className="text-sm mt-2 opacity-50">{metric.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-compact">
        <div className="section-heading">
          <p className="eyebrow">Use Cases</p>
          <h2 className="!text-3xl md:!text-4xl">Stable Audio 3 for Creative Audio Workflows</h2>
          <p className="!mx-auto !max-w-3xl text-lg opacity-80 leading-relaxed mt-4">
            Stable Audio 3 is built for short-form audio production where speed, prompt
            control, and editing matter. Use it to sketch musical ideas, generate ambient
            beds, prototype game sounds, and refine existing audio without leaving the browser.
          </p>
        </div>
        <div className="case-grid gap-4">
          {homeContent.useCases.map((item) => (
            <DeferredAudio
              description={item.description}
              duration={item.duration}
              genre={item.genre}
              key={item.title}
              mode={item.mode}
              seed={item.seed}
              src={item.sample}
              title={item.title}
            />
          ))}
        </div>
      </section>

      <section className="section section-compact">
        <div className="split-panel !gap-8">
          <div>
            <p className="eyebrow">Prompt Guide</p>
            <h2>Write Prompts That Give the Audio Direction</h2>
            <p className="text-lg opacity-80">
              The best Stable Audio 3 prompts read like compact production briefs.
              Describe genre, instruments, mood, and tempo so the model has enough
              structure to produce intentional audio instead of generic output.
            </p>
            <Link className="button-secondary mt-6 !min-h-[2.5rem] !text-sm" href="/how-to-use-stable-audio-3">
              Read the Prompt Guide
            </Link>
          </div>
          <ul className="tip-list !grid-cols-1 md:!grid-cols-2">
            {homeContent.promptTips.map((tip) => (
              <li className="!p-4 !rounded-lg" key={tip.title}>
                <strong className="!text-sm">{tip.title}</strong>
                <p className="!text-base opacity-60">{tip.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-compact">
        <div className="cta-band !p-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Start Free</p>
            <h2>Try Stable Audio 3 Free First</h2>
            <p className="text-base opacity-80">
              New users get 100 free credits to test Stable Audio 3 online. Generate your
              first audio clip across any of the three modes, then choose a credit plan
              when you need more generations.
            </p>
          </div>
          <Link className="button-primary !min-h-[2.75rem]" href="/pricing">
            Compare Pricing
          </Link>
        </div>
      </section>

      <section className="section">
        <StableAudioFAQ items={homeContent.faq} />
      </section>

      <section className="section final-cta !py-24 md:!py-32">
        <p className="eyebrow">Create Now</p>
        <h2>Start Creating with Stable Audio 3</h2>
        <p className="!max-w-2xl mx-auto text-lg opacity-80">
          Turn a prompt into music, ambient bed, or sound effect — or upload an audio file
          to edit or inpaint. No credit card required.
        </p>
        <Link className="button-primary mt-8 !px-10 !py-4 !h-auto" href="/stable-audio-3">
          Generate Your First Audio Clip
        </Link>
      </section>
    </main>
  );
}
