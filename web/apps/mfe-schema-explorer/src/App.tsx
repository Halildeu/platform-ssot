import { useState, useCallback, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSchemaSnapshot } from './hooks/useSchemaData';
import { Sidebar } from './components/Sidebar';
import { SchemaGraph } from './components/SchemaGraph';
import { TableDetail } from './components/TableDetail';
import { ColumnSearch } from './components/ColumnSearch';
import { ImpactAnalysis } from './components/ImpactAnalysis';
import { DeadTables } from './components/DeadTables';
import { HubTables } from './components/HubTables';
import { ExportPanel } from './components/ExportPanel';
import { FindPath } from './components/FindPath';
import { HealthScore } from './components/HealthScore';
import { DriftDashboard } from './components/DriftDashboard';
import { AiChat } from './components/AiChat';
import './styles/schema-explorer.css';

type ViewMode = 'domain' | 'neighborhood';
type PanelMode = 'graph' | 'search' | 'path' | 'hubs' | 'dead' | 'health' | 'impact' | 'drift' | 'chat' | 'export';

const App = () => {
  const { data: snapshot, isLoading, error } = useSchemaSnapshot();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('domain');
  const [panelMode, setPanelMode] = useState<PanelMode>('graph');

  const handleTableSelect = useCallback((tableName: string) => {
    setSelectedTable(tableName);
    setViewMode('neighborhood');
    setPanelMode('graph');
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

  const renderMainPanel = () => {
    switch (panelMode) {
      case 'search':
        return <ColumnSearch onTableSelect={handleTableSelect} />;
      case 'path':
        return <FindPath snapshot={snapshot} selectedTable={selectedTable} onTableSelect={handleTableSelect} />;
      case 'hubs':
        return <HubTables snapshot={snapshot} onTableSelect={handleTableSelect} />;
      case 'dead':
        return <DeadTables snapshot={snapshot} onTableSelect={handleTableSelect} />;
      case 'health':
        return <HealthScore onTableSelect={handleTableSelect} />;
      case 'impact':
        return selectedTable
          ? <ImpactAnalysis tableName={selectedTable} onTableSelect={handleTableSelect} />
          : <div className="se-search__empty">Select a table first to run impact analysis</div>;
      case 'drift':
        return <DriftDashboard onTableSelect={handleTableSelect} />;
      case 'chat':
        return <AiChat onTableSelect={handleTableSelect} />;
      case 'export':
        return <ExportPanel snapshot={snapshot} selectedTable={selectedTable} />;
      default:
        return (
          <SchemaGraph
            snapshot={snapshot}
            selectedTable={selectedTable}
            viewMode={viewMode}
            onTableSelect={handleTableSelect}
            onViewModeChange={setViewMode}
          />
        );
    }
  };

  return (
    <div className={`se-layout ${selectedTable ? '' : 'se-layout--no-detail'}`}>
      <header className="se-header">
        <h1 className="se-header__title">SchemaLens</h1>
        <div className="se-header__stats">
          <span><strong>{snapshot.metadata.tableCount.toLocaleString()}</strong> tables</span>
          <span><strong>{snapshot.metadata.columnCount.toLocaleString()}</strong> columns</span>
          <span><strong>{snapshot.metadata.relationshipCount.toLocaleString()}</strong> rels</span>
          <span><strong>{snapshot.metadata.domainCount}</strong> domains</span>
        </div>
        <nav className="se-header__nav">
          {([
            ['graph', 'ER Graph'],
            ['search', 'Columns'],
            ['path', 'Find Path'],
            ['hubs', 'Hubs'],
            ['dead', 'Dead Tables'],
            ['health', 'Health'],
            ['impact', 'Impact'],
            ['drift', 'Drift'],
            ['chat', 'AI Chat'],
            ['export', 'Export'],
          ] as [PanelMode, string][]).map(([mode, label]) => (
            <button
              key={mode}
              className={`se-header__nav-btn ${panelMode === mode ? 'se-header__nav-btn--active' : ''}`}
              onClick={() => setPanelMode(mode)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <Sidebar
        snapshot={snapshot}
        selectedTable={selectedTable}
        onSelect={handleTableSelect}
      />

      <main className="se-main">
        {renderMainPanel()}
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

/** Wrapper with own QueryClientProvider — needed when loaded as MF remote */
const AppWithProviders = () => {
  const shellQC = typeof window !== 'undefined'
    ? (window as Record<string, unknown>).__SHELL_QUERY_CLIENT__ as QueryClient | undefined
    : undefined;
  const localQC = useRef<QueryClient>();
  if (!shellQC && !localQC.current) {
    localQC.current = new QueryClient({
      defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } },
    });
  }
  return (
    <QueryClientProvider client={shellQC ?? localQC.current!}>
      <App />
    </QueryClientProvider>
  );
};

export default AppWithProviders;
