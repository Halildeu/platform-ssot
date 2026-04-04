import { useQuery } from '@tanstack/react-query';
import { getCompanies, type CompanyDto } from '../../../entities/companies/api/companies.api';
import { getShellServices } from '../../../app/services/shell-services';

export interface RelationshipNode {
  id: string;
  type: 'user' | 'organization' | 'company' | 'project' | 'warehouse' | 'module';
  label: string;
  children?: RelationshipNode[];
}

export interface FlowNode {
  id: string;
  type: 'start' | 'task' | 'end';
  label: string;
  x: number;
  y: number;
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export const useRelationshipData = () => {
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
    staleTime: 120_000,
  });

  const isSuperAdmin = (() => {
    try {
      const user = getShellServices().auth.getUser() as { superAdmin?: boolean } | null;
      return user?.superAdmin ?? false;
    } catch {
      return false;
    }
  })();

  const treeData: RelationshipNode[] = [
    {
      id: 'org-default',
      type: 'organization',
      label: 'Organization (Default)',
      children: companies.map((company: CompanyDto) => ({
        id: `company-${company.id}`,
        type: 'company' as const,
        label: company.name,
        children: [], // projects/warehouses would go here with additional API
      })),
    },
  ];

  // FlowBuilder nodes/edges
  const flowNodes: FlowNode[] = [];
  const flowEdges: FlowEdge[] = [];

  // User node
  flowNodes.push({ id: 'user', type: 'start', label: 'Current User', x: 50, y: 200 });

  // Org node
  flowNodes.push({ id: 'org', type: 'task', label: 'Organization', x: 250, y: 200 });
  flowEdges.push({
    id: 'user-org',
    from: 'user',
    to: 'org',
    label: isSuperAdmin ? 'admin' : 'member',
  });

  // Company nodes
  companies.forEach((company: CompanyDto, index: number) => {
    const nodeId = `company-${company.id}`;
    flowNodes.push({
      id: nodeId,
      type: 'task',
      label: company.name,
      x: 450,
      y: 100 + index * 120,
    });
    flowEdges.push({
      id: `org-${nodeId}`,
      from: 'org',
      to: nodeId,
      label: 'viewer',
    });
  });

  return {
    treeData,
    flowNodes,
    flowEdges,
    isSuperAdmin,
    companyCount: companies.length,
  };
};
