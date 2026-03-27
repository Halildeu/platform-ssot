# Component Deepening Matrix

Feature coverage for design-system components.

> Last updated: 2026-03-20 (F0 DONE, F1-F3 in progress)

## Primitives (23)

| Component   | Size | Density | stateAttrs | focusRing | a11y | Keyboard | Overlay | Contract Test | Level |
|-------------|:----:|:-------:|:----------:|:---------:|:----:|:--------:|:-------:|:-------------:|:-----:|
| Button      |  ✅  |   ✅    |     ✅     |    ✅     |  ✅  |    ⬜    |   ⬜    |    ✅ (17)    |  L3   |
| Checkbox    |  ✅  |   ✅    |     ✅     |    ⬜     |  ✅  |    ⬜    |   ⬜    |    ✅ (17)    |  L2   |
| Radio       |  ✅  |   ✅    |     ✅     |    ⬜     |  ✅  |    ⬜    |   ⬜    |    ✅ (17)    |  L2   |
| Input       |  ✅  |   ✅    |     ✅     |    ⬜     |  ✅  |    ⬜    |   ⬜    |    ✅ (15)    |  L2   |
| Select      |  ✅  |   ✅    |     ✅     |    ⬜     |  ✅  |    ✅    |   ⬜    |    ✅ (12)    |  L3   |
| Switch      |  ✅  |   ✅    |     ✅     |    ✅     |  ✅  |    ⬜    |   ⬜    |    ✅ (15)    |  L3   |
| Dialog      |  ✅  |   ⬜    |     ✅     |    ⬜     |  ✅  |    ✅    |   ✅    |    🔄        |  L3   |
| Modal       |  ⬜  |   ⬜    |     ✅     |    ⬜     |  ✅  |    ✅    |   ✅    |    🔄        |  L3   |
| Popover     |  ⬜  |   ⬜    |     ✅     |    ⬜     |  ✅  |    ✅    |   ✅    |    🔄        |  L3   |
| Tooltip     |  ⬜  |   ⬜    |     ✅     |    ⬜     |  ✅  |    ✅    |   ✅    |    🔄        |  L3   |
| Dropdown    |  ⬜  |   ⬜    |     ✅     |    ⬜     |  ✅  |    ✅    |   ⬜    |    🔄        |  L2   |
| Tabs        |  ✅  |   ✅    |     ✅     |    ✅     |  ✅  |    ✅    |   ✅    |    🔄        |  L4   |
| IconButton  |  ✅  |   ⬜    |     ✅     |    ✅     |  ✅  |    ⬜    |   ⬜    |    ⬜        |  L2   |
| Avatar      |  ✅  |   ⬜    |     ✅     |    ⬜     |  ✅  |    ⬜    |   ⬜    |    ⬜        |  L1   |
| Badge       |  ✅  |   ⬜    |     ✅     |    ⬜     |  ✅  |    ⬜    |   ⬜    |    ⬜        |  L1   |
| Tag         |  ✅  |   ⬜    |     ✅     |    ⬜     |  ✅  |    ⬜    |   ⬜    |    ⬜        |  L1   |
| Alert       |  ⬜  |   ⬜    |     ✅     |    ⬜     |  ✅  |    ⬜    |   ⬜    |    ⬜        |  L1   |
| Card        |  ⬜  |   ⬜    |     ✅     |    ⬜     |  ✅  |    ⬜    |   ⬜    |    ⬜        |  L1   |
| Spinner     |  ✅  |   ⬜    |     ✅     |    ⬜     |  ✅  |    ⬜    |   ⬜    |    ⬜        |  L1   |
| Skeleton    |  ⬜  |   ⬜    |     ✅     |    ⬜     |  ✅  |    ⬜    |   ⬜    |    ⬜        |  L1   |
| Divider     |  ⬜  |   ⬜    |     ⬜     |    ⬜     |  ✅  |    ⬜    |   ⬜    |    ⬜        |  L0   |
| Text        |  ⬜  |   ⬜    |     ⬜     |    ⬜     |  ✅  |    ⬜    |   ⬜    |    ⬜        |  L0   |
| LinkInline  |  ⬜  |   ⬜    |     ✅     |    ✅     |  ✅  |    ⬜    |   ⬜    |    ⬜        |  L1   |
| Stack       |  ⬜  |   ⬜    |     ⬜     |    ⬜     |  ⬜  |    ⬜    |   ⬜    |    ⬜        |  L0   |

## Components (selected)

| Component        | Contract Test | Keyboard | Visual |
|------------------|:-------------:|:--------:|:------:|
| Pagination       |      🔄       |    ⬜    |   ⬜   |
| Steps            |      🔄       |    ⬜    |   ⬜   |
| Breadcrumb       |      🔄       |    ⬜    |   ⬜   |
| DatePicker       |      🔄       |    ⬜    |   ⬜   |
| Combobox         |      🔄       |    ✅    |   ⬜   |
| Slider           |      🔄       |    ⬜    |   ⬜   |
| Rating           |      🔄       |    ⬜    |   ⬜   |
| SearchInput      |      🔄       |    ⬜    |   ⬜   |
| CommandPalette   |      ✅       |    ✅    |   ⬜   |
| NotificationDrawer |    ✅       |    ⬜    |   ⬜   |

## Foundation

| Module          | Isolation Test | Boundary Rule |
|-----------------|:--------------:|:-------------:|
| Tokens          |       ✅       |      ✅       |
| Headless (internal) |   ⬜       |      ✅       |
| Advanced        |       ⬜       |      ✅       |

## Level definitions

- **L0** — Layout/typography primitive, no interactive behaviour
- **L1** — Display primitive with stateAttrs and/or a11y
- **L2** — Form/interactive primitive with Size + Density + stateAttrs + a11y
- **L3** — Full interaction primitive (L2 + focusRingClass or Keyboard)
- **L4** — Composite component with overlay-engine integration

## Legend

- ✅ Done
- 🔄 In progress (being built by agents)
- ⬜ Not yet started
