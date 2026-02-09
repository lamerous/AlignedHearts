import { createFileRoute } from '@tanstack/react-router';
import { SignupView } from '@/features/Auth/views/SignupView';

export const Route = createFileRoute('/auth/signup')({
  component: SignupView,
});
