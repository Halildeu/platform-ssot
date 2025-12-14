import { usersReportModule } from './users-report';
import { accessReportModule } from './access-report';
import { auditReportModule } from './audit-report';

export const reportModules = [usersReportModule, accessReportModule, auditReportModule];

export type { ReportModule } from './types';
