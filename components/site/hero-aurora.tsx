"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Ambient hero backdrop — three soft radial gradients that drift slowly,
 * with a thin horizon line and a faint hairline grid. Pure CSS + a single
 * always-on framer animation. Disabled under prefers-reduced-motion.
 */
export function HeroAurora() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Base radial wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_-20%,rgba(110,220,255,0.18),transparent_60%)]" />
      {/* Lower violet bloom */}
      <div className="absolute inset-x-0 bottom-[-30%] h-[70%] bg-[radial-gradient(70%_60%_at_50%_50%,rgba(183,148,255,0.10),transparent_70%)]" />
      {/* Drifting bloom (animated) */}
      <motion.div
        className="absolute left-1/2 top-[18%] size-[55vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(110,220,255,0.10),transparent_60%)] blur-[40px]"
        animate={
          reduce
            ? undefined
            : { x: ["-50%", "-46%", "-50%"], y: ["0%", "3%", "0%"] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Faint grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border-hairline) 1px, transparent 1px), linear-gradient(to bottom, var(--border-hairline) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(80% 60% at 50% 40%, #000 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(80% 60% at 50% 40%, #000 30%, transparent 80%)",
        }}
      />
    </div>
  );
}
