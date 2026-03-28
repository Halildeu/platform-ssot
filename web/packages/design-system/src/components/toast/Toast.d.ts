import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type ToastVariant = "info" | "success" | "warning" | "error";
export type ToastPosition = "top-right" | "top-center" | "bottom-right" | "bottom-center";
export interface ToastData {
    id: string;
    variant: ToastVariant;
    title?: string;
    message: string;
    duration?: number;
}
interface ToastContextValue {
    info: (message: string, opts?: ToastOptions) => void;
    success: (message: string, opts?: ToastOptions) => void;
    warning: (message: string, opts?: ToastOptions) => void;
    error: (message: string, opts?: ToastOptions) => void;
    dismiss: (id: string) => void;
}
interface ToastOptions {
    title?: string;
    duration?: number;
}
/**

 * Toast component.

 * @example

 * ```tsx

 * <Toast />

 * ```

 * @since 1.0.0

 * @see [Docs](https://design.mfe.dev/components/toast)

 */
export declare function useToast(): ToastContextValue;
export interface ToastProviderProps extends AccessControlledProps {
    /** Position of the toast container on screen. @default "top-right" */
    position?: ToastPosition;
    /** Default auto-dismiss duration in milliseconds. @default 4000 */
    duration?: number;
    /** Maximum number of toasts visible at once. @default 5 */
    maxVisible?: number;
    /** Application content rendered within the toast context. */
    children: React.ReactNode;
    /** Additional CSS class name for the toast container. */
    className?: string;
    /** Whether toast animations are enabled. @default true */
    animated?: boolean;
}
export declare const ToastProvider: React.ForwardRefExoticComponent<ToastProviderProps & React.RefAttributes<HTMLDivElement>>;
export {};
