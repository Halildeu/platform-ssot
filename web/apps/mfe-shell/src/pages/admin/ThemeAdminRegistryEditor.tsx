import React from 'react';
import { Accordion, createAccordionPreset } from '@mfe/design-system';

import UniversalColorPicker from '../../app/theme/components/UniversalColorPicker';
import { rgbaToString, type RgbaColor } from '../../app/theme/color-utils';
import {
  getGroupLabelMap,
  getUsageHintByKey,
  resolveTailwindHint,
  type ThemeAdminRow,
  type ThemeColorPickerState,
} from './ThemeAdminPage.shared';
import { useThemeAdminI18n } from './useThemeAdminI18n';

type ThemeRowGroup = {
  id: string;
  label?: string;
  rows: ThemeAdminRow[];
};

type ThemeAdminRegistryEditorProps = {
  textAreaGroups: ThemeRowGroup[];
  rowsByGroup: ThemeRowGroup[];
  resolvedPreviewCssVars: Record<string, string>;
  resolvedPreviewDisplayCssVars: Record<string, string>;
  activeColorPicker: ThemeColorPickerState | null;
  contrastWarnings: Record<string, string>;
  onValueChange: (key: string, value: string) => void;
  onOpenColorPicker: (row: ThemeAdminRow) => void;
  onCloseColorPicker: () => void;
  onColorPickerChange: (key: string, color: RgbaColor) => void;
};

const ThemeAdminRegistryEditor: React.FC<ThemeAdminRegistryEditorProps> = ({
  textAreaGroups,
  rowsByGroup,
  resolvedPreviewCssVars,
  resolvedPreviewDisplayCssVars,
  activeColorPicker,
  contrastWarnings,
  onValueChange,
  onOpenColorPicker,
  onCloseColorPicker,
  onColorPickerChange,
}) => {
  const { t } = useThemeAdminI18n();
  const groupLabelMap = React.useMemo(() => getGroupLabelMap(t), [t]);
  const usageHintByKey = React.useMemo(() => getUsageHintByKey(t), [t]);
  const sectionAccordionPreset = React.useMemo(() => createAccordionPreset('settings'), []);
  const nestedSectionAccordionPreset = React.useMemo(
    () => ({
      ...createAccordionPreset('compact'),
      bordered: true,
      ghost: false,
      destroyOnHidden: true,
      collapsible: 'header' as const,
    }),
    [],
  );
  const accordionClasses = React.useMemo(
    () => ({
      trigger: 'px-3',
      panelInner: 'px-3 pb-3',
    }),
    [],
  );
  const nestedAccordionClasses = React.useMemo(
    () => ({
      trigger: 'px-3 py-2',
      panelInner: 'px-3 pb-3',
    }),
    [],
  );
  const colorPickerLocaleText = React.useMemo(
    () => ({
      hexLabel: t('themeadmin.color.hex'),
      hexAriaLabel: t('themeadmin.color.hexAria'),
      rgbaLabel: t('themeadmin.color.rgba'),
      rgbaAriaLabel: t('themeadmin.color.rgbaAria'),
      hslLabel: t('themeadmin.color.hsl'),
      hslAriaLabel: t('themeadmin.color.hslAria'),
      hueLabel: t('themeadmin.color.hue'),
      hueAriaLabel: t('themeadmin.color.hueAria'),
      opacityLabel: t('themeadmin.color.opacity'),
      opacityAriaLabel: t('themeadmin.color.opacityAria'),
    }),
    [t],
  );

  const renderRegistryRow = (row: ThemeAdminRow) => {
    const isAdminOnly = row.editableBy === 'ADMIN_ONLY';
    const cssVars = Array.isArray(row.cssVars) ? row.cssVars : [];
    const resolvedRaw = cssVars.length > 0 ? resolvedPreviewCssVars[cssVars[0]] : '';
    const resolvedDisplay = cssVars.length > 0 ? resolvedPreviewDisplayCssVars[cssVars[0]] : '';
    const fallbackRaw = row.key === 'surface.page.bg' ? resolvedPreviewCssVars['--surface-default-bg'] ?? '' : '';
    const fallbackDisplay = row.key === 'surface.page.bg' ? resolvedPreviewDisplayCssVars['--surface-default-bg'] ?? '' : '';
    const effectiveResolvedRaw = resolvedRaw || fallbackRaw;
    const effectiveResolvedDisplay = resolvedDisplay || fallbackDisplay;
    const overrideValue = row.value?.trim() ? row.value.trim() : '';
    const swatchColor = overrideValue || effectiveResolvedRaw || 'transparent';
    const isDangerBg =
      row.key.endsWith('.bg') &&
      (
        row.key.startsWith('action.danger')
        || row.key.startsWith('status.danger')
        || row.key.startsWith('status.warning')
        || row.key.startsWith('status.success')
        || row.key.startsWith('status.info')
      );
    const contrastWarning = isDangerBg ? contrastWarnings[row.key] : undefined;
    const tailwindHint = resolveTailwindHint(row.key);
    const usageHint = usageHintByKey[row.key];

    return (
      <label
        key={row.id}
        className="flex flex-col gap-1 rounded-xl border border-border-subtle bg-surface-panel px-2 py-2 text-[11px]"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-text-primary">{row.label}</span>
          <span className="text-[10px] text-text-subtle">{row.key}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="h-7 flex-1 rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
            value={row.value ?? ''}
            onChange={(event) => onValueChange(row.key, event.target.value)}
            placeholder={row.controlType === 'COLOR' ? effectiveResolvedDisplay || t('themeadmin.registry.colorInputPlaceholder') : ''}
          />
          {row.controlType === 'COLOR' ? (
            <button
              type="button"
              className="h-6 w-6 rounded-md border border-border-subtle shadow-xs"
              style={{ backgroundColor: swatchColor }}
              aria-label={t('themeadmin.registry.colorSelectAria', { label: row.label })}
              onClick={() => onOpenColorPicker(row)}
            />
          ) : (
            <span
              className="h-6 w-6 rounded-md border border-border-subtle"
              style={{ backgroundColor: swatchColor }}
              aria-hidden
            />
          )}
        </div>
        {row.controlType === 'COLOR' && !overrideValue && effectiveResolvedDisplay ? (
          <div className="text-[10px] text-text-subtle">
            {t('themeadmin.registry.defaultValuePrefix')} <span className="font-mono">{effectiveResolvedDisplay}</span>
          </div>
        ) : null}
        {row.controlType === 'COLOR' && activeColorPicker?.key === row.key ? (
          <div className="mt-2 rounded-xl border border-border-subtle bg-surface-default p-2">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-text-secondary">{t('themeadmin.registry.colorPickerTitle')}</span>
                <span className="text-[10px] text-text-subtle">{activeColorPicker.key}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-2 py-1 text-[10px] font-semibold text-text-secondary hover:border-text-secondary"
                  onClick={() => {
                    onValueChange(row.key, '');
                    onCloseColorPicker();
                  }}
                >
                  {t('themeadmin.registry.clearOverride')}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-2 py-1 text-[10px] font-semibold text-text-secondary hover:border-text-secondary"
                  onClick={onCloseColorPicker}
                >
                  {t('themeadmin.registry.close')}
                </button>
              </div>
            </div>
            <UniversalColorPicker
              color={activeColorPicker.color}
              surfaceTone={null}
              surfaceTonePresets={[]}
              surfaceTonePalette={[]}
              localeText={colorPickerLocaleText}
              onManualColorChange={(next) => {
                onColorPickerChange(row.key, next);
                onValueChange(row.key, rgbaToString(next));
              }}
              onSurfaceToneChange={() => {
                // Surface tone selection is not used in this editor.
              }}
            />
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-text-subtle">{row.description ?? row.groupName}</span>
          <span className={isAdminOnly ? 'text-[10px] font-semibold text-status-warning-text' : 'text-[10px] text-text-subtle'}>
            {isAdminOnly ? t('themeadmin.registry.editable.adminOnly') : t('themeadmin.registry.editable.userAllowed')}
          </span>
        </div>
        {cssVars.length > 0 ? (
          <div className="text-[10px] text-text-subtle">
            CSS: <span className="font-mono">{cssVars.join(', ')}</span>
          </div>
        ) : null}
        {tailwindHint ? (
          <div className="text-[10px] text-text-subtle">
            Tailwind: <span className="font-mono">{tailwindHint}</span>
          </div>
        ) : null}
        {usageHint ? (
          <div className="text-[10px] text-text-subtle">
            {t('themeadmin.registry.usagePrefix', { usageHint })}
          </div>
        ) : null}
        {isDangerBg ? (
          <>
            <span className="text-[10px] text-status-warning-text">
              {t('themeadmin.registry.contrastWarning')}
            </span>
            {contrastWarning ? (
              <span className="text-[10px] text-status-danger-text">{contrastWarning}</span>
            ) : null}
          </>
        ) : null}
      </label>
    );
  };

  const renderGroupRows = (group: ThemeRowGroup) => (
    <div className="flex flex-col gap-2">{group.rows.map((row) => renderRegistryRow(row))}</div>
  );

  return (
    <Accordion
      items={[
        {
          value: 'theme-registry-editor',
          title: (
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              {t('themeadmin.registry.sectionTitle')}
            </span>
          ),
          defaultExpanded: true,
          forceRender: true,
          content: (
            <div className="flex flex-col gap-4">
              {textAreaGroups.length > 0 ? (
                <Accordion
                  items={[
                    {
                      value: 'text-colors',
                      title: (
                        <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          {t('themeadmin.registry.textColorsTitle')}
                        </span>
                      ),
                      defaultExpanded: true,
                      forceRender: true,
                      content: (
                        <div className="flex flex-col gap-3">
                          {textAreaGroups.map((group) => (
                            <Accordion
                              key={group.id}
                              items={[
                                {
                                  value: group.id,
                                  title: <span className="text-[11px] font-semibold text-text-secondary">{group.label}</span>,
                                  content: renderGroupRows(group),
                                },
                              ]}
                              ariaLabel={group.label ?? group.id}
                              {...nestedSectionAccordionPreset}
                              className="rounded-2xl border border-border-subtle bg-surface-panel"
                              classes={nestedAccordionClasses}
                            />
                          ))}
                          <div className="text-[10px] text-text-subtle">
                            {t('themeadmin.registry.textColorNote')}
                          </div>
                        </div>
                      ),
                    },
                  ]}
                  ariaLabel={t('themeadmin.registry.textColorsTitle')}
                  {...sectionAccordionPreset}
                  className="rounded-2xl border border-border-subtle bg-surface-default"
                  classes={accordionClasses}
                />
              ) : null}

              {rowsByGroup.map((group) => (
                <Accordion
                  key={group.id}
                  items={[
                    {
                      value: group.id,
                      title: (
                        <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          {groupLabelMap[group.id] ?? group.id}
                        </span>
                      ),
                      content: renderGroupRows(group),
                    },
                  ]}
                  ariaLabel={groupLabelMap[group.id] ?? group.id}
                  {...sectionAccordionPreset}
                  className="rounded-2xl border border-border-subtle bg-surface-default"
                  classes={accordionClasses}
                />
              ))}
            </div>
          ),
        },
      ]}
      ariaLabel={t('themeadmin.registry.sectionTitle')}
      {...sectionAccordionPreset}
      className="rounded-2xl border border-border-subtle bg-surface-panel"
      classes={accordionClasses}
    />
  );
};

export default ThemeAdminRegistryEditor;
