import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import { type FieldSize } from "../_shared/FieldControlPrimitives";
export type TextAreaResize = "vertical" | "none" | "auto";
/** Props for the Textarea component.
 * @example
 * ```tsx
 * <Textarea />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/textarea)
 */
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "children">, AccessControlledProps {
    /** Field label displayed above the textarea. */
    label?: React.ReactNode;
    /** Descriptive text below the label. */
    description?: React.ReactNode;
    /** Help text displayed below the textarea. */
    hint?: React.ReactNode;
    /** Error message that activates the invalid state. */
    error?: React.ReactNode;
    /** Size variant of the field control. */
    size?: FieldSize;
    /** Visual element rendered before the text area. */
    leadingVisual?: React.ReactNode;
    /** Visual element rendered after the text area. */
    trailingVisual?: React.ReactNode;
    /** Native change event handler. */
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    /** Callback fired with the new string value on change. */
    onValueChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    /** Whether to display a character count indicator. */
    showCount?: boolean;
    /** Whether the textarea spans the full container width. */
    fullWidth?: boolean;
    /** Resize behavior of the textarea. */
    resize?: TextAreaResize;
    /** Show a loading indicator and disable editing */
    loading?: boolean;
}
/** Multi-line text input with field shell, auto-resize, character count, and access control. */
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
/** Alias for backward compatibility */
export declare const TextArea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
