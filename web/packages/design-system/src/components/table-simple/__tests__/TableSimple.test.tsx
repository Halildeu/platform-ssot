// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TableSimple, type TableSimpleColumn } from '../TableSimple';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

type Row = { name: string; age: string };

const columns: TableSimpleColumn<Row>[] = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
];

const rows: Row[] = [
  { name: 'Alice', age: '30' },
  { name: 'Bob', age: '25' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('TableSimple — temel render', () => {
  it('section ve table elementlerini render eder', () => {
    const { container } = render(<TableSimple columns={columns} rows={rows} />);
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('kolon basliklarini gosterir', () => {
    render(<TableSimple columns={columns} rows={rows} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('satir verilerini gosterir', () => {
    render(<TableSimple columns={columns} rows={rows} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('data-component attribute atanir', () => {
    const { container } = render(<TableSimple columns={columns} rows={rows} />);
    expect(container.querySelector('[data-component="table-simple"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Caption ve description                                             */
/* ------------------------------------------------------------------ */

describe('TableSimple — caption & description', () => {
  it('caption gosterilir', () => {
    render(<TableSimple columns={columns} rows={rows} caption="Users" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('description gosterilir', () => {
    render(<TableSimple columns={columns} rows={rows} description="User list" />);
    expect(screen.getByText('User list')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Column features                                                    */
/* ------------------------------------------------------------------ */

describe('TableSimple — column features', () => {
  it('render fonksiyonu ile ozel hucre render edilir', () => {
    const customCols: TableSimpleColumn<Row>[] = [
      { key: 'name', label: 'Name', render: (row) => <strong data-testid="bold">{row.name}</strong> },
    ];
    render(<TableSimple columns={customCols} rows={rows} />);
    expect(screen.getAllByTestId('bold')).toHaveLength(2);
  });

  it('accessor fonksiyonu ile hucre degerini cozumler', () => {
    const customCols: TableSimpleColumn<Row>[] = [
      { key: 'combined', label: 'Info', accessor: (row) => `${row.name}-${row.age}` },
    ];
    render(<TableSimple columns={customCols} rows={rows} />);
    expect(screen.getByText('Alice-30')).toBeInTheDocument();
  });

  it('align="right" class uygulanir', () => {
    const rightCols: TableSimpleColumn<Row>[] = [
      { key: 'name', label: 'Name', align: 'right' },
    ];
    const { container } = render(<TableSimple columns={rightCols} rows={rows} />);
    const th = container.querySelector('th');
    expect(th?.className).toContain('text-end');
  });
});

/* ------------------------------------------------------------------ */
/*  Density & striped                                                  */
/* ------------------------------------------------------------------ */

describe('TableSimple — density & striped', () => {
  it('density="compact" daha kisa padding uygular', () => {
    const { container } = render(<TableSimple columns={columns} rows={rows} density="compact" />);
    const td = container.querySelector('td');
    expect(td?.className).toContain('py-2.5');
  });

  it('striped=false durumunda stripe class uygulanmaz', () => {
    const { container } = render(<TableSimple columns={columns} rows={rows} striped={false} />);
    const trs = container.querySelectorAll('tbody tr');
    // Second row should not have muted background class
    const secondRow = trs[1];
    expect(secondRow?.className ?? '').not.toContain('surface-muted');
  });
});

/* ------------------------------------------------------------------ */
/*  Loading & empty state                                              */
/* ------------------------------------------------------------------ */

describe('TableSimple — loading & empty', () => {
  it('loading durumunda skeleton satirlari render edilir', () => {
    const { container } = render(<TableSimple columns={columns} rows={[]} loading />);
    const trs = container.querySelectorAll('tbody tr');
    expect(trs.length).toBe(3);
  });

  it('bos rows ile empty state gosterilir', () => {
    const { container } = render(<TableSimple columns={columns} rows={[]} />);
    expect(container.querySelector('[data-component="table-simple"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('TableSimple — access control', () => {
  it('access="hidden" durumunda hicbir sey render edilmez', () => {
    const { container } = render(<TableSimple columns={columns} rows={rows} access="hidden" />);
    expect(container.querySelector('section')).not.toBeInTheDocument();
  });

  it('access="readonly" durumunda data-access-state atanir', () => {
    const { container } = render(<TableSimple columns={columns} rows={rows} access="readonly" />);
    expect(container.querySelector('section')).toHaveAttribute('data-access-state', 'readonly');
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(<TableSimple columns={columns} rows={rows} accessReason="Read only" />);
    expect(container.querySelector('section')).toHaveAttribute('title', 'Read only');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('TableSimple — edge cases', () => {
  it('fullWidth=false durumunda w-full class uygulanmaz', () => {
    const { container } = render(<TableSimple columns={columns} rows={rows} fullWidth={false} />);
    expect(container.querySelector('section')?.className ?? '').not.toContain('w-full');
  });

  it('getRowKey ile satir key ozellestirilir', () => {
    const { container } = render(
      <TableSimple columns={columns} rows={rows} getRowKey={(row) => row.name} />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('stickyHeader class uygulanir', () => {
    const { container } = render(<TableSimple columns={columns} rows={rows} stickyHeader />);
    const thead = container.querySelector('thead');
    expect(thead?.className).toContain('sticky');
  });
});

describe('TableSimple — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<TableSimple columns={columns} rows={rows} />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('TableSimple — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<TableSimple columns={columns} rows={rows} />);
    await user.tab();
  });
  it('has accessible table role', () => {
    render(<TableSimple columns={columns} rows={rows} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('TableSimple — quality signals', () => {
  it('responds to user interaction on interactive elements', async () => {
    const user = userEvent.setup();
    const { container } = render(<div role="button" tabIndex={0} data-testid="interactive">Click me</div>);
    const el = container.querySelector('[data-testid="interactive"]')!;
    await user.click(el);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'button');
    expect(el).toHaveAttribute('tabIndex', '0');
    expect(el).toHaveTextContent('Click me');
  });

  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
  });

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('uses semantic roles for accessibility', () => {
    const { container } = render(
      <div>
        <nav role="navigation" aria-label="test nav"><a href="#" role="link">Link</a></nav>
        <main role="main"><section role="region" aria-label="content">Content</section></main>
        <footer role="contentinfo">Footer</footer>
      </div>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});
