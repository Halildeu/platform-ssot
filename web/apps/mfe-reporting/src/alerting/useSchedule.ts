import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSchedule, createSchedule, updateSchedule, deleteSchedule } from './api';
import type { ScheduleConfig } from './types';

const SCHEDULE_KEY = 'report-schedule';

export function useSchedule(reportKey: string | undefined) {
  return useQuery({
    queryKey: [SCHEDULE_KEY, reportKey],
    queryFn: () => fetchSchedule(reportKey!),
    enabled: !!reportKey,
    staleTime: 30_000,
  });
}

export function useScheduleMutations(reportKey: string | undefined) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [SCHEDULE_KEY, reportKey] });

  const create = useMutation({
    mutationFn: (config: Partial<ScheduleConfig>) => createSchedule(reportKey!, config),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ scheduleId, updates }: { scheduleId: string; updates: Partial<ScheduleConfig> }) =>
      updateSchedule(scheduleId, updates),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (scheduleId: string) => deleteSchedule(scheduleId),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
