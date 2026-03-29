import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  LinkInline: {
    componentName: "LinkInline",
    summary: "LinkInline, internal, external ve current-state davranisini ortak bir API ile sunan inline link primitiveidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `LinkInline, metin akisi icerisinde kullanilan bir **inline anchor** primitivedir. Iki ton (\`primary\`, \`secondary\`), uc underline modu (\`always\`, \`hover\`, \`none\`) ve otomatik external link tespiti sunar.

Harici linklerde \`target="_blank"\` ve \`rel="noopener noreferrer"\` otomatik uygulanir. \`current\` prop'u ile aktif sayfayi isaretler. \`disabled\` veya \`access\` ile blocked durumda \`<span>\` fallback render edilir.

\`\`\`tsx
import { LinkInline } from '@mfe/design-system';

<LinkInline href="/dashboard">Dashboard</LinkInline>
<LinkInline href="https://example.com" external>Harici Kaynak</LinkInline>
<LinkInline href="/settings" current>Ayarlar</LinkInline>
<LinkInline variant="secondary" underline="always" href="/help">Yardim</LinkInline>
<LinkInline disabled>Erisim Engellendi</LinkInline>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Metin akisi icerisinde baska bir sayfaya veya kaynaga yonlendirme icin
- Harici web sitelerine guvenli link vermek icin
- Breadcrumb, aciklama metni veya bilgi panellerinde inline navigasyon icin
- Aktif sayfayi \`current\` ile isaretlemek icin

**Kullanmayin:**
- Bir aksiyonu tetiklemek icin — bunun yerine \`Button\` kullanin
- Navigasyon menusunde ana link olarak — bunun yerine \`MenuBar\` veya \`NavigationMenu\` kullanin
- Kart veya liste ogesi olarak tiklanabilir alan icin — bunun yerine \`Card\` veya \`ListItem\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌────────────────────────────────────┐
│ [LeadingVisual?] [Label] [TrailingVisual? | ↗] │
└────────────────────────────────────┘
\`\`\`

1. **Anchor / Span** — \`<a>\` (aktif) veya \`<span>\` (blocked) olarak render edilen kok eleman
2. **Leading Visual** (opsiyonel) — Ikon veya gorsel; \`aria-hidden\` ile dekoratif
3. **Label** — Link metni; \`children\` prop'u ile saglanir
4. **Trailing Visual** (opsiyonel) — Sag taraftaki ikon veya gorsel
5. **External Indicator** — Harici linklerde trailing visual yoksa otomatik \`↗\` ikonu
6. **Screen Reader Label** — Harici linklerde \`sr-only\` ile "External link" duyurusu
7. **Focus Ring** — \`focus-visible\` ile halka gorunumu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Anlamli link metni kullanin.** "Buraya tiklayin" yerine "Dokumantasyona gidin" gibi aciklayici metinler yazin.

**Harici linkler icin \`external\` prop'unu kullanin.** Otomatik olarak \`target="_blank"\` ve \`rel="noopener noreferrer"\` uygulanir.

**Aktif sayfayi \`current\` ile isaretleyin.** \`aria-current="page"\` otomatik atanir ve gorsel olarak vurgulanir.

**Tone secimini baglama gore yapin.** Birincil navigasyon icin \`primary\`, yardimci veya ikincil bilgi icin \`secondary\` tone kullanin.

**Blocked durumda \`accessReason\` saglayin.** Kullanici neden erisemedigini \`title\` uzerinden gorebilir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Link'i buton olarak kullanmak**
\`onClick\` ile aksiyon tetiklemek icin \`<a>\` kullanmak ekran okuyucu semantigini bozar. Aksiyonlar icin \`Button\` kullanin.

**❌ \`href\` olmadan link render etmek**
\`href\` verilmediginde \`<span>\` olarak render edilir ve kullanici tiklanamayan bir metin gorur.

**❌ \`underline="none"\` ile erisilebilirligi azaltmak**
Alt cizgisiz linkler metin icerisinde ayirt edilemeyebilir. Renk tek basina yeterli degildir; \`hover\` veya \`always\` tercih edin.

**❌ Cok uzun link metinleri kullanmak**
Paragraf uzunlugunda link metinleri okunabilirligi dusurur. Link metnini kisa ve net tutun.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Aktif durumda \`<a>\` olarak render edilir; blocked durumda \`<span>\` fallback kullanilir ve \`aria-disabled="true"\` atanir.

**Current State:** \`current={true}\` durumunda \`aria-current="page"\` otomatik atanir. Ekran okuyucular aktif sayfayi duyurur.

**External Link:** Harici linklerde \`sr-only\` ile "External link" duyurusu yapilir. \`target="_blank"\` ve \`rel="noopener noreferrer"\` guvenlik icin otomatik uygulanir.

**Focus Ring:** \`focus-visible\` ile \`ring-2\` odak halkasi gorunur. WCAG 2.1 AA kontrast gereksinimlerini karsilar.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen DOM'dan kaldirilir. \`disabled\` veya \`readonly\` durumda tiklanamaz \`<span>\` olarak render edilir.

**Klavye:** Tab ile odaklanma, Enter ile etkinlestirme.`,
      },
    ],
    relatedComponents: ["Button", "MenuBar", "Breadcrumb"],
  },

  MenuBar: {
    componentName: "MenuBar",
    summary: "MenuBar, yatay uygulama komutlari ve navigasyon aksiyonlari icin popup submenu, overflow kontrolu, search handoff ve responsive fallback destekli menubar primitiveidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `MenuBar, karmasik navigasyon ve komut mimarilerini tek bir yatay cubukta birlestiren **primitive** bilesendir. Ana ozellikleri:

- **Root Items** — Label, ikon, badge, submenu ve aksiyon destekli ust-seviye ogeler
- **Submenu** — Popup menu yuzeyinde ikonlu, kisayollu, gruplu ve ayiriciyla zengin menu icerigi
- **Overflow** — \`collapse-to-more\` ile tasan ogeleri "Daha Fazla" menusune toplama
- **Search Handoff** — Ust bar icerisinde route ve aksiyon arama paneli
- **Responsive** — \`mobileFallback="menu"\` ile dar gorunumde menu moda gecis
- **Gruplar** — \`primary\`, \`secondary\`, \`utility\` segmentleri ile item ayirimi

\`\`\`tsx
import { MenuBar } from '@mfe/design-system';

<MenuBar
  items={[
    { value: "dashboard", label: "Dashboard", icon: <HomeIcon />, href: "/dashboard" },
    { value: "users", label: "Kullanicilar", icon: <UsersIcon />,
      menuItems: [
        { key: "list", label: "Liste", onClick: () => navigate("/users") },
        { key: "add", label: "Yeni Ekle", onClick: () => navigate("/users/new") },
      ]
    },
    { value: "settings", label: "Ayarlar", icon: <GearIcon />, href: "/settings" },
  ]}
  currentPath="/dashboard"
  size="md"
  appearance="default"
  ariaLabel="Ana navigasyon"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulama ust bari veya ana navigasyon cubugu icin
- Birden fazla ust-seviye route ve submenu iceren navigasyon mimarisinde
- Komut paleti benzeri arama destekli header icin
- Overflow kontrolu gerektiren yogun navigasyon listelerinde
- Desktop menubar ritmi (File/View/Tools) gerektiren arayuzlerde

**Kullanmayin:**
- Basit sayfa ici link listesi icin — bunun yerine \`LinkInline\` veya \`NavLink\` kullanin
- Dikey sidebar navigasyonu icin — bunun yerine \`Sidebar\` kullanin
- Sag tik baglam menusu icin — bunun yerine \`ContextMenu\` kullanin
- Tab navigasyonu icin — bunun yerine \`Tabs\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│ [StartSlot?] │ [RootItem] [RootItem] ... [More?] │ [Utility?] [EndSlot?] │
│              │  ↓ active                          │                       │
│              │ ┌──────────────┐                   │                       │
│              │ │ [MenuItem]   │                   │                       │
│              │ │ [Separator]  │                   │                       │
│              │ │ [MenuItem]   │                   │                       │
│              │ └──────────────┘                   │                       │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Menubar Container** — \`role="menubar"\` ile yatay kok cubuk
2. **Start Slot** (opsiyonel) — Sol tarafta marka veya ek icerik
3. **Root Items** — Her biri aksiyon, link veya submenu tetikleyicisi olabilen ust-seviye ogeler
4. **Submenu Popup** — \`MenuSurface\` ile render edilen popup menu
5. **Overflow Trigger** — Tasan ogeleri toplayan "Daha Fazla" butonu
6. **Utility Slot** (opsiyonel) — Sag tarafta ek kontroller
7. **End Slot** (opsiyonel) — Sag uc alan
8. **Search Header** (opsiyonel) — \`enableSearchHandoff\` ile arama paneli`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`currentPath\` ile aktif root'u otomatik isaretleyin.** Route-aware navigasyon icin \`currentPath\` ve \`matchPath\` birlikte kullanin.

**Overflow icin \`overflowPriority\` kullanin.** Onemli ogelere yuksek oncelik verin; tasan ogeler More menusune tasinir.

**\`ariaLabel\` ile menubar'i tanimlarin.** Ekran okuyucular icin "Ana navigasyon" gibi anlamli bir etiket verin.

**Submenu'leri mantiksal olarak gruplayin.** \`menuItems\` icinde separator ve label kullanarak ogeleri kategorize edin.

**\`appearance\` secimini baglama gore yapin.** \`default\` ana navigasyon icin, \`ghost\` gomulu toolbar icin, \`outline\` vurgulu alanlar icin kullanin.

**Responsive davranisi planlayin.** \`mobileFallback="menu"\` ile dar ekranlarda hamburger menu fallback'i etkinlestirin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla root item eklemek**
7'den fazla kok oge gorsel karisiklik yaratir. \`overflowBehavior="collapse-to-more"\` ile tasanlar yonetin.

**❌ Submenu icinde submenu (ic ice) kullanmak**
Cok katmanli menuler erisim ve kullanim zorluklari yaratir. Tek seviye submenu tercih edin.

**❌ \`currentPath\` olmadan navigasyon menusu olusturmak**
Aktif sayfa isaretlenmezse kullanici nerede oldugunu bilemez.

**❌ \`ariaLabel\` vermeden kullanmak**
Ekran okuyucular menubar'in amacini anlayamaz. Anlamli bir ARIA etiketi saglayin.

**❌ Link ve aksiyon karisimini kontrolsuz birakmak**
Navigasyon linkleri ile komut aksiyonlarini ayni seviyede grupsuz kullanmak kullaniciyi sasirtir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Kok eleman \`role="menubar"\` ile isaretlenir. \`ariaLabel\` ile menubar landmark'i tanimlanir.

**Klavye Navigasyonu:** Sol/Sag ok tuslari ile root item'lar arasinda roving focus. Asagi ok ile submenu acilir. Escape ile submenu kapanir.

**Submenu:** Popup menu \`role="menu"\` ile render edilir. Menu item'lari \`role="menuitem"\` tasir. Ok tuslari ile gezinilir, Enter/Space ile secilir.

**Aktif Root:** \`aria-current\` ile aktif root isaretlenir. \`currentPath\` degistiginde otomatik guncellenir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.

**Focus Yonetimi:** Submenu kapatildiginda focus root item'a doner. Overflow menusunden cikista focus korunur.`,
      },
    ],
    relatedComponents: ["ContextMenu", "NavigationMenu", "AppHeader", "DesktopMenubar"],
  },

  AppHeader: {
    componentName: "AppHeader",
    summary: "AppHeader, MenuBar primitive'i ustunde branding, utility cluster, responsive shell ve subdomain hissi veren ust uygulama header recipe galerisidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `AppHeader, \`MenuBar\` primitive'ini kullanarak uygulama ust bari recipe'leri sunan bir **recipe galeri** bilesenidir. Temel odak alanlari:

- **Brand-first shell** — Logo, uygulama adi ve marka alani ile baslayan header
- **Utility cluster** — Sag tarafta bildirim, hesap ve ayarlar gibi ek kontroller
- **Responsive fallback** — Dar gorunumde ikon-only veya hamburger menu modu
- **Subdomain ritmi** — Farkli alt uygulamalar icin tutarli header yuzey hissi

MenuBar'in tum ozelliklerini (submenu, overflow, search handoff, gruplar) miras alir ve uzerine header-spesifik recipe varyantlari ekler.

\`\`\`tsx
import { MenuBar } from '@mfe/design-system';

<MenuBar
  startSlot={<Logo />}
  items={[
    { value: "home", label: "Ana Sayfa", icon: <HomeIcon />, href: "/" },
    { value: "products", label: "Urunler", icon: <BoxIcon />,
      menuItems: [
        { key: "list", label: "Urun Listesi" },
        { key: "categories", label: "Kategoriler" },
      ]
    },
  ]}
  endSlot={<UserMenu />}
  currentPath="/"
  appearance="default"
  ariaLabel="Uygulama header"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulamanin ana ust bari icin marka + navigasyon + utility bilesiminde
- SaaS uygulama shell'lerinde tutarli header deneyimi icin
- Subdomain veya modul bazli header varyantlari icin
- Utility cluster (bildirim, profil, ayarlar) iceren header icin

**Kullanmayin:**
- Yalnizca navigasyon listesi icin — bunun yerine \`NavigationMenu\` kullanin
- Sayfa ici toolbar icin — bunun yerine \`ActionHeader\` kullanin
- Mobil tab bar icin — bunun yerine \`BottomNavigation\` kullanin
- Basit breadcrumb header icin — bunun yerine \`PageHeader\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│ [Brand/Logo] │ [Nav Items...] │ [Utility Cluster] │
│  startSlot   │  MenuBar core  │  endSlot          │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Start Slot** — Logo, uygulama adi veya marka alani
2. **MenuBar Core** — Navigasyon item'lari, submenu'ler ve overflow
3. **End Slot** — Bildirim, profil, ayarlar gibi utility kontrolleri
4. **Responsive Layer** — Dar ekranlarda ikon-only veya menu fallback`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Marka alanini \`startSlot\` ile sabitleyin.** Logo ve uygulama adi her zaman gorunur olmalidir.

**Utility kontrolleri \`endSlot\` ile sag tarafa yerlestitin.** Bildirim, profil ve ayarlar sag tarafta beklenir.

**Responsive davranisi test edin.** \`mobileFallback="menu"\` veya \`labelVisibility="responsive"\` ile dar ekran davranisini planlayin.

**\`currentPath\` ile aktif navigasyonu isaretleyin.** Kullanici uygulamada nerede oldugunu her zaman bilmelidir.

**Subdomain varyantlari icin tutarli tasarim dili kullanin.** Farkli moduller icin ayni header yapis ve renk sistemi uzerinden calisin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla utility ogesi eklemek**
Sag tarafta 4-5'ten fazla ikon gorsel karisiklik yaratir. Daha az onemli aksiyonlari submenu'ye tasiyin.

**❌ Marka alanini responsive'de gizlemek**
Logo ve uygulama adi her zaman gorunur olmalidir; gizlemek kimlik kaybina neden olur.

**❌ Header icinde form veya detay icerigi yerlestirmek**
Header yalnizca navigasyon ve utility kontrolleri icindir. Icerik icin sayfa govdesini kullanin.

**❌ \`ariaLabel\` vermeden kullanmak**
Ekran okuyucular header'in amacini anlayamaz.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** MenuBar'in tum ARIA ozelliklerini miras alir. \`role="menubar"\` ve \`ariaLabel\` ile header landmark'i tanimlanir.

**Klavye:** Sol/Sag ok tuslari ile navigasyon, Asagi ok ile submenu, Escape ile kapatma. Tab ile utility slot'a gecis.

**Responsive:** Dar gorunumde hamburger menu focus trap ile acilir ve Escape ile kapanir.

**Utility Cluster:** End slot icindeki butonlar Tab sirasi ile erisilebilir. Her biri kendi \`aria-label\` bilgisini tasir.

**Marka Alani:** Logo \`alt\` metni ile ekran okuyuculara uygulama adini bildirir.`,
      },
    ],
    relatedComponents: ["MenuBar", "NavigationMenu", "DesktopMenubar", "ActionHeader"],
  },

  NavigationMenu: {
    componentName: "NavigationMenu",
    summary: "NavigationMenu, MenuBar primitive'i ustunde buyuk bilgi mimarisi, overflow kontrolu ve top-level link akisi icin navigation menu recipe vitrini sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `NavigationMenu, \`MenuBar\` primitive'ini kullanarak buyuk olcekli navigasyon mimarileri icin recipe varyantlari sunan bir **recipe galeri** bilesenidir. Temel odak alanlari:

- **Information scent** — Ust-seviye route'lari acik etiketler ve ikonlarla sunma
- **Priority-managed overflow** — \`overflowPriority\` ile onemli ogeleri koruyarak tasan ogeleri More menusune tasima
- **Pinned destinations** — Favori veya kritik rotalari sabitleyerek overflow'dan koruma
- **Subdomain navigation** — Alt uygulama veya modul bazli navigasyon gruplamalari
- **Route-aware emphasis** — \`currentPath\` ile aktif root'u otomatik vurgulama

\`\`\`tsx
import { MenuBar } from '@mfe/design-system';

<MenuBar
  items={[
    { value: "overview", label: "Genel Bakis", icon: <DashboardIcon />, href: "/overview", pinned: true },
    { value: "analytics", label: "Analitik", icon: <ChartIcon />, href: "/analytics" },
    { value: "reports", label: "Raporlar", icon: <FileIcon />,
      menuItems: [
        { key: "daily", label: "Gunluk Rapor" },
        { key: "weekly", label: "Haftalik Rapor" },
      ],
      overflowPriority: 2,
    },
    { value: "settings", label: "Ayarlar", icon: <GearIcon />, href: "/settings", group: "utility" },
  ]}
  currentPath="/overview"
  overflowBehavior="collapse-to-more"
  ariaLabel="Ana navigasyon menusu"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Buyuk bilgi mimarisi olan uygulamalarda ana navigasyon icin
- Cok sayida ust-seviye route'un overflow ile yonetilmesi gereken sayfalarda
- Subdomain veya modul bazli navigasyon gruplamalari icin
- Pinned/favori destination destegi gerektiren senaryolarda
- Route-aware aktif sayfa vurgulama icin

**Kullanmayin:**
- Komut paleti veya aksiyon odakli toolbar icin — bunun yerine \`ActionHeader\` kullanin
- Desktop uygulamasi menubar ritmi icin — bunun yerine \`DesktopMenubar\` kullanin
- Marka + utility cluster iceren tam header icin — bunun yerine \`AppHeader\` kullanin
- Basit 3-4 linkli navigasyon icin — bunun yerine dogrudan \`LinkInline\` listesi kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│ [NavItem] [NavItem] [NavItem] ... [More ▾] │ [Utility] │
│  ↑ pinned  ↑ active                        │           │
│            ↓                               │           │
│  ┌──────────────┐                          │           │
│  │ [SubItem]    │                          │           │
│  │ [SubItem]    │                          │           │
│  └──────────────┘                          │           │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Navigation Bar** — \`role="menubar"\` ile yatay navigasyon cubugu
2. **Nav Items** — Route linkleri veya submenu tetikleyicileri
3. **Pinned Indicator** — Sabitlenmis ogelerde gorsel isaret
4. **Overflow Menu** — Tasan ogeleri toplayan More butonu
5. **Submenu** — Alt navigasyon ogeleri
6. **Utility Segment** — Sag tarafta yardimci ogeler`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`overflowPriority\` ile onemli ogeleri koruyun.** Yuksek oncelikli ogeler overflow sirasinda gorunur kalir.

**\`pinned\` ile kritik destination'lari sabitleyin.** Kullanicinin her zaman erismesi gereken rotalari pinned yapin.

**Gruplari mantiksal olarak ayirin.** \`primary\`, \`secondary\`, \`utility\` gruplari ile navigasyonu segmentleyin.

**\`currentPath\` ile aktif route'u isaretleyin.** Kullanici her zaman nerede oldugunu bilmelidir.

**Overflow davranisini test edin.** Farkli ekran boyutlarinda \`collapse-to-more\` davranisini dogrulayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tum ogelere ayni \`overflowPriority\` vermek**
Oncelik farkliligi olmadan overflow mantiksiz calisir. Onemli ogelere yuksek, ikincil ogelere dusuk oncelik verin.

**❌ Cok fazla pinned oge kullanmak**
Her ogeyi sabitlemek overflow amacini ortadan kaldirir. Yalnizca gercekten kritik ogeleri sabitleyin.

**❌ Submenu'leri cok derin yapmak**
Tek seviye submenu yeterlidir. Derin hiyerarsi icin sayfa ici navigasyon kullanin.

**❌ Gruplar arasi dengesiz dagilim**
Primary grubunda 10 oge, utility'de 1 oge gibi dengesiz dagilim gorsel uyumsuzluk yaratir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** MenuBar'in tum ARIA ozelliklerini miras alir. \`role="menubar"\` ile navigasyon landmark'i olusturulur.

**Klavye:** Sol/Sag ok tuslari ile root item gezinme. Asagi ok ile submenu acma. Escape ile kapatma.

**Aktif Route:** \`currentPath\` ile \`aria-current\` otomatik atanir. Ekran okuyucular aktif sayfayi duyurur.

**Overflow:** More menusu klavye ile erisilebilir. Tasan ogeler menu icinde Tab/ok tuslari ile gezinilir.

**Pinned Items:** Sabitlenmis ogeler gorsel olarak isaretlenir ve overflow hesaplamasinda her zaman korunur.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.`,
      },
    ],
    relatedComponents: ["MenuBar", "AppHeader", "DesktopMenubar", "ActionHeader"],
  },

  ActionHeader: {
    componentName: "ActionHeader",
    summary: "ActionHeader, MenuBar primitive'i ustunde selection-driven bulk actions, dense ops header ve governance akisini sunan aksiyon odakli header recipe galerisidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ActionHeader, \`MenuBar\` primitive'ini kullanarak aksiyon ve komut odakli header recipe'leri sunan bir **recipe galeri** bilesenidir. Temel odak alanlari:

- **Selection-driven bulk actions** — Secili ogelere gore toplu aksiyon butonlari gosterme
- **Dense operations toolbar** — Yogun operasyonel panellerde kompakt aksiyon cubugu
- **Governance-safe readonly** — \`access="readonly"\` ile salt okunur mod
- **Task-oriented grouping** — Aksiyonlari gorev turune gore gruplama

\`\`\`tsx
import { MenuBar } from '@mfe/design-system';

<MenuBar
  items={[
    { value: "delete", label: "Sil", icon: <TrashIcon />, emphasis: "promoted" },
    { value: "export", label: "Disa Aktar", icon: <DownloadIcon /> },
    { value: "archive", label: "Arsivle", icon: <ArchiveIcon /> },
  ]}
  size="sm"
  appearance="ghost"
  ariaLabel="Toplu islem aksiyonlari"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Secili ogelere toplu islem uygulamak icin (silme, disa aktarma, arsivleme)
- Operasyonel panellerde yogun aksiyon cubugu icin
- Governance ve yetki tabanli aksiyon kontrolu icin
- Tablo veya liste ustunde kontextuel aksiyon bari olarak

**Kullanmayin:**
- Ana uygulama navigasyonu icin — bunun yerine \`NavigationMenu\` veya \`AppHeader\` kullanin
- Sayfa basligi ve meta bilgisi icin — bunun yerine \`PageHeader\` kullanin
- Form submit aksiyonlari icin — bunun yerine form ici \`Button\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│ [Selection Badge?] │ [Action] [Action] ... │ [Utility?] │
│   3 oge secildi     │  Sil  Disa Aktar      │            │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Action Bar** — \`role="menubar"\` ile yatay aksiyon cubugu
2. **Selection Badge** (opsiyonel) — Secili oge sayisini gosteren isaret
3. **Action Items** — Toplu islem butonlari (silme, disa aktarma, arsivleme vb.)
4. **Promoted Actions** — \`emphasis="promoted"\` ile vurgulanan kritik aksiyonlar
5. **Utility Slot** (opsiyonel) — Ek kontroller`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Yikici aksiyonlari vurgulayin.** \`emphasis="promoted"\` veya gorsel farklilik ile silme gibi kritik aksiyonlari one cikarin.

**Secim durumuna gore aksiyonlari gosterin.** Secili oge yokken aksiyon bari gizlenebilir veya disabled olabilir.

**\`size="sm"\` ile yogun panellerde kullanin.** Kompakt boyut operasyonel gorunumlerde yer tasarrufu saglar.

**\`access="readonly"\` ile governance kontrolu saglayin.** Yetkisiz kullanicilarin aksiyonlari gormesi ancak kullanamamasi gerektiginde readonly mod kullanin.

**Aksiyon gruplari olusturun.** Iliskili aksiyonlari yan yana, farkli kategorileri gruplar arasi bosluk ile ayirin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Navigasyon linkleri ile karistirmak**
ActionHeader aksiyonlar icindir; navigasyon linkleri \`NavigationMenu\` ile yonetilmelidir.

**❌ Cok fazla aksiyon ogesi eklemek**
5-6'dan fazla aksiyon gorsel karisiklik yaratir. Daha az onemli aksiyonlari submenu'ye tasiyin.

**❌ Yikici aksiyonlari onaysiz calistirmak**
Silme gibi geri donulemez aksiyonlar onay dialog'u ile korunmalidir.

**❌ Secim olmadan aksiyon bari gostermek**
Hicbir oge secili degilken toplu aksiyon bari gosterilmemelidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** MenuBar'in tum ARIA ozelliklerini miras alir. \`role="menubar"\` ve \`ariaLabel\` ile aksiyon bari tanimlanir.

**Klavye:** Sol/Sag ok tuslari ile aksiyon butonlari arasinda gezinme. Enter/Space ile etkinlestirme.

**Selection Badge:** Secim degistiginde ekran okuyucu \`aria-live\` ile oge sayisini duyurur.

**Readonly:** \`access="readonly"\` durumunda butonlar gorsel olarak devre disi gorunur ve etkilesim engellenir.

**Yikici Aksiyonlar:** Silme gibi aksiyonlar gorsel olarak farklilasitirilir ve onay dialog'u ile ek katman eklenir.`,
      },
    ],
    relatedComponents: ["MenuBar", "AppHeader", "NavigationMenu", "Button"],
  },
};
