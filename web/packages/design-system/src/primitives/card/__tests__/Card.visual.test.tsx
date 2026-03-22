import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Card, CardHeader, CardBody } from '../Card';

describe('Card Visual Regression', () => {
  it('elevated variant matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#f5f5f5' }}>
        <Card variant="elevated">
          <CardHeader title="Elevated Card" subtitle="With shadow" />
          <CardBody>Content here</CardBody>
        </Card>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('outlined variant matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Card variant="outlined">
          <CardHeader title="Outlined Card" />
          <CardBody>Outlined content</CardBody>
        </Card>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('filled variant matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Card variant="filled">
          <CardHeader title="Filled Card" />
          <CardBody>Filled content</CardBody>
        </Card>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
