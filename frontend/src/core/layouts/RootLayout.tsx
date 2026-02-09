import { Outlet } from '@tanstack/react-router';

import { Footer } from './Footer';
import { Header } from './Header';

export const RootLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
