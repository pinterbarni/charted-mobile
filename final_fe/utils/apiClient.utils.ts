import { API_URL } from '@/constants/api.constants';
import { refreshTokens } from '@/services/keycloakService';
import { useAuthStore } from '@/stores/authStore';
import { useErrorStore } from '@/stores/errorStore';

const getHeaders = () => {
  const token = useAuthStore.getState().getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseResponse = async (response: Response): Promise<any> => {
  if (response.status === 204 || response.status === 304 || response.headers.get('content-length') === '0')
    return;

  const text = await response.text();
  if (!text) return;
  const data = JSON.parse(text);

  if (response.status >= 500) {
    useErrorStore.getState().setError('server');
    throw new Error(data.message ?? 'Server error');
  }

  if (!response.ok) throw new Error(data.message ?? 'Request failed');
  return data;
};

const fetchWithRefresh = async (endpoint: string, options: RequestInit, silent = false): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: getHeaders(),
      cache: 'no-store',
    });
    // console.log(endpoint, response.status, response.ok);

    if (response.status === 401) {
      const refreshToken = useAuthStore.getState().tokens?.refreshToken;
      if (!refreshToken) {
        await useAuthStore.getState().signOut();
        useErrorStore.getState().setError('unauthorized');
        throw new Error('No refresh token available');
      }

      try {
        const newTokens = await refreshTokens(refreshToken);
        await useAuthStore.getState().signIn(newTokens);

        const retryResponse = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers: getHeaders(),
          cache: 'no-store',
        });
        // console.log('retry', endpoint, retryResponse.status, retryResponse.ok);
        return parseResponse(retryResponse);
      } catch (e) {
        const isNetworkError = e instanceof TypeError && e.message === 'Network request failed';
        if (isNetworkError) {
          if (!silent) useErrorStore.getState().setError('network');
          throw e;
        }
        await useAuthStore.getState().signOut();
        useErrorStore.getState().setError('unauthorized');
        throw new Error('Session expired');
      }
    }

    return parseResponse(response);
  } catch (e) {
    const isNetworkError = e instanceof TypeError && e.message === 'Network request failed';
    if (isNetworkError && !silent) {
      useErrorStore.getState().setError('network');
    }
    console.error('!!@!! apiClient err', endpoint, e, JSON.stringify(e));
    throw e;
  }
};

export const apiClient = {
  get: (endpoint: string, silent = false) => fetchWithRefresh(endpoint, { method: 'GET' }, silent),
  post: (endpoint: string, body: object, silent = false) =>
    fetchWithRefresh(endpoint, { method: 'POST', body: JSON.stringify(body) }, silent),
  patch: (endpoint: string, body: object, silent = false) =>
    fetchWithRefresh(endpoint, { method: 'PATCH', body: JSON.stringify(body) }, silent),
  delete: (endpoint: string, silent = false) => fetchWithRefresh(endpoint, { method: 'DELETE' }, silent),
};
