import React, { useMemo, useState } from 'react';
import { Boxes, MapIcon, Sparkles } from 'lucide-react';
import {
  Badge,
  Button,
  LibraryProductTree,
  type LibraryProductTreeSelection,
  type LibraryProductTreeTrack,
  Text,
} from 'mfe-ui-kit';
import designLabIndexRaw from './design-lab.index.json';
import designLabTaxonomyRaw from './design-lab.taxonomy.v1.json';

type DesignLabLifecycle = 'stable' | 'beta' | 'planned';
type DesignLabAvailability = 'exported' | 'planned';
type DesignLabDemoMode = 'live' | 'inspector' | 'planned';
type DesignLabTrack = 'new_packages' | 'current_system' | 'roadmap';

type DesignLabIndexItem = {
  name: string;
  kind: 'component' | 'hook' | 'function' | 'const';
  importStatement: string;
  whereUsed: string[];
  availability: DesignLabAvailability;
  lifecycle: DesignLabLifecycle;
  taxonomyGroupId: string;
  taxonomySubgroup: string;
  demoMode: DesignLabDemoMode;
  description: string;
  uxPrimaryThemeId?: string;
  uxPrimarySubthemeId?: string;
  roadmapWaveId?: string;
};

type DesignLabIndex = { items: DesignLabIndexItem[] };

type DesignLabTaxonomyGroup = {
  id: string;
  title: string;
  subgroups: string[];
};

type DesignLabTaxonomy = {
  groups: DesignLabTaxonomyGroup[];
};

const designLabIndex = designLabIndexRaw as DesignLabIndex;
const designLabTaxonomy = designLabTaxonomyRaw as DesignLabTaxonomy;

const availabilityLabel: Record<DesignLabAvailability, string> = {
  exported: 'Exported',
  planned: 'Roadmap',
};

const statusLabel: Record<DesignLabLifecycle, string> = {
  stable: 'Stable',
  beta: 'Beta',
  planned: 'Planned',
};

const resolveItemTrack = (item: DesignLabIndexItem): DesignLabTrack => {
  if (item.availability === 'planned' || item.demoMode === 'planned') return 'roadmap';
  if (item.roadmapWaveId) return 'new_packages';
  return 'current_system';
};

const trackMeta: Record<
  DesignLabTrack,
  {
    label: string;
    icon: React.ReactNode;
    accentClassName: string;
    selectedToneClassName: string;
  }
> = {
  new_packages: {
    label: 'Yeni Paketler',
    icon: <Sparkles className="h-4 w-4 text-action-primary" />,
    accentClassName: 'bg-action-primary',
    selectedToneClassName: 'border-action-primary/35 bg-surface-default',
  },
  current_system: {
    label: 'Eski Sistem',
    icon: <Boxes className="h-4 w-4 text-text-secondary" />,
    accentClassName: 'bg-border-default',
    selectedToneClassName: 'border-border-default bg-surface-default',
  },
  roadmap: {
    label: 'Roadmap',
    icon: <MapIcon className="h-4 w-4 text-state-warning-text" />,
    accentClassName: 'bg-state-warning-border',
    selectedToneClassName: 'border-state-warning-border/40 bg-surface-default',
  },
};

const LabCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="rounded-[24px] border border-border-subtle bg-surface-default p-5 shadow-sm">
    <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
      {title}
    </Text>
    <div className="mt-4">{children}</div>
  </section>
);

const UiLibrarySidebarLabPage: React.FC = () => {
  const tracks = useMemo<LibraryProductTreeTrack[]>(() => {
    return (Object.keys(trackMeta) as DesignLabTrack[]).map((trackId) => {
      const items = designLabIndex.items
        .filter((item) => resolveItemTrack(item) === trackId)
        .sort((a, b) => a.name.localeCompare(b.name, 'en'));

      const groups = designLabTaxonomy.groups
        .map((group) => {
          const subgroups = group.subgroups
            .map((subgroup) => {
              const subgroupItems = items
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

      return {
        id: trackId,
        label: trackMeta[trackId].label,
        eyebrow: 'Track',
        icon: trackMeta[trackId].icon,
        badgeLabel: String(items.length),
        accentClassName: trackMeta[trackId].accentClassName,
        selectedToneClassName: trackMeta[trackId].selectedToneClassName,
        groups,
      };
    });
  }, []);

  const [selection, setSelection] = useState<LibraryProductTreeSelection>({
    trackId: 'new_packages',
    groupId: 'actions',
    subgroupId: 'feedback',
    itemId: 'Button',
  });

  const selectedItem = useMemo(
    () =>
      designLabIndex.items.find(
        (item) =>
          resolveItemTrack(item) === selection.trackId &&
          item.taxonomyGroupId === selection.groupId &&
          item.taxonomySubgroup === selection.subgroupId &&
          item.name === selection.itemId,
      ) ?? null,
    [selection],
  );

  const selectedGroupLabel = useMemo(
    () => designLabTaxonomy.groups.find((group) => group.id === selection.groupId)?.title ?? null,
    [selection.groupId],
  );

  const selectedPath = [
    selection.trackId ? trackMeta[selection.trackId as DesignLabTrack]?.label : null,
    selectedGroupLabel,
    selection.subgroupId,
    selectedItem?.name,
  ].filter(Boolean);

  return (
    <div data-testid="sidebar-lab-page" className="min-h-screen bg-surface-canvas">
      <div className="mx-auto max-w-[1780px] px-4 py-6 xl:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.22em]">
              UI Library / Sidebar Lab
            </Text>
            <Text as="h1" className="mt-2 text-[2.1rem] font-semibold tracking-[-0.03em] text-text-primary">
              Ürün Ağacı Prototipi
            </Text>
            <Text variant="secondary" className="mt-2 block max-w-3xl text-sm leading-7">
              Ağaç davranışı artık kütüphane bileşeninden geliyor. Bu sayfa yalnız veri besliyor; onay verirsen aynı bileşen ana `UI Library` yüzeyine taşınacak.
            </Text>
          </div>
          <Button variant="secondary" onClick={() => window.location.assign('/ui-library')}>Ana UI Library'ye dön</Button>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <aside className="sticky top-4 max-h-[calc(100vh-32px)] overflow-auto rounded-[28px] border border-border-subtle bg-surface-default p-4 shadow-sm">
            <div className="mb-4 px-2">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Product Tree
              </Text>
            </div>
            <LibraryProductTree
              tracks={tracks}
              defaultSelection={selection}
              onSelectionChange={setSelection}
            />
          </aside>

          <div className="space-y-5">
            <LabCard title="Seçili Yol">
              <div className="flex flex-wrap gap-2">
                {selectedPath.map((segment, index) => (
                  <Badge key={`${index}-${segment}`} tone="info">{segment}</Badge>
                ))}
              </div>
            </LabCard>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <LabCard title="Davranış Demosu">
                <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-5">
                  <Text as="div" className="text-2xl font-semibold text-text-primary">
                    {selectedItem?.name ?? 'Component seç'}
                  </Text>
                  <Text variant="secondary" className="mt-2 block leading-7">
                    {selectedItem?.description ?? 'Sol taraftan herhangi bir component seçildiğinde burada detay kartı değişir.'}
                  </Text>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedItem ? <Badge tone={selectedItem.availability === 'exported' ? 'success' : 'warning'}>{availabilityLabel[selectedItem.availability]}</Badge> : null}
                    {selectedItem ? <Badge tone={selectedItem.lifecycle === 'stable' ? 'success' : selectedItem.lifecycle === 'beta' ? 'warning' : 'info'}>{statusLabel[selectedItem.lifecycle]}</Badge> : null}
                    {selectedItem?.roadmapWaveId ? <Badge tone="muted">{selectedItem.roadmapWaveId}</Badge> : null}
                  </div>
                </div>
              </LabCard>

              <LabCard title="UX Kriteri">
                <div className="space-y-3 text-sm text-text-secondary">
                  <p>1. Aynı track, family veya subgroup ikinci tıkta kesin kapanır.</p>
                  <p>2. Üst seviye ikon ve daha güçlü yüzey ile ayrılır.</p>
                  <p>3. Alt seviyeler iç girinti ve daha hafif yüzeyle okunur.</p>
                  <p>4. Bileşeni kullanan sayfa yalnız veri ve seçili sonucu yönetir.</p>
                </div>
              </LabCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UiLibrarySidebarLabPage;
