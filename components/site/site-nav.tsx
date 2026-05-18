"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { site, navByGroup } from "@/lib/site";
import { cn } from "@/lib/utils";

const TOP_LINKS = [
  { href: "/how-fiber-works", label: "Explain" },
  { href: "/fiber-vs-cable", label: "Compare" },
  { href: "/is-fiber-worth-it", label: "Decide" },
  { href: "/glossary", label: "Reference" },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  // Close drawer on route change
  useEffect(() => {
    setDrawer(false);
  }, [pathname]);

  // Lock body scroll while drawer open
  useEffect(() => {
    if (drawer) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [drawer]);

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled
            ? "border-b border-[var(--border-hairline)] bg-[var(--ink)]/70 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent",
        )}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <div className="mx-auto flex h-[var(--nav-h)] w-full max-w-[var(--max-w)] items-center justify-between px-[var(--gutter-x)]">
          <Link
            href="/"
            className="group inline-flex items-center gap-2"
            aria-label={`${site.name} — home`}
          >
            <LogoMark />
            <span className="display text-[17px] font-medium tracking-[-0.01em] text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
              What Is <em className="not-italic text-[var(--accent)]">Fiber</em>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {TOP_LINKS.map((l) => {
              const active =
                pathname === l.href ||
                (l.href === "/fiber-vs-cable" &&
                  pathname.startsWith("/fiber-vs-")) ||
                (l.href === "/how-fiber-works" &&
                  ["/how-fiber-works", "/inside-your-home", "/the-internet-backbone"].includes(
                    pathname,
                  )) ||
                (l.href === "/glossary" &&
                  ["/glossary", "/faq"].includes(pathname));
              return (
                <Link
                  key={l.href}
                  href={l.href as never}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                    active
                      ? "text-[var(--accent)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={"/is-fiber-worth-it" as never}
              className="hidden h-9 items-center gap-2 rounded-full bg-[var(--accent)] px-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-deepest)] transition-all hover:bg-[var(--accent-bright)] sm:inline-flex"
            >
              Take the quiz
            </Link>
            <button
              type="button"
              aria-label={drawer ? "Close menu" : "Open menu"}
              aria-expanded={drawer}
              aria-controls="mobile-drawer"
              onClick={() => setDrawer((s) => !s)}
              className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--border-soft)] text-[var(--fg-muted)] hover:text-[var(--fg)] md:hidden"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                {drawer ? (
                  <path
                    d="M2 2l10 10M12 2L2 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M1.5 4h11M1.5 10h11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
      <div aria-hidden="true" className="h-[var(--nav-h)]" />
    </>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex size-7 items-center justify-center rounded-[8px] bg-[var(--ink-raised)] ring-1 ring-[var(--border-soft)]"
    >
      <span className="absolute inset-x-1.5 top-1.5 h-[2px] rounded-full bg-[var(--accent)]" />
      <span className="absolute inset-x-1.5 top-3 h-[2px] rounded-full bg-[var(--accent)]/60" />
      <span className="absolute inset-x-1.5 top-[18px] h-[2px] rounded-full bg-[var(--accent)]/30" />
    </span>
  );
}

function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      id="mobile-drawer"
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-40 md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-[var(--ink-deepest)]/80 backdrop-blur-md transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cn(
          "absolute inset-x-0 top-[var(--nav-h)] mx-3 mt-3 rounded-3xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-6 shadow-2xl transition-all duration-300",
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-3 opacity-0",
        )}
      >
        <DrawerSection title="Explain" links={navByGroup.explain} />
        <DrawerSection title="Compare" links={navByGroup.compare} />
        <DrawerSection title="Decide" links={navByGroup.decide} />
        <DrawerSection title="Reference" links={navByGroup.reference} />
      </div>
    </div>
  );
}

function DrawerSection({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; blurb?: string }[];
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mono mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        {title}
      </div>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href as never}
              className="block rounded-xl p-3 text-[15px] font-medium text-[var(--fg)] transition-colors hover:bg-[var(--ink-card)] hover:text-[var(--accent)]"
            >
              {l.label}
              {l.blurb ? (
                <span className="mt-0.5 block text-[12px] font-normal text-[var(--fg-dim)]">
                  {l.blurb}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
