import React, { useCallback, useEffect, useState } from 'react';

export interface EditorToolbarProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

interface ToolbarButton {
  label: string;
  icon: string;
  command: string;
  value?: string;
  shortcut?: string;
  type: 'format' | 'block' | 'action';
}

const SEPARATOR = 'separator' as const;

type ToolbarItem = ToolbarButton | typeof SEPARATOR;

const TOOLBAR_ITEMS: ToolbarItem[] = [
  { label: 'Bold', icon: 'B', command: 'bold', shortcut: 'Ctrl+B', type: 'format' },
  { label: 'Italic', icon: 'I', command: 'italic', shortcut: 'Ctrl+I', type: 'format' },
  { label: 'Underline', icon: 'U', command: 'underline', shortcut: 'Ctrl+U', type: 'format' },
  { label: 'Strikethrough', icon: 'S', command: 'strikeThrough', type: 'format' },
  SEPARATOR,
  { label: 'Heading 1', icon: 'H1', command: 'formatBlock', value: 'h1', type: 'block' },
  { label: 'Heading 2', icon: 'H2', command: 'formatBlock', value: 'h2', type: 'block' },
  { label: 'Heading 3', icon: 'H3', command: 'formatBlock', value: 'h3', type: 'block' },
  SEPARATOR,
  { label: 'Bullet List', icon: '\u2022', command: 'insertUnorderedList', type: 'block' },
  { label: 'Ordered List', icon: '1.', command: 'insertOrderedList', type: 'block' },
  SEPARATOR,
  { label: 'Blockquote', icon: '\u201C', command: 'formatBlock', value: 'blockquote', type: 'block' },
  { label: 'Code Block', icon: '<>', command: 'formatBlock', value: 'pre', type: 'block' },
  SEPARATOR,
  { label: 'Link', icon: '\uD83D\uDD17', command: 'createLink', type: 'action' },
  { label: 'Clear Formatting', icon: '\u2715', command: 'removeFormat', type: 'action' },
];

const toolbarStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '2px',
  padding: '6px 8px',
  borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
  backgroundColor: 'var(--surface-subtle, #f8fafc)',
  borderTopLeftRadius: 'inherit',
  borderTopRightRadius: 'inherit',
};

const buttonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '28px',
  height: '28px',
  padding: '0 6px',
  border: '1px solid transparent',
  borderRadius: '4px',
  backgroundColor: 'transparent',
  color: 'var(--text-primary, #1e293b)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 0.15s, border-color 0.15s',
  lineHeight: 1,
};

const activeButtonStyles: React.CSSProperties = {
  ...buttonStyles,
  backgroundColor: 'var(--surface-active, #e2e8f0)',
  borderColor: 'var(--border-subtle, #cbd5e1)',
};

const separatorStyles: React.CSSProperties = {
  width: '1px',
  height: '20px',
  margin: '0 4px',
  backgroundColor: 'var(--border-subtle, #e2e8f0)',
};

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editorRef, className }) => {
  const [, setForceUpdate] = useState(0);

  // Re-render on selection change to update active states
  useEffect(() => {
    const handler = () => setForceUpdate((n) => n + 1);
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  const execCommand = useCallback(
    (command: string, value?: string) => {
      editorRef.current?.focus();
      if (command === 'createLink') {
        const url = window.prompt('Enter URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        return;
      }
      if (command === 'formatBlock' && value) {
        document.execCommand(command, false, `<${value}>`);
        return;
      }
      document.execCommand(command, false, value);
    },
    [editorRef],
  );

  const isActive = useCallback((command: string, value?: string): boolean => {
    try {
      if (command === 'formatBlock' && value) {
        return document.queryCommandValue('formatBlock').toLowerCase() === value.toLowerCase();
      }
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      const el = editorRef.current;
      if (!el || !el.contains(document.activeElement ?? null)) return;

      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline');
          break;
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [editorRef]);

  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      className={className}
      style={toolbarStyles}
    >
      {TOOLBAR_ITEMS.map((item, idx) => {
        if (item === SEPARATOR) {
          return <div key={`sep-${idx}`} style={separatorStyles} aria-hidden="true" />;
        }

        const active = isActive(item.command, item.value);
        const title = item.shortcut ? `${item.label} (${item.shortcut})` : item.label;

        return (
          <button
            key={item.label}
            type="button"
            title={title}
            aria-label={item.label}
            aria-pressed={item.type === 'format' ? active : undefined}
            style={active ? activeButtonStyles : buttonStyles}
            onMouseDown={(e) => {
              e.preventDefault(); // prevent stealing focus from editor
              execCommand(item.command, item.value);
            }}
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
};
