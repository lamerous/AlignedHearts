import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/core/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/ui/form';
import { Input } from '@/core/ui/input';
import { RadioGroup, RadioGroupItem } from '@/core/ui/radio-group';

import { EditableAvatar } from '../components/EditableAvatar';
import { Loader } from '../components/Loader';
import { profileSchema } from '../constants/profileSchemas';
import { useGetMe } from '../hooks/useGetMe';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import type { ProfileFormValues } from '../types/profile.types';

export const SettingsView = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useGetMe();
  const { changeName, changeSex, changePassword } = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: '',
      sex: 'male',
      new_password: '',
      old_password: '',
    },
  });

  useEffect(() => {
    if (userData) {
      const isFemale =
        userData.sex && String(userData.sex).toLowerCase() === 'female';
      form.reset({
        nickname: userData.username || '',
        sex: isFemale ? 'female' : 'male',
        new_password: '',
        old_password: '',
      });
    }
  }, [userData, form]);

  const handleSave = async (values: ProfileFormValues) => {
    try {
      if (values.nickname !== userData?.username) {
        await changeName.mutateAsync(values.nickname);
      }

      if (values.sex !== userData?.sex) {
        await changeSex.mutateAsync(values.sex);
      }

      if (values.new_password && values.old_password) {
        await changePassword.mutateAsync({
          oldP: values.old_password,
          newP: values.new_password,
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      navigate({ to: '/profile/me' });
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="flex min-h-screen w-full justify-center bg-[#F9EBEC] py-10 lg:py-20">
      <div className="flex w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <Link
          to="/profile/me"
          className="mb-6 flex w-fit items-center gap-2 text-gray-500 hover:text-[#F61064]"
        >
          <ChevronLeft size={20} />
          <span className="font-semibold">Назад</span>
        </Link>

        <div className="overflow-hidden rounded-[40px] bg-white shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-col items-center justify-center bg-[#fdf2f3] p-10 lg:w-95">
              <div className="mb-6">
                <EditableAvatar currentAvatar={userData?.avatar} size="lg" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {userData?.username}
              </h2>
            </div>

            <div className="flex-1 p-8 lg:p-14">
              <h1 className="font-days mb-10 text-3xl text-gray-900 uppercase">
                Настройки
              </h1>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSave)}
                  className="flex flex-col gap-10"
                >
                  <div className="grid grid-cols-1 gap-x-12 gap-y-2 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="nickname"
                      render={({ field }) => (
                        <FormItem className="min-h-27.5">
                          <FormLabel className="text-xs font-bold text-gray-400 uppercase">
                            Никнейм
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-14 border-0 bg-gray-50 ring-1 ring-gray-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormItem className="min-h-27.5">
                      <FormLabel className="text-xs font-bold text-gray-400 uppercase">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          value={userData?.email || ''}
                          disabled
                          className="h-14 cursor-not-allowed bg-gray-100 text-gray-400"
                        />
                      </FormControl>
                    </FormItem>

                    <FormField
                      control={form.control}
                      name="old_password"
                      render={({ field }) => (
                        <FormItem className="min-h-27.5">
                          <FormLabel className="text-xs font-bold text-gray-400 uppercase">
                            Текущий пароль
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              placeholder="Для подтверждения"
                              className="h-14 border-0 bg-gray-50 ring-1 ring-gray-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="new_password"
                      render={({ field }) => (
                        <FormItem className="min-h-27.5">
                          <FormLabel className="text-xs font-bold text-gray-400 uppercase">
                            Новый пароль
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              placeholder="Минимум 8 знаков"
                              className="h-14 border-0 bg-gray-50 ring-1 ring-gray-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-bold text-gray-400 uppercase">
                            Пол
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-row items-center gap-6 pt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="male"
                                  id="m-settings"
                                  className="cursor-pointer"
                                />
                                <label
                                  htmlFor="m-settings"
                                  className="cursor-pointer text-sm leading-none font-medium"
                                >
                                  Мужской
                                </label>
                              </div>

                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="female"
                                  id="f-settings"
                                  className="cursor-pointer"
                                />
                                <label
                                  htmlFor="f-settings"
                                  className="cursor-pointer text-sm leading-none font-medium"
                                >
                                  Женский
                                </label>
                              </div>

                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="secret"
                                  id="s-settings"
                                  className="cursor-pointer"
                                />
                                <label
                                  htmlFor="s-settings"
                                  className="cursor-pointer text-sm leading-none font-medium"
                                >
                                  Скрыт
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="h-16 w-full cursor-pointer rounded-2xl bg-[#F61064] text-xl font-bold text-white shadow-xl hover:bg-[#d40d56] sm:w-72"
                  >
                    {form.formState.isSubmitting
                      ? 'Сохранение...'
                      : 'Сохранить изменения'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
