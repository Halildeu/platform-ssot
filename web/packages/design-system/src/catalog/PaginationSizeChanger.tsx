import React from 'react';
import { Select } from '../primitives/select';
import type { AccessControlledProps } from '../internal/access-controller';

export type PaginationSizeOption =
  | number
  | {
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

export const PaginationSizeChanger: React.FC<PaginationSizeChangerProps> = ({
  value,
  onValueChange,
  options = [10, 20, 50, 100],
  className,
  formatOptionLabel = (pageSize) => `${pageSize} / page`,
  disabled = false,
  access = 'full',
  accessReason,
}) => (
  <Select
    value={String(value)}
    onChange={(e) => onValueChange(Number(e.target.value))}
    className={className}
    disabled={disabled}
    access={access}
    accessReason={accessReason}
    options={options.map((option) =>
      typeof option === 'number'
        ? {
            value: String(option),
            label: formatOptionLabel(option),
          }
        : {
            value: String(option.value),
            label: option.label,
            disabled: option.disabled,
          },
    )}
  />
);

PaginationSizeChanger.displayName = "PaginationSizeChanger";

export default PaginationSizeChanger;
