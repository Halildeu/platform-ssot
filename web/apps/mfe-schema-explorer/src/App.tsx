import { useState, useCallback } from 'react';
import { useSchemaSnapshot } from './hooks/useSchemaData';
import { Sidebar } from './components/Sidebar';
import { SchemaGraph } from './components/SchemaGraph';
import { TableDetail } from './components/TableDetail';
import { ColumnSearch } from './components/ColumnSearch';
import { StatsBar } from './components/StatsBar';
import './styles/schema-explorer.css';

type ViewMode = 'domain' | 'neighborhood';

const App = () => {
  const { data: snapshot, isLoading, error } = useSchemaSnapshot();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('domain');
  const [searchOpen, setSearchOpen] = useState(false);

  const handleTableSelect = useCallback((tableName: string) => {
    setSelectedTable(tableName);
    setViewMode('neighborhood');
    setSearchOpen(false);
  }, []);

  if (isLoading) {
    return (
      <div className="se-loading">
        <div className="se-loading__spinner" />
        <p>Loading schema data...</p>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="se-error">
        <p>Failed to load schema data</p>
        <p className="se-error__detail">{(error as Error)?.message}</p>
      </div>
    );
  }

  return (
    <div className={`se-layout ${selectedTable ? '' : 'se-layout--no-detail'}`}>
      <StatsBar
        metadata={snapshot.metadata}
        searchOpen={searchOpen}
        onToggleSearch={() => setSearchOpen(!searchOpen)}
      />

      <Sidebar
        snapshot={snapshot}
        selectedTable={selectedTable}
        onSelect={handleTableSelect}
      />

      <main className="se-main">
        {searchOpen ? (
          <ColumnSearch onTableSelect={handleTableSelect} />
        ) : (
          <SchemaGraph
            snapshot={snapshot}
            selectedTable={selectedTable}
            viewMode={viewMode}
            onTableSelect={handleTableSelect}
            onViewModeChange={setViewMode}
          />
        )}
      </main>

      {selectedTable && (
        <TableDetail
          snapshot={snapshot}
          tableName={selectedTable}
          onClose={() => setSelectedTable(null)}
          onFkClick={handleTableSelect}
        />
      )}
    </div>
  );
};

export default App;
