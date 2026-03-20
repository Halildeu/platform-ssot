/* ------------------------------------------------------------------ */
/*  LocaleProvider — locale + RTL context                              */
/* ------------------------------------------------------------------ */

import React, { createContext, useContext, useMemo } from "react";

export type Direction = "ltr" | "rtl";

export interface LocaleContextValue {
  locale: string;
  direction: Direction;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  direction: "ltr",
});

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

export interface LocaleProviderProps {
  locale?: string;
  direction?: Direction;
  children: React.ReactNode;
}

const RTL_LOCALES = new Set(["ar", "he", "fa", "ur"]);

export function LocaleProvider({
  locale = "en",
  direction,
  children,
}: LocaleProviderProps) {
  const resolvedDirection = direction ?? (RTL_LOCALES.has(locale) ? "rtl" : "ltr");

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, direction: resolvedDirection }),
    [locale, resolvedDirection],
  );

  return (
    <LocaleContext.Provider value={value}>
      <div dir={resolvedDirection}>{children}</div>
    </LocaleContext.Provider>
  );
}
