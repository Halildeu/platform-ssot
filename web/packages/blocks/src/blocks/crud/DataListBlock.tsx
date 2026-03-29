import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DataListColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => ReactNode;
}

export interface DataListBlockProps<T> {
  items: T[];
  columns: DataListColumn<T>[];
  searchKey: keyof T;
  onItemClick?: (item: T) => void;
  actions?: ReactNode;
  pageSize?: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DataListBlock<T extends Record<string, any>>({
  items,
  columns,
  searchKey,
  onItemClick,
  actions,
  pageSize = 10,
}: DataListBlockProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((item) =>
      String(item[searchKey]).toLowerCase().includes(q),
    );
  }, [items, search, searchKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          gap: '0.75rem',
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--color-border))',
            fontSize: '0.875rem',
            flex: '1',
            maxWidth: '320px',
          }}
        />
        {actions && <div>{actions}</div>}
      </div>

      {/* Table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{
                  textAlign: 'left',
                  padding: '0.625rem 0.75rem',
                  borderBottom: '2px solid var(--color-border))',
                  color: 'var(--color-text-secondary))',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.map((item, rowIdx) => (
            <tr
              key={rowIdx}
              onClick={() => onItemClick?.(item)}
              style={{
                cursor: onItemClick ? 'pointer' : 'default',
                borderBottom: '1px solid var(--color-border))',
              }}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  style={{
                    padding: '0.625rem 0.75rem',
                    color: 'var(--color-text-primary))',
                  }}
                >
                  {col.render
                    ? col.render(item[col.key], item)
                    : String(item[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {paged.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'var(--color-text-secondary))',
                }}
              >
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.75rem',
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary))',
          }}
        >
          <span>
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} &middot;
            Page {page + 1} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '0.25rem',
                border: '1px solid var(--color-border))',
                background: 'transparent',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
                opacity: page === 0 ? 0.5 : 1,
              }}
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '0.25rem',
                border: '1px solid var(--color-border))',
                background: 'transparent',
                cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                opacity: page >= totalPages - 1 ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
