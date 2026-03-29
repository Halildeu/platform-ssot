import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  Upload: {
    componentName: "Upload",
    summary: "Upload, dosya secimi ve surukle-birak ile dosya yukleme islemi saglayan, dosya listesi ve dogrulama destekli form primitividir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Upload, dosya yukleme islemi icin surukle-birak alani ve dosya secim diyalogu sunan form elemanidir. \`FieldControlShell\` altyapisi ile label, description, hint, error destegi icerir.

Dosya listesi yonetimi (kontrol edilebilir ve kontrolsuz), \`maxFiles\` sinirlamasi, \`accept\` ile dosya tipi filtreleme, \`multiple\` secim destegi ve \`access\` tabanli erisim kontrolu saglar. Secilen dosyalar chip formatinda listelenir.

\`\`\`tsx
<Upload label="Belge Yukle" accept=".pdf,.doc" />
<Upload label="Gorseller" multiple maxFiles={5} accept="image/*" />
<Upload label="Rapor" error="Dosya boyutu cok buyuk" />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Form icerisinde dosya yukleme alani gereken senaryolarda
- Surukle-birak ile dosya secimi sunmak icin
- Birden fazla dosya yukleme gereken durumlarda
- Dosya tipi ve sayi kisitlamasi uygulamak icin

**Kullanmayin:**
- Gorsel onizleme ve crop gerektiren senaryolarda — ozel gorsel yukleme bileseni kullanin
- Buyuk dosya transferi ve progress bar gerektiren durumlarda — ozel yukleme yoneticisi kullanin
- Metin veya deger girisi icin — bunun yerine \`TextInput\` veya \`TextArea\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [Label]                 [Required?] │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │  [Empty State Label]    [Count]│  │
│  │  [Accept Info]                 │  │
│  └────────────────────────────────┘  │
│  [File Chip] [File Chip] ...         │
├──────────────────────────────────────┤
│  [Description / Hint / Error]        │
└──────────────────────────────────────┘
\`\`\`

1. **Label** — Alan basligini tanimlar
2. **Drop Zone** — Kesikli kenarli surukle-birak alani; tiklanabilir
3. **Empty State Label** — Kullaniciya dosya secme/surekleme yonlendirmesi
4. **Count Badge** — Mevcut dosya sayisi ve \`maxFiles\` siniri
5. **Accept Info** — Izin verilen dosya tipleri bilgisi
6. **File Chips** — Secilen dosyalarin adi ve boyutu ile listelenmesi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`accept\` ile dosya tiplerini kisitlayin.** Kullanicinin yanlis dosya tipi secmesini onler: \`accept="image/*"\` veya \`accept=".pdf,.doc"\`.

**\`maxFiles\` ile dosya sayisini sinirlayin.** Cok fazla dosya yuklenmesini onlemek icin makul bir sinir belirleyin.

**\`multiple\` prop'unu ihtiyaca gore ayarlayin.** Tek dosya gereken senaryolarda varsayilan \`false\` degerini koruyun.

**Hata mesajlarini spesifik yapin.** "Dosya boyutu 5MB'i asamaz" veya "Yalnizca PDF formatinda dosya yuklenir" gibi.

**\`onFilesChange\` ile dosya listesini yonetin.** Kontrol edilebilir modda dosya ekleme ve cikarma islemlerini yonetin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Dosya tipi kisitlamasi olmadan kullanmak**
Kullanicinin uygunsuz dosya tiplerini yuklemesine izin vermek guvenlik ve kullanilabilirlik sorunu yaratir.

**❌ \`maxFiles\` siniri olmadan \`multiple\` kullanmak**
Sinirlandirma olmadan cok fazla dosya yuklenmesi performans sorunlarina yol acar.

**❌ Buyuk dosyalar icin progress geri bildirimi vermemek**
Upload bileseni dosya secimini yonetir; sunucu yukleme sureci icin ayri progress gostergesi ekleyin.

**❌ Label olmadan kullanmak**
Erisim sorunlarina yol acar; her zaman \`label\` ekleyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Label Baglantisi:** \`<label>\` elemani \`htmlFor\` ile gizli file input'a baglanir; tiklandiginda dosya secici acilir.

**Gizli Input:** \`<input type="file">\` \`sr-only\` class ile gorsel olarak gizlenir; klavye ile erisim \`label\` uzerinden saglanir.

**Hata Bildirimi:** \`aria-invalid\` ve \`aria-describedby\` ile hata mesaji file input'a baglanir.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen render edilmez. \`readonly\` ve \`disabled\` durumlarinda dosya secimi engellenir.

**Dosya Bilgisi:** Secilen dosyalarin adi ve boyutu gorsel chip olarak sunulur; ekran okuyucular icerigini okuyabilir.`,
      },
    ],
    relatedComponents: ["TextInput", "TextArea", "Button"],
  },

  Segmented: {
    componentName: "Segmented",
    summary: "Segmented, tek veya coklu secim modunda gorsel segment kontrolu sunan, roving tabindex ve klavye navigasyonu destekleyen bilesen.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Segmented, bir grup secenekten birini veya birden fazlasini secmeye yarayan segmentli kontrol bilesenidir. Tab bar, filtre cubugu ve toolbar senaryolarinda kullanilir.

Uc gorunum modu (\`default\`, \`outline\`, \`ghost\`), uc boyut (\`sm\`, \`md\`, \`lg\`), iki sekil (\`rounded\`, \`pill\`), dikey/yatay oryantasyon, ikon, badge ve aciklama destegi sunar. \`single\` ve \`multiple\` secim modlari ile roving tabindex klavye navigasyonu icerir.

\`\`\`tsx
<Segmented
  items={[
    { value: "list", label: "Liste" },
    { value: "grid", label: "Izgara" },
    { value: "board", label: "Pano" },
  ]}
  value="list"
  onValueChange={(v) => setView(v)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Gorunum modu degistirme icin (liste/grid/pano)
- Filtre cubugu olarak secenekler arasinda hizli gecis icin
- Toolbar icerisinde mod secimi icin
- Az sayida (2-5) secenekten birini veya birden fazlasini secmek icin

**Kullanmayin:**
- Sayfa navigasyonu icin — bunun yerine \`Tabs\` kullanin
- Cok fazla secenek (6+) icin — bunun yerine \`Select\` veya \`Dropdown\` kullanin
- Form icerisinde deger secimi icin — bunun yerine \`Radio\` veya \`Select\` kullanin
- Boolean acma/kapama icin — bunun yerine \`Switch\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  ┌──────┐ ┌──────────┐ ┌──────┐     │
│  │[Icon]│ │ [Active] │ │[Icon]│     │
│  │[Lbl] │ │ [Label]  │ │[Lbl] │     │
│  │      │ │ [Badge]  │ │      │     │
│  └──────┘ └──────────┘ └──────┘     │
└──────────────────────────────────────┘
\`\`\`

1. **Container** — Segment grubunun dis cercevesi; gorunum ve sekil stillerini tasir
2. **Segment Item** — Tekil secim dugmesi; \`role="radio"\` ile isaretlenir
3. **Icon** (opsiyonel) — Baslangic, bitis veya ust konumda ikon
4. **Label** — Secenek metni
5. **Badge** (opsiyonel) — Sayi veya durum gostergesi
6. **Description** (opsiyonel) — Secenek alt aciklamasi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Secenek sayisini 2-5 arasinda tutun.** Fazla secenek gorsel karisiklik yaratir; 6+ secenek icin \`Select\` kullanin.

**Tutarli gorunum modu secin.** \`default\` genel kullanim, \`outline\` vurgulu secimler, \`ghost\` minimal gorunum icin uygundur.

**\`ariaLabel\` ile grubun amacini belirtin.** Ekran okuyucular icin "Gorunum modu" veya "Filtre secenekleri" gibi etiket ekleyin.

**\`createSegmentedPreset\` ile tutarlilik saglayin.** \`toolbar\`, \`filter_bar\`, \`pill_tabs\` preset'leri ile standart yapilandirmalar kullanin.

**\`allowEmptySelection\` ile bos secim davranisini kontrol edin.** Varsayilan olarak en az bir secenek secili kalmalidir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Sayfa navigasyonu icin kullanmak**
Segmented gorunum degistirme icindir; sayfa gecisleri icin \`Tabs\` veya \`NavigationRail\` kullanin.

**❌ 6'dan fazla secenek eklemek**
Cok fazla segment gorsel olarak tasima kapasitesini asar; \`Select\` veya \`Dropdown\` tercih edin.

**❌ \`ariaLabel\` olmadan kullanmak**
Ekran okuyucular grubun amacini bilemez; her zaman \`ariaLabel\` ekleyin.

**❌ Farkli boyutlarda segment'leri yan yana kullanmak**
Ayni sayfada farkli \`size\` degerleri gorsel tutarsizlik yaratir; standart preset'ler kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA Rolleri:** Container \`role="group"\`, segment'ler \`role="radio"\` ile isaretlenir; \`aria-checked\` ile secim durumu bildirilir.

**Roving Tabindex:** Yalnizca aktif segment \`tabIndex={0}\` alir; diger segment'ler \`tabIndex={-1}\` ile Tab sirasindan cikarilir.

**Klavye Navigasyonu:** Ok tuslari ile segment'ler arasinda gecis, Home/End ile ilk/son segmente atlama desteklenir.

**Devre Disi:** \`disabled\` segment'ler \`pointer-events-none\` ve dusuk opakllik ile gorsel ve islevsel olarak devre disi birakilir.

**Focus Ring:** Klavye odagi \`focus-visible:ring-2\` ile gorsel olarak belirtilir.`,
      },
    ],
    relatedComponents: ["Tabs", "Radio", "Switch", "Dropdown"],
  },

  MobileStepper: {
    componentName: "MobileStepper",
    summary: "MobileStepper, kucuk ekran senaryolarinda dots, text veya progress varyantli kompakt adim gostergesi sunan navigasyon primitividir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `MobileStepper, mobil ve dar viewport senaryolarinda cok adimli sureclerin ilerlemesini gosteren kompakt navigasyon bilesenidir. Masaustu \`Steps\` bileseninin mobil optimizasyonlu karsiligi olarak tasarlanmistir.

Uc varyant destekler: **dots** (nokta gostergeleri), **text** (metin tabanli ilerleme, orn. "3 / 5") ve **progress** (ilerleme cubugu). Ileri/geri navigasyon butonlari ile adimlar arasi gecis saglar.

\`\`\`tsx
<MobileStepper variant="dots" steps={5} activeStep={2}
  onNext={handleNext} onBack={handleBack} />
<MobileStepper variant="text" steps={3} activeStep={0} />
<MobileStepper variant="progress" steps={4} activeStep={1} />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Mobil cihazlarda cok adimli form veya sihirbaz sureci icin
- Dar alanlarda adim sayisi ve ilerleme gostermek icin
- Onboarding akislarinda sayfa gecisini yonetmek icin
- Carousel veya slider navigasyonunda konum gostermek icin

**Kullanmayin:**
- Genis ekranlarda detayli adim bilgisi gerektiren surecler icin — bunun yerine \`Steps\` kullanin
- Sayfa navigasyonu icin — bunun yerine \`Tabs\` veya \`NavigationRail\` kullanin
- Yalnizca ilerleme durumu gostermek icin — bunun yerine \`Progress\` bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [Back]  [● ● ○ ○ ○ / 2/5]  [Next] │
│          [════════░░░░░░░]           │
└──────────────────────────────────────┘
\`\`\`

1. **Back Button** — Onceki adima donme aksiyonu
2. **Indicator** — Varyanta gore dots, text veya progress bar
3. **Next Button** — Sonraki adima ilerleme aksiyonu
4. **Dots** — Her adim icin bir nokta; aktif adim dolu gosterilir
5. **Text** — "activeStep / totalSteps" formatinda metin
6. **Progress Bar** — Yuzdeli ilerleme cubugu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Adim sayisini 7 ile sinirlayin.** Cok fazla adim mobil ekranda dots varyantinda okunakliligi dusurur.

**Varyanti icerige gore secin.** Az adim (3-5) icin \`dots\`, cok adim icin \`text\`, gorsel ilerleme icin \`progress\` kullanin.

**Ileri/geri butonlarini kosullu devre disi birakin.** Ilk adimda "Geri", son adimda "Ileri" butonunu devre disi birakin.

**Steps bileseni ile tutarlilik saglayin.** Masaustunde \`Steps\`, mobilde \`MobileStepper\` kullanarak responsive deneyim sunun.

**Adim gecislerinde ilerlemeyi kaydedin.** Kullanici geri donebilmeli ve veri kaybetmemelidir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Masaustu gorunumde MobileStepper kullanmak**
Genis ekranlarda \`Steps\` bileseni daha iyi icerik ve etiket gosterimi saglar.

**❌ 7'den fazla adimla dots varyanti kullanmak**
Cok fazla nokta gorsel olarak okunamaz hale gelir; \`text\` veya \`progress\` varyantina gecin.

**❌ Navigasyon butonlarini gizlemek**
Kullanicinin adimlar arasi gecis yapabilmesi icin her zaman ileri/geri butonlarini gosterin.

**❌ Adim sayisini dinamik olarak degistirmek**
Surecin ortasinda adim sayisi degismesi kullaniciyi sasirtir; adim yapisi sabit olmalidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** Bilesen \`role="navigation"\` ile isaretlenir; \`aria-label\` ile amac belirtilir (orn. "Adim ilerleme").

**Ilerleme Bildirimi:** Aktif adim degistiginde \`aria-valuenow\`, \`aria-valuemin\` ve \`aria-valuemax\` ile ilerleme durumu ekran okuyuculara bildirilir.

**Buton Etiketleri:** Ileri ve geri butonlari \`aria-label\` ile "Sonraki adim" ve "Onceki adim" olarak etiketlenir.

**Klavye:** Tab ile butonlar arasinda gecis, Enter/Space ile aksiyon tetikleme desteklenir.

**Devre Disi:** Ilk ve son adimlarda ilgili butonlar \`disabled\` ve \`aria-disabled\` ile isaretlenir.`,
      },
    ],
    relatedComponents: ["Steps", "Pagination", "Tabs"],
  },

  TablePagination: {
    componentName: "TablePagination",
    summary: "TablePagination, tablo ve liste gorunumlerinde sayfa boyutu, aralik bilgisi ve navigasyon butonlari ile sayfalama kontrolu saglayan bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TablePagination, veri tablolari ve listeler icin ozellestirilmis sayfalama kontrolu sunar. Sayfa boyutu degistiricisi, aralik etiketi ve ileri/geri/ilk/son sayfa navigasyon butonlarini tek bilesenle birlesitirir.

Kontrol edilebilir ve kontrolsuz sayfa/sayfa boyutu yonetimi, \`totalItemsKnown\` ile belirsiz toplam kayit destegi, \`localeText\` ile dil ozellestirmesi, \`slots\` ile aksiyon bileseni degistirme ve \`access\` tabanli erisim kontrolu icerir.

\`\`\`tsx
<TablePagination totalItems={250} page={1} pageSize={20}
  onPageChange={setPage} onPageSizeChange={setSize} />
<TablePagination totalItems={0} totalItemsKnown={false}
  hasNextPage={true} showFirstLastButtons />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Veri tablolarinda sayfalama kontrolu icin
- Liste gorunumlerinde sayfa boyutu ve navigasyon saglamak icin
- Sunucu tarafli sayfalamada sayfa degisikliklerini yonetmek icin
- Toplam kayit sayisi bilinmeyen (infinite) veri kaynaklarinda

**Kullanmayin:**
- Genel amacli sayfa navigasyonu icin — bunun yerine \`Pagination\` kullanin
- Sonsuz kaydirma (infinite scroll) senaryolarinda — ozel cozum kullanin
- Icerik karuseli veya slayt gosterisinde — bunun yerine \`MobileStepper\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌─────────────────────────────────────────────────┐
│  [Rows per page: [Select]]  [1-20 of 250]       │
│                             [« ‹ › »]            │
└─────────────────────────────────────────────────┘
\`\`\`

1. **Rows Per Page Label** — Sayfa boyutu etiketi (orn. "Satir sayisi:")
2. **Size Changer** — Sayfa boyutu secim kontrolu (\`PaginationSizeChanger\`)
3. **Range Label** — Gosterilen aralik bilgisi (orn. "1-20 of 250")
4. **Navigation Actions** — Ilk/onceki/sonraki/son sayfa butonlari
5. **Container** — Premium gorunumlu dis cerceve`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`pageSizeOptions\` ile makul degerler sunun.** Varsayilan \`[10, 20, 50, 100]\` cogu senaryo icin uygundur.

**\`localeText\` ile Turkce etiketler saglayin.** \`rowsPerPageLabel\`, \`rangeLabel\`, buton etiketleri gibi metin alanlarini ozellestirin.

**\`showFirstLastButtons\` ile hizli navigasyon ekleyin.** Cok sayfalik veri setlerinde ilk/son sayfa butonlari kullanici deneyimini iyilestirir.

**\`resetPageOnPageSizeChange\` ayarini yapin.** Sayfa boyutu degistiginde ilk sayfaya donme genellikle beklenen davranistir.

**Belirsiz toplam icin \`totalItemsKnown={false}\` kullanin.** Sunucu toplam sayiyi bilmiyorsa \`hasNextPage\` ile sonraki sayfa varligini belirtin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Sayfa boyutu seceneklerini cok kucuk veya buyuk yapmak**
\`[1, 2, 5]\` gibi cok kucuk veya \`[1000, 5000]\` gibi cok buyuk degerler performans ve kullanilabilirlik sorunlarina yol acar.

**❌ Tablo disinda genel sayfalama icin kullanmak**
TablePagination tablo/liste odaklidir; genel navigasyon icin \`Pagination\` kullanin.

**❌ \`localeText\` olmadan coklu dil destegi beklemek**
Varsayilan etiketler Ingilizce'dir; Turkce arayuzlerde \`localeText\` ile cevirileri saglayin.

**❌ \`onPageChange\` ve \`onPageSizeChange\` olmadan kullanmak**
Kontrolsuz modda bile callback'ler veri cekme islemlerini tetiklemek icin gereklidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Buton Etiketleri:** Ileri, geri, ilk ve son sayfa butonlari \`aria-label\` ile etiketlenir (orn. "Previous page", "Next page").

**Devre Disi Durumu:** Ilk sayfada "onceki" ve "ilk" butonlari, son sayfada "sonraki" ve "son" butonlari \`disabled\` olarak isaretlenir.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen render edilmez. \`access\` degeri alt bilesenlere (butonlar, size changer) aktarilir.

**Sayfa Boyutu Secimi:** \`PaginationSizeChanger\` bileseni erisim kontrol destegi ile render edilir.

**Semantik:** \`data-component="table-pagination"\` ile bilesen turu belirtilir; \`data-access-state\` ile erisim durumu isaretlenir.`,
      },
    ],
    relatedComponents: ["Pagination", "Steps", "MobileStepper"],
  },

  Empty: {
    componentName: "Empty",
    summary: "Empty, veri bulunmadiginda veya icerik bos oldugunda kullaniciya gorsel geri bildirim ve aksiyon yonlendirmesi sunan bos durum bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Empty (EmptyState), tablo, liste veya icerik alani bos oldugunda kullaniciya durumu bildiren ve sonraki adimi yonlendiren placeholder bilesendir.

Ikon, baslik, aciklama, birincil ve ikincil aksiyon butonu destekler. \`compact\` modu ile dar alanlarda (tablo satiri, kart ici) gomulu olarak kullanilabilir. \`access\` ile erisim kontrolu saglanir.

\`\`\`tsx
<Empty icon={<InboxIcon />} title="Kayit bulunamadi"
  description="Arama kriterlerinizi degistirmeyi deneyin."
  action={<Button>Yeni Ekle</Button>} />
<Empty compact title="Veri yok" />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tablo veya listede veri bulunmadiginda bos durum mesaji gostermek icin
- Arama sonucu bos oldugunda kullaniciya geri bildirim vermek icin
- Ilk kullanim senaryolarinda (onboarding) icerik olusturma yonlendirmesi icin
- Filtre sonucu bos oldugunda filtreleri sifirlamaya yonlendirmek icin

**Kullanmayin:**
- Yukleme durumu gostermek icin — bunun yerine \`Skeleton\` veya \`Spinner\` kullanin
- Hata durumu gostermek icin — bunun yerine \`Alert\` veya hata sayfasi kullanin
- Basarili islem bildirimi icin — bunun yerine \`Toast\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│            ┌────────┐                │
│            │ [Icon] │                │
│            └────────┘                │
│          [Title / Baslik]            │
│       [Description / Aciklama]       │
│  [Primary Action]  [Secondary Action]│
└──────────────────────────────────────┘
\`\`\`

1. **Icon** (opsiyonel) — Durumu gorsel olarak ifade eden ikon veya illustrasyon
2. **Title** — Bos durumu ozetleyen baslik metni
3. **Description** (opsiyonel) — Ek aciklama ve yonlendirme
4. **Primary Action** (opsiyonel) — Ana aksiyon butonu (orn. "Yeni Ekle")
5. **Secondary Action** (opsiyonel) — Alternatif aksiyon butonu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Anlamli baslik ve aciklama yazin.** "Veri yok" yerine "Kayit bulunamadi — arama kriterlerinizi degistirmeyi deneyin" gibi yonlendirici mesajlar kullanin.

**Aksiyon butonu ile sonraki adimi yonlendirin.** "Yeni kayit ekle" veya "Filtreleri temizle" gibi aksiyonlar kullaniciyi yonlendirir.

**\`compact\` modunu dar alanlar icin kullanin.** Tablo ici, kart ici veya sidebar gibi kisitli alanlarda \`compact\` modu daha az yer kaplar.

**Ikon ile gorsel baglam saglayin.** Bos kutu, arama ikonu veya dosya ikonu gibi duruma uygun gorseller ekleyin.

**Tutarli bos durum tasarimi uygulayin.** Tum uygulama genelinde ayni Empty bileseni ve mesaj dilini kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Yalnizca bos alan birakmak**
Kullanici verinin yuklenip yuklenmedigi, hata mi oldugu yoksa gercekten bos mu oldugunu ayirt edemez.

**❌ Cok uzun aciklama metinleri yazmak**
Bos durum mesaji kisa ve net olmalidir; paragraf uzunlugunda aciklamalar okunmaz.

**❌ Aksiyon butonu olmadan kullanmak**
Kullanici ne yapacagini bilemez; en azindan bir yonlendirme aksiyonu ekleyin.

**❌ Yukleme durumunda Empty gostermek**
Veri henuz yuklenmemisse \`Skeleton\` veya \`Spinner\` gosterin; Empty yalnizca veri gercekten bos oldugunda kullanilir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Bilesen \`<div>\` ile render edilir; icerik merkezi hizalanmis metin olarak sunulur.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen DOM'dan kaldirilir; diger durumlarda normal render edilir.

**Ikon Erisimi:** Ikon alani \`[&>svg]\` ile boyutlandirilir; dekoratif ikon icin ek \`aria-hidden\` uygulanabilir.

**Aksiyon Butonlari:** \`action\` ve \`secondaryAction\` alanlarina verilen butonlar kendi erisim ozelliklerini tasir.

**Compact Mod:** \`compact\` modda padding ve font boyutu kucultulur ancak icerik erisimi korunur.`,
      },
    ],
    relatedComponents: ["Skeleton", "Spinner", "Alert", "Toast"],
  },

  EmptyErrorLoading: {
    componentName: "EmptyErrorLoading",
    summary: "EmptyErrorLoading, bos, hata ve yukleniyor durumlarini Empty, Spinner ve Skeleton katmanlariyla tek bir feedback recipe altinda birlestiren uc-durumlu geri bildirim bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `EmptyErrorLoading, uc farkli durumu (\`empty\`, \`error\`, \`loading\`) tek bir bilesen icerisinde yoneten **recipe** bilesendir. Her mod icin uygun alt bilesen otomatik olarak render edilir:

- **loading** — \`Spinner\` ve istege bagli \`Skeleton\` placeholder katmanlari
- **error** — \`Empty\` ile hata mesaji ve istege bagli \`onRetry\` aksiyonu
- **empty** — \`Empty\` ile bos durum geri bildirimi

\`access\` prop'u ile policy-temelli gorunurluk ve etkilesim kontrolu saglanir. Tum renkler CSS degiskenleri uzerinden tanimlanir ve dark mode uyumludur.

\`\`\`tsx
import { EmptyErrorLoading } from '@mfe/design-system';

<EmptyErrorLoading
  mode="loading"
  title="Veri Yukleniyor"
  description="Lutfen bekleyin, veriler getiriliyor."
  loadingLabel="Yukleniyor..."
  showSkeleton={true}
/>

<EmptyErrorLoading
  mode="error"
  title="Hata Olustu"
  errorLabel="Baglanti saglanamadi. Lutfen tekrar deneyin."
  retryLabel="Tekrar Dene"
  onRetry={() => refetch()}
/>

<EmptyErrorLoading
  mode="empty"
  title="Kayit Bulunamadi"
  description="Bu kriterlere uygun veri bulunmuyor."
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Veri cekme isleminin bos, hata veya yukleniyor sonuclarina gore farkli geri bildirim gostermek icin
- Liste, tablo veya kart iceriginde tri-state feedback gerektiren sayfalarda
- Tutarli yukleme, hata ve bos durum deneyimi saglamak icin
- Retry mekanizmasi ile hata kurtarma akisi sunmak icin

**Kullanmayin:**
- Yalnizca yukleme durumu gostermek icin — bunun yerine \`Spinner\` veya \`Skeleton\` kullanin
- Yalnizca bos durum gostermek icin — bunun yerine \`Empty\` kullanin
- Toast veya bildirim turunde geri bildirim icin — bunun yerine \`Toast\` kullanin
- Form validasyon hatalari icin — bunun yerine inline hata mesajlari kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [Title]                             │
│  [Description]                       │
│  ┌────────────────────────────────┐  │
│  │  mode=loading:                 │  │
│  │    [Spinner] + [Skeleton?]     │  │
│  │  mode=error:                   │  │
│  │    [Empty] + [Retry Button?]   │  │
│  │  mode=empty:                   │  │
│  │    [Empty]                     │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
\`\`\`

1. **Section Container** — Dis cerceve; \`rounded-3xl\`, border ve golge ile stillendirilmis alan
2. **Title** — Durumu ozetleyen baslik metni
3. **Description** — Ek aciklama metni
4. **Content Panel** — Ic cerceve; mod'a gore icerik render edilir
5. **Spinner** (loading) — Blok modda donem animasyonu
6. **Skeleton** (loading, opsiyonel) — Text, rect ve table-row placeholder'lari
7. **Empty** (error/empty) — Bos durum veya hata mesaji
8. **Retry Button** (error, opsiyonel) — \`onRetry\` verildiginde gosterilen aksiyon butonu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her zaman anlamli \`title\` ve \`description\` saglayin.** Kullanici hangi durumda oldugunu net olarak anlamalidir.

**Hata durumunda \`onRetry\` ekleyin.** Kullaniciya kurtarma yolu sunmak UX kalitesini arttirir.

**\`showSkeleton\` ile icerik beklentisi olusturun.** Yukleme sirasinda skeleton placeholder'lari sayfa duzeni hakkinda ipucu verir.

**Tek bir state kaynagindan \`mode\` turetiri.** API cagrisinizin durumuna gore \`loading\`, \`error\` veya \`empty\` secin:

\`\`\`tsx
const mode = isLoading ? 'loading' : isError ? 'error' : 'empty';
<EmptyErrorLoading mode={mode} onRetry={refetch} />
\`\`\`

**\`access\` prop'unu policy kontrolu icin kullanin.** \`access="hidden"\` ile bilesen tamamen gizlenebilir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Uc durumu ayri ayri yonetmek**
Ayri \`Spinner\`, \`Empty\` ve hata bilesenleri kullanmak tutarsiz gorunum ve tekrar eden kod yaratir. EmptyErrorLoading bu uc durumu birlestirmek icin tasarlanmistir.

**❌ \`onRetry\` olmadan hata durumu gostermek**
Kullanici hatanin ne oldugunu gorur ama ne yapacagini bilemez. Her zaman bir kurtarma aksiyonu ekleyin.

**❌ \`mode\` prop'unu statik olarak sabitlemek**
\`mode="loading"\` seklinde sabit deger vermek bileseni anlamini yitirir. API durumuna gore dinamik turetim kullanin.

**❌ Yukleme durumunda eski veriyi gostermek**
\`mode="loading"\` aktifken eski icerik yerine skeleton gosterilmelidir. Eski veriyi bilesene gecirmenize gerek yoktur.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik Yapi:** Bilesen \`<section>\` olarak render edilir. \`data-component="empty-error-loading"\` ve \`data-mode\` ile bilesen turu ve aktif mod isaretlenir.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen DOM'dan tamamen kaldirilir. Diger durumlarda \`data-access-state\` ile erisim seviyesi isaretlenir.

**Yukleniyor Durumu:** \`Spinner\` \`mode="block"\` ile render edilir ve \`label\` prop'u ile ekran okuyuculara durum bildirimi yapilir.

**Hata Kurtarma:** Retry butonu \`access\` prop'unu miras alir ve klavye ile erisilebilir.

**Klavye Navigasyonu:** Retry butonu Tab sirasi ile erisilebilir ve Enter/Space ile etkinlestirilebilir.`,
      },
    ],
    relatedComponents: ["Empty", "Spinner", "Skeleton", "Alert"],
  },
};
