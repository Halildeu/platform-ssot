import { useEffect, useRef, useCallback } from 'react';
import cytoscape, { type Core, type ElementDefinition } from 'cytoscape';
import fcose from 'cytoscape-fcose';
import type { SchemaSnapshot, Relationship as _Relationship } from '../api/schemaApi';

cytoscape.use(fcose);

interface SchemaGraphProps {
  snapshot: SchemaSnapshot;
  selectedTable: string | null;
  viewMode: 'domain' | 'neighborhood';
  onTableSelect: (table: string) => void;
  onViewModeChange: (mode: 'domain' | 'neighborhood') => void;
}

const CYTOSCAPE_STYLE: cytoscape.StylesheetStyle[] = [
  {
    selector: 'node[type="table"]',
    style: {
      label: 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': 10,
      color: '#e4e6ef',
      'background-color': '#1a1d27',
      'border-width': 1.5,
      'border-color': '#2a2d3a',
      width: 'mapData(refCount, 0, 50, 40, 100)',
      height: 'mapData(refCount, 0, 50, 40, 100)',
      shape: 'roundrectangle',
      'min-zoomed-font-size': 8,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  },
  {
    selector: 'node[type="table"][?isHub]',
    style: {
      'background-color': '#1e2a42',
      'border-color': '#4f8ff7',
      'border-width': 2,
      'font-weight': 'bold',
      'font-size': 12,
    },
  },
  {
    selector: 'node[type="domain"]',
    style: {
      label: 'data(label)',
      'text-valign': 'top',
      'text-halign': 'center',
      'font-size': 14,
      'font-weight': 'bold',
      color: '#4f8ff7',
      'background-color': 'rgba(79,143,247,0.05)',
      'border-width': 1,
      'border-color': 'rgba(79,143,247,0.2)',
      'border-style': 'dashed',
      shape: 'roundrectangle',
      padding: 20,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  },
  {
    selector: 'node.highlighted',
    style: { 'border-color': '#4f8ff7', 'border-width': 3, 'background-color': '#1e2a42' },
  },
  {
    selector: 'node.selected-node',
    style: { 'border-color': '#f0983e', 'border-width': 3, 'background-color': '#2a1e0e' },
  },
  {
    selector: 'node.dimmed',
    style: { opacity: 0.15 },
  },
  {
    selector: 'edge',
    style: {
      width: 1,
      'line-color': '#2a2d3a',
      'target-arrow-shape': 'triangle',
      'target-arrow-color': '#2a2d3a',
      'arrow-scale': 0.6,
      'curve-style': 'straight',
      opacity: 0.6,
    },
  },
  {
    selector: 'edge.highlighted',
    style: { 'line-color': '#4f8ff7', 'target-arrow-color': '#4f8ff7', width: 2, opacity: 1 },
  },
  {
    selector: 'edge.dimmed',
    style: { opacity: 0.05 },
  },
];

export const SchemaGraph = ({ snapshot, selectedTable, viewMode, onTableSelect, onViewModeChange }: SchemaGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  // Init Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [],
      style: CYTOSCAPE_STYLE,
      layout: { name: 'preset' },
      wheelSensitivity: 0.3,
      minZoom: 0.1,
      maxZoom: 3,
      pixelRatio: 1.0,
      hideEdgesOnViewport: true,
    });

    cy.on('tap', 'node[type="table"]', evt => onTableSelect(evt.target.data('id')));

    cy.on('mouseover', 'node[type="table"]', evt => {
      cy.batch(() => {
        cy.elements().addClass('dimmed');
        const node = evt.target;
        node.removeClass('dimmed').addClass('highlighted');
        node.connectedEdges().removeClass('dimmed').addClass('highlighted');
        node.neighborhood('node').removeClass('dimmed').addClass('highlighted');
      });
    });

    cy.on('mouseout', 'node[type="table"]', () => {
      cy.batch(() => cy.elements().removeClass('dimmed highlighted'));
    });

    cyRef.current = cy;
    return () => cy.destroy();
  }, [onTableSelect]);

  // Update elements
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const elements = viewMode === 'neighborhood' && selectedTable
      ? buildNeighborhood(snapshot, selectedTable)
      : buildDomainMap(snapshot);

    cy.batch(() => {
      cy.elements().remove();
      cy.add(elements);
    });

    // Guard: fcose crashes on empty graphs or graphs with only compound nodes
    const tableNodes = cy.nodes('[type="table"]');
    if (tableNodes.length === 0) return;

    try {
      cy.layout({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: 'fcose' as any,
        quality: viewMode === 'neighborhood' ? 'default' : 'draft',
        animate: true,
        animationDuration: 500,
        randomize: true,
        nodeSeparation: viewMode === 'neighborhood' ? 80 : 120,
        idealEdgeLength: 100,
        nodeRepulsion: 8000,
        numIter: viewMode === 'neighborhood' ? 1500 : 500,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any).run();
    } catch (e) {
      // Fallback to grid layout if fcose fails
      console.warn('fcose layout failed, falling back to grid:', e);
      cy.layout({ name: 'grid', animate: true }).run();
    }

    if (selectedTable) {
      const node = cy.getElementById(selectedTable);
      if (node.length) node.addClass('selected-node');
    }
  }, [snapshot, selectedTable, viewMode]);

  const handleZoomIn = useCallback(() => { cyRef.current?.zoom(cyRef.current.zoom() * 1.3); }, []);
  const handleZoomOut = useCallback(() => { cyRef.current?.zoom(cyRef.current.zoom() / 1.3); }, []);
  const handleFit = useCallback(() => { cyRef.current?.fit(undefined, 30); }, []);

  return (
    <div className="se-graph">
      <div className="se-graph__toolbar">
        <button className={viewMode === 'domain' ? 'active' : ''} onClick={() => onViewModeChange('domain')}>
          Domain Map
        </button>
        <button className={viewMode === 'neighborhood' ? 'active' : ''} onClick={() => onViewModeChange('neighborhood')}>
          Neighborhood
        </button>
      </div>
      <div ref={containerRef} className="se-graph__canvas" />
      <div className="se-graph__controls">
        <button onClick={handleZoomIn}>+</button>
        <button onClick={handleZoomOut}>-</button>
        <button onClick={handleFit}>&#8644;</button>
      </div>
    </div>
  );
};

function buildDomainMap(snapshot: SchemaSnapshot): ElementDefinition[] {
  const elements: ElementDefinition[] = [];
  const refCounts: Record<string, number> = {};
  for (const rel of snapshot.relationships) {
    refCounts[rel.toTable] = (refCounts[rel.toTable] || 0) + 1;
  }

  const nodeSet = new Set<string>();
  for (const [domain, tables] of Object.entries(snapshot.domains)) {
    elements.push({ data: { id: domain, label: `${domain} (${tables.length})`, type: 'domain' } });
    const sorted = [...tables].sort((a, b) => (refCounts[b] || 0) - (refCounts[a] || 0)).slice(0, 20);
    for (const tbl of sorted) {
      elements.push({ data: { id: tbl, label: tbl, type: 'table', parent: domain, refCount: refCounts[tbl] || 0, isHub: (refCounts[tbl] || 0) >= 10 } });
      nodeSet.add(tbl);
    }
  }

  for (const rel of snapshot.relationships) {
    if (nodeSet.has(rel.fromTable) && nodeSet.has(rel.toTable)) {
      elements.push({ data: { id: `e-${rel.fromTable}-${rel.fromColumn}-${rel.toTable}`, source: rel.fromTable, target: rel.toTable } });
    }
  }
  return elements;
}

function buildNeighborhood(snapshot: SchemaSnapshot, center: string): ElementDefinition[] {
  const included = new Set<string>([center]);
  for (const rel of snapshot.relationships) {
    if (rel.fromTable === center) included.add(rel.toTable);
    if (rel.toTable === center) included.add(rel.fromTable);
  }

  const refCounts: Record<string, number> = {};
  for (const rel of snapshot.relationships) {
    if (included.has(rel.toTable)) refCounts[rel.toTable] = (refCounts[rel.toTable] || 0) + 1;
  }

  // Limit to 60 nodes
  let final: Set<string>;
  if (included.size > 60) {
    const sorted = [...included].filter(t => t !== center).sort((a, b) => (refCounts[b] || 0) - (refCounts[a] || 0)).slice(0, 59);
    final = new Set([center, ...sorted]);
  } else {
    final = included;
  }

  const elements: ElementDefinition[] = [];
  for (const tbl of final) {
    elements.push({
      data: { id: tbl, label: tbl, type: 'table', refCount: refCounts[tbl] || 0, isHub: (refCounts[tbl] || 0) >= 10 },
      classes: tbl === center ? 'selected-node' : '',
    });
  }
  for (const rel of snapshot.relationships) {
    if (final.has(rel.fromTable) && final.has(rel.toTable)) {
      elements.push({ data: { id: `e-${rel.fromTable}-${rel.fromColumn}-${rel.toTable}`, source: rel.fromTable, target: rel.toTable } });
    }
  }
  return elements;
}
