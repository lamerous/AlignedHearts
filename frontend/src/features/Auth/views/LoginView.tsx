import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { LoginForm } from '../components/LoginForm';

export const LoginView = () => {
  return (
    <section className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#FFF5F5]">
      <BackgroundBlobs />

      <div className="flex w-full justify-center px-4">
        <LoginForm />
      </div>
    </section>
  );
};
