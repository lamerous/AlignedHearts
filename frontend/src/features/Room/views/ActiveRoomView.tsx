import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Copy, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '@/core/api/apiFetch';
import { API_ROUTES } from '@/core/api/endpoints';
import { Button } from '@/core/ui/button';
import { Card } from '@/core/ui/card';
import { Logo } from '@/core/ui/logo';
import { Textarea } from '@/core/ui/textarea';
import { Background } from '@/features/Room/components/Background';

const routeApi = getRouteApi('/room/$roomId');

const STATUS = {
  WAITING_PARTNER: 'WAITING_PARTNER',
  WRITING: 'WRITING',
  WAITING_OTHER_FINISH: 'WAITING_OTHER_FINISH',
  GENERATING: 'GENERATING',
  RESULTS: 'RESULTS',
} as const;

type RoomStatus = keyof typeof STATUS;

export const ActiveRoomView = () => {
  const navigate = useNavigate();
  const { roomId } = routeApi.useParams();
  const { wsUrl: rawWsUrl } = routeApi.useLoaderData();

  const [status, setStatus] = useState<RoomStatus>(STATUS.WAITING_PARTNER);
  const [text, setText] = useState('');
  const [results, setResults] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const MIN_CHARS = 50;
  const MAX_CHARS = 5000;

  useEffect(() => {
    if (!rawWsUrl) return;

    const closeSession = async () => {
      try {
        localStorage.removeItem('active_room');
        await apiFetch(API_ROUTES.rooms.cancel, { method: 'DELETE' });
      } catch (e) {
        console.error('Failed to cancel session:', e);
      } finally {
        navigate({ to: '/room/welcome' });
      }
    };

    const ws = new WebSocket(rawWsUrl);
    socketRef.current = ws;

    ws.onopen = () => setConnected(true);

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'room_ready') setStatus(STATUS.WRITING);
        if (data.type === 'info') {
          const content = data.content?.toLowerCase() || '';
          if (content.includes('ready') || content.includes('заполнена')) {
            setStatus(STATUS.WRITING);
          }
        }
        if (data.type === 'ai_update') {
          if (data.step === 'generating') setStatus(STATUS.GENERATING);
          if (data.step === 'completed' && data.content) {
            console.log(data);
            setResults(data.content);
            setStatus(STATUS.RESULTS);
          }
        }
        if (data.type === 'error') closeSession();
      } catch (e) {
        console.error('Parsing error:', e);
      }
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [rawWsUrl, navigate]);

  const handleFinishWriting = () => {
    if (text.length < MIN_CHARS) return;
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'message', text }));
      setStatus(STATUS.WAITING_OTHER_FINISH);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#FDF2F8] p-6">
      <Background />
      <div className="z-10 w-full max-w-2xl">
        {status === STATUS.WAITING_PARTNER && (
          <Card className="flex w-full max-w-175 flex-col items-center gap-6 rounded-[40px] border-none bg-white p-12 text-center shadow-2xl">
            <h2 className="text-3xl leading-tight font-black text-gray-900">
              Ожидаем вашего <br /> партнера...
            </h2>
            <Logo className="h-20 w-20 text-[#9810FA]" />
            <p className="text-[19px] font-medium text-gray-400">
              Когда оба описания будут готовы, начнется анализ.
            </p>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-2 text-lg font-bold">
              Код партнера:{' '}
              <span className="ml-1 text-[#9810FA]">{roomId}</span>
            </div>
            <Button
              variant="outline"
              className="h-14 cursor-pointer rounded-full border-2 border-[#9810FA] bg-white px-10 font-bold text-[#9810FA] transition-all duration-300 hover:bg-[#9810FA] hover:text-white active:scale-95"
              onClick={() => navigator.clipboard.writeText(roomId)}
            >
              Скопировать код <Copy className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        )}

        {status === STATUS.WRITING && (
          <Card className="w-full max-w-175 rounded-[40px] border-none bg-white p-10 shadow-2xl backdrop-blur-xl">
            <h2 className="mb-8 text-center text-3xl leading-tight font-black text-gray-900">
              Опишите ситуацию со своей точки зрения
            </h2>
            <Textarea
              value={text}
              onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Что происходит? Как вы себя чувствуете? Не стесняйтесь делиться деталями - все конфиденциально."
              className="h-70 w-full resize-none overflow-y-auto rounded-[30px] border-gray-200 bg-gray-100 p-8 text-xl"
            />
            <div className="flex justify-end px-2 text-sm font-bold text-gray-400">
              {text.length}/{MAX_CHARS}
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={handleFinishWriting}
                disabled={text.length < MIN_CHARS || !connected}
                className="h-16 w-full cursor-pointer rounded-[30px] bg-[#9810FA] text-2xl font-black text-white transition-all duration-300 hover:bg-[#7a0dc9] active:scale-95 disabled:bg-gray-200"
              >
                Готово
              </Button>
              {text.length < MIN_CHARS && (
                <p className="text-[15px] font-medium text-gray-400">
                  Пожалуйста, напишите минимум {MIN_CHARS} символов (осталось{' '}
                  {MIN_CHARS - text.length})
                </p>
              )}
            </div>
          </Card>
        )}

        {(status === STATUS.WAITING_OTHER_FINISH ||
          status === STATUS.GENERATING) && (
          <Card className="w-full max-w-175 rounded-[40px] border-none bg-white p-16 text-center shadow-2xl backdrop-blur-xl">
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-[#9810FA]" />
            <h2 className="text-3xl font-black text-gray-900">
              {status === STATUS.GENERATING
                ? 'ИИ анализирует...'
                : 'Ждем партнера...'}
            </h2>
          </Card>
        )}

        {status === STATUS.RESULTS && (
          <Card className="w-full max-w-175 rounded-[40px] border-none bg-white p-10 shadow-2xl backdrop-blur-xl">
            <h2 className="mb-8 text-center text-3xl font-black text-[#9810FA]">
              Ваши рекомендации готовы:
            </h2>
            <div className="mb-8 overflow-y-auto rounded-[30px] bg-purple-50 p-8">
              <p className="text-lg text-gray-700 italic">"{results}"</p>
            </div>
            <Button
              className="h-16 w-full cursor-pointer rounded-full bg-[#9810FA] text-xl font-bold text-white hover:bg-[#800dd4] active:scale-95"
              onClick={() => {
                localStorage.removeItem('active_room');
                navigate({ to: '/room/welcome' });
              }}
            >
              Завершить
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
