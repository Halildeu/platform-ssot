import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  ContextMenu: {
    componentName: "ContextMenu",
    summary: "ContextMenu, sag tik veya uzun basma ile etkinlesen, aksiyon ve komut listesi sunan overlay baglam menusu bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ContextMenu, bir hedef elemanin uzerinde sag tiklama ile etkinlesen **overlay menu** bilesenidir. Menu ogeleri, ayiricilar ve etiket gruplari destekler.

Temel ozellikleri:
- **Right-click trigger** — Hedef elemanin uzerinde sag tik ile acilma
- **Keyboard navigation** — Ok tuslari, Enter/Space ve Escape destegi
- **Viewport clamping** — Menu konumunun ekran sinirlari icinde tutulmasi
- **Danger items** — Yikici aksiyonlar icin gorsel farklilik
- **Shortcuts** — Menu ogelerinde klavye kisayolu gosterimi

\`\`\`tsx
import { ContextMenu } from '@mfe/design-system';

<ContextMenu
  items={[
    { key: "edit", label: "Duzenle", icon: <EditIcon />, shortcut: "Ctrl+E", onClick: handleEdit },
    { type: "separator", key: "sep1" },
    { type: "label", key: "label1", label: "Tehlikeli Islemler" },
    { key: "delete", label: "Sil", icon: <TrashIcon />, danger: true, onClick: handleDelete },
  ]}
>
  <Card>Sag tiklayin</Card>
</ContextMenu>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tablo satirlari, kartlar veya liste ogeleri uzerinde hizli erisim menusu icin
- Sag tik ile kontextuel aksiyonlar sunmak icin
- Dosya yonetimi, metin editoru veya kanban tahtasi gibi zengin etkilesim alanlarinda
- Kisayol bilgisi ile desteklenmis aksiyon listeleri icin

**Kullanmayin:**
- Ana navigasyon icin — bunun yerine \`MenuBar\` veya \`NavigationMenu\` kullanin
- Dropdown secim listesi icin — bunun yerine \`Select\` veya \`Combobox\` kullanin
- Tooltip benzeri bilgi gosterimi icin — bunun yerine \`Tooltip\` kullanin
- Kalici aksiyon paneli icin — bunun yerine \`ActionHeader\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
[Trigger Element]  ← children prop
        ↓ right-click
┌────────────────────────┐
│ [Label Header]         │
│ ───────────────────    │
│ [Icon] [Label] [⌘+E]  │
│ [Icon] [Label] [⌘+D]  │
│ ───────────────────    │
│ [Icon] [Label] (danger)│
└────────────────────────┘
\`\`\`

1. **Trigger Wrapper** — \`children\` prop'u ile sarmalanan sag-tik alani
2. **Menu Surface** — \`role="menu"\` ile overlay menu paneli
3. **Menu Item** — \`role="menuitem"\` ile her bir aksiyon ogesi
4. **Separator** — \`role="separator"\` ile gorsel ayirici cizgi
5. **Label** — Grup basligi; tiklanabilir degildir
6. **Icon Slot** (opsiyonel) — Oge ikonlari
7. **Shortcut** (opsiyonel) — Klavye kisayolu metni`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Separator ile aksiyonlari gruplayin.** Iliskili aksiyonlari bir arada, tehlikeli aksiyonlari ayri bir grupta tutun.

**Danger ogelerini alt kisimda konumlandirin.** Yikici aksiyonlar menunun sonunda beklenilir.

**Klavye kisayollarini gosterin.** \`shortcut\` prop'u ile kullanicilara hizli erisim bilgisi verin.

**Disabled ogeleri aciklayin.** \`disabled\` ogelerde neden kullanilamadigini ipucu olarak gosterin.

**Menu uzunlugunu sinirli tutun.** 8-10 ogeden fazla menu karisiklik yaratir. Alt gruplama veya ayri arayuz dusunun.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla menu ogesi eklemek**
10'dan fazla oge tarama zorluklari yaratir. Iliskili aksiyonlari gruplayin veya farkli arayuzlere tasiyin.

**❌ Sag tik disinda baska tetikleyici olmadan birakmak**
Dokunmatik cihazlarda sag tik yoktur. Alternatif erisim yolu (buton, uzun basma) dusunun.

**❌ Tehlikeli aksiyonlari onaysiz calistirmak**
Silme gibi aksiyonlar dogrudan context menu'den calistirilmamali; onay dialog'u ekleyin.

**❌ Navigasyon linkleri icin kullanmak**
Context menu aksiyonlar icindir; sayfa navigasyonu icin \`LinkInline\` veya \`MenuBar\` kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Menu yuzeyinde \`role="menu"\` kullanilir. Her oge \`role="menuitem"\` tasir. Ayiricilar \`role="separator"\` ile isaretlenir.

**Klavye Navigasyonu:** Asagi/Yukari ok tuslari ile ogeler arasinda gezinme. Enter/Space ile oge etkinlestirme. Escape ile menu kapatma.

**Focus Yonetimi:** Menu acildiginda ilk ogeye focus atanir. Menu kapandiginda focus tetikleyici elemana doner.

**Dis Tiklama:** Menu disina tiklandiginda otomatik kapanir.

**Disabled Items:** \`disabled\` ogeler gorsel olarak devre disi gorunur (\`opacity-50\`) ve tiklanamaz.

**Danger Items:** Tehlikeli ogeler gorsel olarak farkli renk ile (kirmizi) vurgulanir.`,
      },
    ],
    relatedComponents: ["MenuBar", "DropdownMenu", "ActionHeader"],
  },

  DesktopMenubar: {
    componentName: "DesktopMenubar",
    summary: "DesktopMenubar, MenuBar primitive'i ustunde File/View/Tools odakli, hover trigger ve typed submenu ile masaustu menubar ritmine yakin bir ust menu deneyimi sunan recipe galerisidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DesktopMenubar, \`MenuBar\` primitive'ini kullanarak masaustu uygulama menubar'larini taklit eden **recipe galeri** bilesenidir. Temel odak alanlari:

- **File/View/Tools root modeli** — Klasik masaustu uygulama menu yapisi
- **Hover submenu trigger** — \`submenuTrigger="hover"\` ile fareyle uzerine gelince submenu acma
- **Typed submenu patterns** — Komut, secim ve ayar turlerinde alt menu icerikleri
- **Keyboard continuity** — Masaustu menubar klavye navigasyon ritmi

\`\`\`tsx
import { MenuBar } from '@mfe/design-system';

<MenuBar
  items={[
    { value: "file", label: "Dosya",
      menuItems: [
        { key: "new", label: "Yeni", shortcut: "Ctrl+N" },
        { key: "open", label: "Ac", shortcut: "Ctrl+O" },
        { key: "sep1", type: "separator" },
        { key: "save", label: "Kaydet", shortcut: "Ctrl+S" },
        { key: "save-as", label: "Farkli Kaydet" },
      ]
    },
    { value: "edit", label: "Duzenle",
      menuItems: [
        { key: "undo", label: "Geri Al", shortcut: "Ctrl+Z" },
        { key: "redo", label: "Yinele", shortcut: "Ctrl+Y" },
      ]
    },
    { value: "view", label: "Gorunum",
      menuItems: [
        { key: "zoom-in", label: "Yakinlastir" },
        { key: "zoom-out", label: "Uzaklastir" },
      ]
    },
  ]}
  submenuTrigger="hover"
  size="sm"
  appearance="ghost"
  ariaLabel="Uygulama menusu"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Masaustu uygulamasi hissi veren web uygulamalarinda
- File/Edit/View/Tools gibi klasik menu yapisi gerektiren editoer ve araclarada
- IDE benzeri arayuzlerde komut menusu icin
- Hover ile submenu acma beklenen deneyimli kullanici arayuzlerinde

**Kullanmayin:**
- Mobil oncelikli uygulamalarda — hover destegi sinirlidir
- Ana site navigasyonu icin — bunun yerine \`NavigationMenu\` kullanin
- Uygulama header'i icin — bunun yerine \`AppHeader\` kullanin
- Kontextuel aksiyonlar icin — bunun yerine \`ContextMenu\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│ [Dosya ▾] [Duzenle ▾] [Gorunum ▾] [Araclar ▾]   │
│     ↓ hover                                      │
│ ┌──────────────────┐                             │
│ │ Yeni       Ctrl+N│                             │
│ │ Ac         Ctrl+O│                             │
│ │ ────────────────  │                             │
│ │ Kaydet     Ctrl+S│                             │
│ │ Farkli Kaydet     │                             │
│ └──────────────────┘                             │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Menubar** — \`role="menubar"\` ile yatay menu cubugu
2. **Root Triggers** — Her biri submenu tetikleyicisi olan ust-seviye etiketler
3. **Submenu Panel** — Hover veya tikla ile acilan popup menu
4. **Menu Items** — Komut aksiyonlari; isteğe bagli ikon ve kisayol
5. **Separators** — Aksiyon gruplarini ayiran cizgiler`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Klasik menu yapisi izleyin.** File/Edit/View/Tools siralamasini kullanicilar taniyor; bu ritmi koruyun.

**\`submenuTrigger="hover"\` ile masaustu hissi verin.** Hover trigger deneyimli kullanicilar icin hiz saglar.

**Kisayollari gosterin.** \`shortcut\` ile Ctrl+S, Ctrl+Z gibi kisayol bilgisini menu icinde sunun.

**\`size="sm"\` ve \`appearance="ghost"\` tercih edin.** Masaustu menubar kompakt ve minimal olmalidir.

**Separator ile mantiksal gruplama yapin.** Iliskili komutlari bir arada, farkli kategorileri ayiricilarla bolumlendirin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Mobil arayuzlerde hover trigger kullanmak**
Dokunmatik cihazlarda hover yoktur. Mobil icin \`submenuTrigger="click"\` tercih edin.

**❌ Cok derin submenu hiyerarsileri**
Ic ice iki seviye submenu bile kullaniciyi zorlayabilir. Tek seviye submenu yeterlidir.

**❌ Navigasyon linkleri ile karistirmak**
DesktopMenubar komut ve aksiyonlar icindir; sayfa navigasyonu icin \`NavigationMenu\` kullanin.

**❌ Buyuk boyut ve goze batan gorunum kullanmak**
Masaustu menubar kompakt olmalidir. \`size="md"\` ve \`appearance="default"\` gereksiz alan harcar.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** MenuBar'in tum ARIA ozelliklerini miras alir. \`role="menubar"\` ile menu landmark'i olusturulur.

**Klavye Navigasyonu:** Sol/Sag ok tuslari ile root menuler arasi gecis. Asagi ok ile submenu acma. Escape ile kapatma. Home/End ile ilk/son root'a atlama.

**Hover ve Klavye Paritesi:** Hover ile acilan menuler ayni zamanda klavye ile de erisilebilir olmalidir. \`submenuTrigger="hover"\` kullanildiginda klavye destegi korunur.

**Submenu Gecisleri:** Bir root'tan digerine geciste onceki submenu otomatik kapanir ve yeni submenu acilir. Focus hicbir zaman kaybolmaz.

**Kisayol Gosterimi:** Kisayol bilgileri \`<span>\` ile render edilir ve ekran okuyuculara duyurulur.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.`,
      },
    ],
    relatedComponents: ["MenuBar", "AppHeader", "NavigationMenu", "ContextMenu"],
  },

  NotificationDrawer: {
    componentName: "NotificationDrawer",
    summary: "NotificationDrawer, bildirim merkezini sag taraftan kayan bir overlay panel olarak sunar. OverlaySurface uzerinde NotificationPanel'i sarar ve acma/kapama, portal ve erisim kontrolu saglar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `NotificationDrawer, \`OverlaySurface\` ile \`NotificationPanel\` bilesenlerini birlestirerek bildirim merkezini sag taraftan kayan bir cekmece (drawer) olarak sunar. Overlay tiklamasi, Escape tusu ve portal destegi ile tam kontrol saglar.

\`\`\`tsx
import { NotificationDrawer } from '@mfe/design-system';

<NotificationDrawer
  open={drawerOpen}
  onClose={(reason) => setDrawerOpen(false)}
  items={notifications}
  onMarkAllRead={handleMarkAllRead}
  onRemoveItem={handleRemove}
  showFilters
  grouping="priority"
  dialogLabel="Bildirim merkezi"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulamanin herhangi bir sayfasindan bildirim merkezine erismek istediginde
- Kullaniciya bildirimlerini goruntuleyip yonetebilecegi bir yan panel sunmak istediginde
- Overlay ile mevcut sayfa iceriginin ustunde bildirim listesi gostermek istediginde

**Kullanmayin:**
- Bildirim listesini sayfa icine gomulu gostermek istiyorsaniz — \`NotificationPanel\` kullanin
- Tek bir bildirim toast'u gostermek icin — \`ToastProvider\` kullanin
- Bildirim icerigi kucuk ve basitse — \`NotificationItemCard\` tek basina yeterli olabilir`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌─────────────────────────────────────┐
│  [Overlay Backdrop]                 │
│                    ┌───────────────┐│
│                    │ × Kapat       ││
│                    │ ─────────────  ││
│                    │ Bildirimler   ││
│                    │ [Filtreler]   ││
│                    │ [Kart 1]      ││
│                    │ [Kart 2]      ││
│                    │ [Kart 3]      ││
│                    └───────────────┘│
└─────────────────────────────────────┘
\`\`\`

1. **OverlaySurface** — Sag taraftan kayan overlay konteyner; backdrop, ESC ve dis tiklama destegi
2. **Kapat Butonu** — \`×\` ikonu ile drawer'i kapatir
3. **NotificationPanel** — Tum bildirim listesi, filtreler ve aksiyonlar
4. **Portal** — \`portalTarget\` ile DOM agacinda baska yere render edilebilir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`closeOnOverlayClick\` ve \`closeOnEscape\` acik birakin.** Varsayilan degerler \`true\`; kullanicinin hizlica kapatabilmesi icin bu davranisi koruyun.

**\`destroyOnHidden\` ile bellek tasarruf edin.** Varsayilan \`true\`; kapali drawer DOM'dan kaldirilir. Animasyon korumak istiyorsaniz \`keepMounted\` kullanin.

**\`widthClassName\` ile genislik kontrol edin.** Varsayilan \`max-w-md\`; buyuk bildirim listeleri icin \`max-w-lg\` tercih edebilirsiniz.

**\`dialogLabel\` ile erisilebilir etiket verin.** Ekran okuyuculari icin anlamli bir baslik belirleyin.

**Portal kullanimini degerlendirin.** Karmasik z-index yapilari icin \`portalTarget\` veya \`disablePortal\` tercihini bilineli yapin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Drawer'i surekli acik birakmak**
Drawer overlay tabanli bir bilesen; surekli gorunur panel icin \`NotificationPanel\` kullanin.

**❌ \`closeOnEscape={false}\` ile Escape desteigini kapatmak**
Klavye kullanicilari icin temel erisim yontemidir, kaldirmayin.

**❌ \`keepMounted\` ve \`destroyOnHidden={false}\` birlikte kullanmak**
Gereksiz DOM birikimi olusturur. Birini secin.

**❌ Drawer icine karmasik formlar yerlestirmek**
Drawer bildirim goruntulemesi icindir; veri girisi icin \`Dialog\` veya ayri sayfa kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Dialog Semantigi:** OverlaySurface \`role="dialog"\` ve \`aria-label\` ile isaretlenir. \`dialogLabel\` prop'u ile erisim etiketi belirlenir.

**Klavye Destegi:** Escape tusu ile drawer kapatilir. Focus drawer acildiginda iceriye, kapandiginda tetikleyici elemana doner.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir. Readonly ve disabled durumlarda kapat butonu ile aksiyonlar engellenir.

**Overlay Tiklamasi:** \`closeOnOverlayClick\` ile dis alana tiklayarak kapatma. Fare kullanicilari icin beklenen davranis.`,
      },
    ],
    relatedComponents: ["NotificationPanel", "NotificationItemCard", "ToastProvider"],
  },

  NotificationPanel: {
    componentName: "NotificationPanel",
    summary: "NotificationPanel, bildirim ogelerini filtreleme, gruplama, secim ve toplu aksiyonlarla listeleyen premium yuzeydir. Drawer icinde veya sayfa icine gomulu kullanilabilir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `NotificationPanel, \`NotificationItemCard\` ogelerini filtreleme (\`all\`, \`unread\`, \`high-priority\`, \`pinned\`), gruplama (\`priority\`, \`relative-day\`) ve toplu aksiyonlarla (tumunu okundu say, temizle, secimi yonet) sunan tam donanimli bildirim listesi bilesenidir.

\`\`\`tsx
import { NotificationPanel } from '@mfe/design-system';

<NotificationPanel
  items={notifications}
  showFilters
  activeFilter="unread"
  onFilterChange={setFilter}
  grouping="priority"
  dateGrouping="relative-day"
  onMarkAllRead={handleMarkAllRead}
  onRemoveItem={handleRemove}
  selectable
  onMarkSelectedRead={handleMarkSelectedRead}
  onRemoveSelected={handleRemoveSelected}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Bildirim listesini sayfa icine gomulu gostermek istediginde
- Filtreleme, gruplama ve toplu aksiyonlar gerektiren bildirim merkezlerinde
- \`NotificationDrawer\` icinde icerik olarak
- Dashboard'larda bildirim bolumleri olusturmak icin

**Kullanmayin:**
- Tek bir bildirim gostermek icin — \`NotificationItemCard\` yeterlidir
- Anlik bildirimler icin — \`ToastProvider\` kullanin
- Overlay panel olarak gostermek icin — \`NotificationDrawer\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌───────────────────────────────────────┐
│ Bildirimler    [Okundu Say] [Temizle] │
│ 3 okunmamis, toplam 12 olay          │
├───────────────────────────────────────┤
│ [Tumu(12)] [Okunmamis(3)] [Oncelikli]│
├───────────────────────────────────────┤
│ ▸ Pinlenmis                           │
│   [Kart 1]                            │
│ ▸ Yuksek oncelik                      │
│   [Kart 2]                            │
│ ▸ Diger bildirimler                   │
│   [Kart 3]                            │
│   [Kart 4]                            │
└───────────────────────────────────────┘
\`\`\`

1. **Header** — Baslik, ozet bilgisi ve toplu aksiyon butonlari
2. **Filtre Cubugu** — all/unread/high-priority/pinned filtre butonlari
3. **Bolum Etiketleri** — Gruplama aktifse bolum basliklarini gosterir
4. **Bildirim Kartlari** — \`NotificationItemCard\` ogeleri
5. **Bos Durum** — Bildirim yokken veya filtre bossa gosterilen mesaj
6. **Secim Araclari** — Selectable modda checkbox ve toplu secim butonlari`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`showFilters\` ile filtreleme sunun.** Cok sayida bildirim oldugunda kullanicilar okunmamis veya oncelikli olanlara hizlica erismek ister.

**\`grouping="priority"\` ile gorsel hiyerarsi olusturun.** Pinlenmis ve yuksek oncelikli bildirimlerin ayri bolumde gorunmesi onem sirasini netlestirir.

**\`dateGrouping="relative-day"\` ile zaman bağlami ekleyin.** Bugun/Dun/Daha eski gruplamasi ile bildirimlerin zamansal baglamini gosterin.

**Toplu aksiyonlari sunun.** \`onMarkAllRead\` ve \`onClear\` ile bildirim yonetimini hizlandirin.

**\`selectable\` modunu dikkatli kullanin.** Cok sayida bildirim uzerinde toplu islem gerektiginde aktif edin; aksi halde arayuzu gereksiz karistirmayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Filtreleme olmadan yuzlerce bildirim listelemek**
Uzun listeler performansi dusurur ve kullaniciyi bunaltir. \`showFilters\` aktif edin.

**❌ Kontrolllu ve kontrolsuz filtre state'ini karistirmak**
\`activeFilter\` verdiyseniz \`onFilterChange\` ile guncellemeyi de yonetin; ikisini karistirmayin.

**❌ Bos durum mesajlarini ozellestirmemek**
Varsayilan mesajlar yeterli olsa da uygulamaya ozel mesajlar kullanici deneyimini iyilestirir.

**❌ \`grouping\` ve \`dateGrouping\` ikisini birden agresif kullanmak**
Ic ice gruplama gorsel karmasikliga yol acar. Genellikle birini secmek yeterlidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elementi ile bildirim paneli isaretlenir. \`data-component="notification-panel"\` ile tanımlanir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir. Readonly/disabled durumda butonlar ve aksiyonlar engellenir.

**Filtre Butonlari:** Her filtre butonu aktif durumu gorsel olarak belirtir (\`variant="primary"\`). Disabled state korunur.

**Secim Modu:** Checkbox'lar \`aria-label\` ile isaretlenir. Secim ozeti ekran okuyuculara duyurulur.

**Bos Durum:** Bildirim yokken veya filtre bossa aciklayici mesaj goruntulenir.`,
      },
    ],
    relatedComponents: ["NotificationDrawer", "NotificationItemCard", "ToastProvider"],
  },

  NotificationItemCard: {
    componentName: "NotificationItemCard",
    summary: "NotificationItemCard, tek bir bildirimi tip, oncelik, pin durumu ve aksiyonlarla goruntuleyen premium kart bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `NotificationItemCard, bir \`NotificationSurfaceItem\` verisini tip badge'i (success/info/warning/error/loading), oncelik ve pin gostergeleri, zaman damgasi, birincil aksiyon butonu ve kaldirma butonu ile goruntuleyen kart bilesenidir.

\`\`\`tsx
import { NotificationItemCard } from '@mfe/design-system';

<NotificationItemCard
  item={{
    id: "n1",
    message: "Deploy basarili",
    description: "v2.4.1 production ortamina yuklendi",
    type: "success",
    priority: "high",
    pinned: false,
    read: false,
    createdAt: Date.now(),
  }}
  getPrimaryActionLabel={(item) => "Detay"}
  onPrimaryAction={(item) => navigateTo(item.id)}
  onRemove={(id) => removeNotification(id)}
  formatTimestamp={(ts) => new Date(ts!).toLocaleString("tr-TR")}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- \`NotificationPanel\` icinde bildirim ogeleri olarak
- Tekil bildirim kartlari gostermek icin
- Ozel bildirim listeleri olustururken yapi tasi olarak

**Kullanmayin:**
- Anlik gecici bildirim gostermek icin — \`ToastProvider\` kullanin
- Liste ve filtreleme gerekiyorsa — \`NotificationPanel\` kullanin
- Genel amacli kart icin — \`Card\` bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│ [☐?] [SUCCESS] [ONCELIKLI?] [PIN?]  │
│      Baslik mesaji                   │
│      Aciklama metni                  │
│      12.03.2025 14:30       [Detay]  │
│                               [×]   │
└──────────────────────────────────────┘
\`\`\`

1. **Secim Checkbox'i** (opsiyonel) — \`selectable\` aktifse goruntulenir
2. **Tip Badge'i** — success/info/warning/error/loading durumunu gosterir
3. **Oncelik Badge'i** (opsiyonel) — Yuksek oncelikli bildirimlerde ONCELIKLI etiketi
4. **Pin Badge'i** (opsiyonel) — Pinlenmis bildirimlerde PINLENMIS etiketi
5. **Mesaj** — Ana bildirim metni; okunmamis ise kalin, okunmus ise normal
6. **Aciklama** (opsiyonel) — Detay bilgisi
7. **Zaman Damgasi** — \`formatTimestamp\` ile ozellestirilebilir
8. **Birincil Aksiyon** (opsiyonel) — \`getPrimaryActionLabel\` ile dinamik etiketli buton
9. **Kaldirma Butonu** — \`onRemove\` ile bildirimi kapatir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`formatTimestamp\` ile yerel tarih formati kullanin.** Varsayilan \`toLocaleString()\` yeterli olsa da \`tr-TR\` locale'i ile tutarli gorunum saglayin.

**\`getPrimaryActionLabel\` ile baglamsal aksiyon etiketleri verin.** Farkli bildirim turlerine gore "Detay", "Incele", "Onayla" gibi etiketler kullanin.

**Okunmus/okunmamis farki gorsel olarak belirgindir.** Okunmamis kartlar kalin yazi, okunmuslar \`opacity-80\` ile farklilasir.

**\`type\` prop'unu dogru kullanin.** success/info/warning/error/loading turleri renk ve badge ile gorsel anlam tasir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tip bilgisi olmadan kart kullanmak**
Varsayilan \`info\` atanir ama bildirim turunu dogru belirlemek gorsel netlik saglar.

**❌ Cok uzun mesaj ve aciklama metinleri**
Kart kompakt olmali; uzun icerikler icin detay sayfasina yonlendirin.

**❌ \`onRemove\` olmadan kart gostermek**
Kullanici bildirimi kapatamaz hale gelir. Temizleme mekanizmasi sunun.

**❌ \`selectable\` modda \`onSelectedChange\` sagamamak**
Secim checkbox'i calisir ama ust bilesene bilgi iletilmez.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<article>\` elementi ile her bildirim karti isaretlenir. \`data-type\`, \`data-priority\`, \`data-read\` nitelikleri eklenir.

**Kaldirma Butonu:** \`aria-label\` ile "Bildirimi kapat" etiketi tasinir.

**Secim Checkbox'i:** \`aria-label\` ile bildirim mesajini iceren etiket otomatik olusturulur.

**Erisim Kontrolu:** \`access\` prop'u ile butonlar ve checkbox disabled edilebilir. \`accessReason\` ile \`title\` niteligi uzerinden neden bilgisi sunulur.

**Renk Kontrastı:** Tip badge'leri WCAG 2.1 AA kontrast gereksinimlerini karsilar.`,
      },
    ],
    relatedComponents: ["NotificationPanel", "NotificationDrawer", "ToastProvider"],
  },
};
