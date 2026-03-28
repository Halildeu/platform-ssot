# @corp/x-editor

Rich text editor built on Tiptap with design-system styling, extensible slash commands, mentions, and collaborative editing support.

## Installation

```bash
pnpm add @corp/x-editor
```

Peer dependencies:

```bash
pnpm add @corp/design-system @tiptap/react @tiptap/starter-kit
```

## Quick Start

```tsx
import { RichTextEditor } from '@corp/x-editor';
import { useState } from 'react';

export function NotesEditor() {
  const [content, setContent] = useState('<p>Start typing...</p>');

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Write your notes here..."
      toolbar={['bold', 'italic', 'heading', 'bulletList', 'orderedList', 'link']}
    />
  );
}
```

## With Slash Commands

```tsx
import { RichTextEditor, SlashCommandMenu } from '@corp/x-editor';

const customCommands = [
  { name: 'callout', label: 'Callout', icon: 'info', action: (editor) => editor.insertCallout() },
  { name: 'divider', label: 'Divider', icon: 'minus', action: (editor) => editor.insertHorizontalRule() },
];

export function DocumentEditor() {
  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      extensions={[
        SlashCommandMenu({ commands: customCommands }),
      ]}
    />
  );
}
```

## With Mentions

```tsx
import { RichTextEditor, MentionList } from '@corp/x-editor';

async function fetchUsers(query: string) {
  const res = await fetch(`/api/users?search=${query}`);
  return res.json();
}

export function CommentEditor() {
  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      extensions={[
        MentionList({ fetchSuggestions: fetchUsers }),
      ]}
    />
  );
}
```

## Available Components

| Component | Description |
|-----------|-------------|
| `RichTextEditor` | Core editor with configurable toolbar |
| `SlashCommandMenu` | Extension for `/`-triggered command palette |
| `MentionList` | Extension for `@`-triggered user mentions |
| `CollaborativeEditor` | Multi-user real-time editing via Yjs |

## Hooks

| Hook | Description |
|------|-------------|
| `useEditorMode` | Toggle between rich text and markdown source |
| `useEditorState` | Access editor state outside the component |

## API Reference

Full props documentation: [/api/x-editor](/api/x-editor)

## License

Private -- internal use only.
