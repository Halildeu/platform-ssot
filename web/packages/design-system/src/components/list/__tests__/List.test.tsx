// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { List, type ListItem } from '../List';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const defaultItems: ListItem[] = [
  { key: '1', title: 'Item One' },
  { key: '2', title: 'Item Two' },
  { key: '3', title: 'Item Three' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('List — temel render', () => {
  it('section elementini render eder', () => {
    const { container } = render(<List items={defaultItems} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('tum item basliklarini gosterir', () => {
    render(<List items={defaultItems} />);
    expect(screen.getByText('Item One')).toBeInTheDocument();
    expect(screen.getByText('Item Two')).toBeInTheDocument();
    expect(screen.getByText('Item Three')).toBeInTheDocument();
  });

  it('list elementlerini ul icerisinde render eder', () => {
    const { container } = render(<List items={defaultItems} />);
    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(3);
  });

  it('title gosterilir', () => {
    render(<List items={defaultItems} title="My List" />);
    expect(screen.getByText('My List')).toBeInTheDocument();
  });

  it('description gosterilir', () => {
    render(<List items={defaultItems} description="A description" />);
    expect(screen.getByText('A description')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Item proplari                                                      */
/* ------------------------------------------------------------------ */

describe('List — item props', () => {
  it('item description gosterilir', () => {
    const items: ListItem[] = [{ key: '1', title: 'T', description: 'Item desc' }];
    render(<List items={items} />);
    expect(screen.getByText('Item desc')).toBeInTheDocument();
  });

  it('item meta gosterilir', () => {
    const items: ListItem[] = [{ key: '1', title: 'T', meta: 'META' }];
    render(<List items={items} />);
    expect(screen.getByText('META')).toBeInTheDocument();
  });

  it('item prefix gosterilir', () => {
    const items: ListItem[] = [
      { key: '1', title: 'T', prefix: <span data-testid="pfx">P</span> },
    ];
    render(<List items={items} />);
    expect(screen.getByTestId('pfx')).toBeInTheDocument();
  });

  it('item suffix gosterilir', () => {
    const items: ListItem[] = [
      { key: '1', title: 'T', suffix: <span data-testid="sfx">S</span> },
    ];
    render(<List items={items} />);
    expect(screen.getByTestId('sfx')).toBeInTheDocument();
  });

  it('string badges render edilir', () => {
    const items: ListItem[] = [{ key: '1', title: 'T', badges: ['New', 'Hot'] }];
    render(<List items={items} />);
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Hot')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Selection & interaction                                            */
/* ------------------------------------------------------------------ */

describe('List — selection', () => {
  it('onItemSelect verildiginde butonlar render edilir', () => {
    const handler = vi.fn();
    const { container } = render(<List items={defaultItems} onItemSelect={handler} />);
    expect(container.querySelectorAll('button')).toHaveLength(3);
  });

  it('item butonuna tiklandiginda onItemSelect cagrilir', async () => {
    const handler = vi.fn();
    render(<List items={defaultItems} onItemSelect={handler} />);
    await userEvent.click(screen.getByText('Item Two'));
    expect(handler).toHaveBeenCalledWith('2');
  });

  it('selectedKey ile secili item aria-current alir', () => {
    const handler = vi.fn();
    const { container } = render(
      <List items={defaultItems} onItemSelect={handler} selectedKey="2" />,
    );
    const selected = container.querySelector('[aria-current="true"]');
    expect(selected).toBeInTheDocument();
  });

  it('onItemSelect yoksa div render edilir (buton degil)', () => {
    const { container } = render(<List items={defaultItems} />);
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

describe('List — empty state', () => {
  it('bos items dizisinde empty state gosterilir', () => {
    render(<List items={[]} />);
    // EmptyState component renders something — the section still exists
    const section = screen.getByTestId('list-loading-state');
    expect(section).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Loading                                                            */
/* ------------------------------------------------------------------ */

describe('List — loading', () => {
  it('loading durumunda aria-busy true olur', () => {
    render(<List items={[]} loading />);
    const section = screen.getByTestId('list-loading-state');
    expect(section).toHaveAttribute('aria-busy', 'true');
  });

  it('loading durumunda skeleton li elementleri render edilir', () => {
    const { container } = render(<List items={[]} loading />);
    expect(container.querySelectorAll('li').length).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('List — access control', () => {
  it('access="hidden" durumunda hicbir sey render edilmez', () => {
    const { container } = render(<List items={defaultItems} access="hidden" />);
    expect(container.querySelector('section')).not.toBeInTheDocument();
  });

  it('access="full" durumunda normal render edilir', () => {
    const { container } = render(<List items={defaultItems} access="full" />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('access="disabled" durumunda data-access-state atanir', () => {
    const { container } = render(<List items={defaultItems} access="disabled" />);
    expect(container.querySelector('section')).toHaveAttribute('data-access-state', 'disabled');
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(<List items={defaultItems} accessReason="No perms" />);
    expect(container.querySelector('section')).toHaveAttribute('title', 'No perms');
  });

  it('disabled item tiklandiginda onItemSelect calismaz', async () => {
    const handler = vi.fn();
    const items: ListItem[] = [{ key: '1', title: 'Disabled', disabled: true }];
    render(<List items={items} onItemSelect={handler} />);
    await userEvent.click(screen.getByText('Disabled'));
    expect(handler).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('List — edge cases', () => {
  it('fullWidth=false durumunda w-full class uygulanmaz', () => {
    const { container } = render(<List items={defaultItems} fullWidth={false} />);
    expect(container.querySelector('section')?.className).not.toContain('w-full');
  });

  it('density="compact" class farkli padding uygular', () => {
    const { container } = render(
      <List items={defaultItems} density="compact" onItemSelect={vi.fn()} />,
    );
    const btn = container.querySelector('button');
    expect(btn?.className).toContain('py-3');
  });
});

describe('List — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<List items={defaultItems} />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('List — interaction & role', () => {
  it('has accessible list role', () => {
    render(<List items={defaultItems} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});
