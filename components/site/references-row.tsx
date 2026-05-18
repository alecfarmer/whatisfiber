import { REFERENCES } from "@/lib/references";

export function ReferencesRow() {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <div>
          <div className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
            05 — Where we got this
          </div>
          <h2 className="display mt-3 text-[clamp(28px,4vw,40px)] font-medium leading-[1.08] text-[var(--fg)]">
            The receipts.
          </h2>
        </div>
      </div>
      <p className="mt-3 max-w-[60ch] text-[15px] text-[var(--fg-muted)]">
        Every quantitative claim on this site is sourced. These are the
        primary documents we cite — standards bodies, federal regulators,
        and independent measurement firms.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {REFERENCES.map((ref) => (
          <li key={ref.slug}>
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--border-warm)] hover:bg-[var(--ink-card)]"
            >
              <div className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--fg-faint)]">
                {ref.publisher} · {ref.year}
              </div>
              <div className="display text-[16px] font-medium leading-snug text-[var(--fg)] transition-colors group-hover:text-[var(--accent-text)]">
                {ref.title}
              </div>
              <p className="text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
                {ref.blurb}
              </p>
              <span className="mono mt-auto text-[10px] uppercase tracking-[0.18em] text-[var(--fg-dim)] transition-colors group-hover:text-[var(--accent-text)]">
                Open source ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
