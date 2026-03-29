import type { ExampleEntry } from './types';

export const examples: Record<string, ExampleEntry[]> = {
  CommandPalette: [
    {
      id: "cmdpalette-basic",
      title: "Temel Komut Paleti",
      description: "Cmd+K stilinde arama ve komut calistirma paneli.",
      category: "advanced",
      code: `import { CommandPalette } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(true);

  return (
    <CommandPalette
      open={open}
      onClose={() => setOpen(false)}
      onSelect={(id) => console.log('Secildi:', id)}
      items={[
        { id: 'dashboard', title: 'Dashboard', description: 'Ana kontrol paneline git', group: 'Navigasyon', shortcut: 'G D' },
        { id: 'settings', title: 'Ayarlar', description: 'Sistem ayarlarini yonet', group: 'Navigasyon', shortcut: 'G S' },
        { id: 'new-policy', title: 'Yeni Politika Olustur', description: 'Otonom ajan politikasi tanimla', group: 'Islemler' },
        { id: 'deploy', title: 'Deploy Baslat', description: 'Production ortamina dagitim', group: 'Islemler', shortcut: 'Ctrl+D' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["komut", "command", "palette", "arama", "cmd-k"],
    },
    {
      id: "cmdpalette-with-badges",
      title: "Rozetli Komutlar",
      description: "Devre disi komutlar ve rozetlerle zenginlestirilmis palet.",
      category: "advanced",
      code: `import { CommandPalette } from '@mfe/design-system';
import { Badge } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(true);

  return (
    <CommandPalette
      open={open}
      onClose={() => setOpen(false)}
      onSelect={(id) => console.log('Calistirildi:', id)}
      items={[
        { id: 'ai-suggest', title: 'AI Oneri Al', group: 'AI', badge: <Badge variant="info">Beta</Badge> },
        { id: 'ai-review', title: 'Kod Incelemesi', group: 'AI', badge: <Badge variant="success">Hazir</Badge> },
        { id: 'ai-generate', title: 'Test Uret', group: 'AI', badge: <Badge variant="warning">Deneysel</Badge>, disabled: true },
        { id: 'export', title: 'Rapor Indir', group: 'Genel', shortcut: 'Ctrl+E' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["badge", "rozet", "disabled", "devre-disi", "ai"],
    },
  ],
  TreeTable: [
    {
      id: "treetable-basic",
      title: "Temel Agac Tablo",
      description: "Hiyerarsik veri yapisi icin acilir-kapanir satirli tablo.",
      category: "layout",
      code: `import { TreeTable } from '@mfe/design-system';

export function Example() {
  return (
    <TreeTable
      title="Organizasyon Yapisi"
      treeColumnLabel="Birim"
      columns={[
        { key: 'calisan', label: 'Calisan Sayisi', accessor: 'calisan' },
        { key: 'butce', label: 'Butce', accessor: 'butce', emphasis: true },
      ]}
      nodes={[
        {
          key: 'muhendislik',
          label: 'Muhendislik',
          children: [
            { key: 'fe', label: 'Frontend', data: { calisan: '12', butce: '450K TL' } },
            { key: 'be', label: 'Backend', data: { calisan: '8', butce: '380K TL' } },
            { key: 'devops', label: 'DevOps', data: { calisan: '5', butce: '290K TL' } },
          ],
        },
        {
          key: 'urun',
          label: 'Urun',
          children: [
            { key: 'pm', label: 'Urun Yonetimi', data: { calisan: '4', butce: '220K TL' } },
            { key: 'design', label: 'Tasarim', data: { calisan: '6', butce: '310K TL' } },
          ],
        },
      ]}
      defaultExpandedKeys={['muhendislik']}
    />
  );
}`,
      previewProps: {},
      tags: ["agac", "tree", "tablo", "hiyerarsi", "organizasyon"],
    },
    {
      id: "treetable-badges",
      title: "Rozetli ve Tonlu Satirlar",
      description: "Duruma gore renklendirilmis satirlar ve rozetler.",
      category: "advanced",
      code: `import { TreeTable } from '@mfe/design-system';

export function Example() {
  return (
    <TreeTable
      title="Servis Durumu"
      treeColumnLabel="Servis"
      columns={[
        { key: 'uptime', label: 'Uptime', accessor: 'uptime' },
        { key: 'latency', label: 'Gecikme', accessor: 'latency' },
      ]}
      nodes={[
        {
          key: 'api',
          label: 'API Gateway',
          badges: ['Kritik'],
          tone: 'success',
          data: { uptime: '%99.98', latency: '12ms' },
          children: [
            { key: 'auth', label: 'Auth Service', tone: 'success', data: { uptime: '%99.99', latency: '8ms' } },
            { key: 'rate', label: 'Rate Limiter', tone: 'warning', badges: ['Yavas'], data: { uptime: '%99.5', latency: '45ms' } },
          ],
        },
        {
          key: 'db',
          label: 'Veritabani Cluster',
          tone: 'danger',
          badges: ['Inceleniyor'],
          data: { uptime: '%98.2', latency: '120ms' },
          children: [
            { key: 'primary', label: 'Primary', tone: 'success', data: { uptime: '%99.9', latency: '5ms' } },
            { key: 'replica', label: 'Replica-2', tone: 'danger', badges: ['Baglanti Hatasi'], data: { uptime: '%91.0', latency: '350ms' } },
          ],
        },
      ]}
      defaultExpandedKeys={['api', 'db']}
    />
  );
}`,
      previewProps: {},
      tags: ["rozet", "badge", "ton", "tone", "servis", "durum"],
    },
    {
      id: "treetable-selectable",
      title: "Secim Yapilabilen Agac",
      description: "Dugum secimi ve compact gorunum destegi.",
      category: "advanced",
      code: `import { TreeTable } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [selected, setSelected] = useState<React.Key | null>('dosya-1');

  return (
    <TreeTable
      title="Dosya Gezgini"
      treeColumnLabel="Dosya / Klasor"
      density="compact"
      selectedKey={selected}
      onNodeSelect={(key) => setSelected(key)}
      columns={[
        { key: 'boyut', label: 'Boyut', accessor: 'boyut', align: 'right' },
        { key: 'degistirilme', label: 'Son Degisiklik', accessor: 'degistirilme' },
      ]}
      nodes={[
        {
          key: 'src',
          label: 'src',
          children: [
            { key: 'dosya-1', label: 'index.ts', data: { boyut: '2.4 KB', degistirilme: '2 saat once' } },
            { key: 'dosya-2', label: 'App.tsx', data: { boyut: '5.1 KB', degistirilme: 'Dun' } },
          ],
        },
        {
          key: 'public',
          label: 'public',
          children: [
            { key: 'dosya-3', label: 'favicon.ico', data: { boyut: '1.2 KB', degistirilme: '3 gun once' } },
          ],
        },
      ]}
      defaultExpandedKeys={['src', 'public']}
    />
  );
}`,
      previewProps: {},
      tags: ["secim", "selectable", "compact", "dosya", "gezgin"],
    },
  ],
  Descriptions: [
    {
      id: "desc-basic",
      title: "Temel Bilgi Karti",
      description: "Anahtar-deger ciftleriyle yapilandirilmis veri gosterimi.",
      category: "basic",
      code: `import { Descriptions } from '@mfe/design-system';

export function Example() {
  return (
    <Descriptions
      title="Musteri Bilgileri"
      columns={2}
      bordered
      items={[
        { key: 'ad', label: 'Ad Soyad', value: 'Mehmet Yilmaz' },
        { key: 'email', label: 'E-posta', value: 'mehmet@ornek.com' },
        { key: 'telefon', label: 'Telefon', value: '+90 532 123 4567' },
        { key: 'konum', label: 'Konum', value: 'Istanbul, Turkiye' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["bilgi", "anahtar-deger", "kart", "musteri"],
    },
    {
      id: "desc-toned",
      title: "Tonlu Degerler",
      description: "Durum bilgisiyle renk vurgulanan onemli satirlar.",
      category: "layout",
      code: `import { Descriptions } from '@mfe/design-system';

export function Example() {
  return (
    <Descriptions
      title="Sunucu Durumu"
      description="Uretim ortami ozet bilgileri."
      columns={3}
      bordered
      items={[
        { key: 'cpu', label: 'CPU Kullanimi', value: '%42', tone: 'success' },
        { key: 'ram', label: 'Bellek', value: '%78', tone: 'warning' },
        { key: 'disk', label: 'Disk', value: '%92', tone: 'danger', helper: 'Acil temizlik gerekli' },
        { key: 'uptime', label: 'Uptime', value: '45 gun', tone: 'info' },
        { key: 'versiyon', label: 'Versiyon', value: 'v3.2.1' },
        { key: 'ortam', label: 'Ortam', value: 'Production' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["ton", "tone", "durum", "sunucu", "helper"],
    },
    {
      id: "desc-span",
      title: "Satirlararasi Yayilma",
      description: "span ozelligi ile birden fazla sutuna yayilan degerler.",
      category: "layout",
      code: `import { Descriptions } from '@mfe/design-system';

export function Example() {
  return (
    <Descriptions
      title="Siparis Detayi"
      columns={3}
      bordered
      items={[
        { key: 'no', label: 'Siparis No', value: '#ORD-2026-00142' },
        { key: 'tarih', label: 'Siparis Tarihi', value: '15 Mart 2026' },
        { key: 'durum', label: 'Durum', value: 'Kargoya Verildi', tone: 'success' },
        { key: 'adres', label: 'Teslimat Adresi', value: 'Kadikoy, Istanbul - Turkiye', span: 2 },
        { key: 'tutar', label: 'Toplam Tutar', value: '1.250,00 TL', tone: 'info' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["span", "yayilma", "siparis", "detay"],
    },
  ],
  Slider: [
    {
      id: "slider-basic",
      title: "Temel Slider",
      description: "Etiket ve deger gosterimli standart aralik kaydirici.",
      category: "form",
      code: `import { Slider } from '@mfe/design-system';

export function Example() {
  return (
    <Slider
      label="Ses Seviyesi"
      defaultValue={60}
      min={0}
      max={100}
    />
  );
}`,
      previewProps: { label: "Ses Seviyesi", defaultValue: 60, min: 0, max: 100 },
      tags: ["slider", "aralik", "kaydirici", "ses"],
    },
    {
      id: "slider-formatted",
      title: "Formatli Deger",
      description: "valueFormatter ile ozel deger bicimlendirmesi.",
      category: "form",
      code: `import { Slider } from '@mfe/design-system';

export function Example() {
  return (
    <Slider
      label="Butce Limiti"
      defaultValue={5000}
      min={1000}
      max={50000}
      step={500}
      minLabel="1.000 TL"
      maxLabel="50.000 TL"
      valueFormatter={(v) => \`\${v.toLocaleString('tr-TR')} TL\`}
    />
  );
}`,
      previewProps: { label: "Butce Limiti", defaultValue: 5000, min: 1000, max: 50000, step: 500 },
      tags: ["format", "para", "butce", "valueFormatter"],
    },
    {
      id: "slider-validation",
      title: "Hata Durumu",
      description: "Gecersiz deger icin hata mesaji gosterimi.",
      category: "form",
      code: `import { Slider } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [value, setValue] = useState(95);
  const hasError = value > 80;

  return (
    <Slider
      label="CPU Esik Degeri"
      value={value}
      onValueChange={(v) => setValue(v)}
      min={0}
      max={100}
      error={hasError ? 'Esik degeri %80 uzerinde olmamalidir.' : undefined}
      invalid={hasError}
      valueFormatter={(v) => \`%\${v}\`}
    />
  );
}`,
      previewProps: { label: "CPU Esik Degeri", error: "Esik degeri %80 uzerinde olmamalidir.", invalid: true },
      tags: ["hata", "error", "validation", "esik"],
    },
  ],
  PageHeader: [
    {
      id: "page-header-basic",
      title: "Temel Sayfa Basligi",
      description: "Baslik, alt baslik ve aksiyonlar iceren standart sayfa basligi.",
      category: "basic",
      code: `import { PageHeader } from '@mfe/design-system';
import { Button } from '@mfe/design-system';
import { Plus } from 'lucide-react';

export function Example() {
  return (
    <PageHeader
      title="Musteri Listesi"
      subtitle="Tum kayitli musterileri goruntuleyin ve yonetin."
      actions={
        <Button variant="primary">
          <Plus className="h-4 w-4 mr-1" /> Yeni Musteri
        </Button>
      }
    />
  );
}`,
      previewProps: {},
      tags: ["baslik", "header", "sayfa"],
    },
    {
      id: "page-header-breadcrumb",
      title: "Breadcrumb ile Sayfa Basligi",
      description: "Breadcrumb navigasyonu, etiketler ve avatar iceren zengin baslik.",
      category: "layout",
      code: `import { PageHeader } from '@mfe/design-system';
import { Badge } from '@mfe/design-system';
import { Button } from '@mfe/design-system';
import { Settings, Download } from 'lucide-react';

export function Example() {
  return (
    <PageHeader
      breadcrumb={
        <nav className="text-sm text-text-subtle">
          <a href="/admin">Yonetim</a> / <a href="/admin/projeler">Projeler</a> / Detay
        </nav>
      }
      title="Kampanya Yonetimi"
      subtitle="2024 Q4 hedefleri icin aktif kampanya detaylari."
      tags={<Badge variant="success">Aktif</Badge>}
      actions={
        <div className="flex gap-2">
          <Button variant="secondary"><Download className="h-4 w-4 mr-1" /> Rapor</Button>
          <Button variant="ghost"><Settings className="h-4 w-4" /></Button>
        </div>
      }
      sticky
    />
  );
}`,
      previewProps: {},
      tags: ["breadcrumb", "sticky", "badge", "navigasyon"],
    },
    {
      id: "page-header-with-footer",
      title: "Footer Alani ile Sayfa Basligi",
      description: "Baslik altinda tab navigasyonu veya ek bilgi alani iceren baslik.",
      category: "patterns",
      code: `import { PageHeader } from '@mfe/design-system';
import { Tabs } from '@mfe/design-system';

export function Example() {
  return (
    <PageHeader
      title="Siparis Yonetimi"
      subtitle="Siparisleri takip edin ve durum guncellemelerini yapin."
      footer={
        <Tabs defaultValue="bekleyen">
          <Tabs.List>
            <Tabs.Tab value="bekleyen">Bekleyen</Tabs.Tab>
            <Tabs.Tab value="onaylanan">Onaylanan</Tabs.Tab>
            <Tabs.Tab value="tamamlanan">Tamamlanan</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      }
    />
  );
}`,
      previewProps: {},
      tags: ["footer", "tabs", "navigasyon"],
    },
  ],
  PageLayout: [
    {
      id: "page-layout-basic",
      title: "Temel Sayfa Yerlesimi",
      description: "Baslik, icerik ve footer iceren standart sayfa iskeleti.",
      category: "layout",
      code: `import { PageLayout } from '@mfe/design-system';
import { Button } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout
      title="Envanter Yonetimi"
      description="Depo stoklarini takip edin ve yonetin."
      breadcrumbItems={[
        { title: 'Ana Sayfa', path: '/' },
        { title: 'Envanter' },
      ]}
      actions={<Button variant="primary">Urun Ekle</Button>}
      footer={
        <div className="flex justify-end">
          <span className="text-sm text-text-subtle">Toplam 1.284 kayit</span>
        </div>
      }
    >
      <div className="rounded-lg border p-8 text-center text-text-disabled">
        Tablo icerigi buraya gelir
      </div>
    </PageLayout>
  );
}`,
      previewProps: {},
      tags: ["layout", "yerlesim", "iskelet", "breadcrumb"],
    },
    {
      id: "page-layout-detail-sidebar",
      title: "Detay Panelli Yerlesim",
      description: "Yan detay paneli ile iki kolonlu sayfa yapisi.",
      category: "patterns",
      code: `import { PageLayout, createPageLayoutPreset } from '@mfe/design-system';
import { Button } from '@mfe/design-system';

export function Example() {
  const preset = createPageLayoutPreset({ preset: 'detail-sidebar' });

  return (
    <PageLayout
      {...preset}
      title="Musteri Detayi"
      actions={<Button variant="secondary">Duzenle</Button>}
      detail={
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Iletisim Bilgileri</h3>
            <p className="text-sm text-text-subtle">email@ornek.com</p>
            <p className="text-sm text-text-subtle">+90 555 123 4567</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Son Islemler</h3>
            <p className="text-sm text-text-subtle">3 aktif siparis</p>
          </div>
        </div>
      }
    >
      <div className="rounded-lg border p-8 text-center text-text-disabled">
        Ana icerik alani
      </div>
    </PageLayout>
  );
}`,
      previewProps: {},
      tags: ["detail", "sidebar", "iki-kolon", "preset"],
    },
  ],
  FilterBar: [
    {
      id: "filter-bar-basic",
      title: "Temel Filtre Cubugu",
      description: "Arama, filtre kontrolleri ve aksiyonlar iceren filtre cubugu.",
      category: "form",
      code: `import { FilterBar } from '@mfe/design-system';
import { Input, Select, Button } from '@mfe/design-system';
import { Search, RotateCcw } from 'lucide-react';

export function Example() {
  return (
    <FilterBar
      search={
        <Input
          placeholder="Ara..."
          prefix={<Search className="h-4 w-4" />}
          className="w-64"
        />
      }
      actions={
        <Button variant="ghost" size="sm">
          <RotateCcw className="h-4 w-4 mr-1" /> Sifirla
        </Button>
      }
    >
      <Select placeholder="Durum" options={[
        { value: 'active', label: 'Aktif' },
        { value: 'passive', label: 'Pasif' },
      ]} />
      <Select placeholder="Kategori" options={[
        { value: 'urun', label: 'Urun' },
        { value: 'hizmet', label: 'Hizmet' },
      ]} />
    </FilterBar>
  );
}`,
      previewProps: {},
      tags: ["filtre", "arama", "filter", "search"],
    },
    {
      id: "filter-bar-advanced",
      title: "Gelismis Filtreler",
      description: "Acilir gelismis filtre paneli ve aktif filtre sayaci iceren filtre cubugu.",
      category: "advanced",
      code: `import { FilterBar } from '@mfe/design-system';
import { Input, Select, DatePicker, Button } from '@mfe/design-system';

export function Example() {
  return (
    <FilterBar
      search={<Input placeholder="Siparis no veya musteri adi..." className="w-72" />}
      activeCount={3}
      moreLabel="Gelismis Filtreler"
      moreFilters={
        <>
          <DatePicker label="Baslangic" />
          <DatePicker label="Bitis" />
          <Select placeholder="Bolge" options={[
            { value: 'istanbul', label: 'Istanbul' },
            { value: 'ankara', label: 'Ankara' },
            { value: 'izmir', label: 'Izmir' },
          ]} />
        </>
      }
      actions={<Button variant="primary" size="sm">Filtrele</Button>}
    >
      <Select placeholder="Siparis Durumu" options={[
        { value: 'bekleyen', label: 'Bekleyen' },
        { value: 'kargoda', label: 'Kargoda' },
        { value: 'teslim', label: 'Teslim Edildi' },
      ]} />
    </FilterBar>
  );
}`,
      previewProps: { activeCount: 3 },
      tags: ["gelismis", "advanced", "tarih", "filtre"],
    },
    {
      id: "filter-bar-compact",
      title: "Kompakt Filtre Cubugu",
      description: "Dar alanlarda kullanilmak uzere azaltilmis bosluklu kompakt mod.",
      category: "layout",
      code: `import { FilterBar } from '@mfe/design-system';
import { Input, Select } from '@mfe/design-system';

export function Example() {
  return (
    <FilterBar compact>
      <Input placeholder="Hizli ara..." size="sm" className="w-48" />
      <Select placeholder="Tip" size="sm" options={[
        { value: 'all', label: 'Tumunu Goster' },
        { value: 'alert', label: 'Uyarilar' },
        { value: 'error', label: 'Hatalar' },
      ]} />
    </FilterBar>
  );
}`,
      previewProps: { compact: true },
      tags: ["kompakt", "compact", "dar"],
    },
  ],
  SummaryStrip: [
    {
      id: "summary-strip-basic",
      title: "Temel Metrik Seridi",
      description: "KPI degerleri gosteren yatay metrik karti seridi.",
      category: "basic",
      code: `import { SummaryStrip } from '@mfe/design-system';

export function Example() {
  return (
    <SummaryStrip
      items={[
        { key: 'gelir', label: 'Toplam Gelir', value: '₺1.284.500' },
        { key: 'siparis', label: 'Siparis Sayisi', value: '3.842' },
        { key: 'musteri', label: 'Aktif Musteri', value: '1.205' },
        { key: 'iade', label: 'Iade Orani', value: '%2.4' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["metrik", "kpi", "istatistik"],
    },
    {
      id: "summary-strip-tones",
      title: "Tonlu Metrik Kartlari",
      description: "Durum tonlari, ikon ve trend bilgisi iceren zengin metrik seridi.",
      category: "advanced",
      code: `import { SummaryStrip } from '@mfe/design-system';
import { TrendingUp, TrendingDown, Users, ShoppingCart } from 'lucide-react';

export function Example() {
  return (
    <SummaryStrip
      title="Aylik Performans"
      description="Son 30 gunluk ozet veriler."
      columns={3}
      items={[
        {
          key: 'gelir',
          label: 'Aylik Gelir',
          value: '₺842.300',
          tone: 'success',
          icon: <TrendingUp />,
          trend: <span className="text-state-success-text">+12.5%</span>,
          note: 'Gecen aya gore artis',
        },
        {
          key: 'siparis',
          label: 'Toplam Siparis',
          value: '1.523',
          tone: 'info',
          icon: <ShoppingCart />,
          trend: <span className="text-action-primary">+8.2%</span>,
        },
        {
          key: 'musteri',
          label: 'Yeni Musteri',
          value: '287',
          tone: 'warning',
          icon: <Users />,
          trend: <span className="text-state-warning-text">-3.1%</span>,
          note: 'Hedefin altinda',
        },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["tone", "trend", "icon", "performans"],
    },
  ],};
