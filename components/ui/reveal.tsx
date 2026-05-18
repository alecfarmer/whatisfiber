"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "p" | "li" | "section" | "article";
  once?: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  as = "div",
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  if (reduce) {
    return <Comp className={className}>{children}</Comp>;
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

export function StaggerGroup({
  children,
  delayChildren = 0.08,
  staggerChildren = 0.08,
  className,
  once = true,
}: {
  children: ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { delayChildren, staggerChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  y = 18,
  className,
  as = "div",
}: {
  children: ReactNode;
  y?: number;
  className?: string;
  as?: "div" | "span" | "p" | "li";
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: EASE },
        },
      }}
    >
      {children}
    </Comp>
  );
}
