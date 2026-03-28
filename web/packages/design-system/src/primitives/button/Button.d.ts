import React from "react";
import { type AccessLevel } from "../../internal/interaction-core";
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonDensity = "compact" | "comfortable" | "spacious";
export type ButtonProps<C extends React.ElementType = "button"> = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Density controls padding/spacing */
    density?: ButtonDensity;
    /** Render a loading spinner and disable interaction */
    loading?: boolean;
    /** Icon placed before children */
    leftIcon?: React.ReactNode;
    /** Icon placed after children */
    rightIcon?: React.ReactNode;
    /** Stretch to fill parent width */
    fullWidth?: boolean;
    /** Render as icon-only (square aspect ratio) */
    iconOnly?: boolean;
    /** Access level — controls disabled/readonly state via access-controller */
    access?: AccessLevel;
    /** Tooltip/title text explaining access restriction */
    accessReason?: string;
    /**
     * Render as a different element type (polymorphic).
     * @example <Button as="a" href="/login">Login</Button>
     */
    as?: C;
    /**
     * Render via Slot — merges Button props onto the child element.
     * @example <Button asChild><a href="/login">Login</a></Button>
     */
    asChild?: boolean;
} & Omit<React.ComponentPropsWithoutRef<C>, "as" | "asChild" | "variant" | "size" | "density" | "loading" | "leftIcon" | "rightIcon" | "fullWidth" | "iconOnly" | "access" | "accessReason">;
/**
 * Primary action trigger with solid, outline, ghost, and link variants in multiple sizes.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleSave}>
 *   Save Changes
 * </Button>
 * ```
 */
export declare const Button: React.ForwardRefExoticComponent<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Density controls padding/spacing */
    density?: ButtonDensity;
    /** Render a loading spinner and disable interaction */
    loading?: boolean;
    /** Icon placed before children */
    leftIcon?: React.ReactNode;
    /** Icon placed after children */
    rightIcon?: React.ReactNode;
    /** Stretch to fill parent width */
    fullWidth?: boolean;
    /** Render as icon-only (square aspect ratio) */
    iconOnly?: boolean;
    /** Access level — controls disabled/readonly state via access-controller */
    access?: AccessLevel;
    /** Tooltip/title text explaining access restriction */
    accessReason?: string;
    /**
     * Render as a different element type (polymorphic).
     * @example <Button as="a" href="/login">Login</Button>
     */
    as?: "button" | undefined;
    /**
     * Render via Slot — merges Button props onto the child element.
     * @example <Button asChild><a href="/login">Login</a></Button>
     */
    asChild?: boolean;
} & Omit<Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref">, "loading" | "access" | "density" | "variant" | "size" | "as" | "asChild" | "leftIcon" | "rightIcon" | "fullWidth" | "iconOnly" | "accessReason"> & React.RefAttributes<HTMLElement>>;
/** Default button props (non-polymorphic) for simple use cases. */
export interface ButtonDefaultProps extends Omit<ButtonProps<'button'>, keyof React.ComponentPropsWithoutRef<'button'>> {
}
