import React from "react";
import { type AccessControlledProps } from "../../internal/interaction-core";
import { type FieldDensity, type FieldSize } from "../_shared/FieldControlPrimitives";
export type InputSize = FieldSize;
/** Props for the Input component. */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "children" | "prefix">, AccessControlledProps {
    label?: React.ReactNode;
    description?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    size?: FieldSize;
    /** @deprecated Use `size` instead. Will be removed in v3.0.0. */
    inputSize?: FieldSize;
    density?: FieldDensity;
    leadingVisual?: React.ReactNode;
    trailingVisual?: React.ReactNode;
    /** Alias — same as leadingVisual */
    prefix?: React.ReactNode;
    /** Alias — same as trailingVisual */
    suffix?: React.ReactNode;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onValueChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    showCount?: boolean;
    fullWidth?: boolean;
    /** Show a loading spinner in the trailing slot and make the input readonly */
    loading?: boolean;
}
/**
 * Full-featured text input with field shell, label, visuals, character count, and access control.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="you@example.com"
 *   error={errors.email}
 *   onChange={handleChange}
 * />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/input)
 */
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
/** Alias for backward compatibility */
export declare const TextInput: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
