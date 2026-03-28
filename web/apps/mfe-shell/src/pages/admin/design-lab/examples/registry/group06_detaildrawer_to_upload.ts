import type { ExampleEntry } from './types';

export const examples: Record<string, ExampleEntry[]> = {
  DetailDrawer: [
    {
      id: "detail-drawer-basic",
      title: "Temel Detay Cekmecesi",
      description: "Baslik, bolumler ve footer iceren salt-okunur detay paneli.",
      category: "basic",
      code: `import { DetailDrawer } from '@mfe/design-system';
import { Button } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Detay Gor</Button>
      <DetailDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Siparis #ORD-2024-1847"
        subtitle="12 Aralik 2024 tarihli siparis detaylari"
        sections={[
          {
            key: 'musteri',
            title: 'Musteri Bilgileri',
            content: (
              <div className="flex flex-col gap-2 text-sm">
                <p><strong>Ad:</strong> Ahmet Yilmaz</p>
                <p><strong>Email:</strong> ahmet@ornek.com</p>
                <p><strong>Telefon:</strong> +90 555 123 4567</p>
              </div>
            ),
          },
          {
            key: 'urunler',
            title: 'Siparis Kalemleri',
            content: (
              <div className="flex flex-col gap-1 text-sm">
                <p>MacBook Pro 14" x1 — ₺84.999</p>
                <p>USB-C Hub x2 — ₺1.598</p>
              </div>
            ),
          },
        ]}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>Kapat</Button>
            <Button variant="primary">Siparisi Onayla</Button>
          </div>
        }
      />
    </>
  );
}`,
      previewProps: { open: true },
      tags: ["drawer", "cekmece", "detay", "panel"],
    },
    {
      id: "detail-drawer-with-tags",
      title: "Etiketli Detay Cekmecesi",
      description: "Baslik yaninda durum etiketleri ve aksiyon butonlari iceren detay cekmecesi.",
      category: "patterns",
      code: `import { DetailDrawer } from '@mfe/design-system';
import { Button, Badge } from '@mfe/design-system';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Musteri Detayi</Button>
      <DetailDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Mehmet Ozturk"
        subtitle="Premium uye — 2 yildir aktif"
        tags={
          <>
            <Badge variant="success">Aktif</Badge>
            <Badge variant="info">Premium</Badge>
          </>
        }
        actions={
          <>
            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
          </>
        }
        size="xl"
      >
        <div className="flex flex-col p-6 gap-4">
          <p className="text-sm text-text-secondary">
            Musteri hesap detaylari ve gecmis islem ozeti burada goruntulenir.
          </p>
        </div>
      </DetailDrawer>
    </>
  );
}`,
      previewProps: { open: true, size: "xl" },
      tags: ["etiket", "badge", "aksiyon", "musteri"],
    },
  ],
  FormDrawer: [
    {
      id: "form-drawer-basic",
      title: "Temel Form Cekmecesi",
      description: "Yeni kayit olusturmak icin yan panel formu.",
      category: "form",
      code: `import { FormDrawer } from '@mfe/design-system';
import { Button, Input, Select } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Yeni Musteri Ekle</Button>
      <FormDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Musteri"
        subtitle="Musteri bilgilerini girerek kayit olusturun."
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>Iptal</Button>
            <Button variant="primary">Kaydet</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Ad Soyad" placeholder="Ahmet Yilmaz" />
          <Input label="E-posta" placeholder="ahmet@ornek.com" type="email" />
          <Input label="Telefon" placeholder="+90 555 000 0000" />
          <Select
            label="Musteri Tipi"
            placeholder="Secin"
            options={[
              { value: 'bireysel', label: 'Bireysel' },
              { value: 'kurumsal', label: 'Kurumsal' },
            ]}
          />
        </div>
      </FormDrawer>
    </>
  );
}`,
      previewProps: { open: true },
      tags: ["form", "cekmece", "olustur", "create"],
    },
    {
      id: "form-drawer-loading",
      title: "Yukleme Durumlu Form Cekmecesi",
      description: "Kayit islemi sirasinda yukleme gostergesi iceren form cekmecesi.",
      category: "advanced",
      code: `import { FormDrawer } from '@mfe/design-system';
import { Button, Input, Textarea } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Destek Talebi Olustur</Button>
      <FormDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Destek Talebi"
        loading={loading}
        placement="right"
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
              Iptal
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={loading}>
              Gonder
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Konu" placeholder="Sorunuzu kisaca tanimlayiniz" />
          <Textarea label="Aciklama" placeholder="Detayli bilgi giriniz..." rows={5} />
        </div>
      </FormDrawer>
    </>
  );
}`,
      previewProps: { open: true, loading: true },
      tags: ["loading", "yukleme", "async", "destek"],
    },
  ],
  DetailSummary: [
    {
      id: "detail-summary-basic",
      title: "Temel Detay Ozeti",
      description: "Baslik, metrikler, varlık ozeti ve detay alanlarini bir araya getiren tam detay sayfasi.",
      category: "patterns",
      code: `import { DetailSummary } from '@mfe/design-system';

export function Example() {
  return (
    <DetailSummary
      eyebrow="Siparisler / #ORD-2024-1847"
      title="Siparis Detayi"
      description="12 Aralik 2024 tarihli musteri siparisi."
      actions={<button className="px-4 py-2 bg-action-primary text-text-inverse rounded-lg text-sm">Duzenle</button>}
      summaryItems={[
        { key: 'toplam', label: 'Toplam Tutar', value: '₺86.597' },
        { key: 'kalem', label: 'Kalem Sayisi', value: '3' },
        { key: 'durum', label: 'Siparis Durumu', value: 'Hazirlaniyor' },
        { key: 'tarih', label: 'Siparis Tarihi', value: '12.12.2024' },
      ]}
      entity={{
        title: 'Ahmet Yilmaz',
        subtitle: 'Premium musteri — Istanbul',
        items: [
          { label: 'E-posta', value: 'ahmet@ornek.com' },
          { label: 'Telefon', value: '+90 555 123 4567' },
        ],
      }}
      detailItems={[
        { label: 'Odeme Yontemi', value: 'Kredi Karti' },
        { label: 'Kargo Firmasi', value: 'Yurtici Kargo' },
        { label: 'Fatura Durumu', value: 'Kesildi' },
        { label: 'Teslimat Adresi', value: 'Kadikoy, Istanbul' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["detay", "ozet", "siparis", "varlık"],
    },
    {
      id: "detail-summary-with-json",
      title: "JSON Goruntuleyicili Detay Ozeti",
      description: "Debug ve denetim icin JSON payload iceren detay ozeti.",
      category: "advanced",
      code: `import { DetailSummary } from '@mfe/design-system';

export function Example() {
  return (
    <DetailSummary
      eyebrow="API Loglari / req-8842"
      title="API Istek Detayi"
      description="Gelen webhook istek verisi ve islem sonucu."
      entity={{
        title: 'POST /api/webhooks/payment',
        subtitle: 'Basarili — 200 OK — 145ms',
        items: [
          { label: 'Kaynak', value: 'Stripe' },
          { label: 'Olay Tipi', value: 'payment_intent.succeeded' },
        ],
      }}
      detailItems={[
        { label: 'Istek ID', value: 'req-8842' },
        { label: 'Zaman Damgasi', value: '2024-12-12T14:32:00Z' },
        { label: 'IP Adresi', value: '54.23.112.88' },
        { label: 'Islem Suresi', value: '145ms' },
      ]}
      jsonValue={{
        id: 'pi_3Qf8sK2eZvKYlo2C1',
        amount: 8659700,
        currency: 'try',
        status: 'succeeded',
        metadata: { orderId: 'ORD-2024-1847' },
      }}
      jsonTitle="Webhook Payload"
      jsonDescription="Stripe tarafindan gonderilen ham istek verisi."
    />
  );
}`,
      previewProps: {},
      tags: ["json", "api", "debug", "denetim", "webhook"],
    },
  ],
  NavigationRail: [
    {
      id: "nav-rail-basic",
      title: "Temel Navigasyon Raylisi",
      description: "Ikonlar ve etiketler iceren dikey navigasyon paneli.",
      category: "basic",
      code: `import { NavigationRail } from '@mfe/design-system';
import { Home, Users, ShoppingCart, Settings, BarChart3 } from 'lucide-react';

export function Example() {
  return (
    <NavigationRail
      items={[
        { value: 'anasayfa', label: 'Ana Sayfa', icon: <Home className="h-5 w-5" /> },
        { value: 'musteriler', label: 'Musteriler', icon: <Users className="h-5 w-5" /> },
        { value: 'siparisler', label: 'Siparisler', icon: <ShoppingCart className="h-5 w-5" />, badge: '12' },
        { value: 'raporlar', label: 'Raporlar', icon: <BarChart3 className="h-5 w-5" /> },
        { value: 'ayarlar', label: 'Ayarlar', icon: <Settings className="h-5 w-5" /> },
      ]}
      defaultValue="anasayfa"
      onValueChange={(v) => console.log('Secilen:', v)}
    />
  );
}`,
      previewProps: {},
      tags: ["navigasyon", "menu", "dikey", "rail"],
    },
    {
      id: "nav-rail-compact",
      title: "Kompakt Navigasyon Raylisi",
      description: "Sadece ikonlar gosteren dar navigasyon paneli.",
      category: "layout",
      code: `import { NavigationRail, createNavigationRailPreset } from '@mfe/design-system';
import { LayoutDashboard, Bell, MessageSquare, Cog } from 'lucide-react';

export function Example() {
  const preset = createNavigationRailPreset('compact_utility');

  return (
    <NavigationRail
      {...preset}
      items={[
        { value: 'panel', label: 'Panel', icon: <LayoutDashboard className="h-5 w-5" /> },
        { value: 'bildirimler', label: 'Bildirimler', icon: <Bell className="h-5 w-5" />, badge: '3' },
        { value: 'mesajlar', label: 'Mesajlar', icon: <MessageSquare className="h-5 w-5" /> },
        { value: 'ayarlar', label: 'Ayarlar', icon: <Cog className="h-5 w-5" /> },
      ]}
      defaultValue="panel"
    />
  );
}`,
      previewProps: {},
      tags: ["kompakt", "compact", "ikon", "utility"],
    },
    {
      id: "nav-rail-with-footer",
      title: "Footer Alani ile Navigasyon",
      description: "Alt kisimda kullanici profili veya ek aksiyonlar iceren navigasyon raylisi.",
      category: "patterns",
      code: `import { NavigationRail, createNavigationRailPreset } from '@mfe/design-system';
import { Home, FileText, Users, BarChart3, LogOut } from 'lucide-react';

export function Example() {
  const preset = createNavigationRailPreset('ops_side_nav');

  return (
    <NavigationRail
      {...preset}
      items={[
        { value: 'dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
        { value: 'belgeler', label: 'Belgeler', icon: <FileText className="h-5 w-5" />, description: '24 yeni belge' },
        { value: 'ekip', label: 'Ekip', icon: <Users className="h-5 w-5" />, description: '8 aktif uye' },
        { value: 'analitik', label: 'Analitik', icon: <BarChart3 className="h-5 w-5" /> },
      ]}
      defaultValue="dashboard"
      footer={
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm text-text-subtle hover:bg-surface-muted transition-colors">
          <LogOut className="h-4 w-4" />
          <span>Cikis Yap</span>
        </button>
      }
    />
  );
}`,
      previewProps: {},
      tags: ["footer", "profil", "cikis", "ops"],
    },
  ],
  TextInput: [
    {
      id: "textinput-basic",
      title: "Temel Metin Girişi",
      description: "Label, açıklama ve varsayılan boyutla basit metin girişi.",
      category: "form",
      code: `import { TextInput } from '@mfe/design-system';

export function Example() {
  return (
    <TextInput
      label="Ad Soyad"
      description="Kimliğinizdeki tam adınızı giriniz."
      placeholder="Örn: Ahmet Yılmaz"
    />
  );
}`,
      previewProps: {},
      tags: ["form", "text", "label", "input"],
    },
    {
      id: "textinput-validation",
      title: "Doğrulama Durumları",
      description: "Hata ve ipucu metinli doğrulama senaryoları.",
      category: "form",
      code: `import { TextInput } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <TextInput
        label="E-posta"
        hint="Kurumsal e-posta adresinizi giriniz."
        placeholder="ornek@sirket.com"
      />
      <TextInput
        label="E-posta"
        error="Geçersiz e-posta formatı."
        invalid
        defaultValue="hatali-adres"
      />
    </div>
  );
}`,
      previewProps: {},
      tags: ["validation", "error", "hint"],
    },
    {
      id: "textinput-sizes",
      title: "Boyut Skalası",
      description: "Küçük, orta ve büyük boyut varyantları.",
      category: "basic",
      code: `import { TextInput } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <TextInput size="sm" label="Küçük" placeholder="sm boyut" />
      <TextInput size="md" label="Orta" placeholder="md boyut" />
      <TextInput size="lg" label="Büyük" placeholder="lg boyut" />
    </div>
  );
}`,
      previewProps: { size: "md" },
      multiVariantAxis: "size",
      tags: ["size", "sm", "md", "lg"],
    },
    {
      id: "textinput-slots",
      title: "Slot Görselleri",
      description: "Ön ve arka görsel slotları ile zengin metin girişi.",
      category: "advanced",
      code: `import { TextInput } from '@mfe/design-system';
import { Search, Mail } from 'lucide-react';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <TextInput
        label="Arama"
        leadingVisual={<Search className="h-4 w-4" />}
        placeholder="Ara..."
      />
      <TextInput
        label="E-posta"
        leadingVisual={<Mail className="h-4 w-4" />}
        trailingVisual={<span className="text-xs text-text-disabled">@sirket.com</span>}
        placeholder="kullanici"
      />
    </div>
  );
}`,
      previewProps: {},
      tags: ["icon", "slot", "leading", "trailing"],
    },
  ],
  TextArea: [
    {
      id: "textarea-basic",
      title: "Temel Metin Alanı",
      description: "Çok satırlı metin girişi ve label desteği.",
      category: "form",
      code: `import { TextArea } from '@mfe/design-system';

export function Example() {
  return (
    <TextArea
      label="Açıklama"
      description="Detaylı açıklama giriniz."
      placeholder="Açıklamanızı buraya yazın..."
      rows={4}
    />
  );
}`,
      previewProps: {},
      tags: ["form", "multiline", "textarea"],
    },
    {
      id: "textarea-count",
      title: "Karakter Sayacı",
      description: "Maksimum karakter limiti ve sayaç gösterimi.",
      category: "form",
      code: `import { TextArea } from '@mfe/design-system';

export function Example() {
  return (
    <TextArea
      label="Not"
      showCount
      maxLength={200}
      placeholder="Notunuzu giriniz (maks. 200 karakter)"
      rows={3}
    />
  );
}`,
      previewProps: { showCount: true },
      tags: ["count", "maxlength", "limit"],
    },
    {
      id: "textarea-resize",
      title: "Boyutlandırma Modları",
      description: "Auto-resize, dikey ve sabit boyutlandırma modları.",
      category: "advanced",
      code: `import { TextArea } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <TextArea label="Otomatik" resize="auto" placeholder="İçerikle büyür..." rows={2} />
      <TextArea label="Dikey" resize="vertical" placeholder="Dikey boyutlandırma" rows={3} />
      <TextArea label="Sabit" resize="none" placeholder="Boyutlandırma yok" rows={3} />
    </div>
  );
}`,
      previewProps: {},
      tags: ["resize", "auto", "vertical"],
    },
  ],
  TimePicker: [
    {
      id: "timepicker-basic",
      title: "Temel Saat Seçici",
      description: "Label ve açıklama ile basit saat seçimi.",
      category: "form",
      code: `import { TimePicker } from '@mfe/design-system';

export function Example() {
  return (
    <TimePicker
      label="Başlangıç Saati"
      description="Toplantı başlangıç saatini seçin."
    />
  );
}`,
      previewProps: {},
      tags: ["form", "time", "picker"],
    },
    {
      id: "timepicker-range",
      title: "Saat Aralığı Kısıtı",
      description: "Minimum ve maksimum saat aralığı ile kısıtlı seçim.",
      category: "form",
      code: `import { TimePicker } from '@mfe/design-system';

export function Example() {
  return (
    <TimePicker
      label="Çalışma Saati"
      description="08:00 - 18:00 arası seçim yapılabilir."
      min="08:00"
      max="18:00"
      step={1800}
      defaultValue="09:00"
    />
  );
}`,
      previewProps: {},
      tags: ["range", "min", "max", "step"],
    },
    {
      id: "timepicker-states",
      title: "Erişim Durumları",
      description: "Salt okunur ve devre dışı erişim durumları.",
      category: "form",
      code: `import { TimePicker } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <TimePicker label="Aktif" defaultValue="14:30" />
      <TimePicker label="Salt Okunur" defaultValue="14:30" access="readonly" />
      <TimePicker label="Devre Dışı" defaultValue="14:30" disabled />
    </div>
  );
}`,
      previewProps: {},
      tags: ["readonly", "disabled", "access"],
    },
  ],
  Upload: [
    {
      id: "upload-basic",
      title: "Temel Dosya Yükleme",
      description: "Tekli dosya seçimi ile basit yükleme alanı.",
      category: "form",
      code: `import { Upload } from '@mfe/design-system';

export function Example() {
  return (
    <Upload
      label="Belge Yükle"
      description="PDF veya Word formatında belge yükleyin."
      accept=".pdf,.docx"
    />
  );
}`,
      previewProps: {},
      tags: ["form", "file", "upload"],
    },
    {
      id: "upload-multiple",
      title: "Çoklu Dosya Yükleme",
      description: "Birden fazla dosya seçimi ve dosya limiti.",
      category: "form",
      code: `import { Upload } from '@mfe/design-system';

export function Example() {
  return (
    <Upload
      label="Kanıt Paketleri"
      description="Maksimum 5 dosya yükleyebilirsiniz."
      multiple
      maxFiles={5}
      accept="image/*,.pdf"
    />
  );
}`,
      previewProps: { multiple: true },
      tags: ["multiple", "maxfiles", "limit"],
    },
    {
      id: "upload-sizes",
      title: "Boyut Varyantları",
      description: "Küçük, orta ve büyük yükleme alanı boyutları.",
      category: "basic",
      code: `import { Upload } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <Upload size="sm" label="Küçük" />
      <Upload size="md" label="Orta" />
      <Upload size="lg" label="Büyük" />
    </div>
  );
}`,
      previewProps: { size: "md" },
      multiVariantAxis: "size",
      tags: ["size", "sm", "md", "lg"],
    },
  ],};
