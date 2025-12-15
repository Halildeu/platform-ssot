import React, { useMemo, useState } from 'react';
import { Button, EntityGridTemplate, Modal, Select, Text } from 'mfe-ui-kit';
import designLabIndexRaw from './design-lab.index.json';
import designLabGroupsRaw from './design-lab.groups.json';

type LabSectionKey = 'shell' | 'grid' | 'form';

type DesignLabGroupsSubgroup = {
  id: string;
  label: string;
};

type DesignLabGroupsGroup = {
  id: string;
  label: string;
  subgroups: DesignLabGroupsSubgroup[];
};

type DesignLabGroups = {
  version: number;
  fallback: {
    group: string;
    subgroup: string;
  };
  groups: DesignLabGroupsGroup[];
};

type DesignLabIndexItem = {
  name: string;
  kind: 'component' | 'hook' | 'function' | 'const';
  importStatement: string;
  whereUsed: string[];
  group: string;
  subgroup: string;
  tags?: string[];
};

type DesignLabIndex = {
  version?: number;
  generatedAt?: string;
  generatedAtUtc?: string;
  items: DesignLabIndexItem[];
};

const designLabIndex = designLabIndexRaw as DesignLabIndex;
const designLabGroups = designLabGroupsRaw as DesignLabGroups;

const copyToClipboard = async (value: string): Promise<boolean> => {
  if (!value) return false;

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Fallback (older browsers / non-secure context)
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

const TabButton: React.FC<{
  active: boolean;
  label: string;
  onClick: () => void;
}> = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center rounded-xl border px-3 py-2 text-sm font-semibold transition ${
      active
        ? 'border-border-default bg-surface-panel text-text-primary shadow-sm'
        : 'border-transparent bg-transparent text-text-secondary hover:bg-surface-muted'
    }`}
  >
    {label}
  </button>
);

export const DesignLabPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeSection, setActiveSection] = useState<LabSectionKey>('shell');
  const [selectedItemName, setSelectedItemName] = useState<string>(() => {
    const preferred = ['Button', 'Text', 'EntityGridTemplate', 'Modal', 'Select'];
    for (const candidate of preferred) {
      if (designLabIndex.items.some((item) => item.name === candidate)) return candidate;
    }
    const firstComponent = designLabIndex.items.find((item) => item.kind === 'component')?.name;
    return firstComponent ?? designLabIndex.items[0]?.name ?? '';
  });
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    const selected = designLabIndex.items.find((item) => item.name === 'Button') ?? designLabIndex.items[0];
    const initialGroup = selected?.group ?? designLabGroups.groups[0]?.id ?? 'actions';
    return [initialGroup];
  });
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formSelectValue, setFormSelectValue] = useState('comfortable');

  const normalizedQuery = query.trim().toLowerCase();

  const groupLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const group of designLabGroups.groups) {
      map.set(group.id, group.label);
    }
    return map;
  }, [designLabGroups.groups]);

  const subgroupLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const group of designLabGroups.groups) {
      for (const subgroup of group.subgroups) {
        map.set(`${group.id}/${subgroup.id}`, subgroup.label);
      }
    }
    return map;
  }, [designLabGroups.groups]);

  const filteredItems = useMemo(() => {
    const items = designLabIndex.items;
    if (!normalizedQuery) return items;
    return items.filter((item) => {
      const groupLabel = groupLabelById.get(item.group) ?? item.group;
      const subgroupLabel = subgroupLabelById.get(`${item.group}/${item.subgroup}`) ?? item.subgroup;
      const tags = (item.tags ?? []).join(' ');
      const haystack = `${item.name} ${groupLabel} ${subgroupLabel} ${tags}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [groupLabelById, normalizedQuery, subgroupLabelById]);

  const selectedItem = useMemo(() => {
    return designLabIndex.items.find((item) => item.name === selectedItemName) ?? null;
  }, [selectedItemName]);

  const selectedImportSnippet = useMemo(() => {
    return selectedItem?.importStatement ?? '';
  }, [selectedItem?.importStatement]);

  const handleSelectItem = (item: DesignLabIndexItem) => {
    setSelectedItemName(item.name);
    setCopied(null);
    if (normalizedQuery) return;
    setExpandedGroups((prev) => (prev.includes(item.group) ? prev : [...prev, item.group]));
  };

  const handleCopySelectedImport = async () => {
    const ok = await copyToClipboard(selectedImportSnippet);
    setCopied(ok ? 'ok' : 'fail');
    window.setTimeout(() => setCopied(null), 1500);
  };

  const gridDemo = useMemo(() => {
    type Row = { id: string; name: string; status: string; updatedAt: string };
    const now = new Date();
    const rows: Row[] = Array.from({ length: 8 }).map((_, index) => ({
      id: String(index + 1),
      name: `Kayıt ${index + 1}`,
      status: index % 3 === 0 ? 'Active' : index % 3 === 1 ? 'Pending' : 'Disabled',
      updatedAt: new Date(now.getTime() - index * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    }));

    return (
      <div className="rounded-3xl border border-border-subtle bg-surface-panel p-4 shadow-sm">
        <Text variant="secondary" className="mb-3 block">
          EntityGridTemplate tema zinciri ile uyumlu çalışmalı; hardcoded/fallback yok.
        </Text>
        <div className="h-[420px]">
          <EntityGridTemplate<Row>
            gridId="design-lab-grid"
            gridSchemaVersion={1}
            dataSourceMode="client"
            rowData={rows}
            total={rows.length}
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
  }, []);

  const shellDemo = (
    <div className="rounded-3xl border border-border-subtle bg-surface-panel p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Text as="div" size="lg" className="font-semibold">
            Shell Demo
          </Text>
          <Text variant="secondary">
            Header/panel/button/input örnekleri.
          </Text>
        </div>
        <Button variant="secondary">Action</Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <div className="mt-4">
        <label className="text-xs font-semibold text-text-secondary" htmlFor="design-lab-input">
          Input
        </label>
        <input
          id="design-lab-input"
          placeholder="Örn: arama..."
          className="mt-2 h-10 w-full rounded-xl border border-border-default bg-surface-default px-3 text-sm text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1"
        />
      </div>
    </div>
  );

  const formDemo = (
    <div className="rounded-3xl border border-border-subtle bg-surface-panel p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Text as="div" size="lg" className="font-semibold">
            Form Demo
          </Text>
          <Text variant="secondary">
            Modal/select örnekleri.
          </Text>
        </div>
        <Button variant="secondary" onClick={() => setFormModalOpen(true)}>
          Modal aç
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Text variant="secondary">Select</Text>
        <Select
          value={formSelectValue}
          onChange={setFormSelectValue}
          options={[
            { value: 'comfortable', label: 'Comfortable' },
            { value: 'compact', label: 'Compact' },
          ]}
        />
      </div>

      <Modal
        open={formModalOpen}
        title="Design Lab Modal"
        onClose={() => setFormModalOpen(false)}
        footer={(
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setFormModalOpen(false)}>
              Kapat
            </Button>
            <Button onClick={() => setFormModalOpen(false)}>
              Kaydet
            </Button>
          </div>
        )}
      >
        <div className="flex flex-col gap-3">
          <Text variant="secondary">
            Bu modal yalnızca demo amaçlıdır.
          </Text>
          <label className="text-xs font-semibold text-text-secondary" htmlFor="design-lab-modal-input">
            Input
          </label>
          <input
            id="design-lab-modal-input"
            placeholder="Örn: değer..."
            className="h-10 rounded-xl border border-border-default bg-surface-default px-3 text-sm text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1"
          />
        </div>
      </Modal>
    </div>
  );

  const demoContent = useMemo(() => {
    switch (activeSection) {
      case 'grid':
        return gridDemo;
      case 'form':
        return formDemo;
      case 'shell':
      default:
        return shellDemo;
    }
  }, [activeSection, formDemo, gridDemo, shellDemo]);

  const countByGroup = useMemo(() => {
    const map = new Map<string, number>();
    for (const group of designLabGroups.groups) {
      map.set(group.id, 0);
    }
    for (const item of filteredItems) {
      map.set(item.group, (map.get(item.group) ?? 0) + 1);
    }
    return map;
  }, [filteredItems]);

  const effectiveExpandedGroups = useMemo(() => {
    if (normalizedQuery) {
      return designLabGroups.groups
        .filter((group) => (countByGroup.get(group.id) ?? 0) > 0)
        .map((group) => group.id);
    }
    return expandedGroups;
  }, [countByGroup, expandedGroups, normalizedQuery]);

  const itemsByGroupAndSubgroup = useMemo(() => {
    const map = new Map<string, Map<string, DesignLabIndexItem[]>>();
    for (const item of filteredItems) {
      const groupMap = map.get(item.group) ?? new Map<string, DesignLabIndexItem[]>();
      const list = groupMap.get(item.subgroup) ?? [];
      list.push(item);
      groupMap.set(item.subgroup, list);
      map.set(item.group, groupMap);
    }
    for (const groupMap of map.values()) {
      for (const [subgroup, list] of groupMap.entries()) {
        groupMap.set(
          subgroup,
          [...list].sort((a, b) => a.name.localeCompare(b.name, 'en')),
        );
      }
    }
    return map;
  }, [filteredItems]);

  const toggleGroup = (groupId: string) => {
    if (normalizedQuery) return;
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]));
  };

  return (
    <div
      data-testid="design-lab-page"
      className="rounded-3xl border border-border-subtle bg-surface-default shadow-sm"
    >
      <div
        data-testid="design-lab-toolbar"
        className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle bg-surface-default px-4 py-3"
      >
        <div className="flex min-w-[240px] flex-1 items-center gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ara (Button, Grid, Modal...)"
            className="h-10 w-full rounded-xl border border-border-default bg-surface-panel px-3 text-sm text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1"
            aria-label="Design lab arama"
          />
          <div className="hidden items-center gap-2 sm:flex">
            <TabButton
              active={activeSection === 'shell'}
              label="Shell"
              onClick={() => setActiveSection('shell')}
            />
            <TabButton
              active={activeSection === 'grid'}
              label="Grid"
              onClick={() => setActiveSection('grid')}
            />
            <TabButton
              active={activeSection === 'form'}
              label="Form"
              onClick={() => setActiveSection('form')}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleCopySelectedImport}
            title="Seçili bileşenin import satırını kopyala"
          >
            Copy import
          </Button>
          {copied === 'ok' ? (
            <Text variant="secondary">Kopyalandı</Text>
          ) : copied === 'fail' ? (
            <Text variant="secondary">Kopyalanamadı</Text>
          ) : null}
        </div>
      </div>

      <div
        className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-[320px_1fr_320px] lg:gap-4 lg:p-4"
        style={{ height: 'calc(100vh - 220px)' }}
      >
	        <aside
	          data-testid="design-lab-tree"
	          className="min-h-0 rounded-3xl border border-border-subtle bg-surface-panel p-3 shadow-sm"
	        >
	          <div className="mb-2 flex items-center justify-between">
	            <Text as="div" className="font-semibold">
	              Catalog
	            </Text>
	            <Text variant="secondary">
	              {filteredItems.length}/{designLabIndex.items.length}
	            </Text>
	          </div>
	          <div className="min-h-0 overflow-auto pr-1">
	            {designLabGroups.groups.map((group) => {
	              const groupCount = countByGroup.get(group.id) ?? 0;
	              const expanded = effectiveExpandedGroups.includes(group.id);
	              return (
	                <div key={group.id} className="mb-3">
	                  <button
	                    type="button"
	                    onClick={() => toggleGroup(group.id)}
	                    disabled={Boolean(normalizedQuery)}
	                    className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition ${
	                      expanded
	                        ? 'border-border-default bg-surface-default shadow-sm'
	                        : 'border-transparent hover:bg-surface-muted'
	                    } ${normalizedQuery ? 'cursor-default opacity-90' : ''}`}
	                  >
	                    <span className="text-sm font-semibold text-text-primary">
	                      {group.label}
	                    </span>
	                    <span className="text-xs font-semibold text-text-secondary">
	                      {groupCount}
	                    </span>
	                  </button>

	                  {expanded ? (
	                    <div className="mt-2 flex flex-col gap-2">
	                      {group.subgroups.map((subgroup) => {
	                        const subgroupItems =
	                          itemsByGroupAndSubgroup.get(group.id)?.get(subgroup.id) ?? [];
	                        if (subgroupItems.length === 0) return null;
	                        return (
	                          <div key={subgroup.id}>
	                            <div className="mb-1 flex items-center justify-between px-2">
	                              <Text as="div" variant="secondary" className="text-xs font-semibold">
	                                {subgroup.label}
	                              </Text>
	                              <Text variant="secondary" className="text-xs">
	                                {subgroupItems.length}
	                              </Text>
	                            </div>
	                            <div className="flex flex-col gap-1">
	                              {subgroupItems.map((item) => {
	                                const active = item.name === selectedItemName;
	                                const unclassified = Boolean(item.tags?.includes('unclassified'));
	                                return (
	                                  <button
	                                    key={item.name}
	                                    type="button"
	                                    onClick={() => handleSelectItem(item)}
	                                    className={`flex w-full items-start justify-between gap-2 rounded-2xl border px-3 py-2 text-left transition ${
	                                      active
	                                        ? 'border-border-default bg-surface-default shadow-sm'
	                                        : 'border-transparent hover:bg-surface-muted'
	                                    }`}
	                                  >
	                                    <span className="flex flex-col gap-0.5">
	                                      <span className="text-sm font-semibold text-text-primary">
	                                        {item.name}
	                                      </span>
	                                      <span className="text-[11px] text-text-secondary">
	                                        {item.kind}
	                                        {unclassified ? ' • unclassified' : ''}
	                                      </span>
	                                    </span>
	                                  </button>
	                                );
	                              })}
	                            </div>
	                          </div>
	                        );
	                      })}
	                      {groupCount === 0 ? (
	                        <Text variant="secondary" className="px-2 text-xs">
	                          Bu grupta eşleşen öğe yok.
	                        </Text>
	                      ) : null}
	                    </div>
	                  ) : null}
	                </div>
	              );
	            })}
	          </div>
	        </aside>

        <section
          data-testid="design-lab-demo"
          className="min-h-0 overflow-auto rounded-3xl border border-border-subtle bg-surface-default p-3 shadow-sm lg:p-4"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <Text as="div" className="font-semibold">
                Demo
              </Text>
	              <Text variant="secondary">
	                Seçili: {selectedItem?.name ?? '—'}
	              </Text>
            </div>
            <div className="flex items-center gap-2">
              <TabButton
                active={activeSection === 'shell'}
                label="Shell"
                onClick={() => setActiveSection('shell')}
              />
              <TabButton
                active={activeSection === 'grid'}
                label="Grid"
                onClick={() => setActiveSection('grid')}
              />
              <TabButton
                active={activeSection === 'form'}
                label="Form"
                onClick={() => setActiveSection('form')}
              />
            </div>
          </div>
          {demoContent}
        </section>

        <aside
          data-testid="design-lab-usage"
          className="min-h-0 rounded-3xl border border-border-subtle bg-surface-panel p-3 shadow-sm"
        >
          <div className="mb-2 flex items-center justify-between">
            <Text as="div" className="font-semibold">
              Usage
            </Text>
	            <Text variant="secondary">
	              {selectedItem?.whereUsed.length ?? 0} file
	            </Text>
          </div>
          <div className="min-h-0 overflow-auto pr-1">
            <div className="rounded-2xl border border-border-subtle bg-surface-default p-3">
              <Text variant="secondary">
                Bu liste `npm -C web run designlab:index` çıktısı olan `design-lab.index.json` üzerinden üretilir.
              </Text>
              {designLabIndex.generatedAt ? (
                <Text variant="secondary" className="mt-2 block text-xs">
                  Son index: {designLabIndex.generatedAt}
                </Text>
              ) : null}
            </div>

            <div className="mt-3 rounded-2xl border border-border-subtle bg-surface-default p-3">
              <Text as="div" className="mb-2 font-semibold">
                Copy import
              </Text>
              <pre className="whitespace-pre-wrap rounded-xl border border-border-subtle bg-surface-muted p-3 text-xs text-text-primary">
                {selectedImportSnippet}
              </pre>
              <div className="mt-2 flex justify-end">
                <Button variant="ghost" onClick={handleCopySelectedImport}>
                  Kopyala
                </Button>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-border-subtle bg-surface-default p-3">
              <Text as="div" className="mb-2 font-semibold">
                Where used
              </Text>
	              {selectedItem && selectedItem.whereUsed.length > 0 ? (
	                <ul className="space-y-2">
	                  {selectedItem.whereUsed.map((filePath) => (
	                    <li
	                      key={filePath}
	                      className="flex items-start justify-between gap-2 rounded-xl border border-border-subtle bg-surface-muted px-3 py-2"
	                    >
                      <span className="min-w-0 break-all text-xs text-text-secondary">
                        {filePath}
                      </span>
                      <Button
                        variant="ghost"
                        onClick={() => copyToClipboard(filePath)}
                        className="shrink-0"
                      >
                        Copy
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <Text variant="secondary">
                  Kullanım bulunamadı.
                </Text>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DesignLabPage;
