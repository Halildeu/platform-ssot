import React from 'react';
import { Save, FileJson, Table2 } from 'lucide-react';
import type { BuilderState } from '../hooks/useBuilderState';
import { generateReportConfig, validateReportConfig } from '../utils/generateReportConfig';

interface Props {
  state: BuilderState;
  dispatch: React.Dispatch<any>;
  onSave: () => void;
}

export const PreviewAndSaveStep: React.FC<Props> = ({ state, dispatch, onSave }) => {
  const config = generateReportConfig(state);
  const errors = validateReportConfig(config);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">Önizle & Kaydet</h2>

      {/* Report meta */}
      <div className="space-y-3">
        <label className="block">
          <span className="text-xs font-medium text-text-secondary">Rapor Başlığı *</span>
          <input
            type="text"
            value={state.reportTitle}
            onChange={(e) => dispatch({ type: 'SET_REPORT_META', title: e.target.value })}
            placeholder="Aylık Satış Raporu"
            className="mt-1 w-full rounded-lg border border-border-subtle px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-text-secondary">Açıklama</span>
          <textarea
            value={state.reportDescription}
            onChange={(e) => dispatch({ type: 'SET_REPORT_META', description: e.target.value })}
            placeholder="Bu rapor aylık satış verilerini gösterir."
            className="mt-1 w-full rounded-lg border border-border-subtle px-3 py-2 text-sm"
            rows={2}
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-text-secondary">Kategori</span>
          <select
            value={state.reportCategory}
            onChange={(e) => dispatch({ type: 'SET_REPORT_META', category: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-subtle px-3 py-2 text-sm"
          >
            <option value="">Seçin...</option>
            <option value="İnsan Kaynakları">İnsan Kaynakları</option>
            <option value="Finans">Finans</option>
            <option value="Satış">Satış</option>
            <option value="Operasyon">Operasyon</option>
            <option value="Denetim">Denetim</option>
            <option value="IT">IT</option>
            <option value="Genel">Genel</option>
          </select>
        </label>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border-subtle bg-surface-muted p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Table2 className="h-4 w-4 text-text-tertiary" />
          <span className="font-medium">Schema:</span> {config.sourceSchema}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Tablolar:</span> {config.sourceTables.join(', ')}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Sütunlar:</span> {config.columns.length}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Joinler:</span> {config.joins.length}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Filtreler:</span> {config.filters.length}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Lookup'lar:</span> {config.lookups.length}
        </div>
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="rounded-xl border border-state-danger-bg bg-state-danger-bg p-3">
          <p className="text-sm font-medium text-state-danger-text">Eksikler:</p>
          <ul className="mt-1 list-inside list-disc text-sm text-state-danger-text">
            {errors.map((err) => <li key={err}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* JSON preview */}
      <details className="rounded-xl border border-border-subtle">
        <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-text-secondary">
          <FileJson className="h-4 w-4" />
          JSON Önizleme
        </summary>
        <pre className="max-h-[200px] overflow-auto px-3 pb-3 text-[10px] text-text-tertiary">
          {JSON.stringify(config, null, 2)}
        </pre>
      </details>
    </div>
  );
};
