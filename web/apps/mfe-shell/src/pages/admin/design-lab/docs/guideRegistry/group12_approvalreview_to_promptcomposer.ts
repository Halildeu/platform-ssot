import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  ApprovalReview: {
    componentName: "ApprovalReview",
    summary: "ApprovalReview, insan onay noktasi, kaynak kanitlari ve denetim izlerini tek bir inceleme recipe yuzeyinde birlestiren ust duzey bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ApprovalReview, \`ApprovalCheckpoint\`, \`CitationPanel\` ve \`AIActionAuditTimeline\` bilesenlerini tek bir premium yuzeyde bir araya getirir. Baslik, aciklama, onay noktasi, kaynak listesi ve denetim zamancizgisini dikey akista sunar.

Kontrol edilebilir (controlled) ve kontrolsuz (uncontrolled) kullanimi destekler: \`selectedCitationId\` / \`selectedAuditId\` ile controlled; \`defaultSelectedCitationId\` / \`defaultSelectedAuditId\` ile uncontrolled mod kullanilir.

\`\`\`tsx
<ApprovalReview
  title="Yayin Onay Incelemesi"
  description="Checkpoint, kaynaklar ve denetim izleri"
  checkpoint={{ title: "v2.1 Release", summary: "Uretim oncesi onay", status: "pending" }}
  citations={[{ id: "c1", title: "Politika Belgesi", excerpt: "Kaynak alintisi...", source: "Compliance DB" }]}
  auditItems={[{ id: "a1", actor: "ai", title: "Taslak olusturuldu", timestamp: "10:30" }]}
  onCitationSelect={(id) => console.log(id)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI uretimli icerigi insan onayi ile dogrulamak gereken akislarda
- Kaynak seffafligi ve denetim izinin birlikte gosterilmesi gerektiginde
- Yayin, politika veya uyumluluk onay surecleri icin
- Coklu kanit ve audit kaydinin tek gorunumde sunulmasi gerektiginde

**Kullanmayin:**
- Yalnizca onay butonu gerektiginde — bunun yerine \`ApprovalCheckpoint\` kullanin
- Yalnizca kaynak listesi gosterecekseniz — bunun yerine \`CitationPanel\` kullanin
- Basit onay dialoglari icin — bunun yerine \`Modal\` + \`Button\` kullanin`,
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
│  ┌─────────────────┐ ┌────────────────┐  │
│  │ ApprovalCheck-  │ │ CitationPanel  │  │
│  │ point           │ │                │  │
│  └─────────────────┘ └────────────────┘  │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ AIActionAuditTimeline            │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
\`\`\`

1. **Container** — \`section\` elemani; premium yuzeyli rounded-xs border ve backdrop-blur
2. **Baslik & Aciklama** — Inceleme amacini ozetler
3. **ApprovalCheckpoint** — Onay durumu, adimlar ve aksiyonlar
4. **CitationPanel** — Kaynak kanit parcalari
5. **AIActionAuditTimeline** — Kronolojik denetim izleri`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her zaman anlamli baslik ve aciklama saglayin.** Inceleme kapsamini acikca belirtin.

**Checkpoint status'unu dogru eslestirin.** \`pending\`, \`approved\`, \`rejected\`, \`blocked\` durumlarini is akisina gore secin.

**Kaynak ve audit ogelerini iliskili tutun.** Citation ve audit verileri ayni karar surecine ait olmalidir.

**Controlled mod'u karmasik formlarda tercih edin.** Ust bilesenden state yonetimi yaparak tutarli UI saglayin.

**Access prop'unu yetki seviyesine gore ayarlayin.** Okuma yetkisi olanlara \`readonly\`, yetkisizlere \`hidden\` verin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Bos citation ve audit listeleri ile kullanmak**
Icerik yoksa ApprovalReview yerine daha basit bir onay bileseni tercih edin.

**❌ Checkpoint olmadan kullanmak**
\`checkpoint\` prop'u zorunludur; yalnizca kaynaklar gerekiyorsa \`CitationPanel\` kullanin.

**❌ Cok fazla audit ogesi yuklemek**
Performans icin audit ogelerini sayfalama veya filtreleme ile sinirlandin.

**❌ Access kontrolu olmadan hassas veriler gostermek**
\`access\` prop'unu her zaman yetki seviyesine gore ayarlayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elemani ile sarili; alt bilesenler kendi ARIA rollerini tasir.

**Secim:** Citation ve audit secim durumlari \`aria-current="true"\` ile isaretlenir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.

**Disabled:** \`disabled\` veya \`readonly\` durumda alt bilesenler etkilesime kapatilir; gorsel olarak \`opacity\` ve \`cursor-not-allowed\` ile belirtilir.

**Klavye:** Alt bilesenlerdeki butonlar Tab ile odaklanabilir, Enter/Space ile etkinlestirilir.`,
      },
    ],
    relatedComponents: ["ApprovalCheckpoint", "CitationPanel", "AIActionAuditTimeline"],
  },

  ApprovalCheckpoint: {
    componentName: "ApprovalCheckpoint",
    summary: "ApprovalCheckpoint, insan onay surecini durum, adimlar, kanit baglantilari ve aksiyon butonlari ile yoneten kontrol noktasi bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ApprovalCheckpoint, bir onay surecinin tum yasam dongusunu tek bir premium kartta gosterir. Durum badge'leri (\`pending\`, \`approved\`, \`rejected\`, \`blocked\`), kontrol listesi adimlari, kanit baglantilari ve birincil/ikincil aksiyon butonlari sunar.

\`Descriptions\` ile onaylayan, son tarih ve kanit ozetini, \`List\` ile checklist maddelerini gosterir.

\`\`\`tsx
<ApprovalCheckpoint
  title="v2.1 Release Onayi"
  summary="Uretim ortamina gecis icin insan onayi gereklidir."
  status="pending"
  approverLabel="Guvenlik Ekibi"
  dueLabel="15 Mart 2026"
  steps={[
    { key: "1", label: "Kod incelemesi", status: "approved" },
    { key: "2", label: "Guvenlik taramas", status: "ready" },
  ]}
  onPrimaryAction={() => console.log("Onaylandi")}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI tarafindan uretilen icerigin insan onayi gerektirdigi sureclerde
- Yayin, dagitim veya politika onay akislarinda
- Coklu adimli checklist tabanli onay surecleri icin
- Kanit baglantilari ile desteklenen karar noktalarinda

**Kullanmayin:**
- Basit evet/hayir onaylari icin — bunun yerine \`Modal\` + \`Button\` kullanin
- Form dogrulama adimlari icin — bunun yerine \`Stepper\` veya \`Wizard\` kullanin
- Salt okunur durum gosterimi icin — bunun yerine \`Badge\` veya \`StatusIndicator\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Checkpoint Badge] [Status Badge]       │
│  [Baslik]                                │
│  [Ozet]                                  │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ Descriptions (approver/due/      │    │
│  │               evidence)          │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ Checklist (List)                 │    │
│  └──────────────────────────────────┘    │
│                                          │
│  [Citations Badges]                      │
│  [Primary Button]  [Secondary Button]    │
│  [Footer Note]                           │
└──────────────────────────────────────────┘
\`\`\`

1. **Container** — \`article\` elemani; premium yuzeyli rounded-xs border
2. **Badge Satirı** — Checkpoint etiketi ve durum badge'i
3. **Baslik & Ozet** — Onay noktasinin amaci
4. **Descriptions** — Onaylayan, son tarih ve kanit sayisi
5. **Checklist** — List bileseni ile adim durumlari
6. **Citations** — Badge olarak kaynak referanslari
7. **Aksiyonlar** — Birincil (Approve) ve ikincil (Request review) butonlar`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Status'u is akisina gore dogru secin.** \`pending\` baslangic, \`approved\` onaylanmis, \`rejected\` reddedilmis, \`blocked\` engellenmis durum icindir.

**Her adima anlamli durum verin.** Checklist maddelerinde \`todo\`, \`ready\`, \`approved\`, \`blocked\` durumlarini dogru kullanin.

**Kanit baglantilari ekleyin.** \`evidenceItems\` ile karar dayanaklarini gorsel olarak destekleyin.

**Aksiyon etiketlerini ozellestirin.** \`primaryActionLabel\` ve \`secondaryActionLabel\` ile baska dillere de uyumlu etiketler kullanin.

**Footer note ile ek baglam saglayin.** Onay kosullari veya uyari bilgisini \`footerNote\` ile ekleyin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Status olmadan kullanmak**
Onay durumu her zaman gorsel olarak belirtilmelidir; varsayilan \`pending\` bile olsa bilinçli secilmelidir.

**❌ Cok fazla checklist adimi eklemek**
5-7 adimdan fazlasi kullanici icin bunaltici olabilir. Adimlari gruplandirin.

**❌ Aksiyon callback'leri olmadan buton gostermek**
\`onPrimaryAction\` veya \`onSecondaryAction\` tanimlanmadan butonlar islevsiz kalir.

**❌ Access kontrolu ayarlamamak**
Yetkisiz kullanicilarin onay islemleri yapmasini onlemek icin \`access\` prop'unu kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<article>\` elemani ile sarili; durum \`data-status\` attribute ile belirtilir.

**Butonlar:** Birincil ve ikincil butonlar standart \`<button>\` elemani; Tab ile odaklanabilir, Enter/Space ile etkinlesir.

**Disabled:** \`access="disabled"\` durumda butonlar \`aria-disabled\` ile isaretlenir, tiklanmasi engellenir.

**Kontrast:** Badge durum renkleri WCAG 2.1 AA minimum kontrast oranini karsilar.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.`,
      },
    ],
    relatedComponents: ["ApprovalReview", "Badge", "List", "Descriptions"],
  },

  AIGuidedAuthoring: {
    componentName: "AIGuidedAuthoring",
    summary: "AIGuidedAuthoring, prompt yazimi, oneri karti yigini, guven gostergesi ve komut paletini tek bir AI destekli yazim recipe yuzeyinde birlestiren ust duzey bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `AIGuidedAuthoring, \`PromptComposer\`, \`RecommendationCard\`, \`ConfidenceBadge\` ve \`CommandPalette\` bilesenlerini tek bir yazim yuzeyinde bir araya getirir. Prompt yazimi, AI onerilerini inceleme, guven seviyesini izleme ve hizli komutlara erisimi ayni recipe icerisinde sunar.

Controlled ve uncontrolled palette acik/kapali durumu icin \`paletteOpen\` / \`defaultPaletteOpen\` destekler.

\`\`\`tsx
<AIGuidedAuthoring
  title="AI Destekli Icerik Yazimi"
  confidenceLevel="high"
  confidenceScore={87}
  sourceCount={12}
  promptComposerProps={{ scope: "policy", maxLength: 800 }}
  recommendations={[
    { id: "r1", title: "Baslik Onerisi", summary: "SEO uyumlu baslik", confidenceLevel: "high" },
  ]}
  commandItems={[{ id: "cmd1", label: "Ton Analizi", description: "Metnin tonunu analiz et" }]}
  onApplyRecommendation={(id) => console.log("Uygulandi:", id)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI destekli icerik uretim akislarinda prompt ve oneriler birlikte sunulmak istendiginde
- Yazim surecinde guven skoru ve kaynak sayisi takibi gerektiginde
- Prompt, oneri ve komut paletinin entegre calistigi yazim arayuzlerinde
- Politika, yayin veya uyumluluk icerigi hazirlama surecleri icin

**Kullanmayin:**
- Yalnizca prompt alani gerekiyorsa — bunun yerine \`PromptComposer\` kullanin
- Yalnizca oneri gosterimi icin — bunun yerine \`RecommendationCard\` kullanin
- Basit metin duzenleyici icin — bunun yerine \`TextArea\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────┐
│  [Baslik]                [ConfidenceBadge]   │
│  [Aciklama]              [Command Palette    │
│                           Butonu]            │
│                                              │
│  ┌──────────────────┐ ┌───────────────────┐  │
│  │ PromptComposer   │ │ RecommendationCard│  │
│  │                  │ │ (liste)           │  │
│  └──────────────────┘ └───────────────────┘  │
│                                              │
│  [CommandPalette (modal)]                    │
└──────────────────────────────────────────────┘
\`\`\`

1. **Container** — \`section\` elemani; rounded-xs border ve surface-muted arkaplan
2. **Baslik & Aciklama** — Yazim amacini ozetler
3. **ConfidenceBadge** — Genel guven seviyesi gostergesi
4. **Command Palette Butonu** — Hizli komut erisimi
5. **PromptComposer** — Prompt baslik, govde, kapsam ve ton kontrolleri
6. **RecommendationCard Listesi** — AI onerilerini gosterir
7. **CommandPalette** — Modal komut arama paneli`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Guven seviyesini gercekci yansitın.** \`confidenceLevel\` ve \`confidenceScore\` degerlerini AI model ciktisina dayandirin.

**Oneri sayisini makul tutun.** 3-5 arasi oneri ideal; daha fazlasi icin sayfalama veya filtreleme ekleyin.

**Command palette ogelerini kategorize edin.** Komut ogelerini mantiksal gruplara ayirin.

**PromptComposer props'larini ozellestirin.** \`scope\`, \`maxLength\` ve \`guardrails\` degerlerini kullanim baglamina gore ayarlayin.

**Apply ve Review callback'lerini ayri yonetin.** \`onApplyRecommendation\` dogrudan uygulama, \`onReviewRecommendation\` detayli inceleme icin kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Bos oneri listesi ile kullanmak**
En az bir oneri veya anlamli bir bos durum mesaji saglayin.

**❌ Guven skoru olmadan high seviye gostermek**
\`confidenceLevel="high"\` kullanirken \`confidenceScore\` ile somut bir deger de saglayin.

**❌ Command palette ogesi olmadan buton gostermek**
\`commandItems\` bos ise palette butonu otomatik gizlenir; gereksiz prop gecmeyin.

**❌ PromptComposer'i tamamen degistirmek**
\`promptComposerProps\` ile ozellestirin; alt bileseni disaridan degistirmeyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elemani ile sarili; alt bilesenler kendi ARIA rollerini tasir.

**Klavye:** PromptComposer alanlari Tab ile odaklanabilir; CommandPalette Escape ile kapatilir.

**Erisim Kontrolu:** \`access\` prop'u ile tum alt bilesenler ayni yetki seviyesini devralir.

**ConfidenceBadge:** \`aria-label\` ile guven seviyesi ekran okuyuculara bildirilir.

**Disabled:** \`access="disabled"\` durumda tum etkilesimler engellenir; gorsel geri bildirim saglanir.`,
      },
    ],
    relatedComponents: ["PromptComposer", "RecommendationCard", "ConfidenceBadge", "CommandPalette"],
  },

  AIActionAuditTimeline: {
    componentName: "AIActionAuditTimeline",
    summary: "AIActionAuditTimeline, AI aksiyonlari ve insan onaylarini kronolojik denetim izi olarak gorselleyen zamancizgisi bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `AIActionAuditTimeline, AI ve insan eylemlerini kronolojik sirada dikey bir zamancizgisi olarak sunar. Her oge; aktor tipi (\`ai\`, \`human\`, \`system\`), durum (\`drafted\`, \`approved\`, \`executed\`, \`rejected\`, \`observed\`), baslik, zaman damgasi ve opsiyonel ozet icerir.

Secim destegi ile detay paneli acma veya vurgulama senaryolarina uyum saglar. Bos durum icin ozellestirebilir mesaj sunar.

\`\`\`tsx
<AIActionAuditTimeline
  title="Denetim Zamancizgisi"
  items={[
    { id: "1", actor: "ai", title: "Taslak olusturuldu", timestamp: "10:30", status: "drafted" },
    { id: "2", actor: "human", title: "Inceleme tamamlandi", timestamp: "11:15", status: "approved" },
    { id: "3", actor: "system", title: "Dagitim baslatildi", timestamp: "11:45", status: "executed" },
  ]}
  selectedId="2"
  onSelectItem={(id) => console.log("Secildi:", id)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI tarafindan gerceklestirilen aksiyonlarin denetim izini gostermek icin
- Insan ve AI isbirliginin kronolojik kaydi gerektiginde
- Onay surecleri icerisinde karar gecmisini sergilemek icin
- Uyumluluk ve seffaflik raporlama arayuzlerinde

**Kullanmayin:**
- Genel etkinlik akisi icin — bunun yerine \`ActivityFeed\` kullanin
- Yalnizca durum gostergesi gerekiyorsa — bunun yerine \`Badge\` veya \`StatusIndicator\` kullanin
- Zaman odakli gant semalari icin — bunun yerine \`Timeline\` veya \`Gantt\` kullanin`,
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
│  ● ─── [Actor Badge] [Status Badge]     │
│  │     [Baslik]              [Zaman]     │
│  │     [Ozet]                            │
│  │                                       │
│  ● ─── [Actor Badge] [Status Badge]     │
│  │     [Baslik]              [Zaman]     │
│  │     [Ozet]                            │
│  │                                       │
│  ● ─── [Actor Badge] [Status Badge]     │
│        [Baslik]              [Zaman]     │
└──────────────────────────────────────────┘
\`\`\`

1. **Container** — \`section\` elemani; premium yuzeyli rounded-xs border
2. **Baslik & Aciklama** — Zamancizgisi amacini aciklar
3. **Zaman Cizgisi** — Dikey cizgi ile baglanan dugumler
4. **Dugum Noktasi** — Dolu daire; secili ise vurgulanir
5. **Oge Karti** — Aktor badge, durum badge, baslik, zaman ve ozet
6. **Bos Durum** — \`Empty\` bileseni ile ozellestirilmis mesaj`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Aktor tiplerini dogru atanin.** \`ai\` yapay zeka aksiyonlari, \`human\` insan mudahaleleri, \`system\` otomatik sistem islemleri icin kullanilir.

**Durum degerlerini tutarli kullanin.** \`drafted\` → \`approved\` → \`executed\` dogal bir akis izler.

**Ozet alanini kisa tutun.** \`summary\` iki satiri gecmemelidir; detay icin secim ile ayri panel acin.

**Compact mod'u yogun arayuzlerde tercih edin.** \`compact={true}\` ile daha siki bir gorunum elde edin.

**Bos durum mesajini ozellestirin.** \`emptyStateLabel\` ile baglama uygun bir mesaj saglayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla oge yuklemek**
Performans ve okunabilirlik icin 20-30 ogeden fazlasini sayfalama ile sinirlandin.

**❌ Zaman damgasi olmadan kullanmak**
Her ogenin \`timestamp\` alani zorunludur; kronolojik siralamayi bozmayin.

**❌ Actor tipi belirtmeden kullanmak**
\`actor\` alani zorunludur; her ogenin kaynagini (ai/human/system) acikca belirtin.

**❌ Secim callback'i olmadan secim durumu gostermek**
\`selectedId\` kullaniyorsaniz \`onSelectItem\` callback'ini de tanimlayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` ile sarili; zamancizgisi \`<ol>\`/\`<li>\` ile sirali liste olarak isaretlenir.

**Secim:** Secili oge \`aria-current="true"\` ile isaretlenir.

**Klavye:** Secim butonlari Tab ile odaklanabilir, Enter/Space ile etkinlestirilir.

**Disabled:** \`access="disabled"\` veya \`"readonly"\` durumda butonlar tiklanamaz; gorsel olarak \`opacity-80\` ve \`cursor-not-allowed\` ile belirtilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.`,
      },
    ],
    relatedComponents: ["ApprovalReview", "Badge", "Empty"],
  },

  PromptComposer: {
    componentName: "PromptComposer",
    summary: "PromptComposer, kapsam guvenli prompt yazimi, ton kontrolu, guardrail gostergesi ve kaynak referanslarini tek bir composer yuzeyinde birlestiren bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `PromptComposer, AI yardimcisina verilecek gorev tanimini yazmak icin ozel olarak tasarlanmis bir yazim yuzeyidir. Prompt basligi (\`subject\`), govde metni (\`value\`), kapsam (\`scope\`: general/approval/policy/release) ve ton (\`tone\`: neutral/strict/exploratory) kontrolleri sunar.

Yan panelde aktif sozlesme (scope, tone, karakter sayisi), guardrail'ler ve kaynak referanslari gorunur. Tum alanlar controlled ve uncontrolled modda kullanilabilir.

\`\`\`tsx
<PromptComposer
  title="Politika Prompt'u"
  scope="policy"
  tone="strict"
  maxLength={800}
  guardrails={["PII filtreleme", "Dil kontrolu"]}
  citations={["ISO 27001", "KVKK Rehberi"]}
  onValueChange={(val) => console.log(val)}
  onScopeChange={(scope) => console.log(scope)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI'a verilecek yapisal prompt'larin yazilmasi gerektiginde
- Kapsam ve ton kontrolu ile sinirlandirilmis yazim arayuzlerinde
- Guardrail ve kaynak referanslarinin prompt ile birlikte gosterilmesi gerektiginde
- AIGuidedAuthoring recipe icerisinde alt bilesen olarak

**Kullanmayin:**
- Serbest metin giris alanı icin — bunun yerine \`TextArea\` kullanin
- Chat tarzı mesajlasma icin — bunun yerine ozel chat bileseni kullanin
- Basit form alanlari icin — bunun yerine \`Input\` veya \`TextArea\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────┐
│  [Baslik]                                    │
│  [Aciklama]                                  │
│                                              │
│  ┌──────────────────┐ ┌───────────────────┐  │
│  │ Prompt Title     │ │ Current Contract  │  │
│  │ (TextInput)      │ │ (scope/tone/chars)│  │
│  │                  │ │                   │  │
│  │ Prompt Body      │ │ Guardrails        │  │
│  │ (TextArea)       │ │ (Badge listesi)   │  │
│  │                  │ │                   │  │
│  │ [Scope Butonlari]│ │ Source Anchors    │  │
│  │ [Tone Butonlari] │ │ (Badge listesi)   │  │
│  └──────────────────┘ └───────────────────┘  │
└──────────────────────────────────────────────┘
\`\`\`

1. **Container** — \`section\` elemani; rounded-xs border, surface-muted arkaplan
2. **Baslik & Aciklama** — Composer amacini ozetler
3. **Prompt Title** — Tek satirlik baslik giris alani
4. **Prompt Body** — Cok satirlik govde alani, karakter sayaci ile
5. **Scope Butonlari** — general, approval, policy, release secenekleri
6. **Tone Butonlari** — neutral, strict, exploratory secenekleri
7. **Current Contract** — Aktif kapsam, ton ve karakter bilgisi
8. **Guardrails** — Uyari badge'leri ile sinir kurallari
9. **Source Anchors** — Referans kaynaklari badge'leri`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Kapsam ve tonu baglama gore varsayilan olarak ayarlayin.** Politika icerigi icin \`scope="policy"\` ve \`tone="strict"\` mantikli bir baslangictir.

**maxLength'i icerigi ture gore sinirlandin.** Kisa prompt'lar icin 400-600, detayli gorevler icin 1000-1200 karakter idealdir.

**Guardrail'leri acik ve anlasilir tutun.** Her guardrail maddesi tek bir kurali ifade etmelidir.

**Citation'lari kaynak gosterimi icin kullanin.** Prompt'un dayandigi belge veya standartlari listeleyin.

**Controlled mod'u karmasik formlarda tercih edin.** \`value\`, \`scope\`, \`tone\` prop'larini ust bilesenden yonetin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ maxLength siniri koymamak**
Kontrolsuz uzun prompt'lar AI performansini dusurur; her zaman bir ust sinir belirleyin.

**❌ Scope ve tone kontrollerini gizlemek**
Kullanicinin prompt kapsamini ve tonunu gormesi seffaflik icin onemlidir.

**❌ Guardrail olmadan hassas kapsam kullanmak**
\`scope="policy"\` kullanirken ilgili guardrail'leri mutlaka ekleyin.

**❌ Bos citation listesi ile kaynak paneli gostermek**
Citation yoksa panel otomatik gizlenir; bos dizi gecmeyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elemani ile sarili; giris alanlari \`<label>\` ile iliskilendirilmistir.

**Klavye:** TextInput ve TextArea Tab ile odaklanabilir; Scope ve Tone butonlari klavye ile secilebilir.

**Karakter Sayaci:** \`showCount\` ile metin uzunlugu gorsel ve programatik olarak sunulur.

**Erisim Kontrolu:** \`access\` prop'u ile tum giris alanlari ve butonlar ayni yetki seviyesini devralir. \`readonly\` durumda alanlar duzenlenemez ancak okunabilir.

**Disabled:** \`access="disabled"\` durumda tum etkilesimler engellenir; gorsel geri bildirim saglanir.`,
      },
    ],
    relatedComponents: ["AIGuidedAuthoring", "TextArea", "TextInput", "Badge"],
  },
};
