import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

export type BadgeState = 'pending' | 'loading' | 'success' | 'error'

interface MultiStateBadgeProps {
  state: BadgeState
  text: string
  className?: string
  onClick?: () => void
  disabled?: boolean
}

const stateConfig = {
  pending: {
    icon: Clock,
    bgColor: 'bg-[var(--surface-secondary)]',
    textColor: 'text-[var(--text-secondary)]',
    borderColor: 'border-[var(--border-primary)]'
  },
  loading: {
    icon: Clock,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500/20'
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-green-500/20'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-500/20'
  }
}

export function MultiStateBadge({ 
  state, 
  text, 
  className = '', 
  onClick, 
  disabled = false 
}: MultiStateBadgeProps) {
  const config = stateConfig[state]
  const Icon = config.icon
  
  const isClickable = onClick && !disabled
    return (
    <motion.button
      onClick={onClick}
      disabled={disabled || !onClick}
      className={`
        inline-flex items-center justify-center 
        gap-2 sm:gap-3
        px-4 sm:px-6 lg:px-8
        py-3 sm:py-4
        rounded-full border
        font-medium 
        text-sm sm:text-base lg:text-lg
        min-h-[44px] sm:min-h-[48px]
        min-w-[120px] sm:min-w-[140px]
        transition-all duration-200
        touch-manipulation
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${isClickable ? 'hover:scale-105 cursor-pointer active:scale-95' : 'cursor-default'}
        ${disabled ? 'opacity-50' : ''}
        focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--bg-primary)]
        ${className}
      `}
      whileHover={isClickable ? { scale: 1.05 } : undefined}
      whileTap={isClickable ? { scale: 0.95 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        animate={state === 'loading' ? { rotate: 360 } : { rotate: 0 }}
        transition={
          state === 'loading' 
            ? { duration: 1, repeat: Infinity, ease: "linear" }
            : { duration: 0.3 }
        }
      >
        <Icon size={16} className="sm:w-5 sm:h-5" />
      </motion.div>
      <span className="font-medium">{text}</span>
    </motion.button>
  )
}
