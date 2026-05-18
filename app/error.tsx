"use client";

/**
 * Top-level error boundary. Renders for any unhandled client error that
 * escapes a route segment. Keeps the user inside the brand instead of
 * showing them a stack trace.
 */

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CtaLink, ArrowIcon } from "@/components/ui/cta";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this is where you'd ship to Sentry / Vercel logs.
    // For now we keep it quiet — the digest is enough to grep for.
    if (process.env.NODE_ENV !== "production") {
       
      console.error("[global error]", error);
    }
  }, [error]);

  return (
    <Section tone="default" className="pt-[calc(var(--nav-h)+96px)] pb-32">
      <Container size="narrow" className="text-center">
        <div className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
          Something broke
        </div>
        <h1 className="display mt-4 text-[clamp(36px,5vw,60px)] font-medium leading-[1.05] text-[var(--fg)]">
          A bit of the page didn&apos;t load.
        </h1>
        <p className="mt-6 mx-auto max-w-[52ch] text-[16px] leading-relaxed text-[var(--fg-muted)]">
          This is on us, not you. Try again — most errors here are transient
          (API timeout, dropped request). If it keeps happening, take a
          screenshot and let me know.
        </p>
        {error.digest ? (
          <p className="mono mt-4 text-[11px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
            Error ID · {error.digest}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--accent)] px-6 text-[14px] font-medium text-[var(--ink-deepest)] shadow-[0_8px_24px_-12px_var(--accent-shadow)] transition-colors hover:bg-[var(--accent-bright)]"
          >
            Try again
            <ArrowIcon />
          </button>
          <CtaLink
            href="/"
            variant="secondary"
            trailingIcon={<ArrowIcon />}
          >
            Back to home
          </CtaLink>
        </div>
      </Container>
    </Section>
  );
}
