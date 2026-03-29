import { useEffect, useRef, useState, useMemo } from 'preact/hooks';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';

cytoscape.use(fcose);

const LAYOUT_OPTIONS = {
  name: 'fcose',
  quality: 'default',
  animate: true,
  animationDuration: 500,
  randomize: false,
  nodeSeparation: 120,
  idealEdgeLength: 100,
  nodeRepulsion: 8000,
  edgeElasticity: 0.45,
  gravity: 0.25,
  gravityRange: 3.8,
  numIter: 2500,
};

const NODE_STYLE = [
  {
    selector: 'node[type="table"]',
    style: {
      label: 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': 10,
      'font-family': '-apple-system, BlinkMacSystemFont, sans-serif',
      color: '#e4e6ef',
      'background-color': '#1a1d27',
      'border-width': 1.5,
      'border-color': '#2a2d3a',
      width: 'mapData(refCount, 0, 50, 40, 100)',
      height: 'mapData(refCount, 0, 50, 40, 100)',
      shape: 'roundrectangle',
      'min-zoomed-font-size': 8,
    },
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
      'padding': 20,
      'compound-sizing-wrt-labels': 'include',
    },
  },
  {
    selector: 'node.highlighted',
    style: {
      'border-color': '#4f8ff7',
      'border-width': 3,
      'background-color': '#1e2a42',
    },
  },
  {
    selector: 'node.selected-node',
    style: {
      'border-color': '#f0983e',
      'border-width': 3,
      'background-color': '#2a1e0e',
    },
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
    style: {
      'line-color': '#4f8ff7',
      'target-arrow-color': '#4f8ff7',
      width: 2,
      opacity: 1,
    },
  },
  {
    selector: 'edge.dimmed',
    style: { opacity: 0.05 },
  },
];

export function GraphView({ data, selectedTable, viewMode, onTableSelect, onViewModeChange }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  // Build graph elements based on view mode
  const elements = useMemo(() => {
    if (viewMode === 'neighborhood' && selectedTable) {
      return buildNeighborhoodElements(data, selectedTable);
    }
    return buildDomainElements(data);
  }, [data, selectedTable, viewMode]);

  // Initialize Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [],
      style: NODE_STYLE,
      layout: { name: 'preset' },
      wheelSensitivity: 0.3,
      minZoom: 0.1,
      maxZoom: 3,
      pixelRatio: 1.0,
      hideEdgesOnViewport: true,
    });

    cy.on('tap', 'node[type="table"]', (evt) => {
      onTableSelect(evt.target.data('id'));
    });

    cy.on('mouseover', 'node[type="table"]', (evt) => {
      highlightNeighbors(cy, evt.target);
    });

    cy.on('mouseout', 'node[type="table"]', () => {
      clearHighlight(cy);
    });

    cy.on('tap', 'node[type="domain"]', (evt) => {
      // Expand domain: switch to neighborhood of first table in domain
      const domainId = evt.target.data('id');
      const tables = data.domains[domainId];
      if (tables && tables.length > 0) {
        // Find the most connected table in the domain
        const refCounts = {};
        for (const rel of data.relationships) {
          if (tables.includes(rel.to_table)) {
            refCounts[rel.to_table] = (refCounts[rel.to_table] || 0) + 1;
          }
        }
        const topTable = Object.entries(refCounts).sort((a, b) => b[1] - a[1])[0];
        if (topTable) onTableSelect(topTable[0]);
        else onTableSelect(tables[0]);
      }
    });

    cyRef.current = cy;

    return () => cy.destroy();
  }, []);

  // Update elements when they change
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !elements.length) return;

    cy.batch(() => {
      cy.elements().remove();
      cy.add(elements);
    });

    const layoutOpts = viewMode === 'neighborhood'
      ? { ...LAYOUT_OPTIONS, numIter: 1500, nodeSeparation: 80 }
      : { ...LAYOUT_OPTIONS, quality: 'draft', numIter: 500 };

    cy.layout(layoutOpts).run();

    // Highlight selected table
    if (selectedTable) {
      const node = cy.getElementById(selectedTable);
      if (node.length) {
        node.addClass('selected-node');
      }
    }
  }, [elements, selectedTable, viewMode]);

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.3);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() / 1.3);
  const handleFit = () => cyRef.current?.fit(undefined, 30);

  return (
    <div style="width:100%;height:100%;position:relative">
      <div class="graph-toolbar">
        <button
          class={viewMode === 'domain' ? 'active' : ''}
          onClick={() => onViewModeChange('domain')}
        >
          Domain Map
        </button>
        <button
          class={viewMode === 'neighborhood' ? 'active' : ''}
          onClick={() => onViewModeChange('neighborhood')}
        >
          Neighborhood
        </button>
      </div>

      <div ref={containerRef} class="graph-canvas" />

      <div class="graph-controls">
        <button onClick={handleZoomIn}>+</button>
        <button onClick={handleZoomOut}>-</button>
        <button onClick={handleFit}>&#8644;</button>
      </div>
    </div>
  );
}

function buildDomainElements(data) {
  const elements = [];
  const domainEdges = {};

  // Add domain compound nodes
  for (const [domain, tables] of Object.entries(data.domains)) {
    elements.push({
      data: {
        id: domain,
        label: `${domain} (${tables.length})`,
        type: 'domain',
        tableCount: tables.length,
      },
    });

    // Add table nodes inside domains (only top N per domain for performance)
    const MAX_PER_DOMAIN = 20;
    const refCounts = {};
    for (const rel of data.relationships) {
      if (tables.includes(rel.to_table)) {
        refCounts[rel.to_table] = (refCounts[rel.to_table] || 0) + 1;
      }
    }

    const sortedTables = tables
      .sort((a, b) => (refCounts[b] || 0) - (refCounts[a] || 0))
      .slice(0, MAX_PER_DOMAIN);

    for (const tbl of sortedTables) {
      const rc = refCounts[tbl] || 0;
      elements.push({
        data: {
          id: tbl,
          label: tbl,
          type: 'table',
          parent: domain,
          refCount: rc,
          isHub: rc >= 10,
        },
      });
    }
  }

  // Add inter-domain edges (aggregate)
  const tableToNode = new Set(elements.filter(e => e.data.type === 'table').map(e => e.data.id));
  for (const rel of data.relationships) {
    if (tableToNode.has(rel.from_table) && tableToNode.has(rel.to_table)) {
      elements.push({
        data: {
          id: `e-${rel.from_table}-${rel.from_column}-${rel.to_table}`,
          source: rel.from_table,
          target: rel.to_table,
        },
      });
    }
  }

  return elements;
}

function buildNeighborhoodElements(data, centerTable, hops = 1) {
  const elements = [];
  const includedTables = new Set([centerTable]);
  const includedEdges = [];

  // Collect N-hop neighbors
  let frontier = new Set([centerTable]);
  for (let i = 0; i < hops; i++) {
    const nextFrontier = new Set();
    for (const rel of data.relationships) {
      if (frontier.has(rel.from_table) && !includedTables.has(rel.to_table)) {
        includedTables.add(rel.to_table);
        nextFrontier.add(rel.to_table);
      }
      if (frontier.has(rel.to_table) && !includedTables.has(rel.from_table)) {
        includedTables.add(rel.from_table);
        nextFrontier.add(rel.from_table);
      }
    }
    frontier = nextFrontier;
  }

  // Limit to max 60 nodes for performance
  const MAX_NODES = 60;
  const refCounts = {};
  for (const rel of data.relationships) {
    if (includedTables.has(rel.to_table)) {
      refCounts[rel.to_table] = (refCounts[rel.to_table] || 0) + 1;
    }
  }

  let finalTables;
  if (includedTables.size > MAX_NODES) {
    // Keep center + most connected neighbors
    const sorted = [...includedTables]
      .filter(t => t !== centerTable)
      .sort((a, b) => (refCounts[b] || 0) - (refCounts[a] || 0))
      .slice(0, MAX_NODES - 1);
    finalTables = new Set([centerTable, ...sorted]);
  } else {
    finalTables = includedTables;
  }

  // Add nodes
  for (const tbl of finalTables) {
    const rc = refCounts[tbl] || 0;
    elements.push({
      data: {
        id: tbl,
        label: tbl,
        type: 'table',
        refCount: rc,
        isHub: rc >= 10,
        isCenter: tbl === centerTable,
      },
      classes: tbl === centerTable ? 'selected-node' : '',
    });
  }

  // Add edges between included tables
  for (const rel of data.relationships) {
    if (finalTables.has(rel.from_table) && finalTables.has(rel.to_table)) {
      elements.push({
        data: {
          id: `e-${rel.from_table}-${rel.from_column}-${rel.to_table}`,
          source: rel.from_table,
          target: rel.to_table,
          label: rel.from_column,
        },
      });
    }
  }

  return elements;
}

function highlightNeighbors(cy, node) {
  cy.batch(() => {
    cy.elements().addClass('dimmed');
    node.removeClass('dimmed').addClass('highlighted');
    node.connectedEdges().removeClass('dimmed').addClass('highlighted');
    node.neighborhood('node').removeClass('dimmed').addClass('highlighted');
  });
}

function clearHighlight(cy) {
  cy.batch(() => {
    cy.elements().removeClass('dimmed highlighted');
  });
}
