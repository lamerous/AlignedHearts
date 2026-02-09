import { createFileRoute, redirect } from '@tanstack/react-router';
import { ActiveRoomView } from '@/features/Room/views/ActiveRoomView';

type RoomSearch = {
  wsUrl: string;
};

export const Route = createFileRoute('/room/$roomId')({
  component: ActiveRoomView,

  validateSearch: (search: Record<string, unknown>): RoomSearch => {
    return {
      wsUrl: (search.wsUrl as string) || '',
    };
  },

  loader: ({ location }) => {
    const search = location.search as RoomSearch;

    if (!search.wsUrl) {
      throw redirect({
        to: '/room/welcome',
      });
    }

    return { wsUrl: search.wsUrl };
  },
});
