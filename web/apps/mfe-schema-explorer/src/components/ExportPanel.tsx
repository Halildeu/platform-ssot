import { useState, useCallback } from 'react';
import type { SchemaSnapshot } from '../api/schemaApi';
import { exportAnnotationsJson } from './Annotations';

interface ExportPanelProps {
  snapshot: SchemaSnapshot;
  selectedTable: string | null;
}

type ExportFormat = 'mermaid' | 'dbml' | 'json' | 'annotations';

export const ExportPanel = ({ snapshot, selectedTable }: ExportPanelProps) => {
  const [format, setFormat] = useState<ExportFormat>('mermaid');
  const [scope, setScope] = useState<'selected' | 'domain' | 'all'>('selected');
  const [preview, setPreview] = useState('');

  const generate = useCallback(() => {
    const tables = getTablesForScope(snapshot, selectedTable, scope);
    const rels = snapshot.relationships.filter(
      r => tables.has(r.fromTable) && tables.has(r.toTable)
    );

    let output = '';
    switch (format) {
      case 'mermaid':
        output = generateMermaid(tables, rels, snapshot);
        break;
      case 'dbml':
        output = generateDBML(tables, snapshot);
        break;
      case 'json':
        output = JSON.stringify({ tables: Object.fromEntries(
          [...tables].map(t => [t, snapshot.tables[t]])
        ), relationships: rels }, null, 2);
        break;
      case 'annotations':
        output = exportAnnotationsJson();
        break;
    }
    setPreview(output);
  }, [format, scope, snapshot, selectedTable]);

  const handleDownload = () => {
    const ext = format === 'json' || format === 'annotations' ? 'json' : format === 'mermaid' ? 'md' : 'dbml';
    const blob = new Blob([preview], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schemalens-${format}-${new Date().toISOString().split('T')[0]}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(preview);
  };

  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ fontSize: 14 }}>Export Schema</h3>

      <div style={{ display: 'flex', gap: 6 }}>
        {(['mermaid', 'dbml', 'json', 'annotations'] as ExportFormat[]).map(f => (
          <button key={f} className={`se-badge ${format === f ? 'se-badge--active' : ''}`} onClick={() => setFormat(f)}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--se-text-dim)' }}>Scope:</span>
        {([['selected', 'Selected Table'], ['domain', 'Domain'], ['all', 'All']] as [typeof scope, string][]).map(([s, label]) => (
          <button key={s} className={`se-badge ${scope === s ? 'se-badge--active' : ''}`} onClick={() => setScope(s)}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <button className="se-badge se-badge--fk" onClick={generate}>Generate</button>
        {preview && <button className="se-badge" onClick={handleCopy}>Copy</button>}
        {preview && <button className="se-badge" onClick={handleDownload}>Download</button>}
      </div>

      {preview && (
        <pre style={{
          flex: 1, overflow: 'auto', padding: 12, background: 'var(--se-bg)',
          border: '1px solid var(--se-border)', borderRadius: 'var(--se-radius)',
          fontSize: 11, fontFamily: 'var(--se-mono)', color: 'var(--se-text)',
          whiteSpace: 'pre-wrap', margin: 0,
        }}>
          {preview}
        </pre>
      )}
    </div>
  );
};

function getTablesForScope(snapshot: SchemaSnapshot, selected: string | null, scope: string): Set<string> {
  if (scope === 'all') return new Set(Object.keys(snapshot.tables));

  if (scope === 'selected' && selected) {
    const tables = new Set([selected]);
    for (const rel of snapshot.relationships) {
      if (rel.fromTable === selected) tables.add(rel.toTable);
      if (rel.toTable === selected) tables.add(rel.fromTable);
    }
    return tables;
  }

  if (scope === 'domain' && selected) {
    for (const [, tables] of Object.entries(snapshot.domains)) {
      if (tables.includes(selected)) return new Set(tables);
    }
  }

  return selected ? new Set([selected]) : new Set(Object.keys(snapshot.tables).slice(0, 50));
}

function generateMermaid(tables: Set<string>, rels: { fromTable: string; fromColumn: string; toTable: string }[], snapshot: SchemaSnapshot): string {
  let output = 'erDiagram\n';

  for (const tbl of tables) {
    const info = snapshot.tables[tbl];
    if (!info) continue;
    output += `    ${sanitize(tbl)} {\n`;
    for (const col of info.columns.slice(0, 20)) {
      const pkMark = col.pk ? ' PK' : '';
      output += `        ${col.dataType} ${sanitize(col.name)}${pkMark}\n`;
    }
    if (info.columns.length > 20) output += `        string _more_${info.columns.length - 20}_columns\n`;
    output += `    }\n`;
  }

  for (const rel of rels) {
    output += `    ${sanitize(rel.fromTable)} }|--|| ${sanitize(rel.toTable)} : "${rel.fromColumn}"\n`;
  }

  return output;
}

function generateDBML(tables: Set<string>, snapshot: SchemaSnapshot): string {
  let output = '// Generated by SchemaLens\n\n';

  for (const tbl of tables) {
    const info = snapshot.tables[tbl];
    if (!info) continue;
    output += `Table ${tbl} {\n`;
    for (const col of info.columns) {
      const attrs = [];
      if (col.pk) attrs.push('pk');
      if (col.identity) attrs.push('increment');
      if (!col.nullable) attrs.push('not null');
      const attrStr = attrs.length > 0 ? ` [${attrs.join(', ')}]` : '';
      output += `  ${col.name} ${col.dataType}${attrStr}\n`;
    }
    output += `}\n\n`;
  }

  // Refs
  const rels = snapshot.relationships.filter(r => tables.has(r.fromTable) && tables.has(r.toTable));
  for (const rel of rels) {
    output += `Ref: ${rel.fromTable}.${rel.fromColumn} > ${rel.toTable}.${rel.toColumn}\n`;
  }

  return output;
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}
