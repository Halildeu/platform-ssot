import React, { useState } from "react";
import { Text } from "@mfe/design-system";
import type { AdoptionEntry } from "./insightsUtils";

/* ------------------------------------------------------------------ */
/*  AdoptionHeatmap — SVG heatmap showing component × app usage        */
/*                                                                     */
/*  Rows: components (sorted by adoption count desc)                   */
/*  Cols: consumer apps (derived from whereUsed, passed as prop)       */
/*  Cells: green (used) / gray (not used)                              */
/*  Hover: tooltip with component + app name                           */
/* ------------------------------------------------------------------ */

type Props = {
  data: AdoptionEntry[];
  consumerApps: string[];
};

const CELL_W = 56;
const CELL_H = 28;
const LABEL_W = 100;
const HEADER_H = 60;

export const AdoptionHeatmap: React.FC<Props> = ({ data, consumerApps }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const sorted = [...data].sort((a, b) => {
    const aCount = Object.values(a.apps).filter(Boolean).length;
    const bCount = Object.values(b.apps).filter(Boolean).length;
    return bCount - aCount;
  });

  const width = LABEL_W + consumerApps.length * CELL_W + 20;
  const height = HEADER_H + sorted.length * CELL_H + 20;

  return (
    <div className="relative">
      <svg
        width={width}
        height={height}
        className="font-sans"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Column headers */}
        {consumerApps.map((app, ci) => (
          <text
            key={app}
            x={LABEL_W + ci * CELL_W + CELL_W / 2}
            y={HEADER_H - 8}
            textAnchor="middle"
            className="fill-text-secondary text-[10px] font-medium"
          >
            {app}
          </text>
        ))}

        {/* Rows */}
        {sorted.map((entry, ri) => {
          const y = HEADER_H + ri * CELL_H;
          return (
            <g key={entry.component}>
              {/* Row label */}
              <text
                x={LABEL_W - 8}
                y={y + CELL_H / 2 + 4}
                textAnchor="end"
                className="fill-text-primary text-[11px] font-medium"
              >
                {entry.component}
              </text>

              {/* Cells */}
              {consumerApps.map((app, ci) => {
                const used = entry.apps[app];
                const cx = LABEL_W + ci * CELL_W;
                return (
                  <rect
                    key={app}
                    x={cx + 2}
                    y={y + 2}
                    width={CELL_W - 4}
                    height={CELL_H - 4}
                    rx={4}
                    className={used ? "fill-emerald-400/80" : "fill-gray-200 dark:fill-gray-700"}
                    onMouseEnter={(e) => {
                      const rect = (e.target as SVGRectElement).getBoundingClientRect();
                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                        text: `${entry.component} ${used ? "used in" : "not in"} ${app}`,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}

              {/* Adoption count */}
              <text
                x={LABEL_W + consumerApps.length * CELL_W + 8}
                y={y + CELL_H / 2 + 4}
                className="fill-text-tertiary text-[10px]"
              >
                {Object.values(entry.apps).filter(Boolean).length}/{consumerApps.length}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg bg-gray-900 px-2.5 py-1.5 text-[11px] text-white shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y - 32,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default AdoptionHeatmap;
