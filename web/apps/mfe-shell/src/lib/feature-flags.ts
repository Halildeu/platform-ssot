/**
 * Feature Flags + Kill Switches
 * Runtime-configurable flags for safe rollout and emergency shutoff
 */

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
  killSwitch?: boolean; // true = can be disabled in production without deploy
}

const DEFAULT_FLAGS: FeatureFlag[] = [
  { key: 'x-data-grid', enabled: true, description: 'Enterprise data grid recipes', killSwitch: true },
  { key: 'x-charts-dashboard', enabled: true, description: 'Chart dashboard widgets', killSwitch: true },
  { key: 'x-scheduler', enabled: true, description: 'Scheduler views', killSwitch: true },
  { key: 'x-kanban', enabled: true, description: 'Kanban board', killSwitch: true },
  { key: 'x-editor-tiptap', enabled: true, description: 'Tiptap editor engine', killSwitch: true },
  { key: 'x-form-builder', enabled: true, description: 'Schema-driven forms', killSwitch: true },
  { key: 'design-lab-runtime-preview', enabled: true, description: 'Runtime preview in Design Lab', killSwitch: true },
  { key: 'sentry-tracing', enabled: true, description: 'Sentry performance tracing', killSwitch: true },
  { key: 'rum-web-vitals', enabled: true, description: 'Real User Monitoring', killSwitch: true },
];

let flags: Map<string, FeatureFlag> = new Map(DEFAULT_FLAGS.map(f => [f.key, f]));

export function isEnabled(key: string): boolean {
  const flag = flags.get(key);
  return flag?.enabled ?? false;
}

export function getFlags(): FeatureFlag[] {
  return Array.from(flags.values());
}

export function setFlag(key: string, enabled: boolean): void {
  const flag = flags.get(key);
  if (flag) {
    flags.set(key, { ...flag, enabled });
  }
}

export function initFeatureFlags(overrides?: Record<string, boolean>): void {
  if (overrides) {
    for (const [key, enabled] of Object.entries(overrides)) {
      setFlag(key, enabled);
    }
  }

  // Load from localStorage for development
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    try {
      const stored = localStorage.getItem('feature-flags');
      if (stored) {
        const parsed = JSON.parse(stored);
        for (const [key, enabled] of Object.entries(parsed)) {
          setFlag(key, enabled as boolean);
        }
      }
    } catch { /* ignore */ }
  }
}
