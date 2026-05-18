"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMode, type ReaderMode } from "@/lib/mode-context";
import { cn } from "@/lib/utils";

type Option = { value: ReaderMode; label: string; sub: string };

const options: Option[] = [
  { value: "reader", label: "Reader", sub: "Plain English" },
  { value: "engineer", label: "Engineer", sub: "Specs & protocols" },
];

export function ModeToggle({ className }: { className?: string }) {
  const { mode, setMode } = useMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<ReaderMode, HTMLButtonElement | null>>({
    reader: null,
    engineer: null,
  });
  const [indicator, setIndicator] = useState({ x: 0, w: 0 });

  useLayoutEffect(() => {
    const btn = buttonRefs.current[mode];
    if (!btn || !containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setIndicator({ x: bRect.left - cRect.left, w: bRect.width });
  }, [mode]);

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Reading mode"
      className={cn(
        "relative inline-flex items-center rounded-full border border-[var(--border-soft)] bg-[var(--ink-raised)]/80 p-1 backdrop-blur",
        className,
      )}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-1 rounded-full bg-[var(--accent)]/12 ring-1 ring-[var(--accent)]/40"
        initial={false}
        animate={{ x: indicator.x, width: indicator.w }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
      />
      {options.map((opt) => {
        const active = opt.value === mode;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              buttonRefs.current[opt.value] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${opt.label} mode — ${opt.sub}`}
            onClick={() => setMode(opt.value)}
            className={cn(
              "relative z-10 inline-flex h-9 min-w-[88px] items-center justify-center gap-1 rounded-full px-4 text-[12px] font-medium transition-colors",
              active
                ? "text-[var(--accent)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
