export type DriftType = 'token' | 'pattern' | 'api' | 'style';
export type DriftSeverity = 'error' | 'warning' | 'info';
export interface DriftViolation {
    type: DriftType;
    severity: DriftSeverity;
    file?: string;
    line?: number;
    code: string;
    message: string;
    suggestion: string;
}
export interface DriftReport {
    totalViolations: number;
    score: number;
    violations: DriftViolation[];
    summary: {
        token: number;
        pattern: number;
        api: number;
        style: number;
    };
}
export declare function detectDrift(code: string, options?: {
    fileName?: string;
}): DriftReport;
