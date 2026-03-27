import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type PromptComposerScope = "general" | "approval" | "policy" | "release";
export type PromptComposerTone = "neutral" | "strict" | "exploratory";
/**
 * PromptComposer provides a structured prompt authoring surface with
 * scope selection, tone control, guardrail badges, and source anchors.
 * @example
 * ```tsx
 * <PromptComposer />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/prompt-composer)

 */
export interface PromptComposerProps extends AccessControlledProps {
    /** Section heading. @default "Prompt olusturucu" */
    title?: React.ReactNode;
    /** Explanatory text below the title. */
    description?: React.ReactNode;
    /** Controlled prompt subject/title value. */
    subject?: string;
    /** Initial subject for uncontrolled mode. */
    defaultSubject?: string;
    /** Callback fired when the subject changes. */
    onSubjectChange?: (value: string) => void;
    /** Controlled prompt body value. */
    value?: string;
    /** Initial body for uncontrolled mode. */
    defaultValue?: string;
    /** Callback fired when the body text changes. */
    onValueChange?: (value: string) => void;
    /** Controlled scope selection. */
    scope?: PromptComposerScope;
    /** Initial scope for uncontrolled mode. @default "general" */
    defaultScope?: PromptComposerScope;
    /** Callback fired when the scope changes. */
    onScopeChange?: (value: PromptComposerScope) => void;
    /** Controlled tone selection. */
    tone?: PromptComposerTone;
    /** Initial tone for uncontrolled mode. @default "neutral" */
    defaultTone?: PromptComposerTone;
    /** Callback fired when the tone changes. */
    onToneChange?: (value: PromptComposerTone) => void;
    /** Maximum character count for the prompt body. @default 1200 */
    maxLength?: number;
    /** List of guardrail labels shown as warning badges. */
    guardrails?: string[];
    /** List of source anchor labels shown as reference badges. */
    citations?: string[];
    /** Optional footer note rendered below the side panel. */
    footerNote?: React.ReactNode;
    /** Additional CSS class name. */
    className?: string;
}
export declare const PromptComposer: React.ForwardRefExoticComponent<PromptComposerProps & React.RefAttributes<HTMLDivElement>>;
export default PromptComposer;
/** Ref type for PromptComposer. */
export type PromptComposerRef = React.Ref<HTMLDivElement>;
