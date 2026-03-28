import { getThemeContract } from '@mfe/design-system';

export type RuntimeThemeMatrixTheme = string;

export type RuntimeThemeMatrixAppearance = 'light' | 'dark' | 'high-contrast';
export type RuntimeThemeMatrixDensity = 'comfortable' | 'compact';
export type RuntimeThemeMatrixAccessState = 'full' | 'readonly' | 'disabled';

const contract = getThemeContract();
const contractThemes =
  contract.allowedModes && contract.allowedModes.length > 0 ? contract.allowedModes : Object.keys(contract.modes ?? {});

export const RUNTIME_THEME_MATRIX_THEMES: RuntimeThemeMatrixTheme[] = contractThemes;

export const RUNTIME_THEME_MATRIX_DENSITIES: RuntimeThemeMatrixDensity[] = [
  'comfortable',
  'compact',
];

export const RUNTIME_THEME_MATRIX_ACCESS_STATES: RuntimeThemeMatrixAccessState[] = [
  'full',
  'readonly',
  'disabled',
];

export const RUNTIME_THEME_MATRIX_APPEARANCE_MAP: Record<RuntimeThemeMatrixTheme, RuntimeThemeMatrixAppearance> =
  contractThemes.reduce(
    (acc, modeKey) => {
      const appearance = contract.modes?.[modeKey]?.appearance;
      if (appearance === 'dark' || appearance === 'high-contrast') {
        acc[modeKey] = appearance;
      } else {
        acc[modeKey] = 'light';
      }
      return acc;
    },
    {} as Record<RuntimeThemeMatrixTheme, RuntimeThemeMatrixAppearance>,
  );

export const THEME_MATRIX_HIDDEN_LABEL = 'Gizli Aksiyon';
