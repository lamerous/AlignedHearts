import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '@/core/api/apiFetch';
import { API_ROUTES } from '@/core/api/endpoints';
import { Button } from '@/core/ui/button';
import { Card } from '@/core/ui/card';
import { Input } from '@/core/ui/input';
import { Background } from '@/features/Room/components/Background';

export const CreateRoomView = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<{ code: string; ws_url: string }>(
        API_ROUTES.rooms.create,
        {
          method: 'POST',
        },
      );

      console.log(data);

      await navigate({
        to: '/room/$roomId',
        params: { roomId: data.code },
        search: { wsUrl: data.ws_url },
      });
    } catch (error) {
      toast.error('Ошибка создания комнаты');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch(API_ROUTES.rooms.cancel, {
        method: 'DELETE',
      });
      console.log(data);
    } catch (error) {
      toast.error('Ошибка создания комнаты');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (code.length < 6) return;
    setIsLoading(true);
    try {
      const data = await apiFetch<{ ws_url: string }>(
        API_ROUTES.rooms.connect,
        {
          method: 'POST',
          params: { code },
        },
      );

      await navigate({
        to: '/room/$roomId',
        params: { roomId: code },
        search: { wsUrl: data.ws_url },
      });
    } catch (error) {
      console.error(error);
      toast.error('Комната не найдена');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center p-6">
      <Background />
      <Card className="relative z-10 flex w-full max-w-[600px] flex-col items-center gap-6 bg-white/60 p-10 backdrop-blur-xl">
        <Sparkles className="h-12 w-12 text-[#9810FA]" />
        <h1 className="text-3xl font-bold">Начните сеанс</h1>
        <div className="flex w-full flex-col gap-4">
          <Button
            onClick={handleCreate}
            disabled={isLoading}
            className="h-14 bg-[#9810FA]"
          >
            Создать комнату <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Input
              placeholder="Код"
              className="h-14 text-center uppercase"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
            />
            <Button
              variant="outline"
              className="h-14 px-8"
              onClick={handleConnect}
              disabled={isLoading}
            >
              Войти
            </Button>
            <Button
              variant="outline"
              className="h-14 px-8"
              onClick={handleClose}
              disabled={isLoading}
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
