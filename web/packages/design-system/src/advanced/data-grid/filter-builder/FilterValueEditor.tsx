/**
 * FilterValueEditor — Renders the correct value input based on filter type.
 * Text → input, Number → number input, Date → date input, Set → checkbox list.
 */
import React from 'react';
import type { FilterType } from './useFilterBuilder';

interface FilterValueEditorProps {
  filterType: FilterType;
  operator: string;
  value: unknown;
  valueTo?: unknown;
  setValues?: string[];
  onChange: (value: unknown, valueTo?: unknown) => void;
}

const INPUT_CLASS =
  'h-8 w-full rounded-md border border-border-subtle bg-surface-default px-2.5 text-xs text-text-primary placeholder:text-text-subtle focus:border-action-primary focus:outline-none focus:ring-1 focus:ring-action-primary';

export const FilterValueEditor: React.FC<FilterValueEditorProps> = ({
  filterType,
  operator,
  value,
  valueTo,
  setValues = [],
  onChange,
}) => {
  // Hooks must be called unconditionally at top level
  const [pasteMode, setPasteMode] = React.useState(false);
  const [pasteText, setPasteText] = React.useState('');

  // Blank/notBlank operators need no value
  if (operator === 'blank' || operator === 'notBlank') {
    return <span className="text-[11px] italic text-text-subtle">Değer gerekmiyor</span>;
  }

  // Parse current value into array of individual values
  const parsedValues = React.useMemo(() => {
    const raw = String(value ?? '');
    if (!raw.trim()) return [];
    return raw.split(/[,;]+/).map((s) => s.trim()).filter(Boolean);
  }, [value]);

  const hasMultipleValues = parsedValues.length > 1;

  const removeValue = (idx: number) => {
    const next = parsedValues.filter((_, i) => i !== idx);
    onChange(next.length > 0 ? next.join(', ') : '');
  };

  const handleBulkApply = () => {
    const newValues = pasteText.split(/[\n\r\t;,]+/).map((s) => s.trim()).filter(Boolean);
    if (newValues.length > 0) {
      const merged = [...new Set([...parsedValues, ...newValues])];
      onChange(merged.join(', '));
    }
    setPasteText('');
    setPasteMode(false);
  };

  // Bulk paste helper for text/number
  const renderBulkPaste = (inputEl: React.ReactNode) => (
    <div className="flex flex-col gap-1.5">
      {/* Input + paste button */}
      <div className="flex items-center gap-1">
        <div className="min-w-0 flex-1">{inputEl}</div>
        <button
          type="button"
          onClick={() => setPasteMode(!pasteMode)}
          className={`shrink-0 rounded p-1.5 text-[10px] transition ${
            pasteMode ? 'bg-action-primary text-white' : 'bg-surface-muted text-text-secondary hover:bg-surface-raised'
          }`}
          title="Excel'den toplu yapıştır"
        >
          📋
        </button>
      </div>

      {/* Paste textarea */}
      {pasteMode && (
        <div className="flex flex-col gap-1 rounded-lg border border-dashed border-blue-300 bg-blue-50/50 p-2">
          <span className="text-[10px] font-medium text-blue-700">Toplu Yapıştır</span>
          <textarea
            className="h-16 w-full resize-none rounded border border-border-subtle bg-surface-default px-2 py-1.5 text-xs text-text-primary placeholder:text-text-subtle focus:border-action-primary focus:outline-none"
            placeholder="Excel'den kopyaladığınız değerleri yapıştırın...&#10;Her satır, virgül veya tab bir değer"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            autoFocus
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-blue-600">
              {pasteText.split(/[\n\r\t;,]+/).filter((s) => s.trim()).length} yeni değer
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => { setPasteText(''); setPasteMode(false); }}
                className="rounded px-2 py-0.5 text-[10px] text-text-secondary hover:bg-surface-muted"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleBulkApply}
                disabled={!pasteText.trim()}
                className="rounded bg-blue-600 px-2.5 py-0.5 text-[10px] font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Value chips — shown when multiple values exist */}
      {hasMultipleValues && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-text-secondary">{parsedValues.length} değer</span>
            <button
              type="button"
              onClick={() => onChange('')}
              className="rounded px-1.5 py-0.5 text-[10px] text-rose-600 hover:bg-rose-50"
            >
              Tümünü Temizle
            </button>
          </div>
          <div className="flex max-h-24 flex-wrap gap-1 overflow-auto">
            {parsedValues.map((v, i) => (
              <span
                key={`${v}-${i}`}
                className="group inline-flex items-center gap-0.5 rounded-md border border-border-subtle bg-surface-default px-1.5 py-0.5 text-[10px] text-text-primary"
              >
                {v}
                <button
                  type="button"
                  onClick={() => removeValue(i)}
                  className="ml-0.5 rounded-full text-text-subtle opacity-60 hover:bg-rose-100 hover:text-rose-600 hover:opacity-100"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  switch (filterType) {
    case 'text':
      return renderBulkPaste(
        <input
          type="text"
          className={INPUT_CLASS}
          placeholder="Değer girin..."
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />,
      );

    case 'number':
      return operator === 'inRange' ? (
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            className={INPUT_CLASS}
            placeholder="Başlangıç"
            value={value != null ? String(value) : ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null, valueTo)}
          />
          <span className="text-[10px] text-text-subtle">—</span>
          <input
            type="number"
            className={INPUT_CLASS}
            placeholder="Bitiş"
            value={valueTo != null ? String(valueTo) : ''}
            onChange={(e) => onChange(value, e.target.value ? Number(e.target.value) : null)}
          />
        </div>
      ) : renderBulkPaste(
        <input
          type="number"
          className={INPUT_CLASS}
          placeholder="Değer"
          value={value != null ? String(value) : ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        />,
      );

    case 'date':
      return (
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            className={INPUT_CLASS}
            value={value ? String(value).split(' ')[0] : ''}
            onChange={(e) => onChange(e.target.value ? `${e.target.value} 00:00:00` : null, valueTo)}
          />
          {operator === 'inRange' && (
            <>
              <span className="text-[10px] text-text-subtle">—</span>
              <input
                type="date"
                className={INPUT_CLASS}
                value={valueTo ? String(valueTo).split(' ')[0] : ''}
                onChange={(e) => onChange(value, e.target.value ? `${e.target.value} 23:59:59` : null)}
              />
            </>
          )}
        </div>
      );

    case 'set': {
      const selected = Array.isArray(value) ? (value as string[]) : [];

      const handlePaste = () => {
        if (!pasteText.trim()) return;
        // Split by newline, tab, semicolon, or comma — covers Excel copy, CSV, manual entry
        const pasted = pasteText
          .split(/[\n\r\t;,]+/)
          .map((s) => s.trim())
          .filter(Boolean);
        // Match against available set values (case-insensitive)
        const matched = setValues.filter((sv) =>
          pasted.some((p) => p.toLowerCase() === sv.toLowerCase()),
        );
        // Also keep raw values not in set (for free-text scenarios)
        const unmatched = pasted.filter(
          (p) => !setValues.some((sv) => sv.toLowerCase() === p.toLowerCase()),
        );
        const merged = [...new Set([...selected, ...matched, ...unmatched])];
        onChange(merged);
        setPasteText('');
        setPasteMode(false);
      };

      return (
        <div className="flex flex-col gap-1.5">
          {/* Paste toggle + area */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPasteMode(!pasteMode)}
              className={`flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium transition ${
                pasteMode
                  ? 'bg-action-primary text-white'
                  : 'bg-surface-muted text-text-secondary hover:bg-surface-raised'
              }`}
            >
              📋 Toplu Yapıştır
            </button>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="rounded px-1.5 py-0.5 text-[10px] text-rose-600 hover:bg-rose-50"
              >
                Tümünü Kaldır ({selected.length})
              </button>
            )}
          </div>

          {pasteMode && (
            <div className="flex flex-col gap-1">
              <textarea
                className={`${INPUT_CLASS} h-20 resize-none py-1.5`}
                placeholder="Excel'den kopyaladığınız değerleri yapıştırın...&#10;Her satır bir değer veya virgülle ayırın"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                onPaste={(e) => {
                  // Auto-apply on paste
                  setTimeout(() => {
                    const text = e.clipboardData?.getData('text') ?? '';
                    if (text.trim()) {
                      setPasteText(text);
                    }
                  }, 0);
                }}
              />
              <button
                type="button"
                onClick={handlePaste}
                disabled={!pasteText.trim()}
                className="self-end rounded bg-action-primary px-3 py-1 text-[10px] font-semibold text-white hover:bg-action-primary/90 disabled:opacity-50"
              >
                Uygula ({pasteText.split(/[\n\r\t;,]+/).filter((s) => s.trim()).length} değer)
              </button>
            </div>
          )}

          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selected.slice(0, 20).map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 rounded-full bg-action-primary/10 px-2 py-0.5 text-[10px] font-medium text-action-primary"
                >
                  {v}
                  <button
                    type="button"
                    onClick={() => onChange(selected.filter((s) => s !== v))}
                    className="ml-0.5 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
              {selected.length > 20 && (
                <span className="text-[10px] text-text-subtle">+{selected.length - 20} daha</span>
              )}
            </div>
          )}

          {/* Checkbox list */}
          <div className="max-h-32 overflow-auto rounded-md border border-border-subtle bg-surface-default p-1.5">
            {setValues.length === 0 ? (
              <span className="text-[10px] text-text-subtle">Seçenek yok</span>
            ) : (
              setValues.map((v) => (
                <label
                  key={v}
                  className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs text-text-primary hover:bg-surface-muted"
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-border-subtle text-action-primary focus:ring-action-primary"
                    checked={selected.includes(v)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...selected, v]
                        : selected.filter((s) => s !== v);
                      onChange(next);
                    }}
                  />
                  {v}
                </label>
              ))
            )}
          </div>
        </div>
      );
    }

    default:
      return (
        <input
          type="text"
          className={INPUT_CLASS}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};
