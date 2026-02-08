import { getRouteApi } from '@tanstack/react-router';
import { Copy, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { toast } from 'sonner';
import { Button } from '@/core/ui/button';
import { Card } from '@/core/ui/card';
import { Textarea } from '@/core/ui/textarea';
import { Background } from '@/features/Room/components/Background';

const routeApi = getRouteApi('/room/$roomId');

const STATUS = {
  WAITING_PARTNER: 'WAITING_PARTNER',
  WRITING: 'WRITING',
  WAITING_OTHER: 'WAITING_OTHER',
  GENERATING: 'GENERATING',
  RESULTS: 'RESULTS',
} as const;

type RoomStatus = keyof typeof STATUS;

export const ActiveRoomView = () => {
  const { roomId } = routeApi.useParams();
  const { wsUrl: rawWsUrl } = routeApi.useLoaderData();

  const [status, setStatus] = useState<RoomStatus>(STATUS.WAITING_PARTNER);
  const [text, setText] = useState('');
  const [results, setResults] = useState<string | null>(null);

  const socketUrl = useMemo(() => {
    if (!rawWsUrl) return null;

    if (window.location.hostname !== 'localhost') {
      return rawWsUrl.replace('ws://', 'wss://');
    }

    try {
      const url = new URL(rawWsUrl);

      const path = url.pathname;

      const finalPath = path.startsWith('/ws') ? path : `/ws${path}`;

      return `ws://${window.location.host}${finalPath}${url.search}`;
    } catch (e) {
      console.log(e);
      return `ws://${window.location.host}/ws/ws/${roomId}`;
    }
  }, [rawWsUrl, roomId]);

  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    onOpen: () => {
      console.log('WebSocket подключен через прокси к:', socketUrl);
      toast.success('Подключено к серверу');
    },
    onClose: () => toast.error('Связь разорвана'),
    onError: event => {
      console.log('Попытка подключения к:', socketUrl);
      console.error('Ошибка WebSocket:', event);
      toast.error('Ошибка подключения к сокету');
    },
    onMessage: event => {
      const data = JSON.parse(event.data);
      console.log('Получено сообщение:', data);

      if (data.type === 'info' && data.username) {
        setStatus(STATUS.WRITING);
      }

      if (data.type === 'info' && data.content?.includes('Ожидаем партнера')) {
        setStatus(STATUS.WAITING_OTHER);
      }

      if (data.type === 'ai_update') {
        if (data.step === 'processing') {
          setStatus(STATUS.GENERATING);
        }
        if (data.step === 'completed' && data.content) {
          setResults(data.content);
          setStatus(STATUS.RESULTS);
        }
      }
    },
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Подключение...',
    [ReadyState.OPEN]: 'В сети',
    [ReadyState.CLOSING]: 'Закрытие...',
    [ReadyState.CLOSED]: 'Оффлайн',
    [ReadyState.UNINSTANTIATED]: 'Инициализация',
  }[readyState];

  const handleFinishWriting = () => {
    if (text.length < 10) return toast.warning('Слишком коротко');
    sendJsonMessage({ type: 'message', text });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-6">
      <Background />

      <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/20 px-4 py-1 text-sm text-white backdrop-blur-sm">
        {readyState === ReadyState.CONNECTING && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        <span
          className={
            readyState === ReadyState.OPEN
              ? 'text-green-400'
              : 'text-yellow-400'
          }
        >
          {connectionStatus}
        </span>
      </div>

      <div className="z-10 w-full max-w-2xl text-center">
        {status === STATUS.WAITING_PARTNER && (
          <Card className="bg-white/80 p-10 backdrop-blur-md">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Ждем партнера
            </h2>
            <p className="mb-6 text-lg text-gray-600">Код комнаты:</p>
            <div className="flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-100 p-4 font-mono text-3xl">
              {roomId}
              <Copy
                className="h-6 w-6 cursor-pointer text-gray-400 transition-colors hover:text-black"
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                  toast.success('Код скопирован');
                }}
              />
            </div>
          </Card>
        )}

        {status === STATUS.WRITING && (
          <Card className="bg-white/90 p-6 backdrop-blur-md">
            <h2 className="mb-4 text-xl font-semibold">Ваша очередь писать</h2>
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Расскажите вашу историю..."
              className="mb-4 min-h-[300px] bg-white/50 text-lg"
            />
            <Button
              onClick={handleFinishWriting}
              className="h-12 w-full bg-[#9810FA] text-lg text-white"
              disabled={readyState !== ReadyState.OPEN}
            >
              Отправить
            </Button>
          </Card>
        )}

        {status === STATUS.RESULTS && (
          <Card className="bg-white/95 p-8 text-left shadow-xl backdrop-blur-md">
            <h3 className="mb-6 border-b pb-4 text-2xl font-bold text-[#9810FA]">
              Анализ ИИ:
            </h3>
            <div className="text-lg leading-relaxed whitespace-pre-wrap text-gray-800">
              {results}
            </div>
          </Card>
        )}

        {(status === STATUS.WAITING_OTHER || status === STATUS.GENERATING) && (
          <div className="flex flex-col items-center gap-6 text-white drop-shadow-lg">
            <Loader2 className="h-16 w-16 animate-spin" />
            <h2 className="text-2xl font-medium">
              {status === STATUS.GENERATING
                ? 'Анализ совместимости...'
                : 'Ждем партнера...'}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};
