import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import type { SlotProps } from "../../primitives/_shared/slot-types";
export type AccordionSelectionMode = "single" | "multiple";
export type AccordionSize = "sm" | "md";
export type AccordionExpandIconPosition = "start" | "end";
export type AccordionCollapsible = "header" | "icon" | "disabled";
export interface AccordionSectionInput {
    key: string;
    title: React.ReactNode;
    content?: React.ReactNode;
    description?: React.ReactNode;
    extra?: React.ReactNode;
    defaultExpanded?: boolean;
    disabled?: boolean;
    sections?: AccordionSectionInput[];
}
export interface CreateAccordionItemsFromSectionsOptions {
    nestedSelectionMode?: AccordionSelectionMode;
    nestedSize?: AccordionSize;
    nestedBordered?: boolean;
    nestedGhost?: boolean;
    nestedDisableGutters?: boolean;
    nestedCollapsible?: AccordionCollapsible;
    renderSectionContent?: (section: AccordionSectionInput) => React.ReactNode;
}
export type AccordionPresetKind = "faq" | "compact" | "settings";
export interface AccordionClasses {
    root?: string;
    item?: string;
    trigger?: string;
    header?: string;
    titleRow?: string;
    title?: string;
    description?: string;
    extra?: string;
    iconButton?: string;
    icon?: string;
    panel?: string;
    panelInner?: string;
}
export interface AccordionItem {
    value: string;
    title: React.ReactNode;
    content: React.ReactNode;
    description?: React.ReactNode;
    extra?: React.ReactNode;
    disabled?: boolean;
    defaultExpanded?: boolean;
    forceRender?: boolean;
    destroyOnHidden?: boolean;
    collapsible?: AccordionCollapsible;
    headerClassName?: string;
    panelClassName?: string;
}
export type AccordionSlot = "root" | "item" | "trigger" | "content";
/** Props for the Accordion component. */
export interface AccordionProps extends AccessControlledProps {
    /** Accordion section items to render. */
    items: AccordionItem[];
    /** Controlled expanded section value(s). */
    value?: string | string[];
    /** Initially expanded section(s) for uncontrolled mode. */
    defaultValue?: string | string[];
    /** Callback fired when the expanded sections change. */
    onValueChange?: (nextValue: string[]) => void;
    /** Callback fired when a single item is toggled. */
    onItemToggle?: (itemValue: string, expanded: boolean) => void;
    /** Whether one or multiple sections can be open simultaneously. */
    selectionMode?: AccordionSelectionMode;
    /** Accessible label for the accordion. */
    ariaLabel?: string;
    /** Size variant for header and content spacing. */
    size?: AccordionSize;
    /** Whether to show borders between sections. */
    bordered?: boolean;
    /** Whether to use the ghost (transparent) appearance. */
    ghost?: boolean;
    /** Whether to show the expand/collapse arrow indicator. */
    showArrow?: boolean;
    /** Custom expand icon element. */
    expandIcon?: React.ReactNode;
    /** Position of the expand icon relative to the header. */
    expandIconPosition?: AccordionExpandIconPosition;
    /** Whether to remove horizontal padding from sections. */
    disableGutters?: boolean;
    /** Whether to unmount collapsed section content from the DOM. */
    destroyOnHidden?: boolean;
    /** Controls which part of the header triggers collapse. */
    collapsible?: AccordionCollapsible;
    /** Custom class name overrides for sub-elements. */
    classes?: AccordionClasses;
    /** Additional CSS class name. */
    className?: string;
    /** Override props (className, style, etc.) on internal slot elements */
    slotProps?: SlotProps<AccordionSlot>;
}
export interface AccordionPreset {
    selectionMode: AccordionSelectionMode;
    size: AccordionSize;
    bordered: boolean;
    ghost: boolean;
    showArrow: boolean;
    expandIconPosition: AccordionExpandIconPosition;
    disableGutters: boolean;
    destroyOnHidden: boolean;
    collapsible: AccordionCollapsible;
}
/**
 * Collapsible content panels with single or multiple expand modes, keyboard navigation, and preset support.
 *
 * @example
 * ```tsx
 * <Accordion
 *   items={[
 *     { value: 'faq-1', title: 'How do I reset my password?', content: <p>Go to Settings...</p> },
 *     { value: 'faq-2', title: 'Where is my order?', content: <p>Track your order...</p> },
 *   ]}
 *   selectionMode="single"
 * />
 * ```
 */
export declare const Accordion: React.ForwardRefExoticComponent<AccordionProps & React.RefAttributes<HTMLDivElement>>;
export declare function createAccordionItemsFromSections(sections: AccordionSectionInput[], options?: CreateAccordionItemsFromSectionsOptions): AccordionItem[];
export declare function createAccordionPreset(kind: AccordionPresetKind): AccordionPreset;
export default Accordion;
