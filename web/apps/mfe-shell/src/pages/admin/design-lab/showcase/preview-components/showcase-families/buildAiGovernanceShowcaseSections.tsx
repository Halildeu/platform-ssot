import React from 'react';
import {
  AIActionAuditTimeline,
  ApprovalCheckpoint,
  CitationPanel,
  ConfidenceBadge,
  Descriptions,
  RecommendationCard,
  SummaryStrip,
  Tag,
  Text,
} from '@mfe/design-system';
import { LibraryMetricCard } from '../../../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import type {
  ApprovalCheckpointItem,
  AIActionAuditTimelineItem,
  CitationPanelItem,
} from '@mfe/design-system';
import type {
  ComponentShowcaseSection,
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type AiGovernanceShowcaseContext = {
  PreviewPanel: PreviewPanelComponent;
  t: DesignLabTranslate;
  approvalCheckpointState: 'pending' | 'approved' | 'rejected';
  approvalCheckpointSteps: ApprovalCheckpointItem[];
  auditTimelineItems: AIActionAuditTimelineItem[];
  citationPanelItems: CitationPanelItem[];
  descriptionsLocaleText: Record<string, unknown>;
  recommendationDecision: 'pending' | 'applied' | 'review';
  recommendationDecisionLabels: Record<'pending' | 'applied' | 'review', string>;
  selectedAuditId: string | null;
  selectedCitationId: string | null;
  setApprovalCheckpointState: (nextValue: 'pending' | 'approved' | 'rejected') => void;
  setRecommendationDecision: (nextValue: 'pending' | 'applied' | 'review') => void;
  setSelectedAuditId: (nextValue: string | null) => void;
  setSelectedCitationId: (nextValue: string | null) => void;
};

export const buildAiGovernanceShowcaseSections = (
  componentName: string,
  context: AiGovernanceShowcaseContext,
): ComponentShowcaseSection[] | null => {
  const {
    PreviewPanel,
    t,
    approvalCheckpointState,
    approvalCheckpointSteps,
    auditTimelineItems,
    citationPanelItems,
    descriptionsLocaleText,
    recommendationDecision,
    recommendationDecisionLabels,
    selectedAuditId,
    selectedCitationId,
    setApprovalCheckpointState,
    setRecommendationDecision,
    setSelectedAuditId,
    setSelectedCitationId,
  } = context;

  switch (componentName) {
    case 'RecommendationCard':
      return [
        {
          id: 'recommendation-card-rollout',
          eyebrow: t('designlab.showcase.component.recommendationCard.sections.rollout.eyebrow'),
          title: t('designlab.showcase.component.recommendationCard.sections.rollout.title'),
          description: t('designlab.showcase.component.recommendationCard.sections.rollout.description'),
          badges: [
            t('designlab.showcase.component.recommendationCard.sections.rollout.badge.ai'),
            t('designlab.showcase.component.recommendationCard.sections.rollout.badge.rollout'),
            t('designlab.showcase.component.recommendationCard.sections.rollout.badge.confidence'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title={t('designlab.showcase.component.recommendationCard.sections.rollout.panelInteractive')}>
                <RecommendationCard
                  title={t('designlab.showcase.component.recommendationCard.sections.rollout.card.title')}
                  summary={t('designlab.showcase.component.recommendationCard.sections.rollout.card.summary')}
                  recommendationType={t('designlab.showcase.component.recommendationCard.sections.rollout.card.type')}
                  rationale={[
                    t('designlab.showcase.component.recommendationCard.sections.rollout.card.rationale.waveGate'),
                    t('designlab.showcase.component.recommendationCard.sections.rollout.card.rationale.doctor'),
                    t('designlab.showcase.component.recommendationCard.sections.rollout.card.rationale.security'),
                  ]}
                  citations={['wave_3_forms', 'doctor:frontend', 'security-remediation']}
                  confidenceLevel="high"
                  confidenceScore={91}
                  sourceCount={5}
                  tone={recommendationDecision === 'applied' ? 'success' : recommendationDecision === 'review' ? 'warning' : 'info'}
                  onPrimaryAction={() => setRecommendationDecision('applied')}
                  onSecondaryAction={() => setRecommendationDecision('review')}
                  footerNote={t('designlab.showcase.component.recommendationCard.sections.rollout.card.footerNote', {
                    state: recommendationDecision,
                  })}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.recommendationCard.sections.rollout.panelSummary')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.recommendationCard.sections.rollout.summary.label')}
                  value={recommendationDecision}
                  note={t('designlab.showcase.component.recommendationCard.sections.rollout.summary.note')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'recommendation-card-readonly',
          eyebrow: t('designlab.showcase.component.recommendationCard.sections.readonly.eyebrow'),
          title: t('designlab.showcase.component.recommendationCard.sections.readonly.title'),
          description: t('designlab.showcase.component.recommendationCard.sections.readonly.description'),
          badges: [
            t('designlab.showcase.component.recommendationCard.sections.readonly.badge.readonly'),
            t('designlab.showcase.component.recommendationCard.sections.readonly.badge.governance'),
            t('designlab.showcase.component.recommendationCard.sections.readonly.badge.advisory'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.recommendationCard.sections.readonly.panelCard')}>
                <RecommendationCard
                  title={t('designlab.showcase.component.recommendationCard.sections.readonly.card.title')}
                  summary={t('designlab.showcase.component.recommendationCard.sections.readonly.card.summary')}
                  recommendationType={t('designlab.showcase.component.recommendationCard.sections.readonly.card.type')}
                  rationale={[
                    t('designlab.showcase.component.recommendationCard.sections.readonly.card.rationale.policy'),
                    t('designlab.showcase.component.recommendationCard.sections.readonly.card.rationale.humanCheckpoint'),
                  ]}
                  citations={['approval_checkpoint', 'policy_work_intake']}
                  confidenceLevel="medium"
                  confidenceScore={74}
                  access="readonly"
                  compact
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.recommendationCard.sections.readonly.panelReasoning')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.recommendationCard.sections.readonly.reasoning')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'recommendation-card-compact-queue',
          eyebrow: t('designlab.showcase.component.recommendationCard.sections.queue.eyebrow'),
          title: t('designlab.showcase.component.recommendationCard.sections.queue.title'),
          description: t('designlab.showcase.component.recommendationCard.sections.queue.description'),
          badges: [
            t('designlab.showcase.component.recommendationCard.sections.queue.badge.compact'),
            t('designlab.showcase.component.recommendationCard.sections.queue.badge.queue'),
            t('designlab.showcase.component.recommendationCard.sections.queue.badge.triage'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              {['security', 'release', 'ux'].map((scope, index) => (
                <RecommendationCard
                  key={scope}
                  title={t(`designlab.showcase.component.recommendationCard.sections.queue.items.${scope}.title`)}
                  summary={t('designlab.showcase.component.recommendationCard.sections.queue.itemSummary')}
                  recommendationType={t('designlab.showcase.component.recommendationCard.sections.queue.itemType')}
                  confidenceLevel={index === 0 ? 'high' : index === 1 ? 'medium' : 'low'}
                  confidenceScore={index === 0 ? 88 : index === 1 ? 67 : 41}
                  compact
                  badges={[<Tag key={scope} variant="default">{t(`designlab.showcase.component.recommendationCard.sections.queue.items.${scope}.badge`)}</Tag>]}
                />
              ))}
            </div>
          ),
        },
        {
          id: 'recommendation-card-governance-board',
          eyebrow: 'Governance board',
          title: 'Governance board recommendation',
          description: 'AI tavsiyesi, approval ve SEO/GEO readiness baglamini daha karar odakli tek kartta toplar.',
          badges: ['governance', 'decision', 'seo-geo'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Karar karti">
                <RecommendationCard
                  title="SEO/GEO readiness rollout"
                  summary="Summary strip, metadata ve breadcrumb contract ayni release paketi altinda hizalansin."
                  recommendationType="Governance decision"
                  rationale={[
                    'Public surface metadata eksikleri ayni karar kapisinda toplanir.',
                    'AI answer engine discoverability sinyalleri standardize edilir.',
                    'Release ve docs handoff tek evidence paketiyle baglanir.',
                  ]}
                  citations={['seo:meta-surface', 'geo:summary-signal', 'nav:breadcrumbs']}
                  confidenceLevel="high"
                  confidenceScore={89}
                  sourceCount={6}
                  tone={recommendationDecision === 'applied' ? 'success' : 'warning'}
                  onPrimaryAction={() => setRecommendationDecision('applied')}
                  onSecondaryAction={() => setRecommendationDecision('review')}
                  footerNote={`Karar durumu: ${recommendationDecisionLabels[recommendationDecision]}`}
                  badges={[
                    <Tag key="governance" variant="default">governance</Tag>,
                    <Tag key="release" variant="default">release</Tag>,
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Karar notu">
                <SummaryStrip
                  title="Decision context"
                  description="Karar kartini destekleyen hizli ozet."
                  columns={2}
                  items={[
                    { key: 'confidence', label: 'Confidence', value: '89', tone: 'success', note: 'Kaynaklar tutarli' },
                    { key: 'status', label: 'Decision', value: recommendationDecisionLabels[recommendationDecision], tone: 'warning', note: 'Insan review acik' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'recommendation-card-ops-signal-brief',
          eyebrow: 'Ops signal brief',
          title: 'Operasyonel signal brief',
          description: 'Kompakt ama daha karar odakli bir recommendation karti ile incident, owner ve sonraki adim sinyallerini toplar.',
          badges: ['ops', 'signal', 'brief'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Signal brief">
                <RecommendationCard
                  title="Runtime signal cleanup"
                  summary="Feedback ve notification surface’leri tek adoption sprint altinda hizalansin."
                  recommendationType="Ops signal"
                  rationale={[
                    'Daginik feedback surface’leri bakim maliyetini buyutuyor.',
                    'Access ve shell tarafinda ayni dil kullanildiginda karar hizi artiyor.',
                    'SEO/GEO evidence yuzeyleri daha tutarli bir feedback shell’i istiyor.',
                  ]}
                  citations={['feedback:alert', 'toast:provider', 'adoption:cleanup']}
                  confidenceLevel="medium"
                  confidenceScore={78}
                  sourceCount={4}
                  tone="info"
                  onPrimaryAction={() => setRecommendationDecision('review')}
                  onSecondaryAction={() => setRecommendationDecision('pending')}
                  footerNote="Ops ve UI konsolidasyonu icin orta seviye guven"
                  badges={[
                    <Tag key="ops" variant="default">ops</Tag>,
                    <Tag key="cleanup" variant="default">cleanup</Tag>,
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Signal context">
                <div className="flex flex-col gap-3">
                  <LibraryMetricCard
                    label="Decision"
                    value={recommendationDecisionLabels[recommendationDecision]}
                    note="Aktif review durumu"
                  />
                  <ConfidenceBadge level="medium" score={78} sourceCount={4} />
                </div>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'recommendation-card-readiness-brief',
          eyebrow: 'Readiness brief',
          title: 'Readiness recommendation brief',
          description: 'Adoption, docs ve release readiness eksenlerini daha sakin ve hizli taranan bir kart setiyle gosterir.',
          badges: ['readiness', 'brief', 'adoption'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <RecommendationCard
                title="Docs refresh"
                summary="Catalog ve examples guncellenip yeni component ailesi gorunur kilinsin."
                recommendationType="Adoption"
                confidenceLevel="high"
                confidenceScore={85}
                compact
                badges={[<Tag key="docs" variant="default">docs</Tag>]}
              />
              <RecommendationCard
                title="Responsive audit"
                summary="Not-audited aileler mobil davranis acisindan dogrulansin."
                recommendationType="Quality"
                confidenceLevel="medium"
                confidenceScore={69}
                compact
                badges={[<Tag key="responsive" variant="default">responsive</Tag>]}
              />
              <RecommendationCard
                title="SEO/GEO evidence"
                summary="Public yuzeylerde summary ve metadata evidence tamamlansin."
                recommendationType="Governance"
                confidenceLevel="high"
                confidenceScore={92}
                compact
                badges={[<Tag key="seo-geo" variant="default">seo-geo</Tag>]}
              />
            </div>
          ),
        },
        {
          id: 'recommendation-card-diff-brief',
          eyebrow: 'Diff brief',
          title: 'Source diff recommendation',
          description: 'Iki farkli kanit kaynagini karsilastirip karar icin ozet tavsiye ureteren daha review-odakli kart.',
          badges: ['diff', 'review', 'evidence'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Diff recommendation">
                <RecommendationCard
                  title="Source mismatch cleanup"
                  summary="Citation ve audit surface’leri arasindaki farklar tek review sprint altinda kapatilsin."
                  recommendationType="Source diff"
                  rationale={[
                    'Evidence dili iki farkli shell’de farkli tonlarla gorunuyor.',
                    'Audit ve citation handoff ayni karar metnini kullanmali.',
                    'Support ve governance lane’lerinde ayni signal seti gorulmeli.',
                  ]}
                  citations={['citation:diff', 'audit:handoff', 'support:lane']}
                  confidenceLevel="medium"
                  confidenceScore={73}
                  sourceCount={5}
                  tone="warning"
                  onPrimaryAction={() => setRecommendationDecision('review')}
                  onSecondaryAction={() => setRecommendationDecision('pending')}
                  footerNote="Delta review acildi"
                  badges={[<Tag key="delta" variant="default">delta</Tag>]}
                />
              </PreviewPanel>
              <PreviewPanel title="Delta note">
                <SummaryStrip
                  title="Diff context"
                  description="Karari etkileyen kaynak farklarinin ozet gorunumu."
                  columns={2}
                  items={[
                    { key: 'sources', label: 'Sources', value: '2 family', tone: 'info', note: 'Citation + audit' },
                    { key: 'priority', label: 'Priority', value: 'Medium', tone: 'warning', note: 'Review turu gerekli' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'ApprovalCheckpoint':
      return [
        {
          id: 'approval-checkpoint-interactive',
          eyebrow: t('designlab.showcase.component.approvalCheckpoint.sections.interactive.eyebrow'),
          title: t('designlab.showcase.component.approvalCheckpoint.sections.interactive.title'),
          description: t('designlab.showcase.component.approvalCheckpoint.sections.interactive.description'),
          badges: [
            t('designlab.showcase.component.approvalCheckpoint.sections.interactive.badge.approval'),
            t('designlab.showcase.component.approvalCheckpoint.sections.interactive.badge.governance'),
            t('designlab.showcase.component.approvalCheckpoint.sections.interactive.badge.humanInLoop'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title={t('designlab.showcase.component.approvalCheckpoint.sections.interactive.panelControlled')}>
                <ApprovalCheckpoint
                  title={t('designlab.showcase.component.approvalCheckpoint.sections.interactive.card.title')}
                  summary={t('designlab.showcase.component.approvalCheckpoint.sections.interactive.card.summary')}
                  status={approvalCheckpointState}
                  approverLabel={t('designlab.showcase.component.approvalCheckpoint.sections.interactive.card.approverLabel')}
                  dueLabel={t('designlab.showcase.component.approvalCheckpoint.sections.interactive.card.dueLabel')}
                  evidenceItems={['doctor:frontend', 'security-guardrails', 'release-canary']}
                  steps={approvalCheckpointSteps}
                  citations={citationPanelItems.map((item) => String(item.locator ?? '—'))}
                  onPrimaryAction={() => setApprovalCheckpointState('approved')}
                  onSecondaryAction={() => setApprovalCheckpointState('rejected')}
                  footerNote={t('designlab.showcase.component.approvalCheckpoint.sections.interactive.card.footerNote', {
                    state: approvalCheckpointState,
                  })}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.approvalCheckpoint.sections.interactive.panelSummary')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.approvalCheckpoint.sections.interactive.summary.label')}
                  value={approvalCheckpointState}
                  note={t('designlab.showcase.component.approvalCheckpoint.sections.interactive.summary.note')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'approval-checkpoint-readonly',
          eyebrow: t('designlab.showcase.component.approvalCheckpoint.sections.readonly.eyebrow'),
          title: t('designlab.showcase.component.approvalCheckpoint.sections.readonly.title'),
          description: t('designlab.showcase.component.approvalCheckpoint.sections.readonly.description'),
          badges: [
            t('designlab.showcase.component.approvalCheckpoint.sections.readonly.badge.readonly'),
            t('designlab.showcase.component.approvalCheckpoint.sections.readonly.badge.evidence'),
            t('designlab.showcase.component.approvalCheckpoint.sections.readonly.badge.decision'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.approvalCheckpoint.sections.readonly.panelReadonly')}>
                <ApprovalCheckpoint
                  title={t('designlab.showcase.component.approvalCheckpoint.sections.readonly.card.title')}
                  summary={t('designlab.showcase.component.approvalCheckpoint.sections.readonly.card.summary')}
                  status="approved"
                  approverLabel={t('designlab.showcase.component.approvalCheckpoint.sections.readonly.card.approverLabel')}
                  dueLabel={t('designlab.showcase.component.approvalCheckpoint.sections.readonly.card.dueLabel')}
                  access="readonly"
                  citations={['policy-work-intake', 'approval-review']}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.approvalCheckpoint.sections.readonly.panelNote')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.approvalCheckpoint.sections.readonly.note')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'approval-checkpoint-compact-board',
          eyebrow: 'Compact board',
          title: 'Compact approval board',
          description: 'Approval card daha kompakt ve triage-odakli kullanilir; ayni board içinde birden fazla checkpoint hizli okunur.',
          badges: ['compact', 'board', 'triage'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              {(['pending', 'approved', 'rejected'] as const).map((state) => (
                <ApprovalCheckpoint
                  key={state}
                  title={`${state} checkpoint`}
                  summary="Tek karar odagi"
                  status={state}
                  steps={approvalCheckpointSteps}
                />
              ))}
            </div>
          ),
        },
        {
          id: 'approval-checkpoint-escalation-queue',
          eyebrow: 'Escalation queue',
          title: 'Escalation checkpoint',
          description: 'İnsan devri gereken kararları daha escalation-odaklı tek checkpoint yüzeyinde toplar.',
          badges: ['escalation', 'human-gate', 'queue'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Escalation gate">
                <ApprovalCheckpoint
                  title="Human escalation"
                  summary="AI karari tek basina tamamlamaz; governance desk incelemesi gerekiyor."
                  status={approvalCheckpointState}
                  approverLabel="Governance desk"
                  dueLabel="Bu sprint"
                  evidenceItems={['waiver-pack', 'audit-lane', 'citation-bundle']}
                  citations={['waiver:pack', 'audit:lane', 'seo-geo:evidence']}
                  steps={approvalCheckpointSteps}
                  onPrimaryAction={() => setApprovalCheckpointState('approved')}
                  onSecondaryAction={() => setApprovalCheckpointState('rejected')}
                  footerNote="Escalation sonucu approval veya rejection ile kapanir"
                />
              </PreviewPanel>
              <PreviewPanel title="Lane context">
                <LibraryMetricCard
                  label="Checkpoint state"
                  value={approvalCheckpointState}
                  note="Escalation queue durumunu yansitir"
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'approval-checkpoint-readiness-gate',
          eyebrow: 'Readiness gate',
          title: 'Readiness approval gate',
          description: 'Go/no-go, docs readiness ve quality gate bilgisini tek approval shell’inde birleştirir.',
          badges: ['readiness', 'go-no-go', 'quality'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Go/no-go">
                <ApprovalCheckpoint
                  title="Release readiness"
                  summary="Design system, docs ve shell build ayni readiness kapisinda toparlanir."
                  status={approvalCheckpointState}
                  approverLabel="Release owner"
                  dueLabel="Go-live review"
                  evidenceItems={['storybook-green', 'docs-refresh', 'shell-build']}
                  citations={['storybook:build', 'docs:refresh', 'build:shell']}
                  steps={approvalCheckpointSteps}
                  onPrimaryAction={() => setApprovalCheckpointState('approved')}
                  onSecondaryAction={() => setApprovalCheckpointState('rejected')}
                  footerNote="Readiness gate sonucu deploy kararini etkiler"
                />
              </PreviewPanel>
              <PreviewPanel title="Readiness note">
                <SummaryStrip
                  title="Gate context"
                  description="Readiness kararini etkileyen ana sinyaller."
                  columns={2}
                  items={[
                    { key: 'quality', label: 'Quality', value: '3 green', tone: 'success', note: 'Storybook + tests + build' },
                    { key: 'state', label: 'Decision', value: approvalCheckpointState, tone: 'warning', note: 'Aktif gate durumu' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'approval-checkpoint-policy-exception',
          eyebrow: 'Policy exception',
          title: 'Policy exception gate',
          description: 'Istisna, waiver ve review gerektiren kararlar icin daha governance agirlikli bir checkpoint uretir.',
          badges: ['policy', 'exception', 'waiver'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Exception gate">
                <ApprovalCheckpoint
                  title="Policy exception"
                  summary="Varsayilan kontrat disina cikilan durumlarda waiver ve owner onayi gerekir."
                  status={approvalCheckpointState}
                  approverLabel="Policy board"
                  dueLabel="Exception review"
                  evidenceItems={['waiver', 'owner-signoff', 'risk-note']}
                  citations={['policy:waiver', 'owner:signoff', 'risk:note']}
                  steps={approvalCheckpointSteps}
                  onPrimaryAction={() => setApprovalCheckpointState('approved')}
                  onSecondaryAction={() => setApprovalCheckpointState('rejected')}
                  footerNote="Waiver tamamlanmadan release acilmaz"
                />
              </PreviewPanel>
              <PreviewPanel title="Exception summary">
                <Descriptions
                  title="Exception context"
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    { key: 'lane', label: 'Lane', value: 'Governance', tone: 'info' },
                    { key: 'risk', label: 'Risk', value: 'Medium', tone: 'warning' },
                    { key: 'state', label: 'State', value: approvalCheckpointState, tone: 'danger' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'approval-checkpoint-rollforward-rollback',
          eyebrow: 'Release decision',
          title: 'Rollforward / rollback checkpoint',
          description: 'Release akisi icin rollforward ve rollback kararini ayni gate shell’inde gosterir.',
          badges: ['release', 'rollback', 'gate'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Release gate">
                <ApprovalCheckpoint
                  title="Rollforward decision"
                  summary="Rollout devam etsin mi yoksa rollback penceresi mi acilsin sorusunu ayni checkpoint yuzeyinde toplar."
                  status={approvalCheckpointState}
                  approverLabel="Release commander"
                  dueLabel="Canli pencere"
                  evidenceItems={['smoke-green', 'rollback-plan', 'monitoring-watch']}
                  citations={['release:smoke', 'ops:rollback', 'monitoring:watch']}
                  steps={approvalCheckpointSteps}
                  onPrimaryAction={() => setApprovalCheckpointState('approved')}
                  onSecondaryAction={() => setApprovalCheckpointState('rejected')}
                  footerNote="Approved = rollforward, Rejected = rollback"
                />
              </PreviewPanel>
              <PreviewPanel title="Decision summary">
                <Descriptions
                  title="Release options"
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    { key: 'forward', label: 'Rollforward', value: 'Deploy window devam eder', tone: 'success' },
                    { key: 'rollback', label: 'Rollback', value: 'Eski paket geri alinir', tone: 'warning' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'CitationPanel':
      return [
        {
          id: 'citation-panel-source-transparency',
          eyebrow: t('designlab.showcase.component.citationPanel.sections.sourceTransparency.eyebrow'),
          title: t('designlab.showcase.component.citationPanel.sections.sourceTransparency.title'),
          description: t('designlab.showcase.component.citationPanel.sections.sourceTransparency.description'),
          badges: [
            t('designlab.showcase.component.citationPanel.sections.sourceTransparency.badge.sources'),
            t('designlab.showcase.component.citationPanel.sections.sourceTransparency.badge.transparency'),
            t('designlab.showcase.component.citationPanel.sections.sourceTransparency.badge.citations'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title={t('designlab.showcase.component.citationPanel.sections.sourceTransparency.panelSelectable')}>
                <CitationPanel
                  items={citationPanelItems}
                  activeCitationId={selectedCitationId}
                  onOpenCitation={(id) => setSelectedCitationId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.citationPanel.sections.sourceTransparency.panelSelected')}>
                <Descriptions
                  title={t('designlab.showcase.component.citationPanel.sections.sourceTransparency.contextTitle')}
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    {
                      key: 'active',
                      label: t('designlab.showcase.component.citationPanel.sections.sourceTransparency.context.labelActive'),
                      value: selectedCitationId ?? '—',
                      tone: 'info',
                    },
                    {
                      key: 'source',
                      label: t('designlab.showcase.component.citationPanel.sections.sourceTransparency.context.labelSource'),
                      value: citationPanelItems.find((item) => item.id === selectedCitationId)?.source ?? '—',
                      tone: 'success',
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'citation-panel-readonly',
          eyebrow: t('designlab.showcase.component.citationPanel.sections.readonly.eyebrow'),
          title: t('designlab.showcase.component.citationPanel.sections.readonly.title'),
          description: t('designlab.showcase.component.citationPanel.sections.readonly.description'),
          badges: [
            t('designlab.showcase.component.citationPanel.sections.readonly.badge.readonly'),
            t('designlab.showcase.component.citationPanel.sections.readonly.badge.reference'),
            t('designlab.showcase.component.citationPanel.sections.readonly.badge.governed'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.citationPanel.sections.readonly.panelReadonly')}>
                <CitationPanel items={citationPanelItems} access="readonly" activeCitationId="policy-4-2" />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.citationPanel.sections.readonly.panelUsage')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.citationPanel.sections.readonly.usageNote')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'citation-panel-audit-handoff',
          eyebrow: 'Review handoff',
          title: 'Audit handoff citations',
          description: 'Secili alinti ile denetim notunu yan yana okuyup review toplantisina tek panelden hazirlik saglar.',
          badges: ['audit', 'handoff', 'source-evidence'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Kanit paneli">
                <CitationPanel
                  items={citationPanelItems}
                  activeCitationId={selectedCitationId}
                  onOpenCitation={(id) => setSelectedCitationId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title="Secili kanit ozeti">
                <Descriptions
                  title="Review context"
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    {
                      key: 'citation',
                      label: 'Aktif citation',
                      value: selectedCitationId ?? 'policy-4-2',
                      tone: 'info',
                    },
                    {
                      key: 'intent',
                      label: 'Review amaci',
                      value: 'Karar notunu kaynak ile sabitle',
                      tone: 'warning',
                    },
                    {
                      key: 'handoff',
                      label: 'Sonraki adim',
                      value: 'Approval review paneline aktar',
                      tone: 'success',
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'citation-panel-compact-evidence-stack',
          eyebrow: 'Evidence stack',
          title: 'Compact evidence stack',
          description: 'Daha yogun ama secilebilir bir source stack modeliyle approval ve audit ekranlarinda alan kazandirir.',
          badges: ['compact', 'evidence', 'stack'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Evidence stack">
                <CitationPanel
                  items={citationPanelItems}
                  activeCitationId={selectedCitationId}
                  onOpenCitation={(id) => setSelectedCitationId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title="Evidence note">
                <Text variant="secondary" className="block leading-7">
                  Compact evidence stack, source transparency gereksinimini korurken sidebar veya drawer icinde daha verimli alan kullanir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'citation-panel-source-diff-review',
          eyebrow: 'Source diff review',
          title: 'Source diff review panel',
          description: 'Iki farkli kaynak ailesini karsilastirmaya yardim eden daha review odakli citation akisi sunar.',
          badges: ['diff', 'review', 'sources'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Citation review">
                <CitationPanel
                  items={citationPanelItems}
                  activeCitationId={selectedCitationId}
                  onOpenCitation={(id) => setSelectedCitationId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title="Diff context">
                <SummaryStrip
                  title="Source delta"
                  description="Farkli kaynak ailelerinin karar metnini nasil etkiledigini hizlica ozetler."
                  columns={2}
                  items={[
                    { key: 'primary', label: 'Primary source', value: selectedCitationId ?? 'policy-4-2', tone: 'info', note: 'Aktif secili citation' },
                    { key: 'delta', label: 'Delta', value: '2 mismatch', tone: 'warning', note: 'Review gereken farklar' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'citation-panel-waiver-pack',
          eyebrow: 'Waiver pack',
          title: 'Waiver evidence pack',
          description: 'Istisna veya waiver kararlarinda kullanilan kaynaklari daha net bir paket diliyle gruplar.',
          badges: ['waiver', 'evidence-pack', 'governance'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Waiver citations">
                <CitationPanel
                  items={citationPanelItems}
                  activeCitationId={selectedCitationId}
                  onOpenCitation={(id) => setSelectedCitationId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title="Pack note">
                <Descriptions
                  title="Waiver bundle"
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    { key: 'bundle', label: 'Bundle', value: 'SEO/GEO waiver', tone: 'warning' },
                    { key: 'owner', label: 'Owner', value: 'Governance desk', tone: 'info' },
                    { key: 'state', label: 'State', value: 'Needs completion', tone: 'danger' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'citation-panel-inline-inspector',
          eyebrow: 'Inline inspector',
          title: 'Inline source inspector',
          description: 'Secili source ve kisa metadata ozetini ayni blokta gosteren daha sikisik bir inspection modeli.',
          badges: ['inspector', 'inline', 'source'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Inspector stack">
                <CitationPanel
                  items={citationPanelItems}
                  activeCitationId={selectedCitationId}
                  onOpenCitation={(id) => setSelectedCitationId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title="Inline metadata">
                <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                  <div className="flex flex-wrap gap-2">
                    <Tag variant="default">{`id:${selectedCitationId ?? 'policy-4-2'}`}</Tag>
                    <Tag variant="default">owner: governance</Tag>
                    <Tag variant="default">lane: review</Tag>
                  </div>
                  <Text variant="secondary" className="mt-3 block leading-7">
                    Secili source icin owner, lane ve review baglamini ayri panel yerine ayni inspector blokta gosterir.
                  </Text>
                </div>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'AIActionAuditTimeline':
      return [
        {
          id: 'audit-timeline-interactive',
          eyebrow: t('designlab.showcase.component.aiActionAuditTimeline.sections.interactive.eyebrow'),
          title: t('designlab.showcase.component.aiActionAuditTimeline.sections.interactive.title'),
          description: t('designlab.showcase.component.aiActionAuditTimeline.sections.interactive.description'),
          badges: [
            t('designlab.showcase.component.aiActionAuditTimeline.sections.interactive.badge.audit'),
            t('designlab.showcase.component.aiActionAuditTimeline.sections.interactive.badge.timeline'),
            t('designlab.showcase.component.aiActionAuditTimeline.sections.interactive.badge.observability'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title={t('designlab.showcase.component.aiActionAuditTimeline.sections.interactive.panelSelectable')}>
                <AIActionAuditTimeline
                  items={auditTimelineItems}
                  selectedId={selectedAuditId}
                  onSelectItem={(id) => setSelectedAuditId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.aiActionAuditTimeline.sections.interactive.panelSelected')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.aiActionAuditTimeline.sections.interactive.metric.label')}
                  value={selectedAuditId ?? '—'}
                  note={
                    auditTimelineItems.find((item: any) => item.id === selectedAuditId)?.title
                    ?? t('designlab.showcase.component.aiActionAuditTimeline.sections.interactive.metric.empty')
                  }
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'audit-timeline-readonly',
          eyebrow: t('designlab.showcase.component.aiActionAuditTimeline.sections.readonly.eyebrow'),
          title: t('designlab.showcase.component.aiActionAuditTimeline.sections.readonly.title'),
          description: t('designlab.showcase.component.aiActionAuditTimeline.sections.readonly.description'),
          badges: [
            t('designlab.showcase.component.aiActionAuditTimeline.sections.readonly.badge.readonly'),
            t('designlab.showcase.component.aiActionAuditTimeline.sections.readonly.badge.evidence'),
            t('designlab.showcase.component.aiActionAuditTimeline.sections.readonly.badge.history'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.aiActionAuditTimeline.sections.readonly.panelReadonly')}>
                <AIActionAuditTimeline items={auditTimelineItems} access="readonly" selectedId="audit-review" />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.aiActionAuditTimeline.sections.readonly.panelAuditNote')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.aiActionAuditTimeline.sections.readonly.auditNote')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'audit-timeline-handoff-board',
          eyebrow: 'Ops handoff',
          title: 'Action handoff timeline',
          description: 'AI, insan ve sistem aksiyonlarini ayni timeline ustunde toplayip operasyonel devir notu uretir.',
          badges: ['handoff', 'timeline', 'ops'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Handoff timeline">
                <AIActionAuditTimeline
                  items={auditTimelineItems}
                  selectedId={selectedAuditId}
                  onSelectItem={(id) => setSelectedAuditId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title="Secili aksiyon">
                <Descriptions
                  title="Action context"
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    {
                      key: 'selected',
                      label: 'Secili olay',
                      value: selectedAuditId ?? 'audit-review',
                      tone: 'info',
                    },
                    {
                      key: 'owner',
                      label: 'Devir sahibi',
                      value: 'Design ops',
                      tone: 'success',
                    },
                    {
                      key: 'goal',
                      label: 'Hedef',
                      value: 'Review ve release aksiyonlarini tek izde toplamak',
                      tone: 'warning',
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'audit-timeline-compliance-lane',
          eyebrow: 'Compliance lane',
          title: 'Compliance action lane',
          description: 'AI, insan ve sistem adimlarini compliance handoff perspektifiyle daha lane-benzeri bir timeline modelinde toplar.',
          badges: ['compliance', 'lane', 'history'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Compliance timeline">
                <AIActionAuditTimeline
                  items={auditTimelineItems}
                  selectedId={selectedAuditId}
                  onSelectItem={(id) => setSelectedAuditId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title="Lane summary">
                <SummaryStrip
                  title="Lane state"
                  description="Audit izinin compliance akisinda nasil okundugunu ozetler."
                  columns={2}
                  items={[
                    { key: 'selected', label: 'Selected', value: selectedAuditId ?? 'audit-review', tone: 'info', note: 'Aktif olay' },
                    { key: 'actor', label: 'Actors', value: 'AI + Human + System', tone: 'success', note: 'Coklu actor izi' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'audit-timeline-release-rollout',
          eyebrow: 'Release rollout',
          title: 'Release rollout timeline',
          description: 'Build, docs, smoke ve publish adimlarini tek action timeline uzerinde gosteren daha release odakli varyant.',
          badges: ['release', 'rollout', 'timeline'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Rollout timeline">
                <AIActionAuditTimeline
                  items={auditTimelineItems}
                  selectedId={selectedAuditId}
                  onSelectItem={(id) => setSelectedAuditId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title="Rollout summary">
                <SummaryStrip
                  title="Rollout state"
                  description="Release akisinda secili olay ve actor zinciri."
                  columns={2}
                  items={[
                    { key: 'selected', label: 'Selected', value: selectedAuditId ?? 'audit-review', tone: 'info', note: 'Aktif rollout olayi' },
                    { key: 'actors', label: 'Actors', value: 'CI + Human + Shell', tone: 'success', note: 'Cok katmanli actor izi' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'audit-timeline-support-escalation',
          eyebrow: 'Support escalation',
          title: 'Support escalation timeline',
          description: 'Incident triage, owner handoff ve remediation aksiyonlarini daha support odakli bir timeline dilinde sunar.',
          badges: ['support', 'escalation', 'incident'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Escalation timeline">
                <AIActionAuditTimeline
                  items={auditTimelineItems}
                  selectedId={selectedAuditId}
                  onSelectItem={(id) => setSelectedAuditId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title="Escalation note">
                <Text variant="secondary" className="block leading-7">
                  Support escalation varyanti, audit izini yalniz governance degil incident triage ve owner handoff diliyle de okunabilir hale getirir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'audit-timeline-owner-shift',
          eyebrow: 'Owner shift',
          title: 'Owner shift timeline',
          description: 'Bir olay farkli ekipler arasinda el degistirirken action timeline’i owner odakli okumayi saglar.',
          badges: ['owner', 'shift', 'handoff'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Owner handoff timeline">
                <AIActionAuditTimeline
                  items={auditTimelineItems}
                  selectedId={selectedAuditId}
                  onSelectItem={(id) => setSelectedAuditId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title="Owner map">
                <Descriptions
                  title="Shift summary"
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    { key: 'from', label: 'From', value: 'Platform UI', tone: 'info' },
                    { key: 'to', label: 'To', value: 'Governance desk', tone: 'warning' },
                    { key: 'reason', label: 'Reason', value: 'Final approval and evidence handoff', tone: 'success' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    default:
      return null;
  }
};
