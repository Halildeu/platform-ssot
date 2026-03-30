import { useState, useEffect } from 'react';

interface Suggestion {
  title: string;
  description: string;
  sql: string;
  pattern: string;
}

interface QuerySuggestionsProps {
  tableName: string;
}

const PATTERN_COLORS: Record<string, string> = {
  basic_select: 'var(--se-accent)',
  count: 'var(--se-green)',
  join: 'var(--se-orange)',
  aggregation: '#8b5cf6',
  time_series: '#ec4899',
  data_quality: 'var(--se-yellow)',
  reverse_join: 'var(--se-accent)',
};

export const QuerySuggestions = ({ tableName }: QuerySuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/schema/suggestions/${tableName}`)
      .then(r => r.json())
      .then(setSuggestions)
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, [tableName]);

  const handleCopy = (sql: string, idx: number) => {
    navigator.clipboard.writeText(sql);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (loading) return <div className="se-search__loading">Generating suggestions...</div>;
  if (suggestions.length === 0) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <h3 style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--se-text-dim)', letterSpacing: 0.5, marginBottom: 8 }}>
        Query Suggestions ({suggestions.length})
      </h3>
      {suggestions.map((s, idx) => (
        <div key={idx} style={{
          marginBottom: 8, background: 'var(--se-bg)', borderRadius: 'var(--se-radius)',
          padding: 10, border: '1px solid var(--se-border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: PATTERN_COLORS[s.pattern] || 'var(--se-text-dim)',
                display: 'inline-block',
              }} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>{s.title}</span>
            </div>
            <button
              className="se-badge"
              onClick={() => handleCopy(s.sql, idx)}
              style={{ fontSize: 9, padding: '1px 6px' }}
            >
              {copiedIdx === idx ? '✓' : 'Copy'}
            </button>
          </div>
          <div style={{ fontSize: 10, color: 'var(--se-text-dim)', marginBottom: 4 }}>{s.description}</div>
          <pre style={{
            fontSize: 10, fontFamily: 'var(--se-mono)', color: 'var(--se-green)',
            background: 'var(--se-bg-card)', padding: 8, borderRadius: 4,
            overflow: 'auto', maxHeight: 100, margin: 0, whiteSpace: 'pre-wrap',
          }}>
            {s.sql}
          </pre>
        </div>
      ))}
    </div>
  );
};
