import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "wide" | "narrow" | "prose";
};

const sizeMap: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "max-w-[1180px]",
  wide: "max-w-[1320px]",
  narrow: "max-w-[920px]",
  prose: "max-w-[680px]",
};

export function Container({
  size = "default",
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--gutter-x)]",
        sizeMap[size],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
