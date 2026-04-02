import React from 'react';
import type { BuilderState } from '../hooks/useBuilderState';

interface Props { state: BuilderState; dispatch: React.Dispatch<any>; }

const COLUMN_TYPES = [
  { value: 'text', label: 'Metin' },
  { value: 'bold-text', label: 'Kalın Metin' },
  { value: 'number', label: 'Sayı' },
  { value: 'currency', label: 'Para Birimi' },
  { value: 'date', label: 'Tarih' },
  { value: 'boolean', label: 'Evet/Hayır' },
  { value: 'badge', label: 'Badge (Renkli Etiket)' },
  { value: 'status', label: 'Durum' },
  { value: 'percent', label: 'Yüzde' },
  { value: 'enum', label: 'Seçenek Listesi' },
  { value: 'link', label: 'Link' },
];

export const ConfigureColumnsStep: React.FC<Props> = ({ state, dispatch }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-text-primary">Sütun Tiplerini Ayarlayın</h2>
    <p className="text-sm text-text-secondary">
      Her sütunun görüntüleme tipini ayarlayın. Otomatik çıkarım yapılmıştır, değiştirmek isterseniz seçin. (Opsiyonel)
    </p>

    <div className="max-h-[400px] space-y-2 overflow-y-auto">
      {state.selectedColumns.map((col) => (
        <div key={col.field} className="flex items-center gap-3 rounded-lg border border-border-subtle px-3 py-2">
          <span className="min-w-[140px] text-sm font-medium">{col.field}</span>
          <select
            value={col.columnType}
            onChange={(e) => dispatch({ type: 'SET_COLUMN_TYPE', field: col.field, columnType: e.target.value })}
            className="flex-1 rounded-lg border border-border-subtle px-2 py-1 text-sm"
          >
            {COLUMN_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <span className="text-[10px] text-text-tertiary">{col.headerName}</span>
        </div>
      ))}
    </div>
  </div>
);
