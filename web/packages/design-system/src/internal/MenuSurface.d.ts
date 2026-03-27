import React from 'react';
import { type OverlayAlign, type OverlaySide } from './OverlayPositioning';
export type MenuSurfaceDismissReason = 'outside-click' | 'escape' | 'tab' | 'select';
export type MenuSurfaceItemType = 'action' | 'checkbox' | 'radio';
/** Options passed when the menu surface is dismissed.
 * @example
 * ```tsx
 * <MenuSurface />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/menu-surface)
 */
export interface MenuSurfaceDismissOptions {
    /** Whether focus should be restored to the trigger element. */
    restoreFocus?: boolean;
}
/** Base shape for a single menu item (recursive for submenus). */
export interface MenuSurfaceItemBase<TItem extends MenuSurfaceItemBase<TItem> = any> {
    /** Unique identifier for the item. */
    key: string;
    /** Primary label displayed for the item. */
    label: React.ReactNode;
    /** Optional group heading rendered above the item when it differs from the previous item's group. */
    groupLabel?: React.ReactNode;
    /** Secondary description shown below the label. */
    description?: React.ReactNode;
    /** Keyboard shortcut hint rendered on the trailing side. */
    shortcut?: React.ReactNode;
    /** Whether the item is non-interactive. */
    disabled?: boolean;
    /** Render the item with a destructive/danger style. */
    danger?: boolean;
    /** Semantic type determining the ARIA role of the item. */
    type?: MenuSurfaceItemType;
    /** Whether the item is checked (only for checkbox/radio types). */
    checked?: boolean;
    /** Leading icon rendered before the label. */
    icon?: React.ReactNode;
    /** Trailing badge rendered after the label. */
    badge?: React.ReactNode;
    /** Nested sub-menu items. */
    children?: TItem[];
}
/** Props for {@link MenuSurface}. */
export interface MenuSurfaceProps<TItem extends MenuSurfaceItemBase<TItem>> {
    /** Whether the menu is currently visible. */
    open: boolean;
    /** Array of menu items to render. */
    items: TItem[];
    /** Ref to the element that logically "owns" the menu (used for outside-click detection). */
    ownerRef: React.RefObject<HTMLElement | null>;
    /** Ref to the element the menu is anchored/positioned against. */
    anchorRef?: React.RefObject<HTMLElement | null>;
    /** Explicit DOM id for the menu element. */
    menuId?: string;
    /** Accessible label for the menu. */
    ariaLabel: string;
    /** Optional heading rendered at the top of the menu panel. */
    title?: React.ReactNode;
    /** Custom content rendered in the header area below the title. */
    headerContent?: React.ReactNode;
    /** Custom content rendered in the footer area below the items. */
    footerContent?: React.ReactNode;
    /** Index of the item that should receive initial focus. @default -1 */
    preferredFocusIndex?: number;
    /** Additional CSS class for the menu panel. */
    className?: string;
    /** Inline styles applied to the menu panel. */
    style?: React.CSSProperties;
    /** Test ID applied to the menu panel element. */
    panelTestId?: string;
    /** Function returning a test ID for a given item key. */
    itemTestId?: (key: string) => string | undefined;
    /** Callback fired when a non-disabled leaf item is selected. */
    onSelect?: (item: TItem, event?: React.MouseEvent<HTMLButtonElement>) => void;
    /** Callback fired when the menu requests to close, with the reason. */
    onRequestClose?: (reason: MenuSurfaceDismissReason, options?: MenuSurfaceDismissOptions) => void;
    /** Preferred side of the anchor to place the menu. @default "bottom" */
    side?: OverlaySide;
    /** Alignment along the anchor edge. @default "start" */
    align?: OverlayAlign;
    /** Gap in pixels between the anchor and the menu panel. @default 12 */
    gap?: number;
    /** Minimum distance in pixels from viewport edges. @default 12 */
    edgePadding?: number;
    /** Flip to the opposite side when the menu collides with the viewport. @default true */
    flipOnCollision?: boolean;
    /** Custom DOM element to portal into, or null for document.body. */
    portalTarget?: HTMLElement | null;
    /** Render inline instead of using a portal. @default false */
    disablePortal?: boolean;
    /** Fixed pixel coordinates to position the menu (bypasses anchor-based positioning). */
    coordinates?: {
        left: number;
        top: number;
    };
}
export declare const findEnabledMenuItemIndex: <TItem extends MenuSurfaceItemBase<TItem>>(items: TItem[], startIndex: number, direction: 1 | -1) => number;
/** Internal dropdown menu surface with keyboard navigation, search, sections, and nested submenus. */
export declare const MenuSurface: {
    <TItem extends MenuSurfaceItemBase<TItem>>({ open, items, ownerRef, anchorRef, menuId, ariaLabel, title, headerContent, footerContent, preferredFocusIndex, className, style, panelTestId, itemTestId, onSelect, onRequestClose, side, align, gap, edgePadding, flipOnCollision, portalTarget, disablePortal, coordinates, }: MenuSurfaceProps<TItem>): import("react/jsx-runtime").JSX.Element | null;
    displayName: string;
};
