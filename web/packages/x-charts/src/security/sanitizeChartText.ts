/**
 * Chart Text Sanitization — XSS Prevention
 *
 * All text content (labels, tooltips, annotations, titles) MUST pass through
 * this sanitizer before being rendered by ECharts.
 *
 * ECharts rich text formatter accepts HTML — unsanitized user input is an XSS vector.
 *
 * @see decisions/topics/chart-viz-engine-selection.v1.json (security constraint)
 */

/**
 * HTML-escape a string to prevent XSS in chart labels/tooltips.
 * Returns undefined for undefined/null input.
 */
export function sanitizeChartText(text: string | undefined | null): string | undefined {
  if (text == null) return undefined;
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize all string values in a data array.
 * Useful for sanitizing chart data before passing to ECharts.
 */
export function sanitizeChartData<T extends Record<string, unknown>>(data: T[]): T[] {
  return data.map((row) => {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      sanitized[key] = typeof value === 'string' ? sanitizeChartText(value) : value;
    }
    return sanitized as T;
  });
}

/**
 * Validate a WebSocket/SSE stream URL against a whitelist.
 * Returns true if the URL is allowed, false otherwise.
 */
export function validateStreamUrl(url: string, whitelist: string[]): boolean {
  if (!url || whitelist.length === 0) return false;
  try {
    const parsed = new URL(url);
    return whitelist.some((pattern) => {
      if (pattern.startsWith('*.')) {
        // Wildcard domain: *.example.com matches sub.example.com
        const domain = pattern.slice(2);
        return parsed.hostname.endsWith(domain);
      }
      return url.startsWith(pattern);
    });
  } catch {
    return false;
  }
}
