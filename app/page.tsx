import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
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
  "text-to-video": (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M4 6h11" />
      <path d="M4 11h8" />
      <path d="M4 16h6" />
      <path d="m15 13 6 3.5L15 20Z" />
    </svg>
  ),
  "image-to-video": (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
      <rect x="3" y="4" width="13" height="11" rx="2" />
      <circle cx="8" cy="9" r="1.4" />
      <path d="m4 14 4-4 5 5" />
      <path d="M14 18h7" />
      <path d="m18 15 3 3-3 3" />
    </svg>
  ),
  motion: (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
      <rect x="3" y="6" width="14" height="12" rx="2" />
      <path d="m17 10 4-2v8l-4-2Z" />
      <circle cx="9" cy="12" r="2.4" />
    </svg>
  ),
  format: (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
      <rect x="3" y="5" width="11" height="7" rx="1.4" />
      <rect x="13" y="11" width="8" height="9" rx="1.4" />
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

export default function HomePage() {
  return (
    <main>
      <JsonLd data={websiteSchema} />
      <JsonLd data={homePageSchema} />
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />

      <section className="hero-shell hero-video-shell">
        <video
          aria-hidden="true"
          autoPlay
          className="hero-video"
          loop
          muted
          playsInline
          poster="/hero/stable-audio-3-hero-poster.jpg"
        >
          <source src="/hero/stable-audio-3-hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />
        <div className="hero-video-grid" aria-hidden="true" />
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
        </div>
      </section>

      <section className="section section-compact relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-[100px] -z-10" />
        
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] items-start">
          <div className="sticky top-24">
            <p className="eyebrow inline-flex items-center gap-2">
              <span className="w-8 h-px bg-cyan-500/50" />
              {homeContent.intro.eyebrow}
            </p>
            <h2 className="mt-4 !text-4xl md:!text-5xl lg:!text-6xl !leading-[1.1] font-bold tracking-tight">
              {homeContent.intro.title}
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400">
                LTX 2.3 Ecosystem
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400">
                Text-to-Video
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400">
                Image-to-Video
              </span>
            </div>
          </div>
          
          <div className="space-y-6">
            {homeContent.intro.paragraphs.map((paragraph, idx) => (
              <div 
                key={idx} 
                className="group relative p-6 rounded-2xl bg-slate-900/30 border border-white/5 hover:border-cyan-500/20 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-cyan-500/40 transition-all duration-500 rounded-full" />
                <p className="text-base md:text-lg leading-relaxed text-slate-300 opacity-90 group-hover:opacity-100 transition-opacity">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-compact pt-32">
        <div className="section-heading">
          <p className="eyebrow">Features</p>
          <h2 className="!text-3xl md:!text-4xl">What You Can Do with Stable Audio 3</h2>
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
          <h2 className="!text-4xl md:!text-5xl font-bold">How to Use Stable Audio 3 in Four Steps</h2>
          <p className="!mx-auto !max-w-3xl text-base md:text-lg opacity-80 leading-relaxed mt-4">
            Creating a video with Stable Audio 3 is simple. Start with a text prompt or reference image, 
            choose your video format, generate a short AI video online, then refine the prompt 
            until the motion, lighting, and style feel right.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-4">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent -z-10" />
          
          {homeContent.workflow.map((step, index) => (
            <article 
              className="group relative flex flex-col items-start p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:bg-slate-900/60 hover:border-cyan-500/30 transition-all duration-300" 
              key={step.title}
            >
              <div className="relative mb-6">
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold text-xl border border-cyan-500/20 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {/* Visual marker for the line connection */}
                <div className="hidden md:block absolute top-1/2 left-full w-8 h-px bg-cyan-500/20 group-last:hidden" />
              </div>
              
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors min-h-[3.5rem] flex items-center">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                {step.description}
              </p>
              
              {/* Bottom decorative accent */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-500/0 group-hover:via-cyan-500/40 to-transparent transition-all duration-500" />
            </article>
          ))}
        </div>
      </section>

      <section className="section section-compact">
        <div className="metric-grid !grid-cols-2 lg:!grid-cols-4">
          {homeContent.metrics.map((metric) => (
            <div className="metric-card !border-none !bg-slate-900/40 !rounded-xl !p-6 text-center" key={metric.label}>
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
          <h2 className="!text-3xl md:!text-4xl">Ways to Use Stable Audio 3 for AI Video Creation</h2>
          <p className="!mx-auto !max-w-3xl text-lg opacity-80 leading-relaxed mt-4">
            Use Stable Audio 3 to test video ideas, animate still images, and create 
            short visual concepts before spending time on full production.
          </p>
        </div>
        <div className="case-grid gap-4">
          {homeContent.useCases.map((item) => (
            <article className="surface-card use-case-card !p-0 overflow-hidden" key={item.title}>
              <video
                aria-hidden="true"
                autoPlay
                className="case-media !m-0 !rounded-none"
                loop
                muted
                playsInline
                poster={item.poster}
              >
                <source src={item.poster.replace(".webp", ".mp4")} type="video/mp4" />
              </video>
              <div className="p-4">
                <h3 className="text-base">{item.title}</h3>
                <p className="text-base opacity-70 mt-1">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-compact">
        <div className="split-panel !gap-8">
          <div>
            <p className="eyebrow">Prompt Guide</p>
            <h2>Write Prompts That Give the Video Direction</h2>
            <p className="text-lg opacity-80">
              The best Stable Audio 3 prompts read like compact shot descriptions.
              Describe the action, setting, camera motion, lighting, style, and mood.
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
              New users get free credits to test Stable Audio 3 online. Create your first 
              short AI video, then choose a credit plan when you need more generations.
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
          Turn a prompt or image into your first cinematic AI video online. No credit card required.
        </p>
        <Link className="button-primary mt-8 !px-10 !py-4 !h-auto" href="/stable-audio-3">
          Try Stable Audio 3 Free
        </Link>
      </section>
    </main>
  );
}
