import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Card, CardHeader, CardBody, CardFooter } from '../Card';

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

  it('renders elevated variant', async () => {
    const screen = render(
      <Card variant="elevated" data-testid="elevated">Elevated</Card>,
    );
    await expect.element(screen.getByTestId('elevated')).toBeVisible();
  });

  it('renders outlined variant', async () => {
    const screen = render(
      <Card variant="outlined" data-testid="outlined">Outlined</Card>,
    );
    await expect.element(screen.getByTestId('outlined')).toBeVisible();
  });

  it('renders filled variant', async () => {
    const screen = render(
      <Card variant="filled" data-testid="filled">Filled</Card>,
    );
    await expect.element(screen.getByTestId('filled')).toBeVisible();
  });

  it('renders hoverable card', async () => {
    const screen = render(
      <Card hoverable data-testid="hover-card">Hoverable content</Card>,
    );
    await expect.element(screen.getByTestId('hover-card')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    const screen = render(<Card>Content</Card>);
    const el = screen.container.querySelector('[data-component="card"]');
    expect(el).not.toBeNull();
  });

  it('renders CardFooter slot', async () => {
    const screen = render(
      <Card>
        <CardBody>Body</CardBody>
        <CardFooter>Footer actions</CardFooter>
      </Card>,
    );
    await expect.element(screen.getByText('Footer actions')).toBeVisible();
  });

  it('renders ghost variant', async () => {
    const screen = render(
      <Card variant="ghost" data-testid="ghost">Ghost card</Card>,
    );
    await expect.element(screen.getByTestId('ghost')).toBeVisible();
  });
});
