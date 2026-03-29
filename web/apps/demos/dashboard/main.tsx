/**
 * Dashboard Reference App
 * Shows: KPI cards, charts, activity feed, filters
 * Time to first value: < 10 minutes from create-app
 */
import React from "react";

// Document what imports would be used from @mfe packages:
// import { Card, Text, Badge, Stack, Divider } from "@mfe/design-system";
// import { BarChart, LineChart, PieChart, ChartContainer } from "@mfe/x-charts";

const DashboardDemo = () => (
  <div className="flex flex-col p-6 gap-6">
    <h1 className="text-2xl font-bold">Dashboard Reference App</h1>
    <p>Bu demo @mfe/design-system + @mfe/x-charts kullanarak bir KPI dashboard gösterir.</p>

    <section>
      <h2 className="text-xl font-semibold mb-3">Kullanılan Bileşenler</h2>
      <ul className="flex flex-col list-disc pl-6 gap-1">
        <li>Card, Text, Badge — layout</li>
        <li>BarChart, LineChart, PieChart — veri görselleştirme</li>
        <li>ChartContainer — loading/error/empty states</li>
        <li>Stack, Divider — composition</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-3">Sayfa Yapısı</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 bg-state-info-bg">
          <h3 className="font-semibold">KPI Cards</h3>
          <p className="text-sm text-text-secondary">Toplam Satış, Aktif Kullanıcı, Dönüşüm Oranı, Gelir</p>
        </div>
        <div className="border rounded-lg p-4 bg-state-success-bg">
          <h3 className="font-semibold">Charts Section</h3>
          <p className="text-sm text-text-secondary">LineChart (trend), BarChart (karşılaştırma), PieChart (dağılım)</p>
        </div>
        <div className="border rounded-lg p-4 bg-action-primary/10">
          <h3 className="font-semibold">Activity Feed</h3>
          <p className="text-sm text-text-secondary">Son işlemler, bildirimler, hızlı filtreler</p>
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-3">Başlangıç</h2>
      <pre className="bg-surface-inverse text-state-success-text p-4 rounded-lg text-sm overflow-x-auto">
        npx @mfe/create-app my-dashboard --template dashboard
      </pre>
    </section>
  </div>
);

export default DashboardDemo;
