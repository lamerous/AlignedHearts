import { Link } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

import { ErrorMessage } from '../components/ErrorMessage';
import { HistoryAccordion } from '../components/HistoryAccordion';
import { HistoryDetail } from '../components/HistoryDetail';
import { Loader } from '../components/Loader';
import { useGetHistory } from '../hooks/useGetHistory';

export const HistoryView = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: history = [], isLoading, isError } = useGetHistory();

  const selectedItem = selectedId
    ? history.find(item => item.id === selectedId)
    : history[history.length - 1];

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  return (
    <div className="min-h-screen bg-[#F9EBEC] px-14 py-10">
      <Link
        to="/profile/me"
        className="mb-8 flex cursor-pointer items-center gap-2 text-[#4A4A4A] transition-colors hover:text-[#F61064]"
      >
        <ChevronLeft size={18} /> Вернуться в профиль
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <section className="lg:col-span-5">
          {selectedItem && <HistoryDetail item={selectedItem} />}
        </section>

        <section className="lg:col-span-7">
          <HistoryAccordion
            items={history}
            selectedId={String(selectedItem?.id ?? '')}
            onSelect={item => setSelectedId(item.id)}
          />
        </section>
      </div>
    </div>
  );
};
