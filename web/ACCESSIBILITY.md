# Accessibility Conformance

## Target Standard
This project targets **WCAG 2.1 Level AA** conformance.

## Testing Infrastructure
- **Automated**: axe-core integration in 117+ test files
- **Component-level**: @storybook/addon-a11y for visual a11y audit
- **E2E**: Playwright axe smoke tests
- **CI**: axe audit runs on every PR (blocking)
- **Keyboard**: Custom keyboard contract testing framework

## Coverage
- All interactive components tested for keyboard navigation
- All form components tested for label association
- Color contrast validated via design token system
- Focus management tested in overlays and modals

## Known Limitations
- RTL layout support: infrastructure present (DirectionProvider), not yet exercised with Arabic/Hebrew locales
- Screen reader testing: manual, not automated

## Reporting Issues
If you encounter an accessibility barrier, please file an issue with the `a11y` label.
