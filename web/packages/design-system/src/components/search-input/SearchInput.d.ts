import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type SearchInputSize = "sm" | "md" | "lg";
export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">, AccessControlledProps {
    /** Component size */
    size?: SearchInputSize;
    /** @deprecated Use `size` instead. Will be removed in v3.0.0. */
    searchSize?: SearchInputSize;
    /** Show loading spinner */
    loading?: boolean;
    /** Show clear button when value is non-empty */
    clearable?: boolean;
    /** Callback fired when the clear button is clicked. */
    onClear?: () => void;
    /** Keyboard shortcut hint (e.g. "⌘K") */
    shortcutHint?: string;
    /** Disable the search input */
    disabled?: boolean;
}
/**
 * Search input field with built-in search icon, clear button, loading state, and keyboard shortcut hint.
 *
 * @example
 * ```tsx
 * <SearchInput
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   onClear={() => setQuery('')}
 *   shortcutHint="⌘K"
 *   loading={isSearching}
 * />
 * ```
 */
export declare const SearchInput: React.ForwardRefExoticComponent<SearchInputProps & React.RefAttributes<HTMLInputElement>>;
