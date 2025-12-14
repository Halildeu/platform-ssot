import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, InfiniteRowModelModule, ClientSideRowModelModule } from 'ag-grid-community';
import type { IGetRowsParams, IDatasource } from 'ag-grid-community';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  GridOptions
} from 'ag-grid-community';
import './audit-event-feed.css';
import { AuditEvent } from '../types/audit-event';
import { fetchAuditEvents, resolveHttpClient } from '../services/audit-api';
import { useAuditLiveStream } from '../hooks/useAuditLiveStream';
import { AuditDetailDrawer } from './AuditDetailDrawer';
import { getShellServices, type RemoteShellServices } from '../services/shell-services';

const PAGE_SIZE = 200;

ModuleRegistry.registerModules([ClientSideRowModelModule, InfiniteRowModelModule]);

const columnDefs: ColDef<AuditEvent>[] = [
  { headerName: 'Timestamp', field: 'timestamp', flex: 1.4, valueFormatter: (params) => new Date(params.value).toLocaleString() },
  { headerName: 'User', field: 'userEmail', flex: 1 },
  { headerName: 'Service', field: 'service', flex: 1 },
  { headerName: 'Action', field: 'action', flex: 1.2 },
  { headerName: 'Level', field: 'level', width: 110 },
  { headerName: 'Correlation ID', field: 'correlationId', flex: 1 }
];

export const AuditEventFeed: React.FC = () => {
  const gridRef = useRef<AgGridReact<AuditEvent>>(null);
  const [gridApi, setGridApi] = useState<GridApi<AuditEvent> | null>(null);
  const [filters, setFilters] = useState({ userEmail: '', service: '', level: '' });
  const [selected, setSelected] = useState<AuditEvent | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(() => new URLSearchParams(window.location.search).get('auditId'));
  const [isLive, setIsLive] = useState(false);
  const [currentSort, setCurrentSort] = useState<string | undefined>(undefined);
  const initialAuditIdRef = useRef<string | null>(highlightId);
  const deeplinkNotifiedRef = useRef(false);
  const deeplinkResolvedRef = useRef(false);
  const userManagedLiveRef = useRef(false);

  const shellServices = useMemo<RemoteShellServices | null>(() => {
    try {
      return getShellServices();
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[audit] Shell servisleri hazır değil, noop kullanılacak.', error);
      }
      return null;
    }
  }, []);

  const emitTelemetry = useCallback(
    (type: string, payload?: Record<string, unknown>) => {
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return;
      }
      try {
        shellServices?.telemetry?.emit({ type, payload });
      } catch (error) {
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
        const page = Math.floor(startRow / PAGE_SIZE);
        const sort = sortModel && sortModel[0] ? `${sortModel[0].colId},${sortModel[0].sort}` : undefined;
        setCurrentSort(sort);
        const response = await fetchAuditEvents({
          page,
          pageSize: PAGE_SIZE,
          sort,
          filters: filters.userEmail || filters.service || filters.level ? filters : undefined
        });
        successCallback(response.events, response.total);
        if (!response.fallback && !userManagedLiveRef.current) {
          setIsLive(true);
        }
        emitTelemetry('fe.audit.grid_fetch', {
          page,
          pageSize: PAGE_SIZE,
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
      } catch (error) {
        console.error('Audit events fetch failed', error);
        failCallback();
        emitTelemetry('fe.audit.grid_fetch_failed', {
          filters,
          sort: currentSort
        });
      }
    },
    [filters, currentSort, emitTelemetry]
  );

  const datasource = useMemo<IDatasource>(() => ({
    getRows: (params) => {
      requestAuditRows(params);
    }
  }), [requestAuditRows]);

  const onGridReady = useCallback((event: GridReadyEvent<AuditEvent>) => {
    setGridApi(event.api);
    event.api.setGridOption('datasource', datasource);
  }, [datasource]);

  const refreshData = useCallback(() => {
    if (gridApi) {
      gridApi.refreshInfiniteCache();
    }
  }, [gridApi]);

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
      level: (formData.get('level') as string) ?? ''
    });
    if (gridApi) {
      gridApi.ensureIndexVisible(0, 'top');
    }
    refreshData();
  }, [gridApi, refreshData]);

  const rowClassRules = useMemo(() => ({
    'audit-row-highlight': (params: { data?: AuditEvent }) => !!highlightId && params.data?.id === highlightId
  }), [highlightId]);

  const gridOptions = useMemo<GridOptions<AuditEvent>>(() => ({
    columnDefs,
    defaultColDef: { resizable: true, sortable: true, filter: false },
    rowModelType: 'infinite',
    maxBlocksInCache: 3,
    pagination: true,
    paginationPageSize: PAGE_SIZE,
    animateRows: true,
    rowSelection: 'single',
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
  }), [rowClassRules, emitTelemetry]);

  useEffect(() => {
    if (gridApi) {
      gridApi.setGridOption('datasource', datasource);
    }
  }, [gridApi, datasource]);

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
    if (!matched) {
      gridApi.ensureIndexVisible(0, 'top');
    }
  }, [highlightId, gridApi, emitTelemetry]);

  const handleExport = useCallback(async (format: 'csv' | 'json') => {
    emitTelemetry('fe.audit.export', {
      format,
      filters,
      sort: currentSort
    });
    const client = resolveHttpClient();
    const params: Record<string, string> = {
      format,
    };
    if (currentSort) {
      params.sort = currentSort;
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params[`filter[${key}]`] = value;
      }
    });
    try {
      const response = await client.get<Blob>('/audit/events/export', {
        params,
        responseType: 'blob',
      });
      const blobUrl = URL.createObjectURL(response.data);
      const disposition = response.headers?.['content-disposition'];
      const filenameMatch = disposition?.match(/filename="?([^"]+)"?/i);
      const filename = filenameMatch?.[1] ?? `audit-events.${format}`;
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
    } catch (error) {
      console.error('Audit export failed', error);
      emitTelemetry('fe.audit.export_failed', {
        format,
        filters,
        sort: currentSort,
      });
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
        <form className="audit-filter-bar" onSubmit={onFilterSubmit}>
          <label>
            User Email
            <input name="userEmail" placeholder="user@example.com" defaultValue={filters.userEmail} />
          </label>
          <label>
            Service
            <input name="service" placeholder="service-name" defaultValue={filters.service} />
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
            <button type="submit">Apply Filters</button>
          </div>
        </form>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button type="button" className="secondary" onClick={refreshData}>
            Refresh
          </button>
          <button type="button" onClick={() => handleExport('csv')}>
            Export CSV
          </button>
          <button type="button" onClick={() => handleExport('json')}>
            Export JSON
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

      <div className="ag-theme-quartz audit-grid">
        <AgGridReact<AuditEvent>
          ref={gridRef}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
        />
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
