/* ------------------------------------------------------------------ */
/*  DirectionProvider — Explicit LTR/RTL override                      */
/*                                                                     */
/*  Use when you need a local direction override inside a page.        */
/*  For global direction, prefer LocaleProvider.                       */
/* ------------------------------------------------------------------ */

import React from "react";
import type { Direction } from "./LocaleProvider";

export interface DirectionProviderProps {
  direction: Direction;
  children: React.ReactNode;
}

export function DirectionProvider({ direction, children }: DirectionProviderProps) {
  return <div dir={direction}>{children}</div>;
}
