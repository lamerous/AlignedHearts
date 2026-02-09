import handsImg from '../assets/img/hands.png';
import { TRUST_FEATURES } from '../constants/home.contants';
import { BackgroundBlobs } from './BackgroundBlobs';

export const TrustSection = () => {
  return (
    <section
      id="privacy"
      className="relative z-10 flex min-h-svh w-full flex-col justify-center px-6 py-16 md:px-14"
    >
      <BackgroundBlobs />

      <div className="container mx-auto flex h-full flex-col justify-center">
        <div className="mb-12 flex flex-col items-end gap-4">
          <div className="flex flex-col items-end text-right">
            <h2 className="font-days max-w-255 text-[32px] leading-[1.1] text-black md:text-[40px]">
              Основано на{' '}
              <span className="text-[#F61064]">
                доверии и конфиденциальности
              </span>
            </h2>
            <p className="mt-4 max-w-125 text-left text-lg leading-relaxed font-medium text-gray-900 md:text-xl">
              Ваши отношения священны. Мы разработали каждую функцию с учетом
              вашей приватности и эмоциональной безопасности.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col gap-8 md:gap-10">
            {TRUST_FEATURES.map((feature, index) => (
              <div key={index} className="flex items-start gap-6 md:gap-8">
                <div
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl shadow-sm md:h-24 md:w-24"
                  style={{ backgroundColor: feature.bgColor }}
                >
                  <feature.icon
                    className="h-10 w-10 md:h-12 md:w-12"
                    style={{ color: feature.color }}
                  />
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <h3 className="font-inter text-xl font-bold text-black md:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="max-w-125 text-base leading-normal text-gray-800 md:text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative hidden flex-1 items-center justify-center pl-20 lg:flex">
            <div className="absolute inset-0 left-40 scale-130 rounded-3xl bg-white/80 blur-2xl" />
            <img
              src={handsImg}
              alt="Руки и нить связи"
              className="relative z-10 h-auto w-full max-w-md scale-130 object-contain xl:scale-160"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
