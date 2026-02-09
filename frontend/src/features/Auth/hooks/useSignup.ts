import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { UseFormSetError } from 'react-hook-form';
import { apiFetch } from '@/core/api/apiFetch';
import { API_ROUTES } from '@/core/api/endpoints';

import type { SignupFormValues } from '../types/schemas.types';

export const useSignup = (setError: UseFormSetError<SignupFormValues>) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: SignupFormValues) => {
      const { confirmPassword, ...sendData } = values;
      void confirmPassword;
      return apiFetch(API_ROUTES.auth.register, {
        method: 'POST',
        body: sendData,
      });
    },
    onSuccess: () => {
      localStorage.setItem('logged_in', 'true');
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      navigate({ to: '/profile/me' });
    },
    onError: (error: Error) => {
      const msg = error.message;
      if (msg.includes('username') || msg.includes('occupied')) {
        setError('username', { type: 'manual', message: 'Имя уже занято' });
      } else if (msg.includes('email') || msg.includes('registered')) {
        setError('email', {
          type: 'manual',
          message: 'Email уже используется',
        });
      } else {
        setError('username', {
          type: 'manual',
          message: msg || 'Ошибка регистрации',
        });
      }
    },
  });
};
