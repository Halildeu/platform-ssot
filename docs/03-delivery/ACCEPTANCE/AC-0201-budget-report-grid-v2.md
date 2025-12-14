# AC-0201 – Budget Report Grid V2 Acceptance

ID: AC-0201  
Story: STORY-0201-budget-report-grid-v2  
Status: Planned  
Owner: Sezar

## 1. AMAÇ

- Grid V2’nin fonksiyonel kapsamını ve kalite hedeflerini doğrulamak.

## 2. KAPSAM

- Listeleme, filtreleme, sıralama, export.  
- Performans ve kullanılabilirlik hedefleri.

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [ ] Senaryo 1 – Listeleme  
      Given: Kullanıcı rapor grid ekranındadır  
      When: Budget report listesi açılır  
      Then: Grid kısa sürede yüklenir ve temel kolonlar görünür

- [ ] Senaryo 2 – Filtreleme/sıralama  
      Given: Grid yüklüdür  
      When: Kullanıcı filtre/sıralama uygular  
      Then: Sonuçlar doğru güncellenir ve hedef performans bütçesi korunur

- [ ] Senaryo 3 – Export  
      Given: Kullanıcı belirli filtrelerle veri setini daraltmıştır  
      When: Export tetikler  
      Then: Export çıktısı doğru formatta oluşur ve limitler net şekilde uygulanır

## 4. NOTLAR / KISITLAR

- Ölçümler için gerçek veri hacmi ile test edilmesi kritik.

## 5. ÖZET

- Grid V2 işlevleri ve kalite kriterleri Given/When/Then ile netleşir.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0201-budget-report-grid-v2.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0201-budget-report-grid-v2.md  

