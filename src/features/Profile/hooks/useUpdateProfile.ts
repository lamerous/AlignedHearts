import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/core/api/apiFetch';
import { API_ROUTES } from '@/core/api/endpoints';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const changeName = useMutation({
    mutationFn: (newName: string) =>
      apiFetch(API_ROUTES.profile.changeName, {
        method: 'PATCH',
        params: { new_name: newName },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] }),
  });

  const changeSex = useMutation({
    mutationFn: (newSex: string) =>
      apiFetch(API_ROUTES.profile.changeSex, {
        method: 'PATCH',
        params: { new_sex: newSex },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] }),
  });

  const changeAvatar = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file, file.name);

      return apiFetch(API_ROUTES.profile.changeAvatar, {
        method: 'PATCH',
        body: formData,
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] }),
  });

  const changePassword = useMutation({
    mutationFn: ({ oldP, newP }: { oldP: string; newP: string }) =>
      apiFetch(API_ROUTES.profile.changePassword, {
        method: 'POST',
        params: { old_password: oldP, new_password: newP },
      }),
  });

  return { changeName, changeSex, changeAvatar, changePassword };
};
