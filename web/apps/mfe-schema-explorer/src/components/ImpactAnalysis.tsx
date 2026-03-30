import { useState } from 'react';
import { useImpactAnalysis } from '../hooks/useSchemaData';

interface ImpactAnalysisProps {
  tableName: string;
  onTableSelect: (table: string) => void;
}

export const ImpactAnalysis = ({ tableName, onTableSelect }: ImpactAnalysisProps) => {
  const [hops, setHops] = useState(2);
  const { data, isLoading } = useImpactAnalysis(tableName, hops);

  return (
    <div className="se-impact">
      <div className="se-impact__header">
        <h3>Impact Analysis: {tableName}</h3>
        <div className="se-impact__controls">
          <label>Depth:</label>
          {[1, 2, 3].map(h => (
            <button
              key={h}
              className={`se-badge ${hops === h ? 'se-badge--active' : ''}`}
              onClick={() => setHops(h)}
            >
              {h} hop{h > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="se-search__loading">Analyzing impact...</div>}

      {data && (
        <div className="se-impact__results">
          <div className="se-impact__summary">
            <div className="se-impact__stat">
              <strong>{data.affectedCount}</strong>
              <span>affected tables</span>
            </div>
          </div>

          <div className="se-impact__list">
            {data.affectedTables.map((table: string) => (
              <div
                key={table}
                className="se-rel-card"
                onClick={() => onTableSelect(table)}
              >
                <span style={{ color: 'var(--se-accent)', fontWeight: 600 }}>{table}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
