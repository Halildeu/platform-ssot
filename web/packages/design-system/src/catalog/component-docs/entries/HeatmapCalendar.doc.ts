import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "HeatmapCalendar",
  indexItem: {
    "name": "HeatmapCalendar",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "charts",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "GitHub-style aktivite isi haritasi",
    "demoMode": "live",
    "description": "GitHub tarzinda yillik aktivite isi haritasi takvimi; 5 kademeli renk skalasi, ay/gun etiketleri, tooltip ve gun tiklama etkilesimi destekler.",
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
    "importStatement": "import { HeatmapCalendar } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "HeatmapCalendar",
    "variantAxes": [
      "showMonthLabels: true | false",
      "showDayLabels: true | false"
    ],
    "stateModel": [
      "default",
      "with-labels",
      "hover-tooltip"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "52-week grid cell rendering",
      "5-level color quantization",
      "month label positioning along top",
      "day-of-week labels on left",
      "tooltip on hover with day details",
      "day cell click interaction",
      "custom start/end date range",
      "custom color scale"
    ],
    "props": [
      { "name": "data", "type": "HeatmapDay[]", "default": "-", "required": true, "description": "Tarih ve deger iceren gun giris dizisi." },
      { "name": "startDate", "type": "string", "default": "52 hafta once", "required": false, "description": "Baslangic tarihi (YYYY-MM-DD)." },
      { "name": "endDate", "type": "string", "default": "bugun", "required": false, "description": "Bitis tarihi (YYYY-MM-DD)." },
      { "name": "colorScale", "type": "[string, string, string, string, string]", "default": "yesil tonlari", "required": false, "description": "Aciktan koyuya 5 renkli skala." },
      { "name": "emptyColor", "type": "string", "default": "var(--heatmap-empty)", "required": false, "description": "Verisi olmayan gunler icin renk." },
      { "name": "onDayClick", "type": "(day: HeatmapDay) => void", "default": "-", "required": false, "description": "Gun hucresine tiklandiginda tetiklenir." },
      { "name": "showMonthLabels", "type": "boolean", "default": "-", "required": false, "description": "Ust tarafta ay kisaltma etiketlerini gosterir." },
      { "name": "showDayLabels", "type": "boolean", "default": "-", "required": false, "description": "Sol tarafta gun etiketlerini gosterir (Pzt, Car, Cum)." },
      { "name": "showTooltip", "type": "boolean", "default": "-", "required": false, "description": "Hover'da tooltip gosterir." },
      { "name": "tooltipFormat", "type": "(day: HeatmapDay) => string", "default": "-", "required": false, "description": "Ozel tooltip formatlayici." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "52-week grid rendering",
      "color scale quantization",
      "month and day labels"
    ],
    "regressionFocus": [
      "bos data dizisi",
      "ozel tarih araligi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
