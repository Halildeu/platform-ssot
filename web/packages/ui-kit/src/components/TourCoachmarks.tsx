import React, { useEffect, useId, useMemo, useState } from 'react';
import { Button } from './Button';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../runtime/access-controller';

export type TourCoachmarkStep = {
  id: string;
  title: React.ReactNode;
  description: React.ReactNode;
  meta?: React.ReactNode;
  tone?: 'info' | 'success' | 'warning';
};

export interface TourCoachmarksProps extends AccessControlledProps {
  steps: TourCoachmarkStep[];
  title?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  currentStep?: number;
  defaultStep?: number;
  onStepChange?: (index: number) => void;
  onClose?: () => void;
  onFinish?: () => void;
  allowSkip?: boolean;
  showProgress?: boolean;
  mode?: 'guided' | 'readonly';
  className?: string;
  testIdPrefix?: string;
}

const clampIndex = (value: number, max: number) => {
  if (max < 0) return 0;
  return Math.min(Math.max(value, 0), max);
};

export const TourCoachmarks: React.FC<TourCoachmarksProps> = ({
  steps,
  title = 'Akis turu',
  open,
  defaultOpen = false,
  currentStep,
  defaultStep = 0,
  onStepChange,
  onClose,
  onFinish,
  allowSkip = true,
  showProgress = true,
  mode = 'guided',
  className = '',
  access = 'full',
  accessReason,
  testIdPrefix,
}) => {
  const accessState = resolveAccessState(access);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [uncontrolledStep, setUncontrolledStep] = useState(defaultStep);
  const titleId = useId();
  const panelId = useId();
  const resolvedOpen = open ?? uncontrolledOpen;
  const maxStep = steps.length - 1;
  const resolvedStep = clampIndex(currentStep ?? uncontrolledStep, maxStep);
  const step = steps[resolvedStep];
  const isReadonly = mode === 'readonly' || accessState.isReadonly;

  const setOpen = (next: boolean) => {
    if (open === undefined) {
      setUncontrolledOpen(next);
    }
    if (!next) {
      onClose?.();
    }
  };

  const setStep = (next: number) => {
    const clamped = clampIndex(next, maxStep);
    if (currentStep === undefined) {
      setUncontrolledStep(clamped);
    }
    onStepChange?.(clamped);
  };

  useEffect(() => {
    if (!resolvedOpen) return undefined;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [resolvedOpen]);

  const toneClasses = useMemo(() => ({
    info: 'bg-accent-soft text-text-primary',
    success: 'bg-state-success/15 text-text-primary',
    warning: 'bg-state-warning/15 text-text-primary',
  }), []);

  if (accessState.isHidden || !step) {
    return null;
  }

  return (
    <div
      className={`relative ${className}`.trim()}
      data-access-state={accessState.state}
      data-testid={testIdPrefix ? `${testIdPrefix}-root` : undefined}
    >
      {resolvedOpen ? (
        <div
          className="relative overflow-hidden rounded-[2rem] border border-border-subtle bg-surface-panel shadow-2xl"
          style={{ boxShadow: 'var(--elevation-overlay)' }}
          data-testid={testIdPrefix ? `${testIdPrefix}-panel` : undefined}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)]" />
          <div className="space-y-6 p-6 pt-7" role="dialog" aria-modal="false" aria-labelledby={titleId} aria-describedby={panelId} title={accessReason}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">{title}</div>
                <div id={titleId} className="text-xl font-semibold text-text-primary">{step.title}</div>
              </div>
              {showProgress ? (
                <div className="rounded-full border border-border-subtle px-3 py-1 text-xs font-semibold text-text-secondary">
                  {resolvedStep + 1} / {steps.length}
                </div>
              ) : null}
            </div>
            <div id={panelId} className="space-y-4">
              <div className="text-sm leading-7 text-text-secondary">{step.description}</div>
              {step.meta ? (
                <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[step.tone ?? 'info']}`}>
                  {step.meta}
                </div>
              ) : null}
              <div className="grid grid-cols-[repeat(auto-fit,minmax(4rem,1fr))] gap-2">
                {steps.map((candidate, index) => {
                  const active = index === resolvedStep;
                  return (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => setStep(index)}
                      data-testid={testIdPrefix ? `${testIdPrefix}-step-${candidate.id}` : undefined}
                      className={`rounded-2xl border px-3 py-2 text-left text-xs font-semibold transition ${
                        active
                          ? 'border-[var(--accent-primary)] bg-accent-soft text-text-primary'
                          : 'border-border-subtle bg-surface-muted text-text-secondary hover:bg-surface-panel'
                      } ${isReadonly ? 'pointer-events-none' : ''}`}
                      aria-current={active ? 'step' : undefined}
                    >
                      {index + 1}. {candidate.id}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {allowSkip ? (
                  <Button
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    data-testid={testIdPrefix ? `${testIdPrefix}-skip` : undefined}
                  >
                    {isReadonly ? 'Kapat' : 'Skip'}
                  </Button>
                ) : null}
                <Button
                  variant="secondary"
                  onClick={() => setStep(resolvedStep - 1)}
                  disabled={resolvedStep === 0}
                  data-testid={testIdPrefix ? `${testIdPrefix}-previous` : undefined}
                >
                  Geri
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {resolvedStep < maxStep ? (
                  <Button
                    onClick={() => setStep(resolvedStep + 1)}
                    data-testid={testIdPrefix ? `${testIdPrefix}-next` : undefined}
                  >
                    Sonraki adım
                  </Button>
                ) : (
                  <Button
                    variant={isReadonly ? 'secondary' : 'primary'}
                    onClick={() => {
                      onFinish?.();
                      setOpen(false);
                    }}
                    data-testid={testIdPrefix ? `${testIdPrefix}-finish` : undefined}
                  >
                    {isReadonly ? 'Tur tamamlandı' : 'Tamamla'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TourCoachmarks;
