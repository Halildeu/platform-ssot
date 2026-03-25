import { listSharedReportsForChannel } from '@platform/capabilities';
import type { ReportModule } from './types';
import { usersReportModule } from './users-report';
import { accessReportModule } from './access-report';
import { auditReportModule } from './audit-report';
import { hrDemographicReportModule } from './hr-demographic-report';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyReportModule = ReportModule<any, any>;
const reportModuleMap = new Map<string, AnyReportModule>([
  [usersReportModule.id, usersReportModule as AnyReportModule],
  [accessReportModule.id, accessReportModule as AnyReportModule],
  [auditReportModule.id, auditReportModule as AnyReportModule],
  [hrDemographicReportModule.id, hrDemographicReportModule as AnyReportModule],
]);

export const reportModules = listSharedReportsForChannel('web')
  .map((report) => reportModuleMap.get(report.webModuleId))
  .filter(
    (
      module,
    ): module is Exclude<ReturnType<typeof reportModuleMap.get>, undefined> => Boolean(module),
  );

export type { ReportModule } from './types';
