 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Alert } from '../Alert';
import { LIGHT_BG_HEX, DARK_BG_HEX } from '../../../__tests__/visual-constants';

describe('Alert Visual Regression', () => {
  /* ---- 1. Default (info variant) ---- */
  it('info variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 480 }}>
        <Alert variant="info" title="Info">Informational message.</Alert>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. All variants ---- */
  it('all variants match screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 480, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Alert variant="info" title="Info">Informational message.</Alert>
        <Alert variant="success" title="Success">Operation completed.</Alert>
        <Alert variant="warning" title="Warning">Proceed with caution.</Alert>
        <Alert variant="error" title="Error">Something went wrong.</Alert>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. Closable alert ---- */
  it('closable alert matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 480 }}>
        <Alert variant="warning" title="Dismissible" closable onClose={() => {}}>
          This alert can be dismissed.
        </Alert>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. With action ---- */
  it('alert with action matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 480 }}>
        <Alert variant="error" title="Failed" action={<button>Retry</button>}>
          Could not save changes.
        </Alert>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 5. Description only (no title) ---- */
  it('description-only alert matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 480 }}>
        <Alert variant="info">Simple informational text without title.</Alert>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 6. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    await render(
      <div data-theme="dark" style={{ padding: 20, background: DARK_BG_HEX, width: 480, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Alert variant="info" title="Info">Dark info.</Alert>
        <Alert variant="error" title="Error">Dark error.</Alert>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
