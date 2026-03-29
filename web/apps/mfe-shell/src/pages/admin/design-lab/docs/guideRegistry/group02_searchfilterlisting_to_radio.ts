import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  SearchFilterListing: {
    componentName: "SearchFilterListing",
    summary: "Arama, filtreleme, siralama, toplu secim ve sonuc listeleme islemlerini tek bir recipe kompozisyonunda birlestiren ust duzey sayfa bloku. PageHeader, FilterBar, FilterChips, SelectionBar, SortDropdown, SummaryStrip ve sonuc yuzeyini dikey bir akista birlestirir. Yukleme iskeleti, compact mod, dark mode ve zengin ARIA destegi sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `SearchFilterListing, karmasik liste sayfalarini standart bir yapiya oturtan bir **recipe bileseni**dir. Yedi ana katmandan olusur:

1. **PageHeader** — baslik, eyebrow, aciklama, meta bilgisi, durum badge'i ve aksiyonlar
2. **FilterBar + Toolbar** — arama, select ve diger filtre kontrolleri; sag tarafa toolbar ve reload aksiyonlari
3. **FilterChips** — aktif filtre chip'leri; tek tek kaldirilabilir veya toplu temizlenebilir
4. **SelectionBar** — secili oge sayisi, toplu aksiyon butonlari ve secimi temizleme
5. **SummaryStrip** — KPI kartlari (toplam, aktif, bekleyen gibi sayisal ozetler)
6. **SortDropdown** — siralama alani secimi ve yon degistirme (artan/azalan)
7. **Result Surface** — items listesi, ozel results renderer, totalCount badge'i veya contextual empty state

Her katman opsiyoneldir; yalnizca verilen prop'lara gore render edilir. \`access\` prop'u ile policy-temelli gorunurluk ve etkilesim kontrolu saglanir. Tum renkler CSS degiskenleri uzerinden tanimlanir ve **dark mode** uyumludur.

\`\`\`tsx
import { SearchFilterListing } from '@mfe/design-system';

// Tam ozellikli kullanim ornegi
<SearchFilterListing
  eyebrow="Envanter"
  title="Urun Listesi"
  description="Tum urunleri arayin, filtreleyin ve yonetin."
  actions={<Button>Yeni Urun</Button>}
  filters={<>
    <Input placeholder="Ara..." />
    <Select options={kategoriler} />
  </>}
  toolbar={<DensityToggle />}
  onReload={() => refetch()}
  activeFilters={[
    { key: "kategori", label: "Kategori", value: "Elektronik", onRemove: () => removeFilter("kategori") },
    { key: "durum", label: "Durum", value: "Aktif", onRemove: () => removeFilter("durum") },
  ]}
  onClearAllFilters={() => clearAllFilters()}
  sortOptions={[
    { key: "ad", label: "Urun Adi" },
    { key: "fiyat", label: "Fiyat" },
    { key: "tarih", label: "Eklenme Tarihi" },
  ]}
  activeSort={{ key: "tarih", direction: "desc" }}
  onSortChange={(key, direction) => setSort({ key, direction })}
  selectable
  selectedKeys={selectedIds}
  onSelectionChange={setSelectedIds}
  batchActions={<>
    <Button variant="danger" onClick={handleBulkDelete}>Sil</Button>
    <Button onClick={handleBulkExport}>Disa Aktar</Button>
  </>}
  totalCount={142}
  summaryItems={kpiItems}
  items={urunKartlari}
  loading={isLoading}
  size="compact"
  aria-label="Urun envanter listesi"
  role="region"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Politika envanteri, kullanici listesi veya varlik katalogu gibi **arama + filtre + sonuc** akisi gerektiren sayfalarda
- Ops triage kuyruklari, review handoff listeleri gibi operasyonel gorunumlerde
- Kaydedilmis gorunum kutuphanesi veya rapor filtreleme panellerinde
- Birden fazla KPI ozeti ve sonuc listesinin ayni sayfada gosterilmesi gerektiginde
- **Toplu islem gerektiren listelerde** — birden fazla ogeyi secip silme, disa aktarma veya durum guncelleme gibi batch aksiyon senaryolarinda
- **Siralanabilir sonuc listeleri** icin — fiyata, tarihe veya ada gore siralama gereken envanter, katalog veya raporlama sayfalarinda
- **Filtrelenmis envanter gorunumleri** icin — kullanicinin hangi filtreleri uyguladigini chip'lerle gormesi ve hizlica kaldirmasi gereken sayfalarda
- **Yogun veri listeleri** icin — \`size="compact"\` ile daha fazla veriyi ekrana sigdirmaniz gereken operasyonel panellerde

**Kullanmayin:**
- Tek bir veri tablosu yeterliyse — bunun yerine \`TableSimple\` veya \`AgGridServer\` kullanin
- Dashboard tarzinda birden fazla bagimsiz bolum varsa — bunun yerine \`PageLayout\` kullanin
- Detay/duzenleme formlari icin — bunun yerine \`DetailSummary\` veya \`FormDrawer\` kullanin
- Yalnizca filtre paneli gerekiyorsa — bunun yerine \`ReportFilterPanel\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `Bilesen yedi dikey katmandan olusur. Her katman bir \`panelClass\` ile sarmalanir:

\`\`\`
┌──────────────────────────────────────────────────┐
│  [eyebrow]                                       │
│  [title]                      [meta] [status]    │
│  [description]                       [actions]   │
│                          ← PageHeader            │
├──────────────────────────────────────────────────┤
│  ╔ FilterBar + Toolbar Panel ════════════════╗   │
│  ║ [filters...]    [filterExtra] │ [reload]  ║   │
│  ║                               │ [toolbar] ║   │
│  ╚═══════════════════════════════════════════╝   │
├──────────────────────────────────────────────────┤
│  ╔ FilterChips ══════════════════════════════╗   │
│  ║ [Kategori: X ✕] [Durum: Y ✕] [Tumunu     ║   │
│  ║                                temizle]   ║   │
│  ╚═══════════════════════════════════════════╝   │
├──────────────────────────────────────────────────┤
│  ╔ SelectionBar ═════════════════════════════╗   │
│  ║ (3) 3 oge secildi   [Sil] [Disa Aktar]   ║   │
│  ║                        [Secimi temizle]   ║   │
│  ╚═══════════════════════════════════════════╝   │
├──────────────────────────────────────────────────┤
│  ╔ SummaryStrip Panel ═══════════════════════╗   │
│  ║ [KPI 1]    [KPI 2]    [KPI 3]            ║   │
│  ╚═══════════════════════════════════════════╝   │
├──────────────────────────────────────────────────┤
│  ╔ Results Panel ════════════════════════════╗   │
│  ║ [listTitle]    [SortDropdown] [142 sonuc] ║   │
│  ║ [listDescription]                         ║   │
│  ║ [item 1]                                  ║   │
│  ║ [item 2]                                  ║   │
│  ║ [item 3]                                  ║   │
│  ║ — veya —                                  ║   │
│  ║ [results: ozel renderer]                  ║   │
│  ║ — veya —                                  ║   │
│  ║ [Contextual Empty State]                  ║   │
│  ╚═══════════════════════════════════════════╝   │
└──────────────────────────────────────────────────┘
\`\`\`

**Alt Bilesenler (Sub-components):**

- **FilterChips** — \`activeFilters\` prop'u ile render edilir. Her chip \`label: value\` formatinda gosterilir ve \`onRemove\` ile tek tek kaldirilabilir. Birden fazla filtre varken \`onClearAllFilters\` ile "Tumunu temizle" butonu gosterilir. \`role="status"\` ve \`aria-label\` ile erisimli.
- **SelectionBar** — \`selectable\` ve \`selectedKeys\` aktifken render edilir. Secili oge sayisini badge olarak gosterir, \`batchActions\` slot'u ile toplu aksiyon butonlari ve "Secimi temizle" butonu icerir. \`role="status"\` ve \`aria-live="polite"\` ile canli duyuru saglar.
- **SortDropdown** — \`sortOptions\` prop'u ile render edilir. Bir \`<select>\` ve yon degistirme butonu (artan/azalan) icerir. \`aria-label="Siralama"\` ile erisimli.

**Stil & Mod:**
- **Panel stili:** \`rounded-[28px]\` kenar yuvarlama, \`backdrop-blur\` efekti, gradient arkaplan ve golge
- **size="compact"** ile padding ve bosluklar azaltilir; FilterChips ve SelectionBar da compact moda uyum saglar
- **loading=true** ile tum katmanlar pulse animasyonlu iskelet placeholder olarak gosterilir
- **Dark mode:** Tum renkler \`var(--surface-card)\`, \`var(--text-primary)\`, \`var(--border-subtle)\` gibi CSS degiskenleriyle tanimlanir
- **totalCount:** Sonuc paneli ust satirinda \`{n} sonuc\` badge'i olarak gosterilir
- **Contextual empty state:** \`activeFilters\` varken bos sonuc durumunda "Bu filtre kombinasyonu icin sonuc bulunamadi" mesaji ve "Filtreleri temizle" butonu gosterilir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**1. Her zaman \`emptyStateLabel\` saglayin**
Kullanici filtreleri uygulayip sonuc bulamadiginda anlamli bir mesaj gormeli. Aktif filtre varken otomatik olarak contextual empty state gosterilir; ancak filtresiz durum icin \`emptyStateLabel\` ile ozel mesaj verin.

**2. \`summaryItems\` ile KPI ozeti ekleyin**
3 veya daha az KPI karti ekleyin: toplam, aktif, bekleyen gibi temel metrikler. Fazla KPI karti gorsel karisikliga neden olur.

**3. Filtre sayisini sinirli tutun**
FilterBar icinde 5-7 filtre kontrolu optimum sayidir. Daha fazla filtre gerekiyorsa \`ReportFilterPanel\` ile alt gruplama yapin.

**4. \`access\` prop'unu policy-temelli kontrol icin kullanin**
\`access="readonly"\` ile gosterim-only modu, \`access="disabled"\` ile devre disi modu, \`access="hidden"\` ile tamamen gizleme saglanir.

**5. \`results\` prop'unu ozel yuzeyler icin kullanin**
Grafik, harita veya ozel kart grid'i gibi standart liste disinda bir icerik gerektiginde \`results\` prop'u ile kendi bileseninizi render edin.

**6. \`loading\` prop'unu veri cekme sirasinda kullanin**
API cagirisi devam ederken \`loading={true}\` ile iskelet placeholder gosterin. Kullanici sayfanin yuklendigini anlar.

**7. \`activeFilters\` ile uygulanmis filtreleri her zaman gosterin**
Kullanicinin hangi filtrelerin aktif oldugunu bilmesi UX acisindan kritiktir. FilterBar'daki kontroller ile \`activeFilters\` chip'lerini senkron tutun:

\`\`\`tsx
activeFilters={Object.entries(filters)
  .filter(([, v]) => v)
  .map(([key, value]) => ({
    key,
    label: filterLabels[key],
    value: String(value),
    onRemove: () => removeFilter(key),
  }))
}
\`\`\`

**8. Toplu aksiyonlari dikkatli tasarlayin**
\`batchActions\` icinde yikici aksiyonlari (silme gibi) onay dialog'u ile koruma altina alin. Secim sayisini kullaniciya her zaman gosterin.

**9. \`totalCount\` ile sonuc sayisini bildirin**
Ozellikle sayfalamali listelerde toplam sonuc sayisini gostermek kullaniciya baglamsal bilgi saglar.

**10. Compact modu yogun operasyonel panellerde kullanin**
\`size="compact"\` yalnizca deneyimli kullanicilar icin operasyonel gorunumlerde kullanin. Son kullaniciya yonelik sayfalarda varsayilan boyutu tercih edin.

**11. Toolbar ve reload'u birlikte kullanin**
\`onReload\` verildiginde otomatik olarak reload ikonu gosterilir. Ek toolbar aksiyonlari (\`toolbar\` prop'u) ile yogunluk degistirici, disa aktarma butonu gibi kontroller ekleyin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**1. SearchFilterListing icinde SearchFilterListing kullanmayin**
Ic ice recipe bilesenleri gorsel karisikliga ve mantiksal hataya neden olur. Tek bir seviyede kullanin.

**2. Detay sayfalarinda kullanmayin**
Bu bilesen liste/arama sayfalari icindir. Tekil kayit detaylari icin \`DetailSummary\` kullanin.

**3. \`items\` ve \`results\` prop'unu ayni anda vermeyin**
\`results\` verildiginde \`items\` tamamen yoksayilir. Karisiklik onlemek icin yalnizca birini kullanin.

**4. SummaryStrip'i 4'ten fazla KPI ile sismirmeyin**
Dorten fazla KPI karti gorsel yogunluk yaratir ve mobilde tasma yaratir. 3 KPI optimal sayidir.

**5. Filtreleri FilterBar disinda render etmeyin**
Tum filtre kontrolleri \`filters\` prop'u uzerinden FilterBar icerisine yerlestirilmelidir. Dis filtreleme tutarsiz davranis yaratir.

**6. \`activeFilters\` ile FilterBar state'ini senkronsuz birakmayin**
FilterBar'daki kontrolleri guncelleyip \`activeFilters\` chip'lerini guncellememek kullanicida karisiklik yaratir. Her iki kaynak tek bir state'den turetilmelidir.

**7. Secim modunu gereksiz yere etkinlestirmeyin**
\`selectable\` prop'unu yalnizca toplu islem senaryolari icin kullanin. Secilecek bir aksiyon yokken secim modu gereksiz karmasiklik yaratir:

\`\`\`tsx
// YANLIS: batchActions olmadan selectable
<SearchFilterListing selectable items={items} />

// DOGRU: batchActions ile birlikte
<SearchFilterListing
  selectable
  selectedKeys={selected}
  onSelectionChange={setSelected}
  batchActions={<Button onClick={handleDelete}>Secilenleri Sil</Button>}
  items={items}
/>
\`\`\`

**8. Sort state'ini kontrolsuz birakmayin**
\`sortOptions\` verip \`activeSort\` ve \`onSortChange\` vermemek, siralama dropdown'unun calismayan bir goruntuye donusmesine neden olur. Her uc prop'u birlikte saglayin.

**9. \`loading\` durumunda eski veriyi gostermeyin**
\`loading={true}\` oldugunda bilesen otomatik olarak iskelet gosterir. Eski \`items\` verisini ayni anda gondermenize gerek yoktur; bilesen \`loading\` onceliklidir.

**10. Compact modu son kullanici arayuzlerinde kullanmayin**
\`size="compact"\` daha yogun bir layout sunar ve deneyimsiz kullanicilarda okuma zorlugu yaratabilir. Standart modu tercih edin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik Yapi:** Kok eleman \`<section>\` olarak render edilir. \`aria-label\` prop'u ile ekran okuyuculara bilesen amacini aciklayin. \`role\` prop'u ile ozel ARIA rolu atanabilir (ornegin \`role="region"\`).

\`\`\`tsx
<SearchFilterListing
  aria-label="Urun envanter listesi"
  role="region"
  // ...
/>
\`\`\`

**Yukleniyor Durumu:** \`loading={true}\` durumunda kok elemana \`aria-busy="true"\` atanir. Ekran okuyucular icerigin yuklenmekte oldugunu duyurur ve kullaniciyi bekletir.

**Erisim Kontrolu:** \`access\` prop'u \`AccessControlledProps\` sistemini kullanir:
- \`full\`: Tam etkilesim
- \`readonly\`: Salt okunur gorunum, etkilesim engellenir
- \`disabled\`: Devre disi gorunum
- \`hidden\`: DOM'dan tamamen kaldirilir

**FilterChips Erisilebilirlik:**
- Chip grubu \`role="status"\` ve \`aria-label="{n} aktif filtre"\` ile isaretlenir
- Her chip'in kaldir butonunda \`aria-label="{label} filtresini kaldir"\` bulunur
- Chip'ler arasinda Tab ile gezinilir; Enter veya Space ile kaldirilir

**SelectionBar Erisilebilirlik:**
- \`role="status"\` ve \`aria-live="polite"\` ile isaretlenir
- Secim degistiginde ekran okuyucu otomatik olarak "{n} oge secildi" duyurusunu yapar
- Toplu aksiyon butonlari ve "Secimi temizle" butonu Tab sirasi ile erisilebilir

**SortDropdown Erisilebilirlik:**
- \`<select>\` elemani \`aria-label="Siralama"\` ile isaretlenir
- Yon degistirme butonu \`aria-label="Azalan sirala"\` veya \`aria-label="Artan sirala"\` ile dinamik olarak guncellenir
- Klavye ile: Tab ile odaklanma, Space/Enter ile acma, ok tuslari ile secenek degistirme

**Bos Durum:** Empty bileseni \`role="status"\` ile asistan teknolojilere "sonuc yok" bilgisini iletir. Aktif filtre varken contextual empty state "Filtreleri temizle" butonunu Tab sirasi ile sunar.

**Klavye Navigasyonu:** Tum etkilesimli elemanlar (filtre chip'leri, secim temizle, sort dropdown, reload butonu, batch aksiyon butonlari) Tab sirasi ile erisilebilir ve Enter/Space ile etkinlestirilebilir. Dogal tab akisi korunur:
FilterBar kontrolleri → Toolbar/Reload → FilterChips → SelectionBar → SortDropdown → Sonuc listesi

**Focus Yonetimi:** Filtre sifirlandiginda, chip kaldirildiginda veya secim temizlendiginde focus kontrol kaybetmez. Kullanici aksiyondan sonra mantiksal bir sonraki elemana focus tasinir.`,
      },
    ],
    relatedComponents: ["PageHeader", "FilterBar", "SummaryStrip", "Empty", "ReportFilterPanel"],
  },

  Avatar: {
    componentName: "Avatar",
    summary: "Avatar, kullanicilari veya varliklari gorsel, bas harf veya ikon ile temsil eden bir kimlik gostergesidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Avatar, bir kullaniciyi veya varligi gorsel olarak temsil eder. Uc fallback katmani sunar: **resim**, **bas harfler** ve **ikon**.

Resim yuklenemediginde otomatik olarak \`initials\` veya varsayilan kullanici ikonuna duser. Alti farkli boyut (\`xs\`, \`sm\`, \`md\`, \`lg\`, \`xl\`, \`2xl\`) ve iki sekil (\`circle\`, \`square\`) destekler.

\`\`\`tsx
<Avatar src="/avatar.jpg" alt="Ahmet Yilmaz" size="lg" />
<Avatar initials="AY" size="md" shape="circle" />
<Avatar icon={<UserIcon />} size="sm" shape="square" />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Kullanici profil resimlerini gostermek icin (navbar, yorum listesi, ekip karti)
- Tablo satirlarinda kullanici/varlik temsili icin
- Chat veya mesajlasma arayuzlerinde gonderen kimligini belirtmek icin
- Kullanici listesi veya atama alanlarinda

**Kullanmayin:**
- Dekoratif gorseller icin — bunun yerine \`img\` veya \`Image\` kullanin
- Logo gosterimi icin — bunun yerine \`Icon\` veya ozel bilesen kullanin
- Durum gostergesi icin — bunun yerine \`Badge\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌─────────────────────┐
│                     │
│   [Image / Initials │
│    / Icon / Default]│
│                     │
└─────────────────────┘
\`\`\`

1. **Container** — \`span\` elemani; boyut, sekil (circle/square) ve arkaplan rengi
2. **Resim** — \`src\` verildiginde \`object-cover\` ile render edilir; \`onError\` ile fallback tetiklenir
3. **Bas Harfler** — \`initials\` prop'u ile maks 2 karakter, buyuk harf, ortalanmis
4. **Ikon** — Ozel \`icon\` ReactNode; SVG boyutu otomatik ayarlanir
5. **Varsayilan Ikon** — Hicbir prop verilmediginde standart kullanici silüeti`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her zaman \`alt\` metin saglayin.** Ekran okuyucular icin resmin neyi temsil ettigini aciklayin.

**Fallback stratejisi olusturun.** \`src\` + \`initials\` birlikte verin; resim yuklenemezse bas harfler gorunur.

**Boyutu baglamina gore secin.** Tablo icinde \`sm\`, profil sayfasinda \`xl\` veya \`2xl\` kullanin.

**Kare sekli varlik/kurum icin kullanin.** Kullanicilar icin \`circle\`, sirket veya urun icin \`square\` tercih edin.

**Grup gosteriminde ust uste bindirin.** Negatif margin ile avatar grubu olusturun: \`-ml-2\`.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ \`alt\` metin olmadan kullanmak**
Ekran okuyucular icin erisim sorunu yaratir. Her zaman \`alt\` veya \`aria-label\` ekleyin.

**❌ Cok buyuk resim dosyalari yuklemek**
Avatar resimleri kucuk boyutlu olmalidir. Thumbnail URL'leri kullanin.

**❌ Bas harfleri 2 karakterden uzun yapmak**
\`initials\` otomatik olarak 2 karaktere kesilir ancak tasarim icin 1-2 harf ideal.

**❌ Dekoratif gorsel olarak kullanmak**
Avatar kimlik temsili icindir; genel gorsel icin \`img\` elemani kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Alt Metin:** \`alt\` prop'u ile resim icin aciklayici metin saglanir. Bos \`alt="""\` dekoratif gorseller icin kullanilabilir.

**Rol:** Avatar bir \`span\` elemani olarak render edilir; ek \`role="img"\` ile birlikte \`aria-label\` eklenebilir.

**Kontrast:** Bas harf metni \`text-secondary\` renk tokeni ile yeterli kontrast orani saglar.

**Klavye:** Avatar tek basina etkilesimli degildir. Etkilesim gerekiyorsa bir \`button\` veya \`link\` icine sarin.`,
      },
    ],
    relatedComponents: ["Badge", "Tag", "Tooltip"],
  },

  Badge: {
    componentName: "Badge",
    summary: "Badge, durum bilgisi veya sayisal degerleri kucuk etiketlerle gosteren bir gostergedir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Badge, kisa durum veya miktar bilgisini kompakt bir etiket olarak sunar. Sekiz farkli varyant destekler: \`default\`, \`primary\`, \`success\`, \`warning\`, \`error\`, \`danger\`, \`info\` ve \`muted\`.

Uc boyut secenegi (\`sm\`, \`md\`, \`lg\`) ve \`dot\` modu ile sadece renkli nokta olarak da kullanilabilir.

\`\`\`tsx
<Badge variant="success">Aktif</Badge>
<Badge variant="error" size="sm">3 Hata</Badge>
<Badge variant="warning" dot />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Durum etiketleri gostermek icin (Aktif, Beklemede, Hata)
- Bildirim veya mesaj sayisi belirtmek icin
- Tablo hucresinde kategorik bilgi gosterimi icin
- Kucuk renkli gostergeler icin (\`dot\` modu)

**Kullanmayin:**
- Kaldirabilir etiketler icin — bunun yerine \`Tag\` kullanin
- Uzun aciklamalar icin — bunun yerine \`Alert\` kullanin
- Etkilesimli secim icin — bunun yerine \`Checkbox\` veya \`Switch\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌────────────────┐
│  [Metin/Sayi]  │   ← Standart Badge
└────────────────┘

    ●                ← Dot modu (sadece renkli nokta)
\`\`\`

1. **Container** — \`rounded-full\` yuvarlak kenarli \`span\` elemani
2. **Icerik** — Metin veya sayi; \`font-medium\` ile vurgulanir
3. **Renk Katmani** — Varyanta gore arkaplan ve metin rengi CSS token'lari
4. **Dot Modu** — \`dot={true}\` ile icerik gosterilmez, sadece 8px renkli daire`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Kisa tutun.** Badge icerigi 1-2 kelime veya kisa bir sayi olmalidir.

**Renk anlamini tutarli kullanin.** \`success\` = basari/aktif, \`error\` = hata, \`warning\` = uyari, \`info\` = bilgi.

**Dot modunu ince gostergeler icin kullanin.** Metin gerekmediginde \`dot\` ile minimal gorsel sag edin.

**Boyutu baglama gore secin.** Tablo icinde \`sm\`, standart UI'da \`md\`, buyuk kartlarda \`lg\`.

**Renklere tek basina guvenmeyin.** Renk koru kullanicilar icin badge icinde metin veya ikon de bulundurun.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok uzun metin iceren badge kullanmak**
Badge kisa durum bilgisi icindir; uzun metinler icin \`Alert\` veya \`Tag\` kullanin.

**❌ Sayfada cok fazla badge kullanmak**
Gorsel karisiklik yaratir. Onemine gore filtreleyip yalnizca kritik durumlari gosterin.

**❌ Etkilesimli eleman olarak kullanmak**
Badge tiklanabilir degildir. Tiklanabilir etiket icin \`Tag\` veya \`Button\` kullanin.

**❌ Yalnizca renkle anlam iletmek**
Erisilebilirlik icin renk + metin veya renk + ikon birlikte kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Badge bir \`span\` elemanidir ve dekoratif bir gostergedir. Kritik bilgi icin \`aria-label\` ekleyin.

**Kontrast:** Tum varyantlar WCAG 2.1 AA minimum kontrast oranini (4.5:1) saglar.

**Dot Modu:** Sadece renk ile bilgi ilettigi icin yanina aciklayici metin ekleyin.

**Ekran Okuyucu:** Badge icerigini \`sr-only\` sinifi ile zenginlestirebilirsiniz: "3 okunmamis bildirim".`,
      },
    ],
    relatedComponents: ["Tag", "Avatar", "Alert"],
  },

  Tag: {
    componentName: "Tag",
    summary: "Tag, kaldirabilir etiketler (chip) olusturarak kategorileri, filtreleri veya secilmis degerleri gosterir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Tag, bir ogeyi etiketlemek veya secilen filtreleri gostermek icin kullanilan kompakt bir bilesendir. Badge'den farki: **kaldirma butonu** (\`closable\`), **ikon destegi** ve **erisim kontrolu** (\`access\` prop) icermesidir.

Yedi varyant (\`default\`, \`primary\`, \`success\`, \`warning\`, \`error\`, \`info\`, \`danger\`), uc boyut (\`sm\`, \`md\`, \`lg\`) ve \`border\` stili ile gorsel ayrim saglar.

\`\`\`tsx
<Tag variant="primary" closable onClose={handleRemove}>React</Tag>
<Tag variant="success" icon={<CheckIcon />}>Onaylandi</Tag>
<Tag access="readonly" accessReason="Degistirilemez">Sistem</Tag>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Secilmis filtreleri gostermek ve kaldirmak icin (arama sonuclari, filtre cubugu)
- Kategorik etiketleme icin (etiketler, beceriler, teknolojiler)
- Coklu secim sonuclarini gostermek icin (Combobox secim ciktilari)
- Durum etiketleri ile birlikte ikon kullanmak istediginde

**Kullanmayin:**
- Sadece durum gostergesi icin — bunun yerine \`Badge\` kullanin
- Aksiyon tetiklemek icin — bunun yerine \`Button\` kullanin
- Uzun icerik icin — bunun yerine \`Alert\` veya \`Card\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────┐
│  [Icon?]  [Label]  [Close?] │
│  ← leading     trailing →   │
└──────────────────────────────┘
\`\`\`

1. **Container** — \`rounded-md\`, \`border\` ile cevrili \`span\` elemani
2. **Ikon** (opsiyonel) — \`icon\` prop'u ile sol tarafa yerlesen SVG/ReactNode
3. **Etiket** — \`truncate\` ile uzun metinler kesilir
4. **Kapat Butonu** (opsiyonel) — \`closable={true}\` ile X ikonu; \`onClose\` callback tetikler
5. **Erisim Katmani** — \`access\` prop'u ile \`hidden\`, \`disabled\`, \`readonly\` kontrol`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Kisa etiket metni kullanin.** 1-3 kelime ideal; uzun metinler \`truncate\` ile kesilir.

**\`closable\` ile birlikte \`onClose\` saglayin.** Kapat butonu gorsel olarak varsa callback da olmalidir.

**Renk kodlarini tutarli tutun.** Filtre tag'leri icin \`default\`, durum tag'leri icin anlamsal varyantlari kullanin.

**\`access\` prop'unu politika kontrolu icin kullanin.** Sistem etiketlerini \`readonly\`, gizlenmesi gerekenleri \`hidden\` yapin.

**Gruplama icin \`gap-2\` kullanin.** Tag'ler arasinda tutarli bosluk birakin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tag'i buton olarak kullanmak**
Tag bir etiket bilesenidir. Aksiyon icin \`Button\` kullanin.

**❌ Kapat butonu olmadan \`onClose\` beklemek**
\`closable={true}\` olmadan \`onClose\` callback'i hicbir zaman tetiklenmez.

**❌ Cok fazla tag gostermek**
10+ tag gorsel yogunluk yaratir. "+5 daha" seklinde ozet gosterin.

**❌ Badge yerine Tag kullanmak**
Kaldirma gerektirmeyen kisa durum gostergeleri icin \`Badge\` yeterlidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Kapat Butonu:** Kapat butonu \`aria-label="Remove"\` ile isaretlenir. Ekran okuyucular etiketin kaldirabilir oldugunu duyurur.

**Klavye:** Kapat butonuna \`Tab\` ile ulasip \`Enter\` veya \`Space\` ile etkinlestirilir.

**Erisim Kontrolu:** \`access="disabled"\` durumunda \`opacity-50\` ve \`pointer-events-none\` uygulanir; etkilesim engellenir.

**Baslik:** \`accessReason\` prop'u ile kisitlama nedeni \`title\` olarak gosterilir ve hover'da aciklama sunar.`,
      },
    ],
    relatedComponents: ["Badge", "Combobox", "MultiSelect", "Button"],
  },

  Radio: {
    componentName: "Radio",
    summary: "Radio, bir grup secenek icerisinden yalnizca bir tanesinin secilmesini saglayan form kontroludur.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Radio, birbirini dislayan seceneklerden birini secmek icin kullanilir. \`RadioGroup\` ile birlikte kullanildiginda \`name\`, \`value\` ve \`onChange\` otomatik yonetilir.

Uc boyut (\`sm\`, \`md\`, \`lg\`), etiket ve aciklama destegi sunar. Gorsel olarak daire icerisinde dolu nokta ile secili durumu belirtir.

\`\`\`tsx
<RadioGroup name="plan" value={selected} onChange={setSelected}>
  <Radio value="free" label="Ucretsiz" description="Temel ozellikler" />
  <Radio value="pro" label="Pro" description="Gelismis ozellikler" />
  <Radio value="enterprise" label="Kurumsal" description="Tam erisim" />
</RadioGroup>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- 2-7 birbirini dislayan secenek arasindan secim icin
- Tum seceneklerin ayni anda gorunur olmasi gerektiginde
- Kullanicinin secenekleri karsilastirmasi gerektiginde
- Form icinde tek secim gerektiren alanlarda

**Kullanmayin:**
- 7'den fazla secenek varsa — bunun yerine \`Select\` kullanin
- Birden fazla secim yapilacaksa — bunun yerine \`Checkbox\` kullanin
- Acik/kapali gecisi icin — bunun yerine \`Switch\` kullanin
- Sadece iki secenek ve az yer varsa — bunun yerine \`Switch\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
○  Etiket
   Aciklama metni

●  Secili Etiket
   Aciklama metni
\`\`\`

1. **Radio Dairesi** — Dis cevre (\`border-2\`) ve ic dolu nokta (secili durumda)
2. **Gizli Input** — \`sr-only\` sinifi ile gorsel olarak gizlenir, \`type="radio"\`
3. **Etiket** — \`label\` prop'u ile \`text-sm font-medium\`
4. **Aciklama** — \`description\` prop'u ile \`text-xs text-secondary\`
5. **RadioGroup Container** — \`role="radiogroup"\`, yatay veya dikey duzenleme`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her zaman RadioGroup icinde kullanin.** Tek basina Radio anlamsizdir; grup icerisinde kullanin.

**Varsayilan bir deger secin.** Kullanicinin hic secim yapmamasi genellikle istenmez; bir secenek on-secili olsun.

**Secenekleri mantiksal sirada dizin.** En yaygin/onerilen secenek en uste veya sola yerlestirin.

**Aciklama metni ekleyin.** Secenekler arasindaki farki netlestirmek icin \`description\` prop'unu kullanin.

**Dikey duzenlemeyi tercih edin.** 3+ secenek icin \`direction="vertical"\` daha okunaklir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tek bir Radio kullanmak**
Radio her zaman bir grup icerisinde kullanilmalidir. Tek secim icin \`Checkbox\` veya \`Switch\` kullanin.

**❌ Cok fazla secenek gostermek**
7'den fazla secenek gorsel karisikliga neden olur; \`Select\` veya \`Combobox\` tercih edin.

**❌ Varsayilan deger olmadan kullanmak**
Kullanici formu gonderdiginde secim yapilmamis olabilir; her zaman bir varsayilan belirleyin.

**❌ Birden fazla secime izin vermeye calismak**
Radio tek secim icindir. Coklu secim icin \`Checkbox\` grubu kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA Rolu:** \`RadioGroup\` \`role="radiogroup"\` ile sarmalanir. Her Radio yerel \`<input type="radio">\` kullanir.

**Klavye:** \`Tab\` ile gruba odaklanilir. \`Arrow Up/Down\` veya \`Arrow Left/Right\` ile secenekler arasinda gezinilir. \`Space\` ile secim yapilir.

**Etiket Iliskilendirme:** \`htmlFor\` / \`id\` eslestirilmesi otomatik olarak \`useId()\` ile saglanir.

**Hata Durumu:** \`error={true}\` ile kenarlık rengi \`state-error-text\` olarak degisir.

**Devre Disi:** \`disabled\` durumunda \`opacity-50\` ve \`cursor-not-allowed\` uygulanir.`,
      },
    ],
    relatedComponents: ["Select", "Checkbox", "Switch", "RadioGroup"],
  },
};
