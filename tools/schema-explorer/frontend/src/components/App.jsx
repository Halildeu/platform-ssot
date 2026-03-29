import { useState, useEffect, useCallback } from 'preact/hooks';
import { Sidebar } from './Sidebar';
import { GraphView } from './GraphView';
import { TableDetail } from './TableDetail';
import { SearchPanel } from './SearchPanel';

export function App() {
  const [data, setData] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('domain'); // 'domain' | 'neighborhood'

  useEffect(() => {
    fetch('./data/schema_snapshot.json')
      .then(r => r.json())
      .then(setData)
      .catch(e => console.error('Failed to load schema data:', e));
  }, []);

  const handleTableSelect = useCallback((tableName) => {
    setSelectedTable(tableName);
    setViewMode('neighborhood');
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedTable(null);
  }, []);

  const handleFkClick = useCallback((targetTable) => {
    setSelectedTable(targetTable);
    setViewMode('neighborhood');
  }, []);

  if (!data) {
    return (
      <div class="empty-state" style="height:100vh">
        <div class="icon">&#9881;</div>
        <div>Loading schema data...</div>
      </div>
    );
  }

  const meta = data.metadata;

  return (
    <div class={`app-layout ${selectedTable ? '' : 'detail-closed'}`}>
      <header class="header">
        <h1>SchemaLens</h1>
        <div class="stats">
          <span><strong>{meta.table_count}</strong> tables</span>
          <span><strong>{meta.column_count}</strong> columns</span>
          <span><strong>{meta.relationship_count}</strong> relationships</span>
          <span><strong>{meta.domain_count}</strong> domains</span>
          <span style="color:var(--text-dim)">{meta.database}.{meta.schema}</span>
        </div>
        <button
          onClick={() => setSearchMode(!searchMode)}
          style={{
            background: searchMode ? 'var(--accent)' : 'var(--bg)',
            border: '1px solid var(--border)',
            color: searchMode ? '#fff' : 'var(--text)',
            padding: '4px 12px',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          {searchMode ? 'Close Search' : 'Search Columns'}
        </button>
      </header>

      <Sidebar
        data={data}
        selectedTable={selectedTable}
        onSelect={handleTableSelect}
      />

      <div class="graph-container">
        {searchMode ? (
          <SearchPanel
            data={data}
            onTableSelect={handleTableSelect}
          />
        ) : (
          <GraphView
            data={data}
            selectedTable={selectedTable}
            viewMode={viewMode}
            onTableSelect={handleTableSelect}
            onViewModeChange={setViewMode}
          />
        )}
      </div>

      {selectedTable && (
        <TableDetail
          data={data}
          tableName={selectedTable}
          onClose={handleCloseDetail}
          onFkClick={handleFkClick}
        />
      )}
    </div>
  );
}
