import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type CascaderOption = {
    value: string;
    label: string;
    children?: CascaderOption[];
    disabled?: boolean;
};
/** Props for the Cascader component.
 * @example
 * ```tsx
 * <Cascader />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/cascader)
 */
export interface CascaderProps extends AccessControlledProps {
    /** Hierarchical option data for the cascade panels. */
    options: CascaderOption[];
    /** Controlled selected value path. */
    value?: string[];
    /** Initial value path for uncontrolled mode. */
    defaultValue?: string[];
    /** Placeholder text shown when no value is selected. */
    placeholder?: string;
    /** Size variant of the trigger control. */
    size?: "sm" | "md" | "lg";
    /** Whether multiple leaf values can be selected. */
    multiple?: boolean;
    /** Whether inline search filtering is enabled. */
    searchable?: boolean;
    /** How child panels are revealed on parent options. */
    expandTrigger?: "click" | "hover";
    /** Custom renderer for the displayed selected value. */
    displayRender?: (labels: string[]) => string;
    /** Callback fired when the selected path changes. */
    onValueChange?: (value: string[], selectedOptions: CascaderOption[]) => void;
    /** Field label displayed above the trigger. */
    label?: string;
    /** Whether to show the error state. */
    error?: boolean;
    /** Descriptive text below the label. */
    description?: string;
    /** Additional CSS class name. */
    className?: string;
}
/** Multi-level cascading selection input for hierarchical option trees. */
export declare const Cascader: React.ForwardRefExoticComponent<CascaderProps & React.RefAttributes<HTMLDivElement>>;
export default Cascader;
