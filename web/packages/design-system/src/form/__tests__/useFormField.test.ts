// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useForm } from '../useForm';
import { useFormField } from '../useFormField';
import type { SchemaValidator } from '../validation/types';

const mockValidator: SchemaValidator = {
  validate: (values) => {
    const errors: Record<string, string> = {};
    if (!values.name) errors.name = 'Name is required';
    return errors;
  },
  validateField: (field, value) => {
    if (field === 'name' && !value) return 'Name is required';
    return null;
  },
};

/**
 * Renders both useForm and useFormField in the same component tree
 * so context changes propagate correctly.
 */
function useFormAndField(
  formOpts: Parameters<typeof useForm>[0],
  fieldName: string,
  fieldAccess?: Parameters<typeof useFormField>[1],
) {
  const form = useForm(formOpts);
  // We need to use FormProvider wrapper pattern — but hooks must be inside provider.
  // So we return form for the wrapper and field will be tested via a child hook.
  return form;
}

function renderFieldInForm(
  formOpts: Parameters<typeof useForm>[0],
  fieldName: string,
  fieldAccess?: Parameters<typeof useFormField>[1],
) {
  // Render useForm first to get FormProvider
  const formHook = renderHook(() => useForm(formOpts));
  const FormProvider = formHook.result.current.FormProvider;

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(FormProvider, null, children);

  const fieldHook = renderHook(() => useFormField(fieldName, fieldAccess), { wrapper });

  return { formHook, fieldHook };
}

describe('useFormField', () => {
  it('reads initial value from form context', () => {
    const { fieldHook } = renderFieldInForm(
      { defaultValues: { email: 'test@test.com' } },
      'email',
    );
    expect(fieldHook.result.current.value).toBe('test@test.com');
  });

  it('returns null error for untouched field', () => {
    const { fieldHook } = renderFieldInForm(
      { defaultValues: { name: '' }, validator: mockValidator },
      'name',
    );
    expect(fieldHook.result.current.error).toBeNull();
  });

  it('fieldProps contains all required spread props', () => {
    const { fieldHook } = renderFieldInForm(
      { defaultValues: { name: '' } },
      'name',
    );
    const props = fieldHook.result.current.fieldProps;
    expect(props).toHaveProperty('value');
    expect(props).toHaveProperty('onChange');
    expect(props).toHaveProperty('onBlur');
    expect(props).toHaveProperty('error');
    expect(props).toHaveProperty('disabled');
    expect(props).toHaveProperty('aria-invalid');
  });

  it('onChange updates value', () => {
    const { formHook, fieldHook } = renderFieldInForm(
      { defaultValues: { name: '' } },
      'name',
    );
    act(() => fieldHook.result.current.onChange('John'));
    expect(formHook.result.current.values.name).toBe('John');
  });

  it('onBlur marks field as touched', () => {
    const { formHook, fieldHook } = renderFieldInForm(
      { defaultValues: { name: '' } },
      'name',
    );
    act(() => fieldHook.result.current.onBlur());
    expect(formHook.result.current.touched.name).toBe(true);
  });

  it('respects form-level access=disabled', () => {
    const { fieldHook } = renderFieldInForm(
      { defaultValues: { name: '' }, access: 'disabled' },
      'name',
    );
    expect(fieldHook.result.current.fieldProps.disabled).toBe(true);
  });

  it('field-level access overrides when more restrictive', () => {
    const { fieldHook } = renderFieldInForm(
      { defaultValues: { name: '' }, access: 'full' },
      'name',
      'disabled',
    );
    expect(fieldHook.result.current.fieldProps.disabled).toBe(true);
  });

  it('throws when used outside FormProvider', () => {
    expect(() => {
      renderHook(() => useFormField('name'));
    }).toThrow('useFormContext must be used within a <FormProvider>');
  });
});
