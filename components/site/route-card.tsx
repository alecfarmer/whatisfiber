import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "@/components/ui/cta";

type RouteCardProps = {
  href: string;
  eyebrow?: string;
  title: string;
  blurb: string;
  tone?: "accent" | "live" | "warn" | "edge" | "flag";
  className?: string;
};

const toneVar = {
  accent: "var(--accent)",
  live: "var(--status-live)",
  warn: "var(--status-warn)",
  edge: "var(--status-edge)",
  flag: "var(--status-flag)",
} as const;

export function RouteCard({
  href,
  eyebrow,
  title,
  blurb,
  tone = "accent",
  className,
}: RouteCardProps) {
  const color = toneVar[tone];
  return (
    <Link
      href={href as never}
      className={cn(
        "group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-[var(--ink-raised)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--border-warm)] hover:bg-[var(--ink-card)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle, ${color}1f, transparent 70%)`,
        }}
      />
      <div>
        {eyebrow ? (
          <div
            className="mono mb-3 text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div className="display text-[22px] font-medium leading-[1.15] text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
          {title}
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--fg-muted)]">
          {blurb}
        </p>
      </div>
      <div className="mono inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--fg-dim)] transition-colors group-hover:text-[var(--accent)]">
        Read
        <ArrowIcon className="transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
