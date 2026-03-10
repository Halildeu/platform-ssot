# STORY-0041 – FE Dokümantasyonunun Yeni Mimariye Taşınması

ID: STORY-0041-fe-docs-refactor  
Epic: QLTY-FE-DOCS  
Status: Done  
Owner: @team/frontend  
Upstream: (PB/PRD TBD)  
Downstream: AC-0041, TP-0041

## 1. AMAÇ

Web frontend tarafındaki mevcut `web/docs/**` içeriğini,
kurulan yeni doküman mimarisi
ile hizalamak; frontend için de tek ve tutarlı bir doküman sistemi
oluşturarak agent ve ekiplerin yalnız `docs/` üzerinden çalışmasını
sağlamak.

## 2. TANIM

- Bir frontend geliştiricisi olarak, tüm FE mimari ve best-practice dokümanlarının `docs/` ağacında bulunmasını istiyorum; böylece web/docs altına dağılmış rehberlere bakmak zorunda kalmayayım.
- Bir agent/ekip arkadaşı olarak, WEB-PROJECT-LAYOUT ve WEB-ARCH gibi tekil referans dokümanlar üzerinden frontend kod yapısını hızlıca anlayabilmek istiyorum; böylece yeni feature’lar için doğru yerlere müdahale edebileyim.

## 3. KAPSAM VE SINIRLAR

Dahil:
- `web/docs/**` altındaki mimari, güvenlik, test ve örnek dokümanların
  envanterinin çıkarılması.  
- Aşağıdaki hedef yapıya mapping yapılması:
  - transition handbook katmanı → WEB-PROJECT-LAYOUT, STYLE-WEB-001, güvenlik kılavuzları  
  - docs/02-architecture/clients/WEB-ARCH.md → frontend mimari üst bakışı  
  - docs/03-delivery/guides/** → FE spesifik rehberler (routing, theme, mf-check, tests)  
  - docs/04-operations/RUNBOOKS/** → FE tarafı operasyon/runbook dokümanları (jika gerekiyorsa)  
- WEB-ARCH.md içinde `web/docs/architecture/frontend/frontend-project-layout.md`
  ve diğer önemli FE rehberlerine referans veren kompakt bir özet oluşturulması.  
- Web transition rehberi ve DOCS-PROJECT-LAYOUT referanslarının yalnız `docs/`
  altındaki FE dokümanlarına işaret edecek şekilde güncel olduğunun doğrulanması.

Hariç:
- Yeni FE feature geliştirme veya refactor çalışmaları.  
- FE build/deploy pipeline’ında köklü değişiklikler (yalnız doc tarafı
  kapsamdadır).

## 4. ACCEPTANCE KRİTERLERİ

- [ ] FE mimari ve stil rehberlerine erişmek için yalnızca `docs/`
      hiyerarşisinin kullanılması yeterlidir; `web/docs` günlük kullanım
      için gerekli değildir.  
- [ ] `docs/02-architecture/clients/WEB-ARCH.md` dosyası mevcuttur ve
      web/docs altındaki ana mimari dokümanları kompakt şekilde özetler.  
- [ ] Web transition rehberi ve DOCS-PROJECT-LAYOUT içindeki frontend layout/stil
      referansları fiziksel olarak var olan `docs/` dosyalarına işaret eder.  
- [ ] `web/docs/**` altındaki legacy rehberler yalnız “örnek ve detay”
      niteliğinde kullanılır; kanonik kaynak olarak `docs/` belirtilmiştir.

## 5. BAĞIMLILIKLAR

- WEB-PROJECT-LAYOUT.md  
- STYLE-WEB-001.md  
- docs/03-delivery/guides/** (özellikle theme, mf-check, tests ile ilgili
  yeni rehberler)  
- Web transition rehberi, DOCS-PROJECT-LAYOUT.md, DOCS-WORKFLOW.md  
- `web/docs/architecture/frontend/frontend-project-layout.md` ve
  web/docs altındaki mevcut FE dokümanları

## 6. ÖZET

- Bu Story ile FE dokümantasyonu yeni `docs/` mimarisine taşınacak,
  `web/docs` sadece detay ve tarihçe içeren yardımcı alan olarak kalacaktır.  
- Amaç, backend tarafındaki dokümantasyon refaktörü ile aynı standardı
  frontend için de sağlamaktır.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0041-fe-docs-refactor.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0041-fe-docs-refactor.md`  
