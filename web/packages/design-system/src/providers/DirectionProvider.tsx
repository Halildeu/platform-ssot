/* ------------------------------------------------------------------ */
/*  DirectionProvider — Explicit LTR/RTL override                      */
/*                                                                     */
/*  Use when you need a local direction override inside a page.        */
/*  For global direction, prefer LocaleProvider.                       */
/* ------------------------------------------------------------------ */

import React from "react";
import type { Direction } from "./LocaleProvider";

/** Props for the DirectionProvider component. */
export interface DirectionProviderProps {
  /** Text direction to apply to the subtree. */
  direction: Direction;
  /** Content to render within the directional context. */
  children: React.ReactNode;
}

/** Provides an explicit LTR/RTL direction override for a subtree, wrapping children in a directional container. */
export function DirectionProvider({ direction, children }: DirectionProviderProps) {
  return <div dir={direction}>{children}</div>;
}
