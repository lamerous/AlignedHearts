import { z } from 'zod';

import { profileSchema } from '../constants/profileSchemas';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  sex: 'male' | 'female' | 'secret';
  avatar: string | null;
}

export interface HistoryItem {
  id: number;
  text: string;
  ai_advice: string;
  created_at: string;
}

export type ProfileFormValues = z.infer<typeof profileSchema>;
