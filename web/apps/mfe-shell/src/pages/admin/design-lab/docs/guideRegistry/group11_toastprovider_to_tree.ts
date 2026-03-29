import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  ToastProvider: {
    componentName: "ToastProvider",
    summary: "ToastProvider, uygulama genelinde gecici bildirim (toast) gosterimi icin Context tabanli provider ve useToast hook'u sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ToastProvider, React Context API uzerinde calisan bir toast bildirim sistemidir. Uygulamayi \`<ToastProvider>\` ile sararsiniz, ardindan herhangi bir bilesenede \`useToast()\` hook'u ile \`info\`, \`success\`, \`warning\`, \`error\` toast'lari tetiklersiniz.

\`\`\`tsx
import { ToastProvider, useToast } from '@mfe/design-system';

// Uygulamanin kok seviyesinde
<ToastProvider position="top-right" duration={4000} maxVisible={5}>
  <App />
</ToastProvider>

// Herhangi bir bilesenede
function SaveButton() {
  const toast = useToast();
  return (
    <button onClick={() => toast.success("Kaydedildi!", { title: "Basarili" })}>
      Kaydet
    </button>
  );
}
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Kullaniciya anlik geri bildirim vermek istediginde (kaydetme, silme, hata)
- Gecici ve otomatik kaybolan bildirimler icin
- Form gonderimi, API cagrilari veya islem sonuclari icin

**Kullanmayin:**
- Kalici bildirim listesi icin — \`NotificationPanel\` kullanin
- Kullanicinin aksiyon almasi gereken durumlar icin — \`Dialog\` veya \`Alert\` kullanin
- Uzun icerikli bildirimler icin — \`NotificationDrawer\` kullanin
- Sayfa ici uyari mesajlari icin — \`Banner\` veya \`Callout\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
                        ┌──────────────────────┐
                        │ ● Baslik (opsiyonel)  │
                        │   Mesaj metni     [×] │
                        ├──────────────────────┤
                        │ ● Basarili!           │
                        │   Kayit olusturuldu[×]│
                        └──────────────────────┘
\`\`\`

1. **ToastProvider** — Context saglayici; position, duration, maxVisible yapilandirir
2. **Toast Container** — Fixed pozisyonlu, z-[1700] katmaninda toast yigini
3. **ToastItem** — Tek bir toast karti; variant renk gostergesi, baslik, mesaj ve kapat butonu
4. **Renk Gostergesi** — Kucuk yuvarlak nokta ile variant turunu (info/success/warning/error) belirtir
5. **Kapat Butonu** — Kullanici toastu manuel kapatabilir
6. **Auto-dismiss Timer** — \`duration\` ms sonra otomatik kaybolur`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`ToastProvider\`'i kok seviyede sarin.** Tum bilesenler \`useToast()\` erisebilsin.

**\`duration\` suresini isleme gore ayarlayin.** Basarili islemler icin 3-4 saniye, hata mesajlari icin daha uzun sureler (6-8 saniye) kullanin.

**\`title\` ile baglamsal baslik ekleyin.** Sadece mesaj degil, baslik ile toast'un onemini belirtin.

**\`maxVisible\` ile yigin sinirlayin.** Varsayilan 5; cok fazla toast ekranda gorsel kirliligi olusturur.

**\`position\` ile uygun konum secin.** Sag ust (\`top-right\`) en yaygin kaliptir; form alanlarinin uzerini kapatmamaya dikkat edin.

**Dogru variant kullanin.** \`success\` basarili islemler, \`error\` hatalar, \`warning\` uyarilar, \`info\` genel bilgilendirme icin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ \`ToastProvider\` olmadan \`useToast()\` cagirmak**
Context bulunmazsa hata firlatilir. Provider'i kok seviyede tanimlayın.

**❌ Kritik hatalari sadece toast ile gostermek**
Toast gecici ve kaybolur; kritik hatalar icin kalici UI ogeleri (Alert, Banner) kullanin.

**❌ Cok kisa duration ile onemli mesajlar gostermek**
Kullanici mesaji okuyamadan kaybolur. En az 3 saniye verin.

**❌ Her API cagrisindan sonra toast gostermek**
Toast spam'i kullaniciyi bunaltir. Sadece anlamli sonuclari bildirin.

**❌ Uzun metin icerikli toast kullanmak**
Toast kompakt olmalidir; detayli bilgi icin baska bilesen tercih edin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Canli Bolge:** Toast konteyneri \`aria-live="polite"\` ile isaretlenir. Yeni toast'lar ekran okuyuculara otomatik duyurulur.

**Role:** Her toast \`role="alert"\` tasir ve acil bildirim olarak islenir.

**Kapat Butonu:** \`aria-label="Dismiss"\` ile erisilebilir sekilde isaretlenir.

**Animasyon:** \`slide-in-from-right-full\` ve \`fade-in\` animasyonlari ile gorsel geris.

**Z-index:** \`z-[1700]\` ile diger UI ogelerinin ustunde kalir; modal ve drawer catismalarini onler.`,
      },
    ],
    relatedComponents: ["NotificationDrawer", "NotificationPanel", "NotificationItemCard"],
  },

  TourCoachmarks: {
    componentName: "TourCoachmarks",
    summary: "TourCoachmarks, adim adim rehberlik turu sunan onboarding bilesenidir. Kontrolllu/kontrolsuz adim yonetimi, ilerleme gostergesi ve guided/readonly modlari destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TourCoachmarks, kullaniciyi adim adim yonlendiren bir tur/onboarding bilesenidir. Her adim baslik, aciklama ve opsiyonel meta bilgisi icerr. Ileri/geri navigasyon, atlama, ilerleme gostergesi ve klavye destegi saglar.

\`\`\`tsx
import { TourCoachmarks } from '@mfe/design-system';

<TourCoachmarks
  steps={[
    { id: "welcome", title: "Hosgeldiniz", description: "Bu tur size uygulamayi tanitacak." },
    { id: "dashboard", title: "Dashboard", description: "Ana metrikleri buradan takip edin.", tone: "info" },
    { id: "settings", title: "Ayarlar", description: "Tercihlerinizi buradan yapilandirin.", meta: "Son adim", tone: "success" },
  ]}
  open={tourOpen}
  onClose={() => setTourOpen(false)}
  onFinish={handleTourComplete}
  showProgress
  allowSkip
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Yeni kullanici onboarding akislari icin
- Karmasik ozellik tanitimlarinda adim adim rehberlik vermek icin
- Urun ici egitim turlari olusturmak icin
- Ozellik guncellemelerini kullaniciya tanitmak icin

**Kullanmayin:**
- Tooltip veya popover ile kucuk ipucu gostermek icin — \`Tooltip\` kullanin
- Uzun form sihirbazlari icin — \`Stepper\` veya \`Wizard\` kullanin
- Kalici yardim icerigi icin — dokumantasyon sayfasi olusturun`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌───────────────────────────────────────┐
│ ▔▔▔▔▔▔▔▔▔▔ (gradient bar)            │
│ GUIDED TOUR              2 / 3       │
│ Dashboard                             │
│                                       │
│ Ana metrikleri buradan takip edin.    │
│ [info badge]                          │
│                                       │
│ [1. welcome] [2. dashboard] [3. ayar] │
│                                       │
│ [Atla] [Geri]          [Sonraki Adim] │
└───────────────────────────────────────┘
\`\`\`

1. **Gradient Bar** — Ust kenarda renkli cizgi ile gorsel vurgu
2. **Tur Basligi** — Genel tur adi (ozellestirilebilir)
3. **Adim Basligi** — Aktif adimin basligi
4. **Aciklama** — Adim detay metni
5. **Meta Badge** (opsiyonel) — Adim hakkinda ek bilgi; \`tone\` ile renk degisir
6. **Adim Navigasyonu** — Tum adimlari gosteren tiklanabilir grid
7. **Ilerleme Gostergesi** — "2 / 3" formatinda suanki adim
8. **Aksiyon Butonlari** — Atla, Geri, Sonraki Adim, Bitir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`allowSkip={true}\` ile atlama izni verin.** Kullanicilar turu zorunlu hissetmemeli; istedikleri zaman cikaabilsinler.

**\`showProgress\` ile ilerlemeyi gosterin.** Kullanicilar kac adim kaldigini bilmek ister.

**Adim sayisini sinirli tutun.** 3-7 adim idealdir; cok uzun turlar terk edilir.

**\`onFinish\` ile turu tamamlanmis olarak isaretleyin.** Kullaniciya tekrar gosterilmemesi icin tamamlanma durumunu kaydedin.

**\`tone\` ile gorsel ipucu verin.** Onemli adimlarda \`warning\`, basarili sonuclarda \`success\` kullanin.

**\`mode="readonly"\` ile sadece goruntuleme sunun.** Turun tekrar incelenmesi icin readonly mod kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Turu atlanamaz yapmak**
\`allowSkip={false}\` ile kullaniciyi zorlamak kotu deneyim yaratir.

**❌ 10+ adimlik turlar olusturmak**
Uzun turlar kullaniciyi bunaltir ve terk oranini arttirir. Bolumleyin.

**❌ Kontrolllu \`currentStep\` ile \`onStepChange\` sagamamak**
Adim degisiklikleri calismaz; her ikisini birlikte kullanin.

**❌ Turu her sayfa yuklenisinde tekrar gostermek**
Tamamlanma durumunu persist edin; kullaniciyi tekrar zorlamamayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Dialog Semantigi:** Tur paneli \`role="dialog"\` ve \`aria-labelledby\` / \`aria-describedby\` ile isaretlenir.

**Klavye Destegi:** Escape tusu ile tur kapatilir. Butonlar Tab ile erisilebilinir. Enter/Space ile etkinlestirilir.

**Adim Navigasyonu:** Her adim butonu \`aria-current="step"\` ile aktif durumu belirtir.

**Erisim Kontrolu:** \`access\` prop'u ile tum etkisimler kontrol edilir. Readonly modda adim butonlari tiklanamaz olur.

**Focus Yonetimi:** Tur acildiginda panel icine focus atanir.`,
      },
    ],
    relatedComponents: ["Button", "Tooltip"],
  },

  JsonViewer: {
    componentName: "JsonViewer",
    summary: "JsonViewer, JSON verisini tip badge'leri ve genisletilebilir agac yapisiyla interaktif olarak goruntuleyen premium bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `JsonViewer, herhangi bir JSON degerini hiyerarsik agac yapisiyla goruntuleyen interaktif bilesendir. Her dugum tip badge'i (null, array, object, boolean, number, string) tasir, genisletilebilir/daraltilabilir ve varsayilan derinlik kontrol edilebilir.

\`\`\`tsx
import { JsonViewer } from '@mfe/design-system';

<JsonViewer
  value={{
    kullanici: { ad: "Ahmet", yas: 28, aktif: true },
    roller: ["admin", "editor"],
    metadata: null,
  }}
  title="API Yaniti"
  description="Son istek sonucu"
  rootLabel="response"
  defaultExpandedDepth={2}
  showTypes
  maxHeight={500}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- API yanitlarini veya JSON payload'larini goruntulelemek icin
- Debug araclari ve gelistirici panellerinde veri inceleme icin
- Yapilandirma dosyalarini veya meta verileri gostermek icin
- Karmasik nesne yapilarini kullaniciya sunmak icin

**Kullanmayin:**
- JSON duzenleme/editleme icin — JSON editor bileseni kullanin
- Tablolar halinde gosterilecek duz listeler icin — \`DataTable\` kullanin
- Log kayitlari icin — terminal veya log bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  API Yaniti
  Son istek sonucu

┌──────────────────────────────────────┐
│ ▾ response              [object]     │
│   {3 key}                            │
│   ┌─────────────────────────────┐    │
│   │ ▾ kullanici       [object]  │    │
│   │   ┌──────────────────────┐  │    │
│   │   │ ad           [string]│  │    │
│   │   │ "Ahmet"              │  │    │
│   │   └──────────────────────┘  │    │
│   │ ▸ roller          [array]   │    │
│   │ metadata           [null]   │    │
│   └─────────────────────────────┘    │
└──────────────────────────────────────┘
\`\`\`

1. **Baslik ve Aciklama** (opsiyonel) — Ustunde goruntulenen baslik ve aciklama metni
2. **Konteyner** — Premium yuzey ile sarili scrollable alan; \`maxHeight\` ile sinirlanir
3. **Genisletilebilir Dugum** — Object/array icin ▸/▾ ile acilip kapanir
4. **Tip Badge'i** — \`Badge\` bileseni ile null/array/object/boolean/number turunu gosterir
5. **Ozet Bilgisi** — Object icin \`{N key}\`, array icin \`[N item]\` gosterir
6. **Primitive Deger** — String, number, boolean, null icin renk kodlu code blogu
7. **Bos Durum** — \`undefined\` deger icin Empty bileseni gosterilir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`defaultExpandedDepth\` ile varsayilan aciklik seviyesini ayarlayin.** Buyuk JSON'lar icin \`1\`, kucuk yapilar icin \`2-3\` uygun.

**\`maxHeight\` ile yuksekligi sinirlayin.** Cok buyuk JSON'lar sayfayi kaplamasin; scroll ile erisilebilir olsun.

**\`showTypes={true}\` ile tip bilgisini gosterin.** Gelistiriciler icin deger turlerinin gorulmesi onemlidir.

**\`rootLabel\` ile anlamli kok etiketi verin.** "payload", "response", "config" gibi kok adi baglamsal anlam katar.

**\`localeText\` ile yerellestirilmis etiketler saglayin.** Turkce arayuzde \`arraySummary\`, \`objectSummary\` gibi etiketleri cevirip tutarlilik olusturun.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok buyuk JSON'lari tamamen acik gostermek**
\`defaultExpandedDepth\` yuksek deger ile binlerce satir render edilir ve performansi dusurur.

**❌ \`maxHeight\` belirlemeden kullanmak**
Buyuk veri setleri sayfayi tamamen kaplar. Her zaman yukseklik siniri koyun.

**❌ Hassas verileri filtrelemeden gostermek**
API anahtarlari, sifreler gibi hassas alanlar JsonViewer ile goruntulenmemeli.

**❌ Duzenleme beklentisi olusturmak**
JsonViewer salt-okunur bir goruntuleme bilasenidir; duzenleme islevselliği yoktur.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elementi ile sarili; \`data-component="json-viewer"\` niteligi tasinir.

**Genisletme/Daraltma:** Her agac dugumu \`<button>\` olarak tiklanabilir; klavye ile Enter/Space destegi vardir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.

**Renk Kodlamasi:** String (mavi), number (yesil), boolean (sari), null (gri) ile tip farklilastirmasi gorsel olarak saglanir.

**Overflow:** \`overflow-auto\` ile buyuk veri setleri icin kaydirma destegi.`,
      },
    ],
    relatedComponents: ["Badge", "Empty", "Text"],
  },

  AnchorToc: {
    componentName: "AnchorToc",
    summary: "AnchorToc, sayfa ici basliklarla senkronize calisan, hash destekli icerik tablosu (table of contents) navigasyon bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `AnchorToc, sayfa icindeki bolumlere hizli navigasyon sunan bir icerik tablosu bilesenidir. URL hash'i ile senkronize calisir, 3 seviye girintileme destekler ve sticky konumlandirma ile sayfada sabit kalabilir.

\`\`\`tsx
import { AnchorToc } from '@mfe/design-system';

<AnchorToc
  items={[
    { id: "giris", label: "Giris", level: 1 },
    { id: "kurulum", label: "Kurulum", level: 1 },
    { id: "npm", label: "npm ile", level: 2 },
    { id: "yarn", label: "yarn ile", level: 2 },
    { id: "yapilandirma", label: "Yapilandirma", level: 1, meta: "Yeni" },
    { id: "api", label: "API Referansi", level: 1 },
  ]}
  title="Bu sayfada"
  density="comfortable"
  sticky
  syncWithHash
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uzun dokumantasyon veya icerik sayfalarinda bolumler arasi navigasyon icin
- Yan panel olarak sayfa ici icerik tablosu gostermek icin
- Hash tabanli bolum navigasyonu gerektiren sayfalarda
- Admin paneli ayar sayfalari gibi uzun form bolumlerinde

**Kullanmayin:**
- Sayfa arasi navigasyon icin — \`NavigationMenu\` veya \`Sidebar\` kullanin
- Sekme tabanli icerik icin — \`Tabs\` kullanin
- Dikey adim sihirbazi icin — \`Stepper\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────┐
│ BU SAYFADA                [6]│
│                              │
│ ● Giris                      │
│ ● Kurulum                    │
│     ● npm ile                │
│     ● yarn ile               │
│ ● Yapilandirma         Yeni  │
│ ● API Referansi              │
└──────────────────────────────┘
\`\`\`

1. **Baslik** — Ust kenarda "Bu sayfada" veya ozel etiket
2. **Oge Sayaci** — Toplam oge sayisini gosteren badge
3. **Navigasyon Listesi** — \`<ol>\` ile siralanmis bolum baglantilari
4. **Seviye Girintisi** — \`level\` 1/2/3 ile sol girinti (\`pl-0\` / \`pl-4\` / \`pl-8\`)
5. **Aktif Gosterge** — Secili oge vurgulu kenarllik ve arka plan ile isaretlenir
6. **Meta Bilgisi** (opsiyonel) — Sag tarafta "Yeni", "Beta" gibi ek bilgi
7. **Sticky Konum** (opsiyonel) — \`sticky\` ile sayfa kaydirmada sabit kalir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`syncWithHash={true}\` ile URL hash senkronizasyonu saglayin.** Sayfa yenilendiginde veya link paylasildiginda dogru bolum aktif olur.

**\`sticky\` ile yan panelde sabit tutun.** Uzun sayfalarda kullanici her zaman icerik tablosuna erisebilinsin.

**\`level\` ile hiyerarsiyi dogru belirtin.** Girintileme gorsel hiyerarsi olusturur ve okuyucularin yapti kavramasini kolaylastirir.

**\`density="compact"\` ile sik listelerde yer kazanin.** Cok sayida bolum varsa compact modu tercih edin.

**\`meta\` ile yeni veya onemli bolumleri vurgulayin.** "Yeni", "Beta" gibi etiketler dikkat ceker.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ 3'ten fazla girintileme seviyesi kullanmak**
Bilesen en fazla 3 seviye destekler; daha derin yapilari duzlestirin.

**❌ \`syncWithHash\` kapali iken hash baglantilari kullanmak**
Hash degisiklikleri yansimaz ve tutarsiz davranis olusur.

**❌ Kontrolllu \`value\` ile \`onValueChange\` sagamamak**
Kullanici tiklamasi state'i guncellemez; her ikisini birlikte kullanin.

**❌ Cok uzun etiketler kullanmak**
Etiketler kisa ve okunakli olmali; uzun metinler \`truncate\` ile kesilir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<nav>\` elementi ile navigasyon landmark'i olusturulur. \`aria-label\` ile "On-page navigation" etiketi tasinir.

**Aktif Durum:** Secili oge \`aria-current="location"\` ile isaretlenir.

**Disabled Ogeler:** \`aria-disabled\` ile devre disi ogeler belirtilir ve \`pointer-events-none\` ile tiklanmasi engellenir.

**Klavye Navigasyonu:** Tab ile ogeler arasinda gezinme; Enter ile bolume atlama. Focus ring WCAG 2.1 AA kontrastini saglar.

**Erisim Kontrolu:** \`access\` prop'u ile tum etklesimler kontrol edilir. Disabled/readonly durumlarda tiklamalar engellenir.`,
      },
    ],
    relatedComponents: ["NavigationMenu", "Tabs"],
  },

  Tree: {
    componentName: "Tree",
    summary: "Tree, hiyerarsik verileri genisletilebilir/daraltilabilir agac yapisinda goruntuleyen, secim ve badge destekli bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Tree, ic ice \`TreeNode\` ogelerinden olusan hiyerarsik veriyi agac yapisiyla goruntuleyen bilesendir. Her dugum etiket, aciklama, meta, badge'ler ve tone ile zenginlestirilebilir. Genisletme/daraltma kontrolllu veya kontrolsuz olarak yonetilebilir.

\`\`\`tsx
import { Tree } from '@mfe/design-system';

<Tree
  nodes={[
    {
      key: "src", label: "src", description: "Kaynak kodlar",
      children: [
        { key: "components", label: "components", badges: ["12 dosya"], tone: "info" },
        { key: "utils", label: "utils", badges: ["5 dosya"] },
      ],
    },
    {
      key: "tests", label: "tests", description: "Test dosyalari",
      tone: "success", meta: "100% kapsam",
      children: [
        { key: "unit", label: "unit" },
        { key: "e2e", label: "e2e", disabled: true },
      ],
    },
  ]}
  title="Proje Yapisi"
  description="Dosya ve klasor hiyerarsisi"
  density="comfortable"
  defaultExpandedKeys={["src"]}
  selectedKey="components"
  onNodeSelect={(key) => console.log("Secilen:", key)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Dosya/klasor hiyerarsisi gostermek icin
- Organizasyon sema ve yapilari goruntulelemek icin
- Kategori agaci veya taksonomi goruntuleme icin
- Ic ice menu veya yapilandirma agaclari icin

**Kullanmayin:**
- Duz (flat) liste icin — \`List\` veya \`DataTable\` kullanin
- Ag/graf yapilari icin — ozel graf bileseni kullanin
- Accordion tarzli icerik acma/kapama icin — \`Accordion\` kullanin
- Navigasyon menuleri icin — \`NavigationMenu\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Proje Yapisi
  Dosya ve klasor hiyerarsisi

┌──────────────────────────────────────┐
│ ▾ src                                │
│   Kaynak kodlar                      │
│   │ ● components     [12 dosya] info │
│   │ ● utils          [5 dosya]       │
│ ▸ tests                  100% kapsam │
│   Test dosyalari                     │
└──────────────────────────────────────┘
\`\`\`

1. **Baslik ve Aciklama** (opsiyonel) — Agacin ust basligi ve aciklamasi
2. **Konteyner** — Rounded border, shadow ile sarili agac alani
3. **Genisletme Butonu** — ▸/▾ ile cocuk dugumlerini ac/kapat
4. **Yaprak Gostergesi** — Cocugu olmayan dugumler icin \`•\` nokta ikonu
5. **Dugum Etiketi** — Ana etiket metni
6. **Aciklama** (opsiyonel) — Etiket altinda ek aciklama
7. **Badge'ler** (opsiyonel) — Dugum yaninda bilgi etiketleri
8. **Meta** (opsiyonel) — Sag tarafta ust bilgi
9. **Tone** — default/info/success/warning/danger ile renk kodlamasi
10. **Loading State** — \`loading\` true iken Skeleton ile yukleme gosterimi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`defaultExpandedKeys\` ile baslangic durumunu belirleyin.** Kullanicinin ilk gorunumde onemli dallari acik gormesini saglayin.

**\`tone\` ile gorsel anlam katın.** Basarili islemler icin \`success\`, uyari gerektiren ogeler icin \`warning\` kullanin.

**\`badges\` ile ek bilgi verin.** Dosya sayisi, durum etiketi gibi bilgileri badge ile gosterin.

**\`density="compact"\` ile yogun agaclarda yer kazanin.** Cok sayida dugum varsa compact modu tercih edin.

**\`selectedKey\` ile secili dugumu vurgulayin.** Kullanicinin hangi dugumde oldugunu ring ile belirtin.

**\`loading\` state'ini kullanin.** Asenkron veri yuklenirken Skeleton ile bekleme gosterimi sunun.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok derin hiyerarsiler olusturmak**
5+ seviye derinlik gorsel olarak takibi zorlastirir. Yapti saderlestirin.

**❌ Kontrolllu \`expandedKeys\` ile \`onExpandedKeysChange\` sagamamak**
Genisletme/daraltma calismaz; her ikisini birlikte kullanin.

**❌ Tum dugumleri baslangicta acik birakmak**
Buyuk agaclarda performansi dusurur ve gorsel karmasiklik yaratir.

**❌ \`disabled\` dugumleri aciklamadan isaretlemek**
Kullanici neden tiklanmadigini anlamaz; gorsel ipucu veya tooltip ekleyin.

**❌ Duz liste verisini zorla agac yapisina donusturmek**
Hiyerarsi yoksa \`List\` veya \`DataTable\` daha uygun.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elementi ile sarili; \`<ul>\`/\`<li>\` ile agac yapisi isaretlenir.

**Genisletme Butonu:** \`aria-expanded\` ve \`aria-label\` ile "Expand branch" / "Collapse branch" etiketi tasinir.

**Secim:** Secili dugum \`aria-current="true"\` ile isaretlenir.

**Disabled:** \`shouldBlockInteraction\` ile disabled dugumler tiklanamaz; gorsel olarak \`opacity-70\` ve \`cursor-not-allowed\` ile belirtilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.

**Loading:** Yukleme durumunda Skeleton bileseni ile gorsel yer tutucu sunulur.`,
      },
    ],
    relatedComponents: ["Accordion", "NavigationMenu", "JsonViewer"],
  },
};
