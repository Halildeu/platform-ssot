import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShellCommonI18n } from '../../i18n';
import { BREADCRUMB_ROUTES, type BreadcrumbRoute } from './header-navigation.config';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface BreadcrumbEntry {
  label: string;
  path: string;
  onClick: () => void;
  /** Sibling routes for dropdown quick-switch at this level. */
  siblings?: Array<{ label: string; path: string; onClick: () => void }>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

function findRoute(pathname: string): BreadcrumbRoute | null {
  // Longest prefix match
  let best: BreadcrumbRoute | null = null;
  let bestLen = 0;
  for (const route of BREADCRUMB_ROUTES) {
    if (route.pattern === '/') {
      if (pathname === '/' && route.pattern.length >= bestLen) {
        best = route;
        bestLen = route.pattern.length;
      }
    } else if (pathname.startsWith(route.pattern) && route.pattern.length > bestLen) {
      best = route;
      bestLen = route.pattern.length;
    }
  }
  return best;
}

function findRouteExact(pattern: string): BreadcrumbRoute | null {
  return BREADCRUMB_ROUTES.find((r) => r.pattern === pattern) ?? null;
}

/**
 * Build breadcrumb chain from current location using BREADCRUMB_ROUTES config.
 * Each entry includes sibling routes for interactive dropdown navigation.
 */
export function useBreadcrumb(): { items: BreadcrumbEntry[]; hasContent: boolean } {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useShellCommonI18n();

  const items = useMemo<BreadcrumbEntry[]>(() => {
    const chain: BreadcrumbEntry[] = [];
    const currentRoute = findRoute(pathname);
    if (!currentRoute) return chain;

    // Walk parent chain
    const visited = new Set<string>();
    let cursor: BreadcrumbRoute | null = currentRoute;

    while (cursor && !visited.has(cursor.pattern)) {
      visited.add(cursor.pattern);

      const siblings = (cursor.siblings ?? []).reduce<BreadcrumbEntry['siblings']>((acc, sibPath) => {
        const sibRoute = findRouteExact(sibPath);
        if (sibRoute) {
          acc!.push({
            label: t(sibRoute.labelKey),
            path: sibPath,
            onClick: () => navigate(sibPath),
          });
        }
        return acc;
      }, []);

      const path = cursor.pattern;
      chain.unshift({
        label: t(cursor.labelKey),
        path,
        onClick: () => navigate(path),
        siblings: siblings && siblings.length > 0 ? siblings : undefined,
      });

      cursor = cursor.parent ? findRouteExact(cursor.parent) : null;
    }

    return chain;
  }, [pathname, navigate, t]);

  return { items, hasContent: items.length > 1 };
}
