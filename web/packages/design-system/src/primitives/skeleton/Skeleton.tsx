"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { setDisplayName } from "../../system/compose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  lines?: number;
  animate?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(props, ref) {
    const {
      className,
      width,
      height,
      circle = false,
      lines = 1,
      animate = true,
      style,
      ...rest
    } = props;

    const baseClass = cn(
      "bg-surface-muted",
      animate && "animate-pulse",
      circle ? "rounded-full" : "rounded-md",
      className,
    );

    const sizeStyle: React.CSSProperties = {
      width: circle ? (height ?? width ?? 40) : width,
      height: circle ? (height ?? width ?? 40) : (height ?? "1rem"),
      ...style,
    };

    if (lines <= 1) {
      return (
        <div ref={ref} className={baseClass} style={sizeStyle} aria-hidden {...rest} />
      );
    }

    return (
      <div ref={ref} className="flex flex-col gap-2" aria-hidden {...rest}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={baseClass}
            style={{
              height: height ?? "1rem",
              width: i === lines - 1 ? "75%" : "100%",
            }}
          />
        ))}
      </div>
    );
  },
);

setDisplayName(Skeleton, "Skeleton");

export { Skeleton };
