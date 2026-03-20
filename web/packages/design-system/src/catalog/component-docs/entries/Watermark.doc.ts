import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Watermark",
  indexItem: {
    "name": "Watermark",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "content",
    "subgroup": "watermark",
    "taxonomyGroupId": "general",
    "taxonomySubgroup": "Watermark & Overlay",
    "demoMode": "live",
    "description": "Filigran componenti; metin veya gorsel tabanli tekrarlayan overlay, aci, aralik, opasite ve anti-tamper destegi sunar.",
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
    "importStatement": "import { Watermark } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Watermark",
    "variantAxes": [
      "content: text | image"
    ],
    "stateModel": [
      "canvas render cycle",
      "anti-tamper mutation observer"
    ],
    "previewStates": ["visible", "hidden", "custom-content", "dark-theme"],
    "behaviorModel": [
      "text-based watermark rendering",
      "image-based watermark rendering",
      "rotation angle control",
      "gap and offset positioning",
      "anti-tamper DOM mutation observer"
    ],
    "props": [
      {
        "name": "content",
        "type": "string | string[]",
        "default": "-",
        "required": false,
        "description": "Filigran metin icerigi; tek satir veya coklu satir."
      },
      {
        "name": "image",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Filigran gorsel URL'i (content yerine)."
      },
      {
        "name": "rotate",
        "type": "number",
        "default": "-22",
        "required": false,
        "description": "Filigran dondurme acisi (derece)."
      },
      {
        "name": "gap",
        "type": "[number, number]",
        "default": "[100, 100]",
        "required": false,
        "description": "Filigranlar arasi yatay ve dikey bosluk (px)."
      },
      {
        "name": "offset",
        "type": "[number, number]",
        "default": "-",
        "required": false,
        "description": "Baslangic pozisyon ofseti [x, y] (px)."
      },
      {
        "name": "fontSize",
        "type": "number",
        "default": "16",
        "required": false,
        "description": "Metin font boyutu (px)."
      },
      {
        "name": "fontColor",
        "type": "string",
        "default": "rgba(0,0,0,0.15)",
        "required": false,
        "description": "Metin font rengi."
      },
      {
        "name": "opacity",
        "type": "number",
        "default": "1",
        "required": false,
        "description": "Filigran genel opasite degeri."
      },
      {
        "name": "zIndex",
        "type": "number",
        "default": "9",
        "required": false,
        "description": "Filigran katman sirasi."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Filigran uygulanacak icerik."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "required": false,
        "description": "Additional CSS class for custom styling."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "'md'",
        "required": false,
        "description": "Component size variant."
      }
    ],
    "previewFocus": [
      "text vs image watermark",
      "rotation and gap matrix",
      "opacity levels"
    ],
    "regressionFocus": [
      "anti-tamper mutation observer",
      "canvas re-render on prop change",
      "image load error fallback",
      "multiline text rendering"
    ]
  },
};

export default entry;
