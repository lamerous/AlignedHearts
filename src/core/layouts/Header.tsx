import { Link, useNavigate } from '@tanstack/react-router';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/core/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/ui/dropdown-menu';
import { Logo } from '@/core/ui/logo';
import { useGetMe } from '@/features/Profile/hooks/useGetMe';

import { useLogout } from '../hooks/useLogout';

export const Header = () => {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();

  const { data: user } = useGetMe();

  const isPreviouslyLoggedIn = !!localStorage.getItem('is_auth');
  const isAuthenticated = isPreviouslyLoggedIn || !!user;

  return (
    <header className="sticky top-0 z-50 h-20 w-full bg-[#FFF2F3] shadow-[0_6px_4px_rgba(0,0,0,0.12)]">
      <div className="container mx-auto flex h-full items-center justify-between px-14">
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-70"
        >
          <Logo className="h-13 w-13 text-[#F61064]" />
          <span className="font-days leading-10px text-[32px] text-[#F61064]">
            Aligned Hearts
          </span>
        </Link>

        <div className="flex items-center gap-16">
          <nav className="hidden items-center gap-16 md:flex">
            <Link
              to="/"
              hash="info"
              className="text-base font-medium text-[#4A4A4A] hover:text-[#F61064]"
            >
              Инфо
            </Link>
            <Link
              to="/"
              hash="features"
              className="text-base font-medium text-[#4A4A4A] hover:text-[#F61064]"
            >
              Функции
            </Link>
            <Link
              to="/"
              hash="privacy"
              className="text-base font-medium text-[#4A4A4A] hover:text-[#F61064]"
            >
              Приватность
            </Link>
          </nav>

          <div className="flex items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="group flex cursor-pointer items-center justify-center transition-transform hover:scale-110">
                    {user?.avatar && (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-xl border-none bg-white p-2 shadow-xl"
                >
                  <DropdownMenuItem
                    onClick={() => navigate({ to: '/profile/me' })}
                    className="flex cursor-pointer items-center gap-2 rounded-lg p-3 hover:bg-[#FFF2F3]"
                  >
                    <User className="h-4 w-4" />
                    <span>
                      Профиль {user?.username && `(${user.username})`}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="flex cursor-pointer items-center gap-2 rounded-lg p-3 text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                asChild
                className="h-11 border-2 border-[#F61064] px-6 text-base font-medium text-[#F61064] hover:bg-[#F61064] hover:text-white"
              >
                <Link to="/auth/login">Войти</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
