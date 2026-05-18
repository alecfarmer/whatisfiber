import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { ModeText } from "@/components/ui/mode-text";
import { Pullquote } from "@/components/ui/pullquote";
import { ComparisonTable } from "@/components/ui/comparison-table";
import { FaqList } from "@/components/ui/faq-list";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JumpNav } from "@/components/site/jump-nav";
import {
  pageMetadata,
  JsonLd,
  buildArticleSchema,
  buildFaqSchema,
  buildBreadcrumbSchema,
} from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Fiber vs Cable: Speed, Cost & Reliability Compared (2026)",
  description:
    "Fiber beats cable on upload speed (often 10–100× faster), latency under load, and reliability in weather. Cable wins on price and availability. Here's the honest 2026 comparison with real numbers.",
  path: "/fiber-vs-cable",
});

const faqs = [
  {
    q: "Is fiber faster than cable?",
    a: "Yes, especially on upload. A typical 2026 cable plan delivers 1 Gbps down and ~35 Mbps up; a typical fiber plan delivers 1 Gbps symmetric — meaning ~30× more upload. On downstream, the headline numbers are similar for gigabit tiers, but cable speeds degrade more under peak-hour load because cable is a shared medium and fiber is mostly not.",
  },
  {
    q: "Why is fiber upload faster than cable?",
    a: "Cable's DOCSIS spectrum was designed when uploads barely mattered. DOCSIS 3.1 dedicates a small slice of the cable's radio spectrum to upstream traffic and the rest to downstream. Fiber has no such tradeoff — each direction uses its own dedicated wavelength of light on the same strand, so 10 Gbps down and 10 Gbps up coexist without competing for spectrum.",
  },
  {
    q: "Is fiber better for gaming than cable?",
    a: "Yes, primarily because of latency under load. Fiber typically holds steady at 5–15 ms even when the connection is saturated; cable can spike to 50–300 ms during heavy use because of buffer-bloat in cable modems. Cloud gaming (GeForce Now, Xbox Cloud) and competitive multiplayer both feel measurably better on fiber.",
  },
  {
    q: "Why does my cable internet slow down at 7 PM?",
    a: "Older cable nodes serve 200–500 homes off a single shared upstream channel. When the neighborhood streams 4K, joins video calls, and downloads game patches simultaneously, modems contend for the same spectrum. Cable companies are progressively splitting nodes (target ~50–75 homes per node for DOCSIS 4.0) but the work takes years per neighborhood.",
  },
  {
    q: "Is fiber more reliable than cable?",
    a: "Significantly. Fiber's outside plant is entirely passive — no amplifiers, no powered components between the central office and your home. Cable's coax plant has active amplifiers every 1,000–2,000 feet, each of which can fail. Fiber is also dielectric (doesn't conduct electricity) so it's immune to lightning surges that damage cable amps and modems.",
  },
  {
    q: "Does cable internet have data caps?",
    a: "Most large cable ISPs apply data caps. Comcast Xfinity caps at 1.2 TB/month with $10 per 50 GB overage (cap removed on top-tier plans or with an Unlimited add-on). Cox caps at 1.25 TB. Charter Spectrum currently has no cap. Fiber providers (AT&T Fiber, Verizon Fios, Frontier Fiber, Google Fiber) generally don't impose caps.",
  },
  {
    q: "How much does fiber cost vs cable in 2026?",
    a: "Gigabit fiber typically runs $65–$95/month, no equipment fee, no cap. Gigabit cable runs $80–$110/month with a $14–$15 equipment rental, often with a data cap. Multi-gig (2 / 5 Gbps) is more aggressive on fiber: $90–$120 for 2 Gbps, $150 for Google Fiber 8 Gbps. After the cable promo expires (usually 12 months), the two are roughly comparable on price for gig service.",
  },
  {
    q: "What is DOCSIS 4.0 and is it as fast as fiber?",
    a: "DOCSIS 4.0 is the latest standard for cable internet. It targets 10 Gbps downstream and 6 Gbps upstream — much closer to fiber than previous DOCSIS versions. Comcast launched DOCSIS 4.0 service in 2024 and is rolling it out across markets. It narrows the gap meaningfully on downstream speed and upload symmetry, but cable's shared-node architecture and bufferbloat tendencies remain.",
  },
  {
    q: "Should I switch from cable to fiber if both are available?",
    a: "Almost always yes, unless you're paying considerably more for fiber than cable in your specific market. The latency, upload symmetry, and reliability differences are real and noticeable. The exception: short-term cable promos that expire (compare year-2 prices, not intro prices) and households that genuinely don't use upload bandwidth.",
  },
];

const headlineRows = [
  { metric: "Max download speed", a: "10 Gbps (XGS-PON)", b: "10 Gbps (DOCSIS 4.0)", winner: "tie" as const },
  { metric: "Max upload speed", a: "10 Gbps symmetric", b: "6 Gbps (4.0) / 35–200 Mbps (3.1)", winner: "a" as const },
  { metric: "Typical residential UL", a: "500 Mbps – 2 Gbps", b: "10–35 Mbps (3.1) / 100 Mbps – 1 Gbps (4.0)", winner: "a" as const },
  { metric: "Idle latency", a: "5–10 ms", b: "15–30 ms", winner: "a" as const },
  { metric: "Loaded latency", a: "5–15 ms", b: "50–300 ms (bufferbloat)", winner: "a" as const },
  { metric: "Medium", a: "Single-mode glass, 9 µm core", b: "RG-6 coax (75 Ω)", winner: "a" as const },
  { metric: "Powered components in OSP", a: "None", b: "Amplifiers every 1–2k ft", winner: "a" as const },
  { metric: "Sharing model", a: "1:32 passive split", b: "RF node: 50–500 homes", winner: "a" as const },
  { metric: "Weather sensitivity", a: "None (dielectric)", b: "EMI, lightning, water ingress", winner: "a" as const },
  { metric: "Equipment fee", a: "$0 (ONT included)", b: "$14–$15/mo modem rental", winner: "a" as const },
  { metric: "Typical data cap", a: "None", b: "1.2–1.25 TB (Comcast/Cox)", winner: "a" as const },
  { metric: "Typical 1 Gig price", a: "$65–$95/mo", b: "$80–$110/mo", winner: "a" as const },
  { metric: "Availability (US)", a: "~50% of households", b: "~88% of households", winner: "b" as const },
  { metric: "Install time", a: "1–3 weeks (greenfield)", b: "Same-day in most markets", winner: "b" as const },
];

export default function FiberVsCable() {
  const path = "/fiber-vs-cable";
  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          title: "Fiber vs Cable Internet",
          description: metadata.description as string,
          path,
        })}
      />
      <JsonLd data={buildFaqSchema(faqs.map((f) => ({ q: f.q, a: f.a })))} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Fiber vs cable", path },
        ])}
      />

      <Section tone="default" className="pt-[calc(var(--nav-h)+72px)]">
        <Container>
          <Breadcrumb
            trail={[
              { name: "Home", path: "/" },
              { name: "Fiber vs cable", path },
            ]}
          />
          <SectionLabel tone="edge">Compare · Pillar</SectionLabel>
          <h1 className="display mt-4 max-w-[20ch] text-balance text-[clamp(40px,7vw,80px)] font-medium leading-[1.02] text-[var(--fg)]">
            Fiber vs cable:{" "}
            <em className="font-light italic text-[var(--accent)]">
              the honest
            </em>{" "}
            comparison.
          </h1>
          <p className="mt-7 max-w-[64ch] text-[19px] leading-[1.65] text-[var(--fg-muted)]">
            Fiber beats cable on upload speed (often by 10–100×), latency
            under load, and reliability in weather. Cable beats fiber on
            availability (~88% of US households vs ~50%) and install speed.
            Below: the side-by-side, why each gap exists, and where it&apos;s
            heading by 2030.
          </p>
        </Container>
      </Section>

      {/* ── HEADLINE TABLE ── */}
      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container>
          <Reveal>
            <SectionLabel tone="accent">Headline</SectionLabel>
            <h2 className="display mt-4 max-w-[20ch] text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              Side by side, real numbers.
            </h2>
            <p className="mt-3 max-w-[60ch] text-[14px] text-[var(--fg-muted)]">
              Cable wins where marked. Everything else, fiber wins.
            </p>
          </Reveal>
          <Reveal delay={0.05} className="mt-10">
            <ComparisonTable
              aLabel="Fiber (XGS-PON)"
              bLabel="Cable (DOCSIS 3.1 / 4.0)"
              rows={headlineRows}
            />
          </Reveal>
          <p className="mono mt-4 text-[11px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
            Sources: ITU-T G.9807.1 · CableLabs DOCSIS 4.0 · Ookla Q1 2026 ·
            OpenVault Q4 2025 · USTelecom BPI 2025
          </p>
        </Container>
      </Section>

      {/* ── WHY UPLOAD ── */}
      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="accent">01 · Upload speed</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              The single biggest difference is upload.
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
              <ModeText
                reader={
                  <>
                    <p>
                      Fiber sends and receives at the same speed. A 1 Gbps
                      fiber plan delivers 1 Gbps in <em>both</em> directions.
                      That&apos;s called &ldquo;symmetric.&rdquo; A 1 Gbps
                      cable plan typically delivers 1 Gbps down and around
                      35 Mbps up. The difference is huge.
                    </p>
                    <p>
                      Where you feel it: Zoom calls during a family movie
                      night, cloud backups of phone photos, uploading
                      videos to YouTube or TikTok, working from home with
                      screen sharing, security cameras pushing footage to
                      the cloud, anything where data leaves your house at
                      volume.
                    </p>
                    <p>
                      Cable&apos;s newer DOCSIS 4.0 standard finally fixes
                      this on paper — up to 6 Gbps upstream — but
                      deployment is gradual and not yet in most markets.
                    </p>
                  </>
                }
                engineer={
                  <>
                    <p>
                      DOCSIS 3.1 allocates ~5–204 MHz upstream (mid-split
                      or high-split) of the RF spectrum, with the rest of
                      the plant up to 1218 MHz going downstream. OFDMA
                      modulation gets ~940 Mbps peak across a 96 MHz
                      upstream channel, but real provisioned upstream is
                      typically 35–200 Mbps. Compare to GPON&apos;s 1.244
                      Gbps shared / XGS-PON&apos;s 10 Gbps symmetric per
                      tree.
                    </p>
                    <p>
                      OpenVault Q4 2025: fiber subscribers at 677 Mbps
                      symmetric consumed <em>66% more upstream bandwidth</em>{" "}
                      than DOCSIS subscribers on the same operator&apos;s
                      network at 17.3 Mbps upstream — proof that asymmetry
                      shapes user behavior, not the reverse.
                    </p>
                  </>
                }
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── LATENCY ── */}
      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="live">02 · Latency under load</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              The bufferbloat problem.
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
              <ModeText
                reader={
                  <>
                    <p>
                      Speedtests measure two things: how fast bits flow
                      when the line is idle, and how fast they flow when
                      the line is busy. Cable does the first job pretty
                      well. The second job is where it falls apart.
                    </p>
                    <p>
                      When a cable connection saturates — say, your phone
                      is backing up to iCloud while your spouse is on
                      Zoom — the cable modem queues data in a big internal
                      buffer. That buffer adds latency. <em>A lot</em> of
                      latency. Your Zoom ping jumps from 25 ms to 250 ms.
                      The voice gets choppy. Pages load in fits.
                    </p>
                    <p>
                      Fiber doesn&apos;t do this. The queues are shorter,
                      and the architecture doesn&apos;t need to time-share
                      a tiny upstream channel, so loaded latency stays
                      close to idle latency. It&apos;s the single biggest
                      qualitative difference between the two technologies.
                    </p>
                  </>
                }
                engineer={
                  <>
                    <p>
                      Bufferbloat: many DOCSIS 3.0 modems exhibited 1+
                      second of induced latency under sustained upstream
                      saturation. DOCSIS 3.1 with Active Queue Management
                      cut this materially but didn&apos;t eliminate it —
                      typical loaded latencies remain 100–300 ms on
                      consumer cable.
                    </p>
                    <p>
                      Low Latency DOCSIS (LLD), a CableLabs extension
                      layered onto 3.1 and required in 4.0, targets sub-1
                      ms queuing latency and a sub-5 ms 99th-percentile
                      RTT for &ldquo;non-queue-building&rdquo; flows.
                      Adoption requires modem, CMTS, and host OS ECN
                      signaling — still climbing in 2026.
                    </p>
                    <p>
                      Fiber&apos;s per-ONT TDMA scheduling has bounded
                      queuing because the OLT directly controls upstream
                      grants; there&apos;s no analog of cable&apos;s
                      shared OFDMA contention.
                    </p>
                  </>
                }
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── RELIABILITY ── */}
      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="warn">03 · Reliability</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              The outside plant tells the story.
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
              <ModeText
                reader={
                  <>
                    <p>
                      Cable&apos;s outside infrastructure has powered
                      amplifiers stationed every thousand feet or so —
                      they boost the signal as it travels down coax. Each
                      amplifier draws electricity from the cable plant
                      itself; when the power goes out, the cable company
                      has battery cabinets that run those amps for four to
                      eight hours, and then they die.
                    </p>
                    <p>
                      Fiber&apos;s outside plant is fully passive — there
                      is literally no powered component between the
                      central office (which has generators) and your ONT.
                      A storm that takes out neighborhood power leaves
                      your fiber up; only your ONT needs its own battery
                      to keep you online.
                    </p>
                    <p>
                      Glass is also dielectric — it doesn&apos;t conduct
                      electricity — so it&apos;s immune to lightning
                      surges that fry cable amplifiers and modems.
                    </p>
                  </>
                }
                engineer={
                  <>
                    <p>
                      HFC plant amplifier cascades typically run 5 trunk
                      amps + 3 line extenders before SNR degradation
                      forces a node. Each amp drifts (alignment), ages
                      (capacitors), and corrodes (F-connectors with
                      ingress). The cascade is fed 90 VAC quasi-square
                      power injected from line-power supplies; standard
                      battery backup runs 4–8 hours.
                    </p>
                    <p>
                      Fiber OSP: zero powered components OLT-to-ONT. PLC
                      splitters are essentially lifetime parts (no
                      semiconductors, no electrolytics). The OLT and the
                      CO sit on generator-backed power. Fault domains are
                      smaller — a fiber cut affects one ring, not 500
                      homes downstream of an amp.
                    </p>
                  </>
                }
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── PULLQUOTE ── */}
      <Section tone="deep" className="py-28">
        <Container size="narrow">
          <Reveal>
            <Pullquote source="OpenVault Broadband Insights Q4 2025">
              Fiber subscribers consumed{" "}
              <em className="font-light italic text-[var(--accent)]">
                66% more upstream bandwidth
              </em>{" "}
              than DOCSIS subscribers on the same operator&apos;s network.
              Asymmetry shapes behavior — not the other way around.
            </Pullquote>
          </Reveal>
        </Container>
      </Section>

      {/* ── FAQ ── */}
      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="accent">FAQ</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              Fiber vs cable — questions people actually ask.
            </h2>
            <div className="mt-10">
              <FaqList items={faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
            </div>
          </Reveal>
        </Container>
      </Section>

      <JumpNav
        prev={{ href: "/how-fiber-works", label: "How fiber works" }}
        next={{ href: "/fiber-vs-dsl", label: "Fiber vs DSL" }}
      />
    </>
  );
}
