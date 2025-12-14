# TP-0011 – Release Safety & DR Guardrails Test Planı

ID: TP-0011  
Story: STORY-0011-release-safety-and-dr-guardrails
Status: Planned  
Owner: @team/ops

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Release safety ve DR guardrail’lerinin AC-0011’deki kriterlere uygun
  çalıştığını doğrulamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Canary rollout, feature flag ve rollback akışları.
- DR senaryolarında uygulanacak adımlar.

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Checkliste dayalı manuel doğrulama.
- Örnek release senaryosu üzerinden canary + rollback provası.

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Release safety checklist mutlu akış.  
- [ ] Canary rollout + rollback provası.  
- [ ] DR senaryosu için runbook uygulaması.  

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- CI/CD pipeline’ları, release notları ve log/monitoring panelleri.

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Rollback stratejisinin eksik olması kritik risk taşır.

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı release safety & DR guardrail standardının uygulanabilirliğini
  doğrular.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0011-release-safety-and-dr-guardrails.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0011-release-safety-and-dr-guardrails.md  

