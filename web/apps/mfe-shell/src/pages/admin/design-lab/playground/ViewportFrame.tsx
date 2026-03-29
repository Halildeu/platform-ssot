import React from "react";
import clsx from "clsx";
import type { PreviewViewport } from "./PreviewToolbar";
import { getViewportWidth } from "./PreviewToolbar";

/* ------------------------------------------------------------------ */
/*  ViewportFrame — Width-constrained preview container                */
/*                                                                     */
/*  Mobile → 375 px, Tablet → 768 px, Desktop → full width            */
/*  Smooth width transition, horizontal scroll on overflow             */
/* ------------------------------------------------------------------ */

export type ViewportFrameProps = {
  viewport: PreviewViewport;
  children: React.ReactNode;
  className?: string;
};

export const ViewportFrame: React.FC<ViewportFrameProps> = ({
  viewport,
  children,
  className,
}) => {
  const maxWidth = getViewportWidth(viewport);

  return (
    <div
      className={clsx(
        "relative mx-auto overflow-x-auto transition-all duration-300 ease-in-out",
        className,
      )}
      style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}
    >
      {children}
      {/* Viewport label indicator */}
      {viewport !== "desktop" && (
        <div className="pointer-events-none absolute bottom-2 right-2 z-10 rounded-full bg-surface-inverse/40 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-text-inverse/80 backdrop-blur-xs">
          {viewport} · {maxWidth}px
        </div>
      )}
    </div>
  );
};
