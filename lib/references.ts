/**
 * Canonical sources cited across the site. Used by the homepage references
 * row and by the per-claim <Cite> component (coming next turn).
 */

export type ReferenceSource = {
  slug: string;
  title: string;
  publisher: string;
  year: string;
  url: string;
  blurb: string;
};

export const REFERENCES: ReferenceSource[] = [
  {
    slug: "fcc-iaa-2024",
    title: "Internet Access Services, December 2024",
    publisher: "FCC",
    year: "2024",
    url: "https://docs.fcc.gov/public/attachments/DOC-411463A1.pdf",
    blurb:
      "Official US broadband subscriber breakdown. DSL is 6.6% of connections and falling fast.",
  },
  {
    slug: "openvault-q4-2025",
    title: "Broadband Insights — Q4 2025",
    publisher: "OpenVault",
    year: "2025",
    url: "https://openvault.com/",
    blurb:
      "Average US household used 711.4 GB/month — works out to under 50 Mbps peak.",
  },
  {
    slug: "ookla-jan-2026",
    title: "Speedtest Global Index",
    publisher: "Ookla",
    year: "2026",
    url: "https://www.speedtest.net/global-index",
    blurb:
      "US median fixed broadband: 306 Mbps down / 55+ Mbps up as of January 2026.",
  },
  {
    slug: "itu-g984",
    title: "ITU-T G.984 — Gigabit-capable PON",
    publisher: "ITU-T",
    year: "2008",
    url: "https://www.itu.int/rec/T-REC-G.984",
    blurb:
      "The GPON standard. 2.488 Gbps down / 1.244 Gbps up, 1490 nm / 1310 nm wavelengths.",
  },
  {
    slug: "itu-g9807",
    title: "ITU-T G.9807.1 — XGS-PON",
    publisher: "ITU-T",
    year: "2016",
    url: "https://www.itu.int/rec/T-REC-G.9807.1",
    blurb:
      "10 Gbps symmetric PON on 1577 nm / 1270 nm. Coexists with legacy GPON on the same fiber.",
  },
  {
    slug: "cablelabs-docsis-4",
    title: "DOCSIS 4.0 specification",
    publisher: "CableLabs",
    year: "2024",
    url: "https://www.cablelabs.com/specifications/docsis-4.0",
    blurb:
      "Cable's catch-up answer to fiber: 10 Gbps down, 6 Gbps up, spectrum extended to 1.8 GHz.",
  },
  {
    slug: "telegeography-cables",
    title: "Submarine Cable Map",
    publisher: "TeleGeography",
    year: "2026",
    url: "https://www.submarinecablemap.com/",
    blurb:
      "552+ active submarine cables carry roughly 99% of intercontinental internet traffic.",
  },
  {
    slug: "cidr-report",
    title: "BGP Routing Table Analysis",
    publisher: "Geoff Huston / APNIC",
    year: "2026",
    url: "https://www.cidr-report.org/as2.0/",
    blurb:
      "~950k IPv4 + ~200k IPv6 prefixes carried across roughly 80,000 active autonomous systems.",
  },
];
