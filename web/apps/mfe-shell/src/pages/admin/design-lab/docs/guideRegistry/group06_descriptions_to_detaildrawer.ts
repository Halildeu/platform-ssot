import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  Descriptions: {
    componentName: "Descriptions",
    summary: "Descriptions, anahtar-deger ciftlerini grid duzende goruntuleyen metadata bilesenidir. Sutun sayisi, yogunluk, tonlama, span ve bos durum yonetimi destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Descriptions, yapilandirilmis metadata bilgilerini (anahtar-deger ciftleri) okunabilir bir grid duzende sunar. Her oge \`label\`, \`value\`, \`helper\`, \`tone\` ve \`span\` ozellikleri tasir.

1-3 sutun duzeni, \`comfortable\`/\`compact\` yogunluk modlari, kenarlıkli (\`bordered\`) gorunum, ton bazli sol kenarlık rengi (\`info\`, \`success\`, \`warning\`, \`danger\`) ve bos durum yonetimi desteklenir. \`<dl>\`/\`<dt>\`/\`<dd>\` semantik HTML yapisi kullanilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Detay sayfalarinda nesne ozelliklerini gostermek icin (profil bilgileri, siparis detaylari)
- Ozet kartlarinda anahtar-deger ciftlerini listelemek icin
- Form sonrasi onizleme ekranlarinda gonderilecek verileri goruntumek icin

**Kullanmayin:**
- Duzenlenebilir form alanlari icin — bunun yerine \`Form\` bilesenleri kullanin
- Uzun listeler icin — bunun yerine \`Table\` veya \`List\` kullanin
- Tek baslik-deger cifti icin — basit bir \`Text\` yeterlidir`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Baslik
  Aciklama
┌─────────────────┬─────────────────┐
│ Etiket          │ Etiket          │
│ Deger           │ Deger           │
│ Yardimci metin  │ Yardimci metin  │
├─────────────────┼─────────────────┤
│ Etiket (span=2)                   │
│ Deger                             │
└───────────────────────────────────┘
\`\`\`

1. **Container** — Baslik ve aciklama ile dis cerceve
2. **Grid** — \`<dl>\` ile CSS Grid duzeni (\`columns\` prop'una gore)
3. **Item** — Her anahtar-deger cifti; \`<dt>\` (etiket) + \`<dd>\` (deger/helper)
4. **Ton Kenarligi** — \`default\` disindaki tonlarda sol kenarlık rengi
5. **Span** — \`span\` prop'u ile birden fazla sutun kaplama`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Sutun sayisini icerige gore ayarlayin.** Kisa degerler icin 3 sutun, uzun degerler icin 1-2 sutun kullanin.

**\`span\` ile uzun degerleri yayın.** Aciklama veya adres gibi uzun degerler icin \`span: 2\` veya \`span: 3\` kullanin.

**\`helper\` ile ek bilgi saglayin.** Degerin altinda aciklayici veya yonlendirici metin ekleyin.

**Ton'u onemli verileri vurgulamak icin kullanin.** Kritik bilgileri \`danger\`, basarili durumlari \`success\` ile isaretleyin.

**\`bordered\` modunu yapili gorunum icin aktiflesirin.** Kenarlıkli mod gorsel ayrimı ve okunabilirgi artirir.

**Bos durum mesajini ozellestirin.** \`emptyStateLabel\` veya \`localeText\` ile turkce bos durum mesaji saglayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla oge eklemek (20+)**
Gorsel yogunluk okunabilirligi dusurur; gruplama veya sekmelerle organize edin.

**❌ Tum ogelere farkli ton atamak**
Renk karmasasi gorsel hiyerarsiyi bozar; ton'u anlamli durumlara ayirin.

**❌ Uzun degerleri \`span\` olmadan tek sutuna sıkıştırmak**
Metin tasar veya kesilir; \`span\` ile uygun alan saglayin.

**❌ Boş \`value\` icin fallback saglamadan kullanmak**
Bileseni otomatik olarak "—" gosterir ancak anlamli bir varsayilan deger tercih edilmelidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<dl>\`, \`<dt>\`, \`<dd>\` ile standart tanim listesi semantigi kullanilir. Ekran okuyucular anahtar-deger iliskisini dogru sekilde iletir.

**Baslik:** \`<h3>\` ile baslik hiyerarsisine uyumlu baslik kullanilir.

**Grid Duzeni:** CSS Grid ile gorusel dizen saglanirken semantik yapi korunur.

**Ton Gostergesi:** Sol kenarlık rengi ile gorsel ipucu saglanir; renk tek basina anlam tasimamali, \`helper\` ile aciklanmalidir.

**Bos Durum:** Veri yoksa anlamli bir bos durum mesaji goruntulenir.`,
      },
    ],
    relatedComponents: ["Card", "Table", "List", "KeyValue"],
  },

  Slider: {
    componentName: "Slider",
    summary: "Slider, belirli bir araliktan sayisal deger secimi icin kullanilan form alanidir. Min/max sinirlar, adim degeri, deger formatlama, label ve hata yonetimi destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Slider, native \`<input type="range">\` uzerine insa edilmis bir aralik secim bilesenidir. FieldControlShell ile sarilanarak label, description, hint ve error yonetimini standart hale getirir.

Kontrollü (\`value\` + \`onValueChange\`) ve kontrolsuz (\`defaultValue\`) modlari, \`min\`/\`max\`/\`step\` yapilandirmasi, \`valueFormatter\` ile ozel deger gosterimi, \`minLabel\`/\`maxLabel\` ile ucnokta etiketleri ve erisim kontrolu desteklenir. Mevcut deger bir badge ile gorsel olarak gosterilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Belirli bir araliktan sayisal deger secimi icin (ses seviyesi, fiyat araligi, yuzde)
- Kullanicinin gorsel olarak degeri ayarlamasi istendiginde
- Min/max sinirlari olan surekli veya adimli deger girisi icin

**Kullanmayin:**
- Hassas sayi girisi icin — bunun yerine \`NumberInput\` veya \`Input type="number"\` kullanin
- Iki uclu aralik secimi icin — bunun yerine \`RangeSlider\` kullanin
- Boolean acik/kapali secimi icin — bunun yerine \`Switch\` kullanin
- Kategori secimi icin — bunun yerine \`RadioGroup\` veya \`Select\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Label
┌──────────────────────────────────────┐
│  ═══════●══════════════   [42]       │
└──────────────────────────────────────┘
  0                              100
  (minLabel)                (maxLabel)
  Helper text / Error message
\`\`\`

1. **FieldControlShell** — Label, description, hint ve error yonetimi
2. **Frame** — Boyut ve ton'a gore stillendirilmis dis cerceve
3. **Range Input** — Native \`<input type="range">\` surukle-birak kaydirici
4. **Deger Badge** — Mevcut degeri gosteren etiket (\`valueFormatter\` ile ozellestrilebilir)
5. **Min/Max Etiketleri** — Alt kisimda aralik ucnoktalarini gosteren etiketler`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`valueFormatter\` ile anlamli deger gosterin.** Yuzde icin \`(v) => v + "%"\`, para birimi icin \`(v) => v + " TL"\` kullanin.

**\`minLabel\`/\`maxLabel\` ile ucnoktalari etiketleyin.** "Dusuk" / "Yuksek" gibi baglam saglayan etiketler ekleyin.

**\`step\` degerini amaca gore ayarlayin.** Yuzde icin \`step={1}\`, hassas olmayan degerler icin \`step={5}\` veya \`step={10}\` kullanin.

**Label ile amaci aciklayin.** "Deger" yerine "Ses Seviyesi" veya "Fiyat Araligi" gibi ozel etiketler kullanin.

**Hata mesajlarini aciklayici yapin.** "Gecersiz deger" yerine "Deger 10-90 arasinda olmalidir" yazin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok genis aralik ile kucuk adim kullanmak**
0-10000 araliginda \`step={1}\` ile hassas secim imkansizdir; sayi girisi ekleyin.

**❌ Label olmadan kullanmak**
Ekran okuyucular alani tanimlayamaz; her zaman \`label\` prop'u saglayin.

**❌ \`valueFormatter\` olmadan yuzde veya birim gostermek**
Kullanici "42" degerinin neyi temsil ettigini anlamaz; birim ekleyin.

**❌ \`disabled\` durumunu aciklama olmadan kullanmak**
Neden devre disi oldugunu \`accessReason\` ile belirtin.

**❌ Hassas sayi girisi icin tek basina slider kullanmak**
Slider yaklasik secim icindir; hassas deger girisi icin ek sayi alani gerekir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Native Semantik:** \`<input type="range">\` kullanildigi icin tarayicinin yerlesik ekran okuyucu destegi otomatik saglanir.

**ARIA:** \`aria-invalid\`, \`aria-readonly\`, \`aria-disabled\` ve \`aria-describedby\` ile hint/error mesajlari iliskilendirilir.

**Klavye:** Sol/Sag ok tuslari ile deger azaltilir/artirilir. Home/End ile min/max degere atlanir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (DOM'dan kaldirilir), \`readonly\` (degisiklik engellenir, \`cursor-default\`) ve \`disabled\` (\`cursor-not-allowed\`, \`opacity-70\`) modlari desteklenir. \`accessReason\` ile kisitlama nedeni \`title\` olarak gosterilir.

**Zorunlu Alan:** \`required\` prop'u ile \`required\` HTML attribute'u eklenir.`,
      },
    ],
    relatedComponents: ["Input", "NumberInput", "Switch", "ProgressBar"],
  },

  PageHeader: {
    componentName: "PageHeader",
    summary: "PageHeader, sayfa seviyesinde baslik, alt baslik, breadcrumb, etiketler, aksiyonlar ve footer alanlari sunan standart ust bilgi bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `PageHeader, her sayfanin ust kisminda tutarli bir baslik alani olusturur. Baslik, alt baslik, breadcrumb navigasyonu, avatar/ikon, etiketler (tags), aksiyonlar ve footer (sekmeler, metadata) slotlari icerir.

\`sticky\` prop'u ile sayfa kaydirmada sabit kalabilir. \`noBorder\` ile alt kenarlik kaldirilabilir. Tum slotlar \`ReactNode\` olarak esnek icerik kabul eder.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Her sayfanin ust kisminda tutarli baslik alani olusturmak icin
- Breadcrumb navigasyonu ile sayfa hiyerarsisini gostermek icin
- Sayfa seviyesi aksiyonlari (olustur, disa aktar) baslikla birlikte sunmak icin
- Sekmeler veya metadata bilgisi footer'da gostermek icin

**Kullanmayin:**
- Kart veya bolum basligi icin — bunun yerine \`Card\` veya \`SectionHeader\` kullanin
- Dialog/drawer basligi icin — ilgili bilesenin kendi baslik alani kullanilmalidir
- Ic ice baslik katmanlari icin — sayfa basina tek \`PageHeader\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌────────────────────────────────────────────┐
│  [Breadcrumb]                              │
│  [Avatar?] [Title] [Tags?]   [Actions →]   │
│            [Subtitle?]                     │
│  [Extra?]                                  │
│  [Footer? (Tabs / Metadata)]               │
└────────────────────────────────────────────┘
\`\`\`

1. **Breadcrumb** — Sayfa hiyerarsisini gosteren ust navigasyon
2. **Avatar** (opsiyonel) — Basligin solunda ikon veya gorsel
3. **Title** — Ana sayfa basligi (\`h1\`)
4. **Tags** (opsiyonel) — Baslik yaninda durum etiketleri
5. **Actions** (opsiyonel) — Sag tarafa hizalanmis aksiyon butonlari
6. **Subtitle** (opsiyonel) — Baslik altinda kisa aciklama
7. **Extra** (opsiyonel) — Baslik alani ile footer arasi ek icerik
8. **Footer** (opsiyonel) — Sekmeler veya metadata satiri`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her sayfada tek PageHeader kullanin.** Birden fazla PageHeader gorsel hiyerarsiyi bozar.

**Breadcrumb ile navigasyon baglamini saglayin.** Kullanicinin sayfa hiyerarsisindeki konumunu anlamasi icin breadcrumb kullanin.

**Aksiyonlari mantikli sirada dizin.** Birincil aksiyon sag tarafa, ikincil aksiyonlar sola yerlestirilmelidir.

**\`sticky\` modunu uzun sayfalarda kullanin.** Kullanicinin baslik ve aksiyonlara her zaman erisebilmesini saglar.

**Tags ile durumu gorsel olarak belirtin.** Aktif/pasif, taslak/yayinda gibi durumlari etiketlerle gosterin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Birden fazla PageHeader kullanmak**
Sayfa basina tek baslik alani olmalidir; ic bolumlerde \`SectionHeader\` tercih edin.

**❌ Breadcrumb olmadan derin sayfa hiyerarsisi olusturmak**
Kullanici nerede oldugunu anlamaz; breadcrumb ile yol gosterin.

**❌ Cok fazla aksiyon butonu eklemek**
Baslik alani kalabalik gorsel kaosa neden olur; ikincil aksiyonlari bir menu altinda toplayin.

**❌ Footer'i karmasik icerikle doldurmak**
Footer yalnizca sekmeler veya kisa metadata icin kullanilmalidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<header>\` elementi ile sayfa basligi semantigi saglanir.

**Baslik Hiyerarsisi:** Baslik \`<h1>\` olarak render edilir; sayfa basina tek \`h1\` kullanilmalidir.

**Breadcrumb:** Navigasyon \`<nav>\` ile sarilir; \`aria-current="page"\` aktif sayfa icin eklenir.

**Sticky:** Sabit baslik z-index ile diger icerikler uzerinde kalir; fokus yonetimi etkilenmez.

**Renk Kontrasti:** Tum metin ogeleri WCAG 2.1 AA minimum kontrast oranini (4.5:1) karsilar.`,
      },
    ],
    relatedComponents: ["PageLayout", "Breadcrumb", "Tabs", "Button"],
  },

  PageLayout: {
    componentName: "PageLayout",
    summary: "PageLayout, baslik, breadcrumb, filtre, icerik, detay paneli ve footer alanlarini tek bir yapida birlestiren tam sayfa iskelet bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `PageLayout, uygulamadaki sayfalar icin tutarli bir iskelet sunar. Baslik (title + description), breadcrumb, aksiyonlar, ikincil navigasyon, filtre cubugu, icerik header/toolbar, ana icerik, detay paneli ve footer alanlarini yonetir.

\`pageWidth\` ile genislik kontrolu (default, wide, full), \`stickyHeader\` ile sabit baslik, \`responsiveDetailCollapse\` ile responsive detay paneli daraltmasi desteklenir. \`createPageLayoutPreset\` ile \`content-only\`, \`detail-sidebar\` ve \`ops-workspace\` gibi hazir yapilandirmalar kullanilabilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Liste + detay duzeni gerektiren operasyonel sayfalarda
- Filtre cubugu ve icerik aracligi olan veri sayfalarinda
- Breadcrumb ve baslik ile standart sayfa yapisi olusturmak icin
- Detay panelinin responsive olarak daraltilmasi gereken durumlarda

**Kullanmayin:**
- Login, kayit gibi minimal sayfalarda — bunun yerine ozel layout kullanin
- Modal veya drawer ici icerik icin — bu bilesenler kendi layout'unu icerir
- Dashboard grid duzeni icin — bunun yerine \`Grid\` veya ozel layout kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌────────────────────────────────────────────┐
│  Header (breadcrumb, title, actions)       │
├────────────────────────────────────────────┤
│  Secondary Nav                             │
├────────────────────────────────────────────┤
│  Filter Bar                                │
│  Content Header / Toolbar                  │
│  ┌──────────────────┬────────────────┐     │
│  │  Main Content     │  Detail Panel  │     │
│  └──────────────────┴────────────────┘     │
├────────────────────────────────────────────┤
│  Footer                                    │
└────────────────────────────────────────────┘
\`\`\`

1. **Header** — Breadcrumb, baslik, aciklama ve aksiyonlar
2. **Secondary Nav** — Sekmeler veya ikincil navigasyon
3. **Filter Bar** — Filtreleme kontrollerini barindirir
4. **Content Header / Toolbar** — Icerik ustundeki baslik ve arac cubugu
5. **Main Content** — Ana icerik alani (\`children\`)
6. **Detail Panel** (opsiyonel) — Yan detay paneli, responsive daraltma destekli
7. **Footer** — Alt bilgi alani`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Preset kullanarak tutarlilik saglayin.** \`createPageLayoutPreset\` ile standart sayfa tipleri icin onceden yapilandirilmis ayarlar kullanin.

**\`pageWidth\` secimini icerige gore yapin.** Dar icerikler icin \`default\`, genis tablolar icin \`wide\` veya \`full\` kullanin.

**Detay paneli icin responsive daraltma aktifleyin.** \`responsiveDetailCollapse\` mobil cihazlarda kullanilabilirligi arttirir.

**Breadcrumb ile navigasyon baglamini koruyun.** \`createPageLayoutBreadcrumbItems\` ile kolay breadcrumb olusturun.

**\`stickyHeader\` ile uzun sayfalarda baslik erisimini saglayin.** Operasyonel sayfalarda basligin her zaman gorunmesi kullanici deneyimini iyilestirir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ PageLayout icinde PageLayout kullanmak**
Ic ice layout bilesenler gorsel ve yapisal sorunlara yol acar.

**❌ \`full\` genislikte dar icerik gostermek**
Genis bosluklar gorsel dengesizlik yaratir; icerige uygun genislik secin.

**❌ Detay panelini responsive daraltma olmadan kullanmak**
Mobil cihazlarda yatay tasma ve kullanilabilirlik sorunlari olusur.

**❌ Tum slotlari ayni anda doldurmak**
Karmasik sayfalar bile sadece gerekli slotlari kullanmali; gereksiz alanlar bos birakilmalidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<header>\` ve \`<footer>\` elementleri ile sayfa yapisi semantik olarak tanimlanir.

**Breadcrumb:** \`<nav aria-label>\` ile breadcrumb navigasyonu erisilebilir kilinir; \`aria-current="page"\` aktif sayfa icin eklenir.

**Landmark:** \`ariaLabel\` prop'u ile sayfa landmark olarak tanimlanabilir.

**Baslik Hiyerarsisi:** Baslik \`<h1>\` olarak render edilir; dogru baslik hiyerarsisi korunur.

**Responsive:** Detay paneli daraltmasi mobil cihazlarda icerik erisimini iyilestirir.`,
      },
    ],
    relatedComponents: ["PageHeader", "FilterBar", "SummaryStrip", "Tabs"],
  },

  FilterBar: {
    componentName: "FilterBar",
    summary: "FilterBar, yatay filtre kontrollerini, arama alanini, ek filtreler panelini ve aksiyonlari tek satirda organize eden filtre cubugu bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `FilterBar, veri listelerinin ustunde filtreleme kontrollerini duzenlemeye yarar. Birincil filtreler her zaman gorunurken, ikincil/gelismis filtreler acilir-kapanir bir "More filters" panelinde saklanabilir.

Arama slotu (solda), filtre kontrolleri (ortada), aksiyon butonlari (sagda) ve aktif filtre sayaci badge'i desteklenir. \`compact\` modu ile daha az padding uygulanir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tablo, liste veya grid uzerinde filtreleme kontrolleri sunmak icin
- Birincil ve gelismis filtreleri ayirmak icin
- Arama + filtreler + aksiyonlari tek satirda organize etmek icin

**Kullanmayin:**
- Tek bir arama alani icin — bunun yerine \`Input\` veya \`SearchInput\` kullanin
- Form icinde filtre duzeni icin — bunun yerine \`Form\` layout'u kullanin
- Navigasyon veya sekme secimi icin — bunun yerine \`Tabs\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│ [Search?] [Filters...] [More ▼ (badge)] [Actions]│
├──────────────────────────────────────────────────┤
│ [More Filters Panel (collapsible)]               │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Search** (opsiyonel) — En solda arama alani
2. **Primary Filters** — Her zaman gorunen filtre kontrolleri (\`children\`)
3. **More Filters Toggle** — Ek filtreleri acar/kapar; aktif filtre sayaci badge ile gosterilir
4. **Actions** (opsiyonel) — Sag tarafa hizalanmis aksiyon butonlari (Sifirla, Uygula)
5. **More Filters Panel** — Acilir-kapanir gelismis filtre alani`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**En cok kullanilan filtreleri birincil satirda gosterin.** Nadir kullanilan filtreleri "More filters" paneline tasiyarak gorsel karmasayi azaltin.

**Aktif filtre sayacini gosterin.** \`activeCount\` ile kullanicinin kac filtre uyguladigini bildirin.

**Sifirla aksiyonu ekleyin.** Kullanicinin tum filtreleri tek tikla temizlemesini saglayin.

**\`compact\` modunu yogun arayuzlerde kullanin.** Tablo veya dashboard iceriginde daha az dikey alan kaplar.

**Arama alanini sol tarafa yerlestirin.** \`search\` slotu ile tutarli yerlesim saglayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla filtre kontrolunu birincil satirda gostermek**
Gorsel yogunluk artarak kullanilabilirligi dusurur; fazla filtreleri \`moreFilters\` alanina tasiyiniz.

**❌ Aktif filtre sayacini gostermeden gizli filtreler barindirmak**
Kullanici aktif filtrelerin farkinda olmaz; \`activeCount\` her zaman saglanmalidir.

**❌ FilterBar'i form icerisinde kullanmak**
FilterBar bagimsiz filtreleme icin tasarlanmistir; form duzeninde kendi layout bilesenlerini kullanin.

**❌ Filtreleri aksiyonsuz birakmak**
Sifirla ve Uygula butonlari olmadan kullanici filtreleri yonetemez.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Klavye:** Tum filtre kontrolleri Tab ile erisilebilir; "More filters" butonu Enter/Space ile acilir.

**Focus:** Toggle butonu \`focus-visible\` ile gorunen fokus halkasi saglar.

**Animasyon:** Ek filtreler paneli \`animate-in\` ile yumusak gecis animasyonu kullanir.

**Badge:** Aktif filtre sayaci gorsel olarak gosterilir; ekran okuyucular buton etiketinden bilgi alir.

**Responsive:** Filtre kontrolleri \`flex-wrap\` ile dar ekranlarda alt satirlara sarilir.`,
      },
    ],
    relatedComponents: ["PageLayout", "Input", "Select", "Button"],
  },

  SummaryStrip: {
    componentName: "SummaryStrip",
    summary: "SummaryStrip, yatay KPI ve metrik kartlarini grid duzende gosteren ozet seridi bilesenidir. Ikon, trend badge, ton kenarligi ve not alanlari destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `SummaryStrip, sayfa veya bolum ustunde onemli metrikleri ve KPI'lari yatay kartlar halinde sunar. Her kart etiket, deger, not, trend badge ve ikon icerebilir.

\`columns\` prop'u ile 2, 3 veya 4 sutunlu grid duzeni ayarlanabilir. \`tone\` ile (info, success, warning) sol kenarlik rengi uygulanir. Baslik ve aciklama alanlari opsiyonel olarak ust kisimda gosterilebilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Dashboard veya detay sayfalarinda KPI'lari ozetlemek icin
- Sayfa basinda onemli metrikleri vurgulamak icin
- Durum veya trend bilgisi ile birlikte degerleri gostermek icin

**Kullanmayin:**
- Uzun veri listesi icin — bunun yerine \`Table\` veya \`List\` kullanin
- Tek bir istatistik karti icin — bunun yerine \`StatCard\` veya \`Card\` kullanin
- Detayli grafik icin — bunun yerine \`Chart\` bilesenleri kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  [Baslik?]
  [Aciklama?]
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ [Trend →]    │ [Trend →]    │ [Trend →]    │ [Trend →]    │
│ [Icon?]      │ [Icon?]      │ [Icon?]      │ [Icon?]      │
│ Etiket       │ Etiket       │ Etiket       │ Etiket       │
│ **Deger**    │ **Deger**    │ **Deger**    │ **Deger**    │
│ [Not?]       │ [Not?]       │ [Not?]       │ [Not?]       │
└──────────────┴──────────────┴──────────────┴──────────────┘
\`\`\`

1. **Baslik** (opsiyonel) — Seridin ust kisminda aciklayici baslik
2. **Aciklama** (opsiyonel) — Baslik altinda ek bilgi
3. **Kart** — Her bir metrik ogesi; kenarlıkli yuvarlatilmis kart
4. **Ton Kenarligi** — \`tone\` prop'una gore sol kenarlik rengi (info, success, warning)
5. **Trend Badge** — Sag ust kosede trend gostergesi
6. **Icon** (opsiyonel) — Metrik ikonu
7. **Etiket** — Metrigin adini tanimlayan kucuk metin
8. **Deger** — Buyuk ve kalin ana metrik degeri
9. **Not** (opsiyonel) — Degerin altinda ek aciklama`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Sutun sayisini metrik adedine gore secin.** 4 veya daha az metrik icin \`columns={4}\`, 2-3 metrik icin daha kucuk degerler kullanin.

**Ton'u anlamli durumlarda kullanin.** Basarili metrikleri \`success\`, uyari gerekenleri \`warning\`, bilgilendirme icin \`info\` secin.

**Trend badge ile degisimi gosterin.** Yuzde artis/azalis gibi trend bilgileri deger baglamini guclendirmek icin kullanin.

**Not alani ile ek bilgi saglayin.** Degerin neyi temsil ettigini veya hangi doneme ait oldugunu belirtin.

**Ikonlari tutarli kullanin.** Ya tum kartlarda ikon kullanin ya da hicbirinde; karisik kullanim gorsel dengesizlik yaratir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla metrik karti eklemek (8+)**
Gorsel yogunluk okunabilirligi dusurur; en onemli 4-6 metrigi secin.

**❌ Tum kartlara farkli ton atamak**
Renk karmasasi gorsel hiyerarsiyi bozar; ton'u anlamli durumlara ayirin.

**❌ Uzun deger metinleri kullanmak**
Kartlar kisa ve okunabilir degerler icin tasarlanmistir; uzun metinler icin \`Descriptions\` kullanin.

**❌ Trend badge olmadan yon belirten degerler gostermek**
Artis/azalis bilgisi trend badge ile gorsellestirilmeli, yalnizca sayi gosterilmemelidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Her kart \`<article>\` elementi ile sarilanir; bagimsiz icerik birimi olarak tanimlanir.

**Baslik:** Seri basligi \`<h3>\` ile hiyerarsiye uyumlu render edilir.

**Grid Duzeni:** CSS Grid ile gorsel dizen saglanir; ekran okuyucular dogrusal sirada icerik okur.

**Ton:** Sol kenarlik rengi gorsel ipucu saglar; renk tek basina anlam tasimamali, etiket ve deger ile desteklenmelidir.

**Responsive:** Grid sutunlari dar ekranlarda yigilanabilir; \`columns\` prop'u ile kontrol edilir.`,
      },
    ],
    relatedComponents: ["PageHeader", "DetailSummary", "Card", "Descriptions"],
  },

  DetailDrawer: {
    componentName: "DetailDrawer",
    summary: "DetailDrawer, sagdan kayan salt-okunur detay paneli bilesenidir. Baslik, alt baslik, etiketler, bolumler, sekmeler ve footer alanlari ile zengin icerik sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DetailDrawer, liste veya tablo satirina tiklandiginda ilgili kaydin detaylarini gosteren sagdan kayan bir paneldir. Baslik, alt baslik, etiketler, aksiyonlar, bolumler (sections), sekmeler (tabs) ve footer destekler.

\`size\` prop'u ile genislik (md, lg, xl, full) ayarlanabilir. Escape tusu ve backdrop tiklamasi ile kapatilabilir. Body scroll otomatik olarak kilitleninir. \`sections\` veya \`children\` ile icerik saglanabilir; legacy \`tabs\` prop'u ile sekmeli gorunum de desteklenir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tablo veya liste kaydinin detaylarini sayfadan ayrilmadan gostermek icin
- Salt-okunur detay goruntuleme icin (profil, siparis, log kaydı)
- Bolumlu veya sekmeli detay icerigi sunmak icin

**Kullanmayin:**
- Form veya duzenleme islemi icin — bunun yerine \`FormDrawer\` kullanin
- Kucuk onay veya bilgilendirme icin — bunun yerine \`Dialog\` veya \`Modal\` kullanin
- Tam sayfa detay gorunumu icin — bunun yerine ayri bir detay sayfasi kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────┐
│  [Title] [Tags?]    [Actions] ✕ │
│  [Subtitle?]                    │
├─────────────────────────────────┤
│  [Section Title]                │
│  [Section Content]              │
│  ───────────────                │
│  [Section Title]                │
│  [Section Content]              │
├─────────────────────────────────┤
│  [Footer?]                      │
└─────────────────────────────────┘
\`\`\`

1. **Backdrop** — Arkadaki karartilmis alan; tiklandiginda drawer kapanir
2. **Panel** — Sagdan kayan ana icerik alani
3. **Header** — Baslik, alt baslik, etiketler, aksiyonlar ve kapatma butonu
4. **Body** — Kaydirma destekli icerik alani; bolumler veya serbest icerik
5. **Sections** — Kenarlıkla ayrilmis icerik bolumleri
6. **Footer** (opsiyonel) — Alt aksiyon alani`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`size\` secimini icerik miktarina gore yapin.** Kisa detaylar icin \`md\`, zengin icerikler icin \`lg\` veya \`xl\` kullanin.

**Bolumleri mantikli gruplar halinde organize edin.** Iliskili bilgileri ayni bolumde, farkli kategorileri ayri bolumlerde gosterin.

**Aksiyonlari header'a yerlestirin.** Duzenle, sil gibi islemleri \`actions\` slotuna ekleyin.

**Footer'i onay veya navigasyon icin kullanin.** Alt aksiyon butanlari icin \`footer\` slotu idealdir.

**Salt-okunur icerik icin kullanin.** Duzenleme islemleri icin \`FormDrawer\` tercih edin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ DetailDrawer icinde form elementleri kullanmak**
Salt-okunur detay icin tasarlanmistir; form girisleri icin \`FormDrawer\` kullanin.

**❌ Cok fazla bolum eklemek (10+)**
Uzun kaydirma gerektiren icerik kullanilabilirligi dusurur; sekmelerle organize edin.

**❌ \`full\` boyutunu gereksiz kullanmak**
Tam genislik detay paneli modal gibi calisir; cogu durumda \`lg\` yeterlidir.

**❌ Kapatma mekanizmasi olmadan kullanmak**
Kullanici sikisilmis hisseder; Escape ve backdrop tiklamasini devre disi birakmayiniz.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Dialog Rolu:** \`role="dialog"\` ve \`aria-modal="true"\` ile modal dialog semantigi saglanir.

**Fokus Yonetimi:** Acildiginda panel otomatik olarak fokuslanir; Escape ile kapatilir.

**Body Scroll Kilitleme:** Acikken arkadaki icerik kaydirma devre disi birakilir.

**Klavye:** Escape tusu ile kapatma, Tab ile icerik icerisinde gezinme desteklenir.

**Etiket:** \`aria-label\` baslik string ise otomatik olarak uygulanir.`,
      },
    ],
    relatedComponents: ["FormDrawer", "Dialog", "Modal", "PageLayout"],
  },
};
