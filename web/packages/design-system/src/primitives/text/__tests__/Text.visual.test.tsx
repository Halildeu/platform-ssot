import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Text } from '../Text';

describe('Text Visual Regression', () => {
  it('text variants match screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h1" size="3xl" weight="bold">Heading 1</Text>
        <Text as="h2" size="2xl" weight="semibold">Heading 2</Text>
        <Text size="base">Body text</Text>
        <Text size="sm" variant="secondary">Caption text</Text>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('text color variants match screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text variant="default">Default</Text>
        <Text variant="success">Success</Text>
        <Text variant="error">Error</Text>
        <Text variant="warning">Warning</Text>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
