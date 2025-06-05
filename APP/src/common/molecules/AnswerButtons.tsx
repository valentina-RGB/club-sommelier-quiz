import { motion } from 'framer-motion';
import { AnswerButton } from '../atoms/AnswerButton';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface AnswerButtonsProps {
  onAnswer: (answer: boolean) => void;
  isVisible?: boolean;
  disabled?: boolean;
  isWaiting?: boolean;
  className?: string;
}

export function AnswerButtons({ 
  onAnswer, 
  isVisible = true, 
  disabled = false,
  isWaiting = false,
  className = "" 
}: AnswerButtonsProps) {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    
    // Solo iniciar el temporizador si los botones deben ser visibles
    if (!isWaiting && isVisible && !disabled) {
      timer = setTimeout(() => {
        setShowButtons(true);
      }, 800);
    } else {
      // Si no deben ser visibles, asegurarnos que estén ocultos
      setShowButtons(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isWaiting, isVisible, disabled]);

  const handleAnswer = (answer: boolean) => {
    setShowButtons(false);
    setTimeout(() => {
      onAnswer(answer);
    }, 300);
  };

  // Si estamos esperando respuesta, mostrar loader
  if (isWaiting) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.4,
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        className={`
          flex flex-col items-center justify-center space-y-4 py-8
          ${className}
        `}
      >
        <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
        <p className="text-sm text-[var(--text-secondary)] text-center">
          Procesando tu respuesta...
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 20 
      }}
      transition={{ 
        delay: 0.5,
        duration: 0.6,
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className={`
        grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6
        w-full
        ${className}
      `}
    >
      <AnswerButton
        type="no"
        onAnswer={handleAnswer}
        isVisible={showButtons && isVisible}
        delay={0.1}
        disabled={disabled}
      />
      <AnswerButton
        type="yes"
        onAnswer={handleAnswer}
        isVisible={showButtons && isVisible}
        delay={0.2}
        disabled={disabled}
      />
    </motion.div>
  );
}