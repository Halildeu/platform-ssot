import { render, type RenderResult } from '@testing-library/react';
import React from 'react';

/**
 * Renders a component inside a dark-mode theme context.
 * Sets data-appearance="dark" on the container to simulate dark mode.
 */
export function renderInDarkMode(ui: React.ReactElement): RenderResult {
  const result = render(ui);
  // Set dark mode attribute on container to simulate theme
  document.documentElement.setAttribute('data-appearance', 'dark');
  document.documentElement.setAttribute('data-mode', 'dark');
  return result;
}

/**
 * Cleans up dark mode attributes after test.
 */
export function cleanupDarkMode(): void {
  document.documentElement.removeAttribute('data-appearance');
  document.documentElement.removeAttribute('data-mode');
}

// Patterns that indicate hardcoded colors (not CSS variables)
const BARE_COLOR_PATTERNS = [
  /(?:^|\s)bg-white(?:\s|$)/,
  /(?:^|\s)bg-black(?:\s|$)/,
  /(?:^|\s)bg-gray-\d+/,
  /(?:^|\s)bg-blue-\d+/,
  /(?:^|\s)bg-red-\d+/,
  /(?:^|\s)bg-green-\d+/,
  /(?:^|\s)bg-yellow-\d+/,
  /(?:^|\s)text-white(?:\s|$)/,
  /(?:^|\s)text-black(?:\s|$)/,
  /(?:^|\s)text-gray-\d+/,
  /(?:^|\s)border-gray-\d+/,
  /style="[^"]*(?:color|background|border-color)\s*:\s*(?:#[0-9a-fA-F]{3,8}|rgb|rgba|hsl)/,
];

/**
 * Asserts that no rendered element contains hardcoded color classes or inline color styles.
 * Components should use CSS variable tokens (var(--...)) for all colors.
 */
export function expectNoBareColors(container: HTMLElement, options?: { allowList?: string[] }): void {
  const html = container.innerHTML;
  const allowList = options?.allowList ?? [];

  for (const pattern of BARE_COLOR_PATTERNS) {
    const matches = html.match(new RegExp(pattern.source, 'g'));
    if (matches) {
      const filtered = matches.filter(m => !allowList.some(a => m.includes(a)));
      if (filtered.length > 0) {
        throw new Error(
          `Found hardcoded color class/style that breaks dark mode: ${filtered.join(', ')}\n` +
          'Use CSS variable tokens (var(--...)) instead.'
        );
      }
    }
  }
}
