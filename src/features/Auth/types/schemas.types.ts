import * as z from 'zod';

import type { loginSchema, signupSchema } from '../constants/schemas';

export type SignupFormValues = z.infer<typeof signupSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;
