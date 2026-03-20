import React from 'react';
import {
  ConfidenceBadge,
  PromptComposer,
  Text,
} from '@mfe/design-system';
import {
  LibraryMetricCard,
} from '../../../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import type {
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type CitationLike = {
  locator?: unknown;
};

type PromptScope = 'general' | 'approval' | 'policy' | 'release';
type PromptTone = 'neutral' | 'strict' | 'exploratory';

type ConfidencePromptLivePreviewContext = {
  PreviewPanel: PreviewPanelComponent;
  citationPanelItems: CitationLike[];
  promptBody: string;
  promptScope: PromptScope;
  promptSubject: string;
  promptTone: PromptTone;
  setPromptBody: (nextValue: string) => void;
  setPromptScope: (nextValue: PromptScope) => void;
  setPromptSubject: (nextValue: string) => void;
  setPromptTone: (nextValue: PromptTone) => void;
  t: DesignLabTranslate;
};

export const buildConfidencePromptLivePreview = (
  componentName: string,
  context: ConfidencePromptLivePreviewContext,
): React.ReactNode | null => {
  const {
    PreviewPanel,
    citationPanelItems,
    promptBody,
    promptScope,
    promptSubject,
    promptTone,
    setPromptBody,
    setPromptScope,
    setPromptSubject,
    setPromptTone,
    t,
  } = context;

  const promptScopeLabels: Record<PromptScope, string> = {
    general: t('designlab.state.promptScope.general'),
    approval: t('designlab.state.promptScope.approval'),
    policy: t('designlab.state.promptScope.policy'),
    release: t('designlab.state.promptScope.release'),
  };
  const promptToneLabels: Record<PromptTone, string> = {
    neutral: t('designlab.state.promptTone.neutral'),
    strict: t('designlab.state.promptTone.strict'),
    exploratory: t('designlab.state.promptTone.exploratory'),
  };
  const citationLocators = citationPanelItems.map((item) => String(item.locator ?? '—'));

  switch (componentName) {
    case 'ConfidenceBadge':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewPanel title={t('designlab.showcase.component.confidenceBadge.live.matrix.panel')}>
              <div className="flex flex-wrap gap-3">
                <ConfidenceBadge level="low" score={41} sourceCount={1} />
                <ConfidenceBadge level="medium" score={68} sourceCount={3} />
                <ConfidenceBadge level="high" score={84} sourceCount={5} />
                <ConfidenceBadge level="very-high" score={96} sourceCount={8} />
              </div>
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.confidenceBadge.live.compact.panel')}>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  <ConfidenceBadge level="high" score={87} compact />
                  <ConfidenceBadge
                    level="medium"
                    label={t('designlab.showcase.component.confidenceBadge.live.compact.manualReviewLabel')}
                    compact
                    showScore={false}
                  />
                  <ConfidenceBadge level="low" score={29} access="readonly" />
                </div>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.confidenceBadge.live.compact.note')}
                </Text>
              </div>
            </PreviewPanel>
          </div>
        </div>
      );
    case 'PromptComposer':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <PreviewPanel title={t('designlab.showcase.component.promptComposer.live.controlled.panel')}>
              <PromptComposer
                subject={promptSubject}
                onSubjectChange={setPromptSubject}
                value={promptBody}
                onValueChange={setPromptBody}
                scope={promptScope}
                onScopeChange={setPromptScope}
                tone={promptTone}
                onToneChange={setPromptTone}
                guardrails={['pii-safe', 'approval-bound', 'source-required']}
                citations={citationLocators}
                footerNote={t('designlab.showcase.component.promptComposer.live.controlled.footerNote')}
              />
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.promptComposer.live.summary.panel')}>
              <div className="grid grid-cols-1 gap-3">
                <LibraryMetricCard
                  label={t('designlab.showcase.component.promptComposer.live.summary.subject.label')}
                  value={promptSubject}
                  note={t('designlab.showcase.component.promptComposer.live.summary.subject.note')}
                />
                <LibraryMetricCard
                  label={t('designlab.showcase.component.promptComposer.live.summary.scope.label')}
                  value={promptScopeLabels[promptScope]}
                  note={t('designlab.showcase.component.promptComposer.live.summary.scope.note')}
                />
                <LibraryMetricCard
                  label={t('designlab.showcase.component.promptComposer.live.summary.tone.label')}
                  value={promptToneLabels[promptTone]}
                  note={t('designlab.showcase.component.promptComposer.live.summary.tone.note')}
                />
              </div>
            </PreviewPanel>
          </div>
        </div>
      );
    default:
      return null;
  }
};
