import React from 'react';
import { KPICard } from '../KPICard';
import { SparklineChart } from '../SparklineChart';

export const Default = () => (
  <KPICard title="Users" value="12,847" />
);

export const WithTrend = () => (
  <KPICard
    title="Revenue"
    value="$128,500"
    trend={{ direction: 'up', value: '+12.5%', positive: true }}
  />
);

export const WithChart = () => (
  <KPICard
    title="Active Sessions"
    value="1,234"
    trend={{ direction: 'up', value: '+3.2%', positive: true }}
    chart={<SparklineChart data={[10, 12, 8, 15, 13, 17, 20]} type="area" />}
  />
);

export default { title: 'X-Charts/KPICard', component: KPICard };
