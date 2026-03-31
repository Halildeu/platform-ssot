import { useState, useEffect } from 'react';

interface Description {
  table: string;
  column: string | null;
  description: string;
  source: string;
}

interface AutoDescriptionsProps {
  tableName: string;
}

export const AutoDescriptions = ({ tableName }: AutoDescriptionsProps) => {
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    fetch(`/api/v1/schema/ai-descriptions/table/${tableName}`)
      .then(r => r.json())
      .then(setDescriptions)
      .catch(() => setDescriptions([]))
      .finally(() => setLoading(false));
  };

  if (descriptions.length === 0 && !loading) {
    return (
      <div style={{ marginTop: 12, padding: 12, background: 'var(--se-bg)', borderRadius: 'var(--se-radius)', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--se-text-dim)', marginBottom: 8 }}>
          AI-powered descriptions available
        </div>
        <button className="se-badge se-badge--fk" onClick={generate} style={{ padding: '4px 16px', fontSize: 12 }}>
          Generate Descriptions
        </button>
      </div>
    );
  }

  if (loading) return <div className="se-search__loading">Generating descriptions...</div>;

  const tableDesc = descriptions.find(d => d.column === null);
  const colDescs = descriptions.filter(d => d.column !== null);

  return (
    <div style={{ marginTop: 8 }}>
      {tableDesc && (
        <div style={{ padding: 8, background: 'var(--se-bg-card)', borderRadius: 'var(--se-radius)', marginBottom: 8, fontSize: 12 }}>
          <strong>Table:</strong> {tableDesc.description}
        </div>
      )}
      {colDescs.map(d => (
        <div key={d.column} style={{ padding: 4, fontSize: 11, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <code style={{ color: 'var(--se-accent)' }}>{d.column}</code>
          <span style={{ color: 'var(--se-text-dim)', marginLeft: 8 }}>{d.description}</span>
        </div>
      ))}
    </div>
  );
};
