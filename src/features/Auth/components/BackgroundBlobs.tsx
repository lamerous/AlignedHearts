export const BackgroundBlobs = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40 select-none">
    <div className="absolute -top-[10%] left-[10%] h-150 w-200 rounded-full bg-[#F61064] opacity-60 blur-[180px]" />
    <div className="absolute top-[5%] right-[5%] h-125 w-175 rounded-full bg-[#B456FF] opacity-50 blur-[180px]" />

    <div className="absolute top-[30%] left-[-10%] h-175 w-225 rounded-full bg-[#ECE0FF] blur-[200px]" />
    <div className="absolute top-[25%] right-[20%] h-125 w-150 rounded-full bg-[#FADDF0] blur-[180px]" />

    <div className="absolute bottom-[10%] left-[20%] h-150 w-200 rounded-full bg-[#B456FF] opacity-40 blur-[180px]" />
    <div className="absolute right-[-5%] -bottom-[5%] h-125 w-175 rounded-full bg-[#F61064] opacity-50 blur-[180px]" />
  </div>
);
