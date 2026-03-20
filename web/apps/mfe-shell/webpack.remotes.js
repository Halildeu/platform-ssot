const readEnvBoolean = (keys, fallback = true) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value !== 'string' || value.length === 0) {
      continue;
    }
    const normalized = value.trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
  }
  return fallback;
};

const optionalRemote = (scope, url, enabled) => {
  if (enabled) {
    return `${scope}@${url}`;
  }
  return `promise Promise.resolve({
    get: (module) => Promise.resolve(() => {
      if (module === './shell-services') {
        return { configureShellServices: () => {} };
      }
      return { __esModule: true, default: () => null };
    }),
    init: () => {}
  })`;
};

const buildDevRemotes = () => {
  const suggestionsRemoteEnabled = readEnvBoolean(
    ['VITE_SHELL_ENABLE_SUGGESTIONS_REMOTE', 'SHELL_ENABLE_SUGGESTIONS_REMOTE'],
    true,
  );
  const ethicRemoteEnabled = readEnvBoolean(
    ['VITE_SHELL_ENABLE_ETHIC_REMOTE', 'SHELL_ENABLE_ETHIC_REMOTE'],
    true,
  );
  const accessRemoteEnabled = readEnvBoolean(
    ['VITE_SHELL_ENABLE_ACCESS_REMOTE', 'SHELL_ENABLE_ACCESS_REMOTE'],
    true,
  );
  const auditRemoteEnabled = readEnvBoolean(
    ['VITE_SHELL_ENABLE_AUDIT_REMOTE', 'SHELL_ENABLE_AUDIT_REMOTE'],
    true,
  );
  const usersRemoteEnabled = readEnvBoolean(
    ['VITE_SHELL_ENABLE_USERS_REMOTE', 'SHELL_ENABLE_USERS_REMOTE'],
    true,
  );

  return {
    mfe_suggestions: optionalRemote('mfe_suggestions', 'http://localhost:3001/remoteEntry.js', suggestionsRemoteEnabled),
    mfe_ethic: optionalRemote('mfe_ethic', 'http://localhost:3002/remoteEntry.js', ethicRemoteEnabled),
    mfe_access: optionalRemote('mfe_access', 'http://localhost:3005/remoteEntry.js', accessRemoteEnabled),
    mfe_audit: optionalRemote('mfe_audit', 'http://localhost:3006/remoteEntry.js', auditRemoteEnabled),
    mfe_users: optionalRemote('mfe_users', 'http://localhost:3004/remoteEntry.js', usersRemoteEnabled),
    mfe_reporting: 'mfe_reporting@http://localhost:3007/remoteEntry.js',
  };
};

const buildProdRemotes = () => ({
  mfe_suggestions: 'mfe_suggestions@/suggestions/remoteEntry.js',
  mfe_ethic: 'mfe_ethic@/ethic/remoteEntry.js',
  mfe_access: 'mfe_access@/access/remoteEntry.js',
  mfe_audit: 'mfe_audit@/audit/remoteEntry.js',
  mfe_users: 'mfe_users@/users/remoteEntry.js',
  mfe_reporting: 'mfe_reporting@/reports/remoteEntry.js',
});

module.exports = {
  buildDevRemotes,
  buildProdRemotes,
};
