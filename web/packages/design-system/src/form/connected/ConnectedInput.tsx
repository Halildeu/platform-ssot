'use client';

import React, { forwardRef, useCallback } from 'react';
import { Input, type InputProps } from '../../primitives/input/Input';
import { useFormField } from '../useFormField';
import type { AccessLevel } from '../../internal/access-controller';

export interface ConnectedInputProps
  extends Omit<InputProps, 'value' | 'onChange' | 'onValueChange' | 'onBlur' | 'error'> {
  /** Field name matching the form schema key. */
  name: string;
  /** Per-field access override. */
  access?: AccessLevel;
}

/**
 * Input pre-wired to form context via `onValueChange`.
 */
export const ConnectedInput = forwardRef<HTMLInputElement, ConnectedInputProps>(
  function ConnectedInput({ name, access, ...rest }, ref) {
    const field = useFormField(name, access);

    const handleValueChange = useCallback(
      (value: string) => field.onChange(value),
      [field.onChange],
    );

    return (
      <Input
        ref={ref}
        {...rest}
        value={(field.value as string) ?? ''}
        onValueChange={handleValueChange}
        onBlur={field.onBlur}
        error={field.error}
        disabled={field.fieldProps.disabled}
        aria-invalid={field.fieldProps['aria-invalid']}
      />
    );
  },
);
