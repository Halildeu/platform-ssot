/* ------------------------------------------------------------------ */
/*  Swimlanes                                                         */
/* ------------------------------------------------------------------ */

export interface Swimlane {
  id: string;
  title: string;
  color?: string;
  collapsed?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Column policies                                                   */
/* ------------------------------------------------------------------ */

export interface ColumnPolicy {
  wipLimit?: number;
  allowedCardTypes?: string[];
  autoAssign?: boolean;
  onEnter?: (card: KanbanCard) => KanbanCard;
  onExit?: (card: KanbanCard) => boolean;
}

/* ------------------------------------------------------------------ */
/*  Filtering                                                         */
/* ------------------------------------------------------------------ */

export interface KanbanFilter {
  field: string;
  operator: 'equals' | 'contains' | 'in';
  value: unknown;
}

/* ------------------------------------------------------------------ */
/*  Card templates                                                    */
/* ------------------------------------------------------------------ */

export interface CardTemplate {
  id: string;
  name: string;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'user';
  }>;
  color?: string;
}

/* ------------------------------------------------------------------ */
/*  Core data models                                                  */
/* ------------------------------------------------------------------ */

export interface KanbanColumn {
  id: string;
  title: string;
  limit?: number;
  color?: string;
  policy?: ColumnPolicy;
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
  swimlaneId?: string;
  type?: string;
  estimate?: number;
}

export interface DragResult {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  toIndex: number;
}
