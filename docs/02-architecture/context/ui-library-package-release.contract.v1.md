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
- Release manifest

## Zorunlu Kanıt
- `doctor:frontend` PASS
- `gate:ui-library-release` PASS
- `design-lab.index.json` güncel
- `RELEASE-NOTES-ui-library.md` girişi var
- `ui-library-release-manifest.v1.json` üretilmiş
- `ui-library-release-gate.summary.v1.json` üretilmiş
- `RB-ui-library-package-release.md` linki var

## Fail-closed
- Version bump varsa release note olmadan tamam sayılmaz.
- Stable/breaking değişiklikte release gate PASS yoksa release hazır sayılmaz.
- `./library` expose etmeyen `mfe-ui-kit` remote release hazır sayılmaz.
- Release manifest olmadan publish bundle tamam sayılmaz.
