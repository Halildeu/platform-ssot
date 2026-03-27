import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export interface CarouselProps extends AccessControlledProps {
    /** Slides to render. Each must have a unique key. */
    items: {
        key: React.Key;
        content: React.ReactNode;
    }[];
    /** Enable auto-play. @default false */
    autoPlay?: boolean;
    /** Auto-play interval in ms. @default 5000 */
    autoPlayInterval?: number;
    /** Show dot indicators. @default true */
    showDots?: boolean;
    /** Show prev/next arrows. @default true */
    showArrows?: boolean;
    /** Loop back to start after last slide. @default true */
    loop?: boolean;
    /** Number of slides visible at once. @default 1 */
    slidesPerView?: 1 | 2 | 3;
    /** Gap between slides in px. @default 0 */
    gap?: number;
    /** Size variant. @default "md" */
    size?: "sm" | "md" | "lg";
    /** Orientation. @default "horizontal" */
    orientation?: "horizontal" | "vertical";
    /** Called when active slide changes. */
    onSlideChange?: (index: number) => void;
    /** Additional class name for the root element. */
    className?: string;
    /** Accessible label for the carousel region. @default "Slayt gosterisi" */
    "aria-label"?: string;
}
export declare const Carousel: React.ForwardRefExoticComponent<CarouselProps & React.RefAttributes<HTMLDivElement>>;
export default Carousel;
/** Type alias for Carousel ref. */
export type CarouselRef = React.Ref<HTMLElement>;
/** Type alias for Carousel element. */
export type CarouselElement = HTMLElement;
/** Type alias for Carousel cssproperties. */
export type CarouselCSSProperties = React.CSSProperties;
