// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { createZodValidator, zodResolver } from '../validation/zodResolver';

/* ------------------------------------------------------------------ */
/*  Minimal Zod mock — avoids peer dependency in test environment       */
/* ------------------------------------------------------------------ */

function createMockZodSchema(shape: Record<string, { safeParse: (v: unknown) => { success: boolean; error?: { issues: Array<{ path: (string | number)[]; message: string; code: string }> } }; data?: unknown }>) {
  return {
    safeParse(data: Record<string, unknown>) {
      const issues: Array<{ path: (string | number)[]; message: string; code: string }> = [];
      const parsed: Record<string, unknown> = {};

      for (const [key, fieldSchema] of Object.entries(shape)) {
        const result = fieldSchema.safeParse(data[key]);
        if (!result.success && result.error) {
          for (const issue of result.error.issues) {
            issues.push({ ...issue, path: [key, ...issue.path] });
          }
        } else {
          parsed[key] = data[key];
        }
      }

      if (issues.length > 0) {
        return { success: false, error: { issues } };
      }
      return { success: true, data: parsed };
    },
    shape,
  };
}

function stringField(opts?: { min?: number }) {
  return {
    safeParse(value: unknown) {
      if (typeof value !== 'string') {
        return { success: false, error: { issues: [{ path: [], message: 'Expected string', code: 'invalid_type' }] } };
      }
      if (opts?.min !== undefined && value.length < opts.min) {
        return { success: false, error: { issues: [{ path: [], message: `String must contain at least ${opts.min} character(s)`, code: 'too_small' }] } };
      }
      return { success: true, data: value };
    },
  };
}

function numberField(opts?: { min?: number }) {
  return {
    safeParse(value: unknown) {
      if (typeof value !== 'number') {
        return { success: false, error: { issues: [{ path: [], message: 'Expected number', code: 'invalid_type' }] } };
      }
      if (opts?.min !== undefined && value < opts.min) {
        return { success: false, error: { issues: [{ path: [], message: `Number must be greater than or equal to ${opts.min}`, code: 'too_small' }] } };
      }
      return { success: true, data: value };
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe('createZodValidator', () => {
  const schema = createMockZodSchema({
    name: stringField({ min: 1 }),
    age: numberField({ min: 0 }),
  });

  const validator = createZodValidator(schema);

  it('returns empty errors for valid values', () => {
    expect(validator.validate({ name: 'John', age: 25 })).toEqual({});
  });

  it('returns errors for invalid values', () => {
    const errors = validator.validate({ name: '', age: -1 });
    expect(errors.name).toBeDefined();
    expect(errors.age).toBeDefined();
  });

  it('validates single field — valid', () => {
    expect(validator.validateField('name', 'John')).toBeNull();
  });

  it('validates single field — invalid', () => {
    expect(validator.validateField('name', '')).toBeDefined();
  });

  it('returns null for unknown field', () => {
    expect(validator.validateField('nonexistent', 'value')).toBeNull();
  });
});

describe('zodResolver', () => {
  const schema = createMockZodSchema({
    name: stringField({ min: 1 }),
    age: numberField({ min: 0 }),
  });

  const resolver = zodResolver(schema);

  it('resolves valid values with empty errors', async () => {
    const result = await resolver({ name: 'John', age: 25 });
    expect(result.errors).toEqual({});
    expect(result.values).toEqual({ name: 'John', age: 25 });
  });

  it('resolves invalid values with typed errors', async () => {
    const result = await resolver({ name: '', age: -1 });
    expect(result.errors.name).toHaveProperty('type');
    expect(result.errors.name).toHaveProperty('message');
    expect(result.errors.age).toHaveProperty('type');
    expect(result.errors.age).toHaveProperty('message');
  });

  it('returns first error per field for multiple issues', async () => {
    const result = await resolver({ name: '', age: -1 });
    expect(typeof result.errors.name?.message).toBe('string');
  });
});
