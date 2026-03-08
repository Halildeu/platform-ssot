import React from 'react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Text } from './Text';
import { TextArea } from './TextArea';
import { TextInput } from './TextInput';
import { resolveAccessState, type AccessControlledProps } from '../runtime/access-controller';

export type PromptComposerScope = 'general' | 'approval' | 'policy' | 'release';
export type PromptComposerTone = 'neutral' | 'strict' | 'exploratory';

export interface PromptComposerProps extends AccessControlledProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  subject?: string;
  defaultSubject?: string;
  onSubjectChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  scope?: PromptComposerScope;
  defaultScope?: PromptComposerScope;
  onScopeChange?: (value: PromptComposerScope) => void;
  tone?: PromptComposerTone;
  defaultTone?: PromptComposerTone;
  onToneChange?: (value: PromptComposerTone) => void;
  maxLength?: number;
  guardrails?: string[];
  citations?: string[];
  footerNote?: React.ReactNode;
  className?: string;
}

const scopeOptions: PromptComposerScope[] = ['general', 'approval', 'policy', 'release'];
const toneOptions: PromptComposerTone[] = ['neutral', 'strict', 'exploratory'];

export const PromptComposer: React.FC<PromptComposerProps> = ({
  title = 'Prompt composer',
  description = 'Scope-safe prompt yazimi, tone guardrail ve source referanslari ayni composer yuzeyinde birlesir.',
  subject,
  defaultSubject = '',
  onSubjectChange,
  value,
  defaultValue = '',
  onValueChange,
  scope,
  defaultScope = 'general',
  onScopeChange,
  tone,
  defaultTone = 'neutral',
  onToneChange,
  maxLength = 1200,
  guardrails = [],
  citations = [],
  footerNote,
  className = '',
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  const [internalSubject, setInternalSubject] = React.useState(defaultSubject);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [internalScope, setInternalScope] = React.useState<PromptComposerScope>(defaultScope);
  const [internalTone, setInternalTone] = React.useState<PromptComposerTone>(defaultTone);

  const currentSubject = subject ?? internalSubject;
  const currentValue = value ?? internalValue;
  const currentScope = scope ?? internalScope;
  const currentTone = tone ?? internalTone;
  const blocked = accessState.isDisabled || accessState.isReadonly;

  if (accessState.isHidden) {
    return null;
  }

  const updateSubject = (next: string) => {
    if (accessState.isReadonly) return;
    if (subject === undefined) setInternalSubject(next);
    onSubjectChange?.(next);
  };

  const updateValue = (next: string) => {
    if (accessState.isReadonly) return;
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const updateScope = (next: PromptComposerScope) => {
    if (blocked) return;
    if (scope === undefined) setInternalScope(next);
    onScopeChange?.(next);
  };

  const updateTone = (next: PromptComposerTone) => {
    if (blocked) return;
    if (tone === undefined) setInternalTone(next);
    onToneChange?.(next);
  };

  return (
    <section
      className={`rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm ${className}`.trim()}
      data-access-state={accessState.state}
      data-component="prompt-composer"
      title={accessReason}
    >
      <div className="space-y-2">
        <Text as="div" className="text-base font-semibold text-text-primary">
          {title}
        </Text>
        <Text variant="secondary" className="block text-sm leading-6">
          {description}
        </Text>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <TextInput
            label="Prompt title"
            description="Prompt amacini tek satirda netlestir."
            value={currentSubject}
            onValueChange={updateSubject}
            access={accessState.isReadonly ? 'readonly' : access}
          />
          <TextArea
            label="Prompt body"
            description="AI yardimcisina verilecek ana gorev tanimini yaz."
            value={currentValue}
            onValueChange={updateValue}
            maxLength={maxLength}
            showCount
            rows={6}
            access={accessState.isReadonly ? 'readonly' : access}
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <Text preset="caption">Scope</Text>
              <div className="flex flex-wrap gap-2">
                {scopeOptions.map((option) => (
                  <Button
                    key={option}
                    variant={currentScope === option ? 'primary' : 'secondary'}
                    size="sm"
                    fullWidth={false}
                    onClick={() => updateScope(option)}
                    access={accessState.isReadonly ? 'readonly' : access}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Text preset="caption">Tone</Text>
              <div className="flex flex-wrap gap-2">
                {toneOptions.map((option) => (
                  <Button
                    key={option}
                    variant={currentTone === option ? 'primary' : 'secondary'}
                    size="sm"
                    fullWidth={false}
                    onClick={() => updateTone(option)}
                    access={accessState.isReadonly ? 'readonly' : access}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-border-subtle bg-surface-canvas p-4">
            <Text preset="caption">Current contract</Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="info">scope: {currentScope}</Badge>
              <Badge tone="muted">tone: {currentTone}</Badge>
              <Badge tone="success">chars: {currentValue.length}</Badge>
            </div>
          </div>

          {guardrails.length > 0 ? (
            <div className="rounded-[24px] border border-border-subtle bg-surface-canvas p-4">
              <Text preset="caption">Guardrails</Text>
              <div className="mt-3 flex flex-wrap gap-2">
                {guardrails.map((item) => (
                  <Badge key={item} tone="warning">{item}</Badge>
                ))}
              </div>
            </div>
          ) : null}

          {citations.length > 0 ? (
            <div className="rounded-[24px] border border-border-subtle bg-surface-canvas p-4">
              <Text preset="caption">Source anchors</Text>
              <div className="mt-3 flex flex-wrap gap-2">
                {citations.map((item) => (
                  <Badge key={item} tone="default">{item}</Badge>
                ))}
              </div>
            </div>
          ) : null}

          {footerNote ? <Text variant="secondary">{footerNote}</Text> : null}
        </div>
      </div>
    </section>
  );
};

export default PromptComposer;
