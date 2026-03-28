import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type TourCoachmarkStep = {
    id: string;
    title: React.ReactNode;
    description: React.ReactNode;
    meta?: React.ReactNode;
    tone?: "info" | "success" | "warning";
};
/** Props for the TourCoachmarks component.
 * @example
 * ```tsx
 * <TourCoachmarks />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/tour-coachmarks)
 */
export interface TourCoachmarksProps extends AccessControlledProps {
    /** Ordered list of tour steps. */
    steps: TourCoachmarkStep[];
    /** Heading text for the tour overlay. */
    title?: React.ReactNode;
    /** Controlled open state of the tour. */
    open?: boolean;
    /** Initial open state for uncontrolled mode. */
    defaultOpen?: boolean;
    /** Controlled current step index. */
    currentStep?: number;
    /** Initial step index for uncontrolled mode. */
    defaultStep?: number;
    /** Callback fired when the active step changes. */
    onStepChange?: (index: number) => void;
    /** Callback fired when the tour is dismissed. */
    onClose?: () => void;
    /** Callback fired when the final step is completed. */
    onFinish?: () => void;
    /** Whether the user can skip the tour. */
    allowSkip?: boolean;
    /** Whether to show the step progress indicator. */
    showProgress?: boolean;
    /** Interaction mode: guided allows navigation, readonly disables it. */
    mode?: "guided" | "readonly";
    /** Locale-specific label overrides. */
    localeText?: {
        title?: React.ReactNode;
        skipLabel?: React.ReactNode;
        closeLabel?: React.ReactNode;
        previousLabel?: React.ReactNode;
        nextStepLabel?: React.ReactNode;
        finishLabel?: React.ReactNode;
        readonlyFinishLabel?: React.ReactNode;
    };
    className?: string;
    testIdPrefix?: string;
}
/** Step-by-step guided tour overlay for onboarding walkthroughs with progress and skip support. */
export declare const TourCoachmarks: React.ForwardRefExoticComponent<TourCoachmarksProps & React.RefAttributes<HTMLDivElement>>;
export default TourCoachmarks;
