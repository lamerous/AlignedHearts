import { FinalSection } from '../components/FinalSection';
import { HeroSection } from '../components/HeroSection';
import { InstructionSection } from '../components/InstructionSection';
import { PrivacySection } from '../components/PrivacySection';
import { ProgressTogetherSection } from '../components/ProgressTogetherSection';
import { TrustSection } from '../components/TrustSection';

export const HomeView = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F9EBEC]">
      <HeroSection />
      <InstructionSection />
      <TrustSection />
      <ProgressTogetherSection />
      <PrivacySection />
      <FinalSection />
    </div>
  );
};
