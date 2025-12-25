# STORY-0311 – Ethics: Retaliation Check-in & Protection (MVP)

ID: STORY-0311-ethics-retaliation-checkin  
Epic: ETHICS-MVP  
Status: Design  
Owner: TBD  
Upstream: `PB-0004`, `PRD-0004`, `SPEC-0013`  
Downstream: AC-0311, TP-0311

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Misilleme korumasını süreç olarak işletilebilir hale getirmek:
  - kapanış sonrası 30/60/90 gün check-in (BM-0001-CTRL-GRD-005)
  - misilleme iddiasının ayrı vaka tipi olarak açılabilmesi (BM-0001-CTRL-GRD-006)

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir program sahibi olarak, kapanış sonrası check-in ve misilleme koruma akışını istiyorum; böylece misilleme riskleri görünür ve aksiyonlanabilir olur.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- Check-in zaman pencereleri ve minimum kayıt yaklaşımı.
- Misilleme iddiası “ayrı vaka tipi” politikası.

Hariç:
- Bildirim kanalı entegrasyonları (e-posta/SMS vb.).
- Legal/HR süreç detayları.

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given: `BM-0001-CTRL-GRD-005` vardır. When: kapanış sonrası check-in akışı incelenir. Then: 30/60/90 gün yaklaşımı net olmalıdır.
- [ ] Given: `BM-0001-CTRL-GRD-006` vardır. When: misilleme iddiası oluşur. Then: ayrı vaka tipi olarak açılabilmelidir (policy).
- [ ] Given: doc-qa gate seti çalıştırılır. When: `STORY-0311` zinciri doğrulanır. Then: PASS olmalıdır.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- `docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md`

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Misilleme check-in ve protection policy tanımlıdır.
- Zincir: `STORY-0311` ↔ `AC-0311` ↔ `TP-0311`.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- PRD: docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md
- SPEC: docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0311-ethics-retaliation-checkin.md
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0311-ethics-retaliation-checkin.md
