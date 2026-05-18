/**
 * Maps FCC BDC provider names → our provider catalog slugs.
 *
 * FCC names are inconsistent ("AT&T", "AT&T Inc.", "Comcast Cable
 * Communications, LLC", "Spectrum Communications", etc.). FRN would be more
 * stable but each large ISP has many subsidiary FRNs and maintaining that
 * map is high-effort. Name-matching with regex patterns is good enough:
 * for unknown names we fall back to a generic provider card.
 */

import type { Provider, ProviderTech } from "@/lib/providers";

type FccProvider = {
  ProviderName: string;
  FRN: string;
  ServedBSLs: number;
  Technology: number; // 10 = copper, 40 = cable, 50 = fiber, 70 = licensed FWA, 71 = unlicensed FWA, 60 = LBR/satellite
};

const TECH_MAP: Record<number, ProviderTech> = {
  10: "dsl",
  40: "cable",
  50: "fiber",
  70: "fwa",
  71: "fwa",
  60: "satellite",
};

/** Patterns that map FCC name → our slug. Order matters — first match wins. */
const NAME_PATTERNS: Array<{ pattern: RegExp; slug: string }> = [
  { pattern: /^at&?t\b/i, slug: "att-fiber" },
  { pattern: /^verizon\b.*fios/i, slug: "verizon-fios" },
  { pattern: /^verizon\b/i, slug: "verizon-fios" },
  { pattern: /^frontier\b/i, slug: "frontier-fiber" },
  { pattern: /^ripple fiber/i, slug: "ripple-fiber" },
  { pattern: /^lumos\b/i, slug: "lumos-fiber" },
  { pattern: /^greenlight\b/i, slug: "greenlight-fiber" },
  { pattern: /^epb\b/i, slug: "epb-fiber" },
  { pattern: /^google fiber\b/i, slug: "google-fiber" },
  { pattern: /^sonic\b/i, slug: "sonic" },
  { pattern: /^ziply\b/i, slug: "ziply-fiber" },
  { pattern: /^ting\b/i, slug: "ting-fiber" },
  { pattern: /^utopia\b/i, slug: "utopia-fiber" },
  { pattern: /^us\s*internet/i, slug: "usi-fiber" },
  { pattern: /^hotwire\b/i, slug: "hotwire-fision" },
  { pattern: /^centurylink\b/i, slug: "centurylink" },
  { pattern: /^quantum\s*fiber/i, slug: "centurylink" },
  { pattern: /^brightspeed\b/i, slug: "brightspeed" },
  { pattern: /^altafiber\b|^cincinnati bell/i, slug: "altafiber" },
  { pattern: /^vexus\b/i, slug: "vexus-fiber" },
  { pattern: /^allo\b/i, slug: "allo" },
  { pattern: /^htc\b|^horry telephone/i, slug: "htc-fiber" },
  { pattern: /^metronet\b/i, slug: "metronet-fiber" },
  { pattern: /^tds\b/i, slug: "tds-fiber" },
  // Cable
  { pattern: /^comcast\b|^xfinity\b/i, slug: "xfinity" },
  { pattern: /^charter\b|^spectrum\b/i, slug: "spectrum" },
  { pattern: /^cox\b/i, slug: "cox" },
  { pattern: /^cablevision\b|^optimum\b|^altice\b/i, slug: "optimum" },
  { pattern: /^astound\b|^rcn\b|^wave\b|^grande\b/i, slug: "astound-fiber" },
  { pattern: /^wow\b/i, slug: "wow-internet" },
  { pattern: /^mediacom\b/i, slug: "mediacom" },
  // Wireless
  { pattern: /^t-mobile\b|^tmobile\b/i, slug: "tmobile-home" },
  { pattern: /^verizon.*5g/i, slug: "verizon-5g-home" },
  { pattern: /^at&?t.*air\b|^at&?t.*internet air/i, slug: "att-internet-air" },
];

/** Returns the catalog slug for an FCC ProviderName, or null if unknown. */
export function matchProviderSlug(name: string): string | null {
  for (const { pattern, slug } of NAME_PATTERNS) {
    if (pattern.test(name)) return slug;
  }
  return null;
}

export type ResolvedProvider =
  | { kind: "known"; provider: Provider; servedBSLs: number; rawName: string }
  | {
      kind: "unknown";
      name: string;
      frn: string;
      tech: ProviderTech;
      servedBSLs: number;
    };

/** Convert an FCC BDC row into a resolved provider we can render. */
export function resolveFccRow(
  row: FccProvider,
  catalog: Record<string, Provider>,
): ResolvedProvider | null {
  const tech = TECH_MAP[row.Technology];
  if (!tech) return null;
  const slug = matchProviderSlug(row.ProviderName);
  if (slug && catalog[slug]) {
    return {
      kind: "known",
      provider: catalog[slug],
      servedBSLs: row.ServedBSLs,
      rawName: row.ProviderName,
    };
  }
  return {
    kind: "unknown",
    name: row.ProviderName,
    frn: row.FRN,
    tech,
    servedBSLs: row.ServedBSLs,
  };
}

/** Sort: known fiber first (by served BSLs desc), then known other, then unknown. */
export function rankResolved(items: ResolvedProvider[]): ResolvedProvider[] {
  const techOrder: Record<ProviderTech, number> = {
    fiber: 0,
    cable: 1,
    fwa: 2,
    dsl: 3,
    satellite: 4,
  };
  return [...items].sort((a, b) => {
    const aTech = a.kind === "known" ? a.provider.tech : a.tech;
    const bTech = b.kind === "known" ? b.provider.tech : b.tech;
    if (aTech !== bTech) return techOrder[aTech] - techOrder[bTech];
    if (a.kind !== b.kind) return a.kind === "known" ? -1 : 1;
    return b.servedBSLs - a.servedBSLs;
  });
}
