/* ------------------------------------------------------------------ */
/*  SchemaValidator — validation abstraction for FormSchema            */
/*                                                                     */
/*  Built-in validator from FormSchema validation rules (always works) */
/*  Zod adapter for external schema validation (optional peer dep)     */
/* ------------------------------------------------------------------ */

import type { FieldSchema, FormSchema, FormValues } from './types';

/* ------------------------------------------------------------------ */
/*  Zod runtime detection — optional peer dependency                   */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let zodModule: any | null = null;
try {
  // Dynamic require so the module is only loaded if installed
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  zodModule = require('zod');
} catch {
  /* zod not installed — built-in validator still works */
}

/* ------------------------------------------------------------------ */
/*  SchemaValidator interface                                          */
/* ------------------------------------------------------------------ */

export interface SchemaValidator {
  /** Validate all fields. Returns map of field name -> error message. Empty = valid. */
  validate: (values: Record<string, unknown>) => Record<string, string>;
  /** Validate a single field. Returns error message or null. */
  validateField: (field: string, value: unknown, allValues?: Record<string, unknown>) => string | null;
}

/* ------------------------------------------------------------------ */
/*  Built-in validator — mirrors the inline logic from useFormSchema    */
/* ------------------------------------------------------------------ */

function validateFieldValue(
  field: FieldSchema,
  value: unknown,
  allValues: FormValues,
): string | null {
  // Required check
  if (field.required) {
    if (value === undefined || value === null || value === '') {
      return `${field.label} is required`;
    }
  }

  // Skip further checks for empty optional fields
  if (value === undefined || value === null || value === '') return null;

  const v = field.validation;
  if (!v) return null;

  // String-length checks
  if (typeof value === 'string') {
    if (v.minLength !== undefined && value.length < v.minLength) {
      return `${field.label} must be at least ${v.minLength} characters`;
    }
    if (v.maxLength !== undefined && value.length > v.maxLength) {
      return `${field.label} must be at most ${v.maxLength} characters`;
    }
    if (v.pattern) {
      const re = new RegExp(v.pattern);
      if (!re.test(value)) {
        return v.patternMessage ?? `${field.label} format is invalid`;
      }
    }
  }

  // Numeric range checks
  if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
    const num = Number(value);
    if (v.min !== undefined && num < v.min) {
      return `${field.label} must be at least ${v.min}`;
    }
    if (v.max !== undefined && num > v.max) {
      return `${field.label} must be at most ${v.max}`;
    }
  }

  // Custom validator
  if (v.custom) {
    return v.custom(value, allValues);
  }

  return null;
}

/**
 * Create a SchemaValidator from a FormSchema definition.
 *
 * This builds validation logic from the FieldSchema.validation rules,
 * producing the same results as the inline validation that previously
 * lived inside useFormSchema. The abstraction allows swapping in a
 * Zod-based or AJV-based validator later without changing hook code.
 */
export function createSchemaValidator(schema: FormSchema): SchemaValidator {
  const fieldMap = new Map<string, FieldSchema>();
  for (const field of schema.fields) {
    fieldMap.set(field.name, field);
  }

  return {
    validate: (values: Record<string, unknown>): Record<string, string> => {
      const errors: Record<string, string> = {};
      for (const field of schema.fields) {
        if (field.hidden) continue;
        const msg = validateFieldValue(field, values[field.name], values);
        if (msg) errors[field.name] = msg;
      }
      return errors;
    },

    validateField: (
      fieldName: string,
      value: unknown,
      allValues: Record<string, unknown> = {},
    ): string | null => {
      const field = fieldMap.get(fieldName);
      if (!field) return null;
      return validateFieldValue(field, value, allValues);
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Zod-powered validator                                              */
/* ------------------------------------------------------------------ */

/**
 * Create a SchemaValidator backed by a Zod schema.
 *
 * Usage:
 * ```ts
 * import { z } from 'zod';
 * const schema = z.object({ name: z.string().min(1), age: z.number().min(0) });
 * const validator = createZodValidator(schema);
 * ```
 *
 * Works with any ZodObject — does not require the `zod` peer dependency at
 * the package level because the caller passes the already-constructed schema.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createZodValidator(zodSchema: any): SchemaValidator {
  return {
    validate: (values) => {
      const result = zodSchema.safeParse(values);
      if (result.success) return {};
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) errors[path] = issue.message;
      }
      return errors;
    },
    validateField: (field, value) => {
      const fieldSchema = zodSchema.shape?.[field];
      if (!fieldSchema) return null;
      const result = fieldSchema.safeParse(value);
      return result.success ? null : result.error.issues[0]?.message || 'Invalid';
    },
  };
}

/* ------------------------------------------------------------------ */
/*  FormSchema <-> Zod bidirectional conversion                        */
/* ------------------------------------------------------------------ */

/**
 * Convert FormSchema validation rules to a Zod schema object.
 *
 * Returns `null` if `zod` is not installed (optional peer dependency).
 * Consumers who import `zod` themselves can pass their own schema to
 * `createZodValidator` instead.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toZodSchema(formSchema: FormSchema): any | null {
  if (!zodModule) return null;
  const { z } = zodModule;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shape: Record<string, any> = {};

  for (const field of formSchema.fields) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fieldSchema: any;

    switch (field.type) {
      case 'number':
        fieldSchema = z.number();
        if (field.validation?.min !== undefined) fieldSchema = fieldSchema.min(field.validation.min);
        if (field.validation?.max !== undefined) fieldSchema = fieldSchema.max(field.validation.max);
        break;
      case 'email':
        fieldSchema = z.string().email(field.validation?.patternMessage || 'Invalid email');
        break;
      case 'checkbox':
        fieldSchema = z.boolean();
        break;
      default:
        fieldSchema = z.string();
        if (field.validation?.minLength) fieldSchema = fieldSchema.min(field.validation.minLength);
        if (field.validation?.maxLength) fieldSchema = fieldSchema.max(field.validation.maxLength);
        if (field.validation?.pattern) {
          fieldSchema = fieldSchema.regex(
            new RegExp(field.validation.pattern),
            field.validation.patternMessage,
          );
        }
        break;
    }

    if (!field.required) fieldSchema = fieldSchema.optional();
    shape[field.name] = fieldSchema;
  }

  return z.object(shape);
}

/**
 * Convert a Zod schema to a FormSchema.
 *
 * Introspects the ZodObject shape and maps back to `FieldSchema[]`.
 * Provide optional `meta` to set `id`, `title`, etc.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromZodSchema(zodSchema: any, meta?: Partial<FormSchema>): FormSchema {
  const fields: FieldSchema[] = [];
  const shape = zodSchema.shape;

  for (const [name, rawFieldSchema] of Object.entries(shape)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fs = rawFieldSchema as any;

    const field: FieldSchema = {
      id: name,
      name,
      label: name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'),
      type: 'text',
      required: !fs.isOptional?.(),
    };

    // Detect type from Zod schema _def.typeName
    // Unwrap optional/nullable wrappers to find the inner type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let innerDef: any = fs._def;
    if (innerDef?.typeName === 'ZodOptional' || innerDef?.typeName === 'ZodNullable') {
      innerDef = innerDef.innerType?._def;
    }
    const typeName = innerDef?.typeName;

    if (typeName === 'ZodNumber') field.type = 'number';
    if (typeName === 'ZodBoolean') field.type = 'checkbox';
    if (typeName === 'ZodEnum') {
      field.type = 'select';
      field.options = innerDef.values.map((v: string) => ({ label: v, value: v }));
    }

    fields.push(field);
  }

  return { id: meta?.id || 'zod-form', fields, ...meta };
}

/* ------------------------------------------------------------------ */
/*  Runtime availability check                                         */
/* ------------------------------------------------------------------ */

/** Returns `true` if the `zod` package is available at runtime. */
export function isZodAvailable(): boolean {
  return zodModule !== null;
}
