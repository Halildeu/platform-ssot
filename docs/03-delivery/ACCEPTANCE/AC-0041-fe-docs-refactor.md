# AC-0041 – FE Dokümanları Refaktör Acceptance

ID: AC-0041  
Story: STORY-0041-fe-docs-refactor  
Status: Done  
Owner: @team/frontend

## 1. AMAÇ

- Web frontend dokümantasyonunun yeni `docs/` mimarisi ile uyumlu olduğunu
  ve `web/docs` yapısının yalnızca legacy / detay arşivi olarak
  kullanılabildiğini test edilebilir kriterlerle doğrulamak.

## 2. KAPSAM

- Yeni doküman mimarisi (docs/00-handbook, 01–05, 99-templates) içindeki
  frontend ile ilgili dokümanlar.  
- `web/docs/**` altındaki mimari, güvenlik, test ve örnek dokümanların
  envanteri ve mapping tabloları.  
- WEB-ARCH.md, WEB-PROJECT-LAYOUT.md, STYLE-WEB-001.md ve ilgili guides/
  dokümanları.

## 3. GIVEN / WHEN / THEN SENARYOLARI

### Genel Kriterler

- [x] Given: Yeni doküman mimarisi (docs/00-handbook, 01–05, 99-templates)
      tanımlıdır.  
      When: Geliştirici veya agent frontend ile ilgili mimari/stil rehberi arar.  
      Then: Gerekli tüm rehberler (layout, stil, mimari, süreç) sadece `docs/`
      altında bulunur; `web/docs` altı günlük kullanım için gerekli değildir.

### Teknik Kriterler

- [x] Given: `web/docs` altındaki tüm önemli FE mimari dokümanları
      envanterlenmiştir.  
      When: WEB-ARCH.md dokümanı incelenir.  
      Then: Ana başlıklar (shell/layout, routing, theme, auth, tests, mf-check)
      ve ilgili legacy doküman yoları bu özet içinde listelenmiştir.

- [x] Given: `docs/00-handbook/WEB-PROJECT-LAYOUT.md` ve `STYLE-WEB-001.md`
      günceldir.  
      When: AGENT-CODEX.web ve DOCS-PROJECT-LAYOUT içindeki frontend
      referansları kontrol edilir.  
      Then: Tüm referanslar fiziksel olarak var olan `docs/` dosyalarına
      işaret eder; FRONTEND-PROJECT-LAYOUT / STYLE-FE gibi eski isimler
      yalnız `backend/docs/legacy/` altında kalmıştır.

### Operasyonel Kriterler

- [x] Given: Yeni bir FE Story üzerinde çalışılmaktadır.  
      When: Geliştirici “frontend mimari rehberi” arar.  
      Then: `docs/02-architecture/clients/WEB-ARCH.md` tek giriş noktası
      olarak yeterlidir ve oradan gerekirse web/docs altındaki detay
      dokümanlara link verilir.

## 4. NOTLAR / KISITLAR

- Bu acceptance yalnız doküman yapısını kapsar; FE kod refaktörü bu kapsamda
  değildir.  
- `web/docs` altındaki dosyalar silinmez, yalnızca “detay/örnek” ve
  tarihçe niteliğinde kullanılır.

## 5. ÖZET

- Yeni `docs/` hiyerarşisi frontend dokümantasyonu için de tek giriş
  noktası haline gelir; `web/docs` yalnız legacy/detay arşivi olur.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0041-fe-docs-refactor.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0041-fe-docs-refactor.md  
