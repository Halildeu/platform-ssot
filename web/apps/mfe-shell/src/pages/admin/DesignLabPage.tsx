import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Boxes, CircleHelp, MapIcon, Sparkles } from 'lucide-react';
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
  TextArea,
  TextInput,
  Checkbox,
  Radio,
  Switch,
  Slider,
  DatePicker,
  TimePicker,
  Upload,
  TableSimple,
  Descriptions,
  List,
  JsonViewer,
  Tree,
  TreeTable,
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
  LibraryProductTree,
  LibraryDocsSection,
  LibrarySectionBadge as SectionBadge,
  LibraryDetailLabel as DetailLabel,
  LibraryPreviewPanel as PreviewPanel,
  LibraryShowcaseCard,
  LibraryMetricCard,
  LibraryDetailTabs,
  LibraryOutlinePanel,
  LibraryStatsPanel,
  LibraryMetadataPanel,
  type LibraryProductTreeSelection,
  type LibraryProductTreeTrack,
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

const detailTabMeta: Array<{
  id: DesignLabDetailTab;
  label: string;
  description: string;
}> = [
  { id: 'overview', label: 'Overview', description: 'Kısa özet, durum ve karar çerçevesi' },
  { id: 'demo', label: 'Demo', description: 'Aşağı doğru akan çoklu varyant showcase alanı' },
  { id: 'api', label: 'API', description: 'Import, props, variant axes ve state modeli' },
  { id: 'ux', label: 'UX', description: 'UX katalog hizası ve north-star bağları' },
  { id: 'quality', label: 'Quality', description: 'Gate, regression ve kullanım kanıtları' },
];

type ComponentShowcaseSection = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  badges?: string[];
  content: React.ReactNode;
};

const DesignLabPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [detailTab, setDetailTab] = useState<DesignLabDetailTab>('overview');
  const [treeSelection, setTreeSelection] = useState<LibraryProductTreeSelection>({
    trackId: 'new_packages',
    groupId: 'data_display',
    subgroupId: 'Table',
    itemId: 'TableSimple',
  });
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('comfortable');
  const [textInputValue, setTextInputValue] = useState('Nova kullanıcı');
  const [searchInputValue, setSearchInputValue] = useState('Denetim planı');
  const [inviteInputValue, setInviteInputValue] = useState('ops@nova.io');
  const [textAreaValue, setTextAreaValue] = useState(
    'Açıklama alanı inline yardım, hata ve karakter sayacı ile birlikte form deneyimini tamamlar.',
  );
  const [commentValue, setCommentValue] = useState(
    'Bu alan yorum, not ve açıklama akışlarında otomatik yükseklik ile çalışmalı.',
  );
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [radioValue, setRadioValue] = useState<'design' | 'ops' | 'delivery'>('design');
  const [switchValue, setSwitchValue] = useState(true);
  const [sliderValue, setSliderValue] = useState(68);
  const [dateValue, setDateValue] = useState('2026-03-21');
  const [timeValue, setTimeValue] = useState('14:30');
  const [uploadFiles, setUploadFiles] = useState([
    { name: 'policy-draft.pdf', size: 245_000, type: 'application/pdf' },
    { name: 'control-matrix.xlsx', size: 82_000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  ]);
  const policyTableRows = [
    { policy: 'Etik Politikası', owner: 'Uyum', status: 'Aktif', updatedAt: '06 Mar 2026' },
    { policy: 'Hediye & Ağırlama', owner: 'Hukuk', status: 'Taslak', updatedAt: '05 Mar 2026' },
    { policy: 'Çıkar Çatışması', owner: 'İK', status: 'Onay Bekliyor', updatedAt: '04 Mar 2026' },
  ];
  const rolloutDescriptionItems = [
    { key: 'owner', label: 'Sahip', value: 'Uyum Operasyonları', helper: 'Canary ve rollout kararını veren ekip.' },
    { key: 'scope', label: 'Kapsam', value: 'Tüm bağlı ortaklıklar', tone: 'info' as const, span: 2 as const },
    { key: 'status', label: 'Durum', value: 'Aktif', tone: 'success' as const },
    { key: 'review', label: 'Son gözden geçirme', value: '07 Mar 2026', helper: 'Change approval snapshot ile eşli.' },
  ];
  const listItems = [
    {
      key: 'triage',
      title: 'Release evidence triage',
      description: 'Security ve rollout kanıtları tamamlanmadan publish penceresi açılmıyor.',
      meta: 'P0',
      badges: ['Blocked'],
      tone: 'warning' as const,
    },
    {
      key: 'doctor',
      title: 'Frontend doctor summary',
      description: 'UI Library, shell-public ve auth route preset’leri tek raporda toplandı.',
      meta: 'PASS',
      badges: ['Doctor'],
      tone: 'success' as const,
    },
    {
      key: 'residual',
      title: 'Residual risk review',
      description: 'Jackon residual review tarihi yaklaşmadan güncelleme planı hazırlanmalı.',
      meta: 'MEDIUM',
      badges: ['Security'],
      tone: 'info' as const,
    },
  ];
  const jsonViewerValue = {
    release: {
      waveId: 'wave_4_data_display',
      focus: ['TableSimple', 'Descriptions', 'AgGridServer', 'EntityGridTemplate', 'List', 'JsonViewer'],
      evidence: {
        doctor: 'PASS',
        uiKitTests: 'PASS',
        gate: 'PASS',
      },
    },
    policy: {
      rollout: {
        mode: 'doctor-first',
        security: 'fail-closed',
      },
      owners: {
        frontend: 'platform-ui',
        governance: 'ux-catalog',
      },
    },
  };
  const treeNodes = [
    {
      key: 'release',
      label: 'Release Control Plane',
      description: 'Gate, doctor ve security kanitlarini tek hiyerarside toplar.',
      meta: 'root',
      badges: ['Stable'],
      tone: 'info' as const,
      children: [
        {
          key: 'doctor',
          label: 'Doctor evidence',
          description: 'Frontend doctor preset ciktilari.',
          meta: 'PASS',
          badges: ['ui-library'],
          tone: 'success' as const,
          children: [
            {
              key: 'doctor-ui-library',
              label: 'UI Library walkthrough',
              description: 'Console/pageerror ve click-walk sonucu temiz.',
              meta: '5 step',
            },
            {
              key: 'doctor-shell',
              label: 'Shell public preset',
              description: 'Login ve public route zinciri PASS.',
              meta: '3 route',
            },
          ],
        },
        {
          key: 'security',
          label: 'Security contract',
          description: 'Residual risk ve live provisioning kurallari.',
          meta: 'review',
          badges: ['Policy'],
          tone: 'warning' as const,
          children: [
            {
              key: 'security-residual',
              label: 'Residual review',
              description: 'Takvimli kalan riskler zorunlu review ile izlenir.',
              meta: 'Apr-15',
            },
          ],
        },
      ],
    },
  ];
  const treeTableNodes = [
    {
      key: 'platform-ui',
      label: 'Platform UI',
      description: 'Ortak tasarim sistemi owner ekibi.',
      meta: 'stable',
      badges: ['Owner'],
      tone: 'info' as const,
      data: { owner: 'Platform UI', status: 'Stable', scope: 'Global' },
      children: [
        {
          key: 'ui-library-surface',
          label: 'UI Library',
          description: 'Docs, preview ve API katalog yuzeyi.',
          meta: 'wave-4',
          badges: ['Data display'],
          tone: 'success' as const,
          data: { owner: 'Design Ops', status: 'Beta', scope: 'Docs' },
        },
        {
          key: 'delivery-gates',
          label: 'Delivery gates',
          description: 'Wave gate ve doctor evidence zinciri.',
          meta: 'doctor',
          badges: ['QA'],
          tone: 'warning' as const,
          data: { owner: 'Release Ops', status: 'PASS', scope: 'Delivery' },
        },
      ],
    },
  ];
  const [dropdownAction, setDropdownAction] = useState('Henüz seçim yok');
  const [reportStatus, setReportStatus] = useState('Filtre bekleniyor');
  const [tabsValue, setTabsValue] = useState('overview');
  const [paginationPage, setPaginationPage] = useState(6);
  const [stepsValue, setStepsValue] = useState('review');
  const [anchorValue, setAnchorValue] = useState('overview');

  const activeTrack = (treeSelection.trackId as DesignLabTrack | null) ?? 'new_packages';

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
    () => filteredItems.find((item) => item.name === treeSelection.itemId) ?? filteredItems[0] ?? null,
    [filteredItems, treeSelection.itemId],
  );

  const selectedGroup = useMemo(
    () => designLabTaxonomy.groups.find((group) => group.id === treeSelection.groupId) ?? null,
    [treeSelection.groupId],
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

  const detailSectionRefs = useRef<Record<DesignLabDetailTab, HTMLElement | null>>({
    overview: null,
    demo: null,
    api: null,
    ux: null,
    quality: null,
  });

  useEffect(() => {
    setModalOpen(false);
    setFormDrawerOpen(false);
    setDetailDrawerOpen(false);
    setDetailTab('overview');
  }, [selectedItem?.name]);

  useEffect(() => {
    if (!selectedItem) return;

    const nextTrack = resolveItemTrack(selectedItem);
    const nextGroupId = selectedItem.taxonomyGroupId;
    const nextSubgroupId = selectedItem.taxonomySubgroup;
    const nextItemId = selectedItem.name;

    setTreeSelection((current) => {
      if (
        current.trackId === nextTrack &&
        current.groupId === nextGroupId &&
        current.subgroupId === nextSubgroupId &&
        current.itemId === nextItemId
      ) {
        return current;
      }

      return {
        trackId: nextTrack,
        groupId: nextGroupId,
        subgroupId: nextSubgroupId,
        itemId: nextItemId,
      };
    });
  }, [selectedItem]);

  useEffect(() => {
    const sections = detailTabMeta
      .map((entry) => ({ id: entry.id, element: detailSectionRefs.current[entry.id] }))
      .filter((entry): entry is { id: DesignLabDetailTab; element: HTMLElement } => Boolean(entry.element));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);
        const next = visible[0]?.target.id.replace('design-lab-section-', '') as DesignLabDetailTab | undefined;
        if (next) {
          setDetailTab((current) => (current === next ? current : next));
        }
      },
      {
        rootMargin: '-18% 0px -58% 0px',
        threshold: [0.15, 0.4, 0.65],
      },
    );

    sections.forEach((section) => observer.observe(section.element));
    return () => observer.disconnect();
  }, [selectedItem?.name]);

  const scrollToDetailSection = (tabId: DesignLabDetailTab) => {
    setDetailTab(tabId);
    detailSectionRefs.current[tabId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const treeTracks = useMemo<LibraryProductTreeTrack[]>(() => {
    return (Object.keys(trackMeta) as DesignLabTrack[]).map((track) => {
      const trackItems = (track === activeTrack
        ? filteredItems
        : designLabIndex.items.filter((item) => resolveItemTrack(item) === track)
      ).sort((a, b) => a.name.localeCompare(b.name, 'en'));

      const groups = designLabTaxonomy.groups
        .map((group) => {
          const subgroups = group.subgroups
            .map((subgroup) => {
              const subgroupItems = trackItems
                .filter((item) => item.taxonomyGroupId === group.id && item.taxonomySubgroup === subgroup)
                .sort((a, b) => a.name.localeCompare(b.name, 'en'));
              if (!subgroupItems.length) return null;
              return {
                id: subgroup,
                label: subgroup,
                items: subgroupItems.map((item) => ({
                  id: item.name,
                  label: item.name,
                  badgeLabel: statusLabel[item.lifecycle],
                  badgeTone: item.lifecycle === 'stable' ? 'success' : item.lifecycle === 'beta' ? 'warning' : 'info',
                })),
              };
            })
            .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

          if (!subgroups.length) return null;

          const count = subgroups.reduce((sum, subgroup) => sum + subgroup.items.length, 0);
          return {
            id: group.id,
            label: group.title,
            badgeLabel: String(count),
            subgroups,
          };
        })
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

      const trackIcon =
        track === 'new_packages'
          ? <Sparkles className="h-4 w-4 text-action-primary" />
          : track === 'current_system'
            ? <Boxes className="h-4 w-4 text-text-secondary" />
            : <MapIcon className="h-4 w-4 text-state-warning-text" />;

      return {
        id: track,
        label: trackMeta[track].label,
        eyebrow: trackVisualMeta[track].eyebrow,
        icon: trackIcon,
        badgeLabel: String(track === activeTrack ? filteredItems.length : trackSummary[track]),
        accentClassName: trackVisualMeta[track].accentClass,
        selectedToneClassName: `border ${trackVisualMeta[track].borderClass} bg-surface-default`,
        groups,
      };
    });
  }, [activeTrack, filteredItems, trackSummary]);

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
      case 'TextInput':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Label / yardım / sayaç">
                <div className="space-y-4">
                  <TextInput
                    label="Kullanıcı adı"
                    description="Sistemde görünen kısa tanım."
                    hint="Boşluk bırakmadan en fazla 32 karakter."
                    value={textInputValue}
                    maxLength={32}
                    showCount
                    onValueChange={setTextInputValue}
                    leadingVisual={<span aria-hidden="true">@</span>}
                  />
                  <Text variant="secondary" className="block">
                    Aktif değer: {textInputValue}
                  </Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Durum matrisi">
                <div className="grid grid-cols-1 gap-3">
                  <TextInput label="Doğrulanan alan" defaultValue="nova.user" trailingVisual={<span aria-hidden="true">✓</span>} />
                  <TextInput label="Hatalı alan" defaultValue="!" invalid error="En az 3 karakter girilmeli." />
                  <TextInput label="Readonly alan" defaultValue="system-generated" access="readonly" />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'TextArea':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Auto resize / yardım">
                <div className="space-y-4">
                  <TextArea
                    label="Açıklama"
                    description="Uzun içerik alanları için ortak metin girişi."
                    hint="Çok satırlı bilgi girişi için otomatik yükseklik ayarı."
                    value={textAreaValue}
                    rows={3}
                    maxLength={180}
                    showCount
                    resize="auto"
                    onValueChange={setTextAreaValue}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Validation / erişim">
                <div className="grid grid-cols-1 gap-3">
                  <TextArea
                    label="Validation örneği"
                    defaultValue="Eksik açıklama"
                    invalid
                    error="Bu alan en az 20 karakter olmalı."
                    rows={3}
                  />
                  <TextArea label="Readonly not" defaultValue="Sistem logu kullanıcı tarafından değiştirilemez." access="readonly" rows={3} />
                  <TextArea label="Disabled draft" defaultValue="Yayın sonrası kilitlenir." access="disabled" rows={3} />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Checkbox':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled + yardım">
                <div className="space-y-4">
                  <Checkbox
                    label="Yayın sonrası bildirim gönder"
                    description="Akış tamamlandığında paydaşlara otomatik bilgi ver."
                    hint="İşlem anında kapatılabilir."
                    checked={checkboxValue}
                    onCheckedChange={(checked) => setCheckboxValue(checked)}
                  />
                  <Text variant="secondary" className="block">
                    Aktif seçim: {checkboxValue ? 'Açık' : 'Kapalı'}
                  </Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Validation / erişim">
                <div className="grid grid-cols-1 gap-3">
                  <Checkbox label="Eksik onay" invalid error="Devam etmeden önce onay vermelisin." />
                  <Checkbox label="Kısmi seçim" indeterminate hint="Alt seçeneklerin bir bölümü seçili." />
                  <Checkbox label="Readonly seçim" defaultChecked access="readonly" />
                  <Checkbox label="Disabled seçim" access="disabled" />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Radio':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled seçenek grubu">
                <div className="space-y-3">
                  <Radio
                    name="wave-3-radio-demo"
                    value="design"
                    label="Design odaklı"
                    description="Önce görünüm ve doküman kalitesini tamamla."
                    checked={radioValue === 'design'}
                    onCheckedChange={(checked) => {
                      if (checked) setRadioValue('design');
                    }}
                  />
                  <Radio
                    name="wave-3-radio-demo"
                    value="ops"
                    label="Ops odaklı"
                    description="Doctor ve gate kanıtı önce tamamlansın."
                    checked={radioValue === 'ops'}
                    onCheckedChange={(checked) => {
                      if (checked) setRadioValue('ops');
                    }}
                  />
                  <Radio
                    name="wave-3-radio-demo"
                    value="delivery"
                    label="Delivery odaklı"
                    description="Feature sonrası teslim artefact’larını önceliklendir."
                    checked={radioValue === 'delivery'}
                    onCheckedChange={(checked) => {
                      if (checked) setRadioValue('delivery');
                    }}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="State matrix">
                <div className="grid grid-cols-1 gap-3">
                  <Radio name="wave-3-radio-state" value="default" label="Varsayılan seçenek" defaultChecked />
                  <Radio
                    name="wave-3-radio-state"
                    value="invalid"
                    label="Eksik seçim"
                    invalid
                    error="En az bir dağıtım stratejisi seçilmeli."
                  />
                  <Radio name="wave-3-radio-state" value="readonly" label="Readonly seçenek" access="readonly" />
                  <Radio name="wave-3-radio-state" value="disabled" label="Disabled seçenek" access="disabled" />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Switch':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled toggle">
                <div className="space-y-4">
                  <Switch
                    label="Canlı görünürlüğü aç"
                    description="Yayınlanan ekranı son kullanıcıya anında görünür yap."
                    hint="İhtiyaç halinde tekrar kapatabilirsin."
                    checked={switchValue}
                    onCheckedChange={(checked) => setSwitchValue(checked)}
                  />
                  <Text variant="secondary" className="block">
                    Aktif durum: {switchValue ? 'Açık' : 'Kapalı'}
                  </Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title="State matrix">
                <div className="grid grid-cols-1 gap-3">
                  <Switch label="Readonly toggle" defaultChecked access="readonly" />
                  <Switch label="Disabled toggle" access="disabled" />
                  <Switch label="Eksik policy onayı" invalid error="Bu geçiş için ek onay gerekiyor." />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Slider':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled range">
                <div className="space-y-4">
                  <Slider
                    label="Yoğunluk"
                    description="Kart ve tablo boşluk kararını tek kaynaktan yönet."
                    hint="Daha yüksek değer daha ferah görünüm üretir."
                    min={20}
                    max={100}
                    step={4}
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    minLabel="Kompakt"
                    maxLabel="Rahat"
                    valueFormatter={(value) => `${value}%`}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="State matrix">
                <div className="grid grid-cols-1 gap-3">
                  <Slider label="Readonly slider" value={72} access="readonly" valueFormatter={(value) => `${value}%`} />
                  <Slider label="Blocked by policy" defaultValue={36} invalid error="Bu değişim için ek approval gerekiyor." />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'DatePicker':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled date">
                <div className="space-y-4">
                  <DatePicker
                    label="Teslim tarihi"
                    description="Gorevin tamamlanacağı günü planla."
                    hint="Takvim seçimi ile shareable milestone üret."
                    value={dateValue}
                    min="2026-03-08"
                    max="2026-04-30"
                    onValueChange={setDateValue}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="State matrix">
                <div className="grid grid-cols-1 gap-3">
                  <DatePicker label="Readonly date" value="2026-03-09" access="readonly" />
                  <DatePicker label="Invalid milestone" defaultValue="2026-03-01" invalid error="Tarih mevcut release penceresinin dışında." />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'TimePicker':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled time">
                <div className="space-y-4">
                  <TimePicker
                    label="Kesim saati"
                    description="Release penceresindeki uygulama saatini sec."
                    hint="15 dakikalik araliklarla planla."
                    value={timeValue}
                    min="09:00"
                    max="22:00"
                    step={900}
                    onValueChange={setTimeValue}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="State matrix">
                <div className="grid grid-cols-1 gap-3">
                  <TimePicker label="Readonly time" value="18:45" access="readonly" />
                  <TimePicker label="Invalid cutover" defaultValue="23:30" invalid error="Bu saat izinli deployment penceresinin dışında." />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Upload':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled file list">
                <div className="space-y-4">
                  <Upload
                    label="Kanit paketi"
                    description="Release ve approval kanitlarini ayni yerden topla."
                    hint="PDF, XLSX ve ZIP desteklenir."
                    accept=".pdf,.xlsx,.zip"
                    multiple
                    maxFiles={4}
                    files={uploadFiles}
                    onFilesChange={setUploadFiles}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Current payload">
                <LibraryMetricCard
                  label="Selected files"
                  value={`${uploadFiles.length}`}
                  note={uploadFiles.map((file) => file.name).join(', ')}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'TableSimple':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Policy status table">
                <TableSimple
                  caption="Politika portföyü"
                  description="Görev odaklı hafif tablo görünümü."
                  columns={[
                    { key: 'policy', label: 'Politika', accessor: 'policy', emphasis: true, truncate: true },
                    { key: 'owner', label: 'Sahip', accessor: 'owner' },
                    {
                      key: 'status',
                      label: 'Durum',
                      align: 'center',
                      render: (row) => <Badge tone={row.status === 'Aktif' ? 'success' : row.status === 'Taslak' ? 'warning' : 'info'}>{row.status}</Badge>,
                    },
                  ]}
                  rows={policyTableRows}
                  stickyHeader
                />
              </PreviewPanel>
              <PreviewPanel title="Loading + empty">
                <div className="space-y-4">
                  <TableSimple
                    caption="Yüklenen tablo"
                    columns={[
                      { key: 'policy', label: 'Politika', accessor: 'policy' },
                      { key: 'owner', label: 'Sahip', accessor: 'owner' },
                    ]}
                    rows={[]}
                    loading
                  />
                  <TableSimple
                    caption="Boş tablo"
                    columns={[
                      { key: 'policy', label: 'Politika', accessor: 'policy' },
                      { key: 'owner', label: 'Sahip', accessor: 'owner' },
                    ]}
                    rows={[]}
                    emptyStateLabel="Henüz yayınlanmış veri yok."
                    density="compact"
                  />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Descriptions':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Rollout summary">
                <Descriptions
                  title="Canary özeti"
                  description="Rollout owner, scope ve review snapshot tek blokta."
                  items={rolloutDescriptionItems}
                  columns={2}
                />
              </PreviewPanel>
              <PreviewPanel title="Risk / approval panel">
                <Descriptions
                  title="Risk ve onay"
                  items={[
                    { key: 'risk', label: 'Risk Seviyesi', value: 'Medium', tone: 'warning' },
                    { key: 'approval', label: 'Onay Akışı', value: '2/3 tamamlandı', helper: 'Security sign-off bekleniyor.' },
                    { key: 'ticket', label: 'Change ID', value: 'CHG-UI-204', tone: 'info' },
                  ]}
                  columns={1}
                  density="compact"
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'List':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Operational inbox">
                <List
                  title="Release work queue"
                  description="Öncelikli rollout ve kanıt işleri aynı yüzeyde izlenir."
                  items={listItems}
                  selectedKey="doctor"
                />
              </PreviewPanel>
              <PreviewPanel title="Compact selectable">
                <List
                  title="Compact review"
                  density="compact"
                  items={listItems}
                  selectedKey="triage"
                  onItemSelect={() => undefined}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'JsonViewer':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Release evidence payload">
                <JsonViewer
                  title="Wave summary"
                  description="Gate ve doctor kanıtını debug ekranına ihtiyaç duymadan okunur kılar."
                  value={jsonViewerValue}
                  rootLabel="wave"
                  defaultExpandedDepth={2}
                />
              </PreviewPanel>
              <PreviewPanel title="Policy snapshot">
                <JsonViewer
                  title="Policy payload"
                  description="Readonly operational contract yüzeyi."
                  value={jsonViewerValue.policy}
                  rootLabel="policy"
                  defaultExpandedDepth={1}
                  maxHeight={320}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Tree':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Operational hierarchy">
                <Tree
                  title="Delivery hierarchy"
                  description="Gate ve policy sahipligini tek hiyerarside okur."
                  nodes={treeNodes}
                  defaultExpandedKeys={['release', 'doctor']}
                  selectedKey="doctor-ui-library"
                />
              </PreviewPanel>
              <PreviewPanel title="Readonly review">
                <Tree
                  title="Readonly review"
                  density="compact"
                  nodes={treeNodes}
                  defaultExpandedKeys={['release', 'security']}
                  access="readonly"
                  selectedKey="security-residual"
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'TreeTable':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Ownership matrix">
                <TreeTable
                  title="Component ownership"
                  description="Owner, status ve scope bilgisi hiyerarsik satirlarla okunur."
                  nodes={treeTableNodes}
                  defaultExpandedKeys={['platform-ui']}
                  columns={[
                    { key: 'owner', label: 'Owner', accessor: 'owner', emphasis: true },
                    { key: 'status', label: 'Durum', accessor: 'status', align: 'center' },
                    { key: 'scope', label: 'Scope', accessor: 'scope' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Compact review">
                <TreeTable
                  title="Compact matrix"
                  density="compact"
                  nodes={treeTableNodes}
                  defaultExpandedKeys={['platform-ui']}
                  selectedKey="delivery-gates"
                  columns={[
                    { key: 'status', label: 'Durum', accessor: 'status', align: 'center', emphasis: true },
                    { key: 'scope', label: 'Scope', accessor: 'scope' },
                  ]}
                />
              </PreviewPanel>
            </div>
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

  const buildDemoShowcaseSections = (item: DesignLabIndexItem): ComponentShowcaseSection[] => {
    switch (item.name) {
      case 'TextInput':
        return [
          {
            id: 'text-input-profile',
            eyebrow: 'Alternative 01',
            title: 'Profile / account field',
            description: 'Label, açıklama, yardım ve karakter sayacı ile klasik ürün formu akışı.',
            badges: ['form', 'stable', 'count'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Filled account field">
                  <TextInput
                    label="Kullanıcı adı"
                    description="Sistemde görünen kısa tanım."
                    hint="Boşluk bırakmadan en fazla 32 karakter."
                    value={textInputValue}
                    maxLength={32}
                    showCount
                    onValueChange={setTextInputValue}
                    leadingVisual={<span aria-hidden="true">@</span>}
                  />
                </PreviewPanel>
                <PreviewPanel title="Doğru kullanım notu">
                  <Text variant="secondary" className="block leading-7">
                    Birincil form alanı için label, description ve hint aynı yüzeyde görünür. Sayaç sadece karakter
                    baskısı olan alanlarda açılır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-input-search',
            eyebrow: 'Alternative 02',
            title: 'Search / command bar input',
            description: 'Arama ve filtre satırlarında kullanılan daha hızlı, kısa ve aksiyon odaklı varyant.',
            badges: ['search', 'compact', 'leading-icon'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Search">
                  <TextInput
                    label="Arama"
                    description="Kayıt, şirket veya kullanıcı ara."
                    value={searchInputValue}
                    onValueChange={setSearchInputValue}
                    size="sm"
                    leadingVisual={<span aria-hidden="true">⌕</span>}
                    trailingVisual={<SectionBadge label="⌘K" />}
                  />
                </PreviewPanel>
                <PreviewPanel title="Filter row">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                    <TextInput
                      label="Hızlı filtre"
                      defaultValue="policy"
                      size="sm"
                      fullWidth
                      leadingVisual={<span aria-hidden="true">⌕</span>}
                    />
                    <Button variant="secondary" className="sm:self-end">Uygula</Button>
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-input-validation',
            eyebrow: 'Alternative 03',
            title: 'Validation / state matrix',
            description: 'Aynı primitive ile doğrulanan, hatalı ve readonly alan davranışı.',
            badges: ['validation', 'readonly', 'error'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <PreviewPanel title="Success-adjacent">
                  <TextInput
                    label="Doğrulanan alan"
                    defaultValue="nova.user"
                    trailingVisual={<span aria-hidden="true">✓</span>}
                  />
                </PreviewPanel>
                <PreviewPanel title="Invalid">
                  <TextInput label="Hatalı alan" defaultValue="!" invalid error="En az 3 karakter girilmeli." />
                </PreviewPanel>
                <PreviewPanel title="Readonly">
                  <TextInput label="Readonly alan" defaultValue="system-generated" access="readonly" />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-input-density',
            eyebrow: 'Alternative 04',
            title: 'Density / sizing matrix',
            description: 'Aynı API ile küçük, orta ve geniş hit-area seçenekleri.',
            badges: ['sm', 'md', 'lg'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <PreviewPanel title="Small">
                  <TextInput label="Kompakt alan" defaultValue="sm-density" size="sm" />
                </PreviewPanel>
                <PreviewPanel title="Medium">
                  <TextInput label="Varsayılan alan" defaultValue="md-density" size="md" />
                </PreviewPanel>
                <PreviewPanel title="Large">
                  <TextInput label="Vurgulu alan" defaultValue="lg-density" size="lg" trailingVisual={<span aria-hidden="true">→</span>} />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-input-invite',
            eyebrow: 'Alternative 05',
            title: 'Inline action / invite flow',
            description: 'Alan ve aksiyonu aynı blokta gösteren kısa iş akışı örneği.',
            badges: ['action-pair', 'cta', 'task-flow'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_auto]">
                <PreviewPanel title="Invite input">
                  <TextInput
                    label="Davet e-postası"
                    description="Yeni paydaşı ekle."
                    value={inviteInputValue}
                    onValueChange={setInviteInputValue}
                    type="email"
                    leadingVisual={<span aria-hidden="true">✉</span>}
                    trailingVisual={<Badge tone="info">Pending</Badge>}
                  />
                </PreviewPanel>
                <div className="flex items-end">
                  <Button fullWidth={false} trailingVisual={<span aria-hidden="true">→</span>}>
                    Davet gönder
                  </Button>
                </div>
              </div>
            ),
          },
          {
            id: 'text-input-access',
            eyebrow: 'Alternative 06',
            title: 'Policy / access controlled states',
            description: 'Aynı bileşenin readonly, disabled ve hidden politika modları.',
            badges: ['access', 'policy', 'governance'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <PreviewPanel title="Readonly">
                  <TextInput
                    label="Sözleşmeli alan"
                    defaultValue="release-window"
                    access="readonly"
                    hint="Bu alan yalnız sistem tarafından değiştirilir."
                  />
                </PreviewPanel>
                <PreviewPanel title="Disabled">
                  <TextInput
                    label="Kilitleme sonrası"
                    defaultValue="publish-locked"
                    access="disabled"
                    hint="Yayın sonrasında düzenleme kapalı."
                  />
                </PreviewPanel>
                <PreviewPanel title="Rule of thumb">
                  <Text variant="secondary" className="block leading-7">
                    Hidden state sayfada boşluk bırakmamalı; disabled ve readonly ise aynı görünmemeli. Biri pasif,
                    diğeri bilgi taşıyan kilitli durumdur.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'TextArea':
        return [
          {
            id: 'text-area-authoring',
            eyebrow: 'Alternative 01',
            title: 'Authoring / note field',
            description: 'Uzun açıklama yazımı için birincil authoring yüzeyi.',
            badges: ['authoring', 'auto-resize', 'count'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Auto resize">
                  <TextArea
                    label="Açıklama"
                    description="Uzun içerik alanları için ortak metin girişi."
                    hint="Çok satırlı bilgi girişi için otomatik yükseklik ayarı."
                    value={commentValue}
                    rows={3}
                    maxLength={180}
                    showCount
                    resize="auto"
                    onValueChange={setCommentValue}
                  />
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    Authoring yüzeylerinde `auto` resize daha doğal. Audit veya sabit layout alanlarında kontrollü
                    dikey resize tercih edilir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-area-review',
            eyebrow: 'Alternative 02',
            title: 'Review / decision log',
            description: 'Karar, itiraz veya yorum kaydı için okunaklı review alanı.',
            badges: ['review', 'audit', 'multiline'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Reviewer note">
                  <TextArea
                    label="İnceleme notu"
                    defaultValue="Politika metni güncellendi; yayın öncesi hukuk ekibi son gözden geçirmeyi tamamlamalı."
                    rows={5}
                  />
                </PreviewPanel>
                <PreviewPanel title="Readonly audit">
                  <TextArea
                    label="Otomatik oluşturulan log"
                    defaultValue="2026-03-07 12:48 · system-bot -> release evidence dosyasi eklendi."
                    access="readonly"
                    rows={5}
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-area-validation',
            eyebrow: 'Alternative 03',
            title: 'Validation / enforcement',
            description: 'Eksik açıklama, minimum içerik ve kullanıcı geri bildirimi.',
            badges: ['error', 'hint', 'count'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <PreviewPanel title="Invalid">
                  <TextArea
                    label="Validation örneği"
                    defaultValue="Eksik açıklama"
                    invalid
                    error="Bu alan en az 20 karakter olmalı."
                    rows={3}
                  />
                </PreviewPanel>
                <PreviewPanel title="Readonly">
                  <TextArea label="Readonly not" defaultValue="Sistem logu kullanıcı tarafından değiştirilemez." access="readonly" rows={3} />
                </PreviewPanel>
                <PreviewPanel title="Disabled">
                  <TextArea label="Disabled draft" defaultValue="Yayın sonrası kilitlenir." access="disabled" rows={3} />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-area-layout',
            eyebrow: 'Alternative 04',
            title: 'Panel / side-by-side layout',
            description: 'Dar yan panel ve geniş içerik paneli için aynı bileşenin iki yerleşim örneği.',
            badges: ['layout', 'panel', 'responsive'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.8fr_1.2fr]">
                <PreviewPanel title="Side panel">
                  <TextArea label="Kısa not" defaultValue="Kompakt panel notu." rows={3} />
                </PreviewPanel>
                <PreviewPanel title="Primary editor">
                  <TextArea
                    label="Yayın notu"
                    defaultValue="Bu sürümde navigation bileşenleri yeniden düzenlendi, forms wave açıldı ve frontend doctor kanıtı zorunlu hale getirildi."
                    rows={6}
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-area-recipes',
            eyebrow: 'Alternative 05',
            title: 'Recipe summary',
            description: 'Hangi bağlamda hangi TextArea davranışı seçilmeli.',
            badges: ['recipes', 'selection-guide'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <LibraryMetricCard label="Comment" value="auto" note="Yorum ve tartışma akışlarında auto resize." />
                <LibraryMetricCard label="Audit" value="readonly" note="Sistem logu ve immutable kayıt yüzeyleri." />
                <LibraryMetricCard label="Policy" value="vertical" note="Uzun hukuki metinlerde kontrollü resize." />
              </div>
            ),
          },
        ];
      case 'Checkbox':
        return [
          {
            id: 'checkbox-single',
            eyebrow: 'Alternative 01',
            title: 'Single consent',
            description: 'Tek satırlı onay ve bildirim alanı.',
            badges: ['consent', 'single-choice'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled">
                  <Checkbox
                    label="Yayın sonrası bildirim gönder"
                    description="Akış tamamlandığında paydaşlara otomatik bilgi ver."
                    hint="İşlem anında kapatılabilir."
                    checked={checkboxValue}
                    onCheckedChange={(checked) => setCheckboxValue(checked)}
                  />
                </PreviewPanel>
                <PreviewPanel title="Rule of thumb">
                  <Text variant="secondary" className="block leading-7">
                    Tek karar alanlarında checkbox, çok seçenekli ama bağımsız tercihlerde stacked checkbox listesi tercih edilir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'checkbox-states',
            eyebrow: 'Alternative 02',
            title: 'State matrix',
            description: 'Eksik onay, kısmi seçim, readonly ve disabled davranışı.',
            badges: ['invalid', 'indeterminate', 'access'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                <PreviewPanel title="Invalid">
                  <Checkbox label="Eksik onay" invalid error="Devam etmeden önce onay vermelisin." />
                </PreviewPanel>
                <PreviewPanel title="Indeterminate">
                  <Checkbox label="Kısmi seçim" indeterminate hint="Alt seçeneklerin bir bölümü seçili." />
                </PreviewPanel>
                <PreviewPanel title="Readonly">
                  <Checkbox label="Readonly seçim" defaultChecked access="readonly" />
                </PreviewPanel>
                <PreviewPanel title="Disabled">
                  <Checkbox label="Disabled seçim" access="disabled" />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Radio':
        return [
          {
            id: 'radio-choice',
            eyebrow: 'Alternative 01',
            title: 'Single-choice strategy',
            description: 'Bir kararın tek seçenekle seçildiği yönlendirici form yüzeyi.',
            badges: ['single-choice', 'decision'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled group">
                  <div className="space-y-3">
                    <Radio
                      name="wave-3-radio-demo"
                      value="design"
                      label="Design odaklı"
                      description="Önce görünüm ve doküman kalitesini tamamla."
                      checked={radioValue === 'design'}
                      onCheckedChange={(checked) => checked && setRadioValue('design')}
                    />
                    <Radio
                      name="wave-3-radio-demo"
                      value="ops"
                      label="Ops odaklı"
                      description="Doctor ve gate kanıtı önce tamamlansın."
                      checked={radioValue === 'ops'}
                      onCheckedChange={(checked) => checked && setRadioValue('ops')}
                    />
                    <Radio
                      name="wave-3-radio-demo"
                      value="delivery"
                      label="Delivery odaklı"
                      description="Feature sonrası teslim artefact’larını önceliklendir."
                      checked={radioValue === 'delivery'}
                      onCheckedChange={(checked) => checked && setRadioValue('delivery')}
                    />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Selected value">
                  <LibraryMetricCard label="Current selection" value={radioValue} note="Controlled radio state shell tarafından yönetiliyor." />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'radio-states',
            eyebrow: 'Alternative 02',
            title: 'State matrix',
            description: 'Geçersiz, readonly ve disabled radyo durumları.',
            badges: ['invalid', 'readonly', 'disabled'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                <PreviewPanel title="Default">
                  <Radio name="wave-3-radio-state" value="default" label="Varsayılan seçenek" defaultChecked />
                </PreviewPanel>
                <PreviewPanel title="Invalid">
                  <Radio
                    name="wave-3-radio-state"
                    value="invalid"
                    label="Eksik seçim"
                    invalid
                    error="En az bir dağıtım stratejisi seçilmeli."
                  />
                </PreviewPanel>
                <PreviewPanel title="Readonly">
                  <Radio name="wave-3-radio-state" value="readonly" label="Readonly seçenek" access="readonly" />
                </PreviewPanel>
                <PreviewPanel title="Disabled">
                  <Radio name="wave-3-radio-state" value="disabled" label="Disabled seçenek" access="disabled" />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Switch':
        return [
          {
            id: 'switch-live-toggle',
            eyebrow: 'Alternative 01',
            title: 'Live publish switch',
            description: 'Tek toggle ile görünürlük veya rollout durumu değiştiren kontrollü kullanım.',
            badges: ['toggle', 'controlled', 'release'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled toggle">
                  <Switch
                    label="Canlı görünürlüğü aç"
                    description="Yayınlanan ekranı son kullanıcıya anında görünür yap."
                    hint="İhtiyaç halinde tekrar kapatabilirsin."
                    checked={switchValue}
                    onCheckedChange={(checked) => setSwitchValue(checked)}
                  />
                </PreviewPanel>
                <PreviewPanel title="Current status">
                  <LibraryMetricCard
                    label="Live state"
                    value={switchValue ? 'enabled' : 'disabled'}
                    note="Switch değişikliği controlled state ile doğrudan izleniyor."
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'switch-states',
            eyebrow: 'Alternative 02',
            title: 'State matrix',
            description: 'Readonly, disabled ve policy-blocked switch davranışları.',
            badges: ['readonly', 'disabled', 'invalid'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <PreviewPanel title="Readonly">
                  <Switch label="Readonly toggle" defaultChecked access="readonly" />
                </PreviewPanel>
                <PreviewPanel title="Disabled">
                  <Switch label="Disabled toggle" access="disabled" />
                </PreviewPanel>
                <PreviewPanel title="Blocked by policy">
                  <Switch label="Ek onay gerekiyor" invalid error="Bu geçiş için ek onay gerekiyor." />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Slider':
        return [
          {
            id: 'slider-density',
            eyebrow: 'Alternative 01',
            title: 'Density calibration',
            description: 'Alan yoğunluğu ve layout sıkılığı için kontrollü numeric seçim.',
            badges: ['range', 'controlled', 'density'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled slider">
                  <Slider
                    label="Yoğunluk"
                    description="Kart ve tablo boşluk kararını tek kaynaktan yönet."
                    hint="Daha yüksek değer daha ferah görünüm üretir."
                    min={20}
                    max={100}
                    step={4}
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    minLabel="Kompakt"
                    maxLabel="Rahat"
                    valueFormatter={(value) => `${value}%`}
                  />
                </PreviewPanel>
                <PreviewPanel title="Current value">
                  <LibraryMetricCard
                    label="Density"
                    value={`${sliderValue}%`}
                    note="Slider değeri controlled state ile preview ve regression yüzeyine taşınıyor."
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'slider-states',
            eyebrow: 'Alternative 02',
            title: 'Readonly and policy states',
            description: 'Readonly ve blocked by policy senaryolarında range input davranışı.',
            badges: ['readonly', 'invalid', 'policy'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly">
                  <Slider label="Readonly slider" value={72} access="readonly" valueFormatter={(value) => `${value}%`} />
                </PreviewPanel>
                <PreviewPanel title="Policy blocked">
                  <Slider label="Blocked by policy" defaultValue={36} invalid error="Bu değişim için ek approval gerekiyor." />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'DatePicker':
        return [
          {
            id: 'datepicker-milestone',
            eyebrow: 'Alternative 01',
            title: 'Milestone planner',
            description: 'Takvim bazlı teslim tarihi ve rollout günü seçimi.',
            badges: ['calendar', 'milestone', 'controlled'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled date">
                  <DatePicker
                    label="Teslim tarihi"
                    description="Görevin tamamlanacağı günü planla."
                    hint="Takvim seçimi ile shareable milestone üret."
                    value={dateValue}
                    min="2026-03-08"
                    max="2026-04-30"
                    onValueChange={setDateValue}
                  />
                </PreviewPanel>
                <PreviewPanel title="Selected date">
                  <LibraryMetricCard
                    label="Delivery date"
                    value={dateValue}
                    note="DatePicker controlled değerini release ve planning akışına taşıyor."
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'datepicker-states',
            eyebrow: 'Alternative 02',
            title: 'Readonly and validation states',
            description: 'Readonly ve invalid tarih seçimleri için tek shell kontratı.',
            badges: ['readonly', 'invalid', 'date-entry'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly">
                  <DatePicker label="Readonly date" value="2026-03-09" access="readonly" />
                </PreviewPanel>
                <PreviewPanel title="Invalid">
                  <DatePicker label="Invalid milestone" defaultValue="2026-03-01" invalid error="Tarih mevcut release penceresinin dışında." />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'TimePicker':
        return [
          {
            id: 'timepicker-cutover-window',
            eyebrow: 'Alternative 01',
            title: 'Cutover window planner',
            description: 'Deployment, maintenance ve approval pencere saatlerini kontrollü şekilde yönetir.',
            badges: ['time-entry', 'controlled', 'release-window'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled time">
                  <TimePicker
                    label="Kesim saati"
                    description="Bakim penceresindeki uygulama saatini sec."
                    hint="15 dakikalik adimlarla ilerle."
                    value={timeValue}
                    min="09:00"
                    max="22:00"
                    step={900}
                    onValueChange={setTimeValue}
                  />
                </PreviewPanel>
                <PreviewPanel title="Selected time">
                  <LibraryMetricCard
                    label="Cutover time"
                    value={timeValue}
                    note="TimePicker controlled state ile rollout akisini besliyor."
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'timepicker-state-matrix',
            eyebrow: 'Alternative 02',
            title: 'Readonly and invalid states',
            description: 'Readonly ve release-window validation senaryolari ayni shell diliyle gorulur.',
            badges: ['readonly', 'invalid', 'governed-input'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly">
                  <TimePicker label="Readonly time" value="18:45" access="readonly" />
                </PreviewPanel>
                <PreviewPanel title="Invalid">
                  <TimePicker label="Invalid cutover" defaultValue="23:30" invalid error="Bu saat izinli deployment penceresinin dışında." />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Upload':
        return [
          {
            id: 'upload-evidence-pack',
            eyebrow: 'Alternative 01',
            title: 'Evidence pack uploader',
            description: 'Policy, release ve denetim kanitlarini tek alanda toplayan kontrollu upload yuzeyi.',
            badges: ['files', 'multiple', 'evidence'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled upload">
                  <Upload
                    label="Kanit paketi"
                    description="Release ve approval kanitlarini ayni yerden topla."
                    hint="PDF, XLSX ve ZIP desteklenir."
                    accept=".pdf,.xlsx,.zip"
                    multiple
                    maxFiles={4}
                    files={uploadFiles}
                    onFilesChange={setUploadFiles}
                  />
                </PreviewPanel>
                <PreviewPanel title="Payload summary">
                  <LibraryMetricCard
                    label="Files"
                    value={`${uploadFiles.length}`}
                    note={uploadFiles.map((file) => file.name).join(', ')}
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'upload-governed-states',
            eyebrow: 'Alternative 02',
            title: 'Validation and access states',
            description: 'Readonly, disabled ve policy-blocked upload davranislari ayri panelde gorulur.',
            badges: ['readonly', 'disabled', 'invalid'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <PreviewPanel title="Readonly">
                  <Upload label="Readonly upload" files={uploadFiles} access="readonly" />
                </PreviewPanel>
                <PreviewPanel title="Disabled">
                  <Upload label="Disabled upload" access="disabled" />
                </PreviewPanel>
                <PreviewPanel title="Invalid">
                  <Upload label="Eksik kanit" invalid error="En az bir imzali PDF yuklenmeli." />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Modal':
        return [
          {
            id: 'modal-confirm-dialog',
            eyebrow: 'Alternative 01',
            title: 'Confirm / destructive dialog',
            description: 'Yüksek riskli aksiyonlarda karar, ikincil açıklama ve footer action dilini tek overlay shell üzerinde toplar.',
            badges: ['dialog', 'stable', 'confirmation'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <PreviewPanel title="Interactive confirm modal">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={() => setModalOpen(true)}>Modal aç</Button>
                    <SectionBadge label="Riskli aksiyon" />
                  </div>
                  <Modal
                    open={modalOpen}
                    title="Rollout onayı gerekiyor"
                    onClose={() => setModalOpen(false)}
                    footer={(
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Vazgeç</Button>
                        <Button variant="destructive" onClick={() => setModalOpen(false)}>Onayla</Button>
                      </div>
                    )}
                  >
                    <Text variant="secondary" className="block leading-7">
                      Bu adım yayın hattını tetikler. Kullanıcıya risk, kapsam ve dönüş etkisi aynı dialog içinde görünmelidir.
                    </Text>
                  </Modal>
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    Modal, sayfa içi ufak yardım için değil; karar, kesinti, onay ve form odaklı kısa görevler için kullanılmalı.
                    Overlay click ve escape davranışı task riskine göre yönetilir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'modal-audit-readonly',
            eyebrow: 'Alternative 02',
            title: 'Readonly / audit review dialog',
            description: 'Kilitli içerik, readonly inceleme ve kanıt gösterimi için daha sakin modal varyantı.',
            badges: ['readonly', 'audit', 'review'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Review dialog pattern">
                  <div className="rounded-3xl border border-border-subtle bg-surface-canvas p-5">
                    <Text preset="title">Kanıt özeti</Text>
                    <Text variant="secondary" className="mt-3 block leading-7">
                      Dialog içinde readonly metin, ek bilgi ve tek bir kapatma aksiyonu gösterilir. Kullanıcıdan veri
                      beklenmeyen durumlarda dialog dili daha sakin ve düşük gerilimli tutulur.
                    </Text>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge tone="info">Readonly review</Badge>
                      <Badge tone="muted">No inline edit</Badge>
                    </div>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Rule of thumb">
                  <Text variant="secondary" className="block leading-7">
                    Aynı modal primitive hem destructive hem readonly review akışını taşıyabilir; fark, copy ve footer
                    aksiyonlarının sayısı ile tonunda yaratılır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Dropdown':
        return [
          {
            id: 'dropdown-action-menu',
            eyebrow: 'Alternative 01',
            title: 'Action menu',
            description: 'Satır bazlı hızlı aksiyonlar ve overflow menu davranışı için ana kullanım kalıbı.',
            badges: ['menu', 'stable', 'actions'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <PreviewPanel title="Row action menu">
                  <div className="flex flex-wrap items-center gap-3">
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
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    Dropdown bir navigasyon ağacı değildir. Kısa eylem listeleri, satır bazlı işlemler ve bağlamsal hızlandırıcılar
                    için kullanılır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'dropdown-filter-density',
            eyebrow: 'Alternative 02',
            title: 'Filter / density selector',
            description: 'Aynı primitive ile görünüm yoğunluğu ve küçük ayar menülerini yönetir.',
            badges: ['filters', 'density', 'compact'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Density selector">
                  <div className="flex flex-wrap items-center gap-3">
                    <Dropdown
                      trigger={<span>Yoğunluk seç</span>}
                      align="right"
                      items={[
                        { key: 'compact', label: 'Compact' },
                        { key: 'comfortable', label: 'Comfortable' },
                        { key: 'relaxed', label: 'Relaxed' },
                      ]}
                    />
                    <SectionBadge label="right aligned" />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Policy note">
                  <Text variant="secondary" className="block leading-7">
                    Dropdown içeriği kısa kalmalı. Uzun, çok seviyeli ya da açıklama ağırlıklı içerik için popover veya drawer
                    tercih edilir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Tooltip':
        return [
          {
            id: 'tooltip-inline-hint',
            eyebrow: 'Alternative 01',
            title: 'Inline hint / affordance',
            description: 'Dar alanda kısa yardımcı açıklamaları fokus ve hover ile görünür kılar.',
            badges: ['hint', 'beta', 'inline'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
                <PreviewPanel title="Inline help">
                  <div className="flex flex-wrap items-center gap-3">
                    <Tooltip text="Tooltip örneği">
                      <Button variant="secondary">Hover / Focus</Button>
                    </Tooltip>
                    <Tooltip text="Kisa yardim metni yalnizca ek baglam verir.">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface-canvas text-sm font-semibold text-text-secondary">i</span>
                    </Tooltip>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    Tooltip, kritik doğrulama mesajı veya uzun eğitim içeriği taşımaz. Kısa yardım, affordance açıklaması ve ikon
                    etiketleme için uygundur.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'tooltip-policy-guidance',
            eyebrow: 'Alternative 02',
            title: 'Policy / readonly guidance',
            description: 'Readonly veya kontrollü yüzeylerde neden-sonuç bilgisini boğmadan gösterir.',
            badges: ['policy', 'readonly', 'guidance'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly reason">
                  <div className="flex flex-wrap items-center gap-3">
                    <Tooltip text="Bu alan yayın penceresi dışında readonly duruma alınır.">
                      <Button access="readonly" variant="ghost">Readonly alan</Button>
                    </Tooltip>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Rule of thumb">
                  <Text variant="secondary" className="block leading-7">
                    Kullanıcıyı durduracak ya da karar verdirecek içerik tooltip yerine dialog, inline error veya panel yüzeyine
                    taşınmalıdır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'TableSimple':
        return [
          {
            id: 'table-simple-policy-list',
            eyebrow: 'Alternative 01',
            title: 'Policy / owner / status table',
            description: 'Task-critical policy listesini hafif, hızlı ve okunabilir bir tablo ile gösterir.',
            badges: ['table', 'beta', 'status'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Policy matrix">
                  <TableSimple
                    caption="Politika portföyü"
                    description="Owner ve status alanları tek tablo yüzeyinde."
                    columns={[
                      { key: 'policy', label: 'Politika', accessor: 'policy', emphasis: true, truncate: true },
                      { key: 'owner', label: 'Sahip', accessor: 'owner' },
                      {
                        key: 'status',
                        label: 'Durum',
                        align: 'center',
                        render: (row) => <Badge tone={row.status === 'Aktif' ? 'success' : row.status === 'Taslak' ? 'warning' : 'info'}>{row.status}</Badge>,
                      },
                      { key: 'updatedAt', label: 'Güncelleme', accessor: 'updatedAt', align: 'right' },
                    ]}
                    rows={policyTableRows}
                    stickyHeader
                  />
                </PreviewPanel>
                <PreviewPanel title="Guidance">
                  <Text variant="secondary" className="block leading-7">
                    `TableSimple`, ağır grid altyapısına ihtiyaç olmayan görev listeleri için hızlı render, loading ve empty state
                    davranışını tek primitive ile verir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'table-simple-loading-empty',
            eyebrow: 'Alternative 02',
            title: 'Loading and empty states',
            description: 'Aynı primitive loading skeleton ve boş tablo davranışını yerel kopya olmadan sunar.',
            badges: ['loading', 'empty', 'compact'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Loading">
                  <TableSimple
                    caption="Loading tablosu"
                    columns={[
                      { key: 'policy', label: 'Politika', accessor: 'policy' },
                      { key: 'owner', label: 'Sahip', accessor: 'owner' },
                    ]}
                    rows={[]}
                    loading
                  />
                </PreviewPanel>
                <PreviewPanel title="Empty">
                  <TableSimple
                    caption="Boş tablo"
                    columns={[
                      { key: 'policy', label: 'Politika', accessor: 'policy' },
                      { key: 'owner', label: 'Sahip', accessor: 'owner' },
                    ]}
                    rows={[]}
                    emptyStateLabel="Henüz gösterilecek kayıt yok."
                    density="compact"
                  />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Descriptions':
        return [
          {
            id: 'descriptions-rollout-summary',
            eyebrow: 'Alternative 01',
            title: 'Rollout / owner / scope summary',
            description: 'Owner, scope, review ve status bilgilerini hızlı okunur bir key-value yüzeyinde toplar.',
            badges: ['summary', 'beta', 'rollout'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <PreviewPanel title="Primary summary">
                  <Descriptions
                    title="Canary özeti"
                    description="Rollout owner, scope ve review snapshot tek blokta."
                    items={rolloutDescriptionItems}
                    columns={2}
                  />
                </PreviewPanel>
                <PreviewPanel title="Interpretation">
                  <Text variant="secondary" className="block leading-7">
                    `Descriptions`, özellikle drawer, detail panel ve approval yüzeylerinde tekrar eden label-value bloklarını
                    ortaklaştırır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'descriptions-compliance-panel',
            eyebrow: 'Alternative 02',
            title: 'Risk and approval panels',
            description: 'Risk, approval ve control snapshot’larını tone-aware bilgi kartlarıyla taşır.',
            badges: ['risk', 'approval', 'compact'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Approval">
                  <Descriptions
                    title="Risk ve onay"
                    items={[
                      { key: 'risk', label: 'Risk Seviyesi', value: 'Medium', tone: 'warning' },
                      { key: 'approval', label: 'Onay Akışı', value: '2/3 tamamlandı', helper: 'Security sign-off bekleniyor.' },
                      { key: 'ticket', label: 'Change ID', value: 'CHG-UI-204', tone: 'info' },
                    ]}
                    columns={1}
                    density="compact"
                  />
                </PreviewPanel>
                <PreviewPanel title="Ownership">
                  <Descriptions
                    title="Operasyon özeti"
                    items={[
                      { key: 'owner', label: 'Sahip', value: 'Platform UX' },
                      { key: 'window', label: 'Pencere', value: 'Cumartesi 22:00', tone: 'info' },
                      { key: 'signoff', label: 'Sign-off', value: 'Ready', tone: 'success' },
                    ]}
                    columns={1}
                    density="compact"
                  />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'List':
        return [
          {
            id: 'list-operational-inbox',
            eyebrow: 'Alternative 01',
            title: 'Operational inbox / task list',
            description: 'Öncelik, meta ve badge kombinasyonlarını aynı liste yüzeyinde toplar.',
            badges: ['task-list', 'selection', 'beta'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <PreviewPanel title="Review queue">
                  <List
                    title="Deployment work queue"
                    description="Security, doctor ve rollout kanıtları tek yüzeyde okunur."
                    items={listItems}
                    selectedKey="doctor"
                    onItemSelect={() => undefined}
                  />
                </PreviewPanel>
                <PreviewPanel title="Why this matters">
                  <Text variant="secondary" className="block leading-7">
                    `List`, hafif ama durum taşıyan görev akışlarında tablo açmadan seçim, badge ve meta bilgisini birlikte taşır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'list-priority-review',
            eyebrow: 'Alternative 02',
            title: 'Priority / review state matrix',
            description: 'Compact density, blocked item ve tone farklarını görünür kılar.',
            badges: ['compact', 'priority', 'tone'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Compact list">
                  <List
                    density="compact"
                    items={listItems}
                    selectedKey="triage"
                    onItemSelect={() => undefined}
                  />
                </PreviewPanel>
                <PreviewPanel title="Loading and empty">
                  <div className="space-y-4">
                    <List title="Loading queue" loading items={[]} />
                    <List title="Empty queue" items={[]} emptyStateLabel="Gösterilecek görev yok." />
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'JsonViewer':
        return [
          {
            id: 'json-viewer-release-payload',
            eyebrow: 'Alternative 01',
            title: 'Release evidence payload',
            description: 'Wave gate ve doctor özetini okunabilir katmanlı JSON ağacı olarak sunar.',
            badges: ['payload', 'audit', 'beta'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Primary payload">
                  <JsonViewer
                    title="Wave summary"
                    description="Gate ve doctor kanıtı aynı payload altında izlenir."
                    value={jsonViewerValue}
                    rootLabel="wave"
                    defaultExpandedDepth={2}
                  />
                </PreviewPanel>
                <PreviewPanel title="Usage note">
                  <Text variant="secondary" className="block leading-7">
                    `JsonViewer`, debug paneli gibi görünmeden kontrat, config ve kanıt payload’larını son kullanıcıya okunur hale getirir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'json-viewer-policy-config',
            eyebrow: 'Alternative 02',
            title: 'Policy / config snapshot',
            description: 'Daha dar, readonly yapılandırma snapshot’ları için kompakt gösterim.',
            badges: ['policy', 'config', 'readonly'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Policy snapshot">
                  <JsonViewer
                    title="Policy"
                    value={jsonViewerValue.policy}
                    rootLabel="policy"
                    defaultExpandedDepth={1}
                    maxHeight={320}
                  />
                </PreviewPanel>
                <PreviewPanel title="Empty / undefined">
                  <div className="space-y-4">
                    <JsonViewer title="Undefined payload" value={undefined} emptyStateLabel="Payload gelmedi." />
                    <JsonViewer title="Primitive payload" value={{ releaseWindow: 'saturday-22', rollbackReady: true }} rootLabel="config" />
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Tree':
        return [
          {
            id: 'tree-release-governance',
            eyebrow: 'Alternative 01',
            title: 'Release governance hierarchy',
            description: 'Doctor, security ve policy akislarini tek bir hiyerarsik agacta izler.',
            badges: ['tree', 'hierarchy', 'beta'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Hierarchy">
                  <Tree
                    title="Release hierarchy"
                    nodes={treeNodes}
                    defaultExpandedKeys={['release', 'doctor']}
                    selectedKey="doctor-ui-library"
                  />
                </PreviewPanel>
                <PreviewPanel title="Usage note">
                  <Text variant="secondary" className="block leading-7">
                    `Tree`, onay akisi, rollout ownership ve policy kırılımlarında kullanıcıya derinlik hissini bozmadan
                    hiyerarşi sunar.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'tree-readonly-audit',
            eyebrow: 'Alternative 02',
            title: 'Readonly audit tree',
            description: 'Readonly state, compact density ve secili node davranisini birlikte gosterir.',
            badges: ['readonly', 'compact', 'audit'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly tree">
                  <Tree
                    density="compact"
                    nodes={treeNodes}
                    defaultExpandedKeys={['release', 'security']}
                    access="readonly"
                    selectedKey="security-residual"
                  />
                </PreviewPanel>
                <PreviewPanel title="Loading and empty">
                  <div className="space-y-4">
                    <Tree title="Loading tree" loading nodes={[]} />
                    <Tree title="Empty tree" nodes={[]} emptyStateLabel="Hiyerarsi bulunamadi." />
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'TreeTable':
        return [
          {
            id: 'tree-table-ownership-matrix',
            eyebrow: 'Alternative 01',
            title: 'Ownership matrix',
            description: 'TreeTable, owner / status / scope verisini hiyerarsik satirlarla birlestirir.',
            badges: ['matrix', 'hierarchy', 'beta'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Ownership matrix">
                  <TreeTable
                    nodes={treeTableNodes}
                    defaultExpandedKeys={['platform-ui']}
                    columns={[
                      { key: 'owner', label: 'Owner', accessor: 'owner', emphasis: true },
                      { key: 'status', label: 'Durum', accessor: 'status', align: 'center' },
                      { key: 'scope', label: 'Scope', accessor: 'scope' },
                    ]}
                  />
                </PreviewPanel>
                <PreviewPanel title="Usage note">
                  <Text variant="secondary" className="block leading-7">
                    `TreeTable`, entity ya da ownership agacinda hiyerarsiyi kaybetmeden kolonlu karsilastirma yapar.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'tree-table-compact-review',
            eyebrow: 'Alternative 02',
            title: 'Compact review matrix',
            description: 'Compact density, selected row ve loading/empty fallback davranisini birlikte gosterir.',
            badges: ['compact', 'selected', 'fallback'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Compact table">
                  <TreeTable
                    density="compact"
                    nodes={treeTableNodes}
                    defaultExpandedKeys={['platform-ui']}
                    selectedKey="delivery-gates"
                    columns={[
                      { key: 'status', label: 'Durum', accessor: 'status', align: 'center', emphasis: true },
                      { key: 'scope', label: 'Scope', accessor: 'scope' },
                    ]}
                  />
                </PreviewPanel>
                <PreviewPanel title="Loading and empty">
                  <div className="space-y-4">
                    <TreeTable title="Loading matrix" loading nodes={[]} columns={[]} />
                    <TreeTable title="Empty matrix" nodes={[]} columns={[]} emptyStateLabel="Hiyerarsik tablo kaydi yok." />
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'AgGridServer':
        return [
          {
            id: 'ag-grid-server-ownership-list',
            eyebrow: 'Alternative 01',
            title: 'Server-backed ownership matrix',
            description: 'AgGridServer, gateway tarafindan beslenen owner/status listelerini server-side datasource kontratiyla gösterir.',
            badges: ['server-side', 'stable', 'performance'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Server ownership list">
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
                </PreviewPanel>
                <PreviewPanel title="Performance contract">
                  <div className="grid grid-cols-1 gap-3">
                    <LibraryMetricCard label="Datasource" value="server" note="Grid veriyi getData kontratiyla ceker." />
                    <LibraryMetricCard label="Rows" value={`${serverGridRows.length}`} note="Batch-2 demo snapshot verisi." />
                    <LibraryMetricCard label="Surface" value="stable" note="Substrate component; performance contract zorunlu." />
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'ag-grid-server-loading-contract',
            eyebrow: 'Alternative 02',
            title: 'Loading and fallback contract',
            description: 'Datasource, loading ve empty davranisi ayni primitive icinde kalir; ekran seviyesi kopya kod gerekmez.',
            badges: ['loading', 'empty', 'ops'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Operator guidance">
                  <Text variant="secondary" className="block leading-7">
                    `AgGridServer`, server-side pagination ve datasource baglama davranisini tek noktada toplar. Bu sayede
                    ownership listesi, audit query sonucu ve entity registry gibi yuzeyler ayni behavior contract'i kullanir.
                  </Text>
                </PreviewPanel>
                <PreviewPanel title="Evidence focus">
                  <Descriptions
                    title="Regression odagi"
                    density="compact"
                    columns={1}
                    items={[
                      { key: 'datasource', label: 'Datasource', value: 'setServerSideDatasource', tone: 'info' },
                      { key: 'loading', label: 'Loading', value: 'Overlay + request pending', tone: 'warning' },
                      { key: 'failure', label: 'Failure', value: 'fail callback', tone: 'danger' },
                    ]}
                  />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'EntityGridTemplate':
        return [
          {
            id: 'entity-grid-template-client-registry',
            eyebrow: 'Alternative 01',
            title: 'Client-side entity registry',
            description: 'Toolbar, variant ve sayfalama davranisini tek entity template yuzeyinde toplar.',
            badges: ['client', 'stable', 'toolbar'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Entity registry">
                  <div className="h-[420px]">
                    <EntityGridTemplate<Record<string, unknown>>
                      gridId="design-lab-entity-grid-client"
                      gridSchemaVersion={1}
                      dataSourceMode="client"
                      rowData={gridRows}
                      total={gridRows.length}
                      page={1}
                      pageSize={25}
                      columnDefs={[
                        { field: 'name', headerName: 'Isim', flex: 1 },
                        { field: 'status', headerName: 'Durum', width: 140 },
                        { field: 'updatedAt', headerName: 'Guncelleme', width: 140 },
                      ]}
                    />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Template value">
                  <Text variant="secondary" className="block leading-7">
                    `EntityGridTemplate`, toolbar, varyant secimi, pagination ve theme akslarini tek substrate bileşeninde
                    birlestirir. Client-side liste ekranlari icin ayrı shell kodu yazmak zorunda kalmazsin.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'entity-grid-template-server-mode',
            eyebrow: 'Alternative 02',
            title: 'Server-side toolbar and datasource mode',
            description: 'Ayni template, server mode calisirken datasource ve toolbar davranisini korur.',
            badges: ['server', 'variant', 'mode-switch'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Server mode">
                  <div className="h-[420px]">
                    <EntityGridTemplate<Record<string, unknown>>
                      gridId="design-lab-entity-grid-server"
                      gridSchemaVersion={2}
                      dataSourceMode="server"
                      total={serverGridRows.length}
                      page={1}
                      pageSize={25}
                      columnDefs={[
                        { field: 'id', headerName: 'ID', width: 120 },
                        { field: 'name', headerName: 'Kaynak', flex: 1 },
                        { field: 'owner', headerName: 'Owner', width: 180 },
                      ]}
                      createServerSideDatasource={() => ({
                        getRows: async (params: {
                          success: (payload: { rowData: unknown[]; rowCount: number }) => void;
                        }) => {
                          params.success({ rowData: serverGridRows, rowCount: serverGridRows.length });
                        },
                      })}
                    />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Regression contract">
                  <Descriptions
                    title="Template odagi"
                    density="compact"
                    columns={1}
                    items={[
                      { key: 'mode', label: 'Mode switch', value: 'client -> server', tone: 'info' },
                      { key: 'toolbar', label: 'Toolbar', value: 'Tema / Filtre / Varyant', tone: 'success' },
                      { key: 'datasource', label: 'Datasource', value: 'createServerSideDatasource', tone: 'warning' },
                    ]}
                  />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      default:
        return [
          {
            id: `${toTestIdSuffix(item.name)}-default-preview`,
            eyebrow: 'Preview',
            title: `${item.name} live preview`,
            description: item.description,
            badges: [statusLabel[item.lifecycle], demoModeLabel[item.demoMode]],
            content: renderLivePreview(item),
          },
        ];
    }
  };

  const renderDemoSection = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return <Text variant="secondary">Canlı showcase için component seç.</Text>;
    }

    if (item.availability === 'planned' || item.demoMode === 'planned') {
      return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <LibraryShowcaseCard
            eyebrow="Roadmap"
            title={`${item.name} henüz release edilmedi`}
            description="Bu item planlı backlog seviyesinde. Export, live demo ve regression kanıtı tamamlanmadan canlı showcase açılmaz."
            badges={<Tag tone="info">Planned item</Tag>}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <LibraryMetricCard label="Release gate" value="blocked" note="Implementation + registry sync + preview gerektirir." />
              <LibraryMetricCard label="Wave" value={item.roadmapWaveId ?? '—'} note="Roadmap wave hizası." />
            </div>
          </LibraryShowcaseCard>
          <LibraryShowcaseCard
            eyebrow="North Star"
            title="Bu bileşen nerede kullanılacak?"
            description="Roadmap item olduğu için önce UX ve quality kontratı netleşir, sonra export edilir."
          >
            <div className="flex flex-wrap gap-2">
              {item.sectionIds.map((sectionId) => <SectionBadge key={sectionId} label={sectionId} />)}
            </div>
          </LibraryShowcaseCard>
        </div>
      );
    }

    const showcaseSections = buildDemoShowcaseSections(item);

    return (
      <div className="space-y-5">
        <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {showcaseSections.map((section, index) => (
              <SectionBadge key={section.id} label={`${String(index + 1).padStart(2, '0')} · ${section.title}`} />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {showcaseSections.map((section) => (
            <LibraryShowcaseCard
              key={section.id}
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
              badges={
                section.badges?.length
                  ? section.badges.map((badge) => <SectionBadge key={badge} label={badge} />)
                  : undefined
              }
            >
              {section.content}
            </LibraryShowcaseCard>
          ))}
        </div>
      </div>
    );
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

  const renderDetailTabContent = (item: DesignLabIndexItem | null) => (
    <div className="space-y-5">
      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.overview = node;
        }}
        id="design-lab-section-overview"
        eyebrow="Section 01"
        title="Overview"
        description="Bileşenin rolü, yayın durumu ve karar çerçevesi."
        className="scroll-mt-32"
      >
        <div data-detail-section-id="overview">{renderOverviewTab(item)}</div>
      </LibraryDocsSection>

      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.demo = node;
        }}
        id="design-lab-section-demo"
        eyebrow="Section 02"
        title="Demo Gallery"
        description="Ant Design ve Material UI benzeri tek sayfa showcase akışı. Seçili component için bütün alternatifler aşağı doğru görünür."
        actions={
          item?.importStatement ? (
            <Button variant="secondary" onClick={() => handleCopy(item.importStatement)}>
              Import kopyala
            </Button>
          ) : undefined
        }
        className="scroll-mt-32"
      >
        <div data-detail-section-id="demo">{renderDemoSection(item)}</div>
      </LibraryDocsSection>

      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.api = node;
        }}
        id="design-lab-section-api"
        eyebrow="Section 03"
        title="API"
        description="Import, props, variant axes ve regression focus bilgisi."
        className="scroll-mt-32"
      >
        <div data-detail-section-id="api">{renderApiTab(item)}</div>
      </LibraryDocsSection>

      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.ux = node;
        }}
        id="design-lab-section-ux"
        eyebrow="Section 04"
        title="UX Alignment"
        description="UX katalog hizası ve north-star section bağları."
        className="scroll-mt-32"
      >
        <div data-detail-section-id="ux">{renderUxTab(item)}</div>
      </LibraryDocsSection>

      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.quality = node;
        }}
        id="design-lab-section-quality"
        eyebrow="Section 05"
        title="Quality"
        description="Gate, usage ve regression evidence katmanı."
        className="scroll-mt-32"
      >
        <div data-detail-section-id="quality">{renderQualityTab(item)}</div>
      </LibraryDocsSection>
    </div>
  );

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
              <div className="mt-2 flex items-center justify-between gap-3">
                <Text as="div" className="text-2xl font-semibold text-text-primary">
                  Component Explorer
                </Text>
                <Tooltip text="Component ailelerini, export durumunu ve canlı demoları tek bir doküman akışında gezmek için kullan.">
                  <span className="shrink-0">
                    <IconButton
                      icon={<CircleHelp className="h-4 w-4" />}
                      label="Component Explorer yardımı"
                      size="sm"
                      variant="ghost"
                    />
                  </span>
                </Tooltip>
              </div>
              <div className="mt-3">
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

                <LibraryProductTree
                  tracks={treeTracks}
                  selection={treeSelection}
                  defaultSelection={treeSelection}
                  onSelectionChange={setTreeSelection}
                  testIdPrefix="design-lab"
                />
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
                      <LibraryMetricCard key={stat.label} label={stat.label} value={stat.value} note={stat.note} />
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

            <div data-testid="design-lab-detail-tabs">
              <LibraryDetailTabs
                tabs={detailTabMeta}
                activeTabId={detailTab}
                onTabChange={(tabId) => scrollToDetailSection(tabId as DesignLabDetailTab)}
                testIdPrefix="design-lab"
              />
            </div>

            <section data-testid="design-lab-detail-panel" className="min-w-0">
              {renderDetailTabContent(selectedItem)}
            </section>
          </main>

          <aside className="hidden xl:block">
            <div className="sticky top-4 space-y-4">
              <LibraryOutlinePanel
                items={detailTabMeta.map((tab) => ({ id: tab.id, label: tab.label }))}
                activeItemId={detailTab}
                onItemSelect={(tabId) => scrollToDetailSection(tabId as DesignLabDetailTab)}
              />

              <LibraryStatsPanel
                items={[
                  { label: 'Total', value: summary.total },
                  { label: 'Exported', value: summary.exported },
                  { label: 'Live', value: summary.liveDemo },
                  { label: 'Planned', value: summary.planned },
                ]}
              />

              <LibraryMetadataPanel
                items={[
                  {
                    label: 'Status',
                    value: (
                      <Text as="div" className={`font-semibold ${selectedItem ? statusToneClass[selectedItem.lifecycle] : 'text-text-secondary'}`}>
                        {selectedItem ? statusLabel[selectedItem.lifecycle] : 'Seçim yok'}
                      </Text>
                    ),
                  },
                  {
                    label: 'Package',
                    value: <Text as="div" className="font-semibold text-text-primary">mfe-ui-kit</Text>,
                  },
                  {
                    label: 'Contract',
                    value: (
                      <Text as="div" className="break-all text-xs font-medium text-text-primary">
                        {selectedItem?.acceptanceContractId ?? '—'}
                      </Text>
                    ),
                  },
                ]}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DesignLabPage;
