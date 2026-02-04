import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/core/ui/avatar';
import { Button } from '@/core/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/core/ui/form';
import { Input } from '@/core/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/ui/select';

import standartAvatar from '../assets/img/standartAvatar.svg';
import { profileSchema } from '../constants/profileSchemas';
import { useGetMe } from '../hooks/useGetMe';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { type ProfileFormValues } from '../types/profile.types';

export const SettingsView = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: userData, isLoading } = useGetMe();
  const { changeName, changeSex, changeAvatar, changePassword } =
    useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: '',
      sex: 'secret',
    },
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        nickname: userData.username || '',
        sex: (userData.sex as 'male' | 'female' | 'secret') || 'secret',
      });
    }
  }, [userData, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (
      data.old_password &&
      data.new_password &&
      data.old_password === data.new_password
    ) {
      form.setError('new_password', {
        message: 'Новый пароль совпадает со старым',
      });
      return;
    }

    try {
      if (data.nickname !== userData?.username)
        await changeName.mutateAsync(data.nickname);
      if (data.sex !== userData?.sex) await changeSex.mutateAsync(data.sex);
      if (data.old_password && data.new_password) {
        await changePassword.mutateAsync({
          oldP: data.old_password,
          newP: data.new_password,
        });
      }

      navigate({ to: '/profile/me' });
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="flex min-h-screen w-full justify-center bg-[#F9EBEC] py-20">
      <div className="flex w-full max-w-332 flex-col px-14">
        <Link
          to="/profile/me"
          className="mb-8 flex cursor-pointer items-center gap-2 text-[#4A4A4A] transition-colors hover:text-[#F61064]"
        >
          <ChevronLeft size={18} /> Вернуться в профиль
        </Link>

        <h1 className="font-days mb-12 text-[32px] text-gray-900">Настройки</h1>

        <div className="mb-12 flex flex-col gap-6">
          <p className="text-xl font-medium text-gray-800">
            Аватар пользователя
          </p>
          <div className="flex items-center gap-6">
            <Avatar className="h-38 w-38 shadow-md">
              <AvatarImage src={userData?.avatar ?? undefined} />
              <AvatarFallback className="bg-[#D9D9D9]">
                <img
                  src={standartAvatar}
                  alt="Standard user avatar"
                  className="h-full w-full object-cover"
                />
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/*"
              onChange={e =>
                e.target.files?.[0] && changeAvatar.mutate(e.target.files[0])
              }
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer text-base font-semibold text-[#4A4A4A] underline decoration-dotted underline-offset-4 transition-colors hover:text-[#F61064]"
            >
              Загрузить аватар
            </button>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-24"
          >
            <div className="flex flex-wrap gap-x-32 gap-y-12">
              <FormField
                control={form.control}
                name="nickname"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<ProfileFormValues, 'nickname'>;
                }) => (
                  <FormItem className="w-84">
                    <FormLabel className="text-xl font-medium">
                      Никнейм
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-13.75 border-none bg-[#D9D9D9] shadow-inner transition-all focus-visible:ring-2 focus-visible:ring-[#F61064]/30"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormItem className="w-84">
                <FormLabel className="text-xl font-medium text-gray-500">
                  Почта (недоступно)
                </FormLabel>
                <FormControl>
                  <Input
                    value={userData?.email || ''}
                    disabled
                    className="h-13.75 cursor-not-allowed border-none bg-[#D9D9D9]/50 opacity-70"
                  />
                </FormControl>
              </FormItem>

              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem className="w-84">
                    <FormLabel className="text-xl font-medium">Пол</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      key={userData?.sex} // Пиннает селект обновиться, когда данные прилетают
                    >
                      <FormControl>
                        <SelectTrigger className="h-13.75 border-none bg-[#D9D9D9]">
                          <SelectValue placeholder="Выберите пол" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Мужской</SelectItem>
                        <SelectItem value="female">Женский</SelectItem>
                        <SelectItem value="secret">Скрыто</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_password"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    ProfileFormValues,
                    'new_password'
                  >;
                }) => (
                  <FormItem className="w-84">
                    <FormLabel className="text-xl font-medium">
                      Новый пароль
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="***********"
                        className="h-13.75 border-none bg-[#D9D9D9] transition-all focus-visible:ring-2 focus-visible:ring-[#F61064]/30"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={!form.formState.isDirty}
              className="h-14 w-67.5 cursor-pointer rounded-xl bg-linear-to-r from-[#F61042] to-[#F61064] text-xl font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
            >
              Сохранить изменения
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
