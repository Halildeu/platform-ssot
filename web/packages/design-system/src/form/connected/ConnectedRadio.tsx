'use client';

import React, { forwardRef } from 'react';
import { Radio, type RadioProps } from '../../primitives/radio/Radio';
import { useFormField } from '../useFormField';
import type { AccessLevel } from '../../internal/access-controller';

/** Form-connected radio button that binds to a form field by name. */
export interface ConnectedRadioProps
  extends Omit<RadioProps, 'checked' | 'onChange' | 'onBlur'> {
  /** Form field name used to read/write the selected radio value. */
  name: string;
  /** The value this radio option represents. */
  radioValue: string;
  /** Access level that controls disabled/readonly/hidden state. */
  access?: AccessLevel;
}

/** Form-connected radio button that auto-binds checked state and onChange to form context. */
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
