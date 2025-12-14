# AC-0021 – Header Navigation & Overflow Acceptance

ID: AC-0021  
Story: STORY-0021-header-navigation-overflow  
Status: Planned  
Owner: @team/frontend

## 1. AMAÇ

- Header navigation & overflow davranışının farklı ekran genişliklerinde
  kullanılabilir ve erişilebilir olduğunu doğrulamak.

## 2. KAPSAM

- Header navigation bileşenleri ve overflow menüsü.  

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [ ] Senaryo 1 – Küçük ekran navigasyonu:  
  Given: Uygulama küçük ekran boyutunda açılmıştır.  
    When: Kullanıcı header navigasyonunu kullanır.  
    Then: Menü öğeleri overflow menüsü üzerinden dahi erişilebilir olmalıdır.

- [ ] Senaryo 2 – Klavye navigasyonu:  
  Given: Kullanıcı klavye ile navigasyon öğeleri arasında geziyor.  
    When: Tab/shift+tab ile öğeler arasında gezinir.  
    Then: Sıra mantıklı olmalı ve tüm öğeler erişilebilir olmalıdır.

## 4. NOTLAR / KISITLAR

- Detaylı smoke testleri ilgili test planında yer alacaktır.

## 5. ÖZET

- Header navigation & overflow, temel A11y ve kullanılabilirlik kriterlerini
  karşıladığında bu acceptance tamamlanmış sayılacaktır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0021-header-navigation-overflow.md  

