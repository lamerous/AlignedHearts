import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { SignupForm } from '../components/SignupForm';

export const SignupView = () => {
  return (
    <section className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#FFF5F5]">
      <BackgroundBlobs />

      <div className="flex w-full justify-center px-4">
        <SignupForm />
      </div>
    </section>
  );
};
