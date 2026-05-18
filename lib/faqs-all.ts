export type FaqCluster = {
  slug: string;
  label: string;
  blurb: string;
  items: { q: string; a: string }[];
};

export const faqClusters: FaqCluster[] = [
  {
    slug: "how-it-works",
    label: "How fiber works",
    blurb: "The physical layer, the optics, and why glass beats copper.",
    items: [
      {
        q: "How does fiber internet work in simple terms?",
        a: "Fiber internet works by sending data as pulses of light through ultra-thin glass strands. A laser flashes on and off billions of times per second; a receiver at the other end translates those flashes back into the 1s and 0s your devices use. Because light barely loses energy moving through glass, fiber delivers symmetric 1–10 Gbps speeds with single-digit-millisecond latency.",
      },
      {
        q: "What is fiber optic cable made of?",
        a: "A telecom fiber strand has two parts of nearly pure silica glass: a central core about 9 µm across (single-mode fiber) and a 125 µm cladding around it with a slightly lower refractive index. Around that is a protective coating, a buffer tube, strength members, and an outer jacket.",
      },
      {
        q: "How fast does light travel through fiber?",
        a: "About 200,000 km/s — roughly two-thirds the speed of light in vacuum. The fiber itself is the fastest part of the entire internet; everything else is queuing, routing, and protocol overhead.",
      },
      {
        q: "What is total internal reflection?",
        a: "When light hits the boundary between two materials at a shallow enough angle and the second material has a lower refractive index, all of the light reflects back. Fiber's core has a slightly higher index than its cladding, so light injected at the right angle bounces down the core forever — even around bends.",
      },
      {
        q: "What is a PON (passive optical network)?",
        a: "A passive optical network is a fiber architecture where everything between the ISP's central office and your home runs on glass with zero powered components. A single fiber from the central office reaches a passive splitter that broadcasts to up to 32 or 64 homes.",
      },
      {
        q: "What is GPON vs XGS-PON?",
        a: "Both are PON standards from the ITU-T. GPON (G.984) delivers 2.488 Gbps down / 1.244 Gbps up, asymmetric, shared across a tree. XGS-PON (G.9807.1) is the modern replacement: 10 Gbps symmetric on different wavelengths so it can coexist on the same fiber.",
      },
      {
        q: "Why is fiber immune to electromagnetic interference?",
        a: "Fiber carries light, not electricity. It doesn't act as an antenna, can't pick up RF noise, and is dielectric — so it doesn't conduct lightning surges. That's why fiber outside plant is far more reliable than coax in storms.",
      },
    ],
  },
  {
    slug: "inside-your-home",
    label: "Inside your home",
    blurb: "The ONT, the drop cable, the router, and what plugs in where.",
    items: [
      {
        q: "What is an ONT?",
        a: "The Optical Network Terminal — the small box on your wall where fiber from outside terminates. A photodetector inside converts infrared light pulses into electrical signals, and a small laser sends your upstream traffic the other way. Hands off standard Ethernet to your router.",
      },
      {
        q: "Is an ONT the same as a modem?",
        a: "No. A modem modulates digital data onto an analog carrier (RF on coax, audio tones on copper). An ONT does direct optical-to-electrical conversion with no analog carrier in between. Same demarc role, completely different technology.",
      },
      {
        q: "Do I need a special router for fiber?",
        a: "No. Any modern router with a gigabit WAN port works. For 2+ Gbps plans you want a 2.5GbE or 10GbE WAN port to receive those speeds. Wi-Fi 6 or 7 helps with many devices but isn't required.",
      },
      {
        q: "Does fiber internet work in a power outage?",
        a: "The fiber itself keeps working. But the ONT needs AC power, and so does your router. Without a UPS or backup battery for both, your internet goes down with your power. Many ISPs sell an optional 8-hour ONT battery backup.",
      },
      {
        q: "Why is my Wi-Fi slow even though I have fiber?",
        a: "The fiber link to your ONT is almost never the bottleneck. Slow Wi-Fi at home is usually an old router (replace pre-Wi-Fi 6), congested 2.4 GHz, too few access points, or a router inside a metal media cabinet. Test wired from the ONT to confirm line speed.",
      },
      {
        q: "What does the red light on my ONT mean?",
        a: "A steady red LOS (Loss of Signal) light almost always means a fiber cut somewhere outside. Power-cycle the ONT first; if the red light persists, tell your ISP the LOS indicator is solid red — that gets faster service.",
      },
    ],
  },
  {
    slug: "comparison",
    label: "Comparisons",
    blurb: "Fiber vs cable, DSL, satellite, and 5G home — head to head.",
    items: [
      {
        q: "Is fiber faster than cable?",
        a: "Yes, especially on upload. A typical cable gigabit plan delivers ~35 Mbps upload; fiber gigabit delivers 1 Gbps symmetric. On peak download cable can match fiber on paper, but cable degrades faster under peak-hour load.",
      },
      {
        q: "Why does my cable internet slow down at 7 PM?",
        a: "Older cable nodes serve 200–500 homes off a single shared upstream channel. When the neighborhood streams 4K, joins video calls, and downloads game patches simultaneously, modems contend for the same spectrum.",
      },
      {
        q: "Is fiber better for gaming than cable?",
        a: "Yes, primarily because of latency under load. Fiber holds 5–15 ms even saturated; cable can spike to 50–300 ms because of bufferbloat in modems. Cloud gaming and competitive multiplayer feel measurably better on fiber.",
      },
      {
        q: "Is fiber faster than Starlink?",
        a: "Yes on bandwidth — fiber typically 1–10 Gbps; Starlink median ~117 Mbps in Q4 2025. On latency, fiber is significantly lower (5–15 ms vs 20–50 ms). Starlink is impressive for satellite but isn't displacing fiber in markets that have both.",
      },
      {
        q: "Is 5G home internet as good as fiber?",
        a: "Depends on cell loading. Under-loaded towers feel fantastic; saturated towers degrade noticeably during peak hours. T-Mobile explicitly deprioritizes Home Internet behind mobile phones. Fiber doesn't share its capacity, so it doesn't have this variance.",
      },
      {
        q: "Why is fiber so much faster than DSL?",
        a: "Medium and architecture. DSL pushes signals up the same copper telephone wire designed for voice — copper attenuates rapidly at high frequencies, capping you by distance. Fiber carries light that barely loses signal over kilometers and dedicates separate wavelengths to upload and download.",
      },
    ],
  },
  {
    slug: "decision",
    label: "Decision",
    blurb: "Should you switch? Should you wait? How much does it cost?",
    items: [
      {
        q: "Is fiber internet worth the extra money?",
        a: "For most households, yes. The real value isn't headline download speed — it's symmetric upload (10–100× faster than cable), latency stability under load, and reliability during weather. Work-from-home, content-creator, multi-device, and gaming households get the most value.",
      },
      {
        q: "How much does fiber internet cost in 2026?",
        a: "Gigabit fiber typically runs $65–$95/month with no equipment fee and no data cap. Multi-gig: 2 Gbps for $90–$120; 5 Gbps for $150–$200; Google Fiber's 8 Gbps tier for $150.",
      },
      {
        q: "Does fiber increase home value?",
        a: "Modestly, yes. Several studies have found 3–5% price premiums on homes in fiber-served neighborhoods. The bigger effect is the inverse: areas with only DSL or unreliable cable can see meaningful price discounts.",
      },
      {
        q: "Is 1 Gbps fiber overkill?",
        a: "Probably yes on download for most homes. What you actually feel from fiber is the symmetric upload, the latency stability, and the no-data-cap freedom. If gigabit is the same price as a slower tier, take it; if it costs $20 more, the 500 Mbps tier is fine.",
      },
      {
        q: "Should I wait for fiber if it's coming to my area soon?",
        a: "If it's truly coming within 6–12 months, yes — once fiber arrives you can switch and skip cable's early-termination dance. If the timeline is 2+ years, don't wait; sign up for whatever works and switch later.",
      },
      {
        q: "How do I switch from cable to fiber?",
        a: "Most fiber installs take 1–3 weeks: a technician runs the drop cable, installs the ONT, configures Wi-Fi if you're using their router. Schedule a few days of overlap with your old service to verify everything works, then cancel cable. Watch for early-termination fees on cable contracts.",
      },
    ],
  },
  {
    slug: "troubleshooting",
    label: "Troubleshooting & curiosity",
    blurb: "Real questions about real edge cases.",
    items: [
      {
        q: "Can sharks bite submarine cables?",
        a: "Yes, but rarely the cause of outages. Most submarine-cable damage comes from fishing trawlers and anchors. Sharks have famously bitten cables — Google armored some after viral footage in 2014 — but it's a small fraction of total faults. Repair ships handle 100+ subsea faults annually.",
      },
      {
        q: "Can fiber optic cable be cut by accident?",
        a: "Yes, this is the most common fiber outage cause — almost always by a backhoe at a construction site. 'Call 811 before you dig' exists for this reason. A fiber cut typically takes 4–12 hours to repair: locate, expose, splice, test.",
      },
      {
        q: "How deep are fiber optic cables buried?",
        a: "Standard direct-burial residential fiber goes 18–24 inches deep. Highway and railroad crossings can be 36–48 inches. Submarine cables sit on the seafloor in deep water but are buried in trenches up to 2 meters deep in shallow coastal water where fishing trawlers operate.",
      },
      {
        q: "Does weather affect fiber internet?",
        a: "No, the fiber itself is immune. Weather indirectly affects fiber when storms damage above-ground cables (aerial fiber on telephone poles), take out power to ONTs, or knock over the central office's grid feed. Underground fiber is essentially weather-proof.",
      },
      {
        q: "Why is my fiber upload slower than download?",
        a: "Either you're on an older GPON plan (1.244 Gbps upstream max, shared) or your ISP is selling asymmetric tiers on top of symmetric capability. XGS-PON delivers 10 Gbps symmetric; some ISPs cap upload below download as a product-tiering decision.",
      },
      {
        q: "How long do fiber optic cables last?",
        a: "Modern single-mode fiber is rated for 25+ years in the ground; the actual lifetime is usually longer. The fiber itself is essentially permanent — degradation comes from cable jackets weathering, splice cases failing, or backhoes. Some fiber laid in the 1980s is still in service.",
      },
    ],
  },
];

export function allFaqs() {
  return faqClusters.flatMap((c) => c.items);
}
