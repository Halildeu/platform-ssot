'use client';

import React, { forwardRef, useCallback } from 'react';
import { Checkbox, type CheckboxProps } from '../../primitives/checkbox/Checkbox';
import { useFormField } from '../useFormField';
import type { AccessLevel } from '../../internal/access-controller';

/** Form-connected checkbox that binds to a form field by name. */
export interface ConnectedCheckboxProps
  extends Omit<CheckboxProps, 'checked' | 'onChange' | 'onBlur'> {
  /** Form field name used to read/write the boolean value. */
  name: string;
  /** Access level that controls disabled/readonly/hidden state. */
  access?: AccessLevel;
}

/** Form-connected checkbox that auto-binds checked state, onChange, and onBlur to form context. */
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
