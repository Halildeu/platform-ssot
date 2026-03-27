export type OverlaySide = "top" | "right" | "bottom" | "left";
export type OverlayAlign = "start" | "center" | "end";
export type OverlayPosition = {
    left: number;
    top: number;
    resolvedSide: OverlaySide;
    flipped: boolean;
};
type ResolveOverlayPositionOptions = {
    preferredSide: OverlaySide;
    align: OverlayAlign;
    triggerBounds: DOMRect;
    panelBounds: DOMRect;
    flipOnCollision?: boolean;
    gap?: number;
    edgePadding?: number;
};
export declare const resolveOverlayArrowPositionClassName: (side: OverlaySide, align: OverlayAlign) => string;
export declare const resolveOverlayPosition: ({ preferredSide, align, triggerBounds, panelBounds, flipOnCollision, gap, edgePadding, }: ResolveOverlayPositionOptions) => OverlayPosition;
export {};
