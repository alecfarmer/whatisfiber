import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: "default" | "deep" | "raised" | "card";
  wipe?: boolean;
};

const toneMap: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-[var(--ink)]",
  deep: "bg-[var(--ink-deep)]",
  raised: "bg-[var(--ink-raised)]",
  card: "bg-[var(--ink-card)]",
};

export function Section({
  tone = "default",
  wipe = false,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative",
        toneMap[tone],
        "py-[var(--section-y)]",
        className,
      )}
      {...rest}
    >
      {children}
      {wipe && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[var(--ink-deepest)]"
        />
      )}
    </section>
  );
}
