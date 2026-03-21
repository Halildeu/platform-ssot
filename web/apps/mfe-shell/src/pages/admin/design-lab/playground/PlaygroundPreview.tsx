import React, { useMemo, useCallback, useRef } from "react";
import * as MfeUiKit from "@mfe/design-system";
import { Text } from "@mfe/design-system";

/* ---- X Suite: inline preview stubs for Design Lab ---- */
/* X packages cannot be directly imported into mfe-shell webpack due to   */
/* Module Federation + AG Charts dependency conflicts. Instead, we render  */
/* lightweight inline preview stubs that demonstrate the component's       */
/* visual structure using design-system tokens.                            */
const _xSuiteComponents: Record<string, React.ComponentType<any>> = {};

/* ---- X-Charts stubs ---- */

_xSuiteComponents.KPICard = function KPICardStub(props: any) {
  return React.createElement("div", {
    style: { border: "1px solid var(--border-subtle)", borderRadius: 16, padding: 20, background: "var(--surface-default)", minWidth: 200 }
  },
    React.createElement("div", { style: { fontSize: 10, fontWeight: 600, textTransform: "uppercase" as const, color: "var(--text-secondary)", letterSpacing: 1 } }, props.title || "METRIC"),
    React.createElement("div", { style: { fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginTop: 4 } }, props.value || "12,847"),
    props.trend && React.createElement("span", {
      style: { fontSize: 12, color: props.trend?.positive ? "var(--state-success-text)" : "var(--state-error-text)", marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4 }
    }, props.trend?.direction === "up" ? "\u25B2" : "\u25BC", " ", props.trend?.value),
    React.createElement("div", { style: { marginTop: 12, height: 24, background: "var(--surface-muted)", borderRadius: 4, overflow: "hidden" } },
      React.createElement("svg", { viewBox: "0 0 100 24", width: "100%", height: 24, preserveAspectRatio: "none" },
        React.createElement("polyline", { points: "0,20 15,14 30,16 45,8 60,12 75,6 90,10 100,4", fill: "none", stroke: "var(--action-primary, #3b82f6)", strokeWidth: 1.5 })
      )
    )
  );
};

_xSuiteComponents.SparklineChart = function SparklineChartStub(props: any) {
  const data: number[] = props.data || [10, 12, 8, 15, 13, 17, 20, 18, 22];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v: number, i: number) => `${(i / (data.length - 1)) * 100},${24 - ((v - min) / range) * 20}`).join(" ");
  return React.createElement("svg", { viewBox: "0 0 100 24", width: 120, height: 24, style: { display: "block" } },
    React.createElement("polyline", { points: pts, fill: "none", stroke: "var(--action-primary, #3b82f6)", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" })
  );
};

_xSuiteComponents.MiniChart = function MiniChartStub(props: any) {
  const data = props.data || [{ label: "A", value: 45 }, { label: "B", value: 52 }, { label: "C", value: 48 }, { label: "D", value: 60 }];
  const max = Math.max(...data.map((d: any) => d.value));
  return React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 3, height: 48, padding: "4px 0" } },
    ...data.map((d: any, i: number) =>
      React.createElement("div", { key: i, style: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 2, flex: 1 } },
        React.createElement("div", {
          style: { width: "100%", height: `${(d.value / max) * 36}px`, background: "var(--action-primary, #3b82f6)", borderRadius: 2, minHeight: 4, opacity: 0.7 + (i / data.length) * 0.3 }
        }),
        React.createElement("span", { style: { fontSize: 8, color: "var(--text-secondary)" } }, d.label)
      )
    )
  );
};

_xSuiteComponents.ChartDashboard = function ChartDashboardStub(props: any) {
  const cols = props.columns || 3;
  return React.createElement("div", {
    style: { display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }
  }, props.children || React.createElement(React.Fragment, null,
    React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)", fontSize: 13, color: "var(--text-secondary)" } }, "Chart 1"),
    React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)", fontSize: 13, color: "var(--text-secondary)" } }, "Chart 2"),
    React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)", fontSize: 13, color: "var(--text-secondary)" } }, "Chart 3")
  ));
};

_xSuiteComponents.StatWidget = function StatWidgetStub(props: any) {
  const value = props.value ?? 45230;
  const prev = props.previousValue ?? 42100;
  const pct = prev ? (((value - prev) / prev) * 100).toFixed(1) : null;
  const isUp = value >= (prev || 0);
  return React.createElement("div", {
    style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)", minWidth: 160 }
  },
    React.createElement("div", { style: { fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 4 } }, props.label || "Metric"),
    React.createElement("div", { style: { fontSize: 24, fontWeight: 700, color: "var(--text-primary)" } }, typeof value === "number" ? value.toLocaleString() : value),
    pct && React.createElement("span", { style: { fontSize: 11, color: isUp ? "var(--state-success-text)" : "var(--state-error-text)", fontWeight: 500 } }, isUp ? "\u25B2 " : "\u25BC ", pct, "%")
  );
};

_xSuiteComponents.ChartLegend = function ChartLegendStub(props: any) {
  const items = props.items || [{ label: "Series A", color: "#3b82f6" }, { label: "Series B", color: "#16a34a" }];
  const horiz = props.direction === "horizontal";
  return React.createElement("div", {
    style: { display: "flex", flexDirection: horiz ? "row" as const : "column" as const, gap: horiz ? 16 : 6, padding: 8 }
  },
    ...items.map((it: any, i: number) =>
      React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 6 } },
        React.createElement("div", { style: { width: 10, height: 10, borderRadius: "50%", background: it.color, flexShrink: 0 } }),
        React.createElement("span", { style: { fontSize: 12, color: "var(--text-primary)" } }, it.label),
        it.value && React.createElement("span", { style: { fontSize: 11, color: "var(--text-secondary)", marginLeft: 4 } }, it.value)
      )
    )
  );
};

_xSuiteComponents.ChartContainer = function ChartContainerStub(props: any) {
  return React.createElement("div", {
    style: { border: "1px solid var(--border-subtle)", borderRadius: 12, background: "var(--surface-default)", overflow: "hidden" }
  },
    (props.title || props.description) && React.createElement("div", { style: { padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" } },
      props.title && React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)" } }, props.title),
      props.description && React.createElement("div", { style: { fontSize: 12, color: "var(--text-secondary)", marginTop: 2 } }, props.description)
    ),
    React.createElement("div", { style: { padding: 16, minHeight: props.height || 120, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: 13 } },
      props.children || "Chart content area"
    )
  );
};

_xSuiteComponents.GaugeChart = function GaugeChartStub(props: any) {
  const val = props.value ?? 72;
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const pct = (val - min) / (max - min);
  const angle = -90 + pct * 180;
  return React.createElement("div", { style: { textAlign: "center" as const, padding: 8 } },
    React.createElement("svg", { viewBox: "0 0 120 70", width: 160, height: 100 },
      React.createElement("path", { d: "M 10 65 A 50 50 0 0 1 110 65", fill: "none", stroke: "var(--border-subtle)", strokeWidth: 8, strokeLinecap: "round" }),
      React.createElement("path", { d: "M 10 65 A 50 50 0 0 1 110 65", fill: "none", stroke: "var(--action-primary, #3b82f6)", strokeWidth: 8, strokeLinecap: "round", strokeDasharray: `${pct * 157} 157` }),
      React.createElement("line", {
        x1: 60, y1: 65, x2: 60 + 35 * Math.cos((angle * Math.PI) / 180), y2: 65 + 35 * Math.sin((angle * Math.PI) / 180),
        stroke: "var(--text-primary)", strokeWidth: 2, strokeLinecap: "round"
      }),
      React.createElement("circle", { cx: 60, cy: 65, r: 3, fill: "var(--text-primary)" })
    ),
    React.createElement("div", { style: { fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginTop: -4 } }, val),
    props.label && React.createElement("div", { style: { fontSize: 11, color: "var(--text-secondary)", marginTop: 2 } }, props.label)
  );
};

_xSuiteComponents.RadarChart = function RadarChartStub(props: any) {
  const data = props.data || [{ label: "A", value: 80 }, { label: "B", value: 90 }, { label: "C", value: 70 }, { label: "D", value: 85 }, { label: "E", value: 75 }];
  const n = data.length;
  const cx = 60, cy = 60, r = 45;
  const getPoint = (i: number, scale: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * scale * Math.cos(a), cy + r * scale * Math.sin(a)];
  };
  const gridPts = (scale: number) => data.map((_: any, i: number) => getPoint(i, scale).join(",")).join(" ");
  const dataPts = data.map((d: any, i: number) => getPoint(i, (d.value || 0) / 100).join(",")).join(" ");
  return React.createElement("svg", { viewBox: "0 0 120 120", width: 180, height: 180 },
    [0.25, 0.5, 0.75, 1].map((s) => React.createElement("polygon", { key: s, points: gridPts(s), fill: "none", stroke: "var(--border-subtle)", strokeWidth: 0.5 })),
    ...data.map((_: any, i: number) => {
      const [x, y] = getPoint(i, 1);
      return React.createElement("line", { key: `l${i}`, x1: cx, y1: cy, x2: x, y2: y, stroke: "var(--border-subtle)", strokeWidth: 0.5 });
    }),
    React.createElement("polygon", { points: dataPts, fill: "var(--action-primary, #3b82f6)", fillOpacity: 0.2, stroke: "var(--action-primary, #3b82f6)", strokeWidth: 1.5 }),
    ...data.map((d: any, i: number) => {
      const [x, y] = getPoint(i, 1.18);
      return React.createElement("text", { key: `t${i}`, x, y, textAnchor: "middle", dominantBaseline: "middle", fontSize: 8, fill: "var(--text-secondary)" }, d.label);
    })
  );
};

/* ---- X-Data-Grid stubs ---- */

_xSuiteComponents.DataGridFilterChips = function DataGridFilterChipsStub(props: any) {
  const filters = props.filters || [{ id: "1", label: "Status", value: "Active" }, { id: "2", label: "Role", value: "Admin" }];
  return React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "center" } },
    ...filters.map((f: any) =>
      React.createElement("span", { key: f.id, style: { display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 16, background: "var(--surface-muted)", fontSize: 12, color: "var(--text-primary)", border: "1px solid var(--border-subtle)" } },
        React.createElement("span", { style: { color: "var(--text-secondary)", fontWeight: 500 } }, f.label, ":"),
        f.value,
        React.createElement("span", { style: { marginLeft: 4, cursor: "pointer", color: "var(--text-secondary)", fontWeight: 700, lineHeight: 1 } }, "\u00D7")
      )
    ),
    filters.length > 1 && React.createElement("button", { style: { fontSize: 11, color: "var(--action-primary, #3b82f6)", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" } }, "Clear all")
  );
};

_xSuiteComponents.DataGridSelectionBar = function DataGridSelectionBarStub(props: any) {
  const count = props.selectedCount ?? 3;
  return React.createElement("div", {
    style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", borderRadius: 8, background: "var(--action-primary, #3b82f6)", color: "#fff", fontSize: 13 }
  },
    React.createElement("span", { style: { fontWeight: 600 } }, count, " item", count !== 1 ? "s" : "", " selected"),
    React.createElement("div", { style: { display: "flex", gap: 8 } },
      props.children || React.createElement(React.Fragment, null,
        React.createElement("button", { style: { padding: "4px 12px", borderRadius: 6, background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", fontSize: 12, cursor: "pointer" } }, "Delete"),
        React.createElement("button", { style: { padding: "4px 12px", borderRadius: 6, background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", fontSize: 12, cursor: "pointer" } }, "Export")
      )
    )
  );
};

/* ---- X-Editor stubs ---- */

_xSuiteComponents.RichTextEditor = function RichTextEditorStub(props: any) {
  return React.createElement("div", {
    style: { border: "1px solid var(--border-subtle)", borderRadius: 8, overflow: "hidden", background: "var(--surface-default)" }
  },
    React.createElement("div", { style: { display: "flex", gap: 2, padding: "6px 8px", borderBottom: "1px solid var(--border-subtle)", background: "var(--surface-muted)", flexWrap: "wrap" as const } },
      ...["B", "I", "U", "S", "H1", "H2", "\u2014", "\u2022", "1.", "\u201C", "</>", "\uD83D\uDD17"].map((btn) =>
        React.createElement("button", { key: btn, style: { width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderRadius: 4, background: "transparent", fontSize: btn.length > 2 ? 10 : 13, fontWeight: btn === "B" ? 700 : 400, fontStyle: btn === "I" ? "italic" : "normal", textDecoration: btn === "U" ? "underline" : btn === "S" ? "line-through" : "none", cursor: "pointer", color: "var(--text-primary)" } }, btn)
      )
    ),
    React.createElement("div", {
      style: { minHeight: props.minHeight || 160, padding: 16, color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 },
      contentEditable: false
    }, props.placeholder || "Start writing...")
  );
};

_xSuiteComponents.EditorToolbar = function EditorToolbarStub() {
  return React.createElement("div", { style: { display: "flex", gap: 2, padding: "6px 8px", borderRadius: 8, border: "1px solid var(--border-subtle)", background: "var(--surface-muted)", flexWrap: "wrap" as const } },
    ...["B", "I", "U", "S", "|", "H1", "H2", "|", "\u2022", "1.", "|", "\uD83D\uDD17", "\uD83D\uDDBC\uFE0F", "</>"].map((btn, i) =>
      btn === "|"
        ? React.createElement("div", { key: i, style: { width: 1, height: 20, background: "var(--border-subtle)", margin: "4px 4px" } })
        : React.createElement("button", { key: i, style: { width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderRadius: 4, background: "transparent", fontSize: 13, fontWeight: btn === "B" ? 700 : 400, fontStyle: btn === "I" ? "italic" : "normal", cursor: "pointer", color: "var(--text-primary)" } }, btn)
    )
  );
};

_xSuiteComponents.SlashCommandMenu = function SlashCommandMenuStub(props: any) {
  const commands = props.commands || [{ id: "h1", label: "Heading 1", category: "Basic" }, { id: "h2", label: "Heading 2", category: "Basic" }, { id: "bullet", label: "Bullet List", category: "List" }, { id: "code", label: "Code Block", category: "Advanced" }];
  const sel = props.selectedIndex ?? 0;
  return React.createElement("div", {
    style: { width: 220, border: "1px solid var(--border-subtle)", borderRadius: 8, background: "var(--surface-default)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", overflow: "hidden", fontSize: 13 }
  },
    React.createElement("div", { style: { padding: "8px 12px", fontSize: 11, color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)", fontWeight: 500 } }, "Commands"),
    ...commands.map((cmd: any, i: number) =>
      React.createElement("div", { key: cmd.id, style: { padding: "8px 12px", background: i === sel ? "var(--surface-muted)" : "transparent", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 } },
        React.createElement("span", { style: { width: 20, height: 20, borderRadius: 4, background: "var(--surface-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "var(--text-secondary)" } }, cmd.label[0]),
        cmd.label
      )
    )
  );
};

_xSuiteComponents.MentionList = function MentionListStub(props: any) {
  const items = props.items || [{ id: "1", label: "Ahmet Yilmaz" }, { id: "2", label: "Ayse Demir" }, { id: "3", label: "Mehmet Kaya" }];
  const sel = props.selectedIndex ?? 0;
  return React.createElement("div", {
    style: { width: 200, border: "1px solid var(--border-subtle)", borderRadius: 8, background: "var(--surface-default)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", overflow: "hidden" }
  },
    ...items.map((it: any, i: number) =>
      React.createElement("div", { key: it.id, style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: i === sel ? "var(--surface-muted)" : "transparent", cursor: "pointer" } },
        React.createElement("div", { style: { width: 24, height: 24, borderRadius: "50%", background: "var(--action-primary, #3b82f6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, flexShrink: 0 } }, it.label.split(" ").map((w: string) => w[0]).join("").slice(0, 2)),
        React.createElement("span", { style: { fontSize: 13, color: "var(--text-primary)" } }, it.label)
      )
    )
  );
};

_xSuiteComponents.EditorTableMenu = function EditorTableMenuStub() {
  const rows = 4, cols = 5;
  return React.createElement("div", {
    style: { width: 180, padding: 12, border: "1px solid var(--border-subtle)", borderRadius: 8, background: "var(--surface-default)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }
  },
    React.createElement("div", { style: { fontSize: 11, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 500 } }, "Insert Table"),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 3 } },
      ...Array.from({ length: rows * cols }, (_, i) =>
        React.createElement("div", { key: i, style: { width: 24, height: 20, borderRadius: 3, border: "1px solid var(--border-subtle)", background: i < 7 ? "var(--action-primary, #3b82f6)" : "var(--surface-muted)", opacity: i < 7 ? 0.3 : 1, cursor: "pointer" } })
      )
    ),
    React.createElement("div", { style: { fontSize: 11, color: "var(--text-secondary)", marginTop: 6, textAlign: "center" as const } }, "3 \u00D7 2")
  );
};

_xSuiteComponents.EditorLinkDialog = function EditorLinkDialogStub(props: any) {
  return React.createElement("div", {
    style: { width: 320, padding: 20, border: "1px solid var(--border-subtle)", borderRadius: 12, background: "var(--surface-default)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }
  },
    React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 } }, "Insert Link"),
    React.createElement("div", { style: { marginBottom: 12 } },
      React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 4 } }, "URL"),
      React.createElement("div", { style: { padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-subtle)", background: "var(--surface-muted)", fontSize: 13, color: "var(--text-primary)" } }, props.initialUrl || "https://")
    ),
    React.createElement("div", { style: { marginBottom: 16 } },
      React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 4 } }, "Display Text"),
      React.createElement("div", { style: { padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-subtle)", background: "var(--surface-muted)", fontSize: 13, color: "var(--text-primary)" } }, props.initialText || "Link text")
    ),
    React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" } },
      React.createElement("button", { style: { padding: "6px 16px", borderRadius: 6, border: "1px solid var(--border-subtle)", background: "transparent", fontSize: 13, cursor: "pointer", color: "var(--text-primary)" } }, "Cancel"),
      React.createElement("button", { style: { padding: "6px 16px", borderRadius: 6, border: "none", background: "var(--action-primary, #3b82f6)", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 500 } }, "Insert")
    )
  );
};

_xSuiteComponents.EditorImageUpload = function EditorImageUploadStub() {
  return React.createElement("div", {
    style: { width: 320, padding: 20, border: "1px solid var(--border-subtle)", borderRadius: 12, background: "var(--surface-default)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }
  },
    React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 } }, "Upload Image"),
    React.createElement("div", {
      style: { border: "2px dashed var(--border-subtle)", borderRadius: 8, padding: 32, textAlign: "center" as const, background: "var(--surface-muted)" }
    },
      React.createElement("div", { style: { fontSize: 28, marginBottom: 8 } }, "\uD83D\uDDBC\uFE0F"),
      React.createElement("div", { style: { fontSize: 13, color: "var(--text-primary)", fontWeight: 500 } }, "Drop image here"),
      React.createElement("div", { style: { fontSize: 12, color: "var(--text-secondary)", marginTop: 4 } }, "or click to browse")
    ),
    React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 } },
      React.createElement("button", { style: { padding: "6px 16px", borderRadius: 6, border: "1px solid var(--border-subtle)", background: "transparent", fontSize: 13, cursor: "pointer", color: "var(--text-primary)" } }, "Cancel"),
      React.createElement("button", { style: { padding: "6px 16px", borderRadius: 6, border: "none", background: "var(--action-primary, #3b82f6)", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 500, opacity: 0.5 } }, "Insert")
    )
  );
};

/* ---- X-FormBuilder stubs ---- */

_xSuiteComponents.FormRenderer = function FormRendererStub(props: any) {
  const schema = props.schema || { title: "Form", columns: 2, fields: [{ id: "1", label: "Name", type: "text" }, { id: "2", label: "Email", type: "email" }, { id: "3", label: "Role", type: "select" }] };
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 20, background: "var(--surface-default)" } },
    schema.title && React.createElement("div", { style: { fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 } }, schema.title),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: `repeat(${schema.columns || 2}, 1fr)`, gap: 16 } },
      ...(schema.fields || []).map((f: any) =>
        React.createElement("div", { key: f.id, style: { gridColumn: f.span ? `span ${f.span}` : undefined } },
          React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 4 } }, f.label, f.required && React.createElement("span", { style: { color: "var(--state-error-text)" } }, " *")),
          React.createElement("div", { style: { height: 36, borderRadius: 6, border: "1px solid var(--border-subtle)", background: "var(--surface-muted)" } })
        )
      )
    ),
    React.createElement("div", { style: { marginTop: 20, display: "flex", justifyContent: "flex-end" } },
      React.createElement("button", { style: { padding: "8px 20px", borderRadius: 6, border: "none", background: "var(--action-primary, #3b82f6)", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" } }, schema.submitLabel || "Submit")
    )
  );
};

_xSuiteComponents.FieldRenderer = function FieldRendererStub(props: any) {
  const field = props.field || { label: "Field Label", type: "text", placeholder: "Enter value..." };
  return React.createElement("div", { style: { minWidth: 200 } },
    React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 4 } }, field.label, field.required && React.createElement("span", { style: { color: "var(--state-error-text)" } }, " *")),
    React.createElement("div", { style: { height: 36, borderRadius: 6, border: "1px solid var(--border-subtle)", background: "var(--surface-muted)", padding: "0 12px", display: "flex", alignItems: "center", fontSize: 13, color: "var(--text-secondary)" } }, field.placeholder || "")
  );
};

_xSuiteComponents.FormPreview = function FormPreviewStub(props: any) {
  const schema = props.schema || { title: "Form Preview", fields: [{ id: "1", label: "Name", type: "text" }] };
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 20, background: "var(--surface-muted)" } },
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 } },
      React.createElement("div", { style: { fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, color: "var(--text-secondary)", letterSpacing: 1 } }, "PREVIEW"),
      React.createElement("div", { style: { flex: 1, height: 1, background: "var(--border-subtle)" } })
    ),
    schema.title && React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 } }, schema.title),
    ...(schema.fields || []).map((f: any) =>
      React.createElement("div", { key: f.id, style: { marginBottom: 8 } },
        React.createElement("div", { style: { fontSize: 12, color: "var(--text-secondary)" } }, f.label),
        React.createElement("div", { style: { height: 32, borderRadius: 6, border: "1px dashed var(--border-subtle)", background: "var(--surface-default)", marginTop: 2 } })
      )
    )
  );
};

_xSuiteComponents.FormSummary = function FormSummaryStub(props: any) {
  const schema = props.schema || { fields: [{ id: "1", label: "Name", name: "name" }, { id: "2", label: "Email", name: "email" }] };
  const values = props.values || { name: "Ahmet Yilmaz", email: "ahmet@ornek.com" };
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    ...(schema.fields || []).map((f: any) =>
      React.createElement("div", { key: f.id, style: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" } },
        React.createElement("span", { style: { fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 } }, f.label),
        React.createElement("span", { style: { fontSize: 13, color: "var(--text-primary)", fontWeight: 500 } }, values[f.name] || "\u2014")
      )
    )
  );
};

/* ---- X-Kanban stubs ---- */

_xSuiteComponents.KanbanBoard = function KanbanBoardStub(props: any) {
  const columns = props.columns || [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress" }, { id: "done", title: "Done" }];
  const cards = props.cards || [{ id: "1", columnId: "todo", title: "Task 1", priority: "high" }, { id: "2", columnId: "todo", title: "Task 2", priority: "medium" }, { id: "3", columnId: "doing", title: "Task 3", priority: "low" }];
  const priorityColors: Record<string, string> = { high: "var(--state-error-text)", medium: "var(--state-warning-text)", low: "var(--state-success-text)" };
  return React.createElement("div", { style: { display: "flex", gap: 12, overflowX: "auto" as const, padding: 4 } },
    ...columns.map((col: any) => {
      const colCards = cards.filter((c: any) => c.columnId === col.id);
      return React.createElement("div", { key: col.id, style: { minWidth: 220, flex: 1, background: "var(--surface-muted)", borderRadius: 12, padding: 12 } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
          React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: "var(--text-primary)" } }, col.title),
          React.createElement("span", { style: { fontSize: 11, color: "var(--text-secondary)", background: "var(--surface-default)", borderRadius: 10, padding: "2px 8px" } }, colCards.length)
        ),
        React.createElement("div", { style: { display: "flex", flexDirection: "column" as const, gap: 8 } },
          ...colCards.map((card: any) =>
            React.createElement("div", { key: card.id, style: { padding: 12, borderRadius: 8, background: "var(--surface-default)", border: "1px solid var(--border-subtle)", cursor: "grab" } },
              React.createElement("div", { style: { fontSize: 13, fontWeight: 500, color: "var(--text-primary)", marginBottom: 6 } }, card.title),
              React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" as const } },
                card.priority && React.createElement("span", { style: { fontSize: 10, padding: "2px 6px", borderRadius: 4, background: priorityColors[card.priority] || "var(--surface-muted)", color: "#fff", fontWeight: 600, textTransform: "uppercase" as const } }, card.priority),
                ...(card.tags || []).map((t: string) =>
                  React.createElement("span", { key: t, style: { fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "var(--surface-muted)", color: "var(--text-secondary)" } }, t)
                )
              )
            )
          )
        )
      );
    })
  );
};

_xSuiteComponents.KanbanColumn = function KanbanColumnStub(props: any) {
  const col = props.column || { title: "Column" };
  const cards = props.cards || [{ id: "1", title: "Task 1", priority: "high" }, { id: "2", title: "Task 2", priority: "medium" }];
  return React.createElement("div", { style: { minWidth: 240, background: "var(--surface-muted)", borderRadius: 12, padding: 12 } },
    React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12, display: "flex", justifyContent: "space-between" } },
      React.createElement("span", null, col.title),
      React.createElement("span", { style: { fontSize: 11, color: "var(--text-secondary)" } }, cards.length)
    ),
    React.createElement("div", { style: { display: "flex", flexDirection: "column" as const, gap: 8 } },
      ...cards.map((card: any) =>
        React.createElement("div", { key: card.id, style: { padding: 12, borderRadius: 8, background: "var(--surface-default)", border: "1px solid var(--border-subtle)" } },
          React.createElement("div", { style: { fontSize: 13, fontWeight: 500, color: "var(--text-primary)" } }, card.title)
        )
      )
    )
  );
};

_xSuiteComponents.KanbanCard = function KanbanCardStub(props: any) {
  const card = props.card || { title: "Task Title", priority: "high", tags: ["bug", "urgent"], assignee: "AY" };
  const priorityColors: Record<string, string> = { high: "var(--state-error-text)", medium: "var(--state-warning-text)", low: "var(--state-success-text)" };
  return React.createElement("div", { style: { padding: 14, borderRadius: 10, background: "var(--surface-default)", border: "1px solid var(--border-subtle)", minWidth: 200, cursor: "grab" } },
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
      React.createElement("div", { style: { fontSize: 14, fontWeight: 500, color: "var(--text-primary)", flex: 1 } }, card.title),
      card.assignee && React.createElement("div", { style: { width: 24, height: 24, borderRadius: "50%", background: "var(--action-primary, #3b82f6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, flexShrink: 0, marginLeft: 8 } }, card.assignee)
    ),
    card.description && React.createElement("div", { style: { fontSize: 12, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.4 } }, card.description),
    React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" as const, marginTop: 8 } },
      card.priority && React.createElement("span", { style: { fontSize: 10, padding: "2px 6px", borderRadius: 4, background: priorityColors[card.priority] || "var(--surface-muted)", color: "#fff", fontWeight: 600, textTransform: "uppercase" as const } }, card.priority),
      ...(card.tags || []).map((t: string) =>
        React.createElement("span", { key: t, style: { fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "var(--surface-muted)", color: "var(--text-secondary)" } }, t)
      )
    )
  );
};

_xSuiteComponents.KanbanToolbar = function KanbanToolbarStub(props: any) {
  return React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "8px 0" } },
    React.createElement("div", { style: { flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border-subtle)", background: "var(--surface-default)" } },
      React.createElement("span", { style: { color: "var(--text-secondary)", fontSize: 14 } }, "\uD83D\uDD0D"),
      React.createElement("span", { style: { fontSize: 13, color: "var(--text-secondary)" } }, props.searchValue || "Search cards...")
    ),
    React.createElement("button", { style: { padding: "6px 16px", borderRadius: 8, border: "none", background: "var(--action-primary, #3b82f6)", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 } }, "+ Add Column")
  );
};

_xSuiteComponents.KanbanMetrics = function KanbanMetricsStub(props: any) {
  const columns = props.columns || [{ id: "todo", title: "To Do", policy: { wipLimit: 5 } }, { id: "doing", title: "In Progress", policy: { wipLimit: 3 } }, { id: "done", title: "Done" }];
  const cards = props.cards || [{ columnId: "todo" }, { columnId: "todo" }, { columnId: "doing" }];
  return React.createElement("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" as const } },
    ...columns.map((col: any) => {
      const count = cards.filter((c: any) => c.columnId === col.id).length;
      const limit = col.policy?.wipLimit;
      const pct = limit ? Math.min((count / limit) * 100, 100) : 0;
      return React.createElement("div", { key: col.id, style: { flex: 1, minWidth: 120, padding: 12, borderRadius: 8, border: "1px solid var(--border-subtle)", background: "var(--surface-default)" } },
        React.createElement("div", { style: { fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 4 } }, col.title),
        React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 4 } },
          React.createElement("span", { style: { fontSize: 20, fontWeight: 700, color: "var(--text-primary)" } }, count),
          limit && React.createElement("span", { style: { fontSize: 11, color: "var(--text-secondary)" } }, "/ ", limit)
        ),
        limit && React.createElement("div", { style: { height: 4, borderRadius: 2, background: "var(--surface-muted)", marginTop: 6, overflow: "hidden" } },
          React.createElement("div", { style: { height: "100%", width: `${pct}%`, borderRadius: 2, background: pct >= 100 ? "var(--state-error-text)" : pct >= 75 ? "var(--state-warning-text)" : "var(--action-primary, #3b82f6)", transition: "width 0.3s" } })
        )
      );
    })
  );
};

/* ---- X-Scheduler stubs ---- */

_xSuiteComponents.Scheduler = function SchedulerStub(props: any) {
  const events = props.events || [{ id: "1", title: "Meeting", start: new Date(), end: new Date(), color: "#3b82f6" }];
  const hours = Array.from({ length: 10 }, (_, i) => i + 8);
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 8, overflow: "hidden", background: "var(--surface-default)" } },
    ...hours.map((h) =>
      React.createElement("div", { key: h, style: { display: "flex", borderBottom: "1px solid var(--border-subtle)", minHeight: 40 } },
        React.createElement("div", { style: { width: 56, padding: "4px 8px", fontSize: 11, color: "var(--text-secondary)", borderRight: "1px solid var(--border-subtle)", textAlign: "right" as const, flexShrink: 0 } }, `${h}:00`),
        React.createElement("div", { style: { flex: 1, position: "relative" as const, minHeight: 40 } },
          ...events.filter((e: any) => {
            const eH = e.start instanceof Date ? e.start.getHours() : h;
            return eH === h;
          }).map((e: any) =>
            React.createElement("div", { key: e.id, style: { position: "absolute" as const, left: 4, right: 4, top: 2, padding: "4px 8px", borderRadius: 4, background: e.color || "#3b82f6", color: "#fff", fontSize: 11, fontWeight: 500 } }, e.title)
          )
        )
      )
    )
  );
};

_xSuiteComponents.SchedulerToolbar = function SchedulerToolbarStub(props: any) {
  const views = ["Day", "Week", "Month"];
  const active = props.view || "week";
  return React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" } },
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
      React.createElement("button", { style: { width: 28, height: 28, borderRadius: 6, border: "1px solid var(--border-subtle)", background: "var(--surface-default)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" } }, "\u2039"),
      React.createElement("span", { style: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)", minWidth: 140, textAlign: "center" as const } }, "March 2025"),
      React.createElement("button", { style: { width: 28, height: 28, borderRadius: 6, border: "1px solid var(--border-subtle)", background: "var(--surface-default)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" } }, "\u203A"),
      React.createElement("button", { style: { padding: "4px 12px", borderRadius: 6, border: "1px solid var(--border-subtle)", background: "var(--surface-default)", cursor: "pointer", fontSize: 12, color: "var(--text-primary)" } }, "Today")
    ),
    React.createElement("div", { style: { display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-subtle)" } },
      ...views.map((v) =>
        React.createElement("button", { key: v, style: { padding: "6px 14px", border: "none", background: v.toLowerCase() === active ? "var(--action-primary, #3b82f6)" : "var(--surface-default)", color: v.toLowerCase() === active ? "#fff" : "var(--text-primary)", fontSize: 12, fontWeight: 500, cursor: "pointer", borderRight: "1px solid var(--border-subtle)" } }, v)
      )
    )
  );
};

_xSuiteComponents.AgendaView = function AgendaViewStub(props: any) {
  const events = props.events || [{ id: "1", title: "Morning Meeting", start: new Date(2025, 2, 21, 9, 0), end: new Date(2025, 2, 21, 10, 0), color: "#3b82f6" }, { id: "2", title: "Sprint Planning", start: new Date(2025, 2, 21, 14, 0), end: new Date(2025, 2, 21, 15, 30), color: "#8b5cf6" }];
  const formatTime = (d: Date) => d instanceof Date ? `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}` : "";
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, overflow: "hidden", background: "var(--surface-default)" } },
    React.createElement("div", { style: { padding: "10px 16px", background: "var(--surface-muted)", borderBottom: "1px solid var(--border-subtle)", fontSize: 13, fontWeight: 600, color: "var(--text-primary)" } }, "Today"),
    ...events.map((e: any) =>
      React.createElement("div", { key: e.id, style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid var(--border-subtle)" } },
        React.createElement("div", { style: { width: 4, height: 32, borderRadius: 2, background: e.color || "#3b82f6", flexShrink: 0 } }),
        React.createElement("div", { style: { flex: 1 } },
          React.createElement("div", { style: { fontSize: 13, fontWeight: 500, color: "var(--text-primary)" } }, e.title),
          React.createElement("div", { style: { fontSize: 11, color: "var(--text-secondary)", marginTop: 2 } }, formatTime(e.start), " \u2013 ", formatTime(e.end))
        )
      )
    )
  );
};

_xSuiteComponents.EventForm = function EventFormStub() {
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 20, background: "var(--surface-default)", maxWidth: 360 } },
    React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 } }, "New Event"),
    ...["Title", "Date", "Start Time", "End Time"].map((label) =>
      React.createElement("div", { key: label, style: { marginBottom: 12 } },
        React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 4 } }, label),
        React.createElement("div", { style: { height: 36, borderRadius: 6, border: "1px solid var(--border-subtle)", background: "var(--surface-muted)" } })
      )
    ),
    React.createElement("div", { style: { marginBottom: 16 } },
      React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 6 } }, "Color"),
      React.createElement("div", { style: { display: "flex", gap: 6 } },
        ...["#3b82f6", "#16a34a", "#8b5cf6", "#d97706", "#dc2626"].map((c) =>
          React.createElement("div", { key: c, style: { width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer", border: c === "#3b82f6" ? "2px solid var(--text-primary)" : "2px solid transparent" } })
        )
      )
    ),
    React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" } },
      React.createElement("button", { style: { padding: "6px 16px", borderRadius: 6, border: "1px solid var(--border-subtle)", background: "transparent", fontSize: 13, cursor: "pointer", color: "var(--text-primary)" } }, "Cancel"),
      React.createElement("button", { style: { padding: "6px 16px", borderRadius: 6, border: "none", background: "var(--action-primary, #3b82f6)", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 500 } }, "Save")
    )
  );
};

_xSuiteComponents.EditableGrid = function EditableGridStub() {
  const cols = ["Name", "Qty", "Price"];
  const rows = [["Widget A", "12", "$4.50"], ["Widget B", "8", "$7.20"], ["Widget C", "25", "$3.10"]];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, overflow: "hidden", background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, padding: "12px 16px", color: "var(--text-primary)", borderBottom: "1px solid var(--border-subtle)" } }, "EditableGrid"),
    React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" as const, fontSize: 12 } },
      React.createElement("thead", null,
        React.createElement("tr", null,
          ...cols.map((c) => React.createElement("th", { key: c, style: { textAlign: "left" as const, padding: "8px 12px", fontWeight: 600, color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)", background: "var(--surface-muted)" } }, c))
        )
      ),
      React.createElement("tbody", null,
        ...rows.map((r, ri) =>
          React.createElement("tr", { key: ri },
            ...r.map((cell, ci) =>
              React.createElement("td", { key: ci, style: { padding: "6px 12px", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-primary)", position: "relative" as const } },
                cell,
                ci > 0 ? React.createElement("span", { style: { position: "absolute" as const, top: 4, right: 6, fontSize: 9, color: "var(--action-primary, #3b82f6)", opacity: 0.7 } }, "\u270E") : null
              )
            )
          )
        )
      )
    )
  );
};

_xSuiteComponents.EditorMenuBubble = function EditorMenuBubbleStub() {
  const buttons = [
    { label: "B", style: { fontWeight: 800 } },
    { label: "I", style: { fontStyle: "italic" as const } },
    { label: "U", style: { textDecoration: "underline" } },
    { label: "S", style: { textDecoration: "line-through" } },
    { label: "\uD83D\uDD17", style: {} },
  ];
  return React.createElement("div", { style: { padding: 24, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 12, background: "var(--surface-default)", border: "1px solid var(--border-subtle)", borderRadius: 12 } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 } }, "EditorMenuBubble"),
    React.createElement("div", { style: { display: "inline-flex", gap: 2, background: "var(--surface-elevated, #1e293b)", borderRadius: 8, padding: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" } },
      ...buttons.map((b) =>
        React.createElement("button", { key: b.label, style: { ...b.style, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "transparent", color: "var(--text-primary)", borderRadius: 4, cursor: "pointer", fontSize: 14 } }, b.label)
      )
    ),
    React.createElement("div", { style: { fontSize: 11, color: "var(--text-secondary)" } }, "Floating toolbar for text selection")
  );
};

_xSuiteComponents.FieldRegistry = function FieldRegistryStub() {
  const fields = [
    { type: "Text", icon: "Aa" },
    { type: "Number", icon: "#" },
    { type: "Date", icon: "\uD83D\uDCC5" },
    { type: "Select", icon: "\u25BC" },
    { type: "Toggle", icon: "\u25CB" },
    { type: "File", icon: "\uD83D\uDCCE" },
  ];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 } }, "FieldRegistry"),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 } },
      ...fields.map((f) =>
        React.createElement("div", { key: f.type, style: { display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border-subtle)", background: "var(--surface-muted)", fontSize: 12, color: "var(--text-primary)" } },
          React.createElement("span", { style: { width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, background: "var(--action-primary, #3b82f6)", color: "#fff", fontSize: 11, fontWeight: 600, flexShrink: 0 } }, f.icon),
          f.type
        )
      )
    )
  );
};

_xSuiteComponents.HeatmapChart = function HeatmapChartStub() {
  const grid = [
    [0.2, 0.5, 0.8, 1.0],
    [0.1, 0.4, 0.6, 0.7],
    [0.3, 0.9, 0.5, 0.3],
    [0.7, 0.6, 0.2, 0.4],
  ];
  const colLabels = ["Q1", "Q2", "Q3", "Q4"];
  const rowLabels = ["A", "B", "C", "D"];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 } }, "HeatmapChart"),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "24px repeat(4, 1fr)", gap: 3 } },
      React.createElement("div", null),
      ...colLabels.map((l) => React.createElement("div", { key: l, style: { textAlign: "center" as const, fontSize: 10, color: "var(--text-secondary)", fontWeight: 500 } }, l)),
      ...grid.flatMap((row, ri) => [
        React.createElement("div", { key: `rl-${ri}`, style: { fontSize: 10, color: "var(--text-secondary)", display: "flex", alignItems: "center", fontWeight: 500 } }, rowLabels[ri]),
        ...row.map((v, ci) =>
          React.createElement("div", { key: `${ri}-${ci}`, style: { height: 32, borderRadius: 4, background: `rgba(59,130,246,${v})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: v > 0.6 ? "#fff" : "var(--text-secondary)" } }, (v * 100).toFixed(0))
        ),
      ])
    )
  );
};

_xSuiteComponents.KanbanCardDetail = function KanbanCardDetailStub() {
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 20, background: "var(--surface-default)", maxWidth: 360 } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 } }, "KanbanCardDetail"),
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
      React.createElement("span", { style: { fontSize: 16, fontWeight: 600, color: "var(--text-primary)" } }, "Implement Auth Flow"),
      React.createElement("span", { style: { fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "var(--action-primary, #3b82f6)", color: "#fff", fontWeight: 500 } }, "In Progress")
    ),
    React.createElement("p", { style: { fontSize: 12, color: "var(--text-secondary)", margin: "0 0 12px", lineHeight: 1.5 } }, "Add OAuth2 PKCE flow with Keycloak integration and token refresh handling."),
    React.createElement("div", { style: { display: "flex", gap: 12, fontSize: 11, color: "var(--text-secondary)", borderTop: "1px solid var(--border-subtle)", paddingTop: 12 } },
      React.createElement("span", null, "\uD83D\uDC64 Halil K."),
      React.createElement("span", null, "\uD83D\uDCC5 Mar 22"),
      React.createElement("span", null, "\u23F1 3d remaining")
    )
  );
};

_xSuiteComponents.KanbanSwimlane = function KanbanSwimlanStub() {
  const lanes = [
    { name: "Frontend", cards: ["Login UI", "Dashboard"] },
    { name: "Backend", cards: ["Auth API", "Events API", "Cache Layer"] },
  ];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 } }, "KanbanSwimlane"),
    ...lanes.map((lane) =>
      React.createElement("div", { key: lane.name, style: { marginBottom: 12 } },
        React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 6 } }, lane.name),
        React.createElement("div", { style: { display: "flex", gap: 8, overflowX: "auto" as const, paddingBottom: 4 } },
          ...lane.cards.map((c) =>
            React.createElement("div", { key: c, style: { minWidth: 100, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border-subtle)", background: "var(--surface-muted)", fontSize: 12, color: "var(--text-primary)", whiteSpace: "nowrap" as const } }, c)
          )
        )
      )
    )
  );
};

_xSuiteComponents.MasterDetailGrid = function MasterDetailGridStub() {
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, overflow: "hidden", background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, padding: "12px 16px", color: "var(--text-primary)", borderBottom: "1px solid var(--border-subtle)" } }, "MasterDetailGrid"),
    React.createElement("div", { style: { padding: "8px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", gap: 12, fontSize: 12, color: "var(--text-primary)", background: "var(--surface-muted)" } },
      React.createElement("span", { style: { width: 20 } }),
      React.createElement("span", { style: { flex: 1, fontWeight: 600 } }, "Order"),
      React.createElement("span", { style: { flex: 1, fontWeight: 600 } }, "Customer"),
      React.createElement("span", { style: { flex: 1, fontWeight: 600 } }, "Total")
    ),
    React.createElement("div", { style: { padding: "8px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", gap: 12, fontSize: 12, color: "var(--text-primary)" } },
      React.createElement("span", { style: { width: 20, color: "var(--action-primary, #3b82f6)", cursor: "pointer" } }, "\u25BC"),
      React.createElement("span", { style: { flex: 1 } }, "#1024"),
      React.createElement("span", { style: { flex: 1 } }, "Acme Inc."),
      React.createElement("span", { style: { flex: 1 } }, "$1,250")
    ),
    React.createElement("div", { style: { padding: "12px 16px 12px 48px", background: "var(--surface-muted)", borderBottom: "1px solid var(--border-subtle)", fontSize: 11 } },
      React.createElement("div", { style: { fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 } }, "Order Details"),
      ...["Widget A \u00D7 5 — $500", "Widget B \u00D7 3 — $750"].map((item) =>
        React.createElement("div", { key: item, style: { color: "var(--text-primary)", padding: "2px 0" } }, item)
      )
    ),
    React.createElement("div", { style: { padding: "8px 16px", display: "flex", gap: 12, fontSize: 12, color: "var(--text-primary)" } },
      React.createElement("span", { style: { width: 20, color: "var(--text-secondary)", cursor: "pointer" } }, "\u25B6"),
      React.createElement("span", { style: { flex: 1 } }, "#1025"),
      React.createElement("span", { style: { flex: 1 } }, "TechCo"),
      React.createElement("span", { style: { flex: 1 } }, "$840")
    )
  );
};

_xSuiteComponents.MultiStepForm = function MultiStepFormStub() {
  const steps = ["Details", "Config", "Review"];
  const active = 1;
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 20, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 16 } }, "MultiStepForm"),
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 0, marginBottom: 20 } },
      ...steps.flatMap((s, i) => {
        const done = i < active;
        const current = i === active;
        const items = [
          React.createElement("div", { key: `step-${i}`, style: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 4, flex: "0 0 auto" } },
            React.createElement("div", { style: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, background: done ? "var(--state-success-text, #16a34a)" : current ? "var(--action-primary, #3b82f6)" : "var(--surface-muted)", color: done || current ? "#fff" : "var(--text-secondary)", border: current ? "2px solid var(--action-primary, #3b82f6)" : "none" } }, done ? "\u2713" : String(i + 1)),
            React.createElement("span", { style: { fontSize: 10, color: current ? "var(--action-primary, #3b82f6)" : "var(--text-secondary)", fontWeight: current ? 600 : 400 } }, s)
          ),
        ];
        if (i < steps.length - 1) {
          items.push(React.createElement("div", { key: `line-${i}`, style: { flex: 1, height: 2, background: done ? "var(--state-success-text, #16a34a)" : "var(--border-subtle)", margin: "0 8px", marginBottom: 16 } }));
        }
        return items;
      })
    ),
    React.createElement("div", { style: { padding: 16, borderRadius: 8, border: "1px dashed var(--border-subtle)", background: "var(--surface-muted)", fontSize: 12, color: "var(--text-secondary)", textAlign: "center" as const } }, "Step 2: Configuration")
  );
};

_xSuiteComponents.PivotGrid = function PivotGridStub() {
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, overflow: "hidden", background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, padding: "12px 16px", color: "var(--text-primary)", borderBottom: "1px solid var(--border-subtle)" } }, "PivotGrid"),
    React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" as const, fontSize: 11 } },
      React.createElement("thead", null,
        React.createElement("tr", null,
          React.createElement("th", { style: { padding: "6px 10px", background: "var(--surface-muted)", borderBottom: "1px solid var(--border-subtle)", borderRight: "1px solid var(--border-subtle)", textAlign: "left" as const, color: "var(--text-secondary)" } }),
          ...["Q1", "Q2", "Q3", "Total"].map((h) =>
            React.createElement("th", { key: h, style: { padding: "6px 10px", background: "var(--surface-muted)", borderBottom: "1px solid var(--border-subtle)", textAlign: "right" as const, fontWeight: 600, color: h === "Total" ? "var(--text-primary)" : "var(--text-secondary)" } }, h)
          )
        )
      ),
      React.createElement("tbody", null,
        ...[["Electronics", "42K", "51K", "38K", "131K"], ["Apparel", "28K", "33K", "30K", "91K"], ["Total", "70K", "84K", "68K", "222K"]].map((row, ri) =>
          React.createElement("tr", { key: ri, style: ri === 2 ? { fontWeight: 700 } : undefined },
            ...row.map((cell, ci) =>
              React.createElement("td", { key: ci, style: { padding: "6px 10px", borderBottom: "1px solid var(--border-subtle)", borderRight: ci === 0 ? "1px solid var(--border-subtle)" : undefined, textAlign: ci === 0 ? "left" as const : "right" as const, color: "var(--text-primary)", background: ri === 2 ? "var(--surface-muted)" : undefined } }, cell)
            )
          )
        )
      )
    )
  );
};

_xSuiteComponents.RepeatableFieldGroup = function RepeatableFieldGroupStub() {
  const rows = ["Line Item 1", "Line Item 2"];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 } }, "RepeatableFieldGroup"),
    ...rows.map((r, i) =>
      React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } },
        React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: "var(--text-secondary)", width: 20 } }, `${i + 1}.`),
        React.createElement("div", { style: { flex: 1, height: 32, borderRadius: 6, border: "1px solid var(--border-subtle)", background: "var(--surface-muted)", display: "flex", alignItems: "center", paddingLeft: 10, fontSize: 12, color: "var(--text-primary)" } }, r),
        React.createElement("div", { style: { flex: 1, height: 32, borderRadius: 6, border: "1px solid var(--border-subtle)", background: "var(--surface-muted)" } }),
        React.createElement("button", { style: { width: 28, height: 28, borderRadius: 6, border: "1px solid var(--border-subtle)", background: "transparent", color: "var(--state-error-text, #dc2626)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" } }, "\u00D7")
      )
    ),
    React.createElement("button", { style: { display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: "1px dashed var(--action-primary, #3b82f6)", background: "transparent", color: "var(--action-primary, #3b82f6)", cursor: "pointer", fontSize: 12, fontWeight: 500, marginTop: 4 } }, "+ Add Item")
  );
};

_xSuiteComponents.ResourceView = function ResourceViewStub() {
  const resources = [
    { name: "Room A", blocks: [{ left: 10, width: 30, color: "var(--action-primary, #3b82f6)" }] },
    { name: "Room B", blocks: [{ left: 25, width: 20, color: "#8b5cf6" }, { left: 60, width: 25, color: "#16a34a" }] },
    { name: "Room C", blocks: [{ left: 5, width: 40, color: "#d97706" }] },
  ];
  const hours = ["8am", "10am", "12pm", "2pm", "4pm"];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 } }, "ResourceView"),
    React.createElement("div", { style: { display: "flex", fontSize: 9, color: "var(--text-secondary)", marginLeft: 64, marginBottom: 4 } },
      ...hours.map((h) => React.createElement("span", { key: h, style: { flex: 1 } }, h))
    ),
    ...resources.map((r) =>
      React.createElement("div", { key: r.name, style: { display: "flex", alignItems: "center", marginBottom: 6 } },
        React.createElement("span", { style: { width: 60, fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", flexShrink: 0 } }, r.name),
        React.createElement("div", { style: { flex: 1, height: 24, background: "var(--surface-muted)", borderRadius: 4, position: "relative" as const } },
          ...r.blocks.map((b, bi) =>
            React.createElement("div", { key: bi, style: { position: "absolute" as const, left: `${b.left}%`, width: `${b.width}%`, height: "100%", borderRadius: 3, background: b.color, opacity: 0.8 } })
          )
        )
      )
    )
  );
};

_xSuiteComponents.RowGroupingGrid = function RowGroupingGridStub() {
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, overflow: "hidden", background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, padding: "12px 16px", color: "var(--text-primary)", borderBottom: "1px solid var(--border-subtle)" } }, "RowGroupingGrid"),
    React.createElement("div", { style: { padding: "8px 16px", background: "var(--surface-muted)", borderBottom: "1px solid var(--border-subtle)", display: "flex", gap: 8, alignItems: "center", fontSize: 12, fontWeight: 600, color: "var(--text-primary)" } },
      React.createElement("span", { style: { color: "var(--action-primary, #3b82f6)" } }, "\u25BC"),
      "Electronics (3)"
    ),
    ...["Laptop", "Monitor", "Keyboard"].map((item, i) =>
      React.createElement("div", { key: item, style: { padding: "6px 16px 6px 40px", borderBottom: "1px solid var(--border-subtle)", fontSize: 12, color: "var(--text-primary)", display: "flex", justifyContent: "space-between" } },
        React.createElement("span", null, item),
        React.createElement("span", { style: { color: "var(--text-secondary)" } }, ["$999", "$450", "$75"][i])
      )
    ),
    React.createElement("div", { style: { padding: "8px 16px", background: "var(--surface-muted)", display: "flex", gap: 8, alignItems: "center", fontSize: 12, fontWeight: 600, color: "var(--text-primary)" } },
      React.createElement("span", { style: { color: "var(--text-secondary)" } }, "\u25B6"),
      "Apparel (2)"
    )
  );
};

_xSuiteComponents.ScatterChart = function ScatterChartStub() {
  const points = [
    { x: 15, y: 70 }, { x: 30, y: 45 }, { x: 45, y: 80 }, { x: 55, y: 30 },
    { x: 20, y: 50 }, { x: 70, y: 60 }, { x: 80, y: 25 }, { x: 40, y: 65 },
    { x: 60, y: 75 }, { x: 85, y: 40 }, { x: 25, y: 35 }, { x: 90, y: 55 },
  ];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 } }, "ScatterChart"),
    React.createElement("svg", { viewBox: "0 0 100 100", width: "100%", height: 140, style: { display: "block" } },
      React.createElement("line", { x1: 10, y1: 5, x2: 10, y2: 90, stroke: "var(--border-subtle)", strokeWidth: 0.5 }),
      React.createElement("line", { x1: 10, y1: 90, x2: 95, y2: 90, stroke: "var(--border-subtle)", strokeWidth: 0.5 }),
      ...points.map((p, i) =>
        React.createElement("circle", { key: i, cx: p.x, cy: 90 - p.y * 0.85, r: 2.5, fill: "var(--action-primary, #3b82f6)", opacity: 0.7 })
      )
    )
  );
};

_xSuiteComponents.SchedulerEvent = function SchedulerEventStub() {
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 20, background: "var(--surface-default)", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 12 } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)" } }, "SchedulerEvent"),
    React.createElement("div", { style: { width: "100%", maxWidth: 240, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-subtle)" } },
      React.createElement("div", { style: { height: 4, background: "var(--action-primary, #3b82f6)" } }),
      React.createElement("div", { style: { padding: "10px 12px", background: "rgba(59,130,246,0.08)" } },
        React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 } }, "Team Standup"),
        React.createElement("div", { style: { fontSize: 11, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 } },
          React.createElement("span", null, "09:00 \u2013 09:30"),
          React.createElement("span", { style: { width: 4, height: 4, borderRadius: "50%", background: "var(--text-secondary)" } }),
          React.createElement("span", null, "Room B")
        )
      )
    )
  );
};

_xSuiteComponents.ServerDataSource = function ServerDataSourceStub() {
  const nodes = [
    { label: "Server", icon: "\uD83D\uDDA5\uFE0F", x: 10 },
    { label: "Cache", icon: "\u26A1", x: 45 },
    { label: "Grid", icon: "\uD83D\uDCCA", x: 80 },
  ];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 16 } }, "ServerDataSource"),
    React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 0, padding: "8px 0" } },
      ...nodes.flatMap((n, i) => {
        const items = [
          React.createElement("div", { key: `n-${i}`, style: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 6 } },
            React.createElement("div", { style: { width: 48, height: 48, borderRadius: 10, border: "2px solid var(--border-subtle)", background: "var(--surface-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 } }, n.icon),
            React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: "var(--text-secondary)" } }, n.label)
          ),
        ];
        if (i < nodes.length - 1) {
          items.push(
            React.createElement("div", { key: `a-${i}`, style: { display: "flex", flexDirection: "column" as const, alignItems: "center", margin: "0 8px", marginBottom: 18 } },
              React.createElement("div", { style: { width: 40, height: 2, background: "var(--action-primary, #3b82f6)", position: "relative" as const } },
                React.createElement("div", { style: { position: "absolute" as const, right: -4, top: -3, width: 0, height: 0, borderTop: "4px solid transparent", borderBottom: "4px solid transparent", borderLeft: "6px solid var(--action-primary, #3b82f6)" } })
              )
            )
          );
        }
        return items;
      })
    ),
    React.createElement("div", { style: { textAlign: "center" as const, fontSize: 10, color: "var(--text-secondary)", marginTop: 4 } }, "Server-side row model with caching layer")
  );
};

_xSuiteComponents.TreeDataGrid = function TreeDataGridStub() {
  const rows = [
    { indent: 0, label: "Documents", icon: "\u25BC", extra: "3 items" },
    { indent: 1, label: "Reports", icon: "\u25BC", extra: "2 items" },
    { indent: 2, label: "Q1 Report.pdf", icon: "\uD83D\uDCC4", extra: "2.4 MB" },
    { indent: 2, label: "Q2 Report.pdf", icon: "\uD83D\uDCC4", extra: "1.8 MB" },
    { indent: 1, label: "Invoices", icon: "\u25B6", extra: "5 items" },
  ];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, overflow: "hidden", background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, padding: "12px 16px", color: "var(--text-primary)", borderBottom: "1px solid var(--border-subtle)" } }, "TreeDataGrid"),
    ...rows.map((r, i) =>
      React.createElement("div", { key: i, style: { padding: `6px 12px 6px ${12 + r.indent * 20}px`, borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-primary)" } },
        React.createElement("span", { style: { fontSize: 10, width: 14, color: r.icon === "\uD83D\uDCC4" ? "var(--text-secondary)" : "var(--action-primary, #3b82f6)", flexShrink: 0 } }, r.icon),
        React.createElement("span", { style: { flex: 1 } }, r.label),
        React.createElement("span", { style: { fontSize: 10, color: "var(--text-secondary)" } }, r.extra)
      )
    )
  );
};

_xSuiteComponents.TreemapChart = function TreemapChartStub() {
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 } }, "TreemapChart"),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "3fr 2fr", gridTemplateRows: "60px 40px 40px", gap: 3, height: 144 } },
      React.createElement("div", { style: { gridRow: "1 / 3", borderRadius: 6, background: "var(--action-primary, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff", opacity: 0.85 } }, "Sales 42%"),
      React.createElement("div", { style: { borderRadius: 6, background: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#fff", opacity: 0.85 } }, "Marketing 24%"),
      React.createElement("div", { style: { borderRadius: 6, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#fff", opacity: 0.85 } }, "Ops 16%"),
      React.createElement("div", { style: { borderRadius: 6, background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#fff", opacity: 0.85 } }, "HR 10%"),
      React.createElement("div", { style: { borderRadius: 6, background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#fff", opacity: 0.85 } }, "R&D 8%")
    )
  );
};

_xSuiteComponents.WaterfallChart = function WaterfallChartStub() {
  const bars = [
    { label: "Start", value: 100, cumulative: 0, isTotal: false },
    { label: "+Sales", value: 60, cumulative: 100, isTotal: false },
    { label: "-Cost", value: -30, cumulative: 160, isTotal: false },
    { label: "-Tax", value: -15, cumulative: 130, isTotal: false },
    { label: "Net", value: 115, cumulative: 0, isTotal: true },
  ];
  const maxH = 160;
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 } }, "WaterfallChart"),
    React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 6, height: 120, paddingTop: 8 } },
      ...bars.map((b) => {
        const barH = Math.abs(b.isTotal ? b.value : b.value) * 0.65;
        const bottomOffset = b.isTotal ? 0 : (b.value > 0 ? b.cumulative : b.cumulative + b.value) * 0.65;
        const color = b.isTotal ? "var(--action-primary, #3b82f6)" : b.value >= 0 ? "var(--state-success-text, #16a34a)" : "var(--state-error-text, #dc2626)";
        return React.createElement("div", { key: b.label, style: { flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", height: "100%", justifyContent: "flex-end" } },
          React.createElement("div", { style: { fontSize: 9, color: "var(--text-secondary)", marginBottom: 2, fontWeight: 500 } }, b.isTotal ? b.value : (b.value > 0 ? `+${b.value}` : b.value)),
          React.createElement("div", { style: { width: "70%", height: barH, background: color, borderRadius: "3px 3px 0 0", marginBottom: bottomOffset, opacity: 0.85 } }),
          React.createElement("div", { style: { fontSize: 9, color: "var(--text-secondary)", marginTop: 4, fontWeight: 500 } }, b.label)
        );
      })
    )
  );
};

_xSuiteComponents.useScheduler = function UseSchedulerStub() {
  const lines = [
    { text: "const {", color: "var(--action-primary, #3b82f6)" },
    { text: "  events,", color: "var(--text-primary)" },
    { text: "  addEvent,", color: "var(--text-primary)" },
    { text: "  removeEvent,", color: "var(--text-primary)" },
    { text: "  updateEvent,", color: "var(--text-primary)" },
    { text: "} = useScheduler({", color: "var(--action-primary, #3b82f6)" },
    { text: '  view: "week",', color: "var(--state-success-text, #16a34a)" },
    { text: "  defaultDate: new Date(),", color: "var(--text-primary)" },
    { text: "});", color: "var(--action-primary, #3b82f6)" },
  ];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 } }, "useScheduler"),
    React.createElement("div", { style: { fontFamily: "monospace", fontSize: 11, lineHeight: 1.7, padding: 12, borderRadius: 8, background: "var(--surface-muted)", border: "1px solid var(--border-subtle)", overflowX: "auto" as const } },
      ...lines.map((l, i) =>
        React.createElement("div", { key: i, style: { color: l.color, whiteSpace: "pre" as const } }, l.text)
      )
    ),
    React.createElement("div", { style: { fontSize: 10, color: "var(--text-secondary)", marginTop: 8, fontStyle: "italic" as const } }, "React hook for scheduler state management")
  );
};

/* ---- Non-DOM props that should not be spread to native elements ---- */
/* These are custom props recognized by @mfe/design-system components    */
/* but cause React warnings when they leak to native DOM elements.       */
const NON_DOM_SAFE_PROPS = new Set([
  "loadingDisplay",
  "selectSize",
  "fullWidth",
  "emptyTitle",
  "emptyDescription",
]);

/* ---- Event logging types for Actions Panel ---- */

export type ActionLogEntry = {
  id: number;
  eventName: string;
  timestamp: number;
  payload: unknown[];
  componentName: string;
};

export type ActionLogSubscriber = (entry: ActionLogEntry) => void;

let _logIdCounter = 0;
const _subscribers = new Set<ActionLogSubscriber>();

export function subscribeToActionLog(fn: ActionLogSubscriber) {
  _subscribers.add(fn);
  return () => { _subscribers.delete(fn); };
}

function emitActionLog(entry: ActionLogEntry) {
  _subscribers.forEach((fn) => fn(entry));
}

/* ------------------------------------------------------------------ */
/*  PlaygroundPreview — Live component render with prop overrides      */
/*                                                                     */
/*  Resolves a component from @mfe/design-system by name and renders it with   */
/*  the current prop values from the playground state.                  */
/*                                                                     */
/*  For compound components that need children/content, sensible       */
/*  defaults are injected.                                              */
/* ------------------------------------------------------------------ */

type PlaygroundPreviewProps = {
  componentName: string;
  propValues: Record<string, string | boolean | number>;
  /** When true, renders without the outer border/panel wrapper — used for state demo cards */
  compact?: boolean;
};

/**
 * Component registry — maps component name to the actual React component.
 * We cast @mfe/design-system exports as a record so we can dynamically look up.
 */
const _rawRegistry = {
  ...(MfeUiKit as unknown as Record<string, React.ComponentType<Record<string, unknown>>>),
  ...(_xSuiteComponents as Record<string, React.ComponentType<Record<string, unknown>>>),
};

/**
 * Alias map — doc names that differ from the actual export name.
 * These are recipe/variant entries that reuse the same underlying component.
 */
const COMPONENT_ALIASES: Record<string, string> = {
  // MenuBar recipe variants (space-separated doc names)
  "Navigation Menu": "MenuBar",
  "App Header": "MenuBar",
  "Search / Command Header": "MenuBar",
  "Action Header": "MenuBar",
  "Action Bar": "MenuBar",
  "Desktop Menubar": "MenuBar",
  // MenuBar recipe variants (PascalCase / no-space keys)
  NavigationMenu: "MenuBar",
  AppHeader: "MenuBar",
  CommandHeader: "MenuBar",
  ActionHeader: "MenuBar",
  ActionBar: "MenuBar",
  DesktopMenubar: "MenuBar",
  // Page template compositions — render primary layout component (space-separated)
  "CRUD Template": "PageLayout",
  "Dashboard Template": "PageLayout",
  "Detail Template": "PageLayout",
  "Settings Template": "PageLayout",
  "Command Workspace": "PageLayout",
  // Page template compositions (PascalCase / no-space keys)
  CrudTemplate: "PageLayout",
  DashboardTemplate: "PageLayout",
  DetailTemplate: "PageLayout",
  SettingsTemplate: "PageLayout",
  CommandWorkspace: "PageLayout",
  // Components documented under different name than export
  SectionTabs: "DetailSectionTabs",
};

/**
 * Non-component entries — utilities, hooks, constants, theme APIs.
 * These appear in the doc catalog but cannot render a live preview.
 * We classify them by type to show an appropriate fallback UI.
 */
type NonComponentType = "hook" | "utility" | "constant" | "theme-setter" | "theme-api" | "hoc" | "upcoming";

const NON_COMPONENT_ENTRIES: Record<string, NonComponentType> = {
  // Hooks
  useToast: "hook",
  useAsyncCombobox: "hook",
  useGridVariants: "hook",
  useAgGridTablePagination: "hook",
  // Utility / factory functions
  buildAuthHeaders: "utility",
  buildEntityGridQueryParams: "utility",
  createAccordionItemsFromSections: "utility",
  createAccordionPreset: "utility",
  createBreadcrumbItemsFromRoute: "utility",
  createMenuBarItemsFromRoutes: "utility",
  createMenuBarPreset: "utility",
  createNavigationDestinationItems: "utility",
  createNavigationRailPreset: "utility",
  createPageHeaderStatItems: "utility",
  createPageHeaderTagItems: "utility",
  createPageLayoutBreadcrumbItems: "utility",
  createPageLayoutPreset: "utility",
  createSegmentedItemsFromFilters: "utility",
  createSegmentedItemsFromRoutes: "utility",
  createSegmentedPreset: "utility",
  resolveAccessState: "utility",
  resolveMenuBarActiveValue: "utility",
  resolveNavigationRailActiveValue: "utility",
  resolveSegmentedNextValue: "utility",
  resolveThemeModeKey: "utility",
  shouldBlockInteraction: "utility",
  toggleVariantDefault: "utility",
  // HOC
  withAccessGuard: "hoc",
  // Theme setter functions
  setAppearance: "theme-setter",
  setDensity: "theme-setter",
  setElevation: "theme-setter",
  setMotion: "theme-setter",
  setOverlayIntensity: "theme-setter",
  setOverlayOpacity: "theme-setter",
  setRadius: "theme-setter",
  setSurfaceTone: "theme-setter",
  setTableSurfaceTone: "theme-setter",
  // Theme state / API
  getResolvedToken: "theme-api",
  getThemeAxes: "theme-api",
  getThemeContract: "theme-api",
  registerTokenResolver: "theme-api",
  resetTokenResolver: "theme-api",
  subscribeThemeAxes: "theme-api",
  updateThemeAxes: "theme-api",
  // Upcoming components (documented but not yet exported)
  MobileStepper: "upcoming",
  // X-Suite hooks & utilities
  useScheduler: "hook",
  useRecurrence: "hook",
  useConflictDetection: "hook",
  useKanban: "hook",
  useDragDrop: "hook",
  useKanbanFilter: "hook",
  useWipPolicy: "hook",
  useEditor: "hook",
  useSlashCommands: "hook",
  useMentions: "hook",
  useFormSchema: "hook",
  useConditionalLogic: "hook",
  useAsyncValidation: "hook",
  useMultiStepForm: "hook",
  useColumnBuilder: "hook",
  useGridExport: "hook",
  useGridState: "hook",
  ServerDataSource: "utility",
  createFieldRegistry: "utility",
  createSchemaValidator: "utility",
  defaultSlashCommands: "constant",
  // Theme constants
  THEME_APPEARANCE_OPTIONS: "constant",
  THEME_DENSITY_OPTIONS: "constant",
  THEME_ELEVATION_OPTIONS: "constant",
  THEME_MOTION_OPTIONS: "constant",
  THEME_RADIUS_OPTIONS: "constant",
};

const NON_COMPONENT_LABELS: Record<NonComponentType, { icon: string; label: string; description: string }> = {
  hook: { icon: "🪝", label: "React Hook", description: "Bu bir React hook'udur ve görsel önizleme sağlanamaz. API dokümantasyonu için aşağıya bakın." },
  utility: { icon: "🔧", label: "Utility Function", description: "Bu bir yardımcı fonksiyondur. Kullanım detayları için API sekmesine bakın." },
  constant: { icon: "📋", label: "Constant / Options", description: "Bu sabit bir konfigürasyon nesnesidir. Değerleri ve kullanımı için API sekmesine bakın." },
  "theme-setter": { icon: "🎨", label: "Theme Setter", description: "Bu bir tema ayar fonksiyonudur. Theme builder ile birlikte kullanılır." },
  "theme-api": { icon: "⚙️", label: "Theme API", description: "Bu bir tema API fonksiyonudur. Tema sistemi ile programatik etkileşim sağlar." },
  hoc: { icon: "🔀", label: "Ust Duzey Bilesen (HOC)", description: "Bu bir HOC'dir. Component'lari wrap ederek ek davranis ekler." },
  upcoming: { icon: "🚧", label: "Upcoming Component", description: "Bu component henüz dışa aktarılmamıştır. Gelecek sürümde kullanıma sunulacaktır." },
};

/**
 * Resolve a component name (possibly with spaces / alias) to a registry key.
 */
function resolveComponentKey(name: string): string {
  if (COMPONENT_ALIASES[name]) return COMPONENT_ALIASES[name];
  // Try as-is, then PascalCase without spaces
  if (_rawRegistry[name]) return name;
  const noSpaces = name.replace(/\s+/g, "");
  if (_rawRegistry[noSpaces]) return noSpaces;
  return name;
}

const componentRegistry = new Proxy(_rawRegistry, {
  get(target, prop: string) {
    return target[resolveComponentKey(prop)];
  },
});

/**
 * Default children/content for components that need them.
 * `undefined` means the component uses props instead of children,
 * or is a compound component with complex children handled by DEFAULT_PROPS.
 */
const DEFAULT_CHILDREN: Record<string, React.ReactNode> = {
  /* Primitives — text-bearing */
  Button: "Tikla",
  IconButton: undefined,
  Tag: "Etiket",
  Badge: "Yeni",
  Text: "Hizli kahverengi tilki tembel kopegin uzerinden atlar.",
  LinkInline: "Baglanti metni",
  SearchInput: undefined,

  /* Form controls — no children */
  Checkbox: undefined,
  Radio: undefined,
  Switch: undefined,
  Select: undefined,
  Input: undefined,
  TextInput: undefined,
  Textarea: undefined,
  TextArea: undefined,
  Slider: undefined,
  DatePicker: undefined,
  TimePicker: undefined,
  Upload: undefined,
  Combobox: undefined,
  FormField: undefined,

  /* Feedback — uses props */
  Alert: undefined,
  Tooltip: undefined,
  Spinner: undefined,
  Skeleton: undefined,
  Empty: undefined,
  EmptyErrorLoading: undefined,
  EmptyState: undefined,

  /* Compound — complex children via DEFAULT_PROPS */
  Tabs: undefined,
  Steps: undefined,
  Breadcrumb: undefined,
  Accordion: undefined,
  Segmented: undefined,
  Pagination: undefined,
  NavigationRail: undefined,
  MenuBar: undefined,
  Descriptions: undefined,

  /* Overlays */
  Modal: undefined,
  Dialog: undefined,
  Popover: undefined,
  Dropdown: undefined,
  ContextMenu: undefined,
  CommandPalette: undefined,
  DetailDrawer: undefined,
  FormDrawer: undefined,

  /* Data display */
  TableSimple: undefined,
  List: undefined,
  Tree: undefined,
  JsonViewer: undefined,

  /* Layout */
  Card: undefined,
  Divider: undefined,
  Stack: undefined,
  HStack: undefined,
  VStack: undefined,

  /* Patterns / Pages */
  PageHeader: undefined,
  FilterBar: undefined,
  MasterDetail: undefined,
  PageLayout: undefined,
  SummaryStrip: undefined,
  EntitySummaryBlock: undefined,
  DetailSummary: undefined,
  ReportFilterPanel: undefined,

  /* Advanced components */
  EntityGrid: undefined,
  EntityGridTemplate: undefined,
  AgGridServer: undefined,
  TreeTable: undefined,

  /* Notification */
  NotificationDrawer: undefined,
  NotificationPanel: undefined,
  NotificationItemCard: undefined,

  /* Theme */
  ThemePreviewCard: undefined,
  ThemePresetCompare: undefined,
  ThemePresetGallery: undefined,

  /* Misc */
  AnchorToc: undefined,
  ConfidenceBadge: undefined,
  SearchFilterListing: undefined,
  DetailSectionTabs: undefined,
  SectionTabs: undefined,
  TourCoachmarks: undefined,
  RadioGroup: undefined,

  /* AI Components */
  PromptComposer: undefined,
  RecommendationCard: undefined,
  CitationPanel: undefined,
  ApprovalCheckpoint: undefined,
  ApprovalReview: undefined,
  AIGuidedAuthoring: undefined,
  AIActionAuditTimeline: undefined,

  /* Additional Pagination */
  TablePagination: undefined,
  MobileStepper: undefined,

  /* Templates / Layout */
  ActionBar: undefined,
  AppHeader: undefined,
  NavigationMenu: undefined,
  CommandHeader: undefined,
  ActionHeader: undefined,
  DesktopMenubar: undefined,

  /* MenuBar recipe aliases (doc names with spaces) */
  "Navigation Menu": undefined,
  "App Header": undefined,
  "Search / Command Header": undefined,
  "Action Header": undefined,
  "Action Bar": undefined,
  "Desktop Menubar": undefined,
  CommandWorkspace: undefined,
  CrudTemplate: undefined,
  DashboardTemplate: undefined,
  DetailTemplate: undefined,
  SettingsTemplate: undefined,
  "CRUD Template": undefined,
  "Dashboard Template": undefined,
  "Detail Template": undefined,
  "Settings Template": undefined,
  "Command Workspace": undefined,
  ToastProvider: undefined,

  /* ---- X-Charts ---- */
  ChartContainer: undefined,
  ScatterChart: undefined,
  RadarChart: undefined,
  TreemapChart: undefined,
  HeatmapChart: undefined,
  GaugeChart: undefined,
  WaterfallChart: undefined,
  SparklineChart: undefined,
  MiniChart: undefined,
  KPICard: undefined,
  ChartDashboard: undefined,
  StatWidget: undefined,
  ChartLegend: undefined,

  /* ---- X-Data-Grid ---- */
  DataGridFilterChips: undefined,
  DataGridSelectionBar: undefined,
  MasterDetailGrid: undefined,
  TreeDataGrid: undefined,
  PivotGrid: undefined,
  EditableGrid: undefined,
  RowGroupingGrid: undefined,

  /* ---- X-Scheduler ---- */
  Scheduler: undefined,
  SchedulerEvent: undefined,
  SchedulerToolbar: undefined,
  AgendaView: undefined,
  ResourceView: undefined,
  EventForm: undefined,

  /* ---- X-Kanban ---- */
  KanbanBoard: undefined,
  KanbanColumn: undefined,
  KanbanCard: undefined,
  KanbanToolbar: undefined,
  KanbanSwimlane: undefined,
  KanbanCardDetail: undefined,
  KanbanMetrics: undefined,

  /* ---- X-Editor ---- */
  RichTextEditor: undefined,
  EditorToolbar: undefined,
  EditorMenuBubble: undefined,
  SlashCommandMenu: undefined,
  MentionList: undefined,
  EditorTableMenu: undefined,
  EditorLinkDialog: undefined,
  EditorImageUpload: undefined,

  /* ---- X-FormBuilder ---- */
  FormRenderer: undefined,
  FieldRenderer: undefined,
  FormPreview: undefined,
  MultiStepForm: undefined,
  FormSummary: undefined,
  RepeatableFieldGroup: undefined,
};

/**
 * Default props for components that need minimum props to render.
 * These are merged with playground prop overrides.
 */
const DEFAULT_PROPS: Record<string, Record<string, unknown>> = {
  /* ---- Primitives ---- */
  Button: { variant: "primary", size: "md" },
  IconButton: { icon: React.createElement("span", { style: { fontSize: 16 } }, "✎"), label: "Duzenle", size: "md" },
  Text: { children: "Hizli kahverengi tilki tembel kopegin uzerinden atlar." },
  Badge: { children: "Yeni" },
  Tag: { children: "Etiket" },
  LinkInline: { children: "Baglanti metni", href: "#" },
  Avatar: { initials: "AY", size: "md" },
  Divider: {},

  /* ---- Form controls ---- */
  Input: { label: "Kullanici Adi", placeholder: "ornek: ahmet.yilmaz", size: "md", fullWidth: true, description: "Sisteme giris icin kullanilacak benzersiz kullanici adi.", helperText: "En az 3 karakter olmalidir." },
  TextInput: { label: "Kullanici Adi", placeholder: "ornek: ahmet.yilmaz", size: "md", fullWidth: true, description: "Sisteme giris icin kullanilacak benzersiz kullanici adi.", helperText: "En az 3 karakter olmalidir." },
  Textarea: { label: "Proje Aciklamasi", placeholder: "Projenizin amacini, hedef kitlesini ve temel ozelliklerini yaziniz...", rows: 4, description: "Detayli bir aciklama ekip uyelerinin projeyi anlamasina yardimci olur.", fullWidth: true },
  TextArea: { label: "Proje Aciklamasi", placeholder: "Projenizin amacini, hedef kitlesini ve temel ozelliklerini yaziniz...", rows: 4, description: "Detayli bir aciklama ekip uyelerinin projeyi anlamasina yardimci olur.", fullWidth: true },
  Select: {
    label: "Departman",
    description: "Calisanin bagli oldugu departmani secin.",
    options: [
      { value: "engineering", label: "Muhendislik" },
      { value: "design", label: "Tasarim" },
      { value: "product", label: "Urun Yonetimi" },
      { value: "marketing", label: "Pazarlama" },
      { value: "hr", label: "Insan Kaynaklari" },
      { value: "finance", label: "Finans" },
    ],
    placeholder: "Departman secin",
    size: "md",
    fullWidth: true,
  },
  Checkbox: { label: "Kosullari kabul ediyorum", description: "Kullanim sartlarini okudum ve onayliyorum." },
  Radio: { label: "E-posta", description: "Onemli guncellemeler e-posta ile gonderilir", name: "bildirim", value: "email", defaultChecked: true },
  Switch: { label: "Bildirimleri etkinlestir", description: "Tum bildirim kanallarini acip kapatir." },
  SearchInput: { placeholder: "Ara..." },
  Slider: { label: "Ses Seviyesi", min: 0, max: 100, step: 1, defaultValue: 50, description: "Cihaz ses duzeyini ayarlayin.", minLabel: "Sessiz", maxLabel: "Maksimum" },
  DatePicker: { label: "Tarih", placeholder: "Tarih seciniz...", description: "Baslangic tarihi secin." },
  TimePicker: { label: "Saat", placeholder: "Saat seciniz...", description: "Baslangic saati secin." },
  Upload: { label: "Dosya yukle", description: "PDF veya gorsel yukleyebilirsiniz.", accept: ".pdf,.png,.jpg" },
  Combobox: {
    label: "Teknoloji Yigini",
    description: "Projede kullanilan ana teknolojileri secin.",
    options: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue.js" },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte" },
      { value: "nextjs", label: "Next.js" },
      { value: "nuxt", label: "Nuxt" },
      { value: "remix", label: "Remix" },
    ],
    placeholder: "Teknoloji ara...",
    fullWidth: true,
  },
  FormField: {
    label: "E-posta",
    help: "E-posta adresiniz asla paylasilmayacaktir.",
    required: true,
    children: React.createElement("input", {
      type: "email",
      placeholder: "siz@ornek.com",
      className: "w-full rounded-lg border border-border-subtle bg-surface-default px-3 py-2 text-sm",
    }),
  },

  /* ---- Feedback ---- */
  Alert: { title: "Onemli bildirim", children: "Bu bir bilgilendirme uyari mesajidir.", variant: "info" },
  Tooltip: { text: "Ipucu icerigi", children: React.createElement("span", { className: "underline decoration-dotted cursor-help" }, "Uzerime gelin") },
  Spinner: { size: "md" },
  Skeleton: { width: 200, height: 20 },
  Empty: { description: "Gosterilecek veri bulunamadi" },
  EmptyState: { description: "Gosterilecek veri bulunamadi" },
  EmptyErrorLoading: { mode: "empty", title: "Durum tarifi", description: "Veri bulunamadi" },

  /* ---- Compound / Navigation ---- */
  Tabs: {
    items: [
      { key: "tab1", label: "Genel Bakis", children: React.createElement("div", { className: "p-3 text-sm" }, "Genel bakis icerigi") },
      { key: "tab2", label: "Detaylar", children: React.createElement("div", { className: "p-3 text-sm" }, "Detay icerigi") },
      { key: "tab3", label: "Ayarlar", children: React.createElement("div", { className: "p-3 text-sm" }, "Ayarlar icerigi") },
    ],
    defaultActiveKey: "tab1",
  },
  Steps: {
    items: [
      { title: "Hesap Olustur", description: "Temel bilgilerinizi girin", status: "completed" },
      { title: "Profil Detaylari", description: "Departman ve rol bilgilerini tamamlayin", status: "completed" },
      { title: "Yetkilendirme", description: "Erisim izinlerini yapilandirin", status: "current" },
      { title: "Dogrulama", description: "E-posta ve telefon dogrulamasi", status: "pending" },
      { title: "Tamamlandi", description: "Hesap aktif edilecek", status: "pending" },
    ],
    current: 2,
    direction: "horizontal",
    size: "md",
  },
  Breadcrumb: {
    items: [
      { label: "Ana Sayfa", href: "/" },
      { label: "Urunler", href: "/products" },
      { label: "Detaylar" },
    ],
  },
  Pagination: { total: 100, current: 1, pageSize: 10, size: "md" },
  Accordion: {
    items: [
      { value: "sec1", title: "Design Lab nedir?", content: "Kapsamli bir bilesen vitrin ve dokumantasyon sistemidir." },
      { value: "sec2", title: "Nasil kullanilir?", content: "Bilesenlere gozatin, varyantlari kesfet ve kod parcaciklarini kopyalayin." },
      { value: "sec3", title: "Katki soglama", content: "Standart PR is akisi uzerinden yeni bilesenler gonderin." },
    ],
    selectionMode: "multiple",
    bordered: true,
  },
  Segmented: {
    items: [
      { value: "daily", label: "Gunluk" },
      { value: "weekly", label: "Haftalik" },
      { value: "monthly", label: "Aylik" },
    ],
    value: "weekly",
    size: "md",
  },
  NavigationRail: {
    items: [
      { value: "home", label: "Ana Sayfa" },
      { value: "search", label: "Arama" },
      { value: "settings", label: "Ayarlar" },
    ],
    value: "home",
    size: "md",
  },
  MenuBar: {
    items: [
      { key: "file", label: "Dosya" },
      { key: "edit", label: "Duzenle" },
      { key: "view", label: "Gorunum" },
    ],
  },

  /* ---- Data display ---- */
  Descriptions: {
    title: "Kullanici Bilgileri",
    items: [
      { key: "name", label: "Ad Soyad", value: "Ayse Demir" },
      { key: "email", label: "E-posta", value: "ayse@ornek.com" },
      { key: "role", label: "Rol", value: "Kidemli Muhendis" },
      { key: "dept", label: "Departman", value: "Platform Muhendisligi" },
      { key: "status", label: "Hesap Durumu", value: "Aktif", tone: "success" },
      { key: "lastLogin", label: "Son Giris", value: "18 Mart 2026, 09:42" },
      { key: "mfa", label: "Iki Faktorlu Dogrulama", value: "Etkin", tone: "success" },
      { key: "license", label: "Lisans", value: "Kurumsal", tone: "info" },
    ],
    columns: 2,
    bordered: true,
  },
  JsonViewer: {
    value: { ad: "Design Lab", surum: "1.0", bilesenSayisi: 137, durum: "aktif" },
    title: "Yapilandirma",
    defaultExpandedDepth: 1,
  },
  List: {
    items: [
      { id: "1", primary: "Sunucu Goc Plani", secondary: "AWS'den Azure'a gecis icin hazirlik dokumani", meta: "2 saat once", badge: "Acil", badgeTone: "error" },
      { id: "2", primary: "API Entegrasyon Rehberi", secondary: "Ucuncu parti servis entegrasyonu icin teknik kilavuz", meta: "Dun", badge: "Incelemede", badgeTone: "warning" },
      { id: "3", primary: "Performans Raporu Q1", secondary: "Ilk ceyrek sistem performans metrikleri ve analizi", meta: "3 gun once", badge: "Tamamlandi", badgeTone: "success" },
      { id: "4", primary: "Guvenlik Denetim Sonuclari", secondary: "Yillik guvenlik taramasi bulgulari ve aksiyon plani", meta: "1 hafta once", badge: "Yeni", badgeTone: "info" },
      { id: "5", primary: "Kullanici Geri Bildirimleri", secondary: "Sprint 14 sonrasi toplanan kullanici gorusleri ozeti", meta: "2 hafta once" },
    ],
  },

  /* ---- Layout ---- */
  Card: { children: React.createElement("div", { className: "p-4" }, "Kart icerigi") },
  Stack: { children: React.createElement(React.Fragment, null, React.createElement("div", null, "Oge 1"), React.createElement("div", null, "Oge 2")) },

  /* ---- Patterns / Page-level ---- */
  PageHeader: {
    title: "Kontrol Paneli",
    subtitle: "Verilerinize genel bakis",
    breadcrumbs: [
      { label: "Ana Sayfa", href: "/" },
      { label: "Kontrol Paneli" },
    ],
  },
  FilterBar: {
    // P1-6: FilterBar requires children (filter controls), not a filters array
    children: React.createElement(React.Fragment, null,
      React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-1.5 text-sm", placeholder: "Ara...", readOnly: true }),
      React.createElement("select", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-1.5 text-sm" },
        React.createElement("option", null, "Durum: Tumu"),
        React.createElement("option", null, "Aktif"),
        React.createElement("option", null, "Pasif"),
      ),
    ),
    search: React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Filtreler"),
    activeCount: 1,
  },
  SummaryStrip: {
    items: [
      { label: "Toplam", value: "1.234" },
      { label: "Aktif", value: "890" },
      { label: "Beklemede", value: "344" },
    ],
  },
  EntitySummaryBlock: {
    title: "Varlik Ozeti",
    items: [
      { label: "Tur", value: "Belge" },
      { label: "Durum", value: "Yayinlandi" },
    ],
  },
  DetailSummary: {
    title: "Varlik Detay Ozeti",
    description: "Anahtar-deger detaylariyla birlestirilmis varlik gorunumu.",
    entity: {
      title: "Ayse Demir",
      subtitle: "Kidemli Muhendis",
      items: [
        { key: "dept", label: "Departman", value: "Muhendislik" },
        { key: "loc", label: "Konum", value: "Istanbul" },
      ],
    },
    summaryItems: [
      { label: "Projeler", value: "12" },
      { label: "Aktif", value: "3" },
    ],
    detailItems: [
      { key: "email", label: "E-posta", value: "ayse@ornek.com" },
      { key: "phone", label: "Telefon", value: "+90 555 123 4567" },
      { key: "start", label: "Baslangic Tarihi", value: "2022-03-15" },
    ],
  },

  /* ---- Overlays ---- */
  Modal: {
    open: false,
    title: "Ornek Modal",
    size: "md",
    keepMounted: true,
    disablePortal: true,
    children: React.createElement("div", { className: "p-4 text-sm" }, "Modal icerigi burada gorunur."),
    footer: React.createElement("div", { className: "flex justify-end gap-2" },
      React.createElement("button", { className: "rounded-lg bg-surface-muted px-3 py-1.5 text-xs" }, "Iptal"),
      React.createElement("button", { className: "rounded-lg bg-action-primary px-3 py-1.5 text-xs text-white" }, "Onayla"),
    ),
  },
  Dialog: {
    open: false,
    title: "Onay",
    keepMounted: true,
    disablePortal: true,
    children: React.createElement("div", { className: "p-4 text-sm" }, "Devam etmek istediginizden emin misiniz?"),
  },
  TourCoachmarks: {
    steps: [
      { id: "step-1", title: "Hos Geldiniz", description: "Rehberli turun ilk adimidir.", meta: "Adim 1 / 3", tone: "info" as const },
      { id: "step-2", title: "Ozellikleri Kesfet", description: "Bu bolumde mevcut temel ozellikleri ogrenin.", meta: "Adim 2 / 3", tone: "info" as const },
      { id: "step-3", title: "Tamamlandi", description: "Turu tamamladiniz. Ozellikleri kullanmaya baslayin!", meta: "Adim 3 / 3", tone: "success" as const },
    ],
    defaultOpen: true,
    allowSkip: true,
    showProgress: true,
    mode: "guided" as const,
  },

  /* ---- Notification ---- */
  NotificationItemCard: {
    item: {
      id: "notif-1",
      message: "Yeni mesaj alindi",
      description: "Sistemden yeni bir bildiriminiz var.",
      type: "info",
      priority: "normal",
      read: false,
      createdAt: Date.now() - 120000,
    },
  },

  /* ---- Advanced ---- */
  TreeTable: {
    nodes: [
      {
        key: "root-1",
        label: "Belgeler",
        description: "Proje dokumantasyonu",
        children: [
          { key: "child-1", label: "Mimari", description: "Sistem tasarim belgeleri", data: { type: "klasor", size: "2.4 MB", updated: "14 Mar" } },
          { key: "child-2", label: "API Referansi", description: "REST API dokumantasyonu", data: { type: "dosya", size: "840 KB", updated: "12 Mar" } },
          { key: "child-3", label: "Kullanim Kilavuzu", description: "Son kullanici rehberi", data: { type: "dosya", size: "1.1 MB", updated: "10 Mar" } },
        ],
        data: { type: "klasor", size: "4.3 MB", updated: "14 Mar" },
      },
      {
        key: "root-2",
        label: "Raporlar",
        description: "Performans ve denetim raporlari",
        children: [
          { key: "child-4", label: "Q1 Performans", description: "Ilk ceyrek sistem metrikleri", data: { type: "dosya", size: "520 KB", updated: "1 Mar" } },
          { key: "child-5", label: "Guvenlik Taramasi", description: "Yillik guvenlik denetim raporu", data: { type: "dosya", size: "1.8 MB", updated: "28 Sub" } },
        ],
        data: { type: "klasor", size: "2.3 MB", updated: "1 Mar" },
      },
      {
        key: "root-3",
        label: "Sablonlar",
        description: "Proje sablonlari ve sema dosyalari",
        data: { type: "klasor", size: "780 KB", updated: "5 Mar" },
      },
    ],
    columns: [
      { key: "type", label: "Tur", render: (node: Record<string, unknown>) => ((node as { data?: { type?: string } }).data?.type ?? "\u2014") },
      { key: "size", label: "Boyut", render: (node: Record<string, unknown>) => ((node as { data?: { size?: string } }).data?.size ?? "\u2014") },
      { key: "updated", label: "Guncelleme", render: (node: Record<string, unknown>) => ((node as { data?: { updated?: string } }).data?.updated ?? "\u2014") },
    ],
    defaultExpandedKeys: ["root-1"],
  },

  /* ---- Theme ---- */
  ThemePreviewCard: { themeName: "Varsayilan Tema", localeText: { titleText: "Baslik metni", secondaryText: "Ikincil metin" } },
  ThemePresetGallery: {
    presets: [
      { presetId: "light-default", label: "Acik Tema", appearance: "light", density: "comfortable", intent: "neutral", isHighContrast: false, isDefaultMode: true, themeMode: "light" },
      { presetId: "dark-default", label: "Koyu Tema", appearance: "dark", density: "comfortable", intent: "neutral", isHighContrast: false, isDefaultMode: false, themeMode: "dark" },
      { presetId: "compact-light", label: "Kompakt Acik", appearance: "light", density: "compact", intent: "neutral", isHighContrast: false, isDefaultMode: false, themeMode: "light" },
    ],
  },

  /* ---- Misc ---- */
  AnchorToc: {
    items: [
      { id: "intro", label: "Giris" },
      { id: "setup", label: "Kurulum" },
      { id: "usage", label: "Kullanim" },
    ],
  },
  ConfidenceBadge: { score: 0.85, label: "Yuksek" },
  RadioGroup: {
    label: "Secenek secin",
    options: [
      { value: "a", label: "Secenek A" },
      { value: "b", label: "Secenek B" },
      { value: "c", label: "Secenek C" },
    ],
    value: "a",
  },
  DetailSectionTabs: {
    tabs: [
      { key: "overview", label: "Genel Bakis" },
      { key: "details", label: "Detaylar" },
      { key: "history", label: "Gecmis" },
    ],
    activeTab: "overview",
  },

  /* ---- Overlay components ---- */
  Popover: {
    trigger: React.createElement("button", { className: "rounded-lg border border-border-subtle px-3 py-1.5 text-sm" }, "Popover Ac"),
    content: React.createElement("div", { className: "p-3 text-sm" }, "Popover icerigi burada gorunur."),
    defaultOpen: true,
  },
  Dropdown: {
    items: [
      { key: "edit", label: "Duzenle" },
      { key: "duplicate", label: "Cogalt" },
      { key: "delete", label: "Sil" },
    ],
    children: React.createElement("button", { className: "rounded-lg border border-border-subtle px-3 py-1.5 text-sm" }, "Islemler \u25BE"),
  },
  ContextMenu: {
    items: [
      { key: "cut", label: "Kes", shortcut: "\u2318X" },
      { key: "copy", label: "Kopyala", shortcut: "\u2318C" },
      { key: "paste", label: "Yapistir", shortcut: "\u2318V" },
    ],
    children: React.createElement("div", {
      className: "flex items-center justify-center rounded-lg border border-dashed border-[var(--border-subtle)] p-6 text-sm text-[var(--text-secondary)] cursor-context-menu select-none",
    }, "Sag tiklayin — baglam menusu"),
  },
  CommandPalette: {
    open: false,
    title: "Komut Paleti",
    subtitle: "Rota, komut veya politika ipucu ile arayin.",
    placeholder: "Komut, rota, politika ara\u2026",
    emptyStateLabel: "Eslesen komut bulunamadi.",
    items: [
      { id: "search", title: "Ara", description: "Her seyi ara", group: "Genel", shortcut: "\u2318K" },
      { id: "settings", title: "Ayarlar", description: "Ayarlari ac", group: "Genel", shortcut: "\u2318," },
      { id: "theme", title: "Tema Degistir", description: "Acik/koyu tema gecisi", group: "Gorunum" },
      { id: "docs", title: "Dokumantasyon", description: "Rehber ve API referansi", group: "Genel" },
    ],
  },

  /* ---- Data display (additional) ---- */
  Tree: {
    nodes: [
      {
        key: "src",
        label: "src",
        children: [
          { key: "components", label: "components", children: [
            { key: "button", label: "Button.tsx", children: [] },
            { key: "input", label: "Input.tsx", children: [] },
          ]},
          { key: "utils", label: "utils", children: [
            { key: "helpers", label: "helpers.ts", children: [] },
          ]},
        ],
      },
    ],
    defaultExpandedKeys: ["src", "components"],
  },
  TableSimple: {
    columns: [
      { key: "name", label: "Ad Soyad", accessor: "name" as const },
      { key: "role", label: "Rol", accessor: "role" as const },
      { key: "status", label: "Durum", accessor: "status" as const },
    ],
    rows: [
      { name: "Ayse", role: "Yonetici", status: "Aktif" },
      { name: "Mehmet", role: "Duzenleyici", status: "Aktif" },
      { name: "Fatma", role: "Izleyici", status: "Pasif" },
    ],
    striped: true,
  },

  /* ---- Layout (additional) ---- */
  MasterDetail: {
    master: React.createElement("div", { className: "space-y-2 p-3" },
      React.createElement("div", { className: "rounded-lg border border-border-subtle p-2 text-sm font-medium bg-action-primary/5" }, "Oge 1"),
      React.createElement("div", { className: "rounded-lg border border-border-subtle p-2 text-sm" }, "Oge 2"),
      React.createElement("div", { className: "rounded-lg border border-border-subtle p-2 text-sm" }, "Oge 3"),
    ),
    detail: React.createElement("div", { className: "p-4" },
      React.createElement("div", { className: "text-sm font-semibold" }, "Oge 1 Detaylari"),
      React.createElement("div", { className: "mt-2 text-xs text-text-secondary" }, "Secilen ogenin detayli icerigi."),
    ),
    ratio: "1:2",
  },
  PageLayout: {
    title: "Sayfa Basligi",
    description: "Bu sayfanin aciklamasi.",
    children: React.createElement("div", { className: "p-4 text-sm" }, "Sayfa icerik alani"),
  },

  /* ---- Pagination/Stepper (additional) ---- */
  TablePagination: {
    totalItems: 100,
    pageSize: 10,
    page: 1,
    localeText: {
      rowsPerPageLabel: "Sayfa basina satir:",
      previousButtonLabel: "Onceki sayfa",
      nextButtonLabel: "Sonraki sayfa",
      firstButtonLabel: "Ilk sayfa",
      lastButtonLabel: "Son sayfa",
      rangeLabel: (start: number, end: number, total: number) => `${start}\u2013${end} / ${total}`,
    },
  },
  MobileStepper: { steps: 4, activeStep: 1, variant: "dots" },

  /* ---- AI components ---- */
  PromptComposer: {
    defaultValue: "Ceyreklik satis verilerini analiz edin ve trendleri belirleyin.",
    defaultScope: "general",
    defaultTone: "neutral",
    maxLength: 1200,
    guardrails: [
      "Kisisel veri korumasi",
      "Uyumluluk kontrolu",
      "On yargi tespiti",
    ],
    citations: [
      "Satis Analiz Rehberi v2.1",
      "Veri Guvenligi Politikasi",
    ],
  },
  RecommendationCard: {
    title: "Sorgu Performansini Optimize Et",
    summary: "Sorgu yurutme suresini ~%40 iyilestirmek icin 'created_at' sutununa indeks eklemeyi dusunun.",
    rationale: ["Sorgu tarama suresi esik degeri asiyor", "Sutun WHERE kosullarinda sikca kullaniliyor", "Benzer sorgularda indeks kullanimi %60 iyilesme sagliyor"],
    confidenceLevel: "high",
    citations: [
      "Veritabani Performans Rehberi — DBA El Kitabi v3.1",
      "Indeksleme Stratejileri — PostgreSQL Dokumantasyonu",
    ],
    primaryActionLabel: "Uygula",
    secondaryActionLabel: "Reddet",
  },
  CitationPanel: {
    title: "Alintilar",
    items: [
      { id: "cite-1", title: "Tasarim Ilkeleri", excerpt: "Bilesenler varsayilan olarak birlesitirilebilir ve erisilebilir olmalidir.", source: "Tasarim Sistemi Rehberi", kind: "doc" },
      { id: "cite-2", title: "API Standartlari", excerpt: "Tum prop'lar tutarli adlandirma kurallarina uymalidur.", source: "Muhendislik El Kitabi", kind: "doc" },
    ],
  },
  ApprovalCheckpoint: {
    title: "Yayin Onayi",
    summary: "Surum 2.4.0, muhendislik ve QA liderlerinin onayini gerektirmektedir.",
    status: "pending",
    checkpointLabel: "Onay kapisi",
    approverLabel: "Insan inceleme kurulu",
    dueLabel: "Yayindan once",
    primaryActionLabel: "Onayla",
    secondaryActionLabel: "Inceleme talep et",
    steps: [
      { key: "step-code-review", label: "Kod Incelemesi", owner: "Muhendislik", status: "approved" },
      { key: "step-qa-test", label: "QA Testi", owner: "QA Ekibi", status: "pending" },
      { key: "step-security-scan", label: "Guvenlik Taramasi", owner: "Guvenlik", status: "pending" },
    ],
  },
  ApprovalReview: {
    title: "Onay Karari",
    description: "Onay talebinin detaylarini inceleyin.",
    checkpoint: {
      title: "Onay Kapisi",
      summary: "Bu degisiklik yayin oncesi ekip onayi gerektirmektedir.",
      status: "pending",
    },
    citations: [
      { id: "cite-1", title: "Politika Belgesi", excerpt: "Tum yayinlar en az iki ekip uyesi tarafindan incelenmelidir.", source: "Yayin Politikasi v2.1", kind: "doc" as const },
      { id: "cite-2", title: "Uyumluluk Kaydi", excerpt: "Onceki yayin tum uyumluluk kontrollerini basariyla gecmistir.", source: "Denetim Izi", kind: "log" as const },
    ],
    auditItems: [
      { id: "audit-1", actor: "human" as const, title: "Talep Olusturuldu", timestamp: "2024-01-15 10:00", summary: "v2.3.1 surumu icin yayin onayi talep edildi" },
      { id: "audit-2", actor: "ai" as const, title: "Otomatik Inceleme", timestamp: "2024-01-15 10:05", summary: "Otomatik kontroller basariyla tamamlandi", status: "approved" as const },
    ],
  },
  AIGuidedAuthoring: {
    title: "AI Yazim Asistani",
    description: "AI rehberli is akislari icin oneriler ve prompt olustirma.",
    confidenceLabel: "MEVCUT GUVEN",
    recommendations: [
      { id: "rec-1", title: "Giris Bolumu Ekle", summary: "Belgenin basina okuyucuyu yonlendirecek bir giris paragrafi eklenmesi onerilir.", confidenceLevel: "high" },
      { id: "rec-2", title: "Teknik Terimler Sozlugu", summary: "Kullanilan teknik terimlerin aciklanmasi icin bir sozluk bolumu ekleyin.", confidenceLevel: "medium" },
      { id: "rec-3", title: "Gorsel Destek", summary: "Mimari diyagram veya akis semasi ile icerigi zenginlestirin.", confidenceLevel: "low" },
    ],
    commandItems: [
      { id: "cmd-1", title: "Ozetle", description: "Secili metni kisa ve oz olarak ozetler", group: "Duzenleme" },
      { id: "cmd-2", title: "Ton Degistir", description: "Metni resmi veya samimi tona donusturur", group: "Duzenleme" },
      { id: "cmd-3", title: "Cevir", description: "Metni Ingilizce veya Turkce'ye cevirir", group: "Araclar" },
    ],
  },
  AIActionAuditTimeline: {
    title: "Denetim zaman cizelgesi",
    items: [
      { id: "audit-1", title: "Olusturuldu", actor: "system" as const, timestamp: "2024-01-15 10:00", summary: "Talep sisteme kaydedildi" },
      { id: "audit-2", title: "Incelendi", actor: "human" as const, timestamp: "2024-01-15 11:30", summary: "Yonetici tarafindan incelendi", status: "observed" as const },
      { id: "audit-3", title: "Onaylandi", actor: "human" as const, timestamp: "2024-01-15 14:00", summary: "Mudur tarafindan onaylandi", status: "approved" as const },
    ],
  },

  /* ---- Search / Filter ---- */
  SearchFilterListing: {
    title: "Politika Envanteri",
    description: "Arama, filtre ve sonuc yuzeyini ayni recipe altinda toplar.",
    items: [
      React.createElement("div", { key: "r1", className: "flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3" },
        React.createElement("div", null,
          React.createElement("div", { className: "text-sm font-medium text-[var(--text-primary)]" }, "policy_autonomy.v1"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Governance · Aktif"),
        ),
        React.createElement("span", { className: "rounded-full bg-[var(--status-success-bg,#dcfce7)] px-2 py-0.5 text-[10px] font-medium text-[var(--status-success,#16a34a)]" }, "Ready"),
      ),
      React.createElement("div", { key: "r2", className: "flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3" },
        React.createElement("div", null,
          React.createElement("div", { className: "text-sm font-medium text-[var(--text-primary)]" }, "policy_secrets.v1"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Security · Aktif"),
        ),
        React.createElement("span", { className: "rounded-full bg-[var(--status-warning-bg,#fef3c7)] px-2 py-0.5 text-[10px] font-medium text-[var(--status-warning,#d97706)]" }, "Review"),
      ),
      React.createElement("div", { key: "r3", className: "flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3" },
        React.createElement("div", null,
          React.createElement("div", { className: "text-sm font-medium text-[var(--text-primary)]" }, "policy_ui_design_system.v1"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "UI/UX · Aktif"),
        ),
        React.createElement("span", { className: "rounded-full bg-[var(--status-success-bg,#dcfce7)] px-2 py-0.5 text-[10px] font-medium text-[var(--status-success,#16a34a)]" }, "Ready"),
      ),
    ],
    summaryItems: [
      { key: "total", label: "Toplam", value: "24", note: "Kayitli politika", tone: "info" },
      { key: "active", label: "Aktif", value: "18", note: "Uygulanan kural", tone: "success" },
      { key: "review", label: "Inceleme", value: "6", note: "Bekleyen onay", tone: "warning" },
    ],
    emptyStateLabel: "Eslesen sonuc bulunamadi. Filtrelerinizi degistirmeyi deneyin.",
    listTitle: "Sonuclar",
    listDescription: "Filtreye uyan politika listesi.",
    totalCount: 24,
    activeFilters: [
      { key: "status", label: "Durum", value: "Aktif", onRemove: () => {} },
      { key: "owner", label: "Sahip", value: "Governance", onRemove: () => {} },
    ],
    onClearAllFilters: () => {},
    sortOptions: [
      { key: "name", label: "Ad" },
      { key: "date", label: "Tarih" },
      { key: "status", label: "Durum" },
    ],
    activeSort: { key: "date", direction: "desc" as const },
    onSortChange: () => {},
    loading: false,
    size: "default",
    selectable: false,
    selectedKeys: [],
    onSelectionChange: () => {},
    onReload: () => {},
    toolbar: React.createElement("button", {
      type: "button",
      className: "inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-2.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted,#f1f5f9)]",
    }, React.createElement("svg", { width: 12, height: 12, viewBox: "0 0 12 12", fill: "none", "aria-hidden": "true" },
      React.createElement("path", { d: "M6 1.5V10.5M6 10.5L3 7.5M6 10.5L9 7.5", stroke: "currentColor", strokeWidth: "1.25", strokeLinecap: "round", strokeLinejoin: "round" }),
    ), "Disa Aktar"),
    "aria-label": "Politika arama sonuclari",
  },
  ReportFilterPanel: {
    submitLabel: "Filtrele",
    resetLabel: "Sifirla",
    children: React.createElement(React.Fragment, null,
      React.createElement("div", { className: "flex flex-col gap-1" },
        React.createElement("label", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "Tarih Araligi"),
        React.createElement("select", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-1.5 text-sm" },
          React.createElement("option", null, "Son 7 gun"),
          React.createElement("option", null, "Son 30 gun"),
          React.createElement("option", null, "Son 90 gun"),
        ),
      ),
      React.createElement("div", { className: "flex flex-col gap-1" },
        React.createElement("label", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "Departman"),
        React.createElement("select", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-1.5 text-sm" },
          React.createElement("option", null, "Tumu"),
          React.createElement("option", null, "Muhendislik"),
          React.createElement("option", null, "Pazarlama"),
        ),
      ),
    ),
  },

  /* ---- Notification (additional) ---- */
  NotificationDrawer: {
    open: true,
    disablePortal: true,
    title: "Bildirimler",
    items: [
      { id: "notif-d1", message: "Yeni surum yayinlandi", description: "v2.4.0 uretim ortamina alindi.", type: "info" as const, priority: "normal" as const, read: false, createdAt: Date.now() - 300000 },
      { id: "notif-d2", message: "Derleme tamamlandi", description: "CI/CD pipeline basariyla sonuclandi.", type: "success" as const, priority: "normal" as const, read: true, createdAt: Date.now() - 3600000 },
      { id: "notif-d3", message: "Disk kullanimi %90 uzerinde", description: "Sunucu depolama alani kritik seviyede.", type: "warning" as const, priority: "high" as const, read: false, createdAt: Date.now() - 7200000 },
    ],
  },
  NotificationPanel: {
    title: "Bildirimler",
    items: [
      { id: "notif-p1", message: "Yeni kullanici kaydi", description: "Ahmet Yilmaz sisteme eklendi.", type: "info" as const, priority: "normal" as const, read: false, createdAt: Date.now() - 120000 },
      { id: "notif-p2", message: "Rapor hazirlandi", description: "Aylik performans raporu indirilmeye hazir.", type: "success" as const, priority: "normal" as const, read: false, createdAt: Date.now() - 600000 },
      { id: "notif-p3", message: "Guvenlik uyarisi", description: "Basarisiz giris denemesi tespit edildi.", type: "error" as const, priority: "high" as const, pinned: true, read: false, createdAt: Date.now() - 1800000 },
    ],
    showFilters: true,
  },

  /* ---- Template components ---- */
  ActionBar: {
    items: [
      { value: "export", label: "Disa Aktar", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E4}") },
      { value: "archive", label: "Arsivle", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E6}") },
      { value: "delete", label: "Sil", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F5D1}\u{FE0F}") },
    ],
    size: "sm" as const,
    appearance: "ghost" as const,
    ariaLabel: "Toplu islem cubugu",
    startSlot: React.createElement("span", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "3 oge secildi"),
  },
  SectionTabs: {
    tabs: [
      { id: "general", label: "Genel", description: "Temel yapilandirma" },
      { id: "advanced", label: "Gelismis", description: "Gelismis ayarlar" },
      { id: "debug", label: "Hata Ayiklama", description: "Hata ayiklama secenekleri" },
    ],
    activeTabId: "general",
    onTabChange: () => {},
  },

  /* ---- Page template compositions (alias → PageLayout) ---- */
  "CRUD Template": {
    title: "Kullanici Yonetimi",
    description: "Organizasyondaki kullanicilar, roller ve izinleri yonetin.",
    pageWidth: "wide" as const,
    breadcrumbItems: [
      { label: "Yonetim", href: "#" },
      { label: "Kullanicilar" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3" },
        React.createElement("div", { className: "flex items-center gap-3" },
          React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-1.5 text-sm", placeholder: "Kullanici ara...", readOnly: true }),
          React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs" }, "Rol: Tumu"),
          React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs" }, "Durum: Aktif"),
        ),
        React.createElement("button", { className: "rounded-lg bg-[var(--action-primary,#2563eb)] px-4 py-1.5 text-xs font-medium text-white" }, "+ Kullanici Ekle"),
      ),
      React.createElement("div", { className: "grid grid-cols-4 gap-3" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--text-primary)]" }, "1.248"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Toplam Kullanici"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--status-success,#16a34a)]" }, "1.102"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Aktif"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--status-warning,#d97706)]" }, "98"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Beklemede"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--text-secondary)]" }, "48"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Devre Disi"),
        ),
      ),
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] overflow-hidden" },
        React.createElement("table", { className: "w-full text-sm" },
          React.createElement("thead", null,
            React.createElement("tr", { className: "border-b border-[var(--border-subtle)] bg-[var(--surface-muted)]" },
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "Ad Soyad"),
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "E-posta"),
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "Rol"),
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "Durum"),
            ),
          ),
          React.createElement("tbody", null,
            React.createElement("tr", { className: "border-b border-[var(--border-subtle)]" },
              React.createElement("td", { className: "px-4 py-2.5 font-medium" }, "Ayse Demir"),
              React.createElement("td", { className: "px-4 py-2.5 text-[var(--text-secondary)]" }, "ayse@sirket.com"),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs" }, "Yonetici")),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "inline-block h-2 w-2 rounded-full bg-[var(--status-success,#16a34a)]" }), " Aktif"),
            ),
            React.createElement("tr", { className: "border-b border-[var(--border-subtle)]" },
              React.createElement("td", { className: "px-4 py-2.5 font-medium" }, "Mehmet Kaya"),
              React.createElement("td", { className: "px-4 py-2.5 text-[var(--text-secondary)]" }, "mehmet@sirket.com"),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs" }, "Duzenleyici")),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "inline-block h-2 w-2 rounded-full bg-[var(--status-success,#16a34a)]" }), " Aktif"),
            ),
            React.createElement("tr", null,
              React.createElement("td", { className: "px-4 py-2.5 font-medium" }, "Fatma Celik"),
              React.createElement("td", { className: "px-4 py-2.5 text-[var(--text-secondary)]" }, "fatma@sirket.com"),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs" }, "Izleyici")),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "inline-block h-2 w-2 rounded-full bg-[var(--status-warning,#d97706)]" }), " Beklemede"),
            ),
          ),
        ),
      ),
    ),
  },
  "Dashboard Template": {
    title: "Operasyon Panosu",
    description: "Temel performans metrikleri ve sistem sagligi genel gorunumu.",
    pageWidth: "wide" as const,
    breadcrumbItems: [
      { label: "Ana Sayfa", href: "#" },
      { label: "Pano" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "grid grid-cols-4 gap-3" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Gelir"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--text-primary)]" }, "\u20BA1.24M"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--status-success,#16a34a)]" }, "\u2191 %12.3 gecen aya gore"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Aktif Kullanici"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--text-primary)]" }, "8.432"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--status-success,#16a34a)]" }, "\u2191 %5.7 gecen aya gore"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Calisma Suresi"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--status-success,#16a34a)]" }, "%99.97"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--text-secondary)]" }, "Son 30 gun"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Acik Talepler"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--status-warning,#d97706)]" }, "23"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--status-error,#dc2626)]" }, "\u2191 3 dunden beri"),
        ),
      ),
      React.createElement("div", { className: "grid grid-cols-2 gap-4" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "mb-3 text-sm font-semibold text-[var(--text-primary)]" }, "Son Etkinlik"),
          React.createElement("div", { className: "space-y-2" },
            React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
              React.createElement("span", null, "v2.4.1 dagitimi tamamlandi"),
              React.createElement("span", { className: "text-[var(--text-secondary)]" }, "2 dk once"),
            ),
            React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
              React.createElement("span", null, "Yeni kullanici kayit artisi tespit edildi"),
              React.createElement("span", { className: "text-[var(--text-secondary)]" }, "15 dk once"),
            ),
            React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
              React.createElement("span", null, "Veritabani yedeklemesi tamamlandi"),
              React.createElement("span", { className: "text-[var(--text-secondary)]" }, "1 saat once"),
            ),
          ),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "mb-3 text-sm font-semibold text-[var(--text-primary)]" }, "Sistem Sagligi"),
          React.createElement("div", { className: "space-y-3" },
            React.createElement("div", null,
              React.createElement("div", { className: "flex justify-between text-xs mb-1" }, React.createElement("span", null, "API Sunucusu"), React.createElement("span", { className: "text-[var(--status-success,#16a34a)]" }, "Saglikli")),
              React.createElement("div", { className: "h-2 rounded-full bg-[var(--surface-muted)]" }, React.createElement("div", { className: "h-2 rounded-full bg-[var(--status-success,#16a34a)]", style: { width: "99%" } })),
            ),
            React.createElement("div", null,
              React.createElement("div", { className: "flex justify-between text-xs mb-1" }, React.createElement("span", null, "Veritabani"), React.createElement("span", { className: "text-[var(--status-success,#16a34a)]" }, "Saglikli")),
              React.createElement("div", { className: "h-2 rounded-full bg-[var(--surface-muted)]" }, React.createElement("div", { className: "h-2 rounded-full bg-[var(--status-success,#16a34a)]", style: { width: "95%" } })),
            ),
            React.createElement("div", null,
              React.createElement("div", { className: "flex justify-between text-xs mb-1" }, React.createElement("span", null, "CDN"), React.createElement("span", { className: "text-[var(--status-warning,#d97706)]" }, "Dusuk Performans")),
              React.createElement("div", { className: "h-2 rounded-full bg-[var(--surface-muted)]" }, React.createElement("div", { className: "h-2 rounded-full bg-[var(--status-warning,#d97706)]", style: { width: "78%" } })),
            ),
          ),
        ),
      ),
    ),
  },
  "Detail Template": {
    title: "Siparis #SIP-2024-1847",
    description: "Varlik ozeti ve meta verilerle siparis detay gorunumu.",
    breadcrumbItems: [
      { label: "Siparisler", href: "#" },
      { label: "#SIP-2024-1847" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
        React.createElement("div", { className: "flex items-center justify-between mb-3" },
          React.createElement("div", null,
            React.createElement("div", { className: "text-base font-semibold text-[var(--text-primary)]" }, "Acme Teknoloji A.S."),
            React.createElement("div", { className: "text-sm text-[var(--text-secondary)]" }, "Kurumsal Musteri \u2014 Istanbul, TR"),
          ),
          React.createElement("span", { className: "rounded-full bg-[var(--status-success,#16a34a)]/10 px-3 py-1 text-xs font-medium text-[var(--status-success,#16a34a)]" }, "Teslim Edildi"),
        ),
        React.createElement("div", { className: "grid grid-cols-3 gap-4 text-sm" },
          React.createElement("div", null, React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Siparis Tarihi"), React.createElement("div", { className: "font-medium" }, "2024-03-15")),
          React.createElement("div", null, React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Toplam Tutar"), React.createElement("div", { className: "font-medium" }, "\u20BA45.200,00")),
          React.createElement("div", null, React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Odeme"), React.createElement("div", { className: "font-medium" }, "Havale/EFT")),
        ),
      ),
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
        React.createElement("div", { className: "text-sm font-semibold text-[var(--text-primary)] mb-3" }, "Kalemler"),
        React.createElement("div", { className: "space-y-2" },
          React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
            React.createElement("span", { className: "font-medium" }, "Kurumsal Lisans (Yillik)"),
            React.createElement("span", null, "1 x \u20BA35.000,00"),
          ),
          React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
            React.createElement("span", { className: "font-medium" }, "Premium Destek"),
            React.createElement("span", null, "1 x \u20BA10.200,00"),
          ),
        ),
      ),
    ),
    detail: React.createElement("div", { className: "space-y-3 p-3" },
      React.createElement("div", { className: "text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider" }, "Zaman Cizelgesi"),
      React.createElement("div", { className: "space-y-2" },
        React.createElement("div", { className: "flex gap-2 text-xs" },
          React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Mar 15"),
          React.createElement("span", null, "Siparis olusturuldu"),
        ),
        React.createElement("div", { className: "flex gap-2 text-xs" },
          React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Mar 16"),
          React.createElement("span", null, "Odeme alindi"),
        ),
        React.createElement("div", { className: "flex gap-2 text-xs" },
          React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Mar 17"),
          React.createElement("span", null, "Lisans aktiflestirildi"),
        ),
      ),
    ),
  },
  "Settings Template": {
    title: "Organizasyon Ayarlari",
    description: "Organizasyon tercihleri, guvenlik ve bildirim politikalarini yapilandirin.",
    stickyHeader: true,
    breadcrumbItems: [
      { label: "Yonetim", href: "#" },
      { label: "Ayarlar" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "flex gap-4 border-b border-[var(--border-subtle)] pb-2 text-sm" },
        React.createElement("span", { className: "border-b-2 border-[var(--action-primary,#2563eb)] pb-2 font-medium text-[var(--action-primary,#2563eb)]" }, "Genel"),
        React.createElement("span", { className: "pb-2 text-[var(--text-secondary)] cursor-pointer" }, "Guvenlik"),
        React.createElement("span", { className: "pb-2 text-[var(--text-secondary)] cursor-pointer" }, "Bildirimler"),
        React.createElement("span", { className: "pb-2 text-[var(--text-secondary)] cursor-pointer" }, "Entegrasyonlar"),
      ),
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
        React.createElement("div", { className: "text-sm font-semibold text-[var(--text-primary)] mb-4" }, "Organizasyon Profili"),
        React.createElement("div", { className: "space-y-3" },
          React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("div", { className: "text-sm font-medium" }, "Organizasyon Adi"),
              React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Acme Teknoloji A.S."),
            ),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-1 text-xs" }, "Duzenle"),
          ),
          React.createElement("div", { className: "border-t border-[var(--border-subtle)] pt-3 flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("div", { className: "text-sm font-medium" }, "Varsayilan Saat Dilimi"),
              React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Europe/Istanbul (UTC+3)"),
            ),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-1 text-xs" }, "Duzenle"),
          ),
          React.createElement("div", { className: "border-t border-[var(--border-subtle)] pt-3 flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("div", { className: "text-sm font-medium" }, "Iki Faktorlu Dogrulama"),
              React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Tum yonetici kullanicilar icin zorunlu"),
            ),
            React.createElement("div", { className: "h-5 w-9 rounded-full bg-[var(--status-success,#16a34a)] relative" },
              React.createElement("div", { className: "absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-[var(--surface-default,#fff)] shadow" }),
            ),
          ),
        ),
      ),
    ),
  },
  "Command Workspace": {
    title: "Komut Merkezi",
    description: "Birlesik calisma alanindan arama yapin, son calismalara gozatin ve islemleri yurutun.",
    pageWidth: "wide" as const,
    stickyHeader: true,
    breadcrumbItems: [
      { label: "Calisma Alani", href: "#" },
      { label: "Komutlar" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3" },
        React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2" },
          React.createElement("span", { className: "text-[var(--text-secondary)]" }, "\u{1F50D}"),
          React.createElement("span", { className: "text-sm text-[var(--text-secondary)]" }, "Komut, varlik veya islem ara..."),
          React.createElement("span", { className: "ml-auto rounded border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]" }, "⌘K"),
        ),
      ),
      React.createElement("div", { className: "grid grid-cols-2 gap-4" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "mb-3 text-sm font-semibold text-[var(--text-primary)]" }, "Son Calismalar"),
          React.createElement("div", { className: "space-y-2" },
            React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs cursor-pointer" },
              React.createElement("span", { className: "rounded bg-[var(--action-primary,#2563eb)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--action-primary,#2563eb)]" }, "SIPARIS"),
              React.createElement("span", { className: "font-medium" }, "#SIP-2024-1847"),
              React.createElement("span", { className: "ml-auto text-[var(--text-secondary)]" }, "2 dk once"),
            ),
            React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs cursor-pointer" },
              React.createElement("span", { className: "rounded bg-[var(--status-success,#16a34a)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--status-success,#16a34a)]" }, "KULLANICI"),
              React.createElement("span", { className: "font-medium" }, "Ayse Demir"),
              React.createElement("span", { className: "ml-auto text-[var(--text-secondary)]" }, "15 dk once"),
            ),
            React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs cursor-pointer" },
              React.createElement("span", { className: "rounded bg-[var(--status-warning,#d97706)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--status-warning,#d97706)]" }, "TALEP"),
              React.createElement("span", { className: "font-medium" }, "TLP-5523 CDN gecikmesi"),
              React.createElement("span", { className: "ml-auto text-[var(--text-secondary)]" }, "1 saat once"),
            ),
          ),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "mb-3 text-sm font-semibold text-[var(--text-primary)]" }, "Hizli Islemler"),
          React.createElement("div", { className: "grid grid-cols-2 gap-2" },
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Yeni Rapor"),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Kullanici Ekle"),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Dagitim Yap"),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Veri Aktar"),
          ),
        ),
      ),
    ),
  },

  /* ---- MenuBar recipe aliases (no-space keys) ---- */
  ActionHeader: {
    items: [
      { value: "save", label: "Kaydet", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4BE}") },
      { value: "discard", label: "Iptal", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{274C}") },
      { value: "publish", label: "Yayinla", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F680}") },
    ],
    size: "sm" as const,
    appearance: "ghost" as const,
    ariaLabel: "Islem basligi",
  },
  AppHeader: {
    items: [
      { value: "home", label: "Ana Sayfa", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F3E0}") },
      { value: "projects", label: "Projeler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4C1}") },
      { value: "team", label: "Ekip", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F465}") },
      { value: "settings", label: "Ayarlar", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{2699}\u{FE0F}") },
    ],
    value: "home",
    size: "md" as const,
    appearance: "default" as const,
    ariaLabel: "Uygulama basligi",
    startSlot: React.createElement("span", { className: "text-sm font-bold text-[var(--text-primary)]" }, "MFE Platform"),
  },
  CommandHeader: {
    items: [
      { value: "search", label: "Ara", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F50D}") },
      { value: "filter", label: "Filtrele", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F3AF}") },
      { value: "sort", label: "Sirala", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{2195}\u{FE0F}") },
    ],
    size: "sm" as const,
    appearance: "outline" as const,
    enableSearchHandoff: true,
    searchPlaceholder: "Komut ara...",
    ariaLabel: "Komut basligi",
  },
  DesktopMenubar: {
    items: [
      { value: "file", label: "Dosya", menuItems: [
        { value: "new", label: "Yeni" },
        { value: "open", label: "Ac" },
        { value: "save", label: "Kaydet" },
      ] },
      { value: "edit", label: "Duzenle", menuItems: [
        { value: "undo", label: "Geri Al" },
        { value: "redo", label: "Yinele" },
        { value: "cut", label: "Kes" },
        { value: "copy", label: "Kopyala" },
      ] },
      { value: "view", label: "Gorunum", menuItems: [
        { value: "zoom-in", label: "Yakinlastir" },
        { value: "zoom-out", label: "Uzaklastir" },
        { value: "fullscreen", label: "Tam Ekran" },
      ] },
      { value: "help", label: "Yardim" },
    ],
    size: "sm" as const,
    appearance: "ghost" as const,
    submenuTrigger: "hover" as const,
    ariaLabel: "Masaustu menu cubugu",
  },
  NavigationMenu: {
    items: [
      { value: "dashboard", label: "Kontrol Paneli", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4CA}") },
      { value: "orders", label: "Siparisler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E6}"), badge: React.createElement("span", { className: "rounded-full bg-[var(--status-error,#dc2626)] px-1.5 py-0.5 text-[10px] text-white" }, "3") },
      { value: "customers", label: "Musteriler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F465}") },
      { value: "products", label: "Urunler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E6}") },
      { value: "reports", label: "Raporlar", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4C8}") },
    ],
    value: "dashboard",
    size: "md" as const,
    labelVisibility: "always" as const,
    ariaLabel: "Ana navigasyon menusu",
  },

  /* ---- Overlay components (missing entries) ---- */
  DetailDrawer: {
    open: true,
    title: "Siparis Detayi",
    subtitle: "#SIP-2024-0847",
    size: "lg" as const,
    disablePortal: true,
    onClose: () => {},
    sections: [
      {
        key: "overview",
        title: "Genel Bilgiler",
        content: React.createElement("div", { className: "space-y-2 text-sm" },
          React.createElement("div", { className: "flex justify-between" },
            React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Musteri"),
            React.createElement("span", { className: "font-medium" }, "Acme Teknoloji A.S."),
          ),
          React.createElement("div", { className: "flex justify-between" },
            React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Tarih"),
            React.createElement("span", { className: "font-medium" }, "2024-03-15"),
          ),
          React.createElement("div", { className: "flex justify-between" },
            React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Tutar"),
            React.createElement("span", { className: "font-medium" }, "\u20BA45.200,00"),
          ),
          React.createElement("div", { className: "flex justify-between" },
            React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Durum"),
            React.createElement("span", { className: "rounded-full bg-[var(--status-success,#16a34a)]/10 px-2 py-0.5 text-xs font-medium text-[var(--status-success,#16a34a)]" }, "Tamamlandi"),
          ),
        ),
      },
      {
        key: "items",
        title: "Kalemler",
        content: React.createElement("div", { className: "space-y-2" },
          React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
            React.createElement("span", { className: "font-medium" }, "Kurumsal Lisans (Yillik)"),
            React.createElement("span", null, "1 x ₺35.000,00"),
          ),
          React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
            React.createElement("span", { className: "font-medium" }, "Premium Destek"),
            React.createElement("span", null, "1 x ₺10.200,00"),
          ),
        ),
      },
    ],
    tags: React.createElement("span", { className: "rounded-full bg-[var(--status-success,#16a34a)]/10 px-2 py-0.5 text-xs font-medium text-[var(--status-success,#16a34a)]" }, "Onaylandi"),
  },
  FormDrawer: {
    open: true,
    title: "Yeni Musteri Ekle",
    subtitle: "Musteri bilgilerini giriniz",
    size: "md" as const,
    placement: "right" as const,
    onClose: () => {},
    children: React.createElement("div", { className: "space-y-4 p-4" },
      React.createElement("div", { className: "flex flex-col gap-1" },
        React.createElement("label", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "Sirket Adi"),
        React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm", placeholder: "ornek: Acme Teknoloji A.S.", readOnly: true }),
      ),
      React.createElement("div", { className: "flex flex-col gap-1" },
        React.createElement("label", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "Yetkili Kisi"),
        React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm", placeholder: "Ad Soyad", readOnly: true }),
      ),
      React.createElement("div", { className: "flex flex-col gap-1" },
        React.createElement("label", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "E-posta"),
        React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm", placeholder: "info@sirket.com", readOnly: true }),
      ),
      React.createElement("div", { className: "flex flex-col gap-1" },
        React.createElement("label", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "Telefon"),
        React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm", placeholder: "+90 212 555 0000", readOnly: true }),
      ),
    ),
    footer: React.createElement("div", { className: "flex justify-end gap-2 p-4 border-t border-[var(--border-subtle)]" },
      React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-4 py-1.5 text-xs" }, "Iptal"),
      React.createElement("button", { className: "rounded-lg bg-[var(--action-primary,#2563eb)] px-4 py-1.5 text-xs font-medium text-white" }, "Kaydet"),
    ),
  },

  /* ---- Advanced data grids ---- */
  EntityGridTemplate: {
    gridId: "demo-entity-grid",
    gridSchemaVersion: 1,
    columnDefs: [
      { field: "name", headerName: "Ad Soyad", flex: 1 },
      { field: "department", headerName: "Departman", flex: 1 },
      { field: "role", headerName: "Rol", width: 150 },
      { field: "status", headerName: "Durum", width: 120 },
    ],
    rowData: [
      { name: "Ayse Demir", department: "Muhendislik", role: "Kidemli Gelistirici", status: "Aktif" },
      { name: "Mehmet Kaya", department: "Tasarim", role: "UX Tasarimci", status: "Aktif" },
      { name: "Fatma Celik", department: "Urun", role: "Urun Yoneticisi", status: "Izinli" },
      { name: "Ali Yildiz", department: "Muhendislik", role: "DevOps Muhendisi", status: "Aktif" },
    ],
    total: 4,
    page: 1,
    pageSize: 10,
    messages: {
      quickFilterPlaceholder: "Hizli filtre...",
      quickFilterLabel: "Hizli Filtre",
      variantLabel: "Gorunum",
      densityToggleLabel: "Yogunluk",
      comfortableDensityLabel: "Rahat",
      compactDensityLabel: "Kompakt",
      densityResetLabel: "Sifirla",
      fullscreenTooltip: "Tam ekran",
      resetFiltersLabel: "Filtreleri sifirla",
      overlayLoadingLabel: "Yukleniyor...",
      overlayNoRowsLabel: "Kayit bulunamadi",
      pageSizeLabel: "Sayfa basina:",
      recordCountLabel: "kayit",
      firstPageLabel: "Ilk sayfa",
      previousPageLabel: "Onceki",
      nextPageLabel: "Sonraki",
      lastPageLabel: "Son sayfa",
    },
  },
  AgGridServer: {
    columnDefs: [
      { field: "orderId", headerName: "Siparis No", width: 140 },
      { field: "customer", headerName: "Musteri", flex: 1 },
      { field: "total", headerName: "Tutar", width: 120 },
      { field: "status", headerName: "Durum", width: 120 },
    ],
    getData: () => Promise.resolve({
      rows: [
        { orderId: "SIP-001", customer: "Acme A.S.", total: "₺12.500", status: "Tamamlandi" },
        { orderId: "SIP-002", customer: "Beta Ltd.", total: "₺8.750", status: "Beklemede" },
        { orderId: "SIP-003", customer: "Gamma Holding", total: "₺23.100", status: "Kargoda" },
      ],
      total: 3,
    }),
    height: 300,
  },

  /* ---- Theme ---- */
  ThemePresetCompare: {
    title: "Tema Karsilastirmasi",
    description: "Iki tema presetini eksen bazinda karsilastirin.",
    leftPreset: {
      presetId: "light-default",
      label: "Acik Tema",
      appearance: "light",
      density: "comfortable",
      intent: "neutral",
      isHighContrast: false,
      isDefaultMode: true,
      themeMode: "light",
    },
    rightPreset: {
      presetId: "dark-compact",
      label: "Koyu Kompakt",
      appearance: "dark",
      density: "compact",
      intent: "branded",
      isHighContrast: true,
      isDefaultMode: false,
      themeMode: "dark",
    },
    axes: ["appearance", "density", "intent", "contrast"],
  },

  /* ---- Toast ---- */
  ToastProvider: {
    position: "top-right" as const,
    duration: 4000,
    maxVisible: 3,
    children: React.createElement("div", { className: "space-y-3 p-4" },
      React.createElement("div", { className: "text-sm font-medium text-[var(--text-primary)]" }, "Toast Provider Demo"),
      React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "ToastProvider uygulamayi sarar ve useToast hook'u ile bildirim gostermeyi saglar."),
      React.createElement("div", { className: "flex gap-2 mt-3" },
        React.createElement("div", { className: "rounded-lg border border-[var(--state-success-text)]/20 bg-[var(--surface-default)] px-3 py-2 text-xs" },
          React.createElement("span", { className: "font-medium text-[var(--state-success-text)]" }, "Basarili: "),
          "Kayit basariyla eklendi.",
        ),
        React.createElement("div", { className: "rounded-lg border border-[var(--state-info-text)]/20 bg-[var(--surface-default)] px-3 py-2 text-xs" },
          React.createElement("span", { className: "font-medium text-[var(--state-info-text)]" }, "Bilgi: "),
          "Yeni guncelleme mevcut.",
        ),
      ),
    ),
  },

  /* ---- Space-separated MenuBar alias keys (point to their PascalCase variants) ---- */
  "App Header": {
    items: [
      { value: "home", label: "Ana Sayfa", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F3E0}") },
      { value: "projects", label: "Projeler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4C1}") },
      { value: "team", label: "Ekip", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F465}") },
      { value: "settings", label: "Ayarlar", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{2699}\u{FE0F}") },
    ],
    value: "home",
    size: "md" as const,
    appearance: "default" as const,
    ariaLabel: "Uygulama basligi",
    startSlot: React.createElement("span", { className: "text-sm font-bold text-[var(--text-primary)]" }, "MFE Platform"),
  },
  "Search / Command Header": {
    items: [
      { value: "search", label: "Ara", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F50D}") },
      { value: "filter", label: "Filtrele", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F3AF}") },
      { value: "sort", label: "Sirala", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{2195}\u{FE0F}") },
    ],
    size: "sm" as const,
    appearance: "outline" as const,
    enableSearchHandoff: true,
    searchPlaceholder: "Komut ara...",
    ariaLabel: "Komut basligi",
  },
  "Action Header": {
    items: [
      { value: "save", label: "Kaydet", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4BE}") },
      { value: "discard", label: "Iptal", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{274C}") },
      { value: "publish", label: "Yayinla", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F680}") },
    ],
    size: "sm" as const,
    appearance: "ghost" as const,
    ariaLabel: "Islem basligi",
  },
  "Action Bar": {
    items: [
      { value: "export", label: "Disa Aktar", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E4}") },
      { value: "archive", label: "Arsivle", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E6}") },
      { value: "delete", label: "Sil", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F5D1}\u{FE0F}") },
    ],
    size: "sm" as const,
    appearance: "ghost" as const,
    ariaLabel: "Toplu islem cubugu",
    startSlot: React.createElement("span", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "3 oge secildi"),
  },
  "Navigation Menu": {
    items: [
      { value: "dashboard", label: "Kontrol Paneli", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4CA}") },
      { value: "orders", label: "Siparisler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E6}"), badge: React.createElement("span", { className: "rounded-full bg-[var(--status-error,#dc2626)] px-1.5 py-0.5 text-[10px] text-white" }, "3") },
      { value: "customers", label: "Musteriler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F465}") },
      { value: "products", label: "Urunler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E6}") },
      { value: "reports", label: "Raporlar", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4C8}") },
    ],
    value: "dashboard",
    size: "md" as const,
    labelVisibility: "always" as const,
    ariaLabel: "Ana navigasyon menusu",
  },
  "Desktop Menubar": {
    items: [
      { value: "file", label: "Dosya", menuItems: [
        { value: "new", label: "Yeni" },
        { value: "open", label: "Ac" },
        { value: "save", label: "Kaydet" },
      ] },
      { value: "edit", label: "Duzenle", menuItems: [
        { value: "undo", label: "Geri Al" },
        { value: "redo", label: "Yinele" },
        { value: "cut", label: "Kes" },
        { value: "copy", label: "Kopyala" },
      ] },
      { value: "view", label: "Gorunum", menuItems: [
        { value: "zoom-in", label: "Yakinlastir" },
        { value: "zoom-out", label: "Uzaklastir" },
        { value: "fullscreen", label: "Tam Ekran" },
      ] },
      { value: "help", label: "Yardim" },
    ],
    size: "sm" as const,
    appearance: "ghost" as const,
    submenuTrigger: "hover" as const,
    ariaLabel: "Masaustu menu cubugu",
  },

  /* ---- Non-space alias keys for templates (point to same PageLayout-based preview) ---- */
  CrudTemplate: {
    title: "Kullanici Yonetimi",
    description: "Organizasyondaki kullanicilar, roller ve izinleri yonetin.",
    pageWidth: "wide" as const,
    breadcrumbItems: [
      { label: "Yonetim", href: "#" },
      { label: "Kullanicilar" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3" },
        React.createElement("div", { className: "flex items-center gap-3" },
          React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-1.5 text-sm", placeholder: "Kullanici ara...", readOnly: true }),
          React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs" }, "Rol: Tumu"),
          React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs" }, "Durum: Aktif"),
        ),
        React.createElement("button", { className: "rounded-lg bg-[var(--action-primary,#2563eb)] px-4 py-1.5 text-xs font-medium text-white" }, "+ Kullanici Ekle"),
      ),
      React.createElement("div", { className: "grid grid-cols-3 gap-3" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--text-primary)]" }, "248"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Toplam Kullanici"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--status-success,#16a34a)]" }, "210"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Aktif"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--status-warning,#d97706)]" }, "38"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Beklemede"),
        ),
      ),
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] overflow-hidden" },
        React.createElement("table", { className: "w-full text-sm" },
          React.createElement("thead", null,
            React.createElement("tr", { className: "border-b border-[var(--border-subtle)] bg-[var(--surface-muted)]" },
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "Ad Soyad"),
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "E-posta"),
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "Rol"),
            ),
          ),
          React.createElement("tbody", null,
            React.createElement("tr", { className: "border-b border-[var(--border-subtle)]" },
              React.createElement("td", { className: "px-4 py-2.5 font-medium" }, "Ayse Demir"),
              React.createElement("td", { className: "px-4 py-2.5 text-[var(--text-secondary)]" }, "ayse@sirket.com"),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs" }, "Yonetici")),
            ),
            React.createElement("tr", null,
              React.createElement("td", { className: "px-4 py-2.5 font-medium" }, "Mehmet Kaya"),
              React.createElement("td", { className: "px-4 py-2.5 text-[var(--text-secondary)]" }, "mehmet@sirket.com"),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs" }, "Duzenleyici")),
            ),
          ),
        ),
      ),
    ),
  },
  DashboardTemplate: {
    title: "Operasyon Panosu",
    description: "Temel performans metrikleri ve sistem sagligi genel gorunumu.",
    pageWidth: "wide" as const,
    breadcrumbItems: [
      { label: "Ana Sayfa", href: "#" },
      { label: "Pano" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "grid grid-cols-4 gap-3" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Gelir"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--text-primary)]" }, "₺1.24M"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--status-success,#16a34a)]" }, "\u{2191} %12.3 gecen aya gore"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Aktif Kullanici"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--text-primary)]" }, "8.432"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--status-success,#16a34a)]" }, "\u{2191} %5.7 gecen aya gore"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Calisma Suresi"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--status-success,#16a34a)]" }, "%99.97"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--text-secondary)]" }, "Son 30 gun"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Acik Talepler"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--status-warning,#d97706)]" }, "23"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--status-error,#dc2626)]" }, "\u{2191} 3 dunden beri"),
        ),
      ),
    ),
  },
  DetailTemplate: {
    title: "Siparis #SIP-2024-1847",
    description: "Siparis detay gorunumu.",
    breadcrumbItems: [
      { label: "Siparisler", href: "#" },
      { label: "#SIP-2024-1847" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
        React.createElement("div", { className: "flex items-center justify-between mb-3" },
          React.createElement("div", null,
            React.createElement("div", { className: "text-base font-semibold text-[var(--text-primary)]" }, "Acme Teknoloji A.S."),
            React.createElement("div", { className: "text-sm text-[var(--text-secondary)]" }, "Kurumsal Musteri — Istanbul, TR"),
          ),
          React.createElement("span", { className: "rounded-full bg-[var(--status-success,#16a34a)]/10 px-3 py-1 text-xs font-medium text-[var(--status-success,#16a34a)]" }, "Teslim Edildi"),
        ),
        React.createElement("div", { className: "grid grid-cols-3 gap-4 text-sm" },
          React.createElement("div", null, React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Siparis Tarihi"), React.createElement("div", { className: "font-medium" }, "2024-03-15")),
          React.createElement("div", null, React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Toplam Tutar"), React.createElement("div", { className: "font-medium" }, "₺45.200,00")),
          React.createElement("div", null, React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Odeme"), React.createElement("div", { className: "font-medium" }, "Havale/EFT")),
        ),
      ),
    ),
  },
  SettingsTemplate: {
    title: "Organizasyon Ayarlari",
    description: "Organizasyon tercihleri, guvenlik ve bildirim politikalarini yapilandirin.",
    stickyHeader: true,
    breadcrumbItems: [
      { label: "Yonetim", href: "#" },
      { label: "Ayarlar" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "flex gap-4 border-b border-[var(--border-subtle)] pb-2 text-sm" },
        React.createElement("span", { className: "border-b-2 border-[var(--action-primary,#2563eb)] pb-2 font-medium text-[var(--action-primary,#2563eb)]" }, "Genel"),
        React.createElement("span", { className: "pb-2 text-[var(--text-secondary)] cursor-pointer" }, "Guvenlik"),
        React.createElement("span", { className: "pb-2 text-[var(--text-secondary)] cursor-pointer" }, "Bildirimler"),
      ),
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
        React.createElement("div", { className: "text-sm font-semibold text-[var(--text-primary)] mb-4" }, "Organizasyon Profili"),
        React.createElement("div", { className: "space-y-3" },
          React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("div", { className: "text-sm font-medium" }, "Organizasyon Adi"),
              React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Acme Teknoloji A.S."),
            ),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-1 text-xs" }, "Duzenle"),
          ),
          React.createElement("div", { className: "border-t border-[var(--border-subtle)] pt-3 flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("div", { className: "text-sm font-medium" }, "Varsayilan Saat Dilimi"),
              React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Europe/Istanbul (UTC+3)"),
            ),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-1 text-xs" }, "Duzenle"),
          ),
        ),
      ),
    ),
  },
  CommandWorkspace: {
    title: "Komut Merkezi",
    description: "Arama, son calismalara gozatin ve birlesik calisma alanindan islemleri yurutun.",
    pageWidth: "wide" as const,
    stickyHeader: true,
    breadcrumbItems: [
      { label: "Calisma Alani", href: "#" },
      { label: "Komutlar" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3" },
        React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2" },
          React.createElement("span", { className: "text-[var(--text-secondary)]" }, "\u{1F50D}"),
          React.createElement("span", { className: "text-sm text-[var(--text-secondary)]" }, "Komut, varlik veya islem ara..."),
          React.createElement("span", { className: "ml-auto rounded border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]" }, "\u{2318}K"),
        ),
      ),
      React.createElement("div", { className: "grid grid-cols-2 gap-4" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "mb-3 text-sm font-semibold text-[var(--text-primary)]" }, "Son Calismalar"),
          React.createElement("div", { className: "space-y-2" },
            React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs cursor-pointer" },
              React.createElement("span", { className: "rounded bg-[var(--action-primary,#2563eb)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--action-primary,#2563eb)]" }, "SIPARIS"),
              React.createElement("span", { className: "font-medium" }, "#SIP-2024-1847"),
              React.createElement("span", { className: "ml-auto text-[var(--text-secondary)]" }, "2 dk once"),
            ),
            React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs cursor-pointer" },
              React.createElement("span", { className: "rounded bg-[var(--status-success,#16a34a)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--status-success,#16a34a)]" }, "KULLANICI"),
              React.createElement("span", { className: "font-medium" }, "Ayse Demir"),
              React.createElement("span", { className: "ml-auto text-[var(--text-secondary)]" }, "15 dk once"),
            ),
          ),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "mb-3 text-sm font-semibold text-[var(--text-primary)]" }, "Hizli Islemler"),
          React.createElement("div", { className: "grid grid-cols-2 gap-2" },
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Yeni Rapor"),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Kullanici Ekle"),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Dagitim Yap"),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Veri Aktar"),
          ),
        ),
      ),
    ),
  },
};

/* ---- X-Charts default props ---- */
DEFAULT_PROPS.KPICard = { title: "Toplam Kullanici", value: "12,847", trend: { direction: "up", value: "+12.5%", positive: true } };
DEFAULT_PROPS.StatWidget = { label: "API Cagrilari", value: 45230, previousValue: 42100, format: "number" };
DEFAULT_PROPS.SparklineChart = { data: [10, 12, 8, 15, 13, 17, 20, 18, 22], type: "area" };
DEFAULT_PROPS.MiniChart = { data: [{ label: "Oca", value: 45 }, { label: "Sub", value: 52 }, { label: "Mar", value: 48 }], type: "bar" };
DEFAULT_PROPS.ChartContainer = { title: "Grafik Basligi", description: "Aciklama metni", height: 200, children: React.createElement("div", { className: "flex h-full items-center justify-center text-sm text-[var(--text-secondary)]" }, "Grafik icerigi burada gorunur") };
DEFAULT_PROPS.ChartLegend = { items: [{ label: "Web", color: "var(--action-primary,#3b82f6)", value: "45%" }, { label: "Mobile", color: "var(--state-success-text,#16a34a)", value: "30%" }, { label: "API", color: "var(--state-warning-text,#d97706)", value: "25%" }], direction: "horizontal" };
DEFAULT_PROPS.ChartDashboard = { columns: 3, gap: "md", children: React.createElement(React.Fragment, null, React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default)] p-4 text-sm" }, "Kart 1"), React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default)] p-4 text-sm" }, "Kart 2"), React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default)] p-4 text-sm" }, "Kart 3")) };
DEFAULT_PROPS.GaugeChart = { value: 72, min: 0, max: 100, label: "Performans" };
DEFAULT_PROPS.RadarChart = { data: [{ label: "Hiz", value: 80 }, { label: "Guvenilirlik", value: 90 }, { label: "Olceklenebilirlik", value: 70 }, { label: "Kullanilabilirlik", value: 85 }, { label: "Guvenlik", value: 75 }], categories: ["Hiz", "Guvenilirlik", "Olceklenebilirlik", "Kullanilabilirlik", "Guvenlik"] };

/* ---- X-Data-Grid default props ---- */
DEFAULT_PROPS.DataGridFilterChips = { filters: [{ id: "1", field: "status", label: "Durum", value: "Aktif" }, { id: "2", field: "role", label: "Rol", value: "Admin" }], onRemove: () => {}, onClearAll: () => {} };
DEFAULT_PROPS.DataGridSelectionBar = { selectedCount: 3, onClearSelection: () => {}, children: React.createElement("button", { className: "rounded bg-[var(--action-primary,#3b82f6)] px-3 py-1 text-xs text-white" }, "Toplu Sil") };

/* ---- X-Editor default props ---- */
DEFAULT_PROPS.RichTextEditor = { placeholder: "Icerik yazin...", minHeight: 200 };
DEFAULT_PROPS.SlashCommandMenu = { commands: [{ id: "h1", label: "Baslik 1", category: "Temel", execute: () => {} }, { id: "h2", label: "Baslik 2", category: "Temel", execute: () => {} }], isOpen: true, position: { top: 0, left: 0 }, selectedIndex: 0, onSelect: () => {}, onClose: () => {} };
DEFAULT_PROPS.MentionList = { items: [{ id: "1", label: "Ahmet Yilmaz" }, { id: "2", label: "Ayse Demir" }], isOpen: true, position: { top: 0, left: 0 }, selectedIndex: 0, onSelect: () => {}, onClose: () => {} };
DEFAULT_PROPS.EditorTableMenu = { onInsertTable: () => {}, onAddRowBefore: () => {}, onAddRowAfter: () => {}, onAddColBefore: () => {}, onAddColAfter: () => {}, onDeleteRow: () => {}, onDeleteCol: () => {}, onDeleteTable: () => {}, onMergeCells: () => {}, onSplitCell: () => {} };

/* ---- X-FormBuilder default props ---- */
DEFAULT_PROPS.FormRenderer = { schema: { id: "demo", title: "Kullanici Bilgileri", columns: 2, fields: [{ id: "name", type: "text", name: "name", label: "Ad Soyad", required: true, span: 1 }, { id: "email", type: "email", name: "email", label: "E-posta", required: true, span: 1 }, { id: "role", type: "select", name: "role", label: "Rol", options: [{ label: "Admin", value: "admin" }, { label: "Kullanici", value: "user" }], span: 1 }], submitLabel: "Kaydet" }, onSubmit: () => {} };
DEFAULT_PROPS.FormPreview = { schema: { id: "preview", title: "Form Onizleme", fields: [{ id: "name", type: "text", name: "name", label: "Ad Soyad" }] } };

/* ---- X-Kanban default props ---- */
DEFAULT_PROPS.KanbanCard = { card: { id: "1", title: "Gorev Basligi", description: "Gorev aciklamasi", priority: "high", assignee: "AY", tags: ["bug", "urgent"] } };
DEFAULT_PROPS.KanbanToolbar = { searchValue: "", onSearchChange: () => {}, onAddColumn: () => {} };
DEFAULT_PROPS.KanbanMetrics = { columns: [{ id: "todo", title: "Yapilacak", policy: { wipLimit: 5 } }, { id: "doing", title: "Yapiliyor", policy: { wipLimit: 3 } }, { id: "done", title: "Tamamlandi" }], cards: [{ id: "1", columnId: "todo", title: "Gorev 1" }, { id: "2", columnId: "todo", title: "Gorev 2" }, { id: "3", columnId: "doing", title: "Gorev 3" }] };

/* ---- X-Charts (AG Charts based — render with sample data) ---- */
DEFAULT_PROPS.ScatterChart = { data: [{ x: 10, y: 20 }, { x: 25, y: 35 }, { x: 40, y: 15 }, { x: 55, y: 50 }, { x: 70, y: 30 }], xKey: "x", yKey: "y", size: "md" };
DEFAULT_PROPS.TreemapChart = { data: [{ label: "Kategori A", value: 45 }, { label: "Kategori B", value: 30 }, { label: "Kategori C", value: 25 }], size: "md" };
DEFAULT_PROPS.HeatmapChart = { data: [{ x: "Pzt", y: "09:00", value: 5 }, { x: "Sal", y: "09:00", value: 8 }, { x: "Car", y: "09:00", value: 3 }, { x: "Pzt", y: "10:00", value: 7 }, { x: "Sal", y: "10:00", value: 2 }, { x: "Car", y: "10:00", value: 9 }], xKey: "x", yKey: "y", valueKey: "value", size: "md" };
DEFAULT_PROPS.WaterfallChart = { data: [{ label: "Baslangic", value: 100, type: "total" }, { label: "Satis", value: 50, type: "increase" }, { label: "Gider", value: -30, type: "decrease" }, { label: "Vergi", value: -10, type: "decrease" }, { label: "Toplam", value: 110, type: "total" }], size: "md" };

/* ---- X-Data-Grid (AG Grid recipe components) ---- */
DEFAULT_PROPS.MasterDetailGrid = { gridId: "demo-master", parentColumnDefs: [{ field: "name", headerName: "Ad" }, { field: "department", headerName: "Departman" }], detailColumnDefs: [{ field: "task", headerName: "Gorev" }, { field: "status", headerName: "Durum" }], parentData: [{ name: "Ahmet Yilmaz", department: "Muhendislik" }, { name: "Ayse Demir", department: "Tasarim" }], getDetailRows: () => [{ task: "Gorev 1", status: "Tamamlandi" }] };
DEFAULT_PROPS.TreeDataGrid = { gridId: "demo-tree", columnDefs: [{ field: "name", headerName: "Ad" }, { field: "size", headerName: "Boyut" }], data: [{ name: "Projeler", size: "—", path: ["Projeler"] }, { name: "Frontend", size: "12MB", path: ["Projeler", "Frontend"] }, { name: "Backend", size: "8MB", path: ["Projeler", "Backend"] }], getDataPath: (row: any) => row.path };
DEFAULT_PROPS.PivotGrid = { gridId: "demo-pivot", columnDefs: [{ field: "country", headerName: "Ulke" }, { field: "sport", headerName: "Spor" }, { field: "medals", headerName: "Madalya" }], data: [{ country: "Turkiye", sport: "Gures", medals: 5 }, { country: "Turkiye", sport: "Atletizm", medals: 3 }, { country: "Almanya", sport: "Gures", medals: 4 }] };
DEFAULT_PROPS.EditableGrid = { gridId: "demo-edit", columnDefs: [{ field: "name", headerName: "Ad", editable: true }, { field: "email", headerName: "E-posta", editable: true }, { field: "role", headerName: "Rol", editable: true }], data: [{ name: "Ahmet", email: "ahmet@ornek.com", role: "Admin" }, { name: "Ayse", email: "ayse@ornek.com", role: "Kullanici" }] };
DEFAULT_PROPS.RowGroupingGrid = { gridId: "demo-group", columnDefs: [{ field: "department", headerName: "Departman" }, { field: "name", headerName: "Ad" }, { field: "salary", headerName: "Maas" }], fetchRows: () => Promise.resolve({ rows: [], lastRow: 0 }), rowGroupCols: ["department"] };

/* ---- X-Scheduler (calendar components) ---- */
DEFAULT_PROPS.SchedulerToolbar = { view: "week", date: new Date(), onViewChange: () => {}, onDateChange: () => {} };
DEFAULT_PROPS.EventForm = { onSave: () => {}, onCancel: () => {} };
DEFAULT_PROPS.Scheduler = { events: [{ id: "1", title: "Toplanti", start: new Date(2025, 2, 21, 10, 0), end: new Date(2025, 2, 21, 11, 30), color: "#3b82f6" }, { id: "2", title: "Ogle Yemegi", start: new Date(2025, 2, 21, 12, 0), end: new Date(2025, 2, 21, 13, 0), color: "#16a34a" }], view: "day", date: new Date(2025, 2, 21) };
DEFAULT_PROPS.SchedulerEvent = { event: { id: "1", title: "Toplanti", start: new Date(2025, 2, 21, 10, 0), end: new Date(2025, 2, 21, 11, 30), color: "#3b82f6" } };
DEFAULT_PROPS.AgendaView = { events: [{ id: "1", title: "Sabah Toplantisi", start: new Date(2025, 2, 21, 9, 0), end: new Date(2025, 2, 21, 10, 0), color: "#3b82f6" }, { id: "2", title: "Sprint Planlama", start: new Date(2025, 2, 21, 14, 0), end: new Date(2025, 2, 21, 15, 30), color: "#8b5cf6" }, { id: "3", title: "Kod Inceleme", start: new Date(2025, 2, 22, 11, 0), end: new Date(2025, 2, 22, 12, 0), color: "#16a34a" }], startDate: new Date(2025, 2, 21), endDate: new Date(2025, 2, 23) };
DEFAULT_PROPS.ResourceView = { events: [{ id: "1", title: "Toplanti", start: new Date(2025, 2, 21, 10, 0), end: new Date(2025, 2, 21, 11, 0), resourceId: "r1", color: "#3b82f6" }], resources: [{ id: "r1", name: "Toplanti Odasi A" }, { id: "r2", name: "Toplanti Odasi B" }], date: new Date(2025, 2, 21) };

/* ---- X-Kanban (board components) ---- */
DEFAULT_PROPS.KanbanBoard = { columns: [{ id: "todo", title: "Yapilacak" }, { id: "doing", title: "Yapiliyor" }, { id: "done", title: "Tamamlandi" }], cards: [{ id: "1", columnId: "todo", title: "API entegrasyonu", priority: "high", tags: ["backend"] }, { id: "2", columnId: "todo", title: "UI tasarimi", priority: "medium", tags: ["frontend"] }, { id: "3", columnId: "doing", title: "Test yazimi", priority: "low", tags: ["qa"] }, { id: "4", columnId: "done", title: "Dokumantasyon", priority: "low" }] };
DEFAULT_PROPS.KanbanColumn = { column: { id: "todo", title: "Yapilacak" }, cards: [{ id: "1", columnId: "todo", title: "API entegrasyonu", priority: "high" }, { id: "2", columnId: "todo", title: "UI tasarimi", priority: "medium" }] };
DEFAULT_PROPS.KanbanSwimlane = { swimlane: { id: "s1", title: "Sprint 42", color: "#3b82f6" }, columns: [{ id: "todo", title: "Yapilacak" }, { id: "doing", title: "Yapiliyor" }], cards: [{ id: "1", columnId: "todo", title: "Gorev 1", swimlaneId: "s1" }] };
DEFAULT_PROPS.KanbanCardDetail = { card: { id: "1", title: "API Entegrasyonu", description: "REST API endpoint'lerini entegre et", columnId: "doing", priority: "high", assignee: "AY", tags: ["backend", "api"], dueDate: "2025-04-01" }, columns: [{ id: "todo", title: "Yapilacak" }, { id: "doing", title: "Yapiliyor" }, { id: "done", title: "Tamamlandi" }], onUpdate: () => {}, onClose: () => {} };

/* ---- X-Editor (dialogs & sub-components) ---- */
DEFAULT_PROPS.EditorToolbar = { editorRef: { current: null } };
DEFAULT_PROPS.EditorMenuBubble = { editorRef: { current: null } };
DEFAULT_PROPS.EditorLinkDialog = { isOpen: true, initialUrl: "https://ornek.com", initialText: "Ornek Baglanti", onConfirm: () => {}, onClose: () => {} };
DEFAULT_PROPS.EditorImageUpload = { isOpen: true, onInsert: () => {}, onClose: () => {} };

/* ---- X-FormBuilder (advanced form components) ---- */
DEFAULT_PROPS.MultiStepForm = { schema: { id: "multi", title: "Kayit Formu", steps: [{ id: "s1", title: "Kisisel Bilgiler", fields: ["name", "email"] }, { id: "s2", title: "Hesap Bilgileri", fields: ["role"] }], fields: [{ id: "name", type: "text", name: "name", label: "Ad Soyad", required: true }, { id: "email", type: "email", name: "email", label: "E-posta", required: true }, { id: "role", type: "select", name: "role", label: "Rol", options: [{ label: "Admin", value: "admin" }, { label: "Kullanici", value: "user" }] }], showProgress: true, allowStepNavigation: true } };
DEFAULT_PROPS.FormSummary = { schema: { id: "summary", fields: [{ id: "name", type: "text", name: "name", label: "Ad Soyad" }, { id: "email", type: "email", name: "email", label: "E-posta" }, { id: "role", type: "select", name: "role", label: "Rol", options: [{ label: "Admin", value: "admin" }] }] }, values: { name: "Ahmet Yilmaz", email: "ahmet@ornek.com", role: "admin" } };
DEFAULT_PROPS.RepeatableFieldGroup = { fields: [{ id: "item", type: "text", name: "item", label: "Kalem" }, { id: "qty", type: "number", name: "qty", label: "Miktar" }], values: [{ item: "Urun A", qty: 5 }, { item: "Urun B", qty: 3 }], onChange: () => {}, addLabel: "Satir Ekle" };
DEFAULT_PROPS.FieldRenderer = { field: { id: "demo", type: "text", name: "demo", label: "Ornek Alan", placeholder: "Deger girin..." }, value: "", onChange: () => {}, onBlur: () => {} };

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
            id: ++_logIdCounter,
            eventName: key,
            timestamp: Date.now(),
            payload: args.map(safeSerializeArg),
            componentName,
          });
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
              id: ++_logIdCounter,
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
