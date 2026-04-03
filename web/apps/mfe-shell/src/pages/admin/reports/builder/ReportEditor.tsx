/**
 * ReportEditor — Edit existing report via wizard or canvas.
 *
 * Loads existing ReportDefinition, populates wizard state,
 * and allows modification + save (PUT /v1/reports/{key}).
 */

import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, ArrowLeft } from 'lucide-react';
import { useBuilderState } from './hooks/useBuilderState';
import { ReportBuilderWizard } from './ReportBuilderWizard';
import { ReportDesigner } from './ReportDesigner';
import type { ReportDefinition } from './utils/generateReportConfig';

const showToast = (type: 'success' | 'error', text: string) => {
  try { window.dispatchEvent(new CustomEvent('app:toast', { detail: { type, text } })); } catch { /* */ }
};

interface Props {
  reportKey: string;
}

export const ReportEditor: React.FC<Props> = ({ reportKey }) => {
  const { state, dispatch, reset } = useBuilderState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'wizard' | 'canvas'>('wizard');
  const [loading, setLoading] = useState(true);

  /* Load existing report definition */
  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(`/v1/reports/${reportKey}/metadata`)
      .then((r) => r.json())
      .then((def: ReportDefinition) => {
        if (!active) return;
        dispatch({ type: 'SET_SCHEMA', schema: def.sourceSchema });
        if (def.sourceTables[0]) {
          dispatch({
            type: 'SET_PRIMARY_TABLE',
            table: def.sourceTables[0],
            columns: def.columns.map((c) => ({
              field: c.field,
              headerName: c.headerName,
              columnType: c.columnType,
              width: c.width,
              included: true,
            })),
          });
        }
        dispatch({ type: 'SET_REPORT_META', title: def.title, description: def.description, category: def.category });
        dispatch({ type: 'SET_FILTERS', filters: def.filters ?? [] });
        dispatch({ type: 'SET_STEP', step: 7 }); // go to preview
      })
      .catch((err) => {
        if (active) showToast('error', 'Rapor tanımı yüklenemedi.');
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [reportKey, dispatch]);

  const handleBack = useCallback(() => {
    navigate(`/admin/reports/${reportKey}`);
  }, [navigate, reportKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="inline-flex h-6 w-6 animate-spin rounded-full border-2 border-border-subtle border-t-action-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleBack} className="rounded-lg p-1.5 hover:bg-surface-muted">
            <ArrowLeft className="h-5 w-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              <Pencil className="mr-2 inline h-5 w-5" />
              Raporu Düzenle
            </h1>
            <p className="text-sm text-text-secondary">{state.reportTitle || reportKey}</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-lg border border-border-subtle">
          <button
            type="button"
            onClick={() => setMode('wizard')}
            className={`px-3 py-1.5 text-xs font-medium rounded-l-lg ${mode === 'wizard' ? 'bg-action-primary text-action-primary-text' : 'text-text-secondary hover:bg-surface-muted'}`}
          >
            Wizard
          </button>
          <button
            type="button"
            onClick={() => setMode('canvas')}
            className={`px-3 py-1.5 text-xs font-medium rounded-r-lg ${mode === 'canvas' ? 'bg-action-primary text-action-primary-text' : 'text-text-secondary hover:bg-surface-muted'}`}
          >
            Canvas
          </button>
        </div>
      </div>

      {/* Editor */}
      {mode === 'wizard' ? (
        <ReportBuilderWizard />
      ) : (
        <ReportDesigner state={state} dispatch={dispatch} />
      )}
    </div>
  );
};
