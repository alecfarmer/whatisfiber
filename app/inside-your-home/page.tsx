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
  title: "Fiber Inside Your Home: ONT, Router & Drop Cable Explained",
  description:
    "The ONT converts fiber light pulses into Ethernet your router can use. Here's the full setup inside a fiber home — ONT vs modem, drop cable, what each box actually does, and what to plug in where.",
  path: "/inside-your-home",
});

const faqs = [
  {
    q: "What is an ONT?",
    a: "ONT stands for Optical Network Terminal. It's the small box on your wall (or in your closet) where the fiber from outside terminates. Inside, a photodetector converts the infrared light pulses arriving on the fiber into electrical signals, and a small laser sends your upstream traffic the other way. The ONT hands you a standard Ethernet port — which is what your router plugs into.",
  },
  {
    q: "Is an ONT the same as a modem?",
    a: "No. A modem (modulator-demodulator) modulates a digital signal onto an analog carrier — like RF on coax, or DMT tones on a copper phone pair — and demodulates the return. An ONT does direct optical-to-electrical conversion; there's no analog carrier in between. They serve a similar role at the demarc, but the technology is completely different.",
  },
  {
    q: "Do I need a special router for fiber?",
    a: "No. Any modern router with a gigabit (or multi-gigabit) WAN port will work — the ONT just hands you Ethernet. If you've subscribed to a 2+ Gbps tier, you'll want a router with a 2.5GbE or 10GbE WAN port to actually receive those speeds. Wi-Fi 6 or 7 helps if you have many devices, but neither is required to use fiber.",
  },
  {
    q: "Does fiber internet work in a power outage?",
    a: "The fiber itself keeps working — there are no powered components between the central office (which has generator backup) and your ONT. But the ONT needs AC power to run, and so does your router. Without a UPS or backup battery for both, your internet goes down with your power. Many ISPs sell an optional 8-hour battery backup that powers the ONT specifically.",
  },
  {
    q: "What is the fiber drop cable?",
    a: "The drop is the fiber that runs from the splitter cabinet on your street (or your apartment building's distribution box) to your home's external network interface, where it transitions into the indoor cable that reaches the ONT. Modern drop cable uses bend-insensitive single-mode fiber (G.657.A2) so it can be stapled around corners without losing signal.",
  },
  {
    q: "What is the connector at the end of the fiber?",
    a: "Most residential fiber uses an SC/APC connector — a square plastic body with a green-tipped ferrule. The APC (Angled Physical Contact) means the fiber end-face is polished at an 8° angle, which prevents reflected light from bouncing back into the laser and causing noise. Never touch the green tip; oils from your fingers will degrade the signal.",
  },
  {
    q: "Why is my Wi-Fi slow even though I have fiber?",
    a: "The fiber link to your ONT is almost never the bottleneck. Slow Wi-Fi at home is usually one of: an old router (replace anything pre-Wi-Fi 6), congested 2.4 GHz channels (force devices to 5 GHz), too few access points for the house (mesh helps), or a router placed inside a media cabinet (radio waves don't love metal). Try a wired speed test from a laptop plugged directly into the ONT — that'll show you the line speed without Wi-Fi noise.",
  },
  {
    q: "What does the red light on my ONT mean?",
    a: "It varies by manufacturer, but a steady red light on the LOS (Loss of Signal) indicator almost always means your fiber link is broken — most often a fiber cut somewhere outside the house. A blinking PON light during recovery is normal. Power-cycle the ONT first; if the red light persists, call your ISP and tell them the LOS indicator is solid red — that gets you a truck roll faster.",
  },
];

export default function InsideYourHome() {
  const path = "/inside-your-home";
  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          title: "Fiber Inside Your Home",
          description: metadata.description as string,
          path,
        })}
      />
      <JsonLd data={buildFaqSchema(faqs.map((f) => ({ q: f.q, a: f.a })))} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Inside your home", path },
        ])}
      />

      <Section tone="default" className="pt-[calc(var(--nav-h)+72px)]">
        <Container>
          <Breadcrumb
            trail={[
              { name: "Home", path: "/" },
              { name: "Inside your home", path },
            ]}
          />
          <SectionLabel tone="accent">Explain · Spoke</SectionLabel>
          <h1 className="display mt-4 max-w-[22ch] text-balance text-[clamp(40px,7vw,76px)] font-medium leading-[1.04] text-[var(--fg)]">
            The little white box on your wall is doing{" "}
            <em className="font-light italic text-[var(--accent)]">
              something wild.
            </em>
          </h1>
          <p className="mt-7 max-w-[64ch] text-[19px] leading-[1.65] text-[var(--fg-muted)]">
            A laser flashes a strand of glass thinner than a hair. Two
            hundred milliwatts of infrared light arrive at your wall as your
            cat video. A photodetector translates it back into voltage. A
            standard Ethernet cable hands it to your router. The whole thing
            takes microseconds and the only sound you hear is the fan in
            your router.
          </p>
        </Container>
      </Section>

      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-16">
            <Reveal>
              <SectionLabel tone="accent">The ONT</SectionLabel>
              <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
                Not a modem. An optical-to-electrical translator.
              </h2>
              <div className="mt-6 max-w-[60ch] space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
                <ModeText
                  reader={
                    <>
                      <p>
                        Most people call any internet appliance a
                        &ldquo;modem.&rdquo; The ONT really isn&apos;t. A
                        modem takes digital data and shapes it onto an
                        analog carrier — radio waves on coax, audio tones
                        on phone copper. An ONT skips the analog carrier
                        entirely: it just turns flashes of light into pulses
                        of voltage and back.
                      </p>
                      <p>
                        On the inside there are two small optical parts.
                        The <em>photodetector</em> watches the fiber for
                        downstream light and converts every flash into a
                        tiny current spike. A <em>laser diode</em> sits
                        next to it, pointed back into the fiber, ready to
                        send your upstream data when its turn comes around.
                        Surround that with some chips that handle the
                        protocol housekeeping and Ethernet on the way out,
                        and that&apos;s most of an ONT.
                      </p>
                    </>
                  }
                  engineer={
                    <>
                      <p>
                        ONT internals: a triplexer or diplexer SFP-style
                        optical subassembly handles the upstream DFB laser
                        (1310 / 1270 nm depending on PON flavor) and the
                        downstream PIN-TIA receiver. After the receiver, an
                        ASIC handles GPON or XGS-PON MAC/PHY: scrambling,
                        FEC (RS(248,248) for GPON, RS(248,216) for XGS-PON
                        downstream), GEM encapsulation/decapsulation, and
                        AES-128-CTR decryption on the subscriber&apos;s
                        assigned GEM ports.
                      </p>
                      <p>
                        Provisioning is done over OMCI (Optical Network Unit
                        Management and Control Interface, ITU-T G.988) — a
                        management plane that lets the OLT remotely set
                        T-CONTs, configure GEM ports, push firmware, and
                        monitor optical Rx/Tx levels. Most ISP truck rolls
                        for &ldquo;slow internet&rdquo; end with a
                        technician reading the ONT&apos;s OMCI-reported Rx
                        power and concluding the splice tray needs cleaning.
                      </p>
                    </>
                  }
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <SpecCard
                title="Typical residential ONT"
                tone="accent"
                rows={[
                  ["Form factor", "Wall-mount, paperback-sized"],
                  ["Power draw", "8–12 W"],
                  ["WAN connector", "SC/APC fiber"],
                  ["LAN ports", "1× 1/2.5/10 GbE"],
                  ["Standards", "GPON, XGS-PON"],
                  ["Authentication", "Serial number + optional 802.1X"],
                  ["Encryption (DS)", "AES-128-CTR"],
                  ["Management", "OMCI (ITU-T G.988)"],
                  ["Battery backup", "Optional 8-hr add-on"],
                ]}
                caption="Some ISPs combine the ONT and router into one unit; treat it as two devices in one box."
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── DROP ── */}
      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
            <Reveal>
              <SpecCard
                title="The drop cable"
                tone="live"
                rows={[
                  ["Outside plant fiber", "G.652.D single-mode"],
                  ["Drop fiber", "G.657.A2 bend-insensitive"],
                  ["Bend radius", "≥ 10 mm"],
                  ["Typical length", "50–300 ft"],
                  ["Connector at ONT", "SC/APC (green tip)"],
                  ["Polish angle", "8° APC"],
                  ["Aerial / buried", "Both common"],
                  ["Lifetime", "25+ years"],
                ]}
                caption="Don't touch the green tip. Don't kink it. Don't staple it tight enough to deform the buffer tube."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <SectionLabel tone="live">The drop</SectionLabel>
              <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
                A glass cable that survives being stapled.
              </h2>
              <div className="mt-6 max-w-[60ch] space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
                <ModeText
                  reader={
                    <>
                      <p>
                        Older fiber would lose signal if you bent it too
                        tight. The drop cables ISPs run into homes today are
                        a different beast — bend-insensitive fiber that
                        keeps the light trapped inside even when wrapped
                        around something the size of a dime.
                      </p>
                      <p>
                        That&apos;s what lets an installer pull a fiber
                        through a wall, around three corners, and behind
                        your TV without measurable loss. The cable itself
                        is rated for 25 years in the ground. The only
                        thing&apos;s that&apos;s likely to break it is a
                        backhoe.
                      </p>
                    </>
                  }
                  engineer={
                    <>
                      <p>
                        Drop cable: ITU-T G.657.A2-rated single-mode fiber
                        with a 10 mm minimum bend radius and ≤0.4 dB
                        attenuation increase per turn at 10 mm. Outdoor
                        drops are typically 1-fiber 900 µm tight-buffered
                        in figure-8 messenger or low-friction blown-fiber
                        sheath.
                      </p>
                      <p>
                        The ONT-side termination is SC/APC: an 8° angled
                        polish reduces return loss to better than −60 dB
                        and prevents reflected light from causing laser
                        relaxation oscillations. Field cleaning before
                        every insertion is critical — particulate on an
                        APC connector can add 1–3 dB of loss invisibly.
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
      <Section tone="deep" className="py-28">
        <Container size="narrow">
          <Reveal>
            <Pullquote source="Every fiber technician">
              If your fiber is slow, the answer is almost always{" "}
              <em className="font-light italic text-[var(--accent)]">
                clean the connector.
              </em>
            </Pullquote>
          </Reveal>
        </Container>
      </Section>

      {/* ── THE ROUTER ── */}
      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <SectionLabel tone="edge">The router</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              This is where most &ldquo;slow internet&rdquo; lives.
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
              <ModeText
                reader={
                  <>
                    <p>
                      You paid for a gigabit. Your speedtest says 180 Mbps
                      over Wi-Fi. Your router is the bottleneck — almost
                      certainly. A few fixes that actually work, in
                      descending order of impact:
                    </p>
                    <ul className="ml-5 list-disc space-y-2 marker:text-[var(--accent)]">
                      <li>
                        Plug a laptop into the ONT&apos;s Ethernet port and
                        test from there. If <em>that</em> is fast, the
                        problem is downstream of the router.
                      </li>
                      <li>
                        Replace any router older than Wi-Fi 6. Wi-Fi 5
                        radios cannot move a gigabit through a typical
                        house.
                      </li>
                      <li>
                        Take the router out of the cabinet, out of the
                        basement closet, out of the metal media bay.
                        Radios need air and line-of-sight.
                      </li>
                      <li>
                        Add a mesh node for any room more than one wall
                        away.
                      </li>
                      <li>
                        Force phones and laptops onto the 5 GHz band; 2.4
                        GHz is congested by everything from microwaves to
                        garage-door openers.
                      </li>
                    </ul>
                  </>
                }
                engineer={
                  <>
                    <p>
                      A few honest facts about residential routers:
                    </p>
                    <ul className="ml-5 list-disc space-y-2 marker:text-[var(--accent)]">
                      <li>
                        Wi-Fi 6 (802.11ax) PHY rates are theoretical. A
                        Wi-Fi 6 client sustaining a real 1 Gbps to AP is
                        unusual; 400–700 Mbps is typical at 5 GHz, 1 m,
                        no contention.
                      </li>
                      <li>
                        Wi-Fi 7 (802.11be) MLO with 6 GHz is the first
                        wireless standard where multi-gig home plans
                        consistently make sense end-to-end — but only with
                        6 GHz-capable clients, of which there are few.
                      </li>
                      <li>
                        On 2.5 / 10 GbE WAN ports: check both the ONT and
                        the router. ISP-provided gateways with 1 GbE WAN
                        ports will cap a 2 Gbps fiber plan at 1 Gbps no
                        matter what the optics deliver.
                      </li>
                      <li>
                        ISP CGNAT breaks inbound — VPN servers, game
                        hosting, port forwarding all silently fail. Most
                        fiber ISPs offer public IPv4 (or full IPv6 + PD)
                        on request.
                      </li>
                    </ul>
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
            <SectionLabel tone="accent">FAQ</SectionLabel>
            <h2 className="display mt-4 text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] text-[var(--fg)]">
              Inside-your-home questions, answered.
            </h2>
            <div className="mt-10">
              <FaqList items={faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
            </div>
          </Reveal>
        </Container>
      </Section>

      <JumpNav
        prev={{ href: "/how-fiber-works", label: "How fiber works" }}
        next={{
          href: "/the-internet-backbone",
          label: "The internet backbone",
        }}
      />
    </>
  );
}
