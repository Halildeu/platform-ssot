import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export interface CommandPaletteItem {
    id: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    group?: string;
    shortcut?: string;
    keywords?: string[];
    disabled?: boolean;
    badge?: React.ReactNode;
}
/** Props for the CommandPalette component. */
export interface CommandPaletteProps extends AccessControlledProps {
    /** Whether the command palette overlay is visible. */
    open: boolean;
    /** Available command items to search and select. */
    items: CommandPaletteItem[];
    /** Heading text for the palette dialog. */
    title?: React.ReactNode;
    /** Subtitle text displayed below the heading. */
    subtitle?: React.ReactNode;
    /** Controlled search query value. */
    query?: string;
    /** Initial search query for uncontrolled mode. */
    defaultQuery?: string;
    /** Callback fired when the search query changes. */
    onQueryChange?: (query: string) => void;
    /** Callback fired when a command item is selected. */
    onSelect?: (id: string, item: CommandPaletteItem) => void;
    /** Callback fired when the palette is dismissed. */
    onClose?: () => void;
    /** Placeholder text for the search input. */
    placeholder?: string;
    /** Label shown when no commands match the query. */
    emptyStateLabel?: string;
    /** Custom content rendered in the palette footer. */
    footer?: React.ReactNode;
}
/**
 * Keyboard-driven search overlay for quickly finding and executing commands or navigating routes.
 *
 * @example
 * ```tsx
 * <CommandPalette
 *   open={isOpen}
 *   items={[
 *     { id: 'dashboard', title: 'Go to Dashboard', group: 'Navigation' },
 *     { id: 'settings', title: 'Open Settings', shortcut: '⌘,' },
 *   ]}
 *   onSelect={(id) => navigate(id)}
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */
export declare const CommandPalette: React.ForwardRefExoticComponent<CommandPaletteProps & React.RefAttributes<HTMLDivElement>>;
export default CommandPalette;
