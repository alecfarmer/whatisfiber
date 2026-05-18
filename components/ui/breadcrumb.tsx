import Link from "next/link";

type Crumb = { name: string; path: string };

export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="mono flex flex-wrap items-center gap-x-2 text-[11px] uppercase tracking-[0.18em] text-[var(--fg-dim)]">
        {trail.map((c, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-[var(--fg-muted)]">{c.name}</span>
              ) : (
                <Link
                  href={c.path as never}
                  className="transition-colors hover:text-[var(--accent)]"
                >
                  {c.name}
                </Link>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
