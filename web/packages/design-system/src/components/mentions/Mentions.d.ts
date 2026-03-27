import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type MentionOption = {
    key: string;
    label: string;
    description?: string;
    avatar?: string;
    disabled?: boolean;
};
export interface MentionsProps extends AccessControlledProps {
    /** Current value (controlled). */
    value?: string;
    /** Default value for uncontrolled usage. */
    defaultValue?: string;
    /** Available mention options. */
    options: MentionOption[];
    /** Trigger character. @default "@" */
    trigger?: string;
    /** Placeholder text. @default "Bir sey yazin..." */
    placeholder?: string;
    /** Number of textarea rows. @default 3 */
    rows?: number;
    /** Called when value changes. */
    onValueChange?: (value: string) => void;
    /** Called when a mention option is selected. */
    onSelect?: (option: MentionOption) => void;
    /** Called when search text changes after trigger. */
    onSearch?: (text: string, trigger: string) => void;
    /** Custom filter function. */
    filterOption?: (input: string, option: MentionOption) => boolean;
    /** Label for the textarea. */
    label?: string;
    /** Error state. @default false */
    error?: boolean;
    /** Description text below the textarea. */
    description?: string;
    /** Size variant. @default "md" */
    size?: "sm" | "md" | "lg";
    /** Additional class name for the root element. */
    className?: string;
}
export declare const Mentions: React.ForwardRefExoticComponent<MentionsProps & React.RefAttributes<HTMLDivElement>>;
export default Mentions;
