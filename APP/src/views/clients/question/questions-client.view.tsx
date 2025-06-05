import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuestionnaire } from '@/api/query/quiz.queries';
import { MainLayout } from '@/common/widgets/clients/main-layout.widget';
import { ResultsType, useEventSocketParticipant } from '@/common/hooks/useEventSocket';
import { QuestionCard } from '@/common/atoms/QuestionCard';
import { CheckCircle, Mail, XCircle } from 'lucide-react';
import { AnswerButtons } from '@/common/molecules/AnswerButtons';
import { ParticipantsRanking } from '@/common/molecules/ParticipantsRanking';
import { LiveRankingWidget } from '@/common/molecules/LiveRankingWidget';

interface LocationState {
  questionnaireId: number;
  participantId: string;
  accessCode: string;
}

export function QuestionsView() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { questionnaireId, participantId, accessCode } = state as LocationState;
  const [shareOptions, setShareOptions] = useState({
    show: false,
    text: '',
    links: {
      whatsapp: '',
      facebook: '',
      email: ''
    }
  });

  const { data: questionnaire } = useQuestionnaire(questionnaireId);

  const {
    currentQuestion,
    answerAck,
    submitAnswer,
    noMoreQuestions,
    eventEnded,
    results,
    eventStarted,
    isConnected,
    requestCurrentQuestion
  } = useEventSocketParticipant(accessCode, participantId);

  const [showFeedback, setShowFeedback] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [hasAnsweredCurrentQuestion, setHasAnsweredCurrentQuestion] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [isRequestingCurrentState, setIsRequestingCurrentState] = useState(false);

  // Registro de preguntas respondidas
  const answeredQuestions = useRef<Set<number>>(new Set());

  // Solicitar la pregunta actual cuando estamos conectados pero no tenemos pregunta
  useEffect(() => {
    if (isConnected && eventStarted && !currentQuestion && !isRequestingCurrentState) {
      setIsRequestingCurrentState(true);
      requestCurrentQuestion();

      const timeout = setTimeout(() => {
        setIsRequestingCurrentState(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isConnected, eventStarted, currentQuestion, requestCurrentQuestion]);

  // Validación de parámetros de ruta
  useEffect(() => {
    if (!questionnaireId || !participantId || !accessCode) {
      navigate('/', { replace: true });
    }
  }, [questionnaireId, participantId, accessCode, navigate]);

  // Manejo de confirmación de respuesta
  useEffect(() => {
    if (answerAck && currentQuestionId) {
      setIsWaitingForResponse(false);
      setHasAnsweredCurrentQuestion(true);

      // Guardar la pregunta en el registro de respondidas
      answeredQuestions.current.add(currentQuestionId);

      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  }, [answerAck, currentQuestionId]);

  // Reset de estados cuando llega una nueva pregunta
  useEffect(() => {
    if (currentQuestion && currentQuestion.questionId !== currentQuestionId) {
      setCurrentQuestionId(currentQuestion.questionId);

      // Verificar si ya respondimos esta pregunta antes
      const alreadyAnswered = answeredQuestions.current.has(currentQuestion.questionId);

      setIsWaitingForResponse(false);
      setShowFeedback(false);
      setHasAnsweredCurrentQuestion(alreadyAnswered);
    }
  }, [currentQuestion, currentQuestionId]);

  // Manejo de respuesta del usuario
  const handleAnswer = (answer: boolean) => {
    if (!currentQuestion || hasAnsweredCurrentQuestion ||
      answeredQuestions.current.has(currentQuestion.questionId)) return;

    setIsWaitingForResponse(true);
    submitAnswer(currentQuestion.questionId, answer);
  };



  const handleShareResults = (data: ResultsType[]) => {
    // Sort participants by score (highest first)
    const sortedResults = [...data].sort((a, b) => b.total - a.total);

    // Format the current participant's result
    const participantResult = data.find(r => r.participant.id.toString() === participantId);
    const totalQuestions = questionnaire?.questions?.length || 0;
    const percentage = participantResult
      ? Math.round((participantResult.total / totalQuestions) * 100)
      : 0;

    // Create the basic share text
    let shareText = `¡He completado el quiz "${questionnaire?.title}"! 🎯\n` +
      `Mi puntuación: ${participantResult?.total || 0} pts (${percentage}%)\n\n`;

    // Add the leaderboard with all participants
    shareText += `📊 Resultados finales:\n`;

    // Add each participant's result to the share text
    sortedResults.forEach((result, index) => {
      const isCurrentUser = result.participant.id.toString() === participantId;
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      const userMarker = isCurrentUser ? ' ← Yo' : '';

      // Format the percentage
      const userPercentage = Math.round((result.total / totalQuestions) * 100);

      // Add the line for this participant
      shareText += `${medal} ${result.participant.fullName}: ${result.total} pts (${userPercentage}%)${userMarker}\n`;
    });

    // Add hashtags
    shareText += `\n#QuizApp #${questionnaire?.title.replace(/\s+/g, '')}`;

    // Try using Web Share API first (works on mobile devices)
    if (navigator.share) {
      navigator.share({
        title: `Resultados del Quiz "${questionnaire?.title}"`,
        text: shareText,
      }).catch(err => console.error('Error sharing:', err));
      return;
    }

    // Fallback methods with direct links
    const encodedText = encodeURIComponent(shareText);

    // Open sharing options in a modal/popup
    setShareOptions({
      show: true,
      text: shareText,
      links: {
        whatsapp: `https://wa.me/?text=${encodedText}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedText}`,
        email: `mailto:?subject=${encodeURIComponent(`Resultados del Quiz "${questionnaire?.title}"`)}&body=${encodedText}`
      }
    });
  };

  // Estados de carga y espera
  if (!questionnaire) {
    return (
      <MainLayout backgroundVariant="gradient">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[var(--text-secondary)]">Cargando cuestionario...</p>
          </div>
        </div>
      </MainLayout>
    );
  }


  if (eventEnded && results) {
    return (
      <MainLayout backgroundVariant="gradient">
        <div className="max-h-[85vh] overflow-y-auto flex items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl mx-auto text-center space-y-8"
          >
            {/* Header - outside of the map to avoid repetition */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">¡Resultados del Quiz!</h1>
              <p className="text-lg text-[var(--text-secondary)]">
                Gracias por participar en <span className="font-semibold">{questionnaire.title}</span>
              </p>
            </motion.div>

            {/* Results container */}
            <div className="space-y-6">
              {results.map((result, index) => (
                <motion.div
                  key={`result-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  className="rounded-2xl border border-white/20 p-6 bg-white/10 backdrop-blur-md shadow-lg"
                >
                  {/* Participant info */}
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-3 sm:mb-0">
                      <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
                        <span className="text-xl font-bold text-[var(--accent-primary)]">
                          {result.participant.fullName.charAt(0)}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                        {result.participant.fullName}
                      </h2>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/30">
                      <span className="text-lg font-bold text-[var(--accent-primary)]">
                        {result.total} pts
                      </span>
                    </div>
                  </div>

                  {/* Score visualization */}
                  <div className="mb-4">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-sm text-[var(--text-secondary)]">Puntuación</span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {Math.round((result.total / (questionnaire.questions?.length || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.round((result.total / (questionnaire.questions?.length || 1)) * 100)}%`
                        }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="h-full bg-[var(--accent-primary)] rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary)]/80 transition-colors"
              >
                Volver al inicio
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={() => handleShareResults(results)}
                className="px-6 py-3  bg-indigo-300 border border-white/20 text-white rounded-lg hover:bg-indigo-400 transition-colors"
              >
                Compartir resultados
              </motion.button>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }



  {
    shareOptions.show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => setShareOptions(prev => ({ ...prev, show: false }))}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={e => e.stopPropagation()}
          className="bg-[var(--background-secondary)] rounded-2xl p-6 max-w-md w-full shadow-xl"
        >
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Compartir resultados</h3>

          <div className="mb-5 p-4 bg-[var(--background-primary)]/50 rounded-xl">
            <p className="text-[var(--text-secondary)] whitespace-pre-line">{shareOptions.text}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <a
              href={shareOptions.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-green-600/90 hover:bg-green-600 text-white rounded-xl transition-colors"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm.029 18.88a7.056 7.056 0 01-3.395-.864l-3.768 1.118 1.138-3.81A7.04 7.04 0 015.02 11.811a7.02 7.02 0 017.004-7.022 6.99 6.99 0 014.971 2.059 6.987 6.987 0 012.059 4.975c-.001 3.865-3.155 7.058-7.025 7.058z" />
              </svg>
              Compartir por WhatsApp
            </a>

            <a
              href={shareOptions.links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-blue-600/90 hover:bg-blue-600 text-white rounded-xl transition-colors"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Compartir por Facebook
            </a>

            <a
              href={shareOptions.links.email}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-[var(--accent-primary)]/90 hover:bg-[var(--accent-primary)] text-white rounded-xl transition-colors"
            >
              <Mail className="w-6 h-6" />
              Compartir por Email
            </a>
          </div>

          <button
            className="w-full mt-5 p-3 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
            onClick={() => setShareOptions(prev => ({ ...prev, show: false }))}
          >
            Cerrar
          </button>
        </motion.div>
      </motion.div>)
  }

  if (eventStarted && !currentQuestion) {
    return (
      <MainLayout backgroundVariant="gradient">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto px-4">
            <div className="w-12 h-12 border-3 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              ¡El evento ha comenzado!
            </h2>
            <p className="text-[var(--text-secondary)]">
              {isRequestingCurrentState
                ? "Conectando a la pregunta actual..."
                : "Esperando la siguiente pregunta..."}
            </p>

            {!isRequestingCurrentState && (
              <button
                onClick={() => {
                  setIsRequestingCurrentState(true);
                  requestCurrentQuestion();
                  setTimeout(() => setIsRequestingCurrentState(false), 5000);
                }}
                className="mx-auto mt-4 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary)]/80 transition-colors"
              >
                Conectar con el evento
              </button>
            )}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (eventEnded) {
    return (
      <MainLayout backgroundVariant="gradient">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="w-16 h-16 mx-auto bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[var(--accent-primary)]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                ¡El evento ha finalizado!
              </h2>
              <p className="text-[var(--text-secondary)]">
                Gracias por participar. Los resultados han sido registrados.
              </p>
            </div>

            {results.length > 0 && (
              <div className="mt-8">
                <ParticipantsRanking
                  participants={results}
                  currentParticipantId={participantId}
                  title="Resultados finales"
                  maxToShow={10}
                  showMedals={true}
                  animate={true}
                />
              </div>
            )}

            <button
              onClick={() => navigate('/', { replace: true })}
              className="mx-auto mt-6 px-6 py-3 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary)]/80 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!currentQuestion) {
    return (
      <MainLayout backgroundVariant="gradient">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto px-4">
            <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Conectado al evento
            </h2>
            <p className="text-[var(--text-secondary)]">
              Esperando que el administrador inicie el quiz...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout backgroundVariant="gradient">
      <div className="min-h-screen flex flex-col justify-center px-3 sm:px-4 py-4 sm:py-6">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              {questionnaire.title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {questionnaire.description}
            </p>
          </motion.div>

          <QuestionCard
            question={currentQuestion.text}
            questionNumber={currentQuestion.position}
            totalQuestions={currentQuestion.total}
          />          <AnswerButtons
            onAnswer={handleAnswer}
            isVisible={!showFeedback && !isWaitingForResponse && !hasAnsweredCurrentQuestion}
            isWaiting={isWaitingForResponse}
            disabled={showFeedback || isWaitingForResponse || hasAnsweredCurrentQuestion}
          />

          {hasAnsweredCurrentQuestion && !showFeedback && !isWaitingForResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex justify-center"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30">
                <CheckCircle className="w-5 h-5 text-[var(--accent-primary)]" />
                <p className="text-sm text-[var(--text-primary)] font-medium">
                  Respuesta enviada - Esperando siguiente pregunta
                </p>
              </div>
            </motion.div>
          )}

          {showFeedback && answerAck && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="w-full flex justify-center"
            >
              <div className={`
                inline-flex items-center space-x-3 px-6 py-4 rounded-2xl backdrop-blur-md border
                ${answerAck.is_correct
                  ? 'bg-green-500/10 border-green-500/30 text-green-700'
                  : 'bg-red-500/10 border-red-500/30 text-red-700'
                }
              `}>
                {answerAck.is_correct ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <p className="font-semibold">
                    {answerAck.is_correct ? '¡Correcto!' : '¡Incorrecto!'}
                  </p>
                  <p className="text-sm opacity-80">
                    Tu puntuación actual: {answerAck.score}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          {results.length > 0 && (
            <LiveRankingWidget
              participants={results}
              currentParticipantId={participantId}
              maxToShow={5}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}