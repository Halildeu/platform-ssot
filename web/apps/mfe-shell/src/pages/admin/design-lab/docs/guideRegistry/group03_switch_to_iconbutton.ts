import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  Switch: {
    componentName: "Switch",
    summary: "Switch, bir ayari aninda acip kapatmak icin kullanilan toggle kontroludur.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Switch, bir boolean degeri gorsel olarak acik/kapali durumda gosteren toggle bilesenidir. Semantik olarak \`role="switch"\` kullanan bir \`<input type="checkbox">\` uzerine insadir.

Uc boyut (\`sm\`, \`md\`, \`lg\`), etiket ve aciklama destegi sunar. \`onCheckedChange\` callback'i ile kontrollü kullanim saglar.

\`\`\`tsx
<Switch
  label="Bildirimler"
  description="E-posta bildirimleri alin"
  checked={isEnabled}
  onCheckedChange={setIsEnabled}
/>
<Switch switchSize="sm" checked={darkMode} onCheckedChange={setDarkMode} />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Bir ayari aninda acip kapatmak icin (bildirimler, karanlik mod, ozellik toggle)
- Degisikligin hemen etkili oldugu durumlarda (kaydet butonu gerektirmeyen)
- Acik/kapali ikili durumlar icin
- Ayar panelleri ve tercih ekranlarinda

**Kullanmayin:**
- Form icerisinde kaydet butonu ile birlikte — bunun yerine \`Checkbox\` kullanin
- Birden fazla secim gerektiren listeler icin — bunun yerine \`Checkbox\` grubu kullanin
- Birbirini dislayan secenekler icin — bunun yerine \`Radio\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌───────────┐
│ ○─────    │  ← Kapali (track gri)
└───────────┘

┌───────────┐
│     ─────●│  ← Acik (track primary renk)
└───────────┘
  Etiket
  Aciklama
\`\`\`

1. **Track** — Yuvarlak arka plan; kapali: \`border-default\`, acik: \`action-primary\`
2. **Thumb** — Kayar beyaz daire; \`translate-x\` ile pozisyon degistirir
3. **Gizli Input** — \`sr-only\` sinifi ile gizlenen \`<input type="checkbox" role="switch">\`
4. **Etiket** — \`label\` prop'u ile sag tarafa yerlesen metin
5. **Aciklama** — \`description\` prop'u ile etiket altinda ek bilgi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Aninda etki icin kullanin.** Switch degisikligi hemen uygulanmalidir; "Kaydet" butonu gerektirmemelidir.

**Olumlu etiketler kullanin.** "Bildirimleri ac" seklinde yazin, "Bildirimleri kapatma" seklinde degil.

**Her zaman etiket saglayin.** Gorsel olarak gizlenmis olsa bile \`label\` veya \`aria-label\` ekleyin.

**Boyutu baglama gore secin.** Ayar panellerinde \`md\`, toolbar icinde \`sm\`, ozellik kartlarinda \`lg\` kullanin.

**Baslangic durumunu netlestirin.** Kullanici Switch'i gordugunde mevcut durumu anlamalidir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Form icinde kaydet butonu ile birlikte kullanmak**
Switch aninda etki eder. Form akisinda \`Checkbox\` daha uygun.

**❌ Etiketsiz Switch kullanmak**
Kullanici neyi toggle ettigini anlayamaz. Her zaman \`label\` ekleyin.

**❌ Ikiden fazla durum icin kullanmak**
Switch yalnizca acik/kapali icindir. Uc+ durum icin \`Select\` veya \`Radio\` kullanin.

**❌ Kritik/geri donulemez islemler icin kullanmak**
Hesap silme gibi islemler icin onay dialogu gerektiren \`Button\` + \`Modal\` kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA Rolu:** \`role="switch"\` ile ekran okuyucular bileseni toggle olarak tanir.

**Klavye:** \`Tab\` ile odaklanilir, \`Space\` ile durum degistirilir.

**Etiket Iliskilendirme:** \`htmlFor\` / \`id\` otomatik olarak \`useId()\` ile eslestirilir.

**Durum Duyurusu:** Ekran okuyucular \`checked\` durumunu "acik" veya "kapali" olarak duyurur.

**Devre Disi:** \`disabled\` durumunda \`opacity-50\` ve \`cursor-not-allowed\` uygulanir; etkilesim engellenir.`,
      },
    ],
    relatedComponents: ["Checkbox", "Radio", "Button"],
  },

  Divider: {
    componentName: "Divider",
    summary: "Divider, icerik bolumleri arasinda gorsel ayirim saglayan yatay veya dikey cizgi bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Divider, sayfa icerisindeki bolumler arasinda gorsel bir ayrim cizgisi olusturur. \`horizontal\` (varsayilan) ve \`vertical\` yonlendirme, opsiyonel **etiket** (ortada metin) ve dort bosluk secenegi (\`none\`, \`sm\`, \`md\`, \`lg\`) destekler.

Etiketli mod, "veya", "ya da" gibi ayirici metinler icin idealdir.

\`\`\`tsx
<Divider />
<Divider label="veya" spacing="lg" />
<Divider orientation="vertical" spacing="md" />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Icerik bolumleri arasinda gorsel ayirim icin
- Form gruplari veya kart bolumlerini ayirmak icin
- "veya" gibi ayirici metin gostermek icin (\`label\` prop)
- Yatay toolbar'larda elemanlar arasinda dikey ayirac icin

**Kullanmayin:**
- Dekoratif cerceve/cizgi icin — bunun yerine CSS \`border\` kullanin
- Bosluk olusturmak icin — bunun yerine \`Stack\` veya \`gap\` kullanin
- Liste ogelerini ayirmak icin — bunun yerine liste bileseninin kendi ayiricisini kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
Yatay (varsayilan):
────────────────────────────

Etiketli:
──────────── veya ────────────

Dikey:
  │
  │
  │
\`\`\`

1. **Yatay Cizgi** — \`<hr>\` elemani, \`h-px\` ve \`border-subtle\` arkaplan
2. **Etiketli Mod** — Iki cizgi arasinda \`text-xs font-medium\` etiket metni
3. **Dikey Mod** — \`<div>\` elemani, \`w-px\` ve \`h-full\` ile tam yukseklik
4. **Bosluk** — \`spacing\` prop'u ile \`my-2/4/6\` (yatay) veya \`mx-2/4/6\` (dikey)`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Bosluk ile birlikte kullanin.** \`spacing="md"\` varsayilandir; cogul durumda yeterlidir.

**Etiketli modu ozel durumlar icin saklayin.** "veya", "ya da", bolum basliklari gibi anlamli metinler icin.

**Asiri kullanmayin.** Her bolum arasina divider koymak yerine bosluk (\`gap\`) ile gorsel hiyerarsi kurun.

**Dikey modu toolbar'larda kullanin.** Buton gruplari veya ikon gruplari arasinda gorsel ayirim icin idealdir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Her yere divider koymak**
Asiri divider gorsel gurultu yaratir. Bosluk ve gruplama ile hiyerarsi kurun.

**❌ Bosluk amacli kullanmak**
Divider gorsel ayirim icindir. Bosluk icin \`Stack\`, \`gap\` veya \`margin\` kullanin.

**❌ Uzun etiket metni kullanmak**
Etiketli modda metin kisa olmalidir (1-3 kelime). Uzun metinler icin baslik bileseni kullanin.

**❌ Dikey divider'i blok icerik arasinda kullanmak**
Dikey mod sadece inline/flex icerik arasinda calisir; blok elemanlar arasinda yatay kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA Rolu:** \`role="separator"\` ile ekran okuyucular gorsel ayirimi tanir.

**Oryantasyon:** Dikey modda \`aria-orientation="vertical"\` otomatik olarak eklenir.

**Semantik:** Yatay mod native \`<hr>\` elemani kullanir; ekran okuyucular dogrudan "ayirici" olarak duyurur.

**Klavye:** Divider etkilesimli degildir; tab sirasinda atlanir.`,
      },
    ],
    relatedComponents: ["Stack", "Card", "Tabs"],
  },

  Tooltip: {
    componentName: "Tooltip",
    summary: "Tooltip, fare veya klavye odagi ile tetiklenen kisa bilgi baloncugu gosterir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Tooltip, bir elemanin uzerine gelindiginde veya odaklanildiginda kisa aciklayici bilgi gosteren bir overlay bilesenidir. Dort yonlendirme (\`top\`, \`bottom\`, \`left\`, \`right\`), gecikme kontrolu (\`delay\`, \`openDelay\`, \`closeDelay\`) ve opsiyonel ok gostergesi (\`showArrow\`) destekler.

Icerik yoksa bilesen tamamen atlanir ve yalnizca children render edilir.

\`\`\`tsx
<Tooltip content="Dosyayi kaydet">
  <Button>Kaydet</Button>
</Tooltip>
<Tooltip content="Uzun aciklama metni" placement="right" showArrow>
  <IconButton icon={<InfoIcon />} />
</Tooltip>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Ikon-only butonlara aciklama eklemek icin
- Kisaltilmis veya truncate edilmis metinlerin tam halini gostermek icin
- Devre disi butonlarin nedenini aciklamak icin
- Form alanlarinda ek yardim bilgisi sunmak icin

**Kullanmayin:**
- Zengin icerik (resim, link, form) gostermek icin — bunun yerine \`Popover\` kullanin
- Kritik bilgi icin — Tooltip gizlidir; onemli bilgiyi her zaman gorunur yapin
- Mobil cihazlarda — hover yoktur; mobilde farkli bir yaklasim kullanin
- Uzun paragraflar icin — Tooltip kisa bilgi icindir`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
          ┌─────────────┐
          │  Tooltip     │
          │  Icerigi     │
          └──────┬──────┘
                 ▼ (ok)
          [Trigger Element]
\`\`\`

1. **Wrapper** — \`relative inline-flex\` span; hover/focus olaylarini yakalar
2. **Trigger** — \`children\` olarak gecilen herhangi bir eleman
3. **Balon** — \`role="tooltip"\`, koyu arkaplan, beyaz metin, \`z-[1600]\`
4. **Ok** (opsiyonel) — \`showArrow={true}\` ile yonlendirmeye gore konumlanan ucgen
5. **Animasyon** — \`animate-in fade-in-0 zoom-in-95\` ile yumusak giris efekti`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Kisa tutun.** Tooltip 1-2 satir olmalidir. Uzun aciklamalar icin \`Popover\` kullanin.

**Gecikme ayarlayin.** Varsayilan \`200ms\` cogu durum icin uygundur. Sik kullanilan UI icin \`0ms\` dusunun.

**Ikon butonlarinda mutlaka kullanin.** Ikon-only butonlar icin tooltip zorunludur; kullanici aksiyonu anlamalidir.

**Kritik bilgiyi tooltip'e gizlemeyin.** Tooltip kesfedilmeyi gerektirir; onemli bilgi her zaman gorunur olmalidir.

**\`placement\` ile tasmayi onleyin.** Sayfa kenarindaki elemanlar icin uygun yon secin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Etkilesimli icerik koymak**
Tooltip \`pointer-events-none\` dir; icine buton veya link koymak calismaz. \`Popover\` kullanin.

**❌ Uzun paragraflar gostermek**
Tooltip kisa bilgi icindir. 2 satirdan uzun icerik icin \`Popover\` veya \`Drawer\` kullanin.

**❌ Tooltip icinde tooltip kullanmak**
Ic ice tooltip gorsel ve etkilesim sorunlari yaratir.

**❌ Mobilde tek bilgi kaynagi olarak kullanmak**
Mobil cihazlarda hover yoktur. Kritik bilgiyi alternatif yollarla sunun.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA Rolu:** \`role="tooltip"\` ile ekran okuyucular balon icerigini duyurur.

**Klavye:** \`onFocus\` ile tetiklenir; \`Tab\` ile elemana odaklanildiginda tooltip gorunur olur.

**Gecikme:** \`delay\` / \`openDelay\` ile hover ve focus sonrasi bekleme suresi ayarlanir. \`closeDelay\` ile kapanma geciktirilir.

**Devre Disi:** \`disabled={true}\` ile tooltip tamamen devre disi birakilir; icerik gosterilmez.

**Renk Kontrasti:** Koyu arkaplan (\`text-primary\`) uzerinde acik metin (\`text-inverse\`) ile WCAG AA kontrastini saglar.`,
      },
    ],
    relatedComponents: ["Popover", "Modal", "Badge", "IconButton"],
  },

  Text: {
    componentName: "Text",
    summary: "Text, tutarli tipografi token'lari ile herhangi bir HTML metin elemanini render eden polimorfik bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Text, tasarim sistemi tipografi token'larini uygulayan polimorfik bir bilesendir. \`as\` prop'u ile \`p\`, \`span\`, \`h1-h6\`, \`label\`, \`code\`, \`kbd\` gibi herhangi bir HTML elemani olarak render edilebilir.

Yedi renk varyanti, sekiz boyut, dort font agirligi, \`truncate\`, \`lineClamp\` ve \`mono\` destegi sunar.

\`\`\`tsx
<Text as="h1" size="3xl" weight="bold">Sayfa Basligi</Text>
<Text variant="secondary" size="sm">Yardimci metin</Text>
<Text as="code" mono size="sm">const x = 42;</Text>
<Text truncate>Cok uzun bir metin burada kesilir...</Text>
<Text lineClamp={2}>Birden fazla satir icin line-clamp...</Text>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tum metin icerigi icin tutarli tipografi uygulamak istediginizde
- Basliklar, paragraflar, etiketler ve yardimci metinler icin
- Kod parcalari veya klavye kisayollarini gostermek icin (\`as="code"\`, \`as="kbd"\`)
- Metin kesme (\`truncate\`) veya satir siniri (\`lineClamp\`) gereken yerlerde

**Kullanmayin:**
- Zengin metin editoru icin — bunun yerine ozel rich-text bileseni kullanin
- Etkilesimli metin icin — bunun yerine \`Link\` veya \`Button\` kullanin
- Uzun form etiketleri icin — bunun yerine \`FormField\` bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
<Text as="p" variant="default" size="base" weight="normal">
  Metin icerigi
</Text>
\`\`\`

1. **Polimorfik Kok** — \`as\` prop'u ile belirlenen HTML elemani (varsayilan: \`span\`)
2. **Renk Katmani** — \`variant\` ile CSS token bazli renk: \`default\`, \`secondary\`, \`muted\`, \`success\`, \`warning\`, \`error\`, \`info\`
3. **Boyut Katmani** — \`size\` ile Tailwind boyut siniflari: \`xs\` ile \`4xl\` arasi
4. **Agirlik Katmani** — \`weight\` ile \`font-normal\`, \`font-medium\`, \`font-semibold\`, \`font-bold\`
5. **Metin Kontrolleri** — \`truncate\` (tek satir kesme), \`lineClamp\` (coklu satir siniri), \`mono\` (monospace font)`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Dogru semantik elemani secin.** Basliklar icin \`as="h1-h6"\`, paragraflar icin \`as="p"\`, inline metin icin \`as="span"\` kullanin.

**Tipografi hiyerarsisi kurun.** Sayfa basligi icin \`size="3xl" weight="bold"\`, govde icin \`size="base"\`, yardimci metin icin \`size="sm" variant="secondary"\` kullanin.

**\`lineClamp\` ile uzun metinleri sinirlayin.** Kart aciklamalari gibi alanlarda \`lineClamp={2}\` veya \`lineClamp={3}\` kullanin.

**\`mono\` prop'unu kod icerigi icin kullanin.** \`as="code" mono\` kombinasyonu tutarli kod gosterimi saglar.

**Renk varyantlarini anlamsal kullanin.** \`error\` sadece hata mesajlari icin, \`success\` onay metinleri icin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Semantik uyumsuzluk**
Baslik gorunumlu bir metin icin \`as="span"\` kullanmak; \`as="h2"\` gibi dogru elemani secin.

**❌ Dogrudan stil vermek yerine token kullanmamak**
\`className="text-state-danger-text"\` yerine \`variant="error"\` kullanin; tema degisimlerinde tutarlilik saglanir.

**❌ Her yerde \`weight="bold"\` kullanmak**
Asiri kalin metin okunabilirligi dusurur. Hiyerarsi icin \`weight\` ve \`size\` kombinasyonlarini kullanin.

**❌ \`truncate\` ile birlikte \`lineClamp\` kullanmak**
Bu iki prop birbirini dislar. \`truncate\` tek satir, \`lineClamp\` coklu satir icindir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik HTML:** \`as\` prop'u ile dogru HTML elemani secilir. \`h1-h6\` baslik hiyerarsisini ekran okuyucular kullanir.

**Renk Kontrasti:** Tum \`variant\` degerleri CSS token'lari uzerinden WCAG 2.1 AA kontrastini saglar.

**Metin Kesme:** \`truncate\` veya \`lineClamp\` kullanildiginda tam metin \`title\` attribute ile erisilebilir kilinabilir.

**Klavye:** Text bileseni etkilesimli degildir; tab sirasinda atlanir. Etkilesim gerekiyorsa \`as="label"\` ile form kontrolleriyle iliskilendirin.`,
      },
    ],
    relatedComponents: ["Badge", "Tag", "Link", "Input"],
  },

  Dropdown: {
    componentName: "Dropdown",
    summary: "Dropdown, bir tetikleyici elemana tiklandiginda menu ogeleri, ayiricilar ve ikon destegi sunan acilir menu bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Dropdown, bir tetikleyici elemana tiklandiginda acilan menu paneli sunar. Menu ogeleri (\`DropdownItem\`), ayiricilar (\`separator\`) ve grup etiketleri (\`label\`) iceren esnek bir yapi saglar.

Her oge icin ikon, aciklama metni, devre disi durumu ve \`danger\` modu desteklenir. Dort yerlestirme secenegi (\`bottom-start\`, \`bottom-end\`, \`top-start\`, \`top-end\`) ve klavye navigasyonu ile tam erisim saglanir.

\`\`\`tsx
<Dropdown
  items={[
    { key: "edit", label: "Duzenle", icon: <EditIcon /> },
    { type: "separator" },
    { key: "delete", label: "Sil", danger: true, onClick: handleDelete },
  ]}
>
  <Button>Islemler</Button>
</Dropdown>

<Dropdown
  placement="bottom-end"
  items={[
    { type: "label", label: "HESAP" },
    { key: "profile", label: "Profil", description: "Hesap ayarlari" },
    { key: "logout", label: "Cikis Yap", danger: true },
  ]}
>
  <IconButton icon={<MoreIcon />} label="Menu" />
</Dropdown>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Birden fazla aksiyonu tek bir tetikleyici altinda gruplamak icin (islem menusu)
- Tablo satiri veya kart uzerinde contextual aksiyonlar sunmak icin
- Hesap menusu, ayarlar menusu gibi navigasyon disindaki menu ihtiyaclari icin
- Yer kisitlamasi olan alanlarda coklu aksiyon sunmak icin

**Kullanmayin:**
- Form secimi icin — bunun yerine \`Select\` veya \`Combobox\` kullanin
- Navigasyon menusu icin — bunun yerine \`NavigationRail\` veya \`MenuBar\` kullanin
- Zengin icerik gostermek icin — bunun yerine \`Popover\` kullanin
- Sag tiklama menusu icin — bunun yerine \`ContextMenu\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
[Trigger Button]
       │
       ▼
┌──────────────────────┐
│  GRUP ETIKETI        │
│  [Icon]  Oge 1       │
│          Aciklama     │
│  [Icon]  Oge 2       │
│  ─────────────────── │ ← separator
│  [Icon]  Sil (danger)│
└──────────────────────┘
\`\`\`

1. **Trigger** — \`children\` olarak gecilen eleman; \`aria-haspopup="menu"\` ve \`aria-expanded\` otomatik eklenir
2. **Menu Paneli** — \`role="menu"\`, \`rounded-xl\`, \`shadow-xl\`, \`z-[1500]\`, animasyonlu giris
3. **Menu Ogesi** — \`role="menuitem"\`, \`<button>\` elemani; ikon, etiket ve aciklama iceren satir
4. **Ayirici** — \`h-px\` yuksekliginde \`border-subtle\` renkte ince cizgi
5. **Grup Etiketi** — \`text-[10px]\` buyuk harf, \`uppercase tracking-wider\` stil`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Aksiyonlari mantiksal gruplayin.** Ayirici ve grup etiketleri ile iliskili aksiyonlari bir arada tutun.

**Tehlikeli aksiyonlari \`danger\` ile isaretleyin.** Silme, kaldir gibi geri donulemez aksiyonlar icin \`danger: true\` kullanin.

**Ikon ile gorsel tutarlilik saglayin.** Tum ogelere ikon ekleyin veya hicbirine eklemeyin; karisik kullanim gorsel dengesizlik yaratir.

**\`description\` ile baglam saglayin.** Aksiyonun etkisini kisa bir aciklama ile netlestirin.

**Oge sayisini sinirli tutun.** 7-8 ogeden fazlasi gorsel yogunluk yaratir; gruplar ve ayiricilar ile organize edin.

**\`minWidth\` ile minimum genisligi ayarlayin.** Varsayilan 180px cogu durum icin yeterlidir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Dropdown icinde form elemanlari kullanmak**
Menu ogeleri aksiyon tetikler; form kontrolleri icin \`Popover\` kullanin.

**❌ Cok fazla oge iceren menu olusturmak**
10+ oge gorsel karisiklik yaratir. Alt menulere bolun veya farkli bir yaklasim dusunun.

**❌ Navigasyon icin kullanmak**
Dropdown aksiyon menusudur; sayfa navigasyonu icin navigation bilesenleri kullanin.

**❌ \`danger\` ogelerini menunun basina koymak**
Tehlikeli aksiyonlar menunun sonunda olmalidir; kazara tiklama riskini azaltir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** Trigger uzerinde \`aria-haspopup="menu"\` ve \`aria-expanded\` otomatik eklenir. Menu paneli \`role="menu"\`, ogeler \`role="menuitem"\` kullanir.

**Klavye:** \`Enter\`, \`Space\` veya \`ArrowDown\` ile menu acilir. \`ArrowUp/Down\` ile ogeler arasinda gezinilir. \`Enter/Space\` ile secim yapilir. \`Escape\` ile menu kapanir.

**Devre Disi:** \`disabled: true\` olan ogeler \`pointer-events-none\` ve \`opacity-40\` ile gosterilir; klavye navigasyonunda atlanir.

**Odak Yonetimi:** Dis tiklama ile menu kapanir. Odak yonetimi \`focusIndex\` state ile kontrol edilir.`,
      },
    ],
    relatedComponents: ["Select", "Popover", "ContextMenu", "IconButton"],
  },

  IconButton: {
    componentName: "IconButton",
    summary: "IconButton, yalnizca ikon iceren kare seklinde bir buton bilesenidir; erisim icin zorunlu \`label\` prop'u gerektirir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `IconButton, metin yerine yalnizca ikon gosteren kompakt bir buton bilesenidir. Bes varyant (\`primary\`, \`secondary\`, \`outline\`, \`ghost\`, \`danger\`), dort boyut (\`xs\`, \`sm\`, \`md\`, \`lg\`), yukleme durumu ve yuvarlak (\`rounded\`) sekil destekler.

Erisim icin \`label\` prop'u zorunludur ve otomatik olarak \`aria-label\` olarak uygulanir. Yukleme durumunda ikon yerine \`Spinner\` gosterilir.

\`\`\`tsx
<IconButton icon={<EditIcon />} label="Duzenle" variant="ghost" />
<IconButton icon={<TrashIcon />} label="Sil" variant="danger" size="sm" />
<IconButton icon={<PlusIcon />} label="Ekle" variant="primary" rounded-xs />
<IconButton icon={<SaveIcon />} label="Kaydediyor" loading />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Toolbar, tablo satiri veya kart basliginda yer kisitli aksiyonlar icin
- Sik kullanilan ve ikonu ile taninan aksiyonlar icin (duzenle, sil, kapat)
- Dropdown veya Popover tetikleyicisi olarak
- Toggle butonlari icin (favorile, sabitle)

**Kullanmayin:**
- Metin etiketi ile anlam iletmek gerektiginde — bunun yerine \`Button\` kullanin
- Navigasyon icin — bunun yerine \`Link\` kullanin
- Dekoratif ikon gosterimi icin — bunun yerine \`Icon\` bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌─────────┐
│         │
│  [Icon] │   ← Kare buton (varsayilan: rounded-lg)
│         │
└─────────┘

┌─────────┐
│  (···)  │   ← loading durumu (Spinner)
└─────────┘
\`\`\`

1. **Buton Container** — Native \`<button>\` elemani; kare boyut (\`h-9 w-9\` varsayilan)
2. **Ikon** — \`icon\` prop'u ile gecilen SVG/ReactNode; boyut otomatik ayarlanir (\`[&>svg]:h-4.5\`)
3. **Spinner** — \`loading={true}\` durumunda ikon yerine \`Spinner size="xs"\` gosterilir
4. **Odak Halkasi** — \`focus-visible:ring-2\` ile gorunur odak gostergesi
5. **Sekil** — \`rounded={false}\` (varsayilan): \`rounded-lg\`; \`rounded={true}\`: \`rounded-full\``,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her zaman \`label\` saglayin.** \`label\` prop'u zorunludur ve \`aria-label\` olarak uygulanir. Anlami net olan bir metin yazin: "Sil" degil "Bu ogeyi sil".

**Tooltip ile eslestiirin.** Ikon-only butonlar icin \`Tooltip\` sarmalamasiyla gorsel aciklama ekleyin.

**Varyanti dogru secin.** Ana aksiyonlar icin \`primary\`, ikincil icin \`ghost\` (varsayilan), tehlikeli icin \`danger\` kullanin.

**Yukleme durumunu kullanin.** Async islemler icin \`loading={true}\` verin; buton otomatik olarak devre disi olur.

**Boyutu baglama gore secin.** Tablo icinde \`xs\` veya \`sm\`, standart UI'da \`md\`, hero alanlarda \`lg\`.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ \`label\` olmadan kullanmak**
Ekran okuyucular icin erisim sorunu yaratir. \`label\` zorunlu bir prop'tur.

**❌ Anlamsiz ikon kullanmak**
Kullanici ikonu taniyamiyorsa metin etiketli \`Button\` tercih edin.

**❌ Buton yerine dekoratif ikon olarak kullanmak**
IconButton etkilesimli bir elemandir. Salt gorsel ikon icin \`<span>\` icinde SVG kullanin.

**❌ Cok kucuk boyutlarda (\`xs\`) kritik aksiyonlar icin kullanmak**
Kucuk dokunma alani mobilde kullanim zorlugu yaratir; en az \`sm\` tercih edin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA Etiketi:** \`label\` prop'u otomatik olarak \`aria-label\` olarak uygulanir. Ekran okuyucular butonun amacini duyurur.

**Klavye:** Native \`<button>\` elemani kullanir; \`Tab\` ile odaklanilir, \`Enter/Space\` ile etkinlestirilir.

**Odak Gostergesi:** \`focus-visible:ring-2\` ile WCAG 2.1 AA uyumlu gorunur odak halkasi saglanir.

**Devre Disi:** \`disabled\` veya \`loading\` durumunda \`pointer-events-none\` ve \`opacity-50\` uygulanir.

**Yukleme:** \`loading={true}\` durumunda \`Spinner\` gorsel geri bildirim saglar; buton otomatik devre disi olur.`,
      },
    ],
    relatedComponents: ["Button", "Tooltip", "Dropdown", "Spinner"],
  },
};
