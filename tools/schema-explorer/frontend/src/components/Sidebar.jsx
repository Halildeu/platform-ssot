import { useState, useMemo } from 'preact/hooks';

export function Sidebar({ data, selectedTable, onSelect }) {
  const [filter, setFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState(null);

  // Build relationship lookup
  const relLookup = useMemo(() => {
    const fkCount = {};
    const refCount = {};
    for (const rel of data.relationships) {
      fkCount[rel.from_table] = (fkCount[rel.from_table] || 0) + 1;
      refCount[rel.to_table] = (refCount[rel.to_table] || 0) + 1;
    }
    return { fkCount, refCount };
  }, [data.relationships]);

  // Build domain lookup (table -> domain)
  const tableDomain = useMemo(() => {
    const map = {};
    for (const [domain, tables] of Object.entries(data.domains)) {
      for (const tbl of tables) {
        map[tbl] = domain;
      }
    }
    return map;
  }, [data.domains]);

  // Filter and sort tables
  const filteredTables = useMemo(() => {
    const q = filter.toLowerCase();
    return Object.keys(data.tables)
      .filter(name => {
        if (q && !name.toLowerCase().includes(q)) return false;
        if (domainFilter && tableDomain[name] !== domainFilter) return false;
        return true;
      })
      .sort((a, b) => {
        // Sort by relationship count desc, then name
        const aScore = (relLookup.fkCount[a] || 0) + (relLookup.refCount[a] || 0);
        const bScore = (relLookup.fkCount[b] || 0) + (relLookup.refCount[b] || 0);
        if (bScore !== aScore) return bScore - aScore;
        return a.localeCompare(b);
      });
  }, [data.tables, filter, domainFilter, relLookup, tableDomain]);

  const domains = Object.keys(data.domains).sort((a, b) =>
    (data.domains[b]?.length || 0) - (data.domains[a]?.length || 0)
  );

  return (
    <div class="sidebar">
      <div class="sidebar-search">
        <input
          type="text"
          placeholder="Search tables..."
          value={filter}
          onInput={e => setFilter(e.target.value)}
        />
      </div>

      {/* Domain filter chips */}
      <div style="padding:6px 8px;display:flex;gap:4px;flexWrap:wrap;borderBottom:'1px solid var(--border)'">
        <button
          class={`badge ${!domainFilter ? 'badge-fk' : ''}`}
          style="cursor:pointer;border:none;fontSize:10px"
          onClick={() => setDomainFilter(null)}
        >
          ALL ({Object.keys(data.tables).length})
        </button>
        {domains.slice(0, 10).map(d => (
          <button
            key={d}
            class={`badge ${domainFilter === d ? 'badge-fk' : ''}`}
            style="cursor:pointer;border:none;fontSize:10px"
            onClick={() => setDomainFilter(domainFilter === d ? null : d)}
          >
            {d} ({data.domains[d]?.length})
          </button>
        ))}
      </div>

      <div class="sidebar-list">
        {filteredTables.map(name => {
          const fk = relLookup.fkCount[name] || 0;
          const ref = relLookup.refCount[name] || 0;
          const hasRel = fk > 0 || ref > 0;
          const colCount = data.tables[name]?.columns?.length || 0;

          return (
            <div
              key={name}
              class={`table-item ${selectedTable === name ? 'active' : ''} ${hasRel ? 'has-rel' : ''}`}
              onClick={() => onSelect(name)}
            >
              <span>{name}</span>
              <div class="badges">
                <span class="badge badge-col">{colCount}</span>
                {fk > 0 && <span class="badge badge-fk">{fk} FK</span>}
                {ref > 0 && <span class="badge badge-ref">{ref} ref</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
