# STORY-0040 – FE Shared HTTP Standard

ID: STORY-0040-fe-shared-http-standard  
Epic: QLTY-FE-SHARED-HTTP  
Status: Planned  
Owner: @team/frontend  
Upstream: QLTY-FE-SHARED-HTTP-01  
Downstream: AC-0040, TP-0040

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Tüm MFE’lerde HTTP çağrılarının tek `@mfe/shared-http` paketi üzerinden
  yapılmasına dair legacy QLTY-FE-SHARED-HTTP-01 kararını yeni docs
  mimarisine taşımak.  
- BaseURL, authorization, X-Trace-Id ve hata işleme interceptor’larının
  frontend tarafında tek bir shared layer ile yönetildiğini dokümante etmek.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir frontend geliştiricisi olarak, tüm MFE’lerin aynı shared HTTP istemcisini kullanmasını istiyorum; böylece baseURL, auth header ve tracing davranışı her yerde tutarlı olsun.
- Ops/güvenlik ekibi olarak, HTTP çağrılarının ortak bir katmandan geçmesini istiyoruz; böylece loglama, timeout ve 401 davranışlarını tek noktadan kontrol edebileyim.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- `@mfe/shared-http` paketinin axios instance + interceptor katmanı
  olarak tanımlanması.  
- MFE service katmanlarının shared-http üzerinden çağrı yapacak şekilde
  modellenmesi.  
- Gateway baseURL ve `/api/v1/**` path normalizasyonunun shared layer’da
  zorunlu kılınması.  
- Doküman güncellemeleri: FE mimari rehberinde Shared HTTP bölümü.

Hariç:
- Backend gateway konfigürasyonu (yalnız FE tüketim modeli).  
- Yeni business endpoint’ler; mevcut endpointlerin nasıl çağrıldığı
  ile ilgilenir.

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] STORY-0040 / AC-0040 / TP-0040 zinciri, ortak HTTP istemcisi için
  alınan QLTY-FE-SHARED-HTTP-01 kararlarını yeni doküman sisteminde
  özetler.  
- [ ] PROJECT-FLOW’da QLTY-FE-SHARED-HTTP-01 alias ID’si bu Story
  satırıyla ilişkilidir.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- docs/00-handbook/STYLE-API-001.md  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Shared HTTP standardı yeni doküman yapısında bu Story zinciri ile
  izlenebilir hale getirilmiştir; legacy governance tablosuna bakmaya
  gerek kalmaz.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0040-fe-shared-http-standard.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0040-fe-shared-http-standard.md`  
