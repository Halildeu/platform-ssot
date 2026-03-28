# Screen Reader Test Matrix

> Accessibility conformance matrix: 10 components x 3 screen readers x 3 browsers.
> Target: WCAG 2.1 AA compliance across all combinations.

## Components Under Test

| # | Component | Key A11y Concern |
|---|---|---|
| 1 | Button | Role, disabled state, loading announcement |
| 2 | Select | Listbox pattern, option selection, filtering |
| 3 | Dialog | Focus trap, close announcement, modal role |
| 4 | Tabs | Tab/tabpanel association, arrow key navigation |
| 5 | Accordion | Expanded/collapsed state, heading level |
| 6 | DataGrid | Grid role, column headers, row selection, sort |
| 7 | DatePicker | Calendar grid navigation, date announcement |
| 8 | Menu | Menu/menuitem roles, sub-menu expansion |
| 9 | Toast | Live region announcement, auto-dismiss timing |
| 10 | Form | Label association, error message binding, required |

## Screen Readers

| Screen Reader | Platform | Version Tested |
|---|---|---|
| VoiceOver | macOS Sonoma+ | Built-in |
| NVDA | Windows 10/11 | 2024.4+ |
| TalkBack | Android 13+ | Built-in |

## Browser Matrix

| | Chrome | Firefox | Safari/WebView |
|---|---|---|---|
| **VoiceOver** | macOS Chrome | macOS Firefox | macOS Safari |
| **NVDA** | Windows Chrome | Windows Firefox | — |
| **TalkBack** | Android Chrome | — | Android WebView |

Total test combinations: **10 components x 7 active cells = 70 test scenarios**

## Test Criteria

Each component/SR/browser combination is evaluated against five criteria:

### 1. Focus Order
- Tab key moves focus in logical DOM order
- No focus traps (except intentional: Dialog, Menu)
- Focus indicator is visible (minimum 2px outline, 3:1 contrast)
- Focus returns to trigger element on close (Dialog, Menu, DatePicker)

### 2. Role Announcement
- Correct ARIA role is announced (e.g., "button", "dialog", "grid")
- Component name/label is announced on focus
- Group roles are announced where applicable (toolbar, radiogroup)

### 3. State Changes
- Expanded/collapsed states announced (Accordion, Menu, Select)
- Selected/checked states announced (Tabs, Checkbox, DataGrid rows)
- Disabled state announced and interaction blocked
- Loading/busy states announced via `aria-busy`

### 4. Live Regions
- Toast notifications announced via `aria-live="polite"`
- Error messages announced via `aria-live="assertive"` or `aria-describedby`
- Progress updates announced for async operations
- No duplicate announcements from competing live regions

### 5. Error Messages
- Validation errors linked via `aria-describedby`
- Error state announced via `aria-invalid="true"`
- Error summary announced on form submission
- Inline errors announced when field loses focus

## Current Coverage

| Component | VoiceOver | NVDA | TalkBack | Status |
|---|---|---|---|---|
| Button | Pass | Pass | Pass | Complete |
| Select | Pass | Pass | Partial | In progress |
| Dialog | Pass | Pass | Pass | Complete |
| Tabs | Pass | Pass | Pass | Complete |
| Accordion | Pass | Pass | Untested | Planned Q2 |
| DataGrid | Pass | Pass | Untested | Built-in (AG Grid ARIA) |
| DatePicker | Pass | Partial | Untested | In progress |
| Menu | Pass | Pass | Untested | Planned Q2 |
| Toast | Pass | Pass | Untested | Planned Q2 |
| Form | Pass | Pass | Partial | In progress |

**Legend**: Pass = all 5 criteria met | Partial = 3-4 criteria met | Fail = <3 criteria | Untested = not yet evaluated

## Planned Coverage (EOY Target)

- **Q2 2026**: Complete NVDA partial items, begin TalkBack coverage for all components
- **Q3 2026**: Full pass across all 70 combinations
- **Q4 2026**: Automated regression via `@axe-core/playwright` for role/state checks

## Testing Schedule

| Activity | Cadence | Owner |
|---|---|---|
| Full matrix audit | Quarterly | A11y lead + QA |
| Regression check (automated) | Every PR | CI (`axe-core`) |
| New component audit | Before release | Component author + A11y lead |
| User testing (assistive tech users) | Bi-annually | UX Research |

## Automated Checks (CI)

105 accessibility contract tests run on every PR:

```bash
pnpm vitest --project=a11y
```

These cover:
- ARIA attribute correctness
- Keyboard navigation sequences
- Focus management on open/close
- Color contrast (via computed styles)

Automated tests catch ~60% of issues. The quarterly manual audit with real screen readers catches the remaining nuanced interaction patterns.

## References

- [WAI-ARIA Authoring Practices 1.2](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.1 AA Guidelines](https://www.w3.org/TR/WCAG21/)
- [Deque axe-core Rule Descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
