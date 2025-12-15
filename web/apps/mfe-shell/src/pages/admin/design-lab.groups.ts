import rawGroups from './design-lab.groups.json';

export type DesignLabGroupsSubgroup = {
  id: string;
  label: string;
};

export type DesignLabGroupsGroup = {
  id: string;
  label: string;
  subgroups: DesignLabGroupsSubgroup[];
};

export type DesignLabGroupsSpec = {
  version: number;
  fallback: {
    group: string;
    subgroup: string;
  };
  groups: DesignLabGroupsGroup[];
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const validateGroups = (input: unknown): DesignLabGroupsSpec => {
  if (!input || typeof input !== 'object') {
    throw new Error('[design-lab.groups] invalid json: expected object');
  }

  const spec = input as Partial<DesignLabGroupsSpec>;

  if (typeof spec.version !== 'number') {
    throw new Error('[design-lab.groups] invalid version');
  }

  if (!spec.fallback || typeof spec.fallback !== 'object') {
    throw new Error('[design-lab.groups] invalid fallback');
  }

  if (!isNonEmptyString(spec.fallback.group) || !isNonEmptyString(spec.fallback.subgroup)) {
    throw new Error('[design-lab.groups] invalid fallback.group/subgroup');
  }

  if (!Array.isArray(spec.groups)) {
    throw new Error('[design-lab.groups] invalid groups');
  }

  const groupIds = new Set<string>();
  const subgroupPairs = new Set<string>();

  for (const group of spec.groups) {
    if (!group || typeof group !== 'object') {
      throw new Error('[design-lab.groups] invalid group');
    }
    if (!isNonEmptyString(group.id) || !isNonEmptyString(group.label)) {
      throw new Error('[design-lab.groups] invalid group id/label');
    }
    if (groupIds.has(group.id)) {
      throw new Error(`[design-lab.groups] duplicate group id: ${group.id}`);
    }
    groupIds.add(group.id);

    if (!Array.isArray(group.subgroups)) {
      throw new Error(`[design-lab.groups] invalid subgroups for group: ${group.id}`);
    }
    const subgroupIds = new Set<string>();
    for (const subgroup of group.subgroups) {
      if (!subgroup || typeof subgroup !== 'object') {
        throw new Error(`[design-lab.groups] invalid subgroup for group: ${group.id}`);
      }
      if (!isNonEmptyString(subgroup.id) || !isNonEmptyString(subgroup.label)) {
        throw new Error(`[design-lab.groups] invalid subgroup id/label for group: ${group.id}`);
      }
      if (subgroupIds.has(subgroup.id)) {
        throw new Error(`[design-lab.groups] duplicate subgroup id: ${group.id}/${subgroup.id}`);
      }
      subgroupIds.add(subgroup.id);
      subgroupPairs.add(`${group.id}/${subgroup.id}`);
    }
  }

  const fallbackPair = `${spec.fallback.group}/${spec.fallback.subgroup}`;
  if (!subgroupPairs.has(fallbackPair)) {
    throw new Error(`[design-lab.groups] fallback not found in groups: ${fallbackPair}`);
  }

  return spec as DesignLabGroupsSpec;
};

export const DESIGN_LAB_GROUPS: DesignLabGroupsSpec = validateGroups(rawGroups);

