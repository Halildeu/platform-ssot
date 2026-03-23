// @vitest-environment jsdom
import { describe, it } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { expectNoA11yViolations } from '../../__tests__/a11y-utils';
import { FormContext } from '../FormContext';
import type { FormContextValue } from '../FormContext';

const mockFormContext: FormContextValue = {
  values: {},
  errors: {},
  touched: {},
  dirtyFields: {},
  access: 'full',
  mode: 'onBlur',
  setFieldValue: () => {},
  setFieldTouched: () => {},
  setFieldError: () => {},
  clearFieldError: () => {},
  validateField: () => null,
  validateForm: () => ({}),
  reset: () => {},
  isValid: true,
  isDirty: false,
  isSubmitting: false,
  validator: null,
};

describe('FormContext — a11y', () => {
  it('FormProvider with simple form has no a11y violations', async () => {
    const { container } = render(
      <FormContext.Provider value={mockFormContext}>
        <form aria-label="Test form">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" name="name" />
          <button type="submit">Submit</button>
        </form>
      </FormContext.Provider>,
    );
    await expectNoA11yViolations(container);
  });
});
