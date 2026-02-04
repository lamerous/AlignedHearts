import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { UseFormSetError } from 'react-hook-form';
import { apiFetch } from '@/core/api/apiFetch';

import type { SignupFormValues } from '../types/schemas.types';

export const useSignup = (setError: UseFormSetError<SignupFormValues>) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: SignupFormValues) => {
      const { confirmPassword, ...sendData } = values;
      void confirmPassword;

      return apiFetch<{ access_token: string }>('/auth/register', {
        method: 'POST',
        body: sendData,
      });
    },
    onSuccess: result => {
      localStorage.setItem('auth_token', result.access_token);
      queryClient.clear();
      navigate({ to: '/profile/me' });
    },
    onError: (error: Error) => {
      const message = error.message || '';

      if (message.includes('500') || message.includes('already occupied')) {
        setError('username', {
          type: 'manual',
          message: 'Имя пользователя уже занято',
        });
      } else if (message.includes('Email already registered')) {
        setError('email', {
          type: 'manual',
          message: 'Этот Email уже используется',
        });
      } else {
        setError('username', {
          type: 'manual',
          message: message || 'Ошибка регистрации',
        });
      }
    },
  });
};
