import React from "react";
import { _xSuiteComponents } from "./xSuiteStubs";

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
                ci > 0 ? React.createElement("span", { style: { position: "absolute" as const, top: 4, right: 6, fontSize: 9, color: "var(--action-primary))", opacity: 0.7 } }, "\u270E") : null
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
    React.createElement("div", { style: { display: "inline-flex", gap: 2, background: "var(--surface-elevated))", borderRadius: 8, padding: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" } },
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
          React.createElement("span", { style: { width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, background: "var(--action-primary))", color: "var(--surface-default)", fontSize: 11, fontWeight: 600, flexShrink: 0 } }, f.icon),
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
          React.createElement("div", { key: `${ri}-${ci}`, style: { height: 32, borderRadius: 4, background: `rgba(59,130,246,${v})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: v > 0.6 ? "var(--surface-default)" : "var(--text-secondary)" } }, (v * 100).toFixed(0))
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
      React.createElement("span", { style: { fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "var(--action-primary))", color: "var(--surface-default)", fontWeight: 500 } }, "In Progress")
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
          ...(lane.cards ?? []).map((c) =>
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
      React.createElement("span", { style: { width: 20, color: "var(--action-primary))", cursor: "pointer" } }, "\u25BC"),
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
            React.createElement("div", { style: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, background: done ? "var(--state-success-text))" : current ? "var(--action-primary))" : "var(--surface-muted)", color: done || current ? "var(--surface-default)" : "var(--text-secondary)", border: current ? "2px solid var(--action-primary))" : "none" } }, done ? "\u2713" : String(i + 1)),
            React.createElement("span", { style: { fontSize: 10, color: current ? "var(--action-primary))" : "var(--text-secondary)", fontWeight: current ? 600 : 400 } }, s)
          ),
        ];
        if (i < steps.length - 1) {
          items.push(React.createElement("div", { key: `line-${i}`, style: { flex: 1, height: 2, background: done ? "var(--state-success-text))" : "var(--border-subtle)", margin: "0 8px", marginBottom: 16 } }));
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
        React.createElement("button", { style: { width: 28, height: 28, borderRadius: 6, border: "1px solid var(--border-subtle)", background: "transparent", color: "var(--state-error-text))", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" } }, "\u00D7")
      )
    ),
    React.createElement("button", { style: { display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: "1px dashed var(--action-primary))", background: "transparent", color: "var(--action-primary))", cursor: "pointer", fontSize: 12, fontWeight: 500, marginTop: 4 } }, "+ Add Item")
  );
};

_xSuiteComponents.ResourceView = function ResourceViewStub() {
  const resources = [
    { name: "Room A", blocks: [{ left: 10, width: 30, color: "var(--action-primary))" }] },
    { name: "Room B", blocks: [{ left: 25, width: 20, color: "var(--action-primary)" }, { left: 60, width: 25, color: "var(--state-success-text)" }] },
    { name: "Room C", blocks: [{ left: 5, width: 40, color: "var(--state-warning-text)" }] },
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
      React.createElement("span", { style: { color: "var(--action-primary))" } }, "\u25BC"),
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
        React.createElement("circle", { key: i, cx: p.x, cy: 90 - p.y * 0.85, r: 2.5, fill: "var(--action-primary))", opacity: 0.7 })
      )
    )
  );
};

_xSuiteComponents.SchedulerEvent = function SchedulerEventStub() {
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 20, background: "var(--surface-default)", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 12 } },
    React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: "var(--text-primary)" } }, "SchedulerEvent"),
    React.createElement("div", { style: { width: "100%", maxWidth: 240, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-subtle)" } },
      React.createElement("div", { style: { height: 4, background: "var(--action-primary))" } }),
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
              React.createElement("div", { style: { width: 40, height: 2, background: "var(--action-primary))", position: "relative" as const } },
                React.createElement("div", { style: { position: "absolute" as const, right: -4, top: -3, width: 0, height: 0, borderTop: "4px solid transparent", borderBottom: "4px solid transparent", borderLeft: "6px solid var(--action-primary))" } })
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
        React.createElement("span", { style: { fontSize: 10, width: 14, color: r.icon === "\uD83D\uDCC4" ? "var(--text-secondary)" : "var(--action-primary))", flexShrink: 0 } }, r.icon),
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
      React.createElement("div", { style: { gridRow: "1 / 3", borderRadius: 6, background: "var(--action-primary))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "var(--surface-default)", opacity: 0.85 } }, "Sales 42%"),
      React.createElement("div", { style: { borderRadius: 6, background: "var(--action-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--surface-default)", opacity: 0.85 } }, "Marketing 24%"),
      React.createElement("div", { style: { borderRadius: 6, background: "var(--state-success-text)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "var(--surface-default)", opacity: 0.85 } }, "Ops 16%"),
      React.createElement("div", { style: { borderRadius: 6, background: "var(--state-warning-text)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "var(--surface-default)", opacity: 0.85 } }, "HR 10%"),
      React.createElement("div", { style: { borderRadius: 6, background: "var(--state-danger-text)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "var(--surface-default)", opacity: 0.85 } }, "R&D 8%")
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
        const color = b.isTotal ? "var(--action-primary))" : b.value >= 0 ? "var(--state-success-text))" : "var(--state-error-text))";
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
    { text: "const {", color: "var(--action-primary))" },
    { text: "  events,", color: "var(--text-primary)" },
    { text: "  addEvent,", color: "var(--text-primary)" },
    { text: "  removeEvent,", color: "var(--text-primary)" },
    { text: "  updateEvent,", color: "var(--text-primary)" },
    { text: "} = useScheduler({", color: "var(--action-primary))" },
    { text: '  view: "week",', color: "var(--state-success-text))" },
    { text: "  defaultDate: new Date(),", color: "var(--text-primary)" },
    { text: "});", color: "var(--action-primary))" },
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

