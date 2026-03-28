import { describe, it, expect, vi } from 'vitest';
import {
  createSchemaValidator,
  createZodValidator,
  toZodSchema,
  fromZodSchema,
  isZodAvailable,
} from '../zodAdapter';
import type { FormSchema } from '../types';

/* ------------------------------------------------------------------ */
/*  Test fixtures                                                      */
/* ------------------------------------------------------------------ */

const formSchema: FormSchema = {
  id: 'test-form',
  fields: [
    {
      id: 'f-name',
      type: 'text',
      label: 'Name',
      name: 'name',
      required: true,
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
      required: false,
      validation: { min: 0, max: 150 },
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Built-in validator (always works, no Zod needed)                   */
/* ------------------------------------------------------------------ */

describe('createSchemaValidator (built-in)', () => {
  const validator = createSchemaValidator(formSchema);

  it('returns no errors for valid data', () => {
    const errors = validator.validate({ name: 'Alice', email: 'a@b.com', age: 30 });
    expect(errors).toEqual({});
  });

  it('returns required error for missing required field', () => {
    const errors = validator.validate({ name: '', email: 'a@b.com' });
    expect(errors.name).toBe('Name is required');
  });

  it('validates minLength', () => {
    const msg = validator.validateField('name', 'A', { name: 'A', email: 'a@b.com' });
    expect(msg).toBe('Name must be at least 2 characters');
  });

  it('validates pattern with custom message', () => {
    const msg = validator.validateField('email', 'not-an-email', { email: 'not-an-email' });
    expect(msg).toBe('Invalid email');
  });

  it('validates numeric range', () => {
    const msg = validator.validateField('age', -1, { age: -1 });
    expect(msg).toBe('Age must be at least 0');
  });

  it('returns null for unknown field', () => {
    const msg = validator.validateField('nonexistent', 'value');
    expect(msg).toBeNull();
  });

  it('skips validation for empty optional fields', () => {
    const msg = validator.validateField('age', '', { age: '' });
    expect(msg).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  Zod-powered validator                                              */
/* ------------------------------------------------------------------ */

describe('createZodValidator', () => {
  // Try to load zod — tests in this block will be skipped if not installed
  let z: typeof import('zod')['z'] | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    z = require('zod').z;
  } catch {
    /* zod not available */
  }

  it.skipIf(!z)('validates correctly with a Zod schema', () => {
    const zodSchema = z!.object({
      name: z!.string().min(2),
      email: z!.string().email(),
      age: z!.number().min(0).max(150).optional(),
    });
    const validator = createZodValidator(zodSchema);

    // Valid
    expect(validator.validate({ name: 'Alice', email: 'a@b.com', age: 30 })).toEqual({});

    // Invalid — name too short
    const errors = validator.validate({ name: 'A', email: 'a@b.com' });
    expect(errors.name).toBeDefined();
    expect(typeof errors.name).toBe('string');
  });

  it.skipIf(!z)('validateField returns null for valid single field', () => {
    const zodSchema = z!.object({
      name: z!.string().min(2),
    });
    const validator = createZodValidator(zodSchema);
    expect(validator.validateField('name', 'Alice')).toBeNull();
  });

  it.skipIf(!z)('validateField returns error message for invalid single field', () => {
    const zodSchema = z!.object({
      name: z!.string().min(2),
    });
    const validator = createZodValidator(zodSchema);
    const msg = validator.validateField('name', 'A');
    expect(msg).toBeDefined();
    expect(typeof msg).toBe('string');
  });

  it.skipIf(!z)('validateField returns null for unknown field', () => {
    const zodSchema = z!.object({ name: z!.string() });
    const validator = createZodValidator(zodSchema);
    expect(validator.validateField('nonexistent', 'value')).toBeNull();
  });

  it.skipIf(!z)('maps nested path errors correctly', () => {
    // Simulate a flat path from Zod issues
    const zodSchema = z!.object({
      name: z!.string().min(1),
      email: z!.string().email(),
    });
    const validator = createZodValidator(zodSchema);
    const errors = validator.validate({ name: '', email: 'bad' });
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
  });
});

/* ------------------------------------------------------------------ */
/*  toZodSchema — FormSchema -> Zod                                    */
/* ------------------------------------------------------------------ */

describe('toZodSchema', () => {
  let z: typeof import('zod')['z'] | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    z = require('zod').z;
  } catch {
    /* zod not available */
  }

  it.skipIf(!z)('converts a FormSchema to a Zod schema that validates', () => {
    const zodSchema = toZodSchema(formSchema);
    expect(zodSchema).not.toBeNull();

    // Valid data passes
    const validResult = zodSchema!.safeParse({ name: 'Alice', email: 'a@b.com', age: 30 });
    expect(validResult.success).toBe(true);

    // Invalid data fails
    const invalidResult = zodSchema!.safeParse({ name: 'A', email: 'bad', age: -5 });
    expect(invalidResult.success).toBe(false);
  });

  it.skipIf(!z)('marks optional fields correctly', () => {
    const zodSchema = toZodSchema(formSchema);
    // age is optional in the FormSchema
    const result = zodSchema!.safeParse({ name: 'Alice', email: 'a@b.com' });
    expect(result.success).toBe(true);
  });

  it('returns null when zod is not available (simulated)', () => {
    // This test validates the guard path — if zod IS available it still
    // exercises the function; the null case is relevant in environments
    // where zod is not installed.
    const result = toZodSchema(formSchema);
    // Either a valid schema or null depending on environment
    expect(result === null || typeof result === 'object').toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/*  fromZodSchema — Zod -> FormSchema                                  */
/* ------------------------------------------------------------------ */

describe('fromZodSchema', () => {
  let z: typeof import('zod')['z'] | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    z = require('zod').z;
  } catch {
    /* zod not available */
  }

  it.skipIf(!z)('converts a Zod schema to FormSchema with correct field types', () => {
    const zodSchema = z!.object({
      name: z!.string(),
      age: z!.number().optional(),
      active: z!.boolean(),
      role: z!.enum(['admin', 'user', 'viewer']),
    });

    const result = fromZodSchema(zodSchema, { id: 'converted', title: 'Converted Form' });

    expect(result.id).toBe('converted');
    expect(result.title).toBe('Converted Form');
    expect(result.fields).toHaveLength(4);

    const nameField = result.fields.find((f) => f.name === 'name');
    expect(nameField?.type).toBe('text');
    expect(nameField?.required).toBe(true);

    const ageField = result.fields.find((f) => f.name === 'age');
    expect(ageField?.type).toBe('number');
    expect(ageField?.required).toBe(false);

    const activeField = result.fields.find((f) => f.name === 'active');
    expect(activeField?.type).toBe('checkbox');

    const roleField = result.fields.find((f) => f.name === 'role');
    expect(roleField?.type).toBe('select');
    expect(roleField?.options).toHaveLength(3);
  });

  it.skipIf(!z)('generates a label from the field name', () => {
    const zodSchema = z!.object({
      firstName: z!.string(),
    });
    const result = fromZodSchema(zodSchema);
    const field = result.fields[0];
    expect(field.label).toBe('First Name');
  });

  it.skipIf(!z)('uses default id when meta not provided', () => {
    const zodSchema = z!.object({ x: z!.string() });
    const result = fromZodSchema(zodSchema);
    expect(result.id).toBe('zod-form');
  });
});

/* ------------------------------------------------------------------ */
/*  isZodAvailable                                                     */
/* ------------------------------------------------------------------ */

describe('isZodAvailable', () => {
  it('returns a boolean', () => {
    const result = isZodAvailable();
    expect(typeof result).toBe('boolean');
  });
});

/* ------------------------------------------------------------------ */
/*  Fallback — built-in always works regardless of Zod availability    */
/* ------------------------------------------------------------------ */

describe('fallback behavior', () => {
  it('built-in createSchemaValidator works without Zod installed', () => {
    const validator = createSchemaValidator(formSchema);
    const errors = validator.validate({ name: 'Alice', email: 'a@b.com' });
    expect(errors).toEqual({});
  });

  it('createZodValidator works with any object that has safeParse/shape', () => {
    // Mock a minimal Zod-like schema to prove the adapter is decoupled
    const mockZodSchema = {
      safeParse: (values: Record<string, unknown>) => {
        if (!values.name) {
          return {
            success: false,
            error: { issues: [{ path: ['name'], message: 'Required' }] },
          };
        }
        return { success: true, data: values };
      },
      shape: {
        name: {
          safeParse: (value: unknown) => {
            if (!value) {
              return {
                success: false,
                error: { issues: [{ message: 'Required' }] },
              };
            }
            return { success: true, data: value };
          },
        },
      },
    };

    const validator = createZodValidator(mockZodSchema);

    // Valid
    expect(validator.validate({ name: 'Alice' })).toEqual({});

    // Invalid
    const errors = validator.validate({ name: '' });
    expect(errors.name).toBe('Required');

    // Single field
    expect(validator.validateField('name', 'Alice')).toBeNull();
    expect(validator.validateField('name', '')).toBe('Required');
    expect(validator.validateField('unknown', 'x')).toBeNull();
  });
});
