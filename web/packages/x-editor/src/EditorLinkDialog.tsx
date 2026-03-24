import React, { useState, useCallback, useEffect, useRef } from 'react';

export interface EditorLinkDialogProps {
  isOpen: boolean;
  initialUrl?: string;
  initialText?: string;
  onConfirm: (url: string, text: string) => void;
  onClose: () => void;
  className?: string;
}

/* ---------- styles ---------- */

const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'var(--surface-overlay, rgba(0, 0, 0, 0.3))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
};

const dialogStyles: React.CSSProperties = {
  backgroundColor: 'var(--surface-default, #ffffff)',
  border: '1px solid var(--border-subtle, #e2e8f0)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.16)',
  padding: '20px',
  minWidth: '360px',
  maxWidth: '440px',
};

const titleStyles: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--text-primary, #1e293b)',
  margin: '0 0 16px 0',
};

const fieldStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginBottom: '12px',
};

const labelStyles: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--text-secondary, #64748b)',
};

const inputStyles: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid var(--border-subtle, #e2e8f0)',
  borderRadius: '6px',
  fontSize: '13px',
  color: 'var(--text-primary, #1e293b)',
  backgroundColor: 'var(--surface-default, #ffffff)',
  outline: 'none',
  transition: 'border-color 0.15s',
};

const checkboxRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
  fontSize: '13px',
  color: 'var(--text-secondary, #64748b)',
};

const footerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
};

const buttonBaseStyles: React.CSSProperties = {
  padding: '7px 14px',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background-color 0.15s',
};

const cancelButtonStyles: React.CSSProperties = {
  ...buttonBaseStyles,
  border: '1px solid var(--border-subtle, #e2e8f0)',
  backgroundColor: 'var(--surface-default, #ffffff)',
  color: 'var(--text-primary, #1e293b)',
};

const confirmButtonStyles: React.CSSProperties = {
  ...buttonBaseStyles,
  border: '1px solid transparent',
  backgroundColor: 'var(--surface-accent, #3b82f6)',
  color: 'var(--text-inverse, #ffffff)',
};

const removeButtonStyles: React.CSSProperties = {
  ...buttonBaseStyles,
  border: '1px solid var(--border-danger, #fca5a5)',
  backgroundColor: 'transparent',
  color: 'var(--text-danger, #ef4444)',
  marginRight: 'auto',
};

/* ---------- component ---------- */

export const EditorLinkDialog: React.FC<EditorLinkDialogProps> = ({
  isOpen,
  initialUrl = '',
  initialText = '',
  onConfirm,
  onClose,
  className,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const urlRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(initialUrl);

  // Reset fields when dialog opens
  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
      setOpenInNewTab(true);
      // Focus URL input after mount
      requestAnimationFrame(() => urlRef.current?.focus());
    }
  }, [isOpen, initialUrl, initialText]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!url.trim()) return;
      const href = openInNewTab ? url.trim() : url.trim(); // target handled by caller
      onConfirm(href, text.trim() || url.trim());
    },
    [url, text, openInNewTab, onConfirm],
  );

  const handleRemove = useCallback(() => {
    onConfirm('', '');
  }, [onConfirm]);

  if (!isOpen) return null;

  return (
    <div
      style={overlayStyles}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? 'Edit link' : 'Insert link'}
        className={className}
        style={dialogStyles}
      >
        <h3 style={titleStyles}>{isEditing ? 'Edit Link' : 'Insert Link'}</h3>

        <form onSubmit={handleSubmit}>
          <div style={fieldStyles}>
            <label htmlFor="editor-link-url" style={labelStyles}>
              URL
            </label>
            <input
              ref={urlRef}
              id="editor-link-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={inputStyles}
              required
            />
          </div>

          <div style={fieldStyles}>
            <label htmlFor="editor-link-text" style={labelStyles}>
              Display text
            </label>
            <input
              id="editor-link-text"
              type="text"
              placeholder="Link text (optional)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={inputStyles}
            />
          </div>

          <label style={checkboxRowStyles}>
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
            />
            Open in new tab
          </label>

          <div style={footerStyles}>
            {isEditing && (
              <button
                type="button"
                style={removeButtonStyles}
                onClick={handleRemove}
              >
                Remove link
              </button>
            )}
            <button type="button" style={cancelButtonStyles} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={confirmButtonStyles}>
              {isEditing ? 'Update' : 'Insert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
