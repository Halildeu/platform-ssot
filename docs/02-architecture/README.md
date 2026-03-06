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
- context/ui-library-wave-1-foundation-primitives.v1.json → ilk component dalgasi icin component bazli execution contract
- context/ui-library-wave-1-foundation-primitives.v1.md → ilk dalganin insan okunur ozeti
- context/ui-library-system.context.v1.json → UI kit / Design Lab geliştirme kontratı
- blueprints/ui-library-system-blueprint.v1.json → yeni ortak component üretim blueprint'i
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
6. `context/ui-library-wave-1-foundation-primitives.v1.json` (aktif wave bu ise)
7. `context/ui-library-system.context.v1.json` (UI kit / Design Lab işi varsa)
8. `system-overview.v1.json`
9. `domain-map.v1.json`
10. `runtime/*.v1.json`
11. `blueprints/*.v1.json`
12. `INDEX.md`
13. `SYSTEM-OVERVIEW.md`
14. `DOMAIN-MAP.md`
15. `runtime/*.md`
16. `services/*`
17. `clients/*`

Kural:
- AI önce JSON kanonik katmanı okur.
- Markdown dosyalar açıklayıcı ikinci kaynak olarak kullanılır.
