import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface AnswerButtonProps {
  type: 'yes' | 'no';
  onAnswer: (answer: boolean) => void;
  isVisible?: boolean;
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export function AnswerButton({ 
  type, 
  onAnswer, 
  isVisible = true, 
  delay = 0,
  disabled = false,
  className = "" 
}: AnswerButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const isYes = type === 'yes';
  const answer = isYes;

  const handleClick = () => {
    if (disabled) return;
    setIsPressed(true);
    setTimeout(() => {
      onAnswer(answer);
      setIsPressed(false);
    }, 150);
  };

  const buttonConfig = {
    yes: {
      text: 'REALIDAD',
      icon: Check,
      colors: {
        bg: 'bg-green-500/90 hover:bg-green-600/90',
        border: 'border-green-400/50 hover:border-green-300',
        text: 'text-white',
        shadow: 'shadow-green-500/25'
      }
    },
    no: {
      text: 'MITO',
      icon: X,
      colors: {
        bg: 'bg-red-500/90 hover:bg-red-600/90',
        border: 'border-red-400/50 hover:border-red-300',
        text: 'text-white',
        shadow: 'shadow-red-500/25'
      }
    }
  };

  const config = buttonConfig[type];
  const IconComponent = config.icon;

  return (
    <AnimatePresence initial={false}>
      {isVisible ? (
        <motion.button
          initial={{ opacity: 0, scale: 0, rotate: isYes ? -15 : 15 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 20,
              delay: delay
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 0, 
            rotate: isYes ? 15 : -15,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.85, 
            y: 2,
            transition: { duration: 0.1 }
          }}
          whileHover={{ 
            scale: 1.05,
            y: -2,
            transition: { duration: 0.2 }
          }}
          onClick={handleClick}
          disabled={disabled}
          className={`
            ${config.colors.bg}
            ${config.colors.border}
            ${config.colors.text}
            border-2
            rounded-2xl sm:rounded-3xl
            p-4 sm:p-6 lg:p-8
            w-full
            min-h-[120px] sm:min-h-[140px]
            flex flex-col items-center justify-center
            font-bold text-lg sm:text-xl lg:text-2xl
            transition-all duration-200
            shadow-lg sm:shadow-xl ${config.colors.shadow}
            backdrop-blur-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--accent-primary)]
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[var(--bg-primary)]
            ${isPressed ? 'animate-pulse' : ''}
            ${className}
          `}
          aria-label={`Responder ${config.text}`}
          type="button"
        >
          <motion.div
            animate={{
              scale: isPressed ? [1, 1.2, 1] : 1,
              rotate: isPressed ? [0, 10, 0] : 0
            }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center space-y-2 sm:space-y-3"
          >
            <IconComponent 
              size={32} 
              className="sm:w-10 sm:h-10 lg:w-12 lg:h-12" 
            />
            <span className="tracking-wide">
              {config.text}
            </span>
          </motion.div>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}