import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CtaLink, ArrowIcon } from "@/components/ui/cta";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `404 — ${site.name}`,
  description:
    "That fiber is somewhere else. Take the quiz or read the field guide instead.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section tone="default" className="pt-[calc(var(--nav-h)+96px)] pb-32">
      <Container size="narrow" className="text-center">
        <div className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
          404 — broken link
        </div>
        <h1 className="display mt-4 text-[clamp(40px,6vw,72px)] font-medium leading-[1.05] text-[var(--fg)]">
          This page isn&apos;t on the network.
        </h1>
        <p className="mt-6 mx-auto max-w-[52ch] text-[16px] leading-relaxed text-[var(--fg-muted)]">
          Either you mistyped the URL, or we moved the page and forgot to leave
          a redirect. Try one of the working routes below — the rest of the site
          is still here.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <CtaLink href="/" trailingIcon={<ArrowIcon />}>
            Back to the home page
          </CtaLink>
          <CtaLink
            href="/is-fiber-worth-it"
            variant="secondary"
            trailingIcon={<ArrowIcon />}
          >
            Take the fiber quiz
          </CtaLink>
        </div>
        <div className="mt-14 grid gap-4 text-left sm:grid-cols-3">
          <NotFoundLink
            href="/how-fiber-works"
            eyebrow="Explain"
            label="How fiber works"
          />
          <NotFoundLink
            href="/fiber-vs-cable"
            eyebrow="Compare"
            label="Fiber vs cable"
          />
          <NotFoundLink
            href="/why-is-my-internet-slow"
            eyebrow="Diagnose"
            label="Why is my internet slow?"
          />
        </div>
      </Container>
    </Section>
  );
}

function NotFoundLink({
  href,
  eyebrow,
  label,
}: {
  href: string;
  eyebrow: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="group block rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-5 transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--ink-elev)]"
    >
      <div className="mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
        {eyebrow}
      </div>
      <div className="mt-2 text-[15px] font-medium text-[var(--fg)] group-hover:text-[var(--accent)]">
        {label} →
      </div>
    </a>
  );
}
