import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  DatePicker: {
    componentName: "DatePicker",
    summary: "DatePicker, kullanicidan tarih bilgisi almak icin kullanilan form alanidir. Native HTML date input uzerine kurulu olup label, hata durumu, erisim kontrolu ve kontrollü/kontrolsuz kullanim modlarini destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DatePicker, native \`<input type="date">\` uzerine insa edilmis bir tarih secim bileşenidir. FieldControlShell ile sarilanarak label, description, hint ve error yonetimini standart hale getirir.

Kontrollü (\`value\` + \`onValueChange\`) ve kontrolsuz (\`defaultValue\`) modlari, \`min\`/\`max\` ile tarih araligi kisitlamasi, boyut varyantlari (\`sm\`, \`md\`, \`lg\`) ve erisim kontrolu (\`access\` prop) desteklenir. Secili tarih veya "Select date" etiketi bir badge ile gorsel olarak gosterilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Form icinde tarih bilgisi alinmasi gerektiginde (dogum tarihi, baslangic/bitis tarihi)
- Tarih araligini \`min\`/\`max\` ile sinirlamak istediginizde
- Mevcut form alanlari ile tutarli gorunum saglamak icin

**Kullanmayin:**
- Tarih ve saat birlikte gerekiyorsa — bunun yerine ozel bir datetime bileseni kullanin
- Tarih araligi (range) secimi gerekiyorsa — iki DatePicker veya ozel DateRangePicker kullanin
- Serbest metin tarih girisi gerekiyorsa — bunun yerine \`Input\` ile maskeleme kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Label
┌──────────────────────────────────┐
│  [date input]     [tarih badge]  │
└──────────────────────────────────┘
  Helper text / Error message
\`\`\`

1. **FieldControlShell** — Label, description, hint ve error yonetimi
2. **Frame** — Boyut ve ton'a gore stillendirilmis dis cerceve
3. **Native Input** — \`type="date"\` ile tarayici tarih secicisi
4. **Tarih Badge** — Secili tarihi veya placeholder metni gosteren etiket
5. **Focus Ring** — Klavye odagi icin gorunen halka`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Label kullanin.** Her DatePicker'a amacini aciklayan bir label ekleyin.

**\`min\`/\`max\` ile sinirlayin.** Gecmis veya gelecek tarih kisitlamalari icin min/max prop'larini kullanin.

**Hata mesajlarini aciklayici yapin.** "Gecersiz tarih" yerine "Baslangic tarihi bugunun tarihinden sonra olmalidir" yazin.

**\`fullWidth\` ayarini konuma gore secin.** Form icinde \`true\` (varsayilan), aralik veya filtre araclari icinde \`false\` kullanin.

**\`onValueChange\` tercih edin.** String tarih degeri dogrudan almak icin native \`onChange\` yerine \`onValueChange\` callback'ini kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Label olmadan kullanmak**
Ekran okuyucular alani tanimlayamaz; her zaman \`label\` prop'u saglayin.

**❌ \`min\`/\`max\` olmadan tarih toplama**
Kullanici 1900 veya 2099 gibi anlamsiz tarihler girebilir.

**❌ Sadece \`onChange\` ile string parse etmek**
\`onValueChange\` dogrudan ISO string dondurur; gereksiz \`event.target.value\` isleminden kacinin.

**❌ \`disabled\` durumunu aciklama olmadan kullanmak**
Neden devre disi oldugunu \`accessReason\` ile belirtin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Native Semantik:** \`<input type="date">\` kullanildigi icin tarayicinin yerlesik tarih secicisi ve ekran okuyucu destegi otomatik saglanir.

**ARIA:** \`aria-invalid\`, \`aria-readonly\`, \`aria-disabled\` ve \`aria-describedby\` ile hint/error mesajlari iliskilendirilir.

**Klavye:** Tab ile odaklanilir, tarayici tarih secicisi klavye ile kullanilabilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (DOM'dan kaldirilir), \`readonly\` (degisiklik engellenir) ve \`disabled\` modlari desteklenir. \`accessReason\` ile kisitlama nedeni \`title\` olarak gosterilir.

**Zorunlu Alan:** \`required\` prop'u ile \`required\` HTML attribute'u eklenir.`,
      },
    ],
    relatedComponents: ["Input", "Select", "TimePicker"],
  },

  Steps: {
    componentName: "Steps",
    summary: "Steps, cok adimli is akislarinda ilerleme durumunu gorsel olarak gosteren bir navigasyon bilesenidir. Yatay ve dikey yonlendirme, dot stili, hata durumu ve tiklanabilir adimlar destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Steps, cok adimli sureclerde kullanicinin hangi adimda oldugunu, tamamlanan adimlari ve kalan adimlari gorsel olarak iletir.

Her adim bir \`StepItem\` nesnesi ile tanimlanir ve \`title\`, \`description\`, \`icon\`, \`disabled\` gibi ozellikler icerir. Bileşen yatay (\`horizontal\`) ve dikey (\`vertical\`) yonlendirme, uc boyut (\`sm\`, \`md\`, \`lg\`), dot stili ve \`error\` durumu destekler. \`onChange\` ile adimlar arasi tiklanabilir navigasyon saglanir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Form sihirbazlarinda (wizard) adim ilerlemesini gostermek icin
- Basvuru, kayit veya siparis sureclerini gorsel olarak takip etmek icin
- Dikey zaman cizelgesi benzeri akislarda ilerleme gostermek icin

**Kullanmayin:**
- Icerik sekmeleri icin — bunun yerine \`Tabs\` kullanin
- Tek adimli islemler icin — Steps gereksiz karmasiklik ekler
- Sayfa navigasyonu icin — bunun yerine \`Breadcrumbs\` veya \`NavLink\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
Yatay:
───[1]────────[2]────────[3]───
  Adim 1      Adim 2      Adim 3
  Aciklama    Aciklama    Aciklama

Dikey:
  [1] Adim 1 — Aciklama
   │
  [2] Adim 2 — Aciklama
   │
  [3] Adim 3 — Aciklama
\`\`\`

1. **Container** — \`role="list"\` ile adim listesini sarar
2. **Step Indicator** — Numara, ikon veya check isareti gosteren yuvarlak buton
3. **Connector** — Adimlar arasi ilerleme cizgisi (\`bg-[var(--action-primary)]\` tamamlanan, \`bg-[var(--border-default)]\` bekleyen)
4. **Title** — Adim baslik metni
5. **Description** — Opsiyonel aciklama metni
6. **Dot Modu** — \`dot={true}\` ile kucuk daire gostergesi (numara yerine)`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Adim sayisini sinirli tutun.** 3-7 adim idealdir; fazlasi kullaniciyi bunaltir.

**Aciklayici basliklar yazin.** "Adim 1" yerine "Kisisel Bilgiler" gibi anlam tasiyan basliklar kullanin.

**\`description\` ile baglam saglayin.** Her adimin icerigi hakkinda kisa bilgi ekleyin.

**\`dot\` stilini basit akislarda kullanin.** Adim numarasi gereksiz oldugunda \`dot={true}\` ile minimal gorunum saglayin.

**Hata durumunu belirtin.** Aktif adimda sorun varsa \`status="error"\` ile kullaniciyi bilgilendirin.

**Dar alanlarda dikey yonlendirme secin.** Yan panel veya mobil goruntulerde \`direction="vertical"\` kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ 10+ adimli is akisi olusturmak**
Kullanici sureci tamamlayamayacagini hisseder; adimlari gruplama ile saderlestirin.

**❌ Tamamlanmamis adima atlamaya izin vermek**
Dogrulama yapilmadan ileri adima gecis veri kayiplarına neden olur.

**❌ Adim basliklarini belirsiz birakmak**
"Adim 1", "Adim 2" gibi genel basliklar kullaniciya yol gostermez.

**❌ Yatay modda uzun basliklar kullanmak**
Basliklar tasar ve duzeni bozar; kisa basliklar veya dikey mod tercih edin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Kok eleman \`role="list"\` ve \`aria-label="Progress steps"\`, her adim \`role="listitem"\` ile isaretlenir.

**Aktif Adim:** \`aria-current="step"\` ile ekran okuyuculara mevcut adim bildirilir.

**Klavye:** Her adim gostergesi \`<button>\` elemanidir; \`Tab\` ile odaklanilir, \`Enter/Space\` ile tiklanir. \`disabled\` adimlar atlanir.

**Focus Ring:** \`focus-visible:ring-2\` ile gorunen odak halkasi WCAG 2.1 AA gereksinimlerini karsilar.

**Etiketleme:** Her buton \`aria-label\` ile "Step 1: Baslik" formatinda tanimlanir.`,
      },
    ],
    relatedComponents: ["Tabs", "Breadcrumbs", "ProgressBar", "Accordion"],
  },

  List: {
    componentName: "List",
    summary: "List, dikey duzende interaktif veya statik oge listesi goruntuleyen bilesendir. Secim, tonlama, badge, skeleton yukleme ve bos durum yonetimi destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `List, veri ogelerini dikey bir liste halinde goruntuleyen cok amacli bilesendir. Her oge \`title\`, \`description\`, \`meta\`, \`prefix\`, \`suffix\` ve \`badges\` slotlari ile zenginlestirilebilir.

Premium surface stili, ton bazli renklendirme (\`default\`, \`info\`, \`success\`, \`warning\`, \`danger\`), iki yogunluk modu (\`comfortable\`, \`compact\`), skeleton yukleme durumu ve bos durum yonetimi destekler. \`onItemSelect\` ile secim yapilabilir; \`selectedKey\` ile secili oge vurgulanir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Kayit listelerini (kullanicilar, gorevler, bildirimler) goruntumek icin
- Secim yapilabilir oge listesi sunmak icin
- Badge ve meta bilgisi ile zenginlestirilmis liste gorunum gerektiren yerlerde

**Kullanmayin:**
- Tablo formatinda sutunlu veri gosterimi icin — bunun yerine \`Table\` veya \`TreeTable\` kullanin
- Navigasyon menusu icin — bunun yerine \`NavList\` veya \`Menu\` kullanin
- Kart duzeni gerektiren icerikler icin — bunun yerine \`Card\` gruplari kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Baslik (title)
  Aciklama (description)
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ [Prefix] Title [Badge]   [Meta] │ │
│ │          Description    [Suffix]│ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [Prefix] Title [Badge]   [Meta] │ │
│ │          Description    [Suffix]│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
\`\`\`

1. **Section Container** — Baslik ve aciklama ile liste cercevesi
2. **Surface** — \`rounded-[28px]\`, premium gradient ve golge stili
3. **Item** — Ton bazli arka plan ile \`rounded-[24px]\` kart
4. **Prefix** — Sol tarafta ikon veya avatar alani
5. **Title & Badges** — Baslik metni ve etiketler
6. **Meta & Suffix** — Sag tarafta ust bilgi ve ek icerik`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Ton'u amaca gore kullanin.** Uyari mesajlari icin \`warning\`, hata durumlari icin \`danger\` tonu atanin.

**\`compact\` yogunlugu yogun listelerde kullanin.** 10+ ogeli listelerde dikey alani azaltir.

**Badge ile durum bilgisi ekleyin.** String badge'ler otomatik olarak ton'a uygun Badge bilesenine donusturulur.

**Bos durum mesajini ozellestirin.** \`emptyStateLabel\` ile liste bos oldugunda anlamli mesaj gosterin.

**Yukleme durumunu belirtin.** \`loading={true}\` ile skeleton gostergesi otomatik olarak goruntulenir.

**Erisim kontrolunu uygulayin.** \`access\` prop'u ile kisitli kullanicilar icin goruntulemeyi yonetin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ 50+ oge icin sayfalama olmadan kullanmak**
Uzun listeler performans ve kullanilabilirlik sorunlari yaratir; sayfalama veya sanal kaydirma ekleyin.

**❌ Tum ogelere farkli ton atamak**
Renk carpanligi gorsel kaos yaratir; ton'u anlamli durumlara ayirin.

**❌ \`onItemSelect\` olmadan secim beklentisi olusturmak**
Hover efekti olan ancak tiklanamayan ogeler kullaniciyi yaniltir.

**❌ Bos durum mesajini yonetmemek**
Varsayilan Ingilizce mesaj yerine turkce \`emptyStateLabel\` saglayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Liste ogeleri \`<ul>\`/\`<li>\` ile isaretlenir. Interaktif modda her oge \`<button>\` icine alinir.

**Secim:** Secili oge \`aria-current="true"\` ile belirtilir.

**Yukleme:** \`aria-busy\` ile yukleme durumu ekran okuyuculara bildirilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (DOM'dan kaldirilir), \`disabled\` (etkilesim engellenir) modlari desteklenir. \`accessReason\` ile kisitlama nedeni \`title\` olarak gosterilir.

**Devre Disi Oge:** \`disabled\` ogelere tiklandiginda \`event.preventDefault()\` ve \`event.stopPropagation()\` uygulanir.`,
      },
    ],
    relatedComponents: ["Table", "Card", "NavList", "TreeTable"],
  },

  Combobox: {
    componentName: "Combobox",
    summary: "Combobox, arama yapilabilir acilir secim alanidir. Tekli, coklu ve etiket modlari, grup destegi, serbest metin girisi (freeSolo), portal popup ve zengin klavye navigasyonu sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Combobox, Select bileseninin arama ve filtreleme yetenekleriyle genisletilmis halidir. Kullanici metin yazarak secenekleri daraltir veya \`freeSolo\` modunda yeni degerler olusturur.

Uc secim modu (\`single\`, \`multiple\`, \`tags\`), gruplandirmali secenekler, debounce'lu async arama (\`onQueryRequest\`), portal veya inline popup stratejisi, otomatik flip (ust/alt), kontrollü/kontrolsuz input ve deger yonetimi, erisim kontrolu ve zengin ARIA destegi sunar.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uzun secenek listesinde arama ile secim yapmak icin
- Birden fazla deger secimi veya etiket olusturma gerektiginde
- Sunucudan async secenek yuklemesi gerektiginde (\`onQueryRequest\`)
- Kullanicinin mevcut secenekler disinda yeni deger girmesi gerektiginde (\`freeSolo\`)

**Kullanmayin:**
- 5-10 sabit secenek icin — bunun yerine \`Select\` yeterlidir
- Arama olmadan basit secim icin — bunun yerine \`Select\` veya \`RadioGroup\` kullanin
- Tam metin girisi icin — bunun yerine \`Input\` veya \`Textarea\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Label
┌──────────────────────────────────────┐
│ [Tag] [Tag] [arama inputu...] [▾] [x]│
└──────────────────────────────────────┘
  ┌────────────────────────────────────┐
  │  GRUP BASLIGI                      │
  │  ┌──────────────────────────────┐  │
  │  │ Secenek 1         Secili     │  │
  │  │ Aciklama                     │  │
  │  └──────────────────────────────┘  │
  │  ┌──────────────────────────────┐  │
  │  │ Secenek 2                    │  │
  │  └──────────────────────────────┘  │
  └────────────────────────────────────┘
\`\`\`

1. **FieldControlShell** — Label, description, hint ve error yonetimi
2. **Input Frame** — Etiketler ve arama alani iceren cerceve
3. **Tag'lar** — Coklu/etiket modunda secili degerlerin badge gosterimi
4. **Arama Input** — \`role="combobox"\` ile tanimli metin alani
5. **Clear Butonu** — Secimi temizleme (\`clearable\` prop)
6. **Popup Listbox** — Gruplanmis secenekler, highlight ve secim durumlari`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Dogru modu secin.** Tek deger icin \`single\`, birden fazla icin \`multiple\`, serbest etiketler icin \`tags\` kullanin.

**\`placeholder\` ile yonlendirin.** "Ulke secin..." gibi aciklayici placeholder metni ekleyin.

**Async arama icin \`onQueryRequest\` kullanin.** \`queryDebounceMs\` ile gereksiz API cagrilarini azaltin.

**Gruplandirma ile organize edin.** \`ComboboxOptionGroup\` ile uzun listeleri kategorize edin.

**\`renderOption\` ile ozellestirin.** Ozel secenek gorunumu icin render fonksiyonu kullanin.

**Portal stratejisini modal icinde kullanin.** Modal veya dialog icinde popup kesintisini onlemek icin \`popupStrategy="portal"\` secin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Az sayida secenek icin Combobox kullanmak**
5-10 sabit secenek icin \`Select\` daha basit ve hafiftir.

**❌ \`freeSolo\` modunda dogrulama yapmamak**
Kullanici anlamsiz degerler girebilir; \`onFreeSoloCommit\` ile dogrulayin.

**❌ Async aramada yukleme durumu gostermemek**
\`loading={true}\` ile "Yukleniyor..." mesaji gosterilmelidir.

**❌ Grup basliksiz uzun listeleri sunmak**
50+ secenek gruplanmazsa kullanici aradigi secenegi bulamaz.

**❌ \`clearable\` olmadan zorunlu olmayan alanlarda kullanmak**
Kullanici secimini geri alamaz; \`clearable={true}\` ekleyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** Input \`role="combobox"\`, \`aria-autocomplete="list"\`, \`aria-expanded\`, \`aria-controls\` ve \`aria-activedescendant\` ile popup listbox'a baglanir. Listbox \`role="listbox"\`, her secenek \`role="option"\` ve \`aria-selected\` ile isaretlenir.

**Klavye:** \`ArrowDown/Up\` ile secenekler arasinda gezinilir, \`Enter\` ile secilir, \`Escape\` ile popup kapanir, \`Backspace\` ile son etiket kaldirilir.

**Devre Disi Secenekler:** \`disabledItemFocusPolicy\` ile devre disi ogeler atlanir veya odaklanilabilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\`, \`readonly\` ve \`disabled\` modlari desteklenir. \`accessReason\` hint olarak gosterilir.

**Coklu Secim:** Listbox \`aria-multiselectable\` ile isaretlenir; etiket kaldir butonlari \`aria-label\` ile tanimlanir.`,
      },
    ],
    relatedComponents: ["Select", "Input", "TagInput", "CommandPalette"],
  },

  CommandPalette: {
    componentName: "CommandPalette",
    summary: "CommandPalette, Cmd+K tarzi arama overlay'i ile komutlara, rotalara ve AI destekli is akislarina hizli erisim saglayan diyalog bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `CommandPalette, VS Code ve Spotlight benzeri bir arama diyalogu sunar. Kullanici metin yazarak komutlar, rotalar ve is akislari arasinda hizla arama yapar ve secim yapar.

Gruplandirmali ogeler, klavye kisayollari, badge gostergesi, bos durum yonetimi, kontrollü/kontrolsuz arama ve erisim kontrolu destekler. Overlay backdrop ve modal dialog ile tam ekran arama deneyimi saglar. \`TextInput\` ile entegre arama alani \`AI\` badge'i ile zenginlestirilmistir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulamada hizli komut ve navigasyon erisimi saglamak icin (Cmd+K)
- Rotalar, islemler ve AI destekli is akislarini tek bir yerden aramatirmak icin
- Yonetici paneli veya karmasik uygulamalarda uzman kullanicilara hiz kazandirmak icin

**Kullanmayin:**
- Form icinde secenek aramasi icin — bunun yerine \`Combobox\` veya \`Select\` kullanin
- Basit arama alani icin — bunun yerine \`SearchInput\` veya \`Input\` kullanin
- Menu veya dropdown icin — bunun yerine \`DropdownMenu\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌─────────────────── Overlay ───────────────────┐
│                                               │
│  ┌─────────────── Dialog ──────────────────┐  │
│  │  Baslik                          [X]    │  │
│  │  Alt baslik                              │  │
│  │  ┌──────────────────────────────────┐    │  │
│  │  │ ⌘ Arama inputu...       [AI]    │    │  │
│  │  └──────────────────────────────────┘    │  │
│  ├──────────────────────────────────────────┤  │
│  │  GRUP BASLIGI                            │  │
│  │  ┌──────────────────────────────────┐    │  │
│  │  │ Komut basligi         [Kisayol]  │    │  │
│  │  │ Aciklama                         │    │  │
│  │  └──────────────────────────────────┘    │  │
│  ├──────────────────────────────────────────┤  │
│  │  Footer                                  │  │
│  └──────────────────────────────────────────┘  │
│                                               │
└───────────────────────────────────────────────┘
\`\`\`

1. **Overlay** — Yari saydam arka plan (tiklaninca kapanir)
2. **Dialog** — \`role="dialog"\`, \`aria-modal="true"\` ile modal pencere
3. **Header** — Baslik, alt baslik ve kapat butonu
4. **Arama Alani** — TextInput ile filtreleme ve klavye navigasyonu
5. **Sonuc Grubu** — Grup basligi ile kategorize edilmis ogeler
6. **Komut Oge** — Baslik, aciklama, badge ve kisayol gosterimi
7. **Footer** — Opsiyonel alt bilgi alani`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Gruplandirilmis ogeler sunun.** Komutlari kategorilere ayirarak bulunabilirligi artirin.

**Klavye kisayollarini gosterin.** \`shortcut\` prop'u ile her komutun kisayolunu badge olarak goruntuleyin.

**\`keywords\` ile aramayi zenginlestirin.** Baslik ve aciklama disinda ek anahtar kelimeler ekleyerek aramayi iyilestirin.

**\`Escape\` ile kapanma saglayin.** Kullanici her zaman Escape tusu ile diyalogu kapatabilmelidir.

**\`emptyStateLabel\` ile bos durumu yonetin.** "Esleşen komut bulunamadi" gibi anlamli mesaj gosterin.

**\`footer\` ile yardim bilgisi ekleyin.** Klavye kisayol rehberi veya yardim linkleri icin footer alanini kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Gruplama olmadan duz liste sunmak**
Gruplandirma olmadan 20+ komut arasinda gezinmek zordur.

**❌ Devre disi komutlari aciklama olmadan gostermek**
Kullanici neden tiklanilmadigini anlamaz; \`description\` ile neden belirtin.

**❌ Overlay'i kapatma mekanizmasi saglamadan kullanmak**
\`onClose\` prop'u her zaman saglanmali; Escape ve backdrop tiklama ile kapanmalidir.

**❌ Cok fazla sonuc gosterimi**
Filtrelenmemis uzun listeler performans ve kullanilabilirlik sorunlari yaratir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Dialog:** \`role="dialog"\`, \`aria-modal="true"\`, \`aria-labelledby\` ve \`aria-describedby\` ile tanimlanir.

**Klavye:** \`ArrowDown/Up\` ile ogeler arasinda gezinilir, \`Enter\` ile secilir, \`Escape\` ile diyalog kapanir.

**Aktif Oge:** Aktif oge \`aria-current="true"\` ile isaretlenir. Devre disi ogeler ok tuslari ile atlanir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (gosterilmez), \`readonly\` ve \`disabled\` modlari desteklenir. \`accessReason\` kapat butonunda \`title\` olarak gosterilir.

**Odak Yonetimi:** Diyalog acildiginda arama inputu otomatik odak alir.`,
      },
    ],
    relatedComponents: ["Combobox", "SearchInput", "Dialog", "DropdownMenu"],
  },

  TreeTable: {
    componentName: "TreeTable",
    summary: "TreeTable, hiyerarsik agac yapisini tablo sutunlari ile birlestiren bilesendir. Acilir/kapanir dugumler, cok sutunlu veri gosterimi, tonlama, secim ve skeleton yukleme destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TreeTable, agac yapisindaki verileri sutunlu tablo formatinda goruntuleyen gelismis bilesendir. Her dugum (\`TreeTableNode\`) \`label\`, \`description\`, \`meta\`, \`badges\`, \`tone\`, \`children\` ve \`data\` ozellikleri tasir.

Sutunlar (\`TreeTableColumn\`) \`accessor\`, \`render\`, \`align\`, \`width\` ve \`emphasis\` ile yapilandirilir. Kontrollü/kontrolsuz genisletme (\`expandedKeys\`), dugum secimi (\`onNodeSelect\`), yogunluk modlari, skeleton yukleme ve bos durum yonetimi desteklenir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Hiyerarsik veriyi (dosya sistemi, organizasyon yapisi, kategori agaci) tablo formatinda gostermek icin
- Agac dugumlerinin yaninda ek sutun verileri gosterilmesi gerektiginde
- Kullanicinin alt dugumleri acip kapatarak veriyi kesfetmesi istendiginde

**Kullanmayin:**
- Duz (flat) liste verisi icin — bunun yerine \`Table\` veya \`List\` kullanin
- Sadece agac yapisi (sutun olmadan) icin — bunun yerine \`Tree\` bileseni kullanin
- Az sayida veri icin — basit bir liste veya kart yeterlidir`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Baslik
  Aciklama
┌──────────────┬──────────┬──────────┐
│ Yapi         │ Sutun A  │ Sutun B  │
├──────────────┼──────────┼──────────┤
│ ▾ Dugum 1    │ deger    │ deger    │
│   ▸ Alt 1.1  │ deger    │ deger    │
│   • Yaprak   │ deger    │ deger    │
│ ▸ Dugum 2    │ deger    │ deger    │
└──────────────┴──────────┴──────────┘
\`\`\`

1. **Section** — Baslik ve aciklama ile dis cerceve
2. **Table Header** — Agac sutunu etiketi + veri sutun basliklari
3. **Expand/Collapse Butonu** — Alt dugumleri ac/kapat (▾/▸)
4. **Yaprak Gostergesi** — Cocugu olmayan dugumler icin nokta (•)
5. **Dugum Etiketi** — Label, description, badges ve meta slotlari
6. **Veri Hucreleri** — Sutun tanimi ile eslesen degerler`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`defaultExpandedKeys\` ile baslangic durumunu ayarlayin.** En onemli dallari acik baslatin.

**Sutun sayisini sinirli tutun.** 3-5 sutun idealdir; fazlasi yatay kaydirma gerektirir.

**\`emphasis\` ile onemli sutunu vurgulayin.** Birincil veri sutununu \`emphasis: true\` ile one cikarin.

**\`treeColumnLabel\` ile agac sutununu adlandirin.** Varsayilan "Structure" yerine icerige uygun turkce etiket kullanin.

**Tonlama ile durum bildirin.** Sorunlu dugumleri \`danger\`, basarili olanlari \`success\` tonu ile isaretleyin.

**\`localeText\` ile metinleri turkcelestirin.** Bos durum, genisletme ve daraltma etiketlerini lokalize edin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok derin hiyerarsi olusturmak (4+ seviye)**
Kullanici ic ice yapida kaybolur; 2-3 seviye ile sinirlayin.

**❌ Tum dugumleri kapali basllatmak**
Kullanici bos tablo gorur; en az ust seviye dugumleri acik baslatin.

**❌ Cok fazla sutun eklemek**
Yatay kaydirma mobil ve dar ekranlarda kullanilabilirlik sorunlari yaratir.

**❌ Agac ve tablo yapisini birlestirmeden basit liste kullanmak**
Hiyerarsi yoksa \`Table\` veya \`List\` daha uygun ve hafiftir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<table>\`, \`<thead>\`, \`<tbody>\`, \`<tr>\`, \`<th>\`, \`<td>\` ile standart tablo semantigi kullanilir.

**Genisletme:** Expand/collapse butonlari \`aria-expanded\` ve aciklayici \`aria-label\` ile tanimlanir.

**Secim:** Secili dugum \`aria-current="true"\` ile belirtilir. \`ring-1\` ile gorsel vurgu eklenir.

**Yukleme:** Skeleton satirlari ile yukleme durumu gorsel olarak iletilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (DOM'dan kaldirilir), \`disabled\` (etkilesim engellenir) modlari desteklenir. \`accessReason\` ile kisitlama nedeni \`title\` olarak gosterilir.

**Devre Disi Dugum:** \`disabled\` dugumlere tiklandiginda etkilesim engellenir; \`cursor-not-allowed\` ve \`opacity-70\` uygulanir.`,
      },
    ],
    relatedComponents: ["Table", "Tree", "List", "DataGrid"],
  },
};
