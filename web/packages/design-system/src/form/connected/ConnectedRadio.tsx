'use client';

import React, { forwardRef } from 'react';
import { Radio, type RadioProps } from '../../primitives/radio/Radio';
import { useFormField } from '../useFormField';
import type { AccessLevel } from '../../internal/access-controller';

export interface ConnectedRadioProps
  extends Omit<RadioProps, 'checked' | 'onChange' | 'onBlur'> {
  name: string;
  /** The value this radio option represents. */
  radioValue: string;
  access?: AccessLevel;
}

export const ConnectedRadio = forwardRef<HTMLInputElement, ConnectedRadioProps>(
  function ConnectedRadio({ name, radioValue, access, ...rest }, ref) {
    const { fieldProps } = useFormField(name, access);

    return (
      <Radio
        ref={ref}
        {...rest}
        checked={fieldProps.value === radioValue}
        onChange={() => fieldProps.onChange(radioValue)}
        onBlur={fieldProps.onBlur}
        disabled={fieldProps.disabled}
      />
    );
  },
);
