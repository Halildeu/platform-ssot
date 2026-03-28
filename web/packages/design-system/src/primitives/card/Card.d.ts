import React from "react";
import type { SlotProps } from "../_shared/slot-types";
export type CardVariant = "elevated" | "outlined" | "filled" | "ghost";
export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardSlot = "root" | "header" | "body" | "footer";
/** Props for the Card component. */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    padding?: CardPadding;
    /** Interactive — adds hover effects */
    hoverable?: boolean;
    /** Full-width click target */
    as?: "div" | "button" | "article" | "section";
    /**
     * Render via Slot — merges Card props onto the child element.
     * Modern alternative to `as` for polymorphism.
     * @example <Card asChild><a href="/detail">...</a></Card>
     */
    asChild?: boolean;
    /** Override props (className, style, etc.) on internal slot elements */
    slotProps?: SlotProps<CardSlot>;
}
/**
 * Elevated content container with variant styles, optional hover effect, and polymorphic element support.
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="md" hoverable>
 *   <CardHeader title="Project" subtitle="Updated 2 hours ago" />
 *   <CardBody>Card content here</CardBody>
 * </Card>
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/card)
 */
export declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;
export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    action?: React.ReactNode;
}
export declare const CardHeader: React.FC<CardHeaderProps>;
export declare const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export declare const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>;
