export const Background = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-[-20%] top-20 opacity-60">
        <div className="absolute top-[10%] left-[25%] h-[50%] w-[50%] rounded-full bg-[#F61064] blur-[120px] md:blur-[224px]" />
        <div className="absolute right-[5%] bottom-[5%] h-[50%] w-[50%] rounded-full bg-[#B456FF] blur-[120px] md:blur-[224px]" />
        <div className="absolute top-[15%] left-[5%] h-[40%] w-[40%] rounded-full bg-[#ECE0FF] blur-[120px] md:blur-[224px]" />
        <div className="absolute top-[45%] left-[15%] h-[30%] w-[40%] rounded-full bg-[#FADDF0] blur-[120px] md:blur-[224px]" />
        <div className="absolute bottom-[25%] left-[35%] h-[25%] w-[30%] rounded-full bg-[#9810FA] opacity-20 blur-[150px]" />
      </div>
    </div>
  );
};
