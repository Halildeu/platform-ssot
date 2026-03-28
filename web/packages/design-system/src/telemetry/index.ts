/* Adoption Telemetry — opt-in anonymous component usage tracking */

export interface TelemetryEvent {
  component: string;
  action: 'render' | 'mount' | 'unmount' | 'interaction';
  timestamp: number;
}

export interface TelemetryConfig {
  enabled: boolean;
  batchSize: number;
  flushIntervalMs: number;
  onFlush?: (events: TelemetryEvent[]) => void;
}

const DEFAULT_CONFIG: TelemetryConfig = {
  enabled: false,
  batchSize: 50,
  flushIntervalMs: 30_000,
};

let config = { ...DEFAULT_CONFIG };
let eventBuffer: TelemetryEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Initialize telemetry. Must be called with enabled=true to start collecting.
 * Privacy-first: no PII, no external transmission by default.
 */
export function initTelemetry(userConfig: Partial<TelemetryConfig>): void {
  config = { ...DEFAULT_CONFIG, ...userConfig };
  if (config.enabled && !flushTimer) {
    flushTimer = setInterval(flush, config.flushIntervalMs);
  }
}

/** Record a component usage event. No-op if telemetry is disabled. */
export function trackComponent(component: string, action: TelemetryEvent['action'] = 'render'): void {
  if (!config.enabled) return;
  eventBuffer.push({ component, action, timestamp: Date.now() });
  if (eventBuffer.length >= config.batchSize) flush();
}

/** Flush buffered events. */
export function flush(): void {
  if (eventBuffer.length === 0) return;
  const events = [...eventBuffer];
  eventBuffer = [];
  config.onFlush?.(events);
}

/** Get current buffer (for debugging). */
export function getBuffer(): TelemetryEvent[] {
  return [...eventBuffer];
}

/** Reset telemetry state. */
export function resetTelemetry(): void {
  config = { ...DEFAULT_CONFIG };
  eventBuffer = [];
  if (flushTimer) { clearInterval(flushTimer); flushTimer = null; }
}

/** Get adoption report from event history. */
export function getAdoptionReport(events: TelemetryEvent[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of events) {
    counts[e.component] = (counts[e.component] ?? 0) + 1;
  }
  return counts;
}
