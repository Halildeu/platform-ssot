# AC-0029 – Governance Migration Check Acceptance

ID: AC-0029  
Story: STORY-0029-governance-migration-check  
Status: Planned  
Owner: @team/platform-arch

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Legacy governance backlog’unun yeni Story/AC/TP sistemine eksiksiz ve
  izlenebilir şekilde taşındığını doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `backend/docs/legacy/root/05-governance/FEATURE_REQUESTS.md` ve
  `PROJECT_FLOW.md` içeriği.  
- `docs/03-delivery/PROJECT-FLOW.md` ve ilişkili STORY/AC/TP dokümanları.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – Taşınmamış governance maddeleri:
  - Given: Legacy FEATURE_REQUESTS / PROJECT_FLOW içinde bazı governance
    maddeleri vardır ve bunların yeni PROJECT-FLOW’da karşılığı yoktur.  
    When: Governance migration script’i (`check_governance_migration.py`)
    çalıştırılır.  
    Then: Bu maddeler “yeni STORY açılması gerekenler” listesinde, ID önerisi
    ve kısa açıklama ile raporlanır.

- [ ] Senaryo 2 – Zaten taşınmış maddeler:
  - Given: Bazı legacy governance maddeleri için yeni sistemde STORY-00xx /
    AC-00xx / TP-00xx dokümanları zaten açılmıştır.  
    When: Aynı script çalıştırılır.  
    Then: Bu maddeler “zaten taşındı” veya benzeri bir işaretle gösterilir;
    tekrar açılması önerilmez.

- [ ] Senaryo 3 – Boş legacy backlog:
  - Given: Legacy FEATURE_REQUESTS / PROJECT_FLOW tamamen tüketilmiş veya
    arşivlenmiştir.  
    When: Script yeniden çalıştırılır.  
    Then: Rapor “taşınmamış governance maddesi yok” sonucunu üretir.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Script’in yalnız “taşındı / taşınmadı” statüsünü kontrol etmesi, iş
  önceliği ve kapsam detayını insan / ürün ekiplerine bırakması beklenir.  
- Legacy dokümanlar tamamen silinmemeli, referans için `backend/docs/legacy`
  altında korunmalıdır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Governance migration script’i legacy backlog ile yeni Story sistemi
  arasında köprü kurar ve taşınmamış maddeleri güvenilir şekilde
  raporlayabiliyorsa bu acceptance tamamlanmış sayılır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0029-governance-migration-check.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0029-governance-migration-check.md  

