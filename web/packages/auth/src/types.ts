/**
 * Authorization types matching backend AuthzProxyControllerV1 DTOs.
 */

export interface AuthzMeResponse {
  userId: string;
  superAdmin: boolean;
  allowedModules: string[];
  allowedCompanyIds: number[];
  allowedProjectIds: number[];
  allowedWarehouseIds: number[];
}

export interface CheckRequest {
  relation: string;
  objectType: string;
  objectId: string;
}

export interface CheckResponse {
  allowed: boolean;
}

/**
 * Module permission constants matching OpenFGA model.
 */
export const MODULES = {
  USER_MANAGEMENT: 'USER_MANAGEMENT',
  ACCESS: 'ACCESS',
  AUDIT: 'AUDIT',
  REPORT: 'REPORT',
  WAREHOUSE: 'WAREHOUSE',
  PURCHASE: 'PURCHASE',
  THEME: 'THEME',
} as const;

export type ModuleKey = keyof typeof MODULES;
