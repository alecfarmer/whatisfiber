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
  title: "Fiber vs DSL: Why DSL Tops Out at 100 Mbps (2026)",
  description:
    "DSL runs internet over phone lines and tops out around 100 Mbps. Fiber delivers 1–10 Gbps over glass. Here's the physics, the family tree, and why AT&T is retiring DSL by 2029.",
  path: "/fiber-vs-dsl",
});

const faqs = [
  {
    q: "Why is fiber so much faster than DSL?",
    a: "Two reasons: medium and architecture. DSL pushes digital signals up the same copper telephone wire designed in the 20th century for voice; copper attenuates rapidly at high frequencies, so the further you are from the equipment, the slower you go. Fiber carries light through glass that barely loses signal over kilometers, and uses its full available spectrum for data — no analog carrier, no distance-vs-speed tradeoff.",
  },
  {
    q: "What is DSL?",
    a: "DSL stands for Digital Subscriber Line. It's a family of technologies that piggyback high-frequency digital signals on top of the same copper telephone wires used for analog voice. ADSL2+ tops out at 24/3.5 Mbps within about 1 km of the central office. VDSL2 reaches ~100/40 Mbps within 300 m of a fiber-fed street cabinet. G.fast hits ~1 Gbps but only when fiber reaches within 250 m of the home.",
  },
  {
    q: "Why does DSL speed depend on distance from the central office?",
    a: "Copper attenuates signal in proportion to frequency and length. DSL uses Discrete Multitone modulation — hundreds of narrow sub-carriers, each modulated independently. As cable length grows, the highest-frequency tones drop out first (they get too weak), then the next-highest, until only the lowest tones survive. That's why a house 500 m from the cabinet might get 80 Mbps and a house 1.5 km away might get 12 Mbps on the same plan.",
  },
  {
    q: "Is AT&T shutting down DSL?",
    a: "Yes. AT&T stopped selling DSL to new customers on October 1, 2020. In March 2025 it filed a plan to retire copper plant across roughly 1,300 wire centers by end-2025, with full retirement nationwide by 2029 (California has exemptions). Existing DSL customers remain connected until copper retirement reaches their area.",
  },
  {
    q: "Why is upload so bad on DSL?",
    a: "DSL's DMT spectrum was carved up asymmetrically by design — the early-2000s assumption was that users mostly downloaded. ADSL upstream gets just ~25–138 kHz of spectrum vs the much wider downstream band. Newer VDSL2 35b and G.fast can theoretically run symmetric profiles, but ISPs almost always configure them asymmetric.",
  },
  {
    q: "What is FTTC (fiber to the cabinet)?",
    a: "FTTC is a hybrid: fiber from the central office reaches a powered street cabinet near homes, and copper VDSL2 runs the last few hundred meters. This is what BT Openreach (UK) calls FTTC and what most VDSL2 deployments actually are. It's a transitional architecture; the long-term replacement is FTTH (fiber to the home).",
  },
  {
    q: "Does DSL still make sense anywhere in 2026?",
    a: "In rural areas where no other wired option exists, DSL remains the cheapest available 'broadband.' That's also exactly where the federal BEAD program ($42.45B) is investing to replace it — mostly with fiber, partly with LEO satellite or fixed wireless. For most US households, DSL is being actively phased out by both ISPs and government policy.",
  },
  {
    q: "Why does DSL feel slow even at 'broadband' speeds?",
    a: "Latency. A clean DSL line typically idles at 15–40 ms ping with interleaving enabled (the standard configuration); under upload load it can balloon to 200+ ms. Video calls degrade, modern web pages stall on round-trips, cloud apps feel sticky. Even a 25 Mbps DSL line and a 25 Mbps fiber line are very different user experiences.",
  },
];

const headlineRows = [
  { metric: "Max download (typical)", a: "1–10 Gbps", b: "24 Mbps (ADSL2+) / 100 Mbps (VDSL2)", winner: "a" as const },
  { metric: "Max upload (typical)", a: "1–10 Gbps (symmetric)", b: "3.5 Mbps (ADSL2+) / 40 Mbps (VDSL2)", winner: "a" as const },
  { metric: "Practical range", a: "20+ km from OLT", b: "<2 km useful for ADSL2+; <1 km for VDSL2", winner: "a" as const },
  { metric: "Medium", a: "Single-mode glass", b: "22–26 AWG twisted copper pair", winner: "a" as const },
  { metric: "Idle latency", a: "<2 ms first hop", b: "15–40 ms", winner: "a" as const },
  { metric: "Loaded latency", a: "Essentially unchanged", b: "100–500+ ms (bufferbloat)", winner: "a" as const },
  { metric: "Distance penalty", a: "None (passive splitters)", b: "Severe — speed drops with cable length", winner: "a" as const },
  { metric: "Weather sensitivity", a: "None (glass is dielectric)", b: "High — water in splices, oxidation", winner: "a" as const },
  { metric: "Modulation", a: "NRZ-OOK / coherent DWDM", b: "DMT with vectoring", winner: "tie" as const },
  { metric: "Future-proof", a: "25G-PON, 50G-PON on roadmap", b: "Being actively retired", winner: "a" as const },
  { metric: "Provider status", a: "Net adds across US", b: "AT&T retiring by 2029; BT by 2030s", winner: "a" as const },
];

export default function FiberVsDsl() {
  const path = "/fiber-vs-dsl";
  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          title: "Fiber vs DSL",
          description: metadata.description as string,
          path,
        })}
      />
      <JsonLd data={buildFaqSchema(faqs.map((f) => ({ q: f.q, a: f.a })))} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Fiber vs DSL", path },
        ])}
      />

      <Section tone="default" className="pt-[calc(var(--nav-h)+72px)]">
        <Container>
          <Breadcrumb
            trail={[
              { name: "Home", path: "/" },
              { name: "Fiber vs DSL", path },
            ]}
          />
          <SectionLabel tone="edge">Compare · Spoke</SectionLabel>
          <h1 className="display mt-4 max-w-[20ch] text-balance text-[clamp(40px,7vw,80px)] font-medium leading-[1.02] text-[var(--fg)]">
            Fiber vs DSL:{" "}
            <em className="font-light italic text-[var(--accent)]">
              why copper
            </em>{" "}
            stops at 100 Mbps.
          </h1>
          <p className="mt-7 max-w-[64ch] text-[19px] leading-[1.65] text-[var(--fg-muted)]">
            DSL runs internet over the same telephone copper laid down for
            voice in the 20th century. The physics caps it: signal weakens
            sharply with distance, upload was an afterthought, and every
            splice oxidizes. Fiber doesn&apos;t play the same game — and
            both AT&amp;T and BT Openreach are actively retiring copper to
            replace it.
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
              bLabel="DSL (ADSL2+ / VDSL2)"
              rows={headlineRows}
            />
          </Reveal>
          <p className="mono mt-4 text-[11px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
            Sources: ITU-T G.992 · G.993 · G.9700/9701 · FCC IAS June 2024 ·
            AT&amp;T copper-retirement filing (Mar 2025)
          </p>
        </Container>
      </Section>

      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="warn">01 · The distance problem</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              Copper forgets the high notes first.
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
              <ModeText
                reader={
                  <>
                    <p>
                      Imagine playing a song through a long pipe. Bass
                      notes travel fine. The high notes — the cymbals,
                      the violins — fade out before they reach the other
                      end. Copper telephone wire does the same thing to
                      DSL signals.
                    </p>
                    <p>
                      DSL doesn&apos;t send one big signal; it sends
                      hundreds of small ones at different frequencies,
                      modulated to carry data in parallel. The
                      highest-frequency channels — which carry the most
                      bits per second — die first as the cable gets
                      longer. By 2 km you&apos;ve lost them all. By 4 km
                      you&apos;ve lost most of the medium ones too.
                    </p>
                  </>
                }
                engineer={
                  <>
                    <p>
                      DMT modulation: ADSL2+ uses 512 sub-carriers across
                      ~2.2 MHz; VDSL2 17a uses ~4,096 carriers across
                      17.664 MHz; VDSL2 35b (&ldquo;Supervectoring&rdquo;)
                      uses 35.328 MHz. Each tone is bit-loaded
                      independently based on measured SNR at training.
                    </p>
                    <p>
                      Attenuation in 24 AWG twisted pair scales roughly
                      with √frequency × length. ADSL2+ training drops the
                      top half-band at &gt;3 km; VDSL2 17a falls back to
                      ADSL2+ profiles beyond ~1.5 km. The fundamental
                      physics — not the standard — sets the ceiling.
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
            <SectionLabel tone="live">02 · The retirement</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              AT&amp;T spends ~$6B/year maintaining copper that&apos;s
              going away.
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
              <ModeText
                reader={
                  <>
                    <p>
                      The copper telephone plant in the US is being
                      decommissioned. AT&amp;T stopped selling DSL in
                      2020. In 2025 it filed plans to retire copper
                      across 1,300 central offices by end of year and
                      finish the rest by 2029. BT Openreach in the UK is
                      on a similar trajectory — &ldquo;stop sell&rdquo;
                      already covers seven million premises.
                    </p>
                    <p>
                      The replacement is mostly fiber (FTTH) and partly
                      5G fixed wireless. The federal BEAD program —
                      $42.45 billion authorized in 2021 — is explicitly
                      the DSL-replacement vehicle: 63% of state final
                      proposals choose fiber as the primary technology.
                    </p>
                  </>
                }
                engineer={
                  <>
                    <p>
                      AT&amp;T&apos;s copper-retirement filing: phased
                      decommissioning of legacy POTS and DSL service
                      across &gt;1,300 wire centers, with Phase 1
                      replacement via AT&amp;T Phone Advanced / Internet
                      Air FWA, Phase 2 replacement via AT&amp;T Fiber
                      overbuild. FCC subscriber data: DSL fell to 6.6% of
                      US broadband connections as of Dec 2024, down from
                      ~10% the prior year and losing 3.1M connections in
                      the previous 12 months.
                    </p>
                    <p>
                      BT Openreach has 852 exchanges under stop-sell
                      (~40% of the 17M-premise full-fibre footprint) as
                      of Feb 2025. PSTN retirement target: January 2027.
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
            <Pullquote source="FCC Internet Access Services report, Dec 2024">
              DSL fell to{" "}
              <em className="font-light italic text-[var(--accent)]">
                6.6% of US broadband
              </em>{" "}
              by the end of 2024 — and lost 3.1 million connections in a
              single year. It is collapsing in real time.
            </Pullquote>
          </Reveal>
        </Container>
      </Section>

      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="accent">FAQ</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              Fiber vs DSL — common questions.
            </h2>
            <div className="mt-10">
              <FaqList items={faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
            </div>
          </Reveal>
        </Container>
      </Section>

      <JumpNav
        prev={{ href: "/fiber-vs-cable", label: "Fiber vs cable" }}
        next={{ href: "/fiber-vs-satellite", label: "Fiber vs satellite" }}
      />
    </>
  );
}
