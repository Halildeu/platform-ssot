import React, { useState, useCallback, useMemo } from "react";
import { X, Copy, Check, Code2, Package, FileCode } from "lucide-react";
import { Text } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  ViewSourceModal — Component source viewer with portable version     */
/*                                                                     */
/*  Tabs: Original Source | Portable Version | Import Map              */
/*                                                                     */
/*  Surpasses: Shadcn copy-source model + portable transform           */
/* ------------------------------------------------------------------ */

type ViewSourceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  componentName: string;
  importStatement?: string;
};

type SourceTab = "original" | "portable" | "imports";

/* ---- Mock source generation ---- */

function generateMockSource(componentName: string): string {
  return `import React from 'react';
import { cn } from '../utils/cn';
import { useTheme } from '../theme/ThemeProvider';
import type { ${componentName}Props } from './${componentName}.types';

/**
 * ${componentName} component
 *
 * @example
 * <${componentName} variant="primary">Click me</${componentName}>
 */
export const ${componentName} = React.forwardRef<
  HTMLElement,
  ${componentName}Props
>(({ variant = 'primary', size = 'md', disabled, loading, className, children, ...props }, ref) => {
  const { theme } = useTheme();

  const baseStyles = cn(
    'inline-flex items-center justify-center font-medium transition-all',
    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2',
    {
      'opacity-50 pointer-events-none': disabled || loading,
    },
    className,
  );

  return (
    <button
      ref={ref}
      className={baseStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

${componentName}.displayName = '${componentName}';`;
}

function generatePortableSource(componentName: string): string {
  return `import React from 'react';
// Portable version — no internal dependencies
// Replace 'cn' with your preferred utility (clsx, classnames, etc.)

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

type ${componentName}Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
};

export const ${componentName} = React.forwardRef<
  HTMLButtonElement,
  ${componentName}Props
>(({ variant = 'primary', size = 'md', disabled, loading, className, children, ...props }, ref) => {
  const variants = {
    primary: 'bg-[var(--action-primary)] text-text-inverse hover:bg-[var(--action-primary-hover))]',
    secondary: 'bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)]',
    ghost: 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-md',
    md: 'h-10 px-4 text-sm rounded-lg',
    lg: 'h-12 px-6 text-base rounded-xl',
  };

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 pointer-events-none',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
        </svg>
      )}
      {children}
    </button>
  );
});

${componentName}.displayName = '${componentName}';`;
}

function generateImportMap(componentName: string): string {
  return `// Import map: internal → portable replacements
//
// @mfe/design-system internal imports and their replacements:
//
// cn (class merging)
//   Internal: import { cn } from '../utils/cn'
//   Replace:  import { clsx } from 'clsx'       // npm install clsx
//             import { twMerge } from 'tailwind-merge'  // for Tailwind
//
// useTheme (theme context)
//   Internal: import { useTheme } from '../theme/ThemeProvider'
//   Replace:  Use CSS custom properties (--color-primary, etc.)
//             Or your own ThemeContext
//
// Types
//   Internal: import type { ${componentName}Props } from './${componentName}.types'
//   Replace:  Define inline (see portable version)
//
// Icons/Spinner
//   Internal: import { Spinner } from '../icons/Spinner'
//   Replace:  Inline SVG (see portable version)
//             Or: import { Loader2 } from 'lucide-react'
//
// Design tokens
//   Internal: var(--color-action-primary)
//   Replace:  Use your CSS variable names or Tailwind classes`;
}

export const ViewSourceModal: React.FC<ViewSourceModalProps> = ({
  isOpen,
  onClose,
  componentName,
  importStatement,
}) => {
  const [activeTab, setActiveTab] = useState<SourceTab>("original");
  const [copied, setCopied] = useState(false);

  const sources = useMemo(() => ({
    original: generateMockSource(componentName),
    portable: generatePortableSource(componentName),
    imports: generateImportMap(componentName),
  }), [componentName]);

  const currentSource = sources[activeTab];

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentSource);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  }, [currentSource]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-surface-inverse/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl border border-border-subtle bg-surface-default shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-text-tertiary" />
            <Text as="h2" className="text-sm font-semibold text-text-primary">
              {componentName} Source
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg border border-border-subtle px-2.5 py-1.5 text-[11px] font-medium text-text-secondary hover:text-text-primary transition"
            >
              {copied ? <Check className="h-3 w-3 text-state-success-text" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-muted transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-subtle px-5">
          {([
            { id: "original" as const, label: "Original", icon: <FileCode className="h-3 w-3" /> },
            { id: "portable" as const, label: "Portable", icon: <Package className="h-3 w-3" /> },
            { id: "imports" as const, label: "Import Map", icon: <Code2 className="h-3 w-3" /> },
          ]).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={[
                "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-action-primary text-action-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Source code */}
        <div className="max-h-[calc(80vh-120px)] overflow-auto">
          <pre className="p-5 text-xs leading-relaxed text-border-subtle font-mono bg-surface-inverse">
            {currentSource}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ViewSourceModal;
