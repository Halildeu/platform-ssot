import { useState, useCallback } from 'react';
import { schemaApi, type SchemaSnapshot } from '../api/schemaApi';

interface FindPathProps {
  snapshot: SchemaSnapshot;
  selectedTable: string | null;
  onTableSelect: (table: string) => void;
}

interface PathStep {
  table: string;
  column: string;
  joinTo: string;
  joinColumn: string;
  confidence: number;
}

interface PathResult {
  from: string;
  to: string;
  hops: number;
  path: PathStep[];
  joinSql: string;
}

export const FindPath = ({ snapshot, selectedTable, onTableSelect }: FindPathProps) => {
  const [fromTable, setFromTable] = useState(selectedTable || '');
  const [toTable, setToTable] = useState('');
  const [results, setResults] = useState<PathResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const tableNames = Object.keys(snapshot.tables).sort();

  const handleSearch = useCallback(async () => {
    if (!fromTable || !toTable) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/schema/path?from=${fromTable}&to=${toTable}&limit=3`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setResults(null);
      } else {
        setResults(data.paths);
      }
    } catch (e) {
      setError('API connection failed');
    } finally {
      setLoading(false);
    }
  }, [fromTable, toTable]);

  const handleCopy = (sql: string, idx: number) => {
    navigator.clipboard.writeText(sql);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="se-findpath">
      <h3 className="se-findpath__title">Find Join Path</h3>
      <p className="se-findpath__desc">
        Discover how to JOIN two tables — shows the shortest path with generated SQL.
      </p>

      <div className="se-findpath__inputs">
        <div className="se-findpath__field">
          <label>From Table</label>
          <select value={fromTable} onChange={e => setFromTable(e.target.value)}>
            <option value="">Select table...</option>
            {tableNames.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <span className="se-findpath__arrow">→</span>
        <div className="se-findpath__field">
          <label>To Table</label>
          <select value={toTable} onChange={e => setToTable(e.target.value)}>
            <option value="">Select table...</option>
            {tableNames.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button
          className="se-findpath__btn"
          onClick={handleSearch}
          disabled={!fromTable || !toTable || loading}
        >
          {loading ? 'Searching...' : 'Find Path'}
        </button>
      </div>

      {error && <div className="se-findpath__error">{error}</div>}

      {results && results.length === 0 && (
        <div className="se-search__empty" style={{ height: 'auto', padding: 32 }}>
          No join path found between {fromTable} and {toTable}
        </div>
      )}

      {results && results.length > 0 && (
        <div className="se-findpath__results">
          {results.map((path, idx) => (
            <div key={idx} className="se-findpath__path-card">
              <div className="se-findpath__path-header">
                <span className="se-badge se-badge--fk">Path {idx + 1}</span>
                <span className="se-badge se-badge--col">{path.hops} hop{path.hops > 1 ? 's' : ''}</span>
              </div>

              <div className="se-findpath__chain">
                {path.path.map((step, i) => (
                  <div key={i} className="se-findpath__step">
                    <span
                      className="se-findpath__table-link"
                      onClick={() => onTableSelect(step.table)}
                    >
                      {step.table}
                    </span>
                    <code>.{step.column}</code>
                    <span className="se-rel-card__arrow"> → </span>
                    <span
                      className="se-findpath__table-link"
                      onClick={() => onTableSelect(step.joinTo)}
                    >
                      {step.joinTo}
                    </span>
                    <code>.{step.joinColumn}</code>
                    <span className={`se-conf ${step.confidence >= 0.9 ? 'se-conf--high' : step.confidence >= 0.8 ? 'se-conf--med' : 'se-conf--low'}`}>
                      {Math.round(step.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="se-findpath__sql-block">
                <div className="se-findpath__sql-header">
                  <span>Generated SQL</span>
                  <button
                    className="se-badge"
                    onClick={() => handleCopy(path.joinSql, idx)}
                  >
                    {copiedIdx === idx ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="se-findpath__sql">{path.joinSql}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
