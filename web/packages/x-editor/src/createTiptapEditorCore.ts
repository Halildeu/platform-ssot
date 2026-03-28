/**
 * createTiptapEditorCore — Tiptap/ProseMirror implementation of EditorCore
 *
 * Requires @tiptap/react and associated extensions as peer dependencies.
 * When Tiptap is not installed, this module should NOT be imported directly;
 * use the dynamic import path via `loadTiptapEditorCore()` instead.
 */

import type { EditorCore, EditorCommandChain } from './useEditor';
import type { OutputFormat, TableOptions } from './types';

/* ------------------------------------------------------------------ */
/*  Dynamic import helper — returns null when Tiptap is not installed  */
/* ------------------------------------------------------------------ */

let _tiptapModules: TiptapModules | null | undefined;

interface TiptapModules {
  Editor: typeof import('@tiptap/react').Editor;
  StarterKit: typeof import('@tiptap/starter-kit').default;
  Link: typeof import('@tiptap/extension-link').default;
  Image: typeof import('@tiptap/extension-image').default;
  Underline: typeof import('@tiptap/extension-underline').default;
  Placeholder: typeof import('@tiptap/extension-placeholder').default;
  Table: typeof import('@tiptap/extension-table').default;
  TableRow: typeof import('@tiptap/extension-table-row').default;
  TableCell: typeof import('@tiptap/extension-table-cell').default;
  TableHeader: typeof import('@tiptap/extension-table-header').default;
}

/**
 * Attempt to load Tiptap modules dynamically.
 * Returns null if any required module is unavailable.
 * Result is cached after the first call.
 */
export async function loadTiptapModules(): Promise<TiptapModules | null> {
  if (_tiptapModules !== undefined) return _tiptapModules;

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

    _tiptapModules = {
      Editor: tiptapReact.Editor,
      StarterKit: starterKit.default ?? starterKit,
      Link: link.default ?? link,
      Image: image.default ?? image,
      Underline: underline.default ?? underline,
      Placeholder: placeholder.default ?? placeholder,
      Table: table.default ?? table,
      TableRow: tableRow.default ?? tableRow,
      TableCell: tableCell.default ?? tableCell,
      TableHeader: tableHeader.default ?? tableHeader,
    };

    return _tiptapModules;
  } catch {
    _tiptapModules = null;
    return null;
  }
}

/**
 * Synchronous check: returns true if Tiptap modules have been successfully
 * loaded via `loadTiptapModules()` in a previous call.
 */
export function isTiptapAvailable(): boolean {
  return _tiptapModules != null;
}

/* ------------------------------------------------------------------ */
/*  EditorCore factory                                                 */
/* ------------------------------------------------------------------ */

export interface TiptapEditorCoreOptions {
  initialContent?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (html: string) => void;
}

/**
 * Create an EditorCore backed by a Tiptap Editor instance.
 *
 * Caller MUST ensure `loadTiptapModules()` has resolved successfully
 * before calling this function (i.e. `isTiptapAvailable()` is true).
 */
export function createTiptapEditorCore(
  options: TiptapEditorCoreOptions,
  modules?: TiptapModules,
): EditorCore & { _tiptapEditor: InstanceType<typeof import('@tiptap/react').Editor> } {
  const mods = modules ?? _tiptapModules;
  if (!mods) {
    throw new Error(
      'Tiptap modules are not loaded. Call loadTiptapModules() first or install @tiptap/react.',
    );
  }

  const {
    Editor,
    StarterKit,
    Link,
    Image,
    Underline,
    Placeholder,
    Table,
    TableRow,
    TableCell,
    TableHeader,
  } = mods;

  const extensions = [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
    }),
    Link.configure({ openOnClick: false }),
    Image,
    Underline,
    Placeholder.configure({
      placeholder: options.placeholder ?? '',
    }),
    Table.configure({ resizable: true }),
    TableRow,
    TableCell,
    TableHeader,
  ];

  const editor = new Editor({
    extensions,
    content: options.initialContent || '',
    editable: !options.readOnly,
    onUpdate: ({ editor: e }: { editor: any }) => {
      options.onChange?.(e.getHTML());
    },
  });

  const core: EditorCore & { _tiptapEditor: typeof editor } = {
    /* ---------- Content ---------- */
    getHTML: () => editor.getHTML(),

    getJSON: () => editor.getJSON() as Record<string, unknown>,

    getMarkdown: () => {
      // Basic HTML-to-markdown conversion; for production use a proper
      // serialiser like tiptap-markdown or turndown.
      return editor
        .getHTML()
        .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
        .replace(/<em>(.*?)<\/em>/g, '*$1*')
        .replace(/<u>(.*?)<\/u>/g, '$1')
        .replace(/<s>(.*?)<\/s>/g, '~~$1~~')
        .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
        .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
        .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
        .replace(/<h4>(.*?)<\/h4>/g, '#### $1\n')
        .replace(/<h5>(.*?)<\/h5>/g, '##### $1\n')
        .replace(/<h6>(.*?)<\/h6>/g, '###### $1\n')
        .replace(/<p>(.*?)<\/p>/g, '$1\n')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<[^>]+>/g, '');
    },

    setContent: (content: string, format?: OutputFormat) => {
      if (format === 'json') {
        editor.commands.setContent(JSON.parse(content));
      } else {
        editor.commands.setContent(content);
      }
    },

    isEmpty: () => editor.isEmpty,

    /* ---------- Commands ---------- */
    toggleBold: () => {
      editor.chain().focus().toggleBold().run();
    },
    toggleItalic: () => {
      editor.chain().focus().toggleItalic().run();
    },
    toggleUnderline: () => {
      editor.chain().focus().toggleUnderline().run();
    },
    toggleStrike: () => {
      editor.chain().focus().toggleStrike().run();
    },
    toggleCode: () => {
      editor.chain().focus().toggleCode().run();
    },
    toggleHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => {
      editor.chain().focus().toggleHeading({ level }).run();
    },
    toggleBulletList: () => {
      editor.chain().focus().toggleBulletList().run();
    },
    toggleOrderedList: () => {
      editor.chain().focus().toggleOrderedList().run();
    },
    toggleBlockquote: () => {
      editor.chain().focus().toggleBlockquote().run();
    },
    toggleCodeBlock: () => {
      editor.chain().focus().toggleCodeBlock().run();
    },
    insertHorizontalRule: () => {
      editor.chain().focus().setHorizontalRule().run();
    },
    insertTable: (opts: TableOptions) => {
      editor
        .chain()
        .focus()
        .insertTable({
          rows: opts.rows ?? 3,
          cols: opts.cols ?? 3,
          withHeaderRow: opts.withHeaderRow ?? true,
        })
        .run();
    },
    setLink: (url: string) => {
      editor.chain().focus().setLink({ href: url }).run();
    },
    unsetLink: () => {
      editor.chain().focus().unsetLink().run();
    },
    insertImage: (src: string, alt?: string) => {
      editor.chain().focus().setImage({ src, alt }).run();
    },

    /* ---------- State ---------- */
    isActive: (name: string, attrs?: Record<string, unknown>) => editor.isActive(name, attrs),

    get isFocused() {
      return editor.isFocused;
    },

    /* ---------- Selection ---------- */
    getSelectedText: () => {
      const { from, to } = editor.state.selection;
      return editor.state.doc.textBetween(from, to);
    },

    getSelectionPosition: () => {
      const { view } = editor;
      if (!view) return null;
      const { from } = editor.state.selection;
      try {
        const coords = view.coordsAtPos(from);
        return { top: coords.top, left: coords.left };
      } catch {
        return null;
      }
    },

    /* ---------- Lifecycle ---------- */
    focus: () => {
      editor.commands.focus();
    },
    blur: () => {
      editor.commands.blur();
    },
    destroy: () => {
      editor.destroy();
    },

    /* ---------- Chain ---------- */
    chain: () => {
      const ops: Array<() => void> = [];
      const chainObj: EditorCommandChain = {
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
        run: () => {
          ops.forEach((op) => op());
        },
      };
      return chainObj;
    },

    /* ---------- Tiptap-specific ---------- */
    _tiptapEditor: editor,
  };

  return core;
}
