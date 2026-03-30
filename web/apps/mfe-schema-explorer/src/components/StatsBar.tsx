import type { SchemaSnapshot } from '../api/schemaApi';

interface StatsBarProps {
  metadata: SchemaSnapshot['metadata'];
  searchOpen: boolean;
  onToggleSearch: () => void;
}

export const StatsBar = ({ metadata, searchOpen, onToggleSearch }: StatsBarProps) => (
  <header className="se-header">
    <h1 className="se-header__title">SchemaLens</h1>
    <div className="se-header__stats">
      <span><strong>{metadata.tableCount.toLocaleString()}</strong> tables</span>
      <span><strong>{metadata.columnCount.toLocaleString()}</strong> columns</span>
      <span><strong>{metadata.relationshipCount.toLocaleString()}</strong> relationships</span>
      <span><strong>{metadata.domainCount}</strong> domains</span>
      <span className="se-header__db">{metadata.database}.{metadata.schema}</span>
    </div>
    <button
      className={`se-header__search-btn ${searchOpen ? 'se-header__search-btn--active' : ''}`}
      onClick={onToggleSearch}
    >
      {searchOpen ? 'Close Search' : 'Search Columns'}
    </button>
  </header>
);
