import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Badge, Button, DetailDrawer, Select, TextInput } from '@mfe/design-system';
import { checkAccess, type ExplainCheckResult } from '../../../entities/authz/api/authz.api';

interface ExplainPanelProps {
  open: boolean;
  onClose: () => void;
  modules: Map<string, string>;
  t: (key: string, params?: Record<string, unknown>) => string;
}

const RELATION_OPTIONS = [
  { value: 'can_view', label: 'can_view' },
  { value: 'can_manage', label: 'can_manage' },
  { value: 'viewer', label: 'viewer' },
  { value: 'admin', label: 'admin' },
  { value: 'member', label: 'member' },
];

const OBJECT_TYPE_OPTIONS = [
  { value: 'module', label: 'Module' },
  { value: 'company', label: 'Company' },
  { value: 'project', label: 'Project' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'organization', label: 'Organization' },
];

const ExplainPanel: React.FC<ExplainPanelProps> = ({ open, onClose, modules, t }) => {
  const [relation, setRelation] = React.useState('can_view');
  const [objectType, setObjectType] = React.useState('module');
  const [objectId, setObjectId] = React.useState('');
  const [results, setResults] = React.useState<ExplainCheckResult[]>([]);

  const checkMutation = useMutation({
    mutationFn: checkAccess,
    onSuccess: (result) => {
      setResults((prev) => [result, ...prev]);
    },
  });

  const objectIdOptions = React.useMemo(() => {
    if (objectType === 'module') {
      return Array.from(modules.entries()).map(([key, label]) => ({
        value: key,
        label,
      }));
    }
    return [];
  }, [modules, objectType]);

  const handleCheck = () => {
    if (!objectId.trim()) return;
    checkMutation.mutate({ relation, objectType, objectId: objectId.trim() });
  };

  React.useEffect(() => {
    if (open) {
      setResults([]);
      setObjectId('');
    }
  }, [open]);

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      title={t('access.explain.title')}
      size="lg"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface-muted p-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label={t('access.explain.relation')}
              options={RELATION_OPTIONS}
              value={relation}
              onValueChange={setRelation}
              size="sm"
            />
            <Select
              label={t('access.explain.objectType')}
              options={OBJECT_TYPE_OPTIONS}
              value={objectType}
              onValueChange={(v) => {
                setObjectType(v);
                setObjectId('');
              }}
              size="sm"
            />
          </div>
          {objectIdOptions.length > 0 ? (
            <Select
              label={t('access.explain.objectId')}
              options={objectIdOptions}
              value={objectId}
              onValueChange={setObjectId}
              size="sm"
            />
          ) : (
            <TextInput
              label={t('access.explain.objectId')}
              placeholder="e.g., 1, 5, USER_MANAGEMENT"
              value={objectId}
              onValueChange={setObjectId}
              size="sm"
            />
          )}
          <Button
            onClick={handleCheck}
            loading={checkMutation.isPending}
            disabled={!objectId.trim()}
            size="sm"
          >
            {t('access.explain.checkButton')}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-text-primary">{t('access.explain.results')}</h4>
            {results.map((result, index) => (
              <div
                key={`${result.objectType}-${result.objectId}-${result.relation}-${index}`}
                className="flex items-center justify-between rounded-xl border border-border-subtle p-3"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-text-subtle">{result.relation}</span>
                  <span className="text-text-subtle">{'\u2192'}</span>
                  <span className="font-medium text-text-primary">
                    {result.objectType}:{result.objectId}
                  </span>
                </div>
                <Badge variant={result.allowed ? 'success' : 'error'} size="sm">
                  {result.allowed ? t('access.explain.allowed') : t('access.explain.denied')}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && (
          <p className="text-center text-sm text-text-subtle">{t('access.explain.noResults')}</p>
        )}
      </div>
    </DetailDrawer>
  );
};

export default ExplainPanel;
