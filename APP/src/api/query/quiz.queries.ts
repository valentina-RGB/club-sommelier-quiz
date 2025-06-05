import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QuizSession, QuizStatus, Questionnaire, QuizSubmission, QuizResult } from '../types/quiz.types';
import AuthClient from '@/api/client/axios';

const apiClient = new AuthClient();

export function useQuestionnaire(questionnaireId: number) {
  return useQuery({
    queryKey: ['questionnaire', questionnaireId],
    queryFn: async (): Promise<Questionnaire> => {
      const response = await apiClient.get<Questionnaire>(`/questionnaires/${questionnaireId}`);
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!questionnaireId,
    retry: 1,
  });
}

export function useQuizStatus(sessionId?: string) {
  return useQuery({
    queryKey: ['quiz-status', sessionId],
    queryFn: async (): Promise<QuizStatus> => {
      const response = await apiClient.get<QuizStatus>(`/quiz/status/${sessionId}`);
      return response;
    },
    enabled: !!sessionId,
    refetchInterval: 3000,
    retry: false,
  });
}

export function useQuizSession(sessionId?: string) {
  return useQuery({
    queryKey: ['quiz-session', sessionId],
    queryFn: async (): Promise<QuizSession> => {
      const response = await apiClient.get<QuizSession>(`/quiz/session/${sessionId}`);
      return response;
    },
    enabled: !!sessionId,
    retry: false,
  });
}

export function useStartQuizTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiClient.post(`/quiz/start-test/${sessionId}`, {
        adminAction: true,
        startedAt: new Date()
      });
      return response;
    },
    onSuccess: (data) => {

      queryClient.setQueryData(['quiz-status', 'session-1'], (old: QuizStatus | undefined) => ({
        ...old,
        sessionId: 'session-1',
        isActive: true,
        currentQuestion: 1,
        totalQuestions: 10,
        timeRemaining: 300
      }));

      queryClient.invalidateQueries({ queryKey: ['quiz-status'] });
    },
    onError: (error) => {
      console.error('💥 Error al iniciar quiz de prueba:', error);
    }
  });
}

export function useSubmitQuizAnswers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submission: Omit<QuizSubmission, 'completedAt'>) => {
      const submissionData = {
        ...submission,
        completedAt: new Date()
      };

      const response = await apiClient.post<QuizResult>('/quiz/submit', submissionData);
      return response;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-session'] });
      queryClient.invalidateQueries({ queryKey: ['quiz-status'] });
    },
    onError: (error) => {
      console.error('💥 Error al enviar respuestas:', error);
    }
  });
}
