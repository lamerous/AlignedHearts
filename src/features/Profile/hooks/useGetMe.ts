import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/core/api/apiFetch';

import type { UserProfile } from '../types/profile.types';

export const useGetMe = () => {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => apiFetch<UserProfile>('/profile/me'),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });
};
