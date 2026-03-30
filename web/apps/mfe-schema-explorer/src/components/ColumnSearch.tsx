import { useState } from 'react';
import { useColumnSearch } from '../hooks/useSchemaData';

interface ColumnSearchProps {
  onTableSelect: (table: string) => void;
}

export const ColumnSearch = ({ onTableSelect }: ColumnSearchProps) => {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useColumnSearch(query);

  return (
    <div className="se-search">
      <input
        type="text"
        className="se-search__input"
        placeholder='Search columns... (e.g., "COMPANY_ID", "EMPLOYEE")'
        value={query}
        onChange={e => setQuery(e.target.value)}
        autoFocus
      />

      {isLoading && query.length >= 2 && (
        <div className="se-search__loading">Searching...</div>
      )}

      {data && data.results.length > 0 && (
        <div className="se-search__results">
          <h3 className="se-search__heading">
            Column Distribution ({data.totalMatches} matches)
          </h3>
          {data.results.map(group => (
            <div key={group.column} className="se-search__group">
              <div className="se-search__group-header">
                <code>{group.column}</code>
                <span className="se-badge se-badge--ref">{group.tableCount} tables</span>
              </div>
              <div className="se-search__group-tables">
                {group.tables.slice(0, 30).map(entry => (
                  <div
                    key={`${entry.table}-${entry.column}`}
                    className="se-search__result-item"
                    onClick={() => onTableSelect(entry.table)}
                  >
                    <span className="se-search__table-name">{entry.table}</span>
                    <span className="se-search__dot">.</span>
                    <code>{entry.column}</code>
                    <span className="se-col--type" style={{ marginLeft: 8 }}>{entry.type}</span>
                    {entry.pk && <span className="se-col--pk" style={{ marginLeft: 4 }}>PK</span>}
                  </div>
                ))}
                {group.tables.length > 30 && (
                  <div className="se-search__more">+{group.tables.length - 30} more...</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {query.length >= 2 && data && data.results.length === 0 && (
        <div className="se-search__empty">No columns matching "{query}"</div>
      )}

      {query.length < 2 && (
        <div className="se-search__empty">
          <div style={{ fontSize: 32, opacity: 0.3, marginBottom: 8 }}>&#128269;</div>
          Type at least 2 characters to search
          <div style={{ fontSize: 12, opacity: 0.5, marginTop: 8 }}>
            Try: COMPANY_ID, EMPLOYEE, INVOICE, PRODUCT
          </div>
        </div>
      )}
    </div>
  );
};
