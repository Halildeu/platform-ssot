import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
/** Props for {@link ReportFilterPanel}.
 * @example
 * ```tsx
 * <ReportFilterPanel />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/report-filter-panel)
 */
export interface ReportFilterPanelProps extends AccessControlledProps {
    /** Whether a filter request is in progress (disables submit/reset). */
    loading?: boolean;
    /** Label for the submit button. @default "Filtrele" */
    submitLabel?: string;
    /** Label for the reset button. @default "Sifirla" */
    resetLabel?: string;
    /** Callback fired when the filter form is submitted. */
    onSubmit?: () => void;
    /** Callback fired when the reset button is clicked. */
    onReset?: () => void;
    /** Test ID applied to the form element. */
    testId?: string;
    /** Test ID applied to the submit button. */
    submitTestId?: string;
    /** Test ID applied to the reset button. */
    resetTestId?: string;
    /** Filter form controls rendered as flex children. */
    children: React.ReactNode;
}
/** Horizontal filter form panel with submit/reset buttons and loading state for report screens. */
export declare const ReportFilterPanel: React.ForwardRefExoticComponent<ReportFilterPanelProps & React.RefAttributes<HTMLFormElement>>;
/** Type alias for ReportFilterPanel ref. */
export type ReportFilterPanelRef = React.Ref<HTMLElement>;
/** Type alias for ReportFilterPanel element. */
export type ReportFilterPanelElement = HTMLElement;
/** Type alias for ReportFilterPanel cssproperties. */
export type ReportFilterPanelCSSProperties = React.CSSProperties;
