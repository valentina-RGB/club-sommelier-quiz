export interface QuizSession {
  id: string;
  status: 'waiting' | 'active' | 'completed';
  adminId?: string;
  startedAt?: Date;
  participants: QuizParticipant[];
}

export interface QuizParticipant {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: Date;
  status: 'connected' | 'answering' | 'completed';
}

export interface QuizStatus {
  sessionId: string;
  isActive: boolean;
  currentQuestion?: number;
  totalQuestions?: number;
  timeRemaining?: number;
}

export interface QuestionnaireQuestion {
  id: number;
  question: string;
  response: boolean;
  position: number;
  levelName: string;
}

export interface Questionnaire {
  id: number;
  title: string;
  description: string;
  questions: QuestionnaireQuestion[];
}

export interface QuestionnaireResponse {
  questionnaire: Questionnaire;
}

export interface UserAnswer {
  questionId: number;
  answer: boolean;
  correct?: boolean;
}

export interface QuizSubmission {
  participantId: string;
  questionnaireId: number;
  answers: UserAnswer[];
  completedAt: Date;
}

export interface QuizResult {
  participantId: string;
  questionnaireId: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: UserAnswer[];
}

export interface JoinQuizResponse {
  participantId: string;
  sessionId: string;
  status: string;
}
