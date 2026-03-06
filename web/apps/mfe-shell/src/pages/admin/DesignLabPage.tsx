import React, { useEffect, useMemo, useState } from 'react';
import {
  AgGridServer,
  Badge,
  Button,
  DetailDrawer,
  Dropdown,
  Empty,
  EntityGridTemplate,
  FilterBar,
  FormDrawer,
  Modal,
  PageLayout,
  ReportFilterPanel,
  Select,
  Tag,
  Text,
  ThemePreviewCard,
  Tooltip,
} from 'mfe-ui-kit';
import designLabIndexRaw from './design-lab.index.json';
import designLabTaxonomyRaw from './design-lab.taxonomy.v1.json';

type DesignLabLifecycle = 'stable' | 'beta' | 'planned';
type DesignLabAvailability = 'exported' | 'planned';
type DesignLabDemoMode = 'live' | 'inspector' | 'planned';

type DesignLabIndexItem = {
  name: string;
  kind: 'component' | 'hook' | 'function' | 'const';
  importStatement: string;
  whereUsed: string[];
  group: string;
  subgroup: string;
  tags?: string[];
  availability: DesignLabAvailability;
  lifecycle: DesignLabLifecycle;
  taxonomyGroupId: string;
  taxonomySubgroup: string;
  demoMode: DesignLabDemoMode;
  description: string;
  sectionIds: string[];
  qualityGates: string[];
  tags?: string[];
  uxPrimaryThemeId?: string;
  uxPrimarySubthemeId?: string;
  roadmapWaveId?: string;
  acceptanceContractId?: string;
};

type DesignLabIndex = {
  version?: number;
  generatedAt?: string;
  generatedAtUtc?: string;
  summary?: {
    total: number;
    exported: number;
    planned: number;
    liveDemo: number;
    inspector: number;
  };
  items: DesignLabIndexItem[];
};

type DesignLabTaxonomyGroup = {
  id: string;
  title: string;
  subgroups: string[];
};

type DesignLabTaxonomy = {
  version: string;
  defaults: {
    showEmptyGroups: boolean;
    showEmptySubgroups: boolean;
    defaultView: string;
    advancedToggleLabel: string;
  };
  groups: DesignLabTaxonomyGroup[];
};

const designLabIndex = designLabIndexRaw as DesignLabIndex;
const designLabTaxonomy = designLabTaxonomyRaw as DesignLabTaxonomy;

const copyToClipboard = async (value: string): Promise<boolean> => {
  if (!value) return false;
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
};

const statusToneClass: Record<DesignLabLifecycle, string> = {
  stable: 'text-state-success-text',
  beta: 'text-state-warning-text',
  planned: 'text-state-info-text',
};

const statusLabel: Record<DesignLabLifecycle, string> = {
  stable: 'Stable',
  beta: 'Beta',
  planned: 'Planned',
};

const availabilityLabel: Record<DesignLabAvailability, string> = {
  exported: 'Exported',
  planned: 'Roadmap',
};

const demoModeLabel: Record<DesignLabDemoMode, string> = {
  live: 'Live Preview',
  inspector: 'Inspector',
  planned: 'Planned',
};

const SectionBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center rounded-full border border-border-subtle bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
    {label}
  </span>
);

const SummaryCard: React.FC<{ label: string; value: number; note: string }> = ({ label, value, note }) => (
  <div className="rounded-3xl border border-border-subtle bg-surface-panel p-4 shadow-sm">
    <Text as="div" variant="secondary" className="text-xs font-semibold uppercase tracking-[0.18em]">
      {label}
    </Text>
    <div className="mt-2 text-3xl font-semibold text-text-primary">{value}</div>
    <Text variant="secondary" className="mt-1 block text-xs">
      {note}
    </Text>
  </div>
);

const PreviewPanel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
    <Text as="div" variant="secondary" className="text-xs font-semibold uppercase tracking-[0.18em]">
      {title}
    </Text>
    <div className="mt-3">{children}</div>
  </div>
);

const DetailLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
    {children}
  </Text>
);

const DesignLabPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedItemName, setSelectedItemName] = useState<string>(() => {
    const button = designLabIndex.items.find((item) => item.name === 'Button');
    return button?.name ?? designLabIndex.items[0]?.name ?? '';
  });
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['actions', 'data_entry', 'data_display']);
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('comfortable');
  const [dropdownAction, setDropdownAction] = useState('Henüz seçim yok');
  const [reportStatus, setReportStatus] = useState('Filtre bekleniyor');

  useEffect(() => {
    setModalOpen(false);
    setFormDrawerOpen(false);
    setDetailDrawerOpen(false);
  }, [selectedItemName]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!normalizedQuery) return designLabIndex.items;
    return designLabIndex.items.filter((item) => {
      const haystack = [
        item.name,
        item.kind,
        item.lifecycle,
        item.availability,
        item.taxonomyGroupId,
        item.taxonomySubgroup,
        item.description,
        ...(item.sectionIds ?? []),
        ...(item.qualityGates ?? []),
        ...((item.tags ?? []) as string[]),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const selectedItem = useMemo(
    () => filteredItems.find((item) => item.name === selectedItemName) ?? designLabIndex.items.find((item) => item.name === selectedItemName) ?? null,
    [filteredItems, selectedItemName],
  );

  const countByGroup = useMemo(() => {
    const counts = new Map<string, number>();
    for (const group of designLabTaxonomy.groups) counts.set(group.id, 0);
    for (const item of filteredItems) {
      counts.set(item.taxonomyGroupId, (counts.get(item.taxonomyGroupId) ?? 0) + 1);
    }
    return counts;
  }, [filteredItems]);

  const itemsByGroupAndSubgroup = useMemo(() => {
    const map = new Map<string, Map<string, DesignLabIndexItem[]>>();
    for (const item of filteredItems) {
      const subgroupMap = map.get(item.taxonomyGroupId) ?? new Map<string, DesignLabIndexItem[]>();
      const list = subgroupMap.get(item.taxonomySubgroup) ?? [];
      list.push(item);
      subgroupMap.set(item.taxonomySubgroup, [...list].sort((a, b) => a.name.localeCompare(b.name, 'en')));
      map.set(item.taxonomyGroupId, subgroupMap);
    }
    return map;
  }, [filteredItems]);

  const effectiveExpandedGroups = useMemo(() => {
    if (normalizedQuery) {
      return designLabTaxonomy.groups.filter((group) => (countByGroup.get(group.id) ?? 0) > 0).map((group) => group.id);
    }
    return expandedGroups;
  }, [countByGroup, expandedGroups, normalizedQuery]);

  const summary = useMemo(() => {
    const items = designLabIndex.items;
    return {
      total: items.length,
      exported: items.filter((item) => item.availability === 'exported').length,
      planned: items.filter((item) => item.availability === 'planned').length,
      stable: items.filter((item) => item.lifecycle === 'stable').length,
      beta: items.filter((item) => item.lifecycle === 'beta').length,
      liveDemo: items.filter((item) => item.demoMode === 'live').length,
    };
  }, []);

  const handleCopy = async (value: string) => {
    const ok = await copyToClipboard(value);
    setCopied(ok ? 'ok' : 'fail');
    window.setTimeout(() => setCopied(null), 1500);
  };

  const gridRows = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 8 }).map((_, index) => ({
      id: String(index + 1),
      name: `Kayıt ${index + 1}`,
      status: index % 3 === 0 ? 'Active' : index % 3 === 1 ? 'Pending' : 'Disabled',
      updatedAt: new Date(now.getTime() - index * 86_400_000).toISOString().slice(0, 10),
    }));
  }, []);

  const serverGridRows = useMemo(
    () => [
      { id: 'CMP-001', name: 'Companies', owner: 'core-data-service' },
      { id: 'USR-001', name: 'Users', owner: 'user-service' },
      { id: 'PRM-001', name: 'Permissions', owner: 'permission-service' },
      { id: 'VAR-001', name: 'Variants', owner: 'variant-service' },
    ],
    [],
  );

  const renderLivePreview = (item: DesignLabIndexItem) => {
    switch (item.name) {
      case 'Button':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Varyant matrisi">
                <div className="flex flex-wrap items-center gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Boyut ve icon slot">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" leadingVisual={<span aria-hidden="true">+</span>}>Small</Button>
                  <Button size="md" trailingVisual={<span aria-hidden="true">→</span>}>Medium</Button>
                  <Button size="lg" leadingVisual={<span aria-hidden="true">★</span>}>Large</Button>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Durumlar">
                <div className="flex flex-wrap items-center gap-3">
                  <Button loading loadingLabel="Kaydediliyor">Kaydet</Button>
                  <Button disabled variant="secondary">Disabled</Button>
                  <Button access="readonly" variant="ghost">Readonly</Button>
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Badge':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge tone="default">Default</Badge>
              <Badge tone="info">Info</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">Warning</Badge>
              <Badge tone="danger">Danger</Badge>
            </div>
          </div>
        );
      case 'Tag':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Tag>Neutral</Tag>
              <Tag tone="success">Approved</Tag>
              <Tag tone="warning">Pending</Tag>
              <Tag tone="danger">Blocked</Tag>
            </div>
          </div>
        );
      case 'Text':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Semantic preset">
                <div className="flex flex-col gap-2">
                  <Text as="h2" preset="display">Display metni</Text>
                  <Text as="h3" preset="heading">Heading metni</Text>
                  <Text preset="title">Title metni</Text>
                  <Text preset="body">Body text</Text>
                  <Text preset="caption">Caption</Text>
                  <Text preset="mono">MONO-1024</Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Tone ve emphasis">
                <div className="flex flex-col gap-2">
                  <Text weight="semibold">Primary emphasis</Text>
                  <Text variant="secondary">Secondary copy</Text>
                  <Text variant="muted">Muted helper text</Text>
                  <Text variant="success">Success state</Text>
                  <Text variant="danger">Danger state</Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Clamp ve truncate">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="max-w-[240px]">
                    <Text truncate title="Bu başlık tek satırda truncate edilir ve hover ile tam hali görülebilir.">
                      Bu başlık tek satırda truncate edilir ve hover ile tam hali görülebilir.
                    </Text>
                  </div>
                  <div className="max-w-[240px]">
                    <Text clampLines={2}>
                      Uzun açıklama metni iki satıra clamp edilir; layout taşması üretmez ve typography kontratını korur.
                    </Text>
                  </div>
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Select':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="max-w-sm">
              <Select
                value={selectValue}
                onChange={setSelectValue}
                options={[
                  { value: 'comfortable', label: 'Comfortable' },
                  { value: 'compact', label: 'Compact' },
                  { value: 'sharp', label: 'Sharp' },
                ]}
              />
            </div>
            <Text variant="secondary" className="mt-3 block">Aktif değer: {selectValue}</Text>
          </div>
        );
      case 'Dropdown':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Dropdown
                trigger={<span>Aksiyon Menüsü</span>}
                items={[
                  { key: 'publish', label: 'Publish' },
                  { key: 'duplicate', label: 'Duplicate' },
                  { key: 'archive', label: 'Archive' },
                ]}
                onSelect={setDropdownAction}
              />
              <Text variant="secondary">Seçim: {dropdownAction}</Text>
            </div>
          </div>
        );
      case 'Tooltip':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Tooltip text="Tooltip örneği">
              <Button variant="secondary">Hover / Focus</Button>
            </Tooltip>
          </div>
        );
      case 'Empty':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Empty description="Bu katalog grubunda henüz kayıt yok." />
          </div>
        );
      case 'Modal':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Button onClick={() => setModalOpen(true)}>Modal aç</Button>
            <Modal
              open={modalOpen}
              title="UI Kit Demo Modal"
              onClose={() => setModalOpen(false)}
              footer={(
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>İptal</Button>
                  <Button onClick={() => setModalOpen(false)}>Kaydet</Button>
                </div>
              )}
            >
              <Text variant="secondary">Token zincirine bağlı dialog preview.</Text>
            </Modal>
          </div>
        );
      case 'ThemePreviewCard':
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ThemePreviewCard />
            <ThemePreviewCard selected />
            <ThemePreviewCard />
          </div>
        );
      case 'PageLayout':
        return (
          <div className="overflow-hidden rounded-3xl border border-border-subtle bg-surface-panel shadow-sm">
            <PageLayout
              title="User Directory"
              description="Route-level layout composition example"
              breadcrumbItems={[
                { title: 'Admin', path: '#' },
                { title: 'Users' },
              ]}
              actions={<Button variant="secondary">Yeni kayıt</Button>}
              filterBar={<FilterBar onReset={() => undefined} onSaveView={() => undefined}><div className="h-10 rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Filter slot</div></FilterBar>}
              detail={<div className="rounded-2xl border border-border-subtle bg-surface-default p-4 text-sm text-text-secondary">Detail panel</div>}
            >
              <div className="rounded-2xl border border-border-subtle bg-surface-default p-4 text-sm text-text-secondary">Main content</div>
            </PageLayout>
          </div>
        );
      case 'FilterBar':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <FilterBar onReset={() => undefined} onSaveView={() => undefined}>
              <div className="min-w-[220px] rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Search</div>
              <div className="min-w-[220px] rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Status</div>
            </FilterBar>
          </div>
        );
      case 'FormDrawer':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Button onClick={() => setFormDrawerOpen(true)}>Drawer aç</Button>
            <FormDrawer open={formDrawerOpen} title="Yeni kayıt" onClose={() => setFormDrawerOpen(false)}>
              <div className="flex flex-col gap-3">
                <div className="rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Field 1</div>
                <div className="rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Field 2</div>
              </div>
            </FormDrawer>
          </div>
        );
      case 'DetailDrawer':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Button onClick={() => setDetailDrawerOpen(true)}>Detail aç</Button>
            <DetailDrawer
              open={detailDrawerOpen}
              title="Kayıt detay"
              onClose={() => setDetailDrawerOpen(false)}
              sections={[
                { key: 'summary', title: 'Summary', description: 'Drawer section example', content: <Text variant="secondary">Kısa detay içeriği.</Text> },
                { key: 'audit', title: 'Audit', description: 'Metadata block', content: <Text variant="secondary">Updated 2026-03-06</Text> },
              ]}
            />
          </div>
        );
      case 'ReportFilterPanel':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <ReportFilterPanel onSubmit={() => setReportStatus('Filtre uygulandı')} onReset={() => setReportStatus('Filtre sıfırlandı')}>
              <div className="rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Date range</div>
              <div className="rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Owner</div>
            </ReportFilterPanel>
            <Text variant="secondary" className="mt-3 block">Durum: {reportStatus}</Text>
          </div>
        );
      case 'EntityGridTemplate':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-4 shadow-sm">
            <div className="h-[420px]">
              <EntityGridTemplate<Record<string, unknown>>
                gridId="design-lab-grid"
                gridSchemaVersion={1}
                dataSourceMode="client"
                rowData={gridRows}
                total={gridRows.length}
                page={1}
                pageSize={25}
                columnDefs={[
                  { field: 'name', headerName: 'İsim', flex: 1 },
                  { field: 'status', headerName: 'Durum', width: 140 },
                  { field: 'updatedAt', headerName: 'Güncelleme', width: 140 },
                ]}
              />
            </div>
          </div>
        );
      case 'AgGridServer':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-4 shadow-sm">
            <div className="h-[360px]">
              <AgGridServer
                height={320}
                columnDefs={[
                  { field: 'id', headerName: 'ID', width: 120 },
                  { field: 'name', headerName: 'Kaynak', flex: 1 },
                  { field: 'owner', headerName: 'Owner', width: 180 },
                ]}
                getData={async () => ({ rows: serverGridRows, total: serverGridRows.length })}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Text as="div" className="font-semibold">Inspector preview</Text>
            <Text variant="secondary" className="mt-2 block">
              Bu export çalışma anında canlı UI yerine davranış ve contract seviyesinde izlenir.
            </Text>
            <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-default p-4">
              <DetailLabel>Registry notu</DetailLabel>
              <Text variant="secondary" className="mt-2 block">{item.description}</Text>
            </div>
          </div>
        );
    }
  };

  const renderPreview = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-6 shadow-sm">
          <Text variant="secondary">Seçili bileşen yok.</Text>
        </div>
      );
    }
    if (item.availability === 'planned' || item.demoMode === 'planned') {
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Text as="div" className="text-xl font-semibold">{item.name}</Text>
              <Text variant="secondary" className="mt-2 block max-w-2xl">{item.description}</Text>
            </div>
            <Tag tone="info">Roadmap item</Tag>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
              <DetailLabel>Release gate</DetailLabel>
              <Text variant="secondary" className="mt-2 block">Implementation, registry sync, live preview ve package export tamamlanmadan exported duruma gecmez.</Text>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
              <DetailLabel>North Star sections</DetailLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.sectionIds.map((sectionId) => <SectionBadge key={sectionId} label={sectionId} />)}
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (item.demoMode === 'live') {
      return renderLivePreview(item);
    }
    return renderLivePreview(item);
  };

  return (
    <div data-testid="design-lab-page" className="space-y-4">
      <section className="rounded-[32px] border border-border-subtle bg-surface-default p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Text as="div" className="text-3xl font-semibold">UI Kütüphane Sistemi</Text>
            <Text variant="secondary" className="mt-2 block">
              `mfe-ui-kit` paketinin kanonik katalog ve preview yüzeyi. Export edilen component, utility ve planned backlog aynı JSON registry’den okunur.
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Tag tone="success">Package-only model</Tag>
            <Tag tone="info">JSON-first catalog</Tag>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-6">
          <SummaryCard label="Total" value={summary.total} note="Katalog girdisi" />
          <SummaryCard label="Exported" value={summary.exported} note="Gerçek package export" />
          <SummaryCard label="Planned" value={summary.planned} note="Roadmap backlog" />
          <SummaryCard label="Stable" value={summary.stable} note="Üretimde güvenilir" />
          <SummaryCard label="Beta" value={summary.beta} note="Gelişen export" />
          <SummaryCard label="Live Demo" value={summary.liveDemo} note="Canlı preview hazır" />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr_360px]">
        <aside className="min-h-0 rounded-[28px] border border-border-subtle bg-surface-panel p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Text as="div" className="font-semibold">Catalog</Text>
            <Text variant="secondary">{filteredItems.length}/{designLabIndex.items.length}</Text>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ara: Button, Grid, Theme..."
            className="mb-4 h-11 w-full rounded-2xl border border-border-default bg-surface-default px-3 text-sm text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1"
            aria-label="Design lab arama"
          />
          <div className="max-h-[calc(100vh-310px)] overflow-auto pr-1">
            {designLabTaxonomy.groups.map((group) => {
              const groupCount = countByGroup.get(group.id) ?? 0;
              const expanded = effectiveExpandedGroups.includes(group.id);
              return (
                <div key={group.id} className="mb-3">
                  <button
                    type="button"
                    onClick={() => setExpandedGroups((prev) => (prev.includes(group.id) ? prev.filter((id) => id !== group.id) : [...prev, group.id]))}
                    disabled={Boolean(normalizedQuery)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition ${expanded ? 'border-border-default bg-surface-default shadow-sm' : 'border-transparent hover:bg-surface-muted'} ${normalizedQuery ? 'cursor-default opacity-90' : ''}`}
                  >
                    <span className="text-sm font-semibold text-text-primary">{group.title}</span>
                    <span className="text-xs font-semibold text-text-secondary">{groupCount}</span>
                  </button>
                  {expanded ? (
                    <div className="mt-2 space-y-2">
                      {group.subgroups.map((subgroup) => {
                        const subgroupItems = itemsByGroupAndSubgroup.get(group.id)?.get(subgroup) ?? [];
                        return (
                          <div key={subgroup}>
                            <div className="mb-1 flex items-center justify-between px-2">
                              <Text as="div" variant="secondary" className="text-xs font-semibold">{subgroup}</Text>
                              <Text variant="secondary" className="text-xs">{subgroupItems.length}</Text>
                            </div>
                            {subgroupItems.length > 0 ? (
                              <div className="space-y-1">
                                {subgroupItems.map((item) => {
                                  const active = item.name === selectedItem?.name;
                                  return (
                                    <button
                                      key={item.name}
                                      type="button"
                                      onClick={() => setSelectedItemName(item.name)}
                                      className={`flex w-full items-start justify-between gap-3 rounded-2xl border px-3 py-2 text-left transition ${active ? 'border-border-default bg-surface-default shadow-sm' : 'border-transparent hover:bg-surface-muted'}`}
                                    >
                                      <span className="min-w-0">
                                        <span className="block text-sm font-semibold text-text-primary">{item.name}</span>
                                        <span className="block text-[11px] text-text-secondary">{availabilityLabel[item.availability]} • {statusLabel[item.lifecycle]}</span>
                                      </span>
                                      <span className={`shrink-0 text-[11px] font-semibold ${statusToneClass[item.lifecycle]}`}>{demoModeLabel[item.demoMode]}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <Text variant="secondary" className="px-2 text-xs">Bu alt grupta öğe yok.</Text>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </aside>

        <section className="min-h-0 rounded-[28px] border border-border-subtle bg-surface-default p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Text as="div" className="text-xl font-semibold">{selectedItem?.name ?? '—'}</Text>
                {selectedItem ? <Badge tone={selectedItem.availability === 'exported' ? 'success' : 'info'}>{availabilityLabel[selectedItem.availability]}</Badge> : null}
                {selectedItem ? <Badge tone={selectedItem.lifecycle === 'stable' ? 'success' : selectedItem.lifecycle === 'beta' ? 'warning' : 'info'}>{statusLabel[selectedItem.lifecycle]}</Badge> : null}
              </div>
              {selectedItem ? <Text variant="secondary" className="mt-2 block max-w-3xl">{selectedItem.description}</Text> : null}
            </div>
            {selectedItem?.importStatement ? (
              <Button variant="secondary" onClick={() => handleCopy(selectedItem.importStatement)}>Copy import</Button>
            ) : null}
          </div>
          {copied === 'ok' ? <Text variant="secondary" className="mb-3 block">Kopyalandı</Text> : null}
          {copied === 'fail' ? <Text variant="secondary" className="mb-3 block">Kopyalanamadı</Text> : null}
          {renderPreview(selectedItem)}
        </section>

        <aside className="min-h-0 rounded-[28px] border border-border-subtle bg-surface-panel p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Text as="div" className="font-semibold">Detail</Text>
            <Text variant="secondary">{selectedItem?.whereUsed.length ?? 0} kullanım</Text>
          </div>
          <div className="max-h-[calc(100vh-310px)] space-y-3 overflow-auto pr-1">
            <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
              <DetailLabel>Registry</DetailLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedItem ? (
                  <>
                    <SectionBadge label={selectedItem.kind} />
                    <SectionBadge label={demoModeLabel[selectedItem.demoMode]} />
                    <SectionBadge label={selectedItem.taxonomyGroupId} />
                    {selectedItem.roadmapWaveId ? <SectionBadge label={selectedItem.roadmapWaveId} /> : null}
                  </>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
              <DetailLabel>UX alignment</DetailLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedItem?.uxPrimaryThemeId ? <SectionBadge label={selectedItem.uxPrimaryThemeId} /> : <Text variant="secondary">Yok</Text>}
                {selectedItem?.uxPrimarySubthemeId ? <SectionBadge label={selectedItem.uxPrimarySubthemeId} /> : null}
              </div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
              <DetailLabel>North Star sections</DetailLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedItem?.sectionIds?.map((sectionId) => <SectionBadge key={sectionId} label={sectionId} />) ?? <Text variant="secondary">Yok</Text>}
              </div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
              <DetailLabel>Quality gates</DetailLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedItem?.qualityGates?.map((gate) => <SectionBadge key={gate} label={gate} />) ?? <Text variant="secondary">Yok</Text>}
              </div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
              <DetailLabel>Contract</DetailLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedItem?.acceptanceContractId ? <SectionBadge label={selectedItem.acceptanceContractId} /> : <Text variant="secondary">Yok</Text>}
              </div>
              {selectedItem?.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag) => <SectionBadge key={tag} label={tag} />)}
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
              <DetailLabel>Import</DetailLabel>
              <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-border-subtle bg-surface-muted p-3 text-xs text-text-primary">
                {selectedItem?.importStatement || 'Planned item — import kapalı'}
              </pre>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
              <DetailLabel>Where used</DetailLabel>
              <div className="mt-3 space-y-2">
                {selectedItem && selectedItem.whereUsed.length > 0 ? selectedItem.whereUsed.map((filePath) => (
                  <div key={filePath} className="rounded-2xl border border-border-subtle bg-surface-muted px-3 py-2">
                    <div className="break-all text-xs text-text-secondary">{filePath}</div>
                    <div className="mt-2 flex justify-end">
                      <Button variant="ghost" onClick={() => handleCopy(filePath)}>Copy</Button>
                    </div>
                  </div>
                )) : <Text variant="secondary">Kullanım bulunamadı.</Text>}
              </div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
              <DetailLabel>Index state</DetailLabel>
              <Text variant="secondary" className="mt-3 block">
                Bu panel `component-registry.v1.json` + `designlab:index` çıktısını birlikte kullanır.
              </Text>
              {designLabIndex.generatedAt ? (
                <Text variant="secondary" className="mt-2 block text-xs">Son index: {designLabIndex.generatedAt}</Text>
              ) : null}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default DesignLabPage;
