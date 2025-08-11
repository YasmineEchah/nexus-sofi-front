// Centralized API client for SofiSoft backend
// Note: Update the base URL in Profile page or set localStorage key "API_BASE_URL" if needed.

export type HttpMethod = 'GET' | 'POST';

let API_BASE_URL = (typeof window !== 'undefined' && localStorage.getItem('API_BASE_URL')) || 'http://localhost:8080';

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = url.replace(/\/$/, '');
  if (typeof window !== 'undefined') localStorage.setItem('API_BASE_URL', API_BASE_URL);
};

function getAuthToken() {
  if (typeof window === 'undefined') return undefined;
  try {
    const stored = localStorage.getItem('AUTH');
    if (!stored) return undefined;
    const parsed = JSON.parse(stored);
    return parsed?.token as string | undefined;
  } catch {
    return undefined;
  }
}

async function request<T>(path: string, method: HttpMethod, body?: any, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers || {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${method} ${path} failed: ${res.status} ${res.statusText} ${text}`);
  }
  // Try JSON, fallback to text
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json() as Promise<T>;
  return (await res.text()) as unknown as T;
}

// Specific API wrappers based on README endpoints
export const api = {
  // Auth
  login: (payload: { login: string; password: string }) => request<any>('/Login', 'POST', payload),

  // Dashboard & stats
  dashboardMagasins: (params?: { magasinId?: string | number; dateStart?: string; dateEnd?: string }) => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== '') as [string, string][]
      )
    ).toString();
    return request<any>(`/dashboardMagasins${qs ? `?${qs}` : ''}`, 'GET');
  },
  evolutionCA: (params: { magasinId?: string | number; dateStart: string; dateEnd: string }) => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== '') as [string, string][]
      )
    ).toString();
    return request<any>(`/evolutionCA${qs ? `?${qs}` : ''}`, 'GET');
  },
  getInfosByDate: (payload: { magasinId?: string | number; dateStart: string; dateEnd: string }) =>
    request<any>('/getInfosByDate', 'POST', payload),
  getInfosDay: (payload: { magasinId?: string | number; date: string }) => request<any>('/getInfosDay', 'POST', payload),

  // Magasins
  getMagasins: () => request<any>('/getMagasins', 'POST', {}),
  getMagasinsInfos: (payload: { dateStart: string; dateEnd: string }) => request<any>('/getMagasinsInfos', 'POST', payload),
  getMagasinsInfoByDate: (payload: { dateStart?: string; dateEnd?: string }) =>
    request<any>('/getMagasinsInfoByDate', 'POST', payload),

  // Comparaison
  compareMagasins: (payload: { magasinIds: (string | number)[]; dateStart: string; dateEnd: string }) =>
    request<any>('/compareMagasins', 'POST', payload),
  getComparePeriode: (payload: { magasinId: string | number; start1: string; end1: string; start2: string; end2: string }) =>
    request<any>('/getComparePeriode', 'POST', payload),

  // Ventes & produits
  bestSalesPrds: (payload: { magasinId: string | number; dateStart: string; dateEnd: string; limit?: number }) =>
    request<any>('/bestSalesPrds', 'POST', payload),
  getPrdsVendus: (payload: { magasinId: string | number; dateStart: string; dateEnd: string }) =>
    request<any>('/getPrdsVendus', 'POST', payload),
  getLineVentes: (payload: { magasinId: string | number; mouvementId: string | number }) =>
    request<any>('/getLineVentes', 'POST', payload),
  getDimsPrdVendus: (payload: { magasinId: string | number; productCode: string; dateStart: string; dateEnd: string }) =>
    request<any>('/getDimsPrdVendus', 'POST', payload),

  // Stock
  getDims: (payload: { barcode: string }) => request<any>('/getDims', 'POST', payload),
  stockByProduct: (payload: { magasinId?: string | number; productCode?: string; barcode?: string; dims?: string }) =>
    request<any>('/StockByProduct', 'POST', payload),
  globalStock: (payload: { filter?: 'ALL' | 'ZERO' | 'GT_ZERO' | 'LT_ZERO' }) =>
    request<any>('/GlobalStock', 'POST', payload),

  // Paramètres
  getParam: (payload: { module: string }) => request<any>('/getParam', 'POST', payload),
};

export { API_BASE_URL };
