import React, { useState, useCallback, useEffect, useRef } from 'react';

export interface EditorImageUploadProps {
  isOpen: boolean;
  onInsert: (src: string, alt?: string) => void;
  onClose: () => void;
  onUpload?: (file: File) => Promise<string>;
  className?: string;
}

type Tab = 'upload' | 'url';

/* ---------- styles ---------- */

const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  minWidth: '400px',
  maxWidth: '480px',
};

const titleStyles: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--text-primary, #1e293b)',
  margin: '0 0 16px 0',
};

const tabBarStyles: React.CSSProperties = {
  display: 'flex',
  gap: '0',
  marginBottom: '16px',
  borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
};

const tabStyles: React.CSSProperties = {
  padding: '8px 16px',
  border: 'none',
  borderBottom: '2px solid transparent',
  backgroundColor: 'transparent',
  color: 'var(--text-secondary, #64748b)',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'color 0.15s, border-color 0.15s',
};

const activeTabStyles: React.CSSProperties = {
  ...tabStyles,
  color: 'var(--text-primary, #1e293b)',
  borderBottomColor: 'var(--border-accent, #3b82f6)',
};

const dropZoneStyles: React.CSSProperties = {
  border: '2px dashed var(--border-subtle, #e2e8f0)',
  borderRadius: '8px',
  padding: '32px 16px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.15s, background-color 0.15s',
  marginBottom: '12px',
};

const dropZoneActiveStyles: React.CSSProperties = {
  ...dropZoneStyles,
  borderColor: 'var(--border-accent, #3b82f6)',
  backgroundColor: 'var(--surface-active, #eff6ff)',
};

const dropZoneTextStyles: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-muted, #94a3b8)',
  marginTop: '8px',
};

const dropZoneIconStyles: React.CSSProperties = {
  fontSize: '28px',
  color: 'var(--text-muted, #94a3b8)',
};

const previewStyles: React.CSSProperties = {
  maxWidth: '100%',
  maxHeight: '160px',
  objectFit: 'contain',
  borderRadius: '6px',
  border: '1px solid var(--border-subtle, #e2e8f0)',
  marginBottom: '12px',
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
  color: '#ffffff',
};

const disabledConfirmStyles: React.CSSProperties = {
  ...confirmButtonStyles,
  opacity: 0.5,
  cursor: 'not-allowed',
};

const errorStyles: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-danger, #ef4444)',
  marginBottom: '8px',
};

/* ---------- component ---------- */

export const EditorImageUpload: React.FC<EditorImageUploadProps> = ({
  isOpen,
  onInsert,
  onClose,
  onUpload,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [urlValue, setUrlValue] = useState('');
  const [altText, setAltText] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('upload');
      setUrlValue('');
      setAltText('');
      setPreviewSrc(null);
      setUploading(false);
      setError(null);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setError(null);

      // Show local preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewSrc(e.target?.result as string);
      reader.readAsDataURL(file);

      if (onUpload) {
        setUploading(true);
        try {
          const src = await onUpload(file);
          setPreviewSrc(src);
          setUrlValue(src);
        } catch {
          setError('Upload failed. Please try again.');
        } finally {
          setUploading(false);
        }
      }
    },
    [onUpload],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInsert = useCallback(() => {
    const src = activeTab === 'url' ? urlValue.trim() : previewSrc ?? urlValue.trim();
    if (!src) return;
    onInsert(src, altText.trim() || undefined);
  }, [activeTab, urlValue, previewSrc, altText, onInsert]);

  const canInsert =
    !uploading &&
    ((activeTab === 'url' && urlValue.trim().length > 0) ||
      (activeTab === 'upload' && previewSrc !== null));

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
        aria-label="Insert image"
        className={className}
        style={dialogStyles}
      >
        <h3 style={titleStyles}>Insert Image</h3>

        {/* Tabs */}
        <div style={tabBarStyles} role="tablist" aria-label="Image source">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'upload'}
            style={activeTab === 'upload' ? activeTabStyles : tabStyles}
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'url'}
            style={activeTab === 'url' ? activeTabStyles : tabStyles}
            onClick={() => setActiveTab('url')}
          >
            URL
          </button>
        </div>

        {/* Upload tab */}
        {activeTab === 'upload' && (
          <div role="tabpanel" aria-label="Upload image">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              aria-hidden="true"
            />

            {previewSrc ? (
              <div style={{ textAlign: 'center' }}>
                <img src={previewSrc} alt="Preview" style={previewStyles} />
              </div>
            ) : (
              <div
                style={isDragOver ? dropZoneActiveStyles : dropZoneStyles}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                role="button"
                tabIndex={0}
                aria-label="Drop image here or click to browse"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <div style={dropZoneIconStyles} aria-hidden="true">
                  &#128247;
                </div>
                <div style={dropZoneTextStyles}>
                  {uploading ? 'Uploading...' : 'Drop an image here, or click to browse'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* URL tab */}
        {activeTab === 'url' && (
          <div role="tabpanel" aria-label="Image URL">
            <div style={fieldStyles}>
              <label htmlFor="editor-image-url" style={labelStyles}>
                Image URL
              </label>
              <input
                id="editor-image-url"
                type="url"
                placeholder="https://example.com/image.png"
                value={urlValue}
                onChange={(e) => {
                  setUrlValue(e.target.value);
                  setPreviewSrc(e.target.value || null);
                }}
                style={inputStyles}
              />
            </div>

            {urlValue && previewSrc && (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={previewSrc}
                  alt="Preview"
                  style={previewStyles}
                  onError={() => setPreviewSrc(null)}
                />
              </div>
            )}
          </div>
        )}

        {/* Alt text */}
        <div style={fieldStyles}>
          <label htmlFor="editor-image-alt" style={labelStyles}>
            Alt text
          </label>
          <input
            id="editor-image-alt"
            type="text"
            placeholder="Describe the image (optional)"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            style={inputStyles}
          />
        </div>

        {error && <div style={errorStyles} role="alert">{error}</div>}

        {/* Footer */}
        <div style={footerStyles}>
          <button type="button" style={cancelButtonStyles} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            style={canInsert ? confirmButtonStyles : disabledConfirmStyles}
            disabled={!canInsert}
            onClick={handleInsert}
          >
            {uploading ? 'Uploading...' : 'Insert'}
          </button>
        </div>
      </div>
    </div>
  );
};
