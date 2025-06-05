const { liveEvents } = require("./liveEvents");
const { Participant, Answer, Level } = require("../models");
const { sequelize } = require("../config/connection");
const EventService = require("../services/event.service");
const QuestionnairesService = require("../services/questionnaires.service");

const eventService = new EventService();
const questionnaireService = new QuestionnairesService();

function initializeWebSockets(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Conectado:", socket.id);

    /* ========== JOIN EVENT (Participants) ========== */
    socket.on("join_event", async ({ accessCode, participantId }) => {
      socket.join(accessCode);
      socket.data = { accessCode, participantId };
      console.log(`${socket.id} joined ${accessCode}`);
      socket.emit("joined_ok");
    });

    /* ========== JOIN EVENT (Admin) ========== */
    socket.on("admin:join", async ({ accessCode }) => {
      socket.join(accessCode);
      socket.data = { accessCode, role: "admin" };
      console.log(`👑 Admin ${socket.id} joined ${accessCode}`);
      socket.emit("admin:joined_ok");
    });

    /* ========== ADMIN: START EVENT ========== */
    socket.on("admin:start_event", async ({ accessCode }) => {
      const event = await eventService.getEventByCode(accessCode);

      console.log("acceso al evento:", event.questionnaire_id);
      // 1) obtener lista ordenada de preguntas
      const qn = await questionnaireService.findById(event.questionnaire_id);
      const questions = qn.questions
        .sort(
          (a, b) =>
            a.questionnaire_questions.position -
            b.questionnaire_questions.position
        )
        .map((q) => q);
      liveEvents.set(accessCode, {
        eventId: event.id,
        questions,
        currentIdx: -1,
        questionStart: null,
      });

      io.to(accessCode).emit("event_started");
    });

    /* ========== ADMIN: NEXT QUESTION ========== */
    socket.on("admin:next_question", ({ accessCode }) => {
      const live = liveEvents.get(accessCode);
      if (!live) return socket.emit("error", "No live session");

      live.currentIdx += 1;
      if (live.currentIdx >= live.questions.length) {
        io.to(accessCode).emit("no_more_questions");
        return;
      }

      live.questionStart = Date.now();
      const q = live.questions[live.currentIdx];

      io.to(accessCode).emit("show_question", {
        questionId: q.id,
        position: live.currentIdx + 1,
        total: live.questions.length,
        text: q.question,
      });
    });

    /* ========== PARTICIPANTE: SUBMIT ANSWER ========== */
    socket.on("submit_answer", async ({ questionId, answer }) => {
      try {
        const { accessCode, participantId } = socket.data;
        const live = liveEvents.get(accessCode);
        if (!live) return;

        const existingAnswer = await Answer.findOne({
          where: {
            event_id: live.eventId,
            question_id: questionId,
            participant_id: participantId,
          },
        });

        if (existingAnswer) {
          console.log(
            `Respuesta duplicada detectada: participante ${participantId}, pregunta ${questionId}`
          );
          return socket.emit("answer_ack", {
            is_correct: existingAnswer.is_correct,
            score: existingAnswer.points_awarded,
          });
        }

        const elapsedMs = Date.now() - live.questionStart;
        const question = live.questions[live.currentIdx];

        const is_correct = answer === question.response;
        const basePts = await Level.findByPk(question.level_id).then(
          (l) => l.points
        );
        const k = 1;
        const seconds = elapsedMs / 1000;
        const score = is_correct ? Math.max(basePts - k * seconds, 0) : 0;

        const roundedScore = Math.round(score * 10) / 10;

        await Answer.create({
          event_id: live.eventId,
          question_id: questionId,
          participant_id: participantId,
          response: answer,
          is_correct,
          response_time: seconds,
          points_awarded: roundedScore,
        });

        socket.emit("answer_ack", { is_correct, score });
      } catch (error) {
        console.error("Error al procesar respuesta:", error.name);

        if (error.name === "SequelizeUniqueConstraintError") {
          try {
            const { accessCode, participantId } = socket.data;
            const live = liveEvents.get(accessCode);

            if (live) {
              const existingAnswer = await Answer.findOne({
                where: {
                  event_id: live.eventId,
                  question_id: questionId,
                  participant_id: participantId,
                },
              });

              if (existingAnswer) {
                return socket.emit("answer_ack", {
                  is_correct: existingAnswer.is_correct,
                  score: existingAnswer.points_awarded,
                });
              }
            }
          } catch (secondaryError) {
            console.error(
              "Error secundario al recuperar respuesta existente:",
              secondaryError
            );
          }

          socket.emit("answer_ack", {
            is_correct: false,
            score: 0,
            duplicate: true,
          });
        } else {
          socket.emit("error", "Hubo un problema al procesar tu respuesta");
        }
      }
    });

    /* ========== ADMIN: END EVENT ========== */
    socket.on("admin:end_event", async ({ accessCode }) => {
      const live = liveEvents.get(accessCode);
      if (!live) return;

      // calcular ranking final
      const scores = await Answer.findAll({
        where: { event_id: live.eventId },
        include: [
          {
            model: Participant,
            attributes: ["id", "fullName"],
          },
        ],
        attributes: [
          "participant_id",
          [sequelize.fn("SUM", sequelize.col("points_awarded")), "total"],
        ],
        group: [
          "answers.participant_id",
          "participant.id",
          "participant.fullName",
        ],
        order: [[sequelize.literal("total"), "DESC"]],
      });

      io.to(accessCode).emit("event_results", scores);
      liveEvents.delete(accessCode);

      console.log(`Event ${accessCode} ended and results sent.`);
      console.log("Scores:", scores);
      socket.emit("event_ended");
    });

    socket.on("disconnect", () => {
      console.log("❌  Desconectado:", socket.id);
    });
    socket.on("request_current_question", ({ accessCode }) => {
      const live = liveEvents.get(accessCode);

      if (
        live &&
        live.currentIdx >= 0 &&
        live.currentIdx < live.questions.length
      ) {
        const q = live.questions[live.currentIdx];
        socket.emit("show_question", {
          questionId: q.id,
          position: live.currentIdx + 1,
          total: live.questions.length,
          text: q.question,
        });
      }
    });

    /* ========== PARTICIPANTE: REQUEST ALL PREVIOUS QUESTIONS ========== */
    socket.on("request_previous_questions", ({ accessCode }) => {
      const live = liveEvents.get(accessCode);
      if (!live) return;

      // Solo enviar si el evento ya ha comenzado y hay al menos una pregunta
      if (live.currentIdx >= 0) {
        // Crear un array con todas las preguntas mostradas hasta ahora
        const previousQuestions = [];

        for (let i = 0; i <= live.currentIdx; i++) {
          const q = live.questions[i];
          previousQuestions.push({
            questionId: q.id,
            position: i + 1,
            total: live.questions.length,
            text: q.question,
          });
        }

        socket.emit("previous_questions", {
          questions: previousQuestions,
          currentIndex: live.currentIdx,
        });
      }
    });
  });
}

module.exports = { initializeWebSockets };
