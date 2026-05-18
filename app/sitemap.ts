import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { verdicts } from "@/lib/diagnostic";

/**
 * Dynamic sitemap. Verdict slugs come straight from `lib/diagnostic.ts`
 * so adding a new diagnostic verdict updates the sitemap automatically
 * — no parallel list to drift.
 *
 * `lastModified` is per-route in spirit but stored as a single constant
 * for now (no CMS / content frontmatter); bump when content materially
 * changes so crawlers re-fetch.
 */

const LAST_MODIFIED = new Date("2026-05-18");

type ChangeFreq = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

type StaticEntry = {
  path: string;
  priority: number;
  changeFrequency: ChangeFreq;
};

const staticPages: StaticEntry[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  // Hub explainers
  { path: "/how-fiber-works", priority: 0.9, changeFrequency: "monthly" },
  { path: "/inside-your-home", priority: 0.85, changeFrequency: "monthly" },
  { path: "/the-internet-backbone", priority: 0.8, changeFrequency: "monthly" },
  // Comparisons
  { path: "/fiber-vs-cable", priority: 0.95, changeFrequency: "monthly" },
  { path: "/fiber-vs-dsl", priority: 0.75, changeFrequency: "monthly" },
  { path: "/fiber-vs-satellite", priority: 0.85, changeFrequency: "monthly" },
  {
    path: "/fiber-vs-5g-home-internet",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  // Decision + diagnostic hubs
  { path: "/is-fiber-worth-it", priority: 0.95, changeFrequency: "weekly" },
  {
    path: "/why-is-my-internet-slow",
    priority: 0.95,
    changeFrequency: "weekly",
  },
  // Reference
  { path: "/glossary", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
  { path: "/disclosure", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const verdictEntries: MetadataRoute.Sitemap = Object.values(verdicts).map(
    (v) => ({
      url: `${site.url}/why-is-my-internet-slow/${v.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }),
  );

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${site.url}${path}`,
      lastModified: LAST_MODIFIED,
      changeFrequency,
      priority,
    }),
  );

  return [...staticEntries, ...verdictEntries];
}
