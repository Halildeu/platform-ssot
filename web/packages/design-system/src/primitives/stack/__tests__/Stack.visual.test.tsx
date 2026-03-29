 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Stack, HStack } from '../Stack';
import { LIGHT_BG_HEX, MUTED_BG } from '../../../__tests__/visual-constants';

describe('Stack Visual Regression', () => {
  it('vertical stack matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Stack gap={4}>
          <div style={{ padding: 8, background: MUTED_BG }}>Item 1</div>
          <div style={{ padding: 8, background: MUTED_BG }}>Item 2</div>
          <div style={{ padding: 8, background: MUTED_BG }}>Item 3</div>
        </Stack>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('horizontal stack matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <HStack gap={4}>
          <div style={{ padding: 8, background: MUTED_BG }}>Left</div>
          <div style={{ padding: 8, background: MUTED_BG }}>Center</div>
          <div style={{ padding: 8, background: MUTED_BG }}>Right</div>
        </HStack>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
