// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, CardHeader, CardBody, CardFooter } from '../Card';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Card — temel render', () => {
  it('children icerigini render eder', () => {
    render(<Card>Hello Card</Card>);
    expect(screen.getByText('Hello Card')).toBeInTheDocument();
  });

  it('varsayilan olarak div elementi olarak render eder', () => {
    const { container } = render(<Card>Test</Card>);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe('DIV');
  });

  it('rounded-2xl class uygulanir', () => {
    const { container } = render(<Card>Test</Card>);
    expect(container.firstElementChild?.className).toContain('rounded-2xl');
  });
});

/* ------------------------------------------------------------------ */
/*  Variant proplari                                                   */
/* ------------------------------------------------------------------ */

describe('Card — variant proplari', () => {
  it.each([
    ['elevated', 'shadow-sm'],
    ['outlined', 'bg-transparent'],
    ['filled', 'bg-[var(--surface-muted)]'],
    ['ghost', 'bg-transparent'],
  ] as const)('variant="%s" dogru class uygular', (variant, expectedClass) => {
    const { container } = render(<Card variant={variant}>Test</Card>);
    expect(container.firstElementChild?.className).toContain(expectedClass);
  });

  it('varsayilan variant "elevated" dir', () => {
    const { container } = render(<Card>Test</Card>);
    expect(container.firstElementChild?.className).toContain('shadow-sm');
  });
});

/* ------------------------------------------------------------------ */
/*  Padding proplari                                                   */
/* ------------------------------------------------------------------ */

describe('Card — padding proplari', () => {
  it.each([
    ['none', 'p-0'],
    ['sm', 'p-3'],
    ['md', 'p-5'],
    ['lg', 'p-6'],
  ] as const)('padding="%s" dogru class uygular', (padding, expectedClass) => {
    const { container } = render(<Card padding={padding}>Test</Card>);
    expect(container.firstElementChild?.className).toContain(expectedClass);
  });

  it('varsayilan padding "md" dir', () => {
    const { container } = render(<Card>Test</Card>);
    expect(container.firstElementChild?.className).toContain('p-5');
  });
});

/* ------------------------------------------------------------------ */
/*  Hoverable                                                          */
/* ------------------------------------------------------------------ */

describe('Card — hoverable', () => {
  it('hoverable=true iken cursor-pointer uygulanir', () => {
    const { container } = render(<Card hoverable>Test</Card>);
    expect(container.firstElementChild?.className).toContain('cursor-pointer');
  });

  it('hoverable=false iken cursor-pointer olmaz', () => {
    const { container } = render(<Card>Test</Card>);
    expect(container.firstElementChild?.className).not.toContain('cursor-pointer');
  });
});

/* ------------------------------------------------------------------ */
/*  as="button"                                                        */
/* ------------------------------------------------------------------ */

describe('Card — as prop', () => {
  it('as="button" iken role="button" atanir', () => {
    render(<Card as="button">Test</Card>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('as="button" iken w-full ve text-left uygulanir', () => {
    const { container } = render(<Card as="button">Test</Card>);
    expect(container.firstElementChild?.className).toContain('w-full');
    expect(container.firstElementChild?.className).toContain('text-left');
  });

  it('as="button" iken tabIndex=0 olur', () => {
    render(<Card as="button">Test</Card>);
    expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0');
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('Card — interaction', () => {
  it('onClick handler calisir', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Card onClick={handler}>Click me</Card>);
    await user.click(screen.getByText('Click me'));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Ref forwarding                                                     */
/* ------------------------------------------------------------------ */

describe('Card — ref forwarding', () => {
  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Test</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Card — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Card className="custom">Test</Card>);
    expect(container.firstElementChild?.className).toContain('custom');
  });

  it('ek HTML attributes aktarilir', () => {
    render(<Card data-testid="my-card">Test</Card>);
    expect(screen.getByTestId('my-card')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  CardHeader                                                         */
/* ------------------------------------------------------------------ */

describe('CardHeader', () => {
  it('title ve subtitle render eder', () => {
    render(<CardHeader title="Card Title" subtitle="Card Subtitle" />);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
  });

  it('action slot render eder', () => {
    render(
      <CardHeader
        title="T"
        action={<button>Action</button>}
      />,
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('children render eder', () => {
    render(<CardHeader>Custom content</CardHeader>);
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  CardBody                                                           */
/* ------------------------------------------------------------------ */

describe('CardBody', () => {
  it('children render eder', () => {
    render(<CardBody>Body content</CardBody>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('className forwarding calisir', () => {
    const { container } = render(<CardBody className="extra">Body</CardBody>);
    expect(container.firstElementChild?.className).toContain('extra');
  });
});

/* ------------------------------------------------------------------ */
/*  CardFooter                                                         */
/* ------------------------------------------------------------------ */

describe('CardFooter', () => {
  it('children render eder', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('border-t class uygulanir', () => {
    const { container } = render(<CardFooter>F</CardFooter>);
    expect(container.firstElementChild?.className).toContain('border-t');
  });
});

/* ------------------------------------------------------------------ */
/*  slotProps                                                          */
/* ------------------------------------------------------------------ */

describe('Card — slotProps', () => {
  it('merges slotProps.root className onto the Card root', () => {
    const { container } = render(
      <Card slotProps={{ root: { className: 'sp-root' } }}>Test</Card>,
    );
    expect(container.firstElementChild?.className).toContain('sp-root');
    expect(container.firstElementChild?.className).toContain('rounded-2xl');
  });

  it('merges slotProps.header className onto CardHeader', () => {
    const { container } = render(
      <Card slotProps={{ header: { className: 'sp-header' } }}>
        <CardHeader title="T" />
      </Card>,
    );
    const header = container.querySelector('.sp-header');
    expect(header).toBeInTheDocument();
    expect(header?.className).toContain('flex');
    expect(header?.className).toContain('sp-header');
  });

  it('merges slotProps.body className onto CardBody', () => {
    const { container } = render(
      <Card slotProps={{ body: { className: 'sp-body' } }}>
        <CardBody>Body</CardBody>
      </Card>,
    );
    const body = container.querySelector('.sp-body');
    expect(body).toBeInTheDocument();
    expect(body?.className).toContain('mt-3');
    expect(body?.className).toContain('sp-body');
  });

  it('merges slotProps.footer className onto CardFooter', () => {
    const { container } = render(
      <Card slotProps={{ footer: { className: 'sp-footer' } }}>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    const footer = container.querySelector('.sp-footer');
    expect(footer).toBeInTheDocument();
    expect(footer?.className).toContain('border-t');
    expect(footer?.className).toContain('sp-footer');
  });

  it('works without slotProps (backward compatible)', () => {
    render(
      <Card>
        <CardHeader title="T" />
        <CardBody>B</CardBody>
        <CardFooter>F</CardFooter>
      </Card>,
    );
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Card — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Card>Card content</Card>);
    await expectNoA11yViolations(container);
  });
});
