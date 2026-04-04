import React from 'react';
import { Badge } from '@mfe/design-system';
import type { RelationshipNode } from '../../../features/access-management/model/use-relationship-data.model';

interface RelationshipTreeViewProps {
  data: RelationshipNode[];
  t: (key: string, params?: Record<string, unknown>) => string;
}

const nodeTypeIcons: Record<string, string> = {
  user: '\u{1F464}',
  organization: '\u{1F3E2}',
  company: '\u{1F4BC}',
  project: '\u{1F4C1}',
  warehouse: '\u{1F4E6}',
  module: '\u{1F527}',
};

const nodeTypeBadge: Record<string, 'info' | 'success' | 'warning' | 'default'> = {
  organization: 'info',
  company: 'success',
  project: 'warning',
  warehouse: 'warning',
  module: 'default',
};

const TreeNode: React.FC<{ node: RelationshipNode; depth: number }> = ({ node, depth }) => {
  const [expanded, setExpanded] = React.useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <li className="list-none">
      <div
        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-muted"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
        role="treeitem"
        aria-expanded={hasChildren ? expanded : undefined}
      >
        {hasChildren && (
          <span className="text-xs text-text-subtle">{expanded ? '\u25BC' : '\u25B6'}</span>
        )}
        {!hasChildren && <span className="w-3" />}
        <span className="text-sm">{nodeTypeIcons[node.type] ?? ''}</span>
        <span className="text-sm font-medium text-text-primary">{node.label}</span>
        <Badge variant={nodeTypeBadge[node.type] ?? 'default'} size="sm">
          {node.type}
        </Badge>
      </div>
      {expanded && hasChildren && (
        <ul role="group">
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const RelationshipTreeView: React.FC<RelationshipTreeViewProps> = ({ data, t }) => {
  if (data.length === 0) {
    return <p className="text-sm text-text-subtle">{t('access.graph.noData')}</p>;
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
      <ul role="tree">
        {data.map((node) => (
          <TreeNode key={node.id} node={node} depth={0} />
        ))}
      </ul>
    </div>
  );
};

export default RelationshipTreeView;
