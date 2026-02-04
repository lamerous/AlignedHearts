import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/core/api/apiFetch';

import type { HistoryItem } from '../types/profile.types';

export const useGetHistory = () => {
  return useQuery({
    queryKey: ['profile', 'history'],
    queryFn: () => apiFetch<HistoryItem[]>('/profile/history'),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });
};
