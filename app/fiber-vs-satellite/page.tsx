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
  title: "Fiber vs Satellite (Starlink, HughesNet): The 2026 Comparison",
  description:
    "Starlink (LEO) and HughesNet (geostationary) take different approaches to satellite internet. Fiber still wins on latency and capacity, but here's exactly when satellite makes more sense.",
  path: "/fiber-vs-satellite",
});

const faqs = [
  {
    q: "Is fiber faster than Starlink?",
    a: "On peak speeds, yes — fiber commonly delivers 1–10 Gbps; Starlink median US download was about 117 Mbps in Q4 2025. On latency, fiber is significantly lower (5–15 ms vs Starlink's 20–50 ms). Starlink is genuinely impressive for satellite — but it's competing with cable, not displacing fiber in markets that have both.",
  },
  {
    q: "Why does Starlink have lower latency than HughesNet?",
    a: "Orbital altitude. Starlink satellites orbit at ~550 km (Low Earth Orbit); HughesNet's Jupiter-3 is geostationary at ~35,786 km. The signal must travel up and back: Starlink round-trip is ~20–40 ms, GEO is at minimum 476 ms one-way (~600–700 ms round-trip in practice). That's physics, not engineering — no upgrade to a GEO satellite can fix it.",
  },
  {
    q: "Can Starlink replace fiber?",
    a: "Not at population scale. Each Starlink satellite serves a finite geographic cell with finite spectrum — back-of-envelope ~12–25 Mbps per square kilometer of land before subscriber sharing. That math works in rural and exurban areas; it falls apart in dense markets. Starlink is genuinely transformative for rural, mobile, and disaster-recovery use; it isn't structurally able to displace urban fiber.",
  },
  {
    q: "What is rain fade?",
    a: "Rain droplets absorb and scatter high-frequency radio waves. Ka-band (HughesNet/Viasat) is hit hardest — heavy rain can drop the signal for minutes. Ku-band (Starlink user terminals) is moderately affected — typically a 3–4 dB attenuation in heavy rain that translates to brief speed drops or 5–30 second outages. Fiber is immune; light through glass doesn't care about weather.",
  },
  {
    q: "How does a Starlink dish actually work?",
    a: "The dish is a flat phased array of ~1,280 individual antenna patches arranged in a hexagonal honeycomb. Each patch can shift the timing of its transmit/receive signal independently in 5° increments. By coordinating all 1,280 phase shifts, the antenna electronically steers a pencil beam at whichever satellite is overhead — with no moving parts (except a one-time motorized tilt during setup) — and performs make-before-break handoffs to the next satellite as the constellation passes.",
  },
  {
    q: "Why does Starlink waitlist my area?",
    a: "Cell saturation. Each satellite has a fixed aggregate capacity (~17–23 Gbps for V2 minis, approaching 1 Tbps for V3); each ground cell shares that across local subscribers. When a cell fills up, SpaceX gates new sign-ups in that area. It's not artificial scarcity — it's the bandwidth-area constraint biting. Waitlists returned across Western US in late 2024 for exactly this reason.",
  },
  {
    q: "Is HughesNet or Viasat any good in 2026?",
    a: "For specific niches, yes — they're the only consumer satellite options that work without a clear sky view to the LEO constellation, and they have decades of operational maturity. For most users in most places, Starlink has displaced them: dramatically lower latency, comparable speeds, simpler installation. The remaining niche is where physical sky-view constraints favor a southern-pointing GEO dish over a LEO terminal.",
  },
  {
    q: "When does satellite beat fiber?",
    a: "Mobile use (RVs, boats, off-grid cabins), genuinely rural areas where fiber economics break (>$10K cost per home passed), disaster-recovery scenarios (when terrestrial infrastructure is damaged), in-flight Wi-Fi, ships at sea, military forward-operating bases, and the few addresses where fiber simply isn't being built. For a fixed home with fiber available, satellite isn't the rational choice — but where fiber isn't, Starlink is meaningfully better than what existed five years ago.",
  },
];

const headlineRows = [
  { metric: "Max download speed", a: "1–10 Gbps", b: "Starlink ~250 Mbps peak / HughesNet ~100 Mbps", winner: "a" as const },
  { metric: "Median US download (Q4 2025)", a: "Fiber median 500+ Mbps", b: "Starlink ~117 Mbps / HughesNet ~48 Mbps", winner: "a" as const },
  { metric: "Upload speed", a: "Symmetric on XGS-PON (1–10 Gbps)", b: "Starlink 10–25 Mbps / HughesNet 3–5 Mbps", winner: "a" as const },
  { metric: "Latency (typical)", a: "5–15 ms", b: "Starlink 20–50 ms / HughesNet 600–700 ms", winner: "a" as const },
  { metric: "Jitter", a: "<1 ms", b: "Starlink 5–15 ms / HughesNet 50–100 ms", winner: "a" as const },
  { metric: "Capacity per cell", a: "Effectively unlimited per home", b: "Shared per satellite beam (17–23 Gbps for Starlink V2)", winner: "a" as const },
  { metric: "Weather impact", a: "None", b: "Starlink moderate (Ku rain fade) / HughesNet severe (Ka)", winner: "a" as const },
  { metric: "Mobility", a: "None — fixed", b: "Starlink Roam / Mini supports mobile use", winner: "b" as const },
  { metric: "Install cost", a: "$0–$200 with most providers", b: "Starlink $349 hardware + $0 install / HughesNet $99–$300", winner: "a" as const },
  { metric: "Monthly cost", a: "$65–$95 (1 Gig)", b: "Starlink $55–$175 / HughesNet $50–$90", winner: "tie" as const },
  { metric: "Power draw at customer", a: "ONT ~10 W", b: "Starlink dish 50–75 W continuous", winner: "a" as const },
  { metric: "Best for", a: "Permanent home with fiber available", b: "Rural, RVs, off-grid, disaster recovery", winner: "tie" as const },
];

export default function FiberVsSatellite() {
  const path = "/fiber-vs-satellite";
  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          title: "Fiber vs Satellite",
          description: metadata.description as string,
          path,
        })}
      />
      <JsonLd data={buildFaqSchema(faqs.map((f) => ({ q: f.q, a: f.a })))} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Fiber vs satellite", path },
        ])}
      />

      <Section tone="default" className="pt-[calc(var(--nav-h)+72px)]">
        <Container>
          <Breadcrumb
            trail={[
              { name: "Home", path: "/" },
              { name: "Fiber vs satellite", path },
            ]}
          />
          <SectionLabel tone="edge">Compare · Spoke</SectionLabel>
          <h1 className="display mt-4 max-w-[20ch] text-balance text-[clamp(40px,7vw,80px)] font-medium leading-[1.02] text-[var(--fg)]">
            Fiber vs satellite:{" "}
            <em className="font-light italic text-[var(--accent)]">
              the latency
            </em>{" "}
            of physics.
          </h1>
          <p className="mt-7 max-w-[64ch] text-[19px] leading-[1.65] text-[var(--fg-muted)]">
            Satellite is mostly two species: Starlink (LEO, 550 km up) and
            HughesNet / Viasat (geostationary, 35,786 km up). The 60× orbital
            altitude gap maps almost perfectly to the 15× latency gap
            between them. Fiber sits below both — and for almost any
            connection where it&apos;s available, it remains the right
            choice.
          </p>
        </Container>
      </Section>

      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container>
          <Reveal>
            <SectionLabel tone="accent">Headline</SectionLabel>
            <h2 className="display mt-4 max-w-[20ch] text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              Side by side.
            </h2>
          </Reveal>
          <Reveal delay={0.05} className="mt-10">
            <ComparisonTable
              aLabel="Fiber (FTTH)"
              bLabel="Satellite (LEO + GEO)"
              rows={headlineRows}
            />
          </Reveal>
          <p className="mono mt-4 text-[11px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
            Sources: Ookla Q4 2025 · SpaceX FCC filings · HughesNet Jupiter-3
            specs · IEEE ComSoc Tech Blog Jul 2025
          </p>
        </Container>
      </Section>

      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="warn">01 · Orbital altitude</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              You cannot engineer your way out of the speed of light.
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
              <ModeText
                reader={
                  <>
                    <p>
                      A geostationary satellite sits 35,786 km above the
                      equator — high enough that its orbit takes exactly
                      24 hours, so it appears fixed in the sky. That
                      height is the whole point (so your dish never has
                      to move), but it&apos;s also the catch: every
                      packet you send has to travel up 35,786 km, back
                      down, through the public internet, and back up and
                      down again to receive the reply. Even at the speed
                      of light, that&apos;s about half a second per
                      round trip.
                    </p>
                    <p>
                      Starlink&apos;s satellites are sixty times closer
                      — 550 km up — which is why ping times drop from
                      600+ ms to 20–40 ms. The catch is that low-orbit
                      satellites move fast: each one only stays
                      overhead for a few minutes before another takes
                      its place. The dish has to electronically swing
                      its beam to the next satellite, microseconds before
                      the handoff, thousands of times a day.
                    </p>
                  </>
                }
                engineer={
                  <>
                    <p>
                      GEO at 35,786 km has 119 ms one-way light-time;
                      best-case round-trip via two passes through the
                      satellite is ~476 ms, and 600–700 ms in practice
                      after Earth-station processing and terrestrial
                      transit. No modulation or coding improvement
                      reduces this.
                    </p>
                    <p>
                      Starlink at 540–570 km: one-way light-time ~1.8–1.9
                      ms per leg. Full round-trip incl. ground-station
                      hops and terrestrial internet typically 20–40 ms
                      median in well-served cells. Inter-satellite laser
                      links on V2/V3 (E-band) shorten paths further for
                      long-haul cross-ocean cases by avoiding
                      ground-station hops.
                    </p>
                  </>
                }
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="live">02 · Capacity</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              The bits-per-square-kilometer ceiling.
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
              <ModeText
                reader={
                  <>
                    <p>
                      Starlink has roughly 9,000 active satellites — but
                      only about a third are over land at any given
                      moment, and the total constellation capacity is
                      shared across every subscriber on Earth. The
                      back-of-envelope math comes out to single-digit
                      Mbps per home if Starlink ever scaled to 50
                      million users worldwide.
                    </p>
                    <p>
                      A single fiber strand can carry more bandwidth
                      than every Starlink satellite combined. That&apos;s
                      not hyperbole — modern DWDM systems push 30+ Tbps
                      down one pair of glass strands. Fiber&apos;s
                      capacity scales with the number of fibers you
                      install; satellite&apos;s capacity is capped by
                      the spectrum you can re-use without interference.
                    </p>
                  </>
                }
                engineer={
                  <>
                    <p>
                      Each Starlink V2 mini delivers 17–23 Gbps aggregate
                      downlink. V3 satellites (early 2025 onwards) target
                      ~1 Tbps. Capacity is geographic — divided across
                      coverage cells, each with finite simultaneous
                      subscribers. SpaceX gates address-level sign-ups
                      per cell when saturation approaches.
                    </p>
                    <p>
                      Constellation math: ~9,000 active sats × ~20 Gbps
                      average = 180 Tbps total. ~1/3 over land = ~60 Tbps
                      usable over land. At ~7M residential subs today,
                      that&apos;s ~9 Mbps continuous per subscriber on
                      average; bursty utilization brings instantaneous
                      speeds to 100–300 Mbps. Push subscriber count
                      higher and capacity-per-user collapses.
                    </p>
                  </>
                }
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="default" className="py-28">
        <Container size="narrow">
          <Reveal>
            <Pullquote source="Field math, 2026">
              A Starlink satellite is the size of a dining table,{" "}
              <em className="font-light italic text-[var(--accent)]">
                flies 340 miles up at 17,000 mph
              </em>
              , and burns up on re-entry within five years.
            </Pullquote>
          </Reveal>
        </Container>
      </Section>

      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="accent">FAQ</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              Fiber vs satellite — questions worth asking.
            </h2>
            <div className="mt-10">
              <FaqList items={faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
            </div>
          </Reveal>
        </Container>
      </Section>

      <JumpNav
        prev={{ href: "/fiber-vs-dsl", label: "Fiber vs DSL" }}
        next={{
          href: "/fiber-vs-5g-home-internet",
          label: "Fiber vs 5G home internet",
        }}
      />
    </>
  );
}
