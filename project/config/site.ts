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
    defaultTitle: "Stable Audio 3 Online - Create AI Audio Free",
    titleTemplate: "%s | Stable Audio 3",
    description:
      "Use Stable Audio 3 online to generate music, ambient beds, and sound effects, or edit and inpaint existing audio. Start free, three modes in the browser.",
    keywords: [
      "Stable Audio 3",
      "Stable Audio 3 AI Audio Generator",
      "AI audio generator",
      "text to audio",
      "audio inpainting",
      "AI music generator",
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
