import { BASE_URL } from '@/core/constants/api';
import type { RequestOptions } from '@/core/types/api.types';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions & { params?: Record<string, string | number> } = {},
): Promise<T> {
  const { method = 'GET', body, headers, params } = options;

  const url = new URL(`${BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const config: RequestInit = {
    method,
    headers: { ...headers },
    credentials: 'include',
  };

  if (body instanceof FormData) {
    config.body = body;
  } else if (body) {
    config.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), config);

  if (response.status === 204 || endpoint.includes('logout')) {
    return {} as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = Array.isArray(data.detail)
      ? data.detail[0]?.msg
      : data.detail || `Ошибка ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}
