# STORY-0316 – Cross-Plane Auth Session Audit Foundation

ID: STORY-0316-cross-plane-auth-session-audit-foundation  
Epic: QLTY-PLATFORM-IDENTITY  
Status: Planned  
Owner: @team/platform  
Upstream: STORY-0019-permission-registry-v1, STORY-0033-auth-rest-dto-v1, STORY-0036-fe-shell-auth-centralization, STORY-0101-login-api-rate-limiting, STORY-0301-mobile-offline-queue  
Downstream: AC-0316, TP-0316, IC-cross-plane-auth-session-audit-foundation

-------------------------------------------------------------------------------
## 1. AMAC
-------------------------------------------------------------------------------

- Mevcut `auth-service`, `permission-service`, `api-gateway` ve `common-auth`
  omurgasini, hem web hem mobil icin tek session ve authorization omurgasi
  haline getirmek.
- Web shell ve mobil istemcinin ayni auth endpoint'lerini, ayni permission
  sozlugunu ve ayni scope modelini kullanmasini saglamak.
- Session olusumu, permission degisikligi ve audit gorunurlugunu ayni
  capability contract altinda toplamak; boylece cross-plane gelistirme
  tek governed execution akisiyla ilerlesin.
- Mobil offline queue, stale token ve scope degisimi gibi durumlarin
  daha sonra pahaliya patlamasini engelleyecek temel authz iskeletini
  erkenden kilitlemek.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir platform sahibi olarak, backend auth/yetki omurgasini sifirdan yeniden
  yazmadan web ve mobil tarafina giydirebilmek istiyorum; boylece yeni
  capability'ler ayni kimlik ve izin diliyle buyusun.
- Bir mobil kullanici olarak, login olduktan sonra benim izinlerim ve
  erisebildigim scope'larin backend tarafinda tek kaynaktan gelmesini
  istiyorum; boylece cihazda eski/yanlis yetki ile islem yapmayayim.
- Bir yonetici olarak, rol ve izin degisikliklerinin audit izini gorebilmek
  istiyorum; boylece oturum ve yetki davranisi izlenebilir ve savunulabilir
  olsun.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- `POST /api/v1/auth/sessions` ile session olusturma ve token bootstrap akisi.
- `GET /api/v1/authz/me` ile izin/scope ozetinin web ve mobil tarafinda ortak
  sekilde tuketilmesi.
- `POST /api/v1/permissions/check` ile aksiyon bazli backend yetki dogrulama
  modelinin korunmasi.
- `GET /api/audit/events` ile session/yetki degisikliklerine bagli kritik
  audit akislarinin gorunurlugu.
- Web shell, mobil workspace ve backend auth/permission katmanlari arasinda
  ortak capability, permission, scope ve audit sozlugunun dokumante edilmesi.
- Mobil offline queue ve stale session davranisinin auth expiry ile birlikte
  ele alinmasi.

Haric:
- Yeni identity provider secimi veya Keycloak disina cikis.
- MFA, social login, SSO federation veya dis sistem onboarding akislari.
- AI ve data plane'in bu capability icinde dogrudan runtime katilimcilari
  olmasi; bu fazda AI/data sadece downstream tuketici olarak dusunulur.
- Mevcut mikroservis topolojisinin yeniden tasarlanmasi.

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRITERLERI
-------------------------------------------------------------------------------

- [ ] Web shell ve mobil istemci session bootstrap icin ayni
  `POST /api/v1/auth/sessions` endpoint'ini kullanir; yerel veya kopya login
  API sozlesmesi tanimlamaz.
- [ ] Web ve mobil auth state'i izin/scope ozetini ayni
  `GET /api/v1/authz/me` cevabindan uretir; yerel hard-coded permission
  kataloglari authoritative kaynak olarak kullanilmaz.
- [ ] Kritik yetki mutasyonlari ve ilgili security olaylari
  `GET /api/audit/events` uzerinden izlenebilir; audit gorunurlugu docs ve
  test planinda acikca tanimlanmistir.
- [ ] Mobil stale session veya expired token durumunda queued write isleri
  backend'e yetkisiz sekilde replay edilmez; session gate ile durdurulur veya
  kullanicidan yeniden kimlik dogrulama ister.
- [ ] Bu capability icin tek bir ACTIVE `feature_execution_contract` vardir ve
  cross-plane delivery ayni contract ile izlenir.

-------------------------------------------------------------------------------
## 5. BAGIMLILIKLAR
-------------------------------------------------------------------------------

- docs/03-delivery/STORIES/STORY-0019-permission-registry-v1.md  
- docs/03-delivery/STORIES/STORY-0033-auth-rest-dto-v1.md  
- docs/03-delivery/STORIES/STORY-0036-fe-shell-auth-centralization.md  
- docs/03-delivery/STORIES/STORY-0101-login-api-rate-limiting.md  
- docs/03-delivery/STORIES/STORY-0301-mobile-offline-queue.md  
- docs/03-delivery/api/auth.api.md  
- docs/03-delivery/api/permission.api.md  
- docs/03-delivery/api/audit-events.api.md  
- docs/03-delivery/api/common-headers.md  
- docs/OPERATIONS/MANAGED-REPO-CONTEXT-CONSUMPTION.v1.md  
- docs/OPERATIONS/MULTI-PLANE-EXECUTION-MODEL.v1.md  

-------------------------------------------------------------------------------
## 6. OZET
-------------------------------------------------------------------------------

- Bu story, mevcut backend auth/yetki omurgasini kullanarak web ve mobil
  istemcilerin ayni session, permission, scope ve audit dilini konusmasini
  hedefler.
- Amaç yeni bir auth sistemi icat etmek degil; halihazirda var olan backend
  capability'lerini tek execution contract altinda cross-plane buyumeye
  hazir hale getirmektir.

-------------------------------------------------------------------------------
## 7. LINKLER (ISTEGE BAGLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0316-cross-plane-auth-session-audit-foundation.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0316-cross-plane-auth-session-audit-foundation.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0316-cross-plane-auth-session-audit-foundation.md  
- Interface Contract: docs/03-delivery/INTERFACE-CONTRACTS/INTERFACE-CONTRACT-cross-plane-auth-session-audit-foundation.md  
