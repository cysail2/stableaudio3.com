export const siteConfig = {
  name: "Stable Audio 3",
  productName: "Stable Audio 3 AI Audio Generator",
  url: "https://stableaudio3.com",
  supportEmail: "support@stableaudio3.com",
  apiServiceUrl: "https://svc.stableaudio3.com",
  appIdentifier: "stableaudio3",
  description:
    "Stable Audio 3 is an online AI audio generator built around the open-weight Stable Audio 3 model family from Stability AI. Text-to-audio, audio-to-audio editing, and audio inpainting in the browser.",
  signupCredits: 100,
  seo: {
    defaultTitle: "Stable Audio 3 — Free Online AI Audio Generator (2026)",
    titleTemplate: "%s | Stable Audio 3",
    description:
      "100 free signup credits, no install. Text-to-audio, audio editing, and audio inpaint in three browser modes — Stability AI's open-weight model family.",
    keywords: [
      "Stable Audio 3",
      "Stable Audio 3 AI Audio Generator",
      "text to audio",
      "audio inpainting",
      "AI music generator",
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
