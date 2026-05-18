import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { ModeText } from "@/components/ui/mode-text";
import { Pullquote } from "@/components/ui/pullquote";
import { SpecCard } from "@/components/ui/spec-card";
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
  title: "How Fiber Internet Works: Light, Glass & Lasers Explained",
  description:
    "Fiber internet works by sending data as pulses of light through ultra-thin glass strands. Here's the full mechanism — laser, core, total internal reflection, GPON tree, ONT — in plain English and at the spec level.",
  path: "/how-fiber-works",
});

const faqs = [
  {
    q: "How does fiber internet work in simple terms?",
    a: "Fiber internet works by sending data as pulses of light through ultra-thin glass strands. A laser flashes on and off billions of times per second; a photodetector at the other end translates those flashes back into the 1s and 0s your devices use. Because light travels through fiber at roughly two-thirds the speed of light in vacuum — and barely loses signal over distance — fiber delivers symmetric multi-gigabit speeds with single-digit-millisecond latency.",
  },
  {
    q: "What is fiber optic cable made of?",
    a: "A telecom fiber strand has two parts of nearly pure silica glass: a central core about 9 micrometers across (single-mode fiber) and a 125 µm cladding around it with a slightly lower refractive index. Around that is a protective coating, a buffer tube, strength members like aramid yarn, and an outer jacket. The glass itself is the part that carries the light.",
  },
  {
    q: "How fast does light travel through fiber?",
    a: "About 200,000 km/s — roughly two-thirds the speed of light in vacuum (299,792 km/s). The slowdown comes from light interacting with the glass; engineers call the ratio the refractive index, and for single-mode silica it's about 1.467. The fiber itself is the fastest part of the whole internet — everything else is queuing and routing.",
  },
  {
    q: "What is total internal reflection?",
    a: "When light hits the boundary between two materials at a shallow enough angle and the second material has a lower refractive index, all of the light bounces back into the first material instead of escaping. Fiber's core has a slightly higher index than its cladding, so light injected at the right angle bounces down the core and never leaks out — even around bends.",
  },
  {
    q: "What is a PON (passive optical network)?",
    a: "A passive optical network is a fiber architecture where everything between the ISP's central office and your home runs on glass with zero powered components. A single fiber from the central office reaches a passive splitter — a piece of fused glass that broadcasts the light to up to 32 or 64 homes — and each home gets its own ONT to terminate the connection.",
  },
  {
    q: "What is GPON vs XGS-PON?",
    a: "Both are passive-optical-network standards from the ITU-T. GPON (G.984) delivers 2.488 Gbps downstream and 1.244 Gbps upstream, shared across a tree of up to 32 or 64 homes. XGS-PON (G.9807.1) is the modern replacement: 10 Gbps symmetric, using different wavelengths so it can ride the same fiber and splitters as legacy GPON.",
  },
  {
    q: "Why is fiber immune to electromagnetic interference?",
    a: "Fiber carries light, not electricity. It doesn't act as an antenna, can't pick up RF noise from nearby wires or AM transmitters, and is dielectric — so it doesn't conduct surges from lightning. That's why fiber outside plant is far more reliable than coax in storms, near power lines, or anywhere with serious EMI.",
  },
  {
    q: "How long can a single fiber run before the signal weakens?",
    a: "Modern single-mode fiber loses about 0.20 dB of signal per kilometer at 1550 nm — astonishingly little. Without amplification, a passive PON tree comfortably reaches 20 km logical distance, and extended-reach designs hit 60 km. Long-haul backbone fiber uses erbium-doped amplifiers (EDFAs) every 60–100 km to keep light strong enough to cross oceans.",
  },
];

export default function HowFiberWorks() {
  const path = "/how-fiber-works";
  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          title: "How Fiber Internet Works",
          description: metadata.description as string,
          path,
        })}
      />
      <JsonLd data={buildFaqSchema(faqs.map((f) => ({ q: f.q, a: f.a })))} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "How fiber works", path },
        ])}
      />

      <Section tone="default" className="pt-[calc(var(--nav-h)+72px)]">
        <Container>
          <Breadcrumb
            trail={[
              { name: "Home", path: "/" },
              { name: "How fiber works", path },
            ]}
          />
          <SectionLabel tone="accent">Explain · Pillar</SectionLabel>
          <h1 className="display mt-4 max-w-[18ch] text-balance text-[clamp(40px,7vw,80px)] font-medium leading-[1.02] text-[var(--fg)]">
            How fiber internet{" "}
            <em className="font-light italic text-[var(--accent)]">
              actually
            </em>{" "}
            works.
          </h1>
          <p className="mt-7 max-w-[62ch] text-[19px] leading-[1.65] text-[var(--fg-muted)]">
            Fiber internet works by sending data as pulses of light through
            hair-thin glass strands. A laser flashes on and off billions of
            times per second; a receiver at the other end translates those
            flashes back into the 1s and 0s your devices use. Because light
            barely loses energy moving through glass, fiber delivers symmetric
            1–10 Gbps speeds with single-digit-millisecond latency over the
            same wire for decades.
          </p>
        </Container>
      </Section>

      {/* ── PART 1: THE GLASS ── */}
      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1.3fr_1fr] md:gap-16">
            <Reveal>
              <SectionLabel tone="accent">01 · The glass</SectionLabel>
              <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
                A strand of glass thinner than a human hair, carrying light
                that won&apos;t let go of it.
              </h2>
              <div className="mt-6 max-w-[60ch] space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
                <ModeText
                  reader={
                    <>
                      <p>
                        The cable that brings fiber to your house is mostly
                        empty space. The part doing the work is a strand of
                        ultra-pure silica glass — about{" "}
                        <em className="not-italic font-medium text-[var(--fg)]">
                          9 micrometers across at the center
                        </em>
                        , one-tenth the width of a human hair.
                      </p>
                      <p>
                        Around it is another layer of slightly different
                        glass. The two materials bend light differently, and
                        that mismatch is what keeps the light trapped inside
                        the strand. Hit the boundary at a shallow enough
                        angle and the light bounces back — every time,
                        forever — even when the fiber wraps around a corner.
                      </p>
                      <p>
                        Physicists call this <em>total internal reflection</em>.
                        It&apos;s the same trick that makes water look silvery
                        when you look at it from underneath, and it&apos;s the
                        only reason any of this works.
                      </p>
                    </>
                  }
                  engineer={
                    <>
                      <p>
                        Telecom-grade fiber is ITU-T G.652.D single-mode
                        fiber: 9 µm mode-field diameter at 1310 nm, 125 µm
                        cladding, refractive index ~1.467. Attenuation is
                        roughly 0.35 dB/km at 1310 nm and 0.20 dB/km at 1550
                        nm.
                      </p>
                      <p>
                        Total internal reflection is enforced by the
                        core-to-cladding index step (Δn ≈ 0.005). Light is
                        launched within the fiber&apos;s numerical aperture
                        (NA ≈ 0.14) and propagates in a single transverse
                        mode at the operating wavelength. Dispersion is
                        controlled per G.652.D specs to enable 10 G+ over 80
                        km without compensation.
                      </p>
                      <p>
                        Bend-insensitive variants (G.657.A2) keep loss low
                        through 10 mm radius bends, which is what makes
                        in-home drop cables survive being stapled around
                        baseboards.
                      </p>
                    </>
                  }
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <SpecCard
                title="Single-mode fiber"
                tone="accent"
                rows={[
                  ["Standard", "ITU-T G.652.D"],
                  ["Core diameter", "9 µm"],
                  ["Cladding diameter", "125 µm"],
                  ["Refractive index", "≈ 1.467"],
                  ["Attenuation @ 1310 nm", "0.35 dB/km"],
                  ["Attenuation @ 1550 nm", "0.20 dB/km"],
                  ["Numerical aperture", "≈ 0.14"],
                  ["Bend radius (G.657.A2)", "≥ 10 mm"],
                ]}
                caption="The glass is purer than drinking water. A 1 km length transmitted side-on would still let you see a flashlight."
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── PART 2: THE LIGHT ── */}
      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
            <Reveal>
              <SpecCard
                title="GPON & XGS-PON wavelengths"
                tone="live"
                rows={[
                  ["GPON downstream", "1490 nm"],
                  ["GPON upstream", "1310 nm"],
                  ["GPON max rate", "2.488 / 1.244 Gbps"],
                  ["XGS-PON downstream", "1577 nm"],
                  ["XGS-PON upstream", "1270 nm"],
                  ["XGS-PON max rate", "10 / 10 Gbps"],
                  ["RF video overlay", "1550 nm (optional)"],
                  ["Modulation", "NRZ-OOK"],
                ]}
                caption="GPON and XGS-PON live on the same glass — the wavelengths don't fight."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <SectionLabel tone="live">02 · The light</SectionLabel>
              <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
                Lasers flashing billions of times a second.
              </h2>
              <div className="mt-6 max-w-[60ch] space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
                <ModeText
                  reader={
                    <>
                      <p>
                        Light from a tiny semiconductor laser shoots into the
                        glass at a wavelength your eyes can&apos;t see —
                        deep infrared. The laser blinks on and off in a
                        pattern that encodes your data. A flash means 1; the
                        gap means 0. Billions of those flashes go down the
                        fiber every second.
                      </p>
                      <p>
                        Different colors of light don&apos;t interfere with
                        each other, so the network can run downstream traffic
                        on one color (1490 nanometers, for GPON) and your
                        upstream traffic on another (1310 nm) over the same
                        single strand. Newer fiber service — XGS-PON — uses
                        different colors still (1577 / 1270 nm), so it can
                        coexist on the same glass without disturbing the
                        older signal.
                      </p>
                    </>
                  }
                  engineer={
                    <>
                      <p>
                        Subscriber-side optics use directly-modulated DFB
                        lasers at the upstream wavelength (1310 / 1270 nm)
                        with NRZ on-off keying. OLT-side optics are typically
                        externally-modulated for the higher downstream rate.
                        XGS-PON adds Reed-Solomon FEC (RS(248,216) /
                        RS(248,232)) on top of NRZ-OOK to claw back the link
                        budget.
                      </p>
                      <p>
                        Wavelength-division multiplexing on the access plant
                        is coarse: GPON and XGS-PON channels are separated
                        by &gt;80 nm and ride together via WDM1r filters in
                        the ONT and OLT optics. RF video at 1550 nm can ride
                        alongside as a separate overlay.
                      </p>
                      <p>
                        Class B+ receivers spec −28 dBm sensitivity (BER
                        10⁻¹⁰), giving a 28 dB optical power budget. A 1:32
                        PLC split eats ~17 dB; fiber attenuation across 20
                        km of 1310 nm eats ~7 dB; the remaining margin
                        absorbs connectors, splices, and aging.
                      </p>
                    </>
                  }
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── PART 3: THE TREE ── */}
      <Section tone="deep" wipe className="border-t border-[var(--border-hairline)]">
        <Container>
          <Reveal>
            <SectionLabel tone="edge">03 · The tree</SectionLabel>
            <h2 className="display mt-4 max-w-[22ch] text-[clamp(28px,4vw,48px)] font-medium leading-[1.08] text-[var(--fg)]">
              One fiber from the central office, shared by 32 homes — with
              zero powered hardware in between.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16">
            <Reveal>
              <div className="max-w-[60ch] space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
                <ModeText
                  reader={
                    <>
                      <p>
                        Your ISP doesn&apos;t run a separate fiber from their
                        building to every house on your street. That would
                        be insanely expensive. Instead, one fiber arrives at
                        a cabinet on your block and gets split into 32 (or
                        64) identical copies of the same light, using a
                        small piece of fused glass shaped just so.
                      </p>
                      <p>
                        The splitter has no power, no fans, no moving parts.
                        It could sit in that cabinet for thirty years
                        without anyone touching it. Every house on the
                        branch receives the same downstream signal at the
                        same instant — and a tiny key on each box is the
                        only thing that lets <em>your</em> box decrypt only{" "}
                        <em>your</em> data.
                      </p>
                      <p>
                        Going the other direction is harder. Thirty-two
                        homes can&apos;t all transmit on the same fiber at
                        once or their signals would smash into each other.
                        So the central office hands out precise time slots —
                        you transmit during your slot, your neighbor during
                        theirs, microseconds apart, never overlapping.
                      </p>
                    </>
                  }
                  engineer={
                    <>
                      <p>
                        Passive optical distribution: 1×N planar
                        lightwave-circuit (PLC) splitters at typical ratios
                        of 1:32 (≈17.3 dB insertion loss) or 1:64 (≈20.5
                        dB). Outside plant is fully passive; there are no
                        powered components between OLT and ONT, which is the
                        structural reason fiber OSP has &gt;25-year MTBF.
                      </p>
                      <p>
                        Downstream is broadcast on a single wavelength.
                        ONTs decrypt only their assigned GEM ports under
                        AES-128 in CTR mode — every ONT sees every frame but
                        cryptographically discards everyone else&apos;s.
                      </p>
                      <p>
                        Upstream is TDMA. The OLT runs ranging procedures
                        (SN grants on the PON) to measure equalization delay
                        per ONT — compensating for differential fiber
                        distance up to the 20 km logical-reach limit — then
                        issues T-CONT grants that schedule each ONT into a
                        non-overlapping time slot.
                      </p>
                      <p>
                        Class B+ 28 dB / Class C+ 32 dB / N1/E1 extended
                        budgets define how aggressively you can split or
                        extend the reach. Common build: 1×4 at the CO + 1×8
                        in the field for a 1:32 total split.
                      </p>
                    </>
                  }
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <SpecCard
                title="GPON tree economics"
                tone="edge"
                rows={[
                  ["Typical split", "1:32"],
                  ["Power budget (Class B+)", "28 dB"],
                  ["Insertion loss @ 1:32", "≈ 17 dB"],
                  ["Fiber loss budget left", "≈ 11 dB"],
                  ["Logical reach", "20 km"],
                  ["Extended reach (Class C+)", "60 km"],
                  ["Downstream model", "Broadcast → AES-128"],
                  ["Upstream model", "TDMA, OLT-scheduled"],
                ]}
                caption="One fiber out of the CO, up to 64 ONTs hanging off it, zero amplifiers between."
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── PULL QUOTE ── */}
      <Section tone="default" className="py-28">
        <Container size="narrow">
          <Reveal>
            <Pullquote source="ITU-T G.984.1, §6.1">
              The optical distribution network is passive — there are no
              active elements between the OLT and the ONUs. This is{" "}
              <em className="font-light italic text-[var(--accent)]">
                the whole reason
              </em>{" "}
              the fiber outside plant is essentially indestructible.
            </Pullquote>
          </Reveal>
        </Container>
      </Section>

      {/* ── PART 4: AT YOUR HOME ── */}
      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container>
          <Reveal>
            <SectionLabel tone="warn">04 · At your house</SectionLabel>
            <h2 className="display mt-4 max-w-[22ch] text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              The light hits a small white box. It becomes Ethernet.
            </h2>
            <div className="mt-6 max-w-[62ch] text-[16px] leading-[1.75] text-[var(--fg-muted)]">
              <ModeText
                reader={
                  <>
                    The fiber from the street enters your house, lands on a
                    small white box (the ONT — Optical Network Terminal),
                    and a photodetector inside turns those infrared flashes
                    into electrical pulses. Out the other side runs an
                    Ethernet cable, which plugs into your router, which
                    runs your Wi-Fi.
                  </>
                }
                engineer={
                  <>
                    The ONT performs O/E/O conversion at the demarc — a
                    PIN-TIA front end at the rated wavelengths, MAC/PHY for
                    GEM decapsulation, then an RJ-45 or SFP+ hand-off into
                    the residential gateway. Authentication is via serial
                    number plus optional 802.1X. Power is typically &lt;12
                    W from the line-power adapter; battery backup is sold
                    as an option but rarely deployed.
                  </>
                }
              />
            </div>
            <p className="mt-5 max-w-[62ch] text-[16px] leading-[1.75] text-[var(--fg-muted)]">
              We pulled the ONT apart in more detail on{" "}
              <a
                href="/inside-your-home"
                className="text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]"
              >
                Inside your home
              </a>
              .
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ── FAQ ── */}
      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="accent">FAQ</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              How fiber works — questions people actually search.
            </h2>
            <div className="mt-10">
              <FaqList items={faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
            </div>
          </Reveal>
        </Container>
      </Section>

      <JumpNav
        prev={{ href: "/", label: "Back to the journey overview" }}
        next={{ href: "/inside-your-home", label: "Inside your home" }}
      />
    </>
  );
}
