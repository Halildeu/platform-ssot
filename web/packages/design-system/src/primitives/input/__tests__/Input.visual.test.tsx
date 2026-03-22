import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Input } from '../Input';

describe('Input Visual Regression', () => {
  /* ---- 1. Default state ---- */
  it('default state with label matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 320 }}>
        <Input placeholder="Enter text" label="Name" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. All sizes ---- */
  it('all sizes match screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
        <Input size="sm" placeholder="Small" label="SM" />
        <Input size="md" placeholder="Medium" label="MD" />
        <Input size="lg" placeholder="Large" label="LG" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. Disabled state ---- */
  it('disabled state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 320 }}>
        <Input label="Disabled" disabled defaultValue="Cannot edit" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. Error state ---- */
  it('error state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 320 }}>
        <Input label="Email" error="Invalid email address" defaultValue="bad@" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 5. Loading state ---- */
  it('loading state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 320 }}>
        <Input label="Validating" loading defaultValue="checking..." />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 6. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    render(
      <div data-theme="dark" style={{ padding: 20, background: '#1a1a2e', width: 320 }}>
        <Input label="Dark Input" placeholder="Enter text" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
