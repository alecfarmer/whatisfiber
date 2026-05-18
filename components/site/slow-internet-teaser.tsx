import Link from "next/link";

const CARDS = [
  {
    question: "Why does Netflix buffer at 7pm?",
    hint: "Cable bufferbloat + peak-hour neighborhood contention. Sometimes the answer is fiber. Sometimes it's not.",
    targetSlug: "bufferbloat",
  },
  {
    question: "Why is my upload so much slower than my download?",
    hint: "Cable was designed for downloads. Your 1 Gbps plan probably ships with ~35 Mbps upload — that's the bottleneck.",
    targetSlug: "upload-choked",
  },
  {
    question: "Why does my Wi-Fi feel slower than the speed test?",
    hint: "Almost certainly the router itself — placement, age, or 2.4 GHz interference. We'll tell you for sure.",
    targetSlug: "router-in-cabinet",
  },
];

export function SlowInternetTeaser() {
  return (
    <div>
      <div className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
        02 — Diagnose first
      </div>
      <h2 className="display mt-3 max-w-[24ch] text-balance text-[clamp(28px,4.2vw,44px)] font-medium leading-[1.06] text-[var(--fg)]">
        Why is your internet{" "}
        <em className="font-light italic text-[var(--accent-text)]">slow?</em>
      </h2>
      <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-[var(--fg-muted)]">
        Sometimes fiber is the fix. Sometimes the answer is &ldquo;your
        router has been in that cabinet since 2017.&rdquo; The diagnostic
        asks five questions and honestly tells you which one you have.
      </p>
      <ul className="mt-10 grid gap-3 lg:grid-cols-3">
        {CARDS.map((c, i) => (
          <li key={i}>
            <Link
              href={`/why-is-my-internet-slow/${c.targetSlug}` as never}
              className="group flex h-full flex-col gap-4 rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--border-warm)] hover:bg-[var(--ink-card)]"
            >
              <div className="mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fg-faint)]">
                Q · 0{i + 1}
              </div>
              <div className="display text-[18px] font-medium leading-[1.25] text-[var(--fg)] transition-colors group-hover:text-[var(--accent-text)]">
                {c.question}
              </div>
              <p className="text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
                {c.hint}
              </p>
              <span className="mono mt-auto text-[10px] uppercase tracking-[0.18em] text-[var(--fg-dim)] transition-colors group-hover:text-[var(--accent-text)]">
                Diagnose →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link
          href={"/why-is-my-internet-slow" as never}
          className="mono inline-flex items-center gap-2 rounded-full border border-[var(--border-warm)] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
        >
          Run the full diagnostic →
        </Link>
      </div>
    </div>
  );
}
