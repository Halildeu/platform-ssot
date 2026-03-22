import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Card, CardHeader, CardBody } from '../Card';

describe('Card (Browser)', () => {
  it('renders children content', async () => {
    const screen = render(
      <Card>
        <CardHeader title="Card Title" />
        <CardBody>Card body content</CardBody>
      </Card>,
    );
    await expect.element(screen.getByText('Card Title')).toBeVisible();
    await expect.element(screen.getByText('Card body content')).toBeVisible();
  });

  it('renders with different variants', async () => {
    const screen = render(
      <div>
        <Card variant="elevated" data-testid="elevated">Elevated</Card>
        <Card variant="outlined" data-testid="outlined">Outlined</Card>
      </div>,
    );
    await expect.element(screen.getByTestId('elevated')).toBeVisible();
    await expect.element(screen.getByTestId('outlined')).toBeVisible();
  });

  it('renders hoverable card', async () => {
    const screen = render(
      <Card hoverable data-testid="hover-card">
        Hoverable content
      </Card>,
    );
    await expect.element(screen.getByTestId('hover-card')).toBeVisible();
  });
});
