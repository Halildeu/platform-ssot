// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { createSchemaValidator } from '../validation/builtinValidator';
import type { FieldDescriptor } from '../validation/types';

describe('createSchemaValidator', () => {
  const fields: FieldDescriptor[] = [
    { name: 'name', label: 'Name', required: true },
    { name: 'email', label: 'Email', required: true, validation: { pattern: '^[^@]+@[^@]+\\.[^@]+$', patternMessage: 'Invalid email' } },
    { name: 'age', label: 'Age', validation: { min: 0, max: 120 } },
    { name: 'bio', label: 'Bio', validation: { minLength: 3, maxLength: 100 } },
    { name: 'hidden', label: 'Hidden', hidden: true, required: true },
    { name: 'optional', label: 'Optional' },
  ];

  const validator = createSchemaValidator(fields);

  describe('validate (full form)', () => {
    it('returns empty object for valid values', () => {
      const errors = validator.validate({ name: 'John', email: 'john@test.com', age: 25, bio: 'Hello' });
      expect(errors).toEqual({});
    });

    it('returns errors for missing required fields', () => {
      const errors = validator.validate({ name: '', email: '' });
      expect(errors.name).toContain('required');
      expect(errors.email).toContain('required');
    });

    it('skips hidden fields', () => {
      const errors = validator.validate({ name: 'John', email: 'john@test.com' });
      expect(errors.hidden).toBeUndefined();
    });

    it('validates pattern rules', () => {
      const errors = validator.validate({ name: 'John', email: 'not-an-email' });
      expect(errors.email).toBe('Invalid email');
    });
  });

  describe('validateField (single field)', () => {
    it('returns null for valid value', () => {
      expect(validator.validateField('name', 'John')).toBeNull();
    });

    it('returns error for required empty value', () => {
      expect(validator.validateField('name', '')).toContain('required');
    });

    it('returns null for unknown field', () => {
      expect(validator.validateField('nonexistent', 'value')).toBeNull();
    });

    it('validates numeric min/max', () => {
      expect(validator.validateField('age', -1)).toContain('at least 0');
      expect(validator.validateField('age', 200)).toContain('at most 120');
      expect(validator.validateField('age', 25)).toBeNull();
    });

    it('validates string length', () => {
      expect(validator.validateField('bio', 'Hi')).toContain('at least 3');
      expect(validator.validateField('bio', 'a'.repeat(101))).toContain('at most 100');
      expect(validator.validateField('bio', 'Hello')).toBeNull();
    });

    it('skips validation for empty optional fields', () => {
      expect(validator.validateField('optional', '')).toBeNull();
      expect(validator.validateField('optional', null)).toBeNull();
      expect(validator.validateField('optional', undefined)).toBeNull();
    });
  });

  describe('custom validator', () => {
    it('calls custom function with value and allValues', () => {
      const customFields: FieldDescriptor[] = [
        {
          name: 'confirm',
          label: 'Confirm',
          validation: {
            custom: (value, allValues) =>
              value !== allValues.password ? 'Passwords must match' : null,
          },
        },
      ];
      const v = createSchemaValidator(customFields);
      expect(v.validateField('confirm', 'abc', { password: 'xyz' })).toBe('Passwords must match');
      expect(v.validateField('confirm', 'abc', { password: 'abc' })).toBeNull();
    });
  });
});
