import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import type { IGetRowsParams, IDatasource } from 'ag-grid-community';
import {
  TablePagination,
  useAgGridTablePagination,
  type AgGridTablePaginationApi,
} from '@mfe/design-system';
// Side-effect: ensures all AG Grid modules are registered (including InfiniteRowModelModule)
import '@mfe/design-system/advanced/data-grid/setup';
import {
  ColDef,
  GridReadyEvent,
  GridOptions
} from 'ag-grid-community';
import './audit-event-feed.css';
import { AuditEvent } from '../types/audit-event';
import {
  createAuditExportJob,
  downloadAuditExportJob,
  fetchAuditEvents,
  waitForAuditExportJob,
} from '../services/audit-api';
import { useAuditLiveStream } from '../hooks/useAuditLiveStream';
import { AuditDetailDrawer } from './AuditDetailDrawer';
import { getShellServices, type RemoteShellServices } from '../services/shell-services';
import { parseAuditFeedSearch } from '../utils/audit-feed-deeplink';

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200];
const AUDIT_EXPORT_PERMISSION = 'AUDIT-EXPORT';

// Module registration delegated to @mfe/design-system/advanced/data-grid/setup (single owner)

const columnDefs: ColDef<AuditEvent>[] = [
  { headerName: 'Timestamp', field: 'timestamp', flex: 1.4, valueFormatter: (params) => new Date(params.value).toLocaleString() },
  { headerName: 'User', field: 'userEmail', flex: 1 },
  { headerName: 'Service', field: 'service', flex: 1 },
  { headerName: 'Action', field: 'action', flex: 1.2 },
  { headerName: 'Level', field: 'level', width: 110 },
  { headerName: 'Correlation ID', field: 'correlationId', flex: 1 }
];

export const AuditEventFeed: React.FC = () => {
  const location = useLocation();
  const initialDeepLink = useRef(
    parseAuditFeedSearch(typeof window !== 'undefined' ? window.location.search : ''),
  );
  const gridRef = useRef<AgGridReact<AuditEvent>>(null);
  const [filters, setFilters] = useState(initialDeepLink.current.filters);
  const [selected, setSelected] = useState<AuditEvent | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(initialDeepLink.current.auditId);
  const [isLive, setIsLive] = useState(false);
  const [currentSort, setCurrentSort] = useState<string | undefined>(undefined);
  const [totalItems, setTotalItems] = useState(0);
  const [exportingFormat, setExportingFormat] = useState<'csv' | 'json' | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const {
    gridApi,
    gridApiRef,
    pageSize,
    pageSizeRef,
    paginationSnapshot,
    registerGridApi,
    refreshPaginationSnapshot,
    handlePageChange,
    handlePageSizeChange,
  } = useAgGridTablePagination<AuditEvent>({
    initialPageSize: DEFAULT_PAGE_SIZE,
    totalItems,
    syncPageSizeToGrid: (api, nextPageSize) => {
      api.setGridOption?.('cacheBlockSize', nextPageSize);
    },
  });
  const initialAuditIdRef = useRef<string | null>(initialDeepLink.current.auditId);
  const lastSearchRef = useRef<string>(location.search);
  const deeplinkNotifiedRef = useRef(false);
  const deeplinkResolvedRef = useRef(false);
  const userManagedLiveRef = useRef(false);

  const shellServices = useMemo<RemoteShellServices | null>(() => {
    try {
      return getShellServices();
    } catch (error: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[audit] Shell servisleri hazır değil, noop kullanılacak.', error);
      }
      return null;
    }
  }, []);

  const canExportAudit = useMemo(() => {
    const shellUser = shellServices?.auth.getUser() as { permissions?: unknown; role?: unknown } | null;
    const permissions = Array.isArray(shellUser?.permissions) ? shellUser.permissions : [];
    return permissions.some((permission) =>
      String(permission ?? '')
        .trim()
        .toUpperCase()
        .replace(/_/g, '-')
        === AUDIT_EXPORT_PERMISSION,
    );
  }, [shellServices]);

  const emitTelemetry = useCallback(
    (type: string, payload?: Record<string, unknown>) => {
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return;
      }
      try {
        shellServices?.telemetry?.emit({ type, payload });
      } catch (error: unknown) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[audit] Telemetry emit failed', error);
        }
      }
    },
    [shellServices]
  );

  useEffect(() => {
    if (shellServices && initialAuditIdRef.current && !deeplinkNotifiedRef.current) {
      deeplinkNotifiedRef.current = true;
      emitTelemetry('fe.audit.deeplink_requested', {
        auditId: initialAuditIdRef.current
      });
    }
  }, [shellServices, emitTelemetry]);

  const requestAuditRows = useCallback(
    async ({ startRow, successCallback, failCallback, sortModel }: IGetRowsParams<AuditEvent>) => {
      try {
        const resolvedPageSize = pageSizeRef.current;
        const page = Math.floor(startRow / resolvedPageSize);
        const sort = sortModel && sortModel[0] ? `${sortModel[0].colId},${sortModel[0].sort}` : undefined;
        const requestedAuditId = initialAuditIdRef.current ?? undefined;
        setCurrentSort(sort);
        const response = await fetchAuditEvents({
          page,
          pageSize: resolvedPageSize,
          auditId: requestedAuditId,
          sort,
          filters: filters.userEmail || filters.service || filters.level || filters.action ? filters : undefined
        });
        setTotalItems(response.total);
        successCallback(response.events, response.total);
        if (!response.fallback && !userManagedLiveRef.current) {
          setIsLive(true);
        }
        emitTelemetry('fe.audit.grid_fetch', {
          page,
          pageSize: resolvedPageSize,
          returned: response.events.length,
          total: response.total,
          sort,
          filters,
          fallback: response.fallback === true
        });
        if (initialAuditIdRef.current && !deeplinkResolvedRef.current) {
          const matched = response.events.some((event) => event.id === initialAuditIdRef.current);
          if (matched) {
            deeplinkResolvedRef.current = true;
            emitTelemetry('fe.audit.deeplink_resolved', {
              auditId: initialAuditIdRef.current,
              page
            });
          }
        }
      } catch (error: unknown) {
        console.error('Audit events fetch failed', error);
        failCallback();
        emitTelemetry('fe.audit.grid_fetch_failed', {
          filters,
          sort: currentSort
        });
      }
    },
    [currentSort, emitTelemetry, filters, pageSizeRef]
  );

  const datasource = useMemo<IDatasource>(() => ({
    getRows: (params) => {
      requestAuditRows(params);
    }
  }), [requestAuditRows]);

  const onGridReady = useCallback((event: GridReadyEvent<AuditEvent>) => {
    event.api.setGridOption('datasource', datasource);
    registerGridApi(event.api as AgGridTablePaginationApi<AuditEvent>);
  }, [datasource, registerGridApi]);

  const refreshData = useCallback(() => {
    const api = gridApiRef.current;
    if (api) {
      api.refreshInfiniteCache();
    }
  }, []);

  useEffect(() => {
    if (location.search === lastSearchRef.current) {
      return;
    }
    lastSearchRef.current = location.search;
    const deepLink = parseAuditFeedSearch(location.search);
    setFilters(deepLink.filters);
    setHighlightId(deepLink.auditId);
    initialAuditIdRef.current = deepLink.auditId;
    deeplinkNotifiedRef.current = false;
    deeplinkResolvedRef.current = false;
    const api = gridApiRef.current;
    if (api && (api.getDisplayedRowCount?.() ?? 0) > 0) {
      api.ensureIndexVisible(0, 'top');
      api.paginationGoToFirstPage?.();
    }
    refreshData();
  }, [gridApiRef, location.search, refreshData]);

  const handleLiveEvent = useCallback((event: AuditEvent) => {
    setHighlightId(event.id);
    refreshData();
    emitTelemetry('fe.audit.live_event_received', {
      auditId: event.id,
      level: event.level,
      service: event.service
    });
  }, [refreshData, emitTelemetry]);

  const liveHandlers = useMemo(() => ({
    onEvent: handleLiveEvent,
    onFallbackTick: () => {
        emitTelemetry('fe.audit.live_fallback_poll', {
          filters
        });
        refreshData();
      }
  }), [handleLiveEvent, refreshData, emitTelemetry, filters]);

  useAuditLiveStream(isLive, liveHandlers);

  const onFilterSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFilters({
      userEmail: (formData.get('userEmail') as string) ?? '',
      service: (formData.get('service') as string) ?? '',
      level: (formData.get('level') as string) ?? '',
      action: (formData.get('action') as string) ?? '',
    });
    const api = gridApiRef.current;
    if (api && (api.getDisplayedRowCount?.() ?? 0) > 0) {
      api.ensureIndexVisible(0, 'top');
      api.paginationGoToFirstPage?.();
    }
    refreshData();
  }, [refreshData]);

  const rowClassRules = useMemo(() => ({
    'audit-row-highlight': (params: { data?: AuditEvent }) => !!highlightId && params.data?.id === highlightId
  }), [highlightId]);

  const gridOptions = useMemo<GridOptions<AuditEvent>>(() => ({
    columnDefs,
    defaultColDef: { resizable: true, sortable: true, filter: false },
    rowModelType: 'infinite',
    maxBlocksInCache: 3,
    cacheBlockSize: pageSize,
    pagination: true,
    paginationPageSize: pageSize,
    suppressPaginationPanel: true,
    animateRows: true,
    rowSelection: {
      mode: 'singleRow',
      enableClickSelection: true,
      checkboxes: false,
    },
    getRowId: ({ data }) => data?.id ?? '',
    onRowClicked: (event) => {
      setSelected(event.data ?? null);
      setHighlightId(event.data?.id ?? null);
      if (event.data) {
        emitTelemetry('fe.audit.drawer_open', {
          auditId: event.data.id,
          level: event.data.level,
          service: event.data.service
        });
      }
    },
    rowClassRules
  }), [emitTelemetry, pageSize, rowClassRules]);

  useEffect(() => {
    if (gridApi) {
      gridApi.setGridOption?.('cacheBlockSize', pageSize);
      gridApi.setGridOption('datasource', datasource);
      refreshPaginationSnapshot(gridApi);
    }
  }, [datasource, gridApi, pageSize, refreshPaginationSnapshot]);

  useEffect(() => {
    if (!highlightId || !gridApi) {
      return;
    }
    let matched = false;
    gridApi.forEachNode((node) => {
      if (node.data?.id === highlightId) {
        matched = true;
        node.setSelected(true);
        gridApi.ensureNodeVisible(node, 'middle');
      }
    });
    if (!matched && (gridApi.getDisplayedRowCount?.() ?? 0) > 0) {
      gridApi.ensureIndexVisible(0, 'top');
    }
  }, [highlightId, gridApi, emitTelemetry]);

  const paginationLocaleText = useMemo(
    () => ({
      rowsPerPageLabel: 'Page size:',
      rangeLabel: (start: number, end: number, count: number) =>
        `${start}-${end} / ${count} records · Page ${paginationSnapshot.page} / ${paginationSnapshot.totalPages}`,
    }),
    [paginationSnapshot.page, paginationSnapshot.totalPages],
  );

  const handleExport = useCallback(async (format: 'csv' | 'json') => {
    setExportingFormat(format);
    setExportError(null);
    emitTelemetry('fe.audit.export', {
      format,
      filters,
      sort: currentSort
    });
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => Boolean(value)),
      );
      const createdJob = await createAuditExportJob({
        format,
        sort: currentSort,
        filters: activeFilters,
      });
      emitTelemetry('fe.audit.export_job_created', {
        format,
        jobId: createdJob.id,
        status: createdJob.status,
      });
      const resolvedJob = createdJob.status === 'PROCESSING'
        ? await waitForAuditExportJob(createdJob.id)
        : createdJob;
      if (resolvedJob.status !== 'COMPLETED') {
        throw new Error(resolvedJob.errorMessage || `Audit export job ended with status ${resolvedJob.status}`);
      }
      const { blob, filename } = await downloadAuditExportJob(resolvedJob.id);
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
      emitTelemetry('fe.audit.export_completed', {
        format,
        jobId: resolvedJob.id,
        eventCount: resolvedJob.eventCount,
      });
    } catch (error: unknown) {
      console.error('Audit export failed', error);
      setExportError(error instanceof Error ? error.message : 'Audit export failed');
      emitTelemetry('fe.audit.export_failed', {
        format,
        filters,
        sort: currentSort,
      });
    } finally {
      setExportingFormat(null);
    }
  }, [emitTelemetry, filters, currentSort]);

  const handleDrawerTabChange = useCallback((tab: string, event?: AuditEvent | null) => {
    if (!event) {
      return;
    }
    emitTelemetry('fe.audit.drawer_tab', {
      tab,
      auditId: event.id
    });
  }, [emitTelemetry]);

  return (
    <div>
      <div className="audit-toolbar">
        <form
          key={location.search || 'audit-filter-default'}
          data-testid="audit-filter-bar"
          className="audit-filter-bar"
          onSubmit={onFilterSubmit}
        >
          <label>
            User Email
            <input
              name="userEmail"
              data-testid="audit-filter-user-email"
              placeholder="user@example.com"
              defaultValue={filters.userEmail}
            />
          </label>
          <label>
            Service
            <input name="service" placeholder="service-name" defaultValue={filters.service} />
          </label>
          <label>
            Action
            <input name="action" placeholder="SESSION_CREATED" defaultValue={filters.action} />
          </label>
          <label>
            Level
            <select name="level" defaultValue={filters.level}>
              <option value="">All</option>
              <option value="INFO">Info</option>
              <option value="WARN">Warn</option>
              <option value="ERROR">Error</option>
            </select>
          </label>
          <div>
            <button data-testid="audit-filter-apply" type="submit">Apply Filters</button>
          </div>
        </form>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button type="button" className="secondary" onClick={refreshData}>
            Refresh
          </button>
          <button type="button" onClick={() => handleExport('csv')} disabled={exportingFormat !== null || !canExportAudit}>
            {exportingFormat === 'csv' ? 'Exporting CSV...' : 'Export CSV'}
          </button>
          <button type="button" onClick={() => handleExport('json')} disabled={exportingFormat !== null || !canExportAudit}>
            {exportingFormat === 'json' ? 'Exporting JSON...' : 'Export JSON'}
          </button>
          <label className="audit-live-indicator">
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => {
                userManagedLiveRef.current = true;
                emitTelemetry('fe.audit.live_toggle', {
                  enabled: e.target.checked
                });
                setIsLive(e.target.checked);
              }}
              style={{ marginRight: '0.25rem' }}
            />
            Live stream
          </label>
        </div>
      </div>
      {exportError ? (
        <div role="alert" style={{ marginBottom: '0.75rem', color: 'var(--state-danger-text)' }}>
          {exportError}
        </div>
      ) : null}
      {!canExportAudit ? (
        <div style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
          Export unavailable: audit-export permission required.
        </div>
      ) : null}

      <div data-testid="audit-grid" className="audit-grid-shell">
        <div className="ag-theme-quartz audit-grid">
          <AgGridReact<AuditEvent>
            ref={gridRef}
            gridOptions={gridOptions}
            onGridReady={onGridReady}
            onPaginationChanged={() => refreshPaginationSnapshot()}
            onModelUpdated={() => refreshPaginationSnapshot()}
          />
        </div>
        <div className="audit-pagination-shell">
          <TablePagination
            totalItems={paginationSnapshot.totalItems}
            page={paginationSnapshot.page}
            pageSize={paginationSnapshot.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            showFirstLastButtons
            access={gridApi ? 'full' : 'disabled'}
            className="w-full justify-between rounded-none border-0 bg-transparent p-0 shadow-none"
            localeText={paginationLocaleText}
          />
        </div>
      </div>

      <AuditDetailDrawer
        open={!!selected}
        event={selected}
        onClose={() => setSelected(null)}
        onTabChange={handleDrawerTabChange}
      />
    </div>
  );
};
