import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface EditorMenuBubbleProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
}

interface BubblePosition {
  top: number;
  left: number;
  visible: boolean;
}

const bubbleStyles: React.CSSProperties = {
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  padding: '4px 6px',
  backgroundColor: 'var(--surface-elevated, #1e293b)',
  color: 'var(--text-on-dark, #f8fafc)',
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  zIndex: 50,
  transform: 'translateX(-50%)',
  transition: 'opacity 0.15s',
};

const bubbleButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '26px',
  height: '26px',
  padding: '0 5px',
  border: 'none',
  borderRadius: '3px',
  backgroundColor: 'transparent',
  color: 'inherit',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 0.15s',
};

const activeBubbleButtonStyles: React.CSSProperties = {
  ...bubbleButtonStyles,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
};

interface BubbleAction {
  label: string;
  icon: string;
  command: string;
}

const BUBBLE_ACTIONS: BubbleAction[] = [
  { label: 'Bold', icon: 'B', command: 'bold' },
  { label: 'Italic', icon: 'I', command: 'italic' },
  { label: 'Underline', icon: 'U', command: 'underline' },
  { label: 'Link', icon: '\uD83D\uDD17', command: 'createLink' },
];

export const EditorMenuBubble: React.FC<EditorMenuBubbleProps> = ({ editorRef }) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<BubblePosition>({ top: 0, left: 0, visible: false });
  const [, setForceUpdate] = useState(0);

  const updatePosition = useCallback(() => {
    const selection = window.getSelection();
    if (
      !selection ||
      selection.isCollapsed ||
      selection.rangeCount === 0
    ) {
      setPosition((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const range = selection.getRangeAt(0);
    const editorEl = editorRef.current;
    if (!editorEl || !editorEl.contains(range.commonAncestorContainer)) {
      setPosition((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const rect = range.getBoundingClientRect();
    const editorRect = editorEl.getBoundingClientRect();

    // Position above the selection, centered horizontally
    const top = rect.top - editorRect.top - 40;
    const left = rect.left - editorRect.left + rect.width / 2;

    setPosition({ top, left, visible: true });
  }, [editorRef]);

  useEffect(() => {
    const handler = () => {
      updatePosition();
      setForceUpdate((n) => n + 1);
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, [updatePosition]);

  const execCommand = useCallback((command: string) => {
    if (command === 'createLink') {
      const url = window.prompt('Enter URL:');
      if (url) {
        document.execCommand('createLink', false, url);
      }
      return;
    }
    document.execCommand(command, false);
  }, []);

  const isActive = useCallback((command: string): boolean => {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  }, []);

  if (!position.visible) return null;

  return (
    <div
      ref={bubbleRef}
      role="toolbar"
      aria-label="Selection formatting"
      style={{
        ...bubbleStyles,
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {BUBBLE_ACTIONS.map((action) => {
        const active = isActive(action.command);
        return (
          <button
            key={action.label}
            type="button"
            aria-label={action.label}
            aria-pressed={action.command !== 'createLink' ? active : undefined}
            style={active ? activeBubbleButtonStyles : bubbleButtonStyles}
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand(action.command);
            }}
          >
            {action.icon}
          </button>
        );
      })}
    </div>
  );
};
