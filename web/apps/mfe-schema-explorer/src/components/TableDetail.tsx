import { useMemo } from 'react';
import type { SchemaSnapshot, Relationship } from '../api/schemaApi';

interface TableDetailProps {
  snapshot: SchemaSnapshot;
  tableName: string;
  onClose: () => void;
  onFkClick: (table: string) => void;
}

export const TableDetail = ({ snapshot, tableName, onClose, onFkClick }: TableDetailProps) => {
  const table = snapshot.tables[tableName];
  if (!table) return null;

  const fkMap = useMemo(() => {
    const map: Record<string, Relationship> = {};
    for (const rel of snapshot.relationships) {
      if (rel.fromTable === tableName) map[rel.fromColumn] = rel;
    }
    return map;
  }, [snapshot.relationships, tableName]);

  const incomingRefs = useMemo(
    () => snapshot.relationships.filter(r => r.toTable === tableName),
    [snapshot.relationships, tableName],
  );

  const domain = useMemo(() => {
    for (const [d, tables] of Object.entries(snapshot.domains)) {
      if (tables.includes(tableName)) return d;
    }
    return null;
  }, [snapshot.domains, tableName]);

  const confClass = (c: number) => c >= 0.9 ? 'se-conf--high' : c >= 0.8 ? 'se-conf--med' : 'se-conf--low';

  return (
    <aside className="se-detail">
      <div className="se-detail__header">
        <div>
          <h2>{tableName}</h2>
          <div className="se-detail__badges">
            <span className="se-badge se-badge--col">{table.columns.length} cols</span>
            <span className="se-badge se-badge--fk">{Object.keys(fkMap).length} FK</span>
            <span className="se-badge se-badge--ref">{incomingRefs.length} refs</span>
            {domain && <span className="se-badge se-badge--domain">{domain}</span>}
            {table.rowCount != null && (
              <span className="se-badge se-badge--col">{table.rowCount.toLocaleString()} rows</span>
            )}
          </div>
        </div>
        <button className="se-detail__close" onClick={onClose}>&times;</button>
      </div>

      <div className="se-detail__content">
        <section className="se-detail__section">
          <h3>Columns ({table.columns.length})</h3>
          <table className="se-col-table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Type</th><th>Null</th><th>FK</th></tr>
            </thead>
            <tbody>
              {table.columns.map((col, i) => (
                <tr key={col.name}>
                  <td className="se-col-table__num">{i + 1}</td>
                  <td className={col.pk ? 'se-col--pk' : ''}>{col.pk && '\uD83D\uDD11 '}{col.name}</td>
                  <td className="se-col--type">{col.dataType}</td>
                  <td className="se-col--nullable">{col.nullable ? 'NULL' : 'NOT NULL'}</td>
                  <td>
                    {fkMap[col.name] && (
                      <span className="se-col--fk" onClick={() => onFkClick(fkMap[col.name].toTable)}>
                        → {fkMap[col.name].toTable}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {Object.keys(fkMap).length > 0 && (
          <section className="se-detail__section">
            <h3>FK Relationships ({Object.keys(fkMap).length})</h3>
            {Object.values(fkMap).map(rel => (
              <div key={`${rel.fromColumn}-${rel.toTable}`} className="se-rel-card" onClick={() => onFkClick(rel.toTable)}>
                <code>{rel.fromColumn}</code>
                {' '}<span className="se-rel-card__arrow">→</span>{' '}
                <strong>{rel.toTable}</strong>
                <span className={`se-conf ${confClass(rel.confidence)}`}>
                  {Math.round(rel.confidence * 100)}%
                </span>
              </div>
            ))}
          </section>
        )}

        {incomingRefs.length > 0 && (
          <section className="se-detail__section">
            <h3>Referenced By ({incomingRefs.length})</h3>
            {incomingRefs.map(rel => (
              <div key={`${rel.fromTable}-${rel.fromColumn}`} className="se-rel-card" onClick={() => onFkClick(rel.fromTable)}>
                <strong>{rel.fromTable}</strong>
                <code>.{rel.fromColumn}</code>
                {' '}<span className="se-rel-card__arrow">→</span>{' '}
                {tableName}
                <span className={`se-conf ${confClass(rel.confidence)}`}>
                  {Math.round(rel.confidence * 100)}%
                </span>
              </div>
            ))}
          </section>
        )}
      </div>
    </aside>
  );
};
