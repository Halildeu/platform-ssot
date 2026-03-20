import React from "react";
import { cn } from "../../utils/cn";
import { stateAttrs } from "../../internal/interaction-core";

/* ------------------------------------------------------------------ */
/*  Skeleton — Content placeholder with pulse animation                */
/* ------------------------------------------------------------------ */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width — CSS value or "full" */
  width?: string | number;
  /** Height — CSS value */
  height?: string | number;
  /** Circle shape */
  circle?: boolean;
  /** Number of lines (renders stacked skeletons) */
  lines?: number;
  /** Enable/disable pulse animation (defaults to true) */
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  circle = false,
  lines,
  animated = true,
  className,
  style,
  ...rest
}) => {
  const base = (
    <div
      className={cn(
        animated ? "animate-pulse rounded-lg bg-[var(--surface-muted)]" : "rounded-lg bg-[var(--surface-muted)]",
        circle && "rounded-full",
        className,
      )}
      {...stateAttrs({ component: "skeleton", loading: true })}
      style={{
        width: circle
          ? (typeof height === "number" ? `${height}px` : height) ?? "40px"
          : typeof width === "number"
            ? `${width}px`
            : width ?? "100%",
        height: typeof height === "number" ? `${height}px` : height ?? "16px",
        ...style,
      }}
      {...rest}
    />
  );

  if (lines && lines > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              animated ? "animate-pulse rounded-lg bg-[var(--surface-muted)]" : "rounded-lg bg-[var(--surface-muted)]",
              className,
            )}
            style={{
              width: i === lines - 1 ? "75%" : "100%",
              height: typeof height === "number" ? `${height}px` : height ?? "16px",
              ...style,
            }}
          />
        ))}
      </div>
    );
  }

  return base;
};

Skeleton.displayName = "Skeleton";
