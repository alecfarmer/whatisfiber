"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type CounterProps = {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

export function Counter({
  end,
  duration = 1.6,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? end : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const startTime = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(end * eased);
      if (t < 1) raf = requestAnimationFrame(step);
      else setValue(end);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration, reduce]);

  const formatted =
    decimals > 0
      ? value.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(value).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
