import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { UseFormSetError } from 'react-hook-form';
import { apiFetch } from '@/core/api/apiFetch';

import type { LoginFormValues } from '../types/schemas.types';

export const useLogin = (setError: UseFormSetError<LoginFormValues>) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormValues) =>
      apiFetch<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: data,
      }),
    onSuccess: result => {
      localStorage.setItem('auth_token', result.access_token);
      queryClient.clear();
      navigate({ to: '/profile/me' });
    },
    onError: (error: Error) => {
      const message = error.message || '';

      if (message.includes('Invalid credentials')) {
        setError('email', {
          type: 'manual',
          message: 'Неверная почта или пароль',
        });
      } else {
        setError('email', {
          type: 'manual',
          message: 'Ошибка сервера. Попробуйте позже.',
        });
      }
    },
  });
};
