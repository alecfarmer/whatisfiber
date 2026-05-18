import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { ModeText } from "@/components/ui/mode-text";
import { Pullquote } from "@/components/ui/pullquote";
import { SpecCard } from "@/components/ui/spec-card";
import { Stat } from "@/components/ui/stat";
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
  title: "The Internet Backbone: BGP, IXPs & Submarine Cables Explained",
  description:
    "The internet backbone is the global mesh of fiber, peering points, and routing agreements that move your packets across continents. Here's how it works — and why nobody actually owns it.",
  path: "/the-internet-backbone",
});

const faqs = [
  {
    q: "What is the internet backbone?",
    a: "The internet backbone is the network of long-haul fiber, peering exchanges, and high-capacity routers that interconnect roughly 80,000 separate networks worldwide. It's not owned by anyone single entity — it's the cumulative result of every major ISP, hyperscaler, and tier-1 carrier agreeing (and contracting) to forward each other's traffic.",
  },
  {
    q: "What is BGP?",
    a: "BGP — the Border Gateway Protocol — is how networks tell each other which IP addresses they can reach. Each network announces its prefixes (IP ranges) to its neighbors; those neighbors propagate the announcements outward; eventually every BGP-speaking router on Earth has a path back to you. There's no central authority. It's just announcements all the way down.",
  },
  {
    q: "What is an Autonomous System (AS)?",
    a: "An Autonomous System is a network with its own external routing policy — usually an ISP, a content provider, or a large enterprise. Each AS has a globally-unique number (e.g., Google is AS15169, Cloudflare is AS13335). When you trace a route across the internet, you're really tracing a path through ASes.",
  },
  {
    q: "What is an Internet Exchange Point (IXP)?",
    a: "An IXP is a physical building where many networks bring their cables to meet and swap traffic with each other directly, instead of routing through paid upstream carriers. The largest exchanges (DE-CIX Frankfurt, AMS-IX Amsterdam, LINX London, Equinix Ashburn) carry terabits per second across thousands of cross-connects. Peering at an IXP is usually free or near-free between participants — it's a settlement-free agreement.",
  },
  {
    q: "What is the difference between transit and peering?",
    a: "Transit is when a smaller network pays a larger one to deliver traffic to anyone, anywhere on the internet. Peering is when two networks of comparable size agree to deliver each other's traffic for free, on the theory that the value is mutual. Most large ISPs run a mix: paid transit to a tier-1 carrier as a safety net, plus extensive free peering at IXPs to keep transit bills small.",
  },
  {
    q: "What is a tier-1 network?",
    a: "A tier-1 network is one that can reach every other network on the internet without paying anyone for transit. They exchange traffic with each other through settlement-free peering. There are only a handful: Lumen (formerly CenturyLink/Level 3), AT&T, NTT, Telia, Tata, Cogent, Verizon, and a few others, depending on who's counting.",
  },
  {
    q: "How many submarine cables are there?",
    a: "About 552 active submarine cables as of 2025, carrying roughly 99% of intercontinental internet traffic. The cables themselves are about as thick as a garden hose, contain 8–24 pairs of fiber each, and are laid by specialized cable-laying ships over months. Newer cables increasingly belong directly to Google, Meta, Microsoft, and Amazon — the hyperscalers now operate their own private subsea infrastructure.",
  },
  {
    q: "How fast does data travel across the backbone?",
    a: "Light in fiber moves at roughly 200,000 km/s (two-thirds the speed of light in vacuum). New York to London is about 5,500 km of fiber, so the one-way speed-of-light minimum is about 28 ms; in practice, transatlantic round-trip latency is 70–90 ms after routing, queuing, and protocol overhead. The fiber is the fastest part — every router along the way adds microseconds.",
  },
  {
    q: "Can sharks bite submarine cables?",
    a: "Yes, but rarely the cause of outages. The vast majority of submarine cable damage comes from fishing trawlers, anchors, and underwater landslides. Sharks have famously bitten cables — Google even armored some of theirs after viral footage in 2014 — but it's a small fraction of total faults. Repair ships handle 100+ subsea cable faults globally every year.",
  },
];

export default function Backbone() {
  const path = "/the-internet-backbone";
  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          title: "The Internet Backbone",
          description: metadata.description as string,
          path,
        })}
      />
      <JsonLd data={buildFaqSchema(faqs.map((f) => ({ q: f.q, a: f.a })))} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "The internet backbone", path },
        ])}
      />

      <Section tone="default" className="pt-[calc(var(--nav-h)+72px)]">
        <Container>
          <Breadcrumb
            trail={[
              { name: "Home", path: "/" },
              { name: "The internet backbone", path },
            ]}
          />
          <SectionLabel tone="edge">Explain · Spoke</SectionLabel>
          <h1 className="display mt-4 max-w-[22ch] text-balance text-[clamp(40px,7vw,80px)] font-medium leading-[1.02] text-[var(--fg)]">
            Nobody owns{" "}
            <em className="font-light italic text-[var(--accent)]">
              the internet.
            </em>{" "}
            It is an agreement.
          </h1>
          <p className="mt-7 max-w-[64ch] text-[19px] leading-[1.65] text-[var(--fg-muted)]">
            Roughly 80,000 separate networks — ISPs, tech companies,
            universities, governments — agreed to forward each other&apos;s
            traffic. There is no central router and no central database.
            Each network announces which addresses it can reach; every other
            network listens, remembers, and figures out the best path. The
            whole thing works through trust and BGP.
          </p>
        </Container>
      </Section>

      {/* ── BGP ── */}
      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1.3fr_1fr] md:gap-16">
            <Reveal>
              <SectionLabel tone="edge">01 · BGP</SectionLabel>
              <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
                The protocol holding it all together is mostly announcements
                and reputation.
              </h2>
              <div className="mt-6 max-w-[60ch] space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
                <ModeText
                  reader={
                    <>
                      <p>
                        Imagine every network on Earth shouting into a
                        global PA system, on repeat:{" "}
                        <em>&ldquo;I can deliver mail to ZIP codes 10001
                        through 10099.&rdquo;</em> Every other network
                        listens, writes it down, and remembers the path
                        the announcement took. When you send a packet, the
                        nearest network looks up which path is shortest and
                        forwards it that way.
                      </p>
                      <p>
                        That&apos;s essentially how BGP works — except
                        instead of ZIP codes it&apos;s IP prefixes, and
                        instead of mail trucks the path is a list of
                        intermediate networks. The whole internet is held
                        together by these announcements, billions of them
                        per day, between roughly 80,000 networks.
                      </p>
                    </>
                  }
                  engineer={
                    <>
                      <p>
                        BGP-4 (RFC 4271) is a path-vector protocol carrying
                        roughly 950k IPv4 prefixes and 200k IPv6 prefixes
                        across the DFZ as of 2026. Each prefix advertisement
                        carries an AS_PATH — the sequence of autonomous
                        systems it traversed — plus a stack of attributes
                        (LOCAL_PREF, MED, communities, origin).
                      </p>
                      <p>
                        Path selection — best-path algorithm, simplified —
                        runs in this order: weight → highest LOCAL_PREF →
                        locally-originated → shortest AS_PATH → lowest
                        origin type → lowest MED → eBGP over iBGP → lowest
                        IGP cost to next-hop → lowest router-ID tiebreak.
                        Operators use BGP communities for fine-grained
                        outbound traffic engineering.
                      </p>
                      <p>
                        Security is bolted on. RPKI Origin Validation (ROV)
                        gates which ASes are allowed to originate which
                        prefixes, defending against accidental and
                        deliberate prefix hijacks. RFC 8205 (BGPsec) adds
                        path validation but adoption is minimal.
                      </p>
                    </>
                  }
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <SpecCard
                title="BGP at a glance"
                tone="edge"
                rows={[
                  ["Standard", "RFC 4271 (BGP-4)"],
                  ["Transport", "TCP/179"],
                  ["IPv4 prefixes in DFZ", "≈ 950,000"],
                  ["IPv6 prefixes in DFZ", "≈ 200,000"],
                  ["Active ASes", "≈ 80,000+"],
                  ["Path selection", "AS_PATH, LOCAL_PREF, MED"],
                  ["Security overlay", "RPKI ROA + ROV"],
                  ["Convergence after major change", "1–10 min globally"],
                ]}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── PEERING ── */}
      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container>
          <Reveal>
            <SectionLabel tone="live">02 · Peering & IXPs</SectionLabel>
            <h2 className="display mt-4 max-w-[22ch] text-[clamp(28px,4vw,48px)] font-medium leading-[1.08] text-[var(--fg)]">
              The handshakes that turn 80,000 networks into one network.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Reveal>
              <div className="rounded-[20px] border border-[var(--border-soft)] bg-[var(--ink-raised)] p-6">
                <div className="mono mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--status-live)]">
                  Transit
                </div>
                <h3 className="display text-[20px] font-medium text-[var(--fg)]">
                  Paid upstream
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--fg-muted)]">
                  A smaller network buys access to <em>everywhere</em> from a
                  larger one. Full routing table; about $0.30–$2 per Mbps
                  committed in 2026. Typical providers: Lumen, Cogent, NTT,
                  Tata, GTT.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="rounded-[20px] border border-[var(--border-soft)] bg-[var(--ink-raised)] p-6">
                <div className="mono mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--status-edge)]">
                  Peering
                </div>
                <h3 className="display text-[20px] font-medium text-[var(--fg)]">
                  Settlement-free swap
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--fg-muted)]">
                  Two networks agree to deliver each other&apos;s traffic
                  for free at an Internet Exchange (DE-CIX, AMS-IX, LINX,
                  Equinix). Filters via IRR and RPKI. Cheap, low-latency,
                  the workhorse of the modern internet.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-[20px] border border-[var(--border-soft)] bg-[var(--ink-raised)] p-6">
                <div className="mono mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--status-warn)]">
                  PNI
                </div>
                <h3 className="display text-[20px] font-medium text-[var(--fg)]">
                  Private interconnect
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--fg-muted)]">
                  A dedicated cross-connect between an ISP and a
                  hyperscaler (Google, Meta, Amazon). 100GE+ handoffs.
                  Lowest latency, highest reliability, used for content
                  with serious volume.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── DWDM ── */}
      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
            <Reveal>
              <SpecCard
                title="DWDM long-haul transport"
                tone="warn"
                rows={[
                  ["Modulation", "PCS-64QAM (typical)"],
                  ["Channels (C-band)", "96"],
                  ["Per-channel rate", "400G / 800G ZR+"],
                  ["Amplification", "EDFA every 80–100 km"],
                  ["FEC overhead", "≈ 25% (soft-decision)"],
                  ["Total per-fiber capacity", "~30–80 Tbps"],
                  ["Span length record", ">10,000 km transoceanic"],
                ]}
                caption="One pair of glass strands carries enough bandwidth for a country."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <SectionLabel tone="warn">03 · DWDM</SectionLabel>
              <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
                96 colors of light on a single fiber, each carrying 400 to
                800 gigabits per second.
              </h2>
              <div className="mt-6 max-w-[60ch] space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
                <ModeText
                  reader={
                    <>
                      <p>
                        On the long-haul fiber that carries packets between
                        cities, ISPs squeeze far more than one signal onto
                        each strand. Lasers tuned to ninety-six slightly
                        different wavelengths inject ninety-six streams of
                        data into the same fiber, each one a different
                        color of infrared. At the other end, prisms split
                        them back out.
                      </p>
                      <p>
                        Every hundred kilometers or so, a doped section of
                        fiber and a small pump laser boost all ninety-six
                        signals at once — without ever turning them back
                        into electricity. The light stays as light all the
                        way across the continent.
                      </p>
                    </>
                  }
                  engineer={
                    <>
                      <p>
                        Dense WDM in the C-band (1530–1565 nm) at 50 GHz
                        spacing fits 96 channels. Modern coherent optics
                        push 400G and 800G per lambda using probabilistic
                        constellation shaping (PCS-64QAM) with
                        soft-decision FEC overhead around 25%.
                      </p>
                      <p>
                        Erbium-doped fiber amplifiers (EDFAs) at 80–100 km
                        intervals amplify all wavelengths simultaneously
                        without O/E/O conversion. Raman pumps add hybrid
                        amplification on long ultra-low-loss spans.
                        Re-amplification (3R) is now reserved for spans
                        beyond 10,000 km.
                      </p>
                    </>
                  }
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── PULLQUOTE ── */}
      <Section tone="default" className="py-28">
        <Container size="narrow">
          <Reveal>
            <Pullquote source="Anyone who has read the IETF newsletter">
              The internet has no headquarters. No board of directors.{" "}
              <em className="font-light italic text-[var(--accent)]">
                No one is in charge.
              </em>{" "}
              It runs because the alternative is for it to stop.
            </Pullquote>
          </Reveal>
        </Container>
      </Section>

      {/* ── STATS ── */}
      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container>
          <Reveal>
            <SectionLabel tone="accent">By the numbers</SectionLabel>
            <h2 className="display mt-4 max-w-[22ch] text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              The backbone, in scale.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal>
              <Stat
                number={80_000}
                suffix="+"
                label="Active autonomous systems"
                tone="edge"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <Stat
                number={950_000}
                label="IPv4 prefixes in the DFZ"
                tone="accent"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <Stat
                number={552}
                suffix="+"
                label="Active submarine cables"
                tone="warn"
              />
            </Reveal>
            <Reveal delay={0.15}>
              <Stat
                number={80}
                suffix=" km"
                label="EDFA amplifier spacing"
                tone="live"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── FAQ ── */}
      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="accent">FAQ</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              Questions about how the backbone actually works.
            </h2>
            <div className="mt-10">
              <FaqList items={faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
            </div>
          </Reveal>
        </Container>
      </Section>

      <JumpNav
        prev={{ href: "/inside-your-home", label: "Inside your home" }}
        next={{ href: "/fiber-vs-cable", label: "Fiber vs cable" }}
      />
    </>
  );
}
