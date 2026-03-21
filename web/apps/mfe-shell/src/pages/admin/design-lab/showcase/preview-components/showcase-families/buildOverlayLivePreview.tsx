import React from 'react';
import {
  Button,
  ContextMenu,
  DetailDrawer,
  Dropdown,
  FormDrawer,
  Modal,
  Popover,
  Tag,
  Text,
  Tooltip,
  TourCoachmarks,
} from '@mfe/design-system';
import {
  LibrarySectionBadge as SectionBadge,
} from '../../../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import type {
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type OverlayLivePreviewContext = {
  PreviewPanel: PreviewPanelComponent;
  contextMenuAction: string;
  contextMenuMessages: Record<string, string>;
  detailDrawerOpen: boolean;
  dropdownAction: string;
  formDrawerOpen: boolean;
  modalOpen: boolean;
  setContextMenuAction: (nextValue: string) => void;
  setDetailDrawerOpen: (nextValue: boolean) => void;
  setDropdownAction: (nextValue: string) => void;
  setFormDrawerOpen: (nextValue: boolean) => void;
  setModalOpen: (nextValue: boolean) => void;
  setTourOpen: (nextValue: boolean) => void;
  setTourStatus: (nextValue: string) => void;
  setTourStep: (nextValue: number) => void;
  t: DesignLabTranslate;
  tourCoachmarksLocaleText: React.ComponentProps<typeof TourCoachmarks>['localeText'];
  tourOpen: boolean;
  tourStatus: string;
  tourStep: number;
};

export const buildOverlayLivePreview = (
  componentName: string,
  context: OverlayLivePreviewContext,
): React.ReactNode | null => {
  const {
    PreviewPanel,
    contextMenuAction,
    contextMenuMessages,
    detailDrawerOpen,
    dropdownAction,
    formDrawerOpen,
    modalOpen,
    setContextMenuAction,
    setDetailDrawerOpen,
    setDropdownAction,
    setFormDrawerOpen,
    setModalOpen,
    setTourOpen,
    setTourStatus,
    setTourStep,
    t,
    tourCoachmarksLocaleText,
    tourOpen,
    tourStatus,
    tourStep,
  } = context;

  switch (componentName) {
    case 'Dropdown':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
            <Dropdown
              items={[
                { key: 'publish', label: t('designlab.showcase.component.dropdown.live.item.publish'), onClick: () => setDropdownAction('publish') },
                { key: 'duplicate', label: t('designlab.showcase.component.dropdown.live.item.duplicate'), onClick: () => setDropdownAction('duplicate') },
                { key: 'archive', label: t('designlab.showcase.component.dropdown.live.item.archive'), onClick: () => setDropdownAction('archive') },
              ]}
            >
              <span>{t('designlab.showcase.component.dropdown.live.trigger')}</span>
            </Dropdown>
            <Text variant="secondary">
              {t('designlab.showcase.component.dropdown.live.selection', { value: dropdownAction })}
            </Text>
          </div>
        </div>
      );
    case 'Tooltip':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
          <Tooltip text={t('designlab.showcase.component.tooltip.live.tooltipText')}>
            <Button variant="secondary">{t('designlab.showcase.component.tooltip.live.button')}</Button>
          </Tooltip>
        </div>
      );
    case 'Modal':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
          <Button onClick={() => setModalOpen(true)}>{t('designlab.showcase.component.modal.live.open')}</Button>
          <Modal
            open={modalOpen}
            title={t('designlab.showcase.component.modal.live.title')}
            onClose={() => setModalOpen(false)}
            footer={(
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  {t('designlab.showcase.component.modal.live.cancel')}
                </Button>
                <Button onClick={() => setModalOpen(false)}>{t('designlab.showcase.component.modal.live.save')}</Button>
              </div>
            )}
          >
            <Text variant="secondary">{t('designlab.showcase.component.modal.live.description')}</Text>
          </Modal>
        </div>
      );
    case 'FormDrawer':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
          <Button onClick={() => setFormDrawerOpen(true)}>{t('designlab.showcase.component.formDrawer.live.open')}</Button>
          <FormDrawer
            open={formDrawerOpen}
            title={t('designlab.showcase.component.formDrawer.live.title')}
            onClose={() => setFormDrawerOpen(false)}
          >
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">
                {t('designlab.showcase.component.formDrawer.live.field1')}
              </div>
              <div className="rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">
                {t('designlab.showcase.component.formDrawer.live.field2')}
              </div>
            </div>
          </FormDrawer>
        </div>
      );
    case 'DetailDrawer':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
          <Button onClick={() => setDetailDrawerOpen(true)}>{t('designlab.showcase.component.detailDrawer.live.open')}</Button>
          <DetailDrawer
            open={detailDrawerOpen}
            title={t('designlab.showcase.component.detailDrawer.live.title')}
            onClose={() => setDetailDrawerOpen(false)}
            sections={[
              {
                key: 'summary',
                title: t('designlab.showcase.component.detailDrawer.live.sections.summary.title'),
                content: <Text variant="secondary">{t('designlab.showcase.component.detailDrawer.live.sections.summary.content')}</Text>,
              },
              {
                key: 'audit',
                title: t('designlab.showcase.component.detailDrawer.live.sections.audit.title'),
                content: <Text variant="secondary">{t('designlab.showcase.component.detailDrawer.live.sections.audit.content')}</Text>,
              },
            ]}
          />
        </div>
      );
    case 'Popover':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
          <Popover
            title={t('designlab.showcase.component.popover.live.title')}
            trigger={<Button variant="secondary">{t('designlab.showcase.component.popover.live.open')}</Button>}
            content={(
              <div className="space-y-3">
                <Text variant="secondary" className="block leading-6">
                  {t('designlab.showcase.component.popover.live.description')}
                </Text>
                <div className="flex flex-wrap gap-2">
                  <Tag variant="warning">{t('designlab.showcase.component.popover.live.badge.policy')}</Tag>
                  <Tag variant="info">{t('designlab.showcase.component.popover.live.badge.readonly')}</Tag>
                </div>
              </div>
            )}
          />
        </div>
      );
    case 'ContextMenu':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <PreviewPanel title={t('designlab.showcase.component.contextMenu.live.trigger.panel')}>
              <div className="flex flex-wrap items-start gap-3">
                <ContextMenu
                  items={[
                    {
                      key: 'approve',
                      label: t('designlab.showcase.component.contextMenu.live.trigger.items.approve.label'),
                      onClick: () => setContextMenuAction('approve'),
                    },
                    {
                      key: 'review',
                      label: t('designlab.showcase.component.contextMenu.live.trigger.items.review.label'),
                      onClick: () => setContextMenuAction('review'),
                    },
                    {
                      key: 'archive',
                      label: t('designlab.showcase.component.contextMenu.live.trigger.items.archive.label'),
                      danger: true,
                      onClick: () => setContextMenuAction('archive'),
                    },
                  ]}
                >
                  <button type="button" data-testid="design-lab-contextmenu">
                    {t('designlab.showcase.component.contextMenu.live.trigger.button')}
                  </button>
                </ContextMenu>
                <div
                  className="min-w-[220px] rounded-2xl border border-border-subtle bg-surface-canvas px-4 py-4 text-sm text-text-secondary"
                  data-testid="design-lab-contextmenu-result"
                >
                  {t('designlab.showcase.component.contextMenu.live.trigger.lastSelection')}{' '}
                  <span className="font-semibold text-text-primary">{contextMenuAction}</span>
                </div>
              </div>
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.contextMenu.live.surface.panel')}>
              <ContextMenu
                items={[
                  { key: 'duplicate', label: t('designlab.showcase.component.contextMenu.live.surface.items.duplicate.label'), shortcut: 'D', onClick: () => setContextMenuAction('surface:duplicate') },
                  { key: 'pin', label: t('designlab.showcase.component.contextMenu.live.surface.items.pin.label'), shortcut: 'P', onClick: () => setContextMenuAction('surface:pin') },
                  {
                    key: 'readonly',
                    label: t('designlab.showcase.component.contextMenu.live.surface.items.readonly.label'),
                    onClick: () => setContextMenuAction('surface:readonly'),
                  },
                ]}
              >
                <div className="space-y-2">
                  <Text preset="title">{t('designlab.showcase.component.contextMenu.live.surface.triggerTitle')}</Text>
                  <Text variant="secondary" className="block leading-7">
                    {t('designlab.showcase.component.contextMenu.live.surface.description')}
                  </Text>
                </div>
              </ContextMenu>
            </PreviewPanel>
          </div>
        </div>
      );
    case 'TourCoachmarks':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <PreviewPanel title={t('designlab.showcase.component.tourCoachmarks.live.guided.panel')}>
              <div className="flex flex-wrap items-start gap-3">
                <Button
                  onClick={() => {
                    setTourOpen(true);
                    setTourStep(0);
                    setTourStatus('guided');
                  }}
                  data-testid="design-lab-tour-open"
                >
                  {t('designlab.showcase.component.tourCoachmarks.live.guided.open')}
                </Button>
                <SectionBadge
                  label={
                    tourStatus === 'finished'
                      ? t('designlab.showcase.component.tourCoachmarks.live.guided.status.finished')
                      : tourStatus === 'guided'
                        ? t('designlab.showcase.component.tourCoachmarks.live.guided.status.guided')
                        : t('designlab.showcase.component.tourCoachmarks.live.guided.status.idle')
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
                      title: t('designlab.showcase.component.tourCoachmarks.live.guided.steps.scope.title'),
                      description: t('designlab.showcase.component.tourCoachmarks.live.guided.steps.scope.description'),
                      meta: 'contract',
                    },
                    {
                      id: 'preview',
                      title: t('designlab.showcase.component.tourCoachmarks.live.guided.steps.preview.title'),
                      description: t('designlab.showcase.component.tourCoachmarks.live.guided.steps.preview.description'),
                      meta: 'preview',
                      tone: 'success',
                    },
                    {
                      id: 'release',
                      title: t('designlab.showcase.component.tourCoachmarks.live.guided.steps.release.title'),
                      description: t('designlab.showcase.component.tourCoachmarks.live.guided.steps.release.description'),
                      meta: 'release',
                      tone: 'warning',
                    },
                  ]}
                />
              </div>
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.tourCoachmarks.live.readonly.panel')}>
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
                    title: t('designlab.showcase.component.tourCoachmarks.live.readonly.steps.policy.title'),
                    description: t('designlab.showcase.component.tourCoachmarks.live.readonly.steps.policy.description'),
                    meta: 'readonly',
                  },
                  {
                    id: 'controls',
                    title: t('designlab.showcase.component.tourCoachmarks.live.readonly.steps.controls.title'),
                    description: t('designlab.showcase.component.tourCoachmarks.live.readonly.steps.controls.description'),
                    meta: 'controls',
                    tone: 'warning',
                  },
                ]}
              />
            </PreviewPanel>
          </div>
        </div>
      );
    default:
      return null;
  }
};
