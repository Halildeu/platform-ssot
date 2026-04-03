/**
 * Component Composition Utilities
 *
 * Modern composition primitives for building components:
 * - Ref forwarding (React 19 compatible)
 * - Event handler composition
 * - Prop merging
 * - Polymorphic component factory
 */

import * as React from "react";
import { cn } from "../utils/cn";

// ---------------------------------------------------------------------------
// Ref Utilities
// ---------------------------------------------------------------------------

type PossibleRef<T> = React.Ref<T> | undefined;

/** Compose multiple refs into a single callback ref */
export function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

// ---------------------------------------------------------------------------
// Event Handler Composition
// ---------------------------------------------------------------------------

type EventHandler<E = Event> = ((event: E) => void) | undefined;

/**
 * Compose two event handlers. The original handler runs first.
 * If it calls event.preventDefault(), the override handler is skipped.
 */
export function composeEventHandlers<E>(
  originalHandler: EventHandler<E>,
  overrideHandler: EventHandler<E>,
  { checkForDefaultPrevented = true } = {},
): (event: E) => void {
  return (event) => {
    originalHandler?.(event);

    if (
      !checkForDefaultPrevented ||
      !(event as unknown as Event).defaultPrevented
    ) {
      overrideHandler?.(event);
    }
  };
}

// ---------------------------------------------------------------------------
// Prop Merging
// ---------------------------------------------------------------------------

type AnyProps = Record<string, unknown>;

/**
 * Deep-merge two prop objects:
 * - className: merged via cn()
 * - style: shallow merged (b wins)
 * - event handlers (on*): composed
 * - everything else: b wins
 */
export function mergeProps(a: AnyProps, b: AnyProps): AnyProps {
  const merged: AnyProps = { ...a };

  for (const key in b) {
    const aVal = a[key];
    const bVal = b[key];

    if (key === "className") {
      merged[key] = cn(aVal as string, bVal as string);
    } else if (key === "style") {
      merged[key] = { ...(aVal as object), ...(bVal as object) };
    } else if (
      key.startsWith("on") &&
      typeof aVal === "function" &&
      typeof bVal === "function"
    ) {
      merged[key] = composeEventHandlers(
        aVal as EventHandler,
        bVal as EventHandler,
      );
    } else {
      merged[key] = bVal;
    }
  }

  return merged;
}

// ---------------------------------------------------------------------------
// Polymorphic Component
// ---------------------------------------------------------------------------

/**
 * Create a polymorphic component that accepts `as` prop.
 * React 19 compatible — ref is just a prop, no forwardRef needed.
 */
export type AsChildProps<DefaultElement extends React.ElementType> = {
  as?: DefaultElement;
  asChild?: boolean;
};

export type PolymorphicProps<
  DefaultElement extends React.ElementType,
  Props = {},
> = Props &
  AsChildProps<DefaultElement> &
  Omit<
    React.ComponentPropsWithRef<DefaultElement>,
    keyof Props | "as" | "asChild"
  >;

// ---------------------------------------------------------------------------
// Component Display Name
// ---------------------------------------------------------------------------

export function setDisplayName<T>(component: T, name: string): T {
  (component as { displayName?: string }).displayName = name;
  return component;
}
