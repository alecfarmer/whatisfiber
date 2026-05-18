import { cn } from "@/lib/utils";

export type SpecRow = [label: string, value: string, foot?: string];

type SpecCardProps = {
  title: string;
  rows: SpecRow[];
  tone?: "accent" | "live" | "warn" | "edge" | "flag";
  caption?: string;
  className?: string;
};

const toneVar: Record<NonNullable<SpecCardProps["tone"]>, string> = {
  accent: "var(--accent)",
  live: "var(--status-live)",
  warn: "var(--status-warn)",
  edge: "var(--status-edge)",
  flag: "var(--status-flag)",
};

export function SpecCard({
  title,
  rows,
  tone = "accent",
  caption,
  className,
}: SpecCardProps) {
  const color = toneVar[tone];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-gradient-to-br from-[var(--ink-card)] to-[var(--ink-raised)] p-7",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px opacity-70"
        style={{
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        }}
      />
      <div
        className="mono mb-5 text-[11px] font-bold uppercase tracking-[0.22em]"
        style={{ color }}
      >
        {title}
      </div>
      <dl className="divide-y divide-[var(--border-hairline)]">
        {rows.map(([label, value, foot], i) => (
          <div
            key={i}
            className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <dt className="text-[13px] text-[var(--fg-muted)]">{label}</dt>
            <dd className="flex flex-col items-end gap-0.5">
              <span className="mono text-[14px] font-semibold" style={{ color }}>
                {value}
              </span>
              {foot ? (
                <span className="text-[11px] text-[var(--fg-faint)]">{foot}</span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
      {caption ? (
        <p className="mt-5 text-[12px] leading-relaxed text-[var(--fg-faint)]">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
