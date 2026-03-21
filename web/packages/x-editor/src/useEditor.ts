import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import type { EditorFormat, OutputFormat, TableOptions } from './types';

/* ------------------------------------------------------------------ */
/*  EditorCore — engine-agnostic editor abstraction                    */
/*                                                                     */
/*  Current: Native contentEditable implementation                     */
/*  Planned: Tiptap integration via createTiptapEditorCore()           */
/* ------------------------------------------------------------------ */

export interface EditorCommand {
  name: string;
  execute: () => void;
  isActive: () => boolean;
  canExecute: () => boolean;
}

export interface EditorCommandChain {
  toggleBold: () => EditorCommandChain;
  toggleItalic: () => EditorCommandChain;
  toggleUnderline: () => EditorCommandChain;
  toggleStrike: () => EditorCommandChain;
  toggleCode: () => EditorCommandChain;
  run: () => void;
}

export interface EditorCore {
  // Content
  getHTML: () => string;
  getJSON: () => Record<string, unknown>;
  getMarkdown: () => string;
  setContent: (content: string, format?: OutputFormat) => void;
  isEmpty: () => boolean;

  // Commands
  chain: () => EditorCommandChain;
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  toggleStrike: () => void;
  toggleCode: () => void;
  toggleHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => void;
  toggleBulletList: () => void;
  toggleOrderedList: () => void;
  toggleBlockquote: () => void;
  toggleCodeBlock: () => void;
  insertHorizontalRule: () => void;
  insertTable: (options: TableOptions) => void;
  setLink: (url: string) => void;
  unsetLink: () => void;
  insertImage: (src: string, alt?: string) => void;

  // State
  isActive: (name: string, attrs?: Record<string, unknown>) => boolean;
  isFocused: boolean;

  // Selection
  getSelectedText: () => string;
  getSelectionPosition: () => { top: number; left: number } | null;

  // Lifecycle
  focus: () => void;
  blur: () => void;
  destroy: () => void;
}

/* ------------------------------------------------------------------ */
/*  Native implementation — wraps contentEditable behind EditorCore    */
/* ------------------------------------------------------------------ */

const FORMAT_COMMAND_MAP: Record<EditorFormat, string> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strikethrough: 'strikeThrough',
  code: 'fontName',
};

function execNativeCommand(command: string, value?: string): void {
  document.execCommand(command, false, value);
}

function queryNativeCommandState(command: string): boolean {
  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
}

interface NativeEditorCoreOptions {
  onChange?: (html: string) => void;
}

function createNativeEditorCore(
  element: HTMLElement,
  options: NativeEditorCoreOptions,
): EditorCore {
  const { onChange } = options;

  function notifyChange(): void {
    onChange?.(element.innerHTML);
  }

  function ensureFocus(): void {
    element.focus();
  }

  function execAndNotify(command: string, value?: string): void {
    ensureFocus();
    execNativeCommand(command, value);
    notifyChange();
  }

  const core: EditorCore = {
    // --- Content ---
    getHTML: () => element.innerHTML,

    getJSON: () => ({
      type: 'doc',
      content: [{ type: 'html', value: element.innerHTML }],
    }),

    getMarkdown: () => {
      // Basic HTML-to-markdown fallback; real conversion deferred to Tiptap migration
      return element.innerText;
    },

    setContent: (content: string, _format?: OutputFormat) => {
      element.innerHTML = content;
      notifyChange();
    },

    isEmpty: () => {
      const html = element.innerHTML;
      return html === '' || html === '<br>' || html === '<div><br></div>';
    },

    // --- Command chain ---
    chain: () => {
      const ops: Array<() => void> = [];
      const chainObj: EditorCommandChain = {
        toggleBold: () => { ops.push(() => core.toggleBold()); return chainObj; },
        toggleItalic: () => { ops.push(() => core.toggleItalic()); return chainObj; },
        toggleUnderline: () => { ops.push(() => core.toggleUnderline()); return chainObj; },
        toggleStrike: () => { ops.push(() => core.toggleStrike()); return chainObj; },
        toggleCode: () => { ops.push(() => core.toggleCode()); return chainObj; },
        run: () => { ops.forEach((op) => op()); },
      };
      return chainObj;
    },

    // --- Formatting commands ---
    toggleBold: () => execAndNotify('bold'),
    toggleItalic: () => execAndNotify('italic'),
    toggleUnderline: () => execAndNotify('underline'),
    toggleStrike: () => execAndNotify('strikeThrough'),

    toggleCode: () => {
      // Native contentEditable has no inline-code command;
      // wrap selection in <code> as a best-effort
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const code = document.createElement('code');
        range.surroundContents(code);
        notifyChange();
      }
    },

    toggleHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => {
      execAndNotify('formatBlock', `h${level}`);
    },

    toggleBulletList: () => execAndNotify('insertUnorderedList'),
    toggleOrderedList: () => execAndNotify('insertOrderedList'),

    toggleBlockquote: () => execAndNotify('formatBlock', 'blockquote'),

    toggleCodeBlock: () => {
      execAndNotify('formatBlock', 'pre');
    },

    insertHorizontalRule: () => execAndNotify('insertHorizontalRule'),

    insertTable: (opts: TableOptions) => {
      const rows = opts.rows ?? 3;
      const cols = opts.cols ?? 3;
      const headerRow = opts.withHeaderRow ?? true;
      let html = '<table><tbody>';
      for (let r = 0; r < rows; r++) {
        html += '<tr>';
        const tag = headerRow && r === 0 ? 'th' : 'td';
        for (let c = 0; c < cols; c++) {
          html += `<${tag}>&nbsp;</${tag}>`;
        }
        html += '</tr>';
      }
      html += '</tbody></table>';
      execAndNotify('insertHTML', html);
    },

    setLink: (url: string) => execAndNotify('createLink', url),

    unsetLink: () => execAndNotify('unlink'),

    insertImage: (src: string, alt?: string) => {
      const img = `<img src="${src}"${alt ? ` alt="${alt}"` : ''} />`;
      execAndNotify('insertHTML', img);
    },

    // --- State ---
    isActive: (name: string, _attrs?: Record<string, unknown>) => {
      const formatKey = name as EditorFormat;
      if (formatKey in FORMAT_COMMAND_MAP) {
        if (formatKey === 'code') return false;
        return queryNativeCommandState(FORMAT_COMMAND_MAP[formatKey]);
      }
      // Block-level checks
      const block = document.queryCommandValue('formatBlock');
      if (name.startsWith('heading')) {
        const level = name.replace('heading', '');
        return block.toLowerCase() === `h${level}`;
      }
      return false;
    },

    get isFocused() {
      return document.activeElement === element;
    },

    // --- Selection ---
    getSelectedText: () => {
      const sel = window.getSelection();
      return sel ? sel.toString() : '';
    },

    getSelectionPosition: () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      return { top: rect.top, left: rect.left };
    },

    // --- Lifecycle ---
    focus: () => element.focus(),
    blur: () => element.blur(),
    destroy: () => {
      // Native implementation has nothing to tear down beyond DOM removal
    },
  };

  return core;
}

/* Future: Tiptap implementation
 * function createTiptapEditorCore(
 *   element: HTMLElement,
 *   options: NativeEditorCoreOptions,
 * ): EditorCore {
 *   const editor = new Editor({
 *     element,
 *     extensions: [StarterKit, ...],
 *     content: '',
 *     onUpdate: ({ editor }) => options.onChange?.(editor.getHTML()),
 *   });
 *   return {
 *     getHTML: () => editor.getHTML(),
 *     getJSON: () => editor.getJSON(),
 *     getMarkdown: () => editor.storage.markdown?.getMarkdown?.() ?? '',
 *     setContent: (c) => editor.commands.setContent(c),
 *     isEmpty: () => editor.isEmpty,
 *     chain: () => editor.chain().focus(),
 *     toggleBold: () => editor.chain().focus().toggleBold().run(),
 *     // ... map all commands to Tiptap equivalents
 *     isActive: (name, attrs) => editor.isActive(name, attrs),
 *     isFocused: editor.isFocused,
 *     getSelectedText: () => { ... },
 *     getSelectionPosition: () => { ... },
 *     focus: () => editor.commands.focus(),
 *     blur: () => editor.commands.blur(),
 *     destroy: () => editor.destroy(),
 *   };
 * }
 */

/* ------------------------------------------------------------------ */
/*  useEditor hook — public API                                        */
/* ------------------------------------------------------------------ */

export interface UseEditorOptions {
  initialContent?: string;
  onChange?: (html: string) => void;
}

export interface UseEditorReturn {
  editorRef: React.RefObject<HTMLDivElement | null>;
  editorCore: EditorCore | null;
  content: string;
  setContent: (html: string) => void;
  focus: () => void;
  clear: () => void;
  isEmpty: boolean;
  /** @deprecated Use editorCore.toggleBold() etc. instead of exec('bold') */
  exec: (command: string, value?: string) => void;
  /** @deprecated Use editorCore.isActive(name) instead */
  isFormatActive: (format: EditorFormat) => boolean;
}

export function useEditor(options?: UseEditorOptions): UseEditorReturn {
  const { initialContent = '', onChange } = options ?? {};
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [content, setContentState] = useState(initialContent);
  const coreRef = useRef<EditorCore | null>(null);
  const [coreReady, setCoreReady] = useState(false);

  const handleChange = useCallback(
    (html: string) => {
      setContentState(html);
      onChange?.(html);
    },
    [onChange],
  );

  // Initialize EditorCore when the DOM element mounts
  useEffect(() => {
    const el = editorRef.current;
    if (!el) {
      coreRef.current = null;
      setCoreReady(false);
      return;
    }

    const core = createNativeEditorCore(el, { onChange: handleChange });

    // Set initial content if provided
    if (initialContent) {
      el.innerHTML = initialContent;
    }

    // Listen for native input events to sync content
    const handleInput = () => handleChange(el.innerHTML);
    el.addEventListener('input', handleInput);

    coreRef.current = core;
    setCoreReady(true);

    return () => {
      el.removeEventListener('input', handleInput);
      core.destroy();
      coreRef.current = null;
      setCoreReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleChange]);

  const editorCore = useMemo(() => (coreReady ? coreRef.current : null), [coreReady]);

  const setContent = useCallback(
    (html: string) => {
      if (coreRef.current) {
        coreRef.current.setContent(html);
      } else {
        const el = editorRef.current;
        if (el) el.innerHTML = html;
        setContentState(html);
        onChange?.(html);
      }
    },
    [onChange],
  );

  const focus = useCallback(() => {
    coreRef.current?.focus() ?? editorRef.current?.focus();
  }, []);

  const clear = useCallback(() => {
    setContent('');
  }, [setContent]);

  const isEmpty = content === '' || content === '<br>' || content === '<div><br></div>';

  // Legacy exec — delegates through EditorCore when available
  const exec = useCallback(
    (command: string, value?: string) => {
      if (coreRef.current) {
        editorRef.current?.focus();
        execNativeCommand(command, value);
        handleChange(editorRef.current?.innerHTML ?? '');
      }
    },
    [handleChange],
  );

  const isFormatActive = useCallback((format: EditorFormat): boolean => {
    if (coreRef.current) {
      return coreRef.current.isActive(format);
    }
    if (format === 'code') return false;
    return queryNativeCommandState(FORMAT_COMMAND_MAP[format]);
  }, []);

  return {
    editorRef,
    editorCore,
    content,
    setContent,
    focus,
    clear,
    isEmpty,
    exec,
    isFormatActive,
  };
}
