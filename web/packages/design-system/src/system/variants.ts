/**
 * Design System Variant Engine
 *
 * Type-safe, zero-dependency variant composition system.
 * Replaces CVA with a lighter, more flexible approach tailored to our needs.
 *
 * Features:
 * - Full TypeScript inference for variant keys and values
 * - Compound variants (style combinations)
 * - Default variants
 * - Responsive variant overrides (via data attributes)
 * - Composable with cn() for Tailwind class merging
 */

import { cn, type ClassValue } from "../utils/cn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type VariantValue = string | number | boolean;

type VariantDefinition = Record<string, Record<string, ClassValue>>;

type CompoundVariant<V extends VariantDefinition> = {
  [K in keyof V]?: keyof V[K];
} & { className: ClassValue };

type VariantProps<V extends VariantDefinition> = {
  [K in keyof V]?: keyof V[K] | null | undefined;
};

type DefaultVariants<V extends VariantDefinition> = {
  [K in keyof V]?: keyof V[K];
};

interface VariantConfig<V extends VariantDefinition> {
  base?: ClassValue;
  variants: V;
  compoundVariants?: CompoundVariant<V>[];
  defaultVariants?: DefaultVariants<V>;
}

type VariantFn<V extends VariantDefinition> = {
  (props?: VariantProps<V>): string;
  variants: V;
  defaultVariants: DefaultVariants<V>;
};

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

export function variants<V extends VariantDefinition>(
  config: VariantConfig<V>,
): VariantFn<V> {
  const { base, variants: variantDefs, compoundVariants = [], defaultVariants = {} } = config;

  const fn = (props: VariantProps<V> = {} as VariantProps<V>): string => {
    // 1. Resolve each variant key → class
    const variantClasses: ClassValue[] = [];

    for (const key in variantDefs) {
      const value = props[key] ?? defaultVariants[key];
      if (value != null && value !== false) {
        const lookup = String(value) as string;
        const classes = variantDefs[key][lookup];
        if (classes != null) {
          variantClasses.push(classes);
        }
      }
    }

    // 2. Evaluate compound variants
    const compoundClasses: ClassValue[] = [];

    for (const compound of compoundVariants) {
      const { className, ...conditions } = compound;
      let matches = true;

      for (const key in conditions) {
        const expected = conditions[key as keyof typeof conditions];
        const actual = props[key as keyof V] ?? defaultVariants[key as keyof V];
        if (String(actual) !== String(expected)) {
          matches = false;
          break;
        }
      }

      if (matches) {
        compoundClasses.push(className);
      }
    }

    return cn(base, ...variantClasses, ...compoundClasses);
  };

  fn.variants = variantDefs;
  fn.defaultVariants = defaultVariants as DefaultVariants<V>;

  return fn as VariantFn<V>;
}

// ---------------------------------------------------------------------------
// Slot Variants (multi-part components like Dialog, Card, Accordion)
// ---------------------------------------------------------------------------

type SlotVariantDefinition = Record<string, VariantDefinition>;

type SlotConfig<
  S extends Record<string, ClassValue>,
  V extends VariantDefinition,
> = {
  slots: S;
  variants?: V;
  compoundVariants?: (CompoundVariant<V> & { slot?: keyof S })[];
  defaultVariants?: DefaultVariants<V>;
};

type SlotVariantFn<
  S extends Record<string, ClassValue>,
  V extends VariantDefinition,
> = (props?: VariantProps<V>) => { [K in keyof S]: string };

export function slotVariants<
  S extends Record<string, ClassValue>,
  V extends VariantDefinition,
>(config: SlotConfig<S, V>): SlotVariantFn<S, V> {
  const { slots, variants: variantDefs = {} as V, compoundVariants = [], defaultVariants = {} } = config;

  return (props: VariantProps<V> = {} as VariantProps<V>) => {
    const result = {} as { [K in keyof S]: string };

    // Resolve variant classes (apply to ALL slots unless compound specifies slot)
    const globalVariantClasses: ClassValue[] = [];
    for (const key in variantDefs) {
      const value = props[key] ?? defaultVariants[key];
      if (value != null && value !== false) {
        const classes = variantDefs[key][String(value)];
        if (classes != null) {
          globalVariantClasses.push(classes);
        }
      }
    }

    // Per-slot compound classes
    const slotCompounds: Record<string, ClassValue[]> = {};
    const globalCompounds: ClassValue[] = [];

    for (const compound of compoundVariants) {
      const { className, slot, ...conditions } = compound;
      let matches = true;

      for (const key in conditions) {
        const expected = conditions[key as keyof typeof conditions];
        const actual = props[key as keyof V] ?? defaultVariants[key as keyof V];
        if (String(actual) !== String(expected)) {
          matches = false;
          break;
        }
      }

      if (matches) {
        if (slot) {
          (slotCompounds[slot as string] ??= []).push(className);
        } else {
          globalCompounds.push(className);
        }
      }
    }

    // Build each slot's final className
    for (const slotName in slots) {
      result[slotName] = cn(
        slots[slotName],
        ...globalVariantClasses,
        ...globalCompounds,
        ...(slotCompounds[slotName] ?? []),
      );
    }

    return result;
  };
}

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export type { VariantProps, VariantConfig, VariantFn, CompoundVariant };
