# SPEC-0014: Platform Capabilities Catalog v1.1

ID: SPEC-0014  
Status: Draft  
Owner: TBD

## 0) Amaç

Birden fazla domain’in (Ethics, Nonconformity/NC, Incident vb.) tekrar eden ihtiyaçlarını **ortak yetenekler (capabilities)** üzerinden karşılamak.

Hedef:
- “Her modül kendi mail’ini / SLA’sını / audit’ini yazmasın.”
- “Erken soyutlama” yüzünden sistemin gereksiz karmaşıklaşması engellensin.

Bu doküman:
- business + kontrat seviyesinde SSOT’tur (kod içermez),
- delivery-level SPEC’lerde “Platform Dependencies” bölümüne referans edilir,
- Trace Pack içinde `TARGET_TYPE=PLATFORM_SPEC` hedefi olarak kullanılabilir.

## 1) Extraction Kuralı (Shared Capability First)

Bir ihtiyacın capability olarak çıkarılması için:
1) En az 2 domain tarafından kullanılacağı makul şekilde öngörülür.
2) Domain bağımsız **stabil bir sözleşme** (inputs/outputs + policy knobs) tanımlanabilir.
3) Bağımlılık yönü doğru olur: domain → capability (capability domain’i bilmez).

Kriterler sağlanmıyorsa:
- önce domain içinde başlat,
- ikinci domain ihtiyacı netleşince capability’ye çıkar.

## 2) Capability Sözleşme Şablonu (Zorunlu)

Aşağıdaki alt başlıklar her capability için doldurulur:

- Amaç
- Kapsam (in scope)
- Kapsam Dışı (out of scope)
- Sözleşme (domain-agnostic):
  - Inputs (hangi olay/komutla çağrılır)
  - Outputs (hangi artefact/sonuç üretir)
  - Idempotency / retry sınırları (business seviyede)
- Policy Knobs (parametreler): domain varyantları bu knobs üzerinden yapılır
- Veri Sınıfları & Gizlilik
- Audit & Telemetry (minimum): “ne loglanır / kim loglanır / ne ölçülür”
- Failure Modes (Top 5)
- Anti-patterns (yapılmaması gerekenler)
- Domain Varyantları (en az Ethics + 1 aday): knobs → domain eşlemesi

## 3) Capabilities

### 3.1 Notification & Communications

#### Amaç

Kullanıcı/rol bazlı bildirimleri tek noktadan yönetmek (email/SMS/Teams/portal inbox) ve teslimat durumunu izlenebilir kılmak.

#### Kapsam (In Scope)

- Kanal seçimi (policy ile).
- Mesaj şablonları (template key + payload) ve içerik standardı.
- Teslim durumları: delivered/failed/pending.
- Rate limit / retry / idempotency beklentileri.
- Redaksiyon ve anonimlik policy hook’ları.

#### Kapsam Dışı (Out of Scope)

- Domain iş akışının kararlarını vermek (kime, ne zaman, hangi koşulda bildirim atılacağı domain policy’dir).
- PII/anonimlik ihlali yaratacak “serbest metin” üretimi.

#### Sözleşme (domain-agnostic)

- Inputs:
  - “Notify request” (event/command): hedef kitle (rol/kişi/grup), template key, payload, policy context, correlation id, actor context.
- Outputs:
  - Delivery record + correlation id + delivery status (en az: accepted/sent/failed).
- Idempotency / retry:
  - Aynı correlation/idempotency anahtarı ile tekrar çağrılar NOOP veya aynı record’a bağlanır.
  - Retry/backoff policy ile sınırlıdır; “sonsuz retry” yoktur.

#### Policy Knobs

- Kanal allowlist (mesaj tipi → izinli kanallar).
- Anonimlik modu (reporter kimliği açığa çıkmaz).
- İçerik maskeleme/redaksiyon seviyesi (PII).
- Template allowlist (hangi domain hangi template’leri kullanabilir).

#### Veri Sınıfları & Gizlilik

- Reporter kimliği/PII: yalnız policy izin veriyorsa mesaj içine girer; aksi durumda maskeleme zorunlu.
- Anonim vakalarda: “case mailbox” üzerinden güvenli iletişim tercih edilir.

#### Audit & Telemetry (Minimum)

- Log (minimum alanlar): actor_id, target (user/role), template_key, case_id (varsa), correlation_id, channel, status.
- Metric (minimum):
  - notification_sent_count (kanal bazlı)
  - notification_failed_count (kanal bazlı)
  - template_usage_count (template bazlı)

#### Failure Modes (Top 5)

- Yanlış kişiye mesaj → policy/role check + allowlist.
- Mesaj içeriğinde PII sızıntısı → redaksiyon policy.
- Rate limit ihlali → throttle + backoff.
- Kanal down → retry + fallback (policy ile).
- Spam davranışı → quota/throttle (policy ile).

#### Anti-patterns

- Domain’in kendi SMTP/Email/SMS kodunu yazması.
- Şablonsuz serbest metinle iletişim.

#### Domain Varyantları (Ethics / NC / Incident)

- Ethics: case mailbox + anonimlik koruması; içerik maskeleme yüksek.
- NC: görev atama/hatırlatma; içerik maskeleme orta.
- Incident: kritik escalation; kanal allowlist daha agresif (on-call).

---

### 3.2 Case / Work Item Engine

#### Amaç

Olay/vaka/uygunsuzluk gibi “iş nesnelerinin” yaşam döngüsünü ortak yönetmek (state machine + assignment + timeline).

#### Kapsam (In Scope)

- Durum makinesi (state machine).
- Atama (owner/assignee) ve reassignment.
- Görevler (tasks) ve timeline (event list).
- Basit escalation hook (SLA breach veya risk sinyali ile tetiklenebilir).
- Visibility boundary (need-to-know) için policy bağlamı.

#### Kapsam Dışı (Out of Scope)

- Domain’e özgü “karar verme” (etik kurul kararı, yaptırım kararı vb.).
- Delil saklama (Evidence capability).

#### Sözleşme (domain-agnostic)

- Inputs:
  - Create/update/transition isteği + policy context + actor context + correlation id.
- Outputs:
  - Entity snapshot + state transition record + audit hook.
- Idempotency / retry:
  - Create çağrıları idempotent olmalıdır (duplicate case yaratmamalı).
  - Transition duplicate’leri güvenli şekilde NOOP’a düşmelidir.

#### Policy Knobs

- Case type (ethics/NC/incident).
- Allowed transitions (state machine policy).
- Visibility policy (need-to-know).
- Assignment policy (kim atanabilir, COI/role kısıtları).

#### Veri Sınıfları & Gizlilik

- Case metadata: orta hassas (tarih, tip, durum).
- Case narrative: yüksek hassas (özellikle ethics/ihbar içerikleri).

#### Audit & Telemetry (Minimum)

- Log (minimum): actor_id, case_id, action (create/update/transition), from_state/to_state, correlation_id.
- Metric (minimum):
  - case_created_count (case type bazlı)
  - case_transition_count (transition bazlı)
  - time_in_state_seconds (p50/p95) (state bazlı)

#### Failure Modes (Top 5)

- Yetkisiz transition → policy block.
- Yanlış/COI atama → COI engine + assignment policy.
- Visibility leak → need-to-know policy enforcement.
- “Stuck” backlog → SLA integration + escalation hook.
- Duplicate case → idempotency key + dedup policy.

#### Anti-patterns

- Her domain’in kendi state engine’ini yazması.
- “Transition serbest, sonra düzeltiriz” yaklaşımı.

#### Domain Varyantları (Ethics / NC / Incident)

- Ethics: confidentiality boundary + COI wall zorunlu.
- NC: CAPA aksiyonları ve due date odaklı state seti.
- Incident: severity tabanlı state ve escalation.

---

### 3.3 SLA & Calendar

#### Amaç

SLA hesaplamasını (iş günü/tatil/timezone) ve breach/escalation tetikleyicilerini ortaklaştırmak.

#### Kapsam (In Scope)

- Takvim semantiği: business day / holiday / timezone.
- SLA hedefleri ve breach hesaplama.
- Breach → escalation trigger (policy).

#### Kapsam Dışı (Out of Scope)

- Domain kararlarını otomatik almak (insan onayı bypass edilmez).
- Takvim yönetim altyapısının detay implementasyonu.

#### Sözleşme (domain-agnostic)

- Inputs:
  - case_id + SLA policy key + start/end event tanımları + timezone + severity/risk sinyali.
- Outputs:
  - breach status + escalation event (gerekirse) + SLA metric record.
- Idempotency / retry:
  - Aynı input kombinasyonu için deterministik sonuç; yeniden hesaplama yan etkisiz olmalıdır.

#### Policy Knobs

- Holiday calendar seti (ülke/lokasyon).
- Severity/risk bazlı SLA hedefleri.
- Escalation chain ve throttle (kaç kez, hangi aralıklarla).

#### Veri Sınıfları & Gizlilik

- SLA verisi çoğunlukla düşük/orta hassas (zaman ve durum).
- Case type’a göre bazı SLA event’leri hassas olabilir (ethics).

#### Audit & Telemetry (Minimum)

- Log: case_id, policy_key, start/end event, breach true/false, escalation triggered.
- Metric:
  - sla_breached_count
  - escalation_count
  - time_to_triage_seconds / time_to_close_seconds (p50/p95)

#### Failure Modes (Top 5)

- Yanlış takvim/timezone → calendar policy mismatch.
- Breach hesaplama drift → ADR ile semantik sabitlenmeli.
- Escalation spam → throttle + backoff.
- Missing start/end event → degraded mode (explicit) + rapor.
- SLA policy bulunamadı → fail-fast veya default policy (explicit).

#### Anti-patterns

- Her modülün “iş günü” hesabını ayrı yazması.
- SLA’yı “best-effort” bırakıp breach’i raporlamamak.

#### Domain Varyantları (Ethics / NC / Incident)

- Ethics: ack/feedback ve komite SLA’ları.
- NC: düzeltici faaliyet due date ve takip.
- Incident: severity bazlı kısa SLA + on-call escalation.

---

### 3.4 Audit Trail & View Log

#### Amaç

“Kim ne yaptı” ve özellikle “kim neyi gördü” denetlenebilirliğini ortaklaştırmak.

#### Kapsam (In Scope)

- Write audit: create/update/transition ve kritik değişiklikler.
- View log: kim neyi görüntüledi (entity/view action).
- Append-only / immutability beklentisi (business policy).
- Retention/export beklentileri için hooks.

#### Kapsam Dışı (Out of Scope)

- Delil saklama (Evidence capability).
- Domain’e özel “şüpheli davranış” karar verme (yalnız signal üretir).

#### Sözleşme (domain-agnostic)

- Inputs:
  - audit event ve view event (actor, target entity, action, timestamp, correlation id).
- Outputs:
  - immutable log record + query/export hook.
- Idempotency / retry:
  - Event ingestion idempotent olmalı (duplicate event “same record”).

#### Policy Knobs

- Hangi entity’ler için view log zorunlu.
- Saklama süresi (retention) ve export policy.
- Hassas entity’lerde detay seviyesi (masking).

#### Veri Sınıfları & Gizlilik

- View log verisi yüksek hassas olabilir (kim, neyi gördü).
- Log erişimi strict RBAC ile korunur.

#### Audit & Telemetry (Minimum)

- Metric:
  - audit_event_count
  - view_event_count
  - export_job_count
- Signal-only:
  - suspicious_view_pattern_count (heuristic; karar değil).

#### Failure Modes (Top 5)

- View log eksikliği → uyum riski.
- Log erişim sızıntısı → strict RBAC.
- Log büyümesi → retention policy yoksa maliyet/performans riski.
- Export yanlış scope → permission-aware export şart.
- Event ordering drift → correlation + timestamp standardı.

#### Anti-patterns

- Kritik domain’lerde view log tutmamak.
- “Audit sadece değişiklikte lazım” diyerek view’u loglamamak.

#### Domain Varyantları (Ethics / NC / Incident)

- Ethics: view log zorunlu; detay seviyesi daha sıkı.
- NC: değişiklik ve export odaklı audit.
- Incident: yüksek hacimli eventlerde sampling policy gerekebilir.

---

### 3.5 Evidence / Attachment

#### Amaç

Ek/delil yönetimini ortaklaştırmak: versioning, immutability beklentisi, erişim logu, retention/legal hold.

#### Kapsam (In Scope)

- Attachment metadata + versioning.
- “Silinmez; yeni sürüm eklenir” beklentisi (business policy).
- Access logging entegrasyonu (view/change).
- Retention / legal hold policy hook.

#### Kapsam Dışı (Out of Scope)

- Dosya depolama teknolojisi seçimi (storage implementation).
- Domain’e özel “delil geçerliliği” kararı.

#### Sözleşme (domain-agnostic)

- Inputs:
  - attachment add (case_id + file metadata + classification + actor + correlation id).
  - attachment new version (previous_version_ref + reason).
- Outputs:
  - attachment record + version chain + audit hook.
- Idempotency / retry:
  - Aynı upload/version isteği duplicate yaratmamalı (idempotency key).

#### Policy Knobs

- Retention / legal hold.
- File type allowlist + size limits.
- Visibility boundary (need-to-know).
- Immutability mode (soft expectation vs strict WORM policy).

#### Veri Sınıfları & Gizlilik

- Attachment içerikleri yüksek hassas olabilir (PII/özel nitelikli).
- “Preview” gibi view aksiyonları view log’a düşer.

#### Audit & Telemetry (Minimum)

- Metric:
  - attachment_added_count
  - attachment_version_count
  - attachment_download_count
- Log: actor_id, case_id, attachment_id, version_id, action, classification.

#### Failure Modes (Top 5)

- Silinebilir delil → chain-of-custody kırılır.
- Yanlış görünürlük → data leak.
- Retention yanlış → uyum riski.
- Zararlı dosya → file allowlist + scanning (policy hook).
- Büyük dosya/performans → size limits + async upload (pattern).

#### Anti-patterns

- DB içine büyük ek gömmek.
- Delili “sil-geç” yapmak.

#### Domain Varyantları (Ethics / NC / Incident)

- Ethics: strict immutability expectation + view log zorunlu.
- NC: foto/doküman ekleri; retention daha standart.
- Incident: log/artifact ekleri; yüksek hacimde async pattern.

---

### 3.6 COI Engine

#### Amaç

Çıkar çatışması sinyallerini tespit edip erişim duvarı (access wall) ve bağımsız yeniden atamayı işletmek.

#### Kapsam (In Scope)

- COI signal sources (policy ile seçilir).
- Access wall trigger (COI varsa erişim engeli).
- Reassignment trigger (bağımsız atama).
- Override prosedürü (gerekçeli, loglu).

#### Kapsam Dışı (Out of Scope)

- Domain’in “etik değerlendirme” kararları.
- İnsan süreçlerini yok saymak (override insan onayı gerektirir).

#### Sözleşme (domain-agnostic)

- Inputs:
  - case_id + candidate_actor + COI policy key + context.
- Outputs:
  - COI status (pass/fail/unknown) + enforcement action (deny/reassign/require-override) + audit hook.
- Idempotency / retry:
  - Aynı input için deterministik sonuç; enforcement aksiyonu idempotent olmalı.

#### Policy Knobs

- COI sinyal seti ve eşikler.
- Override prosedürü (kim, hangi gerekçeyle).
- Reassignment strategy (pool/role-based).

#### Veri Sınıfları & Gizlilik

- COI sinyalleri (organizasyon ilişkileri) hassas olabilir.
- COI log’ları erişim kontrollü tutulur.

#### Audit & Telemetry (Minimum)

- Metric:
  - coi_detected_count
  - coi_denied_count
  - coi_override_count
- Log: case_id, actor_id, decision (deny/allow/override), reason_code, correlation_id.

#### Failure Modes (Top 5)

- False positive → override prosedürü + tuning.
- False negative → sinyal coverage eksikliği.
- Override abuse → audit + limit.
- Reassignment dead-end → pool policy yoksa blok.
- COI check bypass → enforcement hook zorunlu.

#### Anti-patterns

- COI’yi “manuel kontrol”e bırakmak.
- Override’u logsuz/gerekçesiz yapmak.

#### Domain Varyantları (Ethics / NC / Incident)

- Ethics: en sıkı COI; erişim duvarı default.
- NC: belirli rollerde COI zorunlu.
- Incident: hızlı atama baskısı → override prosedürü daha net olmalı.

---

### 3.7 Search & Reporting

#### Amaç

Filtreleme, export ve dashboard KPI üretimini ortaklaştırmak; permission-aware raporlama standardı sağlamak.

#### Kapsam (In Scope)

- Server-side filtering contract (minimum filtreler + paging).
- Export job pattern (async export + audit).
- KPI registry (minimum) ve rapor çıktıları.
- Permission-aware search/reporting (need-to-know).

#### Kapsam Dışı (Out of Scope)

- Her domain’in UI rapor ekranları (UX).
- Ad-hoc SQL raporlaması (data ekibi süreci ayrı olabilir).

#### Sözleşme (domain-agnostic)

- Inputs:
  - query request (filters + paging + actor context + policy context).
  - export request (query + export format + scope).
- Outputs:
  - result set + export artifact reference + audit hook.
- Idempotency / retry:
  - Export job aynı request id ile tekrar edilirse aynı job’a bağlanır.

#### Policy Knobs

- Data visibility (role/scope).
- PII redaction on exports.
- KPI registry allowlist (hangi KPI’lar publish edilir).

#### Veri Sınıfları & Gizlilik

- Export’lar “en riskli” yüzeydir: scope ve redaction zorunlu.
- Search indeksleri PII içermeyecek şekilde tasarlanmalıdır (policy).

#### Audit & Telemetry (Minimum)

- Metric:
  - search_query_count
  - export_job_count
  - export_failed_count
- Log: actor_id, query_scope, filters, export_format, correlation_id.

#### Failure Modes (Top 5)

- Yetkisiz export → permission-aware enforcement.
- PII sızıntısı → redaction policy.
- Büyük sorgu → rate limit + paging zorunluluğu.
- İndeks drift → data lifecycle policy.
- Export job stuck → timeout + retry policy.

#### Anti-patterns

- Her domain’in ayrı export/job motoru yazması.
- “Permission filter”ı client-side’a bırakmak.

#### Domain Varyantları (Ethics / NC / Incident)

- Ethics: redaction yüksek; export çok sınırlı; audit zorunlu.
- NC: KPI (due date, backlog) raporları; export daha açık olabilir.
- Incident: yüksek hacimli sorgular; performans knobs kritik.

## 4) Links

- Üretim sistemi kuralları: `docs/03-delivery/SPECS/SPEC-0012-m3-direct-gen-production-system-v1.md`
- Ethics delivery kontratı: `docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md`
- Ethics trace exemplar: `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`
- SLA semantiği örneği: `docs/02-architecture/services/ethics-case-management/ADR/ADR-0005-ethics-sla-calendar-semantics.md`
- AI sınırları örneği: `docs/02-architecture/services/ethics-case-management/ADR/ADR-0006-ethics-ai-usage-boundaries-and-redaction.md`
