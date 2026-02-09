import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/core/ui/card';
import { Logo } from '@/core/ui/logo';

import { Background } from '../components/Background';

export default function WelcomeRoomView() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6">
      <Background />

      <Card className="relative z-10 flex w-full max-w-175 flex-col items-center justify-center overflow-hidden border-none bg-white p-10 shadow-[16px_32px_30px_rgba(0,0,0,0.16)] backdrop-blur-[20px] md:p-16">
        <Logo className="h-28 w-28 text-[#9810FA]" />

        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="font-days text-3xl text-black md:text-4xl lg:text-[40px]">
            Вы в безопасности
          </h1>

          <p className="font-inter max-w-134 text-lg text-black/80 md:text-xl">
            Ваши мысли останутся между вами и AI-ассистентом.
          </p>

          <Link
            to="/room/create"
            className="group mt-6 inline-flex h-14 items-center justify-center rounded-[30px] bg-[#9810FA] px-10 text-xl font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#800dd4] active:scale-95"
          >
            Начать
            <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
