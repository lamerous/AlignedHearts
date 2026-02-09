import { createFileRoute } from '@tanstack/react-router';
import { HistoryView } from '@/features/Profile/views/HistoryView';

export const Route = createFileRoute('/profile/history')({
  component: HistoryView,
});
