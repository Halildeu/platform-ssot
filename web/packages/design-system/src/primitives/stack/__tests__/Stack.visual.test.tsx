import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Stack, HStack } from '../Stack';

describe('Stack Visual Regression', () => {
  it('vertical stack matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Stack gap={4}>
          <div style={{ padding: 8, background: '#eee' }}>Item 1</div>
          <div style={{ padding: 8, background: '#eee' }}>Item 2</div>
          <div style={{ padding: 8, background: '#eee' }}>Item 3</div>
        </Stack>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('horizontal stack matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <HStack gap={4}>
          <div style={{ padding: 8, background: '#eee' }}>Left</div>
          <div style={{ padding: 8, background: '#eee' }}>Center</div>
          <div style={{ padding: 8, background: '#eee' }}>Right</div>
        </HStack>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
