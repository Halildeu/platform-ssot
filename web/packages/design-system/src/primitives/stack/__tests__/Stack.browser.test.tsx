import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Stack, HStack, VStack } from '../Stack';

describe('Stack (Browser)', () => {
  it('renders children in vertical layout by default', async () => {
    const screen = await render(
      <Stack>
        <span>Item 1</span>
        <span>Item 2</span>
      </Stack>,
    );
    await expect.element(screen.getByText('Item 1')).toBeVisible();
    await expect.element(screen.getByText('Item 2')).toBeVisible();
  });

  it('HStack renders horizontal layout', async () => {
    const screen = await render(
      <HStack>
        <span>Left</span>
        <span>Right</span>
      </HStack>,
    );
    await expect.element(screen.getByText('Left')).toBeVisible();
    await expect.element(screen.getByText('Right')).toBeVisible();
  });

  it('VStack renders vertical layout', async () => {
    const screen = await render(
      <VStack gap={4}>
        <span>Top</span>
        <span>Bottom</span>
      </VStack>,
    );
    await expect.element(screen.getByText('Top')).toBeVisible();
    await expect.element(screen.getByText('Bottom')).toBeVisible();
  });

  it('renders with row direction', async () => {
    const screen = await render(
      <Stack direction="row" data-testid="row-stack">
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    await expect.element(screen.getByTestId('row-stack')).toBeVisible();
  });

  it('renders with custom gap', async () => {
    const screen = await render(
      <Stack gap={8} data-testid="gap-stack">
        <span>X</span>
        <span>Y</span>
      </Stack>,
    );
    await expect.element(screen.getByTestId('gap-stack')).toBeVisible();
  });

  it('renders with wrap enabled', async () => {
    const screen = await render(
      <Stack direction="row" wrap data-testid="wrap-stack">
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </Stack>,
    );
    await expect.element(screen.getByTestId('wrap-stack')).toBeVisible();
  });

  it('renders as different HTML element', async () => {
    const screen = await render(
      <Stack as="section" data-testid="section-stack">
        <span>Content</span>
      </Stack>,
    );
    await expect.element(screen.getByTestId('section-stack')).toBeVisible();
  });
});
