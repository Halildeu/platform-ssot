import React from 'react';
import { ChartDashboard } from '../ChartDashboard';
import { KPICard } from '../KPICard';
import { SparklineChart } from '../SparklineChart';
import { StatWidget } from '../StatWidget';

export const FourColumnKPIs = () => (
  <ChartDashboard columns={4} gap="md">
    <KPICard title="Users" value="12,847" trend={{ direction: 'up', value: '+12%', positive: true }} chart={<SparklineChart data={[10,12,8,15,13,17,20]} type="area" />} />
    <KPICard title="Sessions" value="1,234" trend={{ direction: 'up', value: '+3%', positive: true }} chart={<SparklineChart data={[5,8,6,9,7,11,12]} type="line" />} />
    <KPICard title="Error Rate" value="0.12%" trend={{ direction: 'down', value: '-0.03%', positive: true }} chart={<SparklineChart data={[3,2,4,1,2,1,1]} type="bar" />} />
    <KPICard title="Latency" value="142ms" trend={{ direction: 'down', value: '-8ms', positive: true }} chart={<SparklineChart data={[180,165,150,155,148,145,142]} type="line" />} />
  </ChartDashboard>
);

export const StatWidgets = () => (
  <ChartDashboard columns={3} gap="md">
    <StatWidget label="API Calls" value={45230} previousValue={42100} format="number" />
    <StatWidget label="Revenue" value={128500} previousValue={115000} format="currency" prefix="₺" />
    <StatWidget label="Conversion" value={0.0342} previousValue={0.031} format="percent" />
  </ChartDashboard>
);

export default { title: 'X-Charts/ChartDashboard', component: ChartDashboard };
