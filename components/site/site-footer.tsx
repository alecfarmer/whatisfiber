import Link from "next/link";
import { navByGroup, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--border-hairline)] bg-[var(--ink-deepest)] pt-20 pb-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[-1px] h-32 bg-gradient-to-b from-[var(--ink)] to-transparent"
      />
      <div className="relative mx-auto grid w-full max-w-[var(--max-w)] gap-12 px-[var(--gutter-x)] md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="space-y-4">
          <Link
            href="/"
            className="display inline-flex items-baseline gap-1 text-[24px] font-medium tracking-[-0.015em] text-[var(--fg)]"
          >
            What Is <em className="not-italic text-[var(--accent)]">Fiber</em>
          </Link>
          <p className="max-w-[28ch] text-[13px] leading-relaxed text-[var(--fg-dim)]">
            An obsessively researched explainer of how fiber-optic internet
            actually works — and how it compares to everything else.
          </p>
          <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
            Built by{" "}
            <a
              href={site.author.url}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--fg-muted)] transition-colors hover:text-[var(--accent)]"
            >
              {site.author.name}
            </a>
          </p>
        </div>
        <FooterColumn title="Explain" links={navByGroup.explain} />
        <FooterColumn title="Compare" links={navByGroup.compare} />
        <FooterColumn title="Decide" links={navByGroup.decide} />
        <FooterColumn title="Reference" links={navByGroup.reference} />
      </div>
      <div className="relative mx-auto mt-12 w-full max-w-[var(--max-w)] px-[var(--gutter-x)]">
        <p className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--ink-raised)]/40 p-4 text-center text-[12.5px] text-[var(--fg-dim)]">
          Looking for{" "}
          <em className="font-light italic text-[var(--fg-muted)]">
            dietary
          </em>{" "}
          fiber? This isn&apos;t that — head to{" "}
          <a
            href="https://my.clevelandclinic.org/health/articles/14400-improving-your-health-with-fiber"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]"
          >
            Cleveland Clinic
          </a>
          ,{" "}
          <a
            href="https://www.nhs.uk/live-well/eat-well/digestive-health/how-to-get-more-fibre-into-your-diet/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]"
          >
            NHS
          </a>
          , or{" "}
          <a
            href="https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]"
          >
            Mayo Clinic
          </a>
          .
        </p>
      </div>
      <div className="relative mx-auto mt-6 flex w-full max-w-[var(--max-w)] flex-wrap items-center justify-between gap-4 border-t border-[var(--border-hairline)] px-[var(--gutter-x)] pt-6 text-[12px] text-[var(--fg-faint)]">
        <p>© {new Date().getFullYear()} What Is Fiber. Made with curiosity.</p>
        <div className="flex items-center gap-5">
          <Link
            href={"/disclosure" as never}
            className="transition-colors hover:text-[var(--accent)]"
          >
            Disclosure
          </Link>
          <p className="mono uppercase tracking-[0.18em]">
            Light travels 2/3 c through glass
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <div className="mono mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        {title}
      </div>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href as never}
              className="text-[13px] text-[var(--fg-muted)] transition-colors hover:text-[var(--accent)]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
