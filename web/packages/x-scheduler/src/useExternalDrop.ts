import { useCallback, useState } from 'react';
import type { SchedulerEvent } from './types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface UseExternalDropOptions {
  /** Called when an external draggable is dropped onto a calendar slot */
  onDrop: (event: Partial<SchedulerEvent>, date: Date) => void;
}

export interface UseExternalDropReturn {
  /** Spread on sidebar / external draggable elements */
  getExternalDragProps: (eventData: Partial<SchedulerEvent>) => React.HTMLAttributes<HTMLElement>;
  /** Spread on calendar time-slot elements to accept external drops */
  getCalendarDropProps: (slotDate: Date) => React.HTMLAttributes<HTMLElement>;
  /** Whether an external drag is currently in progress */
  isExternalDragActive: boolean;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const EXTERNAL_MIME = 'application/x-scheduler-external';

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useExternalDrop(options: UseExternalDropOptions): UseExternalDropReturn {
  const { onDrop } = options;

  const [isExternalDragActive, setIsExternalDragActive] = useState(false);

  /* ---------------------------------------------------------------- */
  /*  External draggable props                                         */
  /* ---------------------------------------------------------------- */

  const getExternalDragProps = useCallback(
    (eventData: Partial<SchedulerEvent>): React.HTMLAttributes<HTMLElement> => {
      return {
        draggable: true,
        onDragStart: (e: React.DragEvent) => {
          e.dataTransfer.effectAllowed = 'copy';
          e.dataTransfer.setData(EXTERNAL_MIME, JSON.stringify(eventData));
          e.dataTransfer.setData('text/plain', eventData.title ?? 'event');
          setIsExternalDragActive(true);
        },
        onDragEnd: () => {
          setIsExternalDragActive(false);
        },
      };
    },
    [],
  );

  /* ---------------------------------------------------------------- */
  /*  Calendar drop-zone props                                         */
  /* ---------------------------------------------------------------- */

  const getCalendarDropProps = useCallback(
    (slotDate: Date): React.HTMLAttributes<HTMLElement> => {
      return {
        onDragOver: (e: React.DragEvent) => {
          // Only accept if it's an external drag (has our MIME type)
          if (e.dataTransfer.types.includes(EXTERNAL_MIME)) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          }
        },
        onDragEnter: (e: React.DragEvent) => {
          if (e.dataTransfer.types.includes(EXTERNAL_MIME)) {
            e.preventDefault();
          }
        },
        onDrop: (e: React.DragEvent) => {
          e.preventDefault();
          const raw = e.dataTransfer.getData(EXTERNAL_MIME);
          if (!raw) return;

          try {
            const eventData = JSON.parse(raw) as Partial<SchedulerEvent>;
            onDrop(eventData, slotDate);
          } catch {
            // Malformed data — ignore silently
          }

          setIsExternalDragActive(false);
        },
      };
    },
    [onDrop],
  );

  return {
    getExternalDragProps,
    getCalendarDropProps,
    isExternalDragActive,
  };
}
