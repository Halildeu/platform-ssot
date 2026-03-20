/* ------------------------------------------------------------------ */
/*  Focus ring tokens — accessible focus indicators                   */
/* ------------------------------------------------------------------ */

export const focusRing = {
  width: 2,
  offset: 2,
  color: "var(--focus-ring, var(--focus-outline, #2c5282))",
  style: "solid",
  /* Utility class */
  class:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]/30 focus-visible:ring-offset-2",
} as const;

export type FocusRingKey = keyof typeof focusRing;
