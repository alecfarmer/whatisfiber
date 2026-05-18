import type { Metadata } from "next";
import { site } from "./site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  /**
   * Optional override for the OG image URL. Defaults to the dynamic
   * `/opengraph-image` route which Next renders at build time per page.
   */
  image?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  type = "article",
  image,
}: PageMetaInput): Metadata {
  const url = `${site.url}${path}`;
  const fullTitle =
    path === "/" ? title : `${title} — ${site.name}`;
  const ogImage = image ?? `${site.url}/opengraph-image`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      type,
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
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
}

type JsonLdProps = { data: object };

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
       
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type ArticleSchemaArgs = {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  /** Optional featured image URL. Defaults to the page's dynamic OG image. */
  image?: string;
  /** Approximate word count — improves AEO ranking signals. */
  wordCount?: number;
  /** Editorial category ("Explainer", "Comparison", "Decision", "Diagnostic"). */
  articleSection?: string;
  /** SEO keywords list — joined into the comma-separated `keywords` field. */
  keywords?: string[];
};

export function buildArticleSchema(args: ArticleSchemaArgs) {
  const image = args.image ?? `${site.url}/opengraph-image`;
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: args.title,
    description: args.description,
    image,
    datePublished: args.datePublished ?? "2026-05-17",
    dateModified: args.dateModified ?? "2026-05-17",
    author: {
      "@type": "Person",
      name: site.author.name,
      url: site.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/icon.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: `${site.url}${args.path}`,
    proficiencyLevel: "Beginner",
    about: { "@type": "Thing", name: "Fiber-optic internet" },
    isAccessibleForFree: true,
    inLanguage: "en-US",
    wordCount: args.wordCount,
    articleSection: args.articleSection,
    keywords: args.keywords?.join(", "),
  };
}

type FaqItem = { q: string; a: string };

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: i.a,
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  trail: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${site.url}${t.path}`,
    })),
  };
}

/**
 * HowTo schema for procedural pages — the diagnostic, the decision quiz,
 * the comparison verdicts. Voice assistants and AI Overviews lift these
 * step-by-step directly into answers.
 */
export function buildHowToSchema(args: {
  name: string;
  description?: string;
  steps: { name: string; text: string; url?: string }[];
  /** Total time the procedure typically takes (ISO 8601 duration, e.g. PT2M). */
  totalTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: args.name,
    description: args.description,
    totalTime: args.totalTime,
    step: args.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: s.url,
    })),
  };
}

/**
 * Site-wide Organization + WebSite schema. Renders once in the root
 * layout so every page carries the publisher identity + the SearchAction
 * pointer that Google uses for sitelinks search box.
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}#organization`,
        name: site.name,
        url: site.url,
        description: site.description,
        founder: {
          "@type": "Person",
          name: site.author.name,
          url: site.author.url,
        },
        logo: {
          "@type": "ImageObject",
          url: `${site.url}/icon.png`,
          width: 512,
          height: 512,
        },
        sameAs: [site.socials.github, site.socials.linkedin].filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        publisher: { "@id": `${site.url}#organization` },
        inLanguage: "en-US",
      },
    ],
  };
}
