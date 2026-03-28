import * as React from 'react';
import { useShellNamespaceI18n } from '../../../app/i18n';

export const useDesignLabI18n = () => {
  const { t: baseT, ready, ...rest } = useShellNamespaceI18n('designlab');

  const t = React.useCallback(
    (key: string, params?: Record<string, unknown>) => {
      if (!ready && key.startsWith('designlab.')) {
        return '';
      }
      return baseT(key, params);
    },
    [baseT, ready],
  );

  return { t, ready, ...rest };
};
