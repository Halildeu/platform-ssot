import { useMemo } from 'preact/hooks';

export function TableDetail({ data, tableName, onClose, onFkClick }) {
  const table = data.tables[tableName];
  if (!table) return null;

  // Build FK lookup for this table
  const fkMap = useMemo(() => {
    const map = {};
    for (const rel of data.relationships) {
      if (rel.from_table === tableName) {
        map[rel.from_column] = rel;
      }
    }
    return map;
  }, [data.relationships, tableName]);

  // Incoming references
  const incomingRefs = useMemo(() => {
    return data.relationships.filter(r => r.to_table === tableName);
  }, [data.relationships, tableName]);

  // Find domain
  const domain = useMemo(() => {
    for (const [d, tables] of Object.entries(data.domains)) {
      if (tables.includes(tableName)) return d;
    }
    return null;
  }, [data.domains, tableName]);

  const confClass = (c) => c >= 0.9 ? 'conf-high' : c >= 0.8 ? 'conf-med' : 'conf-low';

  return (
    <div class="detail-panel">
      <div class="detail-header">
        <div>
          <h2>{tableName}</h2>
          <div style="display:flex;gap:6px;marginTop:4px">
            <span class="badge badge-col">{table.columns.length} cols</span>
            <span class="badge badge-fk">{Object.keys(fkMap).length} FK</span>
            <span class="badge badge-ref">{incomingRefs.length} refs</span>
            {domain && <span class="domain-tag">{domain}</span>}
            {table.row_count != null && (
              <span class="badge" style="background:rgba(255,255,255,0.08);color:var(--text-dim)">
                {table.row_count.toLocaleString()} rows
              </span>
            )}
          </div>
        </div>
        <button class="close-btn" onClick={onClose}>&times;</button>
      </div>

      <div class="detail-content">
        {/* Columns */}
        <div class="detail-section">
          <h3>Columns ({table.columns.length})</h3>
          <table class="col-table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Type</th><th>Null</th><th>FK</th></tr>
            </thead>
            <tbody>
              {table.columns.map((col, i) => (
                <tr key={col.name}>
                  <td style="color:var(--text-dim)">{i + 1}</td>
                  <td class={col.pk ? 'col-pk' : ''}>
                    {col.pk && '🔑 '}{col.name}
                  </td>
                  <td class="col-type">{col.type}</td>
                  <td class="col-nullable">{col.nullable ? 'NULL' : 'NOT NULL'}</td>
                  <td>
                    {fkMap[col.name] && (
                      <span
                        class="col-fk"
                        onClick={() => onFkClick(fkMap[col.name].to_table)}
                      >
                        → {fkMap[col.name].to_table}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Outgoing FKs */}
        {Object.keys(fkMap).length > 0 && (
          <div class="detail-section">
            <h3>FK Relationships ({Object.keys(fkMap).length})</h3>
            {Object.values(fkMap).map(rel => (
              <div
                key={`${rel.from_column}-${rel.to_table}`}
                class="rel-card"
                onClick={() => onFkClick(rel.to_table)}
              >
                <span style="fontFamily:var(--mono)">{rel.from_column}</span>
                {' '}<span class="arrow">→</span>{' '}
                <span style="color:var(--accent);fontWeight:600">{rel.to_table}</span>
                <span class={`confidence ${confClass(rel.confidence)}`}>
                  {Math.round(rel.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Incoming refs */}
        {incomingRefs.length > 0 && (
          <div class="detail-section">
            <h3>Referenced By ({incomingRefs.length})</h3>
            {incomingRefs.map(rel => (
              <div
                key={`${rel.from_table}-${rel.from_column}`}
                class="rel-card"
                onClick={() => onFkClick(rel.from_table)}
              >
                <span style="color:var(--accent);fontWeight:600">{rel.from_table}</span>
                <span style="fontFamily:var(--mono)">.{rel.from_column}</span>
                {' '}<span class="arrow">→</span>{' '}
                <span>{tableName}</span>
                <span class={`confidence ${confClass(rel.confidence)}`}>
                  {Math.round(rel.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
