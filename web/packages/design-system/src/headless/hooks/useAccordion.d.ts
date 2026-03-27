import type React from "react";
export interface UseAccordionOptions {
    /** Allow multiple panels open simultaneously (default: false) */
    multiple?: boolean;
    /** Default expanded panel keys (uncontrolled) */
    defaultExpandedKeys?: string[];
    /** Controlled expanded panel keys */
    expandedKeys?: string[];
    /** Called when expanded keys change */
    onExpandedChange?: (keys: string[]) => void;
}
export interface AccordionTriggerProps {
    id: string;
    role: "button";
    "aria-expanded": boolean;
    "aria-controls": string;
    tabIndex: number;
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
}
export interface AccordionPanelProps {
    id: string;
    role: "region";
    "aria-labelledby": string;
    hidden: boolean;
}
export interface AccordionItemState {
    isExpanded: boolean;
    getTriggerProps: (index: number) => AccordionTriggerProps;
    getPanelProps: () => AccordionPanelProps;
}
export interface UseAccordionReturn {
    /** Get state and prop getters for a specific item */
    getItemState: (key: string) => AccordionItemState;
    /** Currently expanded keys */
    expandedKeys: string[];
    /** Toggle a specific item */
    toggle: (key: string) => void;
    /** Expand a specific item */
    expand: (key: string) => void;
    /** Collapse a specific item */
    collapse: (key: string) => void;
    /** Collapse all items */
    collapseAll: () => void;
}
export declare function useAccordion(options?: UseAccordionOptions): UseAccordionReturn;
