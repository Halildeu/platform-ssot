import React, { useMemo, useState } from 'react';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../runtime/access-controller';
import { Badge, type BadgeTone } from './Badge';
import { Empty } from './Empty';
import { Text } from './Text';

type JsonExpandable = Record<string, unknown> | unknown[];

export interface JsonViewerProps extends AccessControlledProps {
  value: unknown;
  title?: React.ReactNode;
  description?: React.ReactNode;
  rootLabel?: string;
  defaultExpandedDepth?: number;
  maxHeight?: number | string;
  fullWidth?: boolean;
  showTypes?: boolean;
  emptyStateLabel?: React.ReactNode;
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isExpandable = (value: unknown): value is JsonExpandable => Array.isArray(value) || isObjectRecord(value);

const summaryFor = (value: JsonExpandable) =>
  Array.isArray(value) ? `[${value.length} item]` : `{${Object.keys(value).length} key}`;

const typeInfoFor = (value: unknown): { label: string; tone: BadgeTone } => {
  if (value === null) return { label: 'null', tone: 'muted' };
  if (Array.isArray(value)) return { label: 'array', tone: 'info' };
  if (isObjectRecord(value)) return { label: 'object', tone: 'info' };
  if (typeof value === 'boolean') return { label: 'boolean', tone: 'warning' };
  if (typeof value === 'number') return { label: 'number', tone: 'success' };
  return { label: typeof value, tone: 'default' };
};

const primitiveClassName = (value: unknown) => {
  if (typeof value === 'string') return 'text-state-info-text';
  if (typeof value === 'number') return 'text-state-success-text';
  if (typeof value === 'boolean') return 'text-state-warning-text';
  if (value === null) return 'text-text-subtle';
  return 'text-text-primary';
};

const formatPrimitive = (value: unknown) => {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'undefined') return 'undefined';
  return String(value);
};

export const JsonViewer: React.FC<JsonViewerProps> = ({
  value,
  title,
  description,
  rootLabel = 'payload',
  defaultExpandedDepth = 1,
  maxHeight = 420,
  fullWidth = true,
  showTypes = true,
  emptyStateLabel = 'Gösterilecek JSON verisi bulunamadı.',
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  const [toggleState, setToggleState] = useState<Record<string, boolean>>({});

  const normalizedValue = useMemo(() => value, [value]);

  if (accessState.isHidden) {
    return null;
  }

  if (typeof normalizedValue === 'undefined') {
    return (
      <section
        className={fullWidth ? 'w-full' : undefined}
        data-access-state={accessState.state}
        data-component="json-viewer"
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
        <div className="mt-4">
          <Empty description={typeof emptyStateLabel === 'string' ? emptyStateLabel : 'JSON verisi bulunamadı'} />
        </div>
      </section>
    );
  }

  const isExpanded = (path: string, depth: number) =>
    toggleState[path] ?? depth < defaultExpandedDepth;

  const renderNode = (nodeLabel: string, nodeValue: unknown, path: string, depth: number): React.ReactNode => {
    const typeInfo = typeInfoFor(nodeValue);
    const expandable = isExpandable(nodeValue);
    const expanded = expandable ? isExpanded(path, depth) : false;
    const indentClass = depth === 0 ? '' : 'ml-4 border-l border-border-subtle pl-4';

    if (!expandable) {
      return (
        <div key={path} className={`rounded-2xl border border-border-subtle bg-surface-panel/60 px-4 py-3 ${indentClass}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <Text as="div" className="text-sm font-semibold text-text-primary">
                {nodeLabel}
              </Text>
            </div>
            {showTypes ? <Badge tone={typeInfo.tone}>{typeInfo.label}</Badge> : null}
          </div>
          <code className={`mt-2 block overflow-x-auto rounded-xl bg-surface-default px-3 py-2 text-xs ${primitiveClassName(nodeValue)}`}>
            {formatPrimitive(nodeValue)}
          </code>
        </div>
      );
    }

    const entries = Array.isArray(nodeValue)
      ? nodeValue.map((entry, index) => [String(index), entry] as const)
      : Object.entries(nodeValue);

    return (
      <div key={path} className={`rounded-[24px] border border-border-subtle bg-surface-panel p-4 ${indentClass}`}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() =>
            setToggleState((current) => ({
              ...current,
              [path]: !isExpanded(path, depth),
            }))
          }
        >
          <div className="flex min-w-0 items-center gap-3">
            <span aria-hidden="true" className="text-sm text-text-secondary">
              {expanded ? '▾' : '▸'}
            </span>
            <div className="min-w-0">
              <Text as="div" className="text-sm font-semibold text-text-primary">
                {nodeLabel}
              </Text>
              <Text variant="secondary" className="text-xs uppercase tracking-[0.16em]">
                {summaryFor(nodeValue)}
              </Text>
            </div>
          </div>
          {showTypes ? <Badge tone={typeInfo.tone}>{typeInfo.label}</Badge> : null}
        </button>

        {expanded ? (
          <div className="mt-4 space-y-3">
            {entries.length === 0 ? (
              <Empty description="Bu düğüm boş." className="border-dashed" />
            ) : (
              entries.map(([childKey, childValue]) => renderNode(childKey, childValue, `${path}.${childKey}`, depth + 1))
            )}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section
      className={fullWidth ? 'w-full' : undefined}
      data-access-state={accessState.state}
      data-component="json-viewer"
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

      <div
        className="mt-4 overflow-auto rounded-[26px] border border-border-subtle bg-surface-default p-4 shadow-sm"
        style={{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }}
      >
        <div className="space-y-3">{renderNode(rootLabel, normalizedValue, rootLabel, 0)}</div>
      </div>
    </section>
  );
};

export default JsonViewer;
