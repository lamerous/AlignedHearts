import { createFileRoute } from '@tanstack/react-router';
import { CreateRoomView } from '@/features/Room/views/CreateRoomView';

export const Route = createFileRoute('/room/create')({
  component: CreateRoomView,
});
