import type { Metadata } from "next";
import { footerNavigation, primaryNavRoutes, seoNavigation } from "./navigation";

export const privateRoutes = [
  "/account",
  "/library",
  "/payment-result",
  "/payment-success",
] as const;

export const privatePageMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export const sitemapRoutes = Array.from(
  new Set<string>([
    "/",
    ...primaryNavRoutes,
    ...seoNavigation.map((item) => item.href),
    ...footerNavigation.map((item) => item.href),
  ]),
);

export const getSitemapRouteConfig = (route: string) => ({
  changeFrequency:
    route === "/" || route === "/stable-audio-3" || seoNavigation.some((item) => item.href === route)
      ? ("weekly" as const)
      : ("monthly" as const),
  priority: route === "/" ? 1 : route === "/stable-audio-3" ? 0.95 : seoNavigation.some((item) => item.href === route) ? 0.8 : 0.7,
});

export const routeLastModified: Record<string, string> = {
  "/": "2026-05-21",
  "/stable-audio-3": "2026-05-21",
  "/how-to-use-stable-audio-3": "2026-05-21",
  "/stable-audio-3-showcase": "2026-05-26",
  "/stable-audio-3-review": "2026-05-27",
  "/stable-audio-3-vs-ace-step": "2026-05-28",
  "/pricing": "2026-05-21",
  "/privacy": "2026-05-21",
  "/terms": "2026-05-21",
  "/refund": "2026-05-21",
};
