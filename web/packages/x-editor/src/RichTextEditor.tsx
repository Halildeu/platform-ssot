import React, { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react';
import type { OutputFormat } from './types';
import { useEditor } from './useEditor';
import type { EditorCore } from './useEditor';
import { EditorToolbar } from './EditorToolbar';
import { EditorMenuBubble } from './EditorMenuBubble';
import type { TiptapEditorProps } from './TiptapEditor';

/* ------------------------------------------------------------------ */
/*  Lazy-loaded TiptapEditor — only resolved when Tiptap is installed  */
/* ------------------------------------------------------------------ */

let _tiptapAvailableCache: boolean | undefined;

async function probeTiptap(): Promise<boolean> {
  if (_tiptapAvailableCache !== undefined) return _tiptapAvailableCache;
  try {
    await import('@tiptap/react');
    _tiptapAvailableCache = true;
  } catch {
    _tiptapAvailableCache = false;
  }
  return _tiptapAvailableCache;
}

const LazyTiptapEditor = lazy(async () => {
  const available = await probeTiptap();
  if (!available) {
    // Return a null component — will never be rendered because we check
    // availability before rendering the lazy component.
    return {
      default: ((_props: TiptapEditorProps) => null) as unknown as React.ComponentType<TiptapEditorProps>,
    };
  }
  const mod = await import('./TiptapEditor');
  await mod.ensureTiptapReactModules();
  return { default: mod.TiptapEditor };
});

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

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
  /** Force a specific engine. Default: auto (Tiptap if available). */
  engine?: 'tiptap' | 'native' | 'auto';
  /** Callback receiving the EditorCore once initialised */
  onEditorReady?: (core: EditorCore) => void;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const wrapperStyles: React.CSSProperties = {
  border: '1px solid var(--border-subtle))',
  borderRadius: '8px',
  backgroundColor: 'var(--surface-default))',
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
  color: 'var(--text-primary))',
  fontSize: '14px',
  lineHeight: 1.6,
  cursor: readOnly ? 'default' : 'text',
  position: 'relative',
});

const placeholderStyles: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  left: '16px',
  color: 'var(--text-muted))',
  fontSize: '14px',
  lineHeight: '1.6',
  pointerEvents: 'none',
  userSelect: 'none',
};

/* ------------------------------------------------------------------ */
/*  Native (contentEditable) fallback sub-component                    */
/* ------------------------------------------------------------------ */

interface NativeEditorInnerProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  readOnly: boolean;
  autoFocus: boolean;
  minHeight: number;
  maxHeight?: number;
  className?: string;
  toolbar?: React.ReactNode;
  onEditorReady?: (core: EditorCore) => void;
}

const NativeEditorInner: React.FC<NativeEditorInnerProps> = ({
  value,
  onChange,
  placeholder,
  readOnly,
  autoFocus,
  minHeight,
  maxHeight,
  className,
  toolbar,
  onEditorReady,
}) => {
  const { editorRef, editorCore, isEmpty } = useEditor({
    initialContent: value ?? '',
    onChange,
  });

  // Notify consumer when EditorCore is ready
  useEffect(() => {
    if (editorCore && onEditorReady) {
      onEditorReady(editorCore);
    }
  }, [editorCore, onEditorReady]);

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

  const handlePaste = useCallback((_e: React.ClipboardEvent) => {
    // Native contentEditable handles paste natively
  }, []);

  return (
    <div style={wrapperStyles} className={className}>
      {!readOnly && (
        toolbar !== undefined ? (
          toolbar
        ) : (
          <EditorToolbar editorRef={editorRef} editorCore={editorCore} />
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

/* ------------------------------------------------------------------ */
/*  Main component — auto-detects Tiptap availability                  */
/* ------------------------------------------------------------------ */

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
  engine = 'auto',
  onEditorReady,
}) => {
  const [useTiptap, setUseTiptap] = useState<boolean | null>(
    engine === 'tiptap' ? true : engine === 'native' ? false : null,
  );

  // Auto-detect Tiptap availability
  useEffect(() => {
    if (engine !== 'auto') return;
    let cancelled = false;
    probeTiptap().then((available) => {
      if (!cancelled) setUseTiptap(available);
    });
    return () => {
      cancelled = true;
    };
  }, [engine]);

  // While probing, render the native editor (it will be replaced if Tiptap is found)
  if (useTiptap === null) {
    return (
      <NativeEditorInner
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        autoFocus={autoFocus}
        minHeight={minHeight}
        maxHeight={maxHeight}
        className={className}
        toolbar={toolbar}
        onEditorReady={onEditorReady}
      />
    );
  }

  if (useTiptap) {
    return (
      <div style={wrapperStyles} className={className}>
        <Suspense
          fallback={
            <NativeEditorInner
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              readOnly={readOnly}
              autoFocus={autoFocus}
              minHeight={minHeight}
              maxHeight={maxHeight}
              toolbar={toolbar}
              onEditorReady={onEditorReady}
            />
          }
        >
          <LazyTiptapEditor
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            autoFocus={autoFocus}
            minHeight={minHeight}
            maxHeight={maxHeight}
          />
        </Suspense>
      </div>
    );
  }

  // Native engine
  return (
    <NativeEditorInner
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      autoFocus={autoFocus}
      minHeight={minHeight}
      maxHeight={maxHeight}
      className={className}
      toolbar={toolbar}
      onEditorReady={onEditorReady}
    />
  );
};
