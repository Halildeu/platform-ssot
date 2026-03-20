import manifest from '../manifest.json' with { type: 'json' };

import enAccess from './locales/en/access';
import enAudit from './locales/en/audit';
import enCommon from './locales/en/common';
import enReports from './locales/en/reports';
import enUsers from './locales/en/users';
import deAccess from './locales/de/access';
import deAudit from './locales/de/audit';
import deCommon from './locales/de/common';
import deDesignLab from './locales/de/designlab';
import deThemeAdmin from './locales/de/themeadmin';
import deReports from './locales/de/reports';
import deUsers from './locales/de/users';
import esAccess from './locales/es/access';
import esAudit from './locales/es/audit';
import esCommon from './locales/es/common';
import esDesignLab from './locales/es/designlab';
import esThemeAdmin from './locales/es/themeadmin';
import esReports from './locales/es/reports';
import esUsers from './locales/es/users';
import trAccess from './locales/tr/access';
import trAudit from './locales/tr/audit';
import trCommon from './locales/tr/common';
import trDesignLab from './locales/tr/designlab';
import trThemeAdmin from './locales/tr/themeadmin';
import trReports from './locales/tr/reports';
import trUsers from './locales/tr/users';
import pseudoAccess from './locales/pseudo/access';
import pseudoCommon from './locales/pseudo/common';
import pseudoAudit from './locales/pseudo/audit';
import pseudoDesignLab from './locales/pseudo/designlab';
import pseudoThemeAdmin from './locales/pseudo/themeadmin';
import pseudoReports from './locales/pseudo/reports';
import pseudoUsers from './locales/pseudo/users';
import enDesignLab from './locales/en/designlab';
import enThemeAdmin from './locales/en/themeadmin';

type SupportedNamespace = 'access' | 'audit' | 'common' | 'designlab' | 'reports' | 'themeadmin' | 'users';
type SupportedLocale = 'en' | 'tr' | 'pseudo' | 'de' | 'es';

type DictionaryMap = Record<SupportedNamespace, Record<string, string>>;
type DictionaryDefinition = Record<SupportedLocale, DictionaryMap>;

const dictionaries: DictionaryDefinition = {
  en: {
    access: enAccess,
    audit: enAudit,
    common: enCommon,
    designlab: enDesignLab,
    reports: enReports,
    themeadmin: enThemeAdmin,
    users: enUsers,
  },
  de: {
    access: deAccess,
    audit: deAudit,
    common: deCommon,
    designlab: deDesignLab,
    reports: deReports,
    themeadmin: deThemeAdmin,
    users: deUsers,
  },
  es: {
    access: esAccess,
    audit: esAudit,
    common: esCommon,
    designlab: esDesignLab,
    reports: esReports,
    themeadmin: esThemeAdmin,
    users: esUsers,
  },
  tr: {
    access: trAccess,
    audit: trAudit,
    common: trCommon,
    designlab: trDesignLab,
    reports: trReports,
    themeadmin: trThemeAdmin,
    users: trUsers,
  },
  pseudo: {
    access: pseudoAccess,
    audit: pseudoAudit,
    common: pseudoCommon,
    designlab: pseudoDesignLab,
    reports: pseudoReports,
    themeadmin: pseudoThemeAdmin,
    users: pseudoUsers,
  },
};

const DEFAULT_LOCALE: SupportedLocale = 'en';
const FALLBACK_CHAIN: SupportedLocale[] = ['tr', 'en'];
const DICTIONARY_VERSION = typeof manifest.version === 'string' ? manifest.version : '0.0.0';

export type GetDictionaryResult = {
  dictionary: Record<string, string>;
  locale: SupportedLocale;
  namespace: SupportedNamespace;
  version: string;
};

const normaliseLocale = (locale: string): SupportedLocale => {
  const short = locale.toLowerCase().split('-')[0];
  if (short === 'tr') {
    return 'tr';
  }
  if (short === 'de') {
    return 'de';
  }
  if (short === 'es') {
    return 'es';
  }
  if (short === 'pseudo' || short === 'ps' || short === 'zz') {
    return 'pseudo';
  }
  return 'en';
};

export const getDictionary = (
  locale: string,
  namespace: string,
): GetDictionaryResult | null => {
  const normalisedLocale = normaliseLocale(locale);
  if (!Object.prototype.hasOwnProperty.call(dictionaries[DEFAULT_LOCALE], namespace)) {
    return null;
  }
  const ns = namespace as SupportedNamespace;
  const tryFallbacks = [normalisedLocale, ...FALLBACK_CHAIN];
  let dictionary: Record<string, string> | undefined;
  let resolvedLocale: SupportedLocale = DEFAULT_LOCALE;
  for (const loc of tryFallbacks) {
    if (dictionaries[loc]?.[ns]) {
      dictionary = dictionaries[loc][ns];
      resolvedLocale = loc;
      break;
    }
  }
  if (!dictionary) {
    return null;
  }
  return {
    dictionary,
    locale: resolvedLocale,
    namespace: ns,
    version: `${DICTIONARY_VERSION}-${ns}`,
  };
};

export const getAvailableLocales = (): SupportedLocale[] => Object.keys(dictionaries) as SupportedLocale[];
export const getAvailableNamespaces = (): SupportedNamespace[] => ['access', 'audit', 'common', 'designlab', 'reports', 'themeadmin', 'users'];
export const dictionaryVersion = DICTIONARY_VERSION;

export type { SupportedLocale, SupportedNamespace };
