export type NavLink = {
  label: string;
  href: string;
  title: string;
};

export type NavGroup = {
  label: string;
  title: string;
  children: readonly NavLink[];
};

export type PrimaryNavItem = NavLink | NavGroup;

export const isNavGroup = (item: PrimaryNavItem): item is NavGroup =>
  "children" in item;

// v1 nav: Generator / Prompt Guide / Pricing only.
// Comparisons dropdown + Showcase + Review are planned for v2 once the
// product has shipped (see IMPLEMENTATION_PLAN.md Phase 5).
export const primaryNavigation: readonly PrimaryNavItem[] = [
  {
    label: "Generator",
    href: "/stable-audio-3",
    title: "Open the Stable Audio 3 AI audio generator",
  },
  {
    label: "Prompt Guide",
    href: "/how-to-use-stable-audio-3",
    title: "Read the Stable Audio 3 prompt guide",
  },
  {
    label: "Pricing",
    href: "/pricing",
    title: "Compare Stable Audio 3 pricing and credit packs",
  },
];

export const primaryNavRoutes = primaryNavigation.flatMap((item) =>
  isNavGroup(item) ? item.children.map((child) => child.href) : [item.href],
);

// Footer "Resources" column. Mirrors primaryNavigation flat for v1
// (v2 will add Review / Showcase / Vs entries once those pages ship).
export const seoNavigation: readonly NavLink[] = [
  {
    label: "Generator",
    href: "/stable-audio-3",
    title: "Open the Stable Audio 3 AI audio generator",
  },
  {
    label: "Prompt Guide",
    href: "/how-to-use-stable-audio-3",
    title: "Read the Stable Audio 3 prompt guide",
  },
  {
    label: "Pricing",
    href: "/pricing",
    title: "Compare Stable Audio 3 pricing and credit packs",
  },
];

export const footerNavigation: readonly NavLink[] = [
  { label: "Privacy", href: "/privacy", title: "Read the Stable Audio 3 privacy policy" },
  { label: "Terms", href: "/terms", title: "Read the Stable Audio 3 terms of service" },
  { label: "Refund", href: "/refund", title: "Read the Stable Audio 3 refund policy" },
];
