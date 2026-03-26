import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "VariantIntegration",
  indexItem: {
    "name": "VariantIntegration",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_data_grid",
    "subgroup": "data_grid",
    "taxonomyGroupId": "x_data_grid",
    "taxonomySubgroup": "X-Data-Grid Variant Management",
    "demoMode": "live",
    "description": "Grid variant save/load/clone yonetimi; kisisel ve paylasilan varyantlar, schema version uyumluluk kontrolu ve localStorage + API dual persistence destegi.",
    "sectionIds": [
      "component_library_management",
      "table_data_display",
      "state_feedback"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support"
    ],
    "tags": [
      "wave-13",
      "enterprise-x-suite",
      "data-grid",
      "variant-management",
      "beta"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { VariantIntegration } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "VariantIntegration",
    "variantAxes": [
      "access: visible | readonly | disabled | hidden",
      "scope: personal | global",
      "density: compact | comfortable"
    ],
    "stateModel": [
      "idle (no variant selected)",
      "variant-active (variant applied to grid)",
      "panel-open (variant manager accordion visible)",
      "creating (new variant name input)",
      "saving (persisting current grid state)",
      "dirty (grid state diverged from saved variant)"
    ],
    "previewStates": [
      "default",
      "with-admin-permissions",
      "custom-messages",
      "readonly",
      "disabled",
      "compact-in-toolbar"
    ],
    "behaviorModel": [
      "Variant dropdown — kisisel ve paylasilan varyantlari optgroup olarak listeler",
      "Variant olustur — mevcut grid state'ini yeni isimle kaydeder (kisisel)",
      "Variant sec — grid'e columnState, filterModel, sortModel uygular",
      "Variant kaydet — aktif varyantin state'ini gunceller",
      "Variant sil — onay sonrasi kalici silme",
      "Ad degistir — inline rename accordion panel",
      "Kisisel varsayilan — tek kisisel veya paylasilan variant secilebilir",
      "Global varsayilan — tek paylasilan variant secilebilir (admin)",
      "Kisisel → Paylasilan yukseltme (admin yetkisi)",
      "Paylasilan → Kisisele indirme (admin yetkisi)",
      "Paylasilandan kisisele kopyalama (herkes)",
      "localStorage + /v1/variants API dual persistence",
      "Schema version uyumsuzluk uyarisi",
      "Outside click ile panel kapanir",
      "Auto-apply: mount sirasinda user selected → user default → global default"
    ],
    "props": [
      {
        "name": "gridId",
        "type": "string",
        "default": "-",
        "required": true,
        "description": "Grid kimlik no — variant izolasyonu icin benzersiz anahtar"
      },
      {
        "name": "gridSchemaVersion",
        "type": "number",
        "default": "-",
        "required": true,
        "description": "Sema surumu — uyumsuz varyantlari tespit eder"
      },
      {
        "name": "gridApi",
        "type": "GridApi",
        "default": "-",
        "required": true,
        "description": "AG Grid API referansi — grid state okuma/yazma"
      },
      {
        "name": "activeVariantId",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Kontrollu aktif varyant ID"
      },
      {
        "name": "onActiveVariantChange",
        "type": "(id: string | null) => void",
        "default": "-",
        "required": false,
        "description": "Varyant degisiklik callback"
      },
      {
        "name": "canPromoteToGlobal",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Kisisel varyanti paylasilana yukseltme yetkisi"
      },
      {
        "name": "canDemoteToPersonal",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Paylasilan varyanti kisisele indirme yetkisi"
      },
      {
        "name": "canDeleteGlobal",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Paylasilan varyanti silme yetkisi"
      },
      {
        "name": "messages",
        "type": "VariantIntegrationMessages",
        "default": "-",
        "required": false,
        "description": "i18n mesaj override nesnesi"
      },
      {
        "name": "access",
        "type": "AccessLevel",
        "default": "visible",
        "required": false,
        "description": "Erisim kontrol seviyesi (visible/readonly/disabled/hidden)"
      },
      {
        "name": "accessReason",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Erisim kisitlama sebebi — tooltip olarak gosterilir"
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root element icin ek CSS sinifi"
      }
    ],
    "previewFocus": [
      "variant dropdown selection flow",
      "personal vs global variant sections",
      "admin promote/demote actions",
      "i18n message override",
      "access control states (readonly, disabled)"
    ],
    "regressionFocus": [
      "grid state collection ve apply dogrulugu",
      "schema version uyumsuzluk uyarisi",
      "localStorage + API dual persistence",
      "outside click panel kapatma",
      "keyboard navigation ve focus-visible",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
