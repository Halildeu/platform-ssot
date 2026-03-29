import React, { useMemo, _useCallback, useRef } from "react";
import * as MfeUiKit from "@mfe/design-system";
import { Text } from "@mfe/design-system";

/* ---- Extracted modules ---- */
import { _xSuiteComponents } from "./xSuiteStubs";
import "./xSuiteStubsExtended";
import "./xSuiteEnterpriseStubs";

import {
  _NON_DOM_SAFE_PROPS,
  resolveComponentKey,
  componentRegistry,
  DEFAULT_CHILDREN,
  NON_COMPONENT_ENTRIES,
  NON_COMPONENT_LABELS,
  emitActionLog,
  nextLogId,
} from "./playgroundRegistry";

import { DEFAULT_PROPS } from "./playgroundDefaultProps";
import { DEFAULT_PROPS_OVERLAY } from "./playgroundDefaultPropsOverlay";
import { DEFAULT_PROPS_TEMPLATES } from "./playgroundDefaultPropsTemplates";
import { DEFAULT_PROPS_THEME } from "./playgroundDefaultPropsTheme";
import "./playgroundDefaultPropsXSuite";

/* Merge all DEFAULT_PROPS parts into the canonical DEFAULT_PROPS object */
Object.assign(DEFAULT_PROPS, DEFAULT_PROPS_OVERLAY, DEFAULT_PROPS_TEMPLATES, DEFAULT_PROPS_THEME);

/* ---- Re-export action log API (originally exported from this file) ---- */
export type { ActionLogEntry, ActionLogSubscriber } from "./playgroundRegistry";
export { subscribeToActionLog } from "./playgroundRegistry";

type PlaygroundPreviewProps = {
  componentName: string;
  propValues: Record<string, string | boolean | number>;
  /** When true, renders without the outer border/panel wrapper — used for state demo cards */
  compact?: boolean;
};

/** Check whether a component has playground default props configured. */
export function hasPlayground(componentName: string): boolean {
  return componentName in DEFAULT_PROPS;
}

export const PlaygroundPreview: React.FC<PlaygroundPreviewProps> = ({
  componentName,
  propValues,
  compact = false,
}) => {
  const Component = componentRegistry[componentName];
  const startTimeRef = useRef(0);

  const mergedProps = useMemo(() => {
    // Resolve alias: e.g. "Navigation Menu" → use MenuBar's DEFAULT_PROPS
    const resolvedKey = resolveComponentKey(componentName);
    const base = DEFAULT_PROPS[componentName] ?? DEFAULT_PROPS[resolvedKey] ?? {};
    const filtered: Record<string, unknown> = { ...base };

    // Apply playground prop values, filtering out empty strings but preserving 0 and false
    for (const [key, value] of Object.entries(propValues)) {
      if (value === "") continue;
      // Don't override array/object DEFAULT_PROPS with string values from variant axes
      // e.g. "recommendations: empty | populated" axis shouldn't override recommendations: []
      const baseValue = filtered[key];
      if (typeof value === "string" && baseValue != null && typeof baseValue === "object") {
        continue;
      }
      if (typeof value === "boolean" || typeof value === "number") {
        filtered[key] = value;
        continue;
      }
      filtered[key] = value;
    }

    // NON_DOM_SAFE_PROPS: These are handled by the component implementations.
    // If DOM warnings persist for specific props, the fix belongs in the component source.

    // Variant axis → prop mapping for recipe components whose axis names
    // collide with component props (e.g. "results", "filters", "summary").
    if (componentName === "SearchFilterListing") {
      const resultsAxis = propValues.results as string | undefined;
      const filtersAxis = propValues.filters as string | undefined;
      const summaryAxis = propValues.summary as string | undefined;
      const sizeAxis = propValues.size as string | undefined;

      // size axis → size prop
      if (sizeAxis === "compact") {
        filtered.size = "compact";
      } else {
        filtered.size = "default";
      }

      // results axis → items / results prop
      if (resultsAxis === "empty") {
        filtered.items = [];
        delete filtered.results;
      } else if (resultsAxis === "listed") {
        // keep DEFAULT_PROPS items + related listing props
        filtered.items = base.items;
        filtered.totalCount = base.totalCount;
        filtered.sortOptions = base.sortOptions;
        filtered.activeSort = base.activeSort;
        delete filtered.results;
      } else if (resultsAxis === "custom-surface") {
        filtered.results = React.createElement("div", { className: "flex flex-col items-center gap-3 py-8 text-center" },
          React.createElement("div", { className: "text-2xl" }, "\u{1F4CA}"),
          React.createElement("div", { className: "text-sm font-semibold text-[var(--text-primary)]" }, "Ozel sonuc yuzeyi"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "results prop ile tamamen ozellestirilebilir icerik."),
        );
        filtered.items = [];
      } else {
        delete filtered.results;
      }

      // filters axis → filters prop
      if (filtersAxis === "hidden") {
        filtered.filters = undefined;
      } else if (filtersAxis === "visible") {
        filtered.filters = React.createElement(React.Fragment, null,
          React.createElement((MfeUiKit as unknown as Record<string, React.ComponentType<Record<string, unknown>>>).TextInput, { label: "Arama", value: "", size: "sm" }),
          React.createElement((MfeUiKit as unknown as Record<string, React.ComponentType<Record<string, unknown>>>).Select, {
            label: "Durum", size: "sm", value: "all",
            options: [{ label: "Tumunu goster", value: "all" }, { label: "Aktif", value: "active" }, { label: "Incelemede", value: "review" }],
          }),
        );
        filtered.activeFilters = base.activeFilters;
        filtered.onClearAllFilters = base.onClearAllFilters;
      }

      // summary axis → summaryItems prop
      if (summaryAxis === "absent") {
        filtered.summaryItems = [];
      } else if (summaryAxis === "present") {
        filtered.summaryItems = base.summaryItems;
      }
    }

    // ApprovalReview variant axis mapping
    if (componentName === "ApprovalReview") {
      const layoutAxis = propValues.layout as string | undefined;
      const modeAxis = propValues.mode as string | undefined;
      const selectionAxis = propValues.selection as string | undefined;

      // layout axis → reorder checkpoint vs citations
      if (layoutAxis === "evidence-first") {
        filtered.title = "Kanit Oncelikli Inceleme";
        filtered.description = "Kaynaklar ve kanitlar onay kararindan once sunulur.";
        // Swap citations to have more items, showing evidence-focused view
        filtered.citations = [
          { id: "cite-1", title: "Guvenlik Raporu", excerpt: "Tum guvenlik testleri basariyla gecmistir.", source: "Otomatik Tarama v3.2", kind: "doc" as const },
          { id: "cite-2", title: "Performans Analizi", excerpt: "Ortalama yanit suresi %15 iyilesmistir.", source: "APM Raporu", kind: "log" as const },
          { id: "cite-3", title: "Kod Kapsamı", excerpt: "Birim test kapsamı %94 seviyesine ulasmistir.", source: "CI Pipeline", kind: "code" as const },
        ];
      } else {
        delete filtered.layout;
      }

      // mode axis → access control
      if (modeAxis === "readonly") {
        filtered.access = "readonly";
        filtered.title = "Salt Okunur Inceleme";
        filtered.description = "Bu onay tamamlanmis, yalnizca goruntuleme modundadir.";
        filtered.checkpoint = {
          ...(base.checkpoint as Record<string, unknown>),
          status: "approved",
          title: "Onaylandi",
          summary: "Bu degisiklik basariyla onaylanmis ve yayinlanmistir.",
        };
      } else {
        delete filtered.mode;
      }

      // selection axis → controlled citation selection
      if (selectionAxis === "controlled") {
        filtered.selectedCitationId = "cite-1";
        filtered.selectedAuditId = "audit-1";
      } else {
        delete filtered.selection;
      }
    }

    // ── Generic variant axis → prop resolution ──
    // Most axes map directly to props with matching names (e.g. density, size, variant).
    // This table handles exceptions where axis name ≠ prop name or value needs transformation.
    // Shape: ComponentName → { axisName → { axisValue → propsToSet } }
    // A null value for an axis entry means "just delete this axis key from filtered".
    const VARIANT_AXIS_OVERRIDES: Record<string, Record<string, Record<string, Record<string, unknown>> | null>> = {
      TableSimple: {
        surface: { striped: { striped: true }, flat: { striped: false } },
        header: { static: { stickyHeader: false }, sticky: { stickyHeader: true } },
        width: { intrinsic: { fullWidth: false }, "full-width": { fullWidth: true }, auto: { fullWidth: false }, full: { fullWidth: true } },
      },
      Accordion: {
        surface: { bordered: { bordered: true, ghost: false }, ghost: { ghost: true, bordered: false } },
        icon: { visible: { showArrow: true }, hidden: { showArrow: false } },
        "icon-position": { start: { expandIconPosition: "start" }, end: { expandIconPosition: "end" } },
        trigger: { header: { collapsible: "header" }, icon: { collapsible: "icon" }, disabled: { collapsible: "disabled" } },
        spacing: { default: { disableGutters: false }, "no-gutters": { disableGutters: true } },
      },
      Steps: {
        mode: { static: { interactive: false }, interactive: { interactive: true } },
      },
      Descriptions: {
        surface: { bordered: { bordered: true }, plain: { bordered: false } },
      },
      Divider: {
        label: { none: { label: undefined }, text: { label: "Bölüm" } },
        decorative: { true: { decorative: true }, false: { decorative: false } },
      },
      Skeleton: {
        animated: { true: { animated: true }, false: { animated: false } },
      },
      TourCoachmarks: {
        allowSkip: { true: { allowSkip: true }, false: { allowSkip: false } },
        showProgress: { true: { showProgress: true }, false: { showProgress: false } },
      },
      NavigationRail: {
        density: { sm: { size: "sm" }, md: { size: "md" } },
        layout: { regular: { compact: false }, compact: { compact: true } },
        alignment: { start: { align: "start" }, center: { align: "center" } },
        surface: { default: { appearance: "default" }, outline: { appearance: "outline" }, ghost: { appearance: "ghost" } },
        "label-visibility": { always: { labelVisibility: "always" }, active: { labelVisibility: "active" }, none: { labelVisibility: "none" } },
      },
      Segmented: {
        selection: { single: { selectionMode: "single" }, multiple: { selectionMode: "multiple" } },
        layout: { default: { fullWidth: false }, "full-width": { fullWidth: true } },
        surface: { default: { appearance: "default" }, outline: { appearance: "outline" }, ghost: { appearance: "ghost" } },
      },
      DetailSectionTabs: {
        sticky: { true: { sticky: true }, false: { sticky: false } },
        layout: null, // not a real prop, just delete
        description: null, // not a real prop, just delete
      },
      NotificationItemCard: {
        selectable: { on: { selectable: true }, off: { selectable: false } },
      },
      NotificationPanel: {
        selectable: { on: { selectable: true }, off: { selectable: false } },
        grouping: null, // complex config, delete raw axis
        dateGrouping: null,
        filters: null,
      },
      Combobox: {
        freeSolo: { on: { freeSolo: true }, off: { freeSolo: false } },
        popup: { inline: { disablePortal: true }, portal: { disablePortal: false } },
      },
      EmptyErrorLoading: {
        skeleton: { on: { showSkeleton: true }, off: { showSkeleton: false } },
        recovery: null, // complex config, delete raw axis
      },
      AnchorToc: {
        layout: { static: { sticky: false }, sticky: { sticky: true } },
      },
      ConfidenceBadge: {
        layout: { default: { compact: false }, compact: { compact: true } },
        level: { low: { level: "low", label: undefined, score: 0.25 }, medium: { level: "medium", label: undefined, score: 0.55 }, high: { level: "high", label: undefined, score: 0.85 }, "very-high": { level: "very-high", label: undefined, score: 0.97 } },
      },
      RecommendationCard: {
        layout: { default: { compact: false }, compact: { compact: true } },
      },
      CommandPalette: {
        state: { open: { open: true }, closed: { open: false } },
        layout: null, // complex, delete
      },
      DetailSummary: {
        summary: null, // complex (modifies summaryItems array), delete raw axis
        payload: null, // complex, delete
        header: null, // complex, delete
      },
      AgGridServer: {
        surface: null, // complex grid config, delete raw axis
        "data-flow": null,
        schema: null,
      },
      FilterBar: {
        surface: null, // complex config, delete raw axis
        actions: null,
      },
      FormDrawer: {
        footer: null, // complex config, delete raw axis
        surface: null,
      },
      EntitySummaryBlock: {
        surface: null, // complex config, delete raw axis
        identity: null,
        actions: null,
      },
      JsonViewer: {
        depth: null, // complex config, delete raw axis
        surface: null,
        "type badges": null,
      },
      NotificationDrawer: {
        visibility: { open: { open: true }, closed: { open: false } },
        dismiss: null,
        lifecycle: null,
        content: null,
        surface: null,
      },
      PageLayout: {
        surface: null, // complex config, delete raw axis
        header: null,
        footer: null,
      },
      ReportFilterPanel: {
        layout: null, // complex config, delete raw axis
        actions: null,
        surface: null,
      },
      /* ---- Form control primitives — map state axis to real props ---- */
      Switch: {
        state: {
          unchecked: { checked: false },
          checked: { checked: true },
          readonly: { access: "readonly", checked: true },
          disabled: { disabled: true },
        },
        mode: null, // conceptual, not a real prop
      },
      Checkbox: {
        state: {
          unchecked: { checked: false },
          checked: { checked: true },
          indeterminate: { indeterminate: true },
        },
        tone: {
          default: {},
          invalid: { error: true },
          readonly: { access: "readonly" },
          disabled: { disabled: true },
        },
      },
      Radio: {
        state: {
          unchecked: { checked: false },
          checked: { checked: true },
          readonly: { access: "readonly", checked: true },
          disabled: { disabled: true },
          invalid: { error: true },
        },
        grouping: null, // conceptual, not a real prop
      },
      /* ---- Other form controls ---- */
      TextInput: {
        tone: {
          default: {},
          invalid: { error: true },
          readonly: { readOnly: true },
          disabled: { disabled: true },
        },
        slots: null, // conceptual
      },
      TextArea: {
        tone: {
          default: {},
          invalid: { error: true },
          readonly: { readOnly: true },
          disabled: { disabled: true },
        },
        resize: null, // CSS resize, not a preview-visible prop
      },
      Select: {
        access: {
          full: {},
          readonly: { readOnly: true },
          disabled: { disabled: true },
          hidden: { access: "hidden" },
        },
        placeholder: null, // not a visual override
        "selection-meta": null,
        "group-description": null,
      },
      Slider: {
        state: {
          default: {},
          invalid: { error: true },
          readonly: { readOnly: true },
          disabled: { disabled: true },
        },
        range: null, // conceptual
      },
      DatePicker: {
        state: {
          default: {},
          invalid: { error: true },
          readonly: { readOnly: true },
          disabled: { disabled: true },
        },
        range: null, // conceptual
      },
      TimePicker: {
        state: {
          default: {},
          invalid: { error: true },
          readonly: { readOnly: true },
          disabled: { disabled: true },
        },
        range: null, // conceptual
      },
      Upload: {
        state: {
          default: {},
          invalid: { error: true },
          readonly: { readOnly: true },
          disabled: { disabled: true },
        },
        mode: null, // conceptual
      },
    };

    // Apply overrides
    const overrides = VARIANT_AXIS_OVERRIDES[componentName];
    if (overrides) {
      for (const [axisName, valueMap] of Object.entries(overrides)) {
        const axisValue = propValues[axisName] as string | undefined;
        if (valueMap === null) {
          // null entry → just delete the raw axis string from props
          delete filtered[axisName];
        } else if (axisValue && valueMap[axisValue]) {
          Object.assign(filtered, valueMap[axisValue]);
          delete filtered[axisName]; // Remove the raw axis string
        } else {
          delete filtered[axisName]; // Remove unknown axis values too
        }
      }
    }

    // Generic boolean string cleanup for axes that coincidentally match prop names
    // but pass string "true"/"false" instead of actual booleans.
    for (const [key, value] of Object.entries(filtered)) {
      if (value === "true") { filtered[key] = true; }
      else if (value === "false") { filtered[key] = false; }
    }

    return filtered;
  }, [componentName, propValues]);

  /* ---- Event interceptor: wrap function props to log to Actions Panel ---- */
  const interceptedProps = useMemo(() => {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(mergedProps)) {
      if (typeof value === "function" && key.startsWith("on")) {
        // Wrap event handler to log it
        result[key] = (...args: unknown[]) => {
          emitActionLog({
            id: nextLogId(),
            eventName: key,
            timestamp: Date.now(),
            payload: args.map(safeSerializeArg),
            componentName,
          });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
          return (value as Function)(...args);
        };
      } else {
        result[key] = value;
      }
    }
    // Also intercept common events that might not have handlers set
    // Skip for compound/container components — they don't forward these to DOM elements
    const COMPOUND_COMPONENTS = new Set([
      "PageLayout", "Tabs", "Accordion", "Steps", "TreeTable",
      "EntityGridTemplate", "AgGridServer", "DetailDrawer", "FormDrawer",
      "NavigationRail", "DetailSectionTabs", "SearchFilterListing",
      "NotificationDrawer", "CitationPanel", "CommandPalette",
      "ApprovalReview", "AIGuidedAuthoring", "DetailSummary",
      "TourCoachmarks", "NotificationPanel", "ReportFilterPanel",
      "FilterBar", "PageHeader", "SummaryStrip", "EntitySummaryBlock",
      "AIActionAuditTimeline", "ApprovalCheckpoint", "PromptComposer",
      "RecommendationCard", "ConfidenceBadge", "ThemePresetCompare",
      "ThemePresetGallery",
    ]);
    if (!COMPOUND_COMPONENTS.has(componentName)) {
      const commonEvents = ["onClick", "onChange", "onFocus", "onBlur", "onMouseEnter", "onMouseLeave", "onKeyDown"];
      for (const evt of commonEvents) {
        if (!(evt in result)) {
          result[evt] = (...args: unknown[]) => {
            emitActionLog({
              id: nextLogId(),
              eventName: evt,
              timestamp: Date.now(),
              payload: args.map(safeSerializeArg),
              componentName,
            });
          };
        }
      }
    }
    return result;
  }, [mergedProps, componentName]);

  const children = useMemo(() => {
    const resolvedKey = resolveComponentKey(componentName);
    // Explicitly defined children (may be undefined for compound/prop-driven components)
    if (componentName in DEFAULT_CHILDREN || resolvedKey in DEFAULT_CHILDREN) {
      return DEFAULT_CHILDREN[componentName] ?? DEFAULT_CHILDREN[resolvedKey];
    }
    // If DEFAULT_PROPS provides children, don't add extra
    if (DEFAULT_PROPS[componentName]?.children != null || DEFAULT_PROPS[resolvedKey]?.children != null) {
      return undefined;
    }
    // Unknown components — try "Content" as generic children
    return "Content";
  }, [componentName]);

  /* ---- Non-component fallback (hooks, utilities, constants, etc.) ---- */
  const nonComponentType = NON_COMPONENT_ENTRIES[componentName];
  if (nonComponentType) {
    const meta = NON_COMPONENT_LABELS[nonComponentType];
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-border-subtle bg-surface-panel p-6">
        <div className="text-center max-w-md">
          <div className="text-2xl mb-2">{meta.icon}</div>
          <Text as="div" className="text-sm font-semibold text-text-primary">
            {componentName}
          </Text>
          <Text as="div" className="mt-0.5 text-xs font-medium text-action-primary">
            {meta.label}
          </Text>
          <Text variant="secondary" className="mt-2 text-xs leading-relaxed">
            {meta.description}
          </Text>
        </div>
      </div>
    );
  }

  if (!Component) {
    /* Check if this is an X Suite component that has a runtime preview route */
    const isXSuiteCandidate = componentName in _xSuiteComponents;
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border-2 border-dashed border-border-subtle bg-surface-canvas p-8">
        <div className="text-center max-w-sm">
          <Text as="div" className="text-sm font-medium text-text-primary">
            {componentName}
          </Text>
          <Text variant="secondary" className="mt-1 text-xs">
            {isXSuiteCandidate
              ? "This X Suite component stub is registered but could not be resolved. Use the Runtime Preview mode for the full implementation."
              : "Component not found in registry. Live preview is available for exported @mfe/design-system components."}
          </Text>
          {isXSuiteCandidate && (
            <a
              href={`/admin/design-lab/runtime-preview?component=${encodeURIComponent(componentName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs font-medium text-action-primary hover:underline"
            >
              Open Runtime Preview &rarr;
            </a>
          )}
        </div>
      </div>
    );
  }

  // For controlled components that need internal state management
  const needsStatefulWrapper =
    componentName === "Pagination" ||
    componentName === "Tabs" ||
    componentName === "Segmented";

  // Compound components that need special rendering (e.g. Radio → RadioGroup wrapper)
  const isRadioCompound = componentName === "Radio";

  // Drawer / overlay components that use fixed positioning — contain them
  // inside a relative container so they don't cover the entire page.
  const isContainedOverlay =
    componentName === "DetailDrawer" ||
    componentName === "FormDrawer" ||
    componentName === "NotificationDrawer";

  const componentElement = isRadioCompound ? (
    <CompoundRadioPreview interceptedProps={interceptedProps} />
  ) : needsStatefulWrapper ? (
    <StatefulWrapper
      Component={Component}
      componentName={componentName}
      interceptedProps={interceptedProps}
    >
      {children}
    </StatefulWrapper>
  ) : children !== undefined ? (
    <Component {...interceptedProps}>
      {children}
    </Component>
  ) : (
    <Component {...interceptedProps} />
  );

  if (compact) {
    return (
      <ErrorBoundary componentName={componentName}>
        {componentElement}
      </ErrorBoundary>
    );
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-panel p-8">
      <div className="flex items-center justify-center">
        <ErrorBoundary componentName={componentName}>
          {isContainedOverlay ? (
            <div
              style={{ position: "relative", width: "100%", height: 420, overflow: "hidden", borderRadius: 16 }}
              className="border border-border-subtle bg-surface-canvas"
            >
              {componentElement}
            </div>
          ) : componentElement}
        </ErrorBoundary>
      </div>
    </div>
  );
};

/* ---- Stateful wrapper for controlled components ---- */

function StatefulWrapper({
  Component,
  componentName,
  interceptedProps,
  children,
}: {
  Component: React.ComponentType<Record<string, unknown>>;
  componentName: string;
  interceptedProps: Record<string, unknown>;
  children: React.ReactNode;
}) {
  const [page, setPage] = React.useState((interceptedProps.current as number) ?? 1);
  const [activeKey, setActiveKey] = React.useState(
    (interceptedProps.activeKey as string) ?? (interceptedProps.value as string) ?? (interceptedProps.defaultActiveKey as string) ?? "",
  );

  const enhancedProps = React.useMemo(() => {
    const props = { ...interceptedProps };
    if (componentName === "Pagination") {
      props.current = page;
      const origOnChange = props.onChange as ((...args: unknown[]) => void) | undefined;
      props.onChange = (newPage: number) => {
        setPage(newPage);
        origOnChange?.(newPage);
      };
    }
    if (componentName === "Tabs") {
      props.activeKey = activeKey;
      const origOnChange = props.onChange as ((...args: unknown[]) => void) | undefined;
      props.onChange = (key: string) => {
        setActiveKey(key);
        origOnChange?.(key);
      };
    }
    if (componentName === "Segmented") {
      props.value = activeKey;
      const origOnChange = props.onValueChange as ((...args: unknown[]) => void) | undefined;
      props.onValueChange = (key: string) => {
        setActiveKey(key);
        origOnChange?.(key);
      };
    }
    return props;
  }, [interceptedProps, componentName, page, activeKey]);

  return children !== undefined ? (
    <Component {...enhancedProps}>
      {children}
    </Component>
  ) : (
    <Component {...enhancedProps} />
  );
}

/* ---- Safe argument serializer for action log ---- */

function safeSerializeArg(arg: unknown): unknown {
  if (arg === null || arg === undefined) return arg;
  if (typeof arg === "string" || typeof arg === "number" || typeof arg === "boolean") return arg;
  if (arg instanceof Event || (typeof arg === "object" && arg !== null && "nativeEvent" in (arg as Record<string, unknown>))) {
    // React SyntheticEvent — extract useful fields
    const evt = arg as Record<string, unknown>;
    return {
      type: evt.type,
      target: evt.target ? `<${(evt.target as HTMLElement).tagName?.toLowerCase?.() ?? "unknown"}>` : undefined,
      currentTarget: evt.currentTarget ? `<${(evt.currentTarget as HTMLElement).tagName?.toLowerCase?.() ?? "unknown"}>` : undefined,
      value: (evt.target as HTMLInputElement)?.value,
    };
  }
  try {
    // Attempt shallow serialization
    return JSON.parse(JSON.stringify(arg));
  } catch {
    return String(arg);
  }
}

/* ---- Error boundary for safe rendering ---- */

type ErrorBoundaryProps = {
  componentName: string;
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error when component or props change
    if (prevProps.componentName !== this.props.componentName) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-state-error-bg bg-state-error-bg/10 px-4 py-3">
          <Text as="div" className="text-xs font-medium text-state-error-text">
            Preview error
          </Text>
          <Text variant="secondary" className="mt-1 text-xs">
            {this.state.error?.message ?? "Unknown error rendering component."}
          </Text>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ---- Compound Radio Preview — renders RadioGroup with multiple options ---- */

function CompoundRadioPreview({ interceptedProps }: { interceptedProps: Record<string, unknown> }) {
  const RadioComp = (MfeUiKit as Record<string, React.ComponentType<Record<string, unknown>>>).Radio;
  const RadioGroupComp = (MfeUiKit as Record<string, React.ComponentType<Record<string, unknown>>>).RadioGroup;

  if (!RadioComp || !RadioGroupComp) {
    return <div>Radio bileşeni yüklenemedi</div>;
  }

  const size = interceptedProps.radioSize as string | undefined;
  const error = interceptedProps.error as boolean | undefined;
  const access = interceptedProps.access as string | undefined;

  return (
    <RadioGroupComp name="bildirim-tercihi" defaultValue="email" direction="vertical">
      <RadioComp value="email" label="E-posta" description="Onemli guncellemeler e-posta ile gonderilir" radioSize={size} error={error} access={access} />
      <RadioComp value="sms" label="SMS" description="Acil bildirimler SMS ile iletilir" radioSize={size} error={error} access={access} />
      <RadioComp value="push" label="Push Bildirimi" description="Tarayici bildirimleri ile anlik uyari" radioSize={size} error={error} access={access} />
    </RadioGroupComp>
  );
}
