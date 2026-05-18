import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JumpNav } from "@/components/site/jump-nav";
import { glossary } from "@/lib/glossary";
import { site } from "@/lib/site";
import {
  pageMetadata,
  JsonLd,
  buildBreadcrumbSchema,
} from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Fiber Internet Glossary: Every Term Defined (Plain English)",
  description:
    "ONT, PON, FTTH, GPON, XGS-PON, IXP, BGP, anycast, bufferbloat — every fiber, networking, and broadband term you'll encounter, defined in one sentence each.",
  path: "/glossary",
});

function termSlug(term: string) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function Glossary() {
  const path = "/glossary";
  const sorted = [...glossary].sort((a, b) =>
    a.term.localeCompare(b.term, "en", { sensitivity: "base" }),
  );

  // Group by first letter for the index
  const grouped = sorted.reduce<Record<string, typeof sorted>>((acc, t) => {
    const letter = t.term[0].toUpperCase();
    acc[letter] = acc[letter] ?? [];
    acc[letter].push(t);
    return acc;
  }, {});
  const letters = Object.keys(grouped).sort();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "Fiber Internet Glossary",
          hasDefinedTerm: sorted.map((t) => ({
            "@type": "DefinedTerm",
            "@id": `${site.url}${path}#${termSlug(t.term)}`,
            name: t.term,
            termCode: t.acronym ?? t.term,
            description: t.short,
          })),
        }}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Glossary", path },
        ])}
      />

      <Section tone="default" className="pt-[calc(var(--nav-h)+72px)]">
        <Container>
          <Breadcrumb
            trail={[
              { name: "Home", path: "/" },
              { name: "Glossary", path },
            ]}
          />
          <SectionLabel tone="flag">Reference</SectionLabel>
          <h1 className="display mt-4 max-w-[22ch] text-balance text-[clamp(40px,7vw,76px)] font-medium leading-[1.02] text-[var(--fg)]">
            Every term,{" "}
            <em className="font-light italic text-[var(--accent)]">
              one sentence each.
            </em>
          </h1>
          <p className="mt-7 max-w-[60ch] text-[18px] leading-[1.65] text-[var(--fg-muted)]">
            {sorted.length} terms covering the physical layer, access
            networks, protocols, backbone routing, wireless, performance,
            CDN, and infrastructure — defined plainly. Use the letter index
            to jump.
          </p>
        </Container>
      </Section>

      <Section
        tone="deep"
        className="sticky top-[var(--nav-h)] z-30 border-y border-[var(--border-hairline)] !py-3 backdrop-blur-md"
        aria-label="Glossary index"
      >
        <Container>
          <nav>
            <ul className="mono flex flex-wrap items-center gap-x-1.5 gap-y-2 text-[12px] font-semibold uppercase tracking-[0.15em]">
              {letters.map((l) => (
                <li key={l}>
                  <a
                    href={`#letter-${l}`}
                    className="inline-flex size-7 items-center justify-center rounded-md border border-[var(--border-soft)] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Section>

      <Section tone="default">
        <Container>
          {letters.map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="mb-16 scroll-mt-[140px]">
              <Reveal>
                <div className="display mb-6 flex items-baseline gap-4 text-[var(--fg)]">
                  <span className="display text-[clamp(48px,7vw,84px)] font-light italic leading-none text-[var(--accent)]">
                    {letter}
                  </span>
                  <span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
                    {grouped[letter].length}{" "}
                    {grouped[letter].length === 1 ? "term" : "terms"}
                  </span>
                </div>
                <dl className="divide-y divide-[var(--border-hairline)]">
                  {grouped[letter].map((t) => (
                    <div
                      key={t.term}
                      id={termSlug(t.term)}
                      className="grid scroll-mt-[140px] gap-2 py-6 md:grid-cols-[200px_1fr] md:gap-10"
                    >
                      <dt>
                        <div className="display text-[20px] font-medium text-[var(--fg)]">
                          {t.term}
                        </div>
                        {t.acronym && t.acronym !== t.term ? (
                          <div className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
                            {t.acronym}
                          </div>
                        ) : null}
                      </dt>
                      <dd className="text-[15px] leading-[1.7] text-[var(--fg-muted)]">
                        {t.short}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          ))}
        </Container>
      </Section>

      <JumpNav
        prev={{ href: "/is-fiber-worth-it", label: "Is fiber worth it?" }}
        next={{ href: "/faq", label: "FAQ" }}
      />
    </>
  );
}
