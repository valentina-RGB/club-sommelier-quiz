import { participantSocket, adminSocket } from "@/api/client/socket";
import { useEffect, useState } from "react";


export interface Participant {
  fullName: string;
  id: number;
}

// Interface para los resultados
export interface ResultsType {
  participant: Participant;
  participant_id: number;
  total: number;
}


export function useEventSocketParticipant(
    accessCode?: string,
    participantId?: string | null
) {
    const [eventStarted, setEventStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [answerAck, setAnswerAck] = useState<{ is_correct: boolean; score: number } | null>(null);
    const [noMoreQuestions, setNoMore] = useState(false);
    const [eventEnded, setEventEnded] = useState(false);
    const [results, setResults] = useState<ResultsType[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!accessCode || !participantId) return;

        if (!participantSocket.connected) participantSocket.connect();
        participantSocket.emit("join_event", { accessCode, participantId });

        /* listeners ------------ */
        const onJoined = () => {
            setIsConnected(true);
            // Solicitar la pregunta actual inmediatamente al unirse
            participantSocket.emit("request_current_question", { accessCode });
        };

        const onStarted = () => setEventStarted(true);

        const onShow = (q: any) => {
            console.log("📝 Recibida pregunta:", q);
            setCurrentQuestion(q);
            setAnswerAck(null);
        };

        const onNoMore = () => setNoMore(true);

        const onResults = (scores: any[]) => {
            console.log("🥇 Resultados:", scores);
            setResults(scores);
            setEventEnded(true);
        };

        const onEventEnded = () => {
            console.log("🏁 Evento finalizado");
            setEventEnded(true);
        };

        const onAck = (payload: any) => setAnswerAck(payload);

        participantSocket.on('joined_ok', onJoined);
        participantSocket.on('event_started', onStarted);
        participantSocket.on('show_question', onShow);
        participantSocket.on("no_more_questions", onNoMore);
        participantSocket.on("event_results", onResults);
        participantSocket.on("event_ended", onEventEnded);
        participantSocket.on('answer_ack', onAck);

        return () => {
            participantSocket.off('joined_ok', onJoined);
            participantSocket.off('event_started', onStarted);
            participantSocket.off('show_question', onShow);
            participantSocket.off('no_more_questions', onNoMore);
            participantSocket.off('event_results', onResults);
            participantSocket.off('event_ended', onEventEnded);
            participantSocket.off('answer_ack', onAck);
        };

    }, [accessCode, participantId]);

    /* -------- API que exponemos -------- */
    const submitAnswer = (questionId: number, answer: boolean) => {
        participantSocket.emit('submit_answer', { questionId, answer });
    };

    const requestCurrentQuestion = () => {
        if (isConnected && accessCode) {
            participantSocket.emit("request_current_question", { accessCode });
        }
    };

    return {
        socket: participantSocket,
        eventStarted,
        currentQuestion,
        answerAck,
        noMoreQuestions,
        eventEnded,
        results,
        isConnected,
        submitAnswer,
        requestCurrentQuestion
    };
}

export function useEventSocketAdmin(accessCode: string) {
    const [eventStarted, setEventStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [noMoreQuestions, setNoMoreQuestions] = useState(false);
    const [eventEnded, setEventEnded] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!accessCode) return;

        if (!adminSocket.connected) adminSocket.connect();

        adminSocket.on('connect', () => {
            console.log('🔗 Admin socket conectado:', adminSocket.id);
            setIsConnected(true);
            adminSocket.emit('admin:join', { accessCode });
        });

        adminSocket.on('disconnect', () => {
            console.log('❌ Admin socket desconectado');
            setIsConnected(false);
        });

        adminSocket.on('connect_error', (error) => {
            console.error('❌ Error conexión admin:', error);
            setIsConnected(false);
        });

        adminSocket.on('admin:joined_ok', () => {
            console.log('✅ Admin join confirmado');
        });

        adminSocket.on('event_started', () => {
            console.log('✅ Event started');
            setEventStarted(true);
        });

        adminSocket.on('show_question', (question) => {
            console.log('✅ Show question:', question);
            setCurrentQuestion(question);
        });

        adminSocket.on('no_more_questions', () => {
            console.log('✅ No more questions');
            setNoMoreQuestions(true);
        });

        adminSocket.on('event_results', (results) => {
            console.log('✅ Event results:', results);
        });

        adminSocket.on('event_ended', () => {
            console.log('✅ Event ended');
            setEventEnded(true);
        });

        if (adminSocket.connected) {
            setIsConnected(true);
            adminSocket.emit('admin:join', { accessCode });
        }

        return () => {
            adminSocket.off('connect');
            adminSocket.off('disconnect');
            adminSocket.off('connect_error');
            adminSocket.off('admin:joined_ok');
            adminSocket.off('event_started');
            adminSocket.off('show_question');
            adminSocket.off('no_more_questions');
            adminSocket.off('event_results');
            adminSocket.off('event_ended');
            adminSocket.disconnect();
        };
    }, [accessCode]);


    const startEvent = () => {
        console.log('🚀 Starting event:', accessCode);
        if (adminSocket.connected) {
            adminSocket.emit('admin:start_event', { accessCode });

        } else {
            console.warn('⚠️ Admin socket no conectado');
        }
    };

    const nextQuestion = () => {
        if (adminSocket.connected) {
            adminSocket.emit('admin:next_question', { accessCode });
        }
    };

    const endEvent = () => {
        if (adminSocket.connected) {
            adminSocket.emit('admin:end_event', { accessCode });
        }
    };

    return {
        socket: adminSocket,
        isConnected,
        eventStarted,
        currentQuestion,
        noMoreQuestions,
        eventEnded,
        startEvent,
        nextQuestion,
        endEvent
    };
}