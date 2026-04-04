import React, { useState } from 'react';
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
        <div
          className="h-full"
          data-theme-scope
          data-theme={admin.themeMeta?.appearance ?? axes.appearance}
          data-accent={admin.themeMeta?.axes.accent ?? axes.accent}
          data-density={admin.themeMeta?.axes.density ?? axes.density}
          data-radius={admin.themeMeta?.axes.radius ?? axes.radius}
          data-elevation={admin.themeMeta?.axes.elevation ?? axes.elevation}
        >
          <ThemeDrawerPanel admin={admin} />
        </div>
      </Drawer>
    </>
  );
};

export default ThemeRuntimePanelButton;
