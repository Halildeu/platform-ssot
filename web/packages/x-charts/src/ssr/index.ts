'use client';

/**
 * SSR/RSC Client Boundary
 *
 * ECharts requires DOM access (canvas/svg) and cannot render server-side.
 * This module re-exports chart components wrapped with 'use client' directive
 * so Next.js RSC and other SSR frameworks skip server rendering.
 *
 * All chart components that touch ECharts must go through this boundary.
 *
 * Usage in RSC context:
 * ```tsx
 * import { ClientChartContainer } from '@mfe/x-charts/ssr';
 * ```
 *
 * @see R-004 risk: ECharts SSR incompatibility
 */

export { ChartContainer } from '../ChartContainer';
export { ChartDashboard } from '../ChartDashboard';

// Re-export types (types are safe in RSC)
export type { ChartContainerProps } from '../ChartContainer';
export type { ChartDashboardProps } from '../ChartDashboard';
