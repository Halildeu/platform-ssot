import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "BulletChart",
  indexItem: {
    "name": "BulletChart",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "charts",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Hedef-gerceklesen kompakt SVG grafigi",
    "demoMode": "live",
    "description": "Gerceklesen degeri hedef isaretcisi ve kalitatif araliklara karsi gosteren kompakt bullet grafik bileseni; yatay ve dikey yonelim destegi sunar.",
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
    "importStatement": "import { BulletChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "BulletChart",
    "variantAxes": [
      "orientation: horizontal | vertical",
      "size: sm | md | lg"
    ],
    "stateModel": [
      "default",
      "with-ranges",
      "vertical"
    ],
    "previewStates": ["default", "vertical", "dark-theme"],
    "behaviorModel": [
      "qualitative range background rendering",
      "actual value bar proportional to scale",
      "target marker overlay",
      "orientation switch",
      "value formatting"
    ],
    "props": [
      { "name": "value", "type": "number", "default": "-", "required": true, "description": "Birincil cubuk olarak gosterilecek gerceklesen deger." },
      { "name": "target", "type": "number", "default": "-", "required": true, "description": "Hedef / karsilastirma isaretci degeri." },
      { "name": "min", "type": "number", "default": "0", "required": false, "description": "Minimum olcek degeri." },
      { "name": "max", "type": "number", "default": "100", "required": false, "description": "Maksimum olcek degeri." },
      { "name": "label", "type": "string", "default": "-", "required": false, "description": "Grafik yaninda gosterilen etiket." },
      { "name": "subtitle", "type": "string", "default": "-", "required": false, "description": "Etiket altindaki alt baslik metni." },
      { "name": "ranges", "type": "BulletChartRange[]", "default": "3 esit zon", "required": false, "description": "Kalitatif araliklar; varsayilan 3 esit zona ayrilir." },
      { "name": "orientation", "type": "'horizontal' | 'vertical'", "default": "horizontal", "required": false, "description": "Grafik yonelimi." },
      { "name": "size", "type": "'sm' | 'md' | 'lg'", "default": "md", "required": false, "description": "Boyut varyanti." },
      { "name": "barColor", "type": "string", "default": "var(--interactive-primary)", "required": false, "description": "Cubuk rengi." },
      { "name": "targetColor", "type": "string", "default": "var(--text-primary)", "required": false, "description": "Hedef isaretci rengi." },
      { "name": "formatOptions", "type": "FormatOptions", "default": "{}", "required": false, "description": "Sayi formatlama secenekleri." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "horizontal vs vertical orientation",
      "qualitative range zones",
      "target marker positioning"
    ],
    "regressionFocus": [
      "min/max sinir degerleri",
      "value > max durumu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
