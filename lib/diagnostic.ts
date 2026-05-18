/**
 * "Why is my internet slow?" diagnostic — pure data + rules.
 *
 * Honesty rules:
 *  - 5 of 11 verdicts do NOT route to fiber — they honestly tell the user
 *    the problem is their router / Wi-Fi / hardware.
 *  - Free fixes first, always. The fiber CTA is the THIRD card on any
 *    verdict that has one — never the first.
 *  - Confidence labels are part of every verdict (very-likely / likely /
 *    probably / possibly) — the user knows when we're guessing.
 */

export type QuestionId =
  | "symptom"
  | "scope"
  | "connection"
  | "setup"
  | "timing"
  | "upload"
  | "bufferbloat";

export type VerdictId =
  | "router-in-cabinet"
  | "bufferbloat"
  | "upload-choked"
  | "data-cap-throttling"
  | "wifi-dead-zones"
  | "old-router"
  | "cable-modem-plant"
  | "plan-too-small"
  | "gaming-latency"
  | "wifi-congestion"
  | "expectations";

export type Answers = Partial<Record<QuestionId, string>>;

export type Option = { id: string; label: string; hint?: string };
export type Question = {
  id: QuestionId;
  prompt: string;
  sub?: string;
  options: Option[];
  shouldAsk?: (a: Answers) => boolean;
};

export const questions: Question[] = [
  {
    id: "symptom",
    prompt: "What's actually going wrong?",
    sub: "Pick whichever bothers you most. We'll narrow it from here.",
    options: [
      { id: "pages", label: "Pages load slowly or time out" },
      { id: "calls", label: "Video calls freeze or glitch" },
      { id: "stream", label: "Streaming buffers or drops to low quality" },
      { id: "gaming", label: "Gaming lags or shows high ping" },
      { id: "upload", label: "Uploads crawl (photos, backups, Twitch)" },
      { id: "everything", label: "Everything feels slow, all the time" },
    ],
  },
  {
    id: "scope",
    prompt: "Where does it happen?",
    sub: "This narrows whether it's your network or your service.",
    options: [
      { id: "everywhere", label: "Every device, every room, all the time" },
      { id: "devices", label: "Only on certain devices (phone, laptop, console)" },
      { id: "rooms", label: "Only in certain rooms (back bedroom, garage)" },
      { id: "evenings", label: "Only at certain times (after 7pm, weekends)" },
      { id: "concurrent", label: "Only when someone else is doing something heavy" },
    ],
  },
  {
    id: "connection",
    prompt: "What kind of internet do you have?",
    sub: "Check your bill or the box on your wall if you're not sure.",
    options: [
      { id: "cable", label: "Cable", hint: "Spectrum, Xfinity, Cox, Optimum…" },
      { id: "fiber", label: "Fiber", hint: "AT&T Fiber, Fios, Frontier, Google Fiber…" },
      { id: "dsl", label: "DSL / phone line" },
      { id: "5g", label: "5G home", hint: "T-Mobile, Verizon 5G Home, AT&T Air" },
      { id: "satellite", label: "Satellite", hint: "Starlink, HughesNet, Viasat" },
      { id: "unknown", label: "Honestly, I don't know" },
    ],
  },
  {
    id: "setup",
    prompt: "Where does your Wi-Fi router live, and roughly how old is it?",
    sub: "This is the single highest-signal question for diagnosing slow Wi-Fi.",
    options: [
      { id: "new-open", label: "Out in the open, under 3 years old" },
      { id: "old-open", label: "Out in the open, 3–6 years old" },
      { id: "very-old-open", label: "Out in the open, 6+ years old (or unknown)" },
      { id: "cabinet", label: "Inside a cabinet, closet, or media console" },
      { id: "far-corner", label: "In the basement, attic, or far corner" },
      { id: "isp-default", label: "Whatever my ISP installed, never touched it" },
    ],
  },
  {
    id: "timing",
    prompt: "When does the slowness hit hardest?",
    options: [
      { id: "random", label: "Random — no pattern I can see" },
      { id: "evenings", label: "Weekday evenings, roughly 7–11pm" },
      { id: "concurrent", label: "When multiple people are using the internet at once" },
      { id: "late-month", label: "Late in the month (mid-cycle onward)" },
      { id: "wifi-roam", label: "Right after walking between rooms" },
    ],
  },
  {
    id: "upload",
    prompt: "Quick check — run speedtest.net. What's your upload number?",
    sub: "Open speedtest.net in a new tab, run it, come back. We'll wait.",
    options: [
      { id: "lt10", label: "Under 10 Mbps" },
      { id: "10-35", label: "10–35 Mbps" },
      { id: "35-100", label: "35–100 Mbps" },
      { id: "gt100", label: "Over 100 Mbps" },
      { id: "skip", label: "I'd rather skip this" },
    ],
    shouldAsk: (a) =>
      (a.symptom === "calls" || a.symptom === "upload") &&
      (a.connection === "cable" ||
        a.connection === "dsl" ||
        a.connection === "5g"),
  },
  {
    id: "bufferbloat",
    prompt: "Run waveform.com/tools/bufferbloat. What grade did you get?",
    sub: "Free, takes 30 seconds, open in a new tab.",
    options: [
      { id: "a", label: "A or A+" },
      { id: "b", label: "B" },
      { id: "cdf", label: "C, D, or F" },
      { id: "skip", label: "Skip this one" },
    ],
    shouldAsk: (a) =>
      (a.symptom === "gaming" || a.symptom === "calls") &&
      (a.timing === "evenings" || a.timing === "concurrent"),
  },
];

// ── Verdicts (full content) ──────────────────────────────────────────────

export type FiberCta =
  | { show: false; reason: string }
  | { show: true; intensity: "primary" | "secondary" | "soft"; angle: string };

export type Verdict = {
  id: VerdictId;
  slug: string;
  headline: string;
  shortHeadline: string;
  diagnosis: string;
  tryFirst: { title: string; body: string };
  tryNext: { title: string; body: string };
  fiberCta: FiberCta;
  confidence: "very-likely" | "likely" | "probably" | "possibly";
  seoTitle: string;
  seoDescription: string;
  seoTargets: string[];
};

export const verdicts: Record<VerdictId, Verdict> = {
  "router-in-cabinet": {
    id: "router-in-cabinet",
    slug: "router-in-cabinet",
    headline:
      "Your router is in a cabinet. That's the problem.",
    shortHeadline: "Your router is in a cabinet.",
    diagnosis:
      "Wood, glass, and especially metal eat Wi-Fi signal for breakfast. Your router is broadcasting through a thicket of obstacles before the signal ever reaches the room you're in. 5 GHz and 6 GHz (the fast bands) suffer worst — they have shorter range and weaker penetration than 2.4 GHz. Faster internet won't fix Wi-Fi that can't escape the cabinet.",
    tryFirst: {
      title: "Move the router out of the cabinet",
      body: "Sit it on top of the cabinet, or on a nearby shelf. Re-test in 10 minutes. This is the highest-impact free fix on this entire site.",
    },
    tryNext: {
      title: "Run a single ethernet cable",
      body: "If the cabinet is the only place the cable line reaches, run a $15 ethernet cable to a more central spot and put the router there. Ethernet will outperform a $500 fiber upgrade every time in this scenario.",
    },
    fiberCta: {
      show: false,
      reason: "Faster internet into the house can't fix Wi-Fi that can't escape the cabinet.",
    },
    confidence: "very-likely",
    seoTitle: "Why is my Wi-Fi slow when the router is in a cabinet?",
    seoDescription:
      "If your router lives in a cabinet, closet, or media console, that's almost certainly why your Wi-Fi is slow. Here's the fix — and why fiber won't help.",
    seoTargets: [
      "wifi router in cabinet slow",
      "why is my router slow",
      "router behind tv slow wifi",
    ],
  },
  bufferbloat: {
    id: "bufferbloat",
    slug: "bufferbloat",
    headline: "It's bufferbloat during peak hours.",
    shortHeadline: "It's bufferbloat.",
    diagnosis:
      "Your speed is probably fine. Your latency under load is the problem. When one device starts a big download, oversized buffers in your modem and your ISP's gear queue up packets — and your video call's tiny time-sensitive packets get stuck behind them. Speedtest says 800 Mbps; your call still glitches. Cable plants are especially prone to this during 7–11pm peak hours.",
    tryFirst: {
      title: "Confirm it with the Waveform bufferbloat test",
      body: "Go to waveform.com/tools/bufferbloat. Run it once at 2pm and once at 9pm. If your grade drops at night, you've found it.",
    },
    tryNext: {
      title: "Enable Smart Queue Management (SQM) on your router",
      body: "Look for 'Adaptive QoS,' 'SQM,' 'cake,' or 'fq_codel' in your router's settings. A $99 mid-range router with SQM beats a $400 router without it for this specific problem.",
    },
    fiberCta: {
      show: true,
      intensity: "secondary",
      angle: "If SQM doesn't help and bufferbloat persists at peak hours, your cable node is oversubscribed — fiber's bufferbloat behavior is dramatically better.",
    },
    confidence: "likely",
    seoTitle: "Internet slow at night? It's probably bufferbloat.",
    seoDescription:
      "If your internet feels fast on speedtest but lags during video calls and games, it's bufferbloat. Here's how to confirm it — and how to fix it.",
    seoTargets: [
      "internet slow at night cable",
      "bufferbloat fix",
      "ping spikes evening",
      "video call lag cable internet",
    ],
  },
  "upload-choked": {
    id: "upload-choked",
    slug: "upload-choked",
    headline: "Your upload is choked. Fiber actually helps here.",
    shortHeadline: "Your upload is choked.",
    diagnosis:
      "Most cable plans ship asymmetric — a '1 gigabit' plan often has 35–50 Mbps upload. That's fine for browsing. It's not fine for Zoom + Dropbox sync + a security camera + a Twitch stream. Video calls drop because outbound packets are queued. DSL and 5G home have the same problem, worse.",
    tryFirst: {
      title: "Pause cloud sync and run a call",
      body: "Disable iCloud, Dropbox, OneDrive, and Google Drive sync during meetings. Turn off phone photo upload. If your calls stabilize, you've confirmed the diagnosis.",
    },
    tryNext: {
      title: "Check your ISP for a higher upload tier",
      body: "Some cable providers now offer mid-split DOCSIS 3.1 with 100–300 Mbps upload, but you'll need a compatible modem.",
    },
    fiberCta: {
      show: true,
      intensity: "primary",
      angle: "Symmetric upload is fiber's killer feature. A 500/500 fiber plan will feel faster than a 1000/35 cable plan for anyone on calls, uploading content, or running a home server.",
    },
    confidence: "very-likely",
    seoTitle: "Why is my upload so slow on cable?",
    seoDescription:
      "Cable plans are asymmetric — gigabit download, ~35 Mbps upload. That's why video calls freeze and big uploads crawl. Here's the fix.",
    seoTargets: [
      "slow upload speed cable",
      "video calls keep freezing",
      "upload speed fix",
      "why is my upload so slow",
    ],
  },
  "data-cap-throttling": {
    id: "data-cap-throttling",
    slug: "data-cap-throttling",
    headline: "You're past your data cap. Your ISP is throttling you.",
    shortHeadline: "You hit your data cap.",
    diagnosis:
      "Many cable and satellite providers cap your monthly data — usually 1.2 TB on cable, much less on satellite — and silently throttle you once you cross it. Speeds can drop from full plan to 1–3 Mbps. This is by far the most under-diagnosed cause of 'it gets slow toward the end of the month.'",
    tryFirst: {
      title: "Check your ISP account dashboard for usage",
      body: "Log in, look for current-cycle data usage. If you're over the cap, that's your answer.",
    },
    tryNext: {
      title: "Switch to an unlimited tier or change ISPs",
      body: "Unlimited add-ons typically cost $30/mo more on cable. If you're consistently over the cap, switching to an uncapped ISP (most fiber providers) is often cheaper long-term.",
    },
    fiberCta: {
      show: true,
      intensity: "secondary",
      angle: "AT&T Fiber, Verizon Fios, Frontier Fiber, Google Fiber, and most other fiber ISPs don't impose data caps. If you've outgrown a capped plan, that's a clean reason to switch.",
    },
    confidence: "likely",
    seoTitle: "Why does my internet slow down at the end of the month?",
    seoDescription:
      "If your speeds tank around the same time every month, you're probably past your data cap. Here's how to check — and what to do about it.",
    seoTargets: [
      "internet slow end of month",
      "isp throttling data cap",
      "comcast data cap throttle",
      "xfinity slow after data cap",
    ],
  },
  "wifi-dead-zones": {
    id: "wifi-dead-zones",
    slug: "wifi-dead-zones",
    headline: "Your Wi-Fi can't reach that room. Get a mesh.",
    shortHeadline: "Wi-Fi dead zone.",
    diagnosis:
      "Single-router setups have dead zones. A back bedroom or garage office two walls away from the router can drop from 700 Mbps to 8 Mbps without anyone noticing — until you try to take a call there.",
    tryFirst: {
      title: "Move the router to a more central location",
      body: "Ideally elevated, out in the open. If your ISP installed it in a far corner near the cable entry, you've found the problem.",
    },
    tryNext: {
      title: "Add a mesh system",
      body: "A two-pack Eero, TP-Link Deco, or Asus ZenWifi runs $150–$250 and ends the dead-zone problem. Wi-Fi 6 is fine for almost everyone — don't overpay for 6E or 7 unless you have devices that use 6 GHz.",
    },
    fiberCta: {
      show: false,
      reason: "A faster connection to the house doesn't reach the bedroom either. Mesh first.",
    },
    confidence: "likely",
    seoTitle: "Wi-Fi doesn't reach the back bedroom?",
    seoDescription:
      "Wi-Fi dead zones are a router-placement problem, not an internet problem. Here's how to fix them without paying for faster internet that won't help.",
    seoTargets: [
      "wifi doesn't reach back bedroom",
      "wifi dead spots",
      "wifi slow far from router",
    ],
  },
  "old-router": {
    id: "old-router",
    slug: "old-router",
    headline: "Your router is older than your phone. Replace it.",
    shortHeadline: "Old router.",
    diagnosis:
      "Wi-Fi standards have moved. A 2017 router (Wi-Fi 5 / 802.11ac, single-band) physically cannot hand out the speeds your modern devices expect, no matter what your internet plan is. ISP-provided routers from 5+ years ago are usually the worst offenders.",
    tryFirst: {
      title: "Reboot the router",
      body: "Seriously — uptime over 90 days is correlated with degraded performance on consumer firmware. Unplug for 30 seconds, plug back in.",
    },
    tryNext: {
      title: "Replace it with a Wi-Fi 6 router",
      body: "A $120 Wi-Fi 6 router (TP-Link Archer AX55 tier) will outperform almost any 2018-era ISP rental. You'll also stop paying the $14/mo equipment fee.",
    },
    fiberCta: {
      show: false,
      reason: "Solve the router first — you may find your existing plan is already fast enough.",
    },
    confidence: "probably",
    seoTitle: "Is my router too old?",
    seoDescription:
      "If your router is over 5 years old, it's probably the bottleneck — not your internet plan. Here's how to tell, and what to replace it with.",
    seoTargets: [
      "router too old replace",
      "isp router slow",
      "old wifi router",
      "wifi 6 router upgrade",
    ],
  },
  "cable-modem-plant": {
    id: "cable-modem-plant",
    slug: "cable-modem-plant",
    headline: "Your cable modem or coax line is the bottleneck.",
    shortHeadline: "Cable plant degraded.",
    diagnosis:
      "On cable, a worn coax run, a corroded splitter, or a DOCSIS 3.0 modem on a DOCSIS 3.1 plan will cap your speeds well below what you're paying for. This is the most under-blamed cause of 'I pay for 600 and get 200.'",
    tryFirst: {
      title: "Check your modem's signal page",
      body: "Open 192.168.100.1 in a browser. Look for downstream/upstream power and SNR. Downstream should be −7 to +7 dBmV. Upstream 35–51 dBmV. Out of range → call the ISP.",
    },
    tryNext: {
      title: "Get a DOCSIS 3.1 modem",
      body: "If you're renting an ISP modem, ask whether it's DOCSIS 3.1. If not, demand an upgrade (free with most providers) or buy your own.",
    },
    fiberCta: {
      show: true,
      intensity: "secondary",
      angle: "If you've been chasing cable plant issues for months and fiber is available at your address, switching is often easier than continuing to debug.",
    },
    confidence: "possibly",
    seoTitle: "Why is my cable internet slower than my plan?",
    seoDescription:
      "If you pay for 600 Mbps and get 200, the cable plant or your modem is probably degraded. Here's how to confirm — and how to fix it.",
    seoTargets: [
      "cable modem slow",
      "docsis 3.1 vs 3.0",
      "cable internet not getting full speed",
      "modem signal levels",
    ],
  },
  "plan-too-small": {
    id: "plan-too-small",
    slug: "plan-too-small",
    headline: "You're getting what you pay for. The plan is too small.",
    shortHeadline: "Plan too small.",
    diagnosis:
      "If five people are on a 100 Mbps plan with three TVs streaming 4K and someone on a video call, the math doesn't work. 4K Netflix uses ~25 Mbps. Zoom HD uses ~3 Mbps up. A Steam download takes whatever's left. This is a plan-tier problem, not a technology problem.",
    tryFirst: {
      title: "Run speedtest.net during a fight",
      body: "If you're hitting your full plan speed and it still feels slow, you've outgrown your tier.",
    },
    tryNext: {
      title: "Upgrade to the next tier with your current provider",
      body: "Most cable and fiber providers have ~$20 jumps between 300 / 500 / 1000 Mbps tiers.",
    },
    fiberCta: {
      show: true,
      intensity: "primary",
      angle: "Fiber's price-per-megabit is usually better at higher tiers, and the symmetric upload helps when multiple people are uploading at once.",
    },
    confidence: "probably",
    seoTitle: "What speed of internet do I actually need?",
    seoDescription:
      "If your plan is too small for your household, no amount of router tweaking will fix it. Here's how to tell — and the cheapest path to a tier that works.",
    seoTargets: [
      "what speed internet do i need",
      "internet plan too slow",
      "internet plan for family of 5",
    ],
  },
  "gaming-latency": {
    id: "gaming-latency",
    slug: "gaming-latency",
    headline: "Your gaming lag isn't a speed problem. It's routing.",
    shortHeadline: "Gaming routing issue.",
    diagnosis:
      "Gaming feels worst at high latency to the game's server, not at low bandwidth. A 50 Mbps connection with 20 ms ping plays better than a 1 Gbps connection with 90 ms ping. Sometimes the issue is the game's regional routing; sometimes it's your ISP's peering choices.",
    tryFirst: {
      title: "Run a traceroute to the game server",
      body: "Use PingPlotter or 'traceroute' from your terminal. Find the first hop with latency >30 ms — if it's inside your ISP's network, that's their problem to fix.",
    },
    tryNext: {
      title: "Switch to wired ethernet",
      body: "Console + ethernet is the single best gaming upgrade most people never make. A $15 cable solves more lag than any router.",
    },
    fiberCta: {
      show: true,
      intensity: "soft",
      angle: "Fiber tends to have better baseline latency (5–15 ms vs 15–30 ms on cable) and more direct peering to major game networks. Worth checking — not a guaranteed fix.",
    },
    confidence: "possibly",
    seoTitle: "Internet fast but gaming laggy?",
    seoDescription:
      "Speedtest looks great, but you're rubber-banding in every match. The cause is latency and routing, not bandwidth. Here's how to fix it.",
    seoTargets: [
      "gaming high ping cable",
      "internet fast but gaming laggy",
      "online gaming lag fix",
      "high ping wired connection",
    ],
  },
  "wifi-congestion": {
    id: "wifi-congestion",
    slug: "wifi-congestion",
    headline: "Your Wi-Fi is fighting your neighbors.",
    shortHeadline: "Wi-Fi channel congestion.",
    diagnosis:
      "In apartment buildings and dense neighborhoods, the 2.4 GHz band is a war zone. Every router, microwave, baby monitor, and Bluetooth speaker fights for the same three non-overlapping channels. 5 GHz and 6 GHz are usually clearer.",
    tryFirst: {
      title: "Install a Wi-Fi analyzer",
      body: "On Android, install WiFiman or Network Analyzer. Look at 2.4 GHz channel utilization. If it's solid red, you've found the problem. (iOS doesn't allow this kind of analysis — use a friend's Android.)",
    },
    tryNext: {
      title: "Force devices onto the 5 GHz SSID",
      body: "Many ISP routers default to 'smart' band-steering, which often picks wrong. Disable it and split the 2.4 and 5 GHz SSIDs manually if you have to.",
    },
    fiberCta: {
      show: false,
      reason: "Same Wi-Fi problem on any backbone — faster internet doesn't change neighborhood radio congestion.",
    },
    confidence: "possibly",
    seoTitle: "Why is my Wi-Fi slow in an apartment?",
    seoDescription:
      "Apartment Wi-Fi is a war zone — every neighbor's router fights yours. Here's how to fix it without upgrading your internet.",
    seoTargets: [
      "wifi slow apartment",
      "wifi channel congestion",
      "neighbors wifi interference",
    ],
  },
  expectations: {
    id: "expectations",
    slug: "expectations",
    headline: "Honestly? Your plan is fine. The modern web is heavy.",
    shortHeadline: "The modern web is heavy.",
    diagnosis:
      "Modern websites are heavy. A 'Wirecutter article' page is now ~4 MB of JavaScript and images. A 25 Mbps connection that felt fast in 2019 feels sluggish loading 2026's web, even when it's working perfectly.",
    tryFirst: {
      title: "Install uBlock Origin",
      body: "It's free. Page loads on news and shopping sites often improve 3–5×. This is the cheapest internet upgrade most people never make.",
    },
    tryNext: {
      title: "Upgrade your plan tier",
      body: "Moving from 100 to 300 Mbps will feel dramatically faster on heavy pages — even when you're not 'using' more bandwidth in the technical sense.",
    },
    fiberCta: {
      show: true,
      intensity: "soft",
      angle: "If fiber is available at your address, it's usually better value-per-megabit than cable at the same tier. Worth checking.",
    },
    confidence: "probably",
    seoTitle: "Is my internet actually slow?",
    seoDescription:
      "Sometimes the internet isn't slow — the websites are heavy. Here's how to tell which one you have.",
    seoTargets: [
      "is my internet actually slow",
      "modern websites slow",
      "internet feels slower than it used to",
    ],
  },
};

// ── Rules engine ─────────────────────────────────────────────────────────

export type Rule = {
  verdict: VerdictId;
  priority: number;
  match: (a: Answers) => boolean;
};

export const rules: Rule[] = [
  {
    verdict: "upload-choked",
    priority: 100,
    match: (a) =>
      (a.symptom === "calls" || a.symptom === "upload") &&
      a.connection !== "fiber" &&
      (a.upload === "lt10" || a.upload === "10-35" || a.upload === undefined),
  },
  {
    verdict: "router-in-cabinet",
    priority: 95,
    match: (a) => a.setup === "cabinet",
  },
  {
    verdict: "data-cap-throttling",
    priority: 90,
    match: (a) => a.timing === "late-month",
  },
  {
    verdict: "bufferbloat",
    priority: 85,
    match: (a) =>
      a.connection === "cable" &&
      (a.timing === "evenings" || a.timing === "concurrent") &&
      (a.bufferbloat === "cdf" ||
        (a.bufferbloat === undefined &&
          (a.symptom === "calls" || a.symptom === "gaming"))),
  },
  {
    verdict: "wifi-dead-zones",
    priority: 70,
    match: (a) => a.scope === "rooms" && a.setup !== "cabinet",
  },
  {
    verdict: "wifi-congestion",
    priority: 65,
    match: (a) =>
      a.scope === "rooms" &&
      a.timing === "evenings" &&
      a.setup !== "cabinet",
  },
  {
    verdict: "old-router",
    priority: 60,
    match: (a) =>
      (a.setup === "old-open" || a.setup === "very-old-open" || a.setup === "isp-default") &&
      (a.symptom === "pages" || a.symptom === "everything"),
  },
  {
    verdict: "plan-too-small",
    priority: 50,
    match: (a) =>
      (a.scope === "everywhere" || a.scope === "concurrent") &&
      a.setup === "new-open" &&
      (a.symptom === "pages" || a.symptom === "everything"),
  },
  {
    verdict: "cable-modem-plant",
    priority: 45,
    match: (a) =>
      a.connection === "cable" &&
      a.scope === "everywhere" &&
      a.setup === "new-open" &&
      a.timing !== "evenings" &&
      a.timing !== "late-month",
  },
  {
    verdict: "gaming-latency",
    priority: 40,
    match: (a) =>
      a.symptom === "gaming" &&
      (a.bufferbloat === "a" || a.bufferbloat === "b"),
  },
  {
    verdict: "expectations",
    priority: 1,
    match: () => true,
  },
];

export function resolveVerdict(answers: Answers): VerdictId {
  const matched = rules
    .filter((r) => r.match(answers))
    .sort((a, b) => b.priority - a.priority);
  return matched[0].verdict;
}

export function activeQuestions(answers: Answers): Question[] {
  return questions.filter((q) => !q.shouldAsk || q.shouldAsk(answers));
}

export function isComplete(answers: Answers): boolean {
  const active = activeQuestions(answers);
  return active.every((q) => answers[q.id]);
}
