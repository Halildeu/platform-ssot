export interface KanbanColumn {
  id: string;
  title: string;
  limit?: number;
  color?: string;
}

export interface KanbanCard {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  dueDate?: Date;
  metadata?: Record<string, unknown>;
}

export interface DragResult {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  toIndex: number;
}
