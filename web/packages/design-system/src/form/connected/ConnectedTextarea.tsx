'use client';

import React, { forwardRef } from 'react';
import { useFormField } from '../useFormField';
import type { AccessLevel } from '../../internal/access-controller';

/** Props for the ConnectedTextarea component. */
export interface ConnectedTextareaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'onChange' | 'onBlur'
  > {
  /** Field name used to bind to form context. */
  name: string;
  /** Access level controlling the field's interactivity. */
  access?: AccessLevel;
  /** Accessible label for the textarea. */
  label?: string;
}

/**
 * Textarea pre-wired to form context.
 * Uses a native textarea since design-system doesn't have a Textarea primitive.
 */
export const ConnectedTextarea = forwardRef<
  HTMLTextAreaElement,
  ConnectedTextareaProps
>(function ConnectedTextarea({ name, access, label, ...rest }, ref) {
  const { fieldProps } = useFormField(name, access);

  return (
    <textarea
      ref={ref}
      {...rest}
      value={(fieldProps.value as string) ?? ''}
      onChange={(e) => fieldProps.onChange(e.target.value)}
      onBlur={fieldProps.onBlur}
      disabled={fieldProps.disabled}
      aria-invalid={fieldProps['aria-invalid']}
      aria-label={label}
    />
  );
});
