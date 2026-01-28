import { createFileRoute } from '@tanstack/react-router';
import { LoginView } from '@/features/Auth/views/LoginView';

export const Route = createFileRoute('/auth/login')({
  component: LoginView,
});
