import { listSharedReportsForChannel } from '@platform/capabilities';
import { usersReportModule } from './users-report';
import { accessReportModule } from './access-report';
import { auditReportModule } from './audit-report';

const reportModuleMap = new Map([
  [usersReportModule.id, usersReportModule],
  [accessReportModule.id, accessReportModule],
  [auditReportModule.id, auditReportModule],
]);

export const reportModules = listSharedReportsForChannel('web')
  .map((report) => reportModuleMap.get(report.webModuleId))
  .filter(
    (
      module,
    ): module is Exclude<ReturnType<typeof reportModuleMap.get>, undefined> => Boolean(module),
  );

export type { ReportModule } from './types';
