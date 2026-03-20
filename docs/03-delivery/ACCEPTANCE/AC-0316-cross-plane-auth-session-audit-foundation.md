# AC-0316 – Cross-Plane Auth Session Audit Foundation Acceptance

ID: AC-0316  
Story: STORY-0316-cross-plane-auth-session-audit-foundation  
Status: Planned  
Owner: @team/platform

-------------------------------------------------------------------------------
## 1. AMAC
-------------------------------------------------------------------------------

- Web, mobil ve backend authz/session omurgasinin tek capability diliyle
  calistigini dogrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Session bootstrap (`/api/v1/auth/sessions`).  
- Authorization snapshot (`/api/v1/authz/me`).  
- Aksiyon bazli backend yetki kontrolu (`/api/v1/permissions/check`).  
- Audit gorunurlugu (`/api/audit/events`).  
- Mobil stale session ve offline queue davranisi.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – Ortak session bootstrap:  
  - Given: `api-gateway`, `auth-service`, `permission-service`, web shell ve
    mobil uygulama calisir durumdadir.  
    When: Ayni kullanici web ve mobil yuzeylerden login olur.  
    Then: Her iki istemci de session'i `POST /api/v1/auth/sessions`
    endpoint'inden alir ve yerel farkli login API sozlesmesi kullanmaz.

- [ ] Senaryo 2 – Ortak authz snapshot:  
  - Given: Kullanici login olmustur ve en az bir scope'a bagli izinleri vardir.  
    When: Web veya mobil uygulama authorization durumunu yeniler.  
    Then: Izinler ve erisilebilir scope'lar `GET /api/v1/authz/me`
    yanitindan okunur; istemci tarafinda canonical olmayan permission listesi
    authoritative kabul edilmez.

- [ ] Senaryo 3 – Permission mutasyonu ve audit izi:  
  - Given: Bir yonetici rol veya permission atamasi degistirir.  
    When: Yetki mutasyonu tamamlanir.  
    Then: Islem audit tarafinda gorulebilir olur ve `GET /api/audit/events`
    uzerinden ilgili olaylar bulunabilir.

- [ ] Senaryo 3b – Session olusumu ve merkezi audit mirror:  
  - Given: `auth-service` basarili bir login sonucu session olusturur.  
    When: Session local auth audit tablosuna yazilir.  
    Then: Ayni olay permission-service icindeki merkezi audit feed'e mirror
    edilir ve `GET /api/audit/events?service=auth-service&action=SESSION_CREATED`
    ile bulunabilir.

- [ ] Senaryo 4 – Mobil stale session guvencesi:  
  - Given: Mobil cihazda queue'ya alinmis bir write islemi ve suresi dolmus
    bir token vardir.  
    When: Uygulama tekrar online olur veya queue drain tetiklenir.  
    Then: Islem yetkisiz sekilde replay edilmez; session gate kullanicidan
    yeniden kimlik dogrulama ister veya queue'yu güvenli sekilde bekletir.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Bu acceptance, MFA veya dis identity provider senaryolarini kapsamaz.  
- Detayli test dagilimi TP-0316 test planinda listelenir.  
- Session revocation, refresh rotation ve device binding gibi ileri seviye
  sertlestirmeler bu capability'nin sonraki fazlarina birakilabilir; ancak
  temel stale session guvencesi bu kapsamda zorunludur.

-------------------------------------------------------------------------------
## 5. OZET
-------------------------------------------------------------------------------

- Bu acceptance tamamlandiginda, web ve mobil istemcinin ayni backend auth
  omurgasina baglandigi ve yetki/audit davranisinin cross-plane seviyede
  izlenebilir oldugu kabul edilir.

-------------------------------------------------------------------------------
## 6. LINKLER (ISTEGE BAGLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0316-cross-plane-auth-session-audit-foundation.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0316-cross-plane-auth-session-audit-foundation.md  
- Interface Contract: docs/03-delivery/INTERFACE-CONTRACTS/INTERFACE-CONTRACT-cross-plane-auth-session-audit-foundation.md  
