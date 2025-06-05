import { AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../storage/themeStore';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  };
  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        inline-flex items-center justify-center
        rounded-full
        bg-[var(--surface-secondary)]
        border border-[var(--border-primary)]
        text-[var(--text-primary)]
        transition-colors duration-200 ease-in-out
        hover:bg-[var(--surface-tertiary)]
        hover:border-[var(--border-accent)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--accent-primary)]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--bg-primary)]
        overflow-hidden
        ${className}
      `}
      aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
      type="button"
      whileTap={{ scale: 0.95, y: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 90 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 20,
              duration: 0.3
            }}
          >
            <Sun 
              size={iconSize[size]} 
              className="text-yellow-500"
            />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, scale: 0, rotate: 90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: -90 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 20,
              duration: 0.3
            }}
          >
            <Moon 
              size={iconSize[size]} 
              className="text-blue-400"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
