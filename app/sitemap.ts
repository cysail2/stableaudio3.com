import type { MetadataRoute } from "next";
import { getSitemapRouteConfig, routeLastModified, sitemapRoutes } from "@/project/config/pages";
import { siteConfig } from "@/project/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes.map((route) => ({
    url: `${siteConfig.url}${route === "/" ? "" : route}`,
    lastModified: routeLastModified[route] ?? "2026-05-15",
    ...getSitemapRouteConfig(route),
  }));
}
