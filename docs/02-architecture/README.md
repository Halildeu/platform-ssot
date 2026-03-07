# 02-architecture

Bu klasör teknik tasarım ve sistem mimarisi dokümanlarını içerir.

Alt içerikler:
- context/            → AI için kanonik JSON bağlam paketi
- blueprints/         → yeni service / shared library / MFE üretim blueprint'leri
- context/ui-library-governance.contract.v1.json → UI kütüphanesi için kalite, risk, AI ve release yönetişim kontratı
- context/ui-library-governance.contract.v1.md → yönetişim kontratının insan okunur özeti
- context/ux-katalogu.reference.v1.json → UX Kataloğu yerel referans snapshot'ı
- context/ui-library-ux-alignment.v1.json → UI kütüphanesi ile UX Kataloğu eşleme kontratı
- context/ui-library-component-roadmap.v1.json → component family matrix, maturity hedefi ve release wave planı
- context/ui-library-component-roadmap.v1.md → roadmap özet görünümü
- context/ui-library-wave-1-foundation-primitives.v1.json → tamamlanan foundation dalgasi icin execution contract
- context/ui-library-wave-1-foundation-primitives.v1.md → foundation dalgasinin insan okunur ozeti
- context/ui-library-wave-2-navigation.v1.json → tamamlanan navigation dalgasi icin execution contract
- context/ui-library-wave-2-navigation.v1.md → navigation dalgasinin insan okunur ozeti
- context/ui-library-wave-3-forms.v1.json → aktif forms dalgasi icin component bazli execution contract
- context/ui-library-wave-3-forms.v1.md → forms dalgasinin insan okunur ozeti
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
3. `context/ux-katalogu.reference.v1.json` (UI kit / Design Lab işi varsa)
4. `context/ui-library-ux-alignment.v1.json` (UI kit / Design Lab işi varsa)
5. `context/ui-library-component-roadmap.v1.json` (UI kit / Design Lab işi varsa)
6. `context/ui-library-wave-3-forms.v1.json` (aktif wave bu ise)
7. `context/frontend-diagnostics.registry.v1.json` (UI kit / vitrin / route stabilitesi işi varsa)
8. `context/backend-diagnostics.registry.v1.json` (backend runtime / smoke / health işi varsa)
9. `context/business-journey-e2e-matrix.v1.json` (katalog bazlı gerçek iş akışı smoke konuşuluyorsa)
10. `context/security-remediation.contract.v1.json` (security remediation / CVE / release guardrail işi varsa)
11. `context/live-release-provisioning.contract.v1.json` (canary / DAST / provisioning işi varsa)
12. `context/autonomous-delivery-gap-assessment.v1.json` (insansız teslimat / tam otonomi hedefi konuşuluyorsa)
13. `context/ui-library-system.context.v1.json` (UI kit / Design Lab işi varsa)
14. `system-overview.v1.json`
15. `domain-map.v1.json`
16. `runtime/*.v1.json`
17. `blueprints/*.v1.json`
18. `INDEX.md`
19. `SYSTEM-OVERVIEW.md`
20. `DOMAIN-MAP.md`
21. `runtime/*.md`
22. `services/*`
23. `clients/*`

Kural:
- AI önce JSON kanonik katmanı okur.
- Markdown dosyalar açıklayıcı ikinci kaynak olarak kullanılır.
