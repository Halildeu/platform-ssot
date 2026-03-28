import React from 'react';
import { type AccessControlledProps } from '../../internal/access-controller';
import { type FieldSize } from '../../primitives/_shared/FieldControlPrimitives';
export type ComboboxOption = {
    label: string;
    value: string;
    description?: string;
    keywords?: string[];
    disabled?: boolean;
    disabledReason?: string;
};
export type ComboboxOptionGroup = {
    label: string;
    options: ComboboxOption[];
    disabled?: boolean;
};
export type ComboboxResolvedOption = ComboboxOption & {
    groupLabel?: string;
    effectiveDisabled?: boolean;
    created?: boolean;
};
export type ComboboxSelectionMode = 'single' | 'multiple' | 'tags';
export type ComboboxDisabledItemFocusPolicy = 'skip' | 'allow';
export type ComboboxPopupSide = 'bottom' | 'top';
export type ComboboxPopupAlign = 'start' | 'end';
export type ComboboxPopupStrategy = 'inline' | 'portal';
export type ComboboxRenderOptionState = {
    highlighted: boolean;
    selected: boolean;
    disabled: boolean;
    query: string;
    index: number;
};
/** Props for the Combobox component.
 * @example
 * ```tsx
 * <Combobox />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/combobox)
 */
export interface ComboboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'children' | 'onSelect'>, AccessControlledProps {
    /** Field label displayed above the input. */
    label?: React.ReactNode;
    /** Descriptive text below the label. */
    description?: React.ReactNode;
    /** Help text displayed below the input. */
    hint?: React.ReactNode;
    /** Error message that activates the invalid state. */
    error?: React.ReactNode;
    /** Whether the input is in an invalid state. */
    invalid?: boolean;
    /** Size variant of the field control. */
    size?: FieldSize;
    /** Selection behavior: single value, multiple values, or free-form tags. */
    selectionMode?: ComboboxSelectionMode;
    /** Controlled selected value for single mode. */
    value?: string | null;
    /** Initial selected value for uncontrolled single mode. */
    defaultValue?: string | null;
    /** Controlled selected values for multiple/tag mode. */
    values?: string[];
    /** Initial selected values for uncontrolled multiple/tag mode. */
    defaultValues?: string[];
    /** Controlled text in the search input. */
    inputValue?: string;
    /** Initial search text for uncontrolled mode. */
    defaultInputValue?: string;
    /** Available options or option groups. */
    options: Array<ComboboxOption | ComboboxOptionGroup>;
    /** Whether freeform text can be committed as a value. */
    freeSolo?: boolean;
    onInputChange?: (inputValue: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
    onQueryRequest?: (query: string) => void;
    queryDebounceMs?: number;
    onValueChange?: (value: string | null, option: ComboboxOption | null) => void;
    onValuesChange?: (values: string[], options: ComboboxResolvedOption[]) => void;
    onSelect?: (value: string, option: ComboboxOption) => void;
    onTagRemove?: (value: string, option: ComboboxResolvedOption | null) => void;
    onFreeSoloCommit?: (value: string) => void;
    onHighlightChange?: (value: string | null, option: ComboboxOption | null) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    loading?: boolean;
    loadingText?: React.ReactNode;
    noOptionsText?: React.ReactNode;
    clearable?: boolean;
    clearLabel?: string;
    emptyStateLabel?: React.ReactNode;
    showAccessReasonHint?: boolean;
    fullWidth?: boolean;
    renderOption?: (option: ComboboxResolvedOption, state: ComboboxRenderOptionState) => React.ReactNode;
    disabledItemFocusPolicy?: ComboboxDisabledItemFocusPolicy;
    popupStrategy?: ComboboxPopupStrategy;
    popupSide?: ComboboxPopupSide;
    popupAlign?: ComboboxPopupAlign;
    portalTarget?: HTMLElement | null;
    popupClassName?: string;
    listboxClassName?: string;
    flipOnCollision?: boolean;
    popupCollisionPadding?: number;
    tagRemoveLabel?: string;
}
/** Searchable selection input supporting single, multiple, and tag modes with grouped options. */
export declare const Combobox: React.ForwardRefExoticComponent<ComboboxProps & React.RefAttributes<HTMLInputElement>>;
export default Combobox;
