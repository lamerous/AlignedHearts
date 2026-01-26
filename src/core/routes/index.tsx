import { createFileRoute } from '@tanstack/react-router';
import { HomeView } from '@/features/Home/views/HomeView';

export const Route = createFileRoute('/')({
  component: HomeView,
});
