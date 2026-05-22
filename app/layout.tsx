import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CnzzAnalytics } from "@/modules/analytics/components/CnzzAnalytics";
import { SiteFooter } from "@/modules/site-shell/components/SiteFooter";
import { SiteHeader } from "@/modules/site-shell/components/SiteHeader";
import { StableAudioAppProviders } from "@/modules/site-shell/components/StableAudioAppProviders";
import { siteConfig } from "@/project/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.description,
  keywords: [...siteConfig.seo.keywords],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: "/og/home.webp",
        width: 1200,
        height: 630,
        alt: "Stable Audio 3 AI Audio Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.description,
    images: ["/og/home.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-slate-900">
        <StableAudioAppProviders>
          <SiteHeader />
          <div className="min-h-screen">{children}</div>
          <SiteFooter />
          <CnzzAnalytics />
        </StableAudioAppProviders>
      </body>
    </html>
  );
}
