import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Select } from '../Select';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('Select Visual Regression', () => {
  /* ---- 1. Default state ---- */
  it('default state with placeholder matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <Select options={options} placeholder="Choose one" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. All sizes ---- */
  it('all sizes match screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
        <Select options={options} size="sm" defaultValue="a" />
        <Select options={options} size="md" defaultValue="a" />
        <Select options={options} size="lg" defaultValue="a" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. Disabled state ---- */
  it('disabled state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <Select options={options} defaultValue="a" disabled />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. Error state ---- */
  it('error state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <Select options={options} defaultValue="a" error />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 5. Loading state ---- */
  it('loading state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <Select options={options} defaultValue="a" loading />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 6. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    render(
      <div data-theme="dark" style={{ padding: 20, background: '#1a1a2e', width: 300 }}>
        <Select options={options} defaultValue="a" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
