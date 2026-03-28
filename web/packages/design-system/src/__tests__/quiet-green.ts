/**
 * Vitest setup: suppress known non-actionable warnings
 *
 * This file documents the rationale for each suppressed pattern
 * in the test setup. The actual suppression logic lives in setup.ts
 * (SUPPRESSED_PATTERNS array).
 *
 * ┌─────────────────────────────────────┬──────────────────────────────────────────┐
 * │ Pattern                             │ Reason                                   │
 * ├─────────────────────────────────────┼──────────────────────────────────────────┤
 * │ AG Grid / ag-grid / AG Charts       │ AG Grid #257 license nag in dev/test     │
 * │                                     │ context. Enterprise license is valid;     │
 * │                                     │ warning is cosmetic.                      │
 * ├─────────────────────────────────────┼──────────────────────────────────────────┤
 * │ act(...) / act(() => / ReactDOM.*   │ React act() warning in test context.      │
 * │                                     │ Triggered by async state updates inside   │
 * │                                     │ AG Grid/Charts internals. Cannot be       │
 * │                                     │ wrapped without patching upstream.        │
 * ├─────────────────────────────────────┼──────────────────────────────────────────┤
 * │ onValueChange / Unknown event       │ Custom event handler props that React     │
 * │ handler                             │ warns about. These are valid component    │
 * │                                     │ props, not DOM events.                    │
 * ├─────────────────────────────────────┼──────────────────────────────────────────┤
 * │ Vite CJS                            │ Vite CJS deprecation warning. This is     │
 * │                                     │ external tooling noise — Vite plans to    │
 * │                                     │ drop CJS in a future major. No action     │
 * │                                     │ needed until we upgrade Vite.             │
 * ├─────────────────────────────────────┼──────────────────────────────────────────┤
 * │ React does not recognize            │ React warns about non-standard DOM props  │
 * │                                     │ passed through from component libraries.  │
 * │                                     │ Safe to suppress in test context.         │
 * ├─────────────────────────────────────┼──────────────────────────────────────────┤
 * │ Path2D / setTransform / canvas /    │ jsdom/happy-dom stubs that are not        │
 * │ getContext / not implemented        │ implemented. Expected in headless test     │
 * │                                     │ runners.                                  │
 * ├─────────────────────────────────────┼──────────────────────────────────────────┤
 * │ Could not parse CSS / content       │ CSS parsing noise from jsdom/happy-dom.   │
 * │ layer / tailwind                    │ Not actionable in unit test context.       │
 * └─────────────────────────────────────┴──────────────────────────────────────────┘
 *
 * To add a new suppression:
 *   1. Add the pattern string to SUPPRESSED_PATTERNS in setup.ts
 *   2. Document the rationale in this file
 *   3. Tag the PR with "quiet-green" for review traceability
 *
 * Known external issues (not suppressible, just documented):
 *   - Vite CJS deprecation: tracked upstream, will resolve with Vite 7+
 *   - AG Grid license nag: only in dev/test, production bundle is clean
 */

export {};
