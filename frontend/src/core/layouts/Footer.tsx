import { Link } from '@tanstack/react-router';
import { Logo } from '@/core/ui/logo';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0F172A] pt-16 pb-8 text-slate-300">
      <div className="container mx-auto px-6 md:px-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-70"
            >
              <Logo className="h-10 w-10 text-[#F61064]" />
              <span className="font-days text-[20px] text-[#F61064]">
                Aligned Hearts
              </span>
            </Link>
            <p className="max-w-70 text-sm leading-relaxed text-[#ABB3C3]">
              Помогаем парам преодолевать конфликты с пониманием.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold text-white">Контакты</h3>
            <div className="flex flex-col gap-3 text-sm text-[#ABB3C3]">
              <p>help@alignedhearts.by</p>
              <p>г. Минск, ул. Скворцова, д. Анлаки</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold text-white">
              Правовая информация
            </h3>
            <nav className="flex flex-col gap-3 text-sm text-[#ABB3C3]">
              <Link
                to="/"
                hash="privacy"
                className="transition-colors hover:text-[#F61064]"
              >
                Политика конфиденциальности
              </Link>
              <Link
                to="/"
                hash="terms"
                className="transition-colors hover:text-[#F61064]"
              >
                Условия использования
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-[#ABB3C3]">
          <p>
            © {currentYear} Aligned Hearts. Все права защищены. Создано с
            заботой о крепких отношениях.
          </p>
        </div>
      </div>
    </footer>
  );
};
