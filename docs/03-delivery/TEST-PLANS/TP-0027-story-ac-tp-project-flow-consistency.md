# TP-0027 – STORY / AC / TP ↔ PROJECT-FLOW Consistency Test Planı

ID: TP-0027  
Story: STORY-0027-story-ac-tp-project-flow-consistency
Status: Planned  
Owner: @team/platform-arch

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- PROJECT-FLOW ile STORY/AC/TP dokümanları arasındaki ilişkiyi kontrol
  eden script’in (örn. `check_story_links.py`) beklenen senaryolarda doğru
  çalıştığını doğrulamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Gerçek PROJECT-FLOW tablosu üzerindeki tüm Story satırları.  
- Örnek olarak bilerek bozulmuş küçük bir Story/AC/TP seti.  

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Script’i önce mevcut doküman seti üzerinde çalıştırıp, eksik doküman
  hatalarının beklenen sayıda/biçimde raporlandığını görmek.  
- Ardından eksik dosyaları oluşturarak script’i tekrar çalıştırmak ve
  hataların kaybolduğunu doğrulamak.  
- Seçili bir Story ID için (örn. STORY-0007) script’i parametreyle
  çalıştırıp (“targeted run”) yalnız o Story için “sonraki adımlar”
  çıktısının doğru üretildiğini kontrol etmek.

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Tüm Story’ler için “happy path” çalıştırma – eksik doküman yoksa
  hata üretilmemesi.  
- [ ] Eksik STORY dosyası içeren bir senaryoda ilgili Story ID’nin
  raporlanması.  
- [ ] Eksik Acceptance veya Test Plan dosyası içeren bir senaryoda
  ilgili AC/TP ID’lerinin raporlanması.  
- [ ] Belirli bir Story ID için targeted run çıktısında, beklenen
  “sonraki adımlar” listesinin üretilmesi.

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Python 3 çalışma ortamı.  
- `scripts/check_story_links.py` (veya eşdeğer docflow helper).  

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Script’in PROJECT-FLOW tablosunu yanlış parse etmesi durumunda false
  positive/negative hatalar oluşabilir; tablo formatı değiştiğinde script’in
  güncellenmesi gerekir.  

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, PROJECT-FLOW tablosu ile STORY/AC/TP dokümanları arasındaki
  ilişkinin script’ler aracılığıyla güvenilir şekilde doğrulandığını garanti
  etmeyi amaçlar.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0027-story-ac-tp-project-flow-consistency.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0027-story-ac-tp-project-flow-consistency.md  

