import React, { useCallback, useEffect } from 'react';
import type { OutputFormat } from './types';
import { useEditor } from './useEditor';
import { EditorToolbar } from './EditorToolbar';
import { EditorMenuBubble } from './EditorMenuBubble';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
  toolbar?: React.ReactNode;
  outputFormat?: OutputFormat;
}

const wrapperStyles: React.CSSProperties = {
  border: '1px solid var(--border-subtle, #e2e8f0)',
  borderRadius: '8px',
  backgroundColor: 'var(--surface-default, #ffffff)',
  overflow: 'hidden',
  position: 'relative',
};

const editorStyles = (
  minHeight: number,
  maxHeight?: number,
  readOnly?: boolean,
): React.CSSProperties => ({
  minHeight: `${minHeight}px`,
  maxHeight: maxHeight ? `${maxHeight}px` : undefined,
  overflowY: maxHeight ? 'auto' : undefined,
  padding: '12px 16px',
  outline: 'none',
  color: 'var(--text-primary, #1e293b)',
  fontSize: '14px',
  lineHeight: 1.6,
  cursor: readOnly ? 'default' : 'text',
  position: 'relative',
});

const placeholderStyles: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  left: '16px',
  color: 'var(--text-muted, #94a3b8)',
  fontSize: '14px',
  lineHeight: '1.6',
  pointerEvents: 'none',
  userSelect: 'none',
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  autoFocus = false,
  minHeight = 200,
  maxHeight,
  className,
  toolbar,
  outputFormat: _outputFormat,
}) => {
  const { editorRef, isEmpty, setContent } = useEditor({
    initialContent: value ?? '',
    onChange,
  });

  // Sync external value changes
  useEffect(() => {
    if (value !== undefined && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value, editorRef]);

  // Auto-focus
  useEffect(() => {
    if (autoFocus && !readOnly) {
      editorRef.current?.focus();
    }
  }, [autoFocus, readOnly, editorRef]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    // Allow default paste behavior for rich text
    // In a future tiptap integration, this would be handled by the editor
    void e;
  }, []);

  return (
    <div style={wrapperStyles} className={className}>
      {!readOnly && (
        toolbar !== undefined ? (
          toolbar
        ) : (
          <EditorToolbar editorRef={editorRef} />
        )
      )}

      <div style={{ position: 'relative' }}>
        {!readOnly && <EditorMenuBubble editorRef={editorRef} />}

        <div
          ref={editorRef}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-placeholder={placeholder}
          aria-readonly={readOnly}
          aria-label="Rich text editor"
          style={editorStyles(minHeight, maxHeight, readOnly)}
          onPaste={handlePaste}
          dangerouslySetInnerHTML={{ __html: value ?? '' }}
        />

        {isEmpty && placeholder && !readOnly && (
          <div style={placeholderStyles} aria-hidden="true">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};
