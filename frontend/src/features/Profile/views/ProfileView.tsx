import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, LogOut, Settings } from 'lucide-react';
import { useLogout } from '@/core/hooks/useLogout';
import { Button } from '@/core/ui/button';

import { EditableAvatar } from '../components/EditableAvatar';
import { EmptyHistory } from '../components/EmptyHistory';
import { ErrorMessage } from '../components/ErrorMessage';
import { HistoryCard } from '../components/HistoryCard';
import { Loader } from '../components/Loader';
import { useGetHistory } from '../hooks/useGetHistory';
import { useGetMe } from '../hooks/useGetMe';

export const ProfileView = () => {
  const navigate = useNavigate();
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetMe();
  const {
    data: history = [],
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useGetHistory();
  const { mutate: logout } = useLogout();

  if (isUserError || isHistoryError) return <ErrorMessage />;
  if (isUserLoading || isHistoryLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F9EBEC] pb-20">
      <section className="container mx-auto px-14 pt-12">
        <div className="flex items-start justify-between">
          <div className="flex gap-20">
            <EditableAvatar currentAvatar={user?.avatar} size="sm" />

            <div className="flex flex-col gap-2 pt-4">
              <div className="flex items-baseline gap-4">
                <h1 className="font-days text-[40px] text-black">
                  {user?.username}
                </h1>
                <span
                  className={`font-days text-[40px] ${user?.sex === 'male' ? 'text-[#155DFC]' : user?.sex === 'female' ? 'text-[#F61064]' : 'text-[#9810FA]'}`}
                >
                  (
                  {user?.sex === 'male'
                    ? 'М'
                    : user?.sex === 'female'
                      ? 'Ж'
                      : '?'}
                  )
                </span>
              </div>

              <p className="mt-4 text-2xl font-medium text-[#919191]">
                @user{user?.id}
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/profile/settings' })}
              className="flex cursor-pointer items-center gap-2 hover:bg-[#F9EBEC] hover:text-[#F61064]"
            >
              <Settings size={20} />
              Настройки
            </Button>
            <Button
              onClick={() => logout()}
              className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-[#F61064] bg-transparent px-4 py-2 text-[#F61064] transition-colors hover:bg-[#F61064] hover:text-white"
            >
              Выйти <LogOut size={18} />
            </Button>
          </div>
        </div>
      </section>

      <div className="my-16 h-0.5 w-full bg-[#7F7F7F]/30" />

      <section className="container mx-auto px-14">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-days text-[32px] text-black">История запросов</h2>
          {history.length > 0 && (
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/profile/history' })}
              className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-[#F61064] bg-transparent text-[#F61064] hover:bg-[#F61064] hover:text-white"
            >
              Подробнее <ArrowRight size={20} />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {history.length > 0 ? (
            history
              .slice(-3)
              .map(item => <HistoryCard key={item.id} item={item} />)
          ) : (
            <EmptyHistory />
          )}
        </div>
      </section>
    </div>
  );
};
