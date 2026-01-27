import { createFileRoute } from '@tanstack/react-router';
import { AuthLoginView } from '@/features/Auth/views/AuthLoginView';

export const Route = createFileRoute('/auth/login')({
  component: AuthLoginView,
});
