import React from "react";
export type AlertVariant = "info" | "success" | "warning" | "error";
/**
 * Alert renders a feedback message banner with semantic variants, an optional
 * title, icon, action slot, and close button.
 */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    /** Semantic color variant. @default "info" */
    variant?: AlertVariant;
    /** @deprecated Use `variant` instead. Will be removed in v3.0.0. */
    severity?: AlertVariant;
    /** Optional bold heading above the message body. */
    title?: React.ReactNode;
    /** Custom leading icon; defaults to the variant's built-in icon. */
    icon?: React.ReactNode;
    /** Show a close/dismiss button. @default false */
    closable?: boolean;
    /** Callback fired when the close button is clicked. */
    onClose?: () => void;
    /** Action element (e.g. button) rendered below the message body. */
    action?: React.ReactNode;
    /**
     * Render via Slot — merges Alert root styling onto the child element.
     * When asChild is true, Alert's internal layout (icon, title, close button)
     * is not rendered; only the root styling and role are merged.
     * @example <Alert asChild variant="error"><MyCustomAlert>...</MyCustomAlert></Alert>
     */
    asChild?: boolean;
}
/**
 * Contextual feedback banner with semantic variants, optional title, icon, action slot, and close button.
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Saved" closable onClose={dismiss}>
 *   Your changes have been saved successfully.
 * </Alert>
 * ```
 */
export declare const Alert: React.ForwardRefExoticComponent<AlertProps & React.RefAttributes<HTMLDivElement>>;
