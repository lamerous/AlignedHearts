import type { HistoryItem } from '../types/profile.types';

export const HistoryCard = ({ item }: { item: HistoryItem }) => (
  <div className="flex flex-col gap-6 rounded-[30px] bg-white/58 p-6 shadow-xl backdrop-blur-sm transition-transform hover:scale-[1.02]">
    <div>
      <h3 className="text-2xl font-bold text-black">
        {item.owner_text.slice(0, 20)}...
      </h3>
      <p className="mt-2 text-xl text-[#090909]">
        {new Date(item.created_at).toLocaleDateString('ru-RU')}
      </p>
    </div>
    <div className="rounded-[30px] bg-[#FFF0FA] p-4">
      <p className="line-clamp-6 text-base text-[#4A4A4A]">{item.owner_text}</p>
    </div>
  </div>
);
