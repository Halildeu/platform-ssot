import React from "react";
import { Text } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  MigrationDiffView — Before/After code comparison for migration      */
/* ------------------------------------------------------------------ */

type MigrationDiffViewProps = {
  before: string;
  after: string;
  title?: string;
};

export const MigrationDiffView: React.FC<MigrationDiffViewProps> = ({ before, after, title }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle">
      {title && (
        <div className="border-b border-border-subtle bg-surface-canvas px-4 py-2">
          <Text as="div" className="text-xs font-semibold text-text-primary">{title}</Text>
        </div>
      )}
      <div className="grid grid-cols-2 divide-x divide-border-subtle">
        {/* Before */}
        <div>
          <div className="border-b border-border-subtle bg-state-danger-bg px-3 py-1.5">
            <Text className="text-[10px] font-semibold text-state-danger-text">BEFORE (deprecated)</Text>
          </div>
          <pre className="overflow-x-auto bg-state-danger-bg/30 p-4 text-xs leading-relaxed text-[var(--text-secondary)] font-mono">
            {before}
          </pre>
        </div>
        {/* After */}
        <div>
          <div className="border-b border-border-subtle bg-state-success-bg px-3 py-1.5">
            <Text className="text-[10px] font-semibold text-state-success-text">AFTER (recommended)</Text>
          </div>
          <pre className="overflow-x-auto bg-state-success-bg/30 p-4 text-xs leading-relaxed text-[var(--text-secondary)] font-mono">
            {after}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MigrationDiffView;
