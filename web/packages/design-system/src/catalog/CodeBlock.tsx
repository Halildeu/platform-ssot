import React, { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";

/* ------------------------------------------------------------------ */
/*  CodeBlock — Syntax-highlighted code with copy-to-clipboard         */
/*                                                                     */
/*  Uses shiki for VS Code–grade highlighting. Falls back to plain     */
/*  <pre><code> while WASM loads (~50ms on fast networks).             */
/* ------------------------------------------------------------------ */

// Module-level singleton — one-time WASM init, shared across all instances
let _highlighterPromise: Promise<ShikiHighlighter> | null = null;

type ShikiHighlighter = {
  codeToHtml: (code: string, opts: { lang: string; theme: string }) => string;
};

function getHighlighter(): Promise<ShikiHighlighter> {
  if (!_highlighterPromise) {
    _highlighterPromise = import("shiki").then((shiki) =>
      shiki.createHighlighter({
        themes: ["one-dark-pro", "github-light"],
        langs: ["tsx", "typescript", "jsx", "javascript", "json", "css", "html", "bash"],
      }),
    );
  }
  return _highlighterPromise;
}

export type CodeBlockProps = {
  /** Code string to display */
  code: string;
  /** Language for syntax highlighting */
  language?: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Show copy button (default true) */
  copyable?: boolean;
  /** Language label in header (default: language prop) */
  label?: string;
  /** Visual variant */
  variant?: "dark" | "light";
  /** Additional class name on outer wrapper */
  className?: string;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "tsx",
  showLineNumbers = false,
  copyable = true,
  label,
  variant = "dark",
  className,
}) => {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let cancelled = false;
    getHighlighter()
      .then((hl) => {
        if (cancelled) return;
        const theme = variant === "dark" ? "one-dark-pro" : "github-light";
        const result = hl.codeToHtml(code.trim(), { lang: language, theme });
        setHtml(result);
      })
      .catch(() => {
        /* fallback stays */
      });
    return () => {
      cancelled = true;
    };
  }, [code, language, variant]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }, [code]);

  const isDark = variant === "dark";
  const displayLabel = label ?? language.toUpperCase();

  return (
    <div
      className={clsx(
        "rounded-2xl border overflow-hidden",
        isDark
          ? "border-white/10 bg-[#282c34] text-white"
          : "border-border-subtle bg-surface-panel text-text-primary",
        className,
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          "flex items-center justify-between px-4 py-2 border-b",
          isDark ? "border-white/10" : "border-border-subtle",
        )}
      >
        <span
          className={clsx(
            "text-[11px] font-medium",
            isDark ? "text-white/50" : "text-text-secondary",
          )}
        >
          {displayLabel}
        </span>

        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            className={clsx(
              "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition",
              isDark
                ? "text-white/50 hover:text-white/80 hover:bg-white/10"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-muted",
            )}
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span className="text-state-success-text">Copied!</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect width={14} height={14} x={8} y={8} rx={2} />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        {html ? (
          <div
            className={clsx(
              "shiki-code-block px-4 py-4 text-xs leading-6",
              showLineNumbers && "shiki-line-numbers",
              "[&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_code]:!bg-transparent",
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          /* Fallback while shiki loads */
          <pre
            className={clsx(
              "px-4 py-4 text-xs leading-6",
              isDark ? "text-white/80" : "text-text-primary",
            )}
          >
            <code>{code.trim()}</code>
          </pre>
        )}
      </div>
    </div>
  );
};
