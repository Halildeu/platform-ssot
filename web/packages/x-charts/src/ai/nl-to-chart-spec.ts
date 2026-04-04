/**
 * NL → ChartSpec Generator
 *
 * Transforms natural language queries into ChartSpec objects.
 * Uses an LLM endpoint (Claude API) via a configurable fetch function
 * to avoid hard-coding API keys in the client bundle.
 *
 * The caller provides a `fetchFn` that handles auth and routing
 * (e.g., through a backend proxy or AiChatService).
 *
 * @see contract P5 DoD: "NL → ChartSpec generator"
 * @see ChartSpec (spec/ChartSpec.ts)
 */

import type { ChartSpec, ChartType } from '../spec/ChartSpec';
import { validateChartSpec } from '../spec/validateChartSpec';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface NLToChartSpecOptions {
  /** Natural language query (e.g., "Show revenue by department as a bar chart") */
  query: string;
  /** Available column names and types for context */
  columns?: Array<{ field: string; type: 'string' | 'number' | 'date' }>;
  /** Preferred chart type hint (optional) */
  preferredType?: ChartType;
  /** Locale for labels. @default 'tr-TR' */
  locale?: string;
  /** Fetch function for LLM endpoint. Receives prompt, returns JSON string. */
  fetchFn: (prompt: string) => Promise<string>;
  /** Abort signal for cancellation */
  signal?: AbortSignal;
}

export interface NLToChartSpecResult {
  /** Generated ChartSpec (null if generation failed) */
  spec: ChartSpec | null;
  /** Whether the spec passed validation */
  isValid: boolean;
  /** Validation errors if any */
  errors: string[];
  /** The prompt sent to the LLM (for debugging) */
  prompt: string;
  /** Raw LLM response (for debugging) */
  rawResponse: string;
}

/* ------------------------------------------------------------------ */
/*  Prompt Builder                                                     */
/* ------------------------------------------------------------------ */

function buildPrompt(options: NLToChartSpecOptions): string {
  const { query, columns, preferredType, locale = 'tr-TR' } = options;

  const columnContext = columns
    ? `\nAvailable columns:\n${columns.map((c) => `- ${c.field} (${c.type})`).join('\n')}`
    : '';

  const typeHint = preferredType ? `\nPreferred chart type: ${preferredType}` : '';

  return `You are a chart specification generator. Convert the following natural language query into a ChartSpec JSON object.

Query: "${query}"
${columnContext}${typeHint}
Locale: ${locale}

Rules:
- Return ONLY valid JSON (no markdown, no explanation)
- chart_type must be one of: bar, line, area, pie, scatter, gauge, radar, treemap, heatmap, waterfall, funnel, sankey, sunburst
- encoding must have at least x and y channels
- Each channel needs: field (column name), type (nominal/quantitative/temporal/ordinal)
- Include a descriptive title

Return a JSON object with these fields:
{
  "spec_version": "1.0.0",
  "chart_type": "...",
  "title": "...",
  "encoding": {
    "x": { "field": "...", "type": "..." },
    "y": { "field": "...", "type": "...", "aggregate": "sum|avg|count|..." }
  },
  "data_source": { "type": "inline", "values": [] }
}`;
}

/* ------------------------------------------------------------------ */
/*  Generator                                                          */
/* ------------------------------------------------------------------ */

/**
 * Transform a natural language query into a ChartSpec.
 *
 * ```ts
 * const result = await nlToChartSpec({
 *   query: "Show revenue by department",
 *   columns: [{ field: "department", type: "string" }, { field: "revenue", type: "number" }],
 *   fetchFn: async (prompt) => {
 *     const res = await fetch('/api/v1/ai/chat', { method: 'POST', body: JSON.stringify({ prompt }) });
 *     return res.text();
 *   },
 * });
 * ```
 */
export async function nlToChartSpec(options: NLToChartSpecOptions): Promise<NLToChartSpecResult> {
  const prompt = buildPrompt(options);
  let rawResponse = '';

  try {
    rawResponse = await options.fetchFn(prompt);

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)```/) ?? [null, rawResponse];
    const jsonStr = (jsonMatch[1] ?? rawResponse).trim();

    const parsed = JSON.parse(jsonStr);

    // Normalize to ChartSpec shape
    const spec: ChartSpec = {
      $schema: 'urn:ao:chart-spec:v1',
      version: 'v1',
      spec_version: parsed.spec_version ?? '1.0.0',
      chart_type: parsed.chart_type ?? 'bar',
      title: parsed.title,
      encoding: parsed.encoding ?? {},
      data: parsed.data_source ?? parsed.data ?? { source: 'inline', values: [] },
      ...parsed,
    } as ChartSpec;

    // Validate
    const validation = validateChartSpec(spec);

    return {
      spec: validation.valid ? spec : spec, // Return even if invalid for debugging
      isValid: validation.valid,
      errors: validation.errors,
      prompt,
      rawResponse,
    };
  } catch (error) {
    return {
      spec: null,
      isValid: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      prompt,
      rawResponse,
    };
  }
}
