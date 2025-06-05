import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Tabs from '@radix-ui/react-tabs'
import { User, Mail, Phone, ArrowRight, ArrowLeft } from 'lucide-react'
import { SplitTextWelcome } from '../../atoms/SplitTextWelcome'
import { InputField } from '../../atoms/InputField'
import { Button } from '../../atoms/Button'
import { MultiStateBadge, BadgeState } from '../../atoms/MultiStateBadge'
import { useRegisterParticipant } from '@/api/mutations/participant.mutation';
import {Participant} from '@/api/types/participant.type';


interface WelcomeFormProps {
  onComplete?: (userData: Participant) => void
  className?: string
  isRegistering?: boolean 
}

export function WelcomeForm({ 
  onComplete, 
  className = '', 
  isRegistering = false 
}: WelcomeFormProps) {
  const [currentTab, setCurrentTab] = useState('name')
  const [userData, setUserData] = useState<Participant>({
    name: '',
    email: '',
    phone: ''
  })
  const [errors, setErrors] = useState<Partial<Participant>>({})
  const [submitState, setSubmitState] = useState<BadgeState>('pending')

  const tabs = [
    { id: 'name', label: 'Nombre', icon: User, field: 'name' as keyof Participant },
    { id: 'email', label: 'Correo', icon: Mail, field: 'email' as keyof Participant },
    { id: 'phone', label: 'Teléfono', icon: Phone, field: 'phone' as keyof Participant }
  ]

  const currentTabIndex = tabs.findIndex(tab => tab.id === currentTab)
  const isLastTab = currentTabIndex === tabs.length - 1
  const isFirstTab = currentTabIndex === 0

  const validateField = (field: keyof Participant, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) {
          return 'El nombre es obligatorio';
        }
        if (value.trim().length < 3) {
          return 'El nombre debe tener al menos 3 caracteres';
        }
        return undefined;
        
      case 'email':
        if (!value.trim()) {
          return 'El correo electrónico es obligatorio';
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
          return 'Formato de correo electrónico inválido';
        }
        return undefined;
        
      case 'phone':
        if (!value.trim()) {
          return 'El número de teléfono es obligatorio';
        }

        const phoneRegex = /^(\+?\d{1,3})?[-.\s]?(\d{3,4})[-.\s]?(\d{3,4})[-.\s]?(\d{0,4})$/;
        if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
          return 'Formato de teléfono inválido. Ingresa un número válido';
        }        
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length < 8) {
          return 'El número debe tener al menos 8 dígitos';
        }
        
        return undefined;
        
      default:
        return undefined;
    }
  }

  const handleNext = () => {
    const currentField = tabs[currentTabIndex].field
    const error = validateField(currentField, userData[currentField])
    
    if (error) {
      setErrors(prev => ({ ...prev, [currentField]: error }))
      return
    }
    
    setErrors(prev => ({ ...prev, [currentField]: undefined }))
    
    if (isLastTab) {
      handleSubmit()
    } else {
      setCurrentTab(tabs[currentTabIndex + 1].id)
    }
  }

  const handlePrevious = () => {
    if (!isFirstTab) {
      setCurrentTab(tabs[currentTabIndex - 1].id)
    }
  }

  const handleSubmit = async () => {
    setSubmitState('loading')
    
    if (!isRegistering) {
      setTimeout(() => {
        setSubmitState('success')
        onComplete?.(userData)
      }, 1500)
    } else {
      onComplete?.(userData)
    }
  }

  const updateUserData = (field: keyof Participant, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className={`w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto ${className}`}>
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <SplitTextWelcome 
          text="¡Bienvenido a Realidad o Mito!" 
          className="mb-3 sm:mb-4 lg:mb-6"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-[var(--text-secondary)] text-center text-xs sm:text-sm lg:text-base px-2"
        >
          Completa tu información para comenzar
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mb-6 sm:mb-8 lg:mb-10"
      >
        <div className="flex justify-center items-center mb-3 sm:mb-4">
          {tabs.map((tab, index) => (
            <div key={tab.id} className="flex items-center">
              <motion.div 
                className={`
                  w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10
                  rounded-full flex items-center justify-center 
                  text-xs sm:text-sm lg:text-base font-bold
                  transition-all duration-300 ease-out
                  ${index <= currentTabIndex 
                    ? 'bg-[var(--accent-primary)] text-white shadow-lg scale-110' 
                    : 'bg-[var(--surface-secondary)] text-[var(--text-tertiary)] scale-100'
                  }
                `}
                animate={{
                  scale: index === currentTabIndex ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.3 }}
              >
                {index < currentTabIndex ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    ✓
                  </motion.span>
                ) : (
                  index + 1
                )}
              </motion.div>
              
              {index < tabs.length - 1 && (
                <motion.div 
                  className={`
                    w-8 sm:w-12 lg:w-16 h-0.5 mx-2 sm:mx-3 lg:mx-4
                    transition-all duration-500 ease-out
                    ${index < currentTabIndex 
                      ? 'bg-[var(--accent-primary)] opacity-100' 
                      : 'bg-[var(--border-primary)] opacity-50'
                    }
                  `}
                  animate={{
                    scaleX: index < currentTabIndex ? 1 : 0.7
                  }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <motion.div 
            className="text-xs sm:text-sm lg:text-base font-medium text-[var(--text-secondary)]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Paso {currentTabIndex + 1} de {tabs.length}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="mb-6 sm:mb-8 lg:mb-10"
      >
        <Tabs.Root value={currentTab} onValueChange={setCurrentTab}>
          <AnimatePresence mode="wait">
            {tabs.map((tab) => (
              <Tabs.Content key={tab.id} value={tab.id}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 sm:space-y-6 lg:space-y-8"
                >
                  <div className="relative">
                    <InputField
                      label={tab.label}
                      type={tab.field === 'email' ? 'email' : tab.field === 'phone' ? 'tel' : 'text'}
                      placeholder={
                        tab.field === 'name' ? 'Mínimo 3 caracteres' :
                        tab.field === 'email' ? 'ejemplo@correo.com' :
                        'Ej: +57 300 123 4567'
                      }
                      icon={tab.icon}
                      value={userData[tab.field]}
                      onChange={(value) => updateUserData(tab.field, value)}
                      error={errors[tab.field]}
                      required
                      className="text-base sm:text-lg"
                    />
                  </div>
                </motion.div>
              </Tabs.Content>
            ))}
          </AnimatePresence>
        </Tabs.Root>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0"
      >
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstTab}
          className={`
            w-full sm:w-auto order-2 sm:order-1
            min-h-[44px] sm:min-h-[40px] lg:min-h-[44px]
            text-sm sm:text-base
            ${isFirstTab ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
          size="sm"
        >
          <ArrowLeft size={16} className="mr-2" />
          <span className="hidden sm:inline">Anterior</span>
          <span className="sm:hidden">Atrás</span>
        </Button>

        <div className="w-full sm:w-auto order-1 sm:order-2">
          {isLastTab ? (
            <MultiStateBadge
              state={isRegistering ? 'loading' : submitState}
              text={
                isRegistering ? 'Registrando...' :
                submitState === 'pending' ? 'Comenzar' :
                submitState === 'loading' ? 'Iniciando...' :
                '¡Listo!'
              }
              onClick={submitState === 'pending' ? handleNext : undefined}
              disabled={isRegistering || submitState !== 'pending'}
              className="w-full sm:w-auto min-h-[44px] text-base sm:text-lg font-bold"
            />
          ) : (
            <Button 
              onClick={handleNext}
              className="
                w-full sm:w-auto 
                min-h-[44px] sm:min-h-[40px] lg:min-h-[44px]
                text-base sm:text-lg font-semibold
                bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)]
                hover:scale-105 active:scale-95
                transition-all duration-200
              "
              size="sm"
            >
              <span className="mr-2">Siguiente</span>
              <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
