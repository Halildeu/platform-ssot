import React, { useMemo, useCallback } from 'react';
import { Globe, Check } from 'lucide-react';
import { Dropdown } from '@mfe/design-system';
import type { DropdownEntry } from '@mfe/design-system';
import { useShellCommonI18n } from '../../i18n';

/* ------------------------------------------------------------------ */
/*  LanguageSelector — Globe icon + Dropdown (no emojis, no flags)     */
/* ------------------------------------------------------------------ */

const LOCALES = [
  { code: 'tr', labelKey: 'shell.language.tr', tag: 'TR' },
  { code: 'en', labelKey: 'shell.language.en', tag: 'EN' },
  { code: 'de', labelKey: 'shell.language.de', tag: 'DE' },
  { code: 'es', labelKey: 'shell.language.es', tag: 'ES' },
] as const;

export const LanguageSelector: React.FC = () => {
  const { t, manager: i18nManager, locale } = useShellCommonI18n();

  const changeLocale = useCallback(
    (nextLocale: string) => {
      i18nManager.setLocale(nextLocale);
      try {
        window.localStorage.setItem('mfe.locale', nextLocale);
        window.dispatchEvent(
          new CustomEvent('app:locale-change', { detail: { locale: nextLocale } }),
        );
      } catch { /* storage unavailable */ }
    },
    [i18nManager],
  );

  const items = useMemo<DropdownEntry[]>(() => {
    const entries: DropdownEntry[] = [
      { type: 'label' as const, label: t('shell.header.language') },
    ];
    for (const loc of LOCALES) {
      entries.push({
        key: loc.code,
        label: (
          <span className="flex items-center gap-2">
            <span className="w-5 text-center text-[11px] font-bold text-text-subtle">{loc.tag}</span>
            <span>{t(loc.labelKey)}</span>
            {locale === loc.code && <Check className="ml-auto h-3.5 w-3.5 text-[var(--accent-primary)]" />}
          </span>
        ),
        onClick: () => changeLocale(loc.code),
      });
    }
    return entries;
  }, [t, locale, changeLocale]);

  return (
    <Dropdown items={items} placement="bottom-end" minWidth={180}>
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary"
        aria-label={t('shell.header.languageSelectAria')}
        title={t('shell.header.languageSelectAria')}
      >
        <Globe className="h-[18px] w-[18px]" aria-hidden />
      </button>
    </Dropdown>
  );
};
