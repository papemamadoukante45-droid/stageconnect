// ============================================================================
// StageConnect Sénégal — Client HTTP centralisé
// Communique avec le backend Django REST Framework.
// Gère: JWT, refresh token automatique, headers, erreurs.
// ============================================================================

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const TOKEN_KEY = 'sc_access_token';
export const REFRESH_KEY = 'sc_refresh_token';

export class ApiRequestError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
  }
}

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = localStorage.getItem(REFRESH_KEY);
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.access);
    return true;
  } catch {
    return false;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | undefined>;
  _retry?: boolean;
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  if (USE_MOCK) {
    const { mockRequest } = await import('@/api/mock');
    return mockRequest<T>(path, opts);
  }

  const { method = 'GET', body, params, _retry } = opts;
  let url = `${API_URL}${path}`;
  if (params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') search.append(k, String(v));
    });
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !_retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(path, { ...opts, _retry: true });
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    throw new ApiRequestError('Session expirée. Veuillez vous reconnecter.', 401, 'unauthorized');
  }

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    let code: string | undefined;
    try {
      const errData = await res.json();
      message = errData.detail || errData.message || errData.non_field_errors?.[0] || message;
      code = errData.code;
    } catch {
      // ignore JSON parse errors
    }
    throw new ApiRequestError(message, res.status, code);
  }

  return res.json() as Promise<T>;
}

export const api = { request };
