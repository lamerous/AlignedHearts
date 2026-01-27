import logoUrl from '@/core/assets/icons/logo.svg';
import { cn } from '@/core/lib/utils';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <img
      src={logoUrl}
      alt="Aligned Hearts Logo"
      className={cn('h-10 w-10', className)}
    />
  );
};
