import { startTransition, useEffect, useState } from "react";

import { fetchReportingDashboardSnapshot } from "../../services/reporting/reportingClient";
import type { ReportingDashboardSnapshot } from "../../services/reporting/reporting.contract";

type ReportingDashboardState = {
  status: "idle" | "loading" | "ready" | "error";
  snapshot: ReportingDashboardSnapshot | null;
  error: string | null;
};

const initialState: ReportingDashboardState = {
  status: "idle",
  snapshot: null,
  error: null,
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Dashboard verisi yuklenemedi.";
}

export function useReportingDashboardSnapshot(
  token: string | null | undefined,
  companyId?: number | null,
) {
  const [state, setState] = useState<ReportingDashboardState>(initialState);

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
      const snapshot = await fetchReportingDashboardSnapshot(token, companyId);
      startTransition(() => {
        setState({
          status: "ready",
          snapshot,
          error: null,
        });
      });
    } catch (error) {
      startTransition(() => {
        setState({
          status: "error",
          snapshot: null,
          error: getErrorMessage(error),
        });
      });
    }
  };

  useEffect(() => {
    void refresh();
  }, [token, companyId]);

  return {
    ...state,
    refresh,
  };
}
