import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { UseFormSetError } from 'react-hook-form';
import { apiFetch } from '@/core/api/apiFetch';
import { API_ROUTES } from '@/core/api/endpoints';

import type { LoginFormValues } from '../types/schemas.types';

export const useLogin = (setError: UseFormSetError<LoginFormValues>) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormValues) =>
      apiFetch(API_ROUTES.auth.login, {
        method: 'POST',
        body: data,
      }),
    onSuccess: () => {
      localStorage.setItem('logged_in', 'true');
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      navigate({ to: '/profile/me' });
    },
    onError: (error: Error) => {
      const msg = error.message;
      if (msg.includes('401') || msg.toLowerCase().includes('credentials')) {
        setError('email', {
          type: 'manual',
          message: 'Неверная почта или пароль',
        });
      } else {
        setError('email', { type: 'manual', message: msg || 'Ошибка входа' });
      }
    },
  });
};
