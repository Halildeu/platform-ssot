import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Lazy-loaded page components — each becomes its own chunk           */
/* ------------------------------------------------------------------ */

const DesignLabLayout = lazy(() => import("./DesignLabLayout"));
const DesignLabLanding = lazy(() => import("./pages/DesignLabLanding"));

/* Design Tokens (was: Foundations) */
const DesignTokensListing = lazy(() => import("./pages/DesignTokensListing"));
const DesignTokenDetail = lazy(() => import("./pages/DesignTokenDetail"));

/* Theme Builder */
const ThemeBuilderPage = lazy(() => import("./pages/ThemeBuilderPage"));

/* Primitives */
const PrimitivesListing = lazy(() => import("./pages/PrimitivesListing"));

/* Components */
const ComponentsListing = lazy(() => import("./pages/ComponentsListing"));
const ComponentGroupListing = lazy(
  () => import("./pages/ComponentGroupListing"),
);
const ComponentDetail = lazy(() => import("./pages/ComponentDetail"));
const APIDetail = lazy(() => import("./pages/APIDetail"));

/* Patterns (was: Pages) */
const PagesListing = lazy(() => import("./pages/PagesListing"));
const PageTemplateDetail = lazy(() => import("./pages/PageTemplateDetail"));

/* Advanced */
const AdvancedListing = lazy(() => import("./pages/AdvancedListing"));

/* Icon Gallery */
const IconGalleryPage = lazy(() => import("./pages/IconGalleryPage"));

/* Bundle Size */
const BundleSizePage = lazy(() => import("./pages/BundleSizePage"));

/* Recipes */
const RecipesListing = lazy(() => import("./pages/RecipesListing"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));

/* Ecosystem */
const EcosystemListing = lazy(() => import("./pages/EcosystemListing"));
const ExtensionDetail = lazy(() => import("./pages/ExtensionDetail"));

/* Developer Experience */
const DependencyGraphPage = lazy(() => import("./pages/DependencyGraphPage"));
const UsageAnalyticsPage = lazy(() => import("./pages/UsageAnalyticsPage"));

/* Enterprise */
const FigmaSyncPage = lazy(() => import("./pages/FigmaSyncPage"));
const VisualRegressionPage = lazy(() => import("./pages/VisualRegressionPage"));

/* Migration */
const MigrationGuidePage = lazy(() => import("./pages/MigrationGuidePage"));

/* Theming Guide */
const ThemingGuidePage = lazy(() => import("./pages/ThemingGuidePage"));

/* Parity Dashboard */
const ParityDashboardPage = lazy(() => import("./pages/ParityDashboardPage"));

/* Adoption Insights */
const InsightsDashboardPage = lazy(() => import("./pages/InsightsDashboardPage"));

/* Quality Audit */
const QualityAuditPage = lazy(() => import("./pages/QualityAuditPage"));

/* Quality Dashboard */
const QualityDashboardPage = lazy(() => import("./pages/QualityDashboardPage"));

/* Visual Composition Builder */
const ComposePage = lazy(() => import("./compose/ComposePage"));

/* Cross-Component Interaction Playground */
const InteractionPlayground = lazy(() => import("./interaction/InteractionPlayground"));

/* Governance Plane */
const GovernancePage = lazy(() => import("./pages/GovernancePage"));

/* Observability */
const ObservabilityPage = lazy(() => import("./pages/ObservabilityPage"));

/* Intelligence */
const IntelligencePage = lazy(() => import("./pages/IntelligencePage"));

/* Leadership Proof */
const LeadershipProofPage = lazy(() => import("./pages/LeadershipProofPage"));

/* X Suite Runtime Preview (iframe target for Design Lab dual preview) */
const XSuiteRuntimePreview = lazy(() => import("./XSuiteRuntimePreview"));

/* Legacy — kept for backward-compat redirects */
const FoundationsListing = lazy(() => import("./pages/FoundationsListing"));
const FoundationDetail = lazy(() => import("./pages/FoundationDetail"));

/* ------------------------------------------------------------------ */
/*  Skeleton fallback (shared across all lazy boundaries)              */
/* ------------------------------------------------------------------ */

function PageSkeleton() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-border-subtle border-t-action-primary" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Legacy URL redirect helper                                         */
/*                                                                     */
/*  Translates old query-param based navigation to dedicated routes:   */
/*  ?dl_mode=components&dl_group=actions&dl_item=Button                */
/*  → /admin/design-lab/components/actions/Button                      */
/* ------------------------------------------------------------------ */

function LegacyUrlRedirect() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("dl_mode");
  const group = params.get("dl_group");
  const item = params.get("dl_item");
  const recipe = params.get("dl_recipe");
  const template = params.get("dl_template");
  const extension = params.get("dl_extension");
  const foundation = params.get("dl_foundation");
  const section = params.get("dl_section");

  // If no legacy params, render nothing (index route will handle it)
  if (!mode && !section) return null;

  const effectiveMode = mode ?? section ?? "components";

  let targetPath = "/admin/design-lab";

  switch (effectiveMode) {
    case "foundations":
      targetPath += foundation
        ? `/design/${foundation}`
        : "/design";
      break;

    case "components":
      if (group && item) {
        targetPath += `/components/${group}/${encodeURIComponent(item)}`;
      } else if (group) {
        targetPath += `/components/${group}`;
      } else {
        targetPath += "/components";
      }
      break;

    case "recipes":
      targetPath += recipe
        ? `/recipes/${recipe}`
        : "/recipes";
      break;

    case "pages":
      targetPath += template
        ? `/patterns/${template}`
        : "/patterns";
      break;

    case "ecosystem":
      targetPath += extension
        ? `/ecosystem/${extension}`
        : "/ecosystem";
      break;

    default:
      targetPath = "/admin/design-lab";
  }

  return <Navigate to={targetPath} replace />;
}

/* ------------------------------------------------------------------ */
/*  Route definitions                                                  */
/*                                                                     */
/*  Mounted at /admin/design-lab/* in ShellApp.ui.tsx                  */
/*  All child routes are relative (no leading slash).                  */
/* ------------------------------------------------------------------ */

export const DesignLabRoutes: React.FC = () => (
  <Suspense fallback={<PageSkeleton />}>
    <Routes>
      <Route element={<DesignLabLayout />}>
        {/* Landing / overview */}
        <Route index element={<DesignLabLanding />} />

        {/* Design Tokens layer */}
        <Route path="design" element={<DesignTokensListing />} />
        <Route path="design/:tokenGroup" element={<DesignTokenDetail />} />

        {/* Theme Builder layer */}
        <Route path="theme" element={<ThemeBuilderPage />} />
        <Route path="theme/:section" element={<ThemeBuilderPage />} />

        {/* Primitives layer */}
        <Route path="primitives" element={<PrimitivesListing />} />
        <Route
          path="primitives/:groupId/:itemId"
          element={<ComponentDetail />}
        />

        {/* Components layer */}
        <Route path="components" element={<ComponentsListing />} />
        <Route path="components/:groupId" element={<ComponentGroupListing />} />
        <Route
          path="components/:groupId/:itemId"
          element={<ComponentDetail />}
        />

        {/* Patterns layer (was: Pages) */}
        <Route path="patterns" element={<PagesListing />} />
        <Route
          path="patterns/:templateId"
          element={<PageTemplateDetail />}
        />

        {/* Advanced layer */}
        <Route path="advanced" element={<AdvancedListing />} />
        <Route
          path="advanced/:itemId"
          element={<ComponentDetail />}
        />

        {/* APIs layer */}
        <Route path="apis" element={<AdvancedListing />} />
        <Route path="apis/:itemId" element={<APIDetail />} />

        {/* Icon Gallery */}
        <Route path="icons" element={<IconGalleryPage />} />

        {/* Bundle Size */}
        <Route path="bundle-size" element={<BundleSizePage />} />

        {/* Developer Experience */}
        <Route path="graph" element={<DependencyGraphPage />} />
        <Route path="analytics" element={<UsageAnalyticsPage />} />

        {/* Enterprise */}
        <Route path="figma-sync" element={<FigmaSyncPage />} />
        <Route path="visual-regression" element={<VisualRegressionPage />} />

        {/* Migration */}
        <Route path="migration" element={<MigrationGuidePage />} />

        {/* Theming Guide */}
        <Route path="theming" element={<ThemingGuidePage />} />

        {/* Parity Dashboard */}
        <Route path="parity" element={<ParityDashboardPage />} />

        {/* Adoption Insights */}
        <Route path="insights" element={<InsightsDashboardPage />} />

        {/* Quality Command Center (merged audit + dashboard) */}
        <Route path="quality-dashboard" element={<QualityDashboardPage />} />
        {/* Legacy redirect: quality-audit → quality-dashboard */}
        <Route path="quality-audit" element={<QualityDashboardPage />} />

        {/* Visual Composition Builder */}
        <Route path="compose" element={<ComposePage />} />

        {/* Cross-Component Interaction */}
        <Route path="interactions" element={<InteractionPlayground />} />

        {/* Governance Plane */}
        <Route path="governance" element={<GovernancePage />} />

        {/* Observability */}
        <Route path="observability" element={<ObservabilityPage />} />

        {/* Intelligence */}
        <Route path="intelligence" element={<IntelligencePage />} />

        {/* Leadership Proof */}
        <Route path="leadership" element={<LeadershipProofPage />} />

        {/* Recipes layer */}
        <Route path="recipes" element={<RecipesListing />} />
        <Route path="recipes/:recipeId" element={<RecipeDetail />} />

        {/* Ecosystem layer */}
        <Route path="ecosystem" element={<EcosystemListing />} />
        <Route
          path="ecosystem/:extensionId"
          element={<ExtensionDetail />}
        />

        {/* ---- Backward-compat redirects ---- */}
        <Route
          path="foundations"
          element={<Navigate to="/admin/design-lab/design" replace />}
        />
        <Route
          path="foundations/:familyId"
          element={<FoundationsRedirect />}
        />
        <Route
          path="pages"
          element={<Navigate to="/admin/design-lab/patterns" replace />}
        />
        <Route
          path="pages/:templateId"
          element={<PagesRedirect />}
        />

        {/* Legacy query-param redirect (catch-all within layout) */}
        <Route path="*" element={<LegacyUrlRedirect />} />
      </Route>

      {/* X Suite Runtime Preview — standalone (no shell chrome) for iframe embedding */}
      <Route path="runtime-preview" element={<XSuiteRuntimePreview />} />
    </Routes>
  </Suspense>
);

/* ---- Redirect helpers for parameterized legacy routes ---- */

function FoundationsRedirect() {
  const familyId = window.location.pathname.split("/").pop();
  return <Navigate to={`/admin/design-lab/design/${familyId}`} replace />;
}

function PagesRedirect() {
  const templateId = window.location.pathname.split("/").pop();
  return <Navigate to={`/admin/design-lab/patterns/${templateId}`} replace />;
}

export default DesignLabRoutes;
