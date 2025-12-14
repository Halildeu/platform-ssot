import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { api } from '@mfe/shared-http';
import { UserProfile } from '@mfe/shared-types'; // Paylaşılan UserProfile tipini import ediyoruz

type UniversalGlobal = typeof globalThis & { Buffer?: typeof Buffer };

const getUniversalGlobal = (): UniversalGlobal | undefined => {
  if (typeof globalThis !== 'undefined') {
    return globalThis as UniversalGlobal;
  }
  if (typeof window !== 'undefined') {
    return window as unknown as UniversalGlobal;
  }
  if (typeof self !== 'undefined') {
    return self as unknown as UniversalGlobal;
  }
  return undefined;
};

export const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const segments = token.split('.');
    if (segments.length < 2) {
      return null;
    }
    const normalized = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + (4 - (normalized.length % 4 || 4)) % 4, '=');
    let decoded: string | null = null;
    const globalScope = getUniversalGlobal();
    if (globalScope && typeof globalScope.atob === 'function') {
      decoded = globalScope.atob(padded);
    } else if (globalScope?.Buffer) {
      decoded = globalScope.Buffer.from(padded, 'base64').toString('utf-8');
    }
    if (!decoded) {
      return null;
    }
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

// State'imizin yapısını tanımlayan arayüz
interface AuthState {
  user: UserProfile | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  registrationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  lastRegisteredEmail: string | null;
  expiresAt: number | null;
  initialized: boolean;
}

type KeycloakSessionPayload = {
  token: string | null;
  profile?: Partial<UserProfile>;
  expiresAt?: number | null;
};

// Persist helpers (yalın, localStorage yoksa gracefully düşer)
const loadPersistedAuth = (): Pick<AuthState, 'user' | 'token' | 'expiresAt'> => {
  if (typeof window === 'undefined') {
    return { user: null, token: null, expiresAt: null };
  }
  try {
    const token = window.localStorage.getItem('token');
    const expiresAtRaw = window.localStorage.getItem('tokenExpiresAt');
    const expiresAt = expiresAtRaw ? Number(expiresAtRaw) : null;
    const userRaw = window.localStorage.getItem('user');
    const user = userRaw ? (JSON.parse(userRaw) as UserProfile) : null;
    return { token, user, expiresAt: Number.isFinite(expiresAt) ? expiresAt : null };
  } catch {
    return { user: null, token: null, expiresAt: null };
  }
};

const initialPersisted = loadPersistedAuth();

// Başlangıç state'i
const initialState: AuthState = {
  user: initialPersisted.user,
  token: initialPersisted.token,
  status: 'idle',
  error: null,
  registrationStatus: 'idle',
  lastRegisteredEmail: null,
  expiresAt: initialPersisted.expiresAt,
  initialized: false,
};

// Login olmak için asenkron thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', loginData);
      const data = response.data as { token: string; email?: string };

      interface RemoteProfile extends UserProfile {
        name?: string;
        firstName?: string;
        lastName?: string;
        lastLogin?: string;
        sessionTimeoutMinutes?: number;
      }
      let profile: RemoteProfile | null = null;
      if (data?.email) {
        try {
          const profileResponse = await api.get(
            `/users/by-email/${encodeURIComponent(data.email)}`,
            {
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
            },
          );
          profile = profileResponse.data as RemoteProfile;
        } catch (profileError) {
          console.warn('Kullanıcı profili alınamadı:', profileError);
        }
      }

      return { ...data, profile };
    } catch (error) {
      if (isAxiosError(error)) {
        const payload = error.response?.data as { message?: string };
        return rejectWithValue(payload?.message || 'Giriş başarısız oldu');
      }
      return rejectWithValue('Bir ağ hatası oluştu. Backend sunucunuzun çalıştığından emin olun.');
    }
  }
);

// Yeni kullanıcı kaydı için asenkron thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/public/register', userData);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const payload = error.response?.data as { message?: string };
        return rejectWithValue(payload?.message || 'Kayıt başarısız oldu.');
      }
      return rejectWithValue('Bir ağ hatası oluştu. Backend sunucunuzun çalıştığından emin olun.');
    }
  }
);

// Auth slice'ını oluşturuyoruz
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout action'ı
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.registrationStatus = 'idle';
      state.error = null;
      state.lastRegisteredEmail = null;
      state.expiresAt = null;
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('user');
          window.localStorage.removeItem('tokenExpiresAt');
        } catch {
          // ignore
        }
      }
    },
    // Kayıt durumunu sıfırlamak için yeni reducer
    resetRegistrationStatus: (state) => {
      state.registrationStatus = 'idle';
      state.error = null;
      state.lastRegisteredEmail = null;
    },
    setKeycloakSession: (state, action: PayloadAction<KeycloakSessionPayload>) => {
      const { token: incomingToken, profile, expiresAt } = action.payload;
      state.token = incomingToken;
      state.expiresAt = expiresAt ?? null;
      if (incomingToken) {
        const persistedUser = profile
          ? { ...(state.user ?? {}), ...profile, email: profile.email ?? state.user?.email ?? '' }
          : state.user;
        state.user = persistedUser ?? null;
        state.status = 'succeeded';
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem('token', incomingToken);
            window.localStorage.setItem('user', JSON.stringify(state.user ?? {}));
            if (state.expiresAt) {
              window.localStorage.setItem('tokenExpiresAt', String(state.expiresAt));
            } else {
              window.localStorage.removeItem('tokenExpiresAt');
            }
          } catch {
            // ignore
          }
        }
      } else {
        state.user = null;
        state.status = 'idle';
        state.expiresAt = null;
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('user');
            window.localStorage.removeItem('tokenExpiresAt');
          } catch {
            // ignore
          }
        }
      }
    },
    setAuthInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
  },
  // Asenkron thunk'ların durumlarını yöneten bölüm
  extraReducers: (builder) => {
    builder
      // Login durumları
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        const profile = action.payload.profile ?? null;
        const tokenClaims = typeof action.payload.token === 'string' ? decodeJwtPayload(action.payload.token) : null;
        const tokenClaimsRecord = tokenClaims && typeof tokenClaims === 'object' ? tokenClaims as Record<string, unknown> : null;
        const tokenUserId = tokenClaimsRecord && typeof tokenClaimsRecord['userId'] !== 'undefined' ? tokenClaimsRecord['userId'] : undefined;
        const tokenSessionTimeout = tokenClaimsRecord && typeof tokenClaimsRecord['sessionTimeoutMinutes'] === 'number'
          ? tokenClaimsRecord['sessionTimeoutMinutes'] as number
          : undefined;
        const permissionsFromToken = tokenClaimsRecord && Array.isArray(tokenClaimsRecord['permissions'])
          ? tokenClaimsRecord['permissions'] as unknown[]
          : [];
        const roleFromToken = tokenClaimsRecord && typeof tokenClaimsRecord['role'] === 'string'
          ? String(tokenClaimsRecord['role'])
          : undefined;
        const inferredUserId = profile?.id
          ?? (typeof tokenUserId === 'number' || typeof tokenUserId === 'string' ? tokenUserId : undefined)
          ?? (action.payload as Record<string, unknown>).userId
          ?? (action.payload as Record<string, unknown>).id;
        const profileFullName = profile?.fullName
          ?? profile?.name
          ?? [profile?.firstName, profile?.lastName].filter((part: string | undefined) => part && part.trim().length > 0).join(' ').trim();
        const displayName = profileFullName && profileFullName.length > 0
          ? profileFullName
          : action.payload.email?.split('@')[0] ?? undefined;
        const lastLoginAt = profile?.lastLoginAt ?? profile?.lastLogin ?? undefined;
        const sessionTimeoutMinutes = profile?.sessionTimeoutMinutes
          ?? tokenSessionTimeout
          ?? action.payload.sessionTimeoutMinutes
          ?? undefined;
        const normalizedPermissions = Array.isArray(action.payload.permissions)
          ? action.payload.permissions
          : permissionsFromToken;

        const normalizedUser: UserProfile = {
          id: inferredUserId !== undefined && inferredUserId !== null ? String(inferredUserId) : undefined,
          email: action.payload.email,
          role: action.payload.role ?? roleFromToken ?? undefined,
          permissions: normalizedPermissions.map((permission) => String(permission)),
          displayName,
          fullName: profileFullName ?? undefined,
          lastLoginAt,
          sessionTimeoutMinutes,
        };
        state.user = normalizedUser;
        state.expiresAt = typeof action.payload.expiresAt === 'number' ? action.payload.expiresAt : null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Register durumları
      .addCase(registerUser.pending, (state) => {
        state.registrationStatus = 'loading';
        state.error = null;
        state.lastRegisteredEmail = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registrationStatus = 'succeeded';
        state.lastRegisteredEmail =
          (action.payload as { email?: string } | undefined)?.email ?? null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout, resetRegistrationStatus, setKeycloakSession, setAuthInitialized } = authSlice.actions;
export default authSlice.reducer;
