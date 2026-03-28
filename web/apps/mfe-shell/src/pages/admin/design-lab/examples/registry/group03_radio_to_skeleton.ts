import type { ExampleEntry } from './types';

export const examples: Record<string, ExampleEntry[]> = {
  Radio: [
    {
      id: "radio-basic",
      title: "Temel Kullanim",
      description: "RadioGroup ile kontrol edilen temel radio button grubu.",
      category: "basic",
      code: `import { Radio, RadioGroup } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [value, setValue] = useState('email');

  return (
    <RadioGroup name="iletisim" value={value} onChange={setValue}>
      <Radio value="email" label="E-posta" />
      <Radio value="sms" label="SMS" />
      <Radio value="push" label="Push Bildirim" />
    </RadioGroup>
  );
}`,
      tags: ["radio", "secim", "form"],
    },
    {
      id: "radio-with-description",
      title: "Aciklamali Radio",
      description: "Her secenegin altinda aciklama metni bulunan radio grubu.",
      category: "form",
      code: `import { Radio, RadioGroup } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [plan, setPlan] = useState('starter');

  return (
    <RadioGroup name="plan" value={plan} onChange={setPlan}>
      <Radio
        value="starter"
        label="Baslangic"
        description="5 kullanici, 10 GB depolama"
      />
      <Radio
        value="pro"
        label="Profesyonel"
        description="25 kullanici, 100 GB depolama"
      />
      <Radio
        value="enterprise"
        label="Kurumsal"
        description="Sinirsiz kullanici ve depolama"
      />
    </RadioGroup>
  );
}`,
      tags: ["aciklama", "description", "plan", "form"],
    },
    {
      id: "radio-horizontal",
      title: "Yatay Yerlesim",
      description: "Yatay yonde siralanan radio button grubu.",
      category: "layout",
      code: `import { Radio, RadioGroup } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [size, setSize] = useState('md');

  return (
    <RadioGroup name="boyut" value={size} onChange={setSize} direction="horizontal">
      <Radio value="sm" label="Kucuk" />
      <Radio value="md" label="Orta" />
      <Radio value="lg" label="Buyuk" />
    </RadioGroup>
  );
}`,
      tags: ["yatay", "horizontal", "layout"],
    },
  ],
  Switch: [
    {
      id: "switch-basic",
      title: "Temel Kullanim",
      description: "Acik/kapali durumu gosteren temel switch bileseni.",
      category: "basic",
      code: `import { Switch } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      label="Bildirimleri etkinlestir"
      checked={enabled}
      onCheckedChange={setEnabled}
    />
  );
}`,
      tags: ["switch", "toggle", "acik-kapali"],
    },
    {
      id: "switch-with-description",
      title: "Aciklamali Switch",
      description: "Etiket ve altinda aciklama metni bulunan switch.",
      category: "form",
      code: `import { Switch } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [darkMode, setDarkMode] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <Switch
        label="Karanlik Mod"
        description="Arayuz renklerini koyu temaya cevirir."
        checked={darkMode}
        onCheckedChange={setDarkMode}
      />
      <Switch
        label="Analitik Verileri"
        description="Kullanim verilerini anonim olarak toplar."
        checked={analytics}
        onCheckedChange={setAnalytics}
      />
    </div>
  );
}`,
      tags: ["aciklama", "description", "ayarlar", "form"],
    },
    {
      id: "switch-sizes",
      title: "Boyut Secenekleri",
      description: "Kucuk, orta ve buyuk switch boyutlari.",
      category: "basic",
      code: `import { Switch } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Switch label="Kucuk" switchSize="sm" checked />
      <Switch label="Orta" switchSize="md" checked />
      <Switch label="Buyuk" switchSize="lg" checked />
    </div>
  );
}`,
      previewProps: { switchSize: "md" },
      multiVariantAxis: "switchSize",
      tags: ["boyut", "size"],
    },
  ],
  Divider: [
    {
      id: "divider-basic",
      title: "Temel Kullanim",
      description: "Icerik bloklari arasinda yatay ayirici cizgi.",
      category: "basic",
      code: `import { Divider } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <p>Birinci bolum icerigi</p>
      <Divider />
      <p>Ikinci bolum icerigi</p>
    </div>
  );
}`,
      tags: ["divider", "ayirici", "cizgi"],
    },
    {
      id: "divider-with-label",
      title: "Etiketli Ayirici",
      description: "Ortasinda metin etiketi bulunan ayirici cizgi.",
      category: "layout",
      code: `import { Divider } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <p>Kayit formu</p>
      <Divider label="veya" />
      <button>Google ile devam et</button>
    </div>
  );
}`,
      tags: ["etiket", "label", "veya", "or"],
    },
    {
      id: "divider-vertical",
      title: "Dikey Ayirici",
      description: "Yan yana elemanlari ayirmak icin dikey cizgi.",
      category: "layout",
      code: `import { Divider } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center h-8 gap-0">
      <span className="text-sm">Ana Sayfa</span>
      <Divider orientation="vertical" spacing="md" />
      <span className="text-sm">Hakkimizda</span>
      <Divider orientation="vertical" spacing="md" />
      <span className="text-sm">Iletisim</span>
    </div>
  );
}`,
      tags: ["dikey", "vertical", "navigasyon"],
    },
  ],
  Tooltip: [
    {
      id: "tooltip-basic",
      title: "Temel Kullanim",
      description: "Bir elemanin uzerine gelindiginde bilgi gosteren tooltip.",
      category: "basic",
      code: `import { Tooltip, Button } from '@mfe/design-system';

export function Example() {
  return (
    <Tooltip content="Bu islemi geri alamazsiniz">
      <Button variant="ghost">Sil</Button>
    </Tooltip>
  );
}`,
      tags: ["tooltip", "ipucu", "hover"],
    },
    {
      id: "tooltip-placements",
      title: "Konum Secenekleri",
      description: "Tooltiplerin ust, alt, sol ve sag konumlarda gosterimi.",
      category: "basic",
      code: `import { Tooltip, Button } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-4 p-8">
      <Tooltip content="Ust" placement="top">
        <Button variant="ghost">Ust</Button>
      </Tooltip>
      <Tooltip content="Alt" placement="bottom">
        <Button variant="ghost">Alt</Button>
      </Tooltip>
      <Tooltip content="Sol" placement="left">
        <Button variant="ghost">Sol</Button>
      </Tooltip>
      <Tooltip content="Sag" placement="right">
        <Button variant="ghost">Sag</Button>
      </Tooltip>
    </div>
  );
}`,
      tags: ["konum", "placement", "yon"],
    },
    {
      id: "tooltip-advanced",
      title: "Gecikme ve Ok Isaretli",
      description: "Ozel gecikme suresi ve ok isareti ile tooltip.",
      category: "advanced",
      code: `import { Tooltip } from '@mfe/design-system';
import { Info } from 'lucide-react';

export function Example() {
  return (
    <Tooltip
      content="Detayli bilgi icin dokumantasyona bakiniz."
      placement="right"
      showArrow
      openDelay={500}
    >
      <Info className="h-4 w-4 text-[var(--text-secondary)] cursor-help" />
    </Tooltip>
  );
}`,
      tags: ["ok", "arrow", "gecikme", "delay"],
    },
  ],
  Text: [
    {
      id: "text-basic",
      title: "Temel Kullanim",
      description: "Farkli boyut ve renk varyantlari ile metin bileseni.",
      category: "basic",
      code: `import { Text } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-2">
      <Text as="h2" size="2xl" weight="bold">Baslik Metni</Text>
      <Text variant="secondary">Ikincil aciklama metni burada yer alir.</Text>
      <Text variant="muted" size="sm">Soluk yardimci metin.</Text>
    </div>
  );
}`,
      tags: ["text", "metin", "tipografi"],
    },
    {
      id: "text-variants",
      title: "Renk Varyantlari",
      description: "Durum belirten farkli renk varyantlarinda metin.",
      category: "basic",
      code: `import { Text } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-1">
      <Text variant="default">Varsayilan metin</Text>
      <Text variant="secondary">Ikincil metin</Text>
      <Text variant="success">Basarili islem mesaji</Text>
      <Text variant="warning">Uyari mesaji</Text>
      <Text variant="error">Hata mesaji</Text>
      <Text variant="info">Bilgilendirme mesaji</Text>
    </div>
  );
}`,
      previewProps: { variant: "default" },
      multiVariantAxis: "variant",
      tags: ["renk", "varyant", "durum"],
    },
    {
      id: "text-truncate",
      title: "Metin Kisaltma",
      description: "Uzun metinleri tek satir veya belirli satir sayisinda kisaltma.",
      category: "advanced",
      code: `import { Text } from '@mfe/design-system';

export function Example() {
  const longText = "Bu cok uzun bir metin ornegi olup tasma durumunda nasil kisaltildigini gosterir.";

  return (
    <div className="flex flex-col gap-3 max-w-xs">
      <Text truncate>{longText}</Text>
      <Text lineClamp={2} as="p">
        {longText} {longText}
      </Text>
    </div>
  );
}`,
      tags: ["truncate", "kisaltma", "line-clamp", "overflow"],
    },
    {
      id: "text-polymorphic",
      title: "Polimorfik Kullanim",
      description: "Farkli HTML elementleri olarak render edilen text bileseni.",
      category: "advanced",
      code: `import { Text } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-2">
      <Text as="h1" size="3xl" weight="bold">Ana Baslik</Text>
      <Text as="p" size="base">Paragraf icerigi</Text>
      <Text as="code" mono size="sm" variant="secondary">
        const x = 42;
      </Text>
      <Text as="blockquote" variant="muted" size="sm">
        Alinti metin ornegi
      </Text>
    </div>
  );
}`,
      tags: ["polimorfik", "as", "html", "element"],
    },
  ],
  Dropdown: [
    {
      id: "dropdown-basic",
      title: "Temel Kullanim",
      description: "Basit menu ogelerinden olusan temel dropdown.",
      category: "basic",
      code: `import { Dropdown, Button } from '@mfe/design-system';

export function Example() {
  return (
    <Dropdown
      items={[
        { key: 'edit', label: 'Duzenle', onClick: () => console.log('duzenle') },
        { key: 'copy', label: 'Kopyala', onClick: () => console.log('kopyala') },
        { key: 'delete', label: 'Sil', danger: true, onClick: () => console.log('sil') },
      ]}
    >
      <Button variant="secondary">Islemler</Button>
    </Dropdown>
  );
}`,
      tags: ["dropdown", "menu", "islem"],
    },
    {
      id: "dropdown-with-icons",
      title: "Ikonlu Menu",
      description: "Her oge icin ikon ve aciklama iceren zengin dropdown.",
      category: "layout",
      code: `import { Dropdown, Button } from '@mfe/design-system';
import { Edit, Copy, Trash2, Download } from 'lucide-react';

export function Example() {
  return (
    <Dropdown
      items={[
        { key: 'edit', label: 'Duzenle', icon: <Edit />, description: 'Kaydi duzenle' },
        { key: 'copy', label: 'Kopyala', icon: <Copy />, description: 'Panoya kopyala' },
        { type: 'separator' },
        { key: 'export', label: 'Disa Aktar', icon: <Download /> },
        { key: 'delete', label: 'Sil', icon: <Trash2 />, danger: true },
      ]}
    >
      <Button variant="secondary">Detayli Menu</Button>
    </Dropdown>
  );
}`,
      tags: ["ikon", "icon", "separator", "aciklama"],
    },
    {
      id: "dropdown-grouped",
      title: "Gruplu Menu",
      description: "Etiket ve ayiricilarla bolumlendirilmis dropdown menusu.",
      category: "advanced",
      code: `import { Dropdown, IconButton } from '@mfe/design-system';
import { MoreVertical, Settings, Users, LogOut } from 'lucide-react';

export function Example() {
  return (
    <Dropdown
      placement="bottom-end"
      items={[
        { type: 'label', label: 'Hesap' },
        { key: 'settings', label: 'Ayarlar', icon: <Settings /> },
        { key: 'team', label: 'Takim Yonetimi', icon: <Users /> },
        { type: 'separator' },
        { key: 'logout', label: 'Cikis Yap', icon: <LogOut />, danger: true },
      ]}
    >
      <IconButton icon={<MoreVertical />} label="Daha fazla" variant="ghost" />
    </Dropdown>
  );
}`,
      tags: ["grup", "label", "ayirici", "placement"],
    },
  ],
  IconButton: [
    {
      id: "iconbutton-basic",
      title: "Temel Kullanim",
      description: "Farkli varyantlarda temel ikon buton kullanimi.",
      category: "basic",
      code: `import { IconButton } from '@mfe/design-system';
import { Plus, Settings, Trash2, Download } from 'lucide-react';

export function Example() {
  return (
    <div className="flex items-center gap-2">
      <IconButton icon={<Plus />} label="Ekle" variant="primary" />
      <IconButton icon={<Settings />} label="Ayarlar" variant="secondary" />
      <IconButton icon={<Download />} label="Indir" variant="outline" />
      <IconButton icon={<Trash2 />} label="Sil" variant="danger" />
    </div>
  );
}`,
      previewProps: { variant: "ghost" },
      multiVariantAxis: "variant",
      tags: ["iconbutton", "ikon", "varyant"],
    },
    {
      id: "iconbutton-sizes",
      title: "Boyut Secenekleri",
      description: "xs'ten lg'ye kadar tum ikon buton boyutlari.",
      category: "basic",
      code: `import { IconButton } from '@mfe/design-system';
import { Bell } from 'lucide-react';

export function Example() {
  return (
    <div className="flex items-end gap-2">
      <IconButton icon={<Bell />} label="Bildirim" size="xs" variant="outline" />
      <IconButton icon={<Bell />} label="Bildirim" size="sm" variant="outline" />
      <IconButton icon={<Bell />} label="Bildirim" size="md" variant="outline" />
      <IconButton icon={<Bell />} label="Bildirim" size="lg" variant="outline" />
    </div>
  );
}`,
      previewProps: { size: "md" },
      multiVariantAxis: "size",
      tags: ["boyut", "size"],
    },
    {
      id: "iconbutton-rounded",
      title: "Yuvarlak ve Yukleniyor",
      description: "Pill seklinde yuvarlak ikon buton ve yukleniyor durumu.",
      category: "advanced",
      code: `import { IconButton } from '@mfe/design-system';
import { Heart, Share2, Bookmark } from 'lucide-react';

export function Example() {
  return (
    <div className="flex items-center gap-2">
      <IconButton icon={<Heart />} label="Begeni" variant="primary" rounded-xs />
      <IconButton icon={<Share2 />} label="Paylas" variant="secondary" rounded-xs />
      <IconButton icon={<Bookmark />} label="Kaydediliyor" variant="outline" rounded-xs loading />
    </div>
  );
}`,
      tags: ["rounded", "pill", "loading", "yukleniyor"],
    },
  ],
  Popover: [
    {
      id: "popover-basic",
      title: "Temel Kullanim",
      description: "Tiklandiginda bilgi gosterilen temel popover.",
      category: "basic",
      code: `import { Popover, Button } from '@mfe/design-system';

export function Example() {
  return (
    <Popover
      trigger={<Button variant="secondary">Detaylar</Button>}
      title="Politika Detayi"
      content="Bu politika, otonom ajanlar icin guvenli calisma sinirlarini belirler."
    />
  );
}`,
      tags: ["popover", "bilgi", "overlay"],
    },
    {
      id: "popover-hover",
      title: "Hover Tetikleme",
      description: "Fare ile uzerine gelindiginde acilan popover.",
      category: "basic",
      code: `import { Popover } from '@mfe/design-system';
import { Info } from 'lucide-react';

export function Example() {
  return (
    <Popover
      trigger={<Info className="h-4 w-4 text-[var(--text-secondary)] cursor-help" />}
      content="Ek bilgi icin dokumantasyona basvurun."
      triggerMode="hover"
      side="right"
    />
  );
}`,
      tags: ["hover", "tetikleme", "bilgi"],
    },
    {
      id: "popover-placement",
      title: "Konum Secenekleri",
      description: "Farkli yon ve hizalama secenekleri ile popover.",
      category: "advanced",
      code: `import { Popover, Button } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-4 p-12">
      <Popover
        trigger={<Button variant="ghost" size="sm">Ust</Button>}
        content="Ustte gosterilen popover"
        side="top"
        align="center"
      />
      <Popover
        trigger={<Button variant="ghost" size="sm">Sag</Button>}
        content="Sagda gosterilen popover"
        side="right"
        align="start"
      />
      <Popover
        trigger={<Button variant="ghost" size="sm">Alt</Button>}
        content="Altta gosterilen popover"
        side="bottom"
        align="end"
      />
    </div>
  );
}`,
      tags: ["side", "align", "konum", "yon"],
    },
    {
      id: "popover-controlled",
      title: "Kontrollü Popover",
      description: "Dis state ile acilip kapanan kontrollü popover.",
      category: "form",
      code: `import { Popover, Button } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Popover
        trigger={<Button variant="secondary">Filtre</Button>}
        title="Filtre Secenekleri"
        content={
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" /> Aktif
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" /> Beklemede
            </label>
          </div>
        }
        open={open}
        onOpenChange={setOpen}
        showArrow={false}
      />
    </div>
  );
}`,
      tags: ["controlled", "kontrollü", "filtre", "form"],
    },
  ],
  Skeleton: [
    {
      id: "skeleton-basic",
      title: "Temel Kullanim",
      description: "Farkli boyut ve sekillerde temel skeleton yer tutucu.",
      category: "basic",
      code: `import { Skeleton } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton width="60%" height={20} />
      <Skeleton width="100%" height={14} />
      <Skeleton width="80%" height={14} />
    </div>
  );
}`,
      tags: ["skeleton", "placeholder", "yer-tutucu"],
    },
    {
      id: "skeleton-lines",
      title: "Coklu Satir",
      description: "Paragraf icerigini temsil eden coklu satir skeleton.",
      category: "basic",
      code: `import { Skeleton } from '@mfe/design-system';

export function Example() {
  return <Skeleton lines={4} height={14} />;
}`,
      tags: ["lines", "satir", "paragraf"],
    },
    {
      id: "skeleton-card",
      title: "Kart Yukleme Durumu",
      description: "Bir kart bileseninin yukleme durumunu gosteren skeleton deseni.",
      category: "patterns",
      code: `import { Skeleton, Card } from '@mfe/design-system';

export function Example() {
  return (
    <Card padding="md" variant="elevated">
      <div className="flex items-center gap-3">
        <Skeleton circle height={40} />
        <div className="flex flex-col flex-1 gap-2">
          <Skeleton width="50%" height={16} />
          <Skeleton width="30%" height={12} />
        </div>
      </div>
      <div className="mt-4">
        <Skeleton lines={3} height={14} />
      </div>
    </Card>
  );
}`,
      tags: ["kart", "card", "yukleme", "pattern"],
    },
  ],};
