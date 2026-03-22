// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';
import type { SchemaValidator } from '../validation/types';

const mockValidator: SchemaValidator = {
  validate: (values) => {
    const errors: Record<string, string> = {};
    if (!values.name) errors.name = 'Name is required';
    if (!values.email) errors.email = 'Email is required';
    return errors;
  },
  validateField: (field, value) => {
    if (field === 'name' && !value) return 'Name is required';
    if (field === 'email' && !value) return 'Email is required';
    return null;
  },
};

describe('useForm', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: '', email: '' } }),
    );
    expect(result.current.values).toEqual({ name: '', email: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('setFieldValue updates values', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: '' } }),
    );
    act(() => result.current.setFieldValue('name', 'John'));
    expect(result.current.values.name).toBe('John');
  });

  it('tracks dirty fields', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: '' } }),
    );
    expect(result.current.isDirty).toBe(false);
    act(() => result.current.setFieldValue('name', 'John'));
    expect(result.current.isDirty).toBe(true);
    expect(result.current.dirtyFields.name).toBe(true);
  });

  it('setFieldTouched marks field as touched', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: '' } }),
    );
    act(() => result.current.setFieldTouched('name'));
    expect(result.current.touched.name).toBe(true);
  });

  it('validateForm returns all errors', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: '', email: '' }, validator: mockValidator }),
    );
    let formErrors: Record<string, string> = {};
    act(() => {
      formErrors = result.current.validateForm();
    });
    expect(formErrors.name).toBe('Name is required');
    expect(formErrors.email).toBe('Email is required');
  });

  it('validateField returns single field error', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: '' }, validator: mockValidator }),
    );
    let msg: string | null = null;
    act(() => {
      msg = result.current.validateField('name');
    });
    expect(msg).toBe('Name is required');
  });

  it('handleSubmit prevents submission on validation errors', async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: '', email: '' }, validator: mockValidator }),
    );
    await act(async () => {
      await result.current.handleSubmit(onSubmit)();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.name).toBeDefined();
  });

  it('handleSubmit calls onSubmit when valid', async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: 'John', email: 'john@test.com' }, validator: mockValidator }),
    );
    await act(async () => {
      await result.current.handleSubmit(onSubmit)();
    });
    expect(onSubmit).toHaveBeenCalledWith({ name: 'John', email: 'john@test.com' });
  });

  it('handleSubmit touches all fields on submit', async () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: '', email: '' }, validator: mockValidator }),
    );
    await act(async () => {
      await result.current.handleSubmit(vi.fn())();
    });
    expect(result.current.touched.name).toBe(true);
    expect(result.current.touched.email).toBe(true);
  });

  it('reset restores default values and clears state', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: '' }, validator: mockValidator }),
    );
    act(() => {
      result.current.setFieldValue('name', 'John');
      result.current.setFieldTouched('name');
      result.current.validateForm();
    });
    act(() => result.current.reset());
    expect(result.current.values.name).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('mode onChange validates on value change', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: '' }, validator: mockValidator, mode: 'onChange' }),
    );
    act(() => result.current.setFieldValue('name', ''));
    expect(result.current.errors.name).toBe('Name is required');
    act(() => result.current.setFieldValue('name', 'John'));
    expect(result.current.errors.name).toBeUndefined();
  });

  it('mode onBlur validates on touch', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: '' }, validator: mockValidator, mode: 'onBlur' }),
    );
    // No error before blur
    expect(result.current.errors.name).toBeUndefined();
    act(() => result.current.setFieldTouched('name'));
    expect(result.current.errors.name).toBe('Name is required');
  });

  it('isValid reflects error state', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: 'John', email: 'j@t.com' }, validator: mockValidator }),
    );
    expect(result.current.isValid).toBe(true);
    act(() => result.current.validateForm());
    expect(result.current.isValid).toBe(true);
  });
});
