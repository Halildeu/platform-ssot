# TP-0050 – PR Bot Automation v0.1 Test Planı

ID: TP-0050  
Story: STORY-0050-pr-bot-automation-v0-1  
Status: Planned  
Owner: @team/ops

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- PR bot workflow’unun güvenli ve idempotent çalıştığını doğrulamak (PR create + comment upsert + draft policy).

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Lokal (dry-run):
  - Rule matching ve template seçimi
  - Marker prepend + yorum gövdesi üretimi
- CI (GitHub Actions):
  - `fix/**` ve `wip/**` push tetikleri
  - Minimum permissions (`GITHUB_TOKEN`) ve fallback token davranışı (varsa)

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Lokal doğrulama:
  - Dry-run ile ağ çağrısı yapmadan çıktıların kontrolü.
- CI doğrulama:
  - Branch’e push ile workflow run; PR URL ve step summary çıktısının gözlemlenmesi.
- Negatif senaryolar:
  - Yetki/403 durumunda anlamlı hata ve fallback token ile tekrar deneme (opsiyonel).

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Dry-run: `fix/check-story-links-help` rule → doğru template seçilir.  
- [ ] Dry-run: `wip/0049-docs` rule → doğru template seçilir, draft policy devreye girer.  
- [ ] Idempotency: aynı branch için tekrar çalıştırma duplicate comment üretmez.  
- [ ] CI: push sonrası workflow PR URL’i üretir ve marker comment upsert eder.  

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Python: 3.11 (GitHub Actions)
- GitHub CLI kullanılmadan stdlib HTTP çağrıları (tasarım)
- Kurallar: `docs/04-operations/PR-BOT-RULES.json`

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Öncelik: yetki/policy farkları (repo “Workflow permissions” read-only olabilir)
- Risk: `wip/**` draft conversion GraphQL permission ile kısıtlanabilir

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu plan, PR bot’un dry-run ve CI doğrulamasını kapsar.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: `docs/03-delivery/STORIES/STORY-0050-pr-bot-automation-v0-1.md`  
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0050-pr-bot-automation-v0-1.md`

