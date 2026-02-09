import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
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
import { RadioGroup, RadioGroupItem } from '@/core/ui/radio-group';

import googleIcon from '../assets/img/googleIcon.svg';
import { signupSchema } from '../constants/authSchemas';
import { useSignup } from '../hooks/useSignup';
import type { SignupFormValues } from '../types/schemas.types';

export const SignupForm = () => {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      sex: 'male',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate, isPending } = useSignup(form.setError);

  const onSubmit = (data: SignupFormValues) => {
    mutate(data);
  };

  return (
    <Card className="my-30 flex w-full max-w-136 flex-col items-center rounded-4xl border-none bg-[rgba(255,240,250,0.58)] px-20 py-10 shadow-2xl backdrop-blur-md">
      <CardContent className="flex w-full flex-col items-center p-0">
        <h1 className="font-days mb-12 text-[40px] text-[#F61064]">
          Регистрация
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="relative space-y-0 pb-5">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Логин"
                      className="h-10 w-full rounded-2xl border-none bg-white/58 px-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#F61064]"
                    />
                  </FormControl>
                  <FormMessage className="absolute bottom-0 left-2 text-[12px]" />
                </FormItem>
              )}
            />

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
                  <FormMessage className="absolute bottom-0 left-2 text-[12px]" />
                </FormItem>
              )}
            />

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
                  <FormMessage className="absolute bottom-0 left-2 text-[12px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="relative space-y-0 pb-5">
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Повторите пароль"
                      className="h-10 w-full rounded-2xl border-none bg-white/58 px-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#F61064]"
                    />
                  </FormControl>
                  <FormMessage className="absolute bottom-0 left-2 text-[12px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className="relative space-y-0 pb-5">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4 px-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="male"
                          id="m-signup"
                          className="cursor-pointer border-gray-400"
                        />
                        <label
                          htmlFor="m-signup"
                          className="cursor-pointer text-[15px] text-gray-700"
                        >
                          Мужчина
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="female"
                          id="f-signup"
                          className="cursor-pointer border-gray-400"
                        />
                        <label
                          htmlFor="f-signup"
                          className="cursor-pointer text-[15px] text-gray-700"
                        >
                          Женщина
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="secret"
                          id="s-signup"
                          className="cursor-pointer border-gray-400"
                        />
                        <label
                          htmlFor="s-signup"
                          className="cursor-pointer text-[15px] text-gray-700"
                        >
                          Скрыт
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="absolute bottom-0 left-2 text-[12px]" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="mb-2 h-14 w-full cursor-pointer rounded-4xl bg-[#F61064] text-[20px] font-medium text-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-colors duration-300 hover:bg-black"
            >
              {isPending ? 'Загрузка...' : 'Зарегистрироваться'}
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
              Регистрация через Google
            </Button>
          </form>
        </Form>

        <div className="mt-6">
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
