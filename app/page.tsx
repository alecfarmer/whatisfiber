import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CtaLink, ArrowIcon } from "@/components/ui/cta";
import { Pullquote } from "@/components/ui/pullquote";
import { Stat } from "@/components/ui/stat";
import { JourneyRail } from "@/components/site/journey-rail";
import { RouteCard } from "@/components/site/route-card";
import { ReferencesRow } from "@/components/site/references-row";
import { SlowInternetTeaser } from "@/components/site/slow-internet-teaser";
import { QuizWizard } from "@/components/quiz/quiz-wizard";
import {
  pageMetadata,
  JsonLd,
  buildArticleSchema,
} from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "What Is Fiber Internet? Find Out What You Actually Need.",
    description:
      "Take the 60-second quiz to find your honest fiber speed — no email, no upsell. Then explore how fiber works, from the box on your wall to the cables on the ocean floor.",
    path: "/",
    type: "website",
  }),
  // FlexOffers affiliate-network site verification — renders as
  // <meta name="fo-verify" content="..." /> in the head.
  verification: {
    other: { "fo-verify": "88113381-6690-45f5-a104-d5febdf101ef" },
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          title: "What Is Fiber Internet?",
          description:
            "An end-to-end visual guide to fiber internet — physical layer, network, backbone, ocean, and edge — with an honest decision quiz.",
          path: "/",
        })}
      />

      {/* ────────── HERO (quiz-as-centerpiece) ────────── */}
      <section className="relative border-b border-[var(--border-hairline)] pt-[calc(var(--nav-h)+56px)] pb-20 md:pt-[calc(var(--nav-h)+96px)] md:pb-32">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* Left: editorial pitch */}
            <div>
              <div className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
                01 — Start here
              </div>
              <h1 className="display mt-5 max-w-[20ch] text-balance text-[clamp(40px,7vw,76px)] font-medium leading-[1.02] text-[var(--fg)]">
                Find out what internet you{" "}
                <em className="font-light italic text-[var(--accent-text)]">
                  actually
                </em>{" "}
                need.
              </h1>
              <p className="mt-7 max-w-[52ch] text-[clamp(16px,1.6vw,19px)] leading-[1.65] text-[var(--fg-muted)]">
                Six questions. One honest answer. We&apos;ll tell you the
                speed range that fits your house, whether fiber is worth
                the price, and which providers cover your block. Free, no
                email, no upsell — runs entirely in your browser.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <CtaLink href="/is-fiber-worth-it" trailingIcon={<ArrowIcon />}>
                  Take the 60-second quiz
                </CtaLink>
                <CtaLink
                  href="/how-fiber-works"
                  variant="ghost"
                  trailingIcon={<ArrowIcon />}
                >
                  Read the field guide
                </CtaLink>
              </div>
              <p className="mono mt-8 text-[11px] text-[var(--fg-faint)]">
                Recommended by no one. Sourced from FCC, ITU-T, Ookla, OpenVault.
              </p>
            </div>

            {/* Right: quiz mode chooser inline */}
            <div className="relative">
              <Reveal>
                <QuizWizard variant="inline" />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ────────── DIAGNOSE FIRST (slow-internet teaser) ────────── */}
      <Section tone="deep">
        <Container>
          <Reveal>
            <SlowInternetTeaser />
          </Reveal>
        </Container>
      </Section>

      {/* ────────── THE JOURNEY (router → backbone) ────────── */}
      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <div className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
                03 — End to end
              </div>
              <h2 className="display mt-3 max-w-[20ch] text-[clamp(28px,4.2vw,44px)] font-medium leading-[1.06] text-[var(--fg)]">
                From your Wi-Fi router to the cable on the ocean floor.
              </h2>
              <p className="mt-5 max-w-[44ch] text-[16px] leading-relaxed text-[var(--fg-muted)]">
                Your packet crosses eight stops between your laptop and a
                server in another continent — most of them passive glass.
                Tap any stop to dive in.
              </p>
              <div className="mt-7">
                <CtaLink
                  href="/how-fiber-works"
                  variant="secondary"
                  trailingIcon={<ArrowIcon />}
                >
                  Read the full journey
                </CtaLink>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <JourneyRail />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ────────── COMPARISON TEASER ────────── */}
      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container>
          <Reveal>
            <div className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
              04 — Head to head
            </div>
            <h2 className="display mt-3 max-w-[22ch] text-[clamp(28px,4.2vw,44px)] font-medium leading-[1.06] text-[var(--fg)]">
              The honest comparisons.
            </h2>
            <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-[var(--fg-muted)]">
              Each comparison page leads with a side-by-side table of real
              2026 numbers — DOCSIS 4.0 vs XGS-PON, Starlink vs fiber
              latency, T-Mobile Home deprioritization rules.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal>
              <RouteCard
                href="/fiber-vs-cable"
                eyebrow="Cable"
                title="Fiber vs cable"
                blurb="DOCSIS 3.1 / 4.0, bufferbloat, upload symmetry."
              />
            </Reveal>
            <Reveal delay={0.04}>
              <RouteCard
                href="/fiber-vs-dsl"
                eyebrow="DSL"
                title="Fiber vs DSL"
                blurb="Why copper caps at 100 Mbps. AT&T retiring by 2029."
                tone="edge"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <RouteCard
                href="/fiber-vs-satellite"
                eyebrow="Satellite"
                title="Fiber vs Starlink"
                blurb="LEO vs GEO latency physics, capacity-per-cell math."
                tone="warn"
              />
            </Reveal>
            <Reveal delay={0.12}>
              <RouteCard
                href="/fiber-vs-5g-home-internet"
                eyebrow="5G Home"
                title="Fiber vs 5G home"
                blurb="Cell-sector sharing, deprioritization, install speed."
                tone="flag"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ────────── REFERENCES ────────── */}
      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container>
          <Reveal>
            <ReferencesRow />
          </Reveal>
        </Container>
      </Section>

      {/* ────────── PULLQUOTE ────────── */}
      <Section tone="deep" className="py-24">
        <Container size="narrow">
          <Reveal>
            <Pullquote source="OpenVault Q4 2025 Broadband Insights">
              The average US household uses 711.4 GB per month. That works
              out to{" "}
              <em className="font-light italic text-[var(--accent-text)]">
                under 50 Mbps peak.
              </em>{" "}
              Almost no one needs multi-gig.
            </Pullquote>
          </Reveal>
        </Container>
      </Section>

      {/* ────────── STATS ────────── */}
      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container size="wide">
          <Reveal>
            <div className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
              06 — By the numbers
            </div>
            <h2 className="display mt-3 max-w-[20ch] text-[clamp(28px,4vw,44px)] font-medium leading-[1.06] text-[var(--fg)]">
              The internet is enormous and almost entirely invisible.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal>
              <Stat
                number={200_000}
                unit="km/s"
                label="Speed of light in glass fiber"
                caption="Two-thirds of c. The glass is the fastest part of the entire system."
                tone="accent"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <Stat
                number={552}
                suffix="+"
                label="Active submarine cables"
                caption="Carrying 99% of intercontinental internet traffic across the ocean floor."
                tone="accent"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <Stat
                number={80_000}
                suffix="+"
                label="Autonomous systems"
                caption="Independent networks in the Default-Free Zone, all running BGP."
                tone="accent"
              />
            </Reveal>
            <Reveal delay={0.15}>
              <Stat
                number={330}
                suffix="+"
                label="Cloudflare edge cities"
                caption="The actual content you load is usually under 50 ms away."
                tone="accent"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ────────── KEEP READING ────────── */}
      <Section
        tone="deep"
        className="border-t border-[var(--border-hairline)] pb-32"
      >
        <Container size="narrow" className="text-center">
          <Reveal>
            <div className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
              07 — Keep reading
            </div>
            <h2 className="display mt-3 max-w-[22ch] mx-auto text-balance text-[clamp(28px,4vw,44px)] font-medium leading-[1.06] text-[var(--fg)]">
              Or just take the quiz first.
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-relaxed text-[var(--fg-muted)]">
              The quiz takes 60 seconds and ends with provider recommendations
              for your ZIP. The field guide takes 30 minutes and ends with you
              understanding the internet better than your ISP&apos;s sales rep.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <CtaLink href="/is-fiber-worth-it" trailingIcon={<ArrowIcon />}>
                Take the quiz
              </CtaLink>
              <CtaLink
                href="/how-fiber-works"
                variant="secondary"
                trailingIcon={<ArrowIcon />}
              >
                Read the field guide
              </CtaLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
