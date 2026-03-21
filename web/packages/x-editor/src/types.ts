import type React from 'react';

export type EditorFormat = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code';
export type EditorBlock = 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'orderedList' | 'blockquote' | 'codeBlock';
export type OutputFormat = 'html' | 'json' | 'markdown';

/** Reference handle for programmatic editor control */
export interface EditorRef {
  toggleHeading: (level: 1 | 2 | 3) => void;
  toggleBulletList: () => void;
  toggleOrderedList: () => void;
  toggleBlockquote: () => void;
  toggleCodeBlock: () => void;
  insertHorizontalRule: () => void;
  insertTable: (options: TableOptions) => void;
  insertImage: (src: string, alt?: string) => void;
  focus: () => void;
}

/** A single slash command entry */
export interface SlashCommand {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
  execute: (editor: EditorRef) => void;
}

/** An item that can be mentioned with @ */
export interface MentionItem {
  id: string;
  label: string;
  avatar?: string;
  type?: 'user' | 'page' | 'tag';
}

/** Options for table creation */
export interface TableOptions {
  rows?: number;
  cols?: number;
  withHeaderRow?: boolean;
}

/** Collaborative editing configuration */
export interface EditorCollabConfig {
  documentId: string;
  userId: string;
  userName: string;
  userColor?: string;
  onSync?: (content: string) => void;
}
