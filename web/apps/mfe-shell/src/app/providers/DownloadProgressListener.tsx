import React, { useEffect, useRef, useCallback } from "react";
import { useToast } from "@mfe/design-system";
import type { DownloadProgressEvent } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  DownloadProgressListener                                           */
/*                                                                     */
/*  Listens for "app:download-progress" CustomEvents dispatched by     */
/*  useDownloadWithProgress hook (works across MF boundaries).         */
/*  Renders persistent toast with live progress updates.               */
/* ------------------------------------------------------------------ */

export const DownloadProgressListener: React.FC = () => {
  const toast = useToast();
  /** Map downloadId → toastId for in-flight downloads. */
  const activeDownloads = useRef<Map<string, string>>(new Map());

  const handleEvent = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent<DownloadProgressEvent>).detail;
      if (!detail?.downloadId) return;

      const { downloadId, phase, title, message } = detail;
      const existingToastId = activeDownloads.current.get(downloadId);

      switch (phase) {
        case "start": {
          const toastId = toast.info(message, {
            title,
            persistent: true,
            onCancel: detail.abort,
          });
          activeDownloads.current.set(downloadId, toastId);
          break;
        }

        case "progress": {
          if (existingToastId) {
            toast.update(existingToastId, {
              message,
              title,
              onCancel: detail.abort,
            });
          }
          break;
        }

        case "success": {
          if (existingToastId) {
            toast.update(existingToastId, {
              variant: "success",
              message,
              title,
              persistent: false,
              onCancel: undefined,
              duration: 3000,
            });
            activeDownloads.current.delete(downloadId);
          }
          break;
        }

        case "error": {
          if (existingToastId) {
            toast.update(existingToastId, {
              variant: "error",
              message,
              title,
              persistent: false,
              onCancel: undefined,
              duration: 6000,
            });
            activeDownloads.current.delete(downloadId);
          } else {
            // Error before toast was created (e.g. immediate HTTP error)
            toast.error(message, { title, duration: 6000 });
          }
          break;
        }

        case "cancelled": {
          if (existingToastId) {
            toast.update(existingToastId, {
              variant: "warning",
              message,
              title,
              persistent: false,
              onCancel: undefined,
              duration: 2000,
            });
            activeDownloads.current.delete(downloadId);
          }
          break;
        }
      }
    },
    [toast],
  );

  useEffect(() => {
    window.addEventListener("app:download-progress", handleEvent);
    return () => {
      window.removeEventListener("app:download-progress", handleEvent);
    };
  }, [handleEvent]);

  return null;
};
