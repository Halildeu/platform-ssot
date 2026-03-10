# STORY-0029 – Governance Migration Check

ID: STORY-0029-governance-migration-check  
Epic: QLTY-DOC-QA  
Status: Done  
Owner: @team/platform-arch  
Upstream: legacy governance archive snapshot’ları, docs/03-delivery/PROJECT-FLOW.md  
Downstream: AC-0029, TP-0029

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Legacy governance archive alanındaki story ve feature taleplerinin, yeni
  `docs/03-delivery/**` zincirine eksiksiz taşınıp taşınmadığını otomatik
  kontrol etmek.  
- Henüz yeni sisteme taşınmamış, ama önemli olan governance işleri için
  görünür bir “bekleyen işler” listesi üretmek.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Platform/mimari ekibi olarak, legacy governance archive kayıtlarının yeni
  STORY/AC/TP zincirine taşınıp taşınmadığını bilebilmek istiyoruz; böylece
  hiçbir önemli kalite/guideline işi sadece eski arşivde unutulmasın.
- Bir ai agent olarak, bu arşivden yola çıkarak hangi governance işler için
  yeni Story açılması gerektiğini otomatik önerebilmek istiyorum.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- Legacy governance feature request snapshot’ı  
- Legacy governance project flow snapshot’ı  
- Bu arşiv dokümanlarındaki E0x / QLTY-* story ve feature isteklerinin,
  `docs/03-delivery/PROJECT-FLOW.md` ve mevcut STORY/AC/TP seti ile
  karşılaştırılması.  
- Henüz taşınmamış governance maddelerinin “yeni STORY açılmalı” listesi
  olarak raporlanması.

Hariç:
- Gerçek iş önceliklendirme (hangi governance işi önce alınmalı?).  
- Governance içeriğinin güncellenmesi veya yeniden yazılması (ayrı story’ler
  ile ele alınabilir).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [x] Script, legacy FEATURE_REQUESTS / PROJECT_FLOW içindeki tüm governance
  maddelerini okur ve yeni PROJECT-FLOW içindeki Story satırları ile
  karşılaştırır.  
- [x] Yeni sisteme taşınmamış governance maddeleri için “önerilen yeni Story”
  listesi üretilir (ID önerisi ve kısa açıklama ile).  
- [x] Halihazırda yeni sisteme taşınmış maddeler, raporda “zaten taşındı”
  olarak işaretlenir; tekrar açılması önerilmez.  
- [x] Script çıktısı CI veya etkileşimli kullanımdan sonra kolayca
  STORY/AC/TP patch’lerine dönüştürülebilir.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- Legacy governance feature request snapshot’ı  
- Legacy governance project flow snapshot’ı  
- docs/03-delivery/PROJECT-FLOW.md  
- Mevcut governance ile ilişkili STORY/AC/TP dokümanları  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Bu Story ile legacy governance archive backlog’u ile yeni docs tabanlı
  Story sistemi arasında köprü kurulur.  
- Amaç, önemli governance/kalite işleri için tek ve güncel bir roadmap
  görünümü sağlamaktır.
- 2026-03-09 itibarıyla `python3 scripts/check_governance_migration.py`
  çıktısı `43/43 migrated, 0 unmigrated` sonucunu vermektedir; script ayrıca
  olası drift durumunda önerilen `STORY/AC/TP` zincirlerini üretecek şekilde
  güncellenmiştir.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Legacy governance archive input seti: `scripts/check_governance_migration.py`
- Story: docs/03-delivery/STORIES/STORY-0029-governance-migration-check.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0029-governance-migration-check.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0029-governance-migration-check.md`  
