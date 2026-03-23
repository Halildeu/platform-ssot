// @vitest-environment jsdom
/**
 * Form — interaction + edge-case depth tests
 *
 * Targets: FormContext, ConnectedInput, ConnectedSelect, ConnectedCheckbox,
 *          ConnectedRadio, ConnectedTextarea, ConnectedFormField
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

/* ---- Components under test ---- */
import { FormContext, useFormContext, type FormContextValue } from '../FormContext';
import { ConnectedInput } from '../connected/ConnectedInput';
import { ConnectedSelect } from '../connected/ConnectedSelect';
import { ConnectedCheckbox } from '../connected/ConnectedCheckbox';
import { ConnectedRadio } from '../connected/ConnectedRadio';
import { ConnectedTextarea } from '../connected/ConnectedTextarea';
import { ConnectedFormField } from '../ConnectedFormField';

afterEach(cleanup);

/* ---- Shared form context mock helper ---- */

function createMockFormContext(overrides?: Partial<FormContextValue>): FormContextValue {
  return {
    values: {},
    errors: {},
    touched: {},
    dirtyFields: {},
    access: 'full',
    mode: 'onBlur',
    setFieldValue: vi.fn(),
    setFieldTouched: vi.fn(),
    setFieldError: vi.fn(),
    clearFieldError: vi.fn(),
    validateField: vi.fn().mockReturnValue(null),
    validateForm: vi.fn().mockReturnValue({}),
    reset: vi.fn(),
    isValid: true,
    isDirty: false,
    isSubmitting: false,
    validator: null,
    ...overrides,
  };
}

function FormWrapper({
  ctx,
  children,
}: {
  ctx: FormContextValue;
  children: React.ReactNode;
}) {
  return (
    <FormContext.Provider value={ctx}>{children}</FormContext.Provider>
  );
}

/* ================================================================== */
/*  1. FormContext                                                      */
/* ================================================================== */

describe('FormContext — depth', () => {
  it('provides form state via context', () => {
    const ctx = createMockFormContext({ values: { name: 'Alice' } });
    let read: FormContextValue | null = null;
    function Consumer() {
      read = useFormContext();
      return <span>ok</span>;
    }
    render(
      <FormWrapper ctx={ctx}>
        <Consumer />
      </FormWrapper>,
    );
    expect(read).not.toBeNull();
    expect(read!.values).toHaveProperty('name', 'Alice');
  });

  it('useFormContext throws outside provider', () => {
    function Consumer() {
      useFormContext();
      return <span>ok</span>;
    }
    expect(() => render(<Consumer />)).toThrow(
      'useFormContext must be used within a <FormProvider>',
    );
  });

  it('provides isSubmitting state', () => {
    const ctx = createMockFormContext({ isSubmitting: true });
    let read: FormContextValue | null = null;
    function Consumer() {
      read = useFormContext();
      return <span>ok</span>;
    }
    render(
      <FormWrapper ctx={ctx}><Consumer /></FormWrapper>,
    );
    expect(read!.isSubmitting).toBe(true);
  });
});

/* ================================================================== */
/*  2. ConnectedInput                                                  */
/* ================================================================== */

describe('ConnectedInput — depth', () => {
  it('renders value from form context', () => {
    const ctx = createMockFormContext({ values: { email: 'a@b.com' } });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedInput name="email" />
      </FormWrapper>,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('a@b.com');
  });

  it('calls setFieldValue on change', () => {
    const setFieldValue = vi.fn();
    const ctx = createMockFormContext({ values: { email: '' }, setFieldValue });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedInput name="email" />
      </FormWrapper>,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new@val.com' } });
    // ConnectedInput uses onValueChange which calls field.onChange
    expect(setFieldValue).toHaveBeenCalled();
  });

  it('disabled state from form context access=disabled', () => {
    const ctx = createMockFormContext({
      values: { email: '' },
      access: 'disabled',
    });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedInput name="email" />
      </FormWrapper>,
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('shows error when field is touched', () => {
    const ctx = createMockFormContext({
      values: { email: '' },
      errors: { email: 'Required' },
      touched: { email: true },
    });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedInput name="email" />
      </FormWrapper>,
    );
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  3. ConnectedSelect                                                 */
/* ================================================================== */

describe('ConnectedSelect — depth', () => {
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ];

  it('renders with current value from context', () => {
    const ctx = createMockFormContext({ values: { color: 'a' } });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedSelect name="color" options={options} />
      </FormWrapper>,
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('a');
  });

  it('calls setFieldValue on change', () => {
    const setFieldValue = vi.fn();
    const ctx = createMockFormContext({ values: { color: 'a' }, setFieldValue });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedSelect name="color" options={options} />
      </FormWrapper>,
    );
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'b' } });
    expect(setFieldValue).toHaveBeenCalledWith('color', 'b');
  });

  it('disabled from context', () => {
    const ctx = createMockFormContext({ values: { color: '' }, access: 'disabled' });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedSelect name="color" options={options} />
      </FormWrapper>,
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });
});

/* ================================================================== */
/*  4. ConnectedCheckbox                                               */
/* ================================================================== */

describe('ConnectedCheckbox — depth', () => {
  it('renders checked state from context', () => {
    const ctx = createMockFormContext({ values: { agree: true } });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedCheckbox name="agree" />
      </FormWrapper>,
    );
    const cb = screen.getByRole('checkbox');
    expect(cb).toBeChecked();
  });

  it('calls setFieldValue on click toggle', () => {
    const setFieldValue = vi.fn();
    const ctx = createMockFormContext({ values: { agree: false }, setFieldValue });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedCheckbox name="agree" />
      </FormWrapper>,
    );
    const cb = screen.getByRole('checkbox');
    fireEvent.click(cb);
    expect(setFieldValue).toHaveBeenCalled();
  });

  it('disabled checkbox does not toggle', () => {
    const setFieldValue = vi.fn();
    const ctx = createMockFormContext({
      values: { agree: false },
      access: 'disabled',
      setFieldValue,
    });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedCheckbox name="agree" />
      </FormWrapper>,
    );
    const cb = screen.getByRole('checkbox');
    expect(cb).toBeDisabled();
  });
});

/* ================================================================== */
/*  5. ConnectedRadio                                                  */
/* ================================================================== */

describe('ConnectedRadio — depth', () => {
  it('renders checked when value matches radioValue', () => {
    const ctx = createMockFormContext({ values: { size: 'lg' } });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedRadio name="size" radioValue="lg" />
      </FormWrapper>,
    );
    const radio = screen.getByRole('radio');
    expect(radio).toBeChecked();
  });

  it('renders unchecked when value does not match', () => {
    const ctx = createMockFormContext({ values: { size: 'sm' } });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedRadio name="size" radioValue="lg" />
      </FormWrapper>,
    );
    const radio = screen.getByRole('radio');
    expect(radio).not.toBeChecked();
  });

  it('calls setFieldValue on click', () => {
    const setFieldValue = vi.fn();
    const ctx = createMockFormContext({ values: { size: 'sm' }, setFieldValue });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedRadio name="size" radioValue="lg" />
      </FormWrapper>,
    );
    const radio = screen.getByRole('radio');
    fireEvent.click(radio);
    expect(setFieldValue).toHaveBeenCalled();
  });

  it('disabled radio does not select', () => {
    const ctx = createMockFormContext({
      values: { size: 'sm' },
      access: 'disabled',
    });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedRadio name="size" radioValue="lg" />
      </FormWrapper>,
    );
    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
  });
});

/* ================================================================== */
/*  6. ConnectedTextarea                                               */
/* ================================================================== */

describe('ConnectedTextarea — depth', () => {
  it('renders value from form context', () => {
    const ctx = createMockFormContext({ values: { bio: 'Hello' } });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedTextarea name="bio" />
      </FormWrapper>,
    );
    const ta = screen.getByRole('textbox');
    expect(ta).toHaveValue('Hello');
  });

  it('calls setFieldValue on change', () => {
    const setFieldValue = vi.fn();
    const ctx = createMockFormContext({ values: { bio: '' }, setFieldValue });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedTextarea name="bio" />
      </FormWrapper>,
    );
    const ta = screen.getByRole('textbox');
    fireEvent.change(ta, { target: { value: 'New bio' } });
    expect(setFieldValue).toHaveBeenCalledWith('bio', 'New bio');
  });

  it('disabled textarea from context', () => {
    const ctx = createMockFormContext({
      values: { bio: '' },
      access: 'disabled',
    });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedTextarea name="bio" />
      </FormWrapper>,
    );
    const ta = screen.getByRole('textbox');
    expect(ta).toBeDisabled();
  });

  it('has aria-invalid when error is present and touched', () => {
    const ctx = createMockFormContext({
      values: { bio: '' },
      errors: { bio: 'Too short' },
      touched: { bio: true },
    });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedTextarea name="bio" />
      </FormWrapper>,
    );
    const ta = screen.getByRole('textbox');
    expect(ta).toHaveAttribute('aria-invalid', 'true');
  });
});

/* ================================================================== */
/*  7. ConnectedFormField                                              */
/* ================================================================== */

describe('ConnectedFormField — depth', () => {
  it('renders label', () => {
    const ctx = createMockFormContext({ values: { name: '' } });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedFormField name="name" label="Full Name">
          <input />
        </ConnectedFormField>
      </FormWrapper>,
    );
    expect(screen.getByText('Full Name')).toBeInTheDocument();
  });

  it('shows error from context when touched', () => {
    const ctx = createMockFormContext({
      values: { name: '' },
      errors: { name: 'Required' },
      touched: { name: true },
    });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedFormField name="name" label="Name">
          <input />
        </ConnectedFormField>
      </FormWrapper>,
    );
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('renders required indicator', () => {
    const ctx = createMockFormContext({ values: { name: '' } });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedFormField name="name" label="Name" required>
          <input />
        </ConnectedFormField>
      </FormWrapper>,
    );
    // FormField shows required text
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('injects disabled prop into child', () => {
    const ctx = createMockFormContext({
      values: { name: '' },
      access: 'disabled',
    });
    render(
      <FormWrapper ctx={ctx}>
        <ConnectedFormField name="name" label="Name">
          <input data-testid="child-input" />
        </ConnectedFormField>
      </FormWrapper>,
    );
    const input = screen.getByTestId('child-input');
    expect(input).toBeDisabled();
  });
});
