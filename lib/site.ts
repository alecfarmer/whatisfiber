export const site = {
  name: "What Is Fiber",
  tagline: "How your internet actually works",
  description:
    "Fiber-optic internet, explained in plain English and pulled apart at the spec level — plus honest comparisons against cable, DSL, Starlink, and 5G home internet.",
  url: "https://whatisfiber.com",
  author: {
    name: "James Farmer",
    url: "https://alecfarmer.com",
  },
  socials: {
    github: "https://github.com/alecfarmer",
    linkedin: "https://linkedin.com/in/ja-farmer",
  },
} as const;

export type SiteNavItem = {
  href:
    | "/"
    | "/how-fiber-works"
    | "/inside-your-home"
    | "/the-internet-backbone"
    | "/fiber-vs-cable"
    | "/fiber-vs-dsl"
    | "/fiber-vs-satellite"
    | "/fiber-vs-5g-home-internet"
    | "/is-fiber-worth-it"
    | "/glossary"
    | "/faq";
  label: string;
  short?: string;
  group: "explain" | "compare" | "decide" | "reference";
  blurb?: string;
};

export const nav: SiteNavItem[] = [
  { href: "/", label: "Home", group: "explain" },
  {
    href: "/how-fiber-works",
    label: "How fiber works",
    short: "How it works",
    group: "explain",
    blurb: "Light, glass, lasers — the full mechanism.",
  },
  {
    href: "/inside-your-home",
    label: "Inside your home",
    group: "explain",
    blurb: "The ONT, the drop cable, the router gotchas.",
  },
  {
    href: "/the-internet-backbone",
    label: "The internet backbone",
    short: "Backbone",
    group: "explain",
    blurb: "BGP, IXPs, and how your packet reaches Tokyo.",
  },
  {
    href: "/fiber-vs-cable",
    label: "Fiber vs cable",
    group: "compare",
    blurb: "Speed, latency, upload, price — head to head.",
  },
  {
    href: "/fiber-vs-dsl",
    label: "Fiber vs DSL",
    group: "compare",
    blurb: "Why copper caps out at ~100 Mbps.",
  },
  {
    href: "/fiber-vs-satellite",
    label: "Fiber vs satellite",
    group: "compare",
    blurb: "Starlink, HughesNet, and the latency-of-physics problem.",
  },
  {
    href: "/fiber-vs-5g-home-internet",
    label: "Fiber vs 5G home",
    short: "Fiber vs 5G",
    group: "compare",
    blurb: "What you trade for the no-install convenience.",
  },
  {
    href: "/is-fiber-worth-it",
    label: "Is fiber worth it?",
    group: "decide",
    blurb: "Honest answer, by household type.",
  },
  {
    href: "/glossary",
    label: "Glossary",
    group: "reference",
    blurb: "Every term, defined in one sentence.",
  },
  {
    href: "/faq",
    label: "FAQ",
    group: "reference",
    blurb: "50+ real questions, real answers.",
  },
];

export const navByGroup = {
  explain: nav.filter((n) => n.group === "explain" && n.href !== "/"),
  compare: nav.filter((n) => n.group === "compare"),
  decide: nav.filter((n) => n.group === "decide"),
  reference: nav.filter((n) => n.group === "reference"),
};
