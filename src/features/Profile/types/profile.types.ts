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
  owner_text: string;
  member_text: string;
  ai_advice: string;
  created_at: string;
}

export type ProfileFormValues = z.infer<typeof profileSchema>;

// History Item
// "id": 0,
// "code": "string",
// "owner_id": 0,
// "member_id": 0,
// "status": "string",
// "owner_text": "string",
// "member_text": "string",
// "ai_advice": "string",
// "created_at": "2026-02-03T12:42:08.398Z"
