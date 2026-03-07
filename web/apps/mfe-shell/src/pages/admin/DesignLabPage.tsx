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
  IconButton,
  LinkInline,
  Modal,
  PageLayout,
  ReportFilterPanel,
  Select,
  Skeleton,
  Spinner,
  Pagination,
  Steps,
  Tag,
  Tabs,
  Text,
  ThemePreviewCard,
  Tooltip,
  Avatar,
  AnchorToc,
  Breadcrumb,
  Divider,
} from 'mfe-ui-kit';
import designLabIndexRaw from './design-lab.index.json';
import designLabTaxonomyRaw from './design-lab.taxonomy.v1.json';
import componentApiCatalogRaw from '../../../../../packages/ui-kit/src/catalog/component-api-catalog.v1.json';

type DesignLabLifecycle = 'stable' | 'beta' | 'planned';
type DesignLabAvailability = 'exported' | 'planned';
type DesignLabDemoMode = 'live' | 'inspector' | 'planned';
type DesignLabTrack = 'new_packages' | 'current_system' | 'roadmap';
type DesignLabDetailTab = 'overview' | 'demo' | 'api' | 'ux' | 'quality';

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

type DesignLabApiProp = {
  name: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
};

type DesignLabApiItem = {
  name: string;
  variantAxes: string[];
  stateModel: string[];
  props: DesignLabApiProp[];
  previewFocus: string[];
  regressionFocus: string[];
};

type DesignLabApiCatalog = {
  version: string;
  subject_id: string;
  wave_id: string;
  items: DesignLabApiItem[];
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
const componentApiCatalog = componentApiCatalogRaw as DesignLabApiCatalog;
const avatarPreviewImageSrc =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='32' fill='%23E38B2C'/%3E%3Ccircle cx='64' cy='50' r='24' fill='%23FFF5E8'/%3E%3Cpath d='M30 110c8-18 22-28 34-28s26 10 34 28' fill='%23FFF5E8'/%3E%3C/svg%3E";

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

const componentApiMap = new Map(componentApiCatalog.items.map((item) => [item.name, item]));

const toTestIdSuffix = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const trackMeta: Record<DesignLabTrack, { label: string; note: string }> = {
  new_packages: {
    label: 'Yeni Paketler',
    note: 'Wave kontratıyla üretilen yeni component ailesi.',
  },
  current_system: {
    label: 'Eski Sistem',
    note: 'Repoda zaten kullanılan önceki export seti.',
  },
  roadmap: {
    label: 'Roadmap',
    note: 'Henüz export edilmemiş planlı component backlog’u.',
  },
};

const resolveItemTrack = (item: DesignLabIndexItem): DesignLabTrack => {
  if (item.availability === 'planned' || item.demoMode === 'planned') {
    return 'roadmap';
  }
  if (item.roadmapWaveId || item.acceptanceContractId) {
    return 'new_packages';
  }
  return 'current_system';
};

const trackVisualMeta: Record<
  DesignLabTrack,
  {
    accentClass: string;
    borderClass: string;
    badgeTone: 'info' | 'warning' | 'muted';
    eyebrow: string;
  }
> = {
  new_packages: {
    accentClass: 'bg-action-primary',
    borderClass: 'border-action-primary-border',
    badgeTone: 'info',
    eyebrow: 'Wave',
  },
  current_system: {
    accentClass: 'bg-border-default',
    borderClass: 'border-border-default',
    badgeTone: 'muted',
    eyebrow: 'Legacy',
  },
  roadmap: {
    accentClass: 'bg-state-warning-border',
    borderClass: 'border-state-warning-border',
    badgeTone: 'warning',
    eyebrow: 'Planned',
  },
};

const SectionBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center rounded-full border border-border-subtle bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
    {label}
  </span>
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

const detailTabMeta: Array<{
  id: DesignLabDetailTab;
  label: string;
  description: string;
}> = [
  { id: 'overview', label: 'Overview', description: 'Özet ve hızlı durum görünümü' },
  { id: 'demo', label: 'Demo', description: 'Canlı component preview' },
  { id: 'api', label: 'API', description: 'Import ve registry alanları' },
  { id: 'ux', label: 'UX', description: 'UX katalog eşleşmesi' },
  { id: 'quality', label: 'Quality', description: 'Gate ve kullanım kanıtları' },
];

const DesignLabPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeTrack, setActiveTrack] = useState<DesignLabTrack>('new_packages');
  const [detailTab, setDetailTab] = useState<DesignLabDetailTab>('overview');
  const [selectedItemName, setSelectedItemName] = useState<string>(() => {
    const button = designLabIndex.items.find((item) => item.name === 'Button');
    return button?.name ?? designLabIndex.items[0]?.name ?? '';
  });
  const [selectedGroupId, setSelectedGroupId] = useState<string>('actions');
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('comfortable');
  const [dropdownAction, setDropdownAction] = useState('Henüz seçim yok');
  const [reportStatus, setReportStatus] = useState('Filtre bekleniyor');
  const [tabsValue, setTabsValue] = useState('overview');
  const [paginationPage, setPaginationPage] = useState(6);
  const [stepsValue, setStepsValue] = useState('review');
  const [anchorValue, setAnchorValue] = useState('overview');

  useEffect(() => {
    setModalOpen(false);
    setFormDrawerOpen(false);
    setDetailDrawerOpen(false);
    setDetailTab('overview');
  }, [selectedItemName]);

  const normalizedQuery = query.trim().toLowerCase();

  const itemsForTrack = useMemo(
    () => designLabIndex.items.filter((item) => resolveItemTrack(item) === activeTrack),
    [activeTrack],
  );

  const filteredItems = useMemo(() => {
    if (!normalizedQuery) return itemsForTrack;
    return itemsForTrack.filter((item) => {
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
  }, [itemsForTrack, normalizedQuery]);

  const selectedItem = useMemo(
    () => filteredItems.find((item) => item.name === selectedItemName) ?? null,
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

  const visibleGroups = useMemo(
    () => designLabTaxonomy.groups.filter((group) => (countByGroup.get(group.id) ?? 0) > 0),
    [countByGroup],
  );

  const selectedGroup = useMemo(
    () => designLabTaxonomy.groups.find((group) => group.id === selectedGroupId) ?? visibleGroups[0] ?? null,
    [selectedGroupId, visibleGroups],
  );

  const selectedGroupItemsBySubgroup = useMemo(
    () => (selectedGroup ? itemsByGroupAndSubgroup.get(selectedGroup.id) ?? new Map<string, DesignLabIndexItem[]>() : new Map<string, DesignLabIndexItem[]>()),
    [itemsByGroupAndSubgroup, selectedGroup],
  );

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

  const trackSummary = useMemo(
    () => ({
      new_packages: designLabIndex.items.filter((item) => resolveItemTrack(item) === 'new_packages').length,
      current_system: designLabIndex.items.filter((item) => resolveItemTrack(item) === 'current_system').length,
      roadmap: designLabIndex.items.filter((item) => resolveItemTrack(item) === 'roadmap').length,
    }),
    [],
  );

  const heroStats = useMemo(() => {
    if (!selectedItem) {
      return [];
    }
    return [
      { label: 'Track', value: trackMeta[resolveItemTrack(selectedItem)].label, note: 'Kaynağın ait olduğu yayın hattı' },
      { label: 'Grup', value: selectedGroup?.title ?? selectedItem.taxonomyGroupId, note: 'Ana gezinim ailesi' },
      { label: 'Demo', value: demoModeLabel[selectedItem.demoMode], note: 'Preview görünüm tipi' },
      { label: 'Kullanım', value: String(selectedItem.whereUsed.length), note: 'Tespit edilen kullanım noktası' },
    ];
  }, [selectedGroup, selectedItem]);

  useEffect(() => {
    if (visibleGroups.length === 0) {
      setSelectedGroupId('');
      return;
    }
    if (!selectedGroup || !visibleGroups.some((group) => group.id === selectedGroup.id)) {
      setSelectedGroupId(visibleGroups[0].id);
    }
  }, [selectedGroup, visibleGroups]);

  useEffect(() => {
    if (filteredItems.length === 0) {
      setSelectedItemName('');
      return;
    }
    const activeSelection = filteredItems.find((item) => item.name === selectedItemName);
    if (activeSelection && (!selectedGroup || activeSelection.taxonomyGroupId === selectedGroup.id)) {
      return;
    }
    const groupScopedFallback = selectedGroup ? filteredItems.find((item) => item.taxonomyGroupId === selectedGroup.id) : null;
    setSelectedItemName((groupScopedFallback ?? filteredItems[0]).name);
  }, [filteredItems, selectedGroup, selectedItemName]);

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
                  <Button
                    loading
                    loadingLabel="Kaydediliyor"
                    leadingVisual={<span aria-hidden="true">✓</span>}
                    trailingVisual={<span aria-hidden="true">→</span>}
                  >
                    Değişiklikleri kaydet
                  </Button>
                  <Button disabled variant="secondary">Disabled</Button>
                  <Button access="readonly" variant="ghost">Readonly</Button>
                </div>
                <div className="mt-4 max-w-sm">
                  <Button fullWidth variant="secondary" trailingVisual={<span aria-hidden="true">→</span>}>
                    Tam genişlik CTA
                  </Button>
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
              <PreviewPanel title="Okunabilirlik ve numerik hizalama">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-border-subtle bg-surface-canvas p-4">
                    <Text preset="body" wrap="pretty">
                      Pretty wrap aktifken uzun paragraf daha dengeli satir dagilimi ile okunur; bu da docs ve panel yuzeylerinde
                      goz yorgunlugunu azaltir.
                    </Text>
                  </div>
                  <div className="rounded-2xl border border-border-subtle bg-surface-canvas p-4 text-right">
                    <Text preset="body-sm" align="right" tabularNums>
                      12.450,00
                    </Text>
                    <Text preset="caption" variant="secondary" className="mt-2 block">
                      Tabular nums
                    </Text>
                  </div>
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'LinkInline':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Internal / external">
                <div className="flex flex-wrap items-center gap-4">
                  <LinkInline href="#users">Internal link</LinkInline>
                  <LinkInline href="https://mui.com" external>External link</LinkInline>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Current / blocked">
                <div className="flex flex-wrap items-center gap-4">
                  <LinkInline href="#current" current>Current state</LinkInline>
                  <LinkInline href="#blocked" disabled>Disabled state</LinkInline>
                  <LinkInline href="#secondary" tone="secondary" underline="always">Secondary tone</LinkInline>
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'IconButton':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Intent ve size">
                <div className="flex flex-wrap items-center gap-3">
                  <IconButton icon={<span aria-hidden="true">+</span>} label="Ekle" size="sm" />
                  <IconButton icon={<span aria-hidden="true">☆</span>} label="Pinle" selected />
                  <IconButton icon={<span aria-hidden="true">×</span>} label="Sil" variant="destructive" size="lg" />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Loading / disabled">
                <div className="flex flex-wrap items-center gap-3">
                  <IconButton icon={<span aria-hidden="true">⟳</span>} label="Yükleniyor" loading />
                  <IconButton icon={<span aria-hidden="true">🔒</span>} label="Kilitli" disabled />
                  <IconButton icon={<span aria-hidden="true">☰</span>} label="Menüyü aç" variant="secondary" />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Skeleton':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              <PreviewPanel title="Text">
                <Skeleton lines={3} />
              </PreviewPanel>
              <PreviewPanel title="Avatar + text">
                <div className="flex items-center gap-3">
                  <Skeleton variant="avatar" />
                  <div className="flex-1">
                    <Skeleton lines={2} />
                  </div>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Card placeholder">
                <Skeleton variant="rect" className="h-28" />
              </PreviewPanel>
              <PreviewPanel title="Table row / reduced motion">
                <div className="space-y-4">
                  <Skeleton variant="table-row" />
                  <Skeleton variant="table-row" animated={false} />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Spinner':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              <PreviewPanel title="Inline">
                <Spinner label="Yükleniyor" />
              </PreviewPanel>
              <PreviewPanel title="Block">
                <Spinner mode="block" label="Liste hazırlanıyor" />
              </PreviewPanel>
              <PreviewPanel title="Overlay">
                <Spinner mode="overlay" label="Bölüm yükleniyor" />
              </PreviewPanel>
              <PreviewPanel title="Tone / size">
                <div className="flex flex-wrap items-center gap-4">
                  <Spinner size="sm" tone="neutral" label="Kısa" />
                  <Spinner size="md" tone="primary" label="Orta" />
                  <div className="rounded-2xl bg-text-primary px-4 py-3">
                    <Spinner size="lg" tone="inverse" label="Inverse" />
                  </div>
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Avatar':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Sizes">
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar name="Ada Lovelace" size="sm" />
                  <Avatar name="Ada Lovelace" size="md" />
                  <Avatar name="Ada Lovelace" size="lg" />
                  <Avatar name="Ada Lovelace" size="xl" />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Image / privacy-safe identity">
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar src={avatarPreviewImageSrc} name="Nora Stone" alt="Nora Stone" />
                  <Avatar name="Broken Image" />
                  <Avatar shape="square" src={avatarPreviewImageSrc} name="Square Identity" alt="Square Identity" />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Fallback types">
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar name="Grace Hopper" />
                  <Avatar fallbackIcon={<span aria-hidden="true">👤</span>} />
                  <Avatar shape="square" name="Alan Turing" />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Divider':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Horizontal">
                <div className="space-y-3">
                  <Text>İçerik üstü</Text>
                  <Divider />
                  <Text variant="secondary">İçerik altı</Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Label / vertical">
                <div className="flex items-center gap-4">
                  <Text>Sol</Text>
                  <Divider orientation="vertical" className="h-8" />
                  <Text>Sağ</Text>
                  <Divider label="veya" className="flex-1" />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Semantic / decorative">
                <div className="space-y-3">
                  <Divider label="Sözleşmeli ayırıcı" />
                  <Divider decorative />
                  <Text variant="secondary">Dekoratif ayırıcı rol üretmez.</Text>
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Tabs':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Underline / controlled">
                <Tabs
                  value={tabsValue}
                  onValueChange={setTabsValue}
                  items={[
                    {
                      value: 'overview',
                      label: 'Overview',
                      badge: <Badge tone="info">4</Badge>,
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="title">Overview panel</Text>
                          <Text variant="secondary" className="mt-2 block">
                            Route-aware, keyboard navigable ve token-first sekme davranisi.
                          </Text>
                        </div>
                      ),
                    },
                    {
                      value: 'activity',
                      label: 'Activity',
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="title">Activity panel</Text>
                          <Text variant="secondary" className="mt-2 block">
                            Live preview icin controlled state ile shell tarafindan yonetiliyor.
                          </Text>
                        </div>
                      ),
                    },
                    {
                      value: 'settings',
                      label: 'Settings',
                      disabled: true,
                      content: null,
                    },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Pill / vertical manual">
                <Tabs
                  appearance="pill"
                  orientation="vertical"
                  activationMode="manual"
                  defaultValue="tokens"
                  items={[
                    {
                      value: 'tokens',
                      label: 'Tokens',
                      icon: <span aria-hidden="true">◈</span>,
                      description: 'Tema eksenleri ve semantic token kararlarini gosteren panel.',
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="body">Semantic token mapping</Text>
                        </div>
                      ),
                    },
                    {
                      value: 'density',
                      label: 'Density',
                      icon: <span aria-hidden="true">≋</span>,
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="body">Comfortable, compact ve sharp density gorunumu.</Text>
                        </div>
                      ),
                    },
                    {
                      value: 'motion',
                      label: 'Motion',
                      icon: <span aria-hidden="true">↻</span>,
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="body">Transition hizlari ve focus-visible davranisi.</Text>
                        </div>
                      ),
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Breadcrumb':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Basic path">
                <Breadcrumb
                  items={[
                    { label: 'Admin', href: '#admin' },
                    { label: 'UI Kit', href: '#ui-kit' },
                    { label: 'Navigation' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Collapsed long path">
                <Breadcrumb
                  maxItems={4}
                  items={[
                    { label: 'Workspace', href: '#workspace' },
                    { label: 'Cockpit', href: '#cockpit' },
                    { label: 'Libraries', href: '#libraries' },
                    { label: 'UI System', href: '#ui-system' },
                    { label: 'Tabs' },
                  ]}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Pagination':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Server-side matrix">
                <Pagination
                  totalItems={248}
                  pageSize={20}
                  page={paginationPage}
                  onPageChange={setPaginationPage}
                  mode="server"
                />
              </PreviewPanel>
              <PreviewPanel title="Compact / client-side">
                <Pagination
                  totalItems={84}
                  pageSize={12}
                  defaultPage={2}
                  size="sm"
                  compact
                  mode="client"
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Steps':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Interactive progress">
                <Steps
                  value={stepsValue}
                  onValueChange={setStepsValue}
                  interactive
                  items={[
                    {
                      value: 'draft',
                      title: 'Taslak',
                      description: 'İlk kural ve içerik çerçevesi hazırlanır.',
                    },
                    {
                      value: 'review',
                      title: 'İnceleme',
                      description: 'UX, API ve quality gate kanıtı birlikte doğrulanır.',
                    },
                    {
                      value: 'release',
                      title: 'Release',
                      description: 'Wave gate ve doctor evidence ile kapanış yapılır.',
                    },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Vertical / status-rich">
                <Steps
                  orientation="vertical"
                  items={[
                    {
                      value: 'scope',
                      title: 'Scope',
                      description: 'Contract ve registry eşleşmesi tamamlandı.',
                      status: 'complete',
                    },
                    {
                      value: 'preview',
                      title: 'Preview',
                      description: 'Live preview ve demoscope gözden geçiriliyor.',
                      status: 'current',
                    },
                    {
                      value: 'security',
                      title: 'Security',
                      description: 'Doctor evidence ve release guardrail bekleniyor.',
                      optional: true,
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'AnchorToc':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
              <AnchorToc
                value={anchorValue}
                onValueChange={setAnchorValue}
                title="Policy bölümleri"
                items={[
                  { id: 'overview', label: 'Overview', meta: 'P1' },
                  { id: 'ux', label: 'UX Standardı', level: 2, meta: 'P2' },
                  { id: 'security', label: 'Security Controls', level: 2, meta: 'P3' },
                  { id: 'release', label: 'Release Evidence', level: 3, meta: 'P4' },
                ]}
              />
              <div className="space-y-4 rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
                <PreviewPanel title="Deep-link / shareable state">
                  <div className="space-y-4">
                    <section id="overview" className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                      <Text preset="title">Overview</Text>
                      <Text variant="secondary" className="mt-2 block">
                        AnchorToc ayni sayfa icinde paylasilabilir hash state uretir ve aktif bolumu vurgular.
                      </Text>
                    </section>
                    <section id="ux" className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                      <Text preset="title">UX Standardı</Text>
                      <Text variant="secondary" className="mt-2 block">
                        Bilgi kokusu, derin link ve policy okumalarinda progress kaybi olmadan gezinme saglar.
                      </Text>
                    </section>
                    <section id="security" className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                      <Text preset="title">Security Controls</Text>
                      <Text variant="secondary" className="mt-2 block">
                        Active heading state hem docs-site hem admin policy ekranlari icin tek primitive uzerinden gelir.
                      </Text>
                    </section>
                    <section id="release" className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                      <Text preset="title">Release Evidence</Text>
                      <Text variant="secondary" className="mt-2 block">
                        Doctor evidence ve wave gate ile birlikte kullanildiginda dokuman ve release izlerini ayni dilde toplar.
                      </Text>
                    </section>
                  </div>
                </PreviewPanel>
              </div>
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

  const renderOverviewTab = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <Text variant="secondary">Soldan bir component seç.</Text>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>Kısa Özet</DetailLabel>
          <Text as="div" className="mt-3 text-lg font-semibold text-text-primary">
            {item.name}
          </Text>
          <Text variant="secondary" className="mt-2 block leading-7">
            {item.description}
          </Text>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>{stat.label}</DetailLabel>
                <Text as="div" className="mt-2 text-lg font-semibold text-text-primary">
                  {stat.value}
                </Text>
                <Text variant="secondary" className="mt-1 block text-xs">
                  {stat.note}
                </Text>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>Hızlı Durum</DetailLabel>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Yayın Durumu
              </Text>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone={item.availability === 'exported' ? 'success' : 'info'}>{availabilityLabel[item.availability]}</Badge>
                <Badge tone={item.lifecycle === 'stable' ? 'success' : item.lifecycle === 'beta' ? 'warning' : 'info'}>
                  {statusLabel[item.lifecycle]}
                </Badge>
                <Badge tone={item.demoMode === 'live' ? 'success' : item.demoMode === 'planned' ? 'warning' : 'muted'}>
                  {demoModeLabel[item.demoMode]}
                </Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Wave / Contract
              </Text>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.roadmapWaveId ? <SectionBadge label={item.roadmapWaveId} /> : <Text variant="secondary">Wave yok</Text>}
                {item.acceptanceContractId ? <SectionBadge label={item.acceptanceContractId} /> : null}
              </div>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Etiketler
              </Text>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tags?.length ? item.tags.map((tag) => <SectionBadge key={tag} label={tag} />) : <Text variant="secondary">Etiket yok</Text>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderApiTab = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return <Text variant="secondary">API bilgisi için component seç.</Text>;
    }
    const apiItem = componentApiMap.get(item.name);
    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <DetailLabel>Import</DetailLabel>
            <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-border-subtle bg-surface-muted p-4 text-xs text-text-primary">
              {item.importStatement || 'Planned item — import kapalı'}
            </pre>
          </div>
          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <DetailLabel>API Model</DetailLabel>
            {apiItem ? (
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                  <DetailLabel>Variant Axes</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {apiItem.variantAxes.map((entry) => <SectionBadge key={entry} label={entry} />)}
                  </div>
                </div>
                <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                  <DetailLabel>State Model</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {apiItem.stateModel.map((entry) => <SectionBadge key={entry} label={entry} />)}
                  </div>
                </div>
                <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                  <DetailLabel>Preview Focus</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {apiItem.previewFocus.map((entry) => <SectionBadge key={entry} label={entry} />)}
                  </div>
                </div>
                <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                  <DetailLabel>Regression Focus</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {apiItem.regressionFocus.map((entry) => <SectionBadge key={entry} label={entry} />)}
                  </div>
                </div>
              </div>
            ) : (
              <Text variant="secondary" className="mt-3 block">
                Bu component icin henuz detayli API catalog girdisi yok.
              </Text>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <DetailLabel>Primary Props</DetailLabel>
            {apiItem ? (
              <div className="mt-4 overflow-hidden rounded-3xl border border-border-subtle bg-surface-panel">
                <div className="grid grid-cols-[1.1fr_1.2fr_0.8fr] gap-3 border-b border-border-subtle px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
                  <span>Prop</span>
                  <span>Type</span>
                  <span>Default</span>
                </div>
                <div className="divide-y divide-border-subtle">
                  {apiItem.props.map((prop) => (
                    <div key={prop.name} className="grid grid-cols-1 gap-2 px-4 py-4 md:grid-cols-[1.1fr_1.2fr_0.8fr] md:gap-3">
                      <div>
                        <Text as="div" className="font-semibold text-text-primary">
                          {prop.name}
                        </Text>
                        <Text variant="secondary" className="mt-1 block text-xs leading-5">
                          {prop.description}
                        </Text>
                      </div>
                      <code className="rounded-xl border border-border-subtle bg-surface-muted px-3 py-2 text-xs text-text-primary">
                        {prop.type}
                      </code>
                      <div className="flex items-start gap-2">
                        <code className="rounded-xl border border-border-subtle bg-surface-muted px-3 py-2 text-xs text-text-primary">
                          {prop.default}
                        </code>
                        {prop.required ? <Badge tone="warning">Required</Badge> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Text variant="secondary" className="mt-3 block">
                Props tablosu henuz tanimlanmadi.
              </Text>
            )}
          </div>

          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <DetailLabel>Registry Alanları</DetailLabel>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>Kind</DetailLabel>
                <Text as="div" className="mt-2 font-semibold text-text-primary">{item.kind}</Text>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>Taxonomy</DetailLabel>
                <Text as="div" className="mt-2 font-semibold text-text-primary">{item.taxonomyGroupId}</Text>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>Subgroup</DetailLabel>
                <Text as="div" className="mt-2 font-semibold text-text-primary">{item.taxonomySubgroup}</Text>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>Track</DetailLabel>
                <Text as="div" className="mt-2 font-semibold text-text-primary">{trackMeta[resolveItemTrack(item)].label}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUxTab = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return <Text variant="secondary">UX eşleşmesi için component seç.</Text>;
    }
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>UX Alignment</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.uxPrimaryThemeId ? <SectionBadge label={item.uxPrimaryThemeId} /> : <Text variant="secondary">Primary theme yok</Text>}
            {item.uxPrimarySubthemeId ? <SectionBadge label={item.uxPrimarySubthemeId} /> : <Text variant="secondary">Primary subtheme yok</Text>}
          </div>
        </div>
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>North Star Sections</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.sectionIds?.length ? item.sectionIds.map((sectionId) => <SectionBadge key={sectionId} label={sectionId} />) : <Text variant="secondary">Section yok</Text>}
          </div>
        </div>
      </div>
    );
  };

  const renderQualityTab = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return <Text variant="secondary">Kalite bilgisi için component seç.</Text>;
    }
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>Quality Gates</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.qualityGates?.length ? item.qualityGates.map((gate) => <SectionBadge key={gate} label={gate} />) : <Text variant="secondary">Gate yok</Text>}
          </div>
        </div>
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>Where Used</DetailLabel>
          <div className="mt-4 space-y-2">
            {item.whereUsed.length > 0 ? item.whereUsed.map((filePath) => (
              <div key={filePath} className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-3">
                <div className="break-all text-xs text-text-secondary">{filePath}</div>
              </div>
            )) : <Text variant="secondary">Kullanım bulunamadı.</Text>}
          </div>
        </div>
      </div>
    );
  };

  const renderDetailTabContent = (item: DesignLabIndexItem | null) => {
    switch (detailTab) {
      case 'overview':
        return renderOverviewTab(item);
      case 'demo':
        return renderPreview(item);
      case 'api':
        return renderApiTab(item);
      case 'ux':
        return renderUxTab(item);
      case 'quality':
        return renderQualityTab(item);
      default:
        return renderOverviewTab(item);
    }
  };

  return (
    <div data-testid="design-lab-page" className="min-h-screen bg-surface-canvas">
      <div className="mx-auto max-w-[1880px] px-4 py-5 xl:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
          <span className="font-semibold uppercase tracking-[0.18em] text-text-secondary">Docs</span>
          <span>/</span>
          <span>UI Library</span>
          <span>/</span>
          <span>{selectedGroup?.title ?? trackMeta[activeTrack].label}</span>
          {selectedItem ? (
            <>
              <span>/</span>
              <span className="font-medium text-text-primary">{selectedItem.name}</span>
            </>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)_260px]">
          <aside
            data-testid="design-lab-sidebar"
            className="sticky top-4 flex max-h-[calc(100vh-32px)] min-h-0 flex-col overflow-hidden rounded-[28px] border border-border-subtle bg-surface-default shadow-sm"
          >
            <div className="border-b border-border-subtle px-5 py-5">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                UI Library
              </Text>
              <Text as="div" className="mt-2 text-2xl font-semibold text-text-primary">
                Component Explorer
              </Text>
              <Text variant="secondary" className="mt-2 block text-sm leading-6">
                Material UI tarzı doküman akışında component ailelerini, export durumunu ve canlı demoları tek yerden gez.
              </Text>
              <div className="mt-4">
                <input
                  data-testid="design-lab-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Component ara..."
                  className="h-11 w-full rounded-2xl border border-border-default bg-surface-panel px-4 text-sm text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1"
                  aria-label="UI library arama"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto px-4 py-5">
              <section className="rounded-[24px] border border-border-subtle bg-surface-panel p-3">
                <div className="mb-3 px-2">
                  <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Ürün Ağacı
                  </Text>
                </div>

                <section data-testid="design-lab-track-section" className="space-y-2">
                  {(Object.keys(trackMeta) as DesignLabTrack[]).map((track) => {
                    const active = track === activeTrack;
                    const visual = trackVisualMeta[track];
                    const groupsForTrack = active ? visibleGroups : [];
                    return (
                      <div key={track} className="overflow-hidden rounded-[20px] border border-border-subtle bg-surface-default">
                        <button
                          data-testid={`design-lab-track-${track}`}
                          type="button"
                          onClick={() => setActiveTrack(track)}
                          className={`flex w-full items-start gap-3 px-3 py-3 text-left transition ${
                            active ? 'bg-surface-default' : 'hover:bg-surface-muted'
                          }`}
                        >
                          <span className={`mt-0.5 h-8 w-1.5 shrink-0 rounded-full ${active ? visual.accentClass : 'bg-border-subtle'}`} />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-3">
                              <span className="block text-sm font-semibold text-text-primary">{trackMeta[track].label}</span>
                              <span className="flex items-center gap-2">
                                <Badge tone={active ? visual.badgeTone : 'muted'}>{trackSummary[track]}</Badge>
                                <span className="text-xs text-text-secondary">{active ? '−' : '+'}</span>
                              </span>
                            </span>
                          </span>
                        </button>

                        {active ? (
                          <div className="border-t border-border-subtle px-2 py-2">
                            <section data-testid="design-lab-group-section" className="space-y-1.5">
                              {groupsForTrack.length > 0 ? (
                                groupsForTrack.map((group) => {
                                  const groupActive = selectedGroup?.id === group.id;
                                  return (
                                    <div key={group.id} className="rounded-[18px] border border-border-subtle bg-surface-panel">
                                      <button
                                        data-testid={`design-lab-group-${group.id}`}
                                        type="button"
                                        onClick={() => setSelectedGroupId(group.id)}
                                        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${
                                          groupActive ? 'bg-surface-panel' : 'hover:bg-surface-muted'
                                        }`}
                                      >
                                        <span className={`h-7 w-1.5 shrink-0 rounded-full ${groupActive ? 'bg-action-primary' : 'bg-border-subtle'}`} />
                                        <span className="min-w-0 flex-1">
                                          <span className="block text-sm font-medium text-text-primary">{group.title}</span>
                                        </span>
                                        <span className="flex items-center gap-2">
                                          <Badge tone="muted">{countByGroup.get(group.id) ?? 0}</Badge>
                                          <span className="text-xs text-text-secondary">{groupActive ? '−' : '+'}</span>
                                        </span>
                                      </button>

                                      {groupActive ? (
                                        <div data-testid="design-lab-tree-section" className="border-t border-border-subtle px-2 py-2">
                                          <div className="space-y-2">
                                            {group.subgroups.map((subgroup) => {
                                              const subgroupItems = selectedGroupItemsBySubgroup.get(subgroup) ?? [];
                                              if (subgroupItems.length === 0) return null;
                                              return (
                                                <div
                                                  key={subgroup}
                                                  data-testid={`design-lab-subgroup-${toTestIdSuffix(subgroup)}`}
                                                  className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default"
                                                >
                                                  <div className="flex items-center gap-3 border-b border-border-subtle px-3 py-2.5">
                                                    <span className="h-6 w-1.5 shrink-0 rounded-full bg-action-primary" />
                                                    <span className="min-w-0 flex-1">
                                                      <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
                                                        {subgroup}
                                                      </span>
                                                    </span>
                                                    <Badge tone="muted">{subgroupItems.length}</Badge>
                                                  </div>

                                                  <div className="px-2 py-2">
                                                    <div className="space-y-1">
                                                      {subgroupItems.map((item) => {
                                                        const itemActive = item.name === selectedItem?.name;
                                                        return (
                                                          <button
                                                            key={item.name}
                                                            data-testid={`design-lab-item-${toTestIdSuffix(item.name)}`}
                                                            type="button"
                                                            onClick={() => setSelectedItemName(item.name)}
                                                            className={`flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                                                              itemActive ? 'bg-surface-panel shadow-sm' : 'hover:bg-surface-muted'
                                                            }`}
                                                          >
                                                            <span className={`mt-0.5 h-7 w-1.5 shrink-0 rounded-full ${itemActive ? 'bg-action-primary' : 'bg-transparent'}`} />
                                                            <span className="min-w-0 flex-1">
                                                              <span className="block text-sm font-medium text-text-primary">{item.name}</span>
                                                            </span>
                                                            <span className="shrink-0">
                                                              <Badge tone={item.demoMode === 'live' ? 'success' : item.demoMode === 'planned' ? 'warning' : 'muted'}>
                                                                {statusLabel[item.lifecycle]}
                                                              </Badge>
                                                            </span>
                                                          </button>
                                                        );
                                                      })}
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>
                                  );
                                })
                              ) : (
                                <Text variant="secondary" className="px-3 py-2 text-sm">
                                  Bu track için görünür family yok.
                                </Text>
                              )}
                            </section>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </section>
              </section>
            </div>
          </aside>

          <main className="min-w-0 space-y-5">
            <section
              data-testid="design-lab-detail-hero"
              className="overflow-hidden rounded-[28px] border border-border-subtle bg-surface-default shadow-sm"
            >
              <div className="border-b border-border-subtle px-6 py-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <SectionBadge label={trackMeta[activeTrack].label} />
                      {selectedGroup ? <SectionBadge label={selectedGroup.title} /> : null}
                      {selectedItem?.roadmapWaveId ? <SectionBadge label={selectedItem.roadmapWaveId} /> : null}
                      {selectedItem ? (
                        <Badge tone={selectedItem.lifecycle === 'stable' ? 'success' : selectedItem.lifecycle === 'beta' ? 'warning' : 'info'}>
                          {statusLabel[selectedItem.lifecycle]}
                        </Badge>
                      ) : null}
                    </div>
                    <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                      Component
                    </Text>
                    <Text as="h1" className="mt-2 text-[2.35rem] font-semibold tracking-[-0.03em] text-text-primary">
                      {selectedItem?.name ?? 'Component seç'}
                    </Text>
                    <Text variant="secondary" className="mt-3 block max-w-3xl text-[15px] leading-7">
                      {selectedItem?.description ?? 'Sol menüden bir component seçerek canlı demo, API ve kalite detaylarını inceleyebilirsin.'}
                    </Text>
                  </div>
                  <div className="grid grid-cols-2 gap-3 xl:w-[340px]">
                    {heroStats.map((stat) => (
                      <div key={stat.label} className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                        <DetailLabel>{stat.label}</DetailLabel>
                        <Text as="div" className="mt-2 text-base font-semibold text-text-primary">
                          {stat.value}
                        </Text>
                        <Text variant="secondary" className="mt-1 block text-xs leading-5">
                          {stat.note}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 px-6 py-4">
                {selectedItem ? <Badge tone={selectedItem.availability === 'exported' ? 'success' : 'info'}>{availabilityLabel[selectedItem.availability]}</Badge> : null}
                {selectedItem ? <Badge tone={selectedItem.demoMode === 'live' ? 'success' : selectedItem.demoMode === 'planned' ? 'warning' : 'muted'}>{demoModeLabel[selectedItem.demoMode]}</Badge> : null}
                {selectedItem?.uxPrimaryThemeId ? <SectionBadge label={selectedItem.uxPrimaryThemeId} /> : null}
                {selectedItem?.importStatement ? (
                  <Button variant="secondary" className="ml-auto" onClick={() => handleCopy(selectedItem.importStatement)}>
                    Import kopyala
                  </Button>
                ) : null}
              </div>
              {copied === 'ok' ? <Text variant="secondary" className="px-6 pb-4">Kopyalandı</Text> : null}
              {copied === 'fail' ? <Text variant="secondary" className="px-6 pb-4">Kopyalanamadı</Text> : null}
            </section>

            <section
              data-testid="design-lab-detail-tabs"
              className="sticky top-4 z-10 rounded-[24px] border border-border-subtle bg-surface-default/95 p-2 shadow-sm backdrop-blur"
            >
              <div className="flex flex-wrap gap-2">
                {detailTabMeta.map((tab) => {
                  const active = detailTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      data-testid={`design-lab-tab-${tab.id}`}
                      type="button"
                      onClick={() => setDetailTab(tab.id)}
                      className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                        active
                          ? 'bg-surface-panel text-text-primary shadow-sm'
                          : 'text-text-secondary hover:bg-surface-panel'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section data-testid="design-lab-detail-panel" className="min-w-0">
              {renderDetailTabContent(selectedItem)}
            </section>
          </main>

          <aside className="hidden xl:block">
            <div className="sticky top-4 space-y-4">
              <section className="rounded-[24px] border border-border-subtle bg-surface-default p-4 shadow-sm">
                <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Bu sayfada
                </Text>
                <div className="mt-3 space-y-1.5">
                  {detailTabMeta.map((tab) => {
                    const active = detailTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setDetailTab(tab.id)}
                        className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left transition ${
                          active ? 'bg-surface-panel shadow-sm' : 'hover:bg-surface-panel'
                        }`}
                      >
                        <span className={`text-sm ${active ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>{tab.label}</span>
                        {active ? <span className="h-2.5 w-2.5 rounded-full bg-action-primary" aria-hidden="true" /> : null}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[24px] border border-border-subtle bg-surface-default p-4 shadow-sm">
                <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Library Stats
                </Text>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                    <DetailLabel>Total</DetailLabel>
                    <div className="mt-2 text-xl font-semibold text-text-primary">{summary.total}</div>
                  </div>
                  <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                    <DetailLabel>Exported</DetailLabel>
                    <div className="mt-2 text-xl font-semibold text-text-primary">{summary.exported}</div>
                  </div>
                  <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                    <DetailLabel>Live</DetailLabel>
                    <div className="mt-2 text-xl font-semibold text-text-primary">{summary.liveDemo}</div>
                  </div>
                  <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                    <DetailLabel>Planned</DetailLabel>
                    <div className="mt-2 text-xl font-semibold text-text-primary">{summary.planned}</div>
                  </div>
                </div>
              </section>

              <section className="rounded-[24px] border border-border-subtle bg-surface-default p-4 shadow-sm">
                <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Metadata
                </Text>
                <div className="mt-3 space-y-3">
                  <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                    <DetailLabel>Status</DetailLabel>
                    <Text as="div" className={`mt-2 font-semibold ${selectedItem ? statusToneClass[selectedItem.lifecycle] : 'text-text-secondary'}`}>
                      {selectedItem ? statusLabel[selectedItem.lifecycle] : 'Seçim yok'}
                    </Text>
                  </div>
                  <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                    <DetailLabel>Package</DetailLabel>
                    <Text as="div" className="mt-2 font-semibold text-text-primary">mfe-ui-kit</Text>
                  </div>
                  <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                    <DetailLabel>Contract</DetailLabel>
                    <Text as="div" className="mt-2 break-all text-xs font-medium text-text-primary">
                      {selectedItem?.acceptanceContractId ?? '—'}
                    </Text>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DesignLabPage;
