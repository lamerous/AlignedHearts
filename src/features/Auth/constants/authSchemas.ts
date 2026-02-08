import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Введите Email').email('Неверный формат'),
  password: z.string().min(8, 'Пароль от 8 символов'),
});

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(4, 'Минимум 4 символа')
      .max(16, 'В нике должно быть не более 16 символов'),
    email: z.string().min(1, 'Введите Email').email('Неверный формат'),
    sex: z.enum(['male', 'female', 'secret']),
    password: z.string().min(8, 'Пароль от 8 символов'),
    confirmPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });
