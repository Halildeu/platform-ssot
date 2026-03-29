import React, { useCallback, useState } from 'react';
import { DataListBlock } from '../blocks/crud/DataListBlock';
import type { DataListColumn } from '../blocks/crud/DataListBlock';
import { DetailViewBlock } from '../blocks/crud/DetailViewBlock';
import type { DetailViewSection } from '../blocks/crud/DetailViewBlock';
import { CreateEditFormBlock } from '../blocks/crud/CreateEditFormBlock';
import type { FormField } from '../blocks/crud/CreateEditFormBlock';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ViewMode = 'list' | 'detail' | 'create' | 'edit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CrudPageTemplateProps<T extends Record<string, any>> {
  title: string;
  items: T[];
  columns: DataListColumn<T>[];
  searchKey: keyof T;
  detailTitle: (item: T) => string;
  detailSections: (item: T) => DetailViewSection[];
  formFields: FormField[];
  onSave: (values: Record<string, unknown>) => void;
  onDelete?: (item: T) => void;
  itemKey?: keyof T;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CrudPageTemplate<T extends Record<string, any>>({
  title,
  items,
  columns,
  searchKey,
  detailTitle,
  detailSections,
  formFields,
  onSave,
  onDelete,
  itemKey: _itemKey = 'id' as keyof T,
}: CrudPageTemplateProps<T>) {
  const [view, setView] = useState<ViewMode>('list');
  const [selected, setSelected] = useState<T | null>(null);

  const handleItemClick = useCallback((item: T) => {
    setSelected(item);
    setView('detail');
  }, []);

  const handleCreate = useCallback(() => {
    setSelected(null);
    setView('create');
  }, []);

  const handleEdit = useCallback(() => {
    setView('edit');
  }, []);

  const handleBack = useCallback(() => {
    setView('list');
    setSelected(null);
  }, []);

  const handleSubmit = useCallback(
    (values: Record<string, unknown>) => {
      onSave(values);
      setView('list');
      setSelected(null);
    },
    [onSave],
  );

  /* ---- List view ---- */
  if (view === 'list') {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--color-text-primary))',
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>
        <DataListBlock
          items={items}
          columns={columns}
          searchKey={searchKey}
          onItemClick={handleItemClick}
          actions={
            <button
              type="button"
              onClick={handleCreate}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                background: 'var(--color-primary))',
                color: 'var(--surface-default)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Add New
            </button>
          }
        />
      </div>
    );
  }

  /* ---- Detail view ---- */
  if (view === 'detail' && selected) {
    return (
      <div>
        <button
          type="button"
          onClick={handleBack}
          style={{
            padding: '0.375rem 0.75rem',
            borderRadius: '0.25rem',
            border: '1px solid var(--color-border))',
            background: 'transparent',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            marginBottom: '1rem',
          }}
        >
          &larr; Back
        </button>
        <DetailViewBlock
          title={detailTitle(selected)}
          sections={detailSections(selected)}
          actions={
            <>
              <button
                type="button"
                onClick={handleEdit}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--color-border))',
                  background: 'transparent',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(selected);
                    handleBack();
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    background: 'var(--color-error))',
                    color: 'var(--surface-default)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              )}
            </>
          }
        />
      </div>
    );
  }

  /* ---- Create / Edit view ---- */
  return (
    <div>
      <button
        type="button"
        onClick={handleBack}
        style={{
          padding: '0.375rem 0.75rem',
          borderRadius: '0.25rem',
          border: '1px solid var(--color-border))',
          background: 'transparent',
          fontSize: '0.8125rem',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        &larr; Back
      </button>
      <CreateEditFormBlock
        title={view === 'edit' ? `Edit ${title}` : `New ${title}`}
        fields={formFields}
        onSubmit={handleSubmit}
        onCancel={handleBack}
        initialValues={view === 'edit' && selected ? (selected as Record<string, unknown>) : {}}
      />
    </div>
  );
}
