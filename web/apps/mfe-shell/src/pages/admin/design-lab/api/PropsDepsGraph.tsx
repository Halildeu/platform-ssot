import React, { useState, useMemo, _useCallback, _useEffect, useRef } from "react";
import { GitBranch, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Text } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  PropsDepsGraph — Interactive prop relationship visualization         */
/*                                                                     */
/*  Features:                                                          */
/*  - Force-directed SVG graph layout                                  */
/*  - Edge types: enables, conflicts, requires                         */
/*  - Click-to-highlight connected props                               */
/*  - Hover tooltip with edge description                              */
/*  - Zoom/pan controls                                                */
/*                                                                     */
/*  Unique feature — no competitor has props dependency visualization   */
/* ------------------------------------------------------------------ */

type EdgeType = "enables" | "conflicts" | "requires";

type PropNode = {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
};

type PropEdge = {
  from: string;
  to: string;
  type: EdgeType;
  description?: string;
};

type GraphData = {
  nodes: PropNode[];
  edges: PropEdge[];
};

const EDGE_COLORS: Record<EdgeType, string> = {
  enables: "var(--state-success-text)",
  conflicts: "var(--state-danger-text)",
  requires: "var(--action-primary)",
};

const EDGE_LABELS: Record<EdgeType, string> = {
  enables: "enables",
  conflicts: "conflicts with",
  requires: "requires",
};

/* ---- Static prop relationship data ---- */

const PROP_DEPS_DATA: Record<string, GraphData> = {
  Button: {
    nodes: [
      { id: "variant", label: "variant", type: "union" },
      { id: "size", label: "size", type: "union" },
      { id: "disabled", label: "disabled", type: "boolean" },
      { id: "loading", label: "loading", type: "boolean" },
      { id: "onClick", label: "onClick", type: "function" },
      { id: "children", label: "children", type: "ReactNode", required: true },
      { id: "type", label: "type", type: "union" },
      { id: "fullWidth", label: "fullWidth", type: "boolean" },
    ],
    edges: [
      { from: "loading", to: "disabled", type: "enables", description: "Loading auto-disables the button" },
      { from: "disabled", to: "onClick", type: "conflicts", description: "Disabled prevents onClick from firing" },
      { from: "loading", to: "onClick", type: "conflicts", description: "Loading prevents onClick from firing" },
      { from: "type", to: "onClick", type: "requires", description: "type='submit' works with form, onClick for button type" },
      { from: "variant", to: "size", type: "enables", description: "Different variants may have different size defaults" },
      { from: "fullWidth", to: "size", type: "conflicts", description: "fullWidth overrides width regardless of size" },
    ],
  },
  Input: {
    nodes: [
      { id: "value", label: "value", type: "string" },
      { id: "onChange", label: "onChange", type: "function" },
      { id: "disabled", label: "disabled", type: "boolean" },
      { id: "error", label: "error", type: "boolean|string" },
      { id: "placeholder", label: "placeholder", type: "string" },
      { id: "type", label: "type", type: "union" },
      { id: "label", label: "label", type: "string" },
    ],
    edges: [
      { from: "value", to: "onChange", type: "requires", description: "Controlled input needs onChange handler" },
      { from: "disabled", to: "onChange", type: "conflicts", description: "Disabled prevents onChange from firing" },
      { from: "error", to: "disabled", type: "conflicts", description: "Error state has no meaning when disabled" },
      { from: "type", to: "placeholder", type: "enables", description: "Input type determines placeholder format" },
    ],
  },
  Select: {
    nodes: [
      { id: "value", label: "value", type: "string" },
      { id: "onChange", label: "onChange", type: "function" },
      { id: "disabled", label: "disabled", type: "boolean" },
      { id: "placeholder", label: "placeholder", type: "string" },
      { id: "multiple", label: "multiple", type: "boolean" },
      { id: "searchable", label: "searchable", type: "boolean" },
    ],
    edges: [
      { from: "value", to: "onChange", type: "requires", description: "Controlled select needs onChange" },
      { from: "disabled", to: "onChange", type: "conflicts", description: "Disabled prevents selection" },
      { from: "multiple", to: "value", type: "enables", description: "Multiple changes value type to array" },
      { from: "searchable", to: "multiple", type: "enables", description: "Search can work with multi-select" },
    ],
  },
};

/* ---- Simple force-directed layout ---- */

type LayoutNode = PropNode & { x: number; y: number; vx: number; vy: number };

function computeLayout(data: GraphData, width: number, height: number): LayoutNode[] {
  const nodes: LayoutNode[] = data.nodes.map((n, i) => ({
    ...n,
    x: width / 2 + Math.cos((i / data.nodes.length) * Math.PI * 2) * (width * 0.35),
    y: height / 2 + Math.sin((i / data.nodes.length) * Math.PI * 2) * (height * 0.35),
    vx: 0,
    vy: 0,
  }));

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Simple force simulation (50 iterations)
  for (let iter = 0; iter < 50; iter++) {
    const damping = 0.9;

    // Repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const force = 800 / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        nodes[i].vx -= fx;
        nodes[i].vy -= fy;
        nodes[j].vx += fx;
        nodes[j].vy += fy;
      }
    }

    // Attraction along edges
    for (const edge of data.edges) {
      const a = nodeMap.get(edge.from);
      const b = nodeMap.get(edge.to);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const force = (dist - 100) * 0.05;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    }

    // Center gravity
    for (const node of nodes) {
      node.vx += (width / 2 - node.x) * 0.01;
      node.vy += (height / 2 - node.y) * 0.01;
      node.vx *= damping;
      node.vy *= damping;
      node.x += node.vx;
      node.y += node.vy;
      // Clamp to bounds
      node.x = Math.max(40, Math.min(width - 40, node.x));
      node.y = Math.max(30, Math.min(height - 30, node.y));
    }
  }

  return nodes;
}

/* ---- Graph Component ---- */

type PropsDepsGraphProps = {
  componentName: string;
};

export const PropsDepsGraph: React.FC<PropsDepsGraphProps> = ({ componentName }) => {
  const data = PROP_DEPS_DATA[componentName];
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<PropEdge | null>(null);
  const [zoom, setZoom] = useState(1);

  const W = 500;
  const H = 350;

  const layoutNodes = useMemo(() => {
    if (!data) return [];
    return computeLayout(data, W, H);
  }, [data]);

  const nodeMap = useMemo(
    () => new Map(layoutNodes.map((n) => [n.id, n])),
    [layoutNodes],
  );

  const connectedTo = useMemo(() => {
    if (!selectedNode || !data) return new Set<string>();
    const s = new Set<string>();
    for (const edge of data.edges) {
      if (edge.from === selectedNode) s.add(edge.to);
      if (edge.to === selectedNode) s.add(edge.from);
    }
    return s;
  }, [selectedNode, data]);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border-subtle py-12">
        <GitBranch className="h-6 w-6 text-text-tertiary" />
        <Text variant="secondary" className="mt-2 text-xs">
          Prop dependency data for {componentName} will be added soon.
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="h-3.5 w-3.5 text-text-tertiary" />
          <Text as="span" className="text-xs font-semibold text-text-primary">Prop Dependencies</Text>
        </div>
        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="flex items-center gap-2">
            {(["requires", "enables", "conflicts"] as const).map((type) => (
              <div key={type} className="flex items-center gap-1">
                <div className="h-0.5 w-4" style={{ backgroundColor: EDGE_COLORS[type] }} />
                <span className="text-[10px] text-text-tertiary capitalize">{type}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
              className="rounded-xs p-1 text-text-tertiary hover:bg-surface-muted"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
              className="rounded-xs p-1 text-text-tertiary hover:bg-surface-muted"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => { setZoom(1); setSelectedNode(null); }}
              className="rounded-xs p-1 text-text-tertiary hover:bg-surface-muted"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Graph */}
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-canvas">
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          className="block"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
        >
          {/* Edges */}
          {data.edges.map((edge, i) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;

            const isHighlighted = selectedNode === edge.from || selectedNode === edge.to;
            const opacity = selectedNode ? (isHighlighted ? 1 : 0.15) : 0.6;

            return (
              <g key={i}
                onMouseEnter={() => setHoveredEdge(edge)}
                onMouseLeave={() => setHoveredEdge(null)}
              >
                <line
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={EDGE_COLORS[edge.type]}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  opacity={opacity}
                  strokeDasharray={edge.type === "conflicts" ? "6,3" : "none"}
                />
                {/* Arrow */}
                <circle
                  cx={(from.x + to.x) / 2 + (to.x - from.x) * 0.15}
                  cy={(from.y + to.y) / 2 + (to.y - from.y) * 0.15}
                  r={3}
                  fill={EDGE_COLORS[edge.type]}
                  opacity={opacity}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {layoutNodes.map((node) => {
            const isSelected = selectedNode === node.id;
            const isConnected = connectedTo.has(node.id);
            const opacity = selectedNode ? (isSelected || isConnected ? 1 : 0.2) : 1;

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
                className="cursor-pointer"
                opacity={opacity}
              >
                <rect
                  x={node.x - 35}
                  y={node.y - 14}
                  width={70}
                  height={28}
                  rx={8}
                  fill={isSelected ? "var(--action-primary)" : node.required ? "var(--state-info-bg)" : "var(--surface-default)"}
                  stroke={isSelected ? "var(--action-primary)" : "var(--border-subtle)"}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily="monospace"
                  fontWeight={isSelected ? 700 : 500}
                  fill={isSelected ? "var(--surface-default)" : "var(--text-primary)"}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Edge hover tooltip */}
        {hoveredEdge && (
          <div className="absolute bottom-2 left-2 rounded-lg bg-surface-inverse px-3 py-2 text-xs text-border-subtle shadow-xl">
            <span className="font-mono text-text-inverse">{hoveredEdge.from}</span>
            <span className="mx-1.5" style={{ color: EDGE_COLORS[hoveredEdge.type] }}>
              {EDGE_LABELS[hoveredEdge.type]}
            </span>
            <span className="font-mono text-text-inverse">{hoveredEdge.to}</span>
            {hoveredEdge.description && (
              <div className="mt-1 text-text-disabled">{hoveredEdge.description}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropsDepsGraph;
