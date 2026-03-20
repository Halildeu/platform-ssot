// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Breadcrumb, type BreadcrumbItem } from '../Breadcrumb';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const makeItems = (count = 3): BreadcrumbItem[] =>
  Array.from({ length: count }, (_, i) => ({
    label: `Item ${i}`,
    onClick: vi.fn(),
  }));

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Breadcrumb — temel render', () => {
  it('nav elementini render eder', () => {
    render(<Breadcrumb items={makeItems()} />);
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
  });

  it('tum item labellarini gosterir', () => {
    render(<Breadcrumb items={makeItems()} />);
    expect(screen.getByText('Item 0')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('son item aria-current="page" alir', () => {
    render(<Breadcrumb items={makeItems()} />);
    const lastItem = screen.getByText('Item 2');
    expect(lastItem).toHaveAttribute('aria-current', 'page');
  });

  it('ilk itemlar button olarak render eder', () => {
    render(<Breadcrumb items={makeItems()} />);
    const buttons = screen.getAllByRole('button');
    // Son item button degil, span olarak render eder
    expect(buttons.length).toBe(2);
  });
});

/* ------------------------------------------------------------------ */
/*  Separator                                                          */
/* ------------------------------------------------------------------ */

describe('Breadcrumb — separator', () => {
  it('varsayilan separator render eder', () => {
    const { container } = render(<Breadcrumb items={makeItems()} />);
    // Default separator is an SVG
    const separators = container.querySelectorAll('[aria-hidden]');
    expect(separators.length).toBeGreaterThanOrEqual(2);
  });

  it('custom separator destekler', () => {
    render(
      <Breadcrumb items={makeItems()} separator={<span>/</span>} />,
    );
    const slashes = screen.getAllByText('/');
    expect(slashes.length).toBe(2);
  });
});

/* ------------------------------------------------------------------ */
/*  maxItems                                                           */
/* ------------------------------------------------------------------ */

describe('Breadcrumb — maxItems', () => {
  it('maxItems asildginda collapse yapar', () => {
    const items: BreadcrumbItem[] = Array.from({ length: 5 }, (_, i) => ({
      label: `Page ${i}`,
      onClick: vi.fn(),
    }));
    render(<Breadcrumb items={items} maxItems={3} />);
    // Should show first item, ..., and last 2 items
    expect(screen.getByText('Page 0')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByText('Page 3')).toBeInTheDocument();
    expect(screen.getByText('Page 4')).toBeInTheDocument();
    // Middle items should not be visible
    expect(screen.queryByText('Page 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Page 2')).not.toBeInTheDocument();
  });

  it('maxItems asılmadıginda collapse yapmaz', () => {
    render(<Breadcrumb items={makeItems()} maxItems={5} />);
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Icon                                                               */
/* ------------------------------------------------------------------ */

describe('Breadcrumb — icon', () => {
  it('item icon render eder', () => {
    const items: BreadcrumbItem[] = [
      {
        label: 'Home',
        icon: <span data-testid="home-icon">H</span>,
        onClick: vi.fn(),
      },
      { label: 'Current' },
    ];
    render(<Breadcrumb items={items} />);
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  onClick interaction                                                */
/* ------------------------------------------------------------------ */

describe('Breadcrumb — onClick interaction', () => {
  it('item tiklaninca onClick tetiklenir', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    const items: BreadcrumbItem[] = [
      { label: 'Home', onClick: handler },
      { label: 'Current' },
    ];
    render(<Breadcrumb items={items} />);
    await user.click(screen.getByText('Home'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('son item tiklanamaz (span olarak render eder)', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', onClick: vi.fn() },
      { label: 'Current' },
    ];
    render(<Breadcrumb items={items} />);
    const current = screen.getByText('Current');
    expect(current.tagName).toBe('SPAN');
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Breadcrumb — a11y', () => {
  it('nav aria-label="Breadcrumb" alir', () => {
    render(<Breadcrumb items={makeItems()} />);
    expect(screen.getByRole('navigation')).toHaveAttribute(
      'aria-label',
      'Breadcrumb',
    );
  });

  it('ordered list ile render eder', () => {
    render(<Breadcrumb items={makeItems()} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Breadcrumb — edge cases', () => {
  it('className forwarding calisir', () => {
    render(<Breadcrumb items={makeItems()} className="custom-bc" />);
    expect(screen.getByRole('navigation').className).toContain('custom-bc');
  });

  it('tek item ile hata vermez', () => {
    render(<Breadcrumb items={[{ label: 'Home' }]} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('bos items ile hata vermez', () => {
    render(<Breadcrumb items={[]} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

describe('Breadcrumb — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Breadcrumb items={makeItems()} />);
    await expectNoA11yViolations(container);
  });
});
