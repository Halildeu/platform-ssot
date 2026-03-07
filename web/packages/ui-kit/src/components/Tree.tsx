import React, { useMemo, useState } from 'react';
import {
  resolveAccessState,
  shouldBlockInteraction,
  type AccessControlledProps,
} from '../runtime/access-controller';
import { Badge, type BadgeTone } from './Badge';
import { Empty } from './Empty';
import { Skeleton } from './Skeleton';
import { Text } from './Text';

export type TreeDensity = 'comfortable' | 'compact';
export type TreeTone = 'default' | 'info' | 'success' | 'warning' | 'danger';

export type TreeNode = {
  key: React.Key;
  label: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  badges?: Array<React.ReactNode | string>;
  tone?: TreeTone;
  disabled?: boolean;
  children?: TreeNode[];
};

export interface TreeProps extends AccessControlledProps {
  nodes: TreeNode[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  density?: TreeDensity;
  emptyStateLabel?: React.ReactNode;
  loading?: boolean;
  selectedKey?: React.Key | null;
  onNodeSelect?: (key: React.Key) => void;
  defaultExpandedKeys?: React.Key[];
  expandedKeys?: React.Key[];
  onExpandedKeysChange?: (keys: React.Key[]) => void;
  fullWidth?: boolean;
}

const densityClass: Record<TreeDensity, string> = {
  comfortable: 'px-4 py-3.5',
  compact: 'px-4 py-2.5',
};

const toneClass: Record<TreeTone, string> = {
  default: 'border-border-subtle bg-surface-default',
  info: 'border-state-info-border bg-surface-panel',
  success: 'border-state-success-border bg-surface-panel',
  warning: 'border-state-warning-border bg-surface-panel',
  danger: 'border-state-danger-border bg-surface-panel',
};

const badgeToneMap: Record<TreeTone, BadgeTone> = {
  default: 'default',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

const flattenKeys = (nodes: TreeNode[]): React.Key[] =>
  nodes.flatMap((node) => [node.key, ...(node.children ? flattenKeys(node.children) : [])]);

export const Tree: React.FC<TreeProps> = ({
  nodes,
  title,
  description,
  density = 'comfortable',
  emptyStateLabel = 'Ağaç görünümü için kayıt bulunamadı.',
  loading = false,
  selectedKey = null,
  onNodeSelect,
  defaultExpandedKeys = [],
  expandedKeys,
  onExpandedKeysChange,
  fullWidth = true,
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<React.Key[]>(defaultExpandedKeys);

  const allKeys = useMemo(() => new Set(flattenKeys(nodes)), [nodes]);
  const effectiveExpandedKeys = useMemo(
    () => (expandedKeys ?? internalExpandedKeys).filter((key) => allKeys.has(key)),
    [allKeys, expandedKeys, internalExpandedKeys],
  );
  const expandedKeySet = useMemo(() => new Set(effectiveExpandedKeys), [effectiveExpandedKeys]);

  if (accessState.isHidden) {
    return null;
  }

  const updateExpandedKeys = (nextKeys: React.Key[]) => {
    const unique = Array.from(new Set(nextKeys)).filter((key) => allKeys.has(key));
    if (!expandedKeys) {
      setInternalExpandedKeys(unique);
    }
    onExpandedKeysChange?.(unique);
  };

  const toggleNode = (nodeKey: React.Key) => {
    if (expandedKeySet.has(nodeKey)) {
      updateExpandedKeys(effectiveExpandedKeys.filter((key) => key !== nodeKey));
      return;
    }
    updateExpandedKeys([...effectiveExpandedKeys, nodeKey]);
  };

  const renderNode = (node: TreeNode, depth: number): React.ReactNode => {
    const tone = node.tone ?? 'default';
    const hasChildren = (node.children?.length ?? 0) > 0;
    const expanded = hasChildren ? expandedKeySet.has(node.key) : false;
    const selected = selectedKey === node.key;
    const blocked = shouldBlockInteraction(accessState.state, node.disabled);

    return (
      <li key={node.key} className="space-y-2">
        <div
          className={[
            'rounded-[24px] border shadow-sm transition-colors',
            toneClass[tone],
            depth > 0 ? 'ml-0' : '',
            selected ? 'ring-2 ring-state-info-border/60' : '',
          ].join(' ')}
          data-selected={selected ? 'true' : 'false'}
        >
          <div className={[densityClass[density], depth > 0 ? 'bg-surface-panel/70' : ''].filter(Boolean).join(' ')}>
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 pt-1">
                {hasChildren ? (
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded-full border border-border-subtle bg-surface-default text-sm text-text-secondary transition hover:bg-surface-panel"
                    aria-label={expanded ? 'Dal kapanir' : 'Dal acilir'}
                    aria-expanded={expanded}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleNode(node.key);
                    }}
                  >
                    {expanded ? '▾' : '▸'}
                  </button>
                ) : (
                  <span className="inline-flex size-7 items-center justify-center rounded-full border border-border-subtle bg-surface-default text-[10px] font-semibold uppercase text-text-subtle">
                    •
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  className={[
                    'w-full rounded-2xl px-1 text-left transition-colors',
                    blocked ? 'cursor-not-allowed opacity-70' : onNodeSelect ? 'hover:bg-surface-default/80 active:bg-surface-default' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={(event) => {
                    if (blocked) {
                      event.preventDefault();
                      event.stopPropagation();
                      return;
                    }
                    onNodeSelect?.(node.key);
                    if (!onNodeSelect && hasChildren) {
                      toggleNode(node.key);
                    }
                  }}
                  aria-current={selected ? 'true' : undefined}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Text as="div" className="min-w-0 text-sm font-semibold text-text-primary" wrap="pretty">
                          {node.label}
                        </Text>
                        {node.badges?.map((badge, badgeIndex) =>
                          typeof badge === 'string' ? (
                            <Badge key={`${node.key}-badge-${badgeIndex}`} tone={badgeToneMap[tone]}>
                              {badge}
                            </Badge>
                          ) : (
                            <React.Fragment key={`${node.key}-badge-${badgeIndex}`}>{badge}</React.Fragment>
                          ),
                        )}
                      </div>
                      {node.description ? (
                        <Text variant="secondary" className="block text-sm leading-6" wrap="pretty">
                          {node.description}
                        </Text>
                      ) : null}
                    </div>
                    {node.meta ? (
                      <Text variant="secondary" className="text-xs font-medium uppercase tracking-[0.16em]">
                        {node.meta}
                      </Text>
                    ) : null}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {hasChildren && expanded ? (
          <ul className="space-y-2 border-l border-border-subtle/70 pl-4">
            {node.children?.map((child) => renderNode(child, depth + 1))}
          </ul>
        ) : null}
      </li>
    );
  };

  return (
    <section
      className={fullWidth ? 'w-full' : undefined}
      data-access-state={accessState.state}
      data-component="tree"
      data-loading={loading ? 'true' : 'false'}
      title={accessReason}
    >
      {title ? (
        <Text as="div" className="text-base font-semibold text-text-primary">
          {title}
        </Text>
      ) : null}
      {description ? (
        <Text variant="secondary" className="mt-1 block text-sm leading-6">
          {description}
        </Text>
      ) : null}

      <div className="mt-4 rounded-[26px] border border-border-subtle bg-surface-panel p-4 shadow-sm">
        {loading ? (
          <div className="space-y-3" data-testid="tree-loading-state">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`tree-loading-${index}`} className="rounded-[22px] border border-border-subtle bg-surface-default px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <Skeleton variant="avatar" className="size-8 shrink-0" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton lines={1} />
                    <Skeleton lines={1} animated={false} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : nodes.length === 0 ? (
          <Empty description={typeof emptyStateLabel === 'string' ? emptyStateLabel : 'Kayıt bulunamadı'} />
        ) : (
          <ul className="space-y-3">{nodes.map((node) => renderNode(node, 0))}</ul>
        )}
      </div>
    </section>
  );
};

export default Tree;
