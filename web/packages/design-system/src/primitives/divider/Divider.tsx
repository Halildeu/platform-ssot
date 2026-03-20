import React from "react";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/*  Divider — Visual separator                                         */
/* ------------------------------------------------------------------ */

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Label in the center */
  label?: string;
  /** Margin spacing */
  spacing?: "none" | "sm" | "md" | "lg";
}

const spacingMap: Record<string, string> = {
  none: "",
  sm: "my-2",
  md: "my-4",
  lg: "my-6",
};

const spacingVerticalMap: Record<string, string> = {
  none: "",
  sm: "mx-2",
  md: "mx-4",
  lg: "mx-6",
};

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  label,
  spacing = "md",
  className,
  ...rest
}) => {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn(
          "inline-block h-full w-px bg-[var(--border-subtle)]",
          spacingVerticalMap[spacing],
          className,
        )}
        {...rest}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={cn(
          "flex items-center gap-3",
          spacingMap[spacing],
          className,
        )}
        {...rest}
      >
        <div className="h-px flex-1 bg-[var(--border-subtle)]" />
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          {label}
        </span>
        <div className="h-px flex-1 bg-[var(--border-subtle)]" />
      </div>
    );
  }

  return (
    <hr
      className={cn(
        "border-none h-px bg-[var(--border-subtle)]",
        spacingMap[spacing],
        className,
      )}
      {...rest}
    />
  );
};

Divider.displayName = "Divider";
