import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  DetailSectionTabs: {
    componentName: "DetailSectionTabs",
    summary: "DetailSectionTabs, detay sayfalarinda bolum navigasyonu icin sticky, kompakt ve otomatik sarmalanan sekme bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DetailSectionTabs, detay sayfalarinda farkli bolumleri gecis yapmak icin kullanilan **ozellestirilmis sekme** bilesenidir. Dahili olarak \`SectionTabs\` primitive'ini kullanir ve detay sayfalarina ozgu varsayilanlar saglar.

- **Sticky positioning** — Sayfa kaydirmada sekmeler ust kisimda sabit kalir
- **Compact density** — Varsayilan olarak \`compact\` yogunluk
- **Auto wrap** — \`autoWrapBreakpoint\` ile genis ekranlarda satirlara sarmalama
- **Badge & Description** — Her sekmede sayac badge'i ve tooltip aciklamasi
- **Disabled tabs** — Erisimi kisitlanmis sekmeleri devre disi birakma

\`\`\`tsx
import { DetailSectionTabs } from '@mfe/design-system';

<DetailSectionTabs
  tabs={[
    { id: "genel", label: "Genel Bilgiler", badge: "3" },
    { id: "islemler", label: "Islemler", badge: "28", description: "Son 30 gun" },
    { id: "belgeler", label: "Belgeler", description: "Yuklu dosyalar" },
    { id: "notlar", label: "Notlar", disabled: true },
  ]}
  activeTabId={activeTab}
  onTabChange={setActiveTab}
  ariaLabel="Musteri detay sekmeleri"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Detay sayfalarinda bolumleri (genel bilgi, islemler, belgeler vb.) ayirmak icin
- Uzun sayfalarda sticky sekme ile hizli bolum navigasyonu saglamak icin
- Her bolumdeki oge sayisini badge ile gostermek icin
- Belirli bolumleri yetki durumuna gore devre disi birakmak icin

**Kullanmayin:**
- Sayfa seviyesinde navigasyon icin — bunun yerine \`Tabs\` veya \`NavigationMenu\` kullanin
- Form adimlari icin — bunun yerine \`Steps\` veya \`MobileStepper\` kullanin
- Ayarlar/tercihler sekmeleri icin — bunun yerine \`Segmented\` kullanin
- Ic ice sekme katmanlari icin — tek seviye sekme kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────────────┐
│ [Genel Bilgiler (3)] [Islemler (28) i] [Belgeler i] [Notlar] │
│  aktif sekme           badge  tooltip    tooltip   disabled   │
└──────────────────────────────────────────────────────────────┘
  sticky — sayfa kaydirmada sabit kalir
\`\`\`

1. **Container** — \`sticky top-4 z-10\` ile ust kisimda sabitlenen kapsayici
2. **SectionTabs (Internal)** — \`Segmented\` bileseni uzerine kurulu sekme altyapisi
3. **Tab Items** — Etiket, badge ve aciklama tooltip'u iceren sekme ogeleri
4. **Active State** — Aktif sekme golge ve vurgu ile belirginlestirilir
5. **Badge** (opsiyonel) — Sekme icindeki oge sayisi veya durum gostergesi
6. **Description Tooltip** — Info ikonu ile hover'da gosterilen aciklama
7. **Disabled State** — Devre disi sekmelerde etkilesim engellenir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Sekme sayisini 3-7 arasinda tutun.** Fazla sekme kaydirma gerektirerek kullanici deneyimini dusurur.

**\`badge\` ile icerik sayisini gosterin.** Kullanicilar ilgili bolume gecmeden once icerik sayisini gormelidir.

**\`description\` ile her sekmenin amacini aciklayin.** Tooltip ile kisa aciklama eklemek ozellikle yeni kullanicilar icin faydalidir.

**\`sticky\` varsayilanini koruyun.** Uzun detay sayfalarinda sticky sekmeler bolum navigasyonunu kolaylastirir.

**\`ariaLabel\` ile baglam verin.** "Musteri detay sekmeleri" gibi aciklayici etiket ekran okuyucular icin onemlidir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Ic ice DetailSectionTabs kullanmak**
Iki katmanli sekme yapisi kullanicilari karistirir. Tek seviye sekme ile bolum ayirimi yeterlidir.

**❌ Navigasyon linki olarak kullanmak**
DetailSectionTabs sayfa ici bolum gecisi icindir. Farkli sayfalara yonlendirme icin \`NavigationMenu\` kullanin.

**❌ 10'dan fazla sekme eklemek**
Cok fazla sekme gorsel karisiklik yaratir. Sekmeleri gruplama veya alt sayfalara bolmeyi dusunun.

**❌ Tum sekmeleri disabled yapmak**
Kullanici hicbir bolume erisemezse bilesen gosterilmemelidir (\`hidden\` tercih edin).`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Dahili \`Segmented\` bileseni ARIA tab pattern'ini uygular. \`ariaLabel\` ile sekme grubu tanimlanir.

**Klavye:** Sol/Sag ok tuslari ile sekmeler arasi gecis. Enter/Space ile sekme etkinlestirme. Home/End ile ilk/son sekmeye atlama.

**Badge:** Badge icerigi ekran okuyucular tarafindan etiketle birlikte okunur.

**Description Tooltip:** Info ikonu \`title\` ozelligi ile tanimlanir ve tooltip icerigi ekran okuyuculara sunulur.

**Disabled:** Devre disi sekmeler \`aria-disabled\` ile isaretlenir ve Tab sirasinda atlanmaz, boylece kullanicilar neden devre disi oldugunu anlayabilir.

**Sticky:** Sticky konumlandirma ekran okuyucu akisini etkilemez; DOM sirasi korunur.`,
      },
    ],
    relatedComponents: ["SectionTabs", "Tabs", "Segmented", "Steps"],
  },

  SectionTabs: {
    componentName: "SectionTabs",
    summary: "SectionTabs, Segmented primitive'i ustune scroll/wrap layout, yogunluk ayari, aciklama tooltip'u ve erisim kontrolu ekleyen gelismis sekme bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `SectionTabs, \`Segmented\` bileseni uzerine kurulu olan ve **bolum navigasyonu** icin optimize edilmis gelismis sekme bilesenidir. Responsive layout, yogunluk ayari, aciklama tooltip'u ve erisim kontrolu gibi yetenekler sunar.

- **Layout modlari** — \`scroll\` (yatay kaydirma), \`wrap\` (satira sarma) ve \`auto\` (breakpoint'e gore otomatik)
- **Yogunluk** — \`compact\` ve \`comfortable\` modlari
- **Description display** — \`inline\` veya \`tooltip\` modunda aciklama gosterimi
- **Description visibility** — \`always\`, \`hover\`, \`active\`, \`active-or-hover\` gorunurluk secenekleri
- **Access control** — \`full\`, \`readonly\`, \`disabled\`, \`hidden\` erisim seviyeleri

\`\`\`tsx
import { SectionTabs } from '@mfe/design-system';

<SectionTabs
  items={[
    { value: "ozet", label: "Ozet", description: "Genel gorunum", badge: "5" },
    { value: "detay", label: "Detay", description: "Tum alanlar" },
    { value: "gecmis", label: "Gecmis", badge: "142" },
  ]}
  value={activeSection}
  onValueChange={setActiveSection}
  layout="auto"
  autoWrapBreakpoint="xl"
  density="compact"
  descriptionDisplay="tooltip"
  descriptionVisibility="hover"
  ariaLabel="Bolum sekmeleri"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Sayfa ici bolumleri ayirmak icin
- Responsive sekme navigasyonu gerektiren durumlarda (dar ekranlarda kaydirma, genis ekranlarda sarma)
- Badge ve aciklama ile zenginlestirilmis sekme deneyimi icin
- Erisim kontrolu ile yetki tabanli sekme kisitlamasi icin

**Kullanmayin:**
- Detay sayfalarinda sticky sekme icin — bunun yerine \`DetailSectionTabs\` kullanin (hazir varsayilanlar saglar)
- Basit segmented kontrol icin — bunun yerine \`Segmented\` kullanin
- Form adimlari icin — bunun yerine \`Steps\` kullanin
- Sayfa seviyesinde navigasyon icin — bunun yerine \`Tabs\` veya \`NavigationMenu\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────────────────────┐
│ Viewport (scroll veya wrap)                                      │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ [Ozet (5) i]  [Detay i]  [Gecmis (142)]                   │   │
│ │  aktif         hover da tooltip    badge                   │   │
│ └────────────────────────────────────────────────────────────┘   │
│  scroll modunda yatay kaydirma, wrap modunda satira sarma        │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

1. **Root** — \`data-component="section-tabs"\` ile tanimlanan kapsayici
2. **Viewport** — Scroll veya wrap layout'a gore kaydirma alani
3. **Segmented (Internal)** — Pill seklinde ghost gorunumlu segment kontrol
4. **Tab Items** — Etiket, badge ve aciklama iceren sekme ogeleri
5. **Badge** (opsiyonel) — Sekme icerik sayaci
6. **Description** — Inline metin veya tooltip olarak gosterilen aciklama
7. **Info Icon** — Tooltip modunda aciklama tetikleyicisi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`layout="auto"\` ile responsive davranis saglayin.** \`autoWrapBreakpoint\` ile dar ekranlarda yatay kaydirma, genis ekranlarda satirlara sarma otomatik yonetilir.

**\`descriptionDisplay="tooltip"\` tercih edin.** Aciklamalar tooltip olarak gosterildiginde alan tasarrufu saglanir ve arayuz temiz kalir.

**\`density="compact"\` ile yogun arayuzlerde kullanin.** Detay sayfalarinda ve panellerde kompakt yogunluk tercih edin.

**\`classes\` prop'u ile ince ayar yapin.** \`root\`, \`list\`, \`item\`, \`activeItem\`, \`viewport\` gibi slotlar ile gorunumu ozellestirin.

**Kontrollu mod (\`value\` + \`onValueChange\`) kullanin.** Aktif sekme durumunu ust bilesenden yonetin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ \`layout="scroll"\` ile cok genis sekmeler kullanmak**
Scroll modunda sekmeler gorunmez olabilir. Sekme etiketlerini kisa tutun veya \`auto\` layout kullanin.

**❌ \`descriptionVisibility="always"\` ile uzun aciklamalar vermek**
Daima gorunen uzun aciklamalar alan harcar. \`hover\` veya \`tooltip\` tercih edin.

**❌ \`Segmented\` yerine SectionTabs'i basit toggle icin kullanmak**
Aciklama, badge ve layout yetenekleri gerekmiyorsa \`Segmented\` daha uygun ve hafiftir.

**❌ \`autoWrapBreakpoint\` olmadan \`layout="auto"\` kullanmak**
Varsayilan breakpoint (\`2xl\`) cogu durumda cok gec sarar. Icerige uygun breakpoint belirleyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Dahili \`Segmented\` bileseni uzerinden ARIA tab/tablist pattern'i uygulanir. \`ariaLabel\` ile sekme grubu tanimlanir.

**Klavye:** Sol/Sag ok tuslari ile sekmeler arasi gezinme. Enter/Space ile etkinlestirme.

**Tooltip:** Info ikonu \`title\` ozelligi tasir. Tooltip icerigi \`Tooltip\` bileseni uzerinden erisilebilir sekilde sunulur.

**Description:** \`inline\` modda aciklama gorunur metin olarak yer alir. \`tooltip\` modda gorunmeyen aciklama \`sr-only\` ile ekran okuyuculara sunulur.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` durumunda bilesen tamamen gizlenir. \`disabled\` ve \`readonly\` modlarda etkilesim kisitlanir.

**Scroll:** Yatay kaydirma alani scrollbar gizlenerek sunulur ancak klavye ile navigasyon korunur.`,
      },
    ],
    relatedComponents: ["DetailSectionTabs", "Segmented", "Tabs", "Steps"],
  },

  ActionBar: {
    componentName: "ActionBar",
    summary: "ActionBar, MenuBar primitive'i ustunde selection-driven bulk actions, dense ops header ve readonly governance akisini ayri bir action bar galerisi olarak sunan recipe bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ActionBar, \`MenuBar\` primitive'ini kullanarak secim odakli toplu aksiyonlar, yogun operasyon header'lari ve governance-safe readonly modunu sunan bir **recipe galeri** bilesenidir. Temel odak alanlari:

- **Selection-driven bulk actions** — Secili ogelere gore toplu aksiyon butonlari gosterme
- **Dense operations toolbar** — Yogun operasyonel panellerde kompakt aksiyon cubugu
- **Governance-safe readonly** — \`access="readonly"\` ile salt okunur mod
- **Task-oriented grouping** — Aksiyonlari gorev turune gore gruplama
- **High-signal operational header** — Operasyonel veri ve aksiyonlari tek satirda birlestirme

\`\`\`tsx
import { MenuBar } from '@mfe/design-system';

<MenuBar
  items={[
    { value: "select-all", label: "Tumunu Sec", icon: <CheckAllIcon /> },
    { value: "delete", label: "Sil", icon: <TrashIcon />, emphasis: "promoted" },
    { value: "export", label: "Disa Aktar", icon: <DownloadIcon /> },
    { value: "move", label: "Tasi", icon: <MoveIcon /> },
  ]}
  size="sm"
  appearance="filled"
  ariaLabel="Toplu islem cubugu"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tablo veya liste secimi sonrasi toplu islem cubugu olarak
- Operasyonel panellerde yogun aksiyon bari icin
- Governance ve yetki tabanli aksiyon kontrolu gerektiren senaryolarda
- Grid veya liste ustunde kontextuel aksiyon header'i olarak
- Secili oge sayisini gosterip ilgili aksiyonlari sunmak icin

**Kullanmayin:**
- Uygulama navigasyonu icin — bunun yerine \`NavigationMenu\` veya \`AppHeader\` kullanin
- Sayfa basligi ve meta bilgisi icin — bunun yerine \`PageHeader\` kullanin
- Kontextuel sag-tik menusu icin — bunun yerine \`ContextMenu\` kullanin
- Tekil aksiyon butonu icin — bunun yerine \`Button\` veya \`IconButton\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────────────────┐
│ [Tumunu Sec] │ [Sil] [Disa Aktar] [Tasi] │ [5 oge secildi]  │
│  sol grup      orta aksiyonlar              sag bilgi        │
└──────────────────────────────────────────────────────────────┘
\`\`\`

1. **Action Bar Container** — \`role="menubar"\` ile yatay aksiyon cubugu
2. **Selection Controls** — Tumunu sec/kaldir gibi secim yonetimi butonlari
3. **Bulk Action Items** — Silme, disa aktarma, tasima gibi toplu islem butonlari
4. **Promoted Actions** — \`emphasis="promoted"\` ile vurgulanan kritik aksiyonlar (ornegin silme)
5. **Selection Info** — Secili oge sayisini gosteren bilgi alani
6. **Access Guard** — \`access\` prop'u ile aksiyonlarin yetki kontrolu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Secim durumuna gore ActionBar'i gosterin.** Secili oge yokken cubuk gizli veya devre disi olmalidir.

**Yikici aksiyonlari gorsel olarak ayirin.** \`emphasis="promoted"\` ve farkli renk ile silme gibi aksiyonlari belirginlestirin.

**\`size="sm"\` ile yogun panellerde kompakt gorunum saglayin.** Tablo ustunde ek alan harcamamak icin kucuk boyut tercih edin.

**Aksiyon gruplarini mantiksal olarak ayirin.** Iliskili aksiyonlari bir arada tutun; farkli kategorileri gorsel bosluk ile bolumlendirin.

**Onay dialog'u ile yikici aksiyonlari koruyun.** Silme, kalici tasima gibi geri donulemez islemler icin ek onay adimi ekleyin.

**\`access="readonly"\` ile governance kontrolu saglayin.** Yetkisiz kullanicilar aksiyonlari gorebilir ancak kullanamaz.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Secim olmadan ActionBar'i gostermek**
Hicbir oge secili degilken toplu aksiyon cubugu gosterilmesi kullanicilari karistirir.

**❌ Navigasyon linkleri ile karistirmak**
ActionBar islem ve komut icindir. Sayfa navigasyonu icin \`NavigationMenu\` kullanin.

**❌ Cok fazla aksiyon ogesi eklemek**
5-6'dan fazla aksiyon gorsel karisiklik yaratir. Daha az onemli aksiyonlari overflow menuye tasiyin.

**❌ Yikici aksiyonlari onaysiz calistirmak**
Silme gibi geri donulemez aksiyonlar mutlaka onay dialog'u ile korunmalidir.

**❌ Baskil filled gorunum kullanmak**
Tablo ustunde kullanildiginda \`ghost\` veya hafif gorunum tercih edin; filled gorunum asiri dikkat ceker.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** MenuBar'in tum ARIA ozelliklerini miras alir. \`role="menubar"\` ve \`ariaLabel\` ile aksiyon cubugu tanimlanir.

**Klavye:** Sol/Sag ok tuslari ile aksiyon butonlari arasinda gezinme. Enter/Space ile etkinlestirme. Escape ile focusu cubuktan cikartma.

**Secim Durumu:** Secili oge sayisi degistiginde \`aria-live\` bolge ile ekran okuyucuya duyurulur.

**Readonly:** \`access="readonly"\` durumunda butonlar gorsel olarak devre disi gorunur ve \`aria-disabled\` ile isaretlenir.

**Yikici Aksiyonlar:** Silme gibi aksiyonlar gorsel renk farki ve onay dialog'u ile ek guvenlik katmani saglar.

**Focus Yonetimi:** Bir aksiyon tamamlandiginda (ornegin silme) focus uygun bir sonraki elemente tasinir.`,
      },
    ],
    relatedComponents: ["MenuBar", "ActionHeader", "Button", "ContextMenu"],
  },
};
