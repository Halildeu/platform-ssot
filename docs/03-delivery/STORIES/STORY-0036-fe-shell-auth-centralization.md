# STORY-0036 – FE Shell Auth Centralization

ID: STORY-0036-fe-shell-auth-centralization  
Epic: QLTY-FE-SHELL-AUTH  
Status: Planned  
Owner: @team/frontend  
Upstream: QLTY-FE-SPA-LOGIN-01, QLTY-FE-SHARED-HTTP-01, E01-S10  
Downstream: AC-0036, TP-0036

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- FE shell tarafında auth durumunun tek bir merkezî store/provider üzerinden
  yönetilmesini sağlamak.  
- Login/logout akışını yalnız shell katmanına indirerek MFE’lerin kendi
  login sayfalarını veya doğrudan Keycloak yönlendirmelerini tetiklemesini
  engellemek.  
- HTTP çağrılarının shared-http üzerinden geçmesini zorunlu hale getirerek
  auth state, header ve error davranışını tek elden kontrol etmek.  
- Multi-tab oturum senkronizasyonu (BroadcastChannel + storage fallback)
  ile kullanıcı deneyimini ve güvenliği artırmak.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Frontend platform ekibi olarak, shell’in auth durumunu ve login/logout mantığını merkezî bir store/provider üzerinden yönetmesini istiyoruz; böylece MFE’ler sadeleşsin ve auth ile ilgili sorumluluklar karışmasın.
- Güvenlik/uyum ekibi olarak, tüm HTTP trafiğinin shared-http üzerinden geçmesini istiyoruz; böylece audit, timeout, retry ve error handling davranışını tek yerde garanti edebileyim.
- Bir son kullanıcı olarak, tüm sekmelerde oturum davranışının tutarlı olmasını istiyorum; böylece logout sonrası eski sekmelerde “yarım yamalak” oturum durumu görmeyeyim.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- Shell auth store, provider ve context yapısı.  
- Login/logout akışının yalnız shell üzerinden başlatılması.  
- shared-http kullanımı ve doğrudan fetch/axios çağrılarının temizlenmesi.  
- Multi-tab logout senaryosu (BroadcastChannel + storage fallback).  
- FE login/Keycloak akışının QLTY-FE-KEYCLOAK-01 ve QLTY-FE-SPA-LOGIN-01
  ile uyumlandırılması.

Hariç:
- Backend tarafında 401/403 davranışları, token üretimi ve refresh stratejisi
  (backend QLTY-REST-AUTH-01 kapsamındadır).  
- Mobil uygulamalardaki auth akışı (ayrı story’lerde ele alınacaktır).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] MFE’lerde bağımsız login sayfası veya doğrudan Keycloak yönlendirmesi
  bulunmaz; login yalnız shell’den tetiklenir.  
- [ ] Kod taramasında HTTP client kullanımı yalnız shared-http üzerinden
  gerçekleşir; istisnalar test/harness kodlarıyla sınırlıdır.  
- [ ] Multi-tab logout senaryosu AC-0036’daki Given/When/Then akışına göre
  e2e testlerle doğrulanır.  
- [ ] FE mimari dokümanında (shell/auth bölümü) bu karar ve mimari model
  açıkça belgelenmiştir.  
- [ ] PROJECT-FLOW ve ilgili session log’lar QLTY-FE-SHELL-AUTH-01 için
  güncel durumu gösterir.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- backend/docs/legacy/root/05-governance/02-stories/E01-S10-Auth-BroadcastChannel-Full-MFE-Sync.md  
- backend/docs/legacy/root/05-governance/02-stories/QLTY-FE-SPA-LOGIN-01.md  
- backend/docs/legacy/root/05-governance/02-stories/QLTY-FE-SHARED-HTTP-01.md  
- docs/03-delivery/STORIES/STORY-0009-fe-spa-login-standardization.md  
- docs/03-delivery/STORIES/STORY-0034-fe-keycloak-oidc.md  
- docs/00-handbook/STYLE-WEB-001.md  
- docs/00-handbook/STYLE-API-001.md  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Shell auth merkezileştirme kararı, login/logout akışı, shared-http
  zorunluluğu ve multi-tab logout senaryosu ile birlikte FE tarafındaki
  auth davranışını tek modelde toplar.  
- Amaç, hem güvenlik hem de kullanıcı deneyimi açısından dağınık auth
  implementasyonlarını azaltmak ve audit edilebilir, test edilebilir bir
  model oluşturmaktır.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0036-fe-shell-auth-centralization.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0036-fe-shell-auth-centralization.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0036-fe-shell-auth-centralization.md`  
