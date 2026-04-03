/* ------------------------------------------------------------------ */
/*  Charts — Shared types                                              */
/* ------------------------------------------------------------------ */

export type ChartSize = "sm" | "md" | "lg";

export type ChartDataPoint = {
  label: string;
  value: number;
  color?: string;
};

export type ChartSeries = {
  name: string;
  data: number[];
  color?: string;
};

export type ChartLocaleText = {
  noData?: string;
  total?: string;
};

export type ChartClickEvent = {
  datum: Record<string, unknown>;
  seriesId?: string;
  xKey?: string;
  yKey?: string;
  value?: number;
  label?: string;
};
