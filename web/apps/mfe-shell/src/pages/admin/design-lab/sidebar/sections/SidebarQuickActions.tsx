import React from "react";

/* ------------------------------------------------------------------ */
/*  SidebarQuickActions — hover action buttons on nav items            */
/*  Copy import • Open playground • Pin                                */
/* ------------------------------------------------------------------ */

type Props = {
  name: string;
  isPinned: boolean;
  onCopyImport: () => void;
  onTogglePin: () => void;
  className?: string;
};

export const SidebarQuickActions: React.FC<Props> = ({
  name,
  isPinned,
  onCopyImport,
  onTogglePin,
  className,
}) => {
  return (
    <div
      className={`
        flex items-center gap-0.5
        opacity-0 group-hover:opacity-100 transition-opacity
        ${className ?? ""}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Copy import */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(
            `import { ${name} } from '@mfe/design-system';`,
          );
        }}
        className="p-0.5 rounded hover:bg-surface-canvas text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
        title="Copy import statement"
        aria-label={`Copy import for ${name}`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>

      {/* Pin / Unpin */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin();
        }}
        className={`
          p-0.5 rounded transition-colors cursor-pointer
          ${
            isPinned
              ? "text-state-warning-text opacity-100"
              : "hover:bg-surface-canvas text-text-tertiary hover:text-state-warning-text"
          }
        `}
        title={isPinned ? "Remove from favorites" : "Add to favorites"}
        aria-label={isPinned ? `Unpin ${name}` : `Pin ${name}`}
      >
        <svg className={`w-3 h-3 ${isPinned ? "fill-current" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
        </svg>
      </button>
    </div>
  );
};

SidebarQuickActions.displayName = "SidebarQuickActions";
