import React from 'react';
import { Segmented } from '@mfe/design-system';
import { FlowBuilder } from '@mfe/design-system/enterprise';
import type { FlowNode, FlowEdge } from '../../../features/access-management/model/use-relationship-data.model';
import { useRelationshipData } from '../../../features/access-management/model/use-relationship-data.model';
import RelationshipTreeView from './RelationshipTreeView.ui';

interface RelationshipGraphProps {
  t: (key: string, params?: Record<string, unknown>) => string;
}

type ViewMode = 'tree' | 'graph';

const RelationshipGraph: React.FC<RelationshipGraphProps> = ({ t }) => {
  const [viewMode, setViewMode] = React.useState<ViewMode>('tree');
  const { treeData, flowNodes, flowEdges } = useRelationshipData();

  const viewItems = React.useMemo(
    () => [
      { value: 'tree', label: t('access.graph.treeView') },
      { value: 'graph', label: t('access.graph.graphView') },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">{t('access.graph.title')}</h3>
        <Segmented
          items={viewItems}
          value={viewMode}
          onValueChange={(v) => setViewMode(v as ViewMode)}
          size="sm"
        />
      </div>

      {viewMode === 'tree' ? (
        <RelationshipTreeView data={treeData} t={t} />
      ) : (
        <div className="rounded-2xl border border-border-subtle bg-surface-default" style={{ height: 500 }}>
          <FlowBuilder
            nodes={flowNodes}
            edges={flowEdges}
            readOnly
            showMinimap
            showGrid
          />
        </div>
      )}
    </div>
  );
};

export default RelationshipGraph;
