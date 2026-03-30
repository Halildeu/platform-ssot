import type { SchemaSnapshot } from '../api/schemaApi';

interface DeadTablesProps {
  snapshot: SchemaSnapshot;
  onTableSelect: (table: string) => void;
}

export const DeadTables = ({ snapshot, onTableSelect }: DeadTablesProps) => {
  const deadTables = snapshot.analysis.deadTables;

  return (
    <div className="se-dead-tables">
      <div className="se-dead-tables__header">
        <h3>Dead / Orphan Tables</h3>
        <span className="se-badge se-badge--ref">{deadTables.length} tables</span>
      </div>
      <p className="se-dead-tables__desc">
        Tables with zero relationships — possibly unused or undiscovered connections.
      </p>
      <div className="se-dead-tables__list">
        {deadTables.map(dt => (
          <div
            key={dt.table}
            className="se-rel-card"
            onClick={() => onTableSelect(dt.table)}
          >
            <span>{dt.table}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="se-badge se-badge--col">{dt.reason}</span>
              {dt.rowCount != null && (
                <span className="se-badge se-badge--col">
                  {dt.rowCount === 0 ? 'EMPTY' : `${dt.rowCount.toLocaleString()} rows`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
