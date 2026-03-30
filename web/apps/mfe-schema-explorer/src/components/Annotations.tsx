import { useState, useCallback } from 'react';
import type { SchemaSnapshot } from '../api/schemaApi';

interface AnnotationsProps {
  snapshot: SchemaSnapshot;
  tableName: string;
}

interface Annotation {
  table: string;
  column?: string;
  text: string;
  tags: string[];
  updatedAt: string;
}

type AnnotationStore = Record<string, Annotation>;

const STORAGE_KEY = 'schemalens-annotations';

function loadAnnotations(): AnnotationStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAnnotations(store: AnnotationStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function exportAnnotationsJson(): string {
  return JSON.stringify(loadAnnotations(), null, 2);
}

export function importAnnotationsJson(json: string) {
  const parsed = JSON.parse(json);
  const existing = loadAnnotations();
  saveAnnotations({ ...existing, ...parsed });
}

export const Annotations = ({ snapshot, tableName }: AnnotationsProps) => {
  const [store, setStore] = useState<AnnotationStore>(loadAnnotations);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editTags, setEditTags] = useState('');

  const table = snapshot.tables[tableName];
  if (!table) return null;

  const getKey = (col?: string) => col ? `${tableName}.${col}` : `TABLE:${tableName}`;

  const startEdit = useCallback((key: string) => {
    const existing = store[key];
    setEditingKey(key);
    setEditText(existing?.text || '');
    setEditTags(existing?.tags?.join(', ') || '');
  }, [store]);

  const saveEdit = useCallback(() => {
    if (!editingKey) return;
    const updated = {
      ...store,
      [editingKey]: {
        table: tableName,
        column: editingKey.includes('.') ? editingKey.split('.')[1] : undefined,
        text: editText,
        tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
        updatedAt: new Date().toISOString(),
      },
    };
    saveAnnotations(updated);
    setStore(updated);
    setEditingKey(null);
  }, [editingKey, editText, editTags, tableName, store]);

  const cancelEdit = () => setEditingKey(null);

  const handleExport = () => {
    const json = exportAnnotationsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schemalens-annotations-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tableKey = getKey();
  const tableAnnotation = store[tableKey];

  return (
    <div className="se-annotations">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--se-text-dim)', letterSpacing: 0.5 }}>
          Annotations
        </h3>
        <button className="se-badge" onClick={handleExport} title="Export all annotations as JSON">
          Export
        </button>
      </div>

      {/* Table-level annotation */}
      <div className="se-annotation-card" onClick={() => !editingKey && startEdit(tableKey)}>
        <div className="se-annotation-card__label">Table Description</div>
        {editingKey === tableKey ? (
          <div className="se-annotation-card__edit">
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              placeholder="Describe this table..."
              rows={2}
            />
            <input
              value={editTags}
              onChange={e => setEditTags(e.target.value)}
              placeholder="Tags (comma separated): PII, core, deprecated"
            />
            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
              <button className="se-badge se-badge--active" onClick={saveEdit}>Save</button>
              <button className="se-badge" onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="se-annotation-card__text">
            {tableAnnotation?.text || <span style={{ opacity: 0.4 }}>Click to add description...</span>}
            {tableAnnotation?.tags?.map(tag => (
              <span key={tag} className="se-badge se-badge--domain" style={{ marginLeft: 4 }}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Column-level annotations */}
      {table.columns.slice(0, 30).map(col => {
        const key = getKey(col.name);
        const ann = store[key];
        const isEditing = editingKey === key;

        return (
          <div key={col.name} className="se-annotation-card" onClick={() => !editingKey && startEdit(key)}>
            <div className="se-annotation-card__label">
              <code style={{ color: col.pk ? 'var(--se-orange)' : 'var(--se-accent)' }}>{col.name}</code>
              <span style={{ color: 'var(--se-green)', fontSize: 10, marginLeft: 6 }}>{col.dataType}</span>
            </div>
            {isEditing ? (
              <div className="se-annotation-card__edit">
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  placeholder={`Describe ${col.name}...`}
                  rows={1}
                />
                <input
                  value={editTags}
                  onChange={e => setEditTags(e.target.value)}
                  placeholder="Tags: PII, sensitive, deprecated"
                />
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <button className="se-badge se-badge--active" onClick={saveEdit}>Save</button>
                  <button className="se-badge" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              ann?.text ? (
                <div className="se-annotation-card__text">
                  {ann.text}
                  {ann.tags?.map(tag => (
                    <span key={tag} className="se-badge se-badge--domain" style={{ marginLeft: 4 }}>{tag}</span>
                  ))}
                </div>
              ) : null
            )}
          </div>
        );
      })}
    </div>
  );
};
