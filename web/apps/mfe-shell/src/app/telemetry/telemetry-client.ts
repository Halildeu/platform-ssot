export type TelemetryClient = {
  emit: (event: unknown) => void;
  trackPageView: (path: string) => void;
};

const telemetryClient: TelemetryClient = {
  emit: () => {},
  trackPageView: () => {},
};

export default telemetryClient;
