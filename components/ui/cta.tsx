import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--ink-deepest)] hover:bg-[var(--accent-bright)] shadow-[0_8px_24px_-12px_var(--accent-shadow)]",
  secondary:
    "border border-[var(--border-warm)] text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)] bg-[var(--ink-raised)]/60",
  ghost:
    "text-[var(--fg-muted)] hover:text-[var(--accent)]",
};

type BaseProps = {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
  trailingIcon?: ReactNode;
};

const sizeClass: Record<NonNullable<BaseProps["size"]>, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[14px]",
  lg: "h-12 px-7 text-[15px]",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-200 motion-safe:hover:translate-y-[-1px] motion-safe:transition-[transform,background-color,border-color,color]";

type CtaLinkProps = BaseProps &
  Omit<ComponentProps<typeof Link>, "className" | "children">;

export function CtaLink({
  variant = "primary",
  size = "md",
  className,
  children,
  trailingIcon,
  ...linkProps
}: CtaLinkProps) {
  return (
    <Link
      className={cn(baseClass, variantClass[variant], sizeClass[size], className)}
      {...linkProps}
    >
      {children}
      {trailingIcon ? (
        <span className="-mr-1 inline-flex" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </Link>
  );
}

type CtaButtonProps = BaseProps &
  Omit<ComponentProps<"button">, "className" | "children">;

export function CtaButton({
  variant = "primary",
  size = "md",
  className,
  children,
  trailingIcon,
  ...buttonProps
}: CtaButtonProps) {
  return (
    <button
      className={cn(baseClass, variantClass[variant], sizeClass[size], className)}
      {...buttonProps}
    >
      {children}
      {trailingIcon ? (
        <span className="-mr-1 inline-flex" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <path
        d="M2 7h10m0 0L7.5 2.5M12 7l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
