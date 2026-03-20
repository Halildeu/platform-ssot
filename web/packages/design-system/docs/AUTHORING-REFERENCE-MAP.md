# Authoring Reference Map

Canonical live references for each authoring profile in `@mfe/design-system`.

Use this file when the profile alone is not enough and you need a concrete example to mirror.

## Profiles

| Profile | Primary reference | Why |
|---|---|---|
| `display` | [Text.tsx](../src/primitives/text/Text.tsx) | Display-first primitive with clear size/variant structure and `forwardRef` use. |
| `interactive-access` | [Button.tsx](../src/primitives/button/Button.tsx) | Canonical access-aware interactive surface with guard/state wiring. |
| `field-shell` | [Input.tsx](../src/primitives/input/Input.tsx) | Canonical framed field control with shell, tone and controlled/uncontrolled support. |
| `composed` | [Combobox.tsx](../src/components/combobox/Combobox.tsx) | Higher-level composition with strong behavioral surface. |
| `overlay-modal` | [Dialog.tsx](../src/primitives/dialog/Dialog.tsx) | Canonical modal overlay with current dialog semantics. |
| `overlay-nonmodal` | [Popover.tsx](../src/primitives/popover/Popover.tsx) | Canonical non-modal overlay with selective overlay-engine adoption. |

## Supporting references

- Access-light interactive reference:
  - [SearchInput.tsx](../src/components/search-input/SearchInput.tsx)

- Native-form style control reference:
  - [Select.tsx](../src/primitives/select/Select.tsx)

- Slot / composability reference:
  - [Button.tsx](../src/primitives/button/Button.tsx)
  - [IconButton.tsx](../src/primitives/icon-button/IconButton.tsx)
  - [LinkInline.tsx](../src/primitives/link-inline/LinkInline.tsx)

- Overlay decision contract:
  - [OVERLAY-DECISIONS.md](./OVERLAY-DECISIONS.md)

- Client / server contract:
  - [SSR-RSC-BOUNDARY.md](./SSR-RSC-BOUNDARY.md)
  - [SERVER-CLIENT-MATRIX.md](./SERVER-CLIENT-MATRIX.md)

## Usage

Decision order:

1. Pick a profile from [COMPONENT-AUTHORING.md](./COMPONENT-AUTHORING.md)
2. Scaffold with that profile
3. Compare against the matching live reference here
4. Keep intentional deviations explicit in story/test/doc coverage
