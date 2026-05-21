import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { StableAudioGenerator } from "@/modules/generator/components/StableAudioGenerator";
import { PricingCards } from "@/modules/pricing/components/PricingCards";
import { JsonLd } from "@/project/components/JsonLd";
import { StableAudioFAQ } from "@/project/components/StableAudioFAQ";
import { siteConfig } from "@/project/config/site";
import { toolContent } from "@/project/content/tool";

export const metadata: Metadata = {
  title: {
    absolute: "Stable Audio 3 AI Audio Generator - Text & Image to Video",
  },
  description:
    "Use Stable Audio 3 AI Audio Generator online. No ComfyUI or install needed. Turn text prompts or images into cinematic AI video clips in your browser today.",
  keywords: [
    "Stable Audio 3 AI Audio Generator",
    "text to video",
    "image to video",
    "AI video generator",
    "cinematic video tool",
    "realistic motion",
  ],
  alternates: {
    canonical: `${siteConfig.url}/stable-audio-3`,
  },
  openGraph: {
    title: "Stable Audio 3 AI Audio Generator - Text & Image to Video",
    description:
      "Use Stable Audio 3 AI Audio Generator online. No ComfyUI or install needed. Turn text prompts or images into cinematic AI video clips in your browser today.",
    url: `${siteConfig.url}/stable-audio-3`,
    images: ["/og/stable-audio-3.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stable Audio 3 AI Audio Generator - Text & Image to Video",
    description:
      "Use Stable Audio 3 AI Audio Generator online. No ComfyUI or install needed. Turn text prompts or images into cinematic AI video clips in your browser today.",
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
    <main>
      <JsonLd data={toolPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />

      <section className="tool-hero-shell">
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

      <section className="section section-compact relative">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-[120px] -z-10" />

        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div>
            <p className="eyebrow inline-flex items-center gap-2 mb-6">
              <span className="w-8 h-px bg-cyan-500/50" />
              Stable Audio 3 Overview
            </p>
            <h2 className="text-4xl md:text-6xl font-black mb-10 leading-[1.1] tracking-tight">
              What Is <span className="text-cyan-400">Stable Audio 3</span> <br />AI Video Generator?
            </h2>
            <div className="space-y-6">
              <div className="group relative p-8 rounded-3xl bg-slate-900/30 border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-cyan-500/40 transition-all duration-500 rounded-full" />
                <p className="text-xl text-slate-300 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                  Stable Audio 3 AI Audio Generator is an online tool for creating short cinematic videos from text prompts or still images. It is built around the Stable Audio 3 model, an LTX 2.3 based video generation model designed for text-to-video, image-to-video, and cinematic motion workflows.
                </p>
              </div>
              <div className="group relative p-8 rounded-3xl bg-slate-900/30 border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-cyan-500/40 transition-all duration-500 rounded-full" />
                <p className="text-xl text-slate-300 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                  Instead of setting up ComfyUI, downloading model weights, or using a high-end local GPU, you can use Stable Audio 3 directly in your browser. Write a prompt, upload an image, choose your settings, then preview and download your generated video online.
                </p>
              </div>
            </div>
          </div>

          <div className="tool-stat-stack lg:sticky lg:top-28">
            {toolContent.stats.map((stat) => (
              <div key={stat.label} className="surface-card tool-stat-card group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl -mr-12 -mt-12 transition-opacity opacity-0 group-hover:opacity-100" />
                <span className="block text-5xl font-black text-white mb-2 tracking-tighter">{stat.num}</span>
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-compact">
        <div className="tool-section-shell tool-section-shell-cyan">
          <div className="tool-section-heading-row">
            <div className="max-w-2xl">
              <p className="eyebrow inline-flex items-center gap-2 mb-6">
                <span className="w-8 h-px bg-cyan-500/50" />
                Text-to-Video Generation
              </p>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Turn Text Prompts into <br />Cinematic AI Videos</h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Stable Audio 3 AI Audio Generator turns simple text prompts into short cinematic videos. Write a scene description, then guide the result with subject details, action, camera movement, lighting, mood, and visual style.
              </p>
              <p className="mt-6 text-lg text-slate-400 leading-relaxed">
                The clearer your prompt, the easier it is for Stable Audio 3 to understand the shot you want to create.
              </p>
            </div>
            <div className="tool-highlight-panel shrink-0 max-w-sm">
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 blur-2xl -mr-8 -mt-8" />
              <p className="relative z-10 text-sm text-slate-300 leading-relaxed">
                <strong className="text-cyan-400 block mb-2 uppercase tracking-[0.2em] text-[10px] font-black">Pro Tip</strong>
                Put the most important visual details first. Start with the subject and action, then add camera motion, lighting, environment, and style. This helps Stable Audio 3 understand the scene before applying the final look.
              </p>
            </div>
          </div>

          <div className="tool-prompt-shell border-cyan-500/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08),transparent_70%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase mb-8">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Prompt Formula Example
              </div>
              <div className="text-slate-500 text-xs font-black tracking-[0.2em] uppercase mb-4 opacity-40">
                Product Commercial Prompt
              </div>
              <p className="text-base md:text-lg text-slate-100 leading-8 md:leading-9 font-medium tracking-normal italic max-w-4xl">
                &quot;A luxury ceramic coffee cup on a dark slate surface, steam rising slowly, soft studio backlight with warm rim glow, slow dolly-in camera movement, shallow depth of field, premium lifestyle commercial style, minimal background, realistic condensation texture.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-compact">
        <div className="tool-section-shell tool-section-shell-orange">
          <p className="eyebrow inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-px bg-orange-500/50" />
            Image-to-Video Animation
          </p>
          <div className="max-w-2xl mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Animate Images with <br />Stable Audio 3 AI Audio Generator</h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Stable Audio 3 AI Audio Generator lets you upload a reference image and turn it into a moving video clip. Describe how the subject, camera, lighting, or background should move, and Stable Audio 3 will use your image as the visual starting point.
            </p>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              For better image-to-video results, keep the motion instructions clear and controlled. Try prompts such as slow camera push-in, orbit movement, light sweep, subtle product rotation, natural hair movement, or gentle background motion.
            </p>
          </div>

          <div className="tool-prompt-shell border-orange-500/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.08),transparent_70%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-black tracking-[0.3em] text-orange-400 uppercase mb-8">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                Image Animation Prompt
              </div>
              <div className="text-slate-500 text-xs font-black tracking-[0.2em] uppercase mb-4 opacity-40">
                {toolContent.sections.i2v.example.category}
              </div>
              <p className="text-base md:text-lg text-slate-100 leading-8 md:leading-9 font-medium tracking-normal italic max-w-4xl">
                &quot;{toolContent.sections.i2v.example.prompt}&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-compact relative">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[150px] -z-10" />
        <div className="text-center mb-16">
          <p className="eyebrow inline-flex items-center gap-2 mb-4 justify-center">
            <span className="w-8 h-px bg-cyan-500/50" />
            Capabilities
          </p>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">What You Can Create with Stable Audio 3 AI Audio Generator</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stable Audio 3 AI Audio Generator helps you create short cinematic videos with realistic motion, clean lighting, and flexible styles for marketing, social content, and creative work.
          </p>
        </div>
        <div className="tool-feature-grid">
          {[
            {
              icon: "🛍️",
              title: "Product Videos and E-commerce",
              description:
                "Turn product photos into short videos with smooth camera motion, slow orbit shots, dolly-ins, and lighting sweeps. Great for product pages, online stores, launches, and social promotion.",
            },
            {
              icon: "📱",
              title: "Social Media Clips",
              description:
                "Create short vertical videos for TikTok, Instagram Reels, and YouTube Shorts. Test fast visual hooks, product moments, and creative ideas without filming or editing software.",
            },
            {
              icon: "🎬",
              title: "Pre-Production and Storyboarding",
              description:
                "Explore cinematic shots, camera angles, scene mood, and pacing before full production. Generate multiple visual directions quickly and use them as early storyboard references.",
            },
            {
              icon: "📣",
              title: "Ad Concepts and Campaign Tests",
              description:
                "Create AI video concepts for ads, landing pages, and campaign reviews. Test different tones, product framing, and creative directions before investing in full production.",
            },
            {
              icon: "🏗️",
              title: "Architecture and Interior Visualization",
              description:
                "Animate architectural renders and interior images with walkthrough-style camera motion. Show how a room, layout, or space could feel before it is built.",
            },
            {
              icon: "🎨",
              title: "Concept Art and Creative Direction",
              description:
                "Turn concept art into animated visual references. Use Stable Audio 3 to communicate mood, motion, style, and scene direction more clearly to clients or collaborators.",
            },
          ].map((item) => (
            <div key={item.title} className="tool-feature-card group">
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-cyan-500/40 transition-all duration-500 rounded-full" />
              <span className="text-4xl mb-6 block transform group-hover:scale-110 transition-transform duration-500">{item.icon}</span>
              <h4 className="text-xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors">{item.title}</h4>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-compact">
        <div className="text-center mb-16">
          <p className="eyebrow inline-flex items-center gap-2 mb-4 justify-center">
            <span className="w-8 h-px bg-cyan-500/50" />
            Technical Guide
          </p>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Settings Explained</h2>
        </div>
        <div className="tool-settings-grid">
          {toolContent.settings.map((s) => (
            <div key={s.num} className="tool-settings-card group">
              <span className="w-14 h-14 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center text-xl font-black text-cyan-400 mb-8 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500">
                {s.num}
              </span>
              <h4 className="text-xl font-black text-white mb-4 group-hover:text-cyan-400 transition-colors">{s.title}</h4>
              <p className="text-base text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-compact">
        <div className="text-center mb-16">
          <p className="eyebrow inline-flex items-center gap-2 mb-4 justify-center">
            <span className="w-8 h-px bg-cyan-500/50" />
            Comparison
          </p>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Online Stable Audio 3 vs Local Setup</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Use Stable Audio 3 online when you want to create videos quickly without installing tools or managing model files. Choose a local setup only if you are comfortable with ComfyUI, GPU requirements, and custom workflow configuration.
          </p>
        </div>
        <div className="tool-table-shell">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-8 text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">Feature</th>
                  <th className="p-8 text-cyan-400 font-black uppercase text-[10px] tracking-[0.3em]">Stable Audio 3 Online</th>
                  <th className="p-8 text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">Local Open-Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { feature: "Setup", online: "Browser only", local: "ComfyUI + model files" },
                  { feature: "Local GPU", online: "Not required", local: "High-VRAM GPU recommended" },
                  { feature: "First Video", online: "Start in minutes", local: "Requires setup time" },
                  { feature: "Text-to-Video", online: "Yes", local: "Yes" },
                  { feature: "Image-to-Video", online: "Yes", local: "Yes" },
                  { feature: "Best For", online: "Beginners, creators, marketers", local: "Advanced technical users" },
                  { feature: "Workflow", online: "Simple prompt, settings, preview, download", local: "Custom nodes, files, and model management" },
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="p-8 text-white font-black text-sm group-hover:text-cyan-400 transition-colors">{row.feature}</td>
                    <td className="p-8 text-slate-300 text-sm">{row.online}</td>
                    <td className="p-8 text-slate-400 text-sm">{row.local}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section section-compact scroll-mt-28" id="stable-audio-pricing-plans">
        <div className="section-heading !mb-8">
          <p className="eyebrow">Credit Plans</p>
          <h2>Choose a Stable Audio 3 Credit Pack</h2>
          <p>
            Buy credits only when you need more generations. Credits work for both Text to Video and Image to Video on this page.
          </p>
        </div>
        <PricingCards />
      </section>

      <section className="section">
        <div className="tool-faq-shell">
          <StableAudioFAQ items={toolContent.faq} />
        </div>
      </section>

      <section className="section section-compact pt-0">
        <div className="tool-cta-shell">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_70%)]" />
          <div className="relative z-10">
            <p className="eyebrow inline-flex items-center gap-2 mb-6 justify-center">
              <span className="w-8 h-px bg-cyan-500/50" />
              Get Started
            </p>
            <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">Create Your First AI Video with Stable Audio 3</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Use Stable Audio 3 AI Audio Generator to turn a prompt or image into a cinematic video clip online. Start free in your browser.
            </p>
            <Link
              className="button-primary !py-5 !px-16 !h-auto !text-xl !rounded-2xl shadow-2xl shadow-white/5"
              href="/stable-audio-3"
            >
              Start Generating Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
