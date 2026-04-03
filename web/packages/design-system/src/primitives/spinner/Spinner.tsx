"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { variants } from "../../system/variants";
import { setDisplayName } from "../../system/compose";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const spinnerVariants = variants({
  base: "animate-spin text-current",
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SpinnerProps extends React.HTMLAttributes<HTMLElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  label?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  function Spinner(props, ref) {
    const { className, size, label, ...rest } = props;

    const svg = (
      <svg
        className={cn(spinnerVariants({ size }), !label && className)}
        viewBox="0 0 24 24"
        fill="none"
        role="status"
        aria-label={label ?? "Loading"}
      >
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    );

    if (!label) return svg;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center gap-3", className)}
        role="status"
        {...rest}
      >
        {svg}
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
    );
  },
);

setDisplayName(Spinner, "Spinner");

export { Spinner, spinnerVariants };
