import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type ColorPickerFormat = "hex" | "rgb" | "hsl";
export type ColorPickerSize = "sm" | "md" | "lg";
export interface ColorPickerPreset {
    label: string;
    colors: string[];
}
export interface ColorPickerProps extends AccessControlledProps {
    /** Controlled color value (hex string). */
    value?: string;
    /** Default value for uncontrolled usage. @default "#3b82f6" */
    defaultValue?: string;
    /** Display format for the input. @default "hex" */
    format?: ColorPickerFormat;
    /** Preset color palettes. */
    presets?: ColorPickerPreset[];
    /** Show the text input for manual entry. @default true */
    showInput?: boolean;
    /** Show preset palettes section. @default true */
    showPresets?: boolean;
    /** Visual size variant. @default "md" */
    size?: ColorPickerSize;
    /** Callback when color changes. */
    onValueChange?: (color: string) => void;
    /** Label displayed above the picker. */
    label?: string;
    /** Description text displayed below the label. */
    description?: string;
    /** Additional class name for the root element. */
    className?: string;
    /** Accessible label. @default "Renk secici" */
    "aria-label"?: string;
}
export declare const ColorPicker: React.ForwardRefExoticComponent<ColorPickerProps & React.RefAttributes<HTMLDivElement>>;
export default ColorPicker;
