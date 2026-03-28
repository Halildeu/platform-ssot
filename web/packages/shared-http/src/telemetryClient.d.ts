import type { TelemetryEvent } from '@mfe/shared-types';
export declare const sendTelemetry: (event: TelemetryEvent) => Promise<void>;
export declare const trackPageView: (payload: TelemetryEvent) => Promise<void>;
export declare const trackAction: (payload: TelemetryEvent) => Promise<void>;
export declare const trackMutation: (payload: TelemetryEvent) => Promise<void>;
declare const _default: {
    sendTelemetry: (event: TelemetryEvent) => Promise<void>;
    trackPageView: (payload: TelemetryEvent) => Promise<void>;
    trackAction: (payload: TelemetryEvent) => Promise<void>;
    trackMutation: (payload: TelemetryEvent) => Promise<void>;
};
export default _default;
