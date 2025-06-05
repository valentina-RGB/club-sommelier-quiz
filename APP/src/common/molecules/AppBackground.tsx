import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../storage/themeStore';

interface AppBackgroundProps {
  children: ReactNode;
  variant?: 'solid' | 'gradient' | 'pattern';
  className?: string;
}

export function AppBackground({ 
  children, 
  variant = 'gradient',
  className = '' 
}: AppBackgroundProps) {
  const { theme } = useTheme();

  const getBackgroundClasses = () => {
    const baseClasses = 'min-h-screen min-h-[100dvh] transition-all duration-300 ease-in-out';
    
    switch (variant) {
      case 'solid':
        return `${baseClasses} bg-[var(--bg-primary)]`;
      
      case 'gradient':
        return `${baseClasses} bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)]`;
      
      case 'pattern':
        return `${baseClasses} bg-[var(--bg-primary)] relative`;
      
      default:
        return `${baseClasses} bg-[var(--bg-primary)]`;
    }
  };
  return (
    <motion.div 
      className={`${getBackgroundClasses()} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      key={theme} 
    >      {variant === 'pattern' && (
        <>
          <motion.div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--text-tertiary) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)]/80 via-transparent to-[var(--bg-secondary)]/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          />
        </>
      )}

      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-[var(--accent-primary)] rounded-full opacity-20"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      <motion.div 
        className="relative z-10 flex flex-col min-h-[100dvh]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
        <motion.div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-[var(--bg-primary)] to-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.div 
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        
        <motion.div
          className="absolute top-0 left-0 w-64 h-64 bg-gradient-radial from-[var(--accent-primary)]/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-radial from-[var(--accent-secondary)]/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.05, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 2,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  );
}
