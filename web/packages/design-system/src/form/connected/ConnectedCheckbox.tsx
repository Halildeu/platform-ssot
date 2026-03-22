'use client';

import React, { forwardRef, useCallback } from 'react';
import { Checkbox, type CheckboxProps } from '../../primitives/checkbox/Checkbox';
import { useFormField } from '../useFormField';
import type { AccessLevel } from '../../internal/access-controller';

export interface ConnectedCheckboxProps
  extends Omit<CheckboxProps, 'checked' | 'onChange' | 'onBlur'> {
  name: string;
  access?: AccessLevel;
}

export const ConnectedCheckbox = forwardRef<HTMLInputElement, ConnectedCheckboxProps>(
  function ConnectedCheckbox({ name, access, ...rest }, ref) {
    const field = useFormField(name, access);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked),
      [field.onChange],
    );

    return (
      <Checkbox
        ref={ref}
        {...rest}
        checked={Boolean(field.value)}
        onChange={handleChange}
        onBlur={field.onBlur}
        disabled={field.fieldProps.disabled}
      />
    );
  },
);
