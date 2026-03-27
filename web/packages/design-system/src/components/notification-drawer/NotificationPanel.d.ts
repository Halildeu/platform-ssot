import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import { type NotificationItemCardProps, type NotificationSurfaceItem } from "./NotificationItemCard";
export type NotificationPanelFilter = "all" | "unread" | "high-priority" | "pinned";
export type NotificationPanelGrouping = "none" | "priority";
export type NotificationPanelDateGrouping = "none" | "relative-day";
type NotificationPanelSectionKey = "pinned" | "high-priority" | "other";
type NotificationPanelDateSectionKey = "today" | "yesterday" | "older";
/**
 * NotificationPanel renders a filterable, groupable list of notifications
 * with bulk actions and optional multi-select support.
 * @example
 * ```tsx
 * <NotificationPanel />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/notification-panel)

 */
export interface NotificationPanelProps extends AccessControlledProps {
    /** Array of notification items to display. */
    items: NotificationSurfaceItem[];
    /** Panel heading text. */
    title?: React.ReactNode;
    /** Summary line shown below the title (e.g. unread count). */
    summaryLabel?: React.ReactNode;
    /** Title shown when the items array is empty. */
    emptyTitle?: React.ReactNode;
    /** Description shown in the empty state. */
    emptyDescription?: string;
    /** Title shown when no items match the active filter. */
    filteredEmptyTitle?: React.ReactNode;
    /** Additional CSS class name. */
    className?: string;
    /** Label for the "mark all as read" button. */
    markAllReadLabel?: string;
    /** Label for the "clear" button. */
    clearLabel?: string;
    /** Label for the per-item remove action. */
    removeLabel?: string;
    /** Custom element rendered in the header actions area. */
    headerAccessory?: React.ReactNode;
    /** Returns a label for each item's primary action button. */
    getPrimaryActionLabel?: NotificationItemCardProps["getPrimaryActionLabel"];
    /** Callback fired when a notification's primary action is triggered. */
    onPrimaryAction?: NotificationItemCardProps["onPrimaryAction"];
    /** Callback fired when a single notification is removed. */
    onRemoveItem?: (id: string) => void;
    /** Callback fired when "mark all as read" is clicked. */
    onMarkAllRead?: () => void;
    /** Callback fired when "clear" is clicked. */
    onClear?: () => void;
    /** Custom timestamp formatter for notification cards. */
    formatTimestamp?: NotificationItemCardProps["formatTimestamp"];
    /** Whether to show the filter bar. @default false */
    showFilters?: boolean;
    /** Which filter options are available. */
    availableFilters?: NotificationPanelFilter[];
    /** Controlled active filter value. */
    activeFilter?: NotificationPanelFilter;
    /** Initial filter for uncontrolled mode. @default "all" */
    defaultFilter?: NotificationPanelFilter;
    /** Callback fired when the active filter changes. */
    onFilterChange?: (filter: NotificationPanelFilter) => void;
    /** Group items by priority. @default "none" */
    grouping?: NotificationPanelGrouping;
    /** Custom labels for each filter option. */
    filterLabels?: Partial<Record<NotificationPanelFilter, string>>;
    /** Custom labels for priority-based section headers. */
    sectionLabels?: Partial<Record<NotificationPanelSectionKey, React.ReactNode>>;
    /** Group items by relative date. @default "none" */
    dateGrouping?: NotificationPanelDateGrouping;
    /** Custom labels for date-based section headers. */
    dateSectionLabels?: Partial<Record<NotificationPanelDateSectionKey, React.ReactNode>>;
    /** Reference timestamp (epoch ms) used for date bucketing. @default Date.now() */
    dateGroupingReferenceTime?: number;
    /** Enable checkbox selection on notification items. @default false */
    selectable?: boolean;
    /** Controlled set of selected item IDs. */
    selectedIds?: string[];
    /** Initial selected IDs for uncontrolled mode. */
    defaultSelectedIds?: string[];
    /** Callback fired when the selected IDs change. */
    onSelectedIdsChange?: (ids: string[]) => void;
    /** Label for the "select visible" toggle button. */
    selectVisibleLabel?: string;
    /** Label for the "clear selection" button. */
    clearSelectionLabel?: string;
    /** Label for the "mark selected as read" button. */
    markSelectedReadLabel?: string;
    /** Label for the "remove selected" button. */
    removeSelectedLabel?: string;
    /** Render function for the selection count badge. */
    selectionSummaryLabel?: (count: number) => React.ReactNode;
    /** Returns an accessible label for each selectable item's checkbox. */
    getSelectionLabel?: (item: NotificationSurfaceItem) => string;
    /** Callback fired when selected items are marked as read. */
    onMarkSelectedRead?: (ids: string[]) => void;
    /** Callback fired when selected items are removed. */
    onRemoveSelected?: (ids: string[]) => void;
}
export declare const NotificationPanel: React.ForwardRefExoticComponent<NotificationPanelProps & React.RefAttributes<HTMLDivElement>>;
export default NotificationPanel;
