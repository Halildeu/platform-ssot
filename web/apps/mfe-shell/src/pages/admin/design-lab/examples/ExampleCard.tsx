import React, { useState, useMemo, useCallback } from "react";
import { Copy, Check, Code2, Eye, ExternalLink } from "lucide-react";
import { Text } from "@mfe/design-system";
import { CodeBlock } from "../../../../../../../packages/design-system/src/catalog/design-lab-internals";
import { PlaygroundPreview } from "../playground/PlaygroundPreview";
import { PreviewThemeWrapper } from "../playground/PreviewThemeWrapper";
import type { ExampleEntry, ExampleCategory, EXAMPLE_CATEGORY_META } from "./registry";

/* ------------------------------------------------------------------ */
/*  ExampleCard — Single curated example with live preview + code       */
/*                                                                     */
/*  Features:                                                          */
/*  - Toggle between preview and code view                             */
/*  - Copy code with one click                                         */
/*  - Category badge                                                   */
/*  - Tag chips for discoverability                                    */
/* ------------------------------------------------------------------ */

type ExampleCardProps = {
  example: ExampleEntry;
  componentName: string;
  categoryMeta: { label: string; emoji: string; color: string };
};

export const ExampleCard: React.FC<ExampleCardProps> = ({
  example,
  componentName,
  categoryMeta,
}) => {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }, [example.code]);

  const hasPreview = example.previewProps !== undefined;

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default transition hover:border-border-default">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle px-5 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              {example.title}
            </Text>
            <span
              className={[
                "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                categoryMeta.color,
              ].join(" ")}
            >
              {categoryMeta.label}
            </span>
          </div>
          <Text variant="secondary" className="mt-0.5 text-xs leading-relaxed">
            {example.description}
          </Text>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg border border-border-subtle px-2 py-1.5 text-[11px] font-medium text-text-secondary transition hover:text-text-primary hover:bg-surface-muted"
            title="Copy code"
          >
            {copied ? (
              <Check className="h-3 w-3 text-state-success-text" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
          {/* Toggle code/preview */}
          {hasPreview && (
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="flex items-center gap-1 rounded-lg border border-border-subtle px-2 py-1.5 text-[11px] font-medium text-text-secondary transition hover:text-text-primary hover:bg-surface-muted"
            >
              {showCode ? (
                <>
                  <Eye className="h-3 w-3" /> Preview
                </>
              ) : (
                <>
                  <Code2 className="h-3 w-3" /> Code
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Preview or Code */}
      {hasPreview && !showCode ? (
        <PreviewThemeWrapper appearance="light" className="p-8">
          <div className="flex items-center justify-center">
            <PlaygroundPreview
              componentName={componentName}
              propValues={(example.previewProps ?? {}) as Record<string, string | number | boolean>}
            />
          </div>
        </PreviewThemeWrapper>
      ) : null}

      {/* Code block — shown when toggled, or always for non-preview examples */}
      {(showCode || !hasPreview) && (
        <div className={hasPreview ? "border-t border-border-subtle" : ""}>
          <CodeBlock
            code={example.code}
            language="tsx"
            variant="dark"
            label="TSX"
            className="rounded-none! border-0!"
          />
        </div>
      )}

      {/* Tags */}
      {example.tags && example.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 border-t border-border-subtle px-5 py-2.5">
          {example.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExampleCard;
