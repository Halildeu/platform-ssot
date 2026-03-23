import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@mfe/design-system";
import { Search, ZoomIn, ZoomOut, Maximize2, Filter } from "lucide-react";
import { useDesignLab } from "../DesignLabProvider";
import type { DesignLabIndexItem } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  DependencyGraphPage — Interactive component dependency visualization */
/*                                                                     */
/*  Pure SVG/CSS — no external graph library needed.                   */
/*  Shows bidirectional component relationships via whereUsed data.    */
/*  Click node → navigate to component detail.                        */
/* ------------------------------------------------------------------ */

/* ---- Types ---- */

type GraphNode = {
  id: string;
  label: string;
  kind: string;
  lifecycle: string;
  layer: string;
  x: number;
  y: number;
  dependencyCount: number;
  dependentCount: number;
};

type GraphEdge = {
  source: string;
  target: string;
};

/* ---- Layer colors ---- */

const LAYER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  primitives: { bg: "#dbeafe", border: "#3b82f6", text: "#1d4ed8" },
  components: { bg: "#dcfce7", border: "#22c55e", text: "#15803d" },
  advanced: { bg: "#fef3c7", border: "#f59e0b", text: "#b45309" },
  patterns: { bg: "#f3e8ff", border: "#a855f7", text: "#7e22ce" },
  other: { bg: "#f1f5f9", border: "#94a3b8", text: "#475569" },
};

function getLayerFromItem(item: DesignLabIndexItem): string {
  const g = item.group?.toLowerCase() ?? "";
  if (g.includes("primitiv")) return "primitives";
  if (g.includes("component") || g.includes("form") || g.includes("feedback") || g.includes("data") || g.includes("navigation") || g.includes("overlay")) return "components";
  if (g.includes("advanced") || g.includes("enterprise")) return "advanced";
  if (g.includes("pattern") || g.includes("page") || g.includes("layout")) return "patterns";
  return "other";
}

/* ---- Layout: force-directed-ish positioning ---- */

function layoutNodes(items: DesignLabIndexItem[], edges: GraphEdge[]): GraphNode[] {
  const layerGroups: Record<string, DesignLabIndexItem[]> = {};

  for (const item of items) {
    const layer = getLayerFromItem(item);
    if (!layerGroups[layer]) layerGroups[layer] = [];
    layerGroups[layer].push(item);
  }

  const edgeSourceCount: Record<string, number> = {};
  const edgeTargetCount: Record<string, number> = {};
  for (const e of edges) {
    edgeSourceCount[e.source] = (edgeSourceCount[e.source] ?? 0) + 1;
    edgeTargetCount[e.target] = (edgeTargetCount[e.target] ?? 0) + 1;
  }

  const layerOrder = ["primitives", "components", "advanced", "patterns", "other"];
  const nodes: GraphNode[] = [];
  const colWidth = 280;
  const rowHeight = 64;

  for (let col = 0; col < layerOrder.length; col++) {
    const layer = layerOrder[col];
    const group = layerGroups[layer] ?? [];
    // Sort by connection count (most connected first)
    group.sort(
      (a, b) =>
        ((edgeSourceCount[b.name] ?? 0) + (edgeTargetCount[b.name] ?? 0)) -
        ((edgeSourceCount[a.name] ?? 0) + (edgeTargetCount[a.name] ?? 0)),
    );

    for (let row = 0; row < group.length; row++) {
      const item = group[row];
      nodes.push({
        id: item.name,
        label: item.name,
        kind: item.kind,
        lifecycle: item.lifecycle,
        layer,
        x: 60 + col * colWidth,
        y: 80 + row * rowHeight,
        dependencyCount: edgeSourceCount[item.name] ?? 0,
        dependentCount: edgeTargetCount[item.name] ?? 0,
      });
    }
  }

  return nodes;
}

/* ---- Main component ---- */

export default function DependencyGraphPage() {
  const { index } = useDesignLab();
  const navigate = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);

  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [layerFilter, setLayerFilter] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  /* Build graph data from index */
  const { nodes, edges, nodeMap } = useMemo(() => {
    const items = index?.items ?? [];
    const nameSet = new Set(items.map((i) => i.name));

    const edgeList: GraphEdge[] = [];
    for (const item of items) {
      for (const dep of item.whereUsed ?? []) {
        if (nameSet.has(dep)) {
          edgeList.push({ source: item.name, target: dep });
        }
      }
    }

    // If edges exist, only show connected items; otherwise show all
    const connectedNames = new Set<string>();
    for (const e of edgeList) {
      connectedNames.add(e.source);
      connectedNames.add(e.target);
    }

    const hasEdges = edgeList.length > 0;
    const filteredItems = hasEdges
      ? items.filter(
          (i) => connectedNames.has(i.name) || (search && i.name.toLowerCase().includes(search.toLowerCase())),
        )
      : items; // Show all items when no edge data available

    const nodeList = layoutNodes(filteredItems, edgeList);
    const nMap = new Map(nodeList.map((n) => [n.id, n]));

    return { nodes: nodeList, edges: edgeList, nodeMap: nMap };
  }, [index, search]);

  /* Filter by layer */
  const filteredNodes = useMemo(() => {
    let result = nodes;
    if (layerFilter) result = result.filter((n) => n.layer === layerFilter);
    if (search) result = result.filter((n) => n.label.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [nodes, layerFilter, search]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  const filteredEdges = useMemo(
    () => edges.filter((e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)),
    [edges, filteredNodeIds],
  );

  /* Highlighted edges when a node is selected */
  const highlightedEdges = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    const set = new Set<string>();
    for (const e of filteredEdges) {
      if (e.source === selectedNode || e.target === selectedNode) {
        set.add(`${e.source}->${e.target}`);
      }
    }
    return set;
  }, [selectedNode, filteredEdges]);

  const connectedToSelected = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    const set = new Set<string>();
    for (const e of filteredEdges) {
      if (e.source === selectedNode) set.add(e.target);
      if (e.target === selectedNode) set.add(e.source);
    }
    set.add(selectedNode);
    return set;
  }, [selectedNode, filteredEdges]);

  /* SVG dimensions */
  const svgWidth = useMemo(
    () => Math.max(1400, ...filteredNodes.map((n) => n.x + 240)),
    [filteredNodes],
  );
  const svgHeight = useMemo(
    () => Math.max(600, ...filteredNodes.map((n) => n.y + 60)),
    [filteredNodes],
  );

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (selectedNode === nodeId) {
        // Double-click navigates
        const item = (index?.items ?? []).find((i) => i.name === nodeId);
        if (item) {
          const layer = getLayerFromItem(item);
          if (layer === "primitives") {
            navigate(`/admin/design-lab/primitives/${item.taxonomyGroupId}/${encodeURIComponent(item.name.replace(/\//g, '~'))}`);
          } else if (layer === "advanced") {
            navigate(`/admin/design-lab/advanced/${encodeURIComponent(item.name.replace(/\//g, '~'))}`);
          } else {
            navigate(`/admin/design-lab/components/${item.taxonomyGroupId}/${encodeURIComponent(item.name.replace(/\//g, '~'))}`);
          }
        }
      } else {
        setSelectedNode(nodeId);
      }
    },
    [selectedNode, index, navigate],
  );

  /* Zoom controls */
  const zoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.3));
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  /* Mouse wheel zoom */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((z) => Math.max(0.3, Math.min(3, z + delta)));
    };
    svg.addEventListener("wheel", handler, { passive: false });
    return () => svg.removeEventListener("wheel", handler);
  }, []);

  /* Stats */
  const stats = useMemo(() => ({
    nodes: filteredNodes.length,
    edges: filteredEdges.length,
    layers: Array.from(new Set(filteredNodes.map((n) => n.layer))).length,
  }), [filteredNodes, filteredEdges]);

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle bg-surface-default px-6 py-3">
        <div>
          <Text as="h1" className="text-lg font-bold text-text-primary">
            Component Dependency Graph
          </Text>
          <Text variant="secondary" className="text-xs">
            {stats.nodes} nodes · {stats.edges} edges · {stats.layers} layers — Click to select, double-click to navigate
          </Text>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter components..."
              className="h-8 rounded-lg border border-border-subtle bg-surface-canvas pl-8 pr-3 text-xs text-text-primary placeholder:text-text-tertiary focus:border-action-primary focus:outline-hidden"
            />
          </div>

          {/* Layer filter */}
          <div className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-text-tertiary" />
            {["primitives", "components", "advanced", "patterns"].map((layer) => (
              <button
                key={layer}
                type="button"
                onClick={() => setLayerFilter(layerFilter === layer ? null : layer)}
                className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
                  layerFilter === layer
                    ? "bg-action-primary text-white"
                    : "text-text-tertiary hover:bg-surface-canvas hover:text-text-secondary"
                }`}
              >
                {layer}
              </button>
            ))}
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-1 rounded-lg border border-border-subtle p-0.5">
            <button type="button" onClick={zoomOut} className="rounded p-1 text-text-secondary hover:bg-surface-canvas" title="Zoom out">
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[3ch] text-center text-[10px] font-medium text-text-tertiary">
              {Math.round(zoom * 100)}%
            </span>
            <button type="button" onClick={zoomIn} className="rounded p-1 text-text-secondary hover:bg-surface-canvas" title="Zoom in">
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={resetView} className="rounded p-1 text-text-secondary hover:bg-surface-canvas" title="Reset">
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Graph canvas */}
      <div className="relative flex-1 overflow-hidden bg-surface-canvas">
        {/* Layer legend */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5 rounded-xl border border-border-subtle bg-surface-default/90 p-3 shadow-xs backdrop-blur-xs">
          <Text className="text-[9px] font-semibold uppercase tracking-widest text-text-tertiary">
            Layers
          </Text>
          {Object.entries(LAYER_COLORS).filter(([k]) => k !== "other").map(([layer, colors]) => (
            <div key={layer} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: colors.border }}
              />
              <Text className="text-[10px] capitalize text-text-secondary">{layer}</Text>
            </div>
          ))}
        </div>

        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`${-pan.x / zoom} ${-pan.y / zoom} ${svgWidth / zoom} ${svgHeight / zoom}`}
          className="cursor-grab active:cursor-grabbing"
        >
          {/* Defs for arrow markers */}
          <defs>
            <marker id="arrow" viewBox="0 0 10 6" refX="10" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 3 L 0 6 z" fill="#94a3b8" />
            </marker>
            <marker id="arrow-highlight" viewBox="0 0 10 6" refX="10" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 3 L 0 6 z" fill="#3b82f6" />
            </marker>
          </defs>

          {/* Edges */}
          {filteredEdges.map((edge) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return null;

            const key = `${edge.source}->${edge.target}`;
            const isHighlighted = highlightedEdges.has(key);
            const isHidden = selectedNode && !isHighlighted;

            return (
              <line
                key={key}
                x1={source.x + 100}
                y1={source.y + 20}
                x2={target.x}
                y2={target.y + 20}
                stroke={isHighlighted ? "#3b82f6" : "#cbd5e1"}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeOpacity={isHidden ? 0.15 : isHighlighted ? 1 : 0.5}
                markerEnd={isHighlighted ? "url(#arrow-highlight)" : "url(#arrow)"}
                className="transition-all duration-200"
              />
            );
          })}

          {/* Nodes */}
          {filteredNodes.map((node) => {
            const colors = LAYER_COLORS[node.layer] ?? LAYER_COLORS.other;
            const isSelected = selectedNode === node.id;
            const isConnected = connectedToSelected.has(node.id);
            const isFaded = selectedNode && !isConnected;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleNodeClick(node.id)}
                className="cursor-pointer"
                opacity={isFaded ? 0.2 : 1}
                style={{ transition: "opacity 0.2s" }}
              >
                <rect
                  width={200}
                  height={44}
                  rx={12}
                  fill={colors.bg}
                  stroke={isSelected ? "#2563eb" : colors.border}
                  strokeWidth={isSelected ? 2.5 : 1}
                />
                <text
                  x={14}
                  y={19}
                  fontSize={12}
                  fontWeight={600}
                  fill={colors.text}
                  className="select-none"
                >
                  {node.label.length > 22 ? `${node.label.slice(0, 20)}…` : node.label}
                </text>
                <text x={14} y={34} fontSize={9} fill={colors.text} opacity={0.7} className="select-none">
                  {node.lifecycle} · {node.dependencyCount}↗ {node.dependentCount}↙
                </text>
                {/* Connection count badge */}
                {(node.dependencyCount + node.dependentCount) > 3 && (
                  <g transform="translate(176, -6)">
                    <circle r={10} fill={colors.border} />
                    <text textAnchor="middle" y={4} fontSize={9} fontWeight={700} fill="white" className="select-none">
                      {node.dependencyCount + node.dependentCount}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected node details panel */}
        {selectedNode && nodeMap.has(selectedNode) && (
          <div className="absolute bottom-4 right-4 z-10 w-72 rounded-2xl border border-border-subtle bg-surface-default/95 p-4 shadow-lg backdrop-blur-xs">
            <div className="flex items-start justify-between">
              <div>
                <Text as="div" className="font-semibold text-text-primary">
                  {selectedNode}
                </Text>
                <Text variant="secondary" className="mt-0.5 text-xs">
                  {nodeMap.get(selectedNode)!.layer} · {nodeMap.get(selectedNode)!.lifecycle}
                </Text>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="rounded-md p-1 text-text-tertiary hover:text-text-primary"
              >
                ✕
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-surface-canvas p-2 text-center">
                <Text as="div" className="text-lg font-bold text-text-primary">
                  {nodeMap.get(selectedNode)!.dependencyCount}
                </Text>
                <Text variant="secondary" className="text-[10px]">Dependencies</Text>
              </div>
              <div className="rounded-lg bg-surface-canvas p-2 text-center">
                <Text as="div" className="text-lg font-bold text-text-primary">
                  {nodeMap.get(selectedNode)!.dependentCount}
                </Text>
                <Text variant="secondary" className="text-[10px]">Dependents</Text>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleNodeClick(selectedNode)}
              className="mt-3 w-full rounded-lg bg-action-primary px-3 py-2 text-xs font-medium text-white transition hover:bg-action-primary/90"
            >
              Go to Component →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
