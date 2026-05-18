"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMode } from "@/lib/mode-context";
import type { ReactNode } from "react";

type ModeTextProps = {
  reader: ReactNode;
  engineer: ReactNode;
  className?: string;
};

export function ModeText({ reader, engineer, className }: ModeTextProps) {
  const { mode } = useMode();
  const reduce = useReducedMotion();
  const content = mode === "reader" ? reader : engineer;
  if (reduce) {
    return <div className={className}>{content}</div>;
  }
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={mode}
        className={className}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}

export function ModeAware({
  reader,
  engineer,
}: {
  reader: ReactNode;
  engineer: ReactNode;
}) {
  const { mode } = useMode();
  return <>{mode === "reader" ? reader : engineer}</>;
}
