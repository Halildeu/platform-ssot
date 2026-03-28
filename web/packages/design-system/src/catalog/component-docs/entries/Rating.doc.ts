import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Rating",
  indexItem: {
    "name": "Rating",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "inputs",
    "subgroup": "rating",
    "taxonomyGroupId": "data_entry",
    "taxonomySubgroup": "Rating & Scoring",
    "demoMode": "live",
    "description": "Yildiz degerlendirme componenti; yarim yildiz, ozel ikonlar, renk paleti, deger etiketi ve klavye navigasyonu destegi sunar.",
    "sectionIds": [
      "component_library_management",
      "state_feedback",
      "accessibility_compliance"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support"
    ],
    "tags": [
      "wave-3",
      "data-entry",
      "stable"
    ],
    "importStatement": "import { Rating } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Rating",
    "variantAxes": [
      "size: sm | md | lg",
      "precision: full | half"
    ],
    "stateModel": [
      "hover preview",
      "half-star precision",
      "access-controlled interaction",
      "disabled",
      "readOnly",
      "error",
      "loading"
    ],
    "previewStates": [
      "disabled",
      "readonly",
      "error",
      "dark-theme"
    ],
    "behaviorModel": [
      "hover value preview",
      "half-star mouse position detection",
      "keyboard arrow stepping",
      "allow clear on same value click",
      "custom color per star"
    ],
    "props": [
      {
        "name": "value",
        "type": "number",
        "default": "-",
        "required": false,
        "description": "Controlled degerlendirme degeri (0-max)."
      },
      {
        "name": "defaultValue",
        "type": "number",
        "default": "0",
        "required": false,
        "description": "Uncontrolled baslangic degeri."
      },
      {
        "name": "max",
        "type": "number",
        "default": "5",
        "required": false,
        "description": "Maksimum yildiz sayisi."
      },
      {
        "name": "allowHalf",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Yarim yildiz hassasiyetini aktif eder."
      },
      {
        "name": "allowClear",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Mevcut degere tiklanarak temizlemeyi aktif eder."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Gorsel boyut varyanti."
      },
      {
        "name": "icon",
        "type": "ReactNode",
        "default": "StarFilled",
        "required": false,
        "description": "Ozel dolu yildiz ikonu."
      },
      {
        "name": "emptyIcon",
        "type": "ReactNode",
        "default": "StarEmpty",
        "required": false,
        "description": "Ozel bos yildiz ikonu."
      },
      {
        "name": "halfIcon",
        "type": "ReactNode",
        "default": "StarHalf",
        "required": false,
        "description": "Ozel yarim yildiz ikonu."
      },
      {
        "name": "colors",
        "type": "string[]",
        "default": "-",
        "required": false,
        "description": "Deger bazinda uygulanacak renk dizisi."
      },
      {
        "name": "showValue",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Sayisal deger etiketini gosterir."
      },
      {
        "name": "valueFormatter",
        "type": "(value: number) => string",
        "default": "-",
        "required": false,
        "description": "Deger etiketi formatlayici."
      },
      {
        "name": "labels",
        "type": "Record<number, string>",
        "default": "-",
        "required": false,
        "description": "Deger bazinda aciklama etiketleri."
      },
      {
        "name": "onValueChange",
        "type": "(value: number) => void",
        "default": "-",
        "required": false,
        "description": "Deger degistiginde cagrilacak callback."
      },
      {
        "name": "onHoverChange",
        "type": "(value: number | null) => void",
        "default": "-",
        "required": false,
        "description": "Hover degeri degistiginde cagrilacak callback."
      },
      {
        "name": "label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Erisilebilirlik icin aria-label degeri."
      },
      {
        "name": "helperText",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Alan altinda gosterilen yardimci metin."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Native disabled davranisini aktif eder."
      },
      {
        "name": "readOnly",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Salt okunur durumu aktif eder; gorsel degerlendirme gosterir ancak degisiklige izin vermez."
      },
      {
        "name": "error",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Dogrulama geri bildirimi."
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Yukleme gostergesi render eder ve etkilesimi devre disi birakir."
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
      "half-star precision",
      "custom icon ve color matrix",
      "value label ve formatter"
    ],
    "regressionFocus": [
      "half-star mouse position detection",
      "keyboard navigation stepping",
      "allow clear toggle behavior",
      "ARIA radiogroup pattern"
    ]
  },
};

export default entry;
