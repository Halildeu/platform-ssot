# GUIDE-0007: documentation workflow

---
title: Documentation Workflow
status: draft
owner: "@team/platform-docs"
last_review: YYYY-MM-DD
---

## 1. Yazım Süreci
1. **Başlat** – İhtiyaca göre doğru şablonu (`docs/99-templates/*.template.md`) kopyala.
2. **Taslak** – Metadata (`status`, `owner`, `last_review`) alanlarını doldur, CODEOWNERS kapsamında reviewer ekle.
3. **Review** – PR’da teknik inceleme + doc incelemesi yapılır. Gerektiğinde RFC → ADR akışı izlenir.
4. **Yayınla** – Onay sonrası `status: published`, `last_review` güncellenir, ilgili index/roadmap’e link ekle.

## 2. Güncel Tutma
- **Doc hygiene**: Düzenli aralıklarla roadmap/ADR ve kritik runbook’lar gözden geçirilir; yeni modelde `docs/03-delivery/PROJECT-FLOW.md` + ilgili `docs/03-delivery/STORIES/*` ve `docs/03-delivery/ACCEPTANCE/*` kontrol edilir (geçiş sürecinde legacy backlog için `backend/docs/legacy/root/05-governance/FEATURE_REQUESTS.md` güncellenir).
- **Stale raporu**: CI pipeline’ına eklenecek script, 180 günden uzun süredir dokunulmayan kritik dokümanları raporlayacak.
- **Changelog**: Büyük kararlar ve release’ler `docs/03-delivery/guides/releases/` altında arşivlenir.

## 3. Kategoriler & Sahiplik
- Kategoriler `docs/00-handbook/DOCS-PROJECT-LAYOUT.md` içinde listelenmiştir.
- CODEOWNERS zorunlu reviewer belirler; onay olmadan merge edilmez.
- Ekip değişikliklerinde CODEOWNERS ve metadata güncellenmelidir.

## 4. Araçlar
- Markdown lint & broken link checker (CI guardrail)
- `npm run i18n:pull` / `i18n:pseudo` script’leri → i18n dokümanlarının güncelliği
- Backstage (planlanıyor) → Runbook ve servis dokümanlarının kataloglanması
- `docs/03-delivery/guides/GUIDE-0005-a11y-checklist.md` → SR/keyboard/kontrast checklist + axe smoke referansı

## 5. Sık Sorulanlar
- **Yeni kategori gerekli mi?** Yeni bir ihtiyacı önce uygun Story altında takip et; yalnızca doküman kategorisi ekleme ihtiyacı varsa geçiş sürecinde `backend/docs/legacy/root/05-governance/FEATURE_REQUESTS.md` içine ekle, hygiene toplantısında karar verelim.
- **Dokümanı kim güncelleyecek?** Metadata `owner` alanı sorumludur; yoksa CODEOWNERS’daki ekip devralır.
- **Stale gördüm, PR açacak vaktim yok.** Uygun Story yoksa geçiş sürecinde `backend/docs/legacy/root/05-governance/FEATURE_REQUESTS.md` satırı ekleyip “help wanted” notu bırak.

## 6. Permission Registry Guardrail’i
`backend/docs/legacy/root/05-governance/permission-registry/permissions.registry.json` tek kaynaktır (geçiş sürecinde). Güncelleme akışında şu adımlar zorunludur:

1. JSON dosyasını güncelledikten sonra `node scripts/permissions/generate-frontend-permission-registry.mjs` komutu ile Access MFE’ye ait `permissionRegistry.generated.ts` dosyasını yeniden üret. Bu dosya commit’te yer almalıdır.
2. `node scripts/permissions/validate-permission-registry.mjs` komutu ile manifest/permission constant senkronunu doğrula (CI aynı komutu çalıştırır, PR öncesi lokale almak hatayı erken yakalar).
3. Registry değişikliği Access MFE veya ilgili runbook’ı etkiliyorsa Story/Acceptance referanslarını güncelle ve session-log’a kayıt düş.
4. PR açıklamasına “Permission registry güncellendi, generator + validator çalıştırıldı” notunu ekle (PR şablonuna yeni checkbox eklendi).

1. AMAÇ
TBD

2. KAPSAM
TBD

3. KAPSAM DIŞI
TBD

4. BAĞLAM / ARKA PLAN
TBD

5. ADIM ADIM (KULLANIM)
TBD

6. SIK HATALAR / EDGE-CASE
TBD

7. LİNKLER
TBD
