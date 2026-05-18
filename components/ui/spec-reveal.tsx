"use client";

/**
 * Inline expander for engineer-mode content. Replaces the global Reader/
 * Engineer toggle: defaults everyone to reader prose, and ANY visitor can
 * click "Show me the specs" to expand the technical depth inline.
 *
 * Uses <details>/<summary> so it works without JS and is keyboard-accessible
 * by default. Animation is CSS — no reliance on Framer Motion for the open
 * transition, so prefers-reduced-motion gets a clean instant open.
 */

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type SpecRevealProps = {
  /** Optional label override; defaults to "Show me the specs". */
  label?: string;
  className?: string;
  children: React.ReactNode;
};

export function SpecReveal({
  label = "Show me the specs",
  className,
  children,
}: SpecRevealProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <details
      className={cn(
        "group/spec my-6 overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)]/60 transition-colors hover:border-[var(--border-warm)]",
        className,
      )}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary
        className="mono flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-text)] [&::-webkit-details-marker]:hidden"
        aria-controls={id}
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex size-4 items-center justify-center rounded-full border border-[var(--accent-text)]/60 text-[10px] transition-transform",
              open ? "rotate-45" : "",
            )}
          >
            +
          </span>
          {label}
        </span>
        <span className="text-[var(--fg-faint)]">
          {open ? "Hide" : "Engineer mode"}
        </span>
      </summary>
      <div
        id={id}
        className="border-t border-[var(--border-hairline)] px-5 py-5 text-[15px] leading-[1.7] text-[var(--fg-muted)] [&_p+p]:mt-3 [&_p_strong]:font-medium [&_p_strong]:text-[var(--fg)]"
      >
        {children}
      </div>
    </details>
  );
}
