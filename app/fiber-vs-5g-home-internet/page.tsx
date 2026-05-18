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
  title: "Fiber vs 5G Home Internet: Honest 2026 Comparison",
  description:
    "5G home internet (T-Mobile, Verizon, AT&T Internet Air) installs in minutes and feels fantastic — when the tower has spare capacity. Fiber is dedicated and symmetric. Here's the structural difference and when each wins.",
  path: "/fiber-vs-5g-home-internet",
});

const faqs = [
  {
    q: "Is 5G home internet as good as fiber?",
    a: "For some homes, yes. For others, it's a disaster. The difference depends almost entirely on how loaded the cell tower serving your address is. T-Mobile, Verizon, and AT&T pick fixed-wireless markets based on spare cell capacity, so the experience is genuinely good in low-density areas and meaningfully degraded in dense ones. Fiber doesn't have this variance — every subscriber gets dedicated capacity.",
  },
  {
    q: "Why does T-Mobile Home Internet slow down at peak hours?",
    a: "T-Mobile explicitly puts Home Internet customers behind mobile phone customers in the network's QoS queue. When the tower is busy, phones get airtime first, your home internet waits. This is published network management policy, not throttling — and after 1.2 TB/month of usage you're deprioritized further. It works fine on under-loaded towers and feels broken on saturated ones.",
  },
  {
    q: "Is 5G home internet faster than fiber?",
    a: "Peak speeds: no. T-Mobile and Verizon advertise up to ~415 Mbps on mid-band tiers, with median user-reported speeds typically 63–90 Mbps (T-Mobile) and 85–300 Mbps (Verizon C-band). Fiber gigabit plans deliver 1,000 Mbps symmetric. Where 5G FWA shines isn't peak speed — it's installation speed (10 minutes vs weeks) and rent-friendliness.",
  },
  {
    q: "What is AT&T Internet Air?",
    a: "AT&T's 5G fixed wireless service — a gateway device that connects to AT&T's mid-band 5G (n77 C-band) or LTE depending on availability, then provides Wi-Fi to your home. Functionally similar to T-Mobile Home Internet. Reviews are mixed because AT&T aggressively markets it as a DSL replacement in areas where they declined to build fiber — often the same areas where cell capacity is constrained.",
  },
  {
    q: "Why does 5G home internet have a 1.2 TB cap?",
    a: "T-Mobile and AT&T both apply soft deprioritization thresholds (1.2 TB for T-Mobile, 1.5 TB for AT&T) to manage cell capacity. They're not hard caps — you don't get cut off — but after the threshold you drop in priority and may see noticeably slower speeds during congestion. Verizon 5G Home does not advertise a specific threshold but applies similar QoS management.",
  },
  {
    q: "Can 5G home internet support video calls and gaming?",
    a: "Usually yes for video calls; sometimes yes for gaming. Latency on mid-band 5G FWA is typically 30–60 ms with 10–30 ms jitter — workable for video conferencing, marginal for competitive multiplayer. The bigger problem is variability: a Zoom call mid-evening on a busy tower can degrade enough that you'll cut out. Fiber doesn't have this jitter problem.",
  },
  {
    q: "Is 5G home internet more reliable than cable?",
    a: "Mixed. It eliminates the bufferbloat issue cable has, and it doesn't depend on the cable plant's powered amplifiers. But it adds new failure modes: rain attenuation on mmWave (rare in mid-band), foliage blocking line-of-sight, single-tower outages, and the deprioritization issue. For a household where cable is also slow, switching to 5G FWA often makes things better; for a household with reliable cable already, it's a wash.",
  },
  {
    q: "Will 5G home internet replace fiber?",
    a: "No — they serve different roles. 5G FWA is wonderfully cost-effective for ISPs in markets where they already own the cell sites and have spare capacity; it monetizes idle airtime. But cells saturate, and you can't add new fiber-equivalent capacity to a tower the way you can add fiber pairs to the ground. ISPs treat FWA as a complementary product to fiber, not a replacement.",
  },
];

const headlineRows = [
  { metric: "Max download (typical)", a: "1–10 Gbps", b: "300 Mbps – 1 Gbps (rare mmWave LoS)", winner: "a" as const },
  { metric: "Median real-world DL", a: "500+ Mbps on gig tiers", b: "T-Mo 63–90 Mbps / Verizon 85–300 Mbps", winner: "a" as const },
  { metric: "Upload speed", a: "1–10 Gbps (symmetric on XGS-PON)", b: "9–75 Mbps typical", winner: "a" as const },
  { metric: "Latency (typical)", a: "5–15 ms", b: "30–60 ms", winner: "a" as const },
  { metric: "Jitter under load", a: "<1 ms", b: "10–30 ms", winner: "a" as const },
  { metric: "Capacity model", a: "Dedicated per ONT", b: "Shared cell sector with mobile phones", winner: "a" as const },
  { metric: "Deprioritization", a: "None — guaranteed capacity", b: "T-Mobile soft cap 1.2 TB / AT&T 1.5 TB", winner: "a" as const },
  { metric: "Weather impact", a: "None", b: "Sub-6 GHz: none; mmWave: rain, foliage, walls", winner: "a" as const },
  { metric: "Install time", a: "1–3 weeks", b: "10 minutes (self-install)", winner: "b" as const },
  { metric: "Rent-friendly", a: "Requires landlord OK for fiber drop", b: "Just plug in the gateway", winner: "b" as const },
  { metric: "Monthly cost", a: "$65–$95 (1 Gig)", b: "$35–$80", winner: "b" as const },
  { metric: "Hardware cost", a: "$0 (ONT included)", b: "$0 (gateway included)", winner: "tie" as const },
  { metric: "Best for", a: "Permanent home, work-from-home, gamers", b: "Renters, fast move-in, fiber-unavailable areas", winner: "tie" as const },
];

export default function FiberVs5G() {
  const path = "/fiber-vs-5g-home-internet";
  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          title: "Fiber vs 5G Home Internet",
          description: metadata.description as string,
          path,
        })}
      />
      <JsonLd data={buildFaqSchema(faqs.map((f) => ({ q: f.q, a: f.a })))} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Fiber vs 5G home internet", path },
        ])}
      />

      <Section tone="default" className="pt-[calc(var(--nav-h)+72px)]">
        <Container>
          <Breadcrumb
            trail={[
              { name: "Home", path: "/" },
              { name: "Fiber vs 5G home internet", path },
            ]}
          />
          <SectionLabel tone="edge">Compare · Spoke</SectionLabel>
          <h1 className="display mt-4 max-w-[20ch] text-balance text-[clamp(40px,7vw,80px)] font-medium leading-[1.02] text-[var(--fg)]">
            Fiber vs 5G home:{" "}
            <em className="font-light italic text-[var(--accent)]">
              dedicated
            </em>{" "}
            vs contested.
          </h1>
          <p className="mt-7 max-w-[64ch] text-[19px] leading-[1.65] text-[var(--fg-muted)]">
            5G home internet — T-Mobile Home Internet, Verizon 5G Home,
            AT&amp;T Internet Air — installs in minutes and feels great
            when the tower has spare capacity. The catch: those gateways
            share the same cell sector with every mobile phone in
            range, and your home traffic gets deprioritized when phones
            need the airtime. Fiber doesn&apos;t share. Below: how the
            structural difference plays out in real use.
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
              bLabel="5G FWA (T-Mobile / Verizon / AT&T)"
              rows={headlineRows}
            />
          </Reveal>
          <p className="mono mt-4 text-[11px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
            Sources: Ookla 5G FWA reports · T-Mobile network management
            policy · Verizon plan disclosures · 5G Americas FWA whitepaper
          </p>
        </Container>
      </Section>

      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="warn">01 · Deprioritization</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              Your home internet is in line behind every phone.
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
              <ModeText
                reader={
                  <>
                    <p>
                      T-Mobile&apos;s network management policy is
                      explicit: Home Internet customers have lower
                      priority than phone customers on the same tower.
                      When the cell sector is busy, phones get the
                      airtime first. Your home internet waits.
                    </p>
                    <p>
                      That feels invisible most of the time — until
                      6&nbsp;pm rolls around and the kids&apos; phones
                      come home from school and your Zoom call starts
                      stuttering. On an under-loaded tower, none of
                      this matters; your service feels great. On a
                      busy tower in a denser area, it&apos;s the
                      defining experience.
                    </p>
                    <p>
                      Fiber doesn&apos;t play this game. Every ONT
                      gets dedicated capacity from the central office.
                      It can&apos;t deprioritize you behind your
                      neighbor.
                    </p>
                  </>
                }
                engineer={
                  <>
                    <p>
                      T-Mobile QoS: Home Internet, Small Business
                      Internet, and Business Internet Unlimited plans
                      all share a 1.2 TB soft deprioritization
                      threshold, and across all usage tiers FWA traffic
                      is QoS-class demoted below mobile phone traffic
                      during congestion. AT&amp;T Internet Air applies
                      a 1.5 TB soft cap with similar deprioritization
                      behavior.
                    </p>
                    <p>
                      Cell-sector capacity is finite — typically 1.2–1.6
                      Gbps aggregate downlink on an 80–100 MHz n41
                      mid-band carrier with 64T64R massive-MIMO at the
                      Shannon limit. Adding FWA subscribers to a
                      saturated sector degrades all users (phones and
                      FWA) until ISPs do further sector splits or add
                      mmWave overlays.
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
            <SectionLabel tone="live">02 · When 5G home wins</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              The honest cases for choosing FWA.
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
              <ModeText
                reader={
                  <>
                    <p>
                      Don&apos;t take this comparison as
                      &ldquo;always-fiber.&rdquo; 5G home internet
                      genuinely wins in several situations:
                    </p>
                    <ul className="ml-5 list-disc space-y-2 marker:text-[var(--accent)]">
                      <li>
                        <strong>Your tower is under-loaded.</strong>{" "}
                        Smaller markets and exurbs often have plenty
                        of spare cell capacity; 5G FWA delivers
                        excellent service there for half the price of
                        cable.
                      </li>
                      <li>
                        <strong>You&apos;re a renter.</strong> No
                        landlord to deal with, no drilling for a fiber
                        drop, no install appointment. Plug in,
                        you&apos;re online.
                      </li>
                      <li>
                        <strong>You&apos;re moving in two weeks.</strong>{" "}
                        Fiber install takes 1–3 weeks. The gateway
                        ships overnight.
                      </li>
                      <li>
                        <strong>Fiber isn&apos;t in your area.</strong>{" "}
                        And the cable provider is the only other
                        option. 5G FWA at $50 often beats $90 cable
                        with a cap.
                      </li>
                    </ul>
                  </>
                }
                engineer={
                  <>
                    <p>
                      ISP economics drive the deployment pattern.
                      Greenfield fiber: $800–$3,000 per home passed
                      suburban, $5,000–$20,000+ rural. 5G FWA marginal
                      subscriber cost: ~$300 gateway + SIM provisioning,
                      monetizing existing cell-site capex. ARPU
                      $50–$70/mo, nearly all incremental margin until
                      cell saturation — which is why T-Mobile and
                      Verizon gate addresses aggressively.
                    </p>
                    <p>
                      Mid-band (n41 / n77) is the FWA sweet spot:
                      penetrates walls, isn&apos;t weather-sensitive,
                      and Massive MIMO beamforming makes spatial reuse
                      reasonable. mmWave (n261 / n260) deployments
                      remain spotty and are mostly used as urban
                      capacity-adders, not primary FWA.
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
            <Pullquote source="T-Mobile Network Management Policy">
              Home Internet customers may experience reduced speeds
              during times of network congestion when{" "}
              <em className="font-light italic text-[var(--accent)]">
                higher-priority mobile traffic
              </em>{" "}
              is using available capacity.
            </Pullquote>
          </Reveal>
        </Container>
      </Section>

      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="accent">FAQ</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              Fiber vs 5G home — common questions.
            </h2>
            <div className="mt-10">
              <FaqList items={faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
            </div>
          </Reveal>
        </Container>
      </Section>

      <JumpNav
        prev={{ href: "/fiber-vs-satellite", label: "Fiber vs satellite" }}
        next={{ href: "/is-fiber-worth-it", label: "Is fiber worth it?" }}
      />
    </>
  );
}
