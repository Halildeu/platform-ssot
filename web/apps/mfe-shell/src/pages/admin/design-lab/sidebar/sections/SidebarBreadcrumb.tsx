import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  SidebarBreadcrumb — clickable location trail                       */
/*  Components › Navigation › Tabs                                     */
/* ------------------------------------------------------------------ */

const LAYER_LABELS: Record<string, string> = {
  foundations: "Foundations",
  primitives: "Primitives",
  components: "Components",
  patterns: "Patterns",
  apis: "APIs",
  recipes: "Recipes",
  ecosystem: "Ecosystem",
};

const LAYER_ALIASES: Record<string, string> = {
  design: "foundations",
  theme: "foundations",
  advanced: "patterns",
  pages: "patterns",
};

function parseBreadcrumb(pathname: string) {
  const segments = pathname
    .replace("/admin/design-lab", "")
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) return [];

  const crumbs: Array<{ label: string; path: string }> = [];
  const rawLayer = segments[0];
  const layer = LAYER_ALIASES[rawLayer] ?? rawLayer;
  const layerLabel = LAYER_LABELS[layer] ?? layer;

  crumbs.push({
    label: layerLabel,
    path: `/admin/design-lab/${rawLayer}`,
  });

  // Group (e.g., "navigation")
  if (segments.length >= 2) {
    const group = segments[1];
    const groupLabel = group
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({
      label: groupLabel,
      path: `/admin/design-lab/${rawLayer}/${group}`,
    });
  }

  // Item (e.g., "Tabs")
  if (segments.length >= 3) {
    const item = segments[2];
    crumbs.push({
      label: item,
      path: `/admin/design-lab/${segments.join("/")}`,
    });
  }

  return crumbs;
}

export const SidebarBreadcrumb: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const crumbs = parseBreadcrumb(location.pathname);

  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 px-3 py-1.5 text-[11px] text-text-secondary overflow-hidden"
    >
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.path}>
          {i > 0 && (
            <span className="text-border-default shrink-0" aria-hidden>
              ›
            </span>
          )}
          {i < crumbs.length - 1 ? (
            <button
              type="button"
              onClick={() => navigate(crumb.path)}
              className="truncate hover:text-text-primary hover:underline transition-colors cursor-pointer"
            >
              {crumb.label}
            </button>
          ) : (
            <span className="truncate font-medium text-text-primary">
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

SidebarBreadcrumb.displayName = "SidebarBreadcrumb";
