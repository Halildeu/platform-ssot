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
