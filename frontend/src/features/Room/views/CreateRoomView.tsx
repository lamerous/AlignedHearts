import { useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { apiFetch } from '@/core/api/apiFetch';
import { API_ROUTES } from '@/core/api/endpoints';
import { Button } from '@/core/ui/button';
import { Card } from '@/core/ui/card';
import { Input } from '@/core/ui/input';
import { Logo } from '@/core/ui/logo';
import { Background } from '@/features/Room/components/Background';

export const CreateRoomView = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveAndNavigate = (roomId: string, wsUrl: string) => {
    localStorage.setItem(
      'active_room',
      JSON.stringify({ code: roomId, wsUrl }),
    );
    navigate({
      to: '/room/$roomId',
      params: { roomId },
      search: { wsUrl },
    });
  };

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ code: string; ws_url: string }>(
        API_ROUTES.rooms.create,
        { method: 'POST' },
      );
      saveAndNavigate(data.code, data.ws_url);
    } catch (error) {
      console.error(error);
      setError('Не удалось создать комнату.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (code.length < 6) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiFetch<{ ws_url: string }>(
        API_ROUTES.rooms.connect,
        {
          method: 'POST',
          params: { code },
        },
      );
      saveAndNavigate(code, data.ws_url);
    } catch (error) {
      console.error(error);
      setError('Комната не найдена.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#FDF2F8] p-6">
      <Background />
      <Card className="relative z-10 flex w-full max-w-175 flex-col items-center gap-8 rounded-[40px] border-none bg-white p-12 shadow-2xl">
        <Logo className="h-20 w-20 text-[#9810FA]" />
        <h1 className="text-center text-3xl font-black text-gray-900">
          Начните сеанс с партнёром
        </h1>

        <div className="flex w-full flex-col gap-4">
          <Button
            onClick={handleCreate}
            disabled={isLoading}
            className="h-16 cursor-pointer items-center justify-center rounded-[30px] bg-[#9810FA] px-10 text-xl font-semibold text-white shadow-lg duration-300 hover:bg-[#800dd4] active:scale-95"
          >
            Создать новую комнату <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="relative my-4 flex items-center">
            <div className="grow border-t border-gray-300"></div>
            <span className="mx-4 text-xs font-bold text-gray-400 uppercase">
              или войти по коду
            </span>
            <div className="grow border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-3">
            <Input
              placeholder="КОД"
              disabled={isLoading}
              className="h-16 rounded-[30px] border-none bg-gray-200 text-center text-xl font-black uppercase"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
            />

            <Button
              className="h-16 cursor-pointer rounded-[30px] bg-gray-900 font-bold text-white uppercase hover:bg-black/80 active:scale-95"
              onClick={handleConnect}
              disabled={isLoading || code.length < 6}
            >
              Войти
            </Button>

            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-center text-sm font-bold text-red-500">
                {error}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
