import type { ExampleEntry } from './types';

export const examples: Record<string, ExampleEntry[]> = {
  Spinner: [
    {
      id: "spinner-basic",
      title: "Temel Kullanim",
      description: "Farkli boyutlarda temel yukleme gostergesi.",
      category: "basic",
      code: `import { Spinner } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  );
}`,
      previewProps: { size: "md" },
      multiVariantAxis: "size",
      tags: ["spinner", "yukleme", "boyut"],
    },
    {
      id: "spinner-block",
      title: "Blok Modu",
      description: "Etiketli ve ortalanmis tam genislik yukleme gostergesi.",
      category: "layout",
      code: `import { Spinner } from '@mfe/design-system';

export function Example() {
  return <Spinner mode="block" label="Veriler yukleniyor..." size="lg" />;
}`,
      tags: ["block", "etiket", "ortalanmis"],
    },
    {
      id: "spinner-inline",
      title: "Satir Ici Kullanim",
      description: "Metin veya buton icinde satir ici yukleme gostergesi.",
      category: "patterns",
      code: `import { Spinner, Button } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Spinner size="sm" /> Kayit aliniyor...
      </p>
      <Button disabled>
        <Spinner size="xs" className="mr-2" /> Isleniyor
      </Button>
    </div>
  );
}`,
      tags: ["inline", "satir-ici", "buton", "metin"],
    },
  ],
  Card: [
    {
      id: "card-basic",
      title: "Temel Kullanim",
      description: "Farkli gorunum varyantlarinda temel kart bileseni.",
      category: "basic",
      code: `import { Card } from '@mfe/design-system';

export function Example() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card variant="elevated">Yukseltiimis kart icerigi</Card>
      <Card variant="outlined">Cerceveli kart icerigi</Card>
      <Card variant="filled">Dolgulu kart icerigi</Card>
      <Card variant="ghost">Hayalet kart icerigi</Card>
    </div>
  );
}`,
      previewProps: { variant: "elevated" },
      multiVariantAxis: "variant",
      tags: ["card", "kart", "varyant"],
    },
    {
      id: "card-with-header",
      title: "Baslik ve Alt Bilgi",
      description: "CardHeader, CardBody ve CardFooter alt bilesenleriyle yapilandirilmis kart.",
      category: "layout",
      code: `import { Card, CardHeader, CardBody, CardFooter } from '@mfe/design-system';
import { Button, Badge } from '@mfe/design-system';

export function Example() {
  return (
    <Card variant="elevated" padding="md">
      <CardHeader
        title="Politika Durumu"
        subtitle="Son guncelleme: 2 saat once"
        action={<Badge variant="success">Aktif</Badge>}
      />
      <CardBody>
        <p className="text-sm text-[var(--text-secondary)]">
          Otonom ajanlarin guvenlik politikasi basariyla uygulanmaktadir.
        </p>
      </CardBody>
      <CardFooter>
        <Button size="sm" variant="ghost">Detaylar</Button>
        <Button size="sm" variant="primary">Guncelle</Button>
      </CardFooter>
    </Card>
  );
}`,
      tags: ["header", "footer", "body", "yapilandirilmis"],
    },
    {
      id: "card-hoverable",
      title: "Tiklanabilir Kart",
      description: "Hover efektli ve tiklanabilir interaktif kart.",
      category: "advanced",
      code: `import { Card, CardHeader } from '@mfe/design-system';
import { Shield, Zap, Globe } from 'lucide-react';

export function Example() {
  const cards = [
    { icon: <Shield />, title: 'Guvenlik', desc: 'Erisim politikalari' },
    { icon: <Zap />, title: 'Performans', desc: 'Hiz metrikleri' },
    { icon: <Globe />, title: 'Erisim', desc: 'Genel ayarlar' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((c) => (
        <Card key={c.title} variant="outlined" padding="md" hoverable onClick={() => console.log(c.title)}>
          <div className="flex items-center gap-2 mb-2 text-[var(--action-primary)]">
            {c.icon}
          </div>
          <CardHeader title={c.title} subtitle={c.desc} />
        </Card>
      ))}
    </div>
  );
}`,
      tags: ["hoverable", "tiklanabilir", "interaktif", "grid"],
    },
    {
      id: "card-padding",
      title: "Dolgu Secenekleri",
      description: "Farkli dolgu boyutlari ile kart gorunumleri.",
      category: "basic",
      code: `import { Card } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Card padding="none" variant="outlined">padding=none</Card>
      <Card padding="sm" variant="outlined">padding=sm</Card>
      <Card padding="md" variant="outlined">padding=md</Card>
      <Card padding="lg" variant="outlined">padding=lg</Card>
    </div>
  );
}`,
      previewProps: { padding: "md" },
      multiVariantAxis: "padding",
      tags: ["padding", "dolgu", "boyut"],
    },
  ],
  Breadcrumb: [
    {
      id: "breadcrumb-basic",
      title: "Temel Kullanim",
      description: "Sayfa hiyerarsisini gosteren temel breadcrumb navigasyonu.",
      category: "basic",
      code: `import { Breadcrumb } from '@mfe/design-system';

export function Example() {
  return (
    <Breadcrumb
      items={[
        { label: 'Ana Sayfa', onClick: () => console.log('ana sayfa') },
        { label: 'Yonetim', onClick: () => console.log('yonetim') },
        { label: 'Politikalar' },
      ]}
    />
  );
}`,
      tags: ["breadcrumb", "navigasyon", "hiyerarsi"],
    },
    {
      id: "breadcrumb-with-icons",
      title: "Ikonlu Breadcrumb",
      description: "Her oge icin ikon iceren breadcrumb navigasyonu.",
      category: "layout",
      code: `import { Breadcrumb } from '@mfe/design-system';
import { Home, Settings, Shield } from 'lucide-react';

export function Example() {
  return (
    <Breadcrumb
      items={[
        { label: 'Ana Sayfa', icon: <Home />, onClick: () => {} },
        { label: 'Ayarlar', icon: <Settings />, onClick: () => {} },
        { label: 'Guvenlik', icon: <Shield /> },
      ]}
    />
  );
}`,
      tags: ["ikon", "icon", "navigasyon"],
    },
    {
      id: "breadcrumb-collapsed",
      title: "Daraltilmis Breadcrumb",
      description: "maxItems ile uzun yollarda otomatik daraltma.",
      category: "advanced",
      code: `import { Breadcrumb } from '@mfe/design-system';

export function Example() {
  return (
    <Breadcrumb
      maxItems={3}
      items={[
        { label: 'Ana Sayfa', onClick: () => {} },
        { label: 'Yonetim', onClick: () => {} },
        { label: 'Politikalar', onClick: () => {} },
        { label: 'Guvenlik', onClick: () => {} },
        { label: 'Erisim Kontrol' },
      ]}
    />
  );
}`,
      tags: ["daraltma", "collapse", "maxItems", "uzun-yol"],
    },
  ],
  Accordion: [
    {
      id: "accordion-basic",
      title: "Temel Kullanim",
      description: "Acilip kapanabilen bolumleriyle temel accordion bileseni.",
      category: "basic",
      code: `import { Accordion } from '@mfe/design-system';

export function Example() {
  return (
    <Accordion
      items={[
        { value: 'item-1', title: 'Hesap Ayarlari', content: 'Kullanici adi, e-posta ve sifre ayarlarinizi yonetebilirsiniz.' },
        { value: 'item-2', title: 'Bildirim Tercihleri', content: 'E-posta, SMS ve push bildirim tercihlerinizi ayarlayin.' },
        { value: 'item-3', title: 'Gizlilik ve Guvenlik', content: 'Iki faktorlu dogrulama ve oturum yonetimi.' },
      ]}
    />
  );
}`,
      tags: ["accordion", "akordiyon", "acilir-kapanir"],
    },
    {
      id: "accordion-single",
      title: "Tekli Secim Modu",
      description: "Ayni anda yalnizca bir bolumun acik oldugu accordion.",
      category: "basic",
      code: `import { Accordion } from '@mfe/design-system';

export function Example() {
  return (
    <Accordion
      selectionMode="single"
      items={[
        { value: 'faq-1', title: 'Nasil baslayabilirim?', content: 'Kayit olduktan sonra kontrol panelinden ilk projenizi olusturabilirsiniz.' },
        { value: 'faq-2', title: 'Ucretlendirme nasil yapilir?', content: 'Aylik veya yillik abonelik planlari mevcuttur.' },
        { value: 'faq-3', title: 'Destek nasil alabilirim?', content: 'Canli sohbet ve e-posta destegi 7/24 mevcuttur.' },
      ]}
    />
  );
}`,
      tags: ["single", "tekli", "faq", "sss"],
    },
    {
      id: "accordion-ghost",
      title: "Hayalet ve Kompakt",
      description: "Cercevesiz, kompakt gorunumde ghost accordion.",
      category: "advanced",
      code: `import { Accordion } from '@mfe/design-system';

export function Example() {
  return (
    <Accordion
      ghost
      bordered={false}
      size="sm"
      disableGutters
      expandIconPosition="end"
      items={[
        { value: 'sec-1', title: 'Genel Bakis', content: 'Sistem durumu ve ozet bilgiler.' },
        { value: 'sec-2', title: 'Detaylar', content: 'Teknik konfigürasyon ayarlari.' },
        { value: 'sec-3', title: 'Loglar', content: 'Son islem kayitlari.' },
      ]}
    />
  );
}`,
      tags: ["ghost", "hayalet", "kompakt", "cercevesiz"],
    },
    {
      id: "accordion-with-description",
      title: "Aciklamali Bolumler",
      description: "Baslik altinda aciklama ve sag tarafta ekstra icerik.",
      category: "layout",
      code: `import { Accordion } from '@mfe/design-system';
import { Badge } from '@mfe/design-system';

export function Example() {
  return (
    <Accordion
      items={[
        {
          value: 'policy-1',
          title: 'Otonom Ajan Politikasi',
          description: 'Ajanlarin calisma sinirlarini ve izinlerini tanimlar.',
          extra: <Badge variant="success" size="sm">Aktif</Badge>,
          content: 'Politika detaylari ve kurallar burada yer alir.',
        },
        {
          value: 'policy-2',
          title: 'Veri Erisim Politikasi',
          description: 'Hassas verilere erisim izinlerini duzenler.',
          extra: <Badge variant="warning" size="sm">Incelemede</Badge>,
          content: 'Erisim kurallari ve kisitlamalar.',
        },
      ]}
    />
  );
}`,
      tags: ["description", "aciklama", "extra", "badge"],
    },
  ],
  DatePicker: [
    {
      id: "datepicker-basic",
      title: "Temel Tarih Secimi",
      description: "Etiket ve aciklama ile standart tarih secici.",
      category: "form",
      code: `import { DatePicker } from '@mfe/design-system';

export function Example() {
  return (
    <DatePicker
      label="Dogum Tarihi"
      description="Gun/Ay/Yil formatinda giriniz."
    />
  );
}`,
      previewProps: { label: "Dogum Tarihi", description: "Gun/Ay/Yil formatinda giriniz." },
      tags: ["tarih", "date", "form", "label"],
    },
    {
      id: "datepicker-min-max",
      title: "Tarih Araligi Kisitlama",
      description: "min ve max ile gecerli tarih araligi sinirlandirmasi.",
      category: "form",
      code: `import { DatePicker } from '@mfe/design-system';

export function Example() {
  return (
    <DatePicker
      label="Randevu Tarihi"
      min="2026-01-01"
      max="2026-12-31"
      hint="2026 yili icinde bir tarih seciniz."
    />
  );
}`,
      previewProps: { label: "Randevu Tarihi", min: "2026-01-01", max: "2026-12-31" },
      tags: ["min", "max", "aralik", "kisitlama"],
    },
    {
      id: "datepicker-validation",
      title: "Hata Durumu",
      description: "Gecersiz tarih seciminde hata mesaji gosterimi.",
      category: "form",
      code: `import { DatePicker } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [value, setValue] = useState('');
  const hasError = value && new Date(value) < new Date();

  return (
    <DatePicker
      label="Bitis Tarihi"
      value={value}
      onValueChange={(v) => setValue(v)}
      error={hasError ? 'Gecmis bir tarih secilemez.' : undefined}
      invalid={!!hasError}
    />
  );
}`,
      previewProps: { label: "Bitis Tarihi", error: "Gecmis bir tarih secilemez.", invalid: true },
      tags: ["hata", "validation", "error", "gecersiz"],
    },
  ],
  Steps: [
    {
      id: "steps-basic",
      title: "Temel Adim Gostergesi",
      description: "Yatay cok adimli is akisi gostergesi.",
      category: "basic",
      code: `import { Steps } from '@mfe/design-system';

export function Example() {
  return (
    <Steps
      current={1}
      items={[
        { key: 'bilgi', title: 'Kisisel Bilgiler' },
        { key: 'adres', title: 'Adres Bilgileri' },
        { key: 'onay', title: 'Onay' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["adim", "steps", "wizard", "ilerleme"],
    },
    {
      id: "steps-vertical",
      title: "Dikey Adimlar",
      description: "Aciklama satirlariyla dikey adim gostergesi.",
      category: "layout",
      code: `import { Steps } from '@mfe/design-system';

export function Example() {
  return (
    <Steps
      direction="vertical"
      current={2}
      items={[
        { key: 'kayit', title: 'Kayit', description: 'Hesap olusturuldu.' },
        { key: 'dogrulama', title: 'E-posta Dogrulama', description: 'E-posta adresi onaylandi.' },
        { key: 'profil', title: 'Profil Tamamlama', description: 'Bilgilerinizi girin.' },
        { key: 'basla', title: 'Kullanima Basla' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["dikey", "vertical", "aciklama", "description"],
    },
    {
      id: "steps-error",
      title: "Hata Durumlu Adim",
      description: "Aktif adimda hata durumu gosterimi.",
      category: "advanced",
      code: `import { Steps } from '@mfe/design-system';

export function Example() {
  return (
    <Steps
      current={1}
      status="error"
      items={[
        { key: 'yukle', title: 'Dosya Yukle' },
        { key: 'isle', title: 'Isleme', description: 'Dosya formati gecersiz.' },
        { key: 'tamamla', title: 'Tamamla' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["hata", "error", "durum", "status"],
    },
    {
      id: "steps-dot",
      title: "Nokta Stili",
      description: "Numaralar yerine minimalist nokta gostergesi.",
      category: "basic",
      code: `import { Steps } from '@mfe/design-system';

export function Example() {
  return (
    <Steps
      dot
      current={2}
      items={[
        { key: 's1', title: 'Basvuru' },
        { key: 's2', title: 'Degerlendirme' },
        { key: 's3', title: 'Mulakat' },
        { key: 's4', title: 'Teklif' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["dot", "nokta", "minimalist"],
    },
  ],
  List: [
    {
      id: "list-basic",
      title: "Temel Liste",
      description: "Baslik, aciklama ve meta bilgisiyle basit liste gorunumu.",
      category: "basic",
      code: `import { List } from '@mfe/design-system';

export function Example() {
  return (
    <List
      title="Son Islemler"
      items={[
        { key: '1', title: 'Fatura #2024-001', description: 'Aylik abonelik odemesi', meta: '250 TL' },
        { key: '2', title: 'Fatura #2024-002', description: 'Ek kullanici lisansi', meta: '75 TL' },
        { key: '3', title: 'Fatura #2024-003', description: 'Depolama yukseltmesi', meta: '120 TL' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["liste", "list", "temel", "meta"],
    },
    {
      id: "list-interactive",
      title: "Secim Yapilabilen Liste",
      description: "Tiklanabilir ogeler ve secili durum gosterimi.",
      category: "advanced",
      code: `import { List } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [selected, setSelected] = useState<React.Key>('proje-1');

  return (
    <List
      title="Projeler"
      selectedKey={selected}
      onItemSelect={(key) => setSelected(key)}
      items={[
        { key: 'proje-1', title: 'Cockpit Dashboard', description: 'Ana yonetim paneli', badges: ['Aktif'] },
        { key: 'proje-2', title: 'Otonom Orkestrator', description: 'Ajan yonetim sistemi', badges: ['Gelistirme'] },
        { key: 'proje-3', title: 'Veri Isleme Hatti', description: 'ETL pipeline servisi', badges: ['Planlandi'] },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["secim", "interactive", "selected", "badge"],
    },
    {
      id: "list-tones",
      title: "Duruma Gore Renk Tonlari",
      description: "Bilgi, basari, uyari ve tehlike tonlariyla oge vurgulama.",
      category: "layout",
      code: `import { List } from '@mfe/design-system';

export function Example() {
  return (
    <List
      title="Sistem Bildirimleri"
      items={[
        { key: 'n1', title: 'Yedekleme Tamamlandi', description: 'Veritabani yedegi basariyla alindi.', tone: 'success' },
        { key: 'n2', title: 'Disk Alani Uyarisi', description: 'Kalan alan %15 altina dustu.', tone: 'warning' },
        { key: 'n3', title: 'Servis Hatasi', description: 'API gateway yanit vermiyor.', tone: 'danger' },
        { key: 'n4', title: 'Guncelleme Mevcut', description: 'v2.4.1 surumu yayinlandi.', tone: 'info' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["ton", "tone", "renk", "durum", "bildirim"],
    },
  ],
  Combobox: [
    {
      id: "combobox-basic",
      title: "Temel Combobox",
      description: "Arama yapilabilir tekli secim bileseni.",
      category: "form",
      code: `import { Combobox } from '@mfe/design-system';

export function Example() {
  return (
    <Combobox
      label="Sehir Seciniz"
      placeholder="Aramak icin yazin..."
      options={[
        { label: 'Istanbul', value: 'ist' },
        { label: 'Ankara', value: 'ank' },
        { label: 'Izmir', value: 'izm' },
        { label: 'Bursa', value: 'brs' },
        { label: 'Antalya', value: 'ant' },
      ]}
    />
  );
}`,
      previewProps: { label: "Sehir Seciniz", placeholder: "Aramak icin yazin..." },
      tags: ["combobox", "arama", "secim", "sehir"],
    },
    {
      id: "combobox-grouped",
      title: "Gruplu Secenekler",
      description: "Kategorilere ayrilmis secenek gruplari.",
      category: "advanced",
      code: `import { Combobox } from '@mfe/design-system';

export function Example() {
  return (
    <Combobox
      label="Departman Secimi"
      placeholder="Departman arayin..."
      options={[
        {
          label: 'Muhendislik',
          options: [
            { label: 'Frontend', value: 'fe' },
            { label: 'Backend', value: 'be' },
            { label: 'DevOps', value: 'devops' },
          ],
        },
        {
          label: 'Urun',
          options: [
            { label: 'Urun Yonetimi', value: 'pm' },
            { label: 'Tasarim', value: 'design' },
          ],
        },
      ]}
    />
  );
}`,
      previewProps: { label: "Departman Secimi", placeholder: "Departman arayin..." },
      tags: ["grup", "group", "kategori", "departman"],
    },
    {
      id: "combobox-multi",
      title: "Coklu Secim (Etiketler)",
      description: "Birden fazla deger secip etiket olarak gosterme.",
      category: "form",
      code: `import { Combobox } from '@mfe/design-system';

export function Example() {
  return (
    <Combobox
      label="Yetenekler"
      placeholder="Yetenek ekleyin..."
      selectionMode="tags"
      freeSolo
      options={[
        { label: 'React', value: 'react' },
        { label: 'TypeScript', value: 'ts' },
        { label: 'Node.js', value: 'node' },
        { label: 'PostgreSQL', value: 'pg' },
        { label: 'Docker', value: 'docker' },
      ]}
    />
  );
}`,
      previewProps: { label: "Yetenekler", placeholder: "Yetenek ekleyin...", selectionMode: "tags" },
      tags: ["coklu", "multi", "etiket", "tags", "freeSolo"],
    },
  ],};
