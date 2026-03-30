import { useState, useEffect } from 'react';

interface DriftReport {
  comparedAt: string;
  previous: { timestamp: string; tableCount: number; columnCount: number; relationshipCount: number } | null;
  current: { timestamp: string; tableCount: number; columnCount: number; relationshipCount: number };
  addedTables: string[];
  removedTables: string[];
  modifiedTables: { table: string; addedColumns: string[]; removedColumns: string[]; typeChanges: { column: string; oldType: string; newType: string }[] }[];
  summary: { tablesAdded: number; tablesRemoved: number; tablesModified: number; columnsAdded: number; columnsRemoved: number };
}

interface DriftDashboardProps {
  onTableSelect: (table: string) => void;
}

export const DriftDashboard = ({ onTableSelect }: DriftDashboardProps) => {
  const [report, setReport] = useState<DriftReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/schema/drift')
      .then(r => r.json())
      .then(setReport)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="se-search__loading">Checking for schema changes...</div>;
  if (!report) return <div className="se-search__empty">Failed to load drift report</div>;

  const hasChanges = report.previous && (
    report.summary.tablesAdded > 0 || report.summary.tablesRemoved > 0 || report.summary.tablesModified > 0
  );

  return (
    <div style={{ padding: 16, height: '100%', overflowY: 'auto' }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Schema Drift Detection</h3>

      {!report.previous ? (
        <div style={{ padding: 24, background: 'var(--se-bg-card)', borderRadius: 'var(--se-radius)', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>First Snapshot Captured</div>
          <div style={{ fontSize: 12, color: 'var(--se-text-dim)' }}>
            {report.current.tableCount} tables, {report.current.columnCount} columns, {report.current.relationshipCount} relationships.
            Refresh this page later to see changes.
          </div>
        </div>
      ) : !hasChanges ? (
        <div style={{ padding: 24, background: 'var(--se-bg-card)', borderRadius: 'var(--se-radius)', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
          <div style={{ fontWeight: 600, color: 'var(--se-green)' }}>No Schema Changes Detected</div>
          <div style={{ fontSize: 12, color: 'var(--se-text-dim)', marginTop: 4 }}>
            Schema is identical to previous snapshot.
          </div>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <SummaryCard label="Tables Added" value={report.summary.tablesAdded} color="var(--se-green)" />
            <SummaryCard label="Tables Removed" value={report.summary.tablesRemoved} color="var(--se-red)" />
            <SummaryCard label="Tables Modified" value={report.summary.tablesModified} color="var(--se-orange)" />
            <SummaryCard label="Columns Added" value={report.summary.columnsAdded} color="var(--se-green)" />
            <SummaryCard label="Columns Removed" value={report.summary.columnsRemoved} color="var(--se-red)" />
          </div>

          {/* Added tables */}
          {report.addedTables.length > 0 && (
            <Section title={`New Tables (${report.addedTables.length})`}>
              {report.addedTables.map(t => (
                <div key={t} className="se-rel-card" onClick={() => onTableSelect(t)}>
                  <span style={{ color: 'var(--se-green)' }}>+ {t}</span>
                </div>
              ))}
            </Section>
          )}

          {/* Removed tables */}
          {report.removedTables.length > 0 && (
            <Section title={`Removed Tables (${report.removedTables.length})`}>
              {report.removedTables.map(t => (
                <div key={t} className="se-rel-card">
                  <span style={{ color: 'var(--se-red)' }}>- {t}</span>
                </div>
              ))}
            </Section>
          )}

          {/* Modified tables */}
          {report.modifiedTables.length > 0 && (
            <Section title={`Modified Tables (${report.modifiedTables.length})`}>
              {report.modifiedTables.map(tc => (
                <div key={tc.table} className="se-rel-card" onClick={() => onTableSelect(tc.table)} style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600, color: 'var(--se-accent)', marginBottom: 6 }}>{tc.table}</div>
                  {tc.addedColumns.map(c => (
                    <div key={c} style={{ fontSize: 11, color: 'var(--se-green)', paddingLeft: 12 }}>+ {c}</div>
                  ))}
                  {tc.removedColumns.map(c => (
                    <div key={c} style={{ fontSize: 11, color: 'var(--se-red)', paddingLeft: 12 }}>- {c}</div>
                  ))}
                  {tc.typeChanges.map(ch => (
                    <div key={ch.column} style={{ fontSize: 11, color: 'var(--se-orange)', paddingLeft: 12 }}>
                      ~ {ch.column}: {ch.oldType} → {ch.newType}
                    </div>
                  ))}
                </div>
              ))}
            </Section>
          )}
        </>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div style={{
    flex: 1, padding: 12, background: 'var(--se-bg-card)', borderRadius: 'var(--se-radius)',
    textAlign: 'center', minWidth: 100,
  }}>
    <div style={{ fontSize: 24, fontWeight: 700, color: value > 0 ? color : 'var(--se-text-dim)' }}>{value}</div>
    <div style={{ fontSize: 10, color: 'var(--se-text-dim)', marginTop: 2 }}>{label}</div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 16 }}>
    <h4 style={{ fontSize: 12, color: 'var(--se-text-dim)', textTransform: 'uppercase', marginBottom: 8 }}>{title}</h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>
  </div>
);
