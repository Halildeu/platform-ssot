import React, { useCallback, useRef, useState, useMemo } from 'react';
import { cn } from '../utils/cn';
import {
  resolveAccessState,
  accessStyles,
  type AccessControlledProps,
} from '../internal/access-controller';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Represents a file in the upload zone. */
export interface UploadedFile {
  /** Unique identifier */
  id: string;
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** Upload progress (0-100) */
  progress?: number;
  /** Current upload status */
  status?: 'uploading' | 'complete' | 'error';
  /** Error message when status is 'error' */
  error?: string;
}

/**
 * Props for the FileUploadZone component.
 *
 * @example
 * ```tsx
 * <FileUploadZone
 *   files={[{ id: '1', name: 'report.pdf', size: 1024000, type: 'application/pdf', status: 'complete' }]}
 *   onFilesAdd={(files) => console.log('Added:', files)}
 *   onFileRemove={(id) => console.log('Removed:', id)}
 *   accept=".pdf,.docx,.xlsx"
 *   maxSize={10 * 1024 * 1024}
 *   maxFiles={5}
 *   multiple
 * />
 * ```
 *
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/file-upload-zone)
 */
export interface FileUploadZoneProps extends AccessControlledProps {
  /** Currently uploaded/uploading files */
  files: UploadedFile[];
  /** Callback when new files are selected or dropped */
  onFilesAdd?: (files: File[]) => void;
  /** Callback when a file is removed */
  onFileRemove?: (id: string) => void;
  /** Accepted file types (e.g. ".pdf,.docx,image/*") */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Allow selecting multiple files */
  multiple?: boolean;
  /** Primary label text */
  label?: string;
  /** Description text below the label */
  description?: string;
  /** Additional CSS class names for the root element */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format file size to human-readable string. */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const base = 1024;
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(base)), units.length - 1);
  const value = bytes / Math.pow(base, exp);
  return `${value.toFixed(exp > 0 ? 1 : 0)} ${units[exp]}`;
}

/** Get icon character for file status. */
function getStatusIcon(status?: UploadedFile['status']): string {
  switch (status) {
    case 'complete':
      return '\u2713'; // checkmark
    case 'error':
      return '\u2717'; // cross
    case 'uploading':
      return '\u21BB'; // clockwise arrow
    default:
      return '\u2022'; // bullet
  }
}

/** Get file type icon character based on MIME type. */
function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return '\uD83D\uDDBC'; // framed picture
  if (type.startsWith('video/')) return '\uD83C\uDFAC'; // clapper board
  if (type.startsWith('audio/')) return '\uD83C\uDFB5'; // musical note
  if (type.includes('pdf')) return '\uD83D\uDCC4'; // page
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv'))
    return '\uD83D\uDCCA'; // bar chart
  if (type.includes('zip') || type.includes('compressed') || type.includes('archive'))
    return '\uD83D\uDCE6'; // package
  return '\uD83D\uDCC1'; // folder
}

// ---------------------------------------------------------------------------
// File list item
// ---------------------------------------------------------------------------

interface FileItemProps {
  file: UploadedFile;
  canRemove: boolean;
  onRemove: (id: string) => void;
}

function FileItem({ file, canRemove, onRemove }: FileItemProps) {
  const statusIcon = getStatusIcon(file.status);
  const fileIcon = getFileIcon(file.type);
  const isError = file.status === 'error';
  const isUploading = file.status === 'uploading';

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md border transition-colors',
        isError ? 'border-[var(--state-error-border,var(--state-error-text))]' : 'border-[var(--border-default)]',
      )}
      style={{
        backgroundColor: isError
          ? 'var(--state-error-bg, #fef2f2)'
          : 'var(--surface-default)',
      }}
      role="listitem"
      aria-label={`${file.name}, ${formatFileSize(file.size)}, ${file.status ?? 'pending'}`}
    >
      {/* File icon */}
      <span className="text-base shrink-0" aria-hidden="true">
        {fileIcon}
      </span>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-medium truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {file.name}
          </span>
          <span
            className="text-[10px] shrink-0"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {formatFileSize(file.size)}
          </span>
        </div>

        {/* Progress bar */}
        {isUploading && typeof file.progress === 'number' && (
          <div className="mt-1">
            <div
              className="w-full h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--surface-muted, #e5e7eb)' }}
              role="progressbar"
              aria-valuenow={file.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Uploading ${file.name}: ${file.progress}%`}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, file.progress))}%`,
                  backgroundColor: 'var(--interactive-primary, #3b82f6)',
                }}
              />
            </div>
            <span
              className="text-[10px] mt-0.5 block"
              style={{ color: 'var(--text-secondary)' }}
            >
              {file.progress}%
            </span>
          </div>
        )}

        {/* Error message */}
        {isError && file.error && (
          <span
            className="text-[10px] mt-0.5 block"
            style={{ color: 'var(--state-error-text)' }}
          >
            {file.error}
          </span>
        )}
      </div>

      {/* Status icon */}
      <span
        className={cn('text-xs shrink-0 font-bold')}
        style={{
          color: isError
            ? 'var(--state-error-text)'
            : file.status === 'complete'
              ? 'var(--state-success-text)'
              : 'var(--text-secondary)',
        }}
        aria-label={file.status ?? 'pending'}
      >
        {statusIcon}
      </span>

      {/* Remove button */}
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(file.id)}
          className="shrink-0 w-5 h-5 inline-flex items-center justify-center rounded-full text-[10px] font-bold transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={`Remove ${file.name}`}
        >
          \u2715
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/** Drag & drop file upload zone with file list, progress, and error states. */
export function FileUploadZone({
  files,
  onFilesAdd,
  onFileRemove,
  accept,
  maxSize,
  maxFiles,
  multiple = true,
  label = 'Drop files here or click to browse',
  description,
  className,
  access,
  accessReason,
}: FileUploadZoneProps) {
  const accessState = resolveAccessState(access);
  const { isHidden, isDisabled, isReadonly } = accessState;
  if (isHidden) return null;

  const canInteract = !isDisabled && !isReadonly && !!onFilesAdd;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const isAtMax = useMemo(
    () => typeof maxFiles === 'number' && files.length >= maxFiles,
    [files.length, maxFiles],
  );

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || !onFilesAdd) return;
      const arr = Array.from(fileList);
      // Filter by maxSize if set
      const filtered = maxSize ? arr.filter((f) => f.size <= maxSize) : arr;
      // Respect maxFiles
      const available = maxFiles ? Math.max(0, maxFiles - files.length) : filtered.length;
      const toAdd = filtered.slice(0, available);
      if (toAdd.length > 0) {
        onFilesAdd(toAdd);
      }
    },
    [onFilesAdd, maxSize, maxFiles, files.length],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (canInteract && !isAtMax) setIsDragOver(true);
    },
    [canInteract, isAtMax],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (canInteract && !isAtMax) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [canInteract, isAtMax, handleFiles],
  );

  const handleClick = useCallback(() => {
    if (canInteract && !isAtMax && inputRef.current) {
      inputRef.current.click();
    }
  }, [canInteract, isAtMax]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset so same file can be selected again
      if (inputRef.current) inputRef.current.value = '';
    },
    [handleFiles],
  );

  const handleRemove = useCallback(
    (id: string) => {
      if (onFileRemove && canInteract) {
        onFileRemove(id);
      }
    },
    [onFileRemove, canInteract],
  );

  const descriptionParts: string[] = [];
  if (description) descriptionParts.push(description);
  if (accept) descriptionParts.push(`Accepted: ${accept}`);
  if (maxSize) descriptionParts.push(`Max size: ${formatFileSize(maxSize)}`);
  if (maxFiles) descriptionParts.push(`Max files: ${maxFiles}`);

  return (
    <div
      className={cn('w-full', accessStyles(accessState.state), className)}
      data-component="file-upload-zone"
      data-access-state={accessState.state}
      {...(isDisabled ? { 'aria-disabled': true } : {})}
      {...(accessReason ? { title: accessReason } : {})}
    >
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={canInteract && !isAtMax ? 0 : undefined}
        onClick={handleClick}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && canInteract && !isAtMax) {
            e.preventDefault();
            handleClick();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors p-6',
          isDragOver
            ? 'border-[var(--interactive-primary)] bg-[var(--state-info-bg,#3b82f608)]'
            : 'border-[var(--border-default)]',
          canInteract && !isAtMax
            ? 'cursor-pointer hover:border-[var(--interactive-primary)] hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]'
            : 'opacity-60 cursor-not-allowed',
        )}
        style={{ backgroundColor: isDragOver ? undefined : 'var(--surface-default)' }}
        aria-label={label}
      >
        {/* Cloud icon */}
        <span
          className="text-2xl mb-2"
          style={{ color: isDragOver ? 'var(--interactive-primary)' : 'var(--text-tertiary)' }}
          aria-hidden="true"
        >
          {'\u2601'}
        </span>

        {/* Label */}
        <span
          className="text-sm font-medium text-center"
          style={{ color: 'var(--text-primary)' }}
        >
          {isAtMax ? `Maximum of ${maxFiles} files reached` : label}
        </span>

        {/* Description */}
        {descriptionParts.length > 0 && (
          <span
            className="text-xs mt-1 text-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            {descriptionParts.join(' \u00B7 ')}
          </span>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-3 space-y-1.5" role="list" aria-label="Uploaded files">
          {files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              canRemove={canInteract && !!onFileRemove}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {/* File count summary */}
      {files.length > 0 && (
        <div
          className="flex items-center justify-between mt-2 text-[10px]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <span>
            {files.length} file{files.length !== 1 ? 's' : ''}
            {maxFiles ? ` / ${maxFiles} max` : ''}
          </span>
          <span>
            {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))} total
          </span>
        </div>
      )}
    </div>
  );
}

FileUploadZone.displayName = 'FileUploadZone';

export default FileUploadZone;
