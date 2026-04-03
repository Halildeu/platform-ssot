"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { variants } from "../../system/variants";
import { setDisplayName } from "../../system/compose";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const stackVariants = variants({
  base: "flex",
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
    },
    wrap: {
      true: "flex-wrap",
    },
  },
  defaultVariants: {
    direction: "column",
    gap: 3,
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "nav" | "ul" | "ol" | "main" | "aside" | "header" | "footer";
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  wrap?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  function Stack(props, ref) {
    const {
      className,
      as: Tag = "div",
      direction,
      align,
      justify,
      gap,
      wrap,
      children,
      ...rest
    } = props;

    return (
      <Tag
        ref={ref}
        className={cn(stackVariants({ direction, align, justify, gap, wrap }), className)}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

setDisplayName(Stack, "Stack");

// ---------------------------------------------------------------------------
// Convenience wrappers
// ---------------------------------------------------------------------------

const HStack = React.forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  function HStack(props, ref) {
    return <Stack ref={ref} direction="row" align="center" {...props} />;
  },
);

const VStack = React.forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  function VStack(props, ref) {
    return <Stack ref={ref} direction="column" {...props} />;
  },
);

setDisplayName(HStack, "HStack");
setDisplayName(VStack, "VStack");

export { Stack, HStack, VStack, stackVariants };
