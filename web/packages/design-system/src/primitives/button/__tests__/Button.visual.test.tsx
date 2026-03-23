/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Button } from '../Button';

describe('Button Visual Regression', () => {
  /* ---- 1. Default state ---- */
  it('primary (default) button matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Button variant="primary">Primary Button</Button>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. All variants ---- */
  it('all variants side-by-side match screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="link">Link</Button>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. All sizes ---- */
  it('all sizes match screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button size="xs">XS</Button>
        <Button size="sm">SM</Button>
        <Button size="md">MD</Button>
        <Button size="lg">LG</Button>
        <Button size="xl">XL</Button>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. Disabled state ---- */
  it('disabled button matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', gap: 12 }}>
        <Button disabled>Disabled Primary</Button>
        <Button variant="secondary" disabled>Disabled Secondary</Button>
        <Button variant="danger" disabled>Disabled Danger</Button>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 5. Loading state ---- */
  it('loading button matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', gap: 12 }}>
        <Button loading>Loading</Button>
        <Button loading variant="secondary">Saving</Button>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 6. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    await render(
      <div data-theme="dark" style={{ padding: 20, background: '#1a1a2e', display: 'flex', gap: 12 }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
