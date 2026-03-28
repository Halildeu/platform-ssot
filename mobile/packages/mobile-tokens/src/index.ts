export const colors = {
  background: "#F4F7FB",
  border: "#D8E2F0",
  danger: "#B54747",
  muted: "#5B6B82",
  primary: "#0E6BA8",
  primarySoft: "#DDEFFC",
  surface: "#FFFFFF",
  surfaceMuted: "#F8FBFE",
  text: "#12233A",
  warningSoft: "#FCEBC8",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const typography = {
  hero: 32,
  title: 20,
  body: 16,
  caption: 13,
} as const;

export const shadows = {
  card: {
    shadowColor: "#0F1B2A",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
} as const;

export const themeTokens = {
  colors,
  shadows,
  spacing,
  typography,
} as const;
