import React from 'react';
import { Scheduler } from '../Scheduler';

export const WeekView = () => (
  <Scheduler
    events={[
      { id: '1', title: 'Team Meeting', start: new Date(2025, 2, 24, 10, 0), end: new Date(2025, 2, 24, 11, 30), color: '#3b82f6' },
      { id: '2', title: 'Lunch', start: new Date(2025, 2, 24, 12, 0), end: new Date(2025, 2, 24, 13, 0), color: '#16a34a' },
      { id: '3', title: 'Code Review', start: new Date(2025, 2, 25, 14, 0), end: new Date(2025, 2, 25, 15, 0), color: '#8b5cf6' },
    ]}
    view="week"
    date={new Date(2025, 2, 24)}
  />
);

export const DayView = () => (
  <Scheduler
    events={[
      { id: '1', title: 'Standup', start: new Date(2025, 2, 24, 9, 0), end: new Date(2025, 2, 24, 9, 30), color: '#3b82f6' },
      { id: '2', title: 'Sprint Planning', start: new Date(2025, 2, 24, 14, 0), end: new Date(2025, 2, 24, 16, 0), color: '#d97706' },
    ]}
    view="day"
    date={new Date(2025, 2, 24)}
  />
);

export default { title: 'X-Scheduler/Scheduler', component: Scheduler };
