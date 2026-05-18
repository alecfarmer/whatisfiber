import Link from "next/link";
import { ArrowIcon } from "@/components/ui/cta";

type JumpItem = { href: string; label: string; short?: string };

type JumpNavProps = {
  prev?: JumpItem;
  next?: JumpItem;
};

export function JumpNav({ prev, next }: JumpNavProps) {
  return (
    <nav
      aria-label="Continue reading"
      className="mx-auto grid w-full max-w-[var(--max-w)] gap-4 px-[var(--gutter-x)] pb-24 pt-10 sm:grid-cols-2"
    >
      <JumpCard item={prev} direction="prev" />
      <JumpCard item={next} direction="next" />
    </nav>
  );
}

function JumpCard({
  item,
  direction,
}: {
  item?: JumpItem;
  direction: "prev" | "next";
}) {
  if (!item) return <div aria-hidden="true" />;
  return (
    <Link
      href={item.href as never}
      className="group flex items-center justify-between gap-4 rounded-3xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-6 transition-colors hover:border-[var(--accent)]"
    >
      {direction === "prev" && (
        <span
          aria-hidden="true"
          className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--border-soft)] text-[var(--fg-muted)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
        >
          <ArrowIcon className="rotate-180" />
        </span>
      )}
      <div
        className={direction === "next" ? "text-right" : "text-left"}
        style={{ flex: 1 }}
      >
        <div className="mono mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--fg-faint)]">
          {direction === "prev" ? "← Previous" : "Next →"}
        </div>
        <div className="display text-[18px] font-medium text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
          {item.label}
        </div>
      </div>
      {direction === "next" && (
        <span
          aria-hidden="true"
          className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--border-soft)] text-[var(--fg-muted)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
        >
          <ArrowIcon />
        </span>
      )}
    </Link>
  );
}
