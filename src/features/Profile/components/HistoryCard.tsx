import type { HistoryItem } from '../types/profile.types';

export const HistoryCard = ({ item }: { item: HistoryItem }) => (
  <div className="flex flex-col gap-6 rounded-[30px] bg-white/58 p-6 shadow-xl backdrop-blur-sm transition-transform hover:scale-[1.02]">
    <div>
      <h3 className="text-2xl font-bold break-all text-black">
        {item.text.length > 30 ? item.text.slice(0, 30) + '...' : item.text}
      </h3>
      <p className="mt-2 text-xl text-[#090909]">
        {new Date(item.created_at).toLocaleDateString('ru-RU')}
      </p>
    </div>
    <div className="rounded-[30px] bg-[#FFF0FA] p-4">
      <p className="line-clamp-6 text-base text-[#4A4A4A]">{item.ai_advice}</p>
    </div>
  </div>
);
