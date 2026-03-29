import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  Popover: {
    componentName: "Popover",
    summary: "Popover, bir tetikleyici elemana baglanarak zengin icerik gosteren overlay paneli bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Popover, bir tetikleyici elemana tiklandiginda, hover veya focus ile acilan zengin icerikli overlay paneli sunar. Dort tetikleme modu (\`click\`, \`hover\`, \`focus\`, \`hover-focus\`), dort yon (\`top\`, \`bottom\`, \`left\`, \`right\`), uc hizalama (\`start\`, \`center\`, \`end\`) ve carpma algilama (\`flipOnCollision\`) destekler.

Kontrollü (\`open\` + \`onOpenChange\`) ve kontrolsuz (\`defaultOpen\`) kullanim modlari, portal destegi, ok gostergesi ve erisim kontrolu (\`access\` prop) saglar.

\`\`\`tsx
<Popover
  trigger={<Button>Detaylar</Button>}
  title="Bilgi"
  content="Bu alan hakkinda detayli aciklama."
/>

<Popover
  trigger={<IconButton icon={<HelpIcon />} label="Yardim" />}
  content={<HelpPanel />}
  triggerMode="hover"
  side="right"
  align="start"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Zengin icerik gostermek icin (metin + link + buton kombinasyonu)
- Ek bilgi panelleri ve yardim balonlari icin
- Mini formlar veya onay panelleri icin
- Etkilesimli icerik gerektiren durumlarda (Tooltip yetersiz kaldiginda)

**Kullanmayin:**
- Kisa, salt-okunur bilgi icin — bunun yerine \`Tooltip\` kullanin
- Tam ekran odak gerektiren islemler icin — bunun yerine \`Modal\` veya \`Dialog\` kullanin
- Navigasyon menusu icin — bunun yerine \`Dropdown\` veya \`MenuBar\` kullanin
- Uzun form akislari icin — bunun yerine \`Drawer\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
                ┌──────────────────────┐
                │  [Baslik]            │
                │                      │
                │  Icerik alani        │
                │  (herhangi bir       │
                │   ReactNode)         │
                └──────────┬───────────┘
                           ▼ (ok)
                   [Trigger Element]
\`\`\`

1. **Wrapper** — \`relative inline-flex\` div; tetikleyici ve panel konumlandirmasi
2. **Trigger Anchor** — \`children\` veya \`trigger\` prop'u; ARIA prop'lari otomatik eklenir
3. **Panel** — \`role="dialog"\`, premium surface stili, \`rounded-[24px]\`, \`p-4\`, portal ile render
4. **Baslik** (opsiyonel) — \`title\` prop'u ile \`font-semibold\` baslik satiri
5. **Ok** (opsiyonel) — \`showArrow={true}\` (varsayilan) ile yonlendirmeye gore konumlanan ucgen
6. **Portal** — Varsayilan olarak \`document.body\`'ye portal ile render edilir; \`disablePortal\` ile devre disi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Tetikleme modunu dogru secin.** Ek bilgi icin \`hover\` veya \`hover-focus\`, aksiyonlar icin \`click\` kullanin.

**Gecikme ayarlayin.** Hover modunda \`openDelay\` ve \`closeDelay\` ile kaza ile acilmayi onleyin; varsayilan 90ms cogu durum icin uygundur.

**\`flipOnCollision\` aktif birakin.** Sayfa kenarinda panelin tasmamasi icin varsayilan \`true\` degerini degistirmeyin.

**\`title\` prop'u ile baglam saglayin.** Baslik eklemek kullaniciya panelin amacini hizla iletir.

**Erisim kontrolu icin \`access\` kullanin.** \`readonly\` veya \`disabled\` modlari ile politika temelli kontrol saglayin.

**Icerik boyutunu sinirli tutun.** Popover kisa, odakli icerik icindir; uzun icerik icin \`Drawer\` tercih edin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Popover icinde Popover kullanmak**
Ic ice overlay panelleri kullanici deneyimini bozar. Akisi yeniden tasarlayin.

**❌ Uzun formlar icin kullanmak**
5+ alan iceren formlar icin \`Modal\` veya \`Drawer\` daha uygundur.

**❌ Tooltip yerine kullanmak**
Kisa, salt-okunur bilgi icin Popover asiri yer kaplar; \`Tooltip\` yeterlidir.

**❌ Hover modunda etkilesimli icerik koymak**
Hover ile acilan panele buton koymak mobilde calismaz ve masaustunde zorluk yaratir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** Panel \`role="dialog"\` ve \`aria-modal="false"\` kullanir. \`title\` varsa \`aria-labelledby\`, yoksa \`aria-label\` uygulanir. Trigger uzerinde \`aria-haspopup="dialog"\` ve \`aria-expanded\` otomatik eklenir.

**Klavye:** \`Enter/Space\` ile acilir/kapanir. \`Escape\` ile kapanir ve odak trigger'a doner. \`ArrowDown/Up\` ile de acilabilir.

**Odak Yonetimi:** Kapandiginda odak trigger elemanina geri doner (\`restoreFocus\`).

**Erisim Kontrolu:** \`access\` prop'u ile \`disabled\`, \`readonly\`, \`hidden\` modlari desteklenir. \`accessReason\` ile kisitlama nedeni \`title\` olarak gosterilir.

**Dis Tiklama:** Panel disina tiklandiginda otomatik kapanir.`,
      },
    ],
    relatedComponents: ["Tooltip", "Dropdown", "Modal", "Drawer"],
  },

  Skeleton: {
    componentName: "Skeleton",
    summary: "Skeleton, icerik yuklenirken gorunen nabiz animasyonlu yer tutucu bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Skeleton, veri yuklenirken sayfadaki icerik alanlarini temsil eden gorsel yer tutucu bilesenidir. Nabiz (\`animate-pulse\`) animasyonu ile yukleme durumunu iletir.

Ozel boyut (\`width\`, \`height\`), daire modu (\`circle\`), coklu satir (\`lines\`) ve animasyon kontrolu (\`animated\`) destekler. Coklu satir modunda son satir otomatik olarak %75 genislikte render edilir.

\`\`\`tsx
<Skeleton width={200} height={16} />
<Skeleton circle height={40} />
<Skeleton lines={3} />
<Skeleton width="100%" height={120} animated={false} />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- API cagirisi sirasinda icerik alanlarini temsil etmek icin
- Profil resimleri, metin bloklari ve kart iskeletleri icin
- Kullaniciya icerik yapisini onyuzlemek icin (layout shift onleme)
- Sayfa ilk yukleme durumunda tam sayfa iskelet gosterimi icin

**Kullanmayin:**
- Kisa sureli islemler icin — bunun yerine \`Spinner\` kullanin
- Butona entegre yukleme icin — bunun yerine Button'un \`loading\` prop'unu kullanin
- Bos durum gosterimi icin — bunun yerine \`Empty\` bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
Tekli:
┌──────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← animate-pulse
└──────────────────────────────┘

Daire:
    ┌───────┐
    │ ░░░░░ │
    └───────┘

Coklu satir (lines={3}):
┌──────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │  100%
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │  100%
│  ░░░░░░░░░░░░░░░░░░░░      │  75% (son satir)
└──────────────────────────────┘
\`\`\`

1. **Container** — \`div\` elemani; \`rounded-lg\`, \`bg-[surface-muted]\`
2. **Animasyon** — \`animate-pulse\` ile nabiz efekti (varsayilan acik)
3. **Boyut** — \`width\` (varsayilan: 100%) ve \`height\` (varsayilan: 16px) ile kontrol
4. **Daire Modu** — \`circle={true}\` ile \`rounded-full\`; genislik \`height\` degerinden otomatik alinir
5. **Coklu Satir** — \`lines\` prop'u ile istifli satir gruplari; son satir %75 genislikte`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Gercek icerik yapisini taklit edin.** Kart skeleton'i, kartla ayni boyut ve yerlestirmede olmalidir; layout shift onlenir.

**Avatar icin \`circle\` kullanin.** \`circle={true} height={40}\` ile avatar placeholder olusturun.

**Metin bloklari icin \`lines\` kullanin.** \`lines={3}\` ile paragraf yer tutucusu olusturun; son satirin kisa olmasi dogal gorunur.

**Animasyonu yalnizca gerektiginde kapatin.** \`animated={false}\` sadece ozel animasyon gerektiren durumlarda kullanin.

**Boyutlari CSS degerleri ile eslestiirin.** Gercek icerik ile ayni \`width\` ve \`height\` degerlerini kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Spinner yerine her yerde kullanmak**
Kisa islemler icin (buton tiklama, form gonderme) Skeleton asiri gorsel agirlik yaratir; \`Spinner\` yeterlidir.

**❌ Gercek icerik yapisindan farkli boyutlar kullanmak**
Skeleton ve gercek icerik boyut uyumsuzlugu layout shift yaratir; kullanici deneyimini bozar.

**❌ Surekli skeleton gostermek**
Uzun sureli yukleme durumlarinda (5+ saniye) skeleton yerine ilerleme gostergesi veya mesaj ekleyin.

**❌ Animasyonsuz skeleton'i stilsiz birakmak**
\`animated={false}\` kullandiginda bos gri kutu gibi gorunur; ozel stil eklemeyi dusunun.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Skeleton bir \`div\` elemanidir ve gorsel yer tutucudur. Icerik yuklenmekte oldugunu belirtmek icin container'a \`aria-busy="true"\` ekleyin.

**Ekran Okuyucu:** Skeleton kendisi erisim bilgisi tasimaz. Sarmalayan container'da \`aria-label="Icerik yukleniyor"\` kullanin.

**Animasyon:** \`prefers-reduced-motion\` medya sorgusuna duyarli olarak animasyon otomatik azaltilabilir.

**Kontrast:** \`surface-muted\` arkaplan rengi ile cevre arkaplan arasinda yeterli gorsel ayrim saglanir.`,
      },
    ],
    relatedComponents: ["Spinner", "Empty", "Card"],
  },

  Spinner: {
    componentName: "Spinner",
    summary: "Spinner, devam eden bir islemi gorsel olarak gosteren donme animasyonlu yukleme gostergesidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Spinner, bir islemin devam ettigini kullaniciya ileten donme animasyonlu SVG bilesenidir. Bes boyut (\`xs\`, \`sm\`, \`md\`, \`lg\`, \`xl\`) ve iki gorunum modu (\`inline\`, \`block\`) destekler.

\`inline\` modda sadece donen daire, \`block\` modda ortalanmis daire + etiket metni gosterilir. \`label\` prop'u hem gorsel hem de erisim icin metin saglar.

\`\`\`tsx
<Spinner />
<Spinner size="lg" label="Yukleniyor..." />
<Spinner mode="block" label="Veriler getiriliyor" />
<Spinner size="xs" />  {/* IconButton icinde kullanilir */}
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Buton veya form gonderim islemlerinde kisa sureli yukleme gostermek icin
- API cagirisi sirasinda inline yukleme gostergesi olarak
- Block modda bolum veya sayfa yukleme gostergesi olarak
- IconButton icinde yukleme durumu icin (\`size="xs"\`)

**Kullanmayin:**
- Sayfa icerik yapisi belli oldugunda — bunun yerine \`Skeleton\` kullanin
- Uzun sureli islemlerde ilerleme gostermek icin — bunun yerine ilerleme cubugu kullanin
- Dekoratif animasyon olarak — Spinner yalnizca yukleme durumu icin kullanilmalidir`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
Inline mod:
  (○)  ← Donen daire SVG

Block mod:
┌──────────────────────────┐
│                          │
│          (○)             │
│    "Yukleniyor..."       │
│                          │
└──────────────────────────┘
\`\`\`

1. **SVG Daire** — \`animate-spin\` ile donen iki katmanli daire; dis halka %25 opaklik, ic yay %75
2. **Boyut** — \`size\` prop'u ile \`h-3 w-3\` (xs) ile \`h-8 w-8\` (xl) arasi
3. **Etiket** (block mod) — \`label\` prop'u ile dairenin altinda \`text-sm font-medium\` metin
4. **Block Container** — \`flex flex-col items-center justify-center gap-3 py-6\` ile ortalanmis gorunum
5. **Renk** — \`currentColor\` kullanir; ust bilesenin metin rengini devralir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Anlamli etiket saglayin.** Varsayilan "Loading" yerine baglama uygun bir metin kullanin: "Kaydediliyor...", "Veriler getiriliyor".

**Boyutu baglama gore secin.** Buton icinde \`xs\`/\`sm\`, inline gostergeler icin \`md\`, sayfa yuklemesi icin \`lg\`/\`xl\` kullanin.

**Block modu bolum yuklemesi icin tercih edin.** Ortalanmis gorunum + etiket ile kullaniciya net bilgi sunun.

**Spinner suresini makul tutun.** 5+ saniye suren islemler icin ilerleme gostergesi veya iptal secenegi ekleyin.

**Renk devralmayi kullanin.** \`currentColor\` sayesinde ust bilesenin rengi otomatik uygulanir; ozel renk icin \`className\` ile gecersiz kilin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Sayfa iskelet yapisi yerine kullanmak**
Icerik yapisi belli oldugunda Skeleton ile yer tutucu gosterin; Spinner yalnizca belirsiz sureli islemler icindir.

**❌ Etiketsiz kullanmak**
Ekran okuyucular icin \`label\` prop'u gereklidir. Varsayilan "Loading" genellikle yeterli degildir.

**❌ Cok kucuk boyutlarda tek basina kullanmak**
\`xs\` boyut yalnizca baska bir bilesen icinde (IconButton) kullanilmalidir; tek basina gorunmez olabilir.

**❌ Dekoratif animasyon olarak kullanmak**
Spinner yukleme durumunu iletir; animasyon gerektiren baska durumlar icin ozel animasyon kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** \`role="status"\` ile ekran okuyucular bileseni durum gostergesi olarak tanir. \`aria-label\` ile yukleme metni duyurulur.

**Ekran Okuyucu:** \`label\` prop'u \`aria-label\` olarak uygulanir. Block modda etiket gorsel olarak da gosterilir.

**Animasyon:** \`animate-spin\` CSS animasyonu kullanir; \`prefers-reduced-motion\` tercihleri icin Tailwind otomatik azaltma saglar.

**Renk Kontrasti:** \`currentColor\` ile ust bilesenin kontrastini devralir; ek ayarlama gerektirmez.`,
      },
    ],
    relatedComponents: ["Skeleton", "Button", "IconButton"],
  },

  Card: {
    componentName: "Card",
    summary: "Card, icerik gruplarina gorsel cerceve, golge ve bosluk saglayan yukseltilmis container bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Card, iliskili icerik gruplarini gorsel olarak cevreleme amaciyla kullanilan container bilesenidir. Dort varyant (\`elevated\`, \`outlined\`, \`filled\`, \`ghost\`), dort bosluk secenegi (\`none\`, \`sm\`, \`md\`, \`lg\`), hover efekti (\`hoverable\`) ve polimorfik eleman destegi (\`as\`) sunar.

Alt bilesenler olan \`CardHeader\`, \`CardBody\` ve \`CardFooter\` ile yapilandirilmis icerik duzeni saglar.

\`\`\`tsx
<Card variant="elevated" padding="md">
  <CardHeader title="Proje Ozeti" subtitle="Son guncelleme: bugun" action={<IconButton icon={<MoreIcon />} label="Daha fazla" />} />
  <CardBody>Proje icerik alani...</CardBody>
  <CardFooter>
    <Button variant="ghost" size="sm">Iptal</Button>
    <Button variant="primary" size="sm">Kaydet</Button>
  </CardFooter>
</Card>

<Card variant="outlined" hoverable onClick={handleClick}>
  Tiklanabilir kart icerigi
</Card>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Iliskili icerik gruplarini gorsel olarak ayirmak icin
- Dashboard widget'lari, istatistik kartlari, ozet panelleri icin
- Liste ogeleri veya grid kartlari olarak
- Tiklanabilir icerik konteynerleri icin (\`hoverable\` + \`onClick\`)

**Kullanmayin:**
- Sayfa duzeni icin — bunun yerine \`Stack\` veya layout bilesenleri kullanin
- Modal veya dialog penceresi icin — bunun yerine \`Modal\` kullanin
- Navigasyon paneli icin — bunun yerine \`NavigationRail\` kullanin
- Tek satir bilgi icin — bunun yerine \`Alert\` veya \`Badge\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────┐
│  [Baslik]          [Aksiyon?]    │ ← CardHeader
│  [Alt baslik]                    │
├──────────────────────────────────┤
│                                  │
│  [Icerik alani]                  │ ← CardBody
│                                  │
├──────────────────────────────────┤
│  [Aksiyon 1]  [Aksiyon 2]       │ ← CardFooter
└──────────────────────────────────┘
\`\`\`

1. **Card Container** — \`div\` elemani; \`rounded-2xl\`, varyanta gore border/shadow/bg
2. **CardHeader** — \`title\`, \`subtitle\` ve \`action\` slotlari; flex layout
3. **CardBody** — \`mt-3\` ile basliktan ayrilmis ana icerik alani
4. **CardFooter** — \`mt-4\`, \`border-t\` ile ust ayirici, \`gap-2\` ile aksiyonlar
5. **Hover Efekti** — \`hoverable={true}\` ile \`cursor-pointer\`, border renk degisimi ve \`active:scale-[0.99]\``,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Varyanti amacina gore secin.** Dashboard icin \`elevated\`, form gruplari icin \`outlined\`, arka plan paneli icin \`filled\`, minimal gorunum icin \`ghost\`.

**Alt bilesenleri yapisal kullanin.** \`CardHeader\` + \`CardBody\` + \`CardFooter\` ile tutarli icerik hiyerarsisi kurun.

**Tiklanabilir kartlarda \`hoverable\` kullanin.** Gorsel geri bildirim saglar; \`active:scale\` ile tiklama hissi verir.

**Boslugu baglama gore ayarlayin.** \`padding="sm"\` yogun listeler icin, \`padding="lg"\` genis dashboard kartlari icin.

**\`as\` prop'unu semantik amaclir kullanin.** Blog kartlari icin \`as="article"\`, bolum gruplari icin \`as="section"\` tercih edin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Ic ice cok fazla kart kullanmak**
Kart icinde kart gorsel karisiklik yaratir. Bir seviye ile sinirli tutun.

**❌ Tum sayfa icerigini tek bir karta sarmak**
Kart, icerik gruplama icindir; sayfa duzeni icin layout bilesenleri kullanin.

**❌ \`hoverable\` ile birlikte \`onClick\` eklememek**
Hover efekti etkilesim beklentisi yaratir; tiklanabilirlik saglanmalidir.

**❌ \`ghost\` varyantini padding olmadan kullanmak**
\`variant="ghost" padding="none"\` icerigin cercevesiz gorunmesine neden olur; bosluk veya farkli varyant ekleyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Varsayilan olarak \`div\` render eder. \`as="article"\` veya \`as="section"\` ile uygun semantik eleman secin.

**Tiklanabilir Kart:** \`as="button"\` ile \`role="button"\` ve \`tabIndex={0}\` otomatik eklenir; klavye ile etkilesim saglanir.

**Odak Gostergesi:** Tiklanabilir kartlar icin gorunur odak gostergesi saglanmalidir.

**Baslik Iliskilendirme:** \`CardHeader\` icerisindeki \`title\` ile \`aria-labelledby\` iliskisi kurun.

**Renk Kontrasti:** Tum varyantlar WCAG 2.1 AA uyumlu kontrast orani saglar.`,
      },
    ],
    relatedComponents: ["Stack", "Divider", "Alert", "Modal"],
  },

  Breadcrumb: {
    componentName: "Breadcrumb",
    summary: "Breadcrumb, sayfanin navigasyon hiyerarsisini gorsel olarak gosteren yol haritasi bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Breadcrumb, kullanicinin sayfa hiyerarsisindeki konumunu gosteren ve ust sayfalara hizli donusu saglayan navigasyon bilesenidir. Her oge (\`BreadcrumbItem\`) icin etiket, ikon, \`href\` ve \`onClick\` desteklenir.

Ozel ayirici (\`separator\`), maksimum oge sayisi ile otomatik daralma (\`maxItems\`) ve son ogenin aktif sayfa olarak isaretlenmesi (\`aria-current="page"\`) saglanir.

\`\`\`tsx
<Breadcrumb items={[
  { label: "Ana Sayfa", icon: <HomeIcon />, onClick: () => navigate("/") },
  { label: "Projeler", onClick: () => navigate("/projects") },
  { label: "Proje Detay" },
]} />

<Breadcrumb
  items={longItems}
  maxItems={4}
  separator={<span>/</span>}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Cok seviyeli sayfa hiyerarsisini gostermek icin (2+ seviye)
- Kullanicinin konumunu netlestirmek icin
- Ust sayfalara hizli donusu saglamak icin
- Detay sayfalarinda ust baglami korumak icin

**Kullanmayin:**
- Tek seviyeli sayfalarda — breadcrumb gereksizdir
- Adim adim surecler icin — bunun yerine \`Steps\` bileseni kullanin
- Sekmeli navigasyon icin — bunun yerine \`Tabs\` kullanin
- Ana navigasyon olarak — bunun yerine \`NavigationRail\` veya \`MenuBar\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
[Icon] Ana Sayfa  >  Projeler  >  Proje Detay (aktif)
  ↑                    ↑             ↑
  link               link         aktif sayfa

Daraltilmis (maxItems=3):
[Icon] Ana Sayfa  >  ...  >  Alt Bolum  >  Proje Detay
\`\`\`

1. **Nav Container** — \`<nav aria-label="Breadcrumb">\` ile semantik navigasyon
2. **Liste** — \`<ol>\` elemani; \`flex items-center gap-1.5\` ile yatay duzenleme
3. **Oge (link)** — \`<button>\` elemani; \`text-xs text-secondary\`, hover ile renk degisimi
4. **Aktif Oge** — Son oge \`<span>\` olarak render; \`text-primary font-medium\`, \`aria-current="page"\`
5. **Ayirici** — Varsayilan chevron SVG ikonu; \`separator\` prop'u ile ozellestirilir
6. **Daralma** — \`maxItems\` asildiginda "..." ile ara ogeler gizlenir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Sayfa basliginin altina yerlestirin.** Breadcrumb genellikle sayfa basliginin uzerinde veya hemen altinda konumlanir.

**Ilk ogeye ikon ekleyin.** Ana Sayfa icin ev ikonu gorsel yol haritasini guclendirrir.

**\`maxItems\` ile uzun yollari daraltiin.** 5+ seviyeli hiyerarsilerde \`maxItems={4}\` ile gorsel temizlik saglayin.

**Son ogeyi tiklanabilir yapmayin.** Aktif sayfa breadcrumb'inda link olmamalidir; metin olarak gorunmelidir.

**Etiketleri kisa tutun.** 1-3 kelime ideal; uzun basliklar icin kisaltilmis versiyonlar kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tek ogeli breadcrumb kullanmak**
Hiyerarsi yoksa breadcrumb gereksizdir; en az 2 seviye olmalidir.

**❌ Son ogeyi tiklanabilir yapmak**
Aktif sayfa zaten bulundugumuz sayfa; kendine link vermek anlamsizdir.

**❌ Cok uzun etiketler kullanmak**
Breadcrumb yer kaplar ve satir kirar. Kisa, ozet etiketler kullanin.

**❌ Ana navigasyon olarak kullanmak**
Breadcrumb yardimci navigasyondur; ana navigasyon icin sidebar veya navbar kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** \`<nav aria-label="Breadcrumb">\` ile ekran okuyucular navigasyon amacini tanir.

**Aktif Sayfa:** Son oge \`aria-current="page"\` ile isaretlenir; ekran okuyucular mevcut konumu duyurur.

**Klavye:** Tum link ogeleri \`<button>\` elemani kullanir; \`Tab\` ile gezinilir, \`Enter/Space\` ile etkinlestirilir. \`focus-visible:ring\` ile gorunur odak gostergesi saglanir.

**Ayirici:** Ayirici elemanlar \`aria-hidden\` ile isaretlenir; ekran okuyucular tarafindan atlanir.

**Semantik Liste:** \`<ol>\` elemani ile ogeler siralanir; ekran okuyucular hiyerarsiyi sirasina gore duyurur.`,
      },
    ],
    relatedComponents: ["Tabs", "Steps", "NavigationRail", "Link"],
  },

  Accordion: {
    componentName: "Accordion",
    summary: "Accordion, icerik bolumlerini acilip kapanabilen paneller halinde duzenleyerek gorsel yogunlugu azaltan bir bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Accordion, birden fazla icerik bolumunu baslik + acilir panel yapisinda sunar. Iki secim modu (\`single\`, \`multiple\`), iki boyut (\`sm\`, \`md\`), cerceveli (\`bordered\`) ve seffaf (\`ghost\`) gorunum, ok pozisyonu (\`expandIconPosition\`), ozel ikon ve ic ice accordion destekler.

Kontrollü (\`value\` + \`onValueChange\`) ve kontrolsuz (\`defaultValue\`) kullanim modlari, erisim kontrolu (\`access\` prop), panel yikma (\`destroyOnHidden\`) ve \`collapsible\` modlari (\`header\`, \`icon\`, \`disabled\`) saglar.

Uc hazir preset (\`faq\`, \`compact\`, \`settings\`) ile hizli yapilandirma mumkundur.

\`\`\`tsx
<Accordion
  items={[
    { value: "about", title: "Hakkinda", content: "Detayli aciklama..." },
    { value: "faq", title: "SSS", content: "Sik sorulan sorular...", description: "Yardim merkezi" },
    { value: "contact", title: "Iletisim", content: "Bize ulasin...", extra: <Badge variant="info">Yeni</Badge> },
  ]}
  selectionMode="single"
/>

<Accordion
  items={sections}
  ghost
  disableGutters
  expandIconPosition="end"
  collapsible="icon"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- SSS (FAQ) sayfalarinda soru-cevap bloklari icin
- Ayar panellerinde kategori bazli gruplama icin
- Uzun icerik listelerini daraltarak gorsel yogunlugu azaltmak icin
- Yan panel veya dar alanlarda icerik organizasyonu icin

**Kullanmayin:**
- Icerik ayni anda gorunur olmali ise — bunun yerine acik liste veya \`Card\` gruplari kullanin
- Navigasyon sekmeleri icin — bunun yerine \`Tabs\` kullanin
- Adim adim surecler icin — bunun yerine \`Steps\` kullanin
- Tek acilir bolum icin — bunun yerine \`Disclosure\` veya \`Collapsible\` dusunun`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [▼]  Baslik 1           [Extra?]   │ ← trigger (acik)
│        Aciklama                      │
├──────────────────────────────────────┤
│  Panel icerigi...                    │ ← region
├──────────────────────────────────────┤
│  [▶]  Baslik 2           [Extra?]   │ ← trigger (kapali)
│        Aciklama                      │
├──────────────────────────────────────┤
│  [▶]  Baslik 3                       │ ← trigger (kapali)
└──────────────────────────────────────┘
\`\`\`

1. **Kok Container** — \`rounded-[24px]\`, premium surface stili (bordered modda)
2. **Item** — Her bolum; \`border-t\` ile ust ayirici (ilk haric)
3. **Trigger** — \`<button>\` veya \`<div>\` + ikon buton; \`aria-expanded\`, \`aria-controls\`
4. **Baslik Blogu** — \`title\`, \`description\` ve \`extra\` slotlari
5. **Ikon** — Chevron SVG; \`rotate-180\` ile acik durum animasyonu
6. **Panel** — \`role="region"\`, \`aria-labelledby\` ile iliskilendirilmis icerik alani`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Secim modunu amacina gore secin.** SSS icin \`single\` (tek acik panel), ayar panelleri icin \`multiple\` (birden fazla acik) kullanin.

**Varsayilan acik panel belirleyin.** En onemli veya en sik kullanilan bolumu \`defaultExpanded: true\` ile acik baslatin.

**\`description\` ile baglam saglayin.** Her bolumun icerigini ozetleyen kisa aciklama ekleyin.

**\`extra\` slotunu durum gostergeleri icin kullanin.** Badge, ikon veya sayi ile ek bilgi sunun.

**Preset'leri kullanin.** \`createAccordionPreset("faq")\` ile standart yapilandirmalari hizla uygulayin.

**\`collapsible="icon"\` ile baslik alanini koruyun.** Sadece ok ikonuna tiklandiginda acilsin; baslik alani baska amaclar icin kullanilabilir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla bolum eklemek**
10+ bolum gorsel yogunluk yaratir; gruplama veya alt navigasyon ile organize edin.

**❌ Cok kisa icerikli paneller olusturmak**
Tek satirlik icerik icin Accordion gereksiz agirlik ekler; dogrudan gosterin.

**❌ \`destroyOnHidden={false}\` ile buyuk icerik yuklemek**
Tum paneller DOM'da kalir ve performansi etkiler; varsayilan \`true\` degerini koruyun.

**❌ Ic ice accordion'u asiri derinlestirmek**
2 seviyeden fazla ic ice accordion kullanicida kaybolma hissine neden olur.

**❌ Tum panelleri kapali basllatmak**
En az bir paneli acik baslatin veya kullaniciya neyi acacagini gosteren net basliklar yazin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** Her trigger \`aria-expanded\` ve \`aria-controls\` ile panele baglanir. Panel \`role="region"\` ve \`aria-labelledby\` ile baslika iliskilendirilir. Kok eleman \`aria-label\` ile amac belirtir.

**Klavye:** \`Tab\` ile trigger'lar arasinda gezinilir. \`Enter/Space\` ile panel acilir/kapanir.

**Baslik Semantigi:** Her trigger bir \`<h3>\` icinde yer alir; sayfa baslik hiyerarsisine uyum saglar.

**Devre Disi:** \`disabled: true\` veya \`collapsible: "disabled"\` durumunda \`aria-disabled\` eklenir, \`opacity-60\` uygulanir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (DOM'dan kaldirilir), \`disabled\` ve \`readonly\` modlari desteklenir. \`accessReason\` ile kisitlama nedeni \`title\` olarak gosterilir.

**Panel Gizleme:** \`hidden\` attribute ve \`aria-hidden\` ile kapali paneller ekran okuyuculardan gizlenir.`,
      },
    ],
    relatedComponents: ["Tabs", "Card", "Steps", "Disclosure"],
  },
};
