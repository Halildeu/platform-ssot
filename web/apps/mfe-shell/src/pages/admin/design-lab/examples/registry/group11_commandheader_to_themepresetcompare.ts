import type { ExampleEntry } from './types';

export const examples: Record<string, ExampleEntry[]> = {
  CommandHeader: [
    {
      id: "cmd-header-basic",
      title: "Temel Komut Başlığı",
      description: "Arama alanı ve menü öğeleri içeren varsayılan komut başlığı.",
      category: "basic",
      code: `import { MenuBar } from '@mfe/design-system';

export function Example() {
  return (
    <MenuBar
      items={[
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'reports', label: 'Raporlar' },
        { key: 'settings', label: 'Ayarlar' },
      ]}
      searchPlaceholder="Komut ara..."
    />
  );
}`,
      previewProps: {},
      tags: ["arama", "navigasyon", "komut"],
    },
    {
      id: "cmd-header-favorites",
      title: "Favoriler ile Komut Başlığı",
      description: "Son kullanılanlar ve favori kısayolları gösteren komut başlığı.",
      category: "advanced",
      code: `import { MenuBar } from '@mfe/design-system';

export function Example() {
  return (
    <MenuBar
      items={[
        { key: 'dashboard', label: 'Dashboard', isFavorite: true },
        { key: 'reports', label: 'Raporlar' },
        { key: 'users', label: 'Kullanıcılar', isFavorite: true },
      ]}
      searchPlaceholder="Hızlı erişim..."
      showRecents
    />
  );
}`,
      previewProps: {},
      tags: ["favori", "son-kullanilanlar", "kisayol"],
    },
    {
      id: "cmd-header-submenu",
      title: "Alt Menü Aksiyonları",
      description: "Zengin alt menü metadata ile derinlemesine navigasyon.",
      category: "patterns",
      code: `import { MenuBar } from '@mfe/design-system';

export function Example() {
  return (
    <MenuBar
      items={[
        {
          key: 'operations',
          label: 'Operasyonlar',
          children: [
            { key: 'batch', label: 'Toplu İşlem' },
            { key: 'export', label: 'Dışa Aktar' },
          ],
        },
      ]}
      searchPlaceholder="Komut ara..."
    />
  );
}`,
      previewProps: {},
      tags: ["alt-menu", "navigasyon", "operasyon"],
    },
  ],
  CommandWorkspace: [
    {
      id: "cmd-workspace-basic",
      title: "Temel Komut Çalışma Alanı",
      description: "Arama odaklı komut yüzeyi ile sonuç paneli.",
      category: "basic",
      code: `import { PageLayout, FilterBar, TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout pageWidth="wide" stickyHeader>
      <PageLayout.Header>
        <FilterBar searchPlaceholder="Komut veya kayıt ara..." />
      </PageLayout.Header>
      <PageLayout.Content>
        <TableSimple
          columns={[
            { key: 'name', title: 'Ad' },
            { key: 'type', title: 'Tür' },
          ]}
          rows={[
            { name: 'Rapor Oluştur', type: 'Aksiyon' },
            { name: 'Kullanıcı Ekle', type: 'Aksiyon' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { pageWidth: "wide" },
      tags: ["arama", "komut", "calisma-alani"],
    },
    {
      id: "cmd-workspace-context-panel",
      title: "Bağlam Panelli Çalışma Alanı",
      description: "Son işler kuyruğu ve detay paneli ile genişletilmiş çalışma alanı.",
      category: "advanced",
      code: `import { PageLayout, FilterBar, TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout pageWidth="wide" stickyHeader>
      <PageLayout.Header>
        <FilterBar searchPlaceholder="Hızlı arama..." />
      </PageLayout.Header>
      <PageLayout.Content>
        <div className="grid grid-cols-[1fr_320px] gap-4">
          <TableSimple
            columns={[
              { key: 'action', title: 'Aksiyon' },
              { key: 'status', title: 'Durum' },
            ]}
            rows={[
              { action: 'Rapor Oluştur', status: 'Hazır' },
              { action: 'Veri Aktar', status: 'Bekliyor' },
            ]}
          />
          <aside className="rounded-xl border p-4">
            <h3>Son İşler</h3>
            <p>Son 5 komut burada listelenir.</p>
          </aside>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { pageWidth: "wide", stickyHeader: true },
      tags: ["bagdam-paneli", "son-isler", "detay"],
    },
  ],
  CrudTemplate: [
    {
      id: "crud-basic",
      title: "Temel CRUD Listesi",
      description: "Filtre çubuğu ve veri tablosu ile standart CRUD liste şablonu.",
      category: "basic",
      code: `import { PageLayout, FilterBar, TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout>
      <PageLayout.Header>
        <h1>Kullanıcı Yönetimi</h1>
      </PageLayout.Header>
      <PageLayout.Content>
        <FilterBar searchPlaceholder="Kullanıcı ara..." />
        <TableSimple
          columns={[
            { key: 'name', title: 'Ad Soyad' },
            { key: 'email', title: 'E-posta' },
            { key: 'role', title: 'Rol' },
          ]}
          rows={[
            { name: 'Ahmet Yılmaz', email: 'ahmet@ornek.com', role: 'Admin' },
            { name: 'Elif Demir', email: 'elif@ornek.com', role: 'Editör' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: {},
      tags: ["crud", "liste", "tablo", "filtre"],
    },
    {
      id: "crud-with-summary",
      title: "Özet Metrikli CRUD",
      description: "Tablo üstünde özet şeridi bulunan gelişmiş CRUD şablonu.",
      category: "advanced",
      code: `import { PageLayout, FilterBar, SummaryStrip, TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout pageWidth="wide">
      <PageLayout.Header>
        <h1>Sipariş Yönetimi</h1>
      </PageLayout.Header>
      <PageLayout.Content>
        <SummaryStrip
          items={[
            { label: 'Toplam', value: '1.248' },
            { label: 'Bekleyen', value: '42' },
            { label: 'Tamamlanan', value: '1.206' },
          ]}
        />
        <FilterBar searchPlaceholder="Sipariş ara..." />
        <TableSimple
          columns={[
            { key: 'id', title: 'Sipariş No' },
            { key: 'customer', title: 'Müşteri' },
            { key: 'status', title: 'Durum' },
          ]}
          rows={[
            { id: '#1001', customer: 'ABC Ltd.', status: 'Tamamlandı' },
            { id: '#1002', customer: 'XYZ A.Ş.', status: 'Bekliyor' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { pageWidth: "wide" },
      tags: ["crud", "ozet", "metrik", "siparis"],
    },
    {
      id: "crud-sticky-filters",
      title: "Sabit Filtreli CRUD",
      description: "Kaydırma sırasında sabit kalan başlık ve filtre çubuğu.",
      category: "patterns",
      code: `import { PageLayout, FilterBar, TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout stickyHeader>
      <PageLayout.Header>
        <h1>Ürün Kataloğu</h1>
        <FilterBar
          searchPlaceholder="Ürün ara..."
          filters={[
            { key: 'category', label: 'Kategori', type: 'select' },
            { key: 'status', label: 'Durum', type: 'select' },
          ]}
        />
      </PageLayout.Header>
      <PageLayout.Content>
        <TableSimple
          columns={[
            { key: 'name', title: 'Ürün Adı' },
            { key: 'category', title: 'Kategori' },
            { key: 'price', title: 'Fiyat' },
          ]}
          rows={[
            { name: 'Widget A', category: 'Elektronik', price: '₺299' },
            { name: 'Widget B', category: 'Aksesuar', price: '₺149' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { stickyHeader: true },
      tags: ["crud", "sabit-baslik", "filtre"],
    },
  ],
  DashboardTemplate: [
    {
      id: "dashboard-basic",
      title: "Temel Dashboard",
      description: "KPI şeridi ve özet kartları ile yönetici panosu.",
      category: "basic",
      code: `import { PageLayout, SummaryStrip } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout pageWidth="wide">
      <PageLayout.Header>
        <h1>Genel Bakış</h1>
      </PageLayout.Header>
      <PageLayout.Content>
        <SummaryStrip
          items={[
            { label: 'Toplam Gelir', value: '₺1.2M' },
            { label: 'Aktif Kullanıcı', value: '8.432' },
            { label: 'Dönüşüm Oranı', value: '%4.2' },
          ]}
        />
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border p-4">Gelir Grafiği</div>
          <div className="rounded-xl border p-4">Kullanıcı Trendi</div>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { pageWidth: "wide" },
      tags: ["dashboard", "kpi", "ozet"],
    },
    {
      id: "dashboard-tabs",
      title: "Sekmeli Dashboard",
      description: "Farklı veri görünümleri arasında sekme navigasyonu olan pano.",
      category: "advanced",
      code: `import { PageLayout, SummaryStrip, Tabs } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout pageWidth="wide">
      <PageLayout.Header>
        <h1>Operasyon Panosu</h1>
      </PageLayout.Header>
      <PageLayout.Content>
        <SummaryStrip
          items={[
            { label: 'Toplam İşlem', value: '24.680' },
            { label: 'Başarılı', value: '%99.2' },
            { label: 'Ortalama Süre', value: '1.4s' },
          ]}
        />
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Genel Bakış</Tabs.Tab>
            <Tabs.Tab value="performance">Performans</Tabs.Tab>
            <Tabs.Tab value="errors">Hatalar</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">Genel bakış içeriği</Tabs.Panel>
          <Tabs.Panel value="performance">Performans metrikleri</Tabs.Panel>
          <Tabs.Panel value="errors">Hata logları</Tabs.Panel>
        </Tabs>
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { pageWidth: "wide" },
      tags: ["dashboard", "sekme", "operasyon", "performans"],
    },
  ],
  DetailTemplate: [
    {
      id: "detail-basic",
      title: "Temel Detay Sayfası",
      description: "Varlık özeti ve metadata bölümleri ile detay şablonu.",
      category: "basic",
      code: `import { PageLayout, EntitySummaryBlock, Descriptions } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout>
      <PageLayout.Header>
        <EntitySummaryBlock
          title="Sipariş #1001"
          subtitle="ABC Ltd. — 15 Mart 2026"
          status="Tamamlandı"
        />
      </PageLayout.Header>
      <PageLayout.Content>
        <Descriptions
          items={[
            { label: 'Müşteri', value: 'ABC Ltd.' },
            { label: 'Toplam', value: '₺12.500' },
            { label: 'Durum', value: 'Tamamlandı' },
            { label: 'Ödeme', value: 'Kredi Kartı' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: {},
      tags: ["detay", "varlik", "metadata"],
    },
    {
      id: "detail-with-rail",
      title: "Inspector Rail ile Detay",
      description: "Yan panel ile ek bağlam bilgisi sunan detay şablonu.",
      category: "advanced",
      code: `import { PageLayout, EntitySummaryBlock, Descriptions, SummaryStrip } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout responsiveDetailCollapse>
      <PageLayout.Header>
        <EntitySummaryBlock
          title="Karar #KR-2024-042"
          subtitle="Onay Süreci — Devam Ediyor"
          status="İncelemede"
        />
      </PageLayout.Header>
      <PageLayout.Content>
        <SummaryStrip
          items={[
            { label: 'Onay Adımı', value: '3/5' },
            { label: 'Kalan Süre', value: '2 gün' },
          ]}
        />
        <Descriptions
          items={[
            { label: 'Talep Eden', value: 'Mehmet Öz' },
            { label: 'Bölüm', value: 'Finans' },
            { label: 'Tutar', value: '₺250.000' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { responsiveDetailCollapse: true },
      tags: ["detay", "rail", "onay", "karar"],
    },
    {
      id: "detail-sticky-header",
      title: "Sabit Başlıklı Detay",
      description: "Kaydırma sırasında varlık başlığı sabit kalan detay görünümü.",
      category: "patterns",
      code: `import { PageLayout, EntitySummaryBlock, Descriptions } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout stickyHeader>
      <PageLayout.Header>
        <EntitySummaryBlock
          title="Müşteri: Elif Demir"
          subtitle="Hesap No: 10042 — Gold Üye"
        />
      </PageLayout.Header>
      <PageLayout.Content>
        <Descriptions
          items={[
            { label: 'E-posta', value: 'elif@ornek.com' },
            { label: 'Telefon', value: '+90 532 XXX XX XX' },
            { label: 'Kayıt Tarihi', value: '12 Ocak 2024' },
            { label: 'Son Giriş', value: '2 saat önce' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { stickyHeader: true },
      tags: ["detay", "sabit-baslik", "musteri"],
    },
  ],
  SettingsTemplate: [
    {
      id: "settings-basic",
      title: "Temel Ayarlar Sayfası",
      description: "Bölüm sekmeleri ile yapılandırma ayarları şablonu.",
      category: "basic",
      code: `import { PageLayout, Tabs, Descriptions } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout stickyHeader>
      <PageLayout.Header>
        <h1>Ayarlar</h1>
      </PageLayout.Header>
      <PageLayout.Content>
        <Tabs defaultValue="general">
          <Tabs.List>
            <Tabs.Tab value="general">Genel</Tabs.Tab>
            <Tabs.Tab value="security">Güvenlik</Tabs.Tab>
            <Tabs.Tab value="notifications">Bildirimler</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="general">
            <Descriptions
              items={[
                { label: 'Dil', value: 'Türkçe' },
                { label: 'Zaman Dilimi', value: 'UTC+3' },
                { label: 'Tarih Formatı', value: 'GG/AA/YYYY' },
              ]}
            />
          </Tabs.Panel>
          <Tabs.Panel value="security">Güvenlik ayarları</Tabs.Panel>
          <Tabs.Panel value="notifications">Bildirim tercihleri</Tabs.Panel>
        </Tabs>
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { stickyHeader: true },
      tags: ["ayarlar", "sekme", "yapilandirma"],
    },
    {
      id: "settings-with-aside",
      title: "Kural Panelli Ayarlar",
      description: "Guardrail aside paneli ile politika bilgilendirmeli ayarlar.",
      category: "advanced",
      code: `import { PageLayout, Tabs, Descriptions, SummaryStrip } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout stickyHeader>
      <PageLayout.Header>
        <h1>Sistem Ayarları</h1>
        <SummaryStrip
          items={[
            { label: 'Aktif Kurallar', value: '12' },
            { label: 'Uyarılar', value: '3' },
          ]}
        />
      </PageLayout.Header>
      <PageLayout.Content>
        <div className="grid grid-cols-[1fr_280px] gap-6">
          <Tabs defaultValue="policies">
            <Tabs.List>
              <Tabs.Tab value="policies">Politikalar</Tabs.Tab>
              <Tabs.Tab value="limits">Limitler</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="policies">
              <Descriptions
                items={[
                  { label: 'Parola Uzunluğu', value: 'Min 12 karakter' },
                  { label: 'MFA', value: 'Zorunlu' },
                ]}
              />
            </Tabs.Panel>
            <Tabs.Panel value="limits">Limit yapılandırması</Tabs.Panel>
          </Tabs>
          <aside className="rounded-xl border p-4">
            <h3>Kural Bilgisi</h3>
            <p>Seçili politika ile ilgili kısıtlamalar.</p>
          </aside>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { stickyHeader: true },
      tags: ["ayarlar", "kural", "politika", "guardrail"],
    },
  ],
  ThemePresetCompare: [
    {
      id: "preset-compare-basic",
      title: "Temel Preset Karşılaştırma",
      description: "İki tema preseti arasındaki farkları matris görünümünde sunar.",
      category: "basic",
      code: `import { ThemePresetCompare } from '@mfe/design-system';

export function Example() {
  return (
    <ThemePresetCompare
      leftPreset={{
        presetId: 'default-light',
        label: 'Varsayılan Açık',
        appearance: 'light',
        density: 'comfortable',
        intent: 'Genel kullanım',
        isHighContrast: false,
        isDefaultMode: true,
      }}
      rightPreset={{
        presetId: 'accessibility',
        label: 'Erişilebilir',
        appearance: 'light',
        density: 'comfortable',
        intent: 'Yüksek kontrast',
        isHighContrast: true,
        isDefaultMode: false,
      }}
    />
  );
}`,
      previewProps: {},
      tags: ["tema", "karsilastirma", "preset"],
    },
    {
      id: "preset-compare-custom-axes",
      title: "Özel Eksenli Karşılaştırma",
      description: "Belirli eksenler üzerinde odaklanmış preset karşılaştırması.",
      category: "advanced",
      code: `import { ThemePresetCompare } from '@mfe/design-system';

export function Example() {
  return (
    <ThemePresetCompare
      leftPreset={{
        presetId: 'default',
        label: 'Varsayılan',
        appearance: 'light',
        density: 'comfortable',
        intent: 'Standart',
        isHighContrast: false,
        isDefaultMode: true,
        themeMode: 'light',
      }}
      rightPreset={{
        presetId: 'compact-dark',
        label: 'Kompakt Koyu',
        appearance: 'dark',
        density: 'compact',
        intent: 'Yoğun veri',
        isHighContrast: false,
        isDefaultMode: false,
        themeMode: 'dark',
      }}
      axes={['appearance', 'density', 'mode', 'contrast']}
      title="Mod Karşılaştırması"
      description="Açık ve koyu mod arasındaki temel farklar."
    />
  );
}`,
      previewProps: {},
      tags: ["tema", "eksen", "koyu-mod", "karsilastirma"],
    },
    {
      id: "preset-compare-empty",
      title: "Boş Karşılaştırma",
      description: "Henüz preset seçilmemiş boş durum görünümü.",
      category: "basic",
      code: `import { ThemePresetCompare } from '@mfe/design-system';

export function Example() {
  return (
    <ThemePresetCompare
      leftPreset={null}
      rightPreset={null}
      title="Preset Karşılaştırma"
      description="Karşılaştırma için iki preset seçin."
    />
  );
}`,
      previewProps: {},
      tags: ["tema", "bos", "empty-state"],
    },
  ],};
