import React, { useCallback, useState } from 'react';
import { updateThemeAxes } from '@mfe/design-system';
import type { UseThemeAdminReturn } from './useThemeAdmin';
import { runThemeDoctor } from '../../../lib/theme-doctor';

type ThemeDrawerPanelProps = {
  admin: UseThemeAdminReturn;
};

/* ------------------------------------------------------------------ */
/*  Accent color map — actual representative colors for each accent    */
/* ------------------------------------------------------------------ */
const ACCENT_COLORS: Record<string, string> = {
  neutral: '#6b7280',
  light: '#3b82f6',
  violet: '#8b5cf6',
  emerald: '#10b981',
  sunset: '#f59e0b',
  ocean: '#0ea5e9',
  graphite: '#4b5563',
};

/* ------------------------------------------------------------------ */
/*  Section wrapper — clean visual grouping                            */
/* ------------------------------------------------------------------ */
const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}> = ({ title, children, collapsible, defaultOpen = true }) => {
  if (collapsible) {
    return (
      <details open={defaultOpen} className="group">
        <summary className="flex cursor-pointer select-none items-center justify-between py-2 text-[11px] font-semibold uppercase tracking-wider text-text-subtle">
          {title}
          <span className="text-[10px] text-text-subtle transition-transform group-open:rotate-180">▾</span>
        </summary>
        <div className="flex flex-col gap-3 pb-1">{children}</div>
      </details>
    );
  }
  return (
    <div>
      <div className="py-2 text-[11px] font-semibold uppercase tracking-wider text-text-subtle">{title}</div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Panel                                                         */
/* ------------------------------------------------------------------ */
const ThemeDrawerPanel: React.FC<ThemeDrawerPanelProps> = ({ admin }) => {
  const { t } = admin;
  const [exportFormat, setExportFormat] = useState<'css' | 'json' | 'ts'>('css');
  const [copied, setCopied] = useState(false);
  const [doctorReport, setDoctorReport] = useState<ReturnType<typeof runThemeDoctor> | null>(null);
  const [doctorRunning, setDoctorRunning] = useState(false);

  const appearance = admin.themeMeta?.appearance ?? 'light';
  const accent = admin.themeMeta?.axes.accent ?? 'neutral';
  const density = admin.themeMeta?.axes.density ?? 'comfortable';
  const radius = admin.themeMeta?.axes.radius ?? 'rounded';
  const elevation = admin.themeMeta?.axes.elevation ?? 'raised';
  const motion = admin.themeMeta?.axes.motion ?? 'standard';

  /* --- live bridge helpers --- */
  const liveUpdate = useCallback((patch: Record<string, string>) => {
    updateThemeAxes(patch);
  }, []);

  const setAxis = useCallback((axis: string, value: string) => {
    admin.setThemeMeta((prev) =>
      prev ? { ...prev, axes: { ...prev.axes, [axis]: value } } : prev,
    );
    liveUpdate({ [axis]: value });

    /* Radius token override — design-system doesn't bind data-radius to CSS vars yet */
    if (axis === 'radius') {
      const root = document.documentElement;
      const radiusVars = ['--radius-xs', '--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl', '--radius-3xl', '--radius-4xl', '--radius-control', '--radius-surface', '--ds-radius-md'];
      if (value === 'sharp') {
        const sharpValues: Record<string, string> = {
          '--radius-xs': '0', '--radius-sm': '1px', '--radius-md': '2px', '--radius-lg': '3px',
          '--radius-xl': '4px', '--radius-2xl': '4px', '--radius-3xl': '6px', '--radius-4xl': '6px',
          '--radius-control': '4px', '--radius-surface': '4px', '--ds-radius-md': '2px',
        };
        radiusVars.forEach((v) => root.style.setProperty(v, sharpValues[v] ?? '2px'));
      } else {
        radiusVars.forEach((v) => root.style.removeProperty(v));
      }
    }
  }, [admin, liveUpdate]);

  const toggleMode = useCallback(() => {
    const next = appearance === 'dark' ? 'light' : 'dark';
    admin.toggleAppearance();
    liveUpdate({ appearance: next });
  }, [admin, appearance, liveUpdate]);

  /* --- export --- */
  const exportContent = React.useMemo(() => {
    const ov = admin.overrides;
    const meta = admin.themeMeta;
    const cssMap = admin.registryCssVarsByKey;
    if (exportFormat === 'json') return JSON.stringify({ meta, overrides: ov }, null, 2);
    if (exportFormat === 'ts') {
      return `export const themeMeta = ${JSON.stringify(meta, null, 2)} as const;\n\nexport const themeOverrides = ${JSON.stringify(ov, null, 2)};`;
    }
    const lines = [`/* Theme — ${meta?.appearance} / ${meta?.axes.accent} */`, ':root {'];
    for (const key of Object.keys(ov).sort()) {
      for (const v of cssMap[key] ?? []) lines.push(`  ${v}: ${ov[key]};`);
    }
    lines.push('}');
    return lines.join('\n');
  }, [exportFormat, admin.overrides, admin.themeMeta, admin.registryCssVarsByKey]);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(exportContent); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <div className="flex h-full flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-5">

          {/* ── Mode ───────────────────────────────────── */}
          <Section title={t('themeadmin.meta.appearance')}>
            <div className="flex rounded-xl bg-surface-muted p-1">
              {(['light', 'dark'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={mode !== appearance ? toggleMode : undefined}
                  className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition-all ${
                    appearance === mode
                      ? 'bg-surface-default text-text-primary shadow-sm'
                      : 'text-text-subtle hover:text-text-secondary'
                  }`}
                >
                  {mode === 'light' ? '☀️ Light' : '🌙 Dark'}
                </button>
              ))}
            </div>
          </Section>

          {/* ── Accent ─────────────────────────────────── */}
          <Section title={t('themeadmin.meta.accent')}>
            <div className="flex flex-wrap gap-2">
              {admin.accentOptions.map((opt) => {
                const isSelected = accent === opt.value;
                const color = ACCENT_COLORS[opt.value] ?? '#6b7280';
                return (
                  <button
                    key={opt.value}
                    type="button"
                    title={opt.label}
                    onClick={() => setAxis('accent', opt.value)}
                    className={`group flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all ${
                      isSelected ? 'bg-surface-muted ring-2 ring-action-primary' : 'hover:bg-surface-muted'
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full border-2 transition-transform ${
                        isSelected ? 'border-white scale-110 shadow-lg' : 'border-transparent group-hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[10px] font-medium text-text-secondary">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* ── Style ──────────────────────────────────── */}
          <Section title="Stil">
            <div className="grid grid-cols-2 gap-3">
              {/* Radius */}
              <div>
                <span className="mb-1.5 block text-[10px] font-medium text-text-subtle">Radius</span>
                <div className="flex gap-1.5">
                  {[{ v: 'rounded', icon: '◐', label: 'Yumuşak' }, { v: 'sharp', icon: '▢', label: 'Keskin' }].map((r) => (
                    <button
                      key={r.v}
                      type="button"
                      onClick={() => setAxis('radius', r.v)}
                      className={`flex flex-1 flex-col items-center gap-1 rounded-lg border p-2 text-[10px] font-semibold transition-all ${
                        radius === r.v
                          ? 'border-action-primary bg-action-primary/10 text-action-primary'
                          : 'border-border-subtle text-text-secondary hover:border-text-secondary'
                      }`}
                    >
                      <span className="text-base">{r.icon}</span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Density */}
              <div>
                <span className="mb-1.5 block text-[10px] font-medium text-text-subtle">Yoğunluk</span>
                <div className="flex gap-1.5">
                  {[{ v: 'comfortable', label: 'Rahat' }, { v: 'compact', label: 'Sıkı' }].map((d) => (
                    <button
                      key={d.v}
                      type="button"
                      onClick={() => setAxis('density', d.v)}
                      className={`flex flex-1 items-center justify-center rounded-lg border p-2 text-[10px] font-semibold transition-all ${
                        density === d.v
                          ? 'border-action-primary bg-action-primary/10 text-action-primary'
                          : 'border-border-subtle text-text-secondary hover:border-text-secondary'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Elevation */}
              <div>
                <span className="mb-1.5 block text-[10px] font-medium text-text-subtle">Gölge</span>
                <div className="flex gap-1.5">
                  {[{ v: 'raised', label: 'Var' }, { v: 'flat', label: 'Yok' }].map((e) => (
                    <button
                      key={e.v}
                      type="button"
                      onClick={() => setAxis('elevation', e.v)}
                      className={`flex flex-1 items-center justify-center rounded-lg border p-2 text-[10px] font-semibold transition-all ${
                        elevation === e.v
                          ? 'border-action-primary bg-action-primary/10 text-action-primary'
                          : 'border-border-subtle text-text-secondary hover:border-text-secondary'
                      }`}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motion */}
              <div>
                <span className="mb-1.5 block text-[10px] font-medium text-text-subtle">Animasyon</span>
                <div className="flex gap-1.5">
                  {[{ v: 'standard', label: 'Normal' }, { v: 'reduced', label: 'Az' }].map((m) => (
                    <button
                      key={m.v}
                      type="button"
                      onClick={() => setAxis('motion', m.v)}
                      className={`flex flex-1 items-center justify-center rounded-lg border p-2 text-[10px] font-semibold transition-all ${
                        motion === m.v
                          ? 'border-action-primary bg-action-primary/10 text-action-primary'
                          : 'border-border-subtle text-text-secondary hover:border-text-secondary'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ── Surface Tone (collapsible) ─────────────── */}
          <Section title="Surface Tone" collapsible defaultOpen={false}>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => admin.setThemeMeta((prev) => (prev ? { ...prev, surfaceTone: null } : prev))}
                className={`rounded-lg border px-3 py-1.5 text-[10px] font-semibold transition-all ${
                  !admin.themeMeta?.surfaceTone
                    ? 'border-action-primary bg-action-primary/10 text-action-primary'
                    : 'border-border-subtle text-text-secondary hover:border-text-secondary'
                }`}
              >
                Varsayılan
              </button>
              {['ultra', 'mid', 'deep'].map((band) =>
                Array.from({ length: 6 }, (_, i) => {
                  const tone = `${band}-${i + 1}`;
                  const isSelected = admin.themeMeta?.surfaceTone === tone;
                  const lightness = band === 'ultra' ? 95 - i * 3 : band === 'mid' ? 75 - i * 5 : 50 - i * 6;
                  return (
                    <button
                      key={tone}
                      type="button"
                      title={tone}
                      onClick={() => admin.setThemeMeta((prev) => (prev ? { ...prev, surfaceTone: tone } : prev))}
                      className={`h-7 w-7 rounded-md border text-[8px] font-bold transition-all ${
                        isSelected ? 'border-action-primary ring-2 ring-action-primary scale-110' : 'border-border-subtle hover:scale-105'
                      }`}
                      style={{ backgroundColor: `hsl(0 0% ${lightness}%)`, color: lightness < 55 ? '#fff' : '#333' }}
                    >
                      {i + 1}
                    </button>
                  );
                }),
              )}
            </div>
          </Section>

          {/* ── Export (collapsible) ────────────────────── */}
          <Section title="Export" collapsible defaultOpen={false}>
            <div className="flex gap-1.5">
              {(['css', 'json', 'ts'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setExportFormat(f)}
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold transition-all ${
                    exportFormat === f
                      ? 'bg-action-primary text-action-primary-text'
                      : 'border border-border-subtle text-text-secondary hover:border-text-secondary'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            <pre className="max-h-32 overflow-auto rounded-lg bg-surface-muted p-3 text-[10px] leading-relaxed text-text-primary">
              {exportContent}
            </pre>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="rounded-md border border-border-subtle px-3 py-1 text-[10px] font-semibold text-text-secondary hover:border-text-secondary"
              >
                {copied ? '✓' : 'Kopyala'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([exportContent], { type: 'text/plain' });
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = `theme.${exportFormat}`;
                  a.click();
                  URL.revokeObjectURL(a.href);
                }}
                className="rounded-md bg-action-primary px-3 py-1 text-[10px] font-semibold text-action-primary-text hover:opacity-90"
              >
                İndir .{exportFormat}
              </button>
            </div>
          </Section>

          {/* ── Doktor (collapsible) ──────────────────── */}
          <Section title="Doktor" collapsible defaultOpen={false}>
            <button
              type="button"
              onClick={() => { setDoctorRunning(true); requestAnimationFrame(() => { setDoctorReport(runThemeDoctor()); setDoctorRunning(false); }); }}
              disabled={doctorRunning}
              className="w-full rounded-lg border border-border-subtle bg-surface-muted px-3 py-2 text-[10px] font-semibold text-text-secondary hover:border-text-secondary disabled:opacity-50"
            >
              {doctorRunning ? 'Kontrol ediliyor...' : '🩺 Tema Sağlık Kontrolü Çalıştır'}
            </button>
            <div className="text-[9px] text-text-subtle">
              Konsol: <code className="rounded bg-surface-muted px-1 font-mono">window.__themeDoctor()</code>
            </div>
            {doctorReport ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] font-semibold">
                  <span className="text-text-primary">Skor: {doctorReport.score}/100</span>
                  <span className="text-status-success-text">✓{doctorReport.summary.pass}</span>
                  {doctorReport.summary.warn > 0 && <span className="text-status-warning-text">⚠{doctorReport.summary.warn}</span>}
                  {doctorReport.summary.fail > 0 && <span className="text-status-danger-text">✗{doctorReport.summary.fail}</span>}
                </div>
                {doctorReport.checks.filter((c) => c.status !== 'PASS').length > 0 && (
                  <div className="flex flex-col gap-1">
                    {doctorReport.checks
                      .filter((c) => c.status !== 'PASS')
                      .map((check) => (
                        <div key={check.id} className={`rounded-md border px-2 py-1.5 text-[9px] ${check.status === 'FAIL' ? 'border-status-danger-border bg-status-danger/10' : 'border-status-warning-border bg-status-warning/10'}`}>
                          <div className="font-semibold text-text-primary">{check.status === 'FAIL' ? '✗' : '⚠'} [{check.category}] {check.label}</div>
                          <div className="text-text-subtle">Beklenen: {check.expected} — Gerçek: {check.actual}</div>
                          {check.detail && <div className="text-text-subtle italic">{check.detail}</div>}
                        </div>
                      ))}
                  </div>
                )}
                <details className="text-[9px]">
                  <summary className="cursor-pointer text-text-subtle">Geçen kontroller ({doctorReport.summary.pass})</summary>
                  <div className="mt-1 flex flex-col gap-0.5">
                    {doctorReport.checks.filter((c) => c.status === 'PASS').map((c) => (
                      <div key={c.id} className="flex items-center gap-1 text-text-subtle">
                        <span className="text-status-success-text">✓</span>
                        <span>{c.label}</span>
                        <span className="ml-auto font-mono">{c.actual}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ) : null}
          </Section>

        </div>
      </div>

      {/* ── Footer — minimal status ──────────────────── */}
      <div className="flex items-center justify-center border-t border-border-subtle px-5 py-2">
        <span className="text-[10px] text-text-subtle">
          Değişiklikler anlık uygulanır
        </span>
      </div>
    </div>
  );
};

export default ThemeDrawerPanel;
