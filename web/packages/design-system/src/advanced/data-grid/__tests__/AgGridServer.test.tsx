// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

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
