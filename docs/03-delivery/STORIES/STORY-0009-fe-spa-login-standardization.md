# STORY-0009 – FE SPA Login Standardization

ID: STORY-0009-fe-spa-login-standardization  
Epic: QLTY-FE-LOGIN  
Status: Planned  
Owner: @team/frontend  
Upstream: QLTY-FE-SPA-LOGIN-01 (legacy)  
Downstream: AC-0009, TP-0009

## 1. AMAÇ

Shell içinde SPA login deneyimini standardize etmek; /login rotasının
tamamen bizim UI tarafından yönetildiği, Keycloak ekranına direkt gidilmeden
silent-check-sso + redirect akışının tamamlandığı ve ProtectedRoute/auth
provider ile tüm session yenileme/hata senaryolarının kapsandığı bir yapı
oluşturmak.

## 2. TANIM

- Kullanıcı olarak, ham Keycloak arayüzüne atılmadan akıcı bir SPA login deneyimi istiyorum; böylece login akışı daha hızlı ve tutarlı olur.
- Frontend geliştiricisi olarak, tek ve dokümante bir SPA login akışı (LoginPage + ProtectedRoute + auth provider) istiyorum; böylece tüm MFE’ler aynı güvenlik ve redirect kurallarını paylaşır.

## 3. KAPSAM VE SINIRLAR

Dahil:
- `mfe-shell` içinde LoginPage UI, Keycloak client init ve silent-check-sso
  orkestrasyonu; `keycloak.login()` yalnızca bizim UI üzerindeki butondan
  tetiklenecek.
- ProtectedRoute + shell auth provider: session timeout, token refresh,
  redirect parametreleri (`?redirect=`) ve yetki kontrolü.
- Shell ile remote MFE’ler arasında auth state paylaşımı (BroadcastChannel
  veya context) ve fallback logout/401 yönlendirmeleri.
- Doküman güncellemeleri: FRONTEND-ARCH-STATUS Security bölümü, PROJECT-FLOW
  satırı, session-log plan kaydı.

Hariç (NON-GOALS):
- Keycloak realm içi kullanıcı/grup yönetimi veya MFA.
- Backend security config değişiklikleri (yalnız FE akışı kapsamdadır).

## 4. ACCEPTANCE KRİTERLERİ

- [ ] `/login` rotası shell içinde SPA bileşeni olarak render edilir; Keycloak
  ekranı yalnızca bizim UI üzerindeki login butonu çağrıldığında açılır.  
- [ ] silent-check-sso ve token yenileme döngüsü ProtectedRoute + auth provider
  tarafından yönetilir; redirect parametresi ile kullanıcı login sonrası
  önceki sayfaya döner.  
- [ ] 401/403 durumlarında otomatik logout ve redirect davranışı tanımlıdır;
  shell toast/hata bildirimi dokümante edilmiştir.  

## 5. BAĞIMLILIKLAR

- Legacy Story: backend/docs/legacy/root/05-governance/02-stories/QLTY-FE-SPA-LOGIN-01.md  
- Legacy Acceptance: backend/docs/legacy/root/05-governance/07-acceptance/QLTY-FE-SPA-LOGIN-01.acceptance.md  
- Frontend mimari dokümanı: frontend/frontend/docs/01-architecture/01-shell/01-frontend-architecture.md  
- PROJECT-FLOW ve session-log plan girdileri  

## 6. ÖZET

- SPA login akışı shell tarafında standardize edilecek ve Keycloak entegrasyonu
  için tek giriş noktası LoginPage + ProtectedRoute yapısı olacaktır.
- Kabul kriterleri AC-0009 ve test senaryoları TP-0009 ile doğrulanacaktır.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0009-fe-spa-login-standardization.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0009-fe-spa-login-standardization.md`  
