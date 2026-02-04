import { useMutation } from '@tanstack/react-query';

export const useUpdateProfile = () => {
  const changeName = useMutation({
    mutationFn: (newName: string) =>
      fetch(`/api/profile/change_name?new_name=${newName}`, {
        method: 'PATCH',
      }),
  });

  const changeSex = useMutation({
    mutationFn: (newSex: string) =>
      fetch(`/api/profile/change_sex?new_sex=${newSex}`, { method: 'PATCH' }),
  });

  const changeAvatar = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetch('/api/profile/change_avatar', {
        method: 'PATCH',
        body: formData,
      });
    },
  });

  const changePassword = useMutation({
    mutationFn: ({ oldP, newP }: { oldP: string; newP: string }) =>
      fetch(
        `/api/profile/change_password?old_password=${oldP}&new_password=${newP}`,
        {
          method: 'POST',
        },
      ),
  });

  return { changeName, changeSex, changeAvatar, changePassword };
};
