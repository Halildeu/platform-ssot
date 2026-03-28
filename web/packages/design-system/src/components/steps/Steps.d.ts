import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type StepsSize = "sm" | "md" | "lg";
export type StepsDirection = "horizontal" | "vertical";
export type StepStatus = "wait" | "process" | "finish" | "error";
export interface StepItem {
    /** Unique key */
    key: string;
    /** Step label */
    title: React.ReactNode;
    /** Optional description */
    description?: React.ReactNode;
    /** Optional icon override */
    icon?: React.ReactNode;
    /** Disable this step */
    disabled?: boolean;
}
export interface StepsProps extends AccessControlledProps {
    /** Step definitions */
    items: StepItem[];
    /** Currently active step index (0-based) */
    current?: number;
    /** Initial active step index for uncontrolled mode. Ignored when `current` is provided. */
    defaultCurrent?: number;
    /** Direction */
    direction?: StepsDirection;
    /** Size */
    size?: StepsSize;
    /** Called when a step is clicked */
    onChange?: (index: number) => void;
    /** Mark current step as error */
    status?: StepStatus;
    /** Use dot style instead of numbers */
    dot?: boolean;
    className?: string;
}
/**
 * Progress indicator for multi-step workflows with numbered or dot variants.
 *
 * @example
 * ```tsx
 * <Steps
 *   current={1}
 *   items={[
 *     { key: 'info', title: 'Information' },
 *     { key: 'review', title: 'Review' },
 *     { key: 'confirm', title: 'Confirm' },
 *   ]}
 *   onChange={setStep}
 * />
 * ```
 */
export declare const Steps: React.ForwardRefExoticComponent<StepsProps & React.RefAttributes<HTMLDivElement>>;
