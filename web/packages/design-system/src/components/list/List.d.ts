import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type ListDensity = "comfortable" | "compact";
export type ListTone = "default" | "info" | "success" | "warning" | "danger";
export type ListItem = {
    key: React.Key;
    title: React.ReactNode;
    description?: React.ReactNode;
    meta?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    badges?: Array<React.ReactNode | string>;
    tone?: ListTone;
    disabled?: boolean;
};
/** Props for the List component.
 * @example
 * ```tsx
 * <List />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/list)
 */
export interface ListProps extends AccessControlledProps {
    /** Data items to render in the list. */
    items: ListItem[];
    /** Heading text above the list. */
    title?: React.ReactNode;
    /** Descriptive text below the heading. */
    description?: React.ReactNode;
    /** Row spacing density variant. */
    density?: ListDensity;
    /** Whether to show a border around the list container. */
    bordered?: boolean;
    /** Label shown when the list is empty. */
    emptyStateLabel?: React.ReactNode;
    /** Locale-specific label overrides. */
    localeText?: {
        emptyFallbackDescription?: React.ReactNode;
    };
    /** Whether to show loading skeleton rows. */
    loading?: boolean;
    /** Key of the currently selected item. */
    selectedKey?: React.Key | null;
    /** Callback fired when a list item is selected. */
    onItemSelect?: (key: React.Key) => void;
    /** Whether the list spans the full container width. */
    fullWidth?: boolean;
}
/** Vertical list of interactive or static items with optional selection, badges, and tone indicators. */
export declare const List: React.ForwardRefExoticComponent<ListProps & React.RefAttributes<HTMLElement>>;
export default List;
