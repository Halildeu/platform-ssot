// Redux'taki counter state'inin yapısını tanımlar.
export interface CounterState {
  value: number;
}

// Gelecekte paylaşmak isteyebileceğimiz başka bir tip örneği
export interface UserProfile {
  id?: string;
  email: string;
  role: string;
  permissions: string[];
  displayName?: string;
  fullName?: string;
  name?: string;
  lastLoginAt?: string | null;
  sessionTimeoutMinutes?: number;
}

// Bu dosyanın en altına yeni tipleri ekleyin

export interface Product {
  id: number;
  name: string;
}

export interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export type UserAccountStatus = 'ACTIVE' | 'INACTIVE' | 'INVITED' | 'SUSPENDED';

export type UserModuleAccessLevel =
  | 'NONE'
  | 'VIEW'
  | 'EDIT'
  | 'MANAGE';

export interface UserModulePermission {
  moduleKey: string;
  moduleLabel?: string;
  level: UserModuleAccessLevel;
  assignmentId?: string;
  roleName?: string;
  permissions?: string[];
  companyId?: string;
}

export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: UserAccountStatus;
  lastLoginAt?: string | null;
  createdAt?: string | null;
  modulePermissions: UserModulePermission[];
  sessionTimeoutMinutes?: number;
}

export interface UserDetail extends UserSummary {
  phoneNumber?: string;
  title?: string;
  locale?: string;
  timezone?: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type GridStateEntry = Record<string, unknown>;

export interface GridVariantState {
  columnState?: GridStateEntry[];
  filterModel?: Record<string, unknown> | null;
  advancedFilterModel?: Record<string, unknown> | null;
  sortModel?: GridStateEntry[];
  pivotMode?: boolean;
  quickFilterText?: string | null;
  sideBar?: Record<string, unknown> | null;
}

export interface GridVariant {
  id: string;
  gridId: string;
  name: string;
  isDefault: boolean;
  isGlobal: boolean;
  isGlobalDefault: boolean;
  isUserDefault?: boolean;
  isUserSelected?: boolean;
  state: GridVariantState;
  schemaVersion: number;
  isCompatible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Manifest tipleri
export interface ManifestRemote {
  name: string;
  entry: string;
  sri: string;
  versionRange: string;
  module: string;
  meta?: Record<string, unknown>;
}

export interface ManifestDictionary {
  locale: string;
  url: string;
  sri: string;
}

export interface ManifestPageRef {
  layoutUrl: string;
}

export interface Manifest {
  version: string;
  generatedAt?: string;
  remotes: ManifestRemote[];
  dictionaries?: ManifestDictionary[];
  meta?: Record<string, unknown>;
  pages?: Record<string, ManifestPageRef>;
}

export interface PageLayoutComponent {
  type: string;
  id: string;
  props?: Record<string, unknown>;
}

export interface PageLayoutManifest {
  version: string;
  id: string;
  layout: string;
  title: string;
  description?: string;
  components: PageLayoutComponent[];
  meta?: Record<string, unknown>;
}

// Schema types — database-agnostic schema metadata
export type {
  SchemaColumnInfo,
  SchemaTableInfo,
  SchemaRelationship,
  SchemaSnapshot,
  SchemaSnapshotMetadata,
  SchemaDeadTable,
  SchemaHubTable,
  SchemaAnalysis,
  SchemaColumnSearchResult,
  SchemaColumnSearchGroup,
  SchemaColumnSearchMatch,
  SchemaImpactResult,
  SchemaJoinPathSegment,
  SchemaJoinPath,
  SchemaDomain,
  DataSource,
  DataSourceType,
  DataSourceConnectionConfig,
  SchemaDriftEntry,
  SchemaDriftResult,
} from './schema';

// Telemetry & audit event tipleri (E06-S01)
export type TelemetryEventType = 'telemetry' | 'audit' | 'error';

export interface TelemetryContext {
  app: string; // shell, mfe-users, mfe-access vb.
  env: 'local' | 'dev' | 'test' | 'stage' | 'prod';
  version: string; // git sha veya semver
  userHash?: string; // PII yasak; hash/anonim kimlik
  request?: {
    method?: string;
    path?: string;
    statusCode?: number;
    payloadSize?: number; // bayt
  };
  tags?: Record<string, string | number | boolean>; // gridId, featureFlag, pageId vb.
}

export interface TelemetryMetrics {
  durationMs?: number; // TTFA veya request süresi
}

export interface AuditInfo {
  auditId?: string;
  action?: string;
}

export interface ErrorInfo {
  message?: string;
  code?: string;
  stack?: string;
}

export interface TelemetryEvent {
  eventType: TelemetryEventType;
  eventName: string; // örn: page_view, action_click, mutation_commit
  timestamp: string; // ISO date-time
  traceId?: string;
  spanId?: string;
  correlationId?: string;
  context: TelemetryContext;
  metrics?: TelemetryMetrics;
  payload?: Record<string, unknown>; // PII yok, gerekirse hash/redaction
  audit?: AuditInfo;
  error?: ErrorInfo;
}
