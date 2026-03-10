import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AIGuidedAuthoring } from '../packages/ui-kit/src/components/AIGuidedAuthoring';
import {
  AIActionAuditTimeline,
  type AIActionAuditTimelineItem,
} from '../packages/ui-kit/src/components/AIActionAuditTimeline';
import { AnchorToc } from '../packages/ui-kit/src/components/AnchorToc';
import { ApprovalCheckpoint } from '../packages/ui-kit/src/components/ApprovalCheckpoint';
import { Avatar } from '../packages/ui-kit/src/components/Avatar';
import { Badge } from '../packages/ui-kit/src/components/Badge';
import {
  CitationPanel,
  type CitationPanelItem,
} from '../packages/ui-kit/src/components/CitationPanel';
import {
  CommandPalette,
  type CommandPaletteItem,
} from '../packages/ui-kit/src/components/CommandPalette';
import { ConfidenceBadge } from '../packages/ui-kit/src/components/ConfidenceBadge';
import { Text } from '../packages/ui-kit/src/components/Text';

const meta: Meta = {
  title: 'UI Kit/LiveDemoFoundations',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const commandItems: CommandPaletteItem[] = [
  {
    id: 'open-release-cockpit',
    title: 'Release cockpit ac',
    description: 'Design Lab release summary ve migration panelini goster.',
    group: 'Navigation',
    shortcut: 'G R',
    keywords: ['design lab', 'release', 'migration'],
    badge: <Badge tone="info">AI</Badge>,
  },
  {
    id: 'run-wave-gate',
    title: 'Wave gate calistir',
    description: 'Wave 11 recipe zincirini yeniden dogrula.',
    group: 'Ops',
    shortcut: 'G W',
    keywords: ['wave', 'gate', 'recipe'],
  },
  {
    id: 'publish-bundle',
    title: 'Bundle publish ozetini guncelle',
    description: 'publish:bundle ve release manifest artefactlarini tazele.',
    group: 'Release',
    shortcut: 'G P',
    keywords: ['publish', 'bundle', 'manifest'],
  },
];

const citationItems: CitationPanelItem[] = [
  {
    id: 'design-lab-index',
    title: 'Design Lab visual summary',
    excerpt: 'Stable ve adopted surface coverage ayni generated index ustunde senkronize tutulur.',
    source: 'apps/mfe-shell/src/pages/admin/design-lab.index.json',
    locator: 'visualRegression.summary',
    kind: 'code',
    badges: [<Badge key="generated" tone="success">generated</Badge>],
  },
  {
    id: 'release-manifest',
    title: 'Release manifest evidence',
    excerpt: 'Release gate, doctor ve storybook artefactlari tek manifestte toplanir.',
    source: 'web/dist/ui-kit/ui-library-release-manifest.v1.json',
    locator: 'latestRelease.catalogMetrics',
    kind: 'log',
  },
];

const auditItems: AIActionAuditTimelineItem[] = [
  {
    id: 'audit-1',
    actor: 'ai',
    title: 'Coverage backlog tarandi',
    timestamp: '11:18',
    summary: 'Live demo surface icin eksik Storybook harness listesi cikarildi.',
    status: 'approved',
    badges: [<Badge key="scan" tone="info">scan</Badge>],
  },
  {
    id: 'audit-2',
    actor: 'human',
    title: 'Release sign-off',
    timestamp: '11:23',
    summary: 'Wave gate ve frontend doctor ayni release turunda PASS.',
    status: 'executed',
  },
];

const LiveDemoCanvas = () => {
  return (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6">
        <section className="rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Avatar name="Platform UI" size="lg" />
            <div>
              <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
                Live demo surface
              </Text>
              <Text as="h2" className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                AI-native ve evidence-first bileşenler ayni cockpit icinde gosteriliyor
              </Text>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <ConfidenceBadge level="high" score={91} sourceCount={12} />
              <Badge tone="success">Release-grade</Badge>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.26fr_0.74fr]">
          <AnchorToc
            sticky
            items={[
              { id: 'authoring', label: 'Authoring workbench', level: 1, meta: 'AI' },
              { id: 'checkpoint', label: 'Approval checkpoint', level: 1, meta: 'Human' },
              { id: 'citations', label: 'Citation panel', level: 2, meta: 'Evidence' },
              { id: 'command-palette', label: 'Command palette', level: 2, meta: 'Ops' },
            ]}
            defaultValue="authoring"
            syncWithHash={false}
          />

          <div className="space-y-6">
            <section id="authoring" className="rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
              <AIGuidedAuthoring
                defaultPaletteOpen={false}
                confidenceLevel="high"
                confidenceScore={91}
                sourceCount={12}
                promptComposerProps={{
                  defaultSubject: 'Wave 11 rollout note',
                  defaultValue:
                    'Theme preset, recipe coverage ve release evidence farklarini ozetle; consumer etki alanini belirt.',
                  defaultScope: 'release',
                  defaultTone: 'strict',
                  guardrails: ['policy-safe', 'evidence-linked', 'consumer-aware'],
                  citations: ['design-lab.index.json', 'release-manifest'],
                  footerNote: 'Authoring surface ayni command ve recommendation stack ile calisir.',
                }}
                recommendations={[
                  {
                    id: 'rec-1',
                    title: 'Stable coverage artik 100%',
                    summary: 'Stable release-ready surface tamamen Storybook harness altina alindi.',
                    recommendationType: 'Release insight',
                    confidenceLevel: 'high',
                    confidenceScore: 93,
                    sourceCount: 10,
                    rationale: [
                      'stableWithoutStory listesi bos',
                      'release gate PASS',
                      'frontend doctor PASS',
                    ],
                    citations: ['visualRegression.summary', 'ui-library-release-gate.summary'],
                    badges: [<Badge key="coverage" tone="success">coverage</Badge>],
                  },
                ]}
                commandItems={commandItems}
              />
            </section>

            <section id="checkpoint" className="grid grid-cols-1 gap-6 xl:grid-cols-[1.02fr_0.98fr]">
              <ApprovalCheckpoint
                title="Publish checkpoint"
                summary="AI yardimli rollout oncesi insan onayi, evidence seti ve release deadline ayni primitive ile okunur."
                status="approved"
                evidenceItems={['storybook-static', 'release-manifest', 'frontend-doctor']}
                steps={[
                  { key: 'visual', label: 'Visual contract', helper: '11 story + 2 mdx', status: 'approved' },
                  { key: 'doctor', label: 'Frontend doctor', helper: 'ui-library preset PASS', status: 'approved' },
                  { key: 'migration', label: 'Consumer impact', helper: '6 app etki alani review edildi', status: 'ready' },
                ]}
                citations={['design-lab.index', 'release-manifest']}
                footerNote="Owner: Platform UI"
                badges={[<Badge key="human" tone="info">human-in-loop</Badge>]}
              />

              <AIActionAuditTimeline
                items={auditItems}
                selectedId="audit-2"
                onSelectItem={() => undefined}
              />
            </section>

            <section id="citations" className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <CitationPanel
                items={citationItems}
                activeCitationId="design-lab-index"
                onOpenCitation={() => undefined}
              />

              <div id="command-palette" className="rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
                <div className="space-y-3">
                  <Text as="div" className="text-sm font-semibold text-text-primary">
                    Command palette overlay
                  </Text>
                  <Text variant="secondary" className="mt-2 block text-sm leading-6">
                    `CommandPalette` ayni dosyada ayrica overlay story olarak render edilir. Buradaki panel, live demo surface
                    ailesinin evidence ve ops akislarina nasil baglandigini anlatan sabit nottur.
                  </Text>
                  <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4">
                    <Text variant="secondary" className="block text-sm leading-6">
                      Release cockpit ac, wave gate calistir ve publish bundle ozeti guncelle aksiyonlari ayni command
                      katalogunda gruplanir.
                    </Text>
                    <div className="mt-4">
                      <ConfidenceBadge level="very-high" score={97} sourceCount={8} compact />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LiveDemoWorkbench: Story = {
  render: () => <LiveDemoCanvas />,
};

export const CommandPaletteOverlay: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas">
      <CommandPalette
        open
        items={commandItems}
        defaultQuery=""
        onClose={() => undefined}
        onSelect={() => undefined}
        footer={(
          <div className="flex items-center justify-between gap-3">
            <Text variant="secondary" className="text-sm">
              Palette, Design Lab icinden release, recipe ve navigation aksiyonlarini tetikler.
            </Text>
            <ConfidenceBadge level="very-high" score={97} sourceCount={8} compact />
          </div>
        )}
      />
    </div>
  ),
};
