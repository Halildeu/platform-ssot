/**
 * AiQueryBar — Natural language input for AI-powered report generation.
 */

import React, { useState, useCallback } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useAiQuery } from './useAiQuery';
import { QUICK_SUGGESTIONS } from './types';
import type { AiQueryResponse } from './types';

interface Props {
  schema: string;
  onResult?: (result: AiQueryResponse) => void;
  className?: string;
}

export const AiQueryBar: React.FC<Props> = ({ schema, onResult, className }) => {
  const [prompt, setPrompt] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { response, isLoading, error, query, clear } = useAiQuery();

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim()) return;
    const result = await query({ prompt, schema });
    if (result && onResult) onResult(result);
  }, [prompt, schema, query, onResult]);

  const handleSuggestionClick = useCallback((suggestionPrompt: string) => {
    setPrompt(suggestionPrompt);
    setShowSuggestions(false);
  }, []);

  return (
    <div className={className}>
      {/* Input bar */}
      <div className="relative flex items-center gap-2 rounded-2xl border border-border-subtle bg-surface-default px-4 py-2.5 shadow-xs transition focus-within:border-action-primary focus-within:ring-2 focus-within:ring-action-primary/20">
        <Sparkles className="h-5 w-5 shrink-0 text-action-primary" />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={() => !prompt && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Doğal dille rapor oluşturun... (ör: 'Son 3 aydaki faturaları departmana göre göster')"
          className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-disabled"
          disabled={isLoading}
        />
        {prompt && !isLoading && (
          <button type="button" onClick={() => { setPrompt(''); clear(); }} className="text-text-tertiary hover:text-text-primary">
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!prompt.trim() || isLoading}
          className="inline-flex items-center gap-1 rounded-xl bg-action-primary px-3 py-1.5 text-xs font-medium text-action-primary-text transition hover:opacity-90 disabled:opacity-40"
        >
          {isLoading ? (
            <span className="inline-flex h-3.5 w-3.5 animate-spin rounded-full border-2 border-action-primary-text/30 border-t-action-primary-text" />
          ) : (
            <ArrowRight className="h-3.5 w-3.5" />
          )}
          Oluştur
        </button>
      </div>

      {/* Quick suggestions */}
      {showSuggestions && (
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSuggestionClick(s.prompt)}
              className="flex items-center gap-2 rounded-xl border border-border-subtle px-3 py-2 text-left text-xs text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
            >
              <span>{s.icon}</span>
              <span className="min-w-0 truncate">{s.prompt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-2 rounded-xl bg-state-danger-bg px-3 py-2 text-sm text-state-danger-text">
          {error}
        </div>
      )}

      {/* AI Response preview */}
      {response && (
        <div className="mt-3 rounded-xl border border-border-subtle bg-surface-default p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-action-primary" />
            <span className="text-sm font-semibold text-text-primary">{response.suggestedTitle}</span>
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] text-text-tertiary">
              %{Math.round(response.confidence * 100)} güven
            </span>
          </div>
          <p className="text-xs text-text-secondary mb-2">{response.explanation}</p>
          {response.warnings?.map((w, i) => (
            <p key={i} className="text-[10px] text-state-warning-text">⚠️ {w}</p>
          ))}
          <details className="mt-2">
            <summary className="cursor-pointer text-[10px] text-text-tertiary">SQL Önizleme</summary>
            <pre className="mt-1 rounded bg-surface-muted p-2 text-[10px] font-mono overflow-x-auto">{response.sql}</pre>
          </details>
        </div>
      )}
    </div>
  );
};
