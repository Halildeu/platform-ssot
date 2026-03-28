import type { SlashCommand } from './types';

export const defaultSlashCommands: SlashCommand[] = [
  {
    id: 'h1',
    label: 'Heading 1',
    description: 'Large section heading',
    category: 'Basic',
    execute: (editor) => editor.toggleHeading(1),
  },
  {
    id: 'h2',
    label: 'Heading 2',
    description: 'Medium section heading',
    category: 'Basic',
    execute: (editor) => editor.toggleHeading(2),
  },
  {
    id: 'h3',
    label: 'Heading 3',
    description: 'Small section heading',
    category: 'Basic',
    execute: (editor) => editor.toggleHeading(3),
  },
  {
    id: 'bullet',
    label: 'Bullet List',
    description: 'Unordered list with bullet points',
    category: 'Lists',
    execute: (editor) => editor.toggleBulletList(),
  },
  {
    id: 'ordered',
    label: 'Numbered List',
    description: 'Ordered list with numbers',
    category: 'Lists',
    execute: (editor) => editor.toggleOrderedList(),
  },
  {
    id: 'blockquote',
    label: 'Quote',
    description: 'Block quotation',
    category: 'Basic',
    execute: (editor) => editor.toggleBlockquote(),
  },
  {
    id: 'code',
    label: 'Code Block',
    description: 'Preformatted code block',
    category: 'Basic',
    execute: (editor) => editor.toggleCodeBlock(),
  },
  {
    id: 'divider',
    label: 'Divider',
    description: 'Horizontal separator line',
    category: 'Basic',
    execute: (editor) => editor.insertHorizontalRule(),
  },
  {
    id: 'table',
    label: 'Table',
    description: 'Insert a table grid',
    category: 'Advanced',
    execute: (editor) => editor.insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
  },
];
