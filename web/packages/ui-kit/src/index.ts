import 'ag-grid-enterprise';
import {
  LicenseManager,
  AllEnterpriseModule,
  AdvancedFilterModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SetFilterModule,
  SideBarModule,
  MenuModule,
  ColumnMenuModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
} from 'ag-grid-enterprise';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

const AG_GRID_LICENSE_KEY =
  '[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-104897}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{30 November 2025}____[v3]_[0102]_MTc2NDQ2MDgwMDAwMA==a97c0b249a2f0bd2a1ed2c10804b61b5';

if (typeof LicenseManager.setLicenseKey === 'function') {
  LicenseManager.setLicenseKey(AG_GRID_LICENSE_KEY);
}

ModuleRegistry.registerModules([
  AllCommunityModule,
  SideBarModule,
  FiltersToolPanelModule,
  ColumnsToolPanelModule,
  AdvancedFilterModule,
  SetFilterModule,
  MenuModule,
  ColumnMenuModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  AllEnterpriseModule,
]);

// Theming API değişkenlerini yükle
import './styles/grid-theme.css';
import './styles/elevation.css';

export * from './components/Button';
export * from './components/Badge';
export * from './components/Tooltip';
export * from './components/Select';
export * from './components/Modal';
export * from './components/Dropdown';
export * from './components/Tag';
export * from './components/Empty';
export * from './components/Text';
export * from './components/theme/ThemePreviewCard';
export * from './layout/PageLayout';
export * from './layout/FilterBar';
export * from './layout/DetailDrawer';
export * from './layout/FormDrawer';
export * from './layout/ReportFilterPanel';
export * from './layout/AgGridServer';
export * from './components/entity-grid';
export * from './lib/grid-variants';
export * from './lib/auth/token-resolver';
export * from './runtime/theme-controller';
export * from './runtime/access-controller';
