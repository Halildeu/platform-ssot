# TP-0005 – Codex Doküman/Context Kullanımı Test Planı

ID: TP-0005  
Story: (genel kalite iyileştirme)  
Status: Planned  
Owner: @team/docs

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Codex’in doküman mimarisini (00–05 + 99-templates) **parça parça** okuyarak,
  token limitine takılmadan, uçtan uca bir işi yürütebildiğini doğrulamak.
- Tüm iş tipleri ([DOC], [BE], [WEB], [AI], [DATA], [OPS]) için:
  - Doğru canonical ve current dokümanları bulup,
  - Doğru sırayla okuyup,
  - STORY/AC/TP/RUNBOOK/RELEASE-NOTES zinciriyle uyumlu çalıştığını görmek.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- `AGENTS.md`
- `docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md`
- `docs/01–05/**`
- `docs/99-templates/**`
- Transition rehberleri yalnız authority map gerekli görürse
- Örnek Story zincirleri:
  - STORY-0001…0006 + ilgili AC / TP / RUNBOOK / RELEASE-NOTES

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Her iş tipi için (DOC/BE/WEB/AI/DATA/OPS) en az bir “senaryo” seçilir.
- Senaryo için:
  - İlgili STORY / AC / TP / TECH-DESIGN / RUNBOOK dosyaları **tek seferde
    değil**, ihtiyaç oldukça prompt’ta referans verilerek kullanılır.
  - Codex’in:
    - Doğru dosya yollarını takip edip etmediği,
    - PROJECT-FLOW ve ACCEPTANCE statülerini doğru yorumlayıp yorumlamadığı,
    - Gereksiz tüm repo’yu okumadan, sadece ilgili dokümanlara odaklanıp
      odaklanmadığı gözlenir.

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

### 4.1 [DOC] – Doküman Üretimi

- Senaryo:
  - Yeni bir doküman türü veya rehber tasarımı.
- Adımlar:
  1. Prompt’ta şu dosyaları ver:
     - `AGENTS.md`
     - `docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md`
     - `docs/03-delivery/PROJECT-FLOW.md`
     - `docs/99-templates/`
  2. Codex’ten belirli bir doküman taslağı iste (örn. yeni bir GUIDE).
  3. Kontrol:
     - Doğru ID formatını kullanıyor mu?
     - Doğru klasörü seçiyor mu?
     - Cevap formatı: Keşif Özeti / Tasarım / Uygulama Adımları mı?

### 4.2 [BE] – Backend Story Zinciri

- Senaryo:
  - STORY-0001 veya STORY-0002 üzerinden backend işi yürütmek.
- Adımlar:
  1. Prompt’ta ver:
     - `AGENTS.md`
     - `docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md`
     - İlgili STORY / AC / TP (örn. `STORY-0002`, `AC-0002`, `TP-0003`)
  2. Codex’ten:
     - “Bu Story şu an hangi aşamada, sıradaki mantıklı adım ne?” diye sor.
  3. Kontrol:
     - PROJECT-FLOW’daki satırı doğru okuyor mu?
     - AC/TP içindeki checkbox’lara göre durumu doğru yorumluyor mu?

### 4.3 [WEB] – Frontend Dokümanları

- Senaryo:
  - `web/docs/**` altındaki bir rehberi kullanarak iş akışı tasarlatmak.
- Adımlar:
  1. Prompt’ta ver:
     - `AGENTS.md`
     - `docs/02-architecture/clients/WEB-ARCH.md`
     - `web/docs/architecture/frontend/frontend-project-layout.md`
  2. `web/docs/architecture/frontend/frontend-project-layout.md` referansıyla
     basit bir görev iste.
  3. Kontrol:
     - Codex, backend `docs/` ile frontend `web/docs/` ayrımını doğru yapıyor mu?
     - Yalnız ilgili dosyaları okuyup yorumluyor mu?

### 4.4 [OPS] – Runbook + Monitoring + Release Notes

- Senaryo:
  - Vault veya Keycloak ile ilgili küçük bir operasyonel değişiklik planı.
- Adımlar:
  1. Prompt’ta ver:
     - `docs/04-operations/RUNBOOKS/RB-vault.md`
     - `docs/04-operations/MONITORING/MONITORING-backend-services.md`
     - `docs/04-operations/SLO-SLA.md`
     - `docs/04-operations/RELEASE-NOTES/RELEASE-NOTES-example.md`
  2. Codex’ten:
     - “Yeni bir küçük vault bakım story’si ve acceptance taslağı çıkar” iste.
  3. Kontrol:
     - SLO-SLA ve MONITORING-CD ilişkisinden doğru özet yapıyor mu?
     - Runbook’tan doğru parçaları çekiyor mu?

-------------------------------------------------------------------------------
5. BEKLENEN ÇIKTILAR
-------------------------------------------------------------------------------

- Codex, her senaryoda:
  - Gereksiz dosyaları okumadan, sadece referans verilen dokümanlarla çalışır.
  - Doküman ID ve klasör seçimlerinde canonical/current kaynaklarla uyumlu davranır.
  - PROJECT-FLOW ve ACCEPTANCE/TP statülerini doğru okur.

-------------------------------------------------------------------------------
6. SONUÇLARIN KAYDI
-------------------------------------------------------------------------------

- Her senaryo için:
  - Kullanılan prompt (özet)
  - Codex çıktısının kısa özeti
  - Gözlenen başarı/eksik noktalar
  `docs/03-delivery/TEST-PLANS/` altındaki bu dosyaya veya ayrı bir not
  dokümanına not edilebilir.
