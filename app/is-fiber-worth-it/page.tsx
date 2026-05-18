import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { ModeText } from "@/components/ui/mode-text";
import { Pullquote } from "@/components/ui/pullquote";
import { FaqList } from "@/components/ui/faq-list";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JumpNav } from "@/components/site/jump-nav";
import { QuizWizard } from "@/components/quiz/quiz-wizard";
import { cn } from "@/lib/utils";
import {
  pageMetadata,
  JsonLd,
  buildArticleSchema,
  buildFaqSchema,
  buildBreadcrumbSchema,
  buildHowToSchema,
} from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Is Fiber Internet Worth It? Honest 2026 Answer",
  description:
    "Fiber is worth it for remote workers, gamers, content creators, multi-device homes, and anyone who values reliability under load. It's overkill for casual browsers on a single laptop. Here's the honest breakdown by household type.",
  path: "/is-fiber-worth-it",
});

const faqs = [
  {
    q: "Is fiber internet worth the extra money?",
    a: "For most households, yes — but not because of the headline download speed. The real value of fiber is symmetric upload (10-100× faster than cable), latency stability under load (no bufferbloat), and reliability during weather events. Pure-consumer households with one or two devices and basic browsing get less value from fiber. Work-from-home, content-creator, multi-device, or gaming households get a lot.",
  },
  {
    q: "How much does fiber internet cost in 2026?",
    a: "Gigabit fiber typically runs $65-$95/month, no equipment fee, no data cap. Multi-gig tiers: 2 Gbps for $90-$120; 5 Gbps for $150-$200; Google Fiber's 8 Gbps tier for $150. Cable gigabit runs $80-$110/month with a $14-$15 equipment rental and often a 1.2 TB cap. After promotional periods expire, fiber typically costs the same or less than cable in markets that have both.",
  },
  {
    q: "Does fiber increase home value?",
    a: "Modestly, yes — appraisers and real-estate listings increasingly call out fiber availability, and several studies have found 3-5% price premiums on homes in fiber-served neighborhoods. The bigger effect is the inverse: homes in areas with only DSL or unreliable cable can see meaningful price discounts. In competitive markets, fiber availability is becoming a checked-box on listings the way central air did decades ago.",
  },
  {
    q: "Is 1 Gbps fiber overkill for a normal household?",
    a: "Probably yes, on download. Most homes can't saturate a gigabit even with multiple 4K streams (4K Netflix is ~25 Mbps; even four simultaneous streams is 100 Mbps). What you actually feel from fiber isn't the gigabit number — it's the symmetric upload, the latency stability, and the no-data-cap freedom. If your fiber provider's gigabit plan is the same price as their slower tiers, take the gig. If it's $20 more, the 500 Mbps tier is fine.",
  },
  {
    q: "Should I get fiber if I work from home?",
    a: "Strongly yes. Work-from-home is the killer use case for fiber's two key advantages: high upload (for video calls, screen sharing, file uploads, cloud backups) and stable latency under load (so a Zoom call doesn't degrade when someone else in the house streams 4K). If you've experienced a meeting where your video froze for fifteen seconds, that's almost always upload-bandwidth contention. Fiber doesn't do that.",
  },
  {
    q: "Is fiber worth it for gaming?",
    a: "Yes — but for different reasons than you'd expect. Pure bandwidth doesn't help games (most modern games use less than 1 Mbps in play). What helps is consistent low latency, low jitter, and reliable packet delivery. Fiber's 5-15 ms idle ping (vs cable's 15-30 ms, or 5G FWA's 30-60 ms) and stable under-load behavior are what gamers feel. Cloud gaming services (GeForce Now, Xbox Cloud) make fiber's advantages even more pronounced.",
  },
  {
    q: "Is fiber worth it for streaming?",
    a: "If you're a single-person household watching one stream, no — any modern broadband handles 4K. If you're a four-person household where two people stream 4K while a third is on Zoom and a fourth downloads a game patch, fiber's contention-free architecture is the difference between everything working and nothing working. The breakpoint is roughly 4 simultaneous heavy users.",
  },
  {
    q: "Should I wait for fiber if it's coming to my area soon?",
    a: "If it's truly coming within 6-12 months and you can tolerate your current service, yes — once fiber arrives you can switch and skip the cable contract early-termination dance. If the timeline is 2+ years (very common for BEAD-funded builds), don't wait; sign up for whatever works now and switch later. Track real construction progress, not just marketing announcements — both AT&T and Google Fiber post truck-roll progress to their address-checker tools.",
  },
];

type Verdict = "yes" | "maybe" | "overkill";

const personas: {
  emoji?: string;
  label: string;
  verdict: Verdict;
  body: string;
  reason: string;
}[] = [
  {
    label: "Single person, one laptop, basic browsing",
    verdict: "overkill",
    body: "Email, social, occasional Netflix, no work-from-home, no gaming, no cloud backup at scale.",
    reason: "Gigabit fiber is overspending. Pick the cheapest reliable wired tier (50–300 Mbps). Cable or DSL is fine. Save the difference.",
  },
  {
    label: "Couple, two laptops, occasional WFH",
    verdict: "maybe",
    body: "Two adults each on a call once or twice a week, modest streaming, light cloud sync.",
    reason: "Worth it if fiber is comparable in price to cable, especially for the upload symmetry. Skip the 2 Gbps tier — the 500 Mbps fiber tier is plenty.",
  },
  {
    label: "Full-time remote worker",
    verdict: "yes",
    body: "Daily video calls, large file uploads, cloud-hosted dev environments, screen sharing.",
    reason: "Fiber's upload + stable latency under load is exactly what you need. Pay the premium if your job depends on it — it does.",
  },
  {
    label: "Family of four, multiple streamers + gamer",
    verdict: "yes",
    body: "Two simultaneous 4K streams, one teen on a console, a parent on Zoom, security cameras to the cloud.",
    reason: "Cable will degrade noticeably at peak hours. Fiber sails through. The dedicated-capacity model is the real value here.",
  },
  {
    label: "Content creator (Twitch / YouTube / podcaster)",
    verdict: "yes",
    body: "Live streaming uploads (3–20 Mbps sustained), giant video uploads, multiple device cloud sync.",
    reason: "This is the killer use case for fiber upload. A 35 Mbps cable upload cannot sustain a 1080p60 Twitch stream + everything else. Fiber 1 Gbps does it without thinking.",
  },
  {
    label: "Smart home + 30+ devices",
    verdict: "maybe",
    body: "Cameras, doorbells, smart bulbs, voice assistants, all uplinking to clouds continuously.",
    reason: "The aggregate background traffic is small but never sleeps. Fiber's stable latency keeps the dashboard responsive; cable&apos;s upload throttle can make device control feel sticky.",
  },
];

const VerdictPill = ({ verdict }: { verdict: Verdict }) => {
  const styles: Record<Verdict, { label: string; color: string }> = {
    yes: { label: "Worth it", color: "var(--status-live)" },
    maybe: { label: "Maybe", color: "var(--status-flag)" },
    overkill: { label: "Overkill", color: "var(--status-warn)" },
  };
  const s = styles[verdict];
  return (
    <span
      className="mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
      style={{ borderColor: s.color, color: s.color }}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full"
        style={{ background: s.color }}
      />
      {s.label}
    </span>
  );
};

type SearchParams = Promise<{ mode?: string }>;

export default async function IsFiberWorthIt({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const path = "/is-fiber-worth-it";
  const params = (await searchParams) ?? {};
  const initialMode =
    params.mode === "quick" || params.mode === "precise"
      ? params.mode
      : undefined;
  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          title: "Is Fiber Worth It?",
          description: metadata.description as string,
          path,
          articleSection: "Decision",
          keywords: [
            "is fiber worth it",
            "fiber internet cost",
            "fiber vs cable price",
            "fiber for remote work",
            "fiber availability",
          ],
        })}
      />
      <JsonLd data={buildFaqSchema(faqs.map((f) => ({ q: f.q, a: f.a })))} />
      <JsonLd
        data={buildHowToSchema({
          name: "How to decide if fiber internet is worth it",
          description:
            "A six-step honest decision for whether to switch to fiber based on your household, work patterns, and what's available at your address.",
          totalTime: "PT2M",
          steps: [
            {
              name: "Identify your household type",
              text: "Single browser, remote worker, streaming family, content creator, or gamer — each has a different fiber threshold.",
            },
            {
              name: "Check your upload needs",
              text: "If you're on video calls, uploading content, or running a home server, cable's ~35 Mbps upload will fight you. Fiber is symmetric.",
            },
            {
              name: "Check fiber availability at your address",
              text: "Use the FCC-powered provider lookup on this page. Fiber may not exist on your block even if your ZIP code shows it.",
            },
            {
              name: "Compare honest pricing after promos expire",
              text: "Cable's first-year price often beats fiber. After year one, fiber is usually equal or cheaper — and has no equipment rental or data cap.",
            },
            {
              name: "Evaluate latency stability, not just download speed",
              text: "Fiber's bufferbloat behavior under load is dramatically better than cable. Speedtest doesn't show this — Waveform Bufferbloat does.",
            },
            {
              name: "Decide based on the gap, not the headline",
              text: "Fiber is worth it when its strengths (symmetric upload, latency, reliability, no cap) match your real usage. Otherwise cable is fine.",
            },
          ],
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Is fiber worth it?", path },
        ])}
      />

      <Section tone="default" className="pt-[calc(var(--nav-h)+72px)]">
        <Container>
          <Breadcrumb
            trail={[
              { name: "Home", path: "/" },
              { name: "Is fiber worth it?", path },
            ]}
          />
          <SectionLabel tone="flag">Decide · Pillar</SectionLabel>
          <h1 className="display mt-4 max-w-[22ch] text-balance text-[clamp(40px,7vw,80px)] font-medium leading-[1.02] text-[var(--fg)]">
            Is fiber{" "}
            <em className="font-light italic text-[var(--accent)]">
              worth it?
            </em>{" "}
            Honest answer.
          </h1>
          <p className="mt-7 max-w-[64ch] text-[19px] leading-[1.65] text-[var(--fg-muted)]">
            For remote workers, content creators, gamers, and households
            with 4+ simultaneous heavy users — yes, almost always. For a
            single person checking email and watching one Netflix stream
            — no, not really. The honest version: fiber is worth it when
            you actually feel its three advantages (symmetric upload,
            stable latency under load, no data cap). When you don&apos;t,
            it isn&apos;t. Below: by household.
          </p>
        </Container>
      </Section>

      {/* ── INTERACTIVE WIZARD — the primary CTA on this page ── */}
      <Section
        id="quiz"
        tone="deep"
        className="border-t border-[var(--border-hairline)]"
      >
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="flag">Answer five questions</SectionLabel>
            <h2 className="display mt-4 max-w-[24ch] text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              Tell us about your house. We&apos;ll tell you{" "}
              <em className="font-light italic text-[var(--accent)]">
                if fiber is worth it.
              </em>
            </h2>
            <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-[var(--fg-muted)]">
              Takes under a minute. No email, no sign-up — the recommendation
              runs entirely in your browser.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10">
              <QuizWizard initialMode={initialMode} />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container>
          <Reveal>
            <SectionLabel tone="live">Or browse by household</SectionLabel>
            <h2 className="display mt-4 max-w-[24ch] text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              Skip the quiz — pick the one that sounds like you.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {personas.map((p, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="flex h-full flex-col rounded-[20px] border border-[var(--border-soft)] bg-[var(--ink-raised)] p-6">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="display text-[18px] font-medium leading-snug text-[var(--fg)]">
                      {p.label}
                    </div>
                    <VerdictPill verdict={p.verdict} />
                  </div>
                  <p className="text-[14px] leading-relaxed text-[var(--fg-muted)]">
                    {p.body}
                  </p>
                  <p
                    className={cn(
                      "mt-4 border-t border-[var(--border-hairline)] pt-4 text-[14px] leading-relaxed",
                      "text-[var(--fg)]",
                    )}
                  >
                    {p.reason}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="accent">The three reasons</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              What you&apos;re actually paying for.
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
              <ModeText
                reader={
                  <>
                    <p>
                      <strong className="text-[var(--fg)]">
                        1. Upload that matches download.
                      </strong>{" "}
                      Cable&apos;s ~35 Mbps upload chokes anything that
                      pushes data out — Zoom, cloud backups, big email
                      attachments, content uploads. Fiber sends and
                      receives at the same speed.
                    </p>
                    <p>
                      <strong className="text-[var(--fg)]">
                        2. Latency that stays low when things get busy.
                      </strong>{" "}
                      Cable&apos;s ping climbs from 25 ms to 300 ms when
                      the connection is saturated. Fiber doesn&apos;t
                      do this. Calls and games stay smooth even when
                      someone in the house starts a big download.
                    </p>
                    <p>
                      <strong className="text-[var(--fg)]">
                        3. No data cap, no shared peak-hour slowdown.
                      </strong>{" "}
                      Comcast caps at 1.2 TB; modern 4K-streaming
                      households routinely hit that. Fiber providers
                      don&apos;t cap. And fiber&apos;s architecture
                      doesn&apos;t bog down at 7&nbsp;pm the way
                      cable&apos;s shared nodes do.
                    </p>
                  </>
                }
                engineer={
                  <>
                    <p>
                      Upload symmetry: XGS-PON 10G/10G vs DOCSIS 3.1
                      effective upstream typically 35–200 Mbps.
                      OpenVault Q4 2025 found fiber subs at 677 Mbps
                      symmetric consumed 66% more upstream than DOCSIS
                      subs on the same operator&apos;s network — supply
                      shapes demand.
                    </p>
                    <p>
                      Latency: fiber 5–15 ms loaded; DOCSIS 3.1 50–300
                      ms loaded without LLD; Low Latency DOCSIS targets
                      sub-5 ms 99th-percentile for compliant flows but
                      deployment is still climbing.
                    </p>
                    <p>
                      Architecture: PON 1:32 splits give ~312 Mbps/home
                      guaranteed minimum on XGS-PON; cable HFC nodes
                      still average 200–500 homes shared. Fiber
                      scales by adding fiber pairs; cable scales by
                      node splits.
                    </p>
                  </>
                }
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="deep" className="py-28">
        <Container size="narrow">
          <Reveal>
            <Pullquote source="The honest version">
              Fiber is worth it when you actually feel its{" "}
              <em className="font-light italic text-[var(--accent)]">
                three advantages.
              </em>{" "}
              If you don&apos;t — it isn&apos;t.
            </Pullquote>
          </Reveal>
        </Container>
      </Section>

      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="accent">FAQ</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              Decision-stage questions.
            </h2>
            <div className="mt-10">
              <FaqList items={faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
            </div>
          </Reveal>
        </Container>
      </Section>

      <JumpNav
        prev={{
          href: "/fiber-vs-5g-home-internet",
          label: "Fiber vs 5G home internet",
        }}
        next={{ href: "/glossary", label: "Glossary" }}
      />
    </>
  );
}
