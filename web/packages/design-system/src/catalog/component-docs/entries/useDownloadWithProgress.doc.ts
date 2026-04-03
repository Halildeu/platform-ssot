import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "useDownloadWithProgress",
  indexItem: {
    "name": "useDownloadWithProgress",
    "kind": "hook",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "feedback",
    "subgroup": "download",
    "taxonomyGroupId": "feedback_state_and_visibility",
    "taxonomySubgroup": "Download progress",
    "demoMode": "inspector",
    "description": "Server-side dosya indirmeleri icin fetch + ReadableStream progress tracking hook'u. window.open() yerine kullanilir. In-app toast ile indirme durumu, yuzde, dosya boyutu gosterir. AbortController ile iptal destekler.",
    "sectionIds": [
      "component_library_management",
      "feedback_patterns",
      "governance_contribution"
    ],
    "qualityGates": [
      "design_tokens",
      "registry_export_sync",
      "ux_catalog_alignment"
    ],
    "tags": [
      "wave-4",
      "feedback",
      "beta",
      "download",
      "progress",
      "data-grid",
      "export"
    ],
    "uxPrimaryThemeId": "feedback_state_and_visibility",
    "uxPrimarySubthemeId": "progress_indication",
    "roadmapWaveId": "wave_4_data_grid",
    "acceptanceContractId": "ui-library-wave-4-data-grid-v1",
    "importStatement": "import { useDownloadWithProgress } from '@mfe/design-system';",
    "whereUsed": [
      "web/apps/mfe-users/src/widgets/user-management/ui/UsersGrid.ui.tsx"
    ],
    "dependsOn": ["DownloadProgressListener"]
  },
  apiItem: {
    "name": "useDownloadWithProgress",
    "variantAxes": [
      "progress: determinate (Content-Length) | indeterminate (streaming)",
      "transport: fetch + ReadableStream | fetch + blob fallback"
    ],
    "stateModel": [
      "isDownloading (boolean — true while any download is in-flight)",
      "download phase (start | progress | success | error | cancelled)",
      "received bytes (accumulated from ReadableStream chunks)",
      "total bytes (from Content-Length header, if available)"
    ],
    "previewStates": [],
    "behaviorModel": [
      "dispatches CustomEvent 'app:download-progress' on window for shell listener",
      "MF-boundary safe: no toast context dependency, event-based notification",
      "AbortController created per download, abort() wired to toast cancel button",
      "ReadableStream chunk-by-chunk reading with 200ms throttled progress events",
      "Blob assembled from chunks, downloaded via hidden anchor + URL.createObjectURL",
      "filename resolved from: explicit option > Content-Disposition header > URL path",
      "formatBytes helper converts bytes to human-readable KB/MB/GB"
    ],
    "props": [
      {
        "name": "url",
        "type": "string",
        "default": "-",
        "required": true,
        "description": "Download URL (e.g. /api/users/export.xlsx?sort=...)"
      },
      {
        "name": "options.filename",
        "type": "string",
        "default": "derived from URL or Content-Disposition",
        "required": false,
        "description": "Explicit filename for the downloaded file"
      },
      {
        "name": "options.title",
        "type": "string",
        "default": "\"Dosya indiriliyor\"",
        "required": false,
        "description": "Toast title shown during download"
      },
      {
        "name": "options.fetchOptions",
        "type": "RequestInit",
        "default": "{ credentials: 'same-origin' }",
        "required": false,
        "description": "Extra fetch options (headers, credentials, etc.)"
      }
    ],
    "previewFocus": [
      "toast lifecycle: start → progress → success/error/cancelled",
      "determinate vs indeterminate progress display",
      "cancel button aborts fetch and shows warning toast",
      "file automatically saved via hidden anchor download"
    ],
    "regressionFocus": [
      "HTTP 429 shows rate limit error message",
      "network failure shows connection error message",
      "component unmount during download still completes file save",
      "multiple concurrent downloads each get their own toast",
      "filename resolution priority: explicit > Content-Disposition > URL"
    ]
  }
};

export default entry;
