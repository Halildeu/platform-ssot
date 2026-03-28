import type { ExampleEntry } from './types';

export const examples: Record<string, ExampleEntry[]> = {
  Tree: [
    {
      id: "tree-basic",
      title: "Temel Agac Yapisi",
      description: "Hiyerarsik veriyi agac gorunumunde gosterme.",
      category: "basic",
      code: `import { Tree } from '@mfe/design-system';

export function Example() {
  return (
    <Tree
      title="Proje Yapisi"
      description="Kaynak kod dizin agaci"
      nodes={[
        {
          key: 'src',
          label: 'src',
          children: [
            { key: 'components', label: 'components', description: 'UI bileseleri', badges: ['14 dosya'] },
            { key: 'utils', label: 'utils', description: 'Yardimci fonksiyonlar' },
            { key: 'hooks', label: 'hooks', description: 'React hook\'lari', badges: ['Yeni'] },
          ],
        },
        { key: 'package', label: 'package.json', meta: '2.1 KB' },
        { key: 'readme', label: 'README.md', meta: '4.5 KB' },
      ]}
      defaultExpandedKeys={['src']}
    />
  );
}`,
      previewProps: { defaultExpandedKeys: ["src"] },
      tags: ["agac", "hiyerarsi", "klasor", "dizin"],
    },
    {
      id: "tree-tones",
      title: "Duruma Gore Renkli Dugumler",
      description: "Farkli ton ve rozet ile dugum vurgulama.",
      category: "advanced",
      code: `import { Tree } from '@mfe/design-system';

export function Example() {
  return (
    <Tree
      title="Servis Durumu"
      description="Mikro servis sagligi"
      nodes={[
        { key: 'api', label: 'API Gateway', description: 'Tum istekler yonlendiriliyor', tone: 'success', badges: ['Saglikli'] },
        { key: 'auth', label: 'Auth Servisi', description: 'Yanit suresi yuksek', tone: 'warning', badges: ['Yavas'] },
        {
          key: 'veritabani',
          label: 'Veritabani',
          tone: 'danger',
          badges: ['Kesinti'],
          children: [
            { key: 'primary', label: 'Primary', description: 'Baglanti zaman asimi', tone: 'danger' },
            { key: 'replica', label: 'Replica', description: 'Senkronizasyon bekleniyor', tone: 'warning' },
          ],
        },
        { key: 'cache', label: 'Onbellek', description: 'Redis cluster aktif', tone: 'info', badges: ['v7.2'] },
      ]}
      defaultExpandedKeys={['veritabani']}
    />
  );
}`,
      previewProps: { defaultExpandedKeys: ["veritabani"] },
      tags: ["ton", "durum", "saglik", "servis", "badge"],
    },
    {
      id: "tree-selectable",
      title: "Secilebilir Agac",
      description: "Dugum secimi ve olay yakalama ile agac yapisi.",
      category: "advanced",
      code: `import { useState } from 'react';
import { Tree } from '@mfe/design-system';

export function Example() {
  const [selected, setSelected] = useState<React.Key | null>(null);

  return (
    <Tree
      title="Departmanlar"
      selectedKey={selected}
      onNodeSelect={setSelected}
      density="compact"
      nodes={[
        {
          key: 'muhendislik',
          label: 'Muhendislik',
          badges: ['24 kisi'],
          children: [
            { key: 'frontend', label: 'Frontend', meta: '8 kisi' },
            { key: 'backend', label: 'Backend', meta: '10 kisi' },
            { key: 'devops', label: 'DevOps', meta: '6 kisi' },
          ],
        },
        {
          key: 'tasarim',
          label: 'Tasarim',
          badges: ['12 kisi'],
          children: [
            { key: 'uiux', label: 'UI/UX', meta: '7 kisi' },
            { key: 'grafik', label: 'Grafik Tasarim', meta: '5 kisi' },
          ],
        },
      ]}
      defaultExpandedKeys={['muhendislik', 'tasarim']}
    />
  );
}`,
      previewProps: { density: "compact", defaultExpandedKeys: ["muhendislik", "tasarim"] },
      tags: ["secim", "select", "departman", "compact"],
    },
  ],
  AgGridServer: [
    {
      id: "aggridserver-basic",
      title: "Temel Sunucu Grid",
      description: "Sunucu tarafli veri kaynagi ile AG Grid kullanimi.",
      category: "basic",
      code: `import { AgGridServer } from '@mfe/design-system';

export function Example() {
  return (
    <AgGridServer
      columnDefs={[
        { field: 'ad', headerName: 'Ad Soyad', flex: 1 },
        { field: 'departman', headerName: 'Departman', flex: 1 },
        { field: 'durum', headerName: 'Durum', width: 120 },
      ]}
      getData={async (request) => ({
        rows: [
          { ad: 'Ahmet Yilmaz', departman: 'Muhendislik', durum: 'Aktif' },
          { ad: 'Ayse Demir', departman: 'Tasarim', durum: 'Aktif' },
        ],
        total: 2,
      })}
      height={400}
    />
  );
}`,
      previewProps: { height: 400 },
      tags: ["grid", "sunucu", "ag-grid", "veri"],
    },
    {
      id: "aggridserver-custom-cols",
      title: "Ozel Sutun Ayarlari",
      description: "Varsayilan sutun tanimlamalari ve grid ayarlari ile.",
      category: "advanced",
      code: `import { AgGridServer } from '@mfe/design-system';

export function Example() {
  return (
    <AgGridServer
      columnDefs={[
        { field: 'kod', headerName: 'Urun Kodu', width: 140, pinned: 'left' },
        { field: 'urunAdi', headerName: 'Urun Adi', flex: 2 },
        { field: 'fiyat', headerName: 'Fiyat', width: 120, type: 'numericColumn' },
        { field: 'stok', headerName: 'Stok', width: 100, type: 'numericColumn' },
      ]}
      defaultColDef={{ sortable: true, filter: true, resizable: true }}
      getData={async () => ({
        rows: [
          { kod: 'PRD-001', urunAdi: 'Laptop Pro 15', fiyat: 45000, stok: 24 },
          { kod: 'PRD-002', urunAdi: 'Kablosuz Klavye', fiyat: 1200, stok: 150 },
        ],
        total: 2,
      })}
      height={350}
    />
  );
}`,
      previewProps: { height: 350 },
      tags: ["grid", "sutun", "siralama", "filtre"],
    },
  ],
  EntityGridTemplate: [
    {
      id: "entitygrid-basic",
      title: "Temel Varlik Tablosu",
      description: "Sayfalama ve hizli filtre ile varlik listesi.",
      category: "basic",
      code: `import { EntityGridTemplate } from '@mfe/design-system';

export function Example() {
  return (
    <EntityGridTemplate
      gridId="personel-listesi"
      gridSchemaVersion={1}
      columnDefs={[
        { field: 'ad', headerName: 'Ad Soyad', flex: 1 },
        { field: 'unvan', headerName: 'Unvan', flex: 1 },
        { field: 'departman', headerName: 'Departman', flex: 1 },
      ]}
      rowData={[
        { ad: 'Mehmet Ozkan', unvan: 'Kidemli Gelistirici', departman: 'Muhendislik' },
        { ad: 'Zeynep Kaya', unvan: 'UX Tasarimci', departman: 'Tasarim' },
        { ad: 'Can Aksoy', unvan: 'DevOps Muhendisi', departman: 'Altyapi' },
      ]}
      total={3}
      page={1}
      pageSize={25}
    />
  );
}`,
      previewProps: { gridId: "personel-listesi", gridSchemaVersion: 1, page: 1, pageSize: 25 },
      tags: ["grid", "tablo", "varlik", "liste"],
    },
    {
      id: "entitygrid-toolbar",
      title: "Arac Cubugu ile Grid",
      description: "Tema secici, yogunluk degistirici ve disa aktarma secenekleri.",
      category: "advanced",
      code: `import { EntityGridTemplate } from '@mfe/design-system';

export function Example() {
  return (
    <EntityGridTemplate
      gridId="siparis-takip"
      gridSchemaVersion={2}
      columnDefs={[
        { field: 'siparisNo', headerName: 'Siparis No', width: 140 },
        { field: 'musteri', headerName: 'Musteri', flex: 1 },
        { field: 'tutar', headerName: 'Tutar', width: 120, type: 'numericColumn' },
        { field: 'durum', headerName: 'Durum', width: 130 },
      ]}
      rowData={[
        { siparisNo: 'SIP-2024-001', musteri: 'ABC Ltd.', tutar: 15400, durum: 'Tamamlandi' },
        { siparisNo: 'SIP-2024-002', musteri: 'XYZ A.S.', tutar: 28750, durum: 'Hazirlaniyor' },
      ]}
      total={2}
      page={1}
      pageSize={50}
      exportConfig={{ fileBaseName: 'siparisler', sheetName: 'Siparisler' }}
      quickFilterPlaceholder="Siparis ara..."
    />
  );
}`,
      previewProps: { gridId: "siparis-takip", gridSchemaVersion: 2, page: 1, pageSize: 50 },
      tags: ["grid", "arac-cubugu", "disa-aktarma", "filtre", "tema"],
    },
    {
      id: "entitygrid-server-mode",
      title: "Sunucu Tarafli Veri Modu",
      description: "Server-side datasource entegrasyonu ile buyuk veri seti yonetimi.",
      category: "advanced",
      code: `import { EntityGridTemplate } from '@mfe/design-system';

export function Example() {
  return (
    <EntityGridTemplate
      gridId="log-kayitlari"
      gridSchemaVersion={1}
      dataSourceMode="server"
      columnDefs={[
        { field: 'tarih', headerName: 'Tarih', width: 180 },
        { field: 'seviye', headerName: 'Seviye', width: 100 },
        { field: 'mesaj', headerName: 'Mesaj', flex: 2 },
        { field: 'kaynak', headerName: 'Kaynak', flex: 1 },
      ]}
      total={10000}
      page={1}
      pageSize={100}
      pageSizeOptions={[50, 100, 250]}
      messages={{ overlayLoadingLabel: 'Kayitlar yukleniyor...' }}
    />
  );
}`,
      previewProps: { gridId: "log-kayitlari", gridSchemaVersion: 1, dataSourceMode: "server", page: 1, pageSize: 100 },
      tags: ["grid", "sunucu", "server-side", "buyuk-veri"],
    },
  ],
  TableSimple: [
    {
      id: "tablesimple-basic",
      title: "Temel Statik Tablo",
      description: "Basit veri gosterimi icin hafif tablo bileseni.",
      category: "basic",
      code: `import { TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <TableSimple
      caption="Ekip Uyeleri"
      description="Aktif proje ekibindeki uyeler"
      columns={[
        { key: 'ad', label: 'Ad Soyad', emphasis: true },
        { key: 'rol', label: 'Rol' },
        { key: 'katilim', label: 'Katilim Tarihi' },
      ]}
      rows={[
        { ad: 'Ali Veli', rol: 'Frontend Gelistirici', katilim: '2024-01-15' },
        { ad: 'Fatma Sahin', rol: 'Backend Gelistirici', katilim: '2024-03-20' },
        { ad: 'Emre Yildiz', rol: 'QA Muhendisi', katilim: '2024-06-01' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["tablo", "statik", "liste", "basit"],
    },
    {
      id: "tablesimple-compact",
      title: "Siki Yogunluk Tablosu",
      description: "Compact yoğunluk ve yapışkan başlık ile.",
      category: "layout",
      code: `import { TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <TableSimple
      caption="Son Islemler"
      density="compact"
      stickyHeader
      striped
      columns={[
        { key: 'tarih', label: 'Tarih', width: '120px' },
        { key: 'islem', label: 'Islem', emphasis: true },
        { key: 'tutar', label: 'Tutar', align: 'right' },
        { key: 'durum', label: 'Durum', align: 'center' },
      ]}
      rows={[
        { tarih: '2024-12-01', islem: 'Satis #1042', tutar: '12.500 TL', durum: 'Tamamlandi' },
        { tarih: '2024-12-02', islem: 'Iade #203', tutar: '-2.100 TL', durum: 'Isleniyor' },
        { tarih: '2024-12-03', islem: 'Satis #1043', tutar: '8.750 TL', durum: 'Tamamlandi' },
      ]}
    />
  );
}`,
      previewProps: { density: "compact", stickyHeader: true, striped: true },
      tags: ["tablo", "compact", "yapiskan", "yogunluk"],
    },
    {
      id: "tablesimple-loading",
      title: "Yukleniyor Durumu",
      description: "Skeleton placeholder ile veri yukleme durumu.",
      category: "patterns",
      code: `import { TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <TableSimple
      caption="Envanter Raporu"
      loading
      columns={[
        { key: 'urun', label: 'Urun' },
        { key: 'kategori', label: 'Kategori' },
        { key: 'stok', label: 'Stok', align: 'right' },
      ]}
      rows={[]}
    />
  );
}`,
      previewProps: { loading: true },
      tags: ["tablo", "yukleniyor", "skeleton", "bekleme"],
    },
  ],
  EntitySummaryBlock: [
    {
      id: "entitysummary-basic",
      title: "Temel Varlik Ozeti",
      description: "Avatar, baslik ve anahtar-deger cifti ile varlik ozet karti.",
      category: "basic",
      code: `import { EntitySummaryBlock } from '@mfe/design-system';

export function Example() {
  return (
    <EntitySummaryBlock
      title="Ahmet Yilmaz"
      subtitle="Kidemli Yazilim Muhendisi - Muhendislik Departmani"
      avatar={{ name: 'Ahmet Yilmaz', alt: 'AY' }}
      items={[
        { label: 'E-posta', value: 'ahmet.yilmaz@sirket.com' },
        { label: 'Telefon', value: '+90 532 123 4567' },
        { label: 'Konum', value: 'Istanbul, Turkiye' },
        { label: 'Baslangic', value: '15 Ocak 2022' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["ozet", "kart", "avatar", "profil"],
    },
    {
      id: "entitysummary-with-badge-actions",
      title: "Rozet ve Aksiyonlu Ozet",
      description: "Durum rozeti ve eylem butonlari ile zenginlestirilmis ozet.",
      category: "advanced",
      code: `import { EntitySummaryBlock } from '@mfe/design-system';
import { Button } from '@mfe/design-system';

export function Example() {
  return (
    <EntitySummaryBlock
      title="PRJ-2024-Alpha"
      subtitle="Musteri portali modernizasyon projesi"
      badge={<span className="rounded-full bg-state-success-bg px-2.5 py-0.5 text-xs font-semibold text-state-success-text">Aktif</span>}
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="secondary">Duzenle</Button>
          <Button size="sm" variant="primary">Detaylar</Button>
        </div>
      }
      items={[
        { label: 'Proje Yoneticisi', value: 'Selin Kara' },
        { label: 'Baslangic', value: '01 Mart 2024' },
        { label: 'Hedef Bitis', value: '30 Eylul 2024' },
        { label: 'Butce', value: '1.250.000 TL' },
        { label: 'Ilerleme', value: '%68 tamamlandi' },
        { label: 'Ekip Buyuklugu', value: '12 kisi' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["ozet", "rozet", "aksiyon", "proje", "durum"],
    },
  ],
  ReportFilterPanel: [
    {
      id: "reportfilter-basic",
      title: "Temel Filtre Paneli",
      description: "Yatay filtre formu ile gonder ve sifirla butonlari.",
      category: "form",
      code: `import { ReportFilterPanel } from '@mfe/design-system';

export function Example() {
  return (
    <ReportFilterPanel
      submitLabel="Filtrele"
      resetLabel="Sifirla"
      onSubmit={() => console.log('Filtre uygulandi')}
      onReset={() => console.log('Filtreler sifirlandi')}
    >
      <input
        type="text"
        placeholder="Urun adi..."
        className="w-full rounded-md border border-border-default px-3 py-2 text-sm"
      />
      <select className="w-full rounded-md border border-border-default px-3 py-2 text-sm">
        <option value="">Kategori secin</option>
        <option value="elektronik">Elektronik</option>
        <option value="giyim">Giyim</option>
      </select>
    </ReportFilterPanel>
  );
}`,
      previewProps: { submitLabel: "Filtrele", resetLabel: "Sifirla" },
      tags: ["filtre", "form", "rapor", "arama"],
    },
    {
      id: "reportfilter-loading",
      title: "Yukleniyor Durumlu Filtre",
      description: "Veri cekilirken devre disi butonlar ile filtre paneli.",
      category: "form",
      code: `import { ReportFilterPanel } from '@mfe/design-system';

export function Example() {
  return (
    <ReportFilterPanel
      loading
      submitLabel="Yukleniyor..."
      resetLabel="Sifirla"
      onSubmit={() => {}}
      onReset={() => {}}
    >
      <input
        type="date"
        className="w-full rounded-md border border-border-default px-3 py-2 text-sm"
        defaultValue="2024-01-01"
      />
      <input
        type="date"
        className="w-full rounded-md border border-border-default px-3 py-2 text-sm"
        defaultValue="2024-12-31"
      />
      <select className="w-full rounded-md border border-border-default px-3 py-2 text-sm">
        <option value="">Tum durumlar</option>
        <option value="aktif">Aktif</option>
        <option value="pasif">Pasif</option>
      </select>
    </ReportFilterPanel>
  );
}`,
      previewProps: { loading: true },
      tags: ["filtre", "yukleniyor", "devre-disi", "rapor"],
    },
    {
      id: "reportfilter-readonly",
      title: "Salt Okunur Filtre Paneli",
      description: "Erisim kontrolu ile salt okunur modda filtre paneli.",
      category: "advanced",
      code: `import { ReportFilterPanel } from '@mfe/design-system';

export function Example() {
  return (
    <ReportFilterPanel
      access="readonly"
      accessReason="Bu rapor filtreleri degistirilemez"
      submitLabel="Filtrele"
      resetLabel="Sifirla"
      onSubmit={() => {}}
      onReset={() => {}}
    >
      <input
        type="text"
        placeholder="Calisan adi..."
        className="w-full rounded-md border border-border-default px-3 py-2 text-sm"
      />
      <select className="w-full rounded-md border border-border-default px-3 py-2 text-sm">
        <option value="muhendislik">Muhendislik</option>
      </select>
    </ReportFilterPanel>
  );
}`,
      previewProps: { access: "readonly", accessReason: "Bu rapor filtreleri degistirilemez" },
      tags: ["filtre", "salt-okunur", "erisim", "readonly"],
    },
  ],
  DetailSectionTabs: [
    {
      id: "detailsectiontabs-basic",
      title: "Temel Detay Sekmeleri",
      description: "Detay sayfasi icin bolum sekmeleri.",
      category: "basic",
      code: `import { useState } from 'react';
import { DetailSectionTabs } from '@mfe/design-system';

export function Example() {
  const [activeTab, setActiveTab] = useState('genel');

  return (
    <DetailSectionTabs
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      tabs={[
        { id: 'genel', label: 'Genel Bilgiler' },
        { id: 'iletisim', label: 'Iletisim' },
        { id: 'dosyalar', label: 'Dosyalar', badge: '12' },
        { id: 'notlar', label: 'Notlar' },
      ]}
    />
  );
}`,
      previewProps: { activeTabId: "genel" },
      tags: ["sekme", "detay", "navigasyon", "bolum"],
    },
    {
      id: "detailsectiontabs-with-badges",
      title: "Rozetli Detay Sekmeleri",
      description: "Her sekmede sayi rozeti ve devre disi durumu ile.",
      category: "advanced",
      code: `import { useState } from 'react';
import { DetailSectionTabs } from '@mfe/design-system';

export function Example() {
  const [activeTab, setActiveTab] = useState('siparisler');

  return (
    <DetailSectionTabs
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      density="comfortable"
      tabs={[
        { id: 'siparisler', label: 'Siparisler', badge: '24', description: 'Acik ve kapali tum siparisler' },
        { id: 'faturalar', label: 'Faturalar', badge: '8' },
        { id: 'iadeler', label: 'Iadeler', badge: '3', description: 'Iade talepleri ve durumlari' },
        { id: 'arsiv', label: 'Arsiv', disabled: true },
      ]}
    />
  );
}`,
      previewProps: { activeTabId: "siparisler", density: "comfortable" },
      tags: ["sekme", "rozet", "sayi", "devre-disi"],
    },
  ],
  SectionTabs: [
    {
      id: "sectiontabs-basic",
      title: "Temel Bolum Sekmeleri",
      description: "Yatay bolum navigasyonu icin segmented sekme bileseni.",
      category: "basic",
      code: `import { useState } from 'react';
import { SectionTabs } from '@mfe/design-system';

export function Example() {
  const [value, setValue] = useState('genel');

  return (
    <SectionTabs
      value={value}
      onValueChange={setValue}
      ariaLabel="Sayfa bolumleri"
      items={[
        { value: 'genel', label: 'Genel' },
        { value: 'ayarlar', label: 'Ayarlar' },
        { value: 'guvenlik', label: 'Guvenlik' },
        { value: 'bildirimler', label: 'Bildirimler' },
      ]}
    />
  );
}`,
      previewProps: { value: "genel" },
      tags: ["sekme", "bolum", "navigasyon", "segmented"],
    },
    {
      id: "sectiontabs-with-descriptions",
      title: "Aciklamali Sekmeler",
      description: "Tooltip ile aciklama gosterimi ve rozet destegi.",
      category: "advanced",
      code: `import { useState } from 'react';
import { SectionTabs } from '@mfe/design-system';

export function Example() {
  const [value, setValue] = useState('performans');

  return (
    <SectionTabs
      value={value}
      onValueChange={setValue}
      ariaLabel="Dashboard bolumleri"
      density="comfortable"
      descriptionDisplay="tooltip"
      descriptionVisibility="hover"
      items={[
        { value: 'performans', label: 'Performans', description: 'Sistem performans metrikleri', badge: '3' },
        { value: 'kullanici', label: 'Kullanicilar', description: 'Aktif kullanici istatistikleri', badge: '1.2K' },
        { value: 'hatalar', label: 'Hatalar', description: 'Hata loglari ve uyarilar', badge: '7' },
        { value: 'denetim', label: 'Denetim', description: 'Denetim kayitlari ve izleme' },
      ]}
    />
  );
}`,
      previewProps: { value: "performans", density: "comfortable", descriptionDisplay: "tooltip", descriptionVisibility: "hover" },
      tags: ["sekme", "aciklama", "tooltip", "rozet", "dashboard"],
    },
    {
      id: "sectiontabs-wrap-layout",
      title: "Saran Yerlesim Modu",
      description: "Otomatik satiralti gecis ile genis icerik sekmeleri.",
      category: "layout",
      code: `import { useState } from 'react';
import { SectionTabs } from '@mfe/design-system';

export function Example() {
  const [value, setValue] = useState('urunler');

  return (
    <SectionTabs
      value={value}
      onValueChange={setValue}
      ariaLabel="Katalog bolumleri"
      layout="wrap"
      items={[
        { value: 'urunler', label: 'Urunler', badge: '256' },
        { value: 'kategoriler', label: 'Kategoriler', badge: '18' },
        { value: 'markalar', label: 'Markalar', badge: '42' },
        { value: 'kampanyalar', label: 'Kampanyalar', badge: '5' },
        { value: 'stok', label: 'Stok Yonetimi' },
        { value: 'fiyatlandirma', label: 'Fiyatlandirma' },
      ]}
    />
  );
}`,
      previewProps: { value: "urunler", layout: "wrap" },
      tags: ["sekme", "saran", "wrap", "responsive"],
    },
  ],};
