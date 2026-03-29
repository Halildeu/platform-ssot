 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Card, CardHeader, CardBody } from '../Card';
import { LIGHT_BG_HEX, SURFACE_MUTED_BG } from '../../../__tests__/visual-constants';

describe('Card Visual Regression', () => {
  it('elevated variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: SURFACE_MUTED_BG }}>
        <Card variant="elevated">
          <CardHeader title="Elevated Card" subtitle="With shadow" />
          <CardBody>Content here</CardBody>
        </Card>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('outlined variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Card variant="outlined">
          <CardHeader title="Outlined Card" />
          <CardBody>Outlined content</CardBody>
        </Card>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('filled variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Card variant="filled">
          <CardHeader title="Filled Card" />
          <CardBody>Filled content</CardBody>
        </Card>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
