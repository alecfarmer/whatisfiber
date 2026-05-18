/**
 * Decision quiz — pure logic, shared by simple + precise quiz UIs.
 *
 * Honesty rules (per OpenVault Q4 2025 broadband data):
 *  - Average US household uses ~711 GB/month → ~50 Mbps peak. Most
 *    households don't need >1 Gbps.
 *  - Multi-gig requires EXPLICIT power-user signals (livestreaming,
 *    multiple cloud cameras, self-hosting, large weekly uploads).
 *  - Recommendations are RANGES, not single Mbps numbers — that's honest
 *    about the precision the quiz can actually deliver.
 *  - Cheaper alternatives are always shown alongside the recommendation.
 */

// ── Shared types ──────────────────────────────────────────────────────────

export type QuizMode = "quick" | "precise";

export type SpeedRange = {
  low: number;
  high: number;
  label: string; // e.g. "500 Mbps – 1 Gbps"
  name: string; // e.g. "Plenty"
  blurb: string;
  cableEquivalent: string;
};

export type Verdict = "worth-it" | "maybe" | "overkill";

export type Recommendation = {
  range: SpeedRange;
  verdict: Verdict;
  verdictLabel: string;
  verdictBlurb: string;
  reasons: string[];
  warnings: string[];
  cheaperAlternative?: { label: string; rationale: string };
  score: number;
  mode: QuizMode;
  confidence: "low" | "medium" | "high";
};

// ── Tiers (ranges, not single numbers) ────────────────────────────────────

const TIER_BASIC: SpeedRange = {
  low: 100,
  high: 300,
  label: "100 – 300 Mbps",
  name: "Basic",
  blurb:
    "Cable, DSL, or fixed wireless at the bottom tier all handle this comfortably.",
  cableEquivalent: "Any 100–300 Mbps cable plan",
};
const TIER_COMFORT: SpeedRange = {
  low: 300,
  high: 500,
  label: "300 – 500 Mbps",
  name: "Comfort",
  blurb:
    "The sweet spot for most US households. Handles 4K, video calls, and a busy evening.",
  cableEquivalent: "Comcast/Spectrum 300–500 Mbps cable",
};
const TIER_PLENTY: SpeedRange = {
  low: 500,
  high: 1000,
  label: "500 Mbps – 1 Gbps",
  name: "Plenty",
  blurb:
    "Headroom for heavy multi-user evenings. Either end of this range feels identical for what you described.",
  cableEquivalent: "Comcast/Spectrum gigabit cable",
};
const TIER_STRONG: SpeedRange = {
  low: 1000,
  high: 1000,
  label: "1 Gbps",
  name: "Strong",
  blurb:
    "Symmetric gigabit fiber is where you stop noticing the network exists.",
  cableEquivalent:
    "Cable gigabit (download only — upload will be the bottleneck)",
};
const TIER_POWER: SpeedRange = {
  low: 1000,
  high: 2000,
  label: "1 – 2 Gbps",
  name: "Power",
  blurb:
    "Multi-gig is justified by your specific power-user signals — not by general 'heavy use.'",
  cableEquivalent:
    "Cable can't match this on upload. Fiber multi-gig is the only honest fit.",
};

// ── Simple quiz ───────────────────────────────────────────────────────────

export type QuickAnswers = {
  household: "1" | "2" | "3-4" | "5+";
  wfh: "no" | "sometimes" | "yes" | "multi";
  streams: "0-1" | "2" | "3" | "4+";
  extras: QuickExtra[];
  frustration: "never" | "little" | "often" | "constant";
};
export type QuickExtra = "gaming" | "calls" | "cloud" | "bigfiles";

const QUICK_W = {
  household: { "1": 1, "2": 3, "3-4": 6, "5+": 9 },
  wfh: { no: 0, sometimes: 3, yes: 6, multi: 9 },
  streams: { "0-1": 1, "2": 3, "3": 6, "4+": 10 },
  extras: { gaming: 2, calls: 3, cloud: 1, bigfiles: 3 } as Record<
    QuickExtra,
    number
  >,
  frustration: { never: 0, little: 2, often: 5, constant: 6 },
};

export function calculateQuick(a: QuickAnswers): Recommendation {
  let score = 0;
  score += QUICK_W.household[a.household];
  score += QUICK_W.wfh[a.wfh];
  score += QUICK_W.streams[a.streams];
  score += QUICK_W.frustration[a.frustration];
  for (const e of a.extras) score += QUICK_W.extras[e];

  // Simple quiz intentionally cannot reach multi-gig — not enough granularity.
  let range: SpeedRange;
  if (score <= 9) range = TIER_BASIC;
  else if (score <= 19) range = TIER_COMFORT;
  else if (score <= 32) range = TIER_PLENTY;
  else range = TIER_STRONG;

  const verdict: Verdict =
    score >= 20 || a.wfh === "yes" || a.wfh === "multi"
      ? "worth-it"
      : score <= 6 && a.extras.length === 0
      ? "overkill"
      : "maybe";

  return buildRecommendation({
    mode: "quick",
    score,
    range,
    verdict,
    confidence: "low",
    signalReasons: buildQuickReasons(a),
    isMultiGig: false,
  });
}

// ── Precise quiz ──────────────────────────────────────────────────────────

export type PreciseAnswers = QuickAnswers & {
  fourKtvs: "0-1" | "2" | "3" | "4+";
  livestream: "no" | "sometimes" | "regular" | "heavy";
  cameras: "none" | "1-2" | "3-5" | "6+";
  selfhost: "no" | "local" | "one" | "multi";
  uploadPattern: "browse" | "photos" | "small" | "medium" | "large";
};

const PRECISE_W = {
  fourKtvs: { "0-1": 0, "2": 2, "3": 4, "4+": 8 },
  livestream: { no: 0, sometimes: 3, regular: 8, heavy: 15 },
  cameras: { none: 0, "1-2": 2, "3-5": 5, "6+": 10 },
  selfhost: { no: 0, local: 1, one: 5, multi: 12 },
  uploadPattern: { browse: 0, photos: 1, small: 3, medium: 6, large: 10 },
};

function hasPowerSignal(a: PreciseAnswers): boolean {
  return (
    a.livestream === "regular" ||
    a.livestream === "heavy" ||
    a.cameras === "3-5" ||
    a.cameras === "6+" ||
    a.selfhost === "one" ||
    a.selfhost === "multi" ||
    a.uploadPattern === "medium" ||
    a.uploadPattern === "large"
  );
}

export function calculatePrecise(a: PreciseAnswers): Recommendation {
  let score = 0;
  score += QUICK_W.household[a.household];
  score += QUICK_W.wfh[a.wfh];
  score += QUICK_W.streams[a.streams];
  score += QUICK_W.frustration[a.frustration];
  for (const e of a.extras) score += QUICK_W.extras[e];
  score += PRECISE_W.fourKtvs[a.fourKtvs];
  score += PRECISE_W.livestream[a.livestream];
  score += PRECISE_W.cameras[a.cameras];
  score += PRECISE_W.selfhost[a.selfhost];
  score += PRECISE_W.uploadPattern[a.uploadPattern];

  let range: SpeedRange;
  if (score <= 12) range = TIER_BASIC;
  else if (score <= 25) range = TIER_COMFORT;
  else if (score <= 42) range = TIER_PLENTY;
  else if (score <= 60) range = TIER_STRONG;
  else range = hasPowerSignal(a) ? TIER_POWER : TIER_STRONG;

  const verdict: Verdict =
    score >= 26 ||
    hasPowerSignal(a) ||
    a.wfh === "yes" ||
    a.wfh === "multi"
      ? "worth-it"
      : score <= 8 && a.extras.length === 0
      ? "overkill"
      : "maybe";

  return buildRecommendation({
    mode: "precise",
    score,
    range,
    verdict,
    confidence: score >= 60 ? "high" : "medium",
    signalReasons: buildPreciseReasons(a),
    isMultiGig: range.name === "Power",
  });
}

// ── Shared assembly ───────────────────────────────────────────────────────

type BuildArgs = {
  mode: QuizMode;
  score: number;
  range: SpeedRange;
  verdict: Verdict;
  confidence: "low" | "medium" | "high";
  signalReasons: string[];
  isMultiGig: boolean;
};

function buildRecommendation(b: BuildArgs): Recommendation {
  const verdictLabel = {
    "worth-it": "Fiber is worth it here",
    maybe: "Either fiber or cable works",
    overkill: "Save the money",
  }[b.verdict];

  const verdictBlurb = {
    "worth-it": `Fiber clearly helps your household — mostly because of upload symmetry and stable latency under load, not the headline download number. Aim for the ${b.range.label} range.`,
    maybe: `Fiber would feel smoother, but a ${b.range.cableEquivalent} plan handles what you described. Take fiber if it's within ~$15/mo of cable; otherwise the cable plan is honest value.`,
    overkill: `You don't use enough internet for fiber's advantages to show up. The cheapest reliable wired plan in your area (100–300 Mbps cable, DSL, or fixed wireless) will feel identical to gigabit for what you do.`,
  }[b.verdict];

  const warnings: string[] = [];
  if (b.isMultiGig) {
    warnings.push(
      "Multi-gig is rarely necessary. The average US household uses about 711 GB/month, which works out to under 50 Mbps peak (OpenVault Q4 2025). You're recommended multi-gig because of specific power-user signals — not because you'll saturate the connection.",
    );
  }
  if (b.range.name === "Plenty") {
    warnings.push(
      "Either end of this range feels identical for what you described. Pick the cheaper one — you can always upgrade later.",
    );
  }

  const cheaperAlternative =
    b.range.name === "Power"
      ? {
          label: "1 Gbps fiber",
          rationale:
            "Skip multi-gig unless you're actively livestreaming or running a home server.",
        }
      : b.range.name === "Plenty"
      ? {
          label: "500 Mbps",
          rationale:
            "The lower end of the range handles everything you described.",
        }
      : undefined;

  return {
    range: b.range,
    verdict: b.verdict,
    verdictLabel,
    verdictBlurb,
    reasons: b.signalReasons,
    warnings,
    cheaperAlternative,
    score: b.score,
    mode: b.mode,
    confidence: b.confidence,
  };
}

function buildQuickReasons(a: QuickAnswers): string[] {
  const r: string[] = [];
  if (a.wfh === "yes" || a.wfh === "multi") {
    r.push(
      "Daily WFH means upload symmetry matters — fiber's biggest advantage over cable.",
    );
  }
  if (a.streams === "3" || a.streams === "4+") {
    r.push(
      "Multiple simultaneous streams are easier on fiber's contention-free architecture than on cable nodes at peak hours.",
    );
  }
  if (a.extras.includes("bigfiles")) {
    r.push(
      "Large file uploads benefit from symmetric upload — cable upload typically caps around 35 Mbps.",
    );
  }
  if (a.frustration === "often" || a.frustration === "constant") {
    r.push(
      "If you're frustrated with current service, the issue is usually upload or latency — both of which fiber fixes.",
    );
  }
  if (r.length === 0) {
    r.push(
      "Your usage sits comfortably on either fiber or cable. Compare price and availability where you live.",
    );
  }
  return r;
}

function buildPreciseReasons(a: PreciseAnswers): string[] {
  const r = buildQuickReasons(a);
  if (a.livestream === "regular" || a.livestream === "heavy") {
    r.push(
      "Regular 1080p60 livestreaming needs sustained 10+ Mbps upload — fiber's the only honest fit.",
    );
  }
  if (a.cameras === "3-5" || a.cameras === "6+") {
    r.push(
      "Multiple 4K cameras to the cloud add 6–40 Mbps of always-on upload. Cable upload chokes here.",
    );
  }
  if (a.selfhost === "one" || a.selfhost === "multi") {
    r.push(
      "Self-hosting (Plex remote, home server, NAS-to-cloud) is one of the few true multi-gig use cases.",
    );
  }
  if (a.uploadPattern === "medium" || a.uploadPattern === "large") {
    r.push(
      "Sustained 10–50+ GB/week of uploads will saturate any cable upload pipe. Fiber's symmetric upload was built for this.",
    );
  }
  return r;
}

// ── Display data for each step ────────────────────────────────────────────

export type Option<V extends string> = {
  value: V;
  big?: string;
  label: string;
  hint?: string;
};

export const quickHouseholdOptions: Option<QuickAnswers["household"]>[] = [
  { value: "1", big: "1", label: "Just me", hint: "Solo apartment" },
  { value: "2", big: "2", label: "Two people", hint: "Couple or roommate" },
  { value: "3-4", big: "3–4", label: "Small household" },
  { value: "5+", big: "5+", label: "Full house" },
];
export const quickWfhOptions: Option<QuickAnswers["wfh"]>[] = [
  { value: "no", label: "No", hint: "Office or school every day" },
  { value: "sometimes", label: "Sometimes", hint: "Hybrid, a few days a week" },
  { value: "yes", label: "Yes, regularly", hint: "Most days, daily video calls" },
  { value: "multi", label: "Two of us do", hint: "Multiple WFH adults" },
];
export const quickStreamsOptions: Option<QuickAnswers["streams"]>[] = [
  { value: "0-1", big: "0–1", label: "One thing at a time" },
  { value: "2", big: "2", label: "Two screens" },
  { value: "3", big: "3", label: "Three at once" },
  { value: "4+", big: "4+", label: "Four or more" },
];
export const quickExtrasOptions: Option<QuickExtra>[] = [
  { value: "gaming", label: "Online gaming", hint: "Console or PC, competitive or cloud" },
  { value: "calls", label: "Video calls > 1 hr/day", hint: "Daily Zoom / Meet / Teams" },
  { value: "cloud", label: "Cloud photo/file sync", hint: "iCloud, Google Photos, Dropbox" },
  { value: "bigfiles", label: "Big work-file uploads (>1 GB)", hint: "CAD, video, large datasets" },
];
export const quickFrustrationOptions: Option<QuickAnswers["frustration"]>[] = [
  { value: "never", label: "Never — it's fine", hint: "No complaints" },
  { value: "little", label: "A little, occasionally", hint: "Sometimes spotty" },
  { value: "often", label: "Often", hint: "Calls drop, uploads stall" },
  { value: "constant", label: "Constantly", hint: "It's the worst" },
];

export const fourKtvsOptions: Option<PreciseAnswers["fourKtvs"]>[] = [
  { value: "0-1", big: "0–1", label: "One TV or none" },
  { value: "2", big: "2", label: "Two 4K TVs" },
  { value: "3", big: "3", label: "Three" },
  { value: "4+", big: "4+", label: "Four or more" },
];
export const livestreamOptions: Option<PreciseAnswers["livestream"]>[] = [
  { value: "no", label: "No, not really" },
  { value: "sometimes", label: "Sometimes, 720p casual" },
  { value: "regular", label: "Regularly, 1080p60" },
  { value: "heavy", label: "Two streamers or multi-bitrate" },
];
export const camerasOptions: Option<PreciseAnswers["cameras"]>[] = [
  { value: "none", label: "None" },
  { value: "1-2", label: "1–2 cameras" },
  { value: "3-5", label: "3–5 cameras" },
  { value: "6+", label: "6+ or NVR-to-cloud" },
];
export const selfhostOptions: Option<PreciseAnswers["selfhost"]>[] = [
  { value: "no", label: "No, just consume" },
  { value: "local", label: "Plex/Jellyfin local only" },
  { value: "one", label: "One service exposed to internet" },
  { value: "multi", label: "Multiple services or NAS-to-cloud daily" },
];
export const uploadPatternOptions: Option<PreciseAnswers["uploadPattern"]>[] = [
  { value: "browse", label: "Whatever browsers do" },
  { value: "photos", label: "Photos sync overnight" },
  { value: "small", label: "1–10 GB/week of files" },
  { value: "medium", label: "10–50 GB/week" },
  { value: "large", label: "50+ GB/week or live streams" },
];
