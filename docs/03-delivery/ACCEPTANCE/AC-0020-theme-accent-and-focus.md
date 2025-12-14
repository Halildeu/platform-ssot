# AC-0020 – Theme Accent & Focus Acceptance

ID: AC-0020  
Story: STORY-0020-theme-accent-and-focus  
Status: Planned  
Owner: @team/frontend

## 1. AMAÇ

- Accent/focus standardının Theme & Layout System v1.0 ve A11y gereksinimleriyle
  uyumlu olduğunu test edilebilir kriterlerle doğrulamak.

## 2. KAPSAM

- Accent ve focus token’larının kullanımı.  
- Örnek ekranlarda (form, navigation, grid) focus davranışı.

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [ ] Senaryo 1 – Focus görünürlüğü:  
  Given: Kullanıcı klavye ile form alanları arasında geziyor.  
    When: Herhangi bir input veya butona focus gelir.  
    Then: Focus ring A11y gereksinimlerine uygun kontrast ve kalınlıkta
    görünür olmalıdır.

- [ ] Senaryo 2 – Accent & HC mod:  
  Given: High‑contrast mod etkinleştirilmiştir.  
    When: Kullanıcı focus aldığı öğelerle etkileşime girer.  
    Then: Accent/focus görünürlüğü HC modda dahi belirgin ve tutarlı olmalıdır.

## 4. NOTLAR / KISITLAR

- Detaylı A11y senaryoları ilgili test planında listelenecektir.

## 5. ÖZET

- Accent ve focus davranışları, bu acceptance ile gözlemlenebilir ve
  ölçülebilir şekilde doğrulanacaktır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0020-theme-accent-and-focus.md  

