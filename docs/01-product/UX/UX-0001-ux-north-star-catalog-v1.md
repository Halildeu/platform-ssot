# UX-0001 - UX North Star Catalog v1

ID: UX-0001
Status: ACTIVE
Program: `ui_kutuphane_sistemi`

## Amac

UX kararlarini kisiden bagimsiz, olculebilir ve AI-assisted olarak standardize etmek.
Bu dokuman, policy + catalog + checklist zincirinin insan-okunur referans ozeti olarak tutulur.

## North Star

- Birincil metrik: `task_success_rate`
- Hedef: `>=0.90`
- Tasarim kontratlari:
  - Tek UI kutuphanesi (`mfe-ui-kit`)
  - Token tabanli gorsel sistem
  - Moduler sayfa kompozisyonu
  - Parametrik veri

## Domain Catalog (v1)

- `component_library_management`
- `design_token_management`
- `documentation_standards`
- `accessibility_compliance`
- `governance_contribution`
- `integration_distribution`
- `navigation_patterns`
- `overlay_components`
- `responsive_layout`
- `state_feedback`
- `table_data_display`
- `theming_customization`
- `utility_components`
- `visualization_charts`

## AI-assisted Istisare Modeli

- Canli model cagrisi policy ile kontrolludur (`KERNEL_API_LLM_LIVE` + provider guardrail)
- Istisare lensleri:
  - compliance_safety
  - task_success
  - clarity_cognitive_load
  - accessibility_inclusion
  - operations_observability
- Fallback sirasi: `reasoning -> fast_reasoning -> chat`

## Referanslar (North Star)

- W3C WCAG 2.2
- WAI-ARIA Authoring Practices
- NIST AI Risk Management Framework
- Google PAIR Guidebook
- Microsoft Human-AI Interaction Guidelines
- GOV.UK Design System
- Nielsen Norman Group Heuristics
- Apple Human Interface Guidelines
- Material Design 3

## Operasyon Komutu

- `python3 scripts/ops_ux_north_star_report.py --repo-root .`

Bu komut, policy ve catalog uyumunu tek raporda verir.
