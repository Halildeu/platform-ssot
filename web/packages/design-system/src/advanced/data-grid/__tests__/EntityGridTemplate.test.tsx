// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

/* ------------------------------------------------------------------ */
/*  Mocks — AG Grid cannot render in jsdom, mock AgGridReact          */
/* ------------------------------------------------------------------ */

vi.mock('ag-grid-react', () => ({
  AgGridReact: (props: Record<string, unknown>) => (
    <div data-testid="ag-grid-mock" data-row-model-type={props.rowModelType as string}>
      AG Grid Mock
    </div>
  ),
}));

vi.mock('../setup', () => ({
  AG_GRID_SETUP_COMPLETE: true,
}));

vi.mock('../grid-theme.css', () => ({}));

vi.mock('../VariantIntegration', () => ({
  VariantIntegration: () => <div data-testid="variant-integration-mock" />,
}));

// Mock the fetch-based variant integration dependencies
vi.mock('../../../../lib/grid-variants', () => ({
  fetchGridVariants: vi.fn(async () => []),
  createGridVariant: vi.fn(async () => ({})),
  updateGridVariant: vi.fn(async () => ({})),
  deleteGridVariant: vi.fn(async () => ({})),
}));

import { EntityGridTemplate } from '../EntityGridTemplate';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('EntityGridTemplate — temel render', () => {
  it('data-component="entity-grid-template" attribute atar', () => {
    const { container } = render(
      <EntityGridTemplate
        gridId="test-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
      />,
    );
    const el = container.querySelector('[data-component="entity-grid-template"]');
    expect(el).toBeInTheDocument();
  });

  it('data-grid-id attribute olarak gridId değerini atar', () => {
    const { container } = render(
      <EntityGridTemplate
        gridId="my-grid-id"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
      />,
    );
    const el = container.querySelector('[data-grid-id="my-grid-id"]');
    expect(el).toBeInTheDocument();
  });

  it('AgGridReact bileşenini render eder', () => {
    render(
      <EntityGridTemplate
        gridId="test-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
      />,
    );
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Column definitions                                                 */
/* ------------------------------------------------------------------ */

describe('EntityGridTemplate — column definitions', () => {
  it('tekli kolon tanımı ile hatasız render eder', () => {
    const { container } = render(
      <EntityGridTemplate
        gridId="col-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name', headerName: 'Ad' }]}
      />,
    );
    expect(container.querySelector('[data-component="entity-grid-template"]')).toBeInTheDocument();
  });

  it('birden fazla kolon tanımı ile render eder', () => {
    const columns = [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'name', headerName: 'Ad', flex: 1 },
      { field: 'status', headerName: 'Durum', sortable: true },
      { field: 'createdAt', headerName: 'Tarih', filter: true },
    ];
    const { container } = render(
      <EntityGridTemplate
        gridId="multi-col-grid"
        gridSchemaVersion={1}
        columnDefs={columns}
      />,
    );
    expect(container.querySelector('[data-component="entity-grid-template"]')).toBeInTheDocument();
  });

  it('boş columnDefs ile render eder', () => {
    const { container } = render(
      <EntityGridTemplate
        gridId="empty-col-grid"
        gridSchemaVersion={1}
        columnDefs={[]}
      />,
    );
    expect(container.querySelector('[data-component="entity-grid-template"]')).toBeInTheDocument();
  });

  it('defaultColDef ile varsayılan kolon ayarları kabul edilir', () => {
    const { container } = render(
      <EntityGridTemplate
        gridId="default-col-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }, { field: 'age' }]}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          minWidth: 100,
        }}
      />,
    );
    expect(container.querySelector('[data-component="entity-grid-template"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Datasource mode — server vs client                                 */
/* ------------------------------------------------------------------ */

describe('EntityGridTemplate — dataSourceMode', () => {
  it('varsayılan mod server: rowModelType="serverSide" geçer', () => {
    render(
      <EntityGridTemplate
        gridId="server-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'id' }]}
      />,
    );
    const grid = screen.getByTestId('ag-grid-mock');
    expect(grid).toHaveAttribute('data-row-model-type', 'serverSide');
  });

  it('dataSourceMode="client" ile rowModelType="clientSide" geçer', () => {
    render(
      <EntityGridTemplate
        gridId="client-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'id' }]}
        dataSourceMode="client"
        rowData={[{ id: 1 }]}
      />,
    );
    const grid = screen.getByTestId('ag-grid-mock');
    expect(grid).toHaveAttribute('data-row-model-type', 'clientSide');
  });

  it('createServerSideDatasource callback prop kabul eder', () => {
    const createDs = vi.fn();
    const { container } = render(
      <EntityGridTemplate
        gridId="ds-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'id' }]}
        dataSourceMode="server"
        createServerSideDatasource={createDs}
      />,
    );
    expect(container.querySelector('[data-component="entity-grid-template"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Pagination — client mode renders TablePagination                   */
/* ------------------------------------------------------------------ */

describe('EntityGridTemplate — pagination', () => {
  it('client modda TablePagination render eder', () => {
    const { container } = render(
      <EntityGridTemplate
        gridId="pagination-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        dataSourceMode="client"
        rowData={[{ name: 'A' }, { name: 'B' }]}
        total={100}
      />,
    );
    expect(container.querySelector('[data-component="table-pagination"]')).toBeInTheDocument();
  });

  it('server modda TablePagination render etmez', () => {
    const { container } = render(
      <EntityGridTemplate
        gridId="server-pagination-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        dataSourceMode="server"
      />,
    );
    expect(container.querySelector('[data-component="table-pagination"]')).not.toBeInTheDocument();
  });

  it('pageSizeOptions geçilir', () => {
    const { container } = render(
      <EntityGridTemplate
        gridId="page-size-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        dataSourceMode="client"
        rowData={[]}
        total={200}
        pageSizeOptions={[10, 25, 50, 100]}
      />,
    );
    // Use container query to find the pagination combobox (not the theme selector)
    const paginationEl = container.querySelector('[data-component="table-pagination"]');
    const select = paginationEl?.querySelector('select');
    expect(select).toBeInTheDocument();
    const options = select!.querySelectorAll('option');
    expect(options).toHaveLength(4);
  });
});

/* ------------------------------------------------------------------ */
/*  Toolbar extras                                                     */
/* ------------------------------------------------------------------ */

describe('EntityGridTemplate — toolbar', () => {
  it('toolbarExtras içeriğini render eder', () => {
    render(
      <EntityGridTemplate
        gridId="toolbar-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        toolbarExtras={
          <>
            <button type="button">Yeni Ekle</button>
            <button type="button">Sil</button>
          </>
        }
      />,
    );
    expect(screen.getByText('Yeni Ekle')).toBeInTheDocument();
    expect(screen.getByText('Sil')).toBeInTheDocument();
  });

  it('exportConfig kabul eder ve render hatası vermez', () => {
    const { container } = render(
      <EntityGridTemplate
        gridId="export-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        exportConfig={{
          fileBaseName: 'rapor-export',
          sheetName: 'Sayfa1',
        }}
      />,
    );
    expect(container.querySelector('[data-component="entity-grid-template"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Event callbacks                                                    */
/* ------------------------------------------------------------------ */

describe('EntityGridTemplate — event callbacks', () => {
  it('onGridReady callback prop kabul eder', () => {
    const onGridReady = vi.fn();
    const { container } = render(
      <EntityGridTemplate
        gridId="ready-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'id' }]}
        onGridReady={onGridReady}
      />,
    );
    expect(container.querySelector('[data-component="entity-grid-template"]')).toBeInTheDocument();
  });

  it('onRowDoubleClick callback prop kabul eder', () => {
    const onRowDoubleClick = vi.fn();
    const { container } = render(
      <EntityGridTemplate
        gridId="dblclick-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'id' }]}
        rowData={[{ id: 1 }]}
        onRowDoubleClick={onRowDoubleClick}
      />,
    );
    expect(container.querySelector('[data-component="entity-grid-template"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Messages prop                                                      */
/* ------------------------------------------------------------------ */

describe('EntityGridTemplate — messages prop', () => {
  it('toolbar ve pagination mesajları kabul edilir', () => {
    const { container } = render(
      <EntityGridTemplate
        gridId="msg-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        messages={{
          quickFilterPlaceholder: 'Ara...',
          resetFiltersLabel: 'Filtreleri Sıfırla',
          excelVisibleLabel: 'Excel (Görünen)',
          excelAllLabel: 'Excel (Tümü)',
          csvVisibleLabel: 'CSV (Görünen)',
          csvAllLabel: 'CSV (Tümü)',
          fullscreenTooltip: 'Tam Ekran',
          pageSizeLabel: 'Sayfa boyutu',
          recordCountLabel: 'Toplam kayıt',
        }}
      />,
    );
    expect(container.querySelector('[data-component="entity-grid-template"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Variant integration slot                                           */
/* ------------------------------------------------------------------ */

describe('EntityGridTemplate — variant integration', () => {
  it('VariantIntegration bileşenini render eder', () => {
    render(
      <EntityGridTemplate
        gridId="variant-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
      />,
    );
    expect(screen.getByTestId('variant-integration-mock')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Flex layout structure                                              */
/* ------------------------------------------------------------------ */

describe('EntityGridTemplate — layout structure', () => {
  it('flex column layout kullanır', () => {
    const { container } = render(
      <EntityGridTemplate
        gridId="layout-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
      />,
    );
    const root = container.querySelector('[data-component="entity-grid-template"]') as HTMLElement;
    expect(root.classList.contains('flex')).toBe(true);
    expect(root.classList.contains('flex-col')).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility                                                      */
/* ------------------------------------------------------------------ */

describe('EntityGridTemplate — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <EntityGridTemplate gridId="test-grid" gridSchemaVersion={1} columnDefs={[{ field: 'name' }]} />,
    );
    await expectNoA11yViolations(container);
  });
});
