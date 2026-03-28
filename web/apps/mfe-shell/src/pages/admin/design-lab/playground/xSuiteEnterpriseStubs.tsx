import React from "react";
import { _xSuiteComponents } from "./xSuiteStubs";

/* ---- Enterprise stubs ---- */

_xSuiteComponents.AgingBuckets = function AgingBucketsStub(props: any) {
  const buckets = props.buckets || [
    { label: "0-30 gun", value: 45200, count: 12 },
    { label: "31-60 gun", value: 23100, count: 8 },
    { label: "61-90 gun", value: 12800, count: 5 },
    { label: "90+ gun", value: 8400, count: 3 },
  ];
  const total = buckets.reduce((s: number, b: any) => s + b.value, 0);
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 } }, props.title || "Vade Analizi"),
    React.createElement("div", { style: { display: "flex", gap: 8 } },
      ...buckets.map((b: any, i: number) => {
        const pct = ((b.value / total) * 100).toFixed(0);
        const colors = ["var(--state-success-text))", "var(--state-info-text))", "var(--state-warning-text))", "var(--state-error-text))"];
        return React.createElement("div", { key: i, style: { flex: 1, textAlign: "center" as const, padding: 8, borderRadius: 8, background: "var(--surface-muted)" } },
          React.createElement("div", { style: { fontSize: 10, color: "var(--text-secondary)", marginBottom: 4 } }, b.label),
          React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: colors[i] || colors[0] } }, typeof b.value === "number" ? b.value.toLocaleString("tr-TR") : b.value),
          React.createElement("div", { style: { fontSize: 9, color: "var(--text-secondary)", marginTop: 2 } }, `${b.count} kayit · %${pct}`),
        );
      })
    )
  );
};

_xSuiteComponents.ApprovalWorkflow = function ApprovalWorkflowStub(props: any) {
  const steps = props.steps || [
    { id: "s1", label: "Talep", status: "completed", actor: "Ahmet Y." },
    { id: "s2", label: "Yonetici Onayi", status: "completed", actor: "Elif D." },
    { id: "s3", label: "Finans Onayi", status: "current", actor: "Mehmet K." },
    { id: "s4", label: "CEO Onayi", status: "pending" },
  ];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 } }, props.title || "Onay Is Akisi"),
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 0 } },
      ...steps.flatMap((s: any, i: number) => {
        const statusColors: Record<string, string> = { completed: "var(--state-success-text))", current: "var(--action-primary))", pending: "var(--text-secondary)" };
        const statusIcons: Record<string, string> = { completed: "\u2713", current: "\u25CF", pending: "\u25CB" };
        const items = [
          React.createElement("div", { key: s.id, style: { textAlign: "center" as const, flex: 1 } },
            React.createElement("div", { style: { width: 28, height: 28, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: s.status === "completed" ? statusColors.completed : "var(--surface-muted)", color: s.status === "completed" ? "var(--surface-default)" : statusColors[s.status], fontSize: 14, fontWeight: 700, border: `2px solid ${statusColors[s.status]}` } }, statusIcons[s.status]),
            React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: statusColors[s.status], marginTop: 4 } }, s.label),
            s.actor && React.createElement("div", { style: { fontSize: 9, color: "var(--text-secondary)" } }, s.actor),
          ),
        ];
        if (i < steps.length - 1) {
          items.push(React.createElement("div", { key: `line-${i}`, style: { flex: 1, height: 2, background: s.status === "completed" ? statusColors.completed : "var(--border-subtle)", maxWidth: 40 } }));
        }
        return items;
      })
    )
  );
};

_xSuiteComponents.BulletChart = function BulletChartStub(props: any) {
  const value = props.value ?? 275;
  const target = props.target ?? 300;
  const max = props.max ?? 400;
  const ranges = props.ranges || [{ value: 150, color: "var(--state-error-bg)" }, { value: 250, color: "var(--state-warning-bg)" }, { value: max, color: "var(--state-success-bg))" }];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 } }, props.title || "Performans"),
    React.createElement("div", { style: { position: "relative" as const, height: 24, borderRadius: 4, overflow: "hidden", background: "var(--surface-muted)" } },
      ...ranges.map((r: any, i: number) => React.createElement("div", { key: i, style: { position: "absolute" as const, left: 0, top: 0, height: "100%", width: `${(r.value / max) * 100}%`, background: r.color, zIndex: ranges.length - i } })),
      React.createElement("div", { style: { position: "absolute" as const, left: 0, top: 4, height: 16, width: `${(value / max) * 100}%`, background: "var(--text-primary)", borderRadius: 2, zIndex: ranges.length + 1 } }),
      React.createElement("div", { style: { position: "absolute" as const, left: `${(target / max) * 100}%`, top: 0, width: 2, height: "100%", background: "var(--state-error-text))", zIndex: ranges.length + 2 } }),
    ),
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: "var(--text-secondary)" } },
      React.createElement("span", null, `Gerceklesen: ${value}`),
      React.createElement("span", null, `Hedef: ${target}`),
    ),
  );
};

_xSuiteComponents.AuditLog = function AuditLogStub(props: any) {
  const entries = props.entries || [
    { id: "1", action: "Kullanici olusturuldu", actor: "Sistem", timestamp: "2024-03-15 09:00", level: "info" },
    { id: "2", action: "Rol degistirildi", actor: "Ahmet Y.", timestamp: "2024-03-15 10:30", level: "warning" },
    { id: "3", action: "Erisim reddedildi", actor: "Bilinmeyen", timestamp: "2024-03-15 11:15", level: "error" },
  ];
  const levelColors: Record<string, string> = { info: "var(--state-info-text))", warning: "var(--state-warning-text))", error: "var(--state-error-text))" };
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 } }, props.title || "Denetim Kayitlari"),
    React.createElement("div", { style: { display: "flex", flexDirection: "column" as const, gap: 8 } },
      ...entries.map((e: any) => React.createElement("div", { key: e.id, style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "var(--surface-muted)", fontSize: 12 } },
        React.createElement("span", { style: { width: 6, height: 6, borderRadius: "50%", background: levelColors[e.level] || levelColors.info, flexShrink: 0 } }),
        React.createElement("span", { style: { fontWeight: 500, color: "var(--text-primary)", flex: 1 } }, e.action),
        React.createElement("span", { style: { color: "var(--text-secondary)", fontSize: 10 } }, e.actor),
        React.createElement("span", { style: { color: "var(--text-secondary)", fontSize: 10 } }, e.timestamp),
      ))
    )
  );
};

_xSuiteComponents.TenantSwitcher = function TenantSwitcherStub(props: any) {
  const tenants = props.tenants || [{ id: "t1", name: "Acme A.S.", active: true }, { id: "t2", name: "Beta Ltd." }, { id: "t3", name: "Gamma Holding" }];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 12, background: "var(--surface-default)", minWidth: 220 } },
    React.createElement("div", { style: { fontSize: 10, fontWeight: 600, textTransform: "uppercase" as const, color: "var(--text-secondary)", letterSpacing: 1, marginBottom: 8 } }, "Organizasyon"),
    React.createElement("div", { style: { display: "flex", flexDirection: "column" as const, gap: 4 } },
      ...tenants.map((t: any) => React.createElement("div", { key: t.id, style: { display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8, background: t.active ? "var(--surface-muted)" : "transparent", cursor: "pointer", border: t.active ? "1px solid var(--action-primary))" : "1px solid transparent" } },
        React.createElement("div", { style: { width: 24, height: 24, borderRadius: 6, background: "var(--action-primary))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--surface-default)", fontSize: 10, fontWeight: 700 } }, t.name.charAt(0)),
        React.createElement("span", { style: { fontSize: 12, fontWeight: t.active ? 600 : 400, color: "var(--text-primary)" } }, t.name),
        t.active && React.createElement("span", { style: { marginLeft: "auto", fontSize: 10, color: "var(--action-primary))" } }, "\u2713"),
      ))
    )
  );
};

_xSuiteComponents.OnboardingChecklist = function OnboardingChecklistStub(props: any) {
  const items = props.items || [
    { id: "1", label: "Hesap olustur", completed: true },
    { id: "2", label: "Profil tamamla", completed: true },
    { id: "3", label: "Ekip uyeleri ekle", completed: false },
    { id: "4", label: "Ilk projeyi baslat", completed: false },
  ];
  const completed = items.filter((i: any) => i.completed).length;
  const pct = Math.round((completed / items.length) * 100);
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
      React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)" } }, props.title || "Baslangic Rehberi"),
      React.createElement("span", { style: { fontSize: 11, color: "var(--text-secondary)" } }, `${completed}/${items.length} tamamlandi`),
    ),
    React.createElement("div", { style: { height: 4, borderRadius: 2, background: "var(--surface-muted)", marginBottom: 12 } },
      React.createElement("div", { style: { height: "100%", borderRadius: 2, background: "var(--action-primary))", width: `${pct}%`, transition: "width 300ms ease" } }),
    ),
    React.createElement("div", { style: { display: "flex", flexDirection: "column" as const, gap: 6 } },
      ...items.map((item: any) => React.createElement("div", { key: item.id, style: { display: "flex", alignItems: "center", gap: 8, fontSize: 12 } },
        React.createElement("span", { style: { width: 18, height: 18, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: item.completed ? "var(--state-success-text))" : "var(--surface-muted)", color: item.completed ? "var(--surface-default)" : "var(--text-secondary)", fontSize: 10, fontWeight: 600, border: item.completed ? "none" : "1px solid var(--border-subtle)" } }, item.completed ? "\u2713" : ""),
        React.createElement("span", { style: { color: item.completed ? "var(--text-secondary)" : "var(--text-primary)", textDecoration: item.completed ? "line-through" : "none" } }, item.label),
      ))
    )
  );
};

_xSuiteComponents.PermissionMatrix = function PermissionMatrixStub(props: any) {
  const roles = props.roles || ["Admin", "Editor", "Viewer"];
  const permissions = props.permissions || [
    { label: "Okuma", values: [true, true, true] },
    { label: "Yazma", values: [true, true, false] },
    { label: "Silme", values: [true, false, false] },
    { label: "Yonetim", values: [true, false, false] },
  ];
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, overflow: "hidden", background: "var(--surface-default)" } },
    React.createElement("div", { style: { padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" } }, props.title || "Yetki Matrisi"),
    React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" as const, fontSize: 12 } },
      React.createElement("thead", null,
        React.createElement("tr", { style: { borderBottom: "1px solid var(--border-subtle)", background: "var(--surface-muted)" } },
          React.createElement("th", { style: { padding: "8px 16px", textAlign: "left" as const, color: "var(--text-secondary)", fontWeight: 500 } }, "Izin"),
          ...roles.map((r: string) => React.createElement("th", { key: r, style: { padding: "8px 16px", textAlign: "center" as const, color: "var(--text-secondary)", fontWeight: 500 } }, r)),
        ),
      ),
      React.createElement("tbody", null,
        ...permissions.map((p: any, i: number) => React.createElement("tr", { key: i, style: { borderBottom: i < permissions.length - 1 ? "1px solid var(--border-subtle)" : "none" } },
          React.createElement("td", { style: { padding: "8px 16px", fontWeight: 500, color: "var(--text-primary)" } }, p.label),
          ...p.values.map((v: boolean, j: number) => React.createElement("td", { key: j, style: { padding: "8px 16px", textAlign: "center" as const } },
            React.createElement("span", { style: { color: v ? "var(--state-success-text))" : "var(--state-error-text))", fontSize: 14 } }, v ? "\u2713" : "\u2717"),
          )),
        )),
      ),
    ),
  );
};

_xSuiteComponents.DataPipeline = function DataPipelineStub(props: any) {
  const stages = props.stages || [
    { id: "s1", label: "Veri Toplama", status: "completed", duration: "2.3s" },
    { id: "s2", label: "Donusum", status: "completed", duration: "1.1s" },
    { id: "s3", label: "Dogrulama", status: "running", duration: "..." },
    { id: "s4", label: "Yukleme", status: "pending" },
  ];
  const statusColors: Record<string, string> = { completed: "var(--state-success-text))", running: "var(--action-primary))", pending: "var(--text-secondary)", failed: "var(--state-error-text))" };
  return React.createElement("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, background: "var(--surface-default)" } },
    React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 } }, props.title || "Veri Hatti"),
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 0 } },
      ...stages.flatMap((s: any, i: number) => {
        const items = [
          React.createElement("div", { key: s.id, style: { flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${statusColors[s.status]}20`, background: `${statusColors[s.status]}08`, textAlign: "center" as const } },
            React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: statusColors[s.status] } }, s.label),
            s.duration && React.createElement("div", { style: { fontSize: 9, color: "var(--text-secondary)", marginTop: 2 } }, s.duration),
          ),
        ];
        if (i < stages.length - 1) {
          items.push(React.createElement("div", { key: `arrow-${i}`, style: { padding: "0 4px", color: "var(--text-secondary)", fontSize: 14 } }, "\u2192"));
        }
        return items;
      })
    )
  );
};

/* ---- AppSidebar preview stub ---- */

const _appSidebarStub: Record<string, React.FC<any>> = {};

_appSidebarStub.AppSidebar = function AppSidebarStub() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState("dashboard");
  const [searchValue, setSearchValue] = React.useState("");
  const width = collapsed ? 56 : 260;

  const items = [
    { id: "home", icon: "\u2302", label: "Home", group: "Navigation" },
    { id: "dashboard", icon: "\u25A6", label: "Dashboard", group: "Navigation" },
    { id: "users", icon: "\u263A", label: "Users", group: "Management", badge: "12" },
    { id: "reports", icon: "\u2630", label: "Reports", group: "Management" },
    { id: "analytics", icon: "\u2261", label: "Analytics", group: "Data", badge: "new" },
    { id: "settings", icon: "\u2699", label: "Settings", group: "System" },
    { id: "help", icon: "\u2753", label: "Help & Support", group: "System" },
  ];

  const filtered = searchValue
    ? items.filter((i) => i.label.toLowerCase().includes(searchValue.toLowerCase()))
    : items;

  const groups = Array.from(new Set(filtered.map((i) => i.group)));

  return React.createElement("div", {
    style: {
      width, minHeight: 420, display: "flex", flexDirection: "column" as const,
      border: "1px solid var(--border-subtle)", borderRadius: 12,
      background: "var(--surface-default)", transition: "width 200ms ease",
      overflow: "hidden", fontFamily: "inherit",
    },
  },
    /* Header */
    React.createElement("div", {
      style: { padding: collapsed ? "12px 8px" : "16px", borderBottom: "1px solid var(--border-subtle)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, minHeight: 56 },
    },
      !collapsed && React.createElement("div", null,
        React.createElement("div", { style: { fontWeight: 700, fontSize: 14, color: "var(--text-primary)" } }, "Workspace"),
        React.createElement("div", { style: { fontSize: 10, color: "var(--text-secondary)" } }, "Enterprise Platform"),
      ),
      React.createElement("button", {
        onClick: () => setCollapsed(!collapsed),
        style: { background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 6,
          color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center" },
        title: collapsed ? "Expand" : "Collapse",
      }, collapsed ? "\u25B6" : "\u25C0"),
    ),

    /* Search */
    !collapsed && React.createElement("div", { style: { padding: "8px 12px" } },
      React.createElement("input", {
        value: searchValue, onChange: (e: any) => setSearchValue(e.target.value),
        placeholder: "Search...",
        style: { width: "100%", padding: "6px 10px", borderRadius: 8, border: "1px solid var(--border-subtle)",
          background: "var(--surface-muted)", fontSize: 12, color: "var(--text-primary)", outline: "none" },
      }),
    ),

    /* Nav */
    React.createElement("div", { style: { flex: 1, overflowY: "auto" as const, padding: collapsed ? "8px 4px" : "8px" } },
      ...groups.map((group) =>
        React.createElement("div", { key: group, style: { marginBottom: 12 } },
          !collapsed && React.createElement("div", {
            style: { fontSize: 9, fontWeight: 600, textTransform: "uppercase" as const,
              letterSpacing: 1, color: "var(--text-secondary)", padding: "4px 8px", marginBottom: 2 },
          }, group),
          ...filtered.filter((i) => i.group === group).map((item) =>
            React.createElement("button", {
              key: item.id,
              onClick: () => setActiveItem(item.id),
              style: {
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                padding: collapsed ? "8px 0" : "7px 10px", borderRadius: 8, border: "none",
                background: activeItem === item.id ? "var(--surface-muted)" : "transparent",
                cursor: "pointer", fontSize: 13, color: activeItem === item.id ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: activeItem === item.id ? 600 : 400, justifyContent: collapsed ? "center" : "flex-start",
                borderLeft: activeItem === item.id ? "3px solid var(--action-primary)" : "3px solid transparent",
                transition: "all 150ms ease",
              },
              title: collapsed ? item.label : undefined,
            },
              React.createElement("span", { style: { fontSize: 16, flexShrink: 0 } }, item.icon),
              !collapsed && React.createElement("span", { style: { flex: 1, textAlign: "left" as const } }, item.label),
              !collapsed && item.badge && React.createElement("span", {
                style: { fontSize: 9, padding: "1px 6px", borderRadius: 10,
                  background: item.badge === "new" ? "var(--action-primary)" : "var(--surface-muted)",
                  color: item.badge === "new" ? "var(--surface-default)" : "var(--text-secondary)", fontWeight: 600 },
              }, item.badge),
            ),
          ),
        ),
      ),
    ),

    /* Footer */
    React.createElement("div", {
      style: { borderTop: "1px solid var(--border-subtle)", padding: collapsed ? "8px 4px" : "8px 12px",
        display: "flex", alignItems: "center", gap: 8, justifyContent: collapsed ? "center" : "flex-start" },
    },
      React.createElement("div", { style: { width: 28, height: 28, borderRadius: "50%", background: "var(--action-primary)",
        display: "flex", alignItems: "center", justifyContent: "center", color: "var(--surface-default)", fontSize: 12, fontWeight: 700 } }, "HA"),
      !collapsed && React.createElement("div", null,
        React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: "var(--text-primary)" } }, "Halil Admin"),
        React.createElement("div", { style: { fontSize: 10, color: "var(--text-secondary)" } }, "admin@example.com"),
      ),
    ),
  );
};

// Register AppSidebar stub in X-Suite components for preview
_xSuiteComponents.AppSidebar = _appSidebarStub.AppSidebar;
