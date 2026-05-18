import { cn } from "@/lib/utils";

export type FaqItem = { q: string; a: React.ReactNode };

type FaqListProps = {
  items: FaqItem[];
  className?: string;
};

export function FaqList({ items, className }: FaqListProps) {
  return (
    <div className={cn("divide-y divide-[var(--border-soft)]", className)}>
      {items.map((item, i) => (
        <details
          key={i}
          className="group py-5 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer items-start justify-between gap-6 text-left text-[16px] font-medium text-[var(--fg)] transition-colors hover:text-[var(--accent)]">
            <span>{item.q}</span>
            <span
              aria-hidden="true"
              className="mono mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--border-soft)] text-[var(--fg-dim)] transition-transform group-open:rotate-45 group-open:border-[var(--accent)] group-open:text-[var(--accent)]"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M5 0v10M0 5h10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </summary>
          <div className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-[var(--fg-muted)]">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
