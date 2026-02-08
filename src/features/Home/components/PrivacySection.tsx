import { CheckCircle2 } from 'lucide-react';

import { COMMITMENTS } from '../constants/home.contants';

export const PrivacySection = () => {
  return (
    <section className="relative mb-30 w-full px-6 pt-14 md:px-14">
      <div className="container mx-auto mb-16 flex flex-col items-center text-center">
        <h2 className="font-days mb-6 max-w-250 text-[40px] leading-13 text-black">
          Ваша <span className="text-[#F61064]">конфиденциальность</span> — наш
          приоритет
        </h2>
        <p className="font-inter max-w-172 text-2xl leading-7 font-medium text-black">
          Мы понимаем, что делиться проблемами в отношениях требует доверия. Вот
          наше обязательство перед вами:
        </p>
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-x-46 gap-y-22 md:grid-cols-2 lg:grid-cols-3">
          {COMMITMENTS.map((text, index) => (
            <div key={index} className="flex w-80 items-start gap-1">
              <CheckCircle2
                className="mt-1 shrink-0"
                size={24}
                color="#2DB45E"
                strokeWidth={2}
              />

              <p className="font-inter text-xl leading-6 font-normal text-black">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
