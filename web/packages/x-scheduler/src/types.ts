export interface SchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
  color?: string;
  allDay?: boolean;
  editable?: boolean;
  metadata?: Record<string, unknown>;
}

export interface SchedulerResource {
  id: string;
  title: string;
  color?: string;
}

export type SchedulerView = 'day' | 'week' | 'month';

export interface TimeSlot {
  start: Date;
  end: Date;
  resourceId?: string;
}
