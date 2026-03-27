/* Component Patterns — page-level pattern definitions and combination rules */

export interface PagePattern {
  id: string;
  name: string;
  signals: RegExp[];
  expectedComponents: Array<{
    name: string;
    importance: 'required' | 'recommended' | 'optional';
    bundleKB: number;
  }>;
}

export interface CombinationRule {
  if: string;
  then: string;
  confidence: number;
  reason: string;
}

export const PAGE_PATTERNS: PagePattern[] = [
  {
    id: 'dashboard',
    name: 'Dashboard Page',
    signals: [/<.*Chart/i, /<.*KPI/i, /dashboard/i, /metric/i, /widget/i],
    expectedComponents: [
      { name: 'SmartDashboard', importance: 'recommended', bundleKB: 8.2 },
      { name: 'ExecutiveKPIStrip', importance: 'recommended', bundleKB: 4.1 },
      { name: 'DateRangePicker', importance: 'required', bundleKB: 3.8 },
      { name: 'FilterPresets', importance: 'optional', bundleKB: 2.9 },
      { name: 'DataExportDialog', importance: 'optional', bundleKB: 2.5 },
      { name: 'GaugeChart', importance: 'optional', bundleKB: 3.2 },
    ],
  },
  {
    id: 'crud-list',
    name: 'CRUD List Page',
    signals: [/AgGrid/i, /EntityGrid/i, /DataGrid/i, /useQuery/i, /columns/i],
    expectedComponents: [
      { name: 'AgGridServer', importance: 'required', bundleKB: 45.0 },
      { name: 'Pagination', importance: 'required', bundleKB: 3.0 },
      { name: 'SearchInput', importance: 'recommended', bundleKB: 2.8 },
      { name: 'FilterBar', importance: 'recommended', bundleKB: 4.5 },
      { name: 'DataExportDialog', importance: 'optional', bundleKB: 2.5 },
      { name: 'BulkActionBar', importance: 'optional', bundleKB: 3.1 },
    ],
  },
  {
    id: 'detail',
    name: 'Detail Page',
    signals: [/DetailDrawer/i, /Descriptions/i, /detail/i, /view/i, /readonly/i],
    expectedComponents: [
      { name: 'DetailDrawer', importance: 'required', bundleKB: 4.0 },
      { name: 'Descriptions', importance: 'recommended', bundleKB: 2.5 },
      { name: 'Tabs', importance: 'recommended', bundleKB: 5.0 },
      { name: 'Badge', importance: 'optional', bundleKB: 0.8 },
      { name: 'Timeline', importance: 'optional', bundleKB: 3.0 },
      { name: 'Avatar', importance: 'optional', bundleKB: 1.0 },
    ],
  },
  {
    id: 'form',
    name: 'Form Page',
    signals: [/useForm/i, /FormField/i, /handleSubmit/i, /zodResolver/i, /schema/i],
    expectedComponents: [
      { name: 'ConnectedInput', importance: 'required', bundleKB: 3.5 },
      { name: 'ConnectedSelect', importance: 'recommended', bundleKB: 4.2 },
      { name: 'Button', importance: 'required', bundleKB: 2.0 },
      { name: 'DatePicker', importance: 'optional', bundleKB: 12.0 },
      { name: 'Upload', importance: 'optional', bundleKB: 8.0 },
      { name: 'Steps', importance: 'optional', bundleKB: 4.0 },
    ],
  },
  {
    id: 'settings',
    name: 'Settings Page',
    signals: [/settings/i, /preferences/i, /Switch/i, /toggle/i, /config/i],
    expectedComponents: [
      { name: 'Card', importance: 'required', bundleKB: 1.5 },
      { name: 'Switch', importance: 'recommended', bundleKB: 1.2 },
      { name: 'Accordion', importance: 'recommended', bundleKB: 4.0 },
      { name: 'Select', importance: 'optional', bundleKB: 4.0 },
      { name: 'Tabs', importance: 'optional', bundleKB: 5.0 },
      { name: 'Button', importance: 'optional', bundleKB: 2.0 },
    ],
  },
  {
    id: 'auth',
    name: 'Authentication Page',
    signals: [/login/i, /signin/i, /password/i, /register/i, /auth/i],
    expectedComponents: [
      { name: 'Input', importance: 'required', bundleKB: 3.0 },
      { name: 'Button', importance: 'required', bundleKB: 2.0 },
      { name: 'Card', importance: 'recommended', bundleKB: 1.5 },
      { name: 'Checkbox', importance: 'optional', bundleKB: 1.5 },
      { name: 'LinkInline', importance: 'optional', bundleKB: 0.5 },
      { name: 'Alert', importance: 'optional', bundleKB: 1.5 },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics Page',
    signals: [/analytics/i, /report/i, /BarChart/i, /LineChart/i, /PieChart/i],
    expectedComponents: [
      { name: 'BarChart', importance: 'recommended', bundleKB: 15.0 },
      { name: 'LineChart', importance: 'recommended', bundleKB: 15.0 },
      { name: 'PieChart', importance: 'optional', bundleKB: 12.0 },
      { name: 'DateRangePicker', importance: 'required', bundleKB: 3.8 },
      { name: 'DataExportDialog', importance: 'optional', bundleKB: 2.5 },
      { name: 'FilterPresets', importance: 'optional', bundleKB: 2.9 },
    ],
  },
  {
    id: 'workflow',
    name: 'Workflow Page',
    signals: [/workflow/i, /step/i, /approve/i, /status/i, /pipeline/i],
    expectedComponents: [
      { name: 'Steps', importance: 'required', bundleKB: 4.0 },
      { name: 'Badge', importance: 'recommended', bundleKB: 0.8 },
      { name: 'Button', importance: 'required', bundleKB: 2.0 },
      { name: 'Timeline', importance: 'recommended', bundleKB: 3.0 },
      { name: 'Alert', importance: 'optional', bundleKB: 1.5 },
      { name: 'Modal', importance: 'optional', bundleKB: 5.0 },
    ],
  },
  {
    id: 'risk',
    name: 'Risk Management Page',
    signals: [/risk/i, /compliance/i, /severity/i, /threshold/i, /audit/i],
    expectedComponents: [
      { name: 'AgGridServer', importance: 'recommended', bundleKB: 45.0 },
      { name: 'Badge', importance: 'required', bundleKB: 0.8 },
      { name: 'GaugeChart', importance: 'recommended', bundleKB: 3.2 },
      { name: 'Alert', importance: 'recommended', bundleKB: 1.5 },
      { name: 'FilterBar', importance: 'optional', bundleKB: 4.5 },
      { name: 'DataExportDialog', importance: 'optional', bundleKB: 2.5 },
    ],
  },
];

export const COMBINATION_RULES: CombinationRule[] = [
  { if: 'AgGridServer', then: 'Pagination', confidence: 0.95, reason: 'Veri tablosu sayfalama gerektirir' },
  { if: 'AgGridServer', then: 'DataExportDialog', confidence: 0.85, reason: 'Grid verisi disa aktarilabilmeli' },
  { if: 'AgGridServer', then: 'SearchInput', confidence: 0.80, reason: 'Grid verisinde arama yapilabilmeli' },
  { if: 'DateRangePicker', then: 'FilterPresets', confidence: 0.70, reason: 'Tarih filtresi on tanimli presetlerle kolaylasmali' },
  { if: 'Steps', then: 'Button', confidence: 0.95, reason: 'Adim gezinmesi icin aksiyon butonlari gerekli' },
  { if: 'ConnectedInput', then: 'Button', confidence: 0.95, reason: 'Form gonderimi icin buton gerekli' },
  { if: 'SmartDashboard', then: 'DateRangePicker', confidence: 0.90, reason: 'Dashboard tarih filtreleme gerektirir' },
  { if: 'SmartDashboard', then: 'ExecutiveKPIStrip', confidence: 0.75, reason: 'Dashboard genel bakis KPI seridi ile zenginlesir' },
  { if: 'Modal', then: 'Button', confidence: 0.95, reason: 'Modal aksiyon butonlari gerektirir (onay/iptal)' },
  { if: 'FilterBar', then: 'SearchInput', confidence: 0.80, reason: 'Filtre cubugu arama alanini icerir' },
];
