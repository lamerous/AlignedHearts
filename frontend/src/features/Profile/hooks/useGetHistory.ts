import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/core/api/apiFetch';
import { API_ROUTES } from '@/core/api/endpoints';

import type { HistoryItem } from '../types/profile.types';

export const useGetHistory = () => {
  return useQuery({
    queryKey: ['profile', 'history'],
    queryFn: () => apiFetch<HistoryItem[]>(API_ROUTES.profile.history),
    staleTime: 0,
  });
};
