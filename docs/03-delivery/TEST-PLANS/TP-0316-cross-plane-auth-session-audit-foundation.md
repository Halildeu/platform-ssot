# TEST-PLAN – Cross-Plane Auth Session Audit Foundation

ID: TP-0316  
Story: STORY-0316-cross-plane-auth-session-audit-foundation  
Status: Planned  
Owner: @team/platform

Not: Asagidaki basliklar ve siralama **zorunludur**. Yeni bir Test Plan
yazilirken bu H2 basliklari ve numaralari bire bir korunmali; agent sadece
bu basliklarin altini doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAC
-------------------------------------------------------------------------------

- Web, mobil ve backend auth/session/audit temelinin AC-0316 senaryolarina
  gore guvenilir sekilde calistigini dogrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `POST /api/v1/auth/sessions` login ve session bootstrap akisi.  
- `GET /api/v1/authz/me` ile authorization snapshot olusumu.  
- `POST /api/v1/permissions/check` ile aksiyon bazli backend authz kontrolu.  
- `GET /api/audit/events` ile audit gorunurlugu.  
- Mobil stale session / offline queue korumalari.  

-------------------------------------------------------------------------------
## 3. STRATEJI
-------------------------------------------------------------------------------

- Backend controller/service testleri ile auth-service ve permission-service
  v1 endpoint davranisini dogrulamak.  
- Internal ingest guvenligi icin `X-Internal-Api-Key` korumali endpoint
  davranisini ve session audit mirror akisini controller/service testleri ile
  dogrulamak.  
- Web shell entegrasyon testleri ile auth state'in `shared-http` ve shell auth
  katmani uzerinden beslendigini dogrulamak.  
- Mobil unit/integration testleri ile session gate, token expiry ve queue
  drain davranisini dogrulamak.  
- Audit gorunurlugu icin permission mutasyonlari sonrasinda audit query ve
  export davranisini kontrol etmek.  
- Gerekli oldugunda gateway uzerinden smoke/e2e akislar ile butun zinciri
  uctan uca teyit etmek.  

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI OZETI
-------------------------------------------------------------------------------

- [ ] Login bootstrap'i ve token/expiry alanlari.  
- [ ] `authz/me` yanitindan izin ve scope ozetinin dogru olusmasi.  
- [ ] Permission check isteginin company/project/warehouse scope'lariyla
  dogru calismasi.  
- [ ] Rol/izin mutasyonlarinin audit stream ve listeleme tarafinda
  gorunur olmasi.  
- [ ] `SESSION_CREATED` olayinin auth-service local audit kaydindan permission-service
  merkezi audit feed'ine mirror edilmesi.  
- [ ] Mobil queue drain sirasinda expired token durumunun guvenli sekilde
  bloklanmasi.  

-------------------------------------------------------------------------------
## 5. CEVRE VE ARACLAR
-------------------------------------------------------------------------------

- Spring Boot test runner / JUnit.  
- Web tarafinda Vitest/Jest ve gerekirse Playwright.  
- Expo/React Native test zinciri veya uygun mobil integration araci.  
- Gateway + auth-service + permission-service ayaga kalkmis gelistirme ortami.  

-------------------------------------------------------------------------------
## 6. RISKLER / ONCELIKLER
-------------------------------------------------------------------------------

- Web ve mobil istemcilerin farkli permission isimleri veya farkli scope
  varsayimlariyla drift uretmesi.  
- Mobil offline queue'nin expired token ile replay denemesi yapmasi.  
- Backend audit olaylarinin action/metadata duzeyinde yeterince belirgin
  olmamasi.  
- Legacy auth endpoint'lerinin yanlislikla canonical v1 endpoint'lerin yerine
  kullanilmaya devam etmesi.  

-------------------------------------------------------------------------------
## 7. OZET
-------------------------------------------------------------------------------

- Bu test plani, mevcut backend auth/yetki omurgasinin web ve mobil yuzeylere
  ayni capability diliyle tasinabildigini ve audit izinin kaybolmadigini
  dogrular.

-------------------------------------------------------------------------------
## 8. LINKLER (ISTEGE BAGLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0316-cross-plane-auth-session-audit-foundation.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0316-cross-plane-auth-session-audit-foundation.md  
- Interface Contract: docs/03-delivery/INTERFACE-CONTRACTS/INTERFACE-CONTRACT-cross-plane-auth-session-audit-foundation.md  
