import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import { type FieldSize } from "../../primitives/_shared/FieldControlPrimitives";
/** Props for the Slider component. */
export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children">, AccessControlledProps {
    /** Field label displayed above the slider. */
    label?: React.ReactNode;
    /** Descriptive text below the label. */
    description?: React.ReactNode;
    /** Help text displayed below the slider. */
    hint?: React.ReactNode;
    /** Error message that activates the invalid state. */
    error?: React.ReactNode;
    /** @deprecated Use `error` instead. Whether the slider is in an invalid state. */
    invalid?: boolean;
    /** Size variant of the field control. */
    size?: FieldSize;
    /** Callback fired when the slider value changes. */
    onValueChange?: (value: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    /** Whether the slider spans the full container width. */
    fullWidth?: boolean;
    /** Label displayed at the minimum end of the track. */
    minLabel?: React.ReactNode;
    /** Label displayed at the maximum end of the track. */
    maxLabel?: React.ReactNode;
    /** Custom formatter for the displayed value. */
    valueFormatter?: (value: number) => React.ReactNode;
}
/**
 * Range slider input with min/max labels, value formatter, and field control shell integration.
 *
 * @example
 * ```tsx
 * <Slider
 *   label="Volume"
 *   min={0}
 *   max={100}
 *   value={volume}
 *   onValueChange={setVolume}
 *   valueFormatter={(v) => `${v}%`}
 * />
 * ```
 */
export declare const Slider: React.ForwardRefExoticComponent<SliderProps & React.RefAttributes<HTMLInputElement>>;
export default Slider;
/** Type alias for Slider ref. */
export type SliderRef = React.Ref<HTMLElement>;
/** Type alias for Slider element. */
export type SliderElement = HTMLElement;
/** Type alias for Slider cssproperties. */
export type SliderCSSProperties = React.CSSProperties;
