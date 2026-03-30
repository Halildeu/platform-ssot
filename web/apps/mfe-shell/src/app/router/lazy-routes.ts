/* ------------------------------------------------------------------ */
/*  Lazy remote module definitions                                     */
/* ------------------------------------------------------------------ */

import { createLazyRemoteModule } from "../createLazyRemoteModule";

export const SuggestionsApp = createLazyRemoteModule(
  "Suggestions",
  () => import("mfe_suggestions/SuggestionsApp"),
);

export const EthicApp = createLazyRemoteModule(
  "Ethic",
  () => import("mfe_ethic/EthicApp"),
);

export const AccessModule = createLazyRemoteModule(
  "Access",
  () => import("mfe_access/AccessApp"),
);

export const AuditModule = createLazyRemoteModule(
  "Audit",
  () => import("mfe_audit/AuditApp"),
);

export const UsersModule = createLazyRemoteModule(
  "Users",
  () => import("mfe_users/UsersApp"),
);

export const ReportingModule = createLazyRemoteModule(
  "Reporting",
  () => import("mfe_reporting/ReportingApp"),
);

export const SchemaExplorerModule = createLazyRemoteModule(
  "SchemaExplorer",
  () => import("mfe_schema_explorer/SchemaExplorerApp"),
);
