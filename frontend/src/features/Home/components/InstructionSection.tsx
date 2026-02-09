import { Logo } from '@/core/ui/logo';

import { STEPS } from '../constants/home.contants';

export const InstructionSection = () => {
  return (
    <section
      id="features"
      className="relative z-10 flex min-h-svh w-full flex-col items-center justify-center px-6 py-10"
    >
      <div className="container mx-auto flex flex-col items-center">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="font-inter mb-6 text-4xl text-black md:text-[40px]">
            Просто, конфиденциально, эффективно
          </h2>

          <p className="mb-6 text-xl font-medium text-gray-900 md:text-2xl">
            Три шага к превращению конфликта в понимание
          </p>

          <Logo className="h-20 w-20 text-[#F61064]" />
        </div>

        <div className="flex w-full flex-col justify-center gap-8 lg:flex-row lg:items-stretch">
          {STEPS.map((step, index) => (
            <div
              key={index}
              className="flex flex-1 flex-col gap-6 rounded-[30px] bg-white/60 p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="flex items-center gap-6">
                <span
                  className="font-days text-7xl leading-none opacity-90 select-none md:text-8xl"
                  style={{ color: step.color }}
                >
                  {index + 1}
                </span>

                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner md:h-20 md:w-20"
                  style={{ backgroundColor: step.bgColor }}
                >
                  <step.icon
                    className="h-8 w-8 md:h-10 md:w-10"
                    style={{ color: step.color }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xl leading-tight font-bold text-black md:text-2xl">
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-800 md:text-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
