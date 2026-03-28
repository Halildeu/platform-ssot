import type { ExampleEntry } from './types';

export const examples: Record<string, ExampleEntry[]> = {
  ActionBar: [
    {
      id: "actionbar-basic",
      title: "Temel Aksiyon Cubugu",
      description: "Toplu islem butonlari ile secim odakli aksiyon cubugu.",
      category: "basic",
      code: `import { MenuBar } from '@mfe/design-system';

export function Example() {
  return (
    <MenuBar
      size="sm"
      appearance="outline"
      items={[
        { value: 'onayla', label: 'Onayla', icon: '\\u2713' },
        { value: 'reddet', label: 'Reddet', icon: '\\u2717' },
        { value: 'sil', label: 'Sil', icon: '\\ud83d\\uddd1' },
      ]}
      onAction={(value) => console.log('Aksiyon:', value)}
    />
  );
}`,
      previewProps: { size: "sm", appearance: "outline" },
      tags: ["aksiyon", "cubuk", "toplu-islem", "menubar"],
    },
    {
      id: "actionbar-selection-driven",
      title: "Secim Odakli Islemler",
      description: "Secili kayit sayisi rozetli toplu islem arabirimi.",
      category: "advanced",
      code: `import { MenuBar } from '@mfe/design-system';

export function Example() {
  return (
    <MenuBar
      size="sm"
      appearance="ghost"
      items={[
        { value: 'secim', label: '3 kayit secili', badge: '3', group: 'utility', emphasis: 'promoted' },
        { value: 'duzenle', label: 'Toplu Duzenle', group: 'primary' },
        { value: 'tasi', label: 'Tasi', group: 'primary' },
        { value: 'arsivle', label: 'Arsivle', group: 'secondary' },
        { value: 'sil', label: 'Sil', group: 'secondary', emphasis: 'subtle' },
      ]}
      onAction={(value) => console.log('Toplu islem:', value)}
    />
  );
}`,
      previewProps: { size: "sm", appearance: "ghost" },
      tags: ["aksiyon", "toplu", "secim", "rozet", "grup"],
    },
    {
      id: "actionbar-readonly",
      title: "Salt Okunur Mod",
      description: "Governance akisinda salt okunur aksiyon cubugu.",
      category: "patterns",
      code: `import { MenuBar } from '@mfe/design-system';

export function Example() {
  return (
    <MenuBar
      size="sm"
      appearance="outline"
      access="readonly"
      accessReason="Bu kayitlar uzerinde islem yetkiniz bulunmamaktadir"
      items={[
        { value: 'onayla', label: 'Onayla' },
        { value: 'reddet', label: 'Reddet' },
        { value: 'devret', label: 'Devret' },
      ]}
      onAction={() => {}}
    />
  );
}`,
      previewProps: { size: "sm", appearance: "outline", access: "readonly" },
      tags: ["aksiyon", "salt-okunur", "readonly", "governance"],
    },
  ],
  ApprovalReview: [
    {
      id: "approval-review-basic",
      title: "Temel Onay Inceleme",
      description: "Checkpoint, atif paneli ve denetim izlerini birlestiren temel inceleme gorunumu.",
      category: "basic",
      code: `import { ApprovalReview } from '@mfe/design-system';

export function Example() {
  return (
    <ApprovalReview
      title="Yayinlama Onayi"
      description="Insan checkpoint, kaynak kanit ve denetim izleri tek review altinda gorunur."
      checkpoint={{
        title: "Uretim ortamina yayinla",
        summary: "Son degisiklikler icin insan onayi gerekli.",
        status: "pending",
        steps: [
          { key: "1", label: "Kod inceleme", status: "approved" },
          { key: "2", label: "QA testi", status: "ready" },
        ],
      }}
      citations={[
        { id: "c1", title: "API Politikasi", excerpt: "Tum endpoint'ler rate-limit gerektirir.", source: "platform-policy.md", kind: "policy" },
        { id: "c2", title: "Test Raporu", excerpt: "176 testin tamami basarili.", source: "ci/test-report", kind: "doc" },
      ]}
      auditItems={[
        { id: "a1", actor: "ai", title: "Otomatik kod analizi", timestamp: "10:30", status: "executed" },
        { id: "a2", actor: "human", title: "Takim liderinden onay", timestamp: "11:15", status: "approved" },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["onay", "inceleme", "checkpoint", "atif", "denetim"],
    },
    {
      id: "approval-review-readonly",
      title: "Salt Okunur Inceleme",
      description: "Erisim kisitlama ile salt okunur modda inceleme paneli.",
      category: "patterns",
      code: `import { ApprovalReview } from '@mfe/design-system';

export function Example() {
  return (
    <ApprovalReview
      title="Arsiv Inceleme"
      description="Tamamlanmis onay sureci salt okunur olarak goruntulenir."
      access="readonly"
      accessReason="Bu kayit arsivlenmistir"
      checkpoint={{
        title: "Uretim yayini",
        summary: "Basariyla tamamlandi.",
        status: "approved",
      }}
      citations={[
        { id: "c1", title: "Yayin Notu", excerpt: "v2.4.1 basariyla yayinlandi.", source: "releases/v2.4.1", kind: "doc" },
      ]}
      auditItems={[
        { id: "a1", actor: "system", title: "Otomatik deploy", timestamp: "14:00", status: "executed" },
      ]}
    />
  );
}`,
      previewProps: { access: "readonly" },
      tags: ["onay", "salt-okunur", "arsiv", "readonly"],
    },
  ],
  ApprovalCheckpoint: [
    {
      id: "checkpoint-basic",
      title: "Temel Onay Noktasi",
      description: "Durum, adimlar ve aksiyonlarla temel kontrol noktasi.",
      category: "basic",
      code: `import { ApprovalCheckpoint } from '@mfe/design-system';

export function Example() {
  return (
    <ApprovalCheckpoint
      title="Uretim Yayini Onayi"
      summary="Son degisiklikler icin insan onayi gereklidir."
      status="pending"
      approverLabel="Platform Ekibi"
      dueLabel="15 Mart 2026"
      evidenceItems={["test-report.pdf", "coverage.html"]}
      steps={[
        { key: "1", label: "Kod inceleme tamamlandi", status: "approved" },
        { key: "2", label: "QA testi", status: "ready" },
        { key: "3", label: "Guvenlik taramasi", status: "todo" },
      ]}
      primaryActionLabel="Onayla"
      secondaryActionLabel="Inceleme Iste"
    />
  );
}`,
      previewProps: { status: "pending" },
      tags: ["onay", "kontrol-noktasi", "adim", "durum"],
    },
    {
      id: "checkpoint-approved",
      title: "Onaylanmis Durum",
      description: "Tum adimlar tamamlanmis onaylanmis kontrol noktasi.",
      category: "basic",
      code: `import { ApprovalCheckpoint } from '@mfe/design-system';

export function Example() {
  return (
    <ApprovalCheckpoint
      title="API Gateway Degisikligi"
      summary="Tum kontroller basariyla tamamlandi."
      status="approved"
      steps={[
        { key: "1", label: "Kod inceleme", status: "approved" },
        { key: "2", label: "Entegrasyon testi", status: "approved" },
      ]}
      citations={["RFC-2024-03", "SEC-AUDIT-44"]}
      footerNote="Onay: 15 Mart 2026, 14:30"
    />
  );
}`,
      previewProps: { status: "approved" },
      tags: ["onay", "onaylanmis", "tamamlanmis"],
    },
    {
      id: "checkpoint-blocked",
      title: "Engellenmi\u015f Durum",
      description: "Eksik adimlar nedeniyle engellenmis kontrol noktasi.",
      category: "advanced",
      code: `import { ApprovalCheckpoint } from '@mfe/design-system';

export function Example() {
  return (
    <ApprovalCheckpoint
      title="Hassas Veri Erisimi"
      summary="Guvenlik taramasi basarisiz oldu."
      status="blocked"
      steps={[
        { key: "1", label: "Guvenlik taramasi", status: "blocked", helper: "3 kritik bulgu" },
        { key: "2", label: "DPO onayi", status: "todo" },
      ]}
      primaryActionLabel="Tekrar Tara"
      secondaryActionLabel="Rapor Gor"
    />
  );
}`,
      previewProps: { status: "blocked" },
      tags: ["onay", "engellenmis", "guvenlik", "blocked"],
    },
  ],
  AIGuidedAuthoring: [
    {
      id: "ai-authoring-basic",
      title: "Temel AI Yazarlik",
      description: "Prompt, oneriler ve guven skoruyla temel AI yazarlik paneli.",
      category: "basic",
      code: `import { AIGuidedAuthoring } from '@mfe/design-system';

export function Example() {
  return (
    <AIGuidedAuthoring
      title="AI Destekli Icerik Olusturma"
      confidenceLevel="high"
      confidenceScore={87}
      sourceCount={12}
      promptComposerProps={{
        defaultSubject: "API dokumantasyonu",
        defaultValue: "Kullanici kimlik dogrulama endpoint'leri icin kapsamli dokumantasyon olustur.",
        defaultScope: "general",
        defaultTone: "neutral",
        guardrails: ["PII filtreleme", "Marka uyumu"],
      }}
      recommendations={[
        {
          id: "r1",
          title: "Ornek kod ekle",
          summary: "Her endpoint icin curl ornekleri eklenebilir.",
          confidenceLevel: "high",
          confidenceScore: 92,
          rationale: ["Kullanici geri bildirimi yuksek", "Benzer dokumanlarda basarili"],
        },
      ]}
    />
  );
}`,
      previewProps: { confidenceLevel: "high", confidenceScore: 87 },
      tags: ["ai", "yazarlik", "prompt", "oneri", "guven"],
    },
    {
      id: "ai-authoring-command-palette",
      title: "Komut Paleti ile Yazarlik",
      description: "Komut paleti entegrasyonu ile AI yazarlik akisi.",
      category: "advanced",
      code: `import { AIGuidedAuthoring } from '@mfe/design-system';

export function Example() {
  return (
    <AIGuidedAuthoring
      title="Politika Yazarlik Asistani"
      confidenceLevel="medium"
      confidenceScore={64}
      sourceCount={5}
      promptComposerProps={{
        defaultScope: "policy",
        defaultTone: "strict",
      }}
      commandItems={[
        { id: "cmd1", label: "Kaynak Ekle", description: "Mevcut kaynaktan referans al" },
        { id: "cmd2", label: "Ton Degistir", description: "Yazim tonunu ayarla" },
        { id: "cmd3", label: "Sablon Uygula", description: "Politika sablonu uygula" },
      ]}
      defaultPaletteOpen={false}
    />
  );
}`,
      previewProps: { confidenceLevel: "medium" },
      tags: ["ai", "komut-paleti", "politika", "command-palette"],
    },
  ],
  AIActionAuditTimeline: [
    {
      id: "audit-timeline-basic",
      title: "Temel Denetim Zaman Cizelgesi",
      description: "AI ve insan aksiyonlarini kronolojik olarak gosteren zaman cizelgesi.",
      category: "basic",
      code: `import { AIActionAuditTimeline } from '@mfe/design-system';

export function Example() {
  return (
    <AIActionAuditTimeline
      title="Islem Gecmisi"
      items={[
        { id: "1", actor: "ai", title: "Icerik taslagi olusturuldu", timestamp: "09:15", status: "drafted", summary: "AI modeli ilk taslagi hazirladi." },
        { id: "2", actor: "human", title: "Icerik incelendi", timestamp: "10:30", status: "approved", summary: "Editorden onay alindi." },
        { id: "3", actor: "system", title: "Yayinlama islemi baslatildi", timestamp: "11:00", status: "executed" },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["denetim", "zaman-cizelgesi", "ai", "audit", "timeline"],
    },
    {
      id: "audit-timeline-selected",
      title: "Secili Oge ile Zaman Cizelgesi",
      description: "Belirli bir denetim kaydinin secili oldugu gorunum.",
      category: "advanced",
      code: `import { AIActionAuditTimeline } from '@mfe/design-system';

export function Example() {
  return (
    <AIActionAuditTimeline
      title="Onay Sureci Izleri"
      selectedId="2"
      items={[
        { id: "1", actor: "ai", title: "Risk analizi tamamlandi", timestamp: "08:00", status: "executed" },
        { id: "2", actor: "human", title: "Manuel inceleme", timestamp: "09:30", status: "approved", summary: "Guvenlik ekibi onayladi." },
        { id: "3", actor: "ai", title: "Otomatik deploy", timestamp: "10:00", status: "observed" },
      ]}
      onSelectItem={(id) => console.log('Secilen:', id)}
    />
  );
}`,
      previewProps: { selectedId: "2" },
      tags: ["denetim", "secim", "detay", "izleme"],
    },
    {
      id: "audit-timeline-empty",
      title: "Bos Zaman Cizelgesi",
      description: "Henuz denetim kaydi bulunmayan bos durum gorunumu.",
      category: "basic",
      code: `import { AIActionAuditTimeline } from '@mfe/design-system';

export function Example() {
  return (
    <AIActionAuditTimeline
      title="Islem Gecmisi"
      items={[]}
      emptyStateLabel="Henuz islem kaydi bulunmuyor."
    />
  );
}`,
      previewProps: {},
      tags: ["denetim", "bos", "empty-state"],
    },
  ],
  PromptComposer: [
    {
      id: "prompt-composer-basic",
      title: "Temel Prompt Duzenleyici",
      description: "Kapsam, ton ve koruma kurallariyla prompt yazim paneli.",
      category: "basic",
      code: `import { PromptComposer } from '@mfe/design-system';

export function Example() {
  return (
    <PromptComposer
      title="Prompt Olusturucu"
      defaultSubject="Musteri destek sablonu"
      defaultValue="Musteri sikayet e-postalarina profesyonel ve empatik yanit taslagi olustur."
      defaultScope="general"
      defaultTone="neutral"
      guardrails={["PII koruma", "Marka tonu"]}
      citations={["destek-rehberi.md", "marka-kilavuzu.pdf"]}
    />
  );
}`,
      previewProps: { defaultScope: "general", defaultTone: "neutral" },
      tags: ["prompt", "duzenleyici", "kapsam", "ton"],
    },
    {
      id: "prompt-composer-policy",
      title: "Politika Kapsaminda Prompt",
      description: "Politika kapsaminda siki ton ile prompt yazimi.",
      category: "advanced",
      code: `import { PromptComposer } from '@mfe/design-system';

export function Example() {
  return (
    <PromptComposer
      title="Politika Prompt Yazici"
      defaultSubject="Veri saklama politikasi"
      defaultValue="KVKK uyumlu veri saklama politikasi taslagi hazirla."
      defaultScope="policy"
      defaultTone="strict"
      maxLength={2000}
      guardrails={["KVKK uyumu", "Veri siniflandirma", "Saklama suresi"]}
      citations={["kvkk-rehber.pdf", "veri-politikasi-v3.md"]}
      footerNote="Politika prompt'lari hukuk ekibi tarafindan incelenmelidir."
    />
  );
}`,
      previewProps: { defaultScope: "policy", defaultTone: "strict" },
      tags: ["prompt", "politika", "kvkk", "uyumluluk"],
    },
    {
      id: "prompt-composer-readonly",
      title: "Salt Okunur Prompt",
      description: "Onaylanmis prompt'un salt okunur gorunumu.",
      category: "patterns",
      code: `import { PromptComposer } from '@mfe/design-system';

export function Example() {
  return (
    <PromptComposer
      title="Onaylanmis Prompt"
      defaultSubject="Uretim talimat seti"
      defaultValue="Bu prompt onaylanmistir ve degistirilemez."
      access="readonly"
      accessReason="Bu prompt onay surecinden gecmistir"
      guardrails={["Degisiklik kilidi"]}
    />
  );
}`,
      previewProps: { access: "readonly" },
      tags: ["prompt", "salt-okunur", "onaylanmis", "readonly"],
    },
  ],
  RecommendationCard: [
    {
      id: "recommendation-basic",
      title: "Temel Oneri Karti",
      description: "Guven skoru, gerekce ve aksiyonlarla oneri karti.",
      category: "basic",
      code: `import { RecommendationCard } from '@mfe/design-system';

export function Example() {
  return (
    <RecommendationCard
      title="Onbellek Stratejisi Ekle"
      summary="API yanit surelerini %40 azaltmak icin Redis onbellek katmani onerilir."
      confidenceLevel="high"
      confidenceScore={91}
      sourceCount={8}
      rationale={[
        "Benzer sistemlerde %35-45 iyilesme gozlemlendi",
        "Mevcut altyapi Redis destekliyor",
        "Operasyonel maliyet dusuk",
      ]}
      citations={["perf-benchmark-2024.pdf", "infra-capacity.md"]}
      primaryActionLabel="Uygula"
      secondaryActionLabel="Incele"
    />
  );
}`,
      previewProps: { tone: "info", confidenceLevel: "high" },
      tags: ["oneri", "kart", "guven", "gerekce"],
    },
    {
      id: "recommendation-warning",
      title: "Uyari Tonunda Oneri",
      description: "Dikkat gerektiren bir oneri karti.",
      category: "advanced",
      code: `import { RecommendationCard } from '@mfe/design-system';

export function Example() {
  return (
    <RecommendationCard
      title="Bagimliligi Guncelle"
      summary="lodash@4.17.20 bilinen guvenlik acigi iceriyor."
      tone="warning"
      confidenceLevel="very-high"
      confidenceScore={98}
      sourceCount={3}
      rationale={[
        "CVE-2021-23337 prototype pollution acigi",
        "Guncelleme geriye uyumlu",
      ]}
      primaryActionLabel="Simdi Guncelle"
      secondaryActionLabel="Raporu Gor"
    />
  );
}`,
      previewProps: { tone: "warning", confidenceLevel: "very-high" },
      tags: ["oneri", "uyari", "guvenlik", "bagimllik"],
    },
    {
      id: "recommendation-compact",
      title: "Kompakt Oneri Karti",
      description: "Dar alanlarda kullanilabilecek kompakt oneri gorunumu.",
      category: "layout",
      code: `import { RecommendationCard } from '@mfe/design-system';

export function Example() {
  return (
    <RecommendationCard
      title="Index Onerisi"
      summary="users tablosuna email kolonu icin index ekleyin."
      tone="success"
      confidenceLevel="medium"
      confidenceScore={72}
      compact
    />
  );
}`,
      previewProps: { tone: "success", compact: true },
      tags: ["oneri", "kompakt", "minimal"],
    },
  ],
  ConfidenceBadge: [
    {
      id: "confidence-basic",
      title: "Temel Guven Rozeti",
      description: "Farkli guven seviyelerini gosteren rozetler.",
      category: "basic",
      code: `import { ConfidenceBadge } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-wrap gap-3">
      <ConfidenceBadge level="low" score={25} sourceCount={2} />
      <ConfidenceBadge level="medium" score={58} sourceCount={5} />
      <ConfidenceBadge level="high" score={87} sourceCount={12} />
      <ConfidenceBadge level="very-high" score={96} sourceCount={20} />
    </div>
  );
}`,
      previewProps: { level: "medium", score: 58 },
      multiVariantAxis: "level",
      tags: ["guven", "rozet", "seviye", "skor"],
    },
    {
      id: "confidence-compact",
      title: "Kompakt Guven Rozeti",
      description: "Kaynak sayisi gizlenmis kompakt gorunum.",
      category: "layout",
      code: `import { ConfidenceBadge } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-wrap gap-3">
      <ConfidenceBadge level="high" score={89} compact />
      <ConfidenceBadge level="medium" score={55} compact />
    </div>
  );
}`,
      previewProps: { level: "high", score: 89, compact: true },
      tags: ["guven", "kompakt", "rozet"],
    },
    {
      id: "confidence-custom-label",
      title: "Ozel Etiketli Rozet",
      description: "Ozel etiket ile guven rozeti kullanimi.",
      category: "advanced",
      code: `import { ConfidenceBadge } from '@mfe/design-system';

export function Example() {
  return (
    <ConfidenceBadge
      level="high"
      score={94}
      sourceCount={15}
      label="Model Dogrulugu"
    />
  );
}`,
      previewProps: { level: "high", score: 94, label: "Model Dogrulugu" },
      tags: ["guven", "ozel-etiket", "model"],
    },
  ],
  CitationPanel: [
    {
      id: "citation-panel-basic",
      title: "Temel Atif Paneli",
      description: "Farkli kaynak turlerini gosteren atif paneli.",
      category: "basic",
      code: `import { CitationPanel } from '@mfe/design-system';

export function Example() {
  return (
    <CitationPanel
      title="Kaynaklar"
      items={[
        { id: "c1", title: "Platform Politikasi", excerpt: "Tum API endpoint'leri rate-limit ile korunmalidir.", source: "platform-policy.md", kind: "policy" },
        { id: "c2", title: "Servis Kodu", excerpt: "RateLimiter middleware her route'a eklenmistir.", source: "src/middleware/rate-limiter.ts", kind: "code", locator: "satir 42-58" },
        { id: "c3", title: "Erisim Logu", excerpt: "Son 24 saatte 3 rate-limit ihlali tespit edildi.", source: "logs/access-2026-03.log", kind: "log" },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["atif", "kaynak", "panel", "politika", "kod"],
    },
    {
      id: "citation-panel-interactive",
      title: "Etkilesimli Atif Paneli",
      description: "Atif secimi ve aktif durum yonetimiyle etkilesimli panel.",
      category: "advanced",
      code: `import { CitationPanel } from '@mfe/design-system';

export function Example() {
  return (
    <CitationPanel
      title="Kanit Seti"
      activeCitationId="c2"
      onOpenCitation={(id, item) => console.log('Atif secildi:', id)}
      items={[
        { id: "c1", title: "Tasarim Dokumani", excerpt: "Komponent hiyerarsisi ve veri akisi.", source: "design-spec.md", kind: "doc" },
        { id: "c2", title: "Test Verisi", excerpt: "Model egitim seti icin kullanilan veri kumesi.", source: "datasets/training-v3", kind: "dataset" },
        { id: "c3", title: "Uyumluluk Raporu", excerpt: "KVKK madde 12 gereklilikleri karsilanmistir.", source: "compliance/kvkk-report.pdf", kind: "policy" },
      ]}
    />
  );
}`,
      previewProps: { activeCitationId: "c2" },
      tags: ["atif", "etkilesim", "secim", "aktif"],
    },
    {
      id: "citation-panel-empty",
      title: "Bos Atif Paneli",
      description: "Henuz kaynak eklenmemis bos durum gorunumu.",
      category: "basic",
      code: `import { CitationPanel } from '@mfe/design-system';

export function Example() {
  return (
    <CitationPanel
      title="Kaynaklar"
      items={[]}
      emptyStateLabel="Henuz kaynak eklenmedi."
    />
  );
}`,
      previewProps: {},
      tags: ["atif", "bos", "empty-state"],
    },
  ],};
