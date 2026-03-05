# 02-architecture

Bu klasör teknik tasarım ve sistem mimarisi dokümanlarını içerir.

Alt içerikler:
- context/            → AI için kanonik JSON bağlam paketi
- blueprints/         → yeni service / shared library / MFE üretim blueprint'leri
- context/ui-library-governance.contract.v1.json → UI kütüphanesi için kalite, risk, AI ve release yönetişim kontratı
- context/ui-library-governance.contract.v1.md → yönetişim kontratının insan okunur özeti
- context/ux-katalogu.reference.v1.json → UX Kataloğu yerel referans snapshot'ı
- context/ui-library-ux-alignment.v1.json → UI kütüphanesi ile UX Kataloğu eşleme kontratı
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
5. `context/ui-library-system.context.v1.json` (UI kit / Design Lab işi varsa)
6. `system-overview.v1.json`
7. `domain-map.v1.json`
8. `runtime/*.v1.json`
9. `blueprints/*.v1.json`
10. `INDEX.md`
11. `SYSTEM-OVERVIEW.md`
12. `DOMAIN-MAP.md`
13. `runtime/*.md`
14. `services/*`
15. `clients/*`

Kural:
- AI önce JSON kanonik katmanı okur.
- Markdown dosyalar açıklayıcı ikinci kaynak olarak kullanılır.
