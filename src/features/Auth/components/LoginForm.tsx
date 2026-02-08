import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { GOOGLE_LOGIN_URL } from '@/core/constants/api';
import { Button } from '@/core/ui/button';
import { Card, CardContent } from '@/core/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/core/ui/form';
import { Input } from '@/core/ui/input';

import googleIcon from '../assets/img/googleIcon.svg';
import { loginSchema } from '../constants/authSchemas';
import { useLogin } from '../hooks/useLogin';
import type { LoginFormValues } from '../types/schemas.types';

export const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending } = useLogin(form.setError);

  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <Card className="flex flex-col items-center rounded-4xl border-none bg-[rgba(255,240,250,0.58)] px-20 py-10 shadow-2xl backdrop-blur-md">
      <CardContent className="flex w-full flex-col items-center p-0">
        <h1 className="font-days mb-12 text-[40px] text-[#F61064]">Вход</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-2"
          >
            {/* Поле Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative space-y-0 pb-5">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Почта"
                      className="h-10 w-full rounded-2xl border-none bg-white/58 px-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#F61064]"
                    />
                  </FormControl>
                  <FormMessage className="absolute bottom-0 left-2 text-[12px] leading-4" />
                </FormItem>
              )}
            />

            {/* Поле Пароль */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative space-y-0 pb-5">
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Пароль"
                      className="h-10 w-full rounded-2xl border-none bg-white/58 px-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#F61064]"
                    />
                  </FormControl>
                  <FormMessage className="absolute bottom-0 left-2 text-[12px] leading-4" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="mb-2 h-14 w-full cursor-pointer rounded-4xl bg-[#F61064] text-[20px] font-medium text-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-colors duration-300 hover:bg-black"
            >
              {isPending ? 'Загрузка...' : 'Войти'}
            </Button>

            <Button
              type="button"
              onClick={() => (window.location.href = GOOGLE_LOGIN_URL)}
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
        </Form>

        <div className="mt-6">
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
