import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Radio, RadioGroup } from '../Radio';

describe('Radio Visual Regression', () => {
  /* ---- 1. Default (unchecked) ---- */
  it('unchecked radio matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Radio label="Unchecked" value="a" name="visual" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. Radio group with selection ---- */
  it('radio group with selected item matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <RadioGroup name="visual-group" defaultValue="b">
          <Radio label="Option A" value="a" />
          <Radio label="Option B" value="b" />
          <Radio label="Option C" value="c" />
        </RadioGroup>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. All sizes ---- */
  it('all sizes match screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Radio label="Small" value="sm" name="sizes" size="sm" checked onChange={() => {}} />
        <Radio label="Medium" value="md" name="sizes" size="md" checked onChange={() => {}} />
        <Radio label="Large" value="lg" name="sizes" size="lg" checked onChange={() => {}} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. Disabled ---- */
  it('disabled states match screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Radio label="Disabled unchecked" value="a" name="disabled" disabled />
        <Radio label="Disabled checked" value="b" name="disabled2" disabled checked onChange={() => {}} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 5. Error state ---- */
  it('error state matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Radio label="Required field" value="a" name="error" error />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 6. Horizontal direction ---- */
  it('horizontal radio group matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <RadioGroup name="horizontal" defaultValue="a" direction="horizontal">
          <Radio label="Option A" value="a" />
          <Radio label="Option B" value="b" />
          <Radio label="Option C" value="c" />
        </RadioGroup>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 7. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    const screen = await render(
      <div data-theme="dark" style={{ padding: 20, background: '#1a1a2e' }}>
        <RadioGroup name="dark" defaultValue="b">
          <Radio label="Option A" value="a" />
          <Radio label="Option B" value="b" />
        </RadioGroup>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
