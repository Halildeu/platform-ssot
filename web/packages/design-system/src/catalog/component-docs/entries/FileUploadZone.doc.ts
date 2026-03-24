import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FileUploadZone",
  indexItem: {
    "name": "FileUploadZone",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "input",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "dosya yukleme, drag drop, upload, dosya yonetimi",
    "demoMode": "live",
    "description": "Dosya listesi, ilerleme cubugu, hata durumlari ve boyut/tip dogrulamasi ile surukleme birakma dosya yukleme alani.",
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
    "importStatement": "import { FileUploadZone } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "FileUploadZone",
    "variantAxes": [
      "multiple: true | false"
    ],
    "stateModel": [
      "default",
      "with-files",
      "drag-over",
      "error"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "dashed border drop zone with cloud icon",
      "drag over highlight effect",
      "click to open file browser",
      "file list with name, size, progress, status",
      "progress bar for uploading files",
      "error state with red border and message",
      "remove button per file",
      "maxSize and maxFiles validation",
      "accept filter for file types"
    ],
    "props": [
      { "name": "files", "type": "UploadedFile[]", "default": "-", "required": true, "description": "Yuklenen/yuklenmekte olan dosyalar." },
      { "name": "onFilesAdd", "type": "(files: File[]) => void", "default": "-", "required": false, "description": "Yeni dosyalar eklendiginde tetiklenir." },
      { "name": "onFileRemove", "type": "(id: string) => void", "default": "-", "required": false, "description": "Dosya kaldirildiginda tetiklenir." },
      { "name": "accept", "type": "string", "default": "-", "required": false, "description": "Kabul edilen dosya tipleri." },
      { "name": "maxSize", "type": "number", "default": "-", "required": false, "description": "Maksimum dosya boyutu (byte)." },
      { "name": "maxFiles", "type": "number", "default": "-", "required": false, "description": "Maksimum dosya sayisi." },
      { "name": "multiple", "type": "boolean", "default": "true", "required": false, "description": "Coklu dosya secimi." },
      { "name": "label", "type": "string", "default": "Drop files here or click to browse", "required": false, "description": "Ana etiket metni." },
      { "name": "description", "type": "string", "default": "-", "required": false, "description": "Aciklama metni." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "drop zone with dashed border",
      "file list with progress bars",
      "error state display"
    ],
    "regressionFocus": [
      "bos dosya listesi",
      "maxFiles limitine ulasilmis durum",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
