import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { FaqList } from "@/components/ui/faq-list";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JumpNav } from "@/components/site/jump-nav";
import { faqClusters, allFaqs } from "@/lib/faqs-all";
import {
  pageMetadata,
  JsonLd,
  buildFaqSchema,
  buildBreadcrumbSchema,
} from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Fiber Internet FAQ: 35+ Real Questions, Real Answers",
  description:
    "Power outages, sharks, the works. 35+ commonly asked questions about fiber internet, cable vs fiber, Starlink, 5G home, and what to do at the gateway — answered in plain English.",
  path: "/faq",
});

export default function FaqPage() {
  const path = "/faq";
  return (
    <>
      <JsonLd data={buildFaqSchema(allFaqs())} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path },
        ])}
      />

      <Section tone="default" className="pt-[calc(var(--nav-h)+72px)]">
        <Container>
          <Breadcrumb
            trail={[
              { name: "Home", path: "/" },
              { name: "FAQ", path },
            ]}
          />
          <SectionLabel tone="flag">Reference</SectionLabel>
          <h1 className="display mt-4 max-w-[22ch] text-balance text-[clamp(40px,7vw,76px)] font-medium leading-[1.02] text-[var(--fg)]">
            Every fiber question you{" "}
            <em className="font-light italic text-[var(--accent)]">
              actually
            </em>{" "}
            ask.
          </h1>
          <p className="mt-7 max-w-[60ch] text-[18px] leading-[1.65] text-[var(--fg-muted)]">
            {allFaqs().length} questions across five topics — how fiber
            works, what&apos;s inside your home, head-to-head comparisons,
            making the decision, and the curious edge cases. Expand any
            question to read the answer.
          </p>
        </Container>
      </Section>

      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container>
          <nav aria-label="FAQ sections" className="mb-12">
            <ul className="mono flex flex-wrap items-center gap-x-2 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.18em]">
              {faqClusters.map((c) => (
                <li key={c.slug}>
                  <a
                    href={`#${c.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] px-3 py-1.5 text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <span className="inline-block size-1.5 rounded-full bg-[var(--accent)]" />
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-20">
            {faqClusters.map((cluster) => (
              <div
                key={cluster.slug}
                id={cluster.slug}
                className="scroll-mt-[140px]"
              >
                <Reveal>
                  <div className="mb-2 flex items-baseline gap-3">
                    <SectionLabel tone="accent">{cluster.label}</SectionLabel>
                    <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
                      {cluster.items.length}{" "}
                      {cluster.items.length === 1 ? "question" : "questions"}
                    </span>
                  </div>
                  <h2 className="display mt-3 text-[clamp(24px,3.5vw,36px)] font-medium leading-[1.1] text-[var(--fg)]">
                    {cluster.blurb}
                  </h2>
                  <div className="mt-8">
                    <FaqList
                      items={cluster.items.map((i) => ({
                        q: i.q,
                        a: <p>{i.a}</p>,
                      }))}
                    />
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <JumpNav
        prev={{ href: "/glossary", label: "Glossary" }}
        next={{ href: "/", label: "Back to the journey overview" }}
      />
    </>
  );
}
