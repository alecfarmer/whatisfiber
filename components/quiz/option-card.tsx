"use client";

import { cn } from "@/lib/utils";

type OptionCardProps = {
  label: string;
  sub?: string;
  selected?: boolean;
  onClick: () => void;
  multi?: boolean;
};

export function OptionCard({
  label,
  sub,
  selected = false,
  onClick,
  multi = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={multi ? selected : undefined}
      data-selected={selected ? "" : undefined}
      className={cn(
        "group relative flex h-full w-full flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-all duration-200",
        "border-[var(--border-soft)] bg-[var(--ink-raised)] hover:border-[var(--border-warm)] hover:bg-[var(--ink-card)]",
        "data-[selected]:border-[var(--accent)] data-[selected]:bg-[var(--ink-card)] data-[selected]:shadow-[0_8px_28px_-12px_var(--accent-shadow)]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-4 top-4 inline-flex size-5 items-center justify-center rounded-full border transition-all",
          multi
            ? "border-[var(--border-warm)] group-data-[selected]:border-[var(--accent)] group-data-[selected]:bg-[var(--accent)]"
            : "border-[var(--border-warm)] group-data-[selected]:border-[var(--accent)] group-data-[selected]:bg-[var(--accent)]",
        )}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className="opacity-0 transition-opacity group-data-[selected]:opacity-100"
        >
          <path
            d="M1.5 5l2.5 2.5L8.5 2"
            stroke="var(--ink-deepest)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="display text-[24px] font-medium leading-none text-[var(--fg)] group-data-[selected]:text-[var(--accent)]">
        {label}
      </span>
      {sub ? (
        <span className="text-[13px] leading-snug text-[var(--fg-muted)]">
          {sub}
        </span>
      ) : null}
    </button>
  );
}
