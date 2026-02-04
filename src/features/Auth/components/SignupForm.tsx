import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { Button } from '@/core/ui/button';
import { Card, CardContent } from '@/core/ui/card';
import { Input } from '@/core/ui/input';

import googleIcon from '../assets/img/googleIcon.svg';
import { signupSchema } from '../constants/authSchemas';
import { useSignup } from '../hooks/useSignup';
import type { SignupFormValues } from '../types/schemas.types';

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { sex: 'male' },
  });

  const { mutate, isPending } = useSignup(setError);

  return (
    <Card className="flex w-full max-w-136 flex-col items-center rounded-4xl border-none bg-[rgba(255,240,250,0.58)] px-20 py-10 shadow-2xl backdrop-blur-md">
      <CardContent className="flex w-full flex-col items-center p-0">
        <h1 className="font-days mb-12 text-[40px] text-[#F61064]">
          Регистрация
        </h1>

        <form
          onSubmit={handleSubmit(data => mutate(data))}
          className="flex w-full flex-col gap-2"
        >
          <div className="relative pb-5">
            <Input
              {...register('username')}
              placeholder="Логин"
              className={`h-10 w-full rounded-2xl border-none bg-white/58 px-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#F61064] ${errors.username ? 'ring-2 ring-red-500' : ''}`}
            />
            {errors.username && (
              <span className="absolute bottom-0 left-2 text-[12px] text-red-600">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="relative pb-5">
            <Input
              {...register('email')}
              placeholder="Почта"
              className={`h-10 w-full rounded-2xl border-none bg-white/58 px-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#F61064] ${errors.email ? 'ring-2 ring-red-500' : ''}`}
            />
            {errors.email && (
              <span className="absolute bottom-0 left-2 text-[12px] text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="relative pb-5">
            <Input
              {...register('password')}
              type="password"
              placeholder="Пароль"
              className={`h-10 w-full rounded-2xl border-none bg-white/58 px-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#F61064] ${errors.password ? 'ring-2 ring-red-500' : ''}`}
            />
            {errors.password && (
              <span className="absolute bottom-0 left-2 text-[12px] text-red-600">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="relative pb-5">
            <Input
              {...register('confirmPassword')}
              type="password"
              placeholder="Повторите пароль"
              className={`h-10 w-full rounded-2xl border-none bg-white/58 px-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#F61064] ${errors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}
            />
            {errors.confirmPassword && (
              <span className="absolute bottom-0 left-2 text-[12px] text-red-600">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="relative flex gap-6 px-2 pb-5">
            <label className="flex cursor-pointer items-center gap-2 text-[15px] text-gray-700">
              <input
                type="radio"
                value="male"
                {...register('sex')}
                className="h-4 w-4 accent-[#F61064]"
              />
              Мужчина
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-[15px] text-gray-700">
              <input
                type="radio"
                value="female"
                {...register('sex')}
                className="h-4 w-4 accent-[#F61064]"
              />
              Женщина
            </label>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="mb-2 h-14 w-full cursor-pointer rounded-4xl bg-[#F61064] text-[20px] font-medium text-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-black"
          >
            {isPending ? 'Загрузка...' : 'Зарегистрироваться'}
          </Button>

          <Button
            type="button"
            onClick={() =>
              (window.location.href =
                'https://alignedhearts.ru/api/auth/google/login')
            }
            className="h-14 w-full cursor-pointer rounded-4xl bg-white/96 text-[20px] font-medium text-[#7F7F7F] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-colors hover:text-[#F61064]"
          >
            <img
              src={googleIcon}
              alt="Google"
              className="mr-4 inline h-6 w-6"
            />
            Регистрация через Google
          </Button>
        </form>

        <div className="mt-12">
          Уже есть аккаунт?{' '}
          <Link
            to="/auth/login"
            className="font-bold text-[#F61064] hover:underline"
          >
            Войти
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
