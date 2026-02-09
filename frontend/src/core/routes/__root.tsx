import { createRootRoute } from '@tanstack/react-router';
import { RootLayout } from '@/core/layouts/RootLayout';

export const Route = createRootRoute({
  component: RootLayout,
});
