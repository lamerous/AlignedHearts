import { Link } from '@tanstack/react-router';
import { UserCircle } from 'lucide-react';
import { Button } from '@/core/ui/button';
import { Logo } from '@/core/ui/logo';

export const Header = () => {
  const isAuthenticated = !!localStorage.getItem('auth_token');

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
              className="text-base font-medium text-[#4A4A4A] transition-colors duration-300 hover:text-[#F61064]"
            >
              Инфо
            </Link>
            <Link
              to="/"
              hash="features"
              className="text-base font-medium text-[#4A4A4A] transition-colors duration-300 hover:text-[#F61064]"
            >
              Функции
            </Link>
            <Link
              to="/"
              hash="privacy"
              className="text-base font-medium text-[#4A4A4A] transition-colors duration-300 hover:text-[#F61064]"
            >
              Приватность
            </Link>
          </nav>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="group flex items-center justify-center transition-transform hover:scale-110"
            >
              <UserCircle className="h-10 w-10 text-[#F61064] transition-colors" />
            </Link>
          ) : (
            <Button
              variant="outline"
              asChild
              className="rounded-5 h-11 border-2 border-[#F61064] px-5.5 text-base font-medium text-[#F61064] transition-colors duration-300 hover:bg-[#F61064] hover:text-white"
            >
              <Link to="/auth/login">Войти</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
