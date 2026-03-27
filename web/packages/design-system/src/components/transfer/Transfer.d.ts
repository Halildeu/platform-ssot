import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type TransferItem = {
    key: string;
    label: string;
    description?: string;
    disabled?: boolean;
};
export type TransferDirection = "left" | "right";
export type TransferLocaleText = {
    searchPlaceholder?: string;
    notFound?: string;
    selectAll?: string;
    deselectAll?: string;
    itemUnit?: string;
    itemsUnit?: string;
};
export type TransferSize = "sm" | "md" | "lg";
export interface TransferProps extends AccessControlledProps {
    /** All available items */
    dataSource: TransferItem[];
    /** Keys of items in the right (target) list */
    targetKeys?: string[];
    /** Default target keys (uncontrolled) */
    defaultTargetKeys?: string[];
    /** Filter/search enabled */
    searchable?: boolean;
    /** Custom filter function */
    filterOption?: (inputValue: string, item: TransferItem) => boolean;
    /** Titles for left/right panels */
    titles?: [string, string];
    /** Size variant */
    size?: TransferSize;
    /** Show select all checkbox */
    showSelectAll?: boolean;
    /** Custom item render */
    renderItem?: (item: TransferItem) => React.ReactNode;
    /** Locale text */
    localeText?: TransferLocaleText;
    /** Called when items are moved */
    onChange?: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
    /** Called when search input changes */
    onSearch?: (direction: TransferDirection, value: string) => void;
    className?: string;
}
export declare const Transfer: React.ForwardRefExoticComponent<TransferProps & React.RefAttributes<HTMLDivElement>>;
export default Transfer;
