import React, { createContext, useContext, useMemo, useState } from "react";
import { useReportingCatalog } from "./useReportingCatalog";
import {
  groupItemsByCategory,
  type CatalogItemLike,
  type GroupedCategory,
  type TopCategoryId,
} from "./reportingCategoryMap";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface ReportingContextValue {
  catalog: CatalogItemLike[];
  isLoading: boolean;
  grouped: Map<TopCategoryId, GroupedCategory>;
  activeCategory: TopCategoryId;
  setActiveCategory: (id: TopCategoryId) => void;
}

const ReportingContext = createContext<ReportingContextValue>({
  catalog: [],
  isLoading: true,
  grouped: new Map(),
  activeCategory: "business",
  setActiveCategory: () => {},
});

export function useReporting() {
  return useContext(ReportingContext);
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export const ReportingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { items, isLoading } = useReportingCatalog();
  const [activeCategory, setActiveCategory] =
    useState<TopCategoryId>("business");

  const grouped = useMemo(() => groupItemsByCategory(items), [items]);

  const value = useMemo<ReportingContextValue>(
    () => ({
      catalog: items,
      isLoading,
      grouped,
      activeCategory,
      setActiveCategory,
    }),
    [items, isLoading, grouped, activeCategory],
  );

  return (
    <ReportingContext.Provider value={value}>
      {children}
    </ReportingContext.Provider>
  );
};
