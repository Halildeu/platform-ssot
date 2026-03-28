# Mobile Architecture

This workspace is structured to stay scalable as the mobile surface grows.

## Package boundaries

- `packages/mobile-tokens`
  Shared design tokens. Screens and shared UI do not hard-code colors, spacing, or typography.
- `packages/mobile-ui`
  Presentational primitives and reusable section-level UI.
- `packages/mobile-core`
  App-agnostic mobile logic, hooks, types, and service adapters.
- `app/`, `screens/`, `features/`
  App composition and feature delivery surface.

## Performance rules

- Shared UI packages stay presentational and use `memo` where it avoids avoidable rerenders.
- Heavy lists should use virtualized primitives such as `FlatList` or `SectionList`.
- IO stays in service modules; screens only compose data and UI.
- Style values come from shared tokens so theme changes stay cheap and centralized.
- Global state stays minimal; feature state lives near the feature.

## Maintenance rules

- Shared concerns move into `packages/*` first, not copied into screens.
- Feature code depends on package contracts, not on sibling feature internals.
- Device, network, notification, and storage access stay behind service helpers.
