import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/core/ui/button';

export const FinalSection = () => {
  return (
    <section className="relative flex w-full flex-col items-center justify-center bg-[#F61064] px-6 py-24 text-center">
      <h2 className="font-days mb-8 max-w-227 text-[46px] leading-15 text-[#FDFDFF]">
        Готовы укрепить ваши отношения?
      </h2>

      <p className="font-inter mb-12 max-w-172 text-2xl leading-7 font-medium text-white">
        Присоединяйтесь к тысячам пар, которые разрешают конфликты с эмпатией и
        строят крепкие отношения.
      </p>

      <div className="mb-12 flex flex-col items-center gap-6 md:flex-row">
        <Link
          to="/room/welcome"
          className="group inline-flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#FADDF0] px-6 transition-all duration-300 hover:bg-white hover:shadow-2xl active:scale-95 md:w-106"
        >
          <span className="font-inter text-xl font-semibold text-[#F61064] transition-colors duration-300 group-hover:text-[#D40D56]">
            Начать первую сессию бесплатно
          </span>
          <ArrowRight
            className="text-[#F61064] transition-all duration-300 group-hover:text-[#D40D56]"
            size={24}
          />
        </Link>

        <Button className="group flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#FADDF0] px-6 transition-all duration-300 hover:bg-white hover:shadow-2xl active:scale-95 md:w-50">
          <span className="font-inter text-xl font-semibold text-[#F61064] transition-colors duration-300 group-hover:text-[#D40D56]">
            Узнать больше
          </span>
        </Button>
      </div>

      <p className="font-inter text-base leading-5 font-normal text-white opacity-90">
        Без кредитной карты • Бесплатная 14-дневная пробная версия • Отмена в
        любое время
      </p>
    </section>
  );
};
