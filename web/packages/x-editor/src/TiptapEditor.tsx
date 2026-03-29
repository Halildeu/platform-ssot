/**
 * TiptapEditor — React component backed by @tiptap/react's EditorContent.
 *
 * This component is loaded dynamically by RichTextEditor when Tiptap is
 * available. It should NOT be imported directly in environments where
 * Tiptap peer dependencies are missing.
 */

import React, { useEffect, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react';
import type { OutputFormat, TableOptions } from './types';
import type { EditorCore } from './useEditor';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TiptapEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

export interface TiptapEditorHandle {
  editorCore: EditorCore | null;
}

/* ------------------------------------------------------------------ */
/*  Dynamic Tiptap imports — resolved at module eval time              */
/* ------------------------------------------------------------------ */

let _useEditor: typeof import('@tiptap/react').useEditor | undefined;
let _EditorContent: typeof import('@tiptap/react').EditorContent | undefined;
let _StarterKit: typeof import('@tiptap/starter-kit').default | undefined;
let _Link: typeof import('@tiptap/extension-link').default | undefined;
let _Image: typeof import('@tiptap/extension-image').default | undefined;
let _Underline: typeof import('@tiptap/extension-underline').default | undefined;
let _Placeholder: typeof import('@tiptap/extension-placeholder').default | undefined;
let _Table: typeof import('@tiptap/extension-table').default | undefined;
let _TableRow: typeof import('@tiptap/extension-table-row').default | undefined;
let _TableCell: typeof import('@tiptap/extension-table-cell').default | undefined;
let _TableHeader: typeof import('@tiptap/extension-table-header').default | undefined;

let _loaded = false;
let _loadPromise: Promise<boolean> | null = null;

/**
 * Lazily resolve all Tiptap React modules. Returns true if successful.
 */
export async function ensureTiptapReactModules(): Promise<boolean> {
  if (_loaded) return true;
  if (_loadPromise) return _loadPromise;

  _loadPromise = (async () => {
    try {
      const [
        tiptapReact,
        starterKit,
        link,
        image,
        underline,
        placeholder,
        table,
        tableRow,
        tableCell,
        tableHeader,
      ] = await Promise.all([
        import('@tiptap/react'),
        import('@tiptap/starter-kit'),
        import('@tiptap/extension-link'),
        import('@tiptap/extension-image'),
        import('@tiptap/extension-underline'),
        import('@tiptap/extension-placeholder'),
        import('@tiptap/extension-table'),
        import('@tiptap/extension-table-row'),
        import('@tiptap/extension-table-cell'),
        import('@tiptap/extension-table-header'),
      ]);

      _useEditor = tiptapReact.useEditor;
      _EditorContent = tiptapReact.EditorContent;
      _StarterKit = starterKit.default ?? starterKit;
      _Link = link.default ?? link;
      _Image = image.default ?? image;
      _Underline = underline.default ?? underline;
      _Placeholder = placeholder.default ?? placeholder;
      _Table = table.default ?? table;
      _TableRow = tableRow.default ?? tableRow;
      _TableCell = tableCell.default ?? tableCell;
      _TableHeader = tableHeader.default ?? tableHeader;
      _loaded = true;
      return true;
    } catch {
      _loaded = false;
      return false;
    }
  })();

  return _loadPromise;
}

/* ------------------------------------------------------------------ */
/*  Wrapper to build EditorCore from a Tiptap Editor instance          */
/* ------------------------------------------------------------------ */

function buildEditorCoreFromTiptap(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any,
): EditorCore {
  return {
    getHTML: () => editor.getHTML(),
    getJSON: () => editor.getJSON(),
    getMarkdown: () =>
      editor
        .getHTML()
        .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
        .replace(/<em>(.*?)<\/em>/g, '*$1*')
        .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
        .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
        .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
        .replace(/<p>(.*?)<\/p>/g, '$1\n')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<[^>]+>/g, ''),
    setContent: (content: string, format?: OutputFormat) => {
      if (format === 'json') {
        editor.commands.setContent(JSON.parse(content));
      } else {
        editor.commands.setContent(content);
      }
    },
    isEmpty: () => editor.isEmpty,

    toggleBold: () => editor.chain().focus().toggleBold().run(),
    toggleItalic: () => editor.chain().focus().toggleItalic().run(),
    toggleUnderline: () => editor.chain().focus().toggleUnderline().run(),
    toggleStrike: () => editor.chain().focus().toggleStrike().run(),
    toggleCode: () => editor.chain().focus().toggleCode().run(),
    toggleHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) =>
      editor.chain().focus().toggleHeading({ level }).run(),
    toggleBulletList: () => editor.chain().focus().toggleBulletList().run(),
    toggleOrderedList: () => editor.chain().focus().toggleOrderedList().run(),
    toggleBlockquote: () => editor.chain().focus().toggleBlockquote().run(),
    toggleCodeBlock: () => editor.chain().focus().toggleCodeBlock().run(),
    insertHorizontalRule: () => editor.chain().focus().setHorizontalRule().run(),
    insertTable: (opts: TableOptions) =>
      editor
        .chain()
        .focus()
        .insertTable({
          rows: opts.rows ?? 3,
          cols: opts.cols ?? 3,
          withHeaderRow: opts.withHeaderRow ?? true,
        })
        .run(),
    setLink: (url: string) => editor.chain().focus().setLink({ href: url }).run(),
    unsetLink: () => editor.chain().focus().unsetLink().run(),
    insertImage: (src: string, alt?: string) =>
      editor.chain().focus().setImage({ src, alt }).run(),

    isActive: (name: string, attrs?: Record<string, unknown>) => editor.isActive(name, attrs),
    get isFocused() {
      return editor.isFocused;
    },

    getSelectedText: () => {
      const { from, to } = editor.state.selection;
      return editor.state.doc.textBetween(from, to);
    },
    getSelectionPosition: () => {
      try {
        const { from } = editor.state.selection;
        const coords = editor.view.coordsAtPos(from);
        return { top: coords.top, left: coords.left };
      } catch {
        return null;
      }
    },

    focus: () => editor.commands.focus(),
    blur: () => editor.commands.blur(),
    destroy: () => editor.destroy(),

    chain: () => {
      const ops: Array<() => void> = [];
      const chainObj = {
        toggleBold: () => {
          ops.push(() => editor.chain().focus().toggleBold().run());
          return chainObj;
        },
        toggleItalic: () => {
          ops.push(() => editor.chain().focus().toggleItalic().run());
          return chainObj;
        },
        toggleUnderline: () => {
          ops.push(() => editor.chain().focus().toggleUnderline().run());
          return chainObj;
        },
        toggleStrike: () => {
          ops.push(() => editor.chain().focus().toggleStrike().run());
          return chainObj;
        },
        toggleCode: () => {
          ops.push(() => editor.chain().focus().toggleCode().run());
          return chainObj;
        },
        run: () => ops.forEach((op) => op()),
      };
      return chainObj;
    },
  };
}

/* ------------------------------------------------------------------ */
/*  TiptapEditor component                                             */
/* ------------------------------------------------------------------ */

export const TiptapEditor = forwardRef<TiptapEditorHandle, TiptapEditorProps>(
  function TiptapEditor(
    { value, onChange, placeholder, readOnly = false, autoFocus = false, minHeight = 200, maxHeight, className },
    ref,
  ) {
    if (!_loaded || !_useEditor || !_EditorContent) {
      throw new Error(
        'TiptapEditor requires Tiptap modules. Call ensureTiptapReactModules() before rendering.',
      );
    }

    const UseEditor = _useEditor;
    const EditorContentComponent = _EditorContent;

    const extensions = useMemo(
      () => [
        _StarterKit!.configure({
          heading: { levels: [1, 2, 3, 4, 5, 6] },
          // v3: StarterKit includes link and underline by default —
          // disable to avoid duplicate extension errors.
          link: false,
          underline: false,
        }),
        _Link!.configure({ openOnClick: false }),
        _Image!,
        _Underline!,
        _Placeholder!.configure({ placeholder: placeholder ?? '' }),
        _Table!.configure({ resizable: true }),
        _TableRow!,
        _TableCell!,
        _TableHeader!,
      ],
      [placeholder],
    );

    const editor = UseEditor({
      extensions,
      content: value ?? '',
      editable: !readOnly,
      immediatelyRender: false,
      autofocus: autoFocus ? 'end' : false,
      onUpdate: ({ editor: e }: { editor: any }) => {
        onChange?.(e.getHTML());
      },
    });

    // Sync external value changes
    useEffect(() => {
      if (editor && value !== undefined && editor.getHTML() !== value) {
        editor.commands.setContent(value, { emitUpdate: false });
      }
    }, [editor, value]);

    // Sync readOnly
    useEffect(() => {
      if (editor) {
        editor.setEditable(!readOnly);
      }
    }, [editor, readOnly]);

    // Build EditorCore handle
    const editorCore = useMemo(
      () => (editor ? buildEditorCoreFromTiptap(editor) : null),
      [editor],
    );

    useImperativeHandle(ref, () => ({ editorCore }), [editorCore]);

    const wrapperStyle: React.CSSProperties = {
      minHeight: `${minHeight}px`,
      maxHeight: maxHeight ? `${maxHeight}px` : undefined,
      overflowY: maxHeight ? 'auto' : undefined,
    };

    return (
      <div className={className} style={wrapperStyle}>
        <EditorContentComponent editor={editor} />
      </div>
    );
  },
);
