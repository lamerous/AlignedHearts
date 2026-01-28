import { BASE_URL } from '@/core/constants/api';
import type { RequestOptions } from '@/core/types/api.types';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers } = options;
  const url = `${BASE_URL}${endpoint}`;

  console.log(`Запрос на: ${url}`, { method, body });

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    console.log(`Ответ от ${endpoint}:`, data);

    if (!response.ok) {
      const errorMsg = Array.isArray(data.detail)
        ? data.detail[0]?.msg
        : data.detail || `Ошибка ${response.status}`;
      throw new Error(errorMsg);
    }

    return data as T;
  } catch (err) {
    console.error(`Ошибка fetch [${endpoint}]:`, err);

    throw err;
  }
}
