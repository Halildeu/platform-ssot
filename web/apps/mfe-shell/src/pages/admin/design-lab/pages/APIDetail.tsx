import React, { useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Copy,
  Check,
  ChevronRight,
  Layers,
  FileCode2,
  Code2,
  Link2,
  ShieldCheck,
  Globe,
  ArrowRight,
} from "lucide-react";
import { Text, IconButton } from "@mfe/design-system";
import {
  LibraryCodeBlock,
} from "../../../../../../../packages/design-system/src/catalog/design-lab-internals";
import { useDesignLab } from "../DesignLabProvider";
import { isDesignLabUrlTokenFlexibleMatch } from "../designLabUrlMatch";

/* ------------------------------------------------------------------ */
/*  APIDetail — Documentation page for non-component items             */
/*                                                                     */
/*  Tabs: Overview · Usage · API · Related · Quality                    */
/*  For: hooks, utilities, constants, theme-api, theme-setters, HOCs   */
/* ------------------------------------------------------------------ */

type ApiDetailTab = "overview" | "usage" | "api" | "related" | "quality";

const API_TAB_META: Array<{ id: ApiDetailTab; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Genel Bakış", icon: <Layers className="h-3.5 w-3.5" /> },
  { id: "usage", label: "Kullanım", icon: <Code2 className="h-3.5 w-3.5" /> },
  { id: "api", label: "API", icon: <FileCode2 className="h-3.5 w-3.5" /> },
  { id: "related", label: "İlişkili", icon: <Link2 className="h-3.5 w-3.5" /> },
  { id: "quality", label: "Kalite", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
];

/* ---- Kind badge color mapping ---- */

const KIND_BADGE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  hook: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  function: { bg: "bg-violet-500/10", text: "text-violet-600", dot: "bg-violet-500" },
  const: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
  "theme-api": { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  "theme-setter": { bg: "bg-cyan-500/10", text: "text-cyan-600", dot: "bg-cyan-500" },
  hoc: { bg: "bg-pink-500/10", text: "text-pink-600", dot: "bg-pink-500" },
};

const KIND_LABELS: Record<string, string> = {
  hook: "Hook",
  function: "Utility",
  const: "Constant",
  "theme-api": "Theme API",
  "theme-setter": "Theme Setter",
  hoc: "HOC",
};

function getKindBadge(kind: string) {
  const style = KIND_BADGE_STYLES[kind] ?? KIND_BADGE_STYLES["function"];
  const label = KIND_LABELS[kind] ?? kind;
  return { style, label };
}

/* ---- Usage code generation ---- */

function generateUsageCode(
  name: string,
  kind: string,
  props: Array<{ name: string; type: string; default: string; required: boolean }>,
  stateModel: string[],
): string {
  if (kind === "hook") {
    const params = props.filter((p) => p.required).map((p) => p.name);
    const paramStr = params.length > 0 ? `{ ${params.join(", ")} }` : "";
    const returnVars = stateModel.length > 0
      ? stateModel.slice(0, 3).join(", ")
      : "result";
    return [
      `import { ${name} } from "@mfe/design-system";`,
      "",
      "function MyComponent() {",
      `  const { ${returnVars} } = ${name}(${paramStr});`,
      "",
      "  return (",
      "    <div>",
      `      {/* Use ${returnVars.split(",")[0].trim()} here */}`,
      "    </div>",
      "  );",
      "}",
    ].join("\n");
  }

  if (kind === "const") {
    return [
      `import { ${name} } from "@mfe/design-system";`,
      "",
      `// ${name} is a constant — use it directly`,
      `console.log(${name});`,
    ].join("\n");
  }

  // function / utility / theme-api / theme-setter / hoc
  const params = props.filter((p) => p.required).map((p) => p.name);
  const paramStr = params.join(", ");
  return [
    `import { ${name} } from "@mfe/design-system";`,
    "",
    `const result = ${name}(${paramStr});`,
    `console.log(result);`,
  ].join("\n");
}

/* ================================================================== */
/*  Type helpers                                                        */
/* ================================================================== */

type IndexItem = NonNullable<
  ReturnType<typeof useDesignLab>["indexItemMap"] extends Map<string, infer V>
    ? V
    : never
>;
type ApiItem =
  ReturnType<typeof useDesignLab>["apiItemMap"] extends Map<string, infer V>
    ? V | undefined
    : never;

/* ================================================================== */
/*  Main Component                                                      */
/* ================================================================== */

export default function APIDetail() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { indexItemMap, apiItemMap, t } = useDesignLab();

  const [activeTab, setActiveTab] = useState<ApiDetailTab>("overview");
  const [copied, setCopied] = useState(false);

  /* Resolve itemId from URL */
  const resolvedItemName = useMemo(() => {
    if (!itemId) return undefined;
    if (indexItemMap.has(itemId)) return itemId;
    const keys = Array.from(indexItemMap.keys());
    for (const key of keys) {
      if (isDesignLabUrlTokenFlexibleMatch(key, itemId)) return key;
    }
    try {
      const decoded = decodeURIComponent(itemId).replace(/~/g, " / ");
      if (indexItemMap.has(decoded)) return decoded;
      for (const key of keys) {
        if (isDesignLabUrlTokenFlexibleMatch(key, decoded)) return key;
      }
      const plainDecoded = decodeURIComponent(itemId);
      if (plainDecoded !== decoded) {
        if (indexItemMap.has(plainDecoded)) return plainDecoded;
        for (const key of keys) {
          if (isDesignLabUrlTokenFlexibleMatch(key, plainDecoded)) return key;
        }
      }
    } catch { /* noop */ }
    return undefined;
  }, [itemId, indexItemMap]);

  const indexItem = useMemo(
    () => (resolvedItemName ? indexItemMap.get(resolvedItemName) : undefined),
    [resolvedItemName, indexItemMap],
  );

  const apiItem = useMemo(
    () => (resolvedItemName ? apiItemMap.get(resolvedItemName) : undefined),
    [resolvedItemName, apiItemMap],
  );

  const handleCopyImport = async () => {
    if (!indexItem?.importStatement) return;
    try {
      await navigator.clipboard.writeText(indexItem.importStatement);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  if (!indexItem) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-8 text-center">
        <Text variant="secondary">
          {t("designlab.detail.notFound")}
        </Text>
      </div>
    );
  }

  const { style: kindStyle, label: kindLabel } = getKindBadge(indexItem.kind);

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-xs text-text-secondary">
        <button
          type="button"
          onClick={() => navigate("/admin/design-lab")}
          className="rounded-md px-1.5 py-0.5 transition-colors hover:bg-surface-muted hover:text-text-primary"
        >
          {t("designlab.breadcrumb.library")}
        </button>
        <ChevronRight className="h-3 w-3 opacity-40" />
        <button
          type="button"
          onClick={() => navigate("/admin/design-lab/apis")}
          className="rounded-md px-1.5 py-0.5 transition-colors hover:bg-surface-muted hover:text-text-primary"
        >
          APIs
        </button>
        <ChevronRight className="h-3 w-3 opacity-40" />
        <span className="rounded-md bg-surface-muted px-2 py-0.5 font-medium text-text-primary">
          {itemId}
        </span>
      </nav>

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-linear-to-br from-surface-default via-surface-default to-surface-canvas p-6 sm:p-8">
        {/* Decorative dots */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Text
              as="div"
              className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl"
            >
              {indexItem.name}
            </Text>
            <Text
              variant="secondary"
              className="mt-2 max-w-2xl text-sm leading-relaxed"
            >
              {indexItem.description}
            </Text>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {/* Kind badge */}
              <span
                className={[
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  kindStyle.bg,
                  kindStyle.text,
                ].join(" ")}
              >
                <span className={["h-1.5 w-1.5 rounded-full", kindStyle.dot].join(" ")} />
                {kindLabel}
              </span>

              {/* Lifecycle badge */}
              <span
                className={[
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  indexItem.lifecycle === "stable"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : indexItem.lifecycle === "beta"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-blue-500/10 text-blue-600",
                ].join(" ")}
              >
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    indexItem.lifecycle === "stable"
                      ? "bg-emerald-500"
                      : indexItem.lifecycle === "beta"
                        ? "bg-amber-500"
                        : "bg-blue-500",
                  ].join(" ")}
                />
                {indexItem.lifecycle}
              </span>

              {indexItem.roadmapWaveId && (
                <span className="rounded-full border border-border-subtle bg-surface-canvas px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                  {indexItem.roadmapWaveId}
                </span>
              )}
              {indexItem.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border-subtle bg-surface-canvas px-2.5 py-0.5 text-xs font-medium text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Import statement */}
        {indexItem.importStatement && (
          <div className="relative mt-5 flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-canvas/80 px-4 py-2.5 backdrop-blur-xs">
            <div className="mr-2 rounded-md bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
              import
            </div>
            <code className="flex-1 overflow-x-auto font-mono text-xs text-text-primary">
              {indexItem.importStatement}
            </code>
            <IconButton
              icon={
                copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )
              }
              label={t("designlab.detail.copyImport")}
              size="sm"
              variant="ghost"
              onClick={handleCopyImport}
            />
          </div>
        )}
      </div>

      {/* ── Tab navigation — Pill style ── */}
      <div className="rounded-xl border border-border-subtle bg-surface-default p-1.5">
        <div className="flex gap-1">
          {API_TAB_META.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={[
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                activeTab === id
                  ? "bg-action-primary text-white shadow-xs"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
              ].join(" ")}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <OverviewTab indexItem={indexItem} apiItem={apiItem} />
        )}
        {activeTab === "usage" && (
          <UsageTab indexItem={indexItem} apiItem={apiItem} />
        )}
        {activeTab === "api" && (
          <ApiParamsTab apiItem={apiItem} kind={indexItem.kind} />
        )}
        {activeTab === "related" && (
          <RelatedTab indexItem={indexItem} indexItemMap={indexItemMap} />
        )}
        {activeTab === "quality" && (
          <QualityTab indexItem={indexItem} apiItem={apiItem} />
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  OverviewTab                                                         */
/* ================================================================== */

function OverviewTab({
  indexItem,
  apiItem,
}: {
  indexItem: IndexItem;
  apiItem: ApiItem;
}) {
  const props = apiItem?.props ?? [];
  const stateModel = apiItem?.stateModel ?? [];

  return (
    <div className="space-y-6">
      {/* Description card */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-6">
        <Text as="div" className="text-sm font-semibold text-text-primary mb-3">
          Aciklama
        </Text>
        <Text variant="secondary" className="text-sm leading-relaxed">
          {indexItem.description || "No description available."}
        </Text>
      </div>

      {/* Metadata grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Parameters / Props summary */}
        {props.length > 0 && (
          <div className="group rounded-2xl border border-border-subtle bg-surface-default p-5 transition-all duration-300 hover:border-border-default hover:shadow-xs">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                <FileCode2 className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Parametreler
              </Text>
              <span className="ml-auto rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-text-secondary">
                {props.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {props.slice(0, 6).map((prop) => (
                <div
                  key={prop.name}
                  className="flex items-baseline justify-between gap-4 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-canvas"
                >
                  <code className="text-xs font-semibold text-text-primary">
                    {prop.name}
                  </code>
                  <code className="truncate text-[11px] text-blue-600/70">
                    {prop.type}
                  </code>
                </div>
              ))}
              {props.length > 6 && (
                <Text variant="secondary" className="px-2 text-xs">
                  +{props.length - 6} more
                </Text>
              )}
            </div>
          </div>
        )}

        {/* State Model (for hooks) */}
        {stateModel.length > 0 && (
          <div className="group rounded-2xl border border-border-subtle bg-surface-default p-5 transition-all duration-300 hover:border-border-default hover:shadow-xs">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
                <Layers className="h-3.5 w-3.5 text-violet-600" />
              </div>
              <Text as="div" className="text-sm font-semibold text-text-primary">
                State Model
              </Text>
            </div>
            <div className="flex flex-wrap gap-2">
              {stateModel.map((state) => (
                <span
                  key={state}
                  className="rounded-lg border border-border-subtle bg-surface-canvas px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border-default hover:text-text-primary"
                >
                  {state}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Where Used */}
        {(indexItem?.whereUsed ?? []).length > 0 && (
          <div className="group rounded-2xl border border-border-subtle bg-surface-default p-5 transition-all duration-300 hover:border-border-default hover:shadow-xs">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                <Globe className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Kullanildigi Yerler
              </Text>
              <span className="ml-auto rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-text-secondary">
                {(indexItem?.whereUsed ?? []).length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(indexItem?.whereUsed ?? []).slice(0, 8).map((app) => (
                <span
                  key={app}
                  className="rounded-lg border border-border-subtle bg-surface-canvas px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border-default hover:text-text-primary"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  UsageTab — Code examples                                            */
/* ================================================================== */

function UsageTab({
  indexItem,
  apiItem,
}: {
  indexItem: IndexItem;
  apiItem: ApiItem;
}) {
  const props = apiItem?.props ?? [];
  const stateModel = apiItem?.stateModel ?? [];
  const code = generateUsageCode(indexItem.name, indexItem.kind, props, stateModel);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-6">
        <Text as="div" className="text-sm font-semibold text-text-primary mb-4">
          Temel Kullanim
        </Text>
        <LibraryCodeBlock code={code} languageLabel="tsx" />
      </div>

      {/* Advanced usage for hooks with state */}
      {indexItem.kind === "hook" && stateModel.length > 0 && (
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-6">
          <Text as="div" className="text-sm font-semibold text-text-primary mb-4">
            State Yonetimi Ornegi
          </Text>
          <LibraryCodeBlock
            code={[
              `import { ${indexItem.name} } from "@mfe/design-system";`,
              "",
              "function AdvancedExample() {",
              `  const { ${stateModel.join(", ")} } = ${indexItem.name}();`,
              "",
              "  return (",
              "    <div>",
              ...stateModel.map((s) => `      <p>{JSON.stringify(${s})}</p>`),
              "    </div>",
              "  );",
              "}",
            ].join("\n")}
            languageLabel="tsx"
          />
        </div>
      )}

      {/* For constants — show type information */}
      {indexItem.kind === "const" && props.length > 0 && (
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-6">
          <Text as="div" className="text-sm font-semibold text-text-primary mb-4">
            Deger Kullanimi
          </Text>
          <LibraryCodeBlock
            code={[
              `import { ${indexItem.name} } from "@mfe/design-system";`,
              "",
              "// Access specific keys",
              ...props.slice(0, 5).map((p) => `const ${p.name}Value = ${indexItem.name}.${p.name}; // ${p.type}`),
            ].join("\n")}
            languageLabel="tsx"
          />
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  ApiParamsTab — Parameters / Return type tables                      */
/* ================================================================== */

function ApiParamsTab({
  apiItem,
  kind,
}: {
  apiItem: ApiItem;
  kind: string;
}) {
  const props = apiItem?.props ?? [];
  const stateModel = apiItem?.stateModel ?? [];

  if (props.length === 0 && stateModel.length === 0) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-8 text-center">
        <Text variant="secondary">API bilgisi henuz mevcut degil.</Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Parameters / Arguments table */}
      {props.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
          <div className="border-b border-border-subtle bg-linear-to-r from-blue-500/5 to-transparent px-5 py-4">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              {kind === "hook" ? "Parametreler" : kind === "const" ? "Anahtarlar" : "Argumanlar"}
            </Text>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-canvas/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    {kind === "const" ? "Key" : "Parametre"}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Tip
                  </th>
                  {kind !== "const" && (
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      {kind === "hook" ? "Varsayilan" : "Zorunlu"}
                    </th>
                  )}
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Aciklama
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {props.map((prop) => (
                  <tr
                    key={prop.name}
                    className="transition-colors hover:bg-surface-canvas/30"
                  >
                    <td className="px-5 py-3">
                      <code className="rounded-md bg-surface-canvas px-2 py-0.5 text-xs font-semibold text-text-primary">
                        {prop.name}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <code className="text-xs text-blue-600/80">
                        {prop.type}
                      </code>
                    </td>
                    {kind !== "const" && (
                      <td className="px-5 py-3 text-xs text-text-secondary">
                        {kind === "hook"
                          ? (prop.default || "-")
                          : (prop.required ? (
                              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                                Zorunlu
                              </span>
                            ) : (
                              <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                                Opsiyonel
                              </span>
                            ))
                        }
                      </td>
                    )}
                    <td className="px-5 py-3 text-xs text-text-secondary">
                      {prop.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Return value / State model table (for hooks) */}
      {kind === "hook" && stateModel.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
          <div className="border-b border-border-subtle bg-linear-to-r from-violet-500/5 to-transparent px-5 py-4">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Donus Degerleri
            </Text>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-canvas/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Deger
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Aciklama
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {stateModel.map((state) => (
                  <tr
                    key={state}
                    className="transition-colors hover:bg-surface-canvas/30"
                  >
                    <td className="px-5 py-3">
                      <code className="rounded-md bg-surface-canvas px-2 py-0.5 text-xs font-semibold text-text-primary">
                        {state}
                      </code>
                    </td>
                    <td className="px-5 py-3 text-xs text-text-secondary">
                      State: {state}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  RelatedTab — Related components and APIs                            */
/* ================================================================== */

function RelatedTab({
  indexItem,
  indexItemMap,
}: {
  indexItem: IndexItem;
  indexItemMap: Map<string, IndexItem>;
}) {
  const navigate = useNavigate();
  const whereUsed = indexItem?.whereUsed ?? [];

  /* Find other APIs in the same group */
  const sameGroupItems = useMemo(() => {
    const items: IndexItem[] = [];
    for (const [, item] of Array.from(indexItemMap)) {
      if (
        item.name !== indexItem.name &&
        item.group === indexItem.group &&
        item.kind !== "component"
      ) {
        items.push(item);
      }
    }
    return items.slice(0, 12);
  }, [indexItemMap, indexItem]);

  return (
    <div className="space-y-6">
      {/* Components that use this API */}
      {whereUsed.length > 0 && (
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
              <Globe className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Bu API&apos;yi Kullanan Bilesenler
            </Text>
            <span className="ml-auto rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-text-secondary">
              {whereUsed.length}
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {whereUsed.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  const item = indexItemMap.get(name);
                  if (item) {
                    const layer = item.kind === "component" ? "components" : "apis";
                    const path = layer === "components"
                      ? `/admin/design-lab/components/${item.group}/${encodeURIComponent(name)}`
                      : `/admin/design-lab/apis/${encodeURIComponent(name)}`;
                    navigate(path);
                  }
                }}
                className="flex items-center justify-between gap-2 rounded-xl border border-border-subtle bg-surface-canvas px-4 py-3 text-left transition-all hover:border-border-default hover:shadow-xs"
              >
                <span className="text-xs font-medium text-text-primary">
                  {name}
                </span>
                <ArrowRight className="h-3 w-3 text-text-secondary" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Same group APIs */}
      {sameGroupItems.length > 0 && (
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
              <Layers className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Ayni Gruptaki API&apos;ler
            </Text>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {sameGroupItems.map((item) => {
              const { style, label } = getKindBadge(item.kind);
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    navigate(`/admin/design-lab/apis/${encodeURIComponent(item.name)}`)
                  }
                  className="flex items-center justify-between gap-2 rounded-xl border border-border-subtle bg-surface-canvas px-4 py-3 text-left transition-all hover:border-border-default hover:shadow-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={["shrink-0 h-1.5 w-1.5 rounded-full", style.dot].join(" ")} />
                    <span className="truncate text-xs font-medium text-text-primary">
                      {item.name}
                    </span>
                  </div>
                  <span className={["shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold", style.bg, style.text].join(" ")}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {whereUsed.length === 0 && sameGroupItems.length === 0 && (
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-8 text-center">
          <Text variant="secondary">Iliskili oge bulunamadi.</Text>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  QualityTab — Simplified quality checklist for APIs                  */
/* ================================================================== */

function QualityTab({
  indexItem,
  apiItem,
}: {
  indexItem: IndexItem;
  apiItem: ApiItem;
}) {
  const props = apiItem?.props ?? [];
  const stateModel = apiItem?.stateModel ?? [];

  const checks = useMemo(() => {
    const items: Array<{ label: string; pass: boolean }> = [];

    // Props/params documented
    const hasDocumentedProps = props.length > 0 && props.some((p) => p.description && p.description !== "-");
    items.push({ label: "Parametreler dokumante edildi", pass: hasDocumentedProps });

    // Return type documented (for hooks: stateModel)
    const hasReturnDoc = indexItem.kind === "hook"
      ? stateModel.length > 0
      : props.length > 0;
    items.push({ label: "Donus tipi dokumante edildi", pass: hasReturnDoc });

    // Usage examples exist (we always generate, so mark as partial)
    items.push({ label: "Kullanim ornekleri mevcut", pass: props.length > 0 });

    // Quality gates
    const hasQualityGates = (indexItem.qualityGates ?? []).length > 0;
    items.push({ label: "Kalite kapilari tanimlandi", pass: hasQualityGates });

    // Lifecycle maturity
    const isStable = indexItem.lifecycle === "stable";
    items.push({ label: "Olgunluk seviyesi: stable", pass: isStable });

    return items;
  }, [props, stateModel, indexItem]);

  const passCount = checks.filter((c) => c.pass).length;
  const total = checks.length;
  const pct = total > 0 ? Math.round((passCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
        {/* Header with score */}
        <div className="flex items-center justify-between border-b border-border-subtle bg-linear-to-r from-violet-500/5 to-transparent px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <ShieldCheck className="h-4 w-4 text-violet-600" />
            </div>
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Kalite Kontrol Listesi
            </Text>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-muted">
              <div
                className={[
                  "h-full rounded-full transition-all duration-500",
                  pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500",
                ].join(" ")}
                style={{ width: `${pct}%` }}
              />
            </div>
            <Text
              as="span"
              className={[
                "text-sm font-bold tabular-nums",
                pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600",
              ].join(" ")}
            >
              {passCount}/{total}
            </Text>
          </div>
        </div>

        {/* Checklist */}
        <div className="divide-y divide-border-subtle">
          {checks.map((check) => (
            <div
              key={check.label}
              className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-canvas/30"
            >
              <div
                className={[
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs",
                  check.pass
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-red-500/10 text-red-500",
                ].join(" ")}
              >
                {check.pass ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </div>
              <Text className="text-sm text-text-primary">{check.label}</Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
