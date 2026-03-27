import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type NotificationItemType = "success" | "info" | "warning" | "error" | "loading";
export type NotificationItemPriority = "normal" | "high";
export type NotificationSurfaceItem = {
    id: string;
    message: string;
    description?: string;
    type?: NotificationItemType;
    priority?: NotificationItemPriority;
    pinned?: boolean;
    createdAt?: number;
    read?: boolean;
    meta?: Record<string, unknown>;
};
/** Props for the NotificationItemCard component.
 * @example
 * ```tsx
 * <NotificationItemCard />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/notification-item-card)
 */
export interface NotificationItemCardProps extends AccessControlledProps {
    /** Notification data to render. */
    item: NotificationSurfaceItem;
    /** Additional CSS class name. */
    className?: string;
    /** Accessible label for the remove button. */
    removeLabel?: string;
    /** Returns the primary action button label for a given item, or null to hide it. */
    getPrimaryActionLabel?: (item: NotificationSurfaceItem) => string | null | undefined;
    /** Callback fired when the primary action button is clicked. */
    onPrimaryAction?: (item: NotificationSurfaceItem) => void;
    /** Callback fired when the remove button is clicked. */
    onRemove?: (id: string) => void;
    /** Custom formatter for the notification timestamp. */
    formatTimestamp?: (timestamp: number | undefined, item: NotificationSurfaceItem) => React.ReactNode;
    /** Whether the card shows a selection checkbox. */
    selectable?: boolean;
    /** Whether the card is currently selected. */
    selected?: boolean;
    /** Accessible label for the selection checkbox. */
    selectLabel?: string;
    /** Callback fired when the selection state changes. */
    onSelectedChange?: (item: NotificationSurfaceItem, selected: boolean) => void;
}
/** Individual notification card with type indicator, timestamp, and optional primary action. */
export declare const NotificationItemCard: React.ForwardRefExoticComponent<NotificationItemCardProps & React.RefAttributes<HTMLDivElement>>;
export default NotificationItemCard;
