import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { apiFetch } from '@/core/api/apiFetch';
import { Button } from '@/core/ui/button';
import { Card, CardContent } from '@/core/ui/card';
import { Input } from '@/core/ui/input';

import googleIcon from '../assets/img/googleIcon.svg';
import { loginSchema } from '../constants/schemas';
import type { LoginFormValues } from '../types/schemas.types';

export const LoginForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = useCallback(
    async (data: LoginFormValues) => {
      try {
        const result = await apiFetch<{ access_token: string }>('/auth/login', {
          method: 'POST',
          body: data,
        });
        localStorage.setItem('auth_token', result.access_token);
        navigate({ to: '/profile' });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Ошибка входа';
        setError('email', { type: 'manual', message });
      }
    },
    [navigate, setError],
  );

  return (
    <Card className="flex flex-col items-center rounded-4xl border-none bg-[rgba(255,240,250,0.58)] px-20 py-10 shadow-2xl backdrop-blur-md">
      <CardContent className="flex w-full flex-col items-center p-0">
        <h1 className="font-days mb-12 text-[40px] text-[#F61064]">Вход</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-2"
        >
          <div className="relative pb-5">
            <Input
              {...register('email')}
              placeholder="Почта"
              className={`h-10 w-full rounded-2xl border-none bg-white/58 px-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${errors.email ? 'ring-2 ring-red-500' : ''}`}
            />
            {errors.email && (
              <span className="absolute bottom-0 left-2 text-[12px] leading-4 text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="relative pb-5">
            <Input
              {...register('password')}
              type="password"
              placeholder="Пароль"
              className={`h-10 w-full rounded-2xl border-none bg-white/58 px-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${errors.password ? 'ring-2 ring-red-500' : ''}`}
            />
            {errors.password && (
              <span className="absolute bottom-0 left-2 text-[12px] leading-4 text-red-600">
                {errors.password.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mb-2 h-14 w-full cursor-pointer rounded-4xl bg-[#F61064] text-[20px] font-medium text-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-colors duration-300 hover:bg-black"
          >
            {isSubmitting ? 'Загрузка...' : 'Войти'}
          </Button>

          <Button
            type="button"
            onClick={() =>
              (window.location.href =
                'https://alignedhearts.ru/api/auth/google/login')
            }
            className="h-14 w-full cursor-pointer rounded-4xl bg-white/96 text-[20px] font-medium text-[#7F7F7F] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-colors duration-300 hover:bg-white/96 hover:text-[#F61064]"
          >
            <img
              src={googleIcon}
              alt="Google"
              className="mr-4 inline h-6 w-6"
            />
            Войти через Google
          </Button>
        </form>

        <div className="mt-12">
          Ещё не зарегистрированы?{' '}
          <Link
            to="/auth/signup"
            className="font-bold text-[#F61064] hover:underline"
          >
            Зарегистрироваться
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
