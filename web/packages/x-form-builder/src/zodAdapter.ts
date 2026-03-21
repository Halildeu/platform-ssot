/* ------------------------------------------------------------------ */
/*  SchemaValidator — validation abstraction for FormSchema            */
/*                                                                     */
/*  Current: Built-in validator from FormSchema validation rules       */
/*  Planned: Zod/AJV adapter for external schema validation            */
/* ------------------------------------------------------------------ */

import type { FieldSchema, FormSchema, FormValues } from './types';

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
/*  Future: Real Zod integration                                       */
/* ------------------------------------------------------------------ */

/*
 * import { z } from 'zod';
 *
 * // Convert a FormSchema to a Zod schema object
 * export function toZodSchema(formSchema: FormSchema): z.ZodObject<any> {
 *   const shape: Record<string, z.ZodTypeAny> = {};
 *   for (const field of formSchema.fields) {
 *     let fieldSchema: z.ZodTypeAny;
 *     switch (field.type) {
 *       case 'number':
 *         fieldSchema = z.number();
 *         if (field.validation?.min !== undefined) fieldSchema = (fieldSchema as z.ZodNumber).min(field.validation.min);
 *         if (field.validation?.max !== undefined) fieldSchema = (fieldSchema as z.ZodNumber).max(field.validation.max);
 *         break;
 *       case 'email':
 *         fieldSchema = z.string().email();
 *         break;
 *       default:
 *         fieldSchema = z.string();
 *         if (field.validation?.minLength !== undefined) fieldSchema = (fieldSchema as z.ZodString).min(field.validation.minLength);
 *         if (field.validation?.maxLength !== undefined) fieldSchema = (fieldSchema as z.ZodString).max(field.validation.maxLength);
 *         if (field.validation?.pattern) fieldSchema = (fieldSchema as z.ZodString).regex(new RegExp(field.validation.pattern));
 *         break;
 *     }
 *     shape[field.name] = field.required ? fieldSchema : fieldSchema.optional();
 *   }
 *   return z.object(shape);
 * }
 *
 * // Convert a Zod schema to a FormSchema
 * export function fromZodSchema(zodSchema: z.ZodObject<any>): FormSchema {
 *   // Introspect Zod shape and map back to FieldSchema[]
 *   ...
 * }
 *
 * // Create a SchemaValidator backed by a Zod schema
 * export function createZodValidator(zodSchema: z.ZodObject<any>): SchemaValidator {
 *   return {
 *     validate: (values) => {
 *       const result = zodSchema.safeParse(values);
 *       if (result.success) return {};
 *       const errors: Record<string, string> = {};
 *       for (const issue of result.error.issues) {
 *         const path = issue.path.join('.');
 *         if (!errors[path]) errors[path] = issue.message;
 *       }
 *       return errors;
 *     },
 *     validateField: (field, value) => {
 *       const shape = zodSchema.shape[field];
 *       if (!shape) return null;
 *       const result = shape.safeParse(value);
 *       return result.success ? null : result.error.issues[0]?.message ?? 'Invalid';
 *     },
 *   };
 * }
 */
