# UI Library Governance Contract v1

Bu dosya insan okunur özet görünümüdür. Kanonik kaynak:
`docs/02-architecture/context/ui-library-governance.contract.v1.json`

## Amaç

`mfe-ui-kit` paketini sistemin tek modern, yalın, performanslı, ölçeklenebilir, AI uyumlu ve kurumsal UI kütüphanesi olarak yönetmek.

## Mimari sahiplik

- Görsel SSOT: `web/design-tokens/**`
- Component katmanı: `web/packages/ui-kit`
- Canlı preview: `web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx`
- İkincil dokümantasyon: `web/.storybook` + `web/stories`
- Theme runtime sahibi: `web/packages/ui-kit/src/runtime/theme-controller.ts`
- Theme persistence sahibi: `variant-service`
- HTTP sahibi: `web/packages/shared-http`
- UX standart kaynağı: `ux_katalogu` → yerel referans `docs/02-architecture/context/ux-katalogu.reference.v1.json`
- UI library ↔ UX eşleme kaynağı: `docs/02-architecture/context/ui-library-ux-alignment.v1.json`
- Component roadmap kaynağı: `docs/02-architecture/context/ui-library-component-roadmap.v1.json`

## Temel ilkeler

- Token-first
- UI-kit-first
- Preview-first
- JSON-first
- Fail-closed gates
- Deterministic demos
- Measure before release

## Tailwind kararı

- Tailwind tasarım sistemi değildir.
- Tailwind render/layout yardımcı katmandır.
- Ortak primitive ve composite yalnız `packages/ui-kit` içinde doğar.
- `apps/**` yalnız composition ve page layout katmanıdır.
- Raw color class yasaktır.
- Ant Design ve Material UI runtime dependency olarak eklenmez; yalnız benchmark olarak kullanılır.

## UX Kataloğu zorunluluğu

- Tasarım kütüphanesi `ux_katalogu` standartlarına göre üretilir.
- Yeni veya değişen ortak component en az bir primary UX theme/subtheme kararına bağlanır.
- Component family’leri `ui-library-ux-alignment.v1.json` ile UX tema setlerine eşlenir.
- UX alignment olmadan ortak component release edilmez.

## Release zinciri

Bir ortak component tamamlanmış sayılmadan önce şu zincir kapanır:

1. governance contract
2. ui-library-system context
3. component registry
4. taxonomy
5. component source
6. preview
7. tests
8. release evidence

## Maturity modeli

- `planned`: registry var, export yok
- `beta`: export + preview + test var
- `stable`: adoption + regression evidence var
- `deprecated`: replacement ve migration path var

## Zorunlu kapılar

- `python3 scripts/check_ui_library_governance_contract.py`
- `python3 scripts/check_ui_library_ux_alignment.py`
- `python3 scripts/check_ui_library_component_roadmap.py`
- `npm -C web run designlab:index`
- `npm -C web run lint:tailwind`
- `npm -C web run lint:no-antd`
- `npm -C web run test:ui-kit`

## Kalite başlıkları

Kontrat şu başlıklar için zorunlu kural + ölçüm tanımlar:

- kalite_dogruluk
- deterministiklik_tekrarlanabilirlik
- gozlemlenebilirlik_izleme_olcme
- entegrasyon_birlikte_calisabilirlik
- uygunluk_risk_guvence_kontrol
- sureklilik_dayaniklilik
- olceklenebilirlik
- maliyet_verimlilik_kaynak
- ai_otomasyon
- baglam_uyum
- paydas_memnuniyeti_deger
- surdurulebilirlik_esg_isg_etik
- surec_etkinligi_olgunluk
- zaman_hiz_ceviklik
- guvenlik
- gizlilik

## AI çalışma sırası

Koddan önce şu sıra okunur:

1. `repo-context-pack.v1.json`
2. `ui-library-governance.contract.v1.json`
3. `ux-katalogu.reference.v1.json`
4. `ui-library-ux-alignment.v1.json`
5. `ui-library-component-roadmap.v1.json`
6. `ui-library-system.context.v1.json`
7. `ui-library-system-blueprint.v1.json`
8. `STYLE-WEB-001.md`
9. `component-registry.v1.json`

## Yasak hareketler

- `apps/**` altında ortak primitive üretmek
- registry güncellemeden export eklemek
- preview olmayan ortak component release etmek
- token dışı görsel karar eklemek
- UX alignment kararı olmadan ortak component oluşturmak
- parallel local theme persistence katmanı kurmak
