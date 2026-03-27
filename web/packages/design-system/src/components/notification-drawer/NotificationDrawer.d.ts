import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import { type OverlayCloseReason } from "../../internal/OverlaySurface";
import { type NotificationPanelProps } from "./NotificationPanel";
/** Props for the NotificationDrawer component.
 * @example
 * ```tsx
 * <NotificationDrawer />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/notification-drawer)
 */
export interface NotificationDrawerProps extends AccessControlledProps, Omit<NotificationPanelProps, "className" | "access" | "accessReason" | "headerAccessory"> {
    /** Whether the drawer is open. */
    open: boolean;
    /** Callback fired when the drawer is dismissed. */
    onClose?: (reason: OverlayCloseReason) => void;
    /** Accessible label for the close button. */
    closeLabel?: string;
    /** Whether clicking the overlay backdrop closes the drawer. */
    closeOnOverlayClick?: boolean;
    /** Whether pressing Escape closes the drawer. */
    closeOnEscape?: boolean;
    /** Keep the drawer DOM mounted when closed. */
    keepMounted?: boolean;
    /** Destroy drawer content when hidden. */
    destroyOnHidden?: boolean;
    /** Target element for the portal. */
    portalTarget?: HTMLElement | null;
    /** Disable React portal rendering. */
    disablePortal?: boolean;
    /** Accessible label for the drawer dialog. */
    dialogLabel?: string;
    /** Tailwind class controlling drawer width. */
    widthClassName?: string;
    /** Additional CSS class for the inner panel. */
    panelClassName?: string;
}
/** Slide-over drawer that wraps the NotificationPanel in an overlay surface. */
export declare const NotificationDrawer: React.ForwardRefExoticComponent<NotificationDrawerProps & React.RefAttributes<HTMLDivElement>>;
export default NotificationDrawer;
/** Type alias for NotificationDrawer ref. */
export type NotificationDrawerRef = React.Ref<HTMLElement>;
/** Type alias for NotificationDrawer element. */
export type NotificationDrawerElement = HTMLElement;
/** Type alias for NotificationDrawer cssproperties. */
export type NotificationDrawerCSSProperties = React.CSSProperties;
