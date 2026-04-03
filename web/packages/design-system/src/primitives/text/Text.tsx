"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { variants } from "../../system/variants";
import { setDisplayName } from "../../system/compose";
import { Slot } from "../_shared/Slot";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const textVariants = variants({
  base: "",
  variants: {
    variant: {
      default: "text-text-primary",
      secondary: "text-text-secondary",
      muted: "text-text-disabled",
      success: "text-green-600 dark:text-green-400",
      warning: "text-amber-600 dark:text-amber-400",
      error: "text-red-600 dark:text-red-400",
      info: "text-blue-600 dark:text-blue-400",
      inverse: "text-text-inverse",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    mono: {
      true: "font-mono",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "base",
    weight: "normal",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TextElement = "p" | "span" | "div" | "label" | "strong" | "em" | "small" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const lineClampMap: Record<number, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
};

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextElement;
  asChild?: boolean;
  variant?: keyof typeof textVariants.variants.variant;
  size?: keyof typeof textVariants.variants.size;
  weight?: keyof typeof textVariants.variants.weight;
  align?: "left" | "center" | "right";
  mono?: boolean;
  truncate?: boolean;
  lineClamp?: 1 | 2 | 3 | 4 | 5;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Text = React.forwardRef<HTMLElement, TextProps>(
  function Text(props, ref) {
    const {
      className,
      as: Tag = "p",
      asChild = false,
      variant,
      size,
      weight,
      align,
      mono,
      truncate = false,
      lineClamp,
      children,
      ...rest
    } = props;

    const Comp = asChild ? Slot : Tag;

    return (
      <Comp
        ref={ref as React.Ref<HTMLParagraphElement>}
        className={cn(
          textVariants({ variant, size, weight, align, mono }),
          truncate && "truncate",
          lineClamp && lineClampMap[lineClamp],
          className,
        )}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

setDisplayName(Text, "Text");

export { Text, textVariants };
