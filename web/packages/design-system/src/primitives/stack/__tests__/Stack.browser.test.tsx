import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Stack, HStack, VStack } from '../Stack';

describe('Stack (Browser)', () => {
  it('renders children in vertical layout by default', async () => {
    const screen = render(
      <Stack>
        <span>Item 1</span>
        <span>Item 2</span>
      </Stack>,
    );
    await expect.element(screen.getByText('Item 1')).toBeVisible();
    await expect.element(screen.getByText('Item 2')).toBeVisible();
  });

  it('HStack renders horizontal layout', async () => {
    const screen = render(
      <HStack>
        <span>Left</span>
        <span>Right</span>
      </HStack>,
    );
    await expect.element(screen.getByText('Left')).toBeVisible();
    await expect.element(screen.getByText('Right')).toBeVisible();
  });

  it('VStack renders vertical layout', async () => {
    const screen = render(
      <VStack gap={4}>
        <span>Top</span>
        <span>Bottom</span>
      </VStack>,
    );
    await expect.element(screen.getByText('Top')).toBeVisible();
    await expect.element(screen.getByText('Bottom')).toBeVisible();
  });
});
