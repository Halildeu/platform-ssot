import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Checkbox } from '../Checkbox';

describe('Checkbox Visual Regression', () => {
  /* ---- 1. Default (unchecked) ---- */
  it('unchecked state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Checkbox label="Unchecked" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. Checked ---- */
  it('checked state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Checkbox label="Checked" defaultChecked />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. All sizes ---- */
  it('all sizes match screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Checkbox label="Small" size="sm" defaultChecked />
        <Checkbox label="Medium" size="md" defaultChecked />
        <Checkbox label="Large" size="lg" defaultChecked />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. Disabled state ---- */
  it('disabled states match screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Checkbox label="Disabled unchecked" disabled />
        <Checkbox label="Disabled checked" disabled defaultChecked />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 5. Error state ---- */
  it('error state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Checkbox label="Required field" error />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 6. Indeterminate ---- */
  it('indeterminate state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Checkbox label="Select all" indeterminate />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 7. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    render(
      <div data-theme="dark" style={{ padding: 20, background: '#1a1a2e', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
