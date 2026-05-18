import { cn } from "@/lib/utils";

type PullquoteProps = {
  children: React.ReactNode;
  attribution?: string;
  source?: string;
  className?: string;
};

export function Pullquote({
  children,
  attribution,
  source,
  className,
}: PullquoteProps) {
  return (
    <figure
      className={cn(
        "relative my-12 border-l border-[var(--accent)] pl-7",
        className,
      )}
    >
      <blockquote className="display text-balance text-[24px] font-light leading-[1.3] text-[var(--fg)] sm:text-[28px]">
        {children}
      </blockquote>
      {(attribution || source) && (
        <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 text-[13px] text-[var(--fg-dim)]">
          {attribution ? (
            <cite className="not-italic font-medium text-[var(--fg-muted)]">
              {attribution}
            </cite>
          ) : null}
          {source ? (
            <span className="mono uppercase tracking-wider text-[var(--fg-faint)]">
              {source}
            </span>
          ) : null}
        </figcaption>
      )}
    </figure>
  );
}
