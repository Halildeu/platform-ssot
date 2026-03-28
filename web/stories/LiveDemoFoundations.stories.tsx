import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AIGuidedAuthoring } from '../packages/design-system/src/components/AIGuidedAuthoring';
import {
  AIActionAuditTimeline,
  type AIActionAuditTimelineItem,
} from '../packages/design-system/src/components/AIActionAuditTimeline';
import { AnchorToc } from '../packages/design-system/src/components/AnchorToc';
import { ApprovalCheckpoint } from '../packages/design-system/src/components/ApprovalCheckpoint';
import { Avatar } from '../packages/design-system/src/components/Avatar';
import { Badge } from '../packages/design-system/src/components/Badge';
import {
  CitationPanel,
  type CitationPanelItem,
} from '../packages/design-system/src/components/CitationPanel';
import {
  CommandPalette,
  type CommandPaletteItem,
} from '../packages/design-system/src/components/CommandPalette';
import { Combobox } from '../packages/design-system/src/components/Combobox';
import { useAsyncCombobox } from '../packages/design-system/src/components/useAsyncCombobox';
import { ConfidenceBadge } from '../packages/design-system/src/components/ConfidenceBadge';
import { Text } from '../packages/design-system/src/components/Text';

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
    badge: <Badge variant="info">AI</Badge>,
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

const comboboxOptions = [
  {
    label: 'Core Modules',
    options: [
      { value: 'users', label: 'Users', description: 'Kimlik ve rol yonetimi', keywords: ['identity', 'roles'] },
      { value: 'reporting', label: 'Reporting', description: 'Analitik ve export akisleri', keywords: ['analytics'] },
    ],
  },
  {
    label: 'Restricted',
    options: [
      { value: 'audit', label: 'Audit', description: 'Denetim timeline gorunumu', disabled: true, disabledReason: 'Admin gerekir' },
    ],
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
    badges: [<Badge key="generated" variant="success">generated</Badge>],
  },
  {
    id: 'release-manifest',
    title: 'Release manifest evidence',
    excerpt: 'Release gate, doctor ve storybook artefactlari tek manifestte toplanir.',
    source: 'web/dist/design-system/ui-library-release-manifest.v1.json',
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
    badges: [<Badge key="scan" variant="info">scan</Badge>],
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
              <Badge variant="success">Release-grade</Badge>
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
                    badges: [<Badge key="coverage" variant="success">coverage</Badge>],
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
                badges={[<Badge key="human" variant="info">human-in-loop</Badge>]}
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

export const ComboboxInlineField: Story = {
  render: () => {
    const ComboboxDemo = () => {
      const [value, setValue] = React.useState<string | null>('reporting');
      const [inputValue, setInputValue] = React.useState('Reporting');

      return (
        <div className="min-h-screen bg-surface-canvas p-8 text-text-primary">
          <div className="mx-auto max-w-2xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
            <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
              Inline combobox
            </Text>
            <Text as="div" className="mt-2 text-2xl font-semibold text-text-primary">
              Searchable field primitive
            </Text>
            <Text variant="secondary" className="mt-2 block text-sm leading-7">
              `Combobox`, `Select`ten farkli olarak inline arama, filtreleme ve klavye ile secim popup’ini ayni field shell icinde sunar.
            </Text>
            <div className="mt-6">
              <Combobox
                label="Module"
                description="Route, owner veya capability anahtarina gore filtrele."
                value={value}
                inputValue={inputValue}
                onValueChange={setValue}
                onInputChange={setInputValue}
                options={comboboxOptions}
                clearable
                emptyStateLabel="Bir modul secilmedi"
              />
            </div>
            <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text variant="secondary" className="block text-sm leading-6">
                Secili deger: {value ?? 'bos'} | Input: {inputValue || 'bos'}
              </Text>
            </div>
          </div>
        </div>
      );
    };

    return <ComboboxDemo />;
  },
};

export const ComboboxAsyncFreeSoloField: Story = {
  render: () => {
    const ComboboxAdvancedDemo = () => {
      const allOptions = React.useMemo(
        () => [
          {
            label: 'Delivery',
            options: [
              {
                value: 'release-cockpit',
                label: 'Release cockpit',
                description: 'Wave gate, doctor ve publish manifest akislarini toplar',
                keywords: ['release', 'publish', 'cockpit'],
              },
              {
                value: 'migration-hub',
                label: 'Migration hub',
                description: 'Consumer etkisi ve upgrade backlog gorunumu',
                keywords: ['migration', 'consumer', 'upgrade'],
              },
            ],
          },
          {
            label: 'Observability',
            options: [
              {
                value: 'coverage-matrix',
                label: 'Coverage matrix',
                description: 'Story, runtime smoke ve audit kapsamini ceker',
                keywords: ['coverage', 'audit', 'matrix'],
              },
              {
                value: 'audit',
                label: 'Audit stream',
                description: 'Sadece platform-admin rolune acik akis',
                disabled: true,
                disabledReason: 'Platform admin gerekir',
                keywords: ['audit', 'restricted'],
              },
            ],
          },
        ],
        [],
      );
      const [value, setValue] = React.useState<string | null>(null);
      const [inputValue, setInputValue] = React.useState('');
      const { query, setQuery, options, loading } = useAsyncCombobox({
        debounceMs: 260,
        initialOptions: allOptions,
        loadOptions: async (nextQuery) => {
          if (!nextQuery.trim()) {
            return allOptions;
          }

          const normalized = nextQuery.trim().toLowerCase();
          return allOptions
            .map((group) => ({
              ...group,
              options: group.options.filter((option) =>
                [option.label, option.description ?? '', ...(option.keywords ?? [])]
                  .join(' ')
                  .toLowerCase()
                  .includes(normalized),
              ),
            }))
            .filter((group) => group.options.length > 0);
        },
      });

      return (
        <div className="min-h-screen bg-surface-canvas p-8 text-text-primary">
          <div className="mx-auto max-w-3xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
            <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
              Advanced combobox
            </Text>
            <Text as="div" className="mt-2 text-2xl font-semibold text-text-primary">
              Async query, portal popup ve free-solo giris
            </Text>
            <Text variant="secondary" className="mt-2 block text-sm leading-7">
              Bu ornek, debounced query callback ile filtrelenen bir option setini, custom render ve free-solo commit
              davranisiyla birlestirir.
            </Text>
            <div className="mt-6">
              <Combobox
                label="Capability"
                description="Release veya observability akislarinda arama yap; gerekirse serbest deger gir."
                value={value}
                inputValue={inputValue}
                onValueChange={setValue}
                onInputChange={setInputValue}
                onQueryRequest={setQuery}
                freeSolo
                onFreeSoloCommit={setValue}
                loading={loading}
                options={options}
                clearable
                popupStrategy="portal"
                popupAlign="start"
                popupSide="bottom"
                disabledItemFocusPolicy="allow"
                emptyStateLabel="Bir capability secilmedi"
                renderOption={(option, state) => (
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-text-primary">{option.label}</div>
                      <div className="mt-1 text-sm leading-6 text-text-secondary">
                        {option.description ?? (state.disabled ? option.disabledReason : 'Serbest secim icin Enter kullan.')}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {state.selected ? <Badge variant="success">selected</Badge> : null}
                      {state.disabled ? <Badge variant="warning">restricted</Badge> : null}
                      {option.groupLabel ? <Badge variant="info">{option.groupLabel}</Badge> : null}
                    </div>
                  </div>
                )}
              />
            </div>
            <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text variant="secondary" className="block text-sm leading-6">
                Secili deger: {value ?? 'bos'} | Input: {inputValue || 'bos'} | Son query: {query || 'bos'}
              </Text>
            </div>
          </div>
        </div>
      );
    };

    return <ComboboxAdvancedDemo />;
  },
};

export const ComboboxTagsField: Story = {
  render: () => {
    const ComboboxTagsDemo = () => {
      const [values, setValues] = React.useState<string[]>(['users', 'release-cockpit']);
      const [inputValue, setInputValue] = React.useState('');

      return (
        <div className="min-h-screen bg-surface-canvas p-8 text-text-primary">
          <div className="mx-auto max-w-3xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
            <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
              Tags combobox
            </Text>
            <Text as="div" className="mt-2 text-2xl font-semibold text-text-primary">
              Multi-select + tag remove + free-solo tag commit
            </Text>
            <Text variant="secondary" className="mt-2 block text-sm leading-7">
              `selectionMode=&quot;tags&quot;`, mevcut option secimlerini serbest metin commit’i ve chip remove davranisiyla ayni field icinde toplar.
            </Text>
            <div className="mt-6">
              <Combobox
                label="Signals"
                description="Release, observability veya serbest etiketleri ayni primitive icinde topla."
                selectionMode="tags"
                values={values}
                inputValue={inputValue}
                onValuesChange={setValues}
                onInputChange={setInputValue}
                options={comboboxOptions}
                clearable
                emptyStateLabel="Bir sinyal secilmedi"
                renderOption={(option, state) => (
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-text-primary">{option.label}</div>
                      <div className="mt-1 text-sm leading-6 text-text-secondary">
                        {option.description ?? (state.disabled ? option.disabledReason : 'Enter ile etiket olarak eklenebilir.')}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {state.selected ? <Badge variant="success">selected</Badge> : null}
                      {state.disabled ? <Badge variant="warning">restricted</Badge> : null}
                    </div>
                  </div>
                )}
              />
            </div>
            <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text variant="secondary" className="block text-sm leading-6">
                Secili etiketler: {values.join(', ') || 'bos'} | Input: {inputValue || 'bos'}
              </Text>
            </div>
          </div>
        </div>
      );
    };

    return <ComboboxTagsDemo />;
  },
};
