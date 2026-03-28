import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  RecommendationCard: {
    componentName: "RecommendationCard",
    summary: "RecommendationCard, AI tarafindan uretilen onerileri baslik, ozet, gerekce, guven gostergesi ve aksiyon butonlari ile sunan kart bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `RecommendationCard, bir AI onerisini yapisal olarak sunar. Oneri turu badge'i, guven seviyesi (\`ConfidenceBadge\`), baslik, ozet, gerekce (rationale) listesi, kaynak referanslari ve birincil/ikincil aksiyon butonlari icerir.

Uc farkli ton destekler: \`info\` (bilgilendirme), \`success\` (olumlu), \`warning\` (dikkat). Compact mod ile daha siki gorunum saglar.

\`\`\`tsx
<RecommendationCard
  title="Baslik Iyilestirme Onerisi"
  summary="SEO performansini artirmak icin baslik yapisini degistirin."
  recommendationType="SEO"
  confidenceLevel="high"
  confidenceScore={92}
  sourceCount={8}
  rationale={["Anahtar kelime yogunlugu dusuk", "Baslik uzunlugu optimal degil"]}
  citations={["Google SEO Rehberi", "Ahrefs Raporu"]}
  tone="success"
  onPrimaryAction={() => console.log("Uygulandi")}
  onSecondaryAction={() => console.log("Inceleniyor")}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI tarafindan uretilen onerileri kullaniciya sunmak icin
- Oneri gerekceleri ve kaynak referanslari birlikte gosterilecekse
- Uygula/Incele gibi iki asamali aksiyon akislarinda
- AIGuidedAuthoring recipe icerisinde alt bilesen olarak

**Kullanmayin:**
- Bilgilendirme mesajlari icin — bunun yerine \`Alert\` kullanin
- Basit durum kartlari icin — bunun yerine \`Card\` kullanin
- Liste ogeleri icin — bunun yerine \`ListItem\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Type Badge] [ConfidenceBadge] [Badges] │
│  [Baslik]                                │
│  [Ozet]                                  │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ Why this recommendation          │    │
│  │ • Gerekce 1                      │    │
│  │ • Gerekce 2                      │    │
│  └──────────────────────────────────┘    │
│                                          │
│  [Citation Badges]                       │
│  [Primary Button]  [Secondary Button]    │
│  [Footer Note]                           │
└──────────────────────────────────────────┘
\`\`\`

1. **Container** — \`article\` elemani; rounded-xs border, surface-muted arkaplan
2. **Badge Satirı** — Oneri turu, guven gostergesi ve ek badge'ler
3. **Baslik & Ozet** — Onerinin icerigini ozetler
4. **Gerekce Paneli** — Madde isaretli gerekce listesi
5. **Citations** — Kaynak referans badge'leri
6. **Aksiyonlar** — Apply (uygula) ve Review (incele) butonlari
7. **Footer Note** — Opsiyonel ek bilgi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Guven seviyesini somut verilerle destekleyin.** \`confidenceScore\` ve \`sourceCount\` degerleri seffaflik saglar.

**Gerekce listesini 2-4 madde ile sinirlandin.** Cok fazla gerekce odaği dagitir.

**Ton'u oneri niteligine gore secin.** Olumlu oneriler icin \`success\`, dikkat gerektiren icin \`warning\`, genel icin \`info\` kullanin.

**Aksiyon etiketlerini anlamli yapin.** "Apply" yerine "Baslik Guncelle" gibi spesifik etiketler kullanin.

**Compact mod'u liste gorunumlerinde kullanin.** Birden fazla oneri kartı yan yana gosterilecekse \`compact={true}\` ile alan kazanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Gerekce olmadan oneri sunmak**
Kullanicilar neden bu onerinin yapildigini bilmek ister; \`rationale\` alanini doldurun.

**❌ Guven skoru olmadan yuksek seviye gostermek**
\`confidenceLevel="high"\` kullanirken \`confidenceScore\` ile numerik deger de saglayin.

**❌ Aksiyon callback'i tanimlamadan buton gostermek**
\`onPrimaryAction\` ve \`onSecondaryAction\` tanimlanmadan butonlar islevsiz kalir.

**❌ Tek bir kart icin cok fazla badge kullanmak**
2-3 badge'den fazlasi gorsel karisiklik yaratir; en onemli bilgileri on plana cikarin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<article>\` elemani ile sarili; oneri icerik blogu olarak isaretlenir.

**Guven Gostergesi:** \`ConfidenceBadge\` \`aria-label\` ile guven seviyesini ekran okuyuculara bildirir.

**Butonlar:** Birincil ve ikincil butonlar standart \`<button>\` elemani; Tab ile odaklanabilir, Enter/Space ile etkinlesir.

**Gerekce Listesi:** \`<ul>\`/\`<li>\` ile semantik liste olarak isaretlenir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir. Disabled durumda butonlar tiklanamaz.`,
      },
    ],
    relatedComponents: ["AIGuidedAuthoring", "ConfidenceBadge", "Badge", "Button"],
  },

  ConfidenceBadge: {
    componentName: "ConfidenceBadge",
    summary: "ConfidenceBadge, AI ciktisinin guven seviyesini renkli badge ile gorselleyen kompakt gosterge bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ConfidenceBadge, bir AI sonucunun guvenilirligini dort seviyede (\`low\`, \`medium\`, \`high\`, \`very-high\`) gorsellestirir. Opsiyonel olarak numerik skor yuzdesi ve kaynak sayisi gosterir.

Badge renkleri seviyeye gore otomatik ayarlanir: \`low\` → warning, \`medium\` → info, \`high\`/\`very-high\` → success. Compact mod ile skor ve seviye bilgisini dar alanlarda gosterir.

\`\`\`tsx
<ConfidenceBadge level="high" score={92} sourceCount={8} />
<ConfidenceBadge level="low" compact />
<ConfidenceBadge level="medium" score={65} sourceCount={3} showScore={false} />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI uretimi icerigin guvenilirligini gostermek icin
- Oneri kartlari, yazim yardimcilari ve analiz sonuclarinda
- Kaynak sayisi ile seffaflik saglanmasi gerektiginde
- Tablo veya liste icerisinde kompakt guven gostergesi olarak

**Kullanmayin:**
- Genel durum gostergesi icin — bunun yerine \`Badge\` kullanin
- Ilerleme gostergesi icin — bunun yerine \`ProgressBar\` kullanin
- Sayisal metrik gosterimi icin — bunun yerine \`Statistic\` veya \`Metric\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────┐
│  [Seviye Etiketi] · [Skor%] ·   │
│  [Kaynak Sayisi]                 │
└──────────────────────────────────┘
\`\`\`

1. **Badge Container** — \`Badge\` bileseni; seviyeye gore renk tonu
2. **Seviye Etiketi** — "Low confidence", "Medium confidence" vb. veya ozel \`label\`
3. **Skor Yuzdesi** — \`score\` degeri normalize edilmis yuzde (0-100)
4. **Kaynak Sayisi** — "N sources" formatinda; compact modda gizlenir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Seviye ile skoru tutarli tutun.** \`level="high"\` ise skor 70+ olmalidir; uyumsuz degerler kullaniciyi yaniltir.

**Kaynak sayisini saglayin.** \`sourceCount\` seffaflik icin onemlidir; kullanici kac kaynaga dayaldigini gormek ister.

**Compact mod'u dar alanlarda tercih edin.** Tablo hücreleri veya badge yiginlarinda \`compact={true}\` kullanin.

**showScore ile goruntüyü kontrol edin.** Skor gosterimi gereksizse \`showScore={false}\` ile gizleyin.

**Ozel label ile baglamsal metin kullanin.** \`label\` prop'u ile "Model guven skoru" gibi aciklayici metin verin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Seviye ve skor arasinda uyumsuzluk**
\`level="high"\` ile \`score={30}\` gibi celiskili degerler kullaniciyi yaniltir.

**❌ Her yerde non-compact mod kullanmak**
Dar alanlarda (tablo, badge grubu) compact kullanmazsaniz tasma sorunu yasanir.

**❌ Kaynak sayisi olmadan yuksek guven gostermek**
\`sourceCount\` olmadan yuksek guven iddasi seffaflik ilkesine aykiridir.

**❌ Dekoratif amacla kullanmak**
ConfidenceBadge yalnizca AI ciktisinin guvenilirligini gostermek icin tasarlanmistir; genel badge olarak kullanmayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** \`aria-label\` ile guven seviyesi etiketi ekran okuyuculara aktarilir (orn. "High confidence").

**Data Attribute:** \`data-confidence-level\` ile seviye programatik olarak okunabilir.

**Kontrast:** Badge renk tonlari (warning, info, success) WCAG 2.1 AA minimum kontrast oranini karsilar.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` durumda bilesen render edilmez.

**Klavye:** Badge tek basina etkilesimli degildir; etkilesim gerekiyorsa bir buton icine sarin.`,
      },
    ],
    relatedComponents: ["Badge", "RecommendationCard", "AIGuidedAuthoring"],
  },

  CitationPanel: {
    componentName: "CitationPanel",
    summary: "CitationPanel, kaynak seffafligi icin alinti parcalarini, kaynak bilgilerini ve tur etiketlerini tek bir panel yuzeyinde listeleyen bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `CitationPanel, AI ciktisinin dayandigi kaynaklari yapisal olarak listeler. Her kaynak ogesi; baslik, alinti parcasi (excerpt), kaynak bilgisi (source), konum referansi (locator) ve kaynak turu (\`policy\`, \`doc\`, \`code\`, \`log\`, \`dataset\`) icerir.

Secim destegi ile aktif kaynagi vurgulama ve detay acma senaryolarina uyum saglar. Bos durum icin ozellestirilmis mesaj sunar.

\`\`\`tsx
<CitationPanel
  title="Kaynaklar"
  items={[
    { id: "c1", title: "Veri Koruma Politikasi", excerpt: "Kisisel veriler...", source: "Compliance DB", kind: "policy", locator: "Bolum 3.2" },
    { id: "c2", title: "API Dokumantasyonu", excerpt: "Endpoint tanimi...", source: "Dev Portal", kind: "doc" },
  ]}
  activeCitationId="c1"
  onOpenCitation={(id) => console.log("Kaynak acildi:", id)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI ciktisinin dayandigi kaynaklari seffaf olarak gostermek icin
- Onay surecleri icerisinde kanit referanslarini listelemek icin
- Alinti parcalari ile kaynak dogrulamasini kolaylastirmak icin
- ApprovalReview recipe icerisinde alt bilesen olarak

**Kullanmayin:**
- Basit link listesi icin — bunun yerine \`List\` veya \`LinkList\` kullanin
- Dosya listesi icin — bunun yerine \`FileList\` kullanin
- Genel icerik kartlari icin — bunun yerine \`Card\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Baslik]                                │
│  [Aciklama]                              │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ [Kind Badge] [Locator Badge]     │    │
│  │ [Kaynak Basligi]                 │    │
│  │ [Kaynak Bilgisi]                 │    │
│  │ ┌────────────────────────────┐   │    │
│  │ │ Alinti Parcasi (excerpt)   │   │    │
│  │ └────────────────────────────┘   │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ [Bir sonraki kaynak...]          │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
\`\`\`

1. **Container** — \`section\` elemani; premium yuzeyli rounded-xs border
2. **Baslik & Aciklama** — Panel amacini ozetler
3. **Kaynak Karti** — Tiklanabilir veya statik kaynak ogesi
4. **Kind Badge** — Kaynak turu (policy, doc, code, log, dataset)
5. **Locator Badge** — Kaynaktaki konum referansi
6. **Baslik & Source** — Kaynak adi ve kaynak bilgisi
7. **Excerpt** — Alinti parcasi; ozel bir ic kartta sunulur
8. **Bos Durum** — \`Empty\` bileseni ile ozellestirilmis mesaj`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her kaynaga anlamli baslik ve source verin.** Kullanicilar kaynagi hizla tanimlayabilmelidir.

**Kind alanini dogru secin.** \`policy\` politika belgeleri, \`doc\` genel dokumantasyon, \`code\` kod parcalari, \`log\` sistem kayitlari, \`dataset\` veri setleri icin kullanilir.

**Locator ile kesin konum belirtin.** "Bolum 3.2", "Satir 45-67" gibi referanslar dogrulama hizini arttirir.

**Excerpt'i kisa ve odakli tutun.** Alinti parcasi 2-3 cumleyi gecmemelidir.

**Bos durum mesajini ozellestirin.** \`emptyStateLabel\` ile "Henuz kaynak eklenmedi" gibi baglamsal mesaj verin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Excerpt olmadan kaynak listelemek**
Alinti parcasi olmadan kaynak dogrulamasi yapilamaz; her ogeye \`excerpt\` ekleyin.

**❌ Cok fazla kaynak yuklemek**
10-15 kaynaktan fazlasi icin sayfalama veya filtreleme ekleyin.

**❌ Kind belirtmeden kullanmak**
Kaynak turu badge'i kullaniciyi hizli yonlendirir; \`kind\` alanini doldurun.

**❌ Secim callback'i olmadan aktif durum gostermek**
\`activeCitationId\` kullaniyorsaniz \`onOpenCitation\` callback'ini de tanimlayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elemani ile sarili; kaynak ogeleri \`<button>\` veya \`<div>\` olarak render edilir.

**Secim:** Aktif kaynak \`aria-current="true"\` ile isaretlenir.

**Klavye:** Tiklanabilir kaynak ogeleri Tab ile odaklanabilir, Enter/Space ile etkinlestirilir.

**Disabled:** \`access="disabled"\` veya \`"readonly"\` durumda kaynak ogeleri tiklanamaz; gorsel olarak \`opacity-70\` ve \`cursor-not-allowed\` ile belirtilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.`,
      },
    ],
    relatedComponents: ["ApprovalReview", "Badge", "Empty"],
  },

  CommandHeader: {
    componentName: "CommandHeader",
    summary: "CommandHeader, MenuBar primitive uzerine kurulu arama oncelikli komut yuzeyidir. Recent roots, favorites ve submenu aksiyonlarini one cikaran search/command header recipe sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `CommandHeader, MenuBar bileseni uzerine insa edilmis bir recipe'dir. Arama (search handoff), son erisilen ogeler (recent roots) ve favori yonetimi davranislarini tek bir navigasyon cubugunda birlestirir.

Workspace header, ops command bar ve ghost utility gibi preset turleriyle farkli kullanim senaryolarina uyum saglar. Submenu destegi, badge, ikon ve klavye navigasyonu icerir.

\`\`\`tsx
<MenuBar
  preset="ops_command_bar"
  routes={routes}
  activeValue={activeRoute}
  onSelect={handleSelect}
  searchable
  favoritable
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulama genelinde arama oncelikli navigasyon cubugu olusturmak icin
- Kullanicinin son eristigi sayfalari (recent roots) hizli erisime sunmak icin
- Favori oge yonetimi gerektiren komut yuzeylerinde
- Ops/admin panellerinde hizli komut handoff akislarinda

**Kullanmayin:**
- Basit sayfa navigasyonu icin — bunun yerine \`NavigationRail\` veya \`Tabs\` kullanin
- Sadece arama kutusu gerekiyorsa — bunun yerine \`SearchInput\` kullanin
- Mobil alt navigasyon icin — bunun yerine \`BottomNavigation\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌───────────────────────────────────────────────────────┐
│  [Search]  [Primary Items]  [Secondary]  [Utility]   │
│            [Submenu Surface ▼]                        │
└───────────────────────────────────────────────────────┘
\`\`\`

1. **Search Alani** — Arama handoff tetikleyicisi; komut kesfini baslatir
2. **Primary Items** — Ana navigasyon ogeleri; ikon, etiket ve badge icerirler
3. **Secondary Items** — Ikincil navigasyon gruplari
4. **Utility Items** — Ayarlar, profil gibi yardimci ogeler
5. **Submenu Surface** — Alt menu yüzeyi; baslik, aciklama, meta ve footer icerirler
6. **Favorites** — Favorilere ekleme/cikarma toggle'i`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Arama onceligi verin.** Search handoff, command header'in ana deger onerisidir; her zaman gorunur tutun.

**Recent roots'u sinirli tutun.** Son erisilen ogeleri 5-8 oge ile sinirlandirin; cok fazla oge karmasa yaratir.

**Preset secimi yapin.** \`workspace_header\`, \`ops_command_bar\` veya \`ghost_utility\` arasindan kullanim senaryonuza uygun olani secin.

**Klavye navigasyonu test edin.** Tab, Ok tuslari ve Enter ile tum ogeler arasinda gezinilebildiginden emin olun.

**Submenu icerigini zenginlestirin.** \`menuSurfaceTitle\`, \`menuSurfaceDescription\` ve \`menuSurfaceMeta\` ile kullaniciya daha fazla baglam sunun.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla primary item eklemek**
Navigasyon cubugu tasar ve kullanici odagini dagatir. 5-7 primary item ideal.

**❌ Arama alanini gizlemek**
Command header'in ana amaci arama oncelikli kesfetmedir; aramay gizlemek deger kaybina yol acar.

**❌ Favorileri kontrolsuz birakmak**
Favori durumunu state'te yonetmeyin; sunucu ile senkronize edin.

**❌ Submenu'suz karmasik hiyerarsiler kurmak**
Derin navigasyon yapilarinda submenu surface kullanmazsaniz kullanici kaybolur.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Klavye:** Tab ile ogeler arasi gezinme, Ok tuslari ile submenu navigasyonu, Enter/Space ile etkinlestirme destekler.

**Rol:** \`role="menubar"\` ve \`role="menuitem"\` ile ARIA menubar pattern'ini uygular.

**Aktif Durum:** Aktif oge \`aria-current="true"\` ile isaretlenir.

**Submenu:** Alt menuler \`aria-expanded\` ile acik/kapali durumu bildirir.

**Arama:** Search alani \`aria-label\` ile erisilebilir sekilde etiketlenir.`,
      },
    ],
    relatedComponents: ["MenuBar", "NavigationRail", "Tabs", "SearchInput"],
  },

  CommandWorkspace: {
    componentName: "CommandWorkspace",
    summary: "CommandWorkspace, arama oncelikli komut yuzeyi, son calisma kuyrugu ve aksiyon odakli sonuc panelini tek sayfa shell icinde birlestiren template recipe'dir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `CommandWorkspace, PageLayout uzerine kurulu bir sayfa sablonudur. Search-first is akisi, recent work queue ve action-ready result panelini ayni sayfa icinde bir araya getirir.

\`pageWidth\`, \`stickyHeader\` ve \`responsiveDetailCollapse\` prop'lari ile esneklik saglar. Genis arama ve sonuc paneli icin \`wide\` genislik onerilir.

\`\`\`tsx
<PageLayout
  pageWidth="wide"
  stickyHeader
  title="Komut Merkezi"
  filterBar={<FilterBar />}
  detail={<ResultPanel />}
>
  <RecentWorkQueue />
</PageLayout>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Arama oncelikli is akisi gerektiren admin panellerinde
- Son calismalar kuyrugunu ve sonuc panelini birlikte gostermek icin
- Hizli komut handoff ve kesfetme gerektiren operasyon ekranlarinda
- Command bar + tablo + detay paneli birlesiminde

**Kullanmayin:**
- Basit CRUD liste sayfalarinda — bunun yerine \`CrudTemplate\` kullanin
- Dashboard/ozet ekranlarinda — bunun yerine \`DashboardTemplate\` kullanin
- Ayarlar sayfalarinda — bunun yerine \`SettingsTemplate\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Sticky Search Header]                  │
├──────────────────────────────────────────┤
│  [Recent Work Queue]  │  [Result Panel]  │
│  (main content)       │  (detail rail)   │
│                       │                  │
└──────────────────────────────────────────┘
\`\`\`

1. **Sticky Search Header** — Scroll sirasinda sabit kalan arama ve filtre cubugu
2. **Recent Work Queue** — Son erisilen oge listesi; hizli erisim saglar
3. **Result Panel** — Secilen komutun sonuclarini gosteren detay paneli
4. **Page Shell** — PageLayout ile saglanan responsive sayfa iskeleti`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Sticky header kullanin.** Arama cubugu her zaman gorunur olmali; \`stickyHeader: true\` varsayilan degerdir.

**Wide genislik tercih edin.** Arama sonuclari ve detay paneli icin \`pageWidth="wide"\` yeterli alan saglar.

**Recent queue'yu kisa tutun.** Son calismalar listesini 10-15 oge ile sinirlayin.

**Responsive collapse aktif edin.** Kucuk ekranlarda detay paneli otomatik collapse olmali; \`responsiveDetailCollapse: true\` kullanin.

**Sonuc panelinde aksiyon butonlari sunun.** Kullanici sonucu gorup hemen aksiyon alabilmeli.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Arama alanini sticky yapmamak**
Kullanici scroll edince arama erisimini kaybeder; command workspace'in temel deger onerisi zayiflar.

**❌ Dar genislik kullanmak**
\`pageWidth="default"\` ile arama sonuclari ve detay paneli sikisir; \`wide\` veya \`full\` tercih edin.

**❌ Recent queue'yu sinirsiz birakmak**
Cok fazla oge performans ve okunabilirlik sorunlarina yol acar.

**❌ Detay panelini mobilde gizlememek**
Kucuk ekranda iki panel yan yana sikisir; \`responsiveDetailCollapse\` kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** PageLayout \`<main>\` ve \`<aside>\` landmark'lari ile icerik bolumlerini ayirir.

**Arama:** Sticky search header \`aria-label\` ile erisilebilir sekilde isaretlenir.

**Klavye:** Tab ile arama, recent queue ve result panel arasinda gezinme desteklenir.

**Responsive:** Collapse durumunda icerik gizlenmez; accordion veya tab ile erisim korunur.

**Focus Yonetimi:** Komut secildikten sonra focus result paneline aktarilir.`,
      },
    ],
    relatedComponents: ["PageLayout", "FilterBar", "SummaryStrip", "TableSimple", "Tabs"],
  },

  CrudTemplate: {
    componentName: "CrudTemplate",
    summary: "CrudTemplate, filtre cubugu, ozet metrikleri ve veri tablosunu tek CRUD shell icinde birlestiren liste ve yonetim sayfasi sablonudur.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `CrudTemplate, PageLayout uzerine kurulu bir sayfa sablonudur. Filter bar, summary metrics ve data table akisini standart bir CRUD (Create-Read-Update-Delete) shell icinde organize eder.

Farkli filtre modlari (\`search-bar\`, \`search-select\`, \`full-filter-bar\`), yogunluk ayarlari ve detail sidebar destegi sunar.

\`\`\`tsx
<PageLayout
  title="Kullanicilar"
  actions={<Button>Yeni Ekle</Button>}
  filterBar={<FilterBar />}
  contentHeader={<SummaryStrip items={metrics} />}
>
  <TableSimple columns={columns} data={users} />
</PageLayout>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Admin panellerinde kayit listesi ve yonetim ekranlarinda
- Filtre, arama ve toplu islem gerektiren tablo sayfalarinda
- Ozet metrikleri + tablo kombinasyonu gereken CRUD akislarinda
- Kullanici, urun, siparis gibi entity yonetim sayfalarinda

**Kullanmayin:**
- Dashboard veya KPI ozet ekranlarinda — bunun yerine \`DashboardTemplate\` kullanin
- Tek kayit detay sayfalarinda — bunun yerine \`DetailTemplate\` kullanin
- Ayarlar/konfigürasyon sayfalarinda — bunun yerine \`SettingsTemplate\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Breadcrumb]                            │
│  [Title]              [Actions]          │
├──────────────────────────────────────────┤
│  [Filter Bar]                            │
│  [Summary Metrics]                       │
├──────────────────────────────────────────┤
│  [Data Table]         │  [Detail Rail?]  │
│                       │                  │
└──────────────────────────────────────────┘
\`\`\`

1. **Header** — Baslik, breadcrumb ve aksiyon butonlari
2. **Filter Bar** — Arama, filtre ve siralama kontrolleri
3. **Summary Metrics** — SummaryStrip ile ozet istatistikler
4. **Data Table** — Ana veri tablosu; siralama, secim ve sayfalama destekli
5. **Detail Rail** (opsiyonel) — Secilen kaydin detay paneli`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Summary-first yaklasim benimseyin.** Tablo uzerinde SummaryStrip ile toplam kayit, filtreli sonuc gibi metrikleri gosterin.

**Filter bar'i her zaman saglayin.** CRUD listelerinde arama ve filtreleme temel gereksinimdir.

**Sticky header'i uzun tablolarda etkinlestirin.** \`stickyHeader: true\` ile header ve filtre cubugu scroll sirasinda sabit kalir.

**Detail rail'i ihtiyaca gore kullanin.** Satir tiklandiginda yan panel aciliyorsa \`detail\` prop'u ile ekleyin.

**Tam genislik icin \`wide\` veya \`full\` kullanin.** Admin tablolari icin varsayilan genislik yeterli olmayabilir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Summary metrikleri atlayip direkt tabloya gecmek**
Kullanici toplam kayit sayisini ve filtrelenmis sonuc bilgisini goremez.

**❌ Filtresiz uzun tablo gostermek**
Yuzlerce satir icinde arama yapamayan kullanici kaybolur.

**❌ Detail rail'i mobilde acik birakmak**
Kucuk ekranda tablo ve detay paneli yan yana sikisir; \`responsiveDetailCollapse\` kullanin.

**❌ Tablo aksiyonlarini sadece context menu'ye koymak**
Toplu islemler icin tablo uzerinde gorunur aksiyon butonlari saglayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** PageLayout ile \`<main>\` landmark'i otomatik saglanir; tablo \`<table>\` semantigi kullanir.

**Klavye:** Tab ile filtre, tablo ve aksiyonlar arasi gezinme; Ok tuslari ile tablo satirlari arasi navigasyon.

**Arama:** Filter bar'daki arama alani \`aria-label\` ile etiketlenir.

**Secim:** Tablo secim durumu \`aria-selected\` ile bildirilir.

**Sayfalama:** Sayfalama kontrolleri \`aria-label\` ile gorev aciklamasi tasir.`,
      },
    ],
    relatedComponents: ["PageLayout", "FilterBar", "SummaryStrip", "TableSimple"],
  },
};
