# STORY-0006 – Release Notes Dokümantasyonunun Standardizasyonu

ID: STORY-0006-release-notes-refactor  
Epic: OPS-RELEASE  
Status: Planned  
Owner: @team/delivery  
Downstream: AC-0006

## 1. AMAÇ

Her sürüm için hem test planı hem de release-notes üretimini standardize etmek;
release notlarının tek bir klasörde, tekrar kullanılabilir bir formatta ve
RUNBOOK / TEST-PLAN dokümanları ile ilişkili şekilde yönetilmesini sağlamak.

## 2. TANIM

- Bir release sorumlusu olarak, tüm release notlarının standart bir format ve klasör altında tutulmasını istiyorum; böylece sürümler arası izlenebilirlik ve kalite korunabilsin.
- Ops/dev ekibi olarak, release-notes ile TEST-PLAN ve RUNBOOK’ların birbirine bağlı olmasını istiyoruz; böylece yayın sonrası sorunlarda doğru dokümana hızla gidebileyim.

## 3. KAPSAM VE SINIRLAR

Dahil:
- `docs/04-operations/RELEASE-NOTES/` altında release-notes dokümanları için
  standart bir yapı tanımlanması.
- `docs/99-templates/TEST-PLAN.template.md` ile bağ kurulması (her önemli
  release’in bir test planı ile eşlenmesi).
- PROD release sonrası yapılacak smoke-test checklist’inin release-notes veya
  ilgili RUNBOOK’lara referans olacak şekilde tanımlanması.

Hariç:
- CI/CD pipeline değişiklikleri.
- Yeni test otomasyon altyapısı kurulumu (yalnız dokümantasyon akışı kapsamdadır).

## 4. ACCEPTANCE KRİTERLERİ

- [ ] `docs/04-operations/RELEASE-NOTES/` altında en az bir örnek release-notes
  dokümanı bulunmaktadır.
- [ ] Örnek release-notes, ilgili TEST-PLAN ve RUNBOOK dokümanlarına açık referans
  içerir.
- [ ] AC-0006 acceptance dokümanındaki tüm maddeler karşılanmıştır.

## 5. BAĞIMLILIKLAR

- AC-0006-release-notes-refactor  
- İlgili TEST-PLAN dokümanları (ör. TP-0001-release-template)  
- İlgili RUNBOOK’lar ve SLO/SLA dokümanları  

## 6. ÖZET

- Release-notes dokümantasyonu için tek ve standart bir format belirlenmiş, 04-operations altında konumlandırılmıştır.
- Release notları, ilgili test planı ve runbook’lara bağlanarak sürüm kalitesi ve izlenebilirlik artırılacaktır.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0006-release-notes-refactor.md  
- Örnek Release Notes (ileride): docs/04-operations/RELEASE-NOTES/RELEASE-NOTES-example.md  
