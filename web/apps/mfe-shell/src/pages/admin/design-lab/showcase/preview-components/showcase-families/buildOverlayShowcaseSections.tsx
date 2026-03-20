import React from 'react';
import {
  Badge,
  Button,
  ContextMenu,
  DetailDrawer,
  Dropdown,
  FormDrawer,
  Modal,
  Popover,
  Select,
  Tag,
  Text,
  TextInput,
  Tooltip,
  TourCoachmarks,
} from '@mfe/design-system';
import {
  LibraryMetricCard,
  LibrarySectionBadge as SectionBadge,
} from '../../../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import type {
  ComponentShowcaseSection,
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type OverlayShowcaseContext = {
  PreviewPanel: PreviewPanelComponent;
  contextMenuAction: string;
  contextMenuMessages: Record<string, string>;
  detailDrawerOpen: boolean;
  dropdownAction: string;
  formDrawerOpen: boolean;
  modalOpen: boolean;
  readonlyFormDrawerOpen: boolean;
  selectValue: string;
  setContextMenuAction: (nextValue: string) => void;
  setDetailDrawerOpen: (nextValue: boolean) => void;
  setDropdownAction: (nextValue: string) => void;
  setFormDrawerOpen: (nextValue: boolean) => void;
  setModalOpen: (nextValue: boolean) => void;
  setReadonlyFormDrawerOpen: (nextValue: boolean) => void;
  setSelectValue: (nextValue: string) => void;
  setTextInputValue: (nextValue: string) => void;
  setTourOpen: (nextValue: boolean) => void;
  setTourStatus: (nextValue: string) => void;
  setTourStep: (nextValue: number) => void;
  t: DesignLabTranslate;
  textInputValue: string;
  tourCoachmarksLocaleText: React.ComponentProps<typeof TourCoachmarks>['localeText'];
  tourOpen: boolean;
  tourStatus: string;
  tourStep: number;
};

export const buildOverlayShowcaseSections = (
  componentName: string,
  context: OverlayShowcaseContext,
): ComponentShowcaseSection[] | null => {
  const {
    PreviewPanel,
    contextMenuAction,
    contextMenuMessages,
    detailDrawerOpen,
    dropdownAction,
    formDrawerOpen,
    modalOpen,
    readonlyFormDrawerOpen,
    selectValue,
    setContextMenuAction,
    setDetailDrawerOpen,
    setDropdownAction,
    setFormDrawerOpen,
    setModalOpen,
    setReadonlyFormDrawerOpen,
    setSelectValue,
    setTextInputValue,
    setTourOpen,
    setTourStatus,
    setTourStep,
    t,
    textInputValue,
    tourCoachmarksLocaleText,
    tourOpen,
    tourStatus,
    tourStep,
  } = context;

  switch (componentName) {
    case 'Modal':
      return [
        {
          id: 'modal-confirm-dialog',
          eyebrow: t('designlab.showcase.component.modal.sections.confirm.eyebrow'),
          title: t('designlab.showcase.component.modal.sections.confirm.title'),
          description: t('designlab.showcase.component.modal.sections.confirm.description'),
          badges: [
            t('designlab.showcase.component.modal.sections.confirm.badge.dialog'),
            t('designlab.showcase.component.modal.sections.confirm.badge.stable'),
            t('designlab.showcase.component.modal.sections.confirm.badge.confirmation'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title={t('designlab.showcase.component.modal.sections.confirm.panelInteractive')}>
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={() => setModalOpen(true)}>{t('designlab.showcase.component.modal.sections.confirm.open')}</Button>
                  <SectionBadge label={t('designlab.showcase.component.modal.sections.confirm.sectionBadge')} />
                </div>
                <Modal
                  open={modalOpen}
                  title={t('designlab.showcase.component.modal.sections.confirm.card.title')}
                  onClose={() => setModalOpen(false)}
                  footer={(
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setModalOpen(false)}>
                        {t('designlab.showcase.component.modal.sections.confirm.card.cancel')}
                      </Button>
                      <Button variant="danger" onClick={() => setModalOpen(false)}>
                        {t('designlab.showcase.component.modal.sections.confirm.card.confirm')}
                      </Button>
                    </div>
                  )}
                >
                  <Text variant="secondary" className="block leading-7">
                    {t('designlab.showcase.component.modal.sections.confirm.card.body')}
                  </Text>
                </Modal>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.modal.sections.confirm.panelGuideline')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.modal.sections.confirm.guideline')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'modal-audit-readonly',
          eyebrow: t('designlab.showcase.component.modal.sections.readonly.eyebrow'),
          title: t('designlab.showcase.component.modal.sections.readonly.title'),
          description: t('designlab.showcase.component.modal.sections.readonly.description'),
          badges: [
            t('designlab.showcase.component.modal.sections.readonly.badge.readonly'),
            t('designlab.showcase.component.modal.sections.readonly.badge.audit'),
            t('designlab.showcase.component.modal.sections.readonly.badge.review'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.modal.sections.readonly.panelReview')}>
                <div className="rounded-3xl border border-border-subtle bg-surface-canvas p-5">
                  <Text preset="title">{t('designlab.showcase.component.modal.sections.readonly.card.title')}</Text>
                  <Text variant="secondary" className="mt-3 block leading-7">
                    {t('designlab.showcase.component.modal.sections.readonly.card.body')}
                  </Text>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge tone="info">{t('designlab.showcase.component.modal.sections.readonly.card.badgeReview')}</Badge>
                    <Badge tone="muted">{t('designlab.showcase.component.modal.sections.readonly.card.badgeNoEdit')}</Badge>
                  </div>
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.modal.sections.readonly.panelRule')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.modal.sections.readonly.rule')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'modal-surface-recipes',
          eyebrow: 'Overlay recipes',
          title: 'Surface reçeteleri',
          description: 'Confirm, destructive ve audit modal dillerini aynı karar yüzeyinde karşılaştırmalı gösterir.',
          badges: ['surface', 'confirm', 'audit'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Confirm yüzeyi">
                <div className="rounded-3xl border border-border-subtle bg-surface-default p-4 shadow-sm">
                  <Text preset="title">Onay modalı</Text>
                  <Text variant="secondary" className="mt-2 block leading-7">
                    Hafif vurgu, sakin aksiyon seti ve düşük riskli akışlar için uygun bir dil üretir.
                  </Text>
                  <div className="mt-4 flex gap-2">
                    <Badge tone="info">confirm</Badge>
                    <SectionBadge label="primary + secondary" />
                  </div>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Destructive yüzeyi">
                <div className="rounded-3xl border border-state-danger-border bg-state-danger-bg/60 p-4 shadow-sm">
                  <Text preset="title" className="text-state-danger-text">Yıkıcı modal</Text>
                  <Text className="mt-2 block leading-7 text-state-danger-text/90">
                    Silme, reset veya erişim kaldırma gibi geri alınamaz işlemler için daha sert bir sınır kullanır.
                  </Text>
                  <div className="mt-4 flex gap-2">
                    <Badge tone="danger">destructive</Badge>
                    <SectionBadge label="confirm only" />
                  </div>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Audit yüzeyi">
                <div className="rounded-3xl border border-border-subtle bg-surface-canvas p-4 shadow-sm">
                  <Text preset="title">Audit modalı</Text>
                  <Text variant="secondary" className="mt-2 block leading-7">
                    Kanıt, kaynak ve karar bağlamını daha sakin ama yoğun bir yüzeyde toplar.
                  </Text>
                  <div className="mt-4 flex gap-2">
                    <Badge tone="muted">audit</Badge>
                    <SectionBadge label="read-heavy" />
                  </div>
                </div>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'Dropdown':
      return [
        {
          id: 'dropdown-action-menu',
          eyebrow: t('designlab.showcase.component.dropdown.sections.action.eyebrow'),
          title: t('designlab.showcase.component.dropdown.sections.action.title'),
          description: t('designlab.showcase.component.dropdown.sections.action.description'),
          badges: [
            t('designlab.showcase.component.dropdown.sections.action.badge.menu'),
            t('designlab.showcase.component.dropdown.sections.action.badge.stable'),
            t('designlab.showcase.component.dropdown.sections.action.badge.actions'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title={t('designlab.showcase.component.dropdown.sections.action.panelRow')}>
                <div className="flex flex-wrap items-center gap-3">
                  <Dropdown
                    items={[
                      { key: 'publish', label: t('designlab.showcase.component.dropdown.sections.action.item.publish'), onClick: () => setDropdownAction('publish') },
                      { key: 'duplicate', label: t('designlab.showcase.component.dropdown.sections.action.item.duplicate'), onClick: () => setDropdownAction('duplicate') },
                      { key: 'archive', label: t('designlab.showcase.component.dropdown.sections.action.item.archive'), onClick: () => setDropdownAction('archive') },
                    ]}
                  >
                    <span>{t('designlab.showcase.component.dropdown.sections.action.trigger')}</span>
                  </Dropdown>
                  <Text variant="secondary">
                    {t('designlab.showcase.component.dropdown.sections.action.selection', { value: dropdownAction })}
                  </Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.dropdown.sections.action.panelGuideline')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.dropdown.sections.action.guideline')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'dropdown-filter-density',
          eyebrow: t('designlab.showcase.component.dropdown.sections.density.eyebrow'),
          title: t('designlab.showcase.component.dropdown.sections.density.title'),
          description: t('designlab.showcase.component.dropdown.sections.density.description'),
          badges: [
            t('designlab.showcase.component.dropdown.sections.density.badge.filters'),
            t('designlab.showcase.component.dropdown.sections.density.badge.density'),
            t('designlab.showcase.component.dropdown.sections.density.badge.compact'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.dropdown.sections.density.panelSelector')}>
                <div className="flex flex-wrap items-center gap-3">
                  <Dropdown
                    placement="bottom-end"
                    items={[
                      { key: 'compact', label: t('designlab.showcase.component.dropdown.sections.density.item.compact') },
                      { key: 'comfortable', label: t('designlab.showcase.component.dropdown.sections.density.item.comfortable') },
                      { key: 'relaxed', label: t('designlab.showcase.component.dropdown.sections.density.item.relaxed') },
                    ]}
                  >
                    <span>{t('designlab.showcase.component.dropdown.sections.density.trigger')}</span>
                  </Dropdown>
                  <SectionBadge label={t('designlab.showcase.component.dropdown.sections.density.sectionBadge')} />
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.dropdown.sections.density.panelPolicy')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.dropdown.sections.density.policyNote')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'dropdown-rich-command',
          eyebrow: 'Rich command menus',
          title: 'Zengin komut menüsü',
          description: 'İkon, kısayol, açıklama ve alt menü desteği ile daha ürünleşmiş action menu kullanımı gösterir.',
          badges: ['rich-items', 'submenu', 'shortcuts'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Komut menüsü">
                <div className="flex flex-wrap items-center gap-3">
                  <Dropdown
                    placement="bottom-end"
                    items={[
                      { type: 'label' as const, label: 'Hızlı işlemler' },
                      {
                        key: 'new-variant',
                        label: 'Yeni varyant',
                        description: 'Aktif görünümden kopya üretir',
                        icon: <span aria-hidden="true">✦</span>,
                        onClick: () => setDropdownAction('new-variant'),
                      },
                      {
                        key: 'duplicate',
                        label: 'Kopya oluştur',
                        description: 'Mevcut ayarları yeni draft olarak çoğaltır',
                        icon: <span aria-hidden="true">⧉</span>,
                        onClick: () => setDropdownAction('duplicate'),
                      },
                      { type: 'separator' as const },
                      { type: 'label' as const, label: 'Görünüm' },
                      {
                        key: 'density',
                        label: 'Yoğunluk',
                        icon: <span aria-hidden="true">≋</span>,
                        onClick: () => setDropdownAction('density'),
                      },
                      { type: 'separator' as const },
                      { type: 'label' as const, label: 'Yayın' },
                      {
                        key: 'publish',
                        label: 'Yayına al',
                        icon: <span aria-hidden="true">↑</span>,
                        onClick: () => setDropdownAction('publish'),
                      },
                    ]}
                  >
                    <span>Komut merkezi</span>
                  </Dropdown>
                  <LibraryMetricCard label="Son komut" value={dropdownAction} note="Seçilen key burada görünür." />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Yorum">
                <Text variant="secondary" className="block leading-7">
                  Rich dropdown, özellikle action merkezi hissi vermek istediğimiz admin yüzeylerinde plain action list yerine daha fazla bağlam taşır.
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
          eyebrow: t('designlab.showcase.component.tooltip.sections.inline.eyebrow'),
          title: t('designlab.showcase.component.tooltip.sections.inline.title'),
          description: t('designlab.showcase.component.tooltip.sections.inline.description'),
          badges: [
            t('designlab.showcase.component.tooltip.sections.inline.badge.hint'),
            t('designlab.showcase.component.tooltip.sections.inline.badge.beta'),
            t('designlab.showcase.component.tooltip.sections.inline.badge.inline'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
              <PreviewPanel title={t('designlab.showcase.component.tooltip.sections.inline.panelHelp')}>
                <div className="flex flex-wrap items-center gap-3">
                  <Tooltip text={t('designlab.showcase.component.tooltip.sections.inline.tooltipExample')}>
                    <Button variant="secondary">{t('designlab.showcase.component.tooltip.sections.inline.button')}</Button>
                  </Tooltip>
                  <Tooltip text={t('designlab.showcase.component.tooltip.sections.inline.tooltipInfo')}>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface-canvas text-sm font-semibold text-text-secondary">i</span>
                  </Tooltip>
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.tooltip.sections.inline.panelGuideline')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.tooltip.sections.inline.guideline')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'tooltip-policy-guidance',
          eyebrow: t('designlab.showcase.component.tooltip.sections.policy.eyebrow'),
          title: t('designlab.showcase.component.tooltip.sections.policy.title'),
          description: t('designlab.showcase.component.tooltip.sections.policy.description'),
          badges: [
            t('designlab.showcase.component.tooltip.sections.policy.badge.policy'),
            t('designlab.showcase.component.tooltip.sections.policy.badge.readonly'),
            t('designlab.showcase.component.tooltip.sections.policy.badge.guidance'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.tooltip.sections.policy.panelReadonly')}>
                <div className="flex flex-wrap items-center gap-3">
                  <Tooltip text={t('designlab.showcase.component.tooltip.sections.policy.tooltipText')}>
                    <Button access="readonly" variant="ghost">{t('designlab.showcase.component.tooltip.sections.policy.button')}</Button>
                  </Tooltip>
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.tooltip.sections.policy.panelRule')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.tooltip.sections.policy.rule')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'tooltip-rich-content',
          eyebrow: 'Rich hints',
          title: 'Rich içerikli tooltip',
          description: 'Kısa metin yerine küçük bilgi kartı gibi çalışan, placement ve arrow kullanan modern hint dilini gösterir.',
          badges: ['rich-content', 'placement', 'hover-card-lite'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Rich bilgi kapsülü">
                <div className="flex flex-wrap items-center gap-3">
                  <Tooltip
                    placement="bottom"
                    align="start"
                    showArrow
                    content={(
                      <div className="space-y-2">
                        <Text preset="title">Import contract</Text>
                        <Text variant="secondary" className="block leading-6">
                          Public surface ise canonical import ve package alias aynı anda belgelenmeli.
                        </Text>
                        <div className="flex gap-2">
                          <Badge tone="info">api</Badge>
                          <SectionBadge label="contract" />
                        </div>
                      </div>
                    )}
                  >
                    <Button variant="secondary">Import kuralı</Button>
                  </Tooltip>
                  <Tooltip text="Hover veya focus ile aynı bilgi davranışı çalışır." placement="right">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface-canvas text-sm font-semibold text-text-secondary">?</span>
                  </Tooltip>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Kural">
                <Text variant="secondary" className="block leading-7">
                  Tooltip hâlâ kısa ve geçici bir hint yüzeyi olmalı; üç-dört satırı geçen içerik için popover veya side note kullanmak daha doğru.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'FormDrawer':
      return [
        {
          id: 'form-drawer-create-flow',
          eyebrow: t('designlab.showcase.component.formDrawer.sections.create.eyebrow'),
          title: t('designlab.showcase.component.formDrawer.sections.create.title'),
          description: t('designlab.showcase.component.formDrawer.sections.create.description'),
          badges: [
            t('designlab.showcase.component.formDrawer.sections.create.badge.drawer'),
            t('designlab.showcase.component.formDrawer.sections.create.badge.stable'),
            t('designlab.showcase.component.formDrawer.sections.create.badge.form'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title={t('designlab.showcase.component.formDrawer.sections.create.panelEditor')}>
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={() => setFormDrawerOpen(true)}>{t('designlab.showcase.component.formDrawer.sections.create.open')}</Button>
                  <SectionBadge label={t('designlab.showcase.component.formDrawer.sections.create.sectionBadge')} />
                </div>
                <FormDrawer
                  open={formDrawerOpen}
                  title={t('designlab.showcase.component.formDrawer.sections.create.card.title')}
                  onClose={() => setFormDrawerOpen(false)}
                >
                  <div className="flex flex-col gap-3">
                    <TextInput
                      label={t('designlab.showcase.component.formDrawer.sections.create.card.nameLabel')}
                      value={textInputValue}
                      onChange={(event) => setTextInputValue(event.target.value)}
                    />
                    <Select
                      label={t('designlab.showcase.component.formDrawer.sections.create.card.densityLabel')}
                      value={selectValue}
                      onChange={(event) => setSelectValue(event.target.value)}
                      options={[
                        { value: 'compact', label: t('designlab.showcase.component.formDrawer.sections.create.card.option.compact') },
                        { value: 'comfortable', label: t('designlab.showcase.component.formDrawer.sections.create.card.option.comfortable') },
                      ]}
                    />
                  </div>
                </FormDrawer>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.formDrawer.sections.create.panelGuideline')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.formDrawer.sections.create.guideline')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'form-drawer-readonly-policy',
          eyebrow: t('designlab.showcase.component.formDrawer.sections.readonly.eyebrow'),
          title: t('designlab.showcase.component.formDrawer.sections.readonly.title'),
          description: t('designlab.showcase.component.formDrawer.sections.readonly.description'),
          badges: [
            t('designlab.showcase.component.formDrawer.sections.readonly.badge.readonly'),
            t('designlab.showcase.component.formDrawer.sections.readonly.badge.policy'),
            t('designlab.showcase.component.formDrawer.sections.readonly.badge.drawer'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.formDrawer.sections.readonly.panelState')}>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="secondary" onClick={() => setReadonlyFormDrawerOpen(true)}>
                    {t('designlab.showcase.component.formDrawer.sections.readonly.open')}
                  </Button>
                  <SectionBadge label={t('designlab.showcase.component.formDrawer.sections.readonly.sectionBadge')} />
                </div>
                <FormDrawer
                  open={readonlyFormDrawerOpen}
                  title={t('designlab.showcase.component.formDrawer.sections.readonly.card.title')}
                  onClose={() => setReadonlyFormDrawerOpen(false)}
                >
                  <div className="flex flex-col gap-3">
                    <TextInput
                      label={t('designlab.showcase.component.formDrawer.sections.readonly.card.nameLabel')}
                      value={t('designlab.showcase.component.formDrawer.sections.readonly.card.nameValue')}
                      readOnly
                      onChange={() => undefined}
                    />
                    <Text variant="secondary">
                      {t('designlab.showcase.component.formDrawer.sections.readonly.card.note')}
                    </Text>
                  </div>
                </FormDrawer>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.formDrawer.sections.readonly.panelRule')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.formDrawer.sections.readonly.rule')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'DetailDrawer':
      return [
        {
          id: 'detail-drawer-tabbed-review',
          eyebrow: t('designlab.showcase.component.detailDrawer.sections.tabbed.eyebrow'),
          title: t('designlab.showcase.component.detailDrawer.sections.tabbed.title'),
          description: t('designlab.showcase.component.detailDrawer.sections.tabbed.description'),
          badges: [
            t('designlab.showcase.component.detailDrawer.sections.tabbed.badge.drawer'),
            t('designlab.showcase.component.detailDrawer.sections.tabbed.badge.stable'),
            t('designlab.showcase.component.detailDrawer.sections.tabbed.badge.review'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title={t('designlab.showcase.component.detailDrawer.sections.tabbed.panelReview')}>
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={() => setDetailDrawerOpen(true)}>
                    {t('designlab.showcase.component.detailDrawer.sections.tabbed.open')}
                  </Button>
                  <SectionBadge label={t('designlab.showcase.component.detailDrawer.sections.tabbed.badgeTabbed')} />
                </div>
                <DetailDrawer
                  open={detailDrawerOpen}
                  title={t('designlab.showcase.component.detailDrawer.sections.tabbed.drawerTitle')}
                  onClose={() => setDetailDrawerOpen(false)}
                  tabs={[
                    {
                      key: 'summary',
                      label: t('designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.label'),
                      sections: [
                        {
                          key: 'owner',
                          title: t('designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.ownerLabel'),
                          content: <Text variant="secondary">{t('designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.ownerValue')}</Text>,
                        },
                        {
                          key: 'scope',
                          title: t('designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.scopeLabel'),
                          content: <Text variant="secondary">{t('designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.scopeValue')}</Text>,
                        },
                      ],
                    },
                    {
                      key: 'audit',
                      label: t('designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.label'),
                      sections: [
                        {
                          key: 'approval',
                          title: t('designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.approvalLabel'),
                          content: <Text variant="secondary">{t('designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.approvalValue')}</Text>,
                        },
                        {
                          key: 'trace',
                          title: t('designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.traceLabel'),
                          content: <Text variant="secondary">{t('designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.traceValue')}</Text>,
                        },
                      ],
                    },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.detailDrawer.sections.tabbed.panelGuideline')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.detailDrawer.sections.tabbed.guideline')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'detail-drawer-readonly-evidence',
          eyebrow: t('designlab.showcase.component.detailDrawer.sections.readonly.eyebrow'),
          title: t('designlab.showcase.component.detailDrawer.sections.readonly.title'),
          description: t('designlab.showcase.component.detailDrawer.sections.readonly.description'),
          badges: [
            t('designlab.showcase.component.detailDrawer.sections.readonly.badge.readonly'),
            t('designlab.showcase.component.detailDrawer.sections.readonly.badge.evidence'),
            t('designlab.showcase.component.detailDrawer.sections.readonly.badge.summary'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.detailDrawer.sections.readonly.panelEvidence')}>
                <div className="rounded-3xl border border-border-subtle bg-surface-canvas p-5">
                  <Text preset="title">{t('designlab.showcase.component.detailDrawer.sections.readonly.card.title')}</Text>
                  <Text variant="secondary" className="mt-3 block leading-7">
                    {t('designlab.showcase.component.detailDrawer.sections.readonly.card.body')}
                  </Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.detailDrawer.sections.readonly.panelRule')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.detailDrawer.sections.readonly.rule')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'Popover':
      return [
        {
          id: 'popover-rich-guidance',
          eyebrow: t('designlab.showcase.component.popover.sections.rich.eyebrow'),
          title: t('designlab.showcase.component.popover.sections.rich.title'),
          description: t('designlab.showcase.component.popover.sections.rich.description'),
          badges: [
            t('designlab.showcase.component.popover.sections.rich.badge.popover'),
            t('designlab.showcase.component.popover.sections.rich.badge.beta'),
            t('designlab.showcase.component.popover.sections.rich.badge.guidance'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title={t('designlab.showcase.component.popover.sections.rich.panelHelper')}>
                <div className="flex flex-wrap items-center gap-3">
                  <Popover
                    title={t('designlab.showcase.component.popover.sections.rich.popoverTitle')}
                    trigger={<Button variant="secondary">{t('designlab.showcase.component.popover.sections.rich.open')}</Button>}
                    content={(
                      <div className="space-y-3">
                        <Text variant="secondary" className="block leading-6">
                          {t('designlab.showcase.component.popover.sections.rich.body')}
                        </Text>
                        <div className="flex flex-wrap gap-2">
                          <Tag tone="info">{t('designlab.showcase.component.popover.sections.rich.tag.contextual')}</Tag>
                          <Tag tone="warning">{t('designlab.showcase.component.popover.sections.rich.tag.policy')}</Tag>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.popover.sections.rich.panelGuideline')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.popover.sections.rich.guideline')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'popover-readonly-panel',
          eyebrow: t('designlab.showcase.component.popover.sections.readonly.eyebrow'),
          title: t('designlab.showcase.component.popover.sections.readonly.title'),
          description: t('designlab.showcase.component.popover.sections.readonly.description'),
          badges: [
            t('designlab.showcase.component.popover.sections.readonly.badge.readonly'),
            t('designlab.showcase.component.popover.sections.readonly.badge.helper'),
            t('designlab.showcase.component.popover.sections.readonly.badge.panel'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.popover.sections.readonly.panelHelper')}>
                <Popover
                  title={t('designlab.showcase.component.popover.sections.readonly.popoverTitle')}
                  access="readonly"
                  trigger={<Button variant="ghost">{t('designlab.showcase.component.popover.sections.readonly.open')}</Button>}
                  content={<Text variant="secondary">{t('designlab.showcase.component.popover.sections.readonly.body')}</Text>}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.popover.sections.readonly.panelRule')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.popover.sections.readonly.rule')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'popover-hover-card',
          eyebrow: 'Hover card surfaces',
          title: 'Hover card alternatifi',
          description: 'Popover’u küçük bilgi kartı gibi kullanıp, daha zengin bağlamı modal açmadan vermek için bir örnek sunar.',
          badges: ['hover-card', 'rich-context', 'profile'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
              <PreviewPanel title="Context card">
                <Popover
                  triggerMode="hover-focus"
                  side="bottom"
                  align="start"
                  showArrow
                  title="Component owner"
                  trigger={<Button variant="secondary">Owner kartını aç</Button>}
                  content={(
                    <div className="space-y-3">
                      <div>
                        <Text preset="title">Platform UI</Text>
                        <Text variant="secondary" className="mt-1 block leading-6">
                          Navigation ve layout ailesinin bakımından sorumlu ekip.
                        </Text>
                      </div>
                      <div className="flex gap-2">
                        <Badge tone="success">stable</Badge>
                        <Badge tone="info">12 component</Badge>
                      </div>
                      <Text variant="secondary" className="block leading-6">
                        Hover-card yaklaşımı, kısa profil veya ownership bağlamı için modal ya da drawer’dan daha hafif kalır.
                      </Text>
                    </div>
                  )}
                />
              </PreviewPanel>
              <PreviewPanel title="Kural">
                <Text variant="secondary" className="block leading-7">
                  Popover, kullanıcıdan karar beklemeyen ama tooltip’ten fazla bağlam gerektiren ara yüzeyler için en güçlü katmanlardan biri.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'ContextMenu':
      return [
        {
          id: 'context-menu-action-trigger',
          eyebrow: t('designlab.showcase.component.contextMenu.sections.trigger.eyebrow'),
          title: t('designlab.showcase.component.contextMenu.sections.trigger.title'),
          description: t('designlab.showcase.component.contextMenu.sections.trigger.description'),
          badges: [
            t('designlab.showcase.component.contextMenu.sections.trigger.badge.overlay'),
            t('designlab.showcase.component.contextMenu.sections.trigger.badge.beta'),
            t('designlab.showcase.component.contextMenu.sections.trigger.badge.actions'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title={t('designlab.showcase.component.contextMenu.sections.trigger.panelButton')}>
                <div className="flex flex-wrap items-start gap-3">
                  <ContextMenu
                    items={[
                      {
                        key: 'approve',
                        label: t('designlab.showcase.component.contextMenu.sections.trigger.items.approve.label'),
                        onClick: () => setContextMenuAction('approve'),
                      },
                      {
                        key: 'review',
                        label: t('designlab.showcase.component.contextMenu.sections.trigger.items.review.label'),
                        onClick: () => setContextMenuAction('review'),
                      },
                      {
                        key: 'archive',
                        label: t('designlab.showcase.component.contextMenu.sections.trigger.items.archive.label'),
                        danger: true,
                        onClick: () => setContextMenuAction('archive'),
                      },
                    ]}
                  >
                    <button type="button">{t('designlab.showcase.component.contextMenu.sections.trigger.button')}</button>
                  </ContextMenu>
                  <div
                    className="min-w-[220px] rounded-2xl border border-border-subtle bg-surface-canvas px-4 py-4 text-sm text-text-secondary"
                    data-testid="design-lab-contextmenu-result"
                  >
                    {t('designlab.showcase.component.contextMenu.sections.trigger.lastSelection')}{' '}
                    <span className="font-semibold text-text-primary">{contextMenuAction}</span>
                  </div>
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.contextMenu.sections.trigger.panelGuideline')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.contextMenu.sections.trigger.guideline')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'context-menu-surface-trigger',
          eyebrow: t('designlab.showcase.component.contextMenu.sections.surface.eyebrow'),
          title: t('designlab.showcase.component.contextMenu.sections.surface.title'),
          description: t('designlab.showcase.component.contextMenu.sections.surface.description'),
          badges: [
            t('designlab.showcase.component.contextMenu.sections.surface.badge.rightClick'),
            t('designlab.showcase.component.contextMenu.sections.surface.badge.surface'),
            t('designlab.showcase.component.contextMenu.sections.surface.badge.policy'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.contextMenu.sections.surface.panelSurface')}>
                <ContextMenu
                  items={[
                    { key: 'duplicate', label: t('designlab.showcase.component.contextMenu.sections.surface.items.duplicate.label'), shortcut: 'D', onClick: () => setContextMenuAction('surface:duplicate') },
                    { key: 'pin', label: t('designlab.showcase.component.contextMenu.sections.surface.items.pin.label'), shortcut: 'P', onClick: () => setContextMenuAction('surface:pin') },
                    {
                      key: 'readonly',
                      label: t('designlab.showcase.component.contextMenu.sections.surface.items.readonly.label'),
                      onClick: () => setContextMenuAction('surface:readonly'),
                    },
                  ]}
                >
                  <div className="space-y-2">
                    <Text preset="title">{t('designlab.showcase.component.contextMenu.sections.surface.triggerTitle')}</Text>
                    <Text variant="secondary" className="block leading-7">
                      {t('designlab.showcase.component.contextMenu.sections.surface.body')}
                    </Text>
                  </div>
                </ContextMenu>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.contextMenu.sections.surface.panelRule')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.contextMenu.sections.surface.rule')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'TourCoachmarks':
      return [
        {
          id: 'tour-guided-walkthrough',
          eyebrow: t('designlab.showcase.component.tourCoachmarks.sections.guided.eyebrow'),
          title: t('designlab.showcase.component.tourCoachmarks.sections.guided.title'),
          description: t('designlab.showcase.component.tourCoachmarks.sections.guided.description'),
          badges: [
            t('designlab.showcase.component.tourCoachmarks.sections.guided.badge.tour'),
            t('designlab.showcase.component.tourCoachmarks.sections.guided.badge.guided'),
            t('designlab.showcase.component.tourCoachmarks.sections.guided.badge.compliance'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title={t('designlab.showcase.component.tourCoachmarks.sections.guided.panelWalkthrough')}>
                <div className="flex flex-wrap items-start gap-3">
                  <Button
                    data-testid="design-lab-tour-open"
                    onClick={() => {
                      setTourOpen(true);
                      setTourStep(0);
                      setTourStatus('guided');
                    }}
                  >
                    {t('designlab.showcase.component.tourCoachmarks.sections.guided.open')}
                  </Button>
                  <SectionBadge
                    label={
                      tourStatus === 'finished'
                        ? t('designlab.showcase.component.tourCoachmarks.sections.guided.status.finished')
                        : tourStatus === 'guided'
                          ? t('designlab.showcase.component.tourCoachmarks.sections.guided.status.guided')
                          : t('designlab.showcase.component.tourCoachmarks.sections.guided.status.idle')
                    }
                  />
                </div>
                <div className="mt-4">
                  <TourCoachmarks
                    open={tourOpen}
                    currentStep={tourStep}
                    onStepChange={(index) => setTourStep(index)}
                    onClose={() => {
                      setTourOpen(false);
                      setTourStatus('idle');
                    }}
                    onFinish={() => {
                      setTourStatus('finished');
                      setTourOpen(false);
                    }}
                    localeText={tourCoachmarksLocaleText}
                    testIdPrefix="design-lab-tour"
                    steps={[
                      {
                        id: 'scope',
                        title: t('designlab.showcase.component.tourCoachmarks.sections.guided.steps.scope.title'),
                        description: t('designlab.showcase.component.tourCoachmarks.sections.guided.steps.scope.description'),
                        meta: 'contract',
                      },
                      {
                        id: 'preview',
                        title: t('designlab.showcase.component.tourCoachmarks.sections.guided.steps.preview.title'),
                        description: t('designlab.showcase.component.tourCoachmarks.sections.guided.steps.preview.description'),
                        meta: 'preview',
                        tone: 'success',
                      },
                      {
                        id: 'release',
                        title: t('designlab.showcase.component.tourCoachmarks.sections.guided.steps.release.title'),
                        description: t('designlab.showcase.component.tourCoachmarks.sections.guided.steps.release.description'),
                        meta: 'release',
                        tone: 'warning',
                      },
                    ]}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.tourCoachmarks.sections.guided.panelGuideline')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.tourCoachmarks.sections.guided.guideline')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'tour-readonly-compliance',
          eyebrow: t('designlab.showcase.component.tourCoachmarks.sections.readonly.eyebrow'),
          title: t('designlab.showcase.component.tourCoachmarks.sections.readonly.title'),
          description: t('designlab.showcase.component.tourCoachmarks.sections.readonly.description'),
          badges: [
            t('designlab.showcase.component.tourCoachmarks.sections.readonly.badge.readonly'),
            t('designlab.showcase.component.tourCoachmarks.sections.readonly.badge.policy'),
            t('designlab.showcase.component.tourCoachmarks.sections.readonly.badge.walkthrough'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.tourCoachmarks.sections.readonly.panelTour')}>
                <TourCoachmarks
                  defaultOpen
                  mode="readonly"
                  allowSkip={false}
                  showProgress={false}
                  access="readonly"
                  localeText={tourCoachmarksLocaleText}
                  steps={[
                    {
                      id: 'policy',
                      title: t('designlab.showcase.component.tourCoachmarks.sections.readonly.steps.policy.title'),
                      description: t('designlab.showcase.component.tourCoachmarks.sections.readonly.steps.policy.description'),
                      meta: 'readonly',
                    },
                    {
                      id: 'controls',
                      title: t('designlab.showcase.component.tourCoachmarks.sections.readonly.steps.controls.title'),
                      description: t('designlab.showcase.component.tourCoachmarks.sections.readonly.steps.controls.description'),
                      meta: 'controls',
                      tone: 'warning',
                    },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.tourCoachmarks.sections.readonly.panelRule')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.tourCoachmarks.sections.readonly.rule')}
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
