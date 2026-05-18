import { Counter } from "./counter";
import { cn } from "@/lib/utils";

type StatProps = {
  number: number;
  /** Unit shown on its own line beneath the number (e.g., "km/s"). */
  unit?: string;
  /** Inline suffix appended to the number (e.g., "+"). */
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  caption?: string;
  tone?: "accent" | "live" | "warn" | "edge" | "flag";
  className?: string;
};

const toneVar = {
  accent: "var(--accent-text)",
  live: "var(--status-live)",
  warn: "var(--status-warn)",
  edge: "var(--status-edge)",
  flag: "var(--status-flag)",
} as const;

export function Stat({
  number,
  unit,
  suffix,
  prefix,
  decimals,
  label,
  caption,
  tone = "accent",
  className,
}: StatProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 border-t border-[var(--border-soft)] pt-7",
        className,
      )}
    >
      <div
        className="display font-medium leading-[0.95] tracking-[-0.025em] text-[clamp(48px,6vw,84px)]"
        style={{ color: toneVar[tone] }}
      >
        <Counter
          end={number}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
        />
      </div>
      {unit ? (
        <div
          className="mono text-[11px] font-bold uppercase tracking-[0.22em]"
          style={{ color: toneVar[tone] }}
        >
          {unit}
        </div>
      ) : null}
      <div className="mt-1 max-w-[28ch] text-[14px] font-medium leading-snug text-[var(--fg)]">
        {label}
      </div>
      {caption ? (
        <div className="max-w-[32ch] text-[12.5px] leading-relaxed text-[var(--fg-dim)]">
          {caption}
        </div>
      ) : null}
    </div>
  );
}
