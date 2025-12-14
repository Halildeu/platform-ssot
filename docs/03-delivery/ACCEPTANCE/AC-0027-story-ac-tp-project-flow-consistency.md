# AC-0027 – STORY / AC / TP ↔ PROJECT-FLOW Consistency Acceptance

ID: AC-0027  
Story: STORY-0027-story-ac-tp-project-flow-consistency  
Status: Planned  
Owner: @team/platform-arch

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- PROJECT-FLOW’daki Story tablosu ile STORY/AC/TP dosyaları arasındaki
  tutarlılığın otomatik ve güvenilir şekilde kontrol edildiğini doğrulamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- PROJECT-FLOW içindeki Story satırları.  
- `docs/03-delivery/STORIES`, `ACCEPTANCE`, `TEST-PLANS` klasörlerindeki
  ilgili dokümanlar.  

-------------------------------------------------------------------------------
3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – Eksik STORY dosyası:  
  Given: PROJECT-FLOW’da STORY-00XX satırı vardır ancak ilgili STORY
  dosyası yoktur.  
    When: `check_story_links.py` script’i tüm Story’ler için çalıştırılır.  
    Then: Eksik STORY dosyası, Story ID ve beklenen dosya yolu ile birlikte
    raporlanır.

- [ ] Senaryo 2 – Eksik ACCEPTANCE veya TEST-PLAN:  
  Given: PROJECT-FLOW’da Acceptance sütununda AC-00XX yer alır ancak
  ilgili Acceptance veya Test Plan dosyaları yoktur.  
    When: `check_story_links.py` script’i çalıştırılır.  
    Then: Eksik ACCEPTANCE/TP dosyaları, bağlı oldukları Story ile birlikte
    raporlanır.

- [ ] Senaryo 3 – “Sonraki adımlar” çıktısı:  
  Given: Geliştirici belirli bir Story’yi ilerletmek istemektedir
  (örn. STORY-0007).  
    When: `check_story_links.py STORY-0007` veya benzeri bir komut
    çalıştırılır.  
    Then: Çıktıda ilgili Story için eksik dokümanlar ve “sonraki adımlar”
    (örn. “AC-0007 oluştur”, “TP-0027’yı güncelle”) açıkça listelenir.

-------------------------------------------------------------------------------
4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Bu acceptance, yalnız doküman varlığı ve temel link tutarlılığını kapsar;
  doküman içeriğinin kalitesi STORY-0026 ve diğer Doc QA Story’lerinin
  kapsamındadır.  

-------------------------------------------------------------------------------
5. ÖZET
-------------------------------------------------------------------------------

- `check_story_links.py` veya eşdeğer script, PROJECT-FLOW ↔ STORY/AC/TP
  tutarlılığını güvenilir şekilde raporluyorsa ve “sonraki adımlar”
  çıktısı üretebiliyorsa bu acceptance tamamlanmış sayılır.

-------------------------------------------------------------------------------
6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0027-story-ac-tp-project-flow-consistency.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0027-story-ac-tp-project-flow-consistency.md  

