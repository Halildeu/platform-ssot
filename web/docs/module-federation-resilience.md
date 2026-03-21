# Module Federation Resilience Guide

## Remote Failure Scenarios

### Timeout
When a remote MFE fails to load within the configured timeout window:
- The federated container request hangs or exceeds the network timeout threshold.
- Common causes: DNS resolution delays, remote CDN outage, network partition between shell and remote host.
- Default browser fetch timeout applies unless explicitly overridden in the federation plugin config.

### 404 (Remote Not Found)
When the remote entry file is missing or the URL is incorrect:
- The `remoteEntry.js` request returns HTTP 404.
- Common causes: deployment misconfiguration, incorrect `publicPath`, CDN cache purge, deleted or renamed remote.
- The shell's dynamic import promise rejects immediately.

### Version Mismatch
When shared dependencies have incompatible versions between shell and remote:
- React or other singleton libraries load multiple instances, causing context and hook failures.
- Common causes: remote was built against a different major version of a shared dependency, `requiredVersion` constraints are too loose.
- Symptoms: "Invalid hook call" errors, broken context providers, hydration mismatches.

## Graceful Degradation Pattern

Wrap every remote MFE mount point with an `ErrorBoundary` and a fallback UI:

```tsx
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense, lazy } from 'react';

const RemoteMFE = lazy(() =>
  import('remote/Component').catch(() => ({
    default: () => <FallbackUI reason="remote-unavailable" />,
  }))
);

function MFEHost() {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <FallbackUI
          reason="runtime-error"
          error={error}
          onRetry={resetErrorBoundary}
        />
      )}
    >
      <Suspense fallback={<MFELoadingSkeleton />}>
        <RemoteMFE />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### FallbackUI Requirements
- Display a user-friendly message indicating the feature is temporarily unavailable.
- Provide a "Retry" button that re-triggers the dynamic import.
- Log the failure to the observability pipeline (error type, remote name, timestamp).
- Do not expose internal URLs or stack traces to the end user.

## Kill Switch Integration (feature-flags.ts)

Use the existing feature flag system to disable a remote before it causes cascading failures:

```ts
// feature-flags.ts
export const MFE_FLAGS = {
  'mfe.reports': true,
  'mfe.scheduler': true,
  'mfe.kanban': true,
  // Set to false to disable a failing remote
} as const;

export function isMFEEnabled(remoteName: string): boolean {
  return MFE_FLAGS[`mfe.${remoteName}` as keyof typeof MFE_FLAGS] ?? false;
}
```

Shell integration:
```tsx
function MFESlot({ name }: { name: string }) {
  if (!isMFEEnabled(name)) {
    return <FallbackUI reason="disabled-by-flag" />;
  }
  return <DynamicRemote name={name} />;
}
```

Kill switch activation procedure:
1. Identify the failing remote via alerts or error budget burn.
2. Set the corresponding flag to `false` in the flag source (config service or environment variable).
3. The shell immediately stops attempting to load the remote and shows the fallback.
4. Investigate and fix the remote independently.
5. Re-enable the flag once the remote is verified healthy.

## Health Check Pattern for Remotes

Each remote should expose a lightweight health endpoint alongside its `remoteEntry.js`:

```
GET /remotes/{name}/health.json
```

Response:
```json
{
  "status": "healthy",
  "version": "1.4.2",
  "buildTimestamp": "2026-03-20T10:15:00Z",
  "sharedDeps": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```

Shell-side health check (run at boot or on a timer):
```ts
async function checkRemoteHealth(remoteUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${remoteUrl}/health.json`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}
```

If the health check fails, the shell skips loading that remote and renders the fallback UI.

## Recovery Procedures

### Immediate Response (< 5 minutes)
1. Confirm the failure via monitoring dashboard (error spike, remote health check failures).
2. Activate the kill switch for the affected remote.
3. Verify the shell renders gracefully with the fallback UI.
4. Notify the on-call team via the alerting channel.

### Investigation (5-30 minutes)
1. Check the remote's deployment status (CDN, container registry, Kubernetes pods).
2. Review the remote's build artifacts: does `remoteEntry.js` exist and return HTTP 200?
3. Compare shared dependency versions between the shell and the remote.
4. Check for recent deployments that may have introduced the failure.

### Resolution
1. Fix the root cause (redeploy, rollback, correct configuration).
2. Verify the remote's health endpoint returns `healthy`.
3. Re-enable the kill switch flag.
4. Monitor error rates for 15 minutes to confirm stability.
5. File a postmortem if the outage exceeded the error budget.

### Rollback Decision Tree
- **Remote returns 404**: Rollback the remote deployment to the last known good version.
- **Version mismatch errors**: Pin the shared dependency version and rebuild the remote.
- **Timeout / network issues**: Check CDN and DNS. If infrastructure, escalate to platform team.
- **Runtime errors after load**: Rollback the remote code change. If the shell caused it, rollback the shell.
