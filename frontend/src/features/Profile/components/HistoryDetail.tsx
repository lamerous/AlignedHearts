import type { HistoryItem } from '../types/profile.types';

interface Props {
  item: HistoryItem;
}

export const HistoryDetail = ({ item }: Props) => (
  <div className="flex flex-col gap-6 rounded-[30px] bg-white/60 p-6 shadow-xl backdrop-blur-md">
    <div className="flex flex-col gap-2">
      <h1 className="text-[28px] leading-tight font-bold break-all text-black">
        {item.text.slice(0, 50)}...
      </h1>
      <span className="text-xl text-[#090909]/70">
        {new Date(item.created_at).toLocaleString('ru-RU')}
      </span>
    </div>

    <div className="rounded-[30px] bg-[#FFF0FA] p-5">
      <p className="text-base leading-relaxed break-all text-[#4A4A4A]">
        {item.text}
      </p>
    </div>

    <div className="flex flex-col gap-4">
      <div className="rounded-[30px] bg-[#FFD2E4]/95 p-6 shadow-sm">
        <h3 className="mb-2 text-xl font-semibold text-black">ИИ Совет:</h3>
        <p className="text-base text-black/80">
          {item.ai_advice || 'Загрузка рекомендаций...'}
        </p>
      </div>
    </div>
  </div>
);
