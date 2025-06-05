import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/common/widgets/clients/main-layout.widget';
import { WelcomeForm } from '@/common/widgets/clients/welcome-form.widget';
import { motion } from 'framer-motion';
import { useQuestionnaire } from '@/api/query/quiz.queries';
import { useEventByCodeQuery } from '@/api/query/events.queries';
import { useRegisterParticipant } from '@/api/mutations/participant.mutation';
import { Participant } from '@/api/types/participant.type';

export function HomeView() {
  const [userData, setUserData] = useState<Participant | null>(null);
  const [questionnaireId, setQuestionnaireId] = useState<number | null>(null);
  const [backendErrorMessage, setBackendErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();
  const eventCode = searchParams.get('code');
  
  const { 
    mutate: registerParticipant, 
    isPending: isRegistering, 
    isError: registrationError,
    error: registrationErrorData
  } = useRegisterParticipant();
  
  const { 
    data: eventData, 
    isLoading: eventLoading, 
    error: eventError 
  } = useEventByCodeQuery(eventCode || null);

  useEffect(() => {
    if (eventData && eventData.questionnaire_id) {
      setQuestionnaireId(eventData.questionnaire_id);
    }
  }, [eventData]);

  const { 
    data: questionnaire, 
    isLoading: questionnaireLoading, 
    error: questionnaireError 
  } = useQuestionnaire(questionnaireId!);

  const formatEventDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleWelcomeComplete = (data: Participant) => {
    setUserData(data);
    
    if (!eventCode) return;
    
    const participantData = {
      fullName: data.name.trim(),       
      email: data.email.trim().toLowerCase(),
      numberPhone: data.phone.replace(/\s+/g, '')
    };
    
    registerParticipant(
      { 
        eventCode, 
        participantData 
      },
      {
        onSuccess: (response) => {
          console.log('Participante registrado exitosamente:', response);
          
          navigate('/waiting', { 
            state: { 
              userData: data,
              questionnaireId: questionnaireId,
              accessCode: eventCode,
              eventId: eventData?.id,
              participantId: response.id 
            } 
          });
        },
        onError: (error: any) => {
          console.error('Error al registrar participante:', error);
          
          if (error.response?.data?.errors) {
            const backendErrors = error.response.data.errors;
            
            const errorMessages = backendErrors.map((err: any) => {
              switch (err.param) {
                case 'fullName': 
                  return `Nombre: ${err.msg}`;
                case 'email':
                  return `Correo: ${err.msg}`;
                case 'numberPhone':
                  return `Teléfono: ${err.msg}`;
                default:
                  return err.msg;
              }
            }).join('. ');
            
            setBackendErrorMessage(errorMessages);
          }
        }
      }
    );
  };

  if (!eventCode) {
    return (
      <MainLayout backgroundVariant="gradient">
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="text-4xl sm:text-6xl">⚠️</div>
              <h1 className="text-lg sm:text-xl font-bold text-yellow-600">
                Código de evento requerido
              </h1>
              <p className="text-sm sm:text-base text-yellow-600/80">
                Se requiere un código de evento para acceder al cuestionario.
              </p>
              <button
                onClick={() => window.history.back()}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm sm:text-base"
              >
                Volver atrás
              </button>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (eventError) {
    return (
      <MainLayout backgroundVariant="gradient">
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="text-4xl sm:text-6xl">❌</div>
              <h1 className="text-lg sm:text-xl font-bold text-red-600">
                Evento no encontrado
              </h1>
              <p className="text-sm sm:text-base text-red-600/80">
                El código de evento '<span className="font-mono font-medium">{eventCode}</span>' no es válido o el evento no está disponible.
              </p>
              <button
                onClick={() => window.history.back()}
                className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
              >
                Volver atrás
              </button>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (eventLoading) {
    return (
      <MainLayout backgroundVariant="gradient">
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-[var(--surface-secondary)]/80 backdrop-blur-sm border border-[var(--border-primary)]/30 rounded-xl sm:rounded-2xl p-5 sm:p-6"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
              <h2 className="text-base sm:text-lg font-medium text-[var(--text-primary)]">
                Verificando evento...
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
                Validando el código: <span className="font-mono font-medium">{eventCode}</span>
              </p>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (questionnaireError) {
    return (
      <MainLayout backgroundVariant="gradient">
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="text-4xl sm:text-6xl">❌</div>
              <h1 className="text-lg sm:text-xl font-bold text-red-600">
                Cuestionario no encontrado
              </h1>
              <p className="text-sm sm:text-base text-red-600/80">
                El cuestionario asociado a este evento no existe o no está disponible.
              </p>
              <button
                onClick={() => window.history.back()}
                className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
              >
                Volver atrás
              </button>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout backgroundVariant="gradient">
      <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="w-full max-w-[320px] sm:max-w-md lg:max-w-lg xl:max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              type: "spring", 
              stiffness: 100, 
              damping: 20 
            }}
            className="relative"
          >
            <div className="
              bg-[var(--surface-primary)]/95 
              backdrop-blur-md 
              rounded-2xl sm:rounded-3xl
              p-4 sm:p-6 lg:p-8
              shadow-xl sm:shadow-2xl
              border border-[var(--border-primary)]/80
              w-full
              relative
              overflow-hidden
            ">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 via-transparent to-[var(--accent-secondary)]/5 rounded-2xl sm:rounded-3xl" />
              
              <div className="relative z-10 space-y-4 sm:space-y-6">
                {questionnaireLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-4 bg-[var(--surface-secondary)]/50 rounded-xl"
                  >
                    <div className="w-4 h-4 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                      Cargando información del evento...
                    </p>
                  </motion.div>
                )}

                {questionnaire && eventData && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl overflow-hidden"
                  >
                    <div className="text-center p-4 sm:p-5 bg-[var(--surface-secondary)]/50 rounded-t-xl space-y-2 sm:space-y-3">
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-[var(--text-primary)] leading-tight">
                        {eventData.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2">
                        {questionnaire.description}
                      </p>
                    </div>
                  </motion.div>
                )}

                {questionnaire && !questionnaireLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="pt-2 xs:pt-3 sm:pt-4"
                  >
                    <WelcomeForm 
                      onComplete={handleWelcomeComplete}
                      className="w-full"
                      isRegistering={isRegistering} 
                    />
                    
                    {registrationError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs sm:text-sm text-red-500 text-center"
                      >
                        Error al registrar: Por favor intenta nuevamente.
                      </motion.div>
                    )}

                    {backendErrorMessage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs sm:text-sm text-red-500 text-center"
                      >
                        {backendErrorMessage}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {questionnaireLoading && (
                  <div className="text-center p-4">
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                      Esperando validación del cuestionario...
                    </p>
                  </div>
                )}
              </div>

              <div className="absolute -top-10 -right-10 w-20 h-20 sm:w-32 sm:h-32 bg-[var(--accent-primary)]/10 rounded-full blur-2xl hidden sm:block" />
              <div className="absolute -bottom-10 -left-10 w-16 h-16 sm:w-24 sm:h-24 bg-[var(--accent-secondary)]/10 rounded-full blur-2xl hidden sm:block" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="h-safe-area-inset-bottom sm:hidden" />
    </MainLayout>
  );
}
