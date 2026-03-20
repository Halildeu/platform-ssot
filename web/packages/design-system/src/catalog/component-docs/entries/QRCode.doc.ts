import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "QRCode",
  indexItem: {
    "name": "QRCode",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "content",
    "subgroup": "qrcode",
    "taxonomyGroupId": "general",
    "taxonomySubgroup": "QR Code & Barcode",
    "demoMode": "live",
    "description": "Pure SVG tabanli QR kod uretici; error correction seviyesi, orta ikon, expired/loading durumu ve access-control destegi sunar.",
    "sectionIds": [
      "component_library_management",
      "documentation_standards"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment"
    ],
    "tags": [
      "wave-3",
      "content",
      "stable"
    ],
    "importStatement": "import { QRCode } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "QRCode",
    "variantAxes": [
      "errorLevel: L | M | Q | H",
      "status: active | expired | loading"
    ],
    "stateModel": [
      "active / expired / loading",
      "access-controlled visibility"
    ],
    "previewStates": [
      "disabled",
      "dark-theme"
    ],
    "behaviorModel": [
      "pure QR code matrix generation",
      "Reed-Solomon error correction",
      "center icon overlay",
      "expired overlay with refresh button",
      "loading spinner state"
    ],
    "props": [
      {
        "name": "value",
        "type": "string",
        "default": "-",
        "required": true,
        "description": "QR koduna kodlanacak metin."
      },
      {
        "name": "size",
        "type": "number",
        "default": "128",
        "required": false,
        "description": "QR kod boyutu (px)."
      },
      {
        "name": "color",
        "type": "string",
        "default": "var(--text-primary)",
        "required": false,
        "description": "Module rengi."
      },
      {
        "name": "bgColor",
        "type": "string",
        "default": "var(--surface-canvas)",
        "required": false,
        "description": "Arkaplan rengi."
      },
      {
        "name": "errorLevel",
        "type": "'L' | 'M' | 'Q' | 'H'",
        "default": "M",
        "required": false,
        "description": "Hata duzeltme seviyesi."
      },
      {
        "name": "icon",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Merkez ikon gorsel URL'i."
      },
      {
        "name": "iconSize",
        "type": "number",
        "default": "size * 0.25",
        "required": false,
        "description": "Merkez ikon boyutu (px)."
      },
      {
        "name": "bordered",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Border ve padding gosterir."
      },
      {
        "name": "status",
        "type": "'active' | 'expired' | 'loading'",
        "default": "active",
        "required": false,
        "description": "QR kod durumu."
      },
      {
        "name": "onRefresh",
        "type": "() => void",
        "default": "-",
        "required": false,
        "description": "Expired durumunda refresh butonuna tiklandiginda cagrilacak callback."
      },
      {
        "name": "access",
        "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
        "default": "full",
        "required": false,
        "description": "Policy tabanli gorunurluk ve etkilesim kontrolu."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root elemana ek CSS sinifi."
      }
    ],
    "previewFocus": [
      "error level matrisi",
      "center icon overlay",
      "status transitions"
    ],
    "regressionFocus": [
      "QR matrix generation accuracy",
      "icon overlay quiet zone preservation",
      "expired overlay refresh interaction"
    ]
  },
};

export default entry;
