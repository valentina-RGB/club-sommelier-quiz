import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { forwardRef } from 'react'

interface InputFieldProps {
  label: string
  type?: 'text' | 'email' | 'tel'
  placeholder?: string
  icon?: LucideIcon
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  className?: string
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ 
    label, 
    type = 'text', 
    placeholder, 
    icon: Icon, 
    value, 
    onChange, 
    error, 
    required = false, 
    className = '' 
  }, ref) => {
    return (
      <motion.div
        className={`w-full ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >        
        <label className="block text-sm sm:text-base font-medium text-[var(--text-primary)] mb-2 px-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-1   flex items-center pointer-events-none z-10">
              <Icon 
                size={18} 
                className="text-[var(--text-secondary)] sm:w-5 sm:h-5" 
              />
            </div>
          )}
          
          <motion.input
            ref={ref}
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={`
              block w-full rounded-lg border
              ${Icon ? 'pl-11 sm:pl-[24vh]' : 'pl-3 sm:pl-4'} 
              pr-3 sm:pr-4 
              py-3 sm:py-4
              text-base sm:text-lg
              bg-[var(--surface-primary)]
              border-[var(--border-primary)]
              text-[var(--text-primary)]
              placeholder:text-[var(--text-tertiary)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--accent-primary)]
              focus:border-transparent
              transition-all duration-200
              touch-manipulation
            
              ${error ? 'border-red-500 focus:ring-red-500' : ''}
            `}
            style={{
              fontSize: '16px', // Prevent zoom on iOS
              paddingLeft: Icon? '4vh' : '10px',
            }}
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    )
  }
)

InputField.displayName = 'InputField'
