import React from "react";
import type { SlotProps } from "../../primitives/_shared/slot-types";
import { type AccessControlledProps } from "../../internal/access-controller";
export type TabsVariant = "line" | "enclosed" | "pill" | "standard" | "fullWidth" | "scrollable";
export type TabsSize = "sm" | "md" | "lg";
export type TabsDensity = "compact" | "comfortable" | "spacious";
export interface TabItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    disabled?: boolean;
    /** Description shown below tab content */
    description?: React.ReactNode;
    /** Show close button on tab */
    closable?: boolean;
    content: React.ReactNode;
}
export type TabsSlot = "root" | "list" | "trigger" | "content";
export interface TabsProps extends AccessControlledProps {
    items: TabItem[];
    variant?: TabsVariant;
    size?: TabsSize;
    /** Controlled active key */
    activeKey?: string;
    defaultActiveKey?: string;
    onChange?: (key: string) => void;
    /** Called when a closable tab's close button is clicked */
    onCloseTab?: (key: string) => void;
    /** Full width tabs */
    fullWidth?: boolean;
    className?: string;
    /** Density controls gap, text size, and padding of tab buttons */
    density?: TabsDensity;
    /** Override props (className, style, etc.) on internal slot elements */
    slotProps?: SlotProps<TabsSlot>;
}
/**
 * Segmented content switcher with line, enclosed, and pill variants.
 *
 * @example
 * ```tsx
 * <Tabs
 *   items={[
 *     { key: 'overview', label: 'Overview', content: <Overview /> },
 *     { key: 'settings', label: 'Settings', content: <Settings /> },
 *   ]}
 *   variant="line"
 *   defaultActiveKey="overview"
 * />
 * ```
 */
export declare const Tabs: React.ForwardRefExoticComponent<TabsProps & React.RefAttributes<HTMLDivElement>>;
