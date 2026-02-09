import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { apiFetch } from '@/core/api/apiFetch';
import { API_ROUTES } from '@/core/api/endpoints';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiFetch(API_ROUTES.auth.logout, { method: 'GET' }),
    onSuccess: () => {
      localStorage.removeItem('is_auth');
      queryClient.clear();
      navigate({ to: '/' });
    },
  });
};
