import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type QRErrorLevel = "L" | "M" | "Q" | "H";
/**
 * QRCode generates and renders a QR code from a text value using a pure
 * TypeScript encoder with configurable error correction and visual options.
 * @example
 * ```tsx
 * <QRCode />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/q-r-code)

 */
export interface QRCodeProps extends AccessControlledProps {
    /** Text or URL to encode in the QR code. */
    value: string;
    /** Size of the QR code in pixels. @default 128 */
    size?: number;
    /** Foreground color for QR modules. @default "var(--text-primary)" */
    color?: string;
    /** Background color behind the QR code. @default "var(--surface-canvas)" */
    bgColor?: string;
    /** Reed-Solomon error correction level. @default "M" */
    errorLevel?: QRErrorLevel;
    /** URL of a center icon overlay image. */
    icon?: string;
    /** Size of the center icon in pixels. Defaults to 25% of the QR size. */
    iconSize?: number;
    /** Render a border and padding around the QR code. @default true */
    bordered?: boolean;
    /** Current status affecting the visual state. @default "active" */
    status?: "active" | "expired" | "loading";
    /** Callback fired when the "Refresh" button is clicked in expired state. */
    onRefresh?: () => void;
    /** Additional CSS class name. */
    className?: string;
}
/**
 * Generate a QR code module matrix from a text string.
 */
export declare function generateQRMatrix(text: string, ecLevel?: QRErrorLevel): boolean[][];
export declare const QRCode: React.ForwardRefExoticComponent<QRCodeProps & React.RefAttributes<HTMLDivElement>>;
export default QRCode;
