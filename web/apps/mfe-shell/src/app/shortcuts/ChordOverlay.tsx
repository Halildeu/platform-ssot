import React from 'react';
import { Transition } from '@mfe/design-system/motion';
import { useShellCommonI18n } from '../i18n';
import type { ChordEntry } from './chord-navigation.config';
import { CHORD_TIMEOUT_MS } from './chord-navigation.config';

/* ------------------------------------------------------------------ */
/*  ChordOverlay — Fixed bottom-center hint panel during "g" pending   */
/*                                                                     */
/*  Shows available chord keys with icons + labels.                    */
/*  Animated progress bar indicates timeout countdown.                 */
/* ------------------------------------------------------------------ */

interface ChordOverlayProps {
  isPending: boolean;
  chords: ChordEntry[];
}

export const ChordOverlay: React.FC<ChordOverlayProps> = ({ isPending, chords }) => {
  const { t } = useShellCommonI18n();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex justify-center">
      <Transition show={isPending} preset="slideUp">
        <div className="pointer-events-auto overflow-hidden rounded-xl border border-border-subtle bg-surface-panel/95 shadow-lg backdrop-blur-sm">
          {/* Header hint */}
          <div className="flex items-center gap-2 px-4 pt-3 pb-2">
            <kbd className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border-subtle bg-surface-muted font-mono text-xs font-bold text-text-primary">
              g
            </kbd>
            <span className="text-xs text-text-subtle">{t('shell.chord.hint')}</span>
          </div>

          {/* Chord entries */}
          <div className="flex gap-1 px-3 pb-3">
            {chords.map((chord) => {
              const Icon = chord.icon;
              return (
                <div
                  key={chord.key}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                >
                  <kbd className="inline-flex h-5 w-5 items-center justify-center rounded border border-border-subtle bg-surface-default font-mono text-[11px] font-bold text-[var(--accent-primary)]">
                    {chord.key}
                  </kbd>
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  <span className="text-xs font-medium">{t(chord.labelKey)}</span>
                </div>
              );
            })}
          </div>

          {/* Animated progress bar (shrinks from 100% to 0% over CHORD_TIMEOUT_MS) */}
          <div className="h-0.5 w-full bg-border-subtle/30">
            {isPending && (
              <div
                className="h-full bg-[var(--accent-primary)] transition-none"
                style={{
                  animation: `chord-progress ${CHORD_TIMEOUT_MS}ms linear forwards`,
                }}
              />
            )}
          </div>

          {/* Inline keyframe for progress bar */}
          <style>{`
            @keyframes chord-progress {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      </Transition>
    </div>
  );
};
