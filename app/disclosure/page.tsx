import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JumpNav } from "@/components/site/jump-nav";
import { site } from "@/lib/site";
import { pageMetadata, JsonLd, buildBreadcrumbSchema } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Affiliate Disclosure & Editorial Standards",
  description:
    "How What Is Fiber makes money, how we choose what to recommend, and what our independence guarantees mean in practice.",
  path: "/disclosure",
});

export default function Disclosure() {
  const path = "/disclosure";
  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Disclosure", path },
        ])}
      />

      <Section tone="default" className="pt-[calc(var(--nav-h)+72px)]">
        <Container size="narrow">
          <Breadcrumb
            trail={[
              { name: "Home", path: "/" },
              { name: "Disclosure", path },
            ]}
          />
          <SectionLabel tone="flag">Disclosure</SectionLabel>
          <h1 className="display mt-4 max-w-[22ch] text-balance text-[clamp(36px,6vw,64px)] font-medium leading-[1.04] text-[var(--fg)]">
            How we make money,{" "}
            <em className="font-light italic text-[var(--accent)]">
              honestly.
            </em>
          </h1>
          <p className="mt-7 max-w-[60ch] text-[18px] leading-[1.7] text-[var(--fg-muted)]">
            Some links on this site are affiliate links. If you sign up for
            an internet plan through one of them, we may earn a commission
            at no extra cost to you. Our recommendations are based on
            independent research — never on which company pays the most.
          </p>
        </Container>
      </Section>

      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <div className="space-y-10 text-[16px] leading-[1.75] text-[var(--fg-muted)]">
            <section>
              <h2 className="display mb-3 text-[22px] font-medium text-[var(--fg)]">
                What links earn us money?
              </h2>
              <p>
                On comparison pages and on the &ldquo;Find fiber at your
                address&rdquo; tool, the &ldquo;Check address&rdquo; button
                next to each provider is an affiliate link. If you click
                through and order service, the provider may pay us a small
                commission (typically $20–$100, depending on the provider
                and the plan).
              </p>
              <p className="mt-3">
                Links to definitions, glossary terms, the FCC, the Cleveland
                Clinic dietary-fiber redirect in the footer, and any other
                editorial citation are never affiliate links. They&apos;re
                just links.
              </p>
            </section>

            <section>
              <h2 className="display mb-3 text-[22px] font-medium text-[var(--fg)]">
                How do you decide what to recommend?
              </h2>
              <p>
                The same way we&apos;d advise a friend: fiber over cable
                wherever fiber is symmetric and priced reasonably; cable when
                fiber isn&apos;t available; 5G fixed wireless when the cell
                tower has room and the install cost is the right tradeoff;
                satellite (Starlink) for places where nothing terrestrial
                exists. The five-question wizard scores your household and
                routes you accordingly — without ever knowing or caring which
                providers pay us most.
              </p>
              <p className="mt-3">
                The provider list at each ZIP is hand-curated from public
                2026 footprint data (and, soon, the FCC Broadband Data
                Collection nationwide dataset). Speeds and pricing come from
                each provider&apos;s own public plan pages. We don&apos;t
                hide providers who don&apos;t pay us — they show up too.
              </p>
            </section>

            <section>
              <h2 className="display mb-3 text-[22px] font-medium text-[var(--fg)]">
                What we won&apos;t do
              </h2>
              <ul className="ml-5 list-disc space-y-2 marker:text-[var(--accent)]">
                <li>
                  Inflate a provider&apos;s standing in the recommendations
                  because we earn more from them.
                </li>
                <li>
                  Show plans or speeds that aren&apos;t real (we link to
                  each provider&apos;s own site for current pricing).
                </li>
                <li>
                  Run display ads, sponsored content, or pop-ups.
                </li>
                <li>
                  Track you across sites or sell your data — there&apos;s no
                  third-party tracking on this site beyond the affiliate
                  network cookies set when you click a partner link.
                </li>
                <li>
                  Promote services we wouldn&apos;t use ourselves.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="display mb-3 text-[22px] font-medium text-[var(--fg)]">
                Required FTC disclosure
              </h2>
              <p className="text-[14px] text-[var(--fg-dim)]">
                In compliance with the FTC&apos;s 16 CFR Part 255 Endorsement
                Guides: this site receives compensation for certain
                purchases that result from clicking outbound links to
                third-party service providers. Compensation may influence
                the placement of links on the site, but does not affect our
                evaluations, comparisons, or recommendations.
              </p>
            </section>

            <section>
              <h2 className="display mb-3 text-[22px] font-medium text-[var(--fg)]">
                Questions
              </h2>
              <p>
                Find something off or want to ask about our recommendations?
                Reach out to{" "}
                <a
                  href={site.author.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]"
                >
                  {site.author.name}
                </a>
                .
              </p>
            </section>
          </div>
        </Container>
      </Section>
      <JumpNav
        prev={{ href: "/faq", label: "FAQ" }}
        next={{
          href: "/is-fiber-worth-it",
          label: "Take the 60-second quiz",
          short: "Take the quiz",
        }}
      />
    </>
  );
}
