import React, { useRef, useEffect } from "react";
import { highlightText, type HighlightRange } from "../hooks";

/* ------------------------------------------------------------------ */
/*  SidebarSearchEnhanced — fuzzy search input with scope indicator    */
/* ------------------------------------------------------------------ */

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  scopeLabel?: string;
  className?: string;
};

export const SidebarSearchEnhanced: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Search...",
  scopeLabel,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        !e.metaKey &&
        !e.ctrlKey &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className={`relative px-2 ${className ?? ""}`}>
      {/* Search icon */}
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" strokeLinecap="round" />
      </svg>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
            inputRef.current?.blur();
          }
        }}
        placeholder={placeholder}
        className="
          w-full h-8 pl-8 pr-14 rounded-md text-[13px]
          bg-surface-muted border border-transparent
          text-text-primary placeholder:text-text-tertiary
          focus:border-action-primary focus:ring-1 focus:ring-action-primary
          focus:bg-surface-default
          transition-colors outline-none
        "
        aria-label="Search components"
      />

      {/* Right side: scope badge or shortcut hint */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-text-tertiary hover:text-text-primary text-[10px] cursor-pointer"
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : scopeLabel ? (
          <span className="text-[9px] text-text-tertiary bg-surface-canvas border border-border-subtle rounded px-1 py-0.5">
            {scopeLabel}
          </span>
        ) : (
          <kbd className="text-[9px] text-text-tertiary bg-surface-canvas border border-border-subtle rounded px-1 py-0.5 font-mono">
            /
          </kbd>
        )}
      </div>
    </div>
  );
};

SidebarSearchEnhanced.displayName = "SidebarSearchEnhanced";

/* ------------------------------------------------------------------ */
/*  HighlightedLabel — renders text with highlighted match ranges      */
/* ------------------------------------------------------------------ */

type HighlightedLabelProps = {
  text: string;
  ranges: HighlightRange[];
};

export const HighlightedLabel: React.FC<HighlightedLabelProps> = ({
  text,
  ranges,
}) => {
  if (!ranges.length) return <>{text}</>;

  const parts = highlightText(text, ranges);

  return (
    <>
      {parts.map((part, i) =>
        part.highlighted ? (
          <mark
            key={i}
            className="bg-state-warning-bg text-text-primary rounded-sm px-px"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
};

HighlightedLabel.displayName = "HighlightedLabel";
