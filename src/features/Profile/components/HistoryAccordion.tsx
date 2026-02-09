import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/core/ui/accordion';

import type { HistoryItem } from '../types/profile.types';

interface Props {
  items: HistoryItem[];
  selectedId: string;
  onSelect: (item: HistoryItem) => void;
}

export const HistoryAccordion = ({ items, selectedId, onSelect }: Props) => {
  const displayItems = [...items].reverse();

  return (
    <div className="custom-scrollbar h-screen overflow-y-auto pr-2">
      <Accordion
        type="single"
        collapsible
        value={selectedId}
        className="flex flex-col gap-4 pb-10"
      >
        {displayItems.map(item => (
          <AccordionItem
            key={item.id}
            value={String(item.id)}
            className="rounded-[30px] border-none bg-[#F9F9F9] px-6 break-all shadow-md transition-all data-[state=open]:bg-white"
          >
            <AccordionTrigger
              className="group cursor-pointer py-6 hover:no-underline [&[data-state=open]>svg]:rotate-180"
              onClick={() => onSelect(item)}
            >
              <div className="flex w-full items-center justify-between gap-4 pr-2 text-left">
                <span className="line-clamp-2 flex-1 text-xl leading-tight font-medium text-black">
                  {item.owner_text}
                </span>

                <span className="shrink-0 text-base text-[#7F7F7F]">
                  {new Date(item.created_at).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-6">
              <div className="rounded-[30px] bg-[#FFF0FA] p-6 text-lg leading-relaxed text-[#4A4A4A]">
                {item.ai_advice}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
