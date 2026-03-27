import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type RatingSize = "sm" | "md" | "lg";
export interface RatingProps extends AccessControlledProps {
    /** Current value (0-max). Makes the component controlled. */
    value?: number;
    /** Default value for uncontrolled usage. */
    defaultValue?: number;
    /** Maximum number of stars. @default 5 */
    max?: number;
    /** Allow half-star precision. @default false */
    allowHalf?: boolean;
    /** Allow clearing by clicking the current value. @default true */
    allowClear?: boolean;
    /** Visual size variant. @default "md" */
    size?: RatingSize;
    /** Custom filled icon. */
    icon?: React.ReactNode;
    /** Custom empty icon. */
    emptyIcon?: React.ReactNode;
    /** Custom half icon (used when allowHalf is true). */
    halfIcon?: React.ReactNode;
    /** Array of colors applied per value (index 0 = value 1). */
    colors?: string[];
    /** Show numeric value label beside the stars. @default false */
    showValue?: boolean;
    /** Formatter for the value label. */
    valueFormatter?: (value: number) => string;
    /** Description labels keyed by value (e.g. { 1: "Kotu", 5: "Mukemmel" }). */
    labels?: Record<number, string>;
    /** Called when value changes. */
    onValueChange?: (value: number) => void;
    /** Called when hovered value changes. null when hover ends. */
    onHoverChange?: (value: number | null) => void;
    /** Additional class name for the root element. */
    className?: string;
    /** Accessible label for the rating group. @default "Degerlendirme" */
    "aria-label"?: string;
}
export declare const Rating: React.ForwardRefExoticComponent<RatingProps & React.RefAttributes<HTMLDivElement>>;
export default Rating;
