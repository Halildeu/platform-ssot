import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Text } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  XSuiteRuntimePreview                                                */
/*                                                                     */
/*  Runtime preview for X Suite components. Used by Design Lab as an   */
/*  iframe source to render real federated components in the shell     */
/*  context where AG Charts / AG Grid dependencies are available.      */
/*                                                                     */
/*  Query params:                                                      */
/*    ?component=KPICard   — component name to render                  */
/*    ?variant=default     — (reserved) variant key                    */
/*                                                                     */
/*  This page tries to load each X package via try/catch require().    */
/*  If the package is not bundled, a friendly message is shown.        */
/* ------------------------------------------------------------------ */

/* ---- Package component maps (populated at module load) ---- */

const _runtimeComponents: Record<string, React.ComponentType<any>> = {};
const _loadErrors: string[] = [];

try {
  const xCharts = require("@mfe/x-charts");
  for (const key of [
    "KPICard", "SparklineChart", "MiniChart", "ChartDashboard",
    "StatWidget", "ChartLegend", "ChartContainer", "GaugeChart",
    "RadarChart", "ScatterChart", "TreemapChart", "HeatmapChart",
    "WaterfallChart",
  ]) {
    if (xCharts[key]) _runtimeComponents[key] = xCharts[key];
  }
} catch {
  _loadErrors.push("@mfe/x-charts");
}

try {
  const xGrid = require("@mfe/x-data-grid");
  for (const key of [
    "DataGridFilterChips", "DataGridSelectionBar", "MasterDetailGrid",
    "TreeDataGrid", "PivotGrid", "EditableGrid", "RowGroupingGrid",
  ]) {
    if (xGrid[key]) _runtimeComponents[key] = xGrid[key];
  }
} catch {
  _loadErrors.push("@mfe/x-data-grid");
}

try {
  const xEditor = require("@mfe/x-editor");
  for (const key of [
    "RichTextEditor", "EditorToolbar", "SlashCommandMenu",
    "MentionList", "EditorTableMenu", "EditorLinkDialog",
    "EditorImageUpload", "EditorMenuBubble",
  ]) {
    if (xEditor[key]) _runtimeComponents[key] = xEditor[key];
  }
} catch {
  _loadErrors.push("@mfe/x-editor");
}

try {
  const xForm = require("@mfe/x-form-builder");
  for (const key of [
    "FormRenderer", "FieldRenderer", "FormPreview", "FormSummary",
    "MultiStepForm", "RepeatableFieldGroup",
  ]) {
    if (xForm[key]) _runtimeComponents[key] = xForm[key];
  }
} catch {
  _loadErrors.push("@mfe/x-form-builder");
}

try {
  const xKanban = require("@mfe/x-kanban");
  for (const key of [
    "KanbanBoard", "KanbanColumn", "KanbanCard", "KanbanToolbar",
    "KanbanSwimlane", "KanbanCardDetail", "KanbanMetrics",
  ]) {
    if (xKanban[key]) _runtimeComponents[key] = xKanban[key];
  }
} catch {
  _loadErrors.push("@mfe/x-kanban");
}

try {
  const xScheduler = require("@mfe/x-scheduler");
  for (const key of [
    "Scheduler", "SchedulerToolbar", "AgendaView", "EventForm",
    "SchedulerEvent", "ResourceView",
  ]) {
    if (xScheduler[key]) _runtimeComponents[key] = xScheduler[key];
  }
} catch {
  _loadErrors.push("@mfe/x-scheduler");
}

/* ---- Default props (same as PlaygroundPreview) ---- */

const RUNTIME_DEFAULT_PROPS: Record<string, Record<string, any>> = {
  KPICard: { title: "Toplam Kullanici", value: "12,847", trend: { direction: "up", value: "+12.5%", positive: true } },
  StatWidget: { label: "API Cagrilari", value: 45230, previousValue: 42100, format: "number" },
  SparklineChart: { data: [10, 12, 8, 15, 13, 17, 20, 18, 22], type: "area" },
  MiniChart: { data: [{ label: "Oca", value: 45 }, { label: "Sub", value: 52 }, { label: "Mar", value: 48 }], type: "bar" },
  ChartContainer: { title: "Grafik Basligi", description: "Aciklama metni", height: 200 },
  ChartLegend: { items: [{ label: "Web", color: "#3b82f6", value: "45%" }, { label: "Mobile", color: "#16a34a", value: "30%" }], direction: "horizontal" },
  ChartDashboard: { columns: 3, gap: "md" },
  GaugeChart: { value: 72, min: 0, max: 100, label: "Performans" },
  RadarChart: { data: [{ label: "Hiz", value: 80 }, { label: "Guvenilirlik", value: 90 }, { label: "Olceklenebilirlik", value: 70 }, { label: "Kullanilabilirlik", value: 85 }, { label: "Guvenlik", value: 75 }] },
  DataGridFilterChips: { filters: [{ id: "1", field: "status", label: "Durum", value: "Aktif" }, { id: "2", field: "role", label: "Rol", value: "Admin" }], onRemove: () => {}, onClearAll: () => {} },
  DataGridSelectionBar: { selectedCount: 3, onClearSelection: () => {} },
  RichTextEditor: { placeholder: "Icerik yazin...", minHeight: 200 },
  KanbanBoard: { columns: [{ id: "todo", title: "Yapilacak" }, { id: "doing", title: "Yapiliyor" }, { id: "done", title: "Tamamlandi" }], cards: [{ id: "1", columnId: "todo", title: "API entegrasyonu", priority: "high", tags: ["backend"] }, { id: "2", columnId: "doing", title: "Test yazimi", priority: "low", tags: ["qa"] }] },
  Scheduler: { events: [{ id: "1", title: "Toplanti", start: new Date(2025, 2, 21, 10, 0), end: new Date(2025, 2, 21, 11, 30), color: "#3b82f6" }], view: "day", date: new Date(2025, 2, 21) },
  FormRenderer: { schema: { id: "demo", title: "Kullanici Bilgileri", columns: 2, fields: [{ id: "name", type: "text", name: "name", label: "Ad Soyad", required: true }, { id: "email", type: "email", name: "email", label: "E-posta", required: true }], submitLabel: "Kaydet" }, onSubmit: () => {} },
};

/* ---- Page component ---- */

export default function XSuiteRuntimePreview() {
  const [params] = useSearchParams();
  const componentName = params.get("component") || "";
  const _variant = params.get("variant") || "default";

  const { Component, defaultProps } = useMemo(() => {
    const Comp = _runtimeComponents[componentName] || null;
    const dp = RUNTIME_DEFAULT_PROPS[componentName] || {};
    return { Component: Comp, defaultProps: dp };
  }, [componentName]);

  if (!componentName) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <div className="text-center">
          <Text as="div" className="text-sm font-medium text-text-primary">
            X Suite Runtime Preview
          </Text>
          <Text variant="secondary" className="mt-1 text-xs">
            Add ?component=ComponentName to the URL to preview a component.
          </Text>
          {_loadErrors.length > 0 && (
            <Text variant="secondary" className="mt-3 text-xs">
              Unavailable packages: {_loadErrors.join(", ")}
            </Text>
          )}
        </div>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <Text as="div" className="text-sm font-medium text-text-primary">
            {componentName}
          </Text>
          <Text variant="secondary" className="mt-2 text-xs leading-relaxed">
            Component &ldquo;{componentName}&rdquo; is not available in the
            runtime context. The package may not be installed or the component
            is not exported.
          </Text>
          {_loadErrors.length > 0 && (
            <Text variant="secondary" className="mt-3 text-xs">
              Failed packages: {_loadErrors.join(", ")}
            </Text>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <Component {...defaultProps} />
    </div>
  );
}
