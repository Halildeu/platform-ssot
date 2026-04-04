/**
 * Web Worker Bridge — Offload data transforms to background thread
 *
 * Provides a promise-based interface for sending tasks to a Web Worker.
 * Falls back to synchronous execution if Workers are unavailable.
 *
 * @see contract P6 DoD: "Web Worker: data transform offloading"
 */

export interface WorkerTask<TInput = unknown, TOutput = unknown> {
  type: string;
  payload: TInput;
  transferable?: Transferable[];
}

export interface WorkerBridge {
  execute<TInput, TOutput>(task: WorkerTask<TInput, TOutput>): Promise<TOutput>;
  terminate(): void;
  readonly isWorkerAvailable: boolean;
}

/**
 * Create a Worker bridge with automatic fallback.
 *
 * @param workerFactory - Function that creates a Worker (allows bundler to handle URL)
 * @param fallbackExecutor - Synchronous fallback for environments without Workers
 */
export function createWorkerBridge(
  workerFactory?: () => Worker,
  fallbackExecutor?: <TInput, TOutput>(task: WorkerTask<TInput, TOutput>) => TOutput,
): WorkerBridge {
  let worker: Worker | null = null;
  let pendingId = 0;
  const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: unknown) => void }>();

  const isWorkerAvailable = typeof Worker !== 'undefined' && !!workerFactory;

  if (isWorkerAvailable) {
    try {
      worker = workerFactory!();
      worker.onmessage = (e: MessageEvent) => {
        const { id, result, error } = e.data as { id: number; result?: unknown; error?: string };
        const p = pending.get(id);
        if (p) {
          pending.delete(id);
          if (error) p.reject(new Error(error));
          else p.resolve(result);
        }
      };
      worker.onerror = (e) => {
        // Reject all pending tasks
        for (const p of pending.values()) p.reject(e);
        pending.clear();
      };
    } catch {
      worker = null;
    }
  }

  return {
    get isWorkerAvailable() { return worker !== null; },

    execute<TInput, TOutput>(task: WorkerTask<TInput, TOutput>): Promise<TOutput> {
      if (worker) {
        return new Promise<TOutput>((resolve, reject) => {
          const id = ++pendingId;
          pending.set(id, { resolve: resolve as (v: unknown) => void, reject });
          worker!.postMessage({ id, ...task }, task.transferable ?? []);
        });
      }

      // Fallback: synchronous
      if (fallbackExecutor) {
        try {
          return Promise.resolve(fallbackExecutor(task));
        } catch (e) {
          return Promise.reject(e);
        }
      }

      return Promise.reject(new Error('No Worker and no fallback executor'));
    },

    terminate() {
      worker?.terminate();
      worker = null;
      for (const p of pending.values()) p.reject(new Error('Worker terminated'));
      pending.clear();
    },
  };
}
