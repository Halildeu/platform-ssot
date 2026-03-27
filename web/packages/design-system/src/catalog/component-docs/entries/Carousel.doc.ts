import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Carousel",
  indexItem: {
    "name": "Carousel",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "content",
    "subgroup": "carousel",
    "taxonomyGroupId": "general",
    "taxonomySubgroup": "Carousel & Gallery",
    "demoMode": "live",
    "description": "Slayt gosterisi componenti; auto-play, loop, dot indikatoru, ok navigasyonu ve klavye destegi sunar.",
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
      "content",
      "stable"
    ],
    "importStatement": "import { Carousel } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Carousel",
    "variantAxes": [
      "size: sm | md | lg",
      "orientation: horizontal | vertical",
      "slidesPerView: 1 | 2 | 3"
    ],
    "stateModel": [
      "auto-play / paused",
      "loop navigation",
      "access-controlled interaction"
    ],
    "previewStates": [
      "disabled",
      "readonly",
      "auto-play",
      "dark-theme"
    ],
    "behaviorModel": [
      "auto-play with interval timer",
      "pause on mouse enter",
      "loop navigation wrap-around",
      "keyboard arrow navigation",
      "dot indicator click navigation"
    ],
    "props": [
      {
        "name": "items",
        "type": "{ key: Key; content: ReactNode }[]",
        "default": "-",
        "required": true,
        "description": "Slayt icerik listesi."
      },
      {
        "name": "autoPlay",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Otomatik oynatmayi aktif eder."
      },
      {
        "name": "autoPlayInterval",
        "type": "number",
        "default": "5000",
        "required": false,
        "description": "Otomatik oynatma araligi (ms)."
      },
      {
        "name": "showDots",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Dot indikatoru gorunurlugu."
      },
      {
        "name": "showArrows",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Onceki/sonraki ok butonlarinin gorunurlugu."
      },
      {
        "name": "loop",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Son slayttan sonra basa donmeyi aktif eder."
      },
      {
        "name": "slidesPerView",
        "type": "1 | 2 | 3",
        "default": "1",
        "required": false,
        "description": "Ayni anda gorunen slayt sayisi."
      },
      {
        "name": "gap",
        "type": "number",
        "default": "0",
        "required": false,
        "description": "Slaytlar arasi bosluk (px)."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Yukseklik boyut varyanti."
      },
      {
        "name": "orientation",
        "type": "'horizontal' | 'vertical'",
        "default": "horizontal",
        "required": false,
        "description": "Slayt yonu."
      },
      {
        "name": "onSlideChange",
        "type": "(index: number) => void",
        "default": "-",
        "required": false,
        "description": "Aktif slayt degistiginde cagrilacak callback."
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
      "auto-play + pause on hover",
      "loop navigation",
      "multi-slide view"
    ],
    "regressionFocus": [
      "auto-play timer cleanup",
      "keyboard navigation orientation parity",
      "access-controlled interaction guard"
    ]
  },
};

export default entry;
