/* ------------------------------------------------------------------ */
/*  DesignSystemProvider — Composes all design system providers        */
/*                                                                     */
/*  Single wrapper that sets up theme, locale, and direction.          */
/* ------------------------------------------------------------------ */

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { LocaleProvider } from "./LocaleProvider";
import type { ThemeAxes } from "../theme/core/semantic-theme";
import type { Direction } from "./LocaleProvider";

export interface DesignSystemProviderProps {
  /** Override default theme axes */
  defaultTheme?: Partial<ThemeAxes>;
  /** Locale code (e.g. "en", "tr", "ar") */
  locale?: string;
  /** Override auto-detected direction */
  direction?: Direction;
  children: React.ReactNode;
}

export function DesignSystemProvider({
  defaultTheme,
  locale = "en",
  direction,
  children,
}: DesignSystemProviderProps) {
  return (
    <ThemeProvider defaultAxes={defaultTheme}>
      <LocaleProvider locale={locale} direction={direction}>
        {children}
      </LocaleProvider>
    </ThemeProvider>
  );
}
