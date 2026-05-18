import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children: React.ReactNode;
  tone?: "accent" | "live" | "warn" | "edge" | "flag";
  className?: string;
};

const toneVar: Record<NonNullable<SectionLabelProps["tone"]>, string> = {
  accent: "var(--accent)",
  live: "var(--status-live)",
  warn: "var(--status-warn)",
  edge: "var(--status-edge)",
  flag: "var(--status-flag)",
};

export function SectionLabel({
  children,
  tone = "accent",
  className,
}: SectionLabelProps) {
  return (
    <div
      className={cn(
        "mono inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em]",
        className,
      )}
      style={{ color: toneVar[tone] }}
    >
      <span
        aria-hidden="true"
        className="inline-block size-1.5 rounded-full"
        style={{ background: toneVar[tone] }}
      />
      {children}
    </div>
  );
}
