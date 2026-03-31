import { useState, useEffect } from 'react';

interface HealthIssue {
  rule: string;
  severity: string;
  table: string;
  detail: string;
  penalty: number;
}

interface HealthReport {
  score: number;
  grade: string;
  totalIssues: number;
  issueBySeverity: Record<string, number>;
  issues: HealthIssue[];
  stats: Record<string, number>;
}

interface HealthScoreProps {
  onTableSelect: (table: string) => void;
}

const GRADE_COLORS: Record<string, string> = {
  A: 'var(--se-green)',
  B: '#8bc34a',
  C: 'var(--se-yellow)',
  D: 'var(--se-orange)',
  F: 'var(--se-red)',
};

const SEVERITY_COLORS: Record<string, string> = {
  high: 'var(--se-red)',
  medium: 'var(--se-orange)',
  low: 'var(--se-yellow)',
};

export const HealthScore = ({ onTableSelect }: HealthScoreProps) => {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/schema/health-score')
      .then(r => r.json())
      .then(setReport)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="se-search__loading">Analyzing schema health...</div>;
  if (!report) return <div className="se-search__empty">Failed to load health score</div>;

  const filteredIssues = filter
    ? report.issues.filter(i => i.severity === filter || i.rule === filter)
    : report.issues;

  return (
    <div style={{ padding: 16, height: '100%', overflowY: 'auto' }}>
      {/* Score card */}
      <div style={{
        display: 'flex', gap: 24, alignItems: 'center', marginBottom: 24,
        padding: 24, background: 'var(--se-bg-card)', borderRadius: 'var(--se-radius)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 56, fontWeight: 800, lineHeight: 1,
            color: GRADE_COLORS[report.grade] || 'var(--se-text)',
          }}>
            {report.grade}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--se-text)', marginTop: 4 }}>
            {report.score}/100
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Schema Health Score</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {Object.entries(report.issueBySeverity).map(([sev, count]) => (
              <button
                key={sev}
                className={`se-badge ${filter === sev ? 'se-badge--active' : ''}`}
                style={{ borderColor: SEVERITY_COLORS[sev], color: SEVERITY_COLORS[sev] }}
                onClick={() => setFilter(filter === sev ? null : sev)}
              >
                {count} {sev}
              </button>
            ))}
            <span className="se-badge se-badge--col">{report.totalIssues} total</span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: 'var(--se-text-dim)' }}>
            <span>{report.stats.totalTables} tables</span>
            <span>{report.stats.tablesWithPk} with PK</span>
            <span>{report.stats.orphanTables} orphans</span>
            <span>avg {Math.round(report.stats.avgColumnsPerTable as number)} cols/table</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 8, borderRadius: 4, background: 'var(--se-bg)',
        overflow: 'hidden', marginBottom: 24,
      }}>
        <div style={{
          height: '100%', borderRadius: 4,
          width: `${report.score}%`,
          background: `linear-gradient(90deg, ${GRADE_COLORS[report.grade]}, ${GRADE_COLORS[report.grade]}88)`,
          transition: 'width 1s ease',
        }} />
      </div>

      {/* Issues list */}
      <h3 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--se-text-dim)', marginBottom: 12 }}>
        Issues ({filteredIssues.length})
        {filter && (
          <button className="se-badge" style={{ marginLeft: 8 }} onClick={() => setFilter(null)}>
            Clear filter
          </button>
        )}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filteredIssues.slice(0, 100).map((issue, i) => (
          <div
            key={`${issue.table}-${issue.rule}-${i}`}
            className="se-rel-card"
            onClick={() => onTableSelect(issue.table)}
          >
            <span style={{
              display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
              background: SEVERITY_COLORS[issue.severity] || 'var(--se-text-dim)',
              marginRight: 8,
            }} />
            <strong style={{ color: 'var(--se-accent)' }}>{issue.table}</strong>
            <span style={{ marginLeft: 8, color: 'var(--se-text-dim)' }}>{issue.detail}</span>
            <span className="se-badge se-badge--col" style={{ float: 'right' }}>{issue.rule}</span>
          </div>
        ))}
        {filteredIssues.length > 100 && (
          <div style={{ padding: 8, color: 'var(--se-text-dim)', fontSize: 12 }}>
            +{filteredIssues.length - 100} more issues...
          </div>
        )}
      </div>
    </div>
  );
};
