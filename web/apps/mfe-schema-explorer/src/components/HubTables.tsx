import type { SchemaSnapshot } from '../api/schemaApi';

interface HubTablesProps {
  snapshot: SchemaSnapshot;
  onTableSelect: (table: string) => void;
}

export const HubTables = ({ snapshot, onTableSelect }: HubTablesProps) => {
  const hubs = snapshot.analysis.hubTables;
  const maxRefs = hubs.length > 0 ? hubs[0].incomingRefs : 1;

  return (
    <div className="se-hub-tables">
      <div className="se-hub-tables__header">
        <h3>Hub Tables (Most Referenced)</h3>
        <span className="se-badge se-badge--fk">{hubs.length} tables</span>
      </div>
      <div className="se-hub-tables__list">
        {hubs.map((hub, i) => (
          <div
            key={hub.table}
            className="se-rel-card"
            onClick={() => onTableSelect(hub.table)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <span className="se-badge se-badge--col" style={{ minWidth: 24, textAlign: 'center' }}>
                #{i + 1}
              </span>
              <span style={{ color: 'var(--se-accent)', fontWeight: 600 }}>{hub.table}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: `${Math.max(20, (hub.incomingRefs / maxRefs) * 120)}px`,
                  height: 6,
                  borderRadius: 3,
                  background: `linear-gradient(90deg, var(--se-accent), var(--se-orange))`,
                  opacity: 0.8,
                }}
              />
              <span className="se-badge se-badge--ref">{hub.incomingRefs} refs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
