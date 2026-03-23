'use client';

import React, { forwardRef, useCallback } from 'react';
import { Select, type SelectProps } from '../../primitives/select/Select';
import { useFormField } from '../useFormField';
import type { AccessLevel } from '../../internal/access-controller';

/** Form-connected select that binds to a form field by name. */
export interface ConnectedSelectProps
  extends Omit<SelectProps, 'value' | 'onChange' | 'onBlur' | 'error'> {
  /** Form field name used to read/write the selected value. */
  name: string;
  /** Access level that controls disabled/readonly/hidden state. */
  access?: AccessLevel;
}

/** Form-connected select that auto-binds value, onChange, and error state to form context. */
export const ConnectedSelect = forwardRef<HTMLSelectElement, ConnectedSelectProps>(
  function ConnectedSelect({ name, access, ...rest }, ref) {
    const field = useFormField(name, access);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => field.onChange(e.target.value),
      [field.onChange],
    );

    return (
      <Select
        ref={ref}
        {...rest}
        value={(field.value as string) ?? ''}
        onChange={handleChange}
        onBlur={field.onBlur}
        error={field.error}
        disabled={field.fieldProps.disabled}
        aria-invalid={field.fieldProps['aria-invalid']}
      />
    );
  },
);
