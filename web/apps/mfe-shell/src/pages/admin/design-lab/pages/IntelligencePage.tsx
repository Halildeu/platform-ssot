import React, { useState, useCallback } from "react";
import { Text } from "@mfe/design-system";
import { Brain, Download, ChevronDown, ChevronRight } from "lucide-react";
import { useDesignLab } from "../DesignLabProvider";
import AssistantPanel from "../intelligence/AssistantPanel";
import BlastRadiusPanel from "../intelligence/BlastRadiusPanel";
import ConsumerHeatmap from "../intelligence/ConsumerHeatmap";
import { useCodegenSandbox } from "../intelligence/useCodegenSandbox";
import { generateMCPManifest } from "../intelligence/mcpExport";
import type { CodegenResult } from "../intelligence/useCodegenSandbox";

/* ------------------------------------------------------------------ */
/*  Collapsible section                                                 */
/* ------------------------------------------------------------------ */

function Section({
  title,
  icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-surface-canvas/50"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
          {icon}
        </div>
        <Text className="flex-1 text-sm font-semibold text-text-primary">
          {title}
        </Text>
        {open ? (
          <ChevronDown className="h-4 w-4 text-text-secondary" />
        ) : (
          <ChevronRight className="h-4 w-4 text-text-secondary" />
        )}
      </button>
      {open && (
        <div className="border-t border-border-subtle px-5 py-4">
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Codegen sandbox inline                                              */
/* ------------------------------------------------------------------ */

function CodegenSandboxSection() {
  const { generate } = useCodegenSandbox();
  const [componentName, setComponentName] = useState("");
  const [propsJson, setPropsJson] = useState("{}");
  const [result, setResult] = useState<CodegenResult | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = useCallback(() => {
    if (!componentName.trim()) return;
    setError("");
    try {
      const props = JSON.parse(propsJson);
      const gen = generate(componentName.trim(), props);
      setResult(gen);
    } catch (e) {
      setError("Props JSON gecersiz. Ornek: {\"variant\": \"primary\"}");
      setResult(null);
    }
  }, [componentName, propsJson, generate]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Text variant="secondary" className="mb-1 text-xs font-medium">
            Component Adi
          </Text>
          <input
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            placeholder="Button"
            className="w-full rounded-lg border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary outline-none focus:border-action-primary"
          />
        </div>
        <div>
          <Text variant="secondary" className="mb-1 text-xs font-medium">
            Props (JSON)
          </Text>
          <input
            value={propsJson}
            onChange={(e) => setPropsJson(e.target.value)}
            placeholder='{"variant": "primary"}'
            className="w-full rounded-lg border border-border-subtle bg-surface-default px-3 py-2 text-sm font-mono text-text-primary outline-none focus:border-action-primary"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!componentName.trim()}
        className="self-start rounded-lg bg-action-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-action-primary/90 disabled:opacity-40"
      >
        Kod Uret
      </button>

      {error && (
        <Text className="text-xs text-red-600">{error}</Text>
      )}

      {result && (
        <div className="space-y-2">
          {/* Validity */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${result.isValid ? "bg-emerald-500" : "bg-red-500"}`}
            />
            <Text className="text-xs font-medium text-text-primary">
              {result.isValid ? "Gecerli" : "Uyari mevcut"}
            </Text>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="rounded-lg bg-amber-50 p-2.5">
              {result.warnings.map((w, i) => (
                <Text key={i} className="text-xs text-amber-700">
                  - {w}
                </Text>
              ))}
            </div>
          )}

          {/* Generated code */}
          <pre className="overflow-x-auto rounded-lg bg-surface-canvas p-3 text-xs leading-5 text-text-primary">
            <code>{result.fullExample}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MCP Export button                                                   */
/* ------------------------------------------------------------------ */

function MCPExportButton() {
  const { index, apiItemMap } = useDesignLab();

  const handleExport = useCallback(() => {
    const json = generateMCPManifest(index, apiItemMap);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design-lab-mcp-manifest.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [index, apiItemMap]);

  return (
    <button
      type="button"
      onClick={handleExport}
      className="flex items-center gap-2 rounded-xl bg-action-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-action-primary/90"
    >
      <Download className="h-4 w-4" />
      MCP Manifest Indir
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                           */
/* ------------------------------------------------------------------ */

export default function IntelligencePage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border-subtle bg-surface-default px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
            <Brain className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <Text as="h1" className="text-lg font-bold text-text-primary">
              Impact Intelligence
            </Text>
            <Text variant="secondary" className="text-xs">
              Blast-radius analizi, AI asistan, codegen sandbox ve MCP export
            </Text>
          </div>
          <div className="ml-auto">
            <MCPExportButton />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 p-6">
        {/* Assistant (default open) */}
        <Section
          title="AI Asistan"
          icon={<Brain className="h-4 w-4" />}
          defaultOpen
        >
          <AssistantPanel />
        </Section>

        {/* Blast Radius */}
        <Section
          title="Blast Radius"
          icon={<Brain className="h-4 w-4" />}
          defaultOpen
        >
          <BlastRadiusPanel />
        </Section>

        {/* Consumer Heatmap */}
        <Section
          title="Consumer Heatmap"
          icon={<Brain className="h-4 w-4" />}
        >
          <ConsumerHeatmap />
        </Section>

        {/* Codegen Sandbox */}
        <Section
          title="Codegen Sandbox"
          icon={<Brain className="h-4 w-4" />}
        >
          <CodegenSandboxSection />
        </Section>
      </div>
    </div>
  );
}
