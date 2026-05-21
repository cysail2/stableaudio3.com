export type NavLink = {
  label: string;
  href: string;
};

export type NavGroup = {
  label: string;
  children: readonly NavLink[];
};

export type PrimaryNavItem = NavLink | NavGroup;

export const isNavGroup = (item: PrimaryNavItem): item is NavGroup =>
  "children" in item;

// v1 nav: Generator / Prompt Guide / Pricing only.
// Comparisons dropdown + Showcase + Review are planned for v2 once the
// product has shipped (see IMPLEMENTATION_PLAN.md Phase 5).
export const primaryNavigation: readonly PrimaryNavItem[] = [
  { label: "Generator", href: "/stable-audio-3" },
  { label: "Prompt Guide", href: "/how-to-use-stable-audio-3" },
  { label: "Pricing", href: "/pricing" },
];

export const primaryNavRoutes = primaryNavigation.flatMap((item) =>
  isNavGroup(item) ? item.children.map((child) => child.href) : [item.href],
);

// Footer "Resources" column. Mirrors primaryNavigation flat for v1
// (v2 will add Review / Showcase / Vs entries once those pages ship).
export const seoNavigation: readonly NavLink[] = [
  { label: "Generator", href: "/stable-audio-3" },
  { label: "Prompt Guide", href: "/how-to-use-stable-audio-3" },
  { label: "Pricing", href: "/pricing" },
];

export const footerNavigation: readonly NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund", href: "/refund" },
];
