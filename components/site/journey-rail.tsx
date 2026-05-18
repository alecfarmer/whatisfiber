"use client";

import Link from "next/link";
import { journey, accentColor, type JourneyNode } from "@/lib/journey";
import { cn } from "@/lib/utils";

type JourneyRailProps = {
  className?: string;
  /** When true, the rail collapses to a horizontal scroll-snap on mobile. */
  responsive?: boolean;
};

export function JourneyRail({ className, responsive = true }: JourneyRailProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Mobile: horizontal scroll-snap */}
      {responsive && (
        <ol className="mono -mx-[var(--gutter-x)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter-x)] pb-4 md:hidden">
          {journey.map((node) => (
            <li
              key={node.slug}
              className="min-w-[260px] snap-start"
            >
              <NodeCard node={node} compact />
            </li>
          ))}
        </ol>
      )}

      {/* Desktop: vertical timeline. Scroll-driven progress line removed —
          it triggered a Framer Motion "container has a non-static position"
          warning on certain layouts. The static gradient rule below already
          carries the visual weight. */}
      <ol className={cn("relative", responsive ? "hidden md:block" : "")}>
        <span
          aria-hidden="true"
          className="absolute left-[27px] top-[20px] bottom-[20px] w-px bg-gradient-to-b from-[var(--accent)]/30 via-[var(--accent-text)]/30 to-[var(--border-warm)]/30"
        />
        {journey.map((node, i) => (
          <li
            key={node.slug}
            className="relative flex items-start gap-5 py-3.5"
          >
            <NodeBullet
              i={i + 1}
              tone={accentColor[node.accent]}
              done={false}
            />
            <div className="flex-1 pt-1">
              {node.href ? (
                <Link
                  href={node.href as never}
                  className="group inline-flex flex-wrap items-baseline gap-x-3"
                >
                  <span className="display text-[18px] font-medium text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                    {node.label}
                  </span>
                  <span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
                    {node.short}
                  </span>
                </Link>
              ) : (
                <div className="inline-flex flex-wrap items-baseline gap-x-3">
                  <span className="display text-[18px] font-medium text-[var(--fg)]">
                    {node.label}
                  </span>
                  <span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
                    {node.short}
                  </span>
                </div>
              )}
              <p className="mt-1 max-w-[42ch] text-[14px] text-[var(--fg-muted)]">
                {node.blurb}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function NodeBullet({
  i,
  tone,
}: {
  i: number;
  tone: string;
  done?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className="relative z-10 inline-flex size-[54px] shrink-0 items-center justify-center rounded-2xl border bg-[var(--ink-raised)]"
      style={{ borderColor: tone, boxShadow: `0 0 0 1px ${tone}22 inset` }}
    >
      <span
        className="mono text-[13px] font-semibold"
        style={{ color: tone }}
      >
        {String(i).padStart(2, "0")}
      </span>
    </span>
  );
}

function NodeCard({
  node,
  compact,
}: {
  node: JourneyNode;
  compact?: boolean;
}) {
  const tone = accentColor[node.accent];
  const Wrapper: React.ElementType = node.href ? Link : "div";
  const wrapperProps = node.href ? { href: node.href } : {};
  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "block h-full rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-4 transition-colors",
        node.href && "hover:border-[var(--accent)]",
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className="mono inline-flex size-7 items-center justify-center rounded-lg border text-[11px] font-semibold"
          style={{ color: tone, borderColor: tone }}
        >
          {node.short.slice(0, 3).toUpperCase()}
        </span>
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
          {node.slug}
        </span>
      </div>
      <div className="display text-[16px] font-medium text-[var(--fg)]">
        {node.label}
      </div>
      <p
        className={cn(
          "mt-1 text-[13px] text-[var(--fg-muted)]",
          compact ? "line-clamp-2" : undefined,
        )}
      >
        {node.blurb}
      </p>
    </Wrapper>
  );
}
