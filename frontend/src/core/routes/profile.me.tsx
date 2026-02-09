import { createFileRoute } from '@tanstack/react-router';
import { ProfileView } from '@/features/Profile/views/ProfileView';

export const Route = createFileRoute('/profile/me')({
  component: ProfileView,
});
