import { cn } from "@/lib/utils";

export type ComparisonRow = {
  metric: string;
  a: string;
  b: string;
  winner?: "a" | "b" | "tie";
};

type ComparisonTableProps = {
  /** Left column header (typically "Fiber"). */
  aLabel: string;
  /** Right column header (the competitor). */
  bLabel: string;
  rows: ComparisonRow[];
  caption?: string;
  className?: string;
};

export function ComparisonTable({
  aLabel,
  bLabel,
  rows,
  caption,
  className,
}: ComparisonTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-[var(--ink-card)]",
        className,
      )}
    >
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          {caption ?? `Comparison of ${aLabel} and ${bLabel}`}
        </caption>
        <thead>
          <tr className="border-b border-[var(--border-soft)] bg-[var(--ink-raised)]">
            <th
              scope="col"
              className="mono w-[34%] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--fg-dim)]"
            >
              Metric
            </th>
            <th
              scope="col"
              className="mono px-5 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]"
            >
              {aLabel}
            </th>
            <th
              scope="col"
              className="mono px-5 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--fg-muted)]"
            >
              {bLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[var(--border-hairline)] last:border-b-0"
            >
              <th
                scope="row"
                className="px-5 py-4 align-top text-[13px] font-medium text-[var(--fg-muted)]"
              >
                {row.metric}
              </th>
              <td
                className={cn(
                  "mono px-5 py-4 align-top text-[14px]",
                  row.winner === "a"
                    ? "text-[var(--accent)] font-semibold"
                    : "text-[var(--fg)]",
                )}
              >
                {row.a}
                {row.winner === "a" ? (
                  <span
                    aria-label="Winner"
                    className="ml-2 inline-block size-1.5 translate-y-[-2px] rounded-full bg-[var(--accent)]"
                  />
                ) : null}
              </td>
              <td
                className={cn(
                  "mono px-5 py-4 align-top text-[14px]",
                  row.winner === "b"
                    ? "text-[var(--accent)] font-semibold"
                    : "text-[var(--fg)]",
                )}
              >
                {row.b}
                {row.winner === "b" ? (
                  <span
                    aria-label="Winner"
                    className="ml-2 inline-block size-1.5 translate-y-[-2px] rounded-full bg-[var(--accent)]"
                  />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
