import { motion } from 'framer-motion';
import { SplitTextWelcome } from './SplitTextWelcome';

interface QuestionCardProps {
  question: string;
  questionNumber?: number;
  totalQuestions?: number;
  className?: string;
}

export function QuestionCard({ 
  question, 
  questionNumber = 1, 
  totalQuestions = 10,
  className = "" 
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        duration: 0.6 
      }}
      className={`
        bg-[var(--surface-primary)]/95 
        backdrop-blur-sm 
        rounded-2xl sm:rounded-3xl
        p-4 sm:p-6 lg:p-8
        shadow-lg sm:shadow-xl lg:shadow-2xl 
        border border-[var(--border-primary)]
        w-full
        min-h-[120px] sm:min-h-[140px]
        flex flex-col justify-center
        ${className}
      `}
    >
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
            Pregunta {questionNumber} de {totalQuestions}
          </div>
          <div className="w-12 sm:w-16 bg-[var(--surface-tertiary)] rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-[var(--accent-primary)] h-full rounded-full transition-all duration-500"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <SplitTextWelcome 
          text={question}
          animationDelay={300}
          className="w-full"
        />
      </div>
    </motion.div>
  );
}