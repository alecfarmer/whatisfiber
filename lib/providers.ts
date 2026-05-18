/**
 * Provider catalog. Speeds and check-URLs based on publicly-published 2026 tiers.
 * `checkUrl` will be swapped for affiliate URLs (FlexOffers / CJ) when those are
 * provisioned — currently points to each ISP's own public availability checker.
 */

export type ProviderTech = "fiber" | "cable" | "dsl" | "fwa" | "satellite";

export const techLabel: Record<ProviderTech, string> = {
  fiber: "Fiber",
  cable: "Cable",
  dsl: "DSL",
  fwa: "5G Home",
  satellite: "Satellite",
};

export const techTone: Record<ProviderTech, string> = {
  fiber: "var(--accent)",
  cable: "var(--status-warn)",
  dsl: "var(--fg-faint)",
  fwa: "var(--status-edge)",
  satellite: "var(--status-flag)",
};

export type Provider = {
  slug: string;
  name: string;
  tech: ProviderTech;
  /** Max consumer download in Mbps. */
  maxDown: number;
  /** Max consumer upload in Mbps. */
  maxUp: number;
  /** True when down == up for the headline tier. */
  symmetric: boolean;
  /** Public availability-check URL. Affiliate URL will replace this later. */
  checkUrl: string;
  /** Short blurb shown on the provider card. */
  blurb: string;
};

export const PROVIDERS: Record<string, Provider> = {
  "att-fiber": {
    slug: "att-fiber",
    name: "AT&T Fiber",
    tech: "fiber",
    maxDown: 5000,
    maxUp: 5000,
    symmetric: true,
    checkUrl: "https://www.att.com/buy/broadband/plans",
    blurb: "Symmetric XGS-PON. Heavy in TX, GA, NC metros — sparse in SC upstate.",
  },
  "ripple-fiber": {
    slug: "ripple-fiber",
    name: "Ripple Fiber",
    tech: "fiber",
    maxDown: 5000,
    maxUp: 5000,
    symmetric: true,
    checkUrl: "https://ripplefiber.com/availability-checker",
    blurb: "Symmetric XGS-PON across the Carolinas. Aggressive 2024–2026 buildout.",
  },
  "lumos-fiber": {
    slug: "lumos-fiber",
    name: "Lumos Fiber",
    tech: "fiber",
    maxDown: 2000,
    maxUp: 2000,
    symmetric: true,
    checkUrl: "https://www.lumosfiber.com/",
    blurb: "Symmetric gig+ across VA, NC, SC. Privately held, growing fast.",
  },
  "greenlight-fiber": {
    slug: "greenlight-fiber",
    name: "Greenlight Networks",
    tech: "fiber",
    maxDown: 2500,
    maxUp: 2500,
    symmetric: true,
    checkUrl: "https://order.greenlightnetworks.com/",
    blurb: "Western NY symmetric fiber — Rochester, Buffalo, Syracuse.",
  },
  "epb-fiber": {
    slug: "epb-fiber",
    name: "EPB Fiber",
    tech: "fiber",
    maxDown: 25000,
    maxUp: 25000,
    symmetric: true,
    checkUrl: "https://epb.com/",
    blurb: "Chattanooga municipal fiber — 25 Gig symmetric available citywide.",
  },
  brightspeed: {
    slug: "brightspeed",
    name: "Brightspeed",
    tech: "fiber",
    maxDown: 2000,
    maxUp: 2000,
    symmetric: true,
    checkUrl: "https://www.brightspeed.com/internet/",
    blurb: "20+ state fiber overbuild on former Lumen footprint.",
  },
  altafiber: {
    slug: "altafiber",
    name: "Altafiber",
    tech: "fiber",
    maxDown: 2000,
    maxUp: 2000,
    symmetric: true,
    checkUrl: "https://www.altafiber.com/internet",
    blurb: "Cincinnati Bell's fiber brand. Cincinnati + northern Kentucky.",
  },
  "vexus-fiber": {
    slug: "vexus-fiber",
    name: "Vexus Fiber",
    tech: "fiber",
    maxDown: 5000,
    maxUp: 5000,
    symmetric: true,
    checkUrl: "https://www.vexusfiber.com/internet",
    blurb: "West Texas + parts of Oklahoma, NM, KS. 5 Gig symmetric tier.",
  },
  allo: {
    slug: "allo",
    name: "ALLO Communications",
    tech: "fiber",
    maxDown: 2500,
    maxUp: 2500,
    symmetric: true,
    checkUrl: "https://www.allocommunications.com/internet/",
    blurb: "Nebraska / Colorado / Arizona / Missouri fiber overbuilder.",
  },
  "htc-fiber": {
    slug: "htc-fiber",
    name: "HTC Fiber",
    tech: "fiber",
    maxDown: 2000,
    maxUp: 2000,
    symmetric: true,
    checkUrl: "https://www.htcinc.net/internet",
    blurb: "Horry Telephone Cooperative — Myrtle Beach SC / Horry County.",
  },
  "metronet-fiber": {
    slug: "metronet-fiber",
    name: "Metronet",
    tech: "fiber",
    maxDown: 5000,
    maxUp: 5000,
    symmetric: true,
    checkUrl: "https://www.metronet.com/check-availability",
    blurb: "Midwest fiber: IN, IL, OH, MI, KY. 5 Gig symmetric tier in most cities.",
  },
  "astound-fiber": {
    slug: "astound-fiber",
    name: "Astound (Wave / Grande / RCN)",
    tech: "cable",
    maxDown: 1500,
    maxUp: 50,
    symmetric: false,
    checkUrl: "https://www.astound.com/",
    blurb: "DOCSIS in TX (Grande), Chicago/DC (RCN), Pacific NW + CA (Wave).",
  },
  cox: {
    slug: "cox",
    name: "Cox",
    tech: "cable",
    maxDown: 2000,
    maxUp: 100,
    symmetric: false,
    checkUrl: "https://www.cox.com/residential/internet.html",
    blurb: "Cable incumbent in AZ, AR, CT (parts), FL (parts), LA, NV, OK, RI, VA.",
  },
  "tds-fiber": {
    slug: "tds-fiber",
    name: "TDS Fiber",
    tech: "fiber",
    maxDown: 8000,
    maxUp: 8000,
    symmetric: true,
    checkUrl: "https://tdstelecom.com/shop/internet-services.html",
    blurb: "Symmetric fiber across 30+ states, mostly small/mid markets.",
  },
  "google-fiber-webpass": {
    slug: "google-fiber-webpass",
    name: "Google Fiber Webpass",
    tech: "fiber",
    maxDown: 1000,
    maxUp: 1000,
    symmetric: true,
    checkUrl: "https://gfiber.com/webpass/signup/",
    blurb: "Multi-dwelling-unit fiber in 6 metros: Chicago, Denver, Miami, San Diego, SF, Seattle.",
  },
  "wow-internet": {
    slug: "wow-internet",
    name: "WOW! Internet",
    tech: "cable",
    maxDown: 1200,
    maxUp: 50,
    symmetric: false,
    checkUrl: "https://www.wowway.com/",
    blurb: "Cable in parts of OH, AL, GA, FL, MI, IN. Fiber overlay launching.",
  },
  mediacom: {
    slug: "mediacom",
    name: "Mediacom",
    tech: "cable",
    maxDown: 1000,
    maxUp: 50,
    symmetric: false,
    checkUrl: "https://mediacomcable.com/",
    blurb: "Cable in 22 small/mid-market states. The biggest cable ISP you've never heard of.",
  },
  "verizon-fios": {
    slug: "verizon-fios",
    name: "Verizon Fios",
    tech: "fiber",
    maxDown: 2000,
    maxUp: 2000,
    symmetric: true,
    checkUrl: "https://www.verizon.com/home/internet/",
    blurb: "Northeast fiber leader. XGS-PON upgrade in progress.",
  },
  "frontier-fiber": {
    slug: "frontier-fiber",
    name: "Frontier Fiber",
    tech: "fiber",
    maxDown: 5000,
    maxUp: 5000,
    symmetric: true,
    checkUrl: "https://frontier.com/shop/internet",
    blurb: "XGS-PON across legacy Frontier territory. Now part of Verizon.",
  },
  "google-fiber": {
    slug: "google-fiber",
    name: "Google Fiber",
    tech: "fiber",
    maxDown: 8000,
    maxUp: 8000,
    symmetric: true,
    checkUrl: "https://gfiber.com/",
    blurb: "Up to 8 Gig symmetric. Select metros only.",
  },
  sonic: {
    slug: "sonic",
    name: "Sonic",
    tech: "fiber",
    maxDown: 10000,
    maxUp: 10000,
    symmetric: true,
    checkUrl: "https://www.sonic.com/availability",
    blurb: "10 Gig symmetric. SF Bay Area + select California metros.",
  },
  centurylink: {
    slug: "centurylink",
    name: "CenturyLink / Quantum Fiber",
    tech: "fiber",
    maxDown: 940,
    maxUp: 940,
    symmetric: true,
    checkUrl: "https://www.centurylink.com/local",
    blurb: "Consumer fiber being absorbed by AT&T as of Feb 2026.",
  },
  "ziply-fiber": {
    slug: "ziply-fiber",
    name: "Ziply Fiber",
    tech: "fiber",
    maxDown: 50000,
    maxUp: 50000,
    symmetric: true,
    checkUrl: "https://ziplyfiber.com/internet",
    blurb: "Pacific Northwest. 50 Gig tier (yes, really) in select areas.",
  },
  "ting-fiber": {
    slug: "ting-fiber",
    name: "Ting Fiber",
    tech: "fiber",
    maxDown: 1000,
    maxUp: 1000,
    symmetric: true,
    checkUrl: "https://ting.com/internet",
    blurb: "Symmetric gig in select college towns and metros.",
  },
  "hotwire-fision": {
    slug: "hotwire-fision",
    name: "Hotwire Fision",
    tech: "fiber",
    maxDown: 1000,
    maxUp: 1000,
    symmetric: true,
    checkUrl: "https://hotwirecommunications.com/",
    blurb: "South Florida multi-dwelling fiber.",
  },
  "utopia-fiber": {
    slug: "utopia-fiber",
    name: "UTOPIA Fiber",
    tech: "fiber",
    maxDown: 10000,
    maxUp: 10000,
    symmetric: true,
    checkUrl: "https://www.utopiafiber.com/utopia-availability-map/",
    blurb: "Open-access municipal fiber in 20+ Utah cities.",
  },
  "usi-fiber": {
    slug: "usi-fiber",
    name: "USI Fiber",
    tech: "fiber",
    maxDown: 1000,
    maxUp: 1000,
    symmetric: true,
    checkUrl: "https://usinternet.com/",
    blurb: "Symmetric gig in Twin Cities + select metros.",
  },
  spectrum: {
    slug: "spectrum",
    name: "Spectrum",
    tech: "cable",
    maxDown: 1000,
    maxUp: 35,
    symmetric: false,
    checkUrl: "https://www.spectrum.com/",
    blurb: "Charter cable. Gigabit down, asymmetric upload.",
  },
  xfinity: {
    slug: "xfinity",
    name: "Xfinity",
    tech: "cable",
    maxDown: 2000,
    maxUp: 200,
    symmetric: false,
    checkUrl: "https://www.xfinity.com/",
    blurb: "Comcast cable. DOCSIS 4.0 launching in many markets.",
  },
  optimum: {
    slug: "optimum",
    name: "Optimum",
    tech: "cable",
    maxDown: 5000,
    maxUp: 5000,
    symmetric: true,
    checkUrl: "https://www.optimum.com/",
    blurb: "Altice. Fiber overlay reaching 5 Gig symmetric in covered areas.",
  },
  "rcn-astound": {
    slug: "rcn-astound",
    name: "Astound (RCN)",
    tech: "cable",
    maxDown: 1500,
    maxUp: 50,
    symmetric: false,
    checkUrl: "https://www.astound.com/",
    blurb: "DOCSIS in urban East Coast + Chicago + parts of CA.",
  },
  "tmobile-home": {
    slug: "tmobile-home",
    name: "T-Mobile Home Internet",
    tech: "fwa",
    maxDown: 415,
    maxUp: 50,
    symmetric: false,
    checkUrl: "https://www.t-mobile.com/home-internet",
    blurb: "5G fixed wireless. Deprioritized below mobile traffic.",
  },
  "verizon-5g-home": {
    slug: "verizon-5g-home",
    name: "Verizon 5G Home",
    tech: "fwa",
    maxDown: 1000,
    maxUp: 75,
    symmetric: false,
    checkUrl: "https://www.verizon.com/5g/home/",
    blurb: "C-band 5G FWA. Up to gigabit on mmWave addresses.",
  },
  "att-internet-air": {
    slug: "att-internet-air",
    name: "AT&T Internet Air",
    tech: "fwa",
    maxDown: 300,
    maxUp: 25,
    symmetric: false,
    checkUrl: "https://www.att.com/internet-air/",
    blurb: "5G fixed wireless. AT&T's DSL-replacement product.",
  },
};

export function providerBySlug(slug: string): Provider | undefined {
  return PROVIDERS[slug];
}

export function providersBySlugs(slugs: string[]): Provider[] {
  return slugs
    .map((s) => PROVIDERS[s])
    .filter((p): p is Provider => Boolean(p));
}

/** Sort: fiber first (symmetric first within fiber), then cable, fwa, dsl, satellite. */
export function rankProviders(providers: Provider[]): Provider[] {
  const techOrder: Record<ProviderTech, number> = {
    fiber: 0,
    cable: 1,
    fwa: 2,
    dsl: 3,
    satellite: 4,
  };
  return [...providers].sort((a, b) => {
    if (a.tech !== b.tech) return techOrder[a.tech] - techOrder[b.tech];
    if (a.symmetric !== b.symmetric) return a.symmetric ? -1 : 1;
    return b.maxDown - a.maxDown;
  });
}
