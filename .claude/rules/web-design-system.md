---
globs: web/packages/design-system/**
---
# Design System Rules

- AG Grid 34.3.1 fully activated (enterprise features enabled)
- Token chain: CSS custom properties from design tokens
- Component pattern: forwardRef + displayName + TypeScript generics
- Peer dependencies: React 18 || 19 (library flexibility)
- Storybook stories for every public component
- a11y: WCAG 2.1 AA compliance, test with axe-core
- Theme: light/dark via CSS custom properties, prefers-color-scheme
- Export: named exports only, no default exports
