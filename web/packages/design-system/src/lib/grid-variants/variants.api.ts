import { GridVariant, GridVariantState } from '@mfe/shared-types';
import { isAxiosError } from 'axios';
import { api } from '@mfe/shared-http';
import { buildAuthHeaders, registerTokenResolver as registerSharedTokenResolver } from '../auth/token-resolver';

type VariantDto = {
  id?: string | number;
  gridId?: string;
  name?: string;
  state?: unknown;
  isDefault?: boolean;
  isGlobal?: boolean;
  isGlobalDefault?: boolean;
  isUserDefault?: boolean;
  isUserSelected?: boolean;
  isCompatible?: boolean;
  sortOrder?: number;
  schemaVersion?: number;
  createdAt?: string;
  updatedAt?: string;
};

type PagedResultDto<T> = {
  items?: T[];
  total?: number;
  page?: number;
  pageSize?: number;
};

type VariantWire = Partial<Record<keyof GridVariant, unknown>>;

const VARIANTS_BASE_URL = '/v1/variants';
const LOCAL_STORAGE_NAMESPACE = 'grid-variants';
const LOCAL_PREFERENCE_NAMESPACE = 'grid-variants-preferences';
const DEFAULT_VARIANT_NAME = 'Adsız Varyant';
const LOCAL_CACHE_ENABLED = true;
const FETCH_BASE_URL =
  typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'http://localhost';

const findGridIdByVariant = (variantId: string): string | undefined => {
  if (!hasBrowserEnv()) return undefined;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_NAMESPACE);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as PersistedVariantsState;
    return Object.entries(parsed).find(([, list]) => list.some((v) => v.id === variantId))?.[0];
  } catch {
    return undefined;
  }
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const cloneObject = <T extends Record<string, unknown>>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T;

const parseBoolean = (value: unknown, fallback = false): boolean => {
  if (value === undefined || value === null) {
    return fallback;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === '') {
      return fallback;
    }
    if (['true', '1', 'yes', 'on'].includes(normalized)) {
      return true;
    }
    if (['false', '0', 'no', 'off', 'null', 'undefined'].includes(normalized)) {
      return false;
    }
  }
  return Boolean(value);
};

const sanitizeVariantName = (value: unknown): string => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : DEFAULT_VARIANT_NAME;
  }
  if (value === null || value === undefined) {
    return DEFAULT_VARIANT_NAME;
  }
  const stringified = String(value).trim();
  return stringified.length > 0 ? stringified : DEFAULT_VARIANT_NAME;
};

const sanitizeVariantState = (value: unknown): GridVariantState => {
  if (typeof value === 'string') {
    try {
      return sanitizeVariantState(JSON.parse(value));
    } catch {
      return {};
    }
  }
  if (!isPlainObject(value)) {
    return {};
  }

  const safe: GridVariantState = {};

  if (Array.isArray(value.columnState)) {
    const normalized = value.columnState
      .filter((item) => item && typeof item === 'object')
      .map((item) => cloneObject(item as Record<string, unknown>));
    if (normalized.length > 0) {
      safe.columnState = normalized;
    }
  }

  if (value.filterModel === null) {
    safe.filterModel = null;
  } else if (isPlainObject(value.filterModel)) {
    safe.filterModel = cloneObject(value.filterModel);
  }

  if (value.advancedFilterModel === null) {
    safe.advancedFilterModel = null;
  } else if (isPlainObject(value.advancedFilterModel)) {
    safe.advancedFilterModel = cloneObject(value.advancedFilterModel);
  }

  if (Array.isArray(value.sortModel)) {
    const normalized = value.sortModel
      .filter((item) => item && typeof item === 'object')
      .map((item) => cloneObject(item as Record<string, unknown>));
    if (normalized.length > 0) {
      safe.sortModel = normalized;
    }
  }

  if (typeof value.pivotMode === 'boolean') {
    safe.pivotMode = value.pivotMode;
  }

  if (value.quickFilterText === null) {
    safe.quickFilterText = null;
  } else if (typeof value.quickFilterText === 'string') {
    safe.quickFilterText = value.quickFilterText;
  }

  if (value.sideBar === null) {
    safe.sideBar = null;
  } else if (isPlainObject(value.sideBar)) {
    safe.sideBar = cloneObject(value.sideBar);
  }

  return safe;
};

export interface CreateGridVariantPayload {
  gridId: string;
  name: string;
  isDefault: boolean;
  isGlobal: boolean;
  isGlobalDefault: boolean;
  schemaVersion: number;
  state: GridVariantState;
  isUserDefault?: boolean;
  isUserSelected?: boolean;
}

export interface UpdateGridVariantPayload {
  id: string;
  gridId?: string;
  name?: string;
  isDefault?: boolean;
  isGlobal?: boolean;
  isGlobalDefault?: boolean;
  schemaVersion?: number;
  state?: GridVariantState;
  isUserDefault?: boolean;
  isUserSelected?: boolean;
}

export interface CloneGridVariantPayload {
  variantId: string;
  name?: string;
  setDefault?: boolean;
  setSelected?: boolean;
}

export interface UpdateVariantPreferencePayload {
  variantId: string;
  gridId?: string;
  isDefault?: boolean;
  isSelected?: boolean;
}

const hasBrowserEnv = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const registerGridVariantsTokenResolver = (resolver?: Parameters<typeof registerSharedTokenResolver>[0]) => {
  registerSharedTokenResolver(resolver);
};

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { ...buildAuthHeaders() };
  if (hasBrowserEnv()) {
    const internalApiKey = window.localStorage.getItem('internalApiKey');
    if (internalApiKey) {
      headers['X-Internal-Api-Key'] = internalApiKey;
    }
  }
  return headers;
};

const getJsonHeaders = () => ({ 'Content-Type': 'application/json', ...getAuthHeaders() });

interface PersistedVariantsState {
  [gridId: string]: GridVariant[];
}

interface PersistedVariantPreference {
  defaultVariantId?: string;
  selectedVariantId?: string;
}

interface PersistedPreferencesState {
  [gridId: string]: PersistedVariantPreference | undefined;
}

const getTimestamp = (value?: string) => {
  if (!value) {
    return 0;
  }
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
};

export const mapVariantDtoToGridVariant = (dto: VariantDto): GridVariant => ({
  id: String(dto.id ?? ''),
  gridId: dto.gridId ?? '',
  name: sanitizeVariantName(dto.name),
  state: sanitizeVariantState((dto as VariantWire).state),
  isDefault: parseBoolean(dto.isDefault),
  isGlobal: parseBoolean(dto.isGlobal),
  isGlobalDefault: parseBoolean(dto.isGlobalDefault),
  isUserDefault: parseBoolean(dto.isUserDefault),
  isUserSelected: parseBoolean(dto.isUserSelected, parseBoolean(dto.isUserDefault)),
  isCompatible: dto.isCompatible === undefined ? true : parseBoolean(dto.isCompatible, true),
  sortOrder: typeof dto.sortOrder === 'number' ? dto.sortOrder : Number(dto.sortOrder ?? 0),
  schemaVersion: dto.schemaVersion ?? 1,
  createdAt: typeof dto.createdAt === 'string' ? dto.createdAt : new Date().toISOString(),
  updatedAt: typeof dto.updatedAt === 'string' ? dto.updatedAt : new Date().toISOString(),
});

export const compareGridVariants = (a: GridVariant, b: GridVariant) => {
  const sortDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  if (sortDiff !== 0) {
    return sortDiff;
  }
  const createdDiff = getTimestamp(a.createdAt) - getTimestamp(b.createdAt);
  if (createdDiff !== 0) {
    return createdDiff;
  }
  const nameA = sanitizeVariantName(a.name);
  const nameB = sanitizeVariantName(b.name);
  return nameA.localeCompare(nameB, 'tr', { sensitivity: 'accent' });
};

const readLocalVariants = (gridId: string): GridVariant[] => {
  if (!LOCAL_CACHE_ENABLED || !hasBrowserEnv()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_NAMESPACE);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PersistedVariantsState;
    if (!parsed || typeof parsed !== 'object') return [];
    const list = parsed[gridId];
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
      ...item,
      name: sanitizeVariantName((item as VariantWire).name),
      state: sanitizeVariantState((item as VariantWire).state),
      isDefault: parseBoolean((item as VariantWire).isDefault),
      isGlobal: parseBoolean((item as VariantWire).isGlobal),
      isGlobalDefault: parseBoolean((item as VariantWire).isGlobalDefault),
      isUserDefault: parseBoolean((item as VariantWire).isUserDefault),
      isUserSelected: parseBoolean((item as VariantWire).isUserSelected),
      isCompatible: (item as VariantWire).isCompatible === undefined
        ? true
        : parseBoolean((item as VariantWire).isCompatible, true),
      sortOrder: (typeof (item as VariantWire).sortOrder === 'number'
        ? (item as VariantWire).sortOrder
        : Number((item as VariantWire).sortOrder ?? 0)) as number,
      createdAt: (typeof (item as VariantWire).createdAt === 'string' ? (item as VariantWire).createdAt : new Date().toISOString()) as string,
      updatedAt: (typeof (item as VariantWire).updatedAt === 'string' ? (item as VariantWire).updatedAt : new Date().toISOString()) as string,
    })).sort(compareGridVariants);
  } catch (error) {
    console.warn('Varyant yerel verisi okunamadı', error);
    return [];
  }
};

const readLocalPreference = (gridId: string): PersistedVariantPreference | undefined => {
  if (!hasBrowserEnv()) {
    return undefined;
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_PREFERENCE_NAMESPACE);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as PersistedPreferencesState;
    const pref = parsed?.[gridId];
    if (!pref || typeof pref !== 'object') {
      return undefined;
    }
    return {
      defaultVariantId: typeof pref.defaultVariantId === 'string' ? pref.defaultVariantId : undefined,
      selectedVariantId: typeof pref.selectedVariantId === 'string' ? pref.selectedVariantId : undefined,
    };
  } catch (error) {
    console.warn('Varyant tercih verisi okunamadı', error);
    return undefined;
  }
};

const writeLocalPreference = (gridId: string, pref: PersistedVariantPreference | undefined) => {
  if (!hasBrowserEnv()) {
    return;
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_PREFERENCE_NAMESPACE);
    const parsed = raw ? JSON.parse(raw) as PersistedPreferencesState : {};
    if (!pref || (!pref.defaultVariantId && !pref.selectedVariantId)) {
      delete parsed[gridId];
    } else {
      parsed[gridId] = pref;
    }
    window.localStorage.setItem(LOCAL_PREFERENCE_NAMESPACE, JSON.stringify(parsed));
  } catch (error) {
    console.warn('Varyant tercih verisi kaydedilemedi', error);
  }
};

const purgeLocalPreferenceByVariant = (variantId: string) => {
  if (!hasBrowserEnv()) {
    return;
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_PREFERENCE_NAMESPACE);
    if (!raw) return;
    const parsed = JSON.parse(raw) as PersistedPreferencesState;
    let dirty = false;
    Object.entries(parsed).forEach(([gridId, pref]) => {
      if (!pref) {
        return;
      }
      if (pref.defaultVariantId === variantId || pref.selectedVariantId === variantId) {
        delete parsed[gridId];
        dirty = true;
      }
    });
    if (dirty) {
      window.localStorage.setItem(LOCAL_PREFERENCE_NAMESPACE, JSON.stringify(parsed));
    }
  } catch (error) {
    console.warn('Varyant tercih verisi temizlenemedi', error);
  }
};

const writeLocalVariants = (gridId: string, variants: GridVariant[]) => {
  if (!LOCAL_CACHE_ENABLED || !hasBrowserEnv()) {
    return;
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_NAMESPACE);
    const parsed = raw ? JSON.parse(raw) as PersistedVariantsState : {};
    parsed[gridId] = variants;
    window.localStorage.setItem(LOCAL_STORAGE_NAMESPACE, JSON.stringify(parsed));
  } catch (error) {
    console.warn('Varyant yerel verisi kaydedilemedi', error);
  }
};

const upsertLocalVariant = (gridId: string, variant: GridVariant): GridVariant[] => {
  const existing = readLocalVariants(gridId).filter((item) => item.id !== variant.id);
  const normalizedExisting = existing.map((item) => {
    if (variant.isGlobal && variant.isGlobalDefault) {
      return item.isGlobal ? { ...item, isGlobalDefault: false } : item;
    }
    if (!variant.isGlobal && variant.isDefault) {
      return item.isGlobal ? item : { ...item, isDefault: false };
    }
    if (variant.isUserDefault) {
      return { ...item, isUserDefault: false };
    }
    if (variant.isUserSelected) {
      return { ...item, isUserSelected: false };
    }
    return item;
  });

  const ensureSortOrder = (value: unknown, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  };

  const existingWithOrder = normalizedExisting.map((item, index) => ({
    ...item,
    sortOrder: ensureSortOrder(item.sortOrder, index),
  }));

  const maxExistingOrder = existingWithOrder.reduce(
    (max, item) => (item.sortOrder > max ? item.sortOrder : max),
    -1,
  );

  const normalizedVariant: GridVariant = {
    ...variant,
    name: sanitizeVariantName(variant.name),
    state: sanitizeVariantState(variant.state),
    isCompatible: parseBoolean(variant.isCompatible, true),
    isUserDefault: parseBoolean(variant.isUserDefault),
    isUserSelected: parseBoolean(
      variant.isUserSelected,
      parseBoolean(variant.isUserDefault),
    ),
    sortOrder: ensureSortOrder(variant.sortOrder, maxExistingOrder + 1),
  };

  const result = [...existingWithOrder, normalizedVariant].sort(compareGridVariants);
  if (LOCAL_CACHE_ENABLED) {
    writeLocalVariants(gridId, result);
  }
  return result;
};

const makeLocalVariant = (
  gridId: string,
  payload: CreateGridVariantPayload | UpdateGridVariantPayload,
  base?: GridVariant,
): GridVariant => {
  const now = new Date().toISOString();
  const id = base?.id ?? (typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `local-${Date.now()}`);
  const state =
    'state' in payload && payload.state !== undefined
      ? payload.state
      : base?.state ?? { columnState: [] };
  const isGlobal = 'isGlobal' in payload && payload.isGlobal !== undefined
    ? parseBoolean(payload.isGlobal)
    : parseBoolean(base?.isGlobal);
  const isGlobalDefaultCandidate = 'isGlobalDefault' in payload && payload.isGlobalDefault !== undefined
    ? parseBoolean(payload.isGlobalDefault)
    : parseBoolean(base?.isGlobalDefault);
  const derivedDefault = isGlobal
    ? false
    : ('isDefault' in payload && payload.isDefault !== undefined
      ? parseBoolean(payload.isDefault)
      : parseBoolean(base?.isDefault));
  const userDefault = 'isUserDefault' in payload && (payload as VariantWire).isUserDefault !== undefined
    ? parseBoolean((payload as VariantWire).isUserDefault)
    : parseBoolean(base?.isUserDefault, derivedDefault);
  const userSelected = 'isUserSelected' in payload && (payload as VariantWire).isUserSelected !== undefined
    ? parseBoolean((payload as VariantWire).isUserSelected)
    : parseBoolean(base?.isUserSelected, derivedDefault);
  return {
    id,
    gridId,
    name: sanitizeVariantName(
      'name' in payload && payload.name !== undefined ? payload.name : base?.name ?? 'Yerel Varyant',
    ),
    isDefault: derivedDefault,
    isGlobal,
    isGlobalDefault: isGlobal ? isGlobalDefaultCandidate : false,
    isUserDefault: userDefault,
    isUserSelected: userSelected,
    state: sanitizeVariantState(state),
    schemaVersion: payload.schemaVersion ?? base?.schemaVersion ?? 1,
    isCompatible: true,
    sortOrder: base?.sortOrder ?? -1,
    createdAt: base?.createdAt ?? now,
    updatedAt: now,
  };
};

export const fetchGridVariants = async (gridId: string): Promise<GridVariant[]> => {
  if (typeof fetch === 'function') {
    try {
      const res = await fetch(`${FETCH_BASE_URL}${VARIANTS_BASE_URL}?gridId=${encodeURIComponent(gridId)}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error(`fetch error ${res.status}`);
      }
      const payload = await res.json();
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as PagedResultDto<VariantDto>).items)
          ? (payload as PagedResultDto<VariantDto>).items
          : [];
      const normalized = (list ?? [])
        .map((variant) => mapVariantDtoToGridVariant(variant as VariantDto))
        .sort(compareGridVariants);
      writeLocalVariants(gridId, normalized);
      return normalized;
    } catch {
      const fallback = readLocalVariants(gridId);
      return fallback;
    }
  }
  try {
    const response = await api.get<PagedResultDto<VariantDto> | VariantDto[]>(
      `${VARIANTS_BASE_URL}?gridId=${encodeURIComponent(gridId)}`,
      { headers: getAuthHeaders() },
    );
    const payload = response.data;
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as PagedResultDto<VariantDto>).items)
        ? (payload as PagedResultDto<VariantDto>).items
        : [];
    const normalized = (list ?? [])
      .map((variant) => mapVariantDtoToGridVariant(variant as VariantDto))
      .sort(compareGridVariants);

    const preference = readLocalPreference(gridId);
    const hasServerUserDefault = normalized.some((variant) => variant.isUserDefault);
    const hasServerUserSelected = normalized.some((variant) => variant.isUserSelected);
    let enhanced = normalized;

    if (preference?.defaultVariantId && !hasServerUserDefault) {
      const index = enhanced.findIndex((variant) => variant.id === preference.defaultVariantId && variant.isCompatible);
      if (index >= 0) {
        enhanced = enhanced.map((variant, idx) =>
          idx === index
            ? { ...variant, isUserDefault: true }
            : { ...variant, isUserDefault: false },
        );
      } else {
        writeLocalPreference(gridId, {
          selectedVariantId: preference.selectedVariantId,
        });
      }
    }

    if (preference?.selectedVariantId && !hasServerUserSelected) {
      const index = enhanced.findIndex((variant) => variant.id === preference.selectedVariantId && variant.isCompatible);
      if (index >= 0) {
        enhanced = enhanced.map((variant, idx) =>
          idx === index
            ? { ...variant, isUserSelected: true }
            : { ...variant, isUserSelected: parseBoolean(variant.isUserDefault) },
        );
      } else if (!preference.defaultVariantId) {
        writeLocalPreference(gridId, undefined);
      }
    }

    writeLocalVariants(gridId, enhanced);
    return enhanced;
  } catch (error) {
    const fallback = readLocalVariants(gridId);
    if (isAxiosError(error) && error.response?.status === 404) {
      const empty: GridVariant[] = [];
      writeLocalVariants(gridId, empty);
      return empty;
    }
    console.warn('Sunucu erişilemedi, yerel varyantlar kullanılıyor.', error);
    return fallback;
  }
};

export const createGridVariant = async (payload: CreateGridVariantPayload): Promise<GridVariant> => {
  if (typeof fetch === 'function') {
    try {
      const res = await fetch(`${FETCH_BASE_URL}${VARIANTS_BASE_URL}`, {
        method: 'POST',
        headers: getJsonHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`fetch error ${res.status}`);
      }
      const created = (await res.json()) as VariantDto;
      const normalized: GridVariant = mapVariantDtoToGridVariant(created);
      upsertLocalVariant(payload.gridId, normalized);
      return normalized;
    } catch (error) {
      console.warn('Sunucuya varyant kaydedilemedi, yerel olarak saklanıyor.', error);
      const localVariant = makeLocalVariant(payload.gridId, payload);
      const stored = upsertLocalVariant(payload.gridId, localVariant);
      return stored.find((item) => item.id === localVariant.id) ?? localVariant;
    }
  }
  try {
    const response = await api.post<VariantDto>(VARIANTS_BASE_URL, payload, {
      headers: getJsonHeaders(),
    });
    const created = response.data as VariantDto;
    const normalized: GridVariant = mapVariantDtoToGridVariant(created);
    upsertLocalVariant(payload.gridId, normalized);
    return normalized;
  } catch (error) {
    console.warn('Sunucuya varyant kaydedilemedi, yerel olarak saklanıyor.', error);
    const localVariant = makeLocalVariant(payload.gridId, payload);
    const stored = upsertLocalVariant(payload.gridId, localVariant);
    return stored.find((item) => item.id === localVariant.id) ?? localVariant;
  }
};

export const updateGridVariant = async (payload: UpdateGridVariantPayload): Promise<GridVariant> => {
  const { id, ...body } = payload;
  try {
    const response = await api.put<VariantDto>(
      `${VARIANTS_BASE_URL}/${encodeURIComponent(id)}`,
      body,
      { headers: getJsonHeaders() },
    );
    const updated = response.data as VariantDto;
    const normalized: GridVariant = mapVariantDtoToGridVariant(updated);
    upsertLocalVariant(normalized.gridId, normalized);
    return normalized;
  } catch (error) {
    console.warn('Sunucuya varyant güncellemesi yapılamadı, yerel veriler güncelleniyor.', error);
    const lookupGridId = payload.gridId
      ?? (() => {
        const all = hasBrowserEnv() ? window.localStorage.getItem(LOCAL_STORAGE_NAMESPACE) : null;
        if (!all) return undefined;
        try {
          const parsed = JSON.parse(all) as PersistedVariantsState;
          return Object.entries(parsed).find(([, list]) => list.some((variant) => variant.id === id))?.[0];
        } catch {
          return undefined;
        }
      })();
    if (!lookupGridId) {
      throw error;
    }
    const current = readLocalVariants(lookupGridId);
    const target = current.find((variant) => variant.id === id);
    if (!target) {
      throw error;
    }
    const merged = makeLocalVariant(lookupGridId, payload, target);
    const stored = upsertLocalVariant(lookupGridId, merged);
    return stored.find((item) => item.id === merged.id) ?? merged;
  }
};

export const cloneGridVariant = async (payload: CloneGridVariantPayload): Promise<GridVariant> => {
  const { variantId, ...body } = payload;
  try {
    const response = await api.post<VariantDto>(
      `${VARIANTS_BASE_URL}/${encodeURIComponent(variantId)}/clone`,
      body,
      { headers: getJsonHeaders() },
    );
    const cloned = response.data as VariantDto;
    const normalized: GridVariant = {
      ...mapVariantDtoToGridVariant(cloned),
      isGlobal: false,
      isGlobalDefault: false,
    };
    upsertLocalVariant(normalized.gridId, normalized);
    return normalized;
  } catch (error) {
    console.warn('Global varyant kişisel kopyaya dönüştürülemedi.', error);
    throw error;
  }
};

export const updateVariantPreference = async (payload: UpdateVariantPreferencePayload): Promise<GridVariant> => {
  const { variantId, ...body } = payload;
  const fallbackUpdate = (): GridVariant => {
    const gridId = payload.gridId ?? 'unknown-grid';
    const current = readLocalVariants(gridId);
    const updated = current.map((variant) => ({
      ...variant,
      isUserDefault: Boolean(body.isDefault && variant.id === variantId),
    }));
    writeLocalVariants(gridId, updated);
    const target = updated.find((v) => v.id === variantId);
    return target ?? makeLocalVariant(gridId, { id: variantId, ...body } as UpdateGridVariantPayload);
  };
  const enforceSingleUserDefault = (gridId: string, target: GridVariant): GridVariant[] => {
    const raw = hasBrowserEnv() ? window.localStorage.getItem(LOCAL_STORAGE_NAMESPACE) : null;
    const parsed: PersistedVariantsState = raw ? (JSON.parse(raw) as PersistedVariantsState) : {};
    const existing = Array.isArray(parsed[gridId]) ? (parsed[gridId] as GridVariant[]) : readLocalVariants(gridId);

    const merged = existing.map((variant) =>
      variant.id === target.id
        ? {
            ...variant,
            ...target,
            isUserDefault: target.isUserDefault,
            isUserSelected: target.isUserSelected,
            isDefault: target.isDefault,
          }
        : { ...variant, isUserDefault: false, isUserSelected: false, isDefault: false },
    );

    if (!merged.some((v) => v.id === target.id)) {
      merged.push({ ...target, isUserSelected: target.isUserSelected, isUserDefault: target.isUserDefault });
    }

    parsed[gridId] = merged;
    // grid bazında tek userDefault kalacak şekilde yaz
    if (hasBrowserEnv()) {
      window.localStorage.setItem(LOCAL_STORAGE_NAMESPACE, JSON.stringify(parsed));
    }
    return merged;
  };
  if (typeof fetch === 'function') {
    try {
      const res = await fetch(`${FETCH_BASE_URL}${VARIANTS_BASE_URL}/${encodeURIComponent(variantId)}/preference`, {
        method: 'PATCH',
        headers: getJsonHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`fetch error ${res.status}`);
      }
      const updated = (await res.json()) as VariantDto;
      const normalized: GridVariant = mapVariantDtoToGridVariant(updated);
      const gridKey = payload.gridId ?? normalized.gridId ?? findGridIdByVariant(variantId) ?? 'unknown-grid';
      const merged = enforceSingleUserDefault(gridKey, normalized);
      writeLocalVariants(gridKey, merged);
      writeLocalPreference(gridKey, {
        defaultVariantId: normalized.isUserDefault ? normalized.id : undefined,
        selectedVariantId: normalized.isUserSelected ? normalized.id : undefined,
      });
      return normalized;
    } catch (error) {
      console.warn('Varyant tercih güncellemesi yapılamadı, yerel tercih kullanılacak.', error);
      return fallbackUpdate();
    }
  }
  try {
    const response = await api.patch<VariantDto>(
      `${VARIANTS_BASE_URL}/${encodeURIComponent(variantId)}/preference`,
      body,
      { headers: getJsonHeaders() },
    );
    const updated = response.data as VariantDto;
    const normalized: GridVariant = mapVariantDtoToGridVariant(updated);
    const gridKey = payload.gridId ?? normalized.gridId ?? findGridIdByVariant(variantId) ?? 'unknown-grid';
    const merged = enforceSingleUserDefault(gridKey, normalized);
    writeLocalVariants(gridKey, merged);
    const nextPreference: PersistedVariantPreference | undefined =
      normalized.isUserDefault || normalized.isUserSelected
        ? {
            defaultVariantId: normalized.isUserDefault ? normalized.id : undefined,
            selectedVariantId: normalized.isUserSelected ? normalized.id : undefined,
          }
        : undefined;
    writeLocalPreference(gridKey, nextPreference);
    return normalized;
  } catch (error) {
    console.warn('Varyant tercih güncellemesi yapılamadı, yerel tercih kullanılacak.', error);
    return fallbackUpdate();
  }
};

export const deleteGridVariant = async (id: string): Promise<void> => {
  try {
    await api.delete(`${VARIANTS_BASE_URL}/${encodeURIComponent(id)}`, {
      headers: getAuthHeaders(),
    });
    // server success, also cleanup locally
    if (hasBrowserEnv()) {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_NAMESPACE);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedVariantsState;
        Object.keys(parsed).forEach((gridId) => {
          parsed[gridId] = parsed[gridId].filter((variant) => variant.id !== id);
        });
        window.localStorage.setItem(LOCAL_STORAGE_NAMESPACE, JSON.stringify(parsed));
      }
    }
    purgeLocalPreferenceByVariant(id);
  } catch (error) {
    console.warn('Sunucuya varyant silme isteği ulaştırılamadı, yerelden siliniyor.', error);
    if (!hasBrowserEnv()) {
      throw error;
    }
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_NAMESPACE);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistedVariantsState;
      let dirty = false;
      Object.keys(parsed).forEach((gridId) => {
        const next = parsed[gridId].filter((variant) => variant.id !== id);
        if (next.length !== parsed[gridId].length) {
          parsed[gridId] = next;
          dirty = true;
        }
      });
      if (dirty) {
        window.localStorage.setItem(LOCAL_STORAGE_NAMESPACE, JSON.stringify(parsed));
      }
    } catch (storageError) {
      console.warn('Yerel varyant silme işlemi başarısız', storageError);
    }
    purgeLocalPreferenceByVariant(id);
  }
};
