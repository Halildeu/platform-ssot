import { useState, useCallback, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/*  Editor -> Form Field Composition Hook                             */
/*  Use a rich-text editor as a form field with validation.           */
/* ------------------------------------------------------------------ */

export interface EditorFormFieldOptions {
  /** Form field name */
  name: string;
  /** Initial HTML value */
  value?: string;
  /** Called when the editor content changes */
  onChange?: (html: string) => void;
  /** Whether the field is required */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Minimum character count (strip HTML first) */
  minLength?: number;
  /** Maximum character count (strip HTML first) */
  maxLength?: number;
  /** Custom validation function */
  validate?: (html: string) => string | null;
}

export interface EditorFieldMeta {
  name: string;
  error: string | null;
  touched: boolean;
  required: boolean;
}

export interface EditorFieldProps {
  value: string;
  onChange: (html: string) => void;
  placeholder: string;
}

export interface UseEditorFormFieldReturn {
  /** Spread these on the editor component */
  editorProps: EditorFieldProps;
  /** Form-field metadata (errors, touched, etc.) */
  fieldMeta: EditorFieldMeta;
  /** Trigger validation and return error string or null */
  validate: () => string | null;
  /** Reset field to initial state */
  reset: () => void;
  /** Mark field as touched (e.g. on blur) */
  setTouched: () => void;
}

/** Strip HTML tags to get plaintext for length validation */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Wraps a rich-text editor as a form field with validation, touched state,
 * and error messages.
 *
 * ```tsx
 * const { editorProps, fieldMeta, validate } = useEditorFormField({
 *   name: 'description',
 *   required: true,
 *   minLength: 10,
 * });
 * return <RichTextEditor {...editorProps} />;
 * ```
 */
export function useEditorFormField(
  options: EditorFormFieldOptions,
): UseEditorFormFieldReturn {
  const {
    name,
    value: initialValue = '',
    onChange: externalOnChange,
    required = false,
    placeholder = '',
    minLength,
    maxLength,
    validate: customValidate,
  } = options;

  const [internalValue, setInternalValue] = useState(initialValue);
  const [touched, setTouchedState] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runValidation = useCallback(
    (html: string): string | null => {
      const plainText = stripHtml(html);

      if (required && plainText.length === 0) {
        return `${name} is required`;
      }
      if (minLength !== undefined && plainText.length > 0 && plainText.length < minLength) {
        return `${name} must be at least ${minLength} characters`;
      }
      if (maxLength !== undefined && plainText.length > maxLength) {
        return `${name} must be at most ${maxLength} characters`;
      }
      if (customValidate) {
        return customValidate(html);
      }
      return null;
    },
    [name, required, minLength, maxLength, customValidate],
  );

  const onChange = useCallback(
    (html: string) => {
      setInternalValue(html);
      externalOnChange?.(html);
      // Re-validate on change if already touched
      if (touched) {
        setError(runValidation(html));
      }
    },
    [externalOnChange, touched, runValidation],
  );

  const validate = useCallback((): string | null => {
    const err = runValidation(internalValue);
    setError(err);
    setTouchedState(true);
    return err;
  }, [internalValue, runValidation]);

  const reset = useCallback(() => {
    setInternalValue(initialValue);
    setError(null);
    setTouchedState(false);
  }, [initialValue]);

  const setTouched = useCallback(() => {
    setTouchedState(true);
    setError(runValidation(internalValue));
  }, [internalValue, runValidation]);

  const editorProps = useMemo<EditorFieldProps>(
    () => ({
      value: internalValue,
      onChange,
      placeholder,
    }),
    [internalValue, onChange, placeholder],
  );

  const fieldMeta = useMemo<EditorFieldMeta>(
    () => ({
      name,
      error,
      touched,
      required,
    }),
    [name, error, touched, required],
  );

  return {
    editorProps,
    fieldMeta,
    validate,
    reset,
    setTouched,
  };
}
