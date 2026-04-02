import React from 'react';
import { Database } from 'lucide-react';
import { useAvailableSchemas } from '../hooks/useTableDiscovery';
import type { BuilderState } from '../hooks/useBuilderState';

interface Props {
  state: BuilderState;
  dispatch: React.Dispatch<any>;
}

export const SelectSchemaStep: React.FC<Props> = ({ state, dispatch }) => {
  const { data: schemas, isLoading } = useAvailableSchemas();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">Veritabanı Şeması Seçin</h2>
      <p className="text-sm text-text-secondary">
        Rapor verisinin çekileceği şemayı seçin.
      </p>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-surface-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-2">
          {(schemas ?? []).map((schema) => (
            <button
              key={schema}
              type="button"
              onClick={() => dispatch({ type: 'SET_SCHEMA', schema })}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                state.schema === schema
                  ? 'border-action-primary bg-action-primary/5 text-action-primary'
                  : 'border-border-subtle hover:bg-surface-muted'
              }`}
            >
              <Database className="h-5 w-5 shrink-0" />
              <div>
                <div className="text-sm font-medium">{schema}</div>
              </div>
            </button>
          ))}
          {!schemas?.length && (
            <p className="py-8 text-center text-sm text-text-tertiary">
              Schema bulunamadı. Schema Explorer servisinin çalıştığından emin olun.
            </p>
          )}
        </div>
      )}

      {/* Manual entry */}
      <div className="pt-2">
        <label className="text-xs font-medium text-text-secondary">
          veya schema adını yazın:
          <input
            type="text"
            value={state.schema}
            onChange={(e) => dispatch({ type: 'SET_SCHEMA', schema: e.target.value })}
            placeholder="workcube_mikrolink"
            className="mt-1 w-full rounded-lg border border-border-subtle bg-surface-default px-3 py-2 text-sm"
          />
        </label>
      </div>
    </div>
  );
};
