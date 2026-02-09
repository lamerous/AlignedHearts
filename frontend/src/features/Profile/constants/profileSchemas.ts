import z from 'zod';

export const profileSchema = z
  .object({
    nickname: z
      .string()
      .min(4, 'В нике должно быть не менее 4 символов')
      .max(16, 'В нике должно быть не более 16 символов'),
    sex: z.enum(['male', 'female', 'secret']),
    old_password: z.string().optional(),
    new_password: z.string().optional(),
  })
  .refine(
    data => {
      if (data.new_password && !data.old_password) {
        return false;
      }
      return true;
    },
    {
      message: 'Введите текущий пароль для смены',
      path: ['old_password'],
    },
  )
  .refine(
    data => {
      if (data.new_password && data.new_password.length > 0) {
        return data.new_password.length >= 8;
      }
      return true;
    },
    {
      message: 'Пароль должен быть не менее 8 символов',
      path: ['new_password'],
    },
  );
