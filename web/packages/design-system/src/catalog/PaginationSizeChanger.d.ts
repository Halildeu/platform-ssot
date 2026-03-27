import React from 'react';
import type { AccessControlledProps } from '../internal/access-controller';
export type PaginationSizeOption = number | {
    value: number;
    label: string;
    disabled?: boolean;
};
export type PaginationSizeChangerProps = AccessControlledProps & {
    value: number;
    onValueChange: (pageSize: number) => void;
    options?: PaginationSizeOption[];
    className?: string;
    formatOptionLabel?: (pageSize: number) => string;
    disabled?: boolean;
};
export declare const PaginationSizeChanger: React.FC<PaginationSizeChangerProps>;
export default PaginationSizeChanger;
