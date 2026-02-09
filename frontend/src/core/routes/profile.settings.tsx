import { createFileRoute } from '@tanstack/react-router';
import { SettingsView } from '@/features/Profile/views/SettingsView';

export const Route = createFileRoute('/profile/settings')({
  component: SettingsView,
});
