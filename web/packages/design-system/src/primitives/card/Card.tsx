"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { variants, slotVariants } from "../../system/variants";
import { setDisplayName } from "../../system/compose";
import { Slot } from "../_shared/Slot";

// ---------------------------------------------------------------------------
// Card Variants
// ---------------------------------------------------------------------------

const cardVariants = variants({
  base: "rounded-xl border bg-surface-default text-text-primary shadow-sm transition-colors",
  variants: {
    variant: {
      default: "border-border-subtle",
      outline: "border-border-default",
      elevated: "border-border-subtle shadow-md",
      ghost: "border-transparent shadow-none bg-transparent",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    interactive: {
      true: "cursor-pointer hover:shadow-md hover:border-border-default active:shadow-sm transition-shadow",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "elevated" | "ghost";
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  asChild?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  function Card(props, ref) {
    const { className, variant, padding, interactive, asChild = false, ...rest } = props;
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ variant, padding, interactive }), className)}
        {...rest}
      />
    );
  },
);

// ---------------------------------------------------------------------------
// Compound parts
// ---------------------------------------------------------------------------

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props} />;
  },
);

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className, children, ...props }, ref) {
    return (
      <h3 ref={ref} className={cn("text-lg font-semibold leading-tight text-text-primary", className)} {...props}>
        {children}
      </h3>
    );
  },
);

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cn("text-sm text-text-secondary", className)} {...props} />;
  },
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn("pt-0", className)} {...props} />;
  },
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cn("flex items-center gap-3 pt-4", className)} {...props} />;
  },
);

setDisplayName(Card, "Card");
setDisplayName(CardHeader, "CardHeader");
setDisplayName(CardTitle, "CardTitle");
setDisplayName(CardDescription, "CardDescription");
setDisplayName(CardContent, "CardContent");
setDisplayName(CardFooter, "CardFooter");

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
