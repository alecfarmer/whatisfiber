import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ModeProvider } from "@/lib/mode-context";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { site } from "@/lib/site";
import { JsonLd, buildOrganizationSchema } from "@/lib/metadata";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  manifest: "/manifest.webmanifest",
  authors: [{ name: site.author.name, url: site.author.url }],
  keywords: [
    "fiber internet",
    "fiber optic internet",
    "how fiber works",
    "fiber vs cable",
    "fiber vs DSL",
    "fiber vs Starlink",
    "fiber vs 5G home internet",
    "FTTH",
    "GPON",
    "XGS-PON",
    "ONT",
    "internet backbone",
    "BGP",
    "submarine cable",
    "CDN edge",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#05070f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable}`}
      data-mode="reader"
      data-scroll-behavior="smooth"
      // Browser extensions (translators, password managers) inject attrs on
      // <html> before React hydrates. Suppress the noise — React still
      // hydrates correctly and our own state has no SSR/CSR mismatch.
      suppressHydrationWarning
    >
      <body>
        <JsonLd data={buildOrganizationSchema()} />
        <a href="#main" className="skip">
          Skip to content
        </a>
        <ModeProvider>
          <SiteNav />
          <main id="main" className="relative z-[2]">
            {children}
          </main>
          <SiteFooter />
        </ModeProvider>
        {/* Vercel Analytics — no-op in dev, ships page-view + custom events
            once deployed to Vercel. No config needed; project ID is wired
            from the deployment automatically. */}
        <Analytics />
      </body>
    </html>
  );
}
