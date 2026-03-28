import type { ExampleEntry } from './types';

export const examples: Record<string, ExampleEntry[]> = {
  ContextMenu: [
    {
      id: "contextmenu-basic",
      title: "Temel Bağlam Menüsü",
      description: "Sağ tıklama ile açılan temel bağlam menüsü.",
      category: "basic",
      code: `import { ContextMenu } from '@mfe/design-system';

const items = [
  { key: 'copy', label: 'Kopyala', shortcut: 'Ctrl+C' },
  { key: 'paste', label: 'Yapıştır', shortcut: 'Ctrl+V' },
  { type: 'separator', key: 'sep1' },
  { key: 'delete', label: 'Sil', danger: true },
];

export function Example() {
  return (
    <ContextMenu items={items}>
      <div className="rounded-lg border p-8 text-center text-sm text-text-subtle">
        Sağ tıklayın
      </div>
    </ContextMenu>
  );
}`,
      previewProps: {},
      tags: ["context-menu", "right-click", "basic"],
    },
    {
      id: "contextmenu-groups",
      title: "Gruplu Bağlam Menüsü",
      description: "Etiket ve ayırıcı ile gruplanmış menü öğeleri.",
      category: "advanced",
      code: `import { ContextMenu } from '@mfe/design-system';

const items = [
  { type: 'label', key: 'lbl-edit', label: 'Düzenleme' },
  { key: 'cut', label: 'Kes', shortcut: 'Ctrl+X' },
  { key: 'copy', label: 'Kopyala', shortcut: 'Ctrl+C' },
  { key: 'paste', label: 'Yapıştır', shortcut: 'Ctrl+V' },
  { type: 'separator', key: 'sep1' },
  { type: 'label', key: 'lbl-action', label: 'İşlemler' },
  { key: 'rename', label: 'Yeniden Adlandır', shortcut: 'F2' },
  { key: 'archive', label: 'Arşivle' },
  { type: 'separator', key: 'sep2' },
  { key: 'delete', label: 'Sil', danger: true, shortcut: 'Del' },
];

export function Example() {
  return (
    <ContextMenu items={items}>
      <div className="rounded-lg border p-8 text-center text-sm text-text-subtle">
        Sağ tıklayın
      </div>
    </ContextMenu>
  );
}`,
      previewProps: {},
      tags: ["groups", "labels", "separator", "advanced"],
    },
    {
      id: "contextmenu-icons",
      title: "İkonlu Bağlam Menüsü",
      description: "Her öğede ikon bulunan bağlam menüsü.",
      category: "basic",
      code: `import { ContextMenu } from '@mfe/design-system';

const items = [
  { key: 'open', label: 'Aç', icon: '📂' },
  { key: 'share', label: 'Paylaş', icon: '🔗' },
  { key: 'download', label: 'İndir', icon: '⬇️' },
  { type: 'separator', key: 'sep1' },
  { key: 'info', label: 'Bilgi', icon: 'ℹ️' },
];

export function Example() {
  return (
    <ContextMenu items={items}>
      <div className="rounded-lg border p-8 text-center text-sm text-text-subtle">
        Sağ tıklayın
      </div>
    </ContextMenu>
  );
}`,
      previewProps: {},
      tags: ["icons", "visual", "context-menu"],
    },
  ],
  DesktopMenubar: [
    {
      id: "desktopmenubar-basic",
      title: "Temel Masaüstü Menü Çubuğu",
      description: "File/View/Tools benzeri klasik masaüstü menü yapısı.",
      category: "layout",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  {
    value: 'file',
    label: 'Dosya',
    menuItems: [
      { key: 'new', label: 'Yeni', shortcut: 'Ctrl+N' },
      { key: 'open', label: 'Aç', shortcut: 'Ctrl+O' },
      { key: 'save', label: 'Kaydet', shortcut: 'Ctrl+S' },
    ],
  },
  {
    value: 'edit',
    label: 'Düzenle',
    menuItems: [
      { key: 'undo', label: 'Geri Al', shortcut: 'Ctrl+Z' },
      { key: 'redo', label: 'Yinele', shortcut: 'Ctrl+Y' },
    ],
  },
  {
    value: 'view',
    label: 'Görünüm',
    menuItems: [
      { key: 'zoom-in', label: 'Yakınlaştır', shortcut: 'Ctrl+=' },
      { key: 'zoom-out', label: 'Uzaklaştır', shortcut: 'Ctrl+-' },
    ],
  },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      submenuTrigger="hover"
      appearance="ghost"
      size="sm"
      ariaLabel="Uygulama menü çubuğu"
    />
  );
}`,
      previewProps: { submenuTrigger: "hover", appearance: "ghost", size: "sm" },
      tags: ["desktop", "menubar", "file-menu", "hover"],
    },
    {
      id: "desktopmenubar-keyboard",
      title: "Klavye Navigasyonlu Menü",
      description: "Klavye kısayolları ve erişilebilirlik odaklı masaüstü menü.",
      category: "advanced",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  {
    value: 'tools',
    label: 'Araçlar',
    menuItems: [
      { key: 'terminal', label: 'Terminal', shortcut: 'Ctrl+\`' },
      { key: 'devtools', label: 'Geliştirici Araçları', shortcut: 'F12' },
      { key: 'extensions', label: 'Eklentiler', shortcut: 'Ctrl+Shift+X' },
    ],
  },
  {
    value: 'help',
    label: 'Yardım',
    menuItems: [
      { key: 'docs', label: 'Dokümantasyon' },
      { key: 'shortcuts', label: 'Klavye Kısayolları', shortcut: 'Ctrl+K Ctrl+S' },
      { key: 'about', label: 'Hakkında' },
    ],
  },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      submenuTrigger="hover"
      appearance="ghost"
      size="sm"
      ariaLabel="Araçlar menü çubuğu"
    />
  );
}`,
      previewProps: { submenuTrigger: "hover", appearance: "ghost", size: "sm" },
      tags: ["keyboard", "shortcuts", "accessibility"],
    },
  ],
  NotificationDrawer: [
    {
      id: "notificationdrawer-basic",
      title: "Temel Bildirim Cekmecesi",
      description: "Sag kenardan acilan bildirim cekmecesi.",
      category: "basic",
      code: `import { useState } from 'react';
import { NotificationDrawer } from '@mfe/design-system';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Bildirimleri Ac</button>
      <NotificationDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={[
          { id: '1', message: 'Yeni yorum eklendi', type: 'info', createdAt: Date.now() },
          { id: '2', message: 'Derleme basarili', type: 'success', createdAt: Date.now() - 60000 },
        ]}
      />
    </>
  );
}`,
      previewProps: { open: true },
      tags: ["drawer", "bildirim", "overlay"],
    },
    {
      id: "notificationdrawer-filtered",
      title: "Filtreli Bildirim Cekmecesi",
      description: "Filtre ve toplu islem destegi ile bildirim cekmecesi.",
      category: "advanced",
      code: `import { useState } from 'react';
import { NotificationDrawer } from '@mfe/design-system';

export function Example() {
  const [open, setOpen] = useState(true);

  return (
    <NotificationDrawer
      open={open}
      onClose={() => setOpen(false)}
      showFilters
      grouping="priority"
      onMarkAllRead={() => console.log('Tumunu okundu say')}
      items={[
        { id: '1', message: 'Kritik hata tespit edildi', type: 'error', priority: 'high', createdAt: Date.now() },
        { id: '2', message: 'Yeni surum yayinlandi', type: 'info', pinned: true, createdAt: Date.now() - 3600000 },
        { id: '3', message: 'Test basariyla tamamlandi', type: 'success', read: true, createdAt: Date.now() - 7200000 },
      ]}
    />
  );
}`,
      previewProps: { open: true, showFilters: true, grouping: "priority" },
      tags: ["drawer", "filtre", "gruplama", "oncelik"],
    },
  ],
  NotificationPanel: [
    {
      id: "notificationpanel-basic",
      title: "Temel Bildirim Paneli",
      description: "Bildirim listesi gosteren temel panel bileseni.",
      category: "basic",
      code: `import { NotificationPanel } from '@mfe/design-system';

export function Example() {
  return (
    <NotificationPanel
      title="Bildirimler"
      items={[
        { id: '1', message: 'Deployment basarili', type: 'success', createdAt: Date.now() },
        { id: '2', message: 'Disk alani %90 doldu', type: 'warning', priority: 'high', createdAt: Date.now() - 120000 },
        { id: '3', message: 'Yeni kullanici katildi', type: 'info', createdAt: Date.now() - 300000 },
      ]}
      onMarkAllRead={() => console.log('Tumunu okundu say')}
    />
  );
}`,
      previewProps: {},
      tags: ["bildirim", "liste", "panel"],
    },
    {
      id: "notificationpanel-filters",
      title: "Filtreli Bildirim Paneli",
      description: "Okunmamis, oncelikli ve pinlenmis filtreleriyle bildirim paneli.",
      category: "advanced",
      code: `import { NotificationPanel } from '@mfe/design-system';

export function Example() {
  return (
    <NotificationPanel
      title="Sistem Bildirimleri"
      showFilters
      availableFilters={['all', 'unread', 'high-priority', 'pinned']}
      grouping="priority"
      items={[
        { id: '1', message: 'Veritabani baglantisi kesildi', type: 'error', priority: 'high', createdAt: Date.now() },
        { id: '2', message: 'API surumu guncellendi', type: 'info', pinned: true, createdAt: Date.now() - 600000 },
        { id: '3', message: 'Yedekleme tamamlandi', type: 'success', read: true, createdAt: Date.now() - 900000 },
      ]}
    />
  );
}`,
      previewProps: { showFilters: true, grouping: "priority" },
      tags: ["filtre", "gruplama", "oncelik", "pin"],
    },
    {
      id: "notificationpanel-selectable",
      title: "Secim Destekli Bildirim Paneli",
      description: "Coklu secim ve toplu islem destegi ile bildirim paneli.",
      category: "advanced",
      code: `import { useState } from 'react';
import { NotificationPanel } from '@mfe/design-system';

export function Example() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <NotificationPanel
      title="Bildirimler"
      selectable
      selectedIds={selectedIds}
      onSelectedIdsChange={setSelectedIds}
      onMarkSelectedRead={(ids) => console.log('Okundu:', ids)}
      onRemoveSelected={(ids) => console.log('Silindi:', ids)}
      items={[
        { id: '1', message: 'Build #142 basarisiz', type: 'error', createdAt: Date.now() },
        { id: '2', message: 'PR #58 onaylandi', type: 'success', createdAt: Date.now() - 60000 },
        { id: '3', message: 'Sprint planlama hatirlatmasi', type: 'info', createdAt: Date.now() - 180000 },
      ]}
    />
  );
}`,
      previewProps: { selectable: true },
      tags: ["secim", "toplu-islem", "checkbox"],
    },
  ],
  NotificationItemCard: [
    {
      id: "notificationitemcard-basic",
      title: "Temel Bildirim Karti",
      description: "Tekil bildirim ogesi karti.",
      category: "basic",
      code: `import { NotificationItemCard } from '@mfe/design-system';

export function Example() {
  return (
    <NotificationItemCard
      item={{
        id: '1',
        message: 'Yeni yorum eklendi',
        description: 'Kullanici Ali tasarim belgesine yorum ekledi.',
        type: 'info',
        createdAt: Date.now(),
      }}
      onRemove={(id) => console.log('Kaldirildi:', id)}
    />
  );
}`,
      previewProps: {},
      tags: ["bildirim", "kart", "temel"],
    },
    {
      id: "notificationitemcard-priority",
      title: "Oncelikli Bildirim Karti",
      description: "Yuksek oncelikli ve pinlenmis bildirim karti.",
      category: "advanced",
      code: `import { NotificationItemCard } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <NotificationItemCard
        item={{
          id: '1',
          message: 'Sunucu CPU kullanimi %95',
          description: 'Acil mudahale gerekli.',
          type: 'error',
          priority: 'high',
          createdAt: Date.now(),
        }}
        getPrimaryActionLabel={() => 'Detaylari Gor'}
        onPrimaryAction={(item) => console.log('Aksiyon:', item.id)}
      />
      <NotificationItemCard
        item={{
          id: '2',
          message: 'Onemli duyuru pinlendi',
          type: 'warning',
          pinned: true,
          read: true,
          createdAt: Date.now() - 86400000,
        }}
      />
    </div>
  );
}`,
      previewProps: {},
      tags: ["oncelik", "pin", "aksiyon", "hata"],
    },
  ],
  ToastProvider: [
    {
      id: "toast-basic",
      title: "Temel Toast Kullanimi",
      description: "useToast hook'u ile bildirim gosterimi.",
      category: "basic",
      code: `import { ToastProvider, useToast } from '@mfe/design-system';

function DemoButtons() {
  const toast = useToast();

  return (
    <div className="flex gap-2">
      <button onClick={() => toast.success('Basariyla kaydedildi!')}>Basari</button>
      <button onClick={() => toast.error('Bir hata olustu.')}>Hata</button>
      <button onClick={() => toast.info('Bilgilendirme mesaji.')}>Bilgi</button>
      <button onClick={() => toast.warning('Dikkat edilmesi gereken durum.')}>Uyari</button>
    </div>
  );
}

export function Example() {
  return (
    <ToastProvider>
      <DemoButtons />
    </ToastProvider>
  );
}`,
      previewProps: {},
      tags: ["toast", "bildirim", "hook"],
    },
    {
      id: "toast-positions",
      title: "Toast Konumlari",
      description: "Farkli ekran konumlarinda toast gosterimi.",
      category: "layout",
      code: `import { ToastProvider, useToast } from '@mfe/design-system';

function DemoButtons() {
  const toast = useToast();

  return (
    <button onClick={() => toast.info('Alt merkezden bildirim', { title: 'Konum Testi' })}>
      Toast Goster
    </button>
  );
}

export function Example() {
  return (
    <ToastProvider position="bottom-center" duration={3000} maxVisible={3}>
      <DemoButtons />
    </ToastProvider>
  );
}`,
      previewProps: { position: "bottom-center", duration: 3000, maxVisible: 3 },
      tags: ["konum", "position", "bottom", "center"],
    },
    {
      id: "toast-with-title",
      title: "Baslikli Toast",
      description: "Baslik ve ozel sure ile detayli toast mesajlari.",
      category: "advanced",
      code: `import { ToastProvider, useToast } from '@mfe/design-system';

function DemoButtons() {
  const toast = useToast();

  return (
    <div className="flex gap-2">
      <button onClick={() => toast.success('Degisiklikler basariyla kaydedildi.', { title: 'Kayit Basarili', duration: 5000 })}>
        Baslikli Basari
      </button>
      <button onClick={() => toast.error('Sunucu baglantisi kurulamadi.', { title: 'Baglanti Hatasi', duration: 8000 })}>
        Baslikli Hata
      </button>
    </div>
  );
}

export function Example() {
  return (
    <ToastProvider>
      <DemoButtons />
    </ToastProvider>
  );
}`,
      previewProps: {},
      tags: ["baslik", "title", "sure", "duration"],
    },
  ],
  TourCoachmarks: [
    {
      id: "tourcoachmarks-basic",
      title: "Temel Rehber Turu",
      description: "Adim adim kullanici rehberleme bileseni.",
      category: "basic",
      code: `import { TourCoachmarks } from '@mfe/design-system';

export function Example() {
  return (
    <TourCoachmarks
      open
      title="Baslangic Rehberi"
      steps={[
        { id: 'hosgeldin', title: 'Hosgeldiniz!', description: 'Bu rehber size temel ozellikleri tanitacaktir.' },
        { id: 'panel', title: 'Kontrol Paneli', description: 'Sol menuden tum modullere erisebilirsiniz.' },
        { id: 'ayarlar', title: 'Ayarlar', description: 'Profil ve bildirim tercihlerinizi buradan yonetebilirsiniz.' },
      ]}
      onFinish={() => console.log('Tur tamamlandi')}
    />
  );
}`,
      previewProps: { open: true },
      tags: ["tur", "rehber", "onboarding", "adim"],
    },
    {
      id: "tourcoachmarks-readonly",
      title: "Salt Okunur Tur",
      description: "Sadece goruntuleme modunda rehber turu.",
      category: "advanced",
      code: `import { TourCoachmarks } from '@mfe/design-system';

export function Example() {
  return (
    <TourCoachmarks
      open
      mode="readonly"
      showProgress
      allowSkip
      title="Ozellik Tanitimi"
      steps={[
        { id: 'raporlar', title: 'Raporlar', description: 'Detayli analizlere ve grafiklere erisim.', tone: 'info', meta: 'Yeni' },
        { id: 'entegrasyon', title: 'Entegrasyonlar', description: 'Ucuncu parti servisleri baglayin.', tone: 'success', meta: 'Aktif' },
        { id: 'guvenlik', title: 'Guvenlik', description: 'Iki faktorlu dogrulama ve erisim kontrolleri.', tone: 'warning', meta: 'Onerilen' },
      ]}
    />
  );
}`,
      previewProps: { open: true, mode: "readonly", showProgress: true },
      tags: ["readonly", "salt-okunur", "tanitim", "meta"],
    },
  ],
  JsonViewer: [
    {
      id: "jsonviewer-basic",
      title: "Temel JSON Goruntuleme",
      description: "Basit bir JSON nesnesini agac yapisinda gosterme.",
      category: "basic",
      code: `import { JsonViewer } from '@mfe/design-system';

export function Example() {
  return (
    <JsonViewer
      title="API Yaniti"
      description="Son istek sonucu"
      value={{
        status: 'success',
        code: 200,
        data: {
          kullanici: 'Ali Veli',
          rol: 'admin',
          aktif: true,
        },
      }}
    />
  );
}`,
      previewProps: {},
      tags: ["json", "agac", "veri", "temel"],
    },
    {
      id: "jsonviewer-array",
      title: "Dizi Verisi Goruntuleme",
      description: "JSON dizisi icerigi ile tip rozetleri.",
      category: "advanced",
      code: `import { JsonViewer } from '@mfe/design-system';

export function Example() {
  return (
    <JsonViewer
      title="Kullanici Listesi"
      rootLabel="kullanicilar"
      defaultExpandedDepth={2}
      showTypes
      value={[
        { id: 1, ad: 'Ayse', departman: 'Muhendislik', aktif: true },
        { id: 2, ad: 'Mehmet', departman: 'Tasarim', aktif: false },
        { id: 3, ad: 'Fatma', departman: 'Urun', aktif: true },
      ]}
    />
  );
}`,
      previewProps: { defaultExpandedDepth: 2, showTypes: true },
      tags: ["dizi", "array", "tip", "badge"],
    },
    {
      id: "jsonviewer-nested",
      title: "Derin Ic Ice JSON",
      description: "Cok katmanli ic ice gecmis veri yapisi goruntuleme.",
      category: "advanced",
      code: `import { JsonViewer } from '@mfe/design-system';

export function Example() {
  return (
    <JsonViewer
      title="Yapilandirma"
      rootLabel="config"
      defaultExpandedDepth={1}
      maxHeight={500}
      value={{
        veritabani: {
          host: 'db.example.com',
          port: 5432,
          ssl: true,
          havuz: { min: 2, max: 10, zaman_asimi: 30000 },
        },
        onbellek: {
          etkin: true,
          ttl: 3600,
          strateji: 'lru',
        },
        loglama: null,
      }}
    />
  );
}`,
      previewProps: { defaultExpandedDepth: 1, maxHeight: 500 },
      tags: ["nested", "ic-ice", "config", "yapilandirma"],
    },
  ],
  AnchorToc: [
    {
      id: "anchortoc-basic",
      title: "Temel Icerik Tablosu",
      description: "Sayfa ici navigasyon icin baglanti listesi.",
      category: "basic",
      code: `import { AnchorToc } from '@mfe/design-system';

export function Example() {
  return (
    <AnchorToc
      title="Bu Sayfada"
      items={[
        { id: 'giris', label: 'Giris' },
        { id: 'kurulum', label: 'Kurulum' },
        { id: 'kullanim', label: 'Kullanim' },
        { id: 'api', label: 'API Referansi' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["toc", "navigasyon", "baglanti", "sayfa-ici"],
    },
    {
      id: "anchortoc-hierarchical",
      title: "Hiyerarsik Icerik Tablosu",
      description: "Cok seviyeli girinti ile icerik tablosu.",
      category: "layout",
      code: `import { AnchorToc } from '@mfe/design-system';

export function Example() {
  return (
    <AnchorToc
      title="Dokumantasyon"
      density="comfortable"
      items={[
        { id: 'baslangic', label: 'Baslangic', level: 1 },
        { id: 'on-kosullar', label: 'On Kosullar', level: 2 },
        { id: 'yukleme', label: 'Yukleme Adimlari', level: 2 },
        { id: 'bileskenler', label: 'Bilesenler', level: 1 },
        { id: 'buton', label: 'Buton', level: 2, meta: '12 prop' },
        { id: 'form', label: 'Form Elemanlari', level: 2, meta: '8 prop' },
        { id: 'gelismis', label: 'Gelismis Konular', level: 1 },
        { id: 'tema', label: 'Tema Ozellestirme', level: 3 },
      ]}
    />
  );
}`,
      previewProps: { density: "comfortable" },
      tags: ["hiyerarsi", "seviye", "level", "meta"],
    },
    {
      id: "anchortoc-compact",
      title: "Sikisik Yogunluk",
      description: "Dar alanlarda kullanim icin compact gorunum.",
      category: "layout",
      code: `import { AnchorToc } from '@mfe/design-system';

export function Example() {
  return (
    <AnchorToc
      title="Hizli Erisim"
      density="compact"
      sticky
      items={[
        { id: 'ozet', label: 'Ozet' },
        { id: 'metrikler', label: 'Metrikler' },
        { id: 'grafikler', label: 'Grafikler' },
        { id: 'tablolar', label: 'Tablolar' },
        { id: 'sonuc', label: 'Sonuc', disabled: true },
      ]}
    />
  );
}`,
      previewProps: { density: "compact", sticky: true },
      tags: ["compact", "sikisik", "sticky", "disabled"],
    },
  ],};
