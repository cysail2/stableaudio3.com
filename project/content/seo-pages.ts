// Shared SEO content types reused by the SeoPageBlocks component library.
//
// Phase 1: only types + the shared `seoRelatedLinks` default are kept.
// Phase 2 (SA3 content rewrite) will reintroduce per-page content data
// (homePageContent, generatorPageContent, etc.) or replace this with
// per-page content files. For now, page route files import their content
// directly from `project/content/home.ts`, `tool.ts`, `guide.ts`,
// `pricing.ts` (those exist and drive the v1 pages).

export type SeoFaqItem = {
  question: string;
  answer: string;
};

export type SeoSource = {
  label: string;
  href: string;
  note: string;
};

export type SeoRelatedLink = {
  label: string;
  href: string;
  description: string;
};

export type SeoVisualCard = {
  title: string;
  body: string;
  image: string;
  alt: string;
  badge?: string;
};

export type ReviewSection = {
  title: string;
  subheadings?: string[];
  paragraphs: string[];
  bullets?: string[];
};

export type ShowcaseCategory = {
  id: string;
  title: string;
  description: string;
};

export type SeoByline = {
  name: string;
  coReviewer?: string;
  lastUpdated: string;
};

export type ShowcaseByline = SeoByline;

export type SeoHero = {
  eyebrow: string;
  title: string;
  lead: string;
  byline?: SeoByline;
  disclosure?: string;
};

export type KeyFeatureRow = {
  label: string;
  value: string;
};

// Note: `sulphur` field name is a legacy carryover from the Sulphur 2 template.
// Will be renamed to `product` or `ours` in Phase 2 when comparison content
// is rewritten. For now no consumers depend on it (v1 has no comparison pages).
export type MultiCompareRow = {
  dimension: string;
  sulphur: string;
  competitors: readonly string[];
};

export type MultiCompareTable = {
  id?: string;
  intro: string;
  competitors: readonly string[];
  rows: readonly MultiCompareRow[];
  closingNote?: string;
};

export type InlineVideoEvidence = {
  title: string;
  caption: string;
  tag?: string;
  video: string;
  poster: string;
  alt: string;
  uploadDate: string;
  duration: string;
};

export type ShowcaseExample = {
  id: string;
  title: string;
  video: string;
  poster: string;
  alt: string;
  prompt: string;
  tag: string;
  mode: "T2V" | "I2V";
  aspect: "16:9" | "9:16" | "1:1";
  categoryId: string;
  uploadDate: string;
  duration: string;
  bestFor?: string;
};

// Same legacy field-name caveat as MultiCompareRow.
export type ComparisonRow = {
  dimension: string;
  sulphur: string;
  other: string;
  takeaway?: string;
};

// Default related-link set used by the RelatedLinks block when a page
// does not pass its own `links` prop. SA3 v1 only ships 4 routes;
// this list points to all of them.
export const seoRelatedLinks: SeoRelatedLink[] = [
  {
    label: "Try the generator",
    href: "/stable-audio-3",
    description: "Open the Stable Audio 3 generator and create your first audio clip in the browser.",
  },
  {
    label: "Read the prompt guide",
    href: "/how-to-use-stable-audio-3",
    description: "Prompt formulas, BPM tips, and ready-to-copy examples for all three modes.",
  },
  {
    label: "Compare pricing",
    href: "/pricing",
    description: "See credit plans, signup credits, and the cost per audio clip.",
  },
];
