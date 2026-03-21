/* ------------------------------------------------------------------ */
/*  Recurrence                                                         */
/* ------------------------------------------------------------------ */

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number;
  endDate?: Date;
  count?: number;
  /** 0 = Sunday, 1 = Monday, ... 6 = Saturday */
  byDay?: number[];
  exceptions?: Date[];
}

/* ------------------------------------------------------------------ */
/*  Events                                                             */
/* ------------------------------------------------------------------ */

export interface SchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
  color?: string;
  allDay?: boolean;
  editable?: boolean;
  recurrence?: RecurrenceRule;
  metadata?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/*  Resources                                                          */
/* ------------------------------------------------------------------ */

export interface SchedulerResource {
  id: string;
  title: string;
  color?: string;
}

export interface Resource {
  id: string;
  name: string;
  color?: string;
  avatar?: string;
  capacity?: number;
}

/* ------------------------------------------------------------------ */
/*  Conflicts                                                          */
/* ------------------------------------------------------------------ */

export interface SchedulerConflict {
  eventA: SchedulerEvent;
  eventB: SchedulerEvent;
  overlapStart: Date;
  overlapEnd: Date;
}

/* ------------------------------------------------------------------ */
/*  Views & Slots                                                      */
/* ------------------------------------------------------------------ */

export type SchedulerView = 'day' | 'week' | 'month' | 'agenda' | 'resource';

export interface TimeSlot {
  start: Date;
  end: Date;
  resourceId?: string;
}
