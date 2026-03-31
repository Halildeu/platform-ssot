import { useState, useEffect } from 'react';

interface LineageNode {
  table: string;
  column: string;
  type: 'source' | 'transform' | 'target' | 'consumer';
}

interface LineageEdge {
  from: LineageNode;
  to: LineageNode;
  transformation: string;
}

interface LineageGraph {
  targetTable: string;
  targetColumn: string;
  nodes: LineageNode[];
  edges: LineageEdge[];
}

interface ColumnLineageProps {
  tableName: string;
  columnName: string;
  onTableSelect: (table: string) => void;
  onClose: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  source: 'var(--se-green)',
  transform: 'var(--se-orange)',
  target: 'var(--se-accent)',
  consumer: '#8b5cf6',
};

const TYPE_LABELS: Record<string, string> = {
  source: 'Kaynak',
  transform: 'Dönüşüm',
  target: 'Hedef',
  consumer: 'Tüketici',
};

export const ColumnLineage = ({ tableName, columnName, onTableSelect, onClose }: ColumnLineageProps) => {
  const [graph, setGraph] = useState<LineageGraph | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/schema/lineage/${tableName}/${columnName}`)
      .then(r => r.json())
      .then(setGraph)
      .catch(() => setGraph(null))
      .finally(() => setLoading(false));
  }, [tableName, columnName]);

  if (loading) return <div className="se-search__loading">Tracing column lineage...</div>;
  if (!graph || graph.nodes.length === 0) {
    return (
      <div className="se-lineage">
        <div className="se-lineage__header">
          <h3>Column Lineage: {tableName}.{columnName}</h3>
          <button className="se-detail__close" onClick={onClose}>&times;</button>
        </div>
        <div className="se-search__empty" style={{ height: 'auto', padding: 32 }}>
          No lineage data found for this column.
        </div>
      </div>
    );
  }

  // Group nodes by type
  const byType: Record<string, LineageNode[]> = {};
  for (const node of graph.nodes) {
    const t = node.type || 'source';
    if (!byType[t]) byType[t] = [];
    byType[t].push(node);
  }

  return (
    <div className="se-lineage">
      <div className="se-lineage__header">
        <div>
          <h3>Column Lineage</h3>
          <code style={{ color: 'var(--se-accent)', fontSize: 13 }}>
            {tableName}.{columnName}
          </code>
        </div>
        <button className="se-detail__close" onClick={onClose}>&times;</button>
      </div>

      <div className="se-lineage__summary">
        <span className="se-badge se-badge--col">{graph.nodes.length} nodes</span>
        <span className="se-badge se-badge--col">{graph.edges.length} edges</span>
      </div>

      {/* Flow diagram (text-based) */}
      <div className="se-lineage__flow">
        {['source', 'transform', 'target', 'consumer'].map(type => {
          const nodes = byType[type];
          if (!nodes || nodes.length === 0) return null;
          return (
            <div key={type} className="se-lineage__group">
              <div className="se-lineage__group-label" style={{ color: TYPE_COLORS[type] }}>
                {TYPE_LABELS[type] || type} ({nodes.length})
              </div>
              {nodes.map((node, i) => (
                <div
                  key={`${node.table}-${node.column}-${i}`}
                  className="se-lineage__node"
                  style={{ borderLeftColor: TYPE_COLORS[type] }}
                  onClick={() => onTableSelect(node.table)}
                >
                  <strong style={{ color: 'var(--se-accent)' }}>{node.table}</strong>
                  <code>.{node.column}</code>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Edges */}
      {graph.edges.length > 0 && (
        <div className="se-lineage__edges">
          <h4>Data Flow</h4>
          {graph.edges.map((edge, i) => (
            <div key={i} className="se-lineage__edge">
              <span onClick={() => onTableSelect(edge.from.table)} style={{ cursor: 'pointer', color: 'var(--se-accent)' }}>
                {edge.from.table}.{edge.from.column}
              </span>
              <span className="se-rel-card__arrow"> → </span>
              <span onClick={() => onTableSelect(edge.to.table)} style={{ cursor: 'pointer', color: 'var(--se-accent)' }}>
                {edge.to.table}.{edge.to.column}
              </span>
              <span style={{ fontSize: 10, color: 'var(--se-text-dim)', marginLeft: 8 }}>
                ({edge.transformation})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
