import React from 'react';
import type { AccessFilters } from './access.types';

export interface AccessVariant {
  id: string;
  name: string;
  filters: AccessFilters;
  updatedAt: string;
  isDefault?: boolean;
}

const storageKey = (gridId: string) => `access-variants:${gridId}`;

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error: unknown) {
    console.warn('[access-variants] JSON parse başarısız, fallback kullanılacak.', error);
    return fallback;
  }
};

const areFiltersEqual = (a: AccessFilters, b: AccessFilters) =>
  a.search === b.search && a.moduleKey === b.moduleKey && a.level === b.level;

const loadVariants = (gridId: string): AccessVariant[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const raw = localStorage.getItem(storageKey(gridId));
  const variants = safeParse<AccessVariant[]>(raw, []);
  return variants.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
};

const persistVariants = (gridId: string, variants: AccessVariant[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(storageKey(gridId), JSON.stringify(variants));
};

const updateUrl = (variantId: string | null) => {
  if (typeof window === 'undefined') {
    return;
  }
  const url = new URL(window.location.href);
  if (variantId) {
    url.searchParams.set('variant', variantId);
  } else {
    url.searchParams.delete('variant');
  }
  window.history.replaceState({}, '', url);
};

const getInitialSelectedId = (variants: AccessVariant[]) => {
  if (typeof window === 'undefined') {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('variant');
  if (fromQuery && variants.some((variant) => variant.id === fromQuery)) {
    return fromQuery;
  }
  const defaultVariant = variants.find((variant) => variant.isDefault);
  return defaultVariant ? defaultVariant.id : null;
};

export const useAccessVariants = (
  gridId: string,
  filters: AccessFilters,
  applyFilters: (next: AccessFilters) => void,
) => {
  const filtersRef = React.useRef(filters);
  React.useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const [state, setState] = React.useState(() => {
    const variants = loadVariants(gridId);
    return {
      variants,
      selectedId: getInitialSelectedId(variants),
      isDirty: false,
    };
  });

  React.useEffect(() => {
    persistVariants(gridId, state.variants);
  }, [gridId, state.variants]);

  React.useEffect(() => {
    if (!state.selectedId) {
      return;
    }
    const selected = state.variants.find((variant) => variant.id === state.selectedId);
    if (selected) {
      applyFilters(selected.filters);
    }
  }, [applyFilters, state.selectedId, state.variants]);

  React.useEffect(() => {
    setState((previous) => {
      const selected = previous.selectedId
        ? previous.variants.find((variant) => variant.id === previous.selectedId)
        : null;
      const dirty = selected ? !areFiltersEqual(filters, selected.filters) : false;
      if (dirty === previous.isDirty) {
        return previous;
      }
      return { ...previous, isDirty: dirty };
    });
  }, [filters]);

  const selectVariant = React.useCallback((variantId: string | null) => {
    setState((previous) => {
      if (previous.selectedId === variantId) {
        return previous;
      }
      return { ...previous, selectedId: variantId, isDirty: false };
    });
    updateUrl(variantId);
  }, []);

  const saveAsVariant = React.useCallback((name: string) => {
    const id = `variant-${Date.now().toString(36)}`;
    const newVariant: AccessVariant = {
      id,
      name,
      filters: { ...filtersRef.current },
      updatedAt: new Date().toISOString(),
    };
    setState((previous) => {
      const variants = [...previous.variants, newVariant].sort(
        (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
      );
      return {
        variants,
        selectedId: newVariant.id,
        isDirty: false,
      };
    });
    updateUrl(id);
  }, []);

  const updateSelectedVariant = React.useCallback(() => {
    setState((previous) => {
      if (!previous.selectedId) {
        return previous;
      }
      const updatedAt = new Date().toISOString();
      const variants = previous.variants
        .map((variant) =>
          variant.id === previous.selectedId
            ? { ...variant, filters: { ...filtersRef.current }, updatedAt }
            : variant,
        )
        .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
      return {
        variants,
        selectedId: previous.selectedId,
        isDirty: false,
      };
    });
  }, []);

  const deleteVariant = React.useCallback((variantId: string) => {
    setState((previous) => {
      const variants = previous.variants.filter((variant) => variant.id !== variantId);
      const selectedId = previous.selectedId === variantId ? null : previous.selectedId;
      if (previous.selectedId === variantId) {
        updateUrl(null);
      }
      return {
        variants,
        selectedId,
        isDirty: false,
      };
    });
  }, []);

  return {
    variants: state.variants,
    selectedVariantId: state.selectedId,
    isDirty: state.isDirty,
    selectVariant,
    saveAsVariant,
    updateSelectedVariant,
    deleteVariant,
  };
};
