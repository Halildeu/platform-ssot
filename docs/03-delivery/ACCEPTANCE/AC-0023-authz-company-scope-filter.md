# AC-0023 – AuthZ Company Scope Filter Acceptance

ID: AC-0023  
Story: STORY-0023-authz-company-scope-filter  
Status: Planned  
Owner: @team/backend

## 1. AMAÇ

- Company scope filtresi için belirlenen domain modeli ve API davranışının
  beklenen şekilde çalıştığını doğrulamak.

## 2. KAPSAM

- Company scope bazlı yetkilendirme kontrolleri.

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [ ] Senaryo 1 – Company scope filtrelemesi:  
  Given: Kullanıcının bağlı olduğu company bilgisi ve scoped izinleri
  tanımlanmıştır.  
    When: Kullanıcı company scope gerektiren bir kaynağa erişmek ister.  
    Then: Yalnızca yetkili olduğu company kayıtlarını görebilir.

## 4. NOTLAR / KISITLAR

- Detaylı test senaryoları ilgili test planında yer alacaktır.

## 5. ÖZET

- Company scope filtresi bu acceptance ile doğrulandığında STORY-0023
  tamamlanmış sayılacaktır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0023-authz-company-scope-filter.md  

