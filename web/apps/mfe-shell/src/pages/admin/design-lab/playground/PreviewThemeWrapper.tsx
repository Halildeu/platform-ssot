import React from "react";
import clsx from "clsx";
import type { PreviewAppearance } from "./PreviewToolbar";

/* ------------------------------------------------------------------ */
/*  PreviewThemeWrapper — Scoped theme override via data-attributes    */
/*                                                                     */
/*  Applies theme data-attributes on a container div so previews can   */
/*  render in light/dark/HC without touching the global <html>.        */
/*  Follows the same data-attribute contract as theme-controller.ts.   */
/* ------------------------------------------------------------------ */

/** Map appearance preset to the data-attributes the CSS expects */
function getThemeAttributes(appearance: PreviewAppearance): Record<string, string> {
  switch (appearance) {
    case "dark":
      return {
        "data-appearance": "dark",
        "data-mode": "dark",
        "data-theme": "serban-dark",
      };
    case "high-contrast":
      return {
        "data-appearance": "high-contrast",
        "data-mode": "dark",
        "data-theme": "serban-hc",
      };
    case "light":
    default:
      return {
        "data-appearance": "light",
        "data-mode": "light",
        "data-theme": "serban-light",
      };
  }
}

export type PreviewThemeWrapperProps = {
  appearance: PreviewAppearance;
  children: React.ReactNode;
  className?: string;
};

export const PreviewThemeWrapper: React.FC<PreviewThemeWrapperProps> = ({
  appearance,
  children,
  className,
}) => {
  const attrs = getThemeAttributes(appearance);

  return (
    <div
      {...attrs}
      data-theme-scope=""
      className={clsx(
        "preview-theme-scope transition-colors duration-200",
        className,
      )}
    >
      {children}
    </div>
  );
};
