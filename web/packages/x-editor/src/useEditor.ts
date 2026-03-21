import { useRef, useState, useCallback, useEffect } from 'react';
import type { EditorFormat } from './types';

export interface UseEditorOptions {
  initialContent?: string;
  onChange?: (html: string) => void;
}

export interface UseEditorReturn {
  editorRef: React.RefObject<HTMLDivElement | null>;
  content: string;
  setContent: (html: string) => void;
  focus: () => void;
  clear: () => void;
  isEmpty: boolean;
  exec: (command: string, value?: string) => void;
  isFormatActive: (format: EditorFormat) => boolean;
}

const FORMAT_COMMAND_MAP: Record<EditorFormat, string> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strikethrough: 'strikeThrough',
  code: 'fontName',
};

export function useEditor(options?: UseEditorOptions): UseEditorReturn {
  const { initialContent = '', onChange } = options ?? {};
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [content, setContentState] = useState(initialContent);

  const syncContent = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    setContentState(html);
    onChange?.(html);
  }, [onChange]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    const handleInput = () => syncContent();
    el.addEventListener('input', handleInput);
    return () => el.removeEventListener('input', handleInput);
  }, [syncContent]);

  const setContent = useCallback((html: string) => {
    const el = editorRef.current;
    if (el) {
      el.innerHTML = html;
    }
    setContentState(html);
    onChange?.(html);
  }, [onChange]);

  const focus = useCallback(() => {
    editorRef.current?.focus();
  }, []);

  const clear = useCallback(() => {
    setContent('');
  }, [setContent]);

  const isEmpty = content === '' || content === '<br>' || content === '<div><br></div>';

  const exec = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncContent();
  }, [syncContent]);

  const isFormatActive = useCallback((format: EditorFormat): boolean => {
    if (format === 'code') {
      // No direct queryCommandState for inline code; check font family
      return false;
    }
    const command = FORMAT_COMMAND_MAP[format];
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  }, []);

  return {
    editorRef,
    content,
    setContent,
    focus,
    clear,
    isEmpty,
    exec,
    isFormatActive,
  };
}
