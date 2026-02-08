import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/core/api/apiFetch';
import { API_ROUTES } from '@/core/api/endpoints';

import type { UserProfile } from '../types/profile.types';

export const useGetMe = () => {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => apiFetch<UserProfile>(API_ROUTES.profile.me),
    staleTime: 1000 * 60 * 5,
  });
};
