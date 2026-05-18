export type JourneyNode = {
  slug: string;
  label: string;
  short: string;
  blurb: string;
  consumer: string;
  technical: string;
  accent: "accent" | "live" | "warn" | "edge" | "flag";
  href?: string;
};

export const journey: JourneyNode[] = [
  {
    slug: "home",
    label: "Your home",
    short: "Home",
    blurb: "ONT turns light into Ethernet.",
    consumer:
      "A small white box on your wall takes pulses of infrared light off the fiber and hands plain old Ethernet to your router.",
    technical:
      "ONT performs O/E/O conversion at the demarc. Downstream 1490 nm GPON / 1577 nm XGS-PON, upstream 1310 / 1270 nm. AES-128-CTR on the GEM port.",
    accent: "accent",
    href: "/inside-your-home",
  },
  {
    slug: "drop",
    label: "Drop & feeder",
    short: "Drop",
    blurb: "Passive glass from your house to the splitter.",
    consumer:
      "From your wall the fiber runs to a small cabinet on your street — no power, no fans, just glass.",
    technical:
      "Drop fiber (G.657.A2 bend-insensitive) to a fiber distribution hub (FDH). All outside plant from CO to ONT is passive — zero powered components.",
    accent: "accent",
  },
  {
    slug: "splitter",
    label: "Splitter",
    short: "Splitter",
    blurb: "1 fiber broadcast to 32 homes.",
    consumer:
      "A piece of fused glass quietly splits one fiber's light into 32 (or 64) identical copies — one for every house on the loop.",
    technical:
      "PLC splitter, 1:32 → ~17 dB insertion loss. Class B+ 28 dB budget leaves ~11 dB for fiber attenuation (0.35 dB/km @ 1310 nm) + connectors.",
    accent: "live",
  },
  {
    slug: "co",
    label: "Central office",
    short: "CO",
    blurb: "Where light first meets a computer.",
    consumer:
      "A windowless building a few miles away catches the light from hundreds of homes, checks who you are, and hands your traffic off.",
    technical:
      "OLT terminates the PON tree on SFP+ optics. RADIUS authentication, DHCPv4/v6 + PD or PPPoE, 100/400GE uplinks to PE routers, BNG enforces policy.",
    accent: "live",
  },
  {
    slug: "ixp",
    label: "Peering edge",
    short: "IXP",
    blurb: "Where networks shake hands.",
    consumer:
      "Your ISP's building is not 'the internet' — it's just one stop. At an Internet Exchange, hundreds of networks meet to swap traffic.",
    technical:
      "Egress via PE → POP → eBGP to transit (Cogent, Lumen, NTT) + settlement-free peers at IXPs (DE-CIX, AMS-IX, Equinix). Filters via IRR + RPKI ROV.",
    accent: "edge",
  },
  {
    slug: "backbone",
    label: "Backbone",
    short: "Backbone",
    blurb: "80,000 networks agreeing to talk.",
    consumer:
      "The internet is not a thing — it's an agreement. Tens of thousands of separate networks all signed up to forward each other's traffic.",
    technical:
      "DFZ carries ~950k IPv4 + ~200k IPv6 prefixes. BGP path selection: LOCAL_PREF → AS_PATH → origin → MED → eBGP > iBGP → IGP cost → router ID.",
    accent: "edge",
  },
  {
    slug: "ocean",
    label: "Submarine cable",
    short: "Ocean",
    blurb: "Garden-hose-sized cables on the sea floor.",
    consumer:
      "99% of intercontinental traffic crosses the ocean on cables about as thick as a garden hose, laid by specialized ships.",
    technical:
      "8–24 fiber pairs per cable, 20–30 Tbps per pair via C+L band DWDM. EDFAs every 60–80 km, fed ~1.6 A constant current at ≤15 kV DC from shore PFE.",
    accent: "warn",
  },
  {
    slug: "edge",
    label: "Edge / CDN",
    short: "Edge",
    blurb: "Netflix is probably inside your ISP.",
    consumer:
      "Netflix, Google, Cloudflare ship servers to your ISP. When you 'connect to California,' you're often connecting to a box 20 miles away.",
    technical:
      "Anycast: same prefix (/24 min) from hundreds of PoPs. Netflix OCAs + Google GGC fill caches in-ISP. HTTP/3 + QUIC + TLS 1.3 0-RTT at the edge.",
    accent: "flag",
  },
];

export const accentColor: Record<JourneyNode["accent"], string> = {
  accent: "var(--accent)",
  live: "var(--status-live)",
  warn: "var(--status-warn)",
  edge: "var(--status-edge)",
  flag: "var(--status-flag)",
};
