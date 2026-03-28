---
name: Feature Request
about: Propose a new feature or enhancement for @mfe/design-system
title: "[Feature] <ComponentName>: brief description"
labels: enhancement, design-system
assignees: ""
---

## Component

<!-- Which component does this affect? Use "New Component" if proposing a new one. -->

**Type:** <!-- primitive | component -->
**Proposed path:** `src/primitives|components/<component-name>/`

## Problem Statement

<!-- What problem does this feature solve? Who is affected? -->

## Proposed Solution

<!-- Describe the API you envision. Include example usage: -->

```tsx
// Example usage
<MyComponent newProp="value" />
```

## Props API

<!-- If adding new props, describe them: -->

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
|      |      |         |             |

## Design Tokens

<!-- Does this feature require new CSS variables? List them: -->

- [ ] No new tokens needed
- [ ] New tokens needed (list below)

## Accessibility Considerations

<!-- How should this feature behave for: -->

- **Keyboard navigation:**
- **Screen readers:**
- **ARIA attributes:**

## Alternatives Considered

<!-- What other approaches did you consider? Why were they rejected? -->

## Acceptance Criteria

- [ ] Component renders correctly
- [ ] Props interface documented with JSDoc
- [ ] `displayName` set
- [ ] Tests with `expectNoA11yViolations`
- [ ] Access control (`access` prop) supported
- [ ] CSS variable tokens used (no hardcoded colors)
- [ ] Story added for Storybook
- [ ] `localeText` prop if component has visible text
