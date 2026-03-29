// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditorFormField } from '../composition/useEditorFormField';

describe('useEditorFormField', () => {
  it('initialises with empty value and no errors', () => {
    const { result } = renderHook(() =>
      useEditorFormField({ name: 'bio' }),
    );
    expect(result.current.editorProps.value).toBe('');
    expect(result.current.fieldMeta.error).toBeNull();
    expect(result.current.fieldMeta.touched).toBe(false);
    expect(result.current.fieldMeta.name).toBe('bio');
  });

  it('uses provided initial value', () => {
    const { result } = renderHook(() =>
      useEditorFormField({ name: 'bio', value: '<p>Hello</p>' }),
    );
    expect(result.current.editorProps.value).toBe('<p>Hello</p>');
  });

  it('calls external onChange', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useEditorFormField({ name: 'bio', onChange }),
    );

    act(() => result.current.editorProps.onChange('<p>New text</p>'));

    expect(onChange).toHaveBeenCalledWith('<p>New text</p>');
    expect(result.current.editorProps.value).toBe('<p>New text</p>');
  });

  it('validates required field', () => {
    const { result } = renderHook(() =>
      useEditorFormField({ name: 'description', required: true }),
    );

    let error: string | null;
    act(() => {
      error = result.current.validate();
    });

    expect(error!).toBe('description is required');
    expect(result.current.fieldMeta.error).toBe('description is required');
    expect(result.current.fieldMeta.touched).toBe(true);
  });

  it('validates minLength (strips HTML)', () => {
    const { result } = renderHook(() =>
      useEditorFormField({ name: 'notes', minLength: 10 }),
    );

    act(() => result.current.editorProps.onChange('<p>Hi</p>'));
    act(() => {
      result.current.validate();
    });

    expect(result.current.fieldMeta.error).toBe('notes must be at least 10 characters');
  });

  it('validates maxLength (strips HTML)', () => {
    const { result } = renderHook(() =>
      useEditorFormField({ name: 'title', maxLength: 5 }),
    );

    act(() => result.current.editorProps.onChange('<b>Too long text</b>'));
    act(() => {
      result.current.validate();
    });

    expect(result.current.fieldMeta.error).toBe('title must be at most 5 characters');
  });

  it('uses custom validate function', () => {
    const { result } = renderHook(() =>
      useEditorFormField({
        name: 'code',
        validate: (html) => (html.includes('TODO') ? 'Remove TODOs' : null),
      }),
    );

    act(() => result.current.editorProps.onChange('<p>TODO: fix this</p>'));
    act(() => {
      result.current.validate();
    });

    expect(result.current.fieldMeta.error).toBe('Remove TODOs');
  });

  it('reset clears value, error, and touched', () => {
    const { result } = renderHook(() =>
      useEditorFormField({ name: 'bio', required: true }),
    );

    act(() => result.current.validate());
    expect(result.current.fieldMeta.touched).toBe(true);

    act(() => result.current.reset());
    expect(result.current.editorProps.value).toBe('');
    expect(result.current.fieldMeta.error).toBeNull();
    expect(result.current.fieldMeta.touched).toBe(false);
  });

  it('setTouched triggers validation', () => {
    const { result } = renderHook(() =>
      useEditorFormField({ name: 'bio', required: true }),
    );

    act(() => result.current.setTouched());

    expect(result.current.fieldMeta.touched).toBe(true);
    expect(result.current.fieldMeta.error).toBe('bio is required');
  });

  it('re-validates on change after touched', () => {
    const { result } = renderHook(() =>
      useEditorFormField({ name: 'bio', required: true }),
    );

    // Touch first
    act(() => result.current.validate());
    expect(result.current.fieldMeta.error).toBe('bio is required');

    // Now type something - error should clear
    act(() => result.current.editorProps.onChange('<p>Content</p>'));
    expect(result.current.fieldMeta.error).toBeNull();
  });
});
