# UI Library Package Release Contract v1

Amaç: `mfe-ui-kit` için versiyonlama, changelog ve dağıtım kanıtını tek kontratta toplamak.

## Versiyonlama
- Kaynak: `web/packages/ui-kit/package.json`
- Şema: `semver`
- `major`: kırıcı API değişikliği
- `minor`: yeni component veya backward compatible capability
- `patch`: bugfix, a11y, preview/docs parity fix

## Dağıtım Hedefleri
- Module federation remote
- Publish bundle
- Storybook static
- Chromatic

## Zorunlu Kanıt
- `doctor:frontend` PASS
- `gate:ui-library-wave` PASS
- `design-lab.index.json` güncel
- `RELEASE-NOTES-ui-library.md` girişi var

## Fail-closed
- Version bump varsa release note olmadan tamam sayılmaz.
- Stable/breaking değişiklikte wave gate PASS yoksa release hazır sayılmaz.
