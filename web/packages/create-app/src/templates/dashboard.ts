import type { TemplateFile } from '../types';
import {
  generatePackageJson,
  generateTsConfig,
  generateViteConfig,
  generateIndexHtml,
  generateMain,
  generateCss,
  generateAppLayout,
} from './shared';

/* ------------------------------------------------------------------ */
/*  Dashboard template                                                 */
/* ------------------------------------------------------------------ */

export function generateDashboardTemplate(name: string): TemplateFile[] {
  return [
    { path: 'package.json', content: generatePackageJson(name, 'dashboard') },
    { path: 'tsconfig.json', content: generateTsConfig() },
    { path: 'vite.config.ts', content: generateViteConfig() },
    { path: 'index.html', content: generateIndexHtml(name) },
    { path: 'src/main.tsx', content: generateMain() },
    { path: 'src/App.tsx', content: generateDashboardApp() },
    { path: 'src/pages/DashboardPage.tsx', content: generateDashboardPage() },
    { path: 'src/layouts/AppLayout.tsx', content: generateAppLayout(name) },
    { path: 'src/index.css', content: generateCss() },
  ];
}

/* ------------------------------------------------------------------ */
/*  src/App.tsx                                                        */
/* ------------------------------------------------------------------ */

function generateDashboardApp(): string {
  return `import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';

const linkStyle: React.CSSProperties = {
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--color-text-secondary))',
};

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <AppLayout>
            <NavLink to="/" style={linkStyle}>
              Dashboard
            </NavLink>
          </AppLayout>
        }
      >
        <Route index element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}
`;
}

/* ------------------------------------------------------------------ */
/*  src/pages/DashboardPage.tsx                                        */
/* ------------------------------------------------------------------ */

function generateDashboardPage(): string {
  return `import React from 'react';
import {
  DashboardPageTemplate,
} from '@mfe/blocks';
import type {
  KPIMetric,
  ChartGridItem,
  ActivityItem,
} from '@mfe/blocks';

/* ------------------------------------------------------------------ */
/*  Sample data                                                        */
/* ------------------------------------------------------------------ */

const kpis: KPIMetric[] = [
  {
    title: 'Total Revenue',
    value: '$48,250',
    trend: { direction: 'up', value: '+12.5%' },
  },
  {
    title: 'Active Users',
    value: '2,340',
    trend: { direction: 'up', value: '+8.1%' },
  },
  {
    title: 'Orders',
    value: '1,120',
    trend: { direction: 'down', value: '-2.3%' },
  },
  {
    title: 'Conversion Rate',
    value: '3.24%',
    trend: { direction: 'flat', value: '0.0%' },
  },
];

const charts: ChartGridItem[] = [
  {
    id: 'revenue-trend',
    title: 'Revenue Trend',
    type: 'line',
    data: [
      { label: 'Jan', value: 3200 },
      { label: 'Feb', value: 4100 },
      { label: 'Mar', value: 3800 },
      { label: 'Apr', value: 5200 },
      { label: 'May', value: 4800 },
      { label: 'Jun', value: 6100 },
    ],
  },
  {
    id: 'orders-by-category',
    title: 'Orders by Category',
    type: 'bar',
    data: [
      { label: 'Electronics', value: 420 },
      { label: 'Clothing', value: 310 },
      { label: 'Food', value: 280 },
      { label: 'Books', value: 110 },
    ],
  },
];

const recentActivity: ActivityItem[] = [
  { id: '1', text: 'New order #1042 placed by John D.', time: '5 min ago' },
  { id: '2', text: 'User sarah@example.com registered', time: '12 min ago' },
  { id: '3', text: 'Payment received for order #1039', time: '25 min ago' },
  { id: '4', text: 'Product "Widget Pro" stock low (5 remaining)', time: '1 hr ago' },
  { id: '5', text: 'Monthly report generated', time: '2 hr ago' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  return (
    <DashboardPageTemplate
      title="Dashboard"
      kpis={kpis}
      charts={charts}
      recentActivity={recentActivity}
    />
  );
}
`;
}
