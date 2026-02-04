import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { apiFetch } from '@/core/api/apiFetch';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiFetch('/auth/logout'),
    onSettled: () => {
      localStorage.removeItem('auth_token');
      queryClient.clear();
      navigate({ to: '/' });
    },
  });
};
