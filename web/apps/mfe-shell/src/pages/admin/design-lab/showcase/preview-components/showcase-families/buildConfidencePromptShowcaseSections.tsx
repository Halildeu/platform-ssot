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
  ComponentShowcaseSection,
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type CitationLike = {
  locator?: unknown;
};

type PromptScope = 'general' | 'approval' | 'policy' | 'release';
type PromptTone = 'neutral' | 'strict' | 'exploratory';

type ConfidencePromptShowcaseContext = {
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

export const buildConfidencePromptShowcaseSections = (
  componentName: string,
  context: ConfidencePromptShowcaseContext,
): ComponentShowcaseSection[] | null => {
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
      return [
        {
          id: 'confidence-badge-matrix',
          eyebrow: t('designlab.showcase.component.confidenceBadge.sections.matrix.eyebrow'),
          title: t('designlab.showcase.component.confidenceBadge.sections.matrix.title'),
          description: t('designlab.showcase.component.confidenceBadge.sections.matrix.description'),
          badges: [
            t('designlab.showcase.component.confidenceBadge.sections.matrix.badge.matrix'),
            t('designlab.showcase.component.confidenceBadge.sections.matrix.badge.explainability'),
            t('designlab.showcase.component.confidenceBadge.sections.matrix.badge.score'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.confidenceBadge.sections.matrix.panelAllLevels')}>
                <div className="flex flex-wrap gap-3">
                  <ConfidenceBadge level="low" score={35} sourceCount={1} />
                  <ConfidenceBadge level="medium" score={62} sourceCount={3} />
                  <ConfidenceBadge level="high" score={84} sourceCount={5} />
                  <ConfidenceBadge level="very-high" score={97} sourceCount={9} />
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.confidenceBadge.sections.matrix.panelGuidance')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.confidenceBadge.sections.matrix.guidance')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'confidence-badge-compact',
          eyebrow: t('designlab.showcase.component.confidenceBadge.sections.compact.eyebrow'),
          title: t('designlab.showcase.component.confidenceBadge.sections.compact.title'),
          description: t('designlab.showcase.component.confidenceBadge.sections.compact.description'),
          badges: [
            t('designlab.showcase.component.confidenceBadge.sections.compact.badge.compact'),
            t('designlab.showcase.component.confidenceBadge.sections.compact.badge.inline'),
            t('designlab.showcase.component.confidenceBadge.sections.compact.badge.denseUi'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.confidenceBadge.sections.compact.panelBadges')}>
                <div className="flex flex-wrap gap-3">
                  <ConfidenceBadge level="high" score={86} compact />
                  <ConfidenceBadge
                    level="medium"
                    label={t('designlab.showcase.component.confidenceBadge.sections.compact.manualReviewLabel')}
                    compact
                    showScore={false}
                  />
                  <ConfidenceBadge level="low" score={28} compact />
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.confidenceBadge.sections.compact.panelEmbedding')}>
                <div className="flex flex-wrap items-center gap-3">
                  <Text preset="title">{t('designlab.showcase.component.confidenceBadge.sections.compact.embeddingTitle')}</Text>
                  <ConfidenceBadge level="high" score={89} compact />
                </div>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'confidence-badge-governed-states',
          eyebrow: t('designlab.showcase.component.confidenceBadge.sections.governed.eyebrow'),
          title: t('designlab.showcase.component.confidenceBadge.sections.governed.title'),
          description: t('designlab.showcase.component.confidenceBadge.sections.governed.description'),
          badges: [
            t('designlab.showcase.component.confidenceBadge.sections.governed.badge.readonly'),
            t('designlab.showcase.component.confidenceBadge.sections.governed.badge.transparency'),
            t('designlab.showcase.component.confidenceBadge.sections.governed.badge.governed'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title={t('designlab.showcase.component.confidenceBadge.sections.governed.panelReadonly')}>
                <ConfidenceBadge level="medium" score={70} sourceCount={2} access="readonly" />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.confidenceBadge.sections.governed.panelNoScore')}>
                <ConfidenceBadge level="high" showScore={false} sourceCount={4} />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.confidenceBadge.sections.governed.panelCustomLabel')}>
                <ConfidenceBadge level="low" label={t('designlab.showcase.component.confidenceBadge.sections.governed.customLabel')} compact />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'PromptComposer':
      return [
        {
          id: 'prompt-composer-controlled',
          eyebrow: t('designlab.showcase.component.promptComposer.sections.controlled.eyebrow'),
          title: t('designlab.showcase.component.promptComposer.sections.controlled.title'),
          description: t('designlab.showcase.component.promptComposer.sections.controlled.description'),
          badges: [
            t('designlab.showcase.component.promptComposer.sections.controlled.badge.prompt'),
            t('designlab.showcase.component.promptComposer.sections.controlled.badge.controlled'),
            t('designlab.showcase.component.promptComposer.sections.controlled.badge.guardrails'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <PreviewPanel title={t('designlab.showcase.component.promptComposer.sections.controlled.panelComposer')}>
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
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.promptComposer.sections.controlled.panelState')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.promptComposer.sections.controlled.state.label')}
                  value={promptScopeLabels[promptScope]}
                  note={t('designlab.showcase.component.promptComposer.sections.controlled.state.note', {
                    tone: promptToneLabels[promptTone],
                  })}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'prompt-composer-readonly',
          eyebrow: t('designlab.showcase.component.promptComposer.sections.readonly.eyebrow'),
          title: t('designlab.showcase.component.promptComposer.sections.readonly.title'),
          description: t('designlab.showcase.component.promptComposer.sections.readonly.description'),
          badges: [
            t('designlab.showcase.component.promptComposer.sections.readonly.badge.readonly'),
            t('designlab.showcase.component.promptComposer.sections.readonly.badge.review'),
            t('designlab.showcase.component.promptComposer.sections.readonly.badge.prompt'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.promptComposer.sections.readonly.panelReadonly')}>
                <PromptComposer
                  subject={promptSubject}
                  value={promptBody}
                  scope={promptScope}
                  tone={promptTone}
                  access="readonly"
                  guardrails={['pii-safe', 'approval-bound', 'source-required']}
                  citations={citationLocators}
                  footerNote={t('designlab.showcase.component.promptComposer.sections.readonly.footerNote')}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.promptComposer.sections.readonly.panelContract')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.promptComposer.sections.readonly.contractNote')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    default:
      return null;
  }
};
