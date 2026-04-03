/**
 * ReportBuilderWizard — 8-step wizard for creating reports.
 *
 * Steps:
 * 0: Select Schema
 * 1: Select Table
 * 2: Select Columns
 * 3: Add Related Tables
 * 4: Configure Lookups
 * 5: Configure Column Types
 * 6: Configure Filters
 * 7: Preview & Save
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Save, RotateCcw } from 'lucide-react';
import { useBuilderState } from './hooks/useBuilderState';
import { generateReportConfig, validateReportConfig } from './utils/generateReportConfig';
import { SelectSchemaStep } from './steps/SelectSchemaStep';
import { SelectTableStep } from './steps/SelectTableStep';
import { SelectColumnsStep } from './steps/SelectColumnsStep';
import { AddRelatedTablesStep } from './steps/AddRelatedTablesStep';
import { ConfigureLookupsStep } from './steps/ConfigureLookupsStep';
import { ConfigureColumnsStep } from './steps/ConfigureColumnsStep';
import { ConfigureFiltersStep } from './steps/ConfigureFiltersStep';
import { PreviewAndSaveStep } from './steps/PreviewAndSaveStep';

const STEP_LABELS = [
  'Schema Seç',
  'Tablo Seç',
  'Sütunları Seç',
  'İlişkili Tablolar',
  'ID → İsim',
  'Sütun Tipleri',
  'Filtreler',
  'Önizle & Kaydet',
];

const showToast = (type: 'success' | 'error', text: string) => {
  try { window.dispatchEvent(new CustomEvent('app:toast', { detail: { type, text } })); } catch { /* */ }
};

export const ReportBuilderWizard: React.FC = () => {
  const { state, dispatch, reset, canProceed, totalSteps } = useBuilderState();
  const navigate = useNavigate();

  const handleSave = useCallback(async () => {
    const config = generateReportConfig(state);
    const errors = validateReportConfig(config);
    if (errors.length > 0) {
      showToast('error', errors.join(', '));
      return;
    }

    try {
      const res = await fetch('/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      showToast('success', `"${config.title}" raporu oluşturuldu.`);
      reset();
      navigate(`/admin/reports/${data.key ?? data.id ?? ''}`);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Rapor kaydedilemedi.');
    }
  }, [state, reset, navigate]);

  const renderStep = () => {
    switch (state.step) {
      case 0: return <SelectSchemaStep state={state} dispatch={dispatch} />;
      case 1: return <SelectTableStep state={state} dispatch={dispatch} />;
      case 2: return <SelectColumnsStep state={state} dispatch={dispatch} />;
      case 3: return <AddRelatedTablesStep state={state} dispatch={dispatch} />;
      case 4: return <ConfigureLookupsStep state={state} dispatch={dispatch} />;
      case 5: return <ConfigureColumnsStep state={state} dispatch={dispatch} />;
      case 6: return <ConfigureFiltersStep state={state} dispatch={dispatch} />;
      case 7: return <PreviewAndSaveStep state={state} dispatch={dispatch} onSave={handleSave} />;
      default: return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Yeni Rapor Oluştur</h1>
          <p className="text-sm text-text-secondary">Adım {state.step + 1} / {totalSteps}: {STEP_LABELS[state.step]}</p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-muted"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Sıfırla
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-6 flex gap-1">
        {STEP_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => i <= state.step && dispatch({ type: 'SET_STEP', step: i })}
            className={`flex-1 rounded-full py-1 text-[10px] font-medium transition ${
              i === state.step
                ? 'bg-action-primary text-action-primary-text'
                : i < state.step
                  ? 'bg-state-success-bg text-state-success-text cursor-pointer'
                  : 'bg-surface-muted text-text-tertiary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-6 shadow-xs">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => dispatch({ type: 'PREV_STEP' })}
          disabled={state.step === 0}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border-subtle px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-muted disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Geri
        </button>

        {state.step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={() => dispatch({ type: 'NEXT_STEP' })}
            disabled={!canProceed}
            className="inline-flex items-center gap-1.5 rounded-xl bg-action-primary px-4 py-2 text-sm font-medium text-action-primary-text transition hover:opacity-90 disabled:opacity-40"
          >
            İleri
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={!canProceed}
            className="inline-flex items-center gap-1.5 rounded-xl bg-action-primary px-4 py-2 text-sm font-medium text-action-primary-text transition hover:opacity-90 disabled:opacity-40"
          >
            <Save className="h-4 w-4" />
            Kaydet
          </button>
        )}
      </div>
    </div>
  );
};
