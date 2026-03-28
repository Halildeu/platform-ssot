import { startTransition, useEffect, useState } from "react";

import {
  fetchMobileReportDetail,
} from "../../services/reporting/reportingClient";
import type {
  MobileReportFilterValues,
  MobileReportId,
  ReportDetailSnapshot,
} from "../../services/reporting/reporting.contract";

type MobileReportDetailState = {
  status: "idle" | "loading" | "ready" | "error";
  detail: ReportDetailSnapshot | null;
  error: string | null;
};

const initialState: MobileReportDetailState = {
  status: "idle",
  detail: null,
  error: null,
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Rapor detayi yuklenemedi.";
}

export function useMobileReportDetail(
  token: string | null | undefined,
  reportId: MobileReportId,
  companyId?: number | null,
  filters: MobileReportFilterValues = {},
) {
  const [state, setState] = useState<MobileReportDetailState>(initialState);

  const refresh = async () => {
    if (!token) {
      startTransition(() => {
        setState(initialState);
      });
      return;
    }

    startTransition(() => {
      setState((current) => ({
        ...current,
        status: "loading",
        error: null,
      }));
    });

    try {
      const detail = await fetchMobileReportDetail(token, reportId, companyId, filters);
      startTransition(() => {
        setState({
          status: "ready",
          detail,
          error: null,
        });
      });
    } catch (error) {
      startTransition(() => {
        setState({
          status: "error",
          detail: null,
          error: getErrorMessage(error),
        });
      });
    }
  };

  useEffect(() => {
    void refresh();
  }, [token, reportId, companyId, filters.search, filters.status, filters.level]);

  return {
    ...state,
    refresh,
  };
}
