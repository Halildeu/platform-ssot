# MULTI-PLANE-EXECUTION-MODEL (v1)

Amac: `dev` reposunu yalniz `web + backend` deposu gibi degil,
`web + mobile + backend + ai + data` yuzeylerini ayni platform diliyle yoneten
tek managed repo olarak tanimlamak.

## 1. Plane modeli

### Experience plane
- `web/`
- `mobile/`
- Sorumluluk: kullanici deneyimi, ekran akislari, gorsel dil, istemci state,
  UX baglami

### Transaction plane
- `backend/`
- Sorumluluk: API, auth, permission, session, audit, business kurallari,
  gateway ve servis orkestrasyonu

### Data plane
- `data/` veya backend icindeki data/reporting/pipeline yuzeyleri
- Sorumluluk: SQL, ETL, reporting, curated veri ciktilari, veri performansi

### Intelligence plane
- `ai/` veya ilgili model/pipeline/serving yuzeyleri
- Sorumluluk: inference, evaluation, model serving, prompt/pipeline, AI kalite
  ve risk guardrail'lari

### Governance plane
- `docs/`, `extensions/`, `tenant/`, `schemas/`, `policies/`, `registry/`
- Sorumluluk: context, contract, schema, policy, evidence ve delivery sinirlari

## 2. Temel kurallar

- Tum plane'ler ayni capability dilini kullanir.
- Tum plane'ler ayni tenant/scope/yetki mantigina uyar.
- Yeni plane eklemek mevcut delivery sistemini bozma gerekcesi degildir.
- Plane'ler ayri gelistirilir ama rastgele degil, contract-first ilerler.

## 3. Konusma modeli

### Web / Mobile
- Kullanici yuzeyleri once `api-gateway` / backend ile konusur.
- Dogrudan product database, AI training data veya data pipeline'ina
  baglanmaz.

### Backend
- Diger backend servisleriyle yalniz `REST`, `event` veya paylasimli interface
  kontratlari uzerinden konusur.
- Baska servisin tablo ownership'ini ihlal etmez.

### AI
- Sisteme veri veya karar yazacaksa backend API, job ya da event uzerinden
  yazar.
- Dogrudan product schema'larina serbest yazim yapmaz.
- Veri girdilerini curated contract uzerinden alir.

### Data
- Tablo ownership kurallarina uyar.
- Cross-service veri ihtiyacini API, event veya curated cikti ile cozer.
- Baska servisin tablolarina serbest mutation yapmaz.

## 4. Ortak konusma sozlesmeleri

Asagidaki alanlar plane'ler arasi ortak sozluk olarak korunur:

- `capability_id`
- `permission_code`
- `resource_scope`
- `api route / dto`
- `event_name`
- `job_name`
- `audit_action`
- `tenant_id`

Bir capability farkli plane'lerde farkli isimlerle yeniden uretilmez.

## 5. Delivery sistemi ile uyum

Mevcut lane sistemi korunur:
- `backend -> unit`
- `database -> database`
- `api -> api`
- `frontend -> contract`
- `integration -> integration`
- `e2e -> e2e`

Gecis kurallari:
- `mobile` ilk asamada `frontend` kapsaminda ilerler
- `ai` ilk asamada `backend + integration` kapsaminda ilerler
- `data` ilk asamada `database + api` kapsaminda ilerler

Boylece mevcut CI zinciri bozulmadan yeni plane'ler sisteme eklenir.

## 6. Cross-plane degisiklik kuralı

Bir is birden fazla plane'i etkiliyorsa:

- tek bir `feature_execution_contract` ile baslar
- etkilenen plane'ler ve path'ler acikca yazilir
- permission, audit ve API etkisi belirtilir
- hangi lane'lerde kanit beklendigi netlestirilir

Feature contract olmadan genis capli cross-plane refactor baslatilmaz.

## 7. Codex icin calisma sekli

Codex:
- once governance plane'i okur,
- sonra tenant ve decision baglamini okur,
- sonra feature contract'i okur,
- en son ilgili plane'in koduna iner.

Bu sira bozulmaz.

## 8. Bu modelin pratik sonucu

- `web`, `mobile`, `backend`, `ai`, `data` ayri hizlarda gelisebilir
- ama ayni permission, capability ve audit diliyle konusur
- delivery sistemi bozulmadan buyume saglanir
- bir plane'in daigin karari diger plane'lere tasinmaz

## 9. Done

Bu model aktif kabul edilmek icin:
- capability/permission/audit sozlugu ortak kullanilmali,
- cross-plane isler contract-first baslamali,
- mobile/ai/data eklemeleri mevcut lane omurgasini bozmamali,
- backend veri ownership kurallari tum plane'lerce korunmali.
