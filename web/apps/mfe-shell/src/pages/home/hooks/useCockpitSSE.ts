import { useEffect, useRef, useCallback } from "react";

const COCKPIT_URL = "/cockpit-api";

export type SSEEventType =
  | "overview_tick"
  | "inbox_tick"
  | "intake_tick"
  | "decisions_tick"
  | "jobs_tick"
  | "locks_tick"
  | "notes_tick"
  | "chat_tick"
  | "settings_tick"
  | "changed";

type SSEHandler = (data: { paths: string[]; ts: number }) => void;

export function useCockpitSSE(handlers: Partial<Record<SSEEventType, SSEHandler>>) {
  const sourceRef = useRef<EventSource | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const es = new EventSource(`${COCKPIT_URL}/stream`);
    sourceRef.current = es;

    const eventTypes: SSEEventType[] = [
      "overview_tick",
      "inbox_tick",
      "intake_tick",
      "decisions_tick",
      "jobs_tick",
      "locks_tick",
      "notes_tick",
      "chat_tick",
      "settings_tick",
      "changed",
    ];

    eventTypes.forEach((type) => {
      es.addEventListener(type, (event: MessageEvent) => {
        const handler = handlersRef.current[type];
        if (handler) {
          try {
            handler(JSON.parse(event.data));
          } catch {
            // ignore parse errors
          }
        }
      });
    });

    es.onerror = () => {
      // auto-reconnect is built into EventSource
    };

    return () => {
      es.close();
      sourceRef.current = null;
    };
  }, []);

  const isConnected = useCallback(() => {
    return sourceRef.current?.readyState === EventSource.OPEN;
  }, []);

  return { isConnected };
}
