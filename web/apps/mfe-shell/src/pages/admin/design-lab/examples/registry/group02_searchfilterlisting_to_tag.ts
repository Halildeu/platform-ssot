import type { ExampleEntry } from './types';

export const examples: Record<string, ExampleEntry[]> = {
  SearchFilterListing: [
    {
      id: "sfl-basic",
      title: "Temel Kullanim",
      description: "Baslik, filtre, ozet kartlari ve sonuc listesiyle temel SearchFilterListing kullanimi.",
      category: "basic",
      code: `import { useState } from 'react';
import { SearchFilterListing, TextInput, Select } from '@mfe/design-system';

export function PolitikaListesi() {
  const [query, setQuery] = useState('');
  const [durum, setDurum] = useState('all');

  return (
    <SearchFilterListing
      eyebrow="Envanter"
      title="Politika Listesi"
      description="Tum politikalari arayip filtreleyebilirsiniz."
      filters={
        <>
          <TextInput label="Arama" value={query} onValueChange={setQuery} size="sm" />
          <Select
            label="Durum"
            size="sm"
            value={durum}
            onValueChange={setDurum}
            options={[
              { label: 'Tumunu goster', value: 'all' },
              { label: 'Aktif', value: 'active' },
              { label: 'Pasif', value: 'inactive' },
            ]}
          />
        </>
      }
      onReset={() => { setQuery(''); setDurum('all'); }}
      summaryItems={[
        { key: 'total', label: 'Toplam', value: '24', tone: 'info' },
        { key: 'active', label: 'Aktif', value: '18', tone: 'success' },
        { key: 'inactive', label: 'Pasif', value: '6', tone: 'warning' },
      ]}
      items={[
        <div key="1" className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">policy_autonomy.v1</span>
          <span className="text-xs text-state-success-text">Aktif</span>
        </div>,
        <div key="2" className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">policy_secrets.v1</span>
          <span className="text-xs text-state-success-text">Aktif</span>
        </div>,
        <div key="3" className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">policy_network.v2</span>
          <span className="text-xs text-state-warning-text">Pasif</span>
        </div>,
      ]}
    />
  );
}`,
      tags: ["listing", "filtre", "arama", "recipe", "temel"],
    },
    {
      id: "sfl-active-filters",
      title: "Aktif Filtre Chip'leri",
      description: "activeFilters ve onClearAllFilters ile uygulanmis filtrelerin chip olarak gosterimi ve yonetimi.",
      category: "form",
      code: `import { useState } from 'react';
import { SearchFilterListing, TextInput, Select, type ActiveFilter } from '@mfe/design-system';

export function AktifFiltreler() {
  const [query, setQuery] = useState('sunucu');
  const [filters, setFilters] = useState<ActiveFilter[]>([
    { key: 'durum', label: 'Durum', value: 'Aktif', onRemove: () => removeFilter('durum') },
    { key: 'tip', label: 'Tip', value: 'Uretim', onRemove: () => removeFilter('tip') },
    { key: 'bolge', label: 'Bolge', value: 'eu-west-1', onRemove: () => removeFilter('bolge') },
  ]);

  const removeFilter = (key: string) => {
    setFilters((prev) => prev.filter((f) => f.key !== key));
  };

  const clearAllFilters = () => {
    setFilters([]);
    setQuery('');
  };

  return (
    <SearchFilterListing
      title="Sunucu Envanteri"
      description="Aktif filtreleri chip olarak gorup tek tek veya topluca kaldirabilirsiniz."
      filters={
        <TextInput label="Arama" value={query} onValueChange={setQuery} size="sm" />
      }
      activeFilters={filters}
      onClearAllFilters={clearAllFilters}
      summaryItems={[
        { key: 'total', label: 'Toplam', value: '142', tone: 'info' },
        { key: 'filtered', label: 'Filtrelenen', value: '23', tone: 'success' },
      ]}
      items={[
        <div key="1" className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">srv-prod-web-01</span>
          <span className="text-xs text-state-success-text">Aktif</span>
        </div>,
        <div key="2" className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">srv-prod-api-03</span>
          <span className="text-xs text-state-success-text">Aktif</span>
        </div>,
      ]}
    />
  );
}`,
      tags: ["active-filters", "chip", "filtre", "temizle"],
    },
    {
      id: "sfl-sortable",
      title: "Siralanabilir Liste",
      description: "sortOptions, activeSort, onSortChange ve totalCount ile siralanabilir sonuc listesi.",
      category: "advanced",
      code: `import { useState } from 'react';
import {
  SearchFilterListing,
  TextInput,
  type SortOption,
  type SortState,
} from '@mfe/design-system';

const sortOptions: SortOption[] = [
  { key: 'name', label: 'Ada gore' },
  { key: 'date', label: 'Tarihe gore' },
  { key: 'priority', label: 'Oncelik' },
];

export function SiralanabilirListe() {
  const [sort, setSort] = useState<SortState>({ key: 'date', direction: 'desc' });

  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    setSort({ key, direction });
  };

  return (
    <SearchFilterListing
      title="Gorev Listesi"
      description="Gorevleri farkli kriterlere gore siralayabilirsiniz."
      filters={<TextInput label="Gorev ara" value="" size="sm" />}
      sortOptions={sortOptions}
      activeSort={sort}
      onSortChange={handleSortChange}
      totalCount={47}
      listTitle="Gorevler"
      items={[
        <div key="1" className="flex justify-between p-3 border rounded-lg">
          <div>
            <div className="font-medium">Veritabani migrasyonu</div>
            <div className="text-xs text-text-subtle">2024-12-15 — Yuksek oncelik</div>
          </div>
        </div>,
        <div key="2" className="flex justify-between p-3 border rounded-lg">
          <div>
            <div className="font-medium">API dokumantasyonu</div>
            <div className="text-xs text-text-subtle">2024-12-14 — Orta oncelik</div>
          </div>
        </div>,
        <div key="3" className="flex justify-between p-3 border rounded-lg">
          <div>
            <div className="font-medium">Performans testi</div>
            <div className="text-xs text-text-subtle">2024-12-13 — Dusuk oncelik</div>
          </div>
        </div>,
      ]}
    />
  );
}`,
      tags: ["sort", "siralama", "totalCount", "sonuc"],
    },
    {
      id: "sfl-selectable",
      title: "Coklu Secim ve Toplu Aksiyon",
      description: "selectable, selectedKeys, onSelectionChange ve batchActions ile coklu secim ve toplu islem yapabilme.",
      category: "advanced",
      code: `import { useState } from 'react';
import { SearchFilterListing, TextInput, Button } from '@mfe/design-system';

interface Kullanici {
  id: string;
  ad: string;
  email: string;
  rol: string;
}

const kullanicilar: Kullanici[] = [
  { id: '1', ad: 'Ahmet Yilmaz', email: 'ahmet@ornek.com', rol: 'Yonetici' },
  { id: '2', ad: 'Elif Demir', email: 'elif@ornek.com', rol: 'Gelistirici' },
  { id: '3', ad: 'Mehmet Kaya', email: 'mehmet@ornek.com', rol: 'Tasarimci' },
  { id: '4', ad: 'Zeynep Arslan', email: 'zeynep@ornek.com', rol: 'Gelistirici' },
];

export function KullaniciYonetimi() {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['1', '3']);

  return (
    <SearchFilterListing
      title="Kullanici Yonetimi"
      description="Birden fazla kullaniciyi secerek toplu islem yapabilirsiniz."
      filters={<TextInput label="Kullanici ara" value="" size="sm" />}
      selectable
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      batchActions={
        <>
          <Button size="sm" variant="outline">Rol Degistir</Button>
          <Button size="sm" variant="destructive">Hesaplari Sil</Button>
        </>
      }
      totalCount={kullanicilar.length}
      items={kullanicilar.map((k) => (
        <div key={k.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedKeys.includes(k.id)}
              onChange={(e) => {
                setSelectedKeys((prev) =>
                  e.target.checked
                    ? [...prev, k.id]
                    : prev.filter((key) => key !== k.id)
                );
              }}
              className="h-4 w-4 rounded-xs border-border-default"
            />
            <div>
              <div className="font-medium">{k.ad}</div>
              <div className="text-xs text-text-subtle">{k.email}</div>
            </div>
          </div>
          <span className="rounded-full bg-surface-muted px-2 py-1 text-xs">{k.rol}</span>
        </div>
      ))}
    />
  );
}`,
      tags: ["selectable", "batch", "toplu", "secim", "aksiyon"],
    },
    {
      id: "sfl-loading",
      title: "Yukleniyor Durumu",
      description: "loading=true ile iskelet (skeleton) placeholder gosterimi. Veri yuklenirken kullaniciya gorsel geri bildirim saglar.",
      category: "basic",
      code: `import { SearchFilterListing } from '@mfe/design-system';

export function YukleniyorDurumu() {
  return (
    <SearchFilterListing
      title="Siparis Listesi"
      description="Siparisler yukleniyor..."
      loading={true}
      summaryItems={[
        { key: 'total', label: 'Toplam', value: '0', tone: 'info' },
        { key: 'pending', label: 'Bekleyen', value: '0', tone: 'warning' },
        { key: 'completed', label: 'Tamamlanan', value: '0', tone: 'success' },
      ]}
      items={[]}
    />
  );
}`,
      tags: ["loading", "skeleton", "yukleniyor", "placeholder"],
    },
    {
      id: "sfl-compact",
      title: "Kompakt Mod",
      description: "size='compact' ile daha yogun bilgi gosterimi. Tum ozellikler kompakt modda calisir.",
      category: "layout",
      code: `import { useState } from 'react';
import {
  SearchFilterListing,
  TextInput,
  Select,
  type ActiveFilter,
  type SortOption,
  type SortState,
} from '@mfe/design-system';

const sortOptions: SortOption[] = [
  { key: 'name', label: 'Ad' },
  { key: 'updated', label: 'Guncelleme' },
];

export function KompaktListe() {
  const [sort, setSort] = useState<SortState>({ key: 'updated', direction: 'desc' });
  const [filters, setFilters] = useState<ActiveFilter[]>([
    { key: 'tip', label: 'Tip', value: 'API', onRemove: () => setFilters((f) => f.filter((x) => x.key !== 'tip')) },
  ]);

  return (
    <SearchFilterListing
      size="compact"
      title="Servis Katalogu"
      description="Kompakt gorunumde daha fazla icerik goruntulenir."
      filters={
        <>
          <TextInput label="Servis ara" value="" size="sm" />
          <Select
            label="Ortam"
            size="sm"
            value="prod"
            options={[
              { label: 'Uretim', value: 'prod' },
              { label: 'Test', value: 'staging' },
            ]}
          />
        </>
      }
      activeFilters={filters}
      onClearAllFilters={() => setFilters([])}
      sortOptions={sortOptions}
      activeSort={sort}
      onSortChange={(key, dir) => setSort({ key, direction: dir })}
      totalCount={86}
      summaryItems={[
        { key: 'running', label: 'Calisan', value: '72', tone: 'success' },
        { key: 'degraded', label: 'Dusuk', value: '8', tone: 'warning' },
        { key: 'down', label: 'Kapali', value: '6', tone: 'danger' },
      ]}
      items={[
        <div key="1" className="flex justify-between p-2 border rounded-xs text-sm">
          <span>auth-service</span><span className="text-state-success-text text-xs">Calisiyor</span>
        </div>,
        <div key="2" className="flex justify-between p-2 border rounded-xs text-sm">
          <span>payment-gateway</span><span className="text-state-success-text text-xs">Calisiyor</span>
        </div>,
        <div key="3" className="flex justify-between p-2 border rounded-xs text-sm">
          <span>notification-svc</span><span className="text-state-warning-text text-xs">Dusuk</span>
        </div>,
      ]}
    />
  );
}`,
      tags: ["compact", "kompakt", "yogun", "layout", "size"],
    },
    {
      id: "sfl-toolbar",
      title: "Toolbar ve Yeniden Yukleme",
      description: "toolbar ile ozel butonlar ve onReload ile yeniden yukleme islevselliginin kullanimi.",
      category: "layout",
      code: `import { useState, useCallback } from 'react';
import { SearchFilterListing, TextInput, Button } from '@mfe/design-system';

export function ToolbarOrnegi() {
  const [lastReload, setLastReload] = useState<string>(new Date().toLocaleTimeString('tr-TR'));

  const handleReload = useCallback(() => {
    setLastReload(new Date().toLocaleTimeString('tr-TR'));
    // Veriyi yeniden yukle
  }, []);

  return (
    <SearchFilterListing
      eyebrow="Izleme"
      title="Canli Log Akisi"
      description={\`Son yenileme: \${lastReload}\`}
      filters={
        <TextInput label="Log ara" value="" size="sm" placeholder="Filtre girin..." />
      }
      onReload={handleReload}
      toolbar={
        <>
          <Button size="sm" variant="outline">Disa Aktar</Button>
          <Button size="sm" variant="outline">Ayarlar</Button>
        </>
      }
      totalCount={1284}
      listTitle="Log Kayitlari"
      items={[
        <div key="1" className="flex gap-3 p-3 border rounded-lg font-mono text-sm">
          <span className="text-text-disabled">12:04:22</span>
          <span className="text-state-success-text">[INFO]</span>
          <span>Kullanici giris yapti — user_id=4821</span>
        </div>,
        <div key="2" className="flex gap-3 p-3 border rounded-lg font-mono text-sm">
          <span className="text-text-disabled">12:04:19</span>
          <span className="text-state-warning-text">[WARN]</span>
          <span>Yuksek bellek kullanimi — %87 esik</span>
        </div>,
        <div key="3" className="flex gap-3 p-3 border rounded-lg font-mono text-sm">
          <span className="text-text-disabled">12:04:15</span>
          <span className="text-state-danger-text">[ERROR]</span>
          <span>Veritabani baglanti zaman asimi — pool=primary</span>
        </div>,
      ]}
    />
  );
}`,
      tags: ["toolbar", "reload", "yeniden-yukleme", "buton", "layout"],
    },
    {
      id: "sfl-empty-filtered",
      title: "Filtrelenmis Bos Durum",
      description: "Aktif filtreler varken sonuc bulunamadiginda gosterilen ozel bos durum mesaji ve filtre temizleme aksiyonu.",
      category: "patterns",
      code: `import { useState } from 'react';
import { SearchFilterListing, TextInput, Select, type ActiveFilter } from '@mfe/design-system';

export function FiltreliBosDurum() {
  const [filters, setFilters] = useState<ActiveFilter[]>([
    { key: 'kategori', label: 'Kategori', value: 'Arsivlenmis', onRemove: () => removeFilter('kategori') },
    { key: 'tarih', label: 'Tarih', value: 'Son 7 gun', onRemove: () => removeFilter('tarih') },
  ]);

  const removeFilter = (key: string) => {
    setFilters((prev) => prev.filter((f) => f.key !== key));
  };

  const clearAll = () => setFilters([]);

  return (
    <SearchFilterListing
      title="Bildirim Gecmisi"
      description="Gecmis bildirimleri filtreleyerek inceleyebilirsiniz."
      filters={
        <>
          <TextInput label="Arama" value="mevcut-olmayan-kayit" size="sm" />
          <Select
            label="Kategori"
            size="sm"
            value="archived"
            options={[
              { label: 'Tumu', value: 'all' },
              { label: 'Arsivlenmis', value: 'archived' },
              { label: 'Okunmamis', value: 'unread' },
            ]}
          />
        </>
      }
      activeFilters={filters}
      onClearAllFilters={clearAll}
      items={[]}
      emptyStateLabel="Bu filtre kombinasyonu icin sonuc bulunamadi."
    />
  );
}`,
      tags: ["empty", "bos", "filtre", "contextual", "pattern"],
    },
  ],
  Avatar: [
    {
      id: "avatar-basic",
      title: "Temel Kullanim",
      description: "Gorsel, baş harfler veya varsayilan ikon ile temel avatar kullanimi.",
      category: "basic",
      code: `import { Avatar } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Avatar src="https://i.pravatar.cc/150?u=1" alt="Kullanici" />
      <Avatar initials="HK" />
      <Avatar />
    </div>
  );
}`,
      tags: ["avatar", "profil", "kullanici"],
    },
    {
      id: "avatar-sizes",
      title: "Boyut Olcekleri",
      description: "xs'ten 2xl'ye kadar tum avatar boyutlari.",
      category: "basic",
      code: `import { Avatar } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-end gap-3">
      <Avatar initials="HK" size="xs" />
      <Avatar initials="HK" size="sm" />
      <Avatar initials="HK" size="md" />
      <Avatar initials="HK" size="lg" />
      <Avatar initials="HK" size="xl" />
      <Avatar initials="HK" size="2xl" />
    </div>
  );
}`,
      previewProps: { size: "md" },
      multiVariantAxis: "size",
      tags: ["boyut", "size", "responsive"],
    },
    {
      id: "avatar-shapes",
      title: "Sekil Varyantlari",
      description: "Daire ve kare seklinde avatar gorunumleri.",
      category: "basic",
      code: `import { Avatar } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Avatar initials="AY" shape="circle" />
      <Avatar initials="TK" shape="square" />
    </div>
  );
}`,
      tags: ["sekil", "daire", "kare", "shape"],
    },
    {
      id: "avatar-fallback",
      title: "Yedek Gosterim Sirasi",
      description: "Gorsel yuklenemediginde bas harflere, ikon veya varsayilana dusme davranisi.",
      category: "advanced",
      code: `import { Avatar } from '@mfe/design-system';
import { Bot } from 'lucide-react';

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Avatar src="https://invalid-url.jpg" initials="HK" />
      <Avatar icon={<Bot />} />
      <Avatar />
    </div>
  );
}`,
      tags: ["fallback", "yedek", "hata"],
    },
  ],
  Badge: [
    {
      id: "badge-basic",
      title: "Temel Kullanim",
      description: "Farkli durum varyantlari ile temel badge kullanimi.",
      category: "basic",
      code: `import { Badge } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-2">
      <Badge>Varsayilan</Badge>
      <Badge variant="primary">Birincil</Badge>
      <Badge variant="success">Basarili</Badge>
      <Badge variant="warning">Uyari</Badge>
      <Badge variant="error">Hata</Badge>
      <Badge variant="info">Bilgi</Badge>
    </div>
  );
}`,
      previewProps: { variant: "primary" },
      multiVariantAxis: "variant",
      tags: ["badge", "durum", "etiket"],
    },
    {
      id: "badge-sizes",
      title: "Boyut Secenekleri",
      description: "Kucuk, orta ve buyuk badge boyutlari.",
      category: "basic",
      code: `import { Badge } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-2">
      <Badge size="sm" variant="primary">Kucuk</Badge>
      <Badge size="md" variant="primary">Orta</Badge>
      <Badge size="lg" variant="primary">Buyuk</Badge>
    </div>
  );
}`,
      previewProps: { size: "md" },
      multiVariantAxis: "size",
      tags: ["boyut", "size"],
    },
    {
      id: "badge-dot",
      title: "Nokta Gosterge",
      description: "Metin olmadan durum belirten dot badge kullanimi.",
      category: "advanced",
      code: `import { Badge } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1.5">
        <Badge dot variant="success" /> Aktif
      </span>
      <span className="flex items-center gap-1.5">
        <Badge dot variant="warning" /> Beklemede
      </span>
      <span className="flex items-center gap-1.5">
        <Badge dot variant="error" /> Devre Disi
      </span>
    </div>
  );
}`,
      tags: ["dot", "nokta", "durum", "status"],
    },
  ],
  Tag: [
    {
      id: "tag-basic",
      title: "Temel Kullanim",
      description: "Farkli renk varyantlari ile temel tag kullanimi.",
      category: "basic",
      code: `import { Tag } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <Tag>Varsayilan</Tag>
      <Tag variant="primary">Birincil</Tag>
      <Tag variant="success">Basarili</Tag>
      <Tag variant="warning">Uyari</Tag>
      <Tag variant="error">Hata</Tag>
    </div>
  );
}`,
      tags: ["tag", "etiket", "label"],
    },
    {
      id: "tag-closable",
      title: "Kapatilabilir Etiketler",
      description: "Kullanicinin kaldirabilecegi kapatma butonlu etiketler.",
      category: "form",
      code: `import { Tag } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind']);

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag key={tag} closable onClose={() => removeTag(tag)} variant="primary">
          {tag}
        </Tag>
      ))}
    </div>
  );
}`,
      tags: ["closable", "kapatilabilir", "kaldir", "filtre"],
    },
    {
      id: "tag-with-icon",
      title: "Ikonlu Etiket",
      description: "Sol tarafinda ikon bulunan etiket kullanimi.",
      category: "layout",
      code: `import { Tag } from '@mfe/design-system';
import { Shield, Zap, Globe } from 'lucide-react';

export function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <Tag icon={<Shield />} variant="success">Guvenli</Tag>
      <Tag icon={<Zap />} variant="warning">Performans</Tag>
      <Tag icon={<Globe />} variant="info">Genel</Tag>
    </div>
  );
}`,
      tags: ["ikon", "icon", "lucide"],
    },
  ],};
