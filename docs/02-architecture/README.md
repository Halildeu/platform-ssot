# 02-architecture

Bu klasör teknik tasarım ve sistem mimarisi dokümanlarını içerir.

Alt içerikler:
- context/            → AI için kanonik JSON bağlam paketi
- blueprints/         → yeni service / shared library / MFE üretim blueprint'leri
- context/ui-library-governance.contract.v1.json → UI kütüphanesi için kalite, risk, AI ve release yönetişim kontratı
- context/ui-library-governance.contract.v1.md → yönetişim kontratının insan okunur özeti
- context/ui-library-typography.contract.v1.json → semantic typography dili ve readability kontratı
- context/ui-library-typography.contract.v1.md → typography kontratının insan okunur özeti
- context/ui-library-iconography.contract.v1.json → resmi icon dili ve semantik ikon kullanımı kontratı
- context/ui-library-iconography.contract.v1.md → iconography kontratının insan okunur özeti
- context/ui-library-motion.contract.v1.json → motion token, reduced-motion ve overlay hareket kontratı
- context/ui-library-motion.contract.v1.md → motion kontratının insan okunur özeti
- context/ui-library-responsive-layout.contract.v1.json → breakpoint, density ve page/layout shell kontratı
- context/ui-library-responsive-layout.contract.v1.md → responsive/layout kontratının insan okunur özeti
- context/ui-library-adoption-enforcement.contract.v1.json → ui-kit-first tüketim ve enforcement kontratı
- context/ui-library-adoption-enforcement.contract.v1.md → adoption/enforcement kontratının insan okunur özeti
- context/ui-library-theme-preset-catalog.v1.json → resmi theme preset kataloğu
- context/ui-library-theme-preset-catalog.v1.md → theme preset kataloğunun insan okunur özeti
- context/ui-library-recipe-system.contract.v1.json → reusable ekran/panel recipe sistemi kontratı
- context/ui-library-recipe-system.contract.v1.md → recipe sistemi kontratının insan okunur özeti
- context/ux-katalogu.reference.v1.json → UX Kataloğu yerel referans snapshot'ı
- context/ui-library-ux-alignment.v1.json → UI kütüphanesi ile UX Kataloğu eşleme kontratı
- context/ui-library-component-roadmap.v1.json → component family matrix, maturity hedefi ve release wave planı
- context/ui-library-component-roadmap.v1.md → roadmap özet görünümü
- context/ui-library-page-block-library.contract.v1.json → hazır page/block ailesi için ürünleşme kontratı
- context/ui-library-page-block-library.contract.v1.md → page/block kontratının insan okunur özeti
- context/ui-library-package-release.contract.v1.json → ui-kit versiyonlama ve dağıtım kontratı
- context/ui-library-package-release.contract.v1.md → versiyonlama/dağıtım kontratının insan okunur özeti
- context/ui-library-wave-1-foundation-primitives.v1.json → tamamlanan foundation dalgasi icin execution contract
- context/ui-library-wave-1-foundation-primitives.v1.md → foundation dalgasinin insan okunur ozeti
- context/ui-library-wave-2-navigation.v1.json → tamamlanan navigation dalgasi icin execution contract
- context/ui-library-wave-2-navigation.v1.md → navigation dalgasinin insan okunur ozeti
- context/ui-library-wave-5-overlay.v1.json → tamamlanan overlay dalgasi icin component bazli execution contract
- context/ui-library-wave-5-overlay.v1.md → overlay dalgasinin insan okunur ozeti
- context/ui-library-wave-6-ai-native-helpers.v1.json → tamamlanan AI helper dalgasi icin execution contract
- context/ui-library-wave-6-ai-native-helpers.v1.md → AI helper dalgasinin insan okunur ozeti
- context/ui-library-wave-7-page-blocks.v1.json → page/block library dalgasi icin execution contract
- context/ui-library-wave-7-page-blocks.v1.md → page/block library dalgasinin insan okunur ozeti
- context/ui-library-wave-9-foundation-language.v1.json → foundation language lock dalgasi
- context/ui-library-wave-9-foundation-language.v1.md → foundation language dalgasinin insan okunur ozeti
- context/ui-library-wave-10-theme-presets.v1.json → theme preset katalog dalgasi
- context/ui-library-wave-10-theme-presets.v1.md → theme preset dalgasinin insan okunur ozeti
- context/ui-library-wave-11-recipes.v1.json → recipe sistem dalgasi
- context/ui-library-wave-11-recipes.v1.md → recipe sistem dalgasinin insan okunur ozeti
- context/frontend-diagnostics.registry.v1.json → frontend debug/smoke/telemetry control plane kaydı
- context/frontend-diagnostics.registry.v1.md → diagnostics registry insan okunur özeti
- context/backend-diagnostics.registry.v1.json → backend runtime health/smoke/log triage control plane kaydı
- context/backend-diagnostics.registry.v1.md → backend diagnostics registry insan okunur özeti
- context/business-journey-e2e-matrix.v1.json → route smoke ötesinde görev tamamlama zincirini koruyan journey matrisi
- context/business-journey-e2e-matrix.v1.md → business journey matrisinin insan okunur özeti
- context/security-remediation.contract.v1.json → bloklayici CVE kapatma ve governed residual risk kontrati
- context/security-remediation.contract.v1.md → security remediation kontratinin insan okunur ozeti
- context/live-release-provisioning.contract.v1.json → live canary ve DAST provisioning/fail-closed kontrati
- context/live-release-provisioning.contract.v1.md → live provisioning kontratinin insan okunur ozeti
- context/autonomous-delivery-gap-assessment.v1.json → insansız teslimat için hazır/kısmi/eksik halkaların kanonik gap matrisi
- context/autonomous-delivery-gap-assessment.v1.md → gap assessment insan okunur özeti
- context/orchestrator-adoption-bridge.v1.json → managed repo platform tabanının orchestrator'a taşınma köprüsü
- context/ui-library-system.context.v1.json → UI kit / Design Lab geliştirme kontratı
- blueprints/ui-library-system-blueprint.v1.json → yeni ortak component üretim blueprint'i
- ../04-operations/RUNBOOKS/RB-frontend-doctor.md → lokal frontend doctor çalışma kartı
- ../04-operations/RUNBOOKS/RB-backend-doctor.md → lokal backend doctor çalışma kartı
- system-overview.v1.json → makinece okunur sistem özeti
- domain-map.v1.json  → makinece okunur domain / bounded context haritası
- SYSTEM-OVERVIEW.md  → genel mimari üst bakış
- DOMAIN-MAP.md       → domain / bounded context haritası
- INDEX.md            → çalışan sistemin gerçek mimarisi, drift alanları ve gelecek baseline'ı
- runtime/            → iletişim, secret ve runtime bağımlılık matrisleri
- services/           → servis bazlı TECH-DESIGN, DATA-MODEL, ADR dokümanları
- clients/            → WEB-ARCH, MOBILE-ARCH, AI-ARCH vb.

Amaç: “Nasıl yapıyoruz?” sorusuna cevap vermektir.

Okuma sırası:
1. `context/repo-context-pack.v1.json`
2. `context/ui-library-governance.contract.v1.json` (UI kit / Design Lab işi varsa)
3. `context/ui-library-typography.contract.v1.json` (UI foundation dili işi varsa)
4. `context/ui-library-iconography.contract.v1.json` (ikon sistemi işi varsa)
5. `context/ui-library-motion.contract.v1.json` (motion/reduced-motion işi varsa)
6. `context/ui-library-responsive-layout.contract.v1.json` (responsive/layout shell işi varsa)
7. `context/ui-library-adoption-enforcement.contract.v1.json` (zorunlu tuketim/enforcement isi varsa)
8. `context/ui-library-theme-preset-catalog.v1.json` (theme preset isi varsa)
9. `context/ui-library-recipe-system.contract.v1.json` (page/panel recipe isi varsa)
10. `context/ux-katalogu.reference.v1.json` (UI kit / Design Lab işi varsa)
11. `context/ui-library-ux-alignment.v1.json` (UI kit / Design Lab işi varsa)
12. `context/ui-library-component-roadmap.v1.json` (UI kit / Design Lab işi varsa)
13. `context/ui-library-page-block-library.contract.v1.json` (page/block compositeleri konusu varsa)
14. `context/ui-library-package-release.contract.v1.json` (versiyonlama / dağıtım konusu varsa)
15. `context/ui-library-wave-11-recipes.v1.json` (aktif phase bu ise)
16. `context/frontend-diagnostics.registry.v1.json` (UI kit / vitrin / route stabilitesi işi varsa)
17. `context/backend-diagnostics.registry.v1.json` (backend runtime / smoke / health işi varsa)
18. `context/business-journey-e2e-matrix.v1.json` (katalog bazlı gerçek iş akışı smoke konuşuluyorsa)
19. `context/security-remediation.contract.v1.json` (security remediation / CVE / release guardrail işi varsa)
20. `context/live-release-provisioning.contract.v1.json` (canary / DAST / provisioning işi varsa)
21. `context/autonomous-delivery-gap-assessment.v1.json` (insansız teslimat / tam otonomi hedefi konuşuluyorsa)
22. `context/ui-library-system.context.v1.json` (UI kit / Design Lab işi varsa)
23. `system-overview.v1.json`
24. `domain-map.v1.json`
25. `runtime/*.v1.json`
26. `blueprints/*.v1.json`
27. `INDEX.md`
28. `SYSTEM-OVERVIEW.md`
29. `DOMAIN-MAP.md`
30. `runtime/*.md`
31. `services/*`
32. `clients/*`

Kural:
- AI önce JSON kanonik katmanı okur.
- Markdown dosyalar açıklayıcı ikinci kaynak olarak kullanılır.
