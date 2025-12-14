# AC-0026 – Doc QA & Template Automation Acceptance

ID: AC-0026  
Story: STORY-0026-doc-qa-automation  
Status: Done  
Owner: @team/platform-arch

## 1. AMAÇ

- Doc QA & Template Automation altyapısının, şablon ve ID kuralları için
  tanımlanan minimum gereksinimleri karşıladığını doğrulamak.

## 2. KAPSAM

- STORY/AC/TP/RUNBOOK şablon kontrolleri.  
- ID benzersizliği ve dosya adı ↔ ID uyumu kontrolleri.  

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [x] Senaryo 1 – Şablon kontrol script’i:  
  Given: STORY/AC/TP/RUNBOOK dokümanları ve şablon tanımları vardır.  
    When: Doc QA script’i çalıştırılır.  
    Then: Zorunlu başlıklar ve `ID:` meta satırı eksik/yanlış ise raporlanır,
    doğru dosyalar OK olarak işaretlenir.

- [x] Senaryo 2 – ID tutarlılığı:  
  Given: Tüm STORY/AC/TP/RUNBOOK dosyaları mevcuttur.  
    When: ID kontrol script’i çalıştırılır.  
    Then: ID çakışması veya dosya adı ↔ ID uyuşmazlığı varsa raporlanır.

- [x] Senaryo 3 – Etkileşimli kullanım:  
  Given: Geliştirici Codex ile birlikte çalışmakta ve Doc QA script’lerine
  erişimi vardır.  
    When: Şablon/ID script’leri dev ortamında çalıştırılır ve çıktıları
    Codex’e bağlam olarak verilir.  
    Then: Codex bu çıktılara göre ilgili dokümanları günceller ve script’ler
    tekrar çalıştırıldığında aynı hatalar görülmez.

## 4. NOTLAR / KISITLAR

- Gelişmiş kontroller (API şablonu, governance migration vb.) ileriki
  fazlarda eklenebilir; bu acceptance yalnız temel kontrolleri kapsar.

## 5. ÖZET

- Temel Doc QA script’leri beklendiği gibi çalıştığında ve şablon/ID
  hatalarını güvenilir şekilde raporladığında bu acceptance tamamlanmış
  sayılacaktır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0026-doc-qa-automation.md  
