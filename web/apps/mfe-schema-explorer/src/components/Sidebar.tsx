import { useState, useMemo } from 'react';
import type { SchemaSnapshot } from '../api/schemaApi';

interface SidebarProps {
  snapshot: SchemaSnapshot;
  selectedTable: string | null;
  onSelect: (table: string) => void;
}

export const Sidebar = ({ snapshot, selectedTable, onSelect }: SidebarProps) => {
  const [filter, setFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState<string | null>(null);

  const { fkCount, refCount } = useMemo(() => {
    const fk: Record<string, number> = {};
    const ref: Record<string, number> = {};
    for (const rel of snapshot.relationships) {
      fk[rel.fromTable] = (fk[rel.fromTable] || 0) + 1;
      ref[rel.toTable] = (ref[rel.toTable] || 0) + 1;
    }
    return { fkCount: fk, refCount: ref };
  }, [snapshot.relationships]);

  const tableDomain = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [domain, tables] of Object.entries(snapshot.domains)) {
      for (const tbl of tables) map[tbl] = domain;
    }
    return map;
  }, [snapshot.domains]);

  const filteredTables = useMemo(() => {
    const q = filter.toLowerCase();
    return Object.keys(snapshot.tables)
      .filter(name => {
        if (q && !name.toLowerCase().includes(q)) return false;
        if (domainFilter && tableDomain[name] !== domainFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const aScore = (fkCount[a] || 0) + (refCount[a] || 0);
        const bScore = (fkCount[b] || 0) + (refCount[b] || 0);
        return bScore !== aScore ? bScore - aScore : a.localeCompare(b);
      });
  }, [snapshot.tables, filter, domainFilter, fkCount, refCount, tableDomain]);

  const topDomains = useMemo(() =>
    Object.entries(snapshot.domains)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10),
    [snapshot.domains]
  );

  return (
    <aside className="se-sidebar">
      <div className="se-sidebar__search">
        <input
          type="text"
          placeholder="Search tables..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      <div className="se-sidebar__domains">
        <button
          className={`se-badge ${!domainFilter ? 'se-badge--active' : ''}`}
          onClick={() => setDomainFilter(null)}
        >
          ALL ({Object.keys(snapshot.tables).length})
        </button>
        {topDomains.map(([d, tables]) => (
          <button
            key={d}
            className={`se-badge ${domainFilter === d ? 'se-badge--active' : ''}`}
            onClick={() => setDomainFilter(domainFilter === d ? null : d)}
          >
            {d} ({tables.length})
          </button>
        ))}
      </div>

      <div className="se-sidebar__list">
        {filteredTables.map(name => {
          const fk = fkCount[name] || 0;
          const ref = refCount[name] || 0;
          const cols = snapshot.tables[name]?.columnCount || 0;

          return (
            <div
              key={name}
              className={`se-table-item ${selectedTable === name ? 'se-table-item--active' : ''} ${(fk > 0 || ref > 0) ? 'se-table-item--has-rel' : ''}`}
              onClick={() => onSelect(name)}
            >
              <span className="se-table-item__name">{name}</span>
              <div className="se-table-item__badges">
                <span className="se-badge se-badge--col">{cols}</span>
                {fk > 0 && <span className="se-badge se-badge--fk">{fk} FK</span>}
                {ref > 0 && <span className="se-badge se-badge--ref">{ref} ref</span>}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
