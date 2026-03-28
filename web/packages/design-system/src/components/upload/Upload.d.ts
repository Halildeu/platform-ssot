import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import { type FieldSize } from "../../primitives/_shared/FieldControlPrimitives";
export type UploadFileItem = {
    name: string;
    size: number;
    type?: string;
    lastModified?: number;
};
/** Props for the Upload component. */
export interface UploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children" | "value" | "defaultValue">, AccessControlledProps {
    /** Field label displayed above the drop zone. */
    label?: React.ReactNode;
    /** Descriptive text below the label. */
    description?: React.ReactNode;
    /** Help text displayed below the input. */
    hint?: React.ReactNode;
    /** Error message that activates the invalid state. */
    error?: React.ReactNode;
    /** Whether the input is in an invalid state. */
    invalid?: boolean;
    /** Size variant of the field control. */
    size?: FieldSize;
    /** Callback fired when selected files change. */
    onFilesChange?: (files: UploadFileItem[], event: React.ChangeEvent<HTMLInputElement>) => void;
    /** Whether the upload zone spans the full container width. */
    fullWidth?: boolean;
    /** Controlled list of selected files. */
    files?: UploadFileItem[];
    /** Initial file list for uncontrolled mode. */
    defaultFiles?: UploadFileItem[];
    /** Maximum number of files allowed. */
    maxFiles?: number;
    /** Placeholder text shown when no files are selected. */
    emptyStateLabel?: React.ReactNode;
}
/**
 * Drag-and-drop file upload input with file list preview, size formatting, and removal support.
 *
 * @example
 * ```tsx
 * <Upload
 *   label="Attachments"
 *   accept="image/*,.pdf"
 *   multiple
 *   onFilesChange={(files) => setAttachments(files)}
 *   maxFiles={5}
 * />
 * ```
 */
export declare const Upload: React.ForwardRefExoticComponent<UploadProps & React.RefAttributes<HTMLInputElement>>;
export default Upload;
