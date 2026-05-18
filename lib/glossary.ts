export type GlossaryTerm = {
  term: string;
  acronym?: string;
  category:
    | "physical"
    | "access"
    | "protocols"
    | "backbone"
    | "wireless"
    | "performance"
    | "edge"
    | "infrastructure";
  short: string;
};

export const glossary: GlossaryTerm[] = [
  {
    term: "ADSL2+",
    acronym: "ADSL2+",
    category: "access",
    short:
      "Asymmetric Digital Subscriber Line 2+. Runs internet over phone-line copper at up to 24 Mbps down and 3.5 Mbps up — only at short distances from the central office.",
  },
  {
    term: "Anycast",
    category: "backbone",
    short:
      "A routing trick where many servers in different places share the same IP address. BGP automatically delivers your request to the nearest one. Backbone of how CDNs work.",
  },
  {
    term: "AS",
    acronym: "AS",
    category: "backbone",
    short:
      "Autonomous System — a single network with its own external routing policy. Every ISP, hyperscaler, or major enterprise has a globally-unique AS number (e.g., Cloudflare is AS13335).",
  },
  {
    term: "Attenuation",
    category: "physical",
    short:
      "Signal loss as it travels through a medium. Measured in dB per kilometer. Fiber attenuates roughly 0.20 dB/km at 1550 nm — astonishingly low.",
  },
  {
    term: "Bend-insensitive fiber",
    category: "physical",
    short:
      "ITU-T G.657.A2 single-mode fiber that survives 10 mm bend radius without losing signal. What lets installers staple drop cable around baseboards.",
  },
  {
    term: "Beamforming",
    category: "wireless",
    short:
      "Steering a radio beam toward a specific direction by coordinating many antenna elements. Used in 5G MIMO arrays and Starlink phased-array dishes.",
  },
  {
    term: "BGP",
    acronym: "BGP",
    category: "backbone",
    short:
      "Border Gateway Protocol (RFC 4271). The protocol by which networks tell each other which IP prefixes they can reach. The internet's routing nervous system.",
  },
  {
    term: "BNG",
    acronym: "BNG",
    category: "infrastructure",
    short:
      "Broadband Network Gateway. The ISP-side router that authenticates subscribers, assigns IP addresses, and enforces traffic policies. Often colocated with the OLT.",
  },
  {
    term: "Bufferbloat",
    category: "performance",
    short:
      "Excessive queuing latency caused by oversized buffers in modems and routers. Endemic to older cable modems — pings can climb from 30 ms to 1+ second under load.",
  },
  {
    term: "Cell sector",
    category: "wireless",
    short:
      "One directional segment of a cellular tower's coverage. A 5G base station typically has 3 sectors covering 120° each. Capacity is per-sector, not per-tower.",
  },
  {
    term: "Central office",
    acronym: "CO",
    category: "infrastructure",
    short:
      "The local building where an ISP houses its OLT, BNG, aggregation routers, batteries, and generators. Usually a windowless concrete box you've driven past without noticing.",
  },
  {
    term: "CMTS",
    acronym: "CMTS",
    category: "access",
    short:
      "Cable Modem Termination System. The cable industry's equivalent of a PON OLT — terminates DOCSIS connections from neighborhood nodes at the headend.",
  },
  {
    term: "Deprioritization",
    category: "wireless",
    short:
      "QoS-class demotion of certain traffic when the network is congested. T-Mobile Home Internet customers get deprioritized below mobile phone users above 1.2 TB/month.",
  },
  {
    term: "DFZ",
    acronym: "DFZ",
    category: "backbone",
    short:
      "Default-Free Zone. The set of BGP routers carrying the full global routing table — roughly 950k IPv4 + 200k IPv6 prefixes — with no default route.",
  },
  {
    term: "DMT",
    acronym: "DMT",
    category: "access",
    short:
      "Discrete Multi-Tone modulation. Splits DSL's frequency band into hundreds of narrow sub-carriers, each independently modulated. The whole reason DSL works at all.",
  },
  {
    term: "DOCSIS",
    acronym: "DOCSIS",
    category: "access",
    short:
      "Data Over Cable Service Interface Specification. The standard for cable internet — 3.0, 3.1, and 4.0 are the meaningful generations as of 2026.",
  },
  {
    term: "Drop cable",
    category: "physical",
    short:
      "The fiber that runs from a street splitter cabinet to your home's external network interface. Modern drops use bend-insensitive G.657.A2 fiber.",
  },
  {
    term: "DSL",
    acronym: "DSL",
    category: "access",
    short:
      "Digital Subscriber Line. A family of technologies that delivers internet over copper telephone wire. Being retired across the US and UK.",
  },
  {
    term: "DSLAM",
    acronym: "DSLAM",
    category: "access",
    short:
      "DSL Access Multiplexer. The ISP-side equipment that aggregates many copper pairs into IP backhaul. Lives in central offices or street cabinets (for FTTC).",
  },
  {
    term: "DWDM",
    acronym: "DWDM",
    category: "backbone",
    short:
      "Dense Wavelength Division Multiplexing. Carries many wavelengths of light on the same fiber — typically 96 channels in the C-band — each at 400 Gbps or 800 Gbps.",
  },
  {
    term: "EDFA",
    acronym: "EDFA",
    category: "backbone",
    short:
      "Erbium-Doped Fiber Amplifier. Boosts all wavelengths in a fiber simultaneously without converting light back to electricity. Used every 60–100 km on long-haul fiber.",
  },
  {
    term: "Ethernet",
    category: "infrastructure",
    short:
      "The wired-LAN standard. Fiber ONTs hand off Ethernet to your router. Gigabit (1000BASE-T) is standard; 2.5GbE and 10GbE are increasingly common for multi-gig plans.",
  },
  {
    term: "FTTC",
    acronym: "FTTC",
    category: "access",
    short:
      "Fiber To The Cabinet. Fiber runs to a street-side cabinet; copper VDSL2 covers the last few hundred meters to homes. Hybrid architecture.",
  },
  {
    term: "FTTH",
    acronym: "FTTH",
    category: "access",
    short:
      "Fiber To The Home. The fiber connection runs all the way to your residence — no copper or coax in the last mile. Also written FTTP.",
  },
  {
    term: "FWA",
    acronym: "FWA",
    category: "wireless",
    short:
      "Fixed Wireless Access. Internet delivered to a home via cellular technology (T-Mobile Home Internet, Verizon 5G Home, AT&T Internet Air).",
  },
  {
    term: "GEM port",
    acronym: "GEM",
    category: "protocols",
    short:
      "GPON Encapsulation Method port. A logical channel inside a GPON tree assigned to a specific subscriber. AES-128-CTR encryption is applied per GEM port.",
  },
  {
    term: "GGC",
    acronym: "GGC",
    category: "edge",
    short:
      "Google Global Cache. Caching appliances Google ships to ISPs and embeds in their networks — serves YouTube, Google Search, Maps tiles locally instead of from a distant origin.",
  },
  {
    term: "GPON",
    acronym: "GPON",
    category: "access",
    short:
      "Gigabit Passive Optical Network (ITU-T G.984). 2.488 Gbps downstream / 1.244 Gbps upstream shared across a tree of 32–64 homes. The dominant residential fiber tech.",
  },
  {
    term: "Headend",
    category: "infrastructure",
    short:
      "Cable industry term for the central facility where the CMTS lives and where the cable plant terminates. Equivalent to a telco central office.",
  },
  {
    term: "HFC",
    acronym: "HFC",
    category: "access",
    short:
      "Hybrid Fiber-Coax. The cable industry's architecture: fiber from headend to a neighborhood node, coaxial cable to homes from there.",
  },
  {
    term: "IXP",
    acronym: "IXP",
    category: "backbone",
    short:
      "Internet Exchange Point. A physical building (e.g., DE-CIX, AMS-IX, Equinix Ashburn) where many networks bring their cables to swap traffic directly.",
  },
  {
    term: "Jitter",
    category: "performance",
    short:
      "Variability in latency. If pings vary from 30 to 200 ms, jitter is 170 ms — a video-call disaster. Fiber typically holds jitter below 1 ms.",
  },
  {
    term: "Latency",
    category: "performance",
    short:
      "Time for a packet to round-trip. Measured in milliseconds. Fiber typically 5–15 ms; cable 15–30 ms idle, much higher loaded; LEO satellite 20–40 ms; GEO satellite 600+ ms.",
  },
  {
    term: "LEO orbit",
    acronym: "LEO",
    category: "wireless",
    short:
      "Low Earth Orbit, ~160–2,000 km up. Starlink lives here. Low latency, but satellites move fast and need handoffs every few minutes.",
  },
  {
    term: "GEO orbit",
    acronym: "GEO",
    category: "wireless",
    short:
      "Geostationary Earth Orbit, 35,786 km up. The satellite appears fixed in the sky, but signal-travel adds 600+ ms of unavoidable latency.",
  },
  {
    term: "mmWave",
    category: "wireless",
    short:
      "Millimeter wave — radio frequencies above ~24 GHz. Massive bandwidth but blocked by walls, leaves, and even humid air. Used as a 5G overlay in dense urban pockets.",
  },
  {
    term: "OFDM",
    acronym: "OFDM",
    category: "protocols",
    short:
      "Orthogonal Frequency Division Multiplexing. Splits a wide channel into thousands of narrow sub-carriers. Used in DOCSIS 3.1 downstream, LTE/5G, Wi-Fi.",
  },
  {
    term: "OFDMA",
    acronym: "OFDMA",
    category: "protocols",
    short:
      "Orthogonal Frequency Division Multiple Access. Like OFDM but lets multiple users share the channel simultaneously by assigning each a subset of sub-carriers.",
  },
  {
    term: "OLT",
    acronym: "OLT",
    category: "access",
    short:
      "Optical Line Terminal. The ISP-side end of a passive optical network — lives in the central office and terminates PON trees on SFP+ optics.",
  },
  {
    term: "ONT",
    acronym: "ONT",
    category: "access",
    short:
      "Optical Network Terminal. The small white box on your wall that converts fiber's light pulses into Ethernet your router can use. Also called an ONU.",
  },
  {
    term: "OCA",
    acronym: "OCA",
    category: "edge",
    short:
      "Open Connect Appliance. Netflix's caching server — ships them to ISPs, embeds in their networks. Serves over 95% of Netflix traffic from inside the ISP.",
  },
  {
    term: "PON",
    acronym: "PON",
    category: "access",
    short:
      "Passive Optical Network. Fiber architecture where everything between the OLT and the ONT is unpowered — including the splitters that broadcast one fiber's signal to many homes.",
  },
  {
    term: "Peering",
    category: "backbone",
    short:
      "Two networks agreeing to exchange traffic directly, usually at no cost. The settlement-free peering done at IXPs is what makes the modern internet economically viable.",
  },
  {
    term: "Phased array",
    category: "wireless",
    short:
      "An antenna with many small elements whose individual timings can be adjusted to electronically steer a beam — no moving parts. Starlink's dish has 1,280 of them.",
  },
  {
    term: "PLC splitter",
    acronym: "PLC",
    category: "access",
    short:
      "Planar Lightwave Circuit splitter. A passive piece of fused glass that divides one fiber's light into many identical copies (typically 1:32 or 1:64). Zero power, decades of life.",
  },
  {
    term: "PNI",
    acronym: "PNI",
    category: "backbone",
    short:
      "Private Network Interconnect. A dedicated cross-connect between an ISP and a hyperscaler (Google, Meta, Amazon) — typically 100GE+ — bypassing the public IXP fabric.",
  },
  {
    term: "PSTN",
    acronym: "PSTN",
    category: "infrastructure",
    short:
      "Public Switched Telephone Network. The legacy analog telephone system. Being retired across the US and UK as carriers move to IP-based voice.",
  },
  {
    term: "QUIC",
    category: "protocols",
    short:
      "A transport protocol built on UDP that powers HTTP/3. Eliminates head-of-line blocking, supports 0-RTT session resumption, and migrates connections across networks.",
  },
  {
    term: "Rain fade",
    category: "wireless",
    short:
      "Loss of satellite signal during heavy precipitation. Ka-band (HughesNet/Viasat) is hit hardest; Ku-band (Starlink) is moderately affected; sub-6 GHz is immune.",
  },
  {
    term: "RPKI",
    acronym: "RPKI",
    category: "backbone",
    short:
      "Resource Public Key Infrastructure. A cryptographic layer over BGP that lets networks verify which ASes are authorized to originate which IP prefixes. Defends against route hijacks.",
  },
  {
    term: "SC/APC connector",
    category: "physical",
    short:
      "The square fiber connector with a green-tipped ferrule used on most residential ONTs. The 'APC' angled-polish prevents reflected light from causing laser noise.",
  },
  {
    term: "Single-mode fiber",
    category: "physical",
    short:
      "Fiber with a 9 µm core that propagates light in a single transverse mode. Used for almost all telecom fiber — long distances, high bandwidth.",
  },
  {
    term: "Splice",
    category: "physical",
    short:
      "A permanent joint between two fibers. Fusion splicing melts the ends together with an arc; mechanical splicing aligns them with index-matching gel.",
  },
  {
    term: "Submarine cable",
    category: "backbone",
    short:
      "An undersea fiber cable carrying intercontinental internet traffic. About 552 are active in 2026, with 8–24 fiber pairs each and EDFAs every 60–80 km.",
  },
  {
    term: "Symmetric",
    category: "performance",
    short:
      "Upload speed equal to download speed. Fiber does this natively (XGS-PON: 10/10 Gbps); cable usually doesn't (DOCSIS 3.1 download is 30–50× upload).",
  },
  {
    term: "TDMA",
    acronym: "TDMA",
    category: "protocols",
    short:
      "Time Division Multiple Access. Used in PON upstream: the OLT assigns precise time slots so 32 ONTs can transmit on the same fiber without colliding.",
  },
  {
    term: "Total internal reflection",
    category: "physical",
    short:
      "When light hits the boundary between two materials at a shallow angle and the second has lower refractive index, all of it reflects back. The whole reason fiber works.",
  },
  {
    term: "Transit",
    category: "backbone",
    short:
      "Paid upstream connectivity. A smaller network pays a larger one (typically a tier-1) to deliver traffic to the rest of the internet. Costs $0.30–$2/Mbps committed in 2026.",
  },
  {
    term: "VDSL2",
    acronym: "VDSL2",
    category: "access",
    short:
      "Very-high-bitrate DSL 2 (ITU-T G.993.2). Reaches ~100/40 Mbps within 300 m of a fiber-fed street cabinet. The DSL flavor most commonly deployed today.",
  },
  {
    term: "Vectoring",
    category: "protocols",
    short:
      "Noise cancellation between copper pairs in the same bundle. Lets VDSL2 push higher rates by mathematically eliminating crosstalk across many lines.",
  },
  {
    term: "Wavelength",
    category: "physical",
    short:
      "The color of light. GPON uses 1490 nm down / 1310 nm up; XGS-PON uses 1577 / 1270 nm. Different wavelengths don't interfere — they share the same fiber.",
  },
  {
    term: "XGS-PON",
    acronym: "XGS-PON",
    category: "access",
    short:
      "Ten-Gigabit Symmetric PON (ITU-T G.9807.1). 10 Gbps in both directions over the same fiber and splitters as legacy GPON. The modern fiber-to-the-home standard.",
  },
];

export const categoryLabel: Record<GlossaryTerm["category"], string> = {
  physical: "Physical layer",
  access: "Access network",
  protocols: "Protocols",
  backbone: "Backbone & routing",
  wireless: "Wireless & satellite",
  performance: "Performance",
  edge: "CDN & edge",
  infrastructure: "Infrastructure",
};
