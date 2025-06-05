import { ReactNode } from 'react';
import { AppBackground } from '../../molecules/AppBackground';
import { ThemeToggle } from '../../atoms/ThemeToggle';

interface MainLayoutProps {
  children: ReactNode;
  showThemeToggle?: boolean;
  backgroundVariant?: 'solid' | 'gradient' | 'pattern';
  className?: string;
}

export function MainLayout({ children, showThemeToggle = true, backgroundVariant = 'gradient', className = '' }: MainLayoutProps) {
  return (
    <AppBackground variant={backgroundVariant}>
      <div className={`relative  flex flex-col  min-h-[100dvh] ${className}`}>
        {showThemeToggle && (
          <header className="fixed top-0 right-0 z-50 p-4 md:p-6">
            <ThemeToggle size="md" />
          </header>
        )}

        <main className={`flex-1 flex flex-col w-full `}>
          <div className="pt-safe-area-inset-top pb-safe-area-inset-bottom">
            {children}
          </div>
        </main>
      </div>
    </AppBackground>
  );
}



