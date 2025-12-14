export type RuntimeThemeMatrixTheme =
  | 'serban-light'
  | 'serban-dark'
  | 'serban-hc'
  | 'serban-compact';

export type RuntimeThemeMatrixAppearance = 'light' | 'dark' | 'high-contrast';
export type RuntimeThemeMatrixDensity = 'comfortable' | 'compact';
export type RuntimeThemeMatrixAccessState = 'full' | 'readonly' | 'disabled';

export const RUNTIME_THEME_MATRIX_THEMES: RuntimeThemeMatrixTheme[] = [
  'serban-light',
  'serban-dark',
  'serban-hc',
  'serban-compact',
];

export const RUNTIME_THEME_MATRIX_DENSITIES: RuntimeThemeMatrixDensity[] = [
  'comfortable',
  'compact',
];

export const RUNTIME_THEME_MATRIX_ACCESS_STATES: RuntimeThemeMatrixAccessState[] = [
  'full',
  'readonly',
  'disabled',
];

export const RUNTIME_THEME_MATRIX_APPEARANCE_MAP: Record<
  RuntimeThemeMatrixTheme,
  RuntimeThemeMatrixAppearance
> = {
  'serban-light': 'light',
  'serban-dark': 'dark',
  'serban-hc': 'high-contrast',
  'serban-compact': 'light',
};

export const THEME_MATRIX_HIDDEN_LABEL = 'Gizli Aksiyon';
