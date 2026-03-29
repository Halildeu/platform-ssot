import React from "react";

/* ---- X Suite: inline preview stubs for Design Lab ---- */
/* X packages cannot be directly imported into mfe-shell webpack due to   */
/* Module Federation + AG Charts dependency conflicts. Instead, we render  */
/* lightweight inline preview stubs that demonstrate the component's       */
/* visual structure using design-system tokens.                            */
export const _xSuiteComponents: Record<string, React.ComponentType<any>> = {};

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
        React.createElement("polyline", { points: "0,20 15,14 30,16 45,8 60,12 75,6 90,10 100,4", fill: "none", stroke: "var(--action-primary))", strokeWidth: 1.5 })
      )
    )
  );
};

_xSuiteComponents.SparklineChart = function SparklineChartStub(props: any) {
  const data: number[] = props.data || [10, 12, 8, 15, 13, 17, 20, 18, 22];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = (data ?? []).map((v: number, i: number) => `${(i / ((data ?? []).length - 1)) * 100},${24 - ((v - min) / range) * 20}`).join(" ");
  return React.createElement("svg", { viewBox: "0 0 100 24", width: 120, height: 24, style: { display: "block" } },
    React.createElement("polyline", { points: pts, fill: "none", stroke: "var(--action-primary))", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" })
  );
};

_xSuiteComponents.MiniChart = function MiniChartStub(props: any) {
  const data = props.data || [{ label: "A", value: 45 }, { label: "B", value: 52 }, { label: "C", value: 48 }, { label: "D", value: 60 }];
  const max = Math.max(...(data ?? []).map((d: any) => d.value));
  return React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 3, height: 48, padding: "4px 0" } },
    ...(data ?? []).map((d: any, i: number) =>
      React.createElement("div", { key: i, style: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 2, flex: 1 } },
        React.createElement("div", {
          style: { width: "100%", height: `${(d.value / max) * 36}px`, background: "var(--action-primary))", borderRadius: 2, minHeight: 4, opacity: 0.7 + (i / (data ?? []).length) * 0.3 }
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
  const items = props.items || [{ label: "Series A", color: "var(--action-primary)" }, { label: "Series B", color: "var(--state-success-text)" }];
  const horiz = props.direction === "horizontal";
  return React.createElement("div", {
    style: { display: "flex", flexDirection: horiz ? "row" as const : "column" as const, gap: horiz ? 16 : 6, padding: 8 }
  },
    ...(items ?? []).map((it: any, i: number) =>
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
      React.createElement("path", { d: "M 10 65 A 50 50 0 0 1 110 65", fill: "none", stroke: "var(--action-primary))", strokeWidth: 8, strokeLinecap: "round", strokeDasharray: `${pct * 157} 157` }),
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
  const n = (data ?? []).length;
  const cx = 60, cy = 60, r = 45;
  const getPoint = (i: number, scale: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * scale * Math.cos(a), cy + r * scale * Math.sin(a)];
  };
  const gridPts = (scale: number) => (data ?? []).map((_: any, i: number) => getPoint(i, scale).join(",")).join(" ");
  const dataPts = (data ?? []).map((d: any, i: number) => getPoint(i, (d.value || 0) / 100).join(",")).join(" ");
  return React.createElement("svg", { viewBox: "0 0 120 120", width: 180, height: 180 },
    [0.25, 0.5, 0.75, 1].map((s) => React.createElement("polygon", { key: s, points: gridPts(s), fill: "none", stroke: "var(--border-subtle)", strokeWidth: 0.5 })),
    ...(data ?? []).map((_: any, i: number) => {
      const [x, y] = getPoint(i, 1);
      return React.createElement("line", { key: `l${i}`, x1: cx, y1: cy, x2: x, y2: y, stroke: "var(--border-subtle)", strokeWidth: 0.5 });
    }),
    React.createElement("polygon", { points: dataPts, fill: "var(--action-primary))", fillOpacity: 0.2, stroke: "var(--action-primary))", strokeWidth: 1.5 }),
    ...(data ?? []).map((d: any, i: number) => {
      const [x, y] = getPoint(i, 1.18);
      return React.createElement("text", { key: `t${i}`, x, y, textAnchor: "middle", dominantBaseline: "middle", fontSize: 8, fill: "var(--text-secondary)" }, d.label);
    })
  );
};

/* ---- X-Data-Grid stubs ---- */

_xSuiteComponents.DataGridFilterChips = function DataGridFilterChipsStub(props: any) {
  const filters = props.filters || [{ id: "1", label: "Status", value: "Active" }, { id: "2", label: "Role", value: "Admin" }];
  return React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "center" } },
    ...(filters ?? []).map((f: any) =>
      React.createElement("span", { key: f.id, style: { display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 16, background: "var(--surface-muted)", fontSize: 12, color: "var(--text-primary)", border: "1px solid var(--border-subtle)" } },
        React.createElement("span", { style: { color: "var(--text-secondary)", fontWeight: 500 } }, f.label, ":"),
        f.value,
        React.createElement("span", { style: { marginLeft: 4, cursor: "pointer", color: "var(--text-secondary)", fontWeight: 700, lineHeight: 1 } }, "\u00D7")
      )
    ),
    (filters ?? []).length > 1 && React.createElement("button", { style: { fontSize: 11, color: "var(--action-primary))", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" } }, "Clear all")
  );
};

_xSuiteComponents.DataGridSelectionBar = function DataGridSelectionBarStub(props: any) {
  const count = props.selectedCount ?? 3;
  return React.createElement("div", {
    style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", borderRadius: 8, background: "var(--action-primary))", color: "var(--surface-default)", fontSize: 13 }
  },
    React.createElement("span", { style: { fontWeight: 600 } }, count, " item", count !== 1 ? "s" : "", " selected"),
    React.createElement("div", { style: { display: "flex", gap: 8 } },
      props.children || React.createElement(React.Fragment, null,
        React.createElement("button", { style: { padding: "4px 12px", borderRadius: 6, background: "rgba(255,255,255,0.2)", border: "none", color: "var(--surface-default)", fontSize: 12, cursor: "pointer" } }, "Delete"),
        React.createElement("button", { style: { padding: "4px 12px", borderRadius: 6, background: "rgba(255,255,255,0.2)", border: "none", color: "var(--surface-default)", fontSize: 12, cursor: "pointer" } }, "Export")
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
    ...(commands ?? []).map((cmd: any, i: number) =>
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
    ...(items ?? []).map((it: any, i: number) =>
      React.createElement("div", { key: it.id, style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: i === sel ? "var(--surface-muted)" : "transparent", cursor: "pointer" } },
        React.createElement("div", { style: { width: 24, height: 24, borderRadius: "50%", background: "var(--action-primary))", color: "var(--surface-default)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, flexShrink: 0 } }, it.label.split(" ").map((w: string) => w[0]).join("").slice(0, 2)),
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
        React.createElement("div", { key: i, style: { width: 24, height: 20, borderRadius: 3, border: "1px solid var(--border-subtle)", background: i < 7 ? "var(--action-primary))" : "var(--surface-muted)", opacity: i < 7 ? 0.3 : 1, cursor: "pointer" } })
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
      React.createElement("button", { style: { padding: "6px 16px", borderRadius: 6, border: "none", background: "var(--action-primary))", color: "var(--surface-default)", fontSize: 13, cursor: "pointer", fontWeight: 500 } }, "Insert")
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
      React.createElement("button", { style: { padding: "6px 16px", borderRadius: 6, border: "none", background: "var(--action-primary))", color: "var(--surface-default)", fontSize: 13, cursor: "pointer", fontWeight: 500, opacity: 0.5 } }, "Insert")
    )
  );
};

/* ---- X-FormBuilder stubs ---- */

_xSuiteComponents.FormRenderer = function FormRendererStub(props: any) {
  const schema = props.schema || { title: "Form", columns: 2, fields: [{ id: "1", label: "Name", type: "text" }, { id: "2", label: "Email", type: "email" }, { id: "3", label: "Role", type: "select" }] };
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 20, background: "var(--surface-default)" } },
    schema.title && React.createElement("div", { style: { fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 } }, schema.title),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: `repeat(${schema.columns || 2}, 1fr)`, gap: 16 } },
      ...(schema?.fields ?? []).map((f: any) =>
        React.createElement("div", { key: f.id, style: { gridColumn: f.span ? `span ${f.span}` : undefined } },
          React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 4 } }, f.label, f.required && React.createElement("span", { style: { color: "var(--state-error-text)" } }, " *")),
          React.createElement("div", { style: { height: 36, borderRadius: 6, border: "1px solid var(--border-subtle)", background: "var(--surface-muted)" } })
        )
      )
    ),
    React.createElement("div", { style: { marginTop: 20, display: "flex", justifyContent: "flex-end" } },
      React.createElement("button", { style: { padding: "8px 20px", borderRadius: 6, border: "none", background: "var(--action-primary))", color: "var(--surface-default)", fontSize: 13, fontWeight: 500, cursor: "pointer" } }, schema.submitLabel || "Submit")
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
    ...(schema?.fields ?? []).map((f: any) =>
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
    ...(schema?.fields ?? []).map((f: any) =>
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
    ...(columns ?? []).map((col: any) => {
      const colCards = (cards ?? []).filter((c: any) => c.columnId === col.id);
      return React.createElement("div", { key: col.id, style: { minWidth: 220, flex: 1, background: "var(--surface-muted)", borderRadius: 12, padding: 12 } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
          React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: "var(--text-primary)" } }, col.title),
          React.createElement("span", { style: { fontSize: 11, color: "var(--text-secondary)", background: "var(--surface-default)", borderRadius: 10, padding: "2px 8px" } }, (colCards ?? []).length)
        ),
        React.createElement("div", { style: { display: "flex", flexDirection: "column" as const, gap: 8 } },
          ...(colCards ?? []).map((card: any) =>
            React.createElement("div", { key: card.id, style: { padding: 12, borderRadius: 8, background: "var(--surface-default)", border: "1px solid var(--border-subtle)", cursor: "grab" } },
              React.createElement("div", { style: { fontSize: 13, fontWeight: 500, color: "var(--text-primary)", marginBottom: 6 } }, card.title),
              React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" as const } },
                card.priority && React.createElement("span", { style: { fontSize: 10, padding: "2px 6px", borderRadius: 4, background: priorityColors[card.priority] || "var(--surface-muted)", color: "var(--surface-default)", fontWeight: 600, textTransform: "uppercase" as const } }, card.priority),
                ...(card.tags ?? []).map((t: string) =>
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
      React.createElement("span", { style: { fontSize: 11, color: "var(--text-secondary)" } }, (cards ?? []).length)
    ),
    React.createElement("div", { style: { display: "flex", flexDirection: "column" as const, gap: 8 } },
      ...(cards ?? []).map((card: any) =>
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
      card.assignee && React.createElement("div", { style: { width: 24, height: 24, borderRadius: "50%", background: "var(--action-primary))", color: "var(--surface-default)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, flexShrink: 0, marginLeft: 8 } }, card.assignee)
    ),
    card.description && React.createElement("div", { style: { fontSize: 12, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.4 } }, card.description),
    React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" as const, marginTop: 8 } },
      card.priority && React.createElement("span", { style: { fontSize: 10, padding: "2px 6px", borderRadius: 4, background: priorityColors[card.priority] || "var(--surface-muted)", color: "var(--surface-default)", fontWeight: 600, textTransform: "uppercase" as const } }, card.priority),
      ...(card.tags ?? []).map((t: string) =>
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
    React.createElement("button", { style: { padding: "6px 16px", borderRadius: 8, border: "none", background: "var(--action-primary))", color: "var(--surface-default)", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 } }, "+ Add Column")
  );
};

_xSuiteComponents.KanbanMetrics = function KanbanMetricsStub(props: any) {
  const columns = props.columns || [{ id: "todo", title: "To Do", policy: { wipLimit: 5 } }, { id: "doing", title: "In Progress", policy: { wipLimit: 3 } }, { id: "done", title: "Done" }];
  const cards = props.cards || [{ columnId: "todo" }, { columnId: "todo" }, { columnId: "doing" }];
  return React.createElement("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" as const } },
    ...(columns ?? []).map((col: any) => {
      const count = (cards ?? []).filter((c: any) => c.columnId === col.id).length;
      const limit = col.policy?.wipLimit;
      const pct = limit ? Math.min((count / limit) * 100, 100) : 0;
      return React.createElement("div", { key: col.id, style: { flex: 1, minWidth: 120, padding: 12, borderRadius: 8, border: "1px solid var(--border-subtle)", background: "var(--surface-default)" } },
        React.createElement("div", { style: { fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 4 } }, col.title),
        React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 4 } },
          React.createElement("span", { style: { fontSize: 20, fontWeight: 700, color: "var(--text-primary)" } }, count),
          limit && React.createElement("span", { style: { fontSize: 11, color: "var(--text-secondary)" } }, "/ ", limit)
        ),
        limit && React.createElement("div", { style: { height: 4, borderRadius: 2, background: "var(--surface-muted)", marginTop: 6, overflow: "hidden" } },
          React.createElement("div", { style: { height: "100%", width: `${pct}%`, borderRadius: 2, background: pct >= 100 ? "var(--state-error-text)" : pct >= 75 ? "var(--state-warning-text)" : "var(--action-primary))", transition: "width 0.3s" } })
        )
      );
    })
  );
};

/* ---- X-Scheduler stubs ---- */

_xSuiteComponents.Scheduler = function SchedulerStub(props: any) {
  const events = props.events || [{ id: "1", title: "Meeting", start: new Date(), end: new Date(), color: "var(--action-primary)" }];
  const hours = Array.from({ length: 10 }, (_, i) => i + 8);
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 8, overflow: "hidden", background: "var(--surface-default)" } },
    ...hours.map((h) =>
      React.createElement("div", { key: h, style: { display: "flex", borderBottom: "1px solid var(--border-subtle)", minHeight: 40 } },
        React.createElement("div", { style: { width: 56, padding: "4px 8px", fontSize: 11, color: "var(--text-secondary)", borderRight: "1px solid var(--border-subtle)", textAlign: "right" as const, flexShrink: 0 } }, `${h}:00`),
        React.createElement("div", { style: { flex: 1, position: "relative" as const, minHeight: 40 } },
          ...(events ?? []).filter((e: any) => {
            const eH = e.start instanceof Date ? e.start.getHours() : h;
            return eH === h;
          }).map((e: any) =>
            React.createElement("div", { key: e.id, style: { position: "absolute" as const, left: 4, right: 4, top: 2, padding: "4px 8px", borderRadius: 4, background: e.color || "var(--action-primary)", color: "var(--surface-default)", fontSize: 11, fontWeight: 500 } }, e.title)
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
        React.createElement("button", { key: v, style: { padding: "6px 14px", border: "none", background: v.toLowerCase() === active ? "var(--action-primary))" : "var(--surface-default)", color: v.toLowerCase() === active ? "var(--surface-default)" : "var(--text-primary)", fontSize: 12, fontWeight: 500, cursor: "pointer", borderRight: "1px solid var(--border-subtle)" } }, v)
      )
    )
  );
};

_xSuiteComponents.AgendaView = function AgendaViewStub(props: any) {
  const events = props.events || [{ id: "1", title: "Morning Meeting", start: new Date(2025, 2, 21, 9, 0), end: new Date(2025, 2, 21, 10, 0), color: "var(--action-primary)" }, { id: "2", title: "Sprint Planning", start: new Date(2025, 2, 21, 14, 0), end: new Date(2025, 2, 21, 15, 30), color: "var(--action-primary)" }];
  const formatTime = (d: Date) => d instanceof Date ? `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}` : "";
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, overflow: "hidden", background: "var(--surface-default)" } },
    React.createElement("div", { style: { padding: "10px 16px", background: "var(--surface-muted)", borderBottom: "1px solid var(--border-subtle)", fontSize: 13, fontWeight: 600, color: "var(--text-primary)" } }, "Today"),
    ...(events ?? []).map((e: any) =>
      React.createElement("div", { key: e.id, style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid var(--border-subtle)" } },
        React.createElement("div", { style: { width: 4, height: 32, borderRadius: 2, background: e.color || "var(--action-primary)", flexShrink: 0 } }),
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
        ...["var(--action-primary)", "var(--state-success-text)", "var(--action-primary)", "var(--state-warning-text)", "var(--state-danger-text)"].map((c) =>
          React.createElement("div", { key: c, style: { width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer", border: c === "var(--action-primary)" ? "2px solid var(--text-primary)" : "2px solid transparent" } })
        )
      )
    ),
    React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" } },
      React.createElement("button", { style: { padding: "6px 16px", borderRadius: 6, border: "1px solid var(--border-subtle)", background: "transparent", fontSize: 13, cursor: "pointer", color: "var(--text-primary)" } }, "Cancel"),
      React.createElement("button", { style: { padding: "6px 16px", borderRadius: 6, border: "none", background: "var(--action-primary))", color: "var(--surface-default)", fontSize: 13, cursor: "pointer", fontWeight: 500 } }, "Save")
    )
  );
};
