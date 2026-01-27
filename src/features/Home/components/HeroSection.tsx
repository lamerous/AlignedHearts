import { CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/core/ui/button';

import coupleImg from '../assets/img/couple.png';
import vectorLine from '../assets/img/vectorLine.svg';
import { BackgroundBlobs } from './BackgroundBlobs';

const FEATURES: string[] = ['100% Конфиденциально', 'Сквозное шифрование'];

export const HeroSection = () => {
  return (
    <section className="relative flex min-h-svh w-full items-center overflow-hidden">
      <BackgroundBlobs />

      <img
        src={vectorLine}
        alt="decoration"
        aria-hidden="true"
        className="pointer-events-none absolute z-10 max-w-none"
        style={{ width: '100vw', height: 'auto', top: '-120px' }}
      />

      <div className="relative z-10 container mx-auto flex min-h-full flex-col items-center justify-between px-6 md:flex-row md:px-14">
        <div className="max-w-2xl py-10">
          <div className="mb-6 flex w-fit items-center gap-2 rounded-full bg-white/90 px-6 py-2.5 shadow-sm">
            <Sparkles className="h-5 w-5 text-[#F61064]" />
            <span className="text-lg font-medium text-[#F61064]">
              ИИ для гармонии в отношениях
            </span>
          </div>

          <h1 className="font-days mb-8 max-w-167 text-[47px] leading-[1.1] font-normal text-black">
            Превращайте конфликты в{' '}
            <span className="text-[#F61064]">глубокую связь</span>
          </h1>

          <p className="mb-12 max-w-162 text-xl leading-relaxed text-gray-900">
            Разрешайте разногласия с эмпатией и пониманием. Aligned Hearts
            помогает парам конструктивно решать конфликты через
            персонализированные рекомендации ИИ и приватное индивидуальное
            руководство.
          </p>

          <div className="mb-8 flex flex-wrap items-center gap-6">
            <Button className="h-14 cursor-pointer rounded-xl bg-[#F61042] px-8 text-xl font-bold text-white shadow-lg transition-all duration-300 hover:bg-black hover:text-white">
              Начать бесплатно
            </Button>

            <Button
              variant="outline"
              className="h-14 cursor-pointer rounded-xl border-none bg-white px-8 text-xl font-bold text-black shadow-lg transition-all duration-300 hover:bg-white hover:text-[#F61042]"
            >
              Смотреть демо
            </Button>
          </div>

          <div className="flex flex-wrap gap-10">
            {FEATURES.map(text => (
              <div
                key={text}
                className="flex items-center gap-2 text-lg text-gray-800"
              >
                <CheckCircle2 className="h-6 w-6 text-[#2DB45E]" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center pt-10 md:pt-0">
          <div className="absolute inset-0 -z-10 scale-125 rounded-3xl bg-[#FFF2F3] opacity-70 blur-xl" />
          <img
            src={coupleImg}
            alt="Счастливая пара"
            className="relative z-10 h-auto w-full scale-110 object-contain md:scale-130"
          />
        </div>
      </div>
    </section>
  );
};
