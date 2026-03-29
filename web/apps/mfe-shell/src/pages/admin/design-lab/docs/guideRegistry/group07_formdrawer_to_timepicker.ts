import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  FormDrawer: {
    componentName: "FormDrawer",
    summary: "FormDrawer, yandan kayan form paneli bilesenidir. Olusturma ve duzenleme islemleri icin baslik, form icerigi, footer ve yukleme durumu destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `FormDrawer, yeni kayit olusturma veya mevcut kaydi duzenleme islemleri icin sagdan veya soldan kayan bir form panelidir. Baslik, alt baslik, form icerigi (\`children\`), footer (gonder/iptal butonlari) ve yukleme durumu destekler.

\`size\` prop'u ile genislik (sm, md, lg, xl), \`placement\` ile yon (right, left) ayarlanabilir. Escape tusu ve backdrop tiklamasi ile kapatilabilir. \`loading\` durumunda yarı saydam bir yukleme katmani gosterilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Yeni kayit olusturma formu icin (musteriler, urunler, kurallar)
- Mevcut kaydi duzenleme formu icin
- Sayfadan ayrilmadan form islemi gerceklestirmek icin

**Kullanmayin:**
- Salt-okunur detay gosterimi icin — bunun yerine \`DetailDrawer\` kullanin
- Kisa onay veya bilgi girisi icin — bunun yerine \`Dialog\` kullanin
- Karmasik cok adimli sihirbazlar icin — bunun yerine tam sayfa form kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────┐
│  [Title]                      ✕ │
│  [Subtitle?]                    │
├─────────────────────────────────┤
│  [Loading Overlay?]             │
│  [Form Content]                 │
│  (scrollable)                   │
├─────────────────────────────────┤
│  [Footer? (Cancel / Submit)]    │
└─────────────────────────────────┘
\`\`\`

1. **Backdrop** — Arkadaki karartilmis alan
2. **Panel** — Yandan kayan ana form alani
3. **Header** — Baslik, alt baslik ve kapatma butonu
4. **Body** — Kaydirma destekli form icerik alani
5. **Loading Overlay** — \`loading\` durumunda yari saydam yukleme katmani
6. **Footer** (opsiyonel) — Gonder ve iptal butonlari`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Footer'da tutarli buton duzeni kullanin.** Iptal solda, Kaydet/Gonder sagda olmalidir.

**\`loading\` durumunu async islemlerde gosterin.** Form gonderimi sirasinda kullaniciyi yukleme durumundan haberdar edin.

**Form validasyonunu inline yapin.** Hatalari dogrudan ilgili alanin altinda gosterin.

**\`size\` secimini form karmasikligina gore yapin.** Basit formlar icin \`sm\` veya \`md\`, karmasik formlar icin \`lg\` kullanin.

**\`placement\` tercihini sayfa duzenine gore belirleyin.** Detay paneli sagda ise formu soldan acmayi degerlendirin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ FormDrawer'i salt-okunur icerik icin kullanmak**
Form paneli duzenleme amaclidir; goruntuleme icin \`DetailDrawer\` kullanin.

**❌ Footer olmadan form gostermek**
Kullanici formu nasil gonderecegini veya iptal edecegini bilemez; her zaman footer ekleyin.

**❌ \`loading\` durumunu gostermeden async islem yapmak**
Kullanici formun islenip islenmedigini anlamaz; yukleme gostergesi saglayin.

**❌ Escape ve backdrop kapatmayi devre disi birakmak**
Kullanici sikisilmis hisseder; her zaman kapatma mekanizmasi sunun.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Dialog Rolu:** \`role="dialog"\` ve \`aria-modal="true"\` ile modal dialog semantigi saglanir.

**Fokus Yonetimi:** Acildiginda panel otomatik olarak fokuslanir; Escape ile kapatilir.

**Body Scroll Kilitleme:** Acikken arkadaki icerik kaydirma devre disi birakilir.

**Klavye:** Escape tusu ile kapatma (yapilandirmaya bagli), Tab ile form alanlari arasinda gezinme desteklenir.

**Etiket:** \`aria-label\` baslik string ise otomatik olarak uygulanir.`,
      },
    ],
    relatedComponents: ["DetailDrawer", "Dialog", "Form", "Button"],
  },

  DetailSummary: {
    componentName: "DetailSummary",
    summary: "DetailSummary, detay sayfalarinda baslik, KPI seridi, varlik ozeti, anahtar-deger listesi ve JSON gorunumunu tek bir yapilandirmada birlestiren kompozit bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DetailSummary, detay sayfalarindaki tum ozet bilgilerini tek bilesenle sunar. PageHeader (baslik, aciklama, durum, aksiyonlar), SummaryStrip (KPI kartlari), EntitySummaryBlock (varlik ozeti) ve Descriptions (anahtar-deger listesi) bilesenlerini icerir.

Opsiyonel olarak inline JSON viewer ile ham veri gosterimi de desteklenir. Erisim kontrolu (\`access\`, \`accessReason\`) ile tum alt bilesen erisimleri merkezi olarak yonetilir. Premium gorsel yuzey ile zengin detay sayfasi deneyimi sunar.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Kayit detay sayfalarinda baslik + KPI + varlik ozeti + ozellikler bilesenini olusturmak icin
- Tek bilesenle zengin detay sayfasi yapisi kurmak icin
- JSON payload ile birlikte detay bilgisi gostermek icin

**Kullanmayin:**
- Basit baslik alani icin — bunun yerine \`PageHeader\` kullanin
- Yalnizca KPI gosterimi icin — bunun yerine \`SummaryStrip\` kullanin
- Form veya duzenleme sayfasi icin — bunun yerine \`FormDrawer\` veya ozel form layout kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  PageHeader (eyebrow, title, status,     │
│              description, actions, aside)│
├──────────────────────────────────────────┤
│  SummaryStrip (KPI kartlari)             │
├───────────────────┬──────────────────────┤
│  EntitySummary    │  Descriptions        │
│  Block            │  (anahtar-deger)     │
│                   ├──────────────────────┤
│                   │  JSON Viewer         │
│                   │  (opsiyonel)          │
└───────────────────┴──────────────────────┘
\`\`\`

1. **PageHeader** — Eyebrow (breadcrumb), baslik, aciklama, durum, aksiyonlar ve yan icerik
2. **SummaryStrip** — Yatay KPI kartlari (4 sutun)
3. **EntitySummaryBlock** — Varlik kimlik ve ozet bilgisi
4. **Descriptions** — Anahtar-deger ciftleri listesi
5. **JSON Viewer** (opsiyonel) — Ham JSON veri gorunumu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Tum alanlari anlamli degerlerle doldurun.** Bos kalan alanlar gorsel dengesizlik yaratir; gereksiz alanlari prop olarak gondermeyin.

**KPI kartlarini 4 ile sinirlayin.** \`summaryItems\` icin en onemli 4 metrigi secin.

**JSON viewer'i yalnizca teknik kullanicilar icin gosterin.** Denetim, debug ve destek akislarinda faydalidir.

**Erisim kontrolunu merkezi olarak yonetin.** \`access\` prop'u ile tum alt bilesenlerin erisim durumu tek noktadan kontrol edilir.

**\`detailTitle\` ve \`jsonTitle\` ile bolum basliklarini ozellestirin.** Varsayilan basliklar yerine icerige uygun basliklar kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ DetailSummary'yi liste sayfasinda kullanmak**
Bu bilesen tekil kayit detay sayfasi icindir; listeler icin \`Table\` ve \`Card\` kullanin.

**❌ Cok fazla \`detailItems\` eklemek (20+)**
Uzun ozellik listesi okunabilirligi dusurur; gruplama veya sekmelerle organize edin.

**❌ JSON viewer'i son kullanicilara gostermek**
Ham JSON verisi teknik olmayan kullanicilar icin anlamsizdir; yalnizca teknik roller icin gosterin.

**❌ Erisim kontrolunu alt bilesenlerde ayri ayri yonetmek**
Merkezi \`access\` prop'u kullanin; alt bilesenler otomatik olarak miras alir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elementi ile icerik bolumu tanimlanir; \`data-component\` ile bilesen turu belirtilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (DOM'dan kaldirilir) modu desteklenir. \`accessReason\` \`title\` olarak gosterilir.

**Alt Bilesen Erisimi:** PageHeader, SummaryStrip, EntitySummaryBlock ve Descriptions erisim ayarlari otomatik olarak miras alinir.

**Baslik Hiyerarsisi:** PageHeader \`h1\`, Descriptions \`h3\` ile dogru baslik sirasi korunur.

**Gorsel:** Premium yuzey gorunumu gorsel cekicilik saglarken icerik semantigi korunur.`,
      },
    ],
    relatedComponents: ["PageHeader", "SummaryStrip", "EntitySummaryBlock", "Descriptions"],
  },

  NavigationRail: {
    componentName: "NavigationRail",
    summary: "NavigationRail, dikey navigasyon rayı bilesenidir. Ikon, etiket, badge, aciklama ve footer destekli kompakt veya genis modlarda calisan yan navigasyon sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `NavigationRail, uygulama icinde dikey bir navigasyon rayi saglar. Her oge ikon, etiket, aciklama ve badge icerebilir. Kontrollü (\`value\` + \`onValueChange\`) ve kontrolsuz (\`defaultValue\`) modlari ile URL path eslestirmesi (\`currentPath\`) destekler.

\`compact\` modda yalnizca ikonlar gosterilir (80px genislik), normal modda etiketler ve aciklamalar goruntulenir (256px). \`appearance\` (default, outline, ghost), \`size\` (sm, md), \`labelVisibility\` (always, active, none) ve \`align\` (start, center) ile gorunum ozellestirilebilir. \`createNavigationRailPreset\` ile hazir yapilandirmalar (\`workspace\`, \`compact_utility\`, \`ops_side_nav\`) kullanilabilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulama veya modul seviyesinde yan navigasyon olusturmak icin
- 3-8 arasi navigasyon hedefi olan sayfalarda
- Kompakt ikon navigasyonu gereken durumlarda
- URL tabanli sayfa gecisi ile senkronize navigasyon icin

**Kullanmayin:**
- Yatay navigasyon icin — bunun yerine \`Tabs\` veya \`Navbar\` kullanin
- Cok sayida (10+) navigasyon ogesi icin — bunun yerine agac yapisi veya menu kullanin
- Icerik icinde bolum secimi icin — bunun yerine \`Tabs\` kullanin
- Tek seferlik aksiyon listesi icin — bunun yerine \`Menu\` veya \`ActionList\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────┐
│ ┌──────────────────┐ │
│ │ [Icon] Label     │ │  ← Aktif oge
│ │        [Badge?]  │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ [Icon] Label     │ │  ← Normal oge
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ [Icon] Label     │ │
│ │        Desc      │ │
│ └──────────────────┘ │
│ ──────────────────── │
│ [Footer]             │
└──────────────────────┘
\`\`\`

1. **Container** — Yuvarlatilmis dis cerceve (\`<nav>\`), premium gorunum yuzey
2. **Item List** — Dikey siralanmis navigasyon ogeleri (\`<ul>\`)
3. **Item** — Her navigasyon hedefi; \`<a>\` (href varsa) veya \`<button>\`
4. **Icon** (opsiyonel) — Ogeyi temsil eden ikon
5. **Label** — Navigasyon etiket metni
6. **Description** (opsiyonel) — Etiket altinda kisa aciklama
7. **Badge** (opsiyonel) — Bildirim veya sayac gostergesi
8. **Footer** (opsiyonel) — Listenin altinda ayrimci ile ek icerik`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Preset ile tutarlilik saglayin.** \`createNavigationRailPreset\` ile \`workspace\`, \`compact_utility\` veya \`ops_side_nav\` yapilandirmalarini kullanin.

**3-8 arasi navigasyon ogesi kullanin.** Cok az oge gereksiz bosluk, cok fazla oge gorsel karisiklik yaratir.

**\`currentPath\` ile URL senkronizasyonu saglayin.** Sayfa URL'si ile aktif oge otomatik eslesmesi icin \`currentPath\` ve \`matchPath\` kullanin.

**Kompakt modda ikonlari anlamli secin.** Yalnizca ikon gorunumunde etiket \`title\` ve \`aria-label\` olarak otomatik uygulanir.

**Badge ile bildirimleri gosterin.** Okunmamis bildirim veya bekleyen islem sayisini badge ile belirtin.

**Footer'i yardimci icerik icin kullanin.** Ayarlar, profil veya yardim baglantilari icin footer alanini kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ 10'dan fazla navigasyon ogesi eklemek**
Uzun navigasyon listesi kaydirma gerektirir ve kullanilabilirligi dusurur; gruplama veya hiyerarsi kullanin.

**❌ Kompakt modda etiket gorunurlugunu zorlamak**
\`compact\` mod otomatik olarak \`labelVisibility: "none"\` uygular; etiket gorunurlugunu ayri kontrol etmeyin.

**❌ \`disabled\` ogeler icin aciklama saglamadan kullanmak**
Devre disi ogelerin neden erisilemez oldugu \`accessReason\` ile belirtilmelidir.

**❌ Hem \`value\` hem \`defaultValue\` prop'unu ayni anda vermek**
Kontrollü ve kontrolsuz mod karistirilmamalidir; birini secin.

**❌ NavigationRail'i icerik bolumleri arasinda tab olarak kullanmak**
Sayfa/modul navigasyonu icindir; icerik sekmeleri icin \`Tabs\` kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<nav aria-label>\` ile navigasyon landmark olarak tanimlanir. Ogeler \`<ul>\`/\`<li>\` ile listelensinir.

**Klavye:** Yukari/Asagi ok tuslari ile ogeler arasi gezinme, Home/End ile ilk/son ogeye atlama, Enter/Space ile secim desteklenir. Roving tabindex paterni uygulanir.

**Aktif Oge:** \`aria-current="page"\` ile aktif sayfa ekran okuyuculara bildirilir.

**Devre Disi:** \`aria-disabled\` ile devre disi ogeler isaretlenir; erisim nedeni \`title\` olarak gosterilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\`, \`readonly\` ve \`disabled\` modlari desteklenir.

**Kompakt Mod:** Yalnizca ikon gorunumunde etiket \`aria-label\` ve \`title\` olarak otomatik uygulanir.`,
      },
    ],
    relatedComponents: ["Tabs", "Sidebar", "Menu", "PageLayout"],
  },

  TextInput: {
    componentName: "TextInput",
    summary: "TextInput, label, yardimci metin, hata mesaji, karakter sayaci ve erisim kontrolu ile tek satirlik metin girisi saglayan form primitividir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TextInput, tek satirlik metin girisi icin kullanilan temel form elemanidir. \`FieldControlShell\` altyapisi uzerinde label, description, hint, error ve karakter sayaci destegi sunar.

Uc farkli boyut (\`sm\`, \`md\`, \`lg\`), leading/trailing gorsel slotlari, kontrol edilebilir (controlled) ve kontrolsuz (uncontrolled) deger yonetimi ve \`access\` tabanli erisim kontrolu icerir.

\`\`\`tsx
<TextInput label="Ad Soyad" placeholder="Adinizi girin" size="md" />
<TextInput label="E-posta" error="Gecersiz e-posta adresi" />
<TextInput label="Arama" leadingVisual={<SearchIcon />} showCount maxLength={100} />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Kisa metin verisi toplamak icin (isim, e-posta, telefon, arama)
- Form alanlari icin label ve dogrulama geri bildirimi gerektiginde
- Karakter siniri ve sayac gosterimi gereken alanlarda
- Ikon ile zenginlestirilmis giris alanlari olusturmak icin

**Kullanmayin:**
- Cok satirlik metin girisi icin — bunun yerine \`TextArea\` kullanin
- Tarih veya saat secimi icin — bunun yerine \`DatePicker\` veya \`TimePicker\` kullanin
- Secenekler arasindan secim icin — bunun yerine \`Select\` veya \`Combobox\` kullanin
- Dosya yuklemesi icin — bunun yerine \`Upload\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [Label]                 [Required?] │
├──────────────────────────────────────┤
│  [Leading?]  [Input]  [Trailing?]    │
├──────────────────────────────────────┤
│  [Description / Hint / Error]        │
│                        [Count?]      │
└──────────────────────────────────────┘
\`\`\`

1. **Label** — Alan basligini tanimlar; \`<label>\` ile input'a baglanir
2. **Input** — Native \`<input>\` elemani; \`type\`, \`placeholder\`, \`maxLength\` destekler
3. **Leading Visual** (opsiyonel) — Input oncesinde ikon veya gorsel slot
4. **Trailing Visual** (opsiyonel) — Input sonrasinda ikon veya gorsel slot
5. **Description / Hint / Error** — Yardimci metin veya dogrulama hatasi
6. **Count** — Karakter sayaci (\`showCount\` veya \`maxLength\` ile aktif)`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her zaman \`label\` ekleyin.** Gorsel etiket olmadan alan amaci belirsiz kalir; ekran okuyucular icin de kritiktir.

**\`error\` prop'u ile dogrulama geri bildirimi saglayin.** Hata mesajlari spesifik ve yonlendirici olmalidir: "E-posta formati hatali" gibi.

**\`maxLength\` ile birlikte \`showCount\` kullanin.** Kullanici kalan karakter sayisini gorebilir.

**Boyutu baglamina gore secin.** Tablolarda \`sm\`, formlarda \`md\`, hero alanlarda \`lg\` kullanin.

**\`leadingVisual\` ile gorsel baglam saglayin.** Arama alani icin buyutec ikonu, e-posta icin zarf ikonu gibi.

**\`access\` prop'u ile erisim kontrolu yapin.** \`readonly\`, \`disabled\` ve \`hidden\` modlari merkezi olarak yonetilir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Label olmadan kullanmak**
Ekran okuyucular icin erisim sorunu yaratir. Her zaman \`label\` veya \`aria-label\` ekleyin.

**❌ Cok satirlik icerik icin TextInput kullanmak**
Uzun metinler icin \`TextArea\` bileseni kullanin; TextInput tek satir icindir.

**❌ Belirsiz placeholder metinleri**
"Deger girin" yerine spesifik yonlendirme yapin: "ornek@email.com" gibi.

**❌ Yalnizca renk ile hata durumunu belirtmek**
Renk degisikliginin yaninda mutlaka \`error\` metin mesaji ekleyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Label Baglantisi:** \`<label>\` elemani \`htmlFor\` ile input'a baglanir; ekran okuyucular alan amacini bildirir.

**Hata Bildirimi:** \`aria-invalid\` ile gecersiz durum isaretlenir; \`aria-describedby\` ile hata mesaji input'a baglanir.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen DOM'dan kaldirilir. \`readonly\` ve \`disabled\` durumlarinda \`aria-readonly\` ve \`aria-disabled\` otomatik uygulanir.

**Karakter Sayaci:** \`showCount\` aktifken sayac \`sr-only\` class ile ekran okuyuculara sunulur.

**Klavye:** Native \`<input>\` semantigi ile tam klavye destegi saglanir.`,
      },
    ],
    relatedComponents: ["TextArea", "Select", "Combobox", "TimePicker"],
  },

  TextArea: {
    componentName: "TextArea",
    summary: "TextArea, cok satirlik metin girisi icin auto-resize, karakter sayaci ve dogrulama destegi sunan form primitividir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TextArea, uzun metin girisi gerektiren senaryolar icin tasarlanmis cok satirlik form elemanidir. \`FieldControlShell\` altyapisi uzerinde label, description, hint, error ve karakter sayaci destegi sunar.

Uc farkli boyut (\`sm\`, \`md\`, \`lg\`), uc resize modu (\`vertical\`, \`none\`, \`auto\`), kontrol edilebilir ve kontrolsuz deger yonetimi ve \`access\` tabanli erisim kontrolu icerir.

\`\`\`tsx
<TextArea label="Aciklama" rows={4} resize="vertical" />
<TextArea label="Notlar" resize="auto" showCount maxLength={500} />
<TextArea label="Yorum" error="Bu alan zorunludur" required />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Cok satirlik metin girisi icin (aciklama, yorum, not, mesaj)
- Uzun icerik yazimi gereken form alanlarinda
- Otomatik yukseklik ayarlama gereken serbest metin alanlarinda
- Karakter sinirlamasi olan uzun metin girisi alanlarinda

**Kullanmayin:**
- Kisa, tek satirlik girisler icin — bunun yerine \`TextInput\` kullanin
- Zengin metin duzenlemesi icin — bunun yerine rich text editor kullanin
- Kod yazimi icin — bunun yerine code editor bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [Label]                 [Required?] │
├──────────────────────────────────────┤
│  [Leading?]                          │
│  [Textarea                         ] │
│  [                                 ] │
│  [                      Trailing?] ] │
├──────────────────────────────────────┤
│  [Description / Hint / Error]        │
│                        [Count?]      │
└──────────────────────────────────────┘
\`\`\`

1. **Label** — Alan basligini tanimlar; \`<label>\` ile textarea'ya baglanir
2. **Textarea** — Native \`<textarea>\` elemani; \`rows\`, \`resize\`, \`maxLength\` destekler
3. **Leading / Trailing Visual** (opsiyonel) — Gorsel slot alanlari
4. **Description / Hint / Error** — Yardimci metin veya dogrulama hatasi
5. **Count** — Karakter sayaci (\`showCount\` veya \`maxLength\` ile aktif)`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`rows\` ile baslangic yuksekligini ayarlayin.** Varsayilan 4 satirdir; icerik tipine gore 2-8 arasi ayarlanabilir.

**\`resize="auto"\` ile dinamik yukseklik saglayin.** Kullanici yazdikca alan otomatik buyur; uzun metinlerde kullanici deneyimini iyilestirir.

**\`maxLength\` ve \`showCount\` birlikte kullanin.** Kullaniciya kalan karakter sinirini gostermek veri kalitesini arttirir.

**\`error\` ile spesifik dogrulama mesaji verin.** "Bu alan zorunludur" veya "Minimum 10 karakter gerekli" gibi yonlendirici mesajlar kullanin.

**\`access\` ile erisim kontrolu yapin.** Goruntuleme modunda \`readonly\`, devre disi durumda \`disabled\` kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Kisa girisler icin TextArea kullanmak**
Tek satirlik veriler icin \`TextInput\` kullanin; TextArea gereksiz alan kaplar.

**❌ \`resize="none"\` ile kullaniciyi kisitlamak**
Kullanicinin alani boyutlandirabilmesi genellikle daha iyi bir deneyim saglar; zorunlu olmadikca \`vertical\` veya \`auto\` tercih edin.

**❌ Cok yuksek \`rows\` degeri vermek**
Baslangicta 10+ satir gostermek sayfayi gereksiz uzatir; \`resize="auto"\` ile dinamik buyume tercih edin.

**❌ Label olmadan kullanmak**
Erisim sorunlarina yol acar; her zaman \`label\` veya \`aria-label\` ekleyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Label Baglantisi:** \`<label>\` elemani \`htmlFor\` ile textarea'ya baglanir; ekran okuyucular alan amacini bildirir.

**Hata Bildirimi:** \`aria-invalid\` ile gecersiz durum isaretlenir; \`aria-describedby\` ile hata mesaji textarea'ya baglanir.

**Resize:** \`data-resize\` attribute ile resize modu belirtilir; \`auto\` modunda yukseklik icerige gore otomatik ayarlanir.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen DOM'dan kaldirilir. \`readonly\` ve \`disabled\` durumlarinda native attribute'lar otomatik uygulanir.

**Klavye:** Native \`<textarea>\` semantigi ile tam klavye destegi saglanir; Tab ile navigasyon mumkundur.`,
      },
    ],
    relatedComponents: ["TextInput", "Select", "Upload"],
  },

  TimePicker: {
    componentName: "TimePicker",
    summary: "TimePicker, saat ve dakika secimi icin native time input ve gorsel etiket birlestiren form primitividir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TimePicker, saat degeri secimi icin native \`<input type="time">\` uzerine insa edilmis form elemanidir. \`FieldControlShell\` altyapisi ile label, description, hint, error destegi sunar.

Uc boyut (\`sm\`, \`md\`, \`lg\`), \`min\`/\`max\`/\`step\` kisitlamalari, kontrol edilebilir ve kontrolsuz deger yonetimi ve \`access\` tabanli erisim kontrolu icerir. Secilen saat gorsel bir etiket olarak gosterilir.

\`\`\`tsx
<TimePicker label="Baslangic Saati" />
<TimePicker label="Bitis Saati" min="09:00" max="18:00" step={900} />
<TimePicker label="Randevu" error="Gecersiz saat" />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Saat ve dakika degeri secmek icin (randevu, zamanlama, planlama)
- Form icerisinde zaman bilgisi toplamak icin
- Belirli saat araligi kisitlamasi gereken senaryolarda
- Tarih bilesiyle birlikte tarih-saat kombinasyonu olusturmak icin

**Kullanmayin:**
- Tarih secimi icin — bunun yerine \`DatePicker\` kullanin
- Serbest metin olarak saat girisi icin — bunun yerine \`TextInput\` kullanin
- Sure (duration) secimi icin — ozel bilesenler kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [Label]                 [Required?] │
├──────────────────────────────────────┤
│  [Time Input]       [Time Badge]     │
├──────────────────────────────────────┤
│  [Description / Hint / Error]        │
└──────────────────────────────────────┘
\`\`\`

1. **Label** — Alan basligini tanimlar; \`<label>\` ile input'a baglanir
2. **Time Input** — Native \`<input type="time">\` elemani; tarayici saat secicisini acar
3. **Time Badge** — Secilen saati gorsel olarak gosteren kompakt etiket
4. **Description / Hint / Error** — Yardimci metin veya dogrulama hatasi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`min\` ve \`max\` ile saat araligini kisitlayin.** Mesai saatleri gibi belirli araliklarla sinirlamak veri kalitesini arttirir.

**\`step\` ile dakika araligini belirleyin.** 15 dakikalik araliklar icin \`step={900}\` (saniye cinsinden) kullanin.

**\`onValueChange\` ile deger degisikliklerini yakayin.** String formatinda saat degerini dogrudan alir.

**Label ile amaci net belirtin.** "Saat" yerine "Baslangic Saati" veya "Randevu Saati" gibi spesifik etiketler kullanin.

**DatePicker ile birlikte kullanin.** Tarih-saat kombinasyonu gereken senaryolarda iki bileseni yan yana konumlandirin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Serbest metin input'u olarak saat toplamak**
Kullanicilarin farkli formatlarda saat girmesi dogrulama sorunlarina yol acar; TimePicker kullanin.

**❌ Label olmadan kullanmak**
Ekran okuyucular icin erisim sorunu yaratir. Her zaman \`label\` ekleyin.

**❌ Cok dar \`min\`-\`max\` araligi vermek**
Kullanicinin secim yapamayacagi kadar dar araliklar kullanilabilirlik sorunlarina yol acar.

**❌ \`step\` degeri olmadan dakika hassasiyeti beklemek**
Varsayilan olarak dakika bazinda secim yapilir; daha buyuk araliklar icin \`step\` belirtin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Label Baglantisi:** \`<label>\` elemani \`htmlFor\` ile time input'a baglanir; ekran okuyucular alan amacini bildirir.

**Hata Bildirimi:** \`aria-invalid\` ile gecersiz durum isaretlenir; \`aria-describedby\` ile hata mesaji input'a baglanir.

**Native Tarayici Destegi:** \`<input type="time">\` kullanildigi icin tarayici yerlesik saat secicisi ve klavye navigasyonu saglar.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen render edilmez. \`readonly\` durumda degisiklik engellenir, \`disabled\` durumda input devre disi kalir.

**Gorsel Etiket:** Secilen saat \`Text\` bileseni ile gorsel olarak gosterilir; deger yokken \`emptyValueLabel\` mesaji sunulur.`,
      },
    ],
    relatedComponents: ["DatePicker", "TextInput", "Select"],
  },
};
