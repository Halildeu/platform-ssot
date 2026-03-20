// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render } from '@testing-library/react';
import { Card, CardHeader, CardBody, CardFooter } from '../Card';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Card contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Card.displayName).toBe('Card');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  /* ---- Forwards ref ---- */
  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(<Card className="custom-card">C</Card>);
    expect(container.firstElementChild).toHaveClass('custom-card');
  });

  /* ---- data-component attribute ---- */
  it('has data-component="card"', () => {
    const { container } = render(<Card>C</Card>);
    expect(container.querySelector('[data-component="card"]')).toBeInTheDocument();
  });

  /* ---- Variants ---- */
  it.each(['elevated', 'outlined', 'filled', 'ghost'] as const)(
    'renders variant=%s without crash',
    (variant) => {
      const { container } = render(<Card variant={variant}>V</Card>);
      expect(container.firstElementChild).toBeInTheDocument();
    },
  );

  /* ---- Padding ---- */
  it.each(['none', 'sm', 'md', 'lg'] as const)(
    'renders padding=%s without crash',
    (padding) => {
      const { container } = render(<Card padding={padding}>P</Card>);
      expect(container.firstElementChild).toBeInTheDocument();
    },
  );

  /* ---- Sub-components ---- */
  it('renders CardHeader, CardBody, CardFooter sub-components', () => {
    const { container } = render(
      <Card>
        <CardHeader title="Title" subtitle="Sub" />
        <CardBody>Body content</CardBody>
        <CardFooter>Footer content</CardFooter>
      </Card>,
    );
    expect(container.textContent).toContain('Title');
    expect(container.textContent).toContain('Body content');
    expect(container.textContent).toContain('Footer content');
  });

  /* ---- Sub-component displayNames ---- */
  it('sub-components have displayName', () => {
    expect(CardHeader.displayName).toBe('CardHeader');
    expect(CardBody.displayName).toBe('CardBody');
    expect(CardFooter.displayName).toBe('CardFooter');
  });
});

describe('Card — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Card>Accessible card</Card>);
    await expectNoA11yViolations(container);
  });
});
