/**
 * useQueryCancellation — AbortController wrapper for cross-filter queries
 *
 * On new filter arriving, aborts the previous in-flight request.
 * Integrates with store's pendingQueryCount.
 *
 * @see feature_execution_contract (P2 DoD #16)
 */
import { useRef, useCallback } from "react";
import { useCrossFilter } from "./useCrossFilterStore";

export interface UseQueryCancellationReturn {
  /** Get a new AbortSignal. Cancels the previous one. */
  getSignal: () => AbortSignal;
  /** Cancel the current in-flight request. */
  cancel: () => void;
  /** Whether a request is currently in flight. */
  isPending: boolean;
}

export function useQueryCancellation(): UseQueryCancellationReturn {
  const controllerRef = useRef<AbortController | null>(null);

  const incrementPending = useCrossFilter((s) => s.incrementPendingQuery);
  const decrementPending = useCrossFilter((s) => s.decrementPendingQuery);
  const isPending = useCrossFilter((s) => s.pendingQueryCount > 0);

  const cancel = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
      decrementPending();
    }
  }, [decrementPending]);

  const getSignal = useCallback(() => {
    // Cancel previous
    if (controllerRef.current) {
      controllerRef.current.abort();
      // Don't decrement — we're replacing, net count stays same
    } else {
      incrementPending();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    // Auto-decrement when this signal's request completes or aborts
    controller.signal.addEventListener("abort", () => {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        decrementPending();
      }
    }, { once: true });

    return controller.signal;
  }, [incrementPending, decrementPending]);

  return { getSignal, cancel, isPending };
}
