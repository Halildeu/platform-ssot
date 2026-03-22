export { RichTextEditor } from './RichTextEditor';
export type { RichTextEditorProps } from './RichTextEditor';

export { EditorToolbar } from './EditorToolbar';
export type { EditorToolbarProps } from './EditorToolbar';

export { EditorMenuBubble } from './EditorMenuBubble';
export type { EditorMenuBubbleProps } from './EditorMenuBubble';

export { SlashCommandMenu } from './SlashCommandMenu';
export type { SlashCommandMenuProps } from './SlashCommandMenu';

export { MentionList } from './MentionList';
export type { MentionListProps } from './MentionList';

export { EditorTableMenu } from './EditorTableMenu';
export type { EditorTableMenuProps } from './EditorTableMenu';

export { EditorLinkDialog } from './EditorLinkDialog';
export type { EditorLinkDialogProps } from './EditorLinkDialog';

export { EditorImageUpload } from './EditorImageUpload';
export type { EditorImageUploadProps } from './EditorImageUpload';

export { useEditor, useTiptapEditor } from './useEditor';
export type {
  UseEditorOptions,
  UseEditorReturn,
  EditorCore,
  EditorCommand,
  EditorCommandChain,
  EditorEngine,
  UseTiptapEditorOptions,
  UseTiptapEditorReturn,
} from './useEditor';

export {
  createTiptapEditorCore,
  loadTiptapModules,
  isTiptapAvailable,
} from './createTiptapEditorCore';
export type { TiptapEditorCoreOptions } from './createTiptapEditorCore';

export { TiptapEditor, ensureTiptapReactModules } from './TiptapEditor';
export type { TiptapEditorProps, TiptapEditorHandle } from './TiptapEditor';

export { useSlashCommands } from './useSlashCommands';
export type { UseSlashCommandsReturn } from './useSlashCommands';

export { useMentions } from './useMentions';
export type { UseMentionsReturn } from './useMentions';

export { defaultSlashCommands } from './defaultSlashCommands';

export type {
  EditorFormat,
  EditorBlock,
  OutputFormat,
  EditorRef,
  SlashCommand,
  MentionItem,
  TableOptions,
  EditorCollabConfig,
} from './types';

/* Wave 4 — Tiptap extension re-exports (dynamic loaders for optional deps) */
export { loadTaskList, loadTaskItem } from './extensions/TaskList';
export type { TaskListExtension, TaskItemExtension } from './extensions/TaskList';
export { loadHighlight } from './extensions/Highlight';
export type { HighlightExtension } from './extensions/Highlight';
export { loadTextAlign } from './extensions/TextAlign';
export type { TextAlignExtension } from './extensions/TextAlign';

/* Wave 3 — Cross-package composition */
export { useEditorFormField } from './composition/useEditorFormField';
export type {
  EditorFormFieldOptions,
  EditorFieldMeta,
  EditorFieldProps,
  UseEditorFormFieldReturn,
} from './composition/useEditorFormField';
