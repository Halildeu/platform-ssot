// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFormSchema } from '../useFormSchema';
import type { FormSchema } from '../types';

const schema: FormSchema = {
  id: 'test-form',
  fields: [
    {
      id: 'f-name',
      type: 'text',
      label: 'Name',
      name: 'name',
      required: true,
      defaultValue: 'John',
      validation: { minLength: 2, maxLength: 50 },
    },
    {
      id: 'f-email',
      type: 'email',
      label: 'Email',
      name: 'email',
      required: true,
      validation: { pattern: '^[^@]+@[^@]+\\.[^@]+$', patternMessage: 'Invalid email' },
    },
    {
      id: 'f-age',
      type: 'number',
      label: 'Age',
      name: 'age',
      defaultValue: 25,
      validation: { min: 0, max: 150 },
    },
    {
      id: 'f-bio',
      type: 'textarea',
      label: 'Bio',
      name: 'bio',
      defaultValue: '',
    },
    {
      id: 'f-company',
      type: 'text',
      label: 'Company',
      name: 'company',
      dependsOn: { field: 'age', value: 18, operator: 'greaterThan' },
    },
  ],
};

describe('useFormSchema', () => {
  it('initializes with default values from schema', () => {
    const { result } = renderHook(() => useFormSchema(schema));

    expect(result.current.values.name).toBe('John');
    expect(result.current.values.age).toBe(25);
  });

  it('setFieldValue updates value', () => {
    const { result } = renderHook(() => useFormSchema(schema));

    act(() => {
      result.current.setFieldValue('name', 'Jane');
    });

    expect(result.current.values.name).toBe('Jane');
  });

  it('validates required fields', () => {
    const { result } = renderHook(() => useFormSchema(schema));

    act(() => {
      result.current.setFieldValue('name', '');
    });

    let error: string | null = null;
    act(() => {
      error = result.current.validateField('name');
    });

    expect(error).toBe('Name is required');
  });

  it('validates minLength', () => {
    const { result } = renderHook(() => useFormSchema(schema));

    act(() => {
      result.current.setFieldValue('name', 'A');
    });

    let error: string | null = null;
    act(() => {
      error = result.current.validateField('name');
    });

    expect(error).toBe('Name must be at least 2 characters');
  });

  it('validates maxLength', () => {
    const { result } = renderHook(() => useFormSchema(schema));

    act(() => {
      result.current.setFieldValue('name', 'A'.repeat(51));
    });

    let error: string | null = null;
    act(() => {
      error = result.current.validateField('name');
    });

    expect(error).toBe('Name must be at most 50 characters');
  });

  it('validates min/max for numbers', () => {
    const { result } = renderHook(() => useFormSchema(schema));

    act(() => {
      result.current.setFieldValue('age', -1);
    });

    let error: string | null = null;
    act(() => {
      error = result.current.validateField('age');
    });

    expect(error).toBe('Age must be at least 0');

    act(() => {
      result.current.setFieldValue('age', 200);
    });

    act(() => {
      error = result.current.validateField('age');
    });

    expect(error).toBe('Age must be at most 150');
  });

  it('validates pattern', () => {
    const { result } = renderHook(() => useFormSchema(schema));

    act(() => {
      result.current.setFieldValue('email', 'not-an-email');
    });

    let error: string | null = null;
    act(() => {
      error = result.current.validateField('email');
    });

    expect(error).toBe('Invalid email');
  });

  it('validateForm returns all errors', () => {
    const { result } = renderHook(() => useFormSchema(schema));

    // Clear required fields
    act(() => {
      result.current.setFieldValue('name', '');
      result.current.setFieldValue('email', '');
    });

    let errors: Record<string, string> = {};
    act(() => {
      errors = result.current.validateForm();
    });

    expect(Object.keys(errors).length).toBeGreaterThanOrEqual(2);
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
  });

  it('isValid returns true when no errors', () => {
    const { result } = renderHook(() => useFormSchema(schema));

    // Defaults are valid
    act(() => {
      result.current.setFieldValue('email', 'test@example.com');
    });

    expect(result.current.isValid).toBe(true);
  });

  it('isDirty tracks changes', () => {
    const { result } = renderHook(() => useFormSchema(schema));

    expect(result.current.isDirty).toBe(false);

    act(() => {
      result.current.setFieldValue('name', 'Jane');
    });

    expect(result.current.isDirty).toBe(true);
  });

  it('reset clears values to defaults', () => {
    const { result } = renderHook(() => useFormSchema(schema));

    act(() => {
      result.current.setFieldValue('name', 'Jane');
      result.current.setFieldValue('age', 99);
    });

    expect(result.current.values.name).toBe('Jane');

    act(() => {
      result.current.reset();
    });

    expect(result.current.values.name).toBe('John');
    expect(result.current.values.age).toBe(25);
    expect(result.current.isDirty).toBe(false);
  });

  it('getVisibleFields filters by dependsOn', () => {
    const { result } = renderHook(() => useFormSchema(schema));

    // age defaults to 25, which is > 18, so company should be visible
    let visible = result.current.getVisibleFields();
    const companyVisible = visible.find((f) => f.name === 'company');
    expect(companyVisible).toBeDefined();

    // Set age below threshold
    act(() => {
      result.current.setFieldValue('age', 10);
    });

    visible = result.current.getVisibleFields();
    const companyHidden = visible.find((f) => f.name === 'company');
    expect(companyHidden).toBeUndefined();
  });
});
