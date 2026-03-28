# @mfe/x-editor — API Contract v1

## Status: DRAFT | Date: 2026-03-21

## 1. Public API Surface

### Components
```tsx
RichTextEditor
  props: {
    content?: string;                // HTML or Markdown initial content
    format?: 'html' | 'markdown';   // output format
    editable?: boolean;
    placeholder?: string;
    extensions?: EditorExtension[];  // reserved — not active in v1
    density?: 'compact' | 'comfortable' | 'spacious';
    onChange?: (content: string) => void;
    onBlur?: (content: string) => void;
    onFocus?: () => void;
  }

EditorToolbar
  props: {
    editor: EditorInstance;
    groups?: ToolbarGroup[];        // customizable button groups
    sticky?: boolean;
    minimal?: boolean;              // reduced set for inline editing
  }

EditorContent
  props: { editor: EditorInstance; className?: string }

EditorMenuBubble
  props: {
    editor: EditorInstance;
    actions?: BubbleAction[];       // link, bold, italic, etc.
    showOnSelection?: boolean;
  }

EditorCodeBlock
  props: {
    language?: string;
    showLineNumbers?: boolean;
    highlighter?: 'shiki' | 'highlight.js';
  }
```

### Hooks
- `useEditor(config)` — creates editor instance with lifecycle management; returns `EditorCore` abstraction
  - Native `contentEditable` implementation behind `EditorCore` abstraction
- `useEditorState(editor)` — returns reactive state: `{ isBold, isItalic, isLink, currentHeading, wordCount, ... }`

### Utilities
- `htmlToMarkdown(html)` — converts HTML output to Markdown
- `markdownToHtml(md)` — converts Markdown input to HTML
- `sanitizeHtml(html)` — XSS-safe HTML sanitization
- `countWords(content)` — word count from HTML or plain text

### Type Exports
- `RichTextEditorProps`, `EditorToolbarProps`, `EditorMenuBubbleProps`
- `EditorInstance` (native EditorCore handle)
- `ToolbarGroup`, `BubbleAction`
- `EditorConfig`, `EditorState`

### Library
- **Primary**: `@tiptap/react` + ProseMirror via `createTiptapEditorCore()` behind `EditorCore` interface
- **Fallback**: Native `contentEditable` + `document.execCommand` when Tiptap peer deps are not installed

### Editor Architecture
- `EditorCore` interface abstracts all editor operations (content, commands, state, selection, lifecycle)
- `createTiptapEditorCore()` — primary implementation using Tiptap/ProseMirror
- `createNativeEditorCore()` — fallback implementation using native browser APIs
- Auto-detection: `RichTextEditor` dynamically probes for Tiptap and falls back to native
- `engine` prop on `RichTextEditor` to force `'tiptap'`, `'native'`, or `'auto'` (default)

## 2. Theme / Token Integration

### Consumed Tokens
- `--editor-bg`, `--editor-fg`, `--editor-border`, `--editor-border-focus`
- `--editor-toolbar-bg`, `--editor-toolbar-border`
- `--editor-placeholder-color`
- `--editor-selection-bg`, `--editor-selection-fg`
- `--editor-code-bg`, `--editor-code-fg`, `--editor-code-border`
- `--editor-link-color`, `--editor-mention-bg`, `--editor-mention-fg`
- Typography: `--font-family-prose`, `--font-size-body`, `--font-size-heading-1` through `--font-size-heading-3`
- Spacing: `--editor-padding-compact`, `--editor-padding-comfortable`, `--editor-padding-spacious`

### Dark Mode
- Editor surface, toolbar, and bubble menu adapt via `[data-theme="dark"]`
- Code blocks use dark syntax theme automatically
- Selection highlight adjusts for dark background contrast

### Density Support
- `compact` — reduced padding, smaller toolbar icons, tighter line height
- `comfortable` — default prose spacing
- `spacious` — wider margins, larger line height, more toolbar spacing

### Custom Theme Extension
- `themeOverrides` prop for partial token override
- Prose styling customizable via CSS scope

## 3. Access Control

### Granularity
- **Component-level**: entire editor visible/hidden
- **Section-level**: toolbar features individually controllable (e.g., disable image upload)
- **Field-level**: specific formatting options (bold, heading, code) can be gated

### AccessControlledProps Integration
```tsx
<RichTextEditor
  accessControl={{
    resource: 'content.editor',
    features: {
      imageUpload: Permission;
      codeBlock: Permission;
      mention: Permission;
      table: Permission;
    }
  }}
/>
```

### Policy-Based Visibility States
- `full` — all editing features enabled
- `readonly` — content rendered as styled HTML, no editing, toolbar hidden
- `disabled` — editor visible with overlay, content not selectable
- `hidden` — component not rendered

## 4. SSR / Client Boundary

### Server-Renderable
- Initial content as static HTML (for SEO and fast paint)
- Toolbar layout shell
- Placeholder text

### Client-Only (`'use client'`)
- Editor instance (native contentEditable)
- All editing interactions (typing, formatting, selection)
- Toolbar button state (active/inactive)
- Bubble menu positioning

### Hydration Strategy
- SSR renders content as sanitized HTML in a styled `<div>`
- Editor mounts on client (native contentEditable)
- Content preserved during swap (no flash)

### Streaming SSR
- Static content HTML streams first
- Editor interactivity initializes on client

## 5. Data Model

### Input/Output
```typescript
interface EditorConfig {
  content?: string;                // initial content (HTML or Markdown)
  format: 'html' | 'markdown';    // output format
  extensions?: EditorExtension[];  // reserved — not active in v1
  editable?: boolean;
}

// Output is a string in the chosen format
// HTML: '<p>Hello <strong>world</strong></p>'
// Markdown: 'Hello **world**'
```

### Extension Data
```typescript
interface MentionConfig {
  trigger: string;               // '@' by default
  suggestions: (query: string) => Promise<MentionItem[]>;
  renderItem?: (item: MentionItem) => ReactNode;
}

interface MentionItem {
  id: string;
  label: string;
  avatar?: string;
  metadata?: Record<string, unknown>;
}

interface ImageConfig {
  upload: (file: File) => Promise<{ url: string; alt?: string }>;
  maxSize?: number;              // bytes
  allowedTypes?: string[];       // MIME types
}
```

### Validation
- HTML output sanitized via DOMPurify or equivalent
- Markdown output generated via turndown with safe defaults
- Image upload validates file type and size before upload

### State Management
- **Controlled**: `content` prop for external state management, `onChange` emits on every transaction
- **Uncontrolled**: internal Tiptap state with `onBlur` for save-on-blur pattern
- Editor state (formatting, cursor position) always internal

### Async Data Loading
- Mention suggestions fetched asynchronously via `suggestions()` callback
- Image upload async with progress tracking
- Initial content can be loaded lazily (editor shows placeholder until content prop updates)

## 6. Accessibility

### WCAG Target
- **AA** minimum

### Keyboard Navigation
- Standard text editing shortcuts (Ctrl/Cmd + B/I/U, etc.)
- `Tab` to indent in lists, `Shift+Tab` to outdent
- `Ctrl/Cmd + Shift + 1-3` for heading levels
- Toolbar buttons accessible via `Tab` and `Enter`/`Space`
- Bubble menu accessible via keyboard when text selected
- `Escape` to dismiss mention suggestions and bubble menu
- Mention navigation: arrow keys to select, `Enter` to insert

### Screen Reader Announcements
- Editor role and label announced on focus
- Formatting state announced: "Bold on", "Heading level 2"
- Mention suggestions announced: "3 suggestions available, use arrow keys"
- Image upload progress announced
- `aria-live="polite"` for formatting changes and mentions

### Focus Management
- Focus stays in editor during formatting operations
- Focus moves to bubble menu on text selection (keyboard shortcut)
- Focus returns to editor when bubble menu dismissed
- Mention popup traps focus during selection

### ARIA Attributes
- `role="textbox"` with `aria-multiline="true"` on editor
- `aria-label` on editor with configurable description
- Toolbar buttons: `aria-pressed` for toggle state
- `aria-expanded` on mention/link popups
- `aria-describedby` for character/word count

## 7. Performance Budget

### Bundle Size
- **< 45 KB** gzipped (Tiptap engine, excluding Tiptap core ~60KB and ProseMirror ~80KB as peer deps)
- **< 15 KB** gzipped (native fallback only)
- Extensions loaded on demand (mention, table, code-block)
- Tiptap modules lazy-loaded via dynamic import — zero cost when not installed
- Syntax highlighter lazy-loaded on first code block

### Render Targets
- **10,000 words**: editor responsive, typing latency < 16ms
- **Initial mount**: < 200ms including extension initialization
- **Format toggle**: < 16ms (single frame)
- **Mention suggestion popup**: < 100ms

### Memory Budget
- Editor instance: < 5MB for 10K word document
- Document model grows linearly with content
- Image blobs cleaned up after upload

### Lazy Loading
- Table extension loaded on first table insertion
- Code block syntax highlighter loaded on first code block
- Image upload handler loaded on first image action
- Markdown converter loaded on demand based on `format` prop

## 8. Test & Docs Exit Criteria

### Tests
- **30 unit tests** — HTML/Markdown conversion, sanitization, word count, mention parsing, toolbar state
- **8 integration tests** — full editor render, formatting flow, mention insertion, image upload, code block, table operations
- **5 visual regression tests** — default editor, dark mode, toolbar states, bubble menu, code block rendering

### Contract Tests
- EditorCore interface contract verified
- HTML output shape validation (no XSS vectors)
- Markdown round-trip fidelity (HTML -> MD -> HTML)

### Documentation
- API reference page with full props table
- **8 examples** — basic editor, markdown mode, custom toolbar, mentions, image upload, code blocks, tables, readonly mode
- **3 recipes** — comment editor (minimal), CMS content editor (full), collaborative editing setup

---

## v2 Roadmap (Out of Scope for v1)

> v1 scope is frozen. Items below are tracked for v2 and do not affect v1 quality gates.

### ~~Tiptap Migration~~ (MOVED TO v1)
> Completed: Tiptap engine is now the primary EditorCore implementation in v1.
> See "Library" and "Editor Architecture" sections above.

### Extensions (enabled by Tiptap in v1 — advanced configuration in v2)
- **Mention** — `@` triggers user/entity mention with configurable data source
- **Image** — inline and block images with upload, resize, alt text
- **Table** — rows, columns, merge, resize (basic support in v1 via Table extensions)
- **Code Block** — syntax-highlighted code with language selector (lowlight in v2)
- **Link** — auto-detect URLs, editable link attributes (basic link set/unset in v1)

### Additional v2 Capabilities
- Image upload and drag-drop in editor
- Mention suggestions popup
- Tiptap extension compatibility contract tests
- `extensions` prop activation with Tiptap extension array
- Tiptap `editorProps.attributes` for custom class injection; `.ProseMirror` CSS scope
- ProseMirror DOM hydration replacing native contentEditable mount
