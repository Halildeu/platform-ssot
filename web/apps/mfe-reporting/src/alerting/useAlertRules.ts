import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAlertRules, createAlertRule, updateAlertRule, deleteAlertRule } from './api';
import type { AlertRule } from './types';

const ALERT_RULES_KEY = 'alert-rules';

export function useAlertRules(reportKey: string | undefined) {
  return useQuery({
    queryKey: [ALERT_RULES_KEY, reportKey],
    queryFn: () => fetchAlertRules(reportKey!),
    enabled: !!reportKey,
    staleTime: 30_000,
  });
}

export function useAlertMutations(reportKey: string | undefined) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [ALERT_RULES_KEY, reportKey] });

  const create = useMutation({
    mutationFn: (rule: Partial<AlertRule>) => createAlertRule(reportKey!, rule),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ ruleId, updates }: { ruleId: string; updates: Partial<AlertRule> }) =>
      updateAlertRule(ruleId, updates),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (ruleId: string) => deleteAlertRule(ruleId),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
