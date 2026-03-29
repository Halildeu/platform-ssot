import { useState, useMemo } from 'preact/hooks';

export function SearchPanel({ data, onTableSelect }) {
  const [query, setQuery] = useState('');

  // Build column index
  const columnIndex = useMemo(() => {
    const index = [];
    for (const [tableName, table] of Object.entries(data.tables)) {
      for (const col of table.columns) {
        index.push({
          table: tableName,
          column: col.name,
          type: col.type,
          pk: col.pk,
          searchKey: `${tableName}.${col.name}`.toLowerCase(),
        });
      }
    }
    return index;
  }, [data.tables]);

  // Search results
  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();

    // Group by column name for "where is X used?" queries
    const byColumn = {};
    const direct = [];

    for (const entry of columnIndex) {
      if (entry.column.toLowerCase().includes(q) || entry.table.toLowerCase().includes(q)) {
        direct.push(entry);
        const colKey = entry.column;
        if (!byColumn[colKey]) byColumn[colKey] = [];
        byColumn[colKey].push(entry);
      }
    }

    // If searching for a specific column name, group results
    const exactColumnMatches = Object.entries(byColumn)
      .filter(([col]) => col.toLowerCase().includes(q))
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 20);

    return { direct: direct.slice(0, 200), grouped: exactColumnMatches };
  }, [query, columnIndex]);

  return (
    <div style="height:100%;overflow-y:auto;padding:16px">
      <div style="marginBottom:16px">
        <input
          type="text"
          placeholder='Search columns... (e.g., "COMPANY_ID", "EMPLOYEE")'
          value={query}
          onInput={e => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'var(--bg-card)',
            border: '2px solid var(--accent)',
            borderRadius: 'var(--radius)',
            color: 'var(--text)',
            fontSize: '14px',
            outline: 'none',
          }}
          autofocus
        />
      </div>

      {results.grouped && results.grouped.length > 0 && (
        <div>
          <h3 style="color:var(--text-dim);fontSize:12px;marginBottom:12px;textTransform:uppercase">
            Column Distribution ({results.direct.length} matches)
          </h3>

          {results.grouped.map(([colName, entries]) => (
            <div key={colName} style="marginBottom:16px">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius)',
                marginBottom: '4px',
              }}>
                <span style="fontFamily:var(--mono);fontWeight:700;color:var(--accent)">
                  {colName}
                </span>
                <span class="badge badge-ref">{entries.length} tables</span>
              </div>
              <div style="paddingLeft:12px">
                {entries.slice(0, 30).map(e => (
                  <div
                    key={`${e.table}-${e.column}`}
                    class="search-result-item"
                    onClick={() => onTableSelect(e.table)}
                  >
                    <span class="table-name">{e.table}</span>
                    <span style="color:var(--text-dim);margin:0 6px">.</span>
                    <span class="col-name">{e.column}</span>
                    <span style="color:var(--green);marginLeft:8px;fontSize:11px">{e.type}</span>
                    {e.pk && <span style="color:var(--orange);marginLeft:4px;fontSize:10px">PK</span>}
                  </div>
                ))}
                {entries.length > 30 && (
                  <div style="padding:6px 12px;color:var(--text-dim);fontSize:11px">
                    +{entries.length - 30} more...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {query.length >= 2 && (!results.grouped || results.grouped.length === 0) && (
        <div class="empty-state">
          <div>No columns matching "{query}"</div>
        </div>
      )}

      {query.length < 2 && (
        <div class="empty-state">
          <div class="icon" style="fontSize:32px">&#128269;</div>
          <div>Type at least 2 characters to search</div>
          <div style="fontSize:12px;color:var(--text-dim);marginTop:8px">
            Try: COMPANY_ID, EMPLOYEE, INVOICE, PRODUCT
          </div>
        </div>
      )}
    </div>
  );
}
