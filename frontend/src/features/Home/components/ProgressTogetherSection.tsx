import { PROGRESS_CARDS } from '../constants/home.contants';
import { BackgroundBlobs } from './BackgroundBlobs';

export const ProgressTogetherSection = () => {
  return (
    <section className="relative flex min-h-80 w-full flex-col justify-center px-6 py-10 md:px-14">
      <BackgroundBlobs />

      <div className="container mx-auto flex flex-col justify-center">
        <div className="mb-10 text-left">
          <h2 className="font-days mb-3 text-[32px] leading-tight text-black md:text-[40px]">
            Двигайтесь вперед вместе
          </h2>
          <p className="font-inter text-lg font-medium text-black md:text-2xl">
            Хватит спорить по кругу. Начните строить более глубокое понимание.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:gap-x-20">
          {PROGRESS_CARDS.map((card, index) => (
            <div
              key={index}
              className="flex items-start gap-5 rounded-2xl border border-white/20 bg-white/75 p-5 shadow-[0_4px_4px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-transform hover:scale-[1.02]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center pt-1">
                <card.icon
                  size={30}
                  style={{ color: card.color }}
                  strokeWidth={2.5}
                />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-inter text-lg font-bold text-black md:text-xl">
                  {card.title}
                </h3>
                <p className="font-inter text-base leading-snug font-normal text-gray-800">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
