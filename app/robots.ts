import type { MetadataRoute } from "next";
import { privateRoutes } from "@/project/config/pages";
import { siteConfig } from "@/project/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...privateRoutes],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
