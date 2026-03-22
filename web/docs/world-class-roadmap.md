# World-Class Design System Platform — Liderlik Yol Haritasi

> Son guncelleme: 2026-03-22
> Hedef: Entegre enterprise frontend platformu olarak kategori liderligine cikmak
> Seviye: 8.5/10 → Hedef: 9.5/10 (180 gun)

---

## GERCEK ENVANTER (canlı repo sayımı)

| Alan | Durum | Detay |
|------|-------|-------|
| Components | ✅ Güçlü | 232 exported, 211 doc entry |
| Tests | ✅ Güçlü | 5,910 pass, verify EXIT 0 |
| X-Suite | ✅ Güçlü | 6 paket, 414 test, build green |
| Storybook | ✅ Var | .storybook/ config + 128 story |
| Playwright | ✅ Var | 18 spec, CI'da koşuyor |
| axe-core | ✅ Var | @axe-core/cli + @axe-core/playwright |
| Chromatic | ✅ Var | Workflow mevcut, CI'da |
| size-limit | ✅ Var | Config + script |
| Tiptap | ✅ Var | @tiptap/react + starter-kit |
| @dnd-kit | ✅ Var | core + sortable |
| Design tokens | ✅ Var | figma.tokens.json + build output |
| Perf benchmarks | ✅ Var | 33 dosya, benchmark-gate workflow |
| A11y tests | ✅ Var | 10+ dosya, axe entegrasyonu |
| Docs portal | ✅ Var | 27+ sayfa Nextra |
| create-app CLI | ✅ Var | 24 test |
| Security CI | ✅ Var | CodeQL + gitleaks + Trivy + SBOM |
| Release automation | ✅ Var | release-please + workflow |
| Quality cockpit | ✅ Var | Command Center + SLO + security |

### GERÇEK GAP'LER (capability yok değil, maturity eksik)

| Alan | Var | Gerçek Gap | Öncelik |
|------|-----|-----------|---------|
| Storybook | 128 story | Story governance + coverage quality | P1 |
| Chromatic | Workflow var | Sonuç ingestion + approval cockpit yok | P0 |
| Playwright | 18 spec | Live artifact normalization + flaky classifier yok | P1 |
| axe-core | Installed | Screen reader evidence + e2e a11y gate eksik | P1 |
| size-limit | Config var | Per-package hard budget + CI blocker değil | P1 |
| Tokens | JSON var | Formal DTCG contract + Style Dictionary pipeline yok | P0 |
| Figma sync | Drift panel var | Live sync + real diff + Code Connect yok | P0 |
| Editor | Tiptap path var | Canonical install + plugin/collab productization yok | P1 |
| Kanban | dnd-kit path var | Swimlane + touch + keyboard parity yok | P2 |
| Benchmarks | Workflow var | Threshold registry + hard regression blocker yok | P1 |
| Security | CI var | Live posture + incident evidence cockpit yok | P1 |
| AI | Başlangıç var | Grounded assistant + codegen sandbox yok | P2 |
| Design drift | Derived sinyal var | Live sync + real diff + owner workflow yok | P1 |
| Governance | Docs var | RBAC + audit trail + approvals yok | P1 |
| Impact graph | whereUsed var | Blast-radius + migration impact yok | P2 |

---

## 8 WAVE PROGRAM (180 GÜN)

### WAVE 1 — Truth Plane (0-15 gün)
> Amaç: Design Lab'de görünen her kartın arkasında gerçek artefact olsun

| # | İş | Done Criteria | KPI |
|---|-----|---------------|-----|
| 1.1 | Evidence registry (tek JSON truth) | CI artefaktları toplanır | Coverage > %80 |
| 1.2 | Chromatic sonuç ingestion | Visual diff DL'de görünür | Live panels = 5 |
| 1.3 | Security posture live outcomes | CodeQL/Trivy/gitleaks job sonucu akar | Live checks = 5 |
| 1.4 | Benchmark artefakt ingestion | PR/release bazlı sonuç görünür | Benchmark = live |
| 1.5 | Provenance zorunlu kural | Her panel Live/Derived/NoData | Simüle = 0 |

### WAVE 2 — Token Platform + Design Sync (15-30 gün)
> Amaç: Token pipeline ve Figma köprüsünü kurmak

| # | İş | Done Criteria | KPI |
|---|-----|---------------|-----|
| 2.1 | Style Dictionary v4 pipeline | DTCG → CSS/SCSS/Tailwind output | Platform = 4 |
| 2.2 | Figma Code Connect | Figma Dev Mode'da kod örnekleri | Connected > %80 |
| 2.3 | Figma Variables API sync script | Token değişikliği PR'a akar | Drift = 0 |
| 2.4 | Token lint (DTCG schema validation) | Geçersiz token PR fail | Token error = 0 |
| 2.5 | Design drift detection | Live drift alert üretilir | Undetected = 0 |

### WAVE 3 — Quality Gates Sertleştirme (30-45 gün)
> Amaç: Tüm gate'leri soft'tan hard blocker'a çevirmek

| # | İş | Done Criteria | KPI |
|---|-----|---------------|-----|
| 3.1 | size-limit per-package CI hard gate | Limit aşan PR fail olur | Regression = 0 |
| 3.2 | Benchmark threshold enforcement | Perf regresyon PR'ı kapatır | Hard gate = aktif |
| 3.3 | Visual regression approval flow | CSS yan etki yakalanır + onay | Catch > 0 |
| 3.4 | A11y e2e gate | axe + Playwright a11y spec blocker | Critical = 0 |
| 3.5 | Quiet-green | 0 recurring CI warning | Warning = 0 |
| 3.6 | Component API lint rules | size/className/aria zorunlu | Violation = 0 |

### WAVE 4 — Engine Productization (30-60 gün)
> Amaç: Tiptap ve dnd-kit path'lerini ürün seviyesine çıkarmak

| # | İş | Done Criteria | KPI |
|---|-----|---------------|-----|
| 4.1 | Tiptap canonical install + 10 extension | Plugin ecosystem aktif | Engine = Tiptap |
| 4.2 | dnd-kit swimlane + touch + keyboard | Full DnD parity | Keyboard a11y = ✅ |
| 4.3 | Editor collab strategy | Real-time seçenek belirlendi | Strategy = documented |
| 4.4 | HTML5 DnD fallback cleanup | Tek engine path | Fallback = removed |

### WAVE 5 — Governance Plane (60-90 gün)
> Amaç: Katalogdan policy cockpit'e geçiş

| # | İş | Done Criteria | KPI |
|---|-----|---------------|-----|
| 5.1 | RBAC | Rol bazlı görünüm | Role coverage = %100 |
| 5.2 | Audit trail | Kim neyi ne zaman değiştirdi | Audit = aktif |
| 5.3 | Approval workflow | Deprecation/exception onay | Approvals = izlenebilir |
| 5.4 | Owner/on-call assignment | Her component'in owner'ı var | Coverage > %90 |
| 5.5 | Exception management | Quality override kayıtları | Exceptions = logged |

### WAVE 6 — Observability + Resilience (60-90 gün)
> Amaç: Hata ve yavaşlığı müşteriden önce görmek

| # | İş | Done Criteria | KPI |
|---|-----|---------------|-----|
| 6.1 | Web Vitals RUM dashboard | LCP/FID/CLS/INP canlı | MTTD < 10dk |
| 6.2 | Synthetic monitoring | 5 kritik akış × 5dk | Pass > %99 |
| 6.3 | OpenTelemetry bridge | Trace correlation | Correlation > %90 |
| 6.4 | MF resilience test suite | Remote down/timeout degrade | Resilience = %100 |
| 6.5 | Browser compat matrix CI | React 18/19 × Node 20/22 × Next 14/15 | Matrix = green |
| 6.6 | Flaky test classifier | Kararsız testler işaretli | Flaky rate < %1 |

### WAVE 7 — Impact Intelligence + AI (90-120 gün)
> Amaç: Değişikliğin etkisini otomatik görmek + AI üretim katmanı

| # | İş | Done Criteria | KPI |
|---|-----|---------------|-----|
| 7.1 | Blast-radius graph | Etki anında görünür | Coverage = %100 |
| 7.2 | Migration impact score | Risk skoru otomatik | Accuracy > %80 |
| 7.3 | Consumer heatmap | Tüketici uyumluluk | Heatmap = aktif |
| 7.4 | AI grounded assistant | Gerçek docs üzerinden cevap | Acceptance > %60 |
| 7.5 | Codegen sandbox | Üretilen kod test edilir | Compile > %95 |
| 7.6 | MCP export surface | Machine-readable catalog | MCP = aktif |

### WAVE 8 — Leadership Proof (120-180 gün)
> Amaç: Kanıtlamak

| # | İş | Done Criteria | KPI |
|---|-----|---------------|-----|
| 8.1 | Reproducible benchmark suite | Her release'te artefakt | Benchmark = versiyonlu |
| 8.2 | Reference apps (3 demo) | Canlı deploy | First-value < 10dk |
| 8.3 | Certified compat matrix | Her release CI | Pass = %100 |
| 8.4 | Public quality badges | shields.io + README | Uptime > %99 |
| 8.5 | Secure viewer portal | SSO/password/share | Portal = aktif |
| 8.6 | Analytics + search feedback | Kullanım ölçülür | Analytics = aktif |
| 8.7 | Release/incident dashboard | Operasyonel | Dashboard = aktif |
| 8.8 | ROI calculator | Evidence-backed değer | ROI = ölçülür |

---

## EKLENECEK ARAÇLAR

| Araç | Amaç | Wave | Öncelik |
|------|------|------|---------|
| Style Dictionary v4 | Token pipeline | Wave 2 | P0 |
| Figma Code Connect | Design ↔ code | Wave 2 | P0 |
| Evidence collector | CI → tek JSON | Wave 1 | P0 |
| Chromatic TurboSnap | Visual regression ingestion | Wave 1 | P0 |
| OpenTelemetry | Trace correlation | Wave 6 | P1 |
| Code search index | Consumer graph | Wave 7 | P1 |
| Synthetic monitor | Prod smoke | Wave 6 | P1 |
| Codegen sandbox | İzole derleme/test | Wave 7 | P2 |
| MCP server | AI-readable catalog | Wave 7 | P2 |

## ZATENVARmevcut olan ve EKLENMEMESİ GEREKEN ŞEYLER

| Zaten Var | Ekleme |
|-----------|--------|
| Storybook 10 (.storybook/ + 128 story) | İkinci docs platformu |
| Playwright (18 spec + CI) | İkinci visual test stack |
| axe-core (cli + playwright) | İkinci error monitor |
| Tiptap (@tiptap/react) | İkinci editor engine |
| @dnd-kit (core + sortable) | İkinci DnD library |
| Sentry (bootstrap'a bağlı) | — |
| Chromatic workflow | — |
| size-limit config | — |
| CodeQL + gitleaks + Trivy | — |
| release-please | — |

---

## RAKIP KARSILASTIRMA (düzeltilmiş)

| Alan | AG Grid | MUI X | Tiptap | FullCal | Knapsack | Supernova | Biz Şimdi | Biz Hedef |
|------|---------|-------|--------|---------|----------|-----------|-----------|-----------|
| Grid | 10 | 9 | - | - | - | - | 8 | 9 |
| Charts | 8 | 8 | - | - | - | - | 7 | 8 |
| Editor | - | - | 10 | - | - | - | 6 | 8 |
| Scheduler | - | 6 | - | 10 | - | - | 6 | 8 |
| Token pipeline | - | 9 | - | - | 8 | 9 | 5 | 9 |
| Figma sync | - | - | - | - | 8 | 9 | 4 | 8 |
| Quality gates | 7 | 9 | 7 | 6 | 7 | 7 | 7 | 9 |
| Governance | - | - | - | - | 9 | 8 | 5 | 9 |
| AI/MCP | - | 8 | - | - | 8 | 9 | 4 | 8 |
| Trust ops | - | 9 | - | - | 8 | 8 | 7 | 9 |
| Story testing | 9 | 8 | - | - | 7 | 6 | 6 | 9 |
| Visual regression | 7 | 8 | - | - | 7 | 7 | 5 | 9 |
| **Entegre platform** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **8** | **10** |

> **Hiçbir rakip Grid+Charts+Scheduler+Kanban+Editor+FormBuilder+Docs+CLI'ı tek platformda sunmuyor.**

---

## BAŞARI METRİKLERİ

| Metrik | Şimdi | 30 gün | 60 gün | 90 gün | 180 gün |
|--------|-------|--------|--------|--------|---------|
| Story coverage | 128 | 150 | 200 | 232 | 232+ |
| A11y gate | axe installed | hard blocker | e2e | SR evidence | certified |
| Token platforms | 1 (TS+JSON) | 4 (CSS+SCSS+TW+TS) | + Figma sync | + drift detect | drift=0 |
| Visual regression | workflow var | ingestion | TurboSnap | approval flow | full |
| Bundle gate | passive | hard blocker | per-package | trend | regression=0 |
| Figma sync | panel var | Code Connect | Variables API | auto-PR | drift=0 |
| Evidence panels | 2 live | 5 live | 8 live | 12 live | all live |
| Governance | docs | RBAC | audit trail | approvals | full ops |
| AI assistant | başlangıç | grounded | source-linked | codegen | MCP |
| First-value time | ? | 30dk | 20dk | 15dk | 10dk |
| verify:release | EXIT 0 | +visual | +bench hard | +compat | all gates |
| Simüle panel | ~3 | 0 | 0 | 0 | 0 |
