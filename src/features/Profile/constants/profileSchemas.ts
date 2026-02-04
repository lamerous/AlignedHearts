import { z } from 'zod';

export const profileSchema = z.object({
  nickname: z.string().min(2, 'Слишком короткий ник'),
  sex: z.enum(['male', 'female', 'secret']),
  old_password: z.string().optional(),
  new_password: z.string().min(6, 'Минимум 6 символов').optional(),
});
