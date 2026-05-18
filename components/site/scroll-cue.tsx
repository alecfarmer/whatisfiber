"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ScrollCue() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-[var(--fg-faint)]"
    >
      <span className="mono text-[10px] font-semibold uppercase tracking-[0.35em]">
        Scroll
      </span>
      <span className="relative inline-block h-9 w-px bg-gradient-to-b from-[var(--border-warm)] to-transparent overflow-hidden">
        {!reduce && (
          <motion.span
            className="absolute inset-x-0 top-0 mx-auto h-3 w-px bg-[var(--accent)]"
            initial={{ y: -12 }}
            animate={{ y: 36 }}
            transition={{
              duration: 1.6,
              ease: "easeInOut",
              repeat: 4,
              repeatType: "loop",
            }}
          />
        )}
      </span>
    </div>
  );
}
