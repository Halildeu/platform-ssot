import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Dialog, Select, Switch } from '@mfe/design-system';
import { getUserScopes, assignScope, removeScope, type ScopeSummaryDto } from '../../../entities/scopes/api/scopes.api';
import { getCompanies, type CompanyDto } from '../../../entities/companies/api/companies.api';

interface ScopeAssignmentPanelProps {
  open: boolean;
  userId: string | null;
  userName?: string;
  onClose: () => void;
  t: (key: string, params?: Record<string, unknown>) => string;
}

const SCOPE_TYPES = ['COMPANY', 'PROJECT'] as const;

const ScopeAssignmentPanel: React.FC<ScopeAssignmentPanelProps> = ({
  open,
  userId,
  userName,
  onClose,
  t,
}) => {
  const queryClient = useQueryClient();
  const isOpen = open && Boolean(userId);

  const { data: scopes = [] } = useQuery({
    queryKey: ['user-scopes', userId],
    queryFn: () => getUserScopes(userId!),
    enabled: isOpen,
    staleTime: 30_000,
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
    enabled: isOpen,
    staleTime: 120_000,
  });

  const assignMutation = useMutation({
    mutationFn: (payload: { scopeType: string; scopeRefId: number; permissionCode: string }) =>
      assignScope(userId!, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user-scopes', userId] }),
  });

  const removeMutation = useMutation({
    mutationFn: (payload: { scopeType: string; scopeRefId: number; permissionCode: string }) =>
      removeScope(userId!, payload.scopeType, payload.scopeRefId, payload.permissionCode),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user-scopes', userId] }),
  });

  const assignedCompanyIds = React.useMemo(
    () => new Set(scopes.filter((s) => s.scopeType === 'COMPANY').map((s) => s.scopeRefId)),
    [scopes],
  );

  const handleToggle = (company: CompanyDto, checked: boolean) => {
    if (checked) {
      assignMutation.mutate({ scopeType: 'COMPANY', scopeRefId: company.id, permissionCode: 'VIEW_USERS' });
    } else {
      removeMutation.mutate({ scopeType: 'COMPANY', scopeRefId: company.id, permissionCode: 'VIEW_USERS' });
    }
  };

  if (!isOpen || !userId) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('access.scope.title')}
      description={userName ? t('access.scope.subtitle', { userName }) : undefined}
      size="lg"
      footer={(
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            {t('access.clone.cancelText')}
          </Button>
        </div>
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {scopes.map((scope) => (
            <Badge key={`${scope.scopeType}-${scope.scopeRefId}`} variant="info" size="sm">
              {scope.scopeType}: {scope.scopeRefId}
            </Badge>
          ))}
          {scopes.length === 0 && (
            <p className="text-sm text-text-subtle">{t('access.scope.noScopes')}</p>
          )}
        </div>

        <hr className="border-border-subtle" />

        <h4 className="text-sm font-semibold text-text-primary">{t('access.scope.companyLabel')}</h4>
        <div className="flex flex-col gap-2">
          {companies.map((company) => (
            <Switch
              key={company.id}
              checked={assignedCompanyIds.has(company.id)}
              onCheckedChange={(checked) => handleToggle(company, checked)}
              label={company.name}
              description={company.code ? `Code: ${company.code}` : undefined}
              size="sm"
              loading={assignMutation.isPending || removeMutation.isPending}
            />
          ))}
          {companies.length === 0 && (
            <p className="text-sm text-text-subtle">{t('access.scope.noCompanies')}</p>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default ScopeAssignmentPanel;
