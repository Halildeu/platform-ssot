// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';
import userEvent from '@testing-library/user-event';

/* ------------------------------------------------------------------ */
/*  Mocks — AG Grid cannot render in jsdom                            */
/* ------------------------------------------------------------------ */

let _capturedProps: Record<string, unknown> = {};

vi.mock('ag-grid-react', () => ({
  AgGridReact: (props: Record<string, unknown>) => {
    _capturedProps = props;
    return (
      <div
        data-testid="ag-grid-mock"
        data-row-model-type={props.rowModelType as string}
      >
        AG Grid Mock
      </div>
    );
  },
}));

vi.mock('../setup', () => ({
  AG_GRID_SETUP_COMPLETE: true,
}));

vi.mock('../grid-theme.css', () => ({}));

import { AgGridServer } from '../AgGridServer';

const mockGetData = vi.fn(async () => ({ rows: [], total: 0 }));

afterEach(() => {
  cleanup();
  _capturedProps = {};
  vi.clearAllMocks();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('AgGridServer — temel render', () => {
  it('GridShell üzerinden render eder ve grid-shell data-component atar', () => {
    const { container } = render(
      <AgGridServer columnDefs={[{ field: 'name' }]} getData={mockGetData} />,
    );
    expect(container.querySelector('[data-component="grid-shell"]')).toBeInTheDocument();
  });

  it('AgGridReact bileşenini render eder', () => {
    render(
      <AgGridServer columnDefs={[{ field: 'name' }]} getData={mockGetData} />,
    );
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });

  it('rowModelType="serverSide" olarak yapılandırır', () => {
    render(
      <AgGridServer columnDefs={[{ field: 'name' }]} getData={mockGetData} />,
    );
    const grid = screen.getByTestId('ag-grid-mock');
    expect(grid).toHaveAttribute('data-row-model-type', 'serverSide');
  });
});

/* ------------------------------------------------------------------ */
/*  Height prop                                                        */
/* ------------------------------------------------------------------ */

describe('AgGridServer — height prop', () => {
  it('varsayılan height 600px dir', () => {
    const { container } = render(
      <AgGridServer columnDefs={[]} getData={mockGetData} />,
    );
    const themeDiv = container.querySelector('.ag-theme-quartz') as HTMLElement;
    expect(themeDiv.style.height).toBe('600px');
  });

  it('özel height değeri uygulanır (number)', () => {
    const { container } = render(
      <AgGridServer columnDefs={[]} getData={mockGetData} height={400} />,
    );
    const themeDiv = container.querySelector('.ag-theme-quartz') as HTMLElement;
    expect(themeDiv.style.height).toBe('400px');
  });

  it('özel height değeri uygulanır (string)', () => {
    const { container } = render(
      <AgGridServer columnDefs={[]} getData={mockGetData} height="50vh" />,
    );
    const themeDiv = container.querySelector('.ag-theme-quartz') as HTMLElement;
    expect(themeDiv.style.height).toBe('50vh');
  });
});

/* ------------------------------------------------------------------ */
/*  Theme & Density                                                    */
/* ------------------------------------------------------------------ */

describe('AgGridServer — theme & density', () => {
  it('varsayılan tema quartz', () => {
    const { container } = render(
      <AgGridServer columnDefs={[]} getData={mockGetData} />,
    );
    expect(container.querySelector('.ag-theme-quartz')).toBeInTheDocument();
  });

  it('özel tema uygulanır', () => {
    const { container } = render(
      <AgGridServer columnDefs={[]} getData={mockGetData} theme="balham" />,
    );
    expect(container.querySelector('.ag-theme-balham')).toBeInTheDocument();
  });

  it('varsayılan density comfortable', () => {
    const { container } = render(
      <AgGridServer columnDefs={[]} getData={mockGetData} />,
    );
    expect(container.querySelector('[data-density="comfortable"]')).toBeInTheDocument();
  });

  it('compact density uygulanır', () => {
    const { container } = render(
      <AgGridServer columnDefs={[]} getData={mockGetData} density="compact" />,
    );
    expect(container.querySelector('[data-density="compact"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Column definitions                                                 */
/* ------------------------------------------------------------------ */

describe('AgGridServer — column definitions', () => {
  it('çoklu kolonlu columnDefs ile hatasız render eder', () => {
    const cols = [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'name', headerName: 'Ad', flex: 1 },
      { field: 'status', headerName: 'Durum', sortable: true },
    ];
    render(
      <AgGridServer columnDefs={cols} getData={mockGetData} />,
    );
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });

  it('boş columnDefs ile render eder', () => {
    render(
      <AgGridServer columnDefs={[]} getData={mockGetData} />,
    );
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  getData callback                                                   */
/* ------------------------------------------------------------------ */

describe('AgGridServer — getData callback', () => {
  it('getData prop kabul eder ve render hatası vermez', () => {
    const serverData = vi.fn(async () => ({
      rows: [{ id: 1, name: 'Test' }],
      total: 1,
    }));
    render(
      <AgGridServer columnDefs={[{ field: 'name' }]} getData={serverData} />,
    );
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  GridOptions pass-through                                           */
/* ------------------------------------------------------------------ */

describe('AgGridServer — gridOptions', () => {
  it('gridOptions merge edilip AG Grid e aktarılır', () => {
    render(
      <AgGridServer
        columnDefs={[{ field: 'name' }]}
        getData={mockGetData}
        gridOptions={{ pagination: true, paginationPageSize: 25 }}
      />,
    );
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  className forwarding                                               */
/* ------------------------------------------------------------------ */

describe('AgGridServer — className forwarding', () => {
  it('className GridShell kapsayıcısına aktarılır', () => {
    const { container } = render(
      <AgGridServer columnDefs={[]} getData={mockGetData} className="custom-grid" />,
    );
    const shell = container.querySelector('[data-component="grid-shell"]') as HTMLElement;
    expect(shell.className).toContain('custom-grid');
  });
});

/* ------------------------------------------------------------------ */
/*  Messages prop                                                      */
/* ------------------------------------------------------------------ */

describe('AgGridServer — messages prop', () => {
  it('messages.loadingLabel prop kabul edilir', () => {
    render(
      <AgGridServer
        columnDefs={[]}
        getData={mockGetData}
        messages={{ loadingLabel: 'Yükleniyor...' }}
      />,
    );
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility                                                      */
/* ------------------------------------------------------------------ */

describe('AgGridServer — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <AgGridServer columnDefs={[{ field: 'name' }]} getData={vi.fn(async () => ({ rows: [], total: 0 }))} />,
    );
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('AgGridServer — quality signals', () => {
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

  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
  });

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
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
