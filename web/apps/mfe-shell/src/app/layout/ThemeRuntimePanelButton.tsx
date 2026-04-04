import React, { useEffect, useRef, useState } from 'react';
import { Drawer } from '@mfe/design-system';
import { useShellCommonI18n } from '../i18n';
import { useThemeContext } from '../theme/theme-context.provider';
import { useThemeAdmin } from '../../pages/admin/theme/useThemeAdmin';
import ThemeDrawerPanel from '../../pages/admin/theme/ThemeDrawerPanel';

export const ThemeRuntimePanelButton: React.FC = () => {
  const { t } = useShellCommonI18n();
  const [open, setOpen] = useState(false);
  const admin = useThemeAdmin();
  const { axes } = useThemeContext();
  const innerRef = useRef<HTMLDivElement | null>(null);

  /* Sync data-theme on Drawer's portal panel so bg-surface-* adapts */
  const currentAppearance = admin.themeMeta?.appearance ?? axes.appearance ?? 'light';
  const currentAccent = admin.themeMeta?.axes.accent ?? axes.accent ?? 'neutral';
  const currentDensity = admin.themeMeta?.axes.density ?? axes.density ?? 'comfortable';

  useEffect(() => {
    if (!open || !innerRef.current) return;
    // Walk up to the Drawer's dialog panel (role="dialog")
    let el: HTMLElement | null = innerRef.current;
    while (el && el.getAttribute('role') !== 'dialog') el = el.parentElement;
    if (!el) return;
    el.setAttribute('data-theme', currentAppearance === 'dark' ? 'dark' : 'light');
    el.setAttribute('data-accent', currentAccent);
    el.setAttribute('data-density', currentDensity);
  }, [open, currentAppearance, currentAccent, currentDensity]);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-8 items-center gap-1 rounded-full border border-action-primary-border bg-action-primary px-3 text-xs font-semibold text-action-primary-text transition hover:opacity-90"
        data-testid="runtime-panel-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t('shell.theme.panel.triggerAria')}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span aria-hidden>🎨</span>
        <span className="hidden xl:inline">
          {t('shell.theme.panel.triggerText')}
        </span>
      </button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        size="md"
        showOverlay
        closeOnOverlayClick
        closeOnEscape
        title={t('shell.theme.panel.dialogLabel')}
      >
        <div ref={innerRef} className="h-full">
          <ThemeDrawerPanel admin={admin} />
        </div>
      </Drawer>
    </>
  );
};

export default ThemeRuntimePanelButton;
