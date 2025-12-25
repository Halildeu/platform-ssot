# RB-codex-canonical-flow-v0.1 – Kanonik Codex Akışı (Happy Path)

ID: RB-codex-canonical-flow-v0.1  
Service: ops-local  
Status: Draft  
Owner: @team/platform

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Codex ile çalışırken “happy path” adımlarını standartlaştırmak.
- Hedef: daha az gürültü, daha yüksek kanıt (evidence), daha az sapma.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Repo: `Halildeu/platform-ssot`
- Kapsam: Codex ile yapılan local iş akışı (planlama, doküman/skript değişikliği, gate, commit/push).
- Dış kapsam:
  - CI fail → log-digest → local autopilot gibi “failure loop” (ayrı runbook’ta standardize edilecek).

-------------------------------------------------------------------------------
3. BAŞLATMA / DURDURMA
-------------------------------------------------------------------------------

### 3.1 Kanonik Happy Path (v0.1)
1) **WORK LOG – UI Mirror**
   - `Ran/Edited/Reviewed/Considering` satırları ile yapılan işleri ham şekilde yansıt.

2) **Local Gate (Zorunlu)**
   - `python3 scripts/run_doc_qa_execution_log_local.py --out-dir .autopilot-tmp/execution-log`

3) **RESULT**
   - “Ne çıktı?” (1–5 madde, geçmiş zaman).

4) **EVIDENCE POINTERS**
   - `gate: PASS|FAIL`
   - `execution_log: .autopilot-tmp/execution-log/execution-log.md`
   - `chatlog: .autopilot-tmp/codex-chatlog/latest.md` veya `.autopilot-tmp/codex-chatlog/YYYYMMDD.md`
   - varsa: `branch`, `sha`, `commit`, `pr`

5) **Uygulanan Değişiklikler**
   - `dosya:line — ... eklendi/güncellendi/hizalandı` (emir kipi yok).

6) **NEXT**
   - Yoksa: `NEXT: none`
   - Varsa: 1–5 gerçek iş maddesi

7) **Publish**
   - `git commit` + `git push` (+ gerekiyorsa PR).

### 3.2 Durdurma
- Bu akış “local-only”dir; özel bir stop adımı yoktur.
- Local çıktıları temizlemek için (opsiyonel): `.autopilot-tmp/` altındaki dizinler silinebilir (gitignored).

-------------------------------------------------------------------------------
4. GÖZLEMLEME / LOG / METRİKLER
-------------------------------------------------------------------------------

- Local gate kanıtı:
  - `.autopilot-tmp/execution-log/execution-log.md`
  - `.autopilot-tmp/execution-log/checks.json`
- Local chat transcript:
  - `.autopilot-tmp/codex-chatlog/latest.md`
  - `.autopilot-tmp/codex-chatlog/YYYYMMDD.md`
- Process mining (local, gitignored):
  - `python3 scripts/ops/analyze_codex_flow.py --days 7`
  - Çıktılar:
    - `.autopilot-tmp/flow-mining/flow-report.md`
    - `.autopilot-tmp/flow-mining/flow-stats.json`

-------------------------------------------------------------------------------
5. ARIZA DURUMLARI VE ADIMLAR
-------------------------------------------------------------------------------

- [ ] Arıza senaryosu 1 – Gate FAIL
  - Given: `EVIDENCE POINTERS` içinde `gate: FAIL`
  - When: `.autopilot-tmp/execution-log/execution-log.md` içinde failing check görülür
  - Then:
    1) İlk failing check’in log’unu aç: `.autopilot-tmp/execution-log/raw/*`
    2) Hedefli düzeltmeyi yap (docs/scripts).
    3) Local gate’i tekrar koş: `python3 scripts/run_doc_qa_execution_log_local.py --out-dir .autopilot-tmp/execution-log`

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- Standart akış: WORK LOG → local gate → RESULT → EVIDENCE → change-log → NEXT → commit/push.
- Kanıt dosyaları repoya girmez: `.autopilot-tmp/**` gitignored.

-------------------------------------------------------------------------------
7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- SSOT: `AGENT-CODEX.core.md`
- Runbook: `docs/04-operations/RUNBOOKS/RB-codex-chat-transcript.md`
- Script: `scripts/run_doc_qa_execution_log_local.py`
- Script: `scripts/ops/analyze_codex_flow.py`
- Local outputs:
  - `.autopilot-tmp/execution-log/execution-log.md`
  - `.autopilot-tmp/flow-mining/flow-report.md`

