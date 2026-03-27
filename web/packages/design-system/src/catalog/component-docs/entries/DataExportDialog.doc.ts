import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "DataExportDialog",
  indexItem: {
    "name": "DataExportDialog",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "overlays",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "PDF/Excel/CSV/PNG export dialog",
    "demoMode": "live",
    "description": "PDF, Excel, CSV ve PNG formatlarinda veri disari aktarimi yapilandirma ve tetikleme modal diyalogu; kapsam secimi ve grafik dahil etme secenegi sunar.",
    "sectionIds": [
      "component_library_management"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility"
    ],
    "tags": [
      "enterprise",
      "beta"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_14_enterprise_suite",
    "acceptanceContractId": "ui-library-wave-14-enterprise-suite-v1",
    "importStatement": "import { DataExportDialog } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "DataExportDialog",
    "variantAxes": [
      "format: pdf | excel | csv | png",
      "scope: visible | all | selected | filtered"
    ],
    "stateModel": [
      "closed",
      "open",
      "exporting"
    ],
    "previewStates": ["edit-mode", "loading-state"],
    "behaviorModel": [
      "format radio selection (PDF, Excel, CSV, PNG)",
      "scope radio selection with record counts",
      "include charts checkbox",
      "async export with loading spinner",
      "backdrop click to close"
    ],
    "props": [
      { "name": "open", "type": "boolean", "default": "-", "required": true, "description": "Diyalogun gorunur olup olmadigi." },
      { "name": "onClose", "type": "() => void", "default": "-", "required": true, "description": "Diyalog kapatildiginda tetiklenir." },
      { "name": "onExport", "type": "(options: { format; scope; includeCharts }) => void | Promise<void>", "default": "-", "required": true, "description": "Secilen export secenekleriyle tetiklenir." },
      { "name": "recordCounts", "type": "RecordCounts", "default": "-", "required": false, "description": "Kapsam basina kayit sayilari." },
      { "name": "formats", "type": "ExportFormat[]", "default": "['pdf','excel','csv','png']", "required": false, "description": "Sunulan format secenekleri." },
      { "name": "scopes", "type": "ExportScope[]", "default": "['visible','all','selected','filtered']", "required": false, "description": "Sunulan kapsam secenekleri." },
      { "name": "defaultFormat", "type": "ExportFormat", "default": "excel", "required": false, "description": "On secili format." },
      { "name": "defaultScope", "type": "ExportScope", "default": "visible", "required": false, "description": "On secili kapsam." },
      { "name": "localeText", "type": "DataExportDialogLocaleText", "default": "-", "required": false, "description": "Yerellestirilmis etiketler." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Dialog container icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "format selection grid",
      "scope selection with counts",
      "export loading state"
    ],
    "regressionFocus": [
      "async export hata yonetimi",
      "recordCounts undefined durumu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
