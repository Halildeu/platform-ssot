import React from 'react';
import { KanbanBoard } from '../KanbanBoard';

export const Default = () => (
  <KanbanBoard
    columns={[
      { id: 'todo', title: 'To Do' },
      { id: 'doing', title: 'In Progress' },
      { id: 'done', title: 'Done' },
    ]}
    cards={[
      { id: '1', columnId: 'todo', title: 'Design mockups', priority: 'high', tags: ['design'] },
      { id: '2', columnId: 'todo', title: 'API integration', priority: 'medium', tags: ['backend'] },
      { id: '3', columnId: 'doing', title: 'Unit tests', priority: 'low', tags: ['qa'] },
      { id: '4', columnId: 'done', title: 'Documentation', priority: 'low' },
    ]}
  />
);

export const Empty = () => (
  <KanbanBoard
    columns={[
      { id: 'backlog', title: 'Backlog' },
      { id: 'sprint', title: 'Sprint' },
    ]}
    cards={[]}
  />
);

export default { title: 'X-Kanban/KanbanBoard', component: KanbanBoard };
