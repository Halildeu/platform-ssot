import type { ExampleEntry } from './types';

export const examples: Record<string, ExampleEntry[]> = {
  Segmented: [
    {
      id: "segmented-basic",
      title: "Temel Segmented Kontrol",
      description: "Tekli seçim ile basit segment kontrolü.",
      category: "basic",
      code: `import { Segmented } from '@mfe/design-system';

export function Example() {
  return (
    <Segmented
      items={[
        { value: 'genel', label: 'Genel Bakış' },
        { value: 'detay', label: 'Detaylar' },
        { value: 'gecmis', label: 'Geçmiş' },
      ]}
      defaultValue="genel"
    />
  );
}`,
      previewProps: {},
      tags: ["selection", "toggle", "navigation"],
    },
    {
      id: "segmented-appearances",
      title: "Görünüm Varyantları",
      description: "Default, outline ve ghost görünüm seçenekleri.",
      category: "basic",
      code: `import { Segmented } from '@mfe/design-system';

const items = [
  { value: 'liste', label: 'Liste' },
  { value: 'grid', label: 'Grid' },
  { value: 'tablo', label: 'Tablo' },
];

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <Segmented items={items} defaultValue="liste" variant="default" />
      <Segmented items={items} defaultValue="liste" variant="outline" />
      <Segmented items={items} defaultValue="liste" variant="ghost" />
    </div>
  );
}`,
      previewProps: { appearance: "default" },
      multiVariantAxis: "appearance",
      tags: ["appearance", "outline", "ghost", "default"],
    },
    {
      id: "segmented-multiple",
      title: "Çoklu Seçim Filtresi",
      description: "Birden fazla seçim yapılabilen filtre modu.",
      category: "advanced",
      code: `import { Segmented } from '@mfe/design-system';

export function Example() {
  return (
    <Segmented
      selectionMode="multiple"
      shape="pill"
      appearance="ghost"
      items={[
        { value: 'aktif', label: 'Aktif', badge: <span className="ml-1 text-xs opacity-60">12</span> },
        { value: 'beklemede', label: 'Beklemede', badge: <span className="ml-1 text-xs opacity-60">5</span> },
        { value: 'tamamlandi', label: 'Tamamlandı', badge: <span className="ml-1 text-xs opacity-60">48</span> },
      ]}
      defaultValue={['aktif', 'beklemede']}
    />
  );
}`,
      previewProps: {},
      tags: ["multiple", "filter", "badge", "pill"],
    },
    {
      id: "segmented-icon",
      title: "İkon ve Açıklama",
      description: "İkon, etiket ve açıklama ile zengin segment içeriği.",
      category: "advanced",
      code: `import { Segmented } from '@mfe/design-system';
import { LayoutGrid, List, Table2 } from 'lucide-react';

export function Example() {
  return (
    <Segmented
      size="lg"
      iconPosition="top"
      items={[
        { value: 'grid', label: 'Grid', icon: <LayoutGrid className="h-4 w-4" />, description: 'Kart görünümü' },
        { value: 'liste', label: 'Liste', icon: <List className="h-4 w-4" />, description: 'Satır görünümü' },
        { value: 'tablo', label: 'Tablo', icon: <Table2 className="h-4 w-4" />, description: 'Tablo görünümü' },
      ]}
      defaultValue="grid"
    />
  );
}`,
      previewProps: {},
      tags: ["icon", "description", "top"],
    },
  ],
  MobileStepper: [
    {
      id: "mobilestepper-dots",
      title: "Nokta Göstergeli Stepper",
      description: "Kompakt viewport için nokta göstergeli adım takibi.",
      category: "basic",
      code: `import { MobileStepper } from '@mfe/design-system';

export function Example() {
  return (
    <MobileStepper
      steps={5}
      activeStep={2}
      variant="dots"
    />
  );
}`,
      previewProps: {},
      tags: ["stepper", "dots", "mobile", "navigation"],
    },
    {
      id: "mobilestepper-text",
      title: "Metin Göstergeli Stepper",
      description: "Adım numarası ile metin tabanlı ilerleme göstergesi.",
      category: "basic",
      code: `import { MobileStepper } from '@mfe/design-system';

export function Example() {
  return (
    <MobileStepper
      steps={5}
      activeStep={2}
      variant="text"
    />
  );
}`,
      previewProps: {},
      tags: ["stepper", "text", "progress"],
    },
    {
      id: "mobilestepper-progress",
      title: "İlerleme Çubuklu Stepper",
      description: "Yatay ilerleme çubuğu ile adım takibi.",
      category: "basic",
      code: `import { MobileStepper } from '@mfe/design-system';

export function Example() {
  return (
    <MobileStepper
      steps={5}
      activeStep={3}
      variant="progress"
    />
  );
}`,
      previewProps: {},
      tags: ["stepper", "progress", "bar"],
    },
  ],
  TablePagination: [
    {
      id: "tablepagination-basic",
      title: "Temel Tablo Sayfalama",
      description: "Satır adedi ve sayfa navigasyonu ile basit sayfalama.",
      category: "basic",
      code: `import { TablePagination } from '@mfe/design-system';

export function Example() {
  return (
    <TablePagination
      totalItems={150}
      defaultPage={1}
      defaultPageSize={10}
    />
  );
}`,
      previewProps: {},
      tags: ["pagination", "table", "navigation"],
    },
    {
      id: "tablepagination-firstlast",
      title: "İlk/Son Sayfa Butonları",
      description: "İlk ve son sayfa navigasyon butonları ile genişletilmiş sayfalama.",
      category: "basic",
      code: `import { TablePagination } from '@mfe/design-system';

export function Example() {
  return (
    <TablePagination
      totalItems={500}
      defaultPage={5}
      defaultPageSize={20}
      showFirstLastButtons
      pageSizeOptions={[10, 20, 50, 100]}
    />
  );
}`,
      previewProps: {},
      tags: ["firstlast", "buttons", "sizechanger"],
    },
    {
      id: "tablepagination-unknown",
      title: "Bilinmeyen Toplam Kayıt",
      description: "Toplam kayıt sayısı bilinmediğinde stream tabanlı sayfalama.",
      category: "advanced",
      code: `import { TablePagination } from '@mfe/design-system';

export function Example() {
  return (
    <TablePagination
      totalItems={0}
      totalItemsKnown={false}
      hasNextPage={true}
      defaultPage={1}
      defaultPageSize={20}
    />
  );
}`,
      previewProps: {},
      tags: ["unknown", "stream", "infinite"],
    },
  ],
  Empty: [
    {
      id: "empty-basic",
      title: "Temel Boş Durum",
      description: "İkon, başlık ve açıklama ile varsayılan boş durum ekranı.",
      category: "basic",
      code: `import { Empty } from '@mfe/design-system';
import { Inbox } from 'lucide-react';

export function Example() {
  return (
    <Empty
      icon={<Inbox />}
      title="Kayıt Bulunamadı"
      description="Aradığınız kriterlere uygun veri bulunamadı."
    />
  );
}`,
      previewProps: {},
      tags: ["empty", "nodata", "placeholder"],
    },
    {
      id: "empty-action",
      title: "Aksiyonlu Boş Durum",
      description: "Birincil ve ikincil aksiyon butonları ile boş durum.",
      category: "basic",
      code: `import { Empty } from '@mfe/design-system';
import { Button } from '@mfe/design-system';
import { Plus } from 'lucide-react';

export function Example() {
  return (
    <Empty
      icon={<Plus />}
      title="Henüz Belge Yok"
      description="İlk belgenizi oluşturarak başlayın."
      action={<Button variant="primary">Yeni Belge Oluştur</Button>}
      secondaryAction={<Button variant="ghost">Şablon Kullan</Button>}
    />
  );
}`,
      previewProps: {},
      tags: ["action", "button", "cta"],
    },
    {
      id: "empty-compact",
      title: "Kompakt Boş Durum",
      description: "Satır içi kullanım için küçültülmüş boş durum paneli.",
      category: "layout",
      code: `import { Empty } from '@mfe/design-system';
import { FileX } from 'lucide-react';

export function Example() {
  return (
    <div className="rounded-xl border border-border-subtle p-4">
      <Empty
        compact
        icon={<FileX />}
        title="Sonuç Yok"
        description="Filtreleri değiştirerek tekrar deneyin."
      />
    </div>
  );
}`,
      previewProps: { compact: true },
      tags: ["compact", "inline", "embedded"],
    },
  ],
  EmptyErrorLoading: [
    {
      id: "eel-loading",
      title: "Yükleniyor Durumu",
      description: "Skeleton ve spinner ile yükleniyor geri bildirimi.",
      category: "basic",
      code: `import { EmptyErrorLoading } from '@mfe/design-system';

export function Example() {
  return (
    <EmptyErrorLoading
      mode="loading"
      title="Veri Yükleniyor"
      description="Bilgiler sunucudan alınıyor, lütfen bekleyin."
      loadingLabel="Yükleniyor..."
    />
  );
}`,
      previewProps: { mode: "loading" },
      tags: ["loading", "skeleton", "spinner"],
    },
    {
      id: "eel-error",
      title: "Hata Durumu",
      description: "Hata mesajı ve yeniden deneme butonu ile hata geri bildirimi.",
      category: "basic",
      code: `import { EmptyErrorLoading } from '@mfe/design-system';

export function Example() {
  return (
    <EmptyErrorLoading
      mode="error"
      title="Bağlantı Hatası"
      description="Sunucu ile iletişim kurulamadı."
      errorLabel="Bir hata oluştu. Lütfen tekrar deneyin."
      retryLabel="Tekrar Dene"
      onRetry={() => console.log('retry')}
    />
  );
}`,
      previewProps: { mode: "error" },
      tags: ["error", "retry", "feedback"],
    },
    {
      id: "eel-empty",
      title: "Boş Durum",
      description: "Veri bulunamadığında gösterilen boş durum mesajı.",
      category: "basic",
      code: `import { EmptyErrorLoading } from '@mfe/design-system';

export function Example() {
  return (
    <EmptyErrorLoading
      mode="empty"
      title="Sonuç Bulunamadı"
      description="Arama kriterlerinize uygun kayıt yok."
    />
  );
}`,
      previewProps: { mode: "empty" },
      tags: ["empty", "no-data", "feedback"],
    },
  ],
  LinkInline: [
    {
      id: "linkinline-basic",
      title: "Temel Bağlantı",
      description: "Varsayılan primary ton ile satır içi bağlantı.",
      category: "basic",
      code: `import { LinkInline } from '@mfe/design-system';

export function Example() {
  return (
    <p>
      Detaylar için <LinkInline href="/docs">dokümantasyona</LinkInline> bakın.
    </p>
  );
}`,
      previewProps: { tone: "primary", underline: "hover" },
      tags: ["link", "inline", "primary"],
    },
    {
      id: "linkinline-tones",
      title: "Bağlantı Tonları",
      description: "Primary ve secondary ton karşılaştırması.",
      category: "basic",
      code: `import { LinkInline } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex gap-4">
      <LinkInline href="/page" variant="primary">Primary Bağlantı</LinkInline>
      <LinkInline href="/page" variant="secondary">Secondary Bağlantı</LinkInline>
    </div>
  );
}`,
      previewProps: { tone: "primary" },
      multiVariantAxis: "tone",
      tags: ["tone", "primary", "secondary"],
    },
    {
      id: "linkinline-external",
      title: "Harici Bağlantı",
      description: "Yeni sekmede açılan harici bağlantı, otomatik ikon ile.",
      category: "advanced",
      code: `import { LinkInline } from '@mfe/design-system';

export function Example() {
  return (
    <LinkInline href="https://example.com" external>
      Harici Kaynak
    </LinkInline>
  );
}`,
      previewProps: { external: true },
      tags: ["external", "target-blank", "icon"],
    },
    {
      id: "linkinline-disabled",
      title: "Devre Dışı Bağlantı",
      description: "Tıklanamaz durumda olan bağlantı gösterimi.",
      category: "advanced",
      code: `import { LinkInline } from '@mfe/design-system';

export function Example() {
  return (
    <LinkInline href="/restricted" disabled>
      Kısıtlı Bağlantı
    </LinkInline>
  );
}`,
      previewProps: { disabled: true },
      tags: ["disabled", "blocked", "access"],
    },
  ],
  MenuBar: [
    {
      id: "menubar-basic",
      title: "Temel Menü Çubuğu",
      description: "Varsayılan ayarlarla basit bir menü çubuğu.",
      category: "basic",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'dashboard', label: 'Kontrol Paneli', icon: '🏠' },
  { value: 'reports', label: 'Raporlar', icon: '📊' },
  { value: 'settings', label: 'Ayarlar', icon: '⚙️' },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="dashboard"
      ariaLabel="Ana menü"
    />
  );
}`,
      previewProps: {},
      tags: ["menubar", "navigation", "basic"],
    },
    {
      id: "menubar-appearances",
      title: "Görünüm Varyantları",
      description: "Default, outline ve ghost görünüm karşılaştırması.",
      category: "basic",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'home', label: 'Ana Sayfa' },
  { value: 'products', label: 'Ürünler' },
  { value: 'about', label: 'Hakkında' },
];

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <MenuBar items={items} defaultValue="home" appearance="default" />
      <MenuBar items={items} defaultValue="home" appearance="outline" />
      <MenuBar items={items} defaultValue="home" appearance="ghost" />
    </div>
  );
}`,
      previewProps: { appearance: "default" },
      multiVariantAxis: "appearance",
      tags: ["appearance", "default", "outline", "ghost"],
    },
    {
      id: "menubar-overflow",
      title: "Taşma Davranışı",
      description: "Çok sayıda öğe ile overflow kontrolü.",
      category: "advanced",
      code: `import { MenuBar } from '@mfe/design-system';

const items = Array.from({ length: 10 }, (_, i) => ({
  value: \`item-\${i}\`,
  label: \`Bölüm \${i + 1}\`,
}));

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="item-0"
      overflowBehavior="collapse-to-more"
      maxVisibleItems={5}
      overflowLabel="Daha Fazla"
    />
  );
}`,
      previewProps: { overflowBehavior: "collapse-to-more", maxVisibleItems: 5 },
      tags: ["overflow", "collapse", "more"],
    },
  ],
  AppHeader: [
    {
      id: "appheader-basic",
      title: "Temel Uygulama Header",
      description: "Marka alanı, navigasyon ve yardımcı slot ile uygulama header.",
      category: "layout",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'dashboard', label: 'Kontrol Paneli' },
  { value: 'projects', label: 'Projeler' },
  { value: 'team', label: 'Ekip' },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="dashboard"
      startSlot={<span className="font-bold text-lg">MyApp</span>}
      endSlot={<span className="text-sm">👤 Kullanıcı</span>}
      ariaLabel="Uygulama header"
    />
  );
}`,
      previewProps: {},
      tags: ["header", "brand", "utility", "app"],
    },
    {
      id: "appheader-responsive",
      title: "Duyarlı Header",
      description: "Mobilde ikon moduna geçen duyarlı uygulama header.",
      category: "layout",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'home', label: 'Ana Sayfa', icon: '🏠' },
  { value: 'search', label: 'Arama', icon: '🔍' },
  { value: 'profile', label: 'Profil', icon: '👤' },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="home"
      labelVisibility="responsive"
      mobileFallback="menu"
      startSlot={<span className="font-bold">Logo</span>}
      ariaLabel="Duyarlı header"
    />
  );
}`,
      previewProps: { labelVisibility: "responsive", mobileFallback: "menu" },
      tags: ["responsive", "mobile", "icon-only"],
    },
  ],
  NavigationMenu: [
    {
      id: "navmenu-basic",
      title: "Temel Navigasyon Menüsü",
      description: "Ana rota bağlantıları ile navigasyon menüsü.",
      category: "layout",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'overview', label: 'Genel Bakış', icon: '📋' },
  { value: 'analytics', label: 'Analitik', icon: '📈' },
  { value: 'users', label: 'Kullanıcılar', icon: '👥' },
  { value: 'settings', label: 'Ayarlar', icon: '⚙️' },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="overview"
      appearance="default"
      ariaLabel="Navigasyon menüsü"
    />
  );
}`,
      previewProps: {},
      tags: ["navigation", "routes", "menu"],
    },
    {
      id: "navmenu-pinned",
      title: "Sabitlenmiş Rotalar",
      description: "Pinned ve overflow yönetimi ile navigasyon menüsü.",
      category: "advanced",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'home', label: 'Ana Sayfa', icon: '🏠', pinned: true },
  { value: 'projects', label: 'Projeler', icon: '📁', pinned: true },
  { value: 'tasks', label: 'Görevler', icon: '✅' },
  { value: 'calendar', label: 'Takvim', icon: '📅' },
  { value: 'reports', label: 'Raporlar', icon: '📊' },
  { value: 'archive', label: 'Arşiv', icon: '🗄️' },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="home"
      overflowBehavior="collapse-to-more"
      maxVisibleItems={4}
      overflowLabel="Daha Fazla"
      ariaLabel="Navigasyon"
    />
  );
}`,
      previewProps: { overflowBehavior: "collapse-to-more" },
      tags: ["pinned", "overflow", "priority"],
    },
  ],
  ActionHeader: [
    {
      id: "actionheader-basic",
      title: "Temel Aksiyon Header",
      description: "Seçim odaklı toplu işlem araç çubuğu.",
      category: "layout",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'select-all', label: '3 Seçili', icon: '☑️', emphasis: 'promoted' },
  { value: 'edit', label: 'Düzenle', icon: '✏️' },
  { value: 'delete', label: 'Sil', icon: '🗑️' },
  { value: 'export', label: 'Dışa Aktar', icon: '📤' },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      size="sm"
      appearance="ghost"
      ariaLabel="Toplu işlem araç çubuğu"
    />
  );
}`,
      previewProps: { size: "sm", appearance: "ghost" },
      tags: ["action", "bulk", "toolbar", "selection"],
    },
    {
      id: "actionheader-governance",
      title: "Salt-Okunur Aksiyon Header",
      description: "Yönetim akışında salt-okunur modda aksiyon header.",
      category: "advanced",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'view', label: 'Görüntüle', icon: '👁️' },
  { value: 'approve', label: 'Onayla', icon: '✅', disabled: true },
  { value: 'reject', label: 'Reddet', icon: '❌', disabled: true },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="view"
      size="sm"
      appearance="outline"
      access="readonly"
      ariaLabel="Onay akışı araç çubuğu"
    />
  );
}`,
      previewProps: { size: "sm", appearance: "outline", access: "readonly" },
      tags: ["readonly", "governance", "approval"],
    },
  ],};
