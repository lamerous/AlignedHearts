import { createFileRoute } from '@tanstack/react-router';
import WelcomeRoomView from '@/features/Room/views/WelcomeRoomView';

export const Route = createFileRoute('/room/welcome')({
  component: WelcomeRoomView,
});
