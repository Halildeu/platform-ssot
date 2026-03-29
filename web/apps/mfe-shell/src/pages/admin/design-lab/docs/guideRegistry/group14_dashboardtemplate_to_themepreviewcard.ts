import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  DashboardTemplate: {
    componentName: "DashboardTemplate",
    summary: "DashboardTemplate, KPI strip, ozet kartlari ve dashboard genel bakis bloklarini tek sayfa shell icinde toplayan yonetici dashboard sablonudur.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DashboardTemplate, PageLayout uzerine kurulu bir executive dashboard sablonudur. KPI strip, summary cards ve overview bloklarini organize ederek metrics-first bir sayfa deneyimi sunar.

Tab destekli ikincil navigasyon, header aksiyonlari ve responsive yogunluk ayarlari icerir.

\`\`\`tsx
<PageLayout
  pageWidth="wide"
  title="Dashboard"
  actions={<DateRangePicker />}
  contentHeader={<SummaryStrip items={kpiMetrics} />}
  secondaryNav={<Tabs items={tabItems} />}
>
  <DashboardCards />
</PageLayout>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Yonetici ozet ekranlarinda (executive dashboard)
- KPI metrikleri ve ozet kartlarin birlikte gosterildigi sayfalarda
- Tab ile bolunmus coklu dashboard gorunumlerinde
- Operasyonel genel bakis (overview) sayfalarinda

**Kullanmayin:**
- Kayit listesi ve yonetim ekranlarinda — bunun yerine \`CrudTemplate\` kullanin
- Tek kayit detay sayfalarinda — bunun yerine \`DetailTemplate\` kullanin
- Ayarlar sayfalarinda — bunun yerine \`SettingsTemplate\` kullanin
- Sadece grafik gerektiren raporlama sayfalarinda — ozel layout olusturun`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Title]              [Actions]          │
├──────────────────────────────────────────┤
│  [KPI / Summary Strip]                   │
│  [Secondary Nav (Tabs)]                  │
├──────────────────────────────────────────┤
│  [Overview Cards / Blocks]               │
│  [Charts / Widgets]                      │
│                       │  [Sidebar?]      │
└──────────────────────────────────────────┘
\`\`\`

1. **Header** — Dashboard basligi ve tarih filtresi, aksiyonlar
2. **KPI Strip** — SummaryStrip ile temel performans gostergeleri
3. **Secondary Nav** — Tabs ile farkli dashboard gorunumleri arasi gecis
4. **Overview Cards** — Ozet kartlari ve veri bloklari
5. **Sidebar** (opsiyonel) — Ek baglam bilgisi paneli`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Metrics-first yaklasim benimseyin.** KPI strip'i sayfanin en ustunde konumlandirin; kullanici ilk bakista temel metrikleri gormeli.

**Wide genislik kullanin.** Dashboard kartlari icin \`pageWidth="wide"\` yeterli alan saglar.

**Tab ile gorunumleri bolumlendirin.** Cok fazla icerik tek gorunumde sikismak yerine tab'larla organize edilmeli.

**Responsive yigilma test edin.** Kucuk ekranlarda kartlarin dogru sekilde yigildigini dogrulayin.

**Header aksiyonlarini sinirli tutun.** Dashboard header'inda 2-3 aksiyondan fazlasi karmasikliga neden olur.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ KPI strip olmadan dashboard gostermek**
Kullanici sayfaya girdiginde temel metrikleri goremez; dashboard amacini yitirir.

**❌ Cok fazla karti tek gorunumde gostermek**
Scroll gerektiren uzun dashboard'lar kullanici dikkatini dagatir; tab'larla bolumlendirin.

**❌ Dar genislik kullanmak**
\`pageWidth="default"\` ile dashboard kartlari sikisir; \`wide\` onerilir.

**❌ Sidebar'i her zaman acik birakmak**
Dashboard'da ana icerik alani daraltilmamali; sidebar opsiyonel kalmali.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** PageLayout ile \`<main>\` landmark'i saglanir; dashboard kartlari \`<section>\` ile gruplandiririr.

**Klavye:** Tab ile KPI'lar, navigasyon ve kartlar arasi gezinme desteklenir.

**Basliklar:** Her dashboard bolumu \`<h2>\` veya \`<h3>\` ile hiyerarsik baslik tasir.

**Responsive:** Kucuk ekranlarda kartlar tek kolon yigilmaya gecer; icerik kaybolmaz.

**Kontrast:** KPI degerleri ve etiketler WCAG 2.1 AA kontrast gereksinimlerini karsilar.`,
      },
    ],
    relatedComponents: ["PageLayout", "SummaryStrip", "Descriptions", "Tabs"],
  },

  DetailTemplate: {
    componentName: "DetailTemplate",
    summary: "DetailTemplate, entity ozeti, inspector rail ve detay bloklari ile kayit inceleme ekranlari icin standart detay sayfasi sablonudur.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DetailTemplate, PageLayout uzerine kurulu bir detay sayfasi sablonudur. Entity summary, inspector rail ve detail blocks ile karar verme veya kayit inceleme ekranlarini standart bir yapiya oturtur.

\`responsiveDetailCollapse\` ve \`responsiveDetailBreakpoint\` prop'lari ile inspector rail kucuk ekranlarda otomatik collapse olabilir.

\`\`\`tsx
<PageLayout
  title="Siparis #1234"
  breadcrumbItems={breadcrumbs}
  actions={<Button>Duzenle</Button>}
  detail={<InspectorRail metadata={orderMeta} />}
  responsiveDetailCollapse
>
  <EntitySummaryBlock entity={order} />
  <Descriptions items={orderDetails} />
</PageLayout>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tek kayit detay sayfalarinda (siparis detayi, kullanici profili, urun detayi)
- Entity ozeti + metadata kombinasyonu gereken ekranlarda
- Karar verme veya onay inceleme akislarinda
- Inspector rail ile ek baglam bilgisi gosterilen sayfalarda

**Kullanmayin:**
- Liste ve yonetim ekranlarinda — bunun yerine \`CrudTemplate\` kullanin
- Dashboard ozet ekranlarinda — bunun yerine \`DashboardTemplate\` kullanin
- Ayarlar sayfalarinda — bunun yerine \`SettingsTemplate\` kullanin
- Coklu entity karsilastirma ekranlarinda — ozel layout olusturun`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Breadcrumb]                            │
│  [Entity Title]       [Actions]          │
├──────────────────────────────────────────┤
│  [Entity Summary]     │  [Inspector      │
│  [Detail Blocks]      │   Rail]          │
│  [Descriptions]       │  [Metadata]      │
│                       │  [Status]        │
├──────────────────────────────────────────┤
│  [Footer?]                               │
└──────────────────────────────────────────┘
\`\`\`

1. **Header** — Breadcrumb, entity basligi ve aksiyon butonlari
2. **Entity Summary** — EntitySummaryBlock ile kaydin ozet bilgileri
3. **Detail Blocks** — Descriptions ve diger icerik bloklari
4. **Inspector Rail** — Yan panel; metadata, durum ve ek baglam bilgisi
5. **Footer** (opsiyonel) — Sticky ozet veya aksiyon cubugu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Summary-to-detail ilerleme saglayin.** Sayfa ustten alta dogru genel bilgiden detaya dogru akmali.

**Inspector rail'i baglam icin kullanin.** Metadata, durum, tarihce gibi yardimci bilgileri yan panelde gosterin.

**Responsive collapse'i etkinlestirin.** \`responsiveDetailCollapse: true\` ile mobilde inspector rail otomatik kapanir.

**Breadcrumb ile geri navigasyon saglayin.** Detay sayfalarindan liste sayfasina donus icin breadcrumb kritiktir.

**Footer'da sticky aksiyonlar sunun.** Uzun detay sayfalarinda "Kaydet" veya "Onayla" butonlari her zaman gorunur olmali.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Inspector rail'i cok genis yapmak**
Ana icerik alani daralir; rail genisligi icerige orantili olmali.

**❌ Entity summary'yi atlayip direkt detaya gecmek**
Kullanici hangi kaydi inceledigini hizla goremez; ozet blogu her zaman olmali.

**❌ Breadcrumb olmadan detay sayfasi gostermek**
Kullanici geri navigasyon yapamaz; breadcrumb zorunludur.

**❌ Responsive collapse'i devre disi birakmak**
Mobilde iki panel yan yana sikisir; \`responsiveDetailCollapse\` kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Ana icerik \`<main>\`, inspector rail \`<aside>\` landmark'i ile ayrilir.

**Breadcrumb:** \`<nav aria-label="breadcrumb">\` ile erisilebilir navigasyon saglanir.

**Klavye:** Tab ile icerik ve inspector rail arasi gecis; aksiyon butonlari Tab ile odaklanabilir.

**Basliklar:** Entity basligi \`<h1>\`, alt bolumler \`<h2>\` ile hiyerarsik yapidadir.

**Responsive:** Collapse durumunda icerik kaybolmaz; accordion veya tab ile erisim korunur.`,
      },
    ],
    relatedComponents: ["PageLayout", "EntitySummaryBlock", "Descriptions", "SummaryStrip"],
  },

  SettingsTemplate: {
    componentName: "SettingsTemplate",
    summary: "SettingsTemplate, bolum tablari, konfigürasyon ozetleri ve policy-aware aside paneli ile ayarlar ekranlari icin standart sablon sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `SettingsTemplate, PageLayout uzerine kurulu bir ayarlar sayfasi sablonudur. Section tabs, configuration summaries ve guardrail aside paneli ile ayarlar ekranlarini standart bir yapida sunar.

\`stickyHeader\` varsayilan olarak aktiftir; section tabs ile uzun ayarlar sayfalarinda hizli bolum navigasyonu saglar.

\`\`\`tsx
<PageLayout
  title="Ayarlar"
  stickyHeader
  secondaryNav={<Tabs items={settingSections} />}
  detail={<GuardrailAside policies={activePolicies} />}
>
  <Descriptions items={generalSettings} />
  <SummaryStrip items={configSummary} />
</PageLayout>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulama veya modul ayarlar sayfalarinda
- Tab ile bolumlendirilmis konfigürasyon ekranlarinda
- Policy/guardrail bilgisi gosterilen ayarlar sayfalarinda
- Kullanici tercihleri ve hesap ayarlarinda

**Kullanmayin:**
- Liste ve yonetim ekranlarinda — bunun yerine \`CrudTemplate\` kullanin
- Dashboard ekranlarinda — bunun yerine \`DashboardTemplate\` kullanin
- Tek kayit detay sayfalarinda — bunun yerine \`DetailTemplate\` kullanin
- Form wizard/adim adim akislarda — ozel wizard biliseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Title]              [Actions]          │
│  [Section Tabs]                          │
├──────────────────────────────────────────┤
│  [Configuration       │  [Guardrail     │
│   Summaries]          │   Aside]        │
│  [Settings Groups]    │  [Policy Info]  │
│  [Descriptions]       │                 │
└──────────────────────────────────────────┘
\`\`\`

1. **Header** — Ayarlar basligi ve kaydetme/iptal aksiyonlari
2. **Section Tabs** — Ayarlar bolumleri arasi navigasyon tab'lari
3. **Configuration Summaries** — Mevcut konfigürasyon durumunu ozetleyen strip
4. **Settings Groups** — Descriptions ile gruplanmis ayarlar
5. **Guardrail Aside** (opsiyonel) — Policy ve kisitlama bilgileri paneli`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Sticky header kullanin.** \`stickyHeader: true\` ile section tabs scroll sirasinda gorunur kalir; uzun ayarlar sayfalarinda kritik.

**Tab'larla bolumlendirin.** Tum ayarlari tek sayfaya koymak yerine mantiksal gruplara ayirin (Genel, Bildirimler, Guvenlik vb.).

**Configuration summary saglayin.** Mevcut ayarlar durumunu SummaryStrip ile ozetleyin; kullanici hizla mevcut durumu gorsun.

**Guardrail aside ile policy bilgisi gosterin.** Kisitlamalar ve kurallar yan panelde gorunur olmali.

**Kaydedilmemis degisiklikleri uyarin.** Sayfa terk edilirken kaydedilmemis degisiklik varsa kullaniciya uyari gosterin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tum ayarlari tek uzun sayfada gostermek**
Tab ile bolumlendirme yapilmazsa kullanici istenen ayari bulmakta zorlanir.

**❌ Sticky header'i devre disi birakmak**
Section tabs gorunmez olur ve kullanici baska bolume gecmek icin sayfanin basina scroll etmek zorunda kalir.

**❌ Kaydetme butonunu sadece sayfanin altina koymak**
Uzun sayfalarda kullanici kaydetme butonunu gormeyebilir; sticky footer veya header'da aksiyon saglayin.

**❌ Guardrail bilgisini gizlemek**
Policy kisitlamalari kullaniciya gorunmezse neden bazi ayarlarin degistirelemedigini anlayamaz.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Ana icerik \`<main>\`, guardrail aside \`<aside>\` landmark'i ile ayrilir.

**Tab Navigasyonu:** Section tabs \`role="tablist"\` ve \`role="tab"\` ile ARIA tab pattern'ini uygular.

**Klavye:** Tab ile bolumler arasi gecis, form alanlari arasi navigasyon desteklenir.

**Form Erisilebilirligi:** Tum ayar alanlari \`<label>\` ile iliskilendirilmis olmali; hata mesajlari \`aria-describedby\` ile baglenir.

**Durum Bildirimi:** Ayar kaydedildiginde basarili/hata durumu \`aria-live\` ile ekran okuyuculara bildirilir.`,
      },
    ],
    relatedComponents: ["PageLayout", "Tabs", "Descriptions", "SummaryStrip"],
  },

  ThemePresetCompare: {
    componentName: "ThemePresetCompare",
    summary: "ThemePresetCompare, iki tema preset'ini appearance, density, contrast ve intent eksenlerinde yan yana karsilastiran bileskendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ThemePresetCompare, iki ThemePresetGalleryItem'i karsilastirma matrisinde yan yana gosterir. Her preset icin ThemePreviewCard onizlemesi ve konfigurasyon eksenlerindeki farklari tablo formatinda sunar.

\`axes\` prop'u ile hangi eksenlerin karsilastirilacagi belirlenir. Access control destegi ile readonly veya disabled modda kullanilabilir.

\`\`\`tsx
<ThemePresetCompare
  leftPreset={presetA}
  rightPreset={presetB}
  axes={["appearance", "density", "intent", "contrast"]}
  title="Tema Karsilastirmasi"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Iki tema preset'ini detayli karsilastirmak icin
- Tema secimi oncesinde farklari gorsel olarak incelemek icin
- Design lab veya tema yonetim sayfalarinda
- Appearance, density ve contrast farklarini acikca gostermek icin

**Kullanmayin:**
- Tek preset goruntuleme icin — bunun yerine \`ThemePreviewCard\` kullanin
- Preset galerisi/listesi icin — bunun yerine \`ThemePresetGallery\` kullanin
- Ucten fazla preset karsilastirmasi icin — ozel layout olusturun`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Title]                                 │
│  [Description]                           │
├────────────────────┬─────────────────────┤
│  [Left Preset]     │  [Comparison Table] │
│  [Preview Card]    │  Axis | Left | Right│
│  [Right Preset]    │  ─────┼──────┼──────│
│  [Preview Card]    │  mode │  ... │ ...  │
│                    │  dens │  ... │ ...  │
└────────────────────┴─────────────────────┘
\`\`\`

1. **Baslik ve Aciklama** — Karsilastirma amacini tanimlayan metin
2. **Sol Preset** — ThemePreviewCard ile sol preset onizlemesi ve etiketi
3. **Sag Preset** — ThemePreviewCard ile sag preset onizlemesi ve etiketi
4. **Karsilastirma Tablosu** — Eksen bazinda deger karsilastirma matrisi
5. **Empty State** — Iki preset secilmediginde bos durum bildirimi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her iki preset'i de saglayin.** \`leftPreset\` veya \`rightPreset\` eksik olursa bos durum gosterilir.

**Anlamli eksenler secin.** Varsayilan \`["appearance", "density", "intent", "contrast"]\` cogu senaryo icin yeterlidir.

**Aciklayici baslik kullanin.** \`title\` ve \`description\` ile kullaniciya neden bu karsilastirmayi yaptigini anlamlandirin.

**Access control uygulayin.** Sadece goruntuleme gerektiren durumlarda \`access="readonly"\` kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tek preset ile karsilastirma gostermek**
Bos preset bos durum tetikler; her iki preset de saglanmali.

**❌ Cok fazla eksen eklemek**
Karsilastirma tablosu okunaksiz hale gelir; 4-6 eksen ideal.

**❌ Karsilastirmayi aciklama olmadan gostermek**
Kullanici hangi presetleri neden karsilastirdigini anlamali; baslik ve aciklama ekleyin.

**❌ Access state'i gormezden gelmek**
\`hidden\` durumda bilesen render edilmemeli; access control prop'larini iletin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elemani ile sarili; \`data-component="theme-preset-compare"\` ile tanimlanir.

**Karsilastirma Tablosu:** Grid yapisi ile eksen etiketleri ve degerler okunabilir sekilde sunulur.

**Access State:** \`data-access-state\` attribute'u ile erisim durumu bildirilir; \`title\` ile neden bilgisi saglanir.

**Bos Durum:** Empty bileseni ile preset eksik oldugunda erisilebilir geri bildirim verilir.

**Kontrast:** Tum metin ve etiketler WCAG 2.1 AA kontrast gereksinimlerini karsilar.`,
      },
    ],
    relatedComponents: ["ThemePresetGallery", "ThemePreviewCard", "Empty", "Text"],
  },

  ThemePresetGallery: {
    componentName: "ThemePresetGallery",
    summary: "ThemePresetGallery, tema preset koleksiyonunu gorsel onizleme kartlari ve metadata ile listeleyen ve secim yapmayi saglayan galeri bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ThemePresetGallery, tema presetlerini grid layout icinde ThemePreviewCard onizlemeleri ile sunar. Her preset icin mode, appearance, density ve contrast bilgilerini gosterir.

Kontrollü ve kontrolsuz secim modlarini destekler. Badge'ler ile default ve high contrast presetleri vurgular. Access control ile readonly veya disabled mod saglar.

\`\`\`tsx
<ThemePresetGallery
  presets={presetList}
  selectedPresetId="dark-compact"
  onSelectPreset={(id, preset) => handleSelect(id)}
  title="Tema Presetleri"
  compareAxes={["Appearance", "Density"]}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tema preset koleksiyonunu gorsel olarak listelemek icin
- Kullanicinin preset secimi yapmasi gereken ekranlarda
- Design lab veya tema yonetim sayfalarinda
- Preset ozelliklerini (mode, appearance, density) gorsel olarak gostermek icin

**Kullanmayin:**
- Iki preset karsilastirmasi icin — bunun yerine \`ThemePresetCompare\` kullanin
- Tek tema onizlemesi icin — bunun yerine \`ThemePreviewCard\` kullanin
- Tema ayarlarini duzenlemek icin — bunun yerine form bilisenleri kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Title]                                 │
│  [Description]                           │
│  [Compare Axes Badges]                   │
├──────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐ │
│  │ [Preview Card]  │ │ [Preview Card]  │ │
│  │ [Label] [Badges]│ │ [Label] [Badges]│ │
│  │ Mode|Appearance │ │ Mode|Appearance │ │
│  │ Density|Contrast│ │ Density|Contrast│ │
│  └─────────────────┘ └─────────────────┘ │
└──────────────────────────────────────────┘
\`\`\`

1. **Baslik ve Aciklama** — Galeri baslik ve tanim metni
2. **Compare Axes** — Badge ile gosterilen karsilastirma eksenleri
3. **Preset Kartlari** — Her biri ThemePreviewCard, etiket, badge'ler ve metadata icerirler
4. **Metadata Grid** — Mode, Appearance, Density, Contrast bilgi kutulari
5. **Empty State** — Preset bulunamadiginda bos durum gosterimi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Kontrollü mod kullanin.** \`selectedPresetId\` ve \`onSelectPreset\` ile secim durumunu ust bilesende yonetin.

**Preset metadata'sini eksiksiz saglayin.** \`themeMode\`, \`appearance\`, \`density\` ve \`isHighContrast\` alanlari dolu olmali.

**Default preset'i isaretleyin.** \`isDefaultMode: true\` ile varsayilan preset badge ile vurgulanir.

**Compare axes kullanin.** \`compareAxes\` prop'u ile kullaniciya presetler arasi farklarin hangi eksenlerde oldugunu gosterin.

**Access control uygulayin.** Sadece goruntuleme gerekiyorsa \`access="readonly"\` kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Metadata'siz preset listesi gostermek**
Kullanici presetler arasindaki farklari goremez; mode, appearance ve density bilgileri olmali.

**❌ Cok fazla preset'i tek sayfada gostermek**
10'dan fazla preset kullaniciyi bunaltir; gruplama veya filtreleme ekleyin.

**❌ Secim geri bildirimini atlayip gecmek**
Secilen preset gorsel olarak vurgulanmali; \`aria-current\` ile isaretlenmeli.

**❌ Bos durum mesajini ozellestirmemek**
Varsayilan bos durum mesaji yerine baglamina uygun bir mesaj saglayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elemani ile sarili; \`data-component="theme-preset-gallery"\` ile tanimlanir.

**Secim:** Secilen preset \`aria-current="true"\` ile isaretlenir; ekran okuyuculara aktif secim bildirilir.

**Klavye:** Preset butonlari Tab ile odaklanabilir, Enter/Space ile secilebilir.

**Disabled Durum:** \`access="disabled"\` veya \`"readonly"\` durumda butonlar tiklanamaz; gorsel olarak belirtilir.

**Bos Durum:** Empty bileseni ile preset bulunamadiginda erisilebilir geri bildirim saglanir.`,
      },
    ],
    relatedComponents: ["ThemePresetCompare", "ThemePreviewCard", "Badge", "Empty"],
  },

  ThemePreviewCard: {
    componentName: "ThemePreviewCard",
    summary: "ThemePreviewCard, bir tema preset'inin minyatur gorsel onizlemesini sunan swatch kartidir. Tema secim arayuzlerinde preset gorsellerini temsil eder.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ThemePreviewCard, mevcut temanin gorsel ozelliklerini (renkler, yuzeyler, tipografi) minyatur bir kart icinde yansitir. Tema tokenlarini (\`--surface-default\`, \`--action-primary\`, \`--text-primary\` vb.) kullanarak canli onizleme saglar.

\`selected\` durumunda onay isareti ve vurgu kenarligi gosterir. \`localeText\` ile tum metin etiketleri lokalize edilebilir.

\`\`\`tsx
<ThemePreviewCard selected />
<ThemePreviewCard
  localeText={{
    titleText: "Baslik metni",
    secondaryText: "Ikincil metin",
    saveLabel: "Kaydet",
    selectedLabel: "Secili tema onizlemesi",
  }}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tema secim arayuzlerinde preset onizlemesi olarak
- ThemePresetGallery icinde preset gorseli olarak
- ThemePresetCompare icinde karsilastirma gorseli olarak
- Tema yonetim sayfalarinda kucuk tema swatch'i olarak

**Kullanmayin:**
- Tam boyutlu tema onizlemesi icin — bunun yerine canli preview kullanin
- Renk paleti gosterimi icin — bunun yerine ozel swatch biliseni kullanin
- Dekoratif gorsel olarak — bunun yerine uygun gorsel biliseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────┐
│  [✓ Selected Badge?]    (sag ust)
│  ┌──────────────────────┐    │
│  │  [Navbar Placeholder]│    │
│  │  [Title Text]        │    │
│  │  [Secondary Text]    │    │
│  │         [Save Button]│    │
│  └──────────────────────┘    │
│  [Progress Bar Placeholder]  │
└──────────────────────────────┘
\`\`\`

1. **Container** — Rounded border, tema yuzey rengi arkaplan
2. **Selected Badge** — Secili durumda sag ustte onay isareti
3. **Inner Surface** — Muted yuzey uzerinde minyatur UI elemanlari
4. **Title / Secondary Text** — Tema tipografi ve renk tokenlarini yansitan metinler
5. **Save Button** — Primary action renk tokenini gosteren minyatur buton
6. **Progress Bar** — Muted yuzey rengini gosteren placeholder cubuk`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Tema tokenlari ile canli onizleme saglayin.** Kart, CSS custom property'leri kullanarak aktif temanin gorselini canli yansitir.

**\`localeText\` ile lokalize edin.** Farkli diller icin tum metin etiketlerini \`localeText\` prop'u ile saglayin.

**\`selected\` durumunu dogru yonetin.** Secili preset gorsel olarak vurgulanmali; onay isareti ekran okuyuculara bildirilmeli.

**Kucuk boyutda kullanin.** ThemePreviewCard minyatur onizleme icin tasarlanmistir; buyuk boyutlarda kullanmayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tema tokenlari disinda sabit renkler kullanmak**
Kart tema degistiginde guncellenmelidir; sabit renkler canli onizlemeyi bozar.

**❌ \`selectedLabel\` saglamadan \`selected\` kullanmak**
Ekran okuyuculari secili durumu goremez; \`localeText.selectedLabel\` ile erisilebilirlik saglayin.

**❌ Buyuk boyutlarda kullanmak**
ThemePreviewCard minyatur onizleme icindir; tam boyutlu tema onizlemesi icin ozel bilesen kullanin.

**❌ Tiklanabilir yapmak icin direkt onClick eklemek**
ThemePreviewCard'i ThemePresetGallery icinde kullanin; galeri secim mantigi ile tiklanabilirlik saglanir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Secili Durum:** \`selected\` aktifken onay isareti \`aria-hidden="true"\` ile gizlenir ve \`sr-only\` metin ile ekran okuyuculara bildirilir.

**Kontrast:** Tema tokenlari ile render edildigi icin kontrast aktif temanin token degerlerine baglidir.

**Dekoratif Ogeler:** Progress bar ve navbar placeholder'lari dekoratiftir; ek ARIA isaretleme gerektirmez.

**Lokalizasyon:** \`localeText\` ile tum metin etiketleri lokalize edilebilir; farkli dillerde erisilebilirlik korunur.`,
      },
    ],
    relatedComponents: ["ThemePresetGallery", "ThemePresetCompare"],
  },
};
