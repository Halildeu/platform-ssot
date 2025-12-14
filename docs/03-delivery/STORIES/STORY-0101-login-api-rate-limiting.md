# STORY-0101 – Login API Rate Limiting

ID: STORY-0101-login-api-rate-limiting  
Epic: EPIC-01  
Status: Planned  
Owner: Halil K.  
Upstream: (PB/PRD TBD)  
Downstream: AC-0101, TP-0101

## 1. AMAÇ

- Login API uçlarını abuse/bruteforce’a karşı korumak ve stabil performans sağlamak.

## 2. TANIM

- Güvenlik/platform ekibi olarak, login uçlarında rate limiting uygulanmasını istiyoruz; böylece abuse’u azaltır ve sistemi koruruz.
- Kullanıcı olarak, login akışının yük altında bile duyarlı kalmasını istiyorum; böylece kimlik doğrulama güvenilir şekilde çalışır.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Login ile ilişkili kritik endpoint’lerde (örn. `/auth/login`, `/auth/refresh`) rate limit uygulanması.
- Limit aşımlarında standart hata zarfı + uygun status code (429) dönüşü.
- Limit konfigürasyonu (env/config) ve temel telemetry (count/blocked).

Hariç:
- WAF/CDN katmanında global rate limit stratejisi (ayrı iş).
- Tüm API uçlarına genelleme (sadece login kritik uçları).

## 4. ACCEPTANCE KRİTERLERİ

- [ ] Aynı kullanıcı/IP için belirlenen limit aşılınca 429 döner ve retry bilgisi sağlanır.  
- [ ] Normal trafikte login akışı etkilenmez (p95 hedefleri korunur).  
- [ ] Telemetry/log’lar ile rate-limit block olayları izlenebilir.

## 5. BAĞIMLILIKLAR

- Auth servisi endpoint sözleşmeleri ve mevcut güvenlik zinciri.
- AC-0101 ve TP-0101.

## 6. ÖZET

- Login uçları için rate limiting tanımlanır ve izlenebilir hale getirilir.  
- Abuse senaryoları sistemden erken kesilir; normal kullanıcı deneyimi korunur.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0101-login-api-rate-limiting.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0101-login-api-rate-limiting.md`  
