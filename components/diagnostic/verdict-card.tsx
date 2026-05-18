"use client";

import Link from "next/link";
import type { Verdict } from "@/lib/diagnostic";
import { FiberLookup } from "@/components/fiber-lookup/fiber-lookup";
import { ArrowIcon } from "@/components/ui/cta";

const CONFIDENCE_LABEL: Record<Verdict["confidence"], string> = {
  "very-likely": "Very likely",
  likely: "Likely",
  probably: "Probably",
  possibly: "Possibly",
};

export function VerdictCard({
  verdict,
  onRestart,
  showRunFullCta = true,
}: {
  verdict: Verdict;
  onRestart?: () => void;
  /** True when shown as a standalone /[slug] page — adds a "run the full diagnostic" CTA. */
  showRunFullCta?: boolean;
}) {
  const cta = verdict.fiberCta;
  return (
    <article className="relative overflow-hidden rounded-[24px] border border-[var(--border-soft)] bg-gradient-to-br from-[var(--ink-card)] to-[var(--ink-raised)] p-6 sm:p-10">
      <div className="mono mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border-warm)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-[var(--accent)]"
        />
        {CONFIDENCE_LABEL[verdict.confidence]}
      </div>
      <h2 className="display mt-3 max-w-[24ch] text-balance text-[clamp(28px,4vw,44px)] font-medium leading-[1.06] text-[var(--fg)]">
        {verdict.headline}
      </h2>
      <p className="mt-5 max-w-[64ch] text-[16px] leading-[1.7] text-[var(--fg-muted)]">
        {verdict.diagnosis}
      </p>

      <div className="mt-9 grid gap-3 md:grid-cols-2">
        {/* Try this first — green tone */}
        <div className="rounded-2xl border border-[var(--status-live)]/30 bg-[var(--status-live)]/5 p-5">
          <div className="mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--status-live)]">
            Try this first · Free
          </div>
          <div className="display mt-2 text-[18px] font-medium text-[var(--fg)]">
            {verdict.tryFirst.title}
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--fg-muted)]">
            {verdict.tryFirst.body}
          </p>
        </div>

        {/* Try this next — neutral */}
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-5">
          <div className="mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--fg-faint)]">
            If that doesn&apos;t fix it
          </div>
          <div className="display mt-2 text-[18px] font-medium text-[var(--fg)]">
            {verdict.tryNext.title}
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--fg-muted)]">
            {verdict.tryNext.body}
          </p>
        </div>
      </div>

      {/* Fiber CTA — ONLY when it genuinely helps. Always the third card. */}
      {cta.show ? (
        <div
          className="mt-6 rounded-2xl border p-5"
          style={{
            borderColor:
              cta.intensity === "primary"
                ? "var(--accent)"
                : "var(--border-warm)",
            background:
              cta.intensity === "primary"
                ? "color-mix(in oklch, var(--accent) 8%, var(--ink-raised))"
                : "var(--ink-raised)",
          }}
        >
          <div className="mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
            Fiber would help here · {cta.intensity}
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--fg)]">
            {cta.angle}
          </p>
          <div className="mt-5">
            <FiberLookup
              title="Check fiber availability"
              subtitle="ZIP for quick check, or full address for census-block precision."
            />
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-[var(--border-soft)] bg-[var(--ink)]/40 p-5">
          <div className="mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--fg-faint)]">
            Fiber? No
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--fg-muted)]">
            {cta.reason}
          </p>
        </div>
      )}

      <footer className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-hairline)] pt-6">
        {onRestart ? (
          <button
            type="button"
            onClick={onRestart}
            className="mono inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)] hover:text-[var(--accent-text)]"
          >
            <ArrowIcon className="rotate-180" />
            Run it again
          </button>
        ) : showRunFullCta ? (
          <Link
            href={"/why-is-my-internet-slow" as never}
            className="mono inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-text)] hover:text-[var(--accent)]"
          >
            Run the full 5-question diagnostic →
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={"/is-fiber-worth-it" as never}
          className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-dim)] hover:text-[var(--accent-text)]"
        >
          Take the quiz instead →
        </Link>
      </footer>
    </article>
  );
}
