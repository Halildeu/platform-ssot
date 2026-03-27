import React from "react";
import { type FieldSize } from "../../primitives/_shared/FieldControlPrimitives";
import { type AccessControlledProps } from "../../internal/access-controller";
export type AutocompleteOption = {
    value: string;
    label: string;
};
export interface AutocompleteProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "value" | "defaultValue" | "children">, AccessControlledProps {
    /** Controlled input value. */
    value?: string;
    /** Initial value for uncontrolled mode. */
    defaultValue?: string;
    /** Callback fired when the value changes. */
    onChange?: (value: string) => void;
    /** Available suggestion options. */
    options: AutocompleteOption[];
    /** Async search handler — called on input change with debounce */
    onSearch?: (query: string) => void;
    /** Whether a loading spinner is shown in the dropdown. */
    loading?: boolean;
    /** Size variant of the field control. */
    size?: FieldSize;
    /** Whether the input is disabled. */
    disabled?: boolean;
    /** Whether the input is in an invalid state. */
    invalid?: boolean;
    /** Error message that activates the invalid state. */
    error?: React.ReactNode;
    /** Field label displayed above the input. */
    label?: React.ReactNode;
    /** Descriptive text below the label. */
    description?: React.ReactNode;
    /** Help text displayed below the input. */
    hint?: React.ReactNode;
    /** Placeholder text shown when empty. */
    placeholder?: string;
    /** Additional CSS class name. */
    className?: string;
    /** Whether the input spans the full container width. */
    fullWidth?: boolean;
    /** If true, allows freeform text; if false, only options can be selected */
    allowCustomValue?: boolean;
    /** Max number of suggestions shown */
    maxSuggestions?: number;
}
/** Input with dropdown suggestions supporting type-ahead filtering, async search, and keyboard navigation.
   * @example
   * ```tsx
   * <Autocomplete />
   * ```
   * @since 1.0.0
   * @see [Docs](https://design.mfe.dev/components/autocomplete)
   */
export declare const Autocomplete: React.ForwardRefExoticComponent<AutocompleteProps & React.RefAttributes<HTMLInputElement>>;
