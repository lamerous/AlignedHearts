import { Loader2 } from 'lucide-react';

export const Loader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#F9EBEC]">
    <Loader2 className="h-20 w-20 animate-spin text-[#F61064]" />
  </div>
);
